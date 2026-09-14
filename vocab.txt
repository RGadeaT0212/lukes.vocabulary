// ==========================================================================
// 🪐 VOCABULARY ENGINE v60.1 (CONTROL ESTRICTO DE MAX_CONSECUTIVE Y MANTENIMIENTO TOTAL)
// ==========================================================================
import { VOCABULARY_DATABASE } from './database.js';
import { VOCABULARY_TEMPLATES } from './templatesCatalogue.js';
import { MissionsEngine } from './missionsEngine.js';
import { ProgressManager } from './progressManager.js';
import { AudioEngine } from './audioEngine.js';

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
    selectedLevel: 'A1',
    currentUnitNumber: 1,
    currentBlockNumber: 1,
    currentBubbleType: 1,
    currentSubLesson: 1,

    currentUserState: null,
    totalErrorsInLesson: 0,
    totalHitsInLesson: 0,

    failedQueue: [],
    isReviewMode: false,
    shadowingQueue: [],
    isShadowingMode: false,
    activeTypewriterInterval: null,

    showToast(message, type = 'success') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        }
    },

    getTTSRateForLevel() {
        const levelMap = { 'A1': 0.45, 'A2': 0.55, 'B1': 0.65, 'B2': 0.80 };
        const levelKey = String(this.selectedLevel).toUpperCase();
        return levelMap[levelKey] || 0.45;
    },

    speakStrict(text, isSlow = false) {
        const baseRate = this.getTTSRateForLevel();
        const rate = isSlow ? Math.max(0.20, baseRate - 0.15) : baseRate;
        AudioEngine.speak(text, rate);
    },

    cleanString(str) {
        if (!str) return '';
        return String(str)
            .toLowerCase()
            .replace(/[’]/g, "'")
            .trim()
            .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
            .replace(/\s+/g, " ");
    },

    loadGymCategories(levelFilter = null) {
        this.selectedLevel = levelFilter || window.AppState?.activeLevel || 'A1';
        const filteredWords = VOCABULARY_DATABASE.filter(w => String(w.level || 'A1').toUpperCase() === String(this.selectedLevel).toUpperCase());
        this.allWords = filteredWords.map(w => ({
            ...w,
            english_word: w.word || w.english_word,
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

        AudioEngine.toggleLessonVoiceGender();

        const deck = document.getElementById('lesson-interactive-deck');
        if (deck) deck.classList.remove('hidden');

        this.totalErrorsInLesson = 0;
        this.totalHitsInLesson = 0;
        this.failedQueue = [];
        this.isReviewMode = false;
        this.isShadowingMode = false;

        this.buildExerciseQueue();
        this.loopEngine();
    },

    buildExerciseQueue() {
        let targetWords = [...this.currentBlockWords];
        this.exerciseQueue = [];

        // 1. Fase Introductoria (L1)
        if (this.currentSubLesson === 1) {
            targetWords.forEach(word => {
                const cleanWord = this.cleanString(word.english_word || word.word);
                this.exerciseQueue.push({
                    type: 'intro_card',
                    templateId: 'INTRO',
                    word,
                    prompt_text: word.english_word || word.word,
                    clean_target: cleanWord,
                    spanish_translation: word.spanish,
                    hasImage: word.hasImage !== false && !!word.media_url,
                    media_url: word.media_url
                });
            });
        }

        // 2. Tiempos objetivo por Sublección
        let targetTimeSeconds = 360; // L1: 6 min
        let goalPhases = ['recognize', 'associate'];

        if (this.currentSubLesson === 2) {
            targetTimeSeconds = 420; // L2: 7 min
            goalPhases = ['recognize', 'associate', 'recall'];
        } else if (this.currentSubLesson === 3) {
            targetTimeSeconds = 480; // L3: 8 min
            goalPhases = ['recall', 'produce'];
        }

        const currentLevelTag = String(this.selectedLevel).toUpperCase();
        const allTemplateKeys = Object.keys(VOCABULARY_TEMPLATES);
        let accumulatedTime = 0;
        let templateHistory = [];
        let wordIndex = 0;
        let phaseIndex = 0;

        while (accumulatedTime < targetTimeSeconds && this.exerciseQueue.length < 40) {
            const word = targetWords[wordIndex % targetWords.length];
            wordIndex++;

            const currentGoal = goalPhases[phaseIndex % goalPhases.length];
            if (wordIndex % targetWords.length === 0) {
                phaseIndex++;
            }

            const cleanTarget = this.cleanString(word.english_word || word.word);

            // FILTRADO CON CONTROL RIGUROSO DE MAX_CONSECUTIVE
            const availableIDs = allTemplateKeys.filter(id => {
                const tmpl = VOCABULARY_TEMPLATES[id];

                if (tmpl.goal.toLowerCase() !== currentGoal.toLowerCase()) return false;
                if (!tmpl.level.includes(currentLevelTag)) return false;
                if (word.hasImage === false && tmpl.require_image) return false;

                // Conteo estricto de repeticiones consecutivas
                const maxCons = Number(tmpl.max_consecutive) || 2;
                const hLen = templateHistory.length;
                let consecutiveCount = 0;
                for (let i = hLen - 1; i >= 0; i--) {
                    if (String(templateHistory[i]) === String(id)) {
                        consecutiveCount++;
                    } else {
                        break;
                    }
                }
                
                // Bloqueo estricto si ya se alcanzó el límite permitido
                if (consecutiveCount >= maxCons) return false;

                return true;
            });

            let chosenID = null;

            if (availableIDs.length > 0) {
                chosenID = availableIDs[Math.floor(Math.random() * availableIDs.length)];
            } else {
                // Fallback de emergencia si la fase está restringida por max_consecutive
                const fallbackCandidate = allTemplateKeys.find(id => {
                    const tmpl = VOCABULARY_TEMPLATES[id];
                    if (tmpl.goal.toLowerCase() !== currentGoal.toLowerCase()) return false;
                    
                    const maxCons = Number(tmpl.max_consecutive) || 2;
                    const hLen = templateHistory.length;
                    let consecutiveCount = 0;
                    for (let i = hLen - 1; i >= 0; i--) {
                        if (String(templateHistory[i]) === String(id)) consecutiveCount++;
                        else break;
                    }
                    return consecutiveCount < maxCons;
                });

                chosenID = fallbackCandidate || (currentGoal === 'produce' ? '31' : '1');
            }

            templateHistory.push(String(chosenID));
            const chosenTemplate = VOCABULARY_TEMPLATES[chosenID];
            accumulatedTime += chosenTemplate.time || 20;

            const isBasicLevel = ['A1', 'A2'].includes(currentLevelTag);
            const distractorCount = isBasicLevel ? 1 : 3;

            const blockDistractors = targetWords
                .filter(w => this.cleanString(w.english_word || w.word) !== cleanTarget)
                .sort(() => 0.5 - Math.random())
                .slice(0, distractorCount);

            const rawOptions = [word, ...blockDistractors].sort(() => 0.5 - Math.random());

            const formattedOptions = rawOptions.map(opt => ({
                id: opt.id,
                text: opt.word || opt.english_word,
                cleanText: this.cleanString(opt.word || opt.english_word),
                media_url: opt.media_url,
                spanish: opt.spanish
            }));

            const fullBlockOptions = targetWords.map(w => ({
                id: w.id,
                text: w.word || w.english_word,
                cleanText: this.cleanString(w.word || w.english_word),
                spanish: w.spanish
            })).sort(() => 0.5 - Math.random());

            this.exerciseQueue.push({
                type: chosenTemplate.type,
                templateId: String(chosenTemplate.id),
                goal: chosenTemplate.goal,
                skills: chosenTemplate.skills,
                time: chosenTemplate.time,
                word,
                prompt_text: word.english_word || word.word,
                clean_target: cleanTarget,
                spanish_translation: word.spanish,
                hasImage: word.hasImage !== false && !!word.media_url,
                media_url: word.media_url,
                options: formattedOptions,
                blockOptions: fullBlockOptions,
                correct_answer: cleanTarget
            });
        }

        this.currentQueueIndex = 0;
        this.lessonTotalWords = this.exerciseQueue.length;
    },

    loopEngine() {
        if (this.activeTypewriterInterval) clearInterval(this.activeTypewriterInterval);

        if (this.isShadowingMode) {
            if (this.currentQueueIndex >= this.shadowingQueue.length) {
                this.renderLessonReport();
                return;
            }
            this.renderShadowingExercise();
            return;
        }

        if (this.currentQueueIndex >= this.exerciseQueue.length) {
            if (!this.isReviewMode && this.failedQueue.length > 0) {
                this.isReviewMode = true;
                this.exerciseQueue = [...this.failedQueue];
                this.failedQueue = [];
                this.currentQueueIndex = 0;
                this.showToast("Iniciando modo recuperación.", "warning");
            } else {
                if (this.currentSubLesson === 1 || this.currentSubLesson === 2) {
                    this.startShadowingBonus();
                    return;
                }
                this.renderLessonReport();
                return;
            }
        }

        this.currentUserState = {
            selectedOptionIndex: null,
            typedValue: '',
            tfValue: null
        };

        const ex = this.exerciseQueue[this.currentQueueIndex];
        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        // FASE INTRODUCTORIA
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

                <div class="flex-grow flex flex-col justify-center w-full max-w-xl mx-auto my-auto p-2 sm:p-4 text-center">
                    <div id="exercise-card-container" class="card-bg p-5 sm:p-7 rounded-3xl border border-main shadow-md flex flex-col gap-3 relative">
                        
                        <div class="flex items-center justify-between w-full border-b border-main/10 pb-2">
                            <span class="text-[10px] font-mono font-bold text-muted uppercase tracking-wider">// PRESENTACIÓN</span>
                            <button onclick="window.VocabularyEngine.markAsKnown()" 
                                    class="bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[10px] font-mono font-black px-3 py-1 rounded-xl cursor-pointer transition-all active:scale-95 shadow-xs">
                                ⚡ Ya me la sé
                            </button>
                        </div>

                        ${ex.hasImage ? `<img src="${ex.media_url}" class="w-24 h-24 sm:w-28 sm:h-28 mx-auto object-contain my-1" onerror="this.remove()">` : ''}

                        <div class="flex flex-col items-center gap-0.5">
                            <h2 id="scifi-typewriter" class="title-brand text-2xl sm:text-3xl font-black text-main uppercase min-h-[36px]"></h2>
                            
                            <div id="spanish-translation-container" class="mt-1">
                                <button onclick="window.VocabularyEngine.revealSpanishTranslation()" 
                                        class="text-[10px] font-mono text-muted hover:text-[#e06a4e] border border-dashed border-main px-2.5 py-1 rounded-lg cursor-pointer">
                                    👁️ Ver Significado (Español)
                                </button>
                                <p id="spanish-translation-text" class="text-sm font-bold text-muted italic hidden">"${ex.spanish_translation}"</p>
                            </div>
                        </div>

                        <div class="flex items-center justify-center gap-3 my-1">
                            <button type="button" onclick="window.VocabularyEngine.speakActivePrompt(false)" 
                                    class="flex items-center gap-2 px-4 py-2 bg-[#23483f] text-white rounded-xl text-xs font-mono font-bold uppercase cursor-pointer active:scale-95 transition-all shadow-xs">
                                <i class="fa-solid fa-volume-high text-xs"></i>
                                <span>Normal</span>
                            </button>
                            <button type="button" onclick="window.VocabularyEngine.speakActivePrompt(true)" 
                                    class="flex items-center gap-2 px-4 py-2 subcard-bg text-main border border-main rounded-xl text-xs font-mono font-bold uppercase cursor-pointer active:scale-95 transition-all">
                                <span class="text-xs">🐢</span>
                                <span>Lento</span>
                            </button>
                        </div>

                        <button onclick="window.VocabularyEngine.advanceIntroCard()" 
                                class="w-full mt-1 bg-[#23483f] hover:bg-[#19322b] text-white font-mono text-xs font-black py-3 rounded-xl uppercase tracking-widest cursor-pointer shadow-md">
                            Entendido, Continuar ➔
                        </button>
                    </div>
                </div>

                <div class="w-full bg-[#f1ede4] dark:bg-[#222d29] h-2 rounded-full overflow-hidden max-w-xl mx-auto shrink-0 mt-1">
                    <div class="bg-[#e06a4e] h-full transition-all duration-300" style="width: ${((this.currentQueueIndex + 1) / this.lessonTotalWords) * 100}%"></div>
                </div>
            `;

            this.speakStrict(ex.prompt_text, false);

            const textNode = document.getElementById('scifi-typewriter');
            let charIdx = 0;
            if (textNode) {
                textNode.textContent = '';
                this.activeTypewriterInterval = setInterval(() => {
                    if (charIdx < ex.prompt_text.length) {
                        textNode.textContent += ex.prompt_text.charAt(charIdx);
                        charIdx++;
                    } else {
                        clearInterval(this.activeTypewriterInterval);
                    }
                }, 120);
            }
            return;
        }

        // FASE EJERCICIOS INTERACTIVOS
        let exerciseInteractiveBody = '';

        if (ex.templateId === '18' || ex.templateId === '19') {
            const wordBankHtml = ex.blockOptions.map(opt => `
                <div class="flex items-center gap-1.5 subcard-bg border border-main px-2.5 py-1.5 rounded-xl shadow-2xs">
                    <button type="button" onclick="window.VocabularyEngine.speakStrict('${opt.text}')" 
                            class="w-6 h-6 bg-[#23483f] hover:bg-[#19322b] text-white rounded-full flex items-center justify-center text-[10px] cursor-pointer active:scale-90 transition-all">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                    <span class="text-xs font-mono font-bold text-main select-none">${opt.text}</span>
                </div>
            `).join('');

            exerciseInteractiveBody = `
                <div class="flex flex-col gap-3 mt-1">
                    <div class="flex flex-wrap justify-center gap-2 p-2.5 bg-[#f1ede4]/60 dark:bg-[#222d29]/60 rounded-2xl border border-dashed border-main">
                        <span class="w-full text-[9px] font-mono text-muted uppercase font-bold tracking-wider text-center">
                            🔊 BANCO DE PALABRAS (ESCUCHA Y COMPLETA):
                        </span>
                        ${wordBankHtml}
                    </div>

                    <input type="text" id="type-answer-input" autocomplete="off" placeholder="Escribe la palabra aquí..." 
                           oninput="window.VocabularyEngine.handleTextInput(this.value)"
                           onkeypress="if(event.key==='Enter' && !document.getElementById('check-answer-btn').disabled) window.VocabularyEngine.executeCheckAnswer()"
                           class="w-full subcard-bg border border-main rounded-xl p-3.5 text-center font-mono text-xs sm:text-sm font-bold text-main focus:outline-none focus:border-[#e06a4e]">
                </div>
            `;
        } else if (ex.templateId === '29' || ex.templateId === '30') {
            exerciseInteractiveBody = `
                <div class="grid grid-cols-2 gap-3 mt-3">
                    <button id="tf-btn-true" onclick="window.VocabularyEngine.selectTrueFalse(true)" 
                            class="option-btn-default p-4 rounded-xl font-mono text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-pointer">
                        ✓ VERDADERO
                    </button>
                    <button id="tf-btn-false" onclick="window.VocabularyEngine.selectTrueFalse(false)" 
                            class="option-btn-default p-4 rounded-xl font-mono text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400 border border-rose-500/30 cursor-pointer">
                        ✕ FALSO
                    </button>
                </div>
            `;
        } else if (ex.templateId === '16') {
            const fullWord = ex.prompt_text;
            const splitPoint = Math.ceil(fullWord.length / 2);
            const firstChunk = fullWord.slice(0, splitPoint);
            const correctSecondChunk = fullWord.slice(splitPoint);

            const chunkOptions = [
                correctSecondChunk,
                'ing',
                'ed',
                'er'
            ].filter((v, i, a) => a.indexOf(v) === i).sort(() => 0.5 - Math.random());

            exerciseInteractiveBody = `
                <div class="flex flex-col items-center gap-3 mt-2">
                    <div class="flex items-center justify-center gap-2 text-xl sm:text-2xl font-mono font-black text-main">
                        <span class="bg-[#23483f] text-white px-3 py-1 rounded-xl">${firstChunk}</span>
                        <span class="text-muted">+</span>
                        <span id="chunk-placeholder" class="border-b-2 border-dashed border-[#e06a4e] px-3 py-1 text-[#e06a4e]">???</span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 w-full mt-2">
                        ${chunkOptions.map((chk, idx) => `
                            <button id="chunk-btn-${idx}" onclick="window.VocabularyEngine.selectChunkOption(${idx}, '${chk}')" 
                                    class="option-btn-default p-3 rounded-xl font-mono text-xs font-bold cursor-pointer">
                                ${chk}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (ex.templateId === '5') {
            const maskedWord = ex.prompt_text.replace(/[aeiouAEIOU]/g, '_');
            exerciseInteractiveBody = `
                <div class="flex flex-col gap-2 mt-2">
                    <span class="text-2xl font-mono font-black text-main tracking-widest text-center">${maskedWord}</span>
                    <input type="text" id="type-answer-input" autocomplete="off" placeholder="Completa la palabra..." 
                           oninput="window.VocabularyEngine.handleTextInput(this.value)"
                           onkeypress="if(event.key==='Enter' && !document.getElementById('check-answer-btn').disabled) window.VocabularyEngine.executeCheckAnswer()"
                           class="w-full subcard-bg border border-main rounded-xl p-3.5 text-center font-mono text-xs sm:text-sm font-bold text-main focus:outline-none focus:border-[#e06a4e]">
                </div>
            `;
        } else if (ex.type === 'input') {
            exerciseInteractiveBody = `
                <div class="flex flex-col gap-2 mt-2">
                    <input type="text" id="type-answer-input" autocomplete="off" placeholder="Escribe en inglés..." 
                           oninput="window.VocabularyEngine.handleTextInput(this.value)"
                           onkeypress="if(event.key==='Enter' && !document.getElementById('check-answer-btn').disabled) window.VocabularyEngine.executeCheckAnswer()"
                           class="w-full subcard-bg border border-main rounded-xl p-3.5 text-center font-mono text-xs sm:text-sm font-bold text-main focus:outline-none focus:border-[#e06a4e]">
                </div>
            `;
        } else if (ex.type === 'speaking' || ex.type === 'audio_input') {
            exerciseInteractiveBody = `
                <div class="flex flex-col items-center gap-3 mt-2">
                    <p class="text-xs font-mono font-bold text-muted uppercase">Escucha y repite la palabra:</p>
                    <button type="button" onclick="window.VocabularyEngine.simulateSpeakingRecorded()" 
                            class="w-14 h-14 bg-[#e06a4e] hover:bg-[#c8573b] text-white rounded-full flex items-center justify-center text-lg cursor-pointer shadow-lg active:scale-90 transition-all">
                        <i class="fa-solid fa-microphone"></i>
                    </button>
                    <span id="speaking-status-text" class="text-[10px] font-mono text-muted">Toca para hablar</span>
                </div>
            `;
        } else {
            exerciseInteractiveBody = `
                <div class="grid grid-cols-2 gap-2 sm:gap-3 mt-2">
                    ${ex.options.map((opt, idx) => `
                        <button id="opt-btn-${idx}" onclick="window.VocabularyEngine.selectOptionWithTTS(${idx})" 
                                class="option-btn-default p-3 sm:p-3.5 rounded-xl font-mono text-xs font-bold cursor-pointer truncate">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
            `;
        }

        deck.innerHTML = `
            <div class="w-full flex justify-between items-center border-b border-main pb-2 z-10 shrink-0">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-black uppercase text-[#23483f] dark:text-white">
                        L${this.currentSubLesson} ${this.isReviewMode ? '// RECUPERACIÓN' : ''} // ${this.currentQueueIndex + 1}/${this.lessonTotalWords}
                    </span>
                    <span class="text-[9px] font-mono subcard-bg px-2 py-0.5 rounded-full font-bold text-muted border border-main">
                        ID:${ex.templateId} [${ex.type}]
                    </span>
                </div>
                <button onclick="window.VocabularyEngine.exitLessonToHome()" class="bg-[#23483f] text-white font-mono text-[9px] px-3 py-1.5 rounded-lg uppercase font-black cursor-pointer">
                    SALIR ✕
                </button>
            </div>

            <div class="flex-grow flex flex-col justify-center w-full max-w-xl mx-auto my-auto p-2 sm:p-4 text-center overflow-y-auto custom-scrollbar">
                <div id="exercise-card-container" class="card-bg p-4 sm:p-6 rounded-3xl border border-main shadow-xs flex flex-col gap-2.5 relative">
                    
                    <div class="flex items-center justify-between w-full border-b border-main/10 pb-1.5">
                        <span class="text-[10px] font-mono font-bold text-muted uppercase tracking-wider">// EJERCICIO</span>
                        <button onclick="window.VocabularyEngine.markAsKnown()" 
                                class="bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[10px] font-mono font-black px-2.5 py-1 rounded-xl cursor-pointer transition-all active:scale-95 shadow-xs">
                            ⚡ Ya me la sé
                        </button>
                    </div>

                    ${ex.hasImage ? `<img src="${ex.media_url}" class="w-20 h-20 sm:w-24 sm:h-24 mx-auto object-contain my-0.5" onerror="this.remove()">` : ''}

                    <div class="flex items-center justify-center gap-2">
                        <button type="button" onclick="window.VocabularyEngine.speakActivePrompt(false)" class="w-9 h-9 bg-[#23483f] text-white rounded-full flex items-center justify-center cursor-pointer active:scale-95">
                            <i class="fa-solid fa-volume-high text-xs"></i>
                        </button>
                        <button type="button" onclick="window.VocabularyEngine.speakActivePrompt(true)" class="w-7 h-7 subcard-bg text-main border border-main rounded-full flex items-center justify-center cursor-pointer active:scale-95">
                            <span class="text-xs">🐢</span>
                        </button>
                    </div>

                    <div id="spanish-translation-container">
                        <button onclick="window.VocabularyEngine.revealSpanishTranslation()" 
                                class="text-[9px] font-mono text-muted hover:text-[#e06a4e] border border-dashed border-main px-2 py-0.5 rounded-lg cursor-pointer">
                            👁️ Ver Significado (Español)
                        </button>
                        <p id="spanish-translation-text" class="text-xs text-muted font-medium italic hidden font-bold">"${ex.spanish_translation}"</p>
                    </div>

                    ${exerciseInteractiveBody}

                    <button id="check-answer-btn" disabled onclick="window.VocabularyEngine.executeCheckAnswer()" 
                            class="w-full mt-1.5 subcard-bg text-muted font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider transition-all cursor-not-allowed">
                        Comprobar Respuesta ➔
                    </button>
                </div>
            </div>

            <div class="w-full bg-[#f1ede4] dark:bg-[#222d29] h-2 rounded-full overflow-hidden max-w-xl mx-auto shrink-0 mt-1">
                <div class="bg-[#e06a4e] h-full transition-all duration-300" style="width: ${((this.currentQueueIndex + 1) / this.lessonTotalWords) * 100}%"></div>
            </div>
        `;

        this.speakStrict(ex.prompt_text, false);
        if (ex.type === 'input' || ex.templateId === '18' || ex.templateId === '19' || ex.templateId === '5') {
            setTimeout(() => document.getElementById('type-answer-input')?.focus(), 150);
        }
    },

    selectTrueFalse(isTrue) {
        this.currentUserState.tfValue = isTrue;
        const btnTrue = document.getElementById('tf-btn-true');
        const btnFalse = document.getElementById('tf-btn-false');

        if (btnTrue && btnFalse) {
            btnTrue.className = isTrue ? "option-btn-selected p-4 rounded-xl font-mono text-xs sm:text-sm font-black border border-emerald-500 cursor-pointer" : "option-btn-default p-4 rounded-xl font-mono text-xs sm:text-sm font-black border border-emerald-500/30 cursor-pointer";
            btnFalse.className = !isTrue ? "option-btn-selected p-4 rounded-xl font-mono text-xs sm:text-sm font-black border border-rose-500 cursor-pointer" : "option-btn-default p-4 rounded-xl font-mono text-xs sm:text-sm font-black border border-rose-500/30 cursor-pointer";
        }
        this.activateCheckButton();
    },

    selectChunkOption(index, chunkValue) {
        const ex = this.exerciseQueue[this.currentQueueIndex];
        const placeholder = document.getElementById('chunk-placeholder');
        if (placeholder) placeholder.innerText = chunkValue;

        const fullWord = ex.prompt_text;
        const splitPoint = Math.ceil(fullWord.length / 2);
        const firstChunk = fullWord.slice(0, splitPoint);

        this.currentUserState.typedValue = firstChunk + chunkValue;
        this.activateCheckButton();
    },

    speakActivePrompt(isSlow = false) {
        const ex = this.exerciseQueue[this.currentQueueIndex];
        if (ex && ex.prompt_text) {
            this.speakStrict(ex.prompt_text, isSlow);
        }
    },

    startShadowingBonus() {
        this.isShadowingMode = true;
        this.shadowingQueue = [...this.currentBlockWords];
        this.currentQueueIndex = 0;
        this.showToast("✍️ ¡Bonus: Practica escribiendo en el teclado!", "info");
        this.loopEngine();
    },

    renderShadowingExercise() {
        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        const currentWord = this.shadowingQueue[this.currentQueueIndex];

        deck.innerHTML = `
            <div class="w-full flex justify-between items-center border-b border-main pb-3 z-10 shrink-0">
                <span class="text-xs font-mono font-black uppercase text-[#e06a4e]">
                    ✍️ SHADOWING WRITING // BONUS (${this.currentQueueIndex + 1}/5)
                </span>
                <span class="text-[9px] font-mono subcard-bg px-2 py-0.5 rounded-full font-bold text-muted border border-main">
                    SIN TIEMPO NI EVALUACIÓN
                </span>
            </div>

            <div class="flex-grow flex flex-col justify-center w-full max-w-xl mx-auto my-auto p-4 text-center">
                <div class="card-bg p-6 sm:p-8 rounded-3xl border border-main shadow-md flex flex-col gap-4 relative">
                    
                    ${currentWord.media_url ? `<img src="${currentWord.media_url}" class="w-24 h-24 mx-auto object-contain my-1" onerror="this.remove()">` : ''}

                    <div class="flex flex-col items-center gap-1 my-1">
                        <span class="text-[9px] font-mono font-bold text-muted uppercase">// TOCA Y CALCA LA PALABRA:</span>
                        <h2 class="title-brand text-3xl font-black text-main/35 uppercase tracking-widest select-none">
                            ${currentWord.english_word || currentWord.word}
                        </h2>
                        <p class="text-xs text-muted font-bold italic">"${currentWord.spanish}"</p>
                    </div>

                    <input type="text" id="shadowing-input" autocomplete="off" placeholder="Escribe aquí..." 
                           oninput="window.VocabularyEngine.handleShadowingInput(this.value)"
                           onkeypress="if(event.key==='Enter' && !document.getElementById('shadowing-next-btn').disabled) window.VocabularyEngine.advanceShadowingBonus()"
                           class="w-full subcard-bg border border-main rounded-xl p-3.5 text-center font-mono text-sm font-bold text-main focus:outline-none focus:border-[#e06a4e]">

                    <button id="shadowing-next-btn" disabled onclick="window.VocabularyEngine.advanceShadowingBonus()" 
                            class="w-full mt-2 subcard-bg text-muted font-mono text-xs font-black py-3.5 rounded-xl uppercase tracking-widest cursor-not-allowed">
                        Siguiente Palabra ➔
                    </button>
                </div>
            </div>
        `;

        this.speakStrict(currentWord.english_word || currentWord.word, false);
        setTimeout(() => document.getElementById('shadowing-input')?.focus(), 150);
    },

    handleShadowingInput(val) {
        const btn = document.getElementById('shadowing-next-btn');
        if (!btn) return;

        const currentWord = this.shadowingQueue[this.currentQueueIndex];
        const targetClean = this.cleanString(currentWord.english_word || currentWord.word);

        if (this.cleanString(val) === targetClean) {
            btn.disabled = false;
            btn.className = "w-full mt-2 bg-[#23483f] hover:bg-[#19322b] text-white font-mono text-xs font-black py-3.5 rounded-xl uppercase tracking-widest cursor-pointer shadow-md transition-all active:scale-95";
            btn.innerText = "¡EXCELENTE! CONTINUAR ➔ (ENTER)";
        } else {
            btn.disabled = true;
            btn.className = "w-full mt-2 subcard-bg text-muted font-mono text-xs font-black py-3.5 rounded-xl uppercase tracking-widest cursor-not-allowed";
            btn.innerText = "Siguiente Palabra ➔";
        }
    },

    advanceShadowingBonus() {
        this.currentQueueIndex++;
        this.loopEngine();
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

    selectOptionWithTTS(index) {
        const ex = this.exerciseQueue[this.currentQueueIndex];
        const selectedOpt = ex.options[index];
        if (!selectedOpt) return;

        ex.options.forEach((_, idx) => {
            const btn = document.getElementById(`opt-btn-${idx}`);
            if (btn) btn.className = "option-btn-default p-3 sm:p-3.5 rounded-xl font-mono text-xs font-bold cursor-pointer truncate";
        });

        const selectedBtn = document.getElementById(`opt-btn-${index}`);
        if (selectedBtn) {
            selectedBtn.className = "option-btn-selected p-3 sm:p-3.5 rounded-xl font-mono text-xs font-bold cursor-pointer truncate";
        }

        this.speakStrict(selectedOpt.text, false);
        this.currentUserState.selectedOptionIndex = index;
        this.activateCheckButton();
    },

    handleTextInput(value) {
        this.currentUserState.typedValue = value;
        if (this.cleanString(value).length > 0) {
            this.activateCheckButton();
        } else {
            this.deactivateCheckButton();
        }
    },

    simulateSpeakingRecorded() {
        const ex = this.exerciseQueue[this.currentQueueIndex];
        const statusText = document.getElementById('speaking-status-text');
        if (statusText) statusText.innerText = "¡Escuchado correctamente! ✓";

        this.currentUserState.typedValue = ex.correct_answer;
        this.activateCheckButton();
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

        if (ex.templateId === '29' || ex.templateId === '30') {
            isCorrect = this.currentUserState.tfValue === true;
        } else if (ex.type === 'input' || ex.templateId === '18' || ex.templateId === '19' || ex.templateId === '5' || ex.templateId === '16' || ex.type === 'speaking' || ex.type === 'audio_input') {
            const typedClean = this.cleanString(this.currentUserState.typedValue);
            isCorrect = typedClean === ex.correct_answer;
        } else {
            const selectedOpt = ex.options[this.currentUserState.selectedOptionIndex];
            isCorrect = selectedOpt && selectedOpt.cleanText === ex.correct_answer;
        }

        const checkBtn = document.getElementById('check-answer-btn');
        const cardContainer = document.getElementById('exercise-card-container');
        const tmplSkills = ex.skills || ['reading'];

        if (isCorrect) {
            this.totalHitsInLesson++;

            if (ProgressManager.updateSkillMastery) {
                const points = this.isReviewMode ? 0.5 : 1.5;
                ProgressManager.updateSkillMastery(tmplSkills, points);
            }

            if (cardContainer) cardContainer.classList.add('animate-correct');
            if (checkBtn) {
                checkBtn.className = "w-full mt-2 bg-[#23483f] text-white font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider shadow-md";
                checkBtn.innerText = "CORRECT! ✓";
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

            if (ProgressManager.updateSkillMastery) {
                ProgressManager.updateSkillMastery(tmplSkills, -1.0);
            }

            if (checkBtn) {
                checkBtn.className = "w-full mt-2 bg-rose-500 text-white font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider";
                checkBtn.innerText = "INCORRECTO - REINTENTANDO AL FINAL";
            }

            if (!this.failedQueue.includes(ex)) {
                this.failedQueue.push({ ...ex });
            }

            setTimeout(() => {
                this.currentQueueIndex++;
                this.loopEngine();
            }, 1100);
        }
    },

    markAsKnown() {
        const ex = this.exerciseQueue[this.currentQueueIndex];
        if (ex && ex.prompt_text) {
            this.knownWordsInBlock.add(ex.prompt_text);
        }
        this.totalHitsInLesson++;
        this.currentQueueIndex++;
        this.loopEngine();
    },

    exitLessonToHome() {
        if (typeof window.showConfirmModal === 'function') {
            window.showConfirmModal({
                title: "¿Salir de la Lección?",
                message: "Si sales ahora perderás el progreso de los ejercicios actuales.",
                onConfirm: () => {
                    const deck = document.getElementById('lesson-interactive-deck');
                    if (deck) deck.classList.add('hidden');
                    if (typeof window.renderHomeLessonsModule === 'function') {
                        window.renderHomeLessonsModule();
                    }
                }
            });
        } else {
            const deck = document.getElementById('lesson-interactive-deck');
            if (deck) deck.classList.add('hidden');
            if (typeof window.renderHomeLessonsModule === 'function') {
                window.renderHomeLessonsModule();
            }
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
                                <span class="text-base font-black text-[#e06a4e]">+${pawsEarned} paws</span>
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
