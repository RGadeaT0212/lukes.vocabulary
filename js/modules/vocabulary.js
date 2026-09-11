// ==========================================================================
// 🪐 VOCABULARY ENGINE v52.0 (ROTACIÓN ESTRICTA, TTS ULTRA PAUSADO Y L1-L3)
// ==========================================================================
import { VOCABULARY_DATABASE } from './database.js';
import { VOCABULARY_TEMPLATES } from '..js/templates/templatesCataloge.js';
import { MissionsEngine } from './missionsEngine.js';
import { ProgressManager } from './progressManager.js';

export const BUBBLE_COLOR_PALETTE = [
    '#e06a4e', '#d4a373', '#2a5c82', '#6b4c82', '#2d7a60',
    '#c97b34', '#d94f4f', '#3b5998', '#4a5d3e', '#1f6f78'
];
 window.MissionsEngine = MissionsEngine;

export const VocabularyEngine = {
    allWords: [],
    currentBlockWords: [],
    exerciseQueue: [],
    currentQueueIndex: 0,
    lessonTotalWords: 0,
    knownWordsInBlock: new Set(),
    currentCategory: 'EXPRESSIONS',
    selectedLevel: '1',
    currentUnitNumber: 1,
    currentBlockNumber: 1,
    currentBubbleType: 1,
    currentSubLesson: 1,

    selectedAnswerIndex: null,
    typedAnswerValue: '',
    totalErrorsInLesson: 0,
    totalHitsInLesson: 0,
    totalInitialExercises: 0,

    showToast(message, type = 'success') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        }
    },

    getTTSRates() {
        return {
            normal: 0.65,
            slow: 0.35
        };
    },

    speakStrict(text, isSlow = false) {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        
        const rates = this.getTTSRates();
        utterance.rate = isSlow ? rates.slow : rates.normal;
        
        window.speechSynthesis.speak(utterance);
    },

    loadGymCategories(levelFilter = null) {
        this.selectedLevel = levelFilter || window.AppState?.activeLevel || '1';
        const filteredWords = VOCABULARY_DATABASE.filter(w => String(w.level || w.unit || 1) === String(this.selectedLevel));
        this.allWords = filteredWords.map(w => ({
            ...w,
            english_word: w.word,
            category_group: w.category,
            image_url: w.media_url,
            hasImage: w.hasImage !== undefined ? w.hasImage : true
        }));
    },

    startLessonBlock(categoryName, bubbleNum) {
        this.currentCategory = categoryName || this.currentCategory;
        const filtered = this.allWords.filter(w => w.category_group === this.currentCategory);
        
        this.currentBlockNumber = Math.floor((bubbleNum - 1) / 3) + 1;
        const startIndex = (this.currentBlockNumber - 1) * 5;
        this.currentBlockWords = filtered.length > 0 ? filtered.slice(startIndex, startIndex + 5) : VOCABULARY_DATABASE.slice(0, 5);
        
        this.currentBubbleType = bubbleNum;
        this.currentSubLesson = ((bubbleNum - 1) % 3) + 1;
        if (this.currentBlockWords.length > 0) {
            this.currentUnitNumber = this.currentBlockWords[0].unit || 1;
        }

        const deck = document.getElementById('lesson-interactive-deck');
        if (deck) deck.classList.remove('hidden');

        this.totalErrorsInLesson = 0;
        this.totalHitsInLesson = 0;
        this.buildExerciseQueue();
        this.loopEngine();
    },

    buildExerciseQueue() {
        let targetWords = [...this.currentBlockWords];
        this.exerciseQueue = [];

        if (this.currentSubLesson === 1) {
            targetWords.forEach(word => {
                this.exerciseQueue.push({
                    type: 'intro_card',
                    word,
                    prompt_text: word.english_word || word.word,
                    spanish_translation: word.spanish,
                    hasImage: word.hasImage !== false && !!word.media_url,
                    media_url: word.media_url
                });
            });
        }

        let goalSequence = [];
        if (this.currentSubLesson === 1) {
            goalSequence = ['Recognize', 'Recognize', 'Associate', 'Recognize', 'Associate', 'Recognize', 'Associate', 'Recognize', 'Associate', 'Recognize', 'Associate', 'Recognize', 'Associate', 'Recognize', 'Associate'];
        } else if (this.currentSubLesson === 2) {
            goalSequence = ['Recognize', 'Recall', 'Associate', 'Recall', 'Associate', 'Recall', 'Associate', 'Recall', 'Associate', 'Recall', 'Associate', 'Recall', 'Associate', 'Recall', 'Associate'];
        } else {
            goalSequence = ['Produce', 'Associate', 'Produce', 'Recall', 'Produce', 'Produce', 'Associate', 'Produce', 'Recall', 'Produce', 'Produce', 'Associate', 'Produce', 'Recall', 'Produce'];
        }

        let templateHistory = [];
        const totalPracticeItems = 15;

        for (let i = 0; i < totalPracticeItems; i++) {
            const word = targetWords[i % targetWords.length];
            const targetGoal = goalSequence[i];

            const availableTemplates = Object.keys(VOCABULARY_TEMPLATES).filter(key => {
                const tmpl = VOCABULARY_TEMPLATES[key];
                
                if (word.hasImage === false && (tmpl.type === 'image' || tmpl.type === 'match_image')) return false;
                
                const historyLength = templateHistory.length;
                if (historyLength >= 2 && templateHistory[historyLength - 1] === key && templateHistory[historyLength - 2] === key) {
                    return false;
                }
                
                if (this.currentSubLesson < 3 && tmpl.goal === 'Produce') return false;
                
                return tmpl.goal === targetGoal;
            });

            const chosenTemplateKey = availableTemplates[Math.floor(Math.random() * availableTemplates.length)] 
                                    || (targetGoal === 'Produce' ? 'WriteWord' : 'ChooseWord');
            
            templateHistory.push(chosenTemplateKey);

            const distractors = VOCABULARY_DATABASE.filter(w => w.id !== word.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
            const options = [word, ...distractors].sort(() => 0.5 - Math.random());

            this.exerciseQueue.push({
                type: 'interactive_exercise',
                word,
                templateKey: chosenTemplateKey,
                goal: targetGoal,
                prompt_text: word.english_word || word.word,
                spanish_translation: word.spanish,
                hasImage: word.hasImage !== false && !!word.media_url,
                media_url: word.media_url,
                options,
                correct_index: options.findIndex(o => o.id === word.id)
            });
        }

        this.currentQueueIndex = 0;
        this.lessonTotalWords = this.exerciseQueue.length;
        this.totalInitialExercises = totalPracticeItems;
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

        if (ex.type === 'intro_card') {
            deck.innerHTML = `
                <div class="w-full flex justify-between items-center border-b border-main pb-3 z-10 shrink-0">
                    <span class="text-xs font-mono font-black uppercase text-[#23483f] dark:text-white">
                        INTRODUCCIÓN // ${this.currentQueueIndex + 1}/${this.lessonTotalWords}
                    </span>
                    <button onclick="window.VocabularyEngine.exitLessonToHome()" class="bg-[#23483f] text-white font-mono text-[9px] px-3 py-1.5 rounded-lg uppercase font-black cursor-pointer">
                        SALIR ✕
                    </button>
                </div>

                <div class="flex-grow flex flex-col justify-center w-full max-w-xl mx-auto my-auto p-4 text-center">
                    <div id="exercise-card-container" class="card-bg p-6 sm:p-8 rounded-3xl border border-main shadow-md flex flex-col gap-4 relative">
                        <button onclick="window.VocabularyEngine.markAsKnown('${ex.prompt_text}')" 
                                class="absolute top-3 right-3 subcard-bg text-[#23483f] dark:text-[#8b9690] border border-main text-[9px] font-mono font-bold px-2.5 py-1 rounded-xl cursor-pointer">
                            ⚡ Ya me la sé
                        </button>

                        ${ex.hasImage ? `
                            <img src="${ex.media_url}" class="w-28 h-28 sm:w-32 sm:h-32 mx-auto object-contain my-2" onerror="this.remove()">
                        ` : ''}

                        <div class="flex flex-col items-center gap-1">
                            <h2 class="title-brand text-2xl sm:text-3xl font-black text-main uppercase">${ex.prompt_text}</h2>
                            <p class="text-base font-bold text-muted italic">"${ex.spanish_translation}"</p>
                        </div>

                        <div class="flex items-center justify-center gap-3 my-2">
                            <button type="button" onclick="window.VocabularyEngine.speakStrict('${ex.prompt_text}', false)" 
                                    class="flex items-center gap-2 px-4 py-2.5 bg-[#23483f] text-white rounded-xl text-xs font-mono font-bold uppercase cursor-pointer active:scale-95 transition-all shadow-xs">
                                <i class="fa-solid fa-volume-high text-sm"></i>
                                <span>Normal</span>
                            </button>
                            <button type="button" onclick="window.VocabularyEngine.speakStrict('${ex.prompt_text}', true)" 
                                    class="flex items-center gap-2 px-4 py-2.5 subcard-bg text-main border border-main rounded-xl text-xs font-mono font-bold uppercase cursor-pointer active:scale-95 transition-all">
                                <span class="text-sm">🐢</span>
                                <span>Lento</span>
                            </button>
                        </div>

                        <button onclick="window.VocabularyEngine.advanceIntroCard()" 
                                class="w-full mt-2 bg-[#23483f] hover:bg-[#19322b] text-white font-mono text-xs font-black py-3.5 rounded-xl uppercase tracking-widest cursor-pointer shadow-md">
                            Entendido, Continuar ➔
                        </button>
                    </div>
                </div>

                <div class="w-full bg-[#f1ede4] dark:bg-[#222d29] h-2 rounded-full overflow-hidden max-w-xl mx-auto shrink-0 mt-1">
                    <div class="bg-[#e06a4e] h-full transition-all duration-300" style="width: ${((this.currentQueueIndex + 1) / this.lessonTotalWords) * 100}%"></div>
                </div>
            `;

            this.speakStrict(ex.prompt_text, false);
            return;
        }

        const isWriteMode = this.currentSubLesson === 3 && (ex.goal === 'Produce' || ex.templateKey === 'WriteWord' || ex.templateKey === 'Dictation');

        let exerciseInteractiveBody = '';

        if (isWriteMode) {
            exerciseInteractiveBody = `
                <div class="flex flex-col gap-2 mt-2">
                    <input type="text" id="type-answer-input" autocomplete="off" placeholder="Escribe en inglés..." 
                           oninput="window.VocabularyEngine.handleTextInput(this.value)"
                           class="w-full subcard-bg border border-main rounded-xl p-3.5 text-center font-mono text-xs sm:text-sm font-bold text-main focus:outline-none focus:border-[#e06a4e]">
                </div>
            `;
        } else {
            exerciseInteractiveBody = `
                <div class="grid grid-cols-2 gap-2 sm:gap-3 mt-2">
                    ${ex.options.map((opt, idx) => `
                        <button id="opt-btn-${idx}" onclick="window.VocabularyEngine.selectOptionWithTTS(${idx}, '${opt.word || opt.english_word}')" 
                                class="option-btn-default p-3 sm:p-3.5 rounded-xl font-mono text-xs font-bold cursor-pointer truncate">
                            ${opt.word || opt.english_word}
                        </button>
                    `).join('')}
                </div>
            `;
        }

        deck.innerHTML = `
            <div class="w-full flex justify-between items-center border-b border-main pb-3 z-10 shrink-0">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-black uppercase text-[#23483f] dark:text-white">
                        L${this.currentSubLesson} // ${this.currentQueueIndex + 1}/${this.lessonTotalWords}
                    </span>
                    <span class="text-[9px] font-mono subcard-bg px-2 py-0.5 rounded-full font-bold text-muted border border-main">
                        ${ex.templateKey}
                    </span>
                </div>
                <button onclick="window.VocabularyEngine.exitLessonToHome()" class="bg-[#23483f] text-white font-mono text-[9px] px-3 py-1.5 rounded-lg uppercase font-black cursor-pointer">
                    SALIR ✕
                </button>
            </div>

            <div class="flex-grow flex flex-col justify-center w-full max-w-xl mx-auto my-auto p-2 sm:p-4 text-center overflow-y-auto custom-scrollbar">
                <div id="exercise-card-container" class="card-bg p-4 sm:p-6 rounded-3xl border border-main shadow-xs flex flex-col gap-3 relative">
                    
                    <button onclick="window.VocabularyEngine.markAsKnown('${ex.prompt_text}')" 
                            class="absolute top-3 right-3 subcard-bg text-[#23483f] dark:text-[#8b9690] border border-main text-[9px] font-mono font-bold px-2.5 py-1 rounded-xl cursor-pointer">
                        ⚡ Ya me la sé
                    </button>

                    ${ex.hasImage ? `
                        <img src="${ex.media_url}" class="w-20 h-20 sm:w-24 sm:h-24 mx-auto object-contain my-1" onerror="this.remove()">
                    ` : ''}

                    <div class="flex items-center justify-center gap-2">
                        <button type="button" onclick="window.VocabularyEngine.speakStrict('${ex.prompt_text}', false)" class="w-10 h-10 bg-[#23483f] text-white rounded-full flex items-center justify-center cursor-pointer active:scale-95">
                            <i class="fa-solid fa-volume-high text-xs"></i>
                        </button>
                        <button type="button" onclick="window.VocabularyEngine.speakStrict('${ex.prompt_text}', true)" class="w-8 h-8 subcard-bg text-main border border-main rounded-full flex items-center justify-center cursor-pointer active:scale-95">
                            <span class="text-xs">🐢</span>
                        </button>
                    </div>

                    <div id="spanish-translation-container" class="mt-1">
                        <button onclick="window.VocabularyEngine.revealSpanishTranslation()" 
                                class="text-[9px] font-mono text-muted hover:text-[#e06a4e] border border-dashed border-main px-2 py-0.5 rounded-lg cursor-pointer">
                            👁️ Ver Significado
                        </button>
                        <p id="spanish-translation-text" class="text-xs text-muted font-medium italic hidden">${ex.spanish_translation}</p>
                    </div>

                    ${exerciseInteractiveBody}

                    <button id="check-answer-btn" disabled onclick="window.VocabularyEngine.executeCheckAnswer()" 
                            class="w-full mt-2 subcard-bg text-muted font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider transition-all cursor-not-allowed">
                        Comprobar Respuesta ➔
                    </button>
                </div>
            </div>

            <div class="w-full bg-[#f1ede4] dark:bg-[#222d29] h-2 rounded-full overflow-hidden max-w-xl mx-auto shrink-0 mt-1">
                <div class="bg-[#e06a4e] h-full transition-all duration-300" style="width: ${((this.currentQueueIndex + 1) / this.lessonTotalWords) * 100}%"></div>
            </div>
        `;

        this.speakStrict(ex.prompt_text, false);
    },

    advanceIntroCard() {
        this.currentQueueIndex++;
        this.loopEngine();
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

    selectOptionWithTTS(index, wordText) {
        const ex = this.exerciseQueue[this.currentQueueIndex];
        ex.options.forEach((_, idx) => {
            const btn = document.getElementById(`opt-btn-${idx}`);
            if (btn) btn.className = "option-btn-default p-3 sm:p-3.5 rounded-xl font-mono text-xs font-bold cursor-pointer truncate";
        });

        const selectedBtn = document.getElementById(`opt-btn-${index}`);
        if (selectedBtn) {
            selectedBtn.className = "option-btn-selected p-3 sm:p-3.5 rounded-xl font-mono text-xs font-bold cursor-pointer truncate";
        }

        this.speakStrict(wordText, false);
        this.selectedAnswerIndex = index;
        this.activateCheckButton();
    },

    handleTextInput(value) {
        this.typedAnswerValue = ProgressManager.sanitizeTypingText(value);
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
            btn.className = "w-full mt-2 bg-[#e06a4e] hover:bg-[#c8573b] text-white font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-98";
        }
    },

    deactivateCheckButton() {
        const btn = document.getElementById('check-answer-btn');
        if (btn) {
            btn.disabled = true;
            btn.className = "w-full mt-2 subcard-bg text-muted font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider cursor-not-allowed";
        }
    },

    executeCheckAnswer() {
        const ex = this.exerciseQueue[this.currentQueueIndex];
        let isCorrect = false;

        const isWriteMode = this.currentSubLesson === 3 && (ex.goal === 'Produce' || ex.templateKey === 'WriteWord' || ex.templateKey === 'Dictation');

        if (isWriteMode) {
            const targetClean = ex.prompt_text.toLowerCase().trim();
            const typedClean = this.typedAnswerValue.toLowerCase().trim();
            isCorrect = typedClean === targetClean;
        } else {
            isCorrect = this.selectedAnswerIndex === ex.correct_index;
        }

        const checkBtn = document.getElementById('check-answer-btn');
        const cardContainer = document.getElementById('exercise-card-container');

        if (isCorrect) {
            this.totalHitsInLesson++;
            if (cardContainer) {
                cardContainer.classList.add('animate-correct');
            }
            if (checkBtn) {
                checkBtn.className = "w-full mt-2 bg-[#23483f] text-white font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider shadow-md";
                checkBtn.innerText = "¡CORRECTO! ✓";
            }

            setTimeout(() => {
                this.currentQueueIndex++;
                this.loopEngine();
            }, 650);
        } else {
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
            }, 1100);
        }
    },

    markAsKnown(wordText) {
        this.knownWordsInBlock.add(wordText);
        this.totalHitsInLesson++;
        this.currentQueueIndex++;
        this.loopEngine();
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

        const totalAttempts = this.totalHitsInLesson + this.totalErrorsInLesson;
        const accuracyPercentage = totalAttempts > 0 ? Math.round((this.totalHitsInLesson / totalAttempts) * 100) : 100;

        let pawsEarned = 0;
        if (accuracyPercentage >= 100) pawsEarned = 5;
        else if (accuracyPercentage >= 80) pawsEarned = 4;
        else if (accuracyPercentage >= 60) pawsEarned = 3;
        else if (accuracyPercentage >= 40) pawsEarned = 2;
        else if (accuracyPercentage >= 20) pawsEarned = 1;

        const levelTag = `L${this.currentSubLesson}`;
        const blockWordIds = this.currentBlockWords.map(w => w.id);

        ProgressManager.recordLessonCompletion(
            this.currentUnitNumber,
            this.currentBlockNumber,
            levelTag,
            this.totalHitsInLesson,
            totalAttempts,
            blockWordIds
        );

        ProgressManager.addPaws(pawsEarned);
        ProgressManager.completeBubble(this.currentBubbleType);

        deck.innerHTML = `
            <div class="flex-grow flex flex-col items-center justify-center p-4">
                <div class="card-bg p-7 rounded-3xl border border-main shadow-2xl max-w-sm w-full text-center font-mono">
                    <span class="text-[9px] text-muted font-bold tracking-widest block uppercase mb-1">// REPORTE DE LECCIÓN ${levelTag} //</span>
                    <h3 class="text-xl font-black text-[#23483f] dark:text-emerald-400 mt-1">🏆 ¡LECCIÓN FINALIZADA!</h3>
                    
                    <div class="my-5 subcard-bg p-4 rounded-2xl border border-main flex flex-col gap-3">
                        <div>
                            <span class="text-[9px] text-muted font-bold block uppercase">PORCENTAJE DE EXCELENCIA</span>
                            <span class="text-3xl font-black text-main">${accuracyPercentage}%</span>
                        </div>
                        <div class="w-full h-px bg-main/20"></div>
                        <div class="flex items-center justify-center gap-2">
                            <span class="text-2xl">🐾</span>
                            <div class="text-left">
                                <span class="text-[9px] text-muted font-bold block uppercase">RECOMPENSA OBTENIDA</span>
                                <span class="text-base font-black text-[#e06a4e]">+${pawsEarned} Patitas de Gato</span>
                            </div>
                        </div>
                    </div>

                    <button onclick="window.VocabularyEngine.exitLessonWithTransition()" 
                            class="bg-[#23483f] hover:bg-[#19322b] text-white font-bold text-xs py-4 px-6 rounded-xl cursor-pointer uppercase w-full shadow-md transition-all active:scale-95">
                        Continuar al Mapa ➔
                    </button>
                </div>
            </div>
        `;
        
        if (window.confetti) window.confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    },

    exitLessonWithTransition() {
        const deck = document.getElementById('lesson-interactive-deck');
        if (deck) deck.classList.add('hidden');

        if (typeof window.triggerHomeCarouselTransition === 'function') {
            window.triggerHomeCarouselTransition(this.currentBubbleType);
        } else if (typeof window.renderHomeLessonsModule === 'function') {
            window.renderHomeLessonsModule();
        }
    }
};

window.VocabularyEngine = VocabularyEngine;
window.speakStrict = (text, isSlow = false) => VocabularyEngine.speakStrict(text, isSlow);
