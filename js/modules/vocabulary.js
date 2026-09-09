// ==========================================================================
// 🪐 VOCABULARY ENGINE v46.0 (INTEGRADO AL HOME Y MODO OSCURO)
// ==========================================================================
import { VOCABULARY_DATABASE } from './database.js';
import { VOCABULARY_TEMPLATES } from '../templates/templatesCataloge.js';
import { MissionsEngine } from './missionsEngine.js';
import { ProgressManager } from './progressManager.js';

// Configuración Global de Voz Nativa (Normal y Lenta)
if (!window.speakStrict) {
    let englishVoices = [];
    const loadSystemVoices = () => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        englishVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
    };
    if (window.speechSynthesis) {
        loadSystemVoices();
        window.speechSynthesis.onvoiceschanged = loadSystemVoices;
    }
    window.speakStrict = function(text, rate = 0.8) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = rate;
        window.speechSynthesis.speak(utterance);
    };
}

export const VocabularyEngine = {
    allWords: [],
    currentBlockWords: [],
    exerciseQueue: [],
    currentQueueIndex: 0,
    lessonTotalWords: 0,
    knownWordsInBlock: new Set(),
    currentCategory: 'EXPRESSIONS',
    selectedLevel: 'A1',
    currentBubbleType: 1,
    currentSubLesson: 1,
    
    // Desempeño
    selectedAnswerIndex: null,
    typedAnswerValue: '',
    totalErrorsInLesson: 0,
    totalInitialExercises: 0,

    showToast(message, type = 'success') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        }
    },

    loadGymCategories(levelFilter = null) {
        this.selectedLevel = levelFilter || window.AppState?.activeLevel || 'A1';
        const grid = document.getElementById('categories-grid');

        const filteredWords = VOCABULARY_DATABASE.filter(w => w.level === this.selectedLevel);
        this.allWords = filteredWords.map(w => ({
            ...w,
            english_word: w.word,
            category_group: w.category,
            image_url: w.media_url,
            hasImage: w.hasImage !== undefined ? w.hasImage : true
        }));

        if (!grid) return;

        const uniqueCategories = [...new Set(this.allWords.map(w => w.category_group))];
        grid.className = "w-full grid grid-cols-1 md:grid-cols-2 gap-3 py-2 flex-grow overflow-y-auto custom-scrollbar";

        grid.innerHTML = `
            <div class="col-span-full flex justify-between items-center subcard-bg p-2.5 rounded-2xl border border-main mb-1">
                <span class="text-[10px] font-mono font-bold text-muted uppercase tracking-wider">// NIVEL ACTIVADO:</span>
                <div class="flex gap-1">
                    ${['A1', 'A2', 'B1', 'B2'].map(lvl => `
                        <button onclick="window.VocabularyEngine.loadGymCategories('${lvl}')" 
                                class="px-3 py-1 rounded-xl text-xs font-mono font-black transition-all cursor-pointer ${this.selectedLevel === lvl ? 'bg-[#2b3a35] text-white shadow-xs' : 'text-muted hover:text-main'}">
                            ${lvl}
                        </button>
                    `).join('')}
                </div>
            </div>
            ${uniqueCategories.map((cat, idx) => `
                <div onclick="window.VocabularyEngine.selectCategoryForHome('${cat}')" 
                     class="card-bg card-hover border border-main hover:border-[#d97757] p-4 rounded-2xl shadow-2xs cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[110px] group select-none">
                    <div>
                        <span class="text-[8px] font-mono tracking-widest text-muted block font-bold uppercase">// GRUPO 0${idx + 1}</span>
                        <h4 class="title-brand font-black text-sm uppercase tracking-tight mt-1 text-main">
                            ${cat.replace(/_/g, ' ').toUpperCase()}
                        </h4>
                    </div>
                    <div class="w-full flex justify-between items-center border-t border-main pt-3 mt-3 text-[8px] font-mono font-bold text-muted">
                        <span>${this.allWords.filter(w => w.category_group === cat).length} PALABRAS</span>
                        <span class="text-[#d97757] group-hover:translate-x-0.5 transition-transform">ACTIVAR EN HOME ➔</span>
                    </div>
                </div>
            `).join('')}
        `;
    },

    selectCategoryForHome(categoryName) {
        this.currentCategory = categoryName;
        if (window.AppState) window.AppState.activeCategory = categoryName;
        
        if (typeof window.closeVocabularyManager === 'function') {
            window.closeVocabularyManager();
        }
        if (typeof window.renderHomeLessonsModule === 'function') {
            window.renderHomeLessonsModule();
        }
        this.showToast(`Unidad "${categoryName.replace(/_/g, ' ').toUpperCase()}" cargada en la pantalla principal.`, 'info');
    },

    startLessonBlock(categoryName, bubbleNum) {
        this.currentCategory = categoryName || this.currentCategory;
        const filtered = this.allWords.filter(w => w.category_group === this.currentCategory);
        
        const blockIndex = Math.floor((bubbleNum - 1) / 3);
        const startIndex = blockIndex * 5;
        this.currentBlockWords = filtered.length > 0 ? filtered.slice(startIndex, startIndex + 5) : VOCABULARY_DATABASE.slice(0, 5);
        
        this.currentBubbleType = bubbleNum;
        this.currentSubLesson = ((bubbleNum - 1) % 3) + 1;

        const deck = document.getElementById('lesson-interactive-deck');
        if (deck) deck.classList.remove('hidden');

        this.totalErrorsInLesson = 0;
        this.buildExerciseQueue();
        this.loopEngine();
    },

    buildExerciseQueue() {
        let targetWords = [];

        if (this.currentSubLesson === 3) {
            targetWords = [...this.currentBlockWords];
        } else {
            targetWords = this.currentBlockWords.filter(w => !this.knownWordsInBlock.has(w.word || w.english_word));
        }

        if (targetWords.length === 0) {
            targetWords = [...this.currentBlockWords];
        }

        let goalDistribution = [];
        if (this.currentSubLesson === 3) {
            goalDistribution = ['Associate', 'Produce', 'Produce', 'Produce', 'Produce'];
        } else if (this.currentSubLesson === 1) {
            goalDistribution = ['Recognize', 'Recognize', 'Recognize', 'Recall', 'Recall'];
        } else if (this.currentSubLesson === 2) {
            goalDistribution = ['Recognize', 'Recall', 'Recall', 'Associate', 'Associate'];
        }

        const totalItemsNeeded = 10;
        this.exerciseQueue = [];

        for (let i = 0; i < totalItemsNeeded; i++) {
            const word = targetWords[i % targetWords.length];
            const targetGoal = goalDistribution[i % goalDistribution.length];

            const matchingTemplates = Object.keys(VOCABULARY_TEMPLATES).filter(key => {
                const tmpl = VOCABULARY_TEMPLATES[key];
                if (word.hasImage === false && (tmpl.type === 'image' || tmpl.type === 'match_image')) {
                    return false;
                }
                return tmpl.goal === targetGoal;
            });

            const chosenTemplateKey = matchingTemplates[Math.floor(Math.random() * matchingTemplates.length)] || 'ChooseWord';
            const distractors = VOCABULARY_DATABASE.filter(w => w.id !== word.id).sort(() => 0.5 - Math.random()).slice(0, 3);
            const options = [word, ...distractors].sort(() => 0.5 - Math.random());

            this.exerciseQueue.push({
                word,
                templateKey: chosenTemplateKey,
                goal: targetGoal,
                prompt_text: word.english_word || word.word,
                spanish_translation: word.spanish,
                media_url: word.hasImage !== false ? word.media_url : null,
                options,
                correct_index: options.findIndex(o => o.id === word.id)
            });
        }

        this.currentQueueIndex = 0;
        this.lessonTotalWords = this.exerciseQueue.length;
        this.totalInitialExercises = this.exerciseQueue.length;
    },

    loopEngine() {
        if (this.currentQueueIndex >= this.exerciseQueue.length) {
            this.renderLessonReport();
            return;
        }

        this.selectedAnswerIndex = null;
        this.typedAnswerValue = '';

        const ex = this.exerciseQueue[this.currentQueueIndex];
        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        let exerciseInteractiveBody = '';

        if (ex.goal === 'Produce' || ex.templateKey === 'WriteWord' || ex.templateKey === 'Dictation') {
            exerciseInteractiveBody = `
                <div class="flex flex-col gap-2 mt-2">
                    <input type="text" id="type-answer-input" autocomplete="off" placeholder="Escribe en inglés..." 
                           oninput="window.VocabularyEngine.handleTextInput(this.value)"
                           class="w-full subcard-bg border border-main rounded-xl p-3.5 text-center font-mono text-xs sm:text-sm font-bold text-main focus:outline-none focus:border-[#d97757]">
                </div>
            `;
        } else {
            exerciseInteractiveBody = `
                <div class="grid grid-cols-2 gap-2 sm:gap-3 mt-2">
                    ${ex.options.map((opt, idx) => `
                        <button id="opt-btn-${idx}" onclick="window.VocabularyEngine.selectOption(${idx})" 
                                class="subcard-bg hover:bg-white dark:hover:bg-[#2b3a35] border border-main p-3 sm:p-3.5 rounded-xl font-mono text-[11px] sm:text-xs font-bold text-main cursor-pointer transition-all truncate">
                            ${opt.spanish}
                        </button>
                    `).join('')}
                </div>
            `;
        }

        deck.innerHTML = `
            <!-- Cabecera -->
            <div class="w-full flex justify-between items-center border-b border-main pb-3 z-10 shrink-0">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-black uppercase text-[#2b3a35] dark:text-white">
                        L${this.currentSubLesson} // ${this.currentQueueIndex + 1}/${this.lessonTotalWords}
                    </span>
                    <span class="text-[9px] font-mono subcard-bg px-2 py-0.5 rounded-full font-bold text-muted border border-main">
                        ${ex.goal}
                    </span>
                </div>
                <button onclick="window.VocabularyEngine.exitLessonToHome()" class="bg-[#2b3a35] hover:bg-[#1c2321] text-white font-mono text-[9px] px-3 py-1.5 rounded-lg uppercase font-black cursor-pointer flex items-center gap-1">
                    <span>SALIR</span> <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <!-- Tarjeta Central -->
            <div class="flex-grow flex flex-col justify-center w-full max-w-xl mx-auto my-auto p-2 sm:p-4 text-center overflow-y-auto custom-scrollbar">
                <div id="exercise-card-container" class="card-bg p-4 sm:p-6 rounded-3xl border border-main shadow-xs flex flex-col gap-3 relative my-auto transition-all">
                    
                    <button onclick="window.VocabularyEngine.markAsKnown('${ex.prompt_text}')" 
                            class="absolute top-3 right-3 subcard-bg text-[#3a7d6e] border border-main text-[9px] font-mono font-bold px-2.5 py-1 rounded-xl cursor-pointer transition-all">
                        ✓ Ya me la sé
                    </button>

                    ${ex.media_url ? `<img src="${ex.media_url}" class="w-16 h-16 sm:w-20 sm:h-20 mx-auto object-contain my-1" onerror="this.remove()">` : ''}

                    <div class="flex items-center justify-center gap-2">
                        <button type="button" onclick="window.speakStrict('${ex.prompt_text}', 0.8)" class="w-10 h-10 sm:w-11 sm:h-11 bg-[#2b3a35] text-white rounded-full flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all">
                            <i class="fa-solid fa-volume-high text-xs sm:text-base"></i>
                        </button>
                        <button type="button" onclick="window.speakStrict('${ex.prompt_text}', 0.45)" class="w-8 h-8 sm:w-9 sm:h-9 subcard-bg text-main border border-main rounded-full flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all" title="Escuchar lento">
                            <span class="text-xs sm:text-sm">🐢</span>
                        </button>
                    </div>
                    
                    <div class="leading-tight">
                        <h3 id="typing-prompt-title" class="title-brand text-lg sm:text-xl font-black text-main uppercase tracking-wide min-h-[30px]"></h3>
                        
                        <div id="spanish-translation-container" class="mt-1">
                            <button onclick="window.VocabularyEngine.revealSpanishTranslation()" 
                                    class="text-[9px] font-mono text-muted hover:text-[#d97757] border border-dashed border-main px-2 py-0.5 rounded-lg cursor-pointer">
                                👁️ Spanish
                            </button>
                            <p id="spanish-translation-text" class="text-xs text-muted font-medium italic hidden">${ex.spanish_translation}</p>
                        </div>
                    </div>

                    ${exerciseInteractiveBody}

                    <button id="check-answer-btn" disabled onclick="window.VocabularyEngine.executeCheckAnswer()" 
                            class="w-full mt-2 subcard-bg text-muted font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider transition-all cursor-not-allowed">
                        Comprobar Respuesta ➔
                    </button>
                </div>
            </div>

            <!-- Barra de Progreso Inferior -->
            <div class="w-full bg-[#e8e4d9] dark:bg-[#2b3a35] h-2 rounded-full overflow-hidden max-w-xl mx-auto shrink-0 mt-1">
                <div class="bg-[#d97757] h-full transition-all duration-300" style="width: ${((this.currentQueueIndex + 1) / this.lessonTotalWords) * 100}%"></div>
            </div>
        `;

        this.startPausableTypingAnimation(ex.prompt_text, () => {
            window.speakStrict(ex.prompt_text, 0.8);
        });
    },

    startPausableTypingAnimation(text, onComplete) {
        const titleEl = document.getElementById('typing-prompt-title');
        if (!titleEl) return;
        titleEl.innerText = '';
        let i = 0;
        const speed = 75;

        const timer = setInterval(() => {
            if (i < text.length) {
                titleEl.innerText += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                if (typeof onComplete === 'function') onComplete();
            }
        }, speed);
    },

    revealSpanishTranslation() {
        const text = document.getElementById('spanish-translation-text');
        const container = document.getElementById('spanish-translation-container');
        if (text && container) {
            text.classList.remove('hidden');
            const btn = container.querySelector('button');
            if (btn) btn.classList.add('hidden');
        }
    },

    selectOption(index) {
        const ex = this.exerciseQueue[this.currentQueueIndex];
        ex.options.forEach((_, idx) => {
            const btn = document.getElementById(`opt-btn-${idx}`);
            if (btn) btn.className = "subcard-bg hover:bg-white dark:hover:bg-[#2b3a35] border border-main p-3 sm:p-3.5 rounded-xl font-mono text-[11px] sm:text-xs font-bold text-main cursor-pointer transition-all truncate";
        });

        const selectedBtn = document.getElementById(`opt-btn-${index}`);
        if (selectedBtn) {
            selectedBtn.className = "bg-[#f0f7f4] dark:bg-[#2b3a35] border-2 border-[#3a7d6e] p-3 sm:p-3.5 rounded-xl font-mono text-[11px] sm:text-xs font-bold text-main cursor-pointer transition-all truncate shadow-xs";
        }

        this.selectedAnswerIndex = index;
        this.activateCheckButton();
    },

    handleTextInput(value) {
        this.typedAnswerValue = value.trim();
        if (this.typedAnswerValue.length > 0) {
            this.activateCheckButton();
        } else {
            this.deactivateCheckButton();
        }
    },

    activateCheckButton() {
        const btn = document.getElementById('check-answer-btn');
        if (btn) {
            btn.disabled = false;
            btn.className = "w-full mt-2 bg-[#d97757] hover:bg-[#c26548] text-white font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-98";
        }
    },

    deactivateCheckButton() {
        const btn = document.getElementById('check-answer-btn');
        if (btn) {
            btn.disabled = true;
            btn.className = "w-full mt-2 subcard-bg text-muted font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider transition-all cursor-not-allowed";
        }
    },

    executeCheckAnswer() {
        const ex = this.exerciseQueue[this.currentQueueIndex];
        let isCorrect = false;

        if (ex.goal === 'Produce' || ex.templateKey === 'WriteWord' || ex.templateKey === 'Dictation') {
            isCorrect = this.typedAnswerValue.toLowerCase() === ex.prompt_text.toLowerCase();
        } else {
            isCorrect = this.selectedAnswerIndex === ex.correct_index;
        }

        const checkBtn = document.getElementById('check-answer-btn');
        const cardContainer = document.getElementById('exercise-card-container');

        if (isCorrect) {
            if (checkBtn) {
                checkBtn.className = "w-full mt-2 bg-[#3a7d6e] text-white font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider shadow-md";
                checkBtn.innerText = "¡CORRECTO! ✓";
            }
            window.speakStrict("Correct!", 0.9);
            this.registerWordLearned();

            setTimeout(() => {
                this.currentQueueIndex++;
                this.loopEngine();
            }, 750);
        } else {
            // Animación Shake al fallar
            if (cardContainer) {
                cardContainer.classList.add('animate-shake');
                setTimeout(() => cardContainer.classList.remove('animate-shake'), 400);
            }

            this.totalErrorsInLesson++;
            if (checkBtn) {
                checkBtn.className = "w-full mt-2 bg-rose-500 text-white font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider";
                checkBtn.innerText = "INCORRECTO - REINTENTANDO AL FINAL";
            }
            
            this.exerciseQueue.push({ ...ex });
            this.lessonTotalWords = this.exerciseQueue.length;

            setTimeout(() => {
                this.currentQueueIndex++;
                this.loopEngine();
            }, 1200);
        }
    },

    markAsKnown(wordText) {
        this.knownWordsInBlock.add(wordText);
        this.showToast(`Palabra "${wordText}" guardada. Reaparecerá en la Lección 3.`, 'info');
        this.registerWordLearned();
        this.currentQueueIndex++;
        this.loopEngine();
    },

    registerWordLearned() {
        ProgressManager.incrementWordsLearned();
        const total = ProgressManager.state.stats.wordsLearned;

        if (typeof window.updateStatsDisplay === 'function') {
            window.updateStatsDisplay();
        }

        if (total === 5 && MissionsEngine) {
            setTimeout(() => {
                MissionsEngine.renderLukesGoldCardModal();
            }, 600);
        }
    },

    exitLessonToHome() {
        const deck = document.getElementById('lesson-interactive-deck');
        if (deck) deck.classList.add('hidden');
        if (typeof window.renderHomeLessonsModule === 'function') {
            window.renderHomeLessonsModule();
        }
    },

    renderLessonReport() {
        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        const totalAttempts = this.totalInitialExercises + this.totalErrorsInLesson;
        const accuracyPercentage = Math.max(0, Math.min(100, ((this.totalInitialExercises) / totalAttempts) * 100));

        let pawsEarned = 0;
        if (accuracyPercentage >= 100) pawsEarned = 5;
        else if (accuracyPercentage >= 80) pawsEarned = 4;
        else if (accuracyPercentage >= 60) pawsEarned = 3;
        else if (accuracyPercentage >= 40) pawsEarned = 2;
        else if (accuracyPercentage >= 20) pawsEarned = 1;

        ProgressManager.addPaws(pawsEarned);
        ProgressManager.completeBubble(this.currentBubbleType);
        ProgressManager.syncToSupabase();

        deck.innerHTML = `
            <div class="flex-grow flex flex-col items-center justify-center p-4">
                <div class="card-bg p-6 rounded-3xl border border-main shadow-xl max-w-sm w-full text-center font-mono">
                    <span class="text-[8px] text-muted font-bold tracking-widest block uppercase mb-1">// RESULTADOS DE LECCIÓN //</span>
                    <h3 class="text-base font-black text-[#3a7d6e] mt-2">🏆 ¡LECCIÓN COMPLETADA!</h3>
                    
                    <div class="my-4 subcard-bg p-3 rounded-2xl border border-main">
                        <div class="text-[10px] font-bold text-muted">PRECISIÓN: ${accuracyPercentage.toFixed(1)}%</div>
                        <div class="text-xs font-black text-[#d97757] mt-1 flex items-center justify-center gap-1">
                            <span>+${pawsEarned}</span>
                            <span class="text-base">🐾</span>
                            <span>PATITAS DE GATO</span>
                        </div>
                    </div>

                    <p class="text-muted text-[10px]">Siguiente lección desbloqueada con éxito.</p>
                    <button onclick="window.VocabularyEngine.exitLessonToHome()" class="bg-[#2b3a35] text-white font-bold text-[10px] py-3.5 px-6 rounded-xl cursor-pointer uppercase mt-4 w-full shadow-md">
                        ↩️ REGRESAR AL INICIO
                    </button>
                </div>
            </div>
        `;
        
        if (window.confetti) window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
};

window.VocabularyEngine = VocabularyEngine;