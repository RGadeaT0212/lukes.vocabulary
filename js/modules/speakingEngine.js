// ==========================================================================
// 🎙️ SPEAKING ENGINE v3.1 - INTERFAZ DE PANTALLA COMPLETA Y GRID EXPANSIVO
// ==========================================================================
import { VOCABULARY_DATABASE } from './database.js';
import { startListening, stopListening } from './speechEngine.js';
import { AudioEngine } from './audioEngine.js';

export const SpeakingEngine = {
    learnedWordsPool: [],
    activeSessionWords: [],
    currentLessonIndex: 0,
    currentSessionNumber: 1,
    lessonTimeRemaining: 180, // 3 minutos
    timerInterval: null,

    speakingTemplates: ['Repeat', 'Say', 'Answer', 'SentenceRepeater'],

    initSpeakingModule() {
        const totalLearned = window.AppState?.studentStats?.wordsLearned || window.ProgressManager?.state?.mastered_words_ids?.length || 0;
    
        if (totalLearned < 5) {
            const remaining = 5 - totalLearned;
            if (typeof window.showToast === 'function') {
                window.showToast(`🔒 Módulo Bloqueado. Completa ${remaining} palabra(s) más para desbloquear Speaking.`, 'warning');
            }
            return;
        }

        this.openSpeakingDashboard(totalLearned);
    },

    // 🎯 DASHBOARD ADAPTATIVO: APROVECHA EL LIENZO COMPLETO EN PC Y MÓVIL
    openSpeakingDashboard(totalLearned) {
        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        deck.classList.remove('hidden');

        // 2 lecciones por cada 5 palabras aprendidas
        const totalAvailableLessons = Math.max(2, Math.floor(totalLearned / 5) * 2);
        const completedSpeakingLevel = window.ProgressManager?.state?.completed_speaking_session || 0;

        deck.innerHTML = `
            <div class="w-full flex justify-between items-center border-b border-main pb-3 z-10 shrink-0">
                <div class="flex items-center gap-2">
                    <span class="text-sm font-mono font-black uppercase text-[#23483f] dark:text-white">
                        🎙️ LABORATORIO DE SPEAKING
                    </span>
                    <span class="text-[9px] font-mono subcard-bg px-2.5 py-0.5 rounded-full font-bold text-[#e06a4e] border border-main">
                        SESIONES DE 3 MIN
                    </span>
                </div>
                <button onclick="window.SpeakingEngine.closeSpeakingModule()" 
                        class="bg-[#23483f] hover:bg-[#19322b] text-white font-mono text-[9px] px-3.5 py-1.5 rounded-lg uppercase font-black cursor-pointer transition-all">
                    SALIR ✕
                </button>
            </div>

            <!-- CONTENEDOR EXPANSIVO DE PANTALLA COMPLETA -->
            <div class="flex-grow flex flex-col justify-start sm:justify-center w-full max-w-5xl mx-auto my-auto p-2 sm:p-6 overflow-hidden">
                <div class="card-bg w-full h-full sm:h-auto max-h-[82vh] p-4 sm:p-8 rounded-3xl border border-main shadow-md flex flex-col gap-4 relative font-mono overflow-hidden">
                    
                    <div class="flex flex-col sm:flex-row items-center justify-between border-b border-main/10 pb-3 gap-2 shrink-0">
                        <div class="text-left w-full sm:w-auto">
                            <span class="text-xs font-bold text-main uppercase tracking-wider block">PALABRAS APRENDIDAS: ${totalLearned}</span>
                            <span class="text-[10px] text-muted block">Selecciona una lección desbloqueada para iniciar la práctica de 3 minutos:</span>
                        </div>
                        <span class="text-[9px] subcard-bg border border-main px-3 py-1 rounded-xl text-muted font-bold shrink-0">
                            +2 lecciones por cada 5 palabras
                        </span>
                    </div>

                    <!-- GRID RESPONSIVO EXPANSIVO (SE ADAPTA A PANTALLA COMPLETA EN PC) -->
                    <div class="flex-grow overflow-y-auto custom-scrollbar p-2 my-1">
                        <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 sm:gap-4 justify-items-center">
                            ${Array.from({ length: totalAvailableLessons }).map((_, idx) => {
                                const sessionNum = idx + 1;
                                const isUnlocked = sessionNum <= (completedSpeakingLevel + 1);
                                const isCompleted = sessionNum <= completedSpeakingLevel;

                                if (isUnlocked) {
                                    return `
                                        <button onclick="window.SpeakingEngine.startSpeakingSession(${sessionNum}, ${totalLearned})" 
                                                class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${isCompleted ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-[#23483f] hover:bg-[#19322b]'} text-white flex flex-col items-center justify-center text-sm font-black shadow-md cursor-pointer transition-all active:scale-95 border border-main">
                                            <span class="text-[8px] opacity-80 uppercase">SESIÓN</span>
                                            <span class="text-base">${sessionNum} ${isCompleted ? '✓' : ''}</span>
                                        </button>
                                    `;
                                } else {
                                    return `
                                        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-200 dark:bg-zinc-800/60 text-gray-400 dark:text-zinc-600 flex flex-col items-center justify-center text-xs font-black border border-main/20 cursor-not-allowed opacity-60">
                                            <span class="text-xs">🔒</span>
                                            <span class="text-[9px]">${sessionNum}</span>
                                        </div>
                                    `;
                                }
                            }).join('')}
                        </div>
                    </div>

                </div>
            </div>
        `;
    },

    startSpeakingSession(sessionNum, totalLearned) {
        this.currentSessionNumber = sessionNum;

        const allWords = VOCABULARY_DATABASE.slice(0, Math.max(5, totalLearned));
        const recent5 = allWords.slice(-5);
        const weightedPool = [...allWords, ...recent5, ...recent5];

        this.activeSessionWords = weightedPool.sort(() => 0.5 - Math.random()).slice(0, 8);
        this.currentLessonIndex = 0;
        this.lessonTimeRemaining = 180; // 3 minutos

        const deck = document.getElementById('lesson-interactive-deck');
        if (deck) deck.classList.remove('hidden');

        this.startTimer();
        this.renderSpeakingQuestion();
    },

    startTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.lessonTimeRemaining--;
            const timerEl = document.getElementById('speaking-timer-display');
            if (timerEl) {
                const mins = Math.floor(this.lessonTimeRemaining / 60);
                const secs = this.lessonTimeRemaining % 60;
                timerEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            }

            if (this.lessonTimeRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.endSpeakingSession();
            }
        }, 1000);
    },

    renderSpeakingQuestion() {
        if (this.currentLessonIndex >= this.activeSessionWords.length) {
            this.currentLessonIndex = 0;
        }

        const currentWord = this.activeSessionWords[this.currentLessonIndex];
        const targetWord = currentWord.word || currentWord.english_word;
        const deck = document.getElementById('lesson-interactive-deck');

        if (!deck) return;

        deck.innerHTML = `
            <div class="w-full flex justify-between items-center border-b border-main pb-2 z-10 shrink-0">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-black uppercase text-[#23483f] dark:text-white">SPEAKING // SESIÓN ${this.currentSessionNumber}</span>
                    <span id="speaking-timer-display" class="text-xs font-mono bg-[#e06a4e] text-white px-2.5 py-0.5 rounded-full font-bold">3:00</span>
                </div>
                <button onclick="window.SpeakingEngine.exitSpeakingSession()" class="bg-[#23483f] text-white font-mono text-[9px] px-3 py-1.5 rounded-lg uppercase font-black cursor-pointer">
                    SALIR ✕
                </button>
            </div>

            <div class="flex-grow flex flex-col justify-center w-full max-w-xl mx-auto my-auto p-2 sm:p-4 text-center">
                <div id="exercise-card-container" class="card-bg p-5 sm:p-7 rounded-3xl border border-main shadow-xs flex flex-col gap-4 relative">
                    
                    <span class="text-[9px] font-mono font-bold text-muted uppercase tracking-wider">// ESCUCHA Y PRONUNCIA</span>

                    <button type="button" onclick="AudioEngine.speak('${targetWord}')" 
                            class="w-16 h-16 bg-[#23483f] hover:bg-[#19322b] text-white rounded-full mx-auto flex items-center justify-center shadow-md cursor-pointer active:scale-95 transition-all">
                        <i class="fa-solid fa-volume-high text-xl"></i>
                    </button>

                    <div>
                        <h3 class="title-brand text-2xl sm:text-3xl font-black text-main uppercase">"${targetWord}"</h3>
                        <p class="text-xs text-muted font-bold italic mt-1 font-sans">"${currentWord.spanish}"</p>
                    </div>

                    <div id="mic-status-container" class="subcard-bg border border-main p-4 rounded-2xl flex flex-col items-center gap-2.5 mt-1">
                        <span class="text-[9px] font-mono font-bold text-muted uppercase">// PRESIONA Y PRONUNCIA EN INGLÉS</span>
                        
                        <button id="mic-listen-btn" onclick="window.SpeakingEngine.listenVoiceAnswer('${targetWord}')" 
                                class="w-14 h-14 rounded-full bg-[#e06a4e] hover:bg-[#c8573b] text-white flex items-center justify-center text-lg cursor-pointer shadow-md transition-all active:scale-95">
                            <i class="fa-solid fa-microphone"></i>
                        </button>
                        
                        <span id="speech-transcript-result" class="text-xs font-mono font-bold text-main min-h-[16px]"></span>
                    </div>
                </div>
            </div>

            <div class="w-full bg-[#f1ede4] dark:bg-[#222d29] h-2 rounded-full overflow-hidden max-w-xl mx-auto shrink-0 mt-1">
                <div class="bg-[#e06a4e] h-full transition-all duration-300" style="width: ${((180 - this.lessonTimeRemaining) / 180) * 100}%"></div>
            </div>
        `;

        AudioEngine.speak(targetWord);
    },

    listenVoiceAnswer(expectedWord) {
        const resultEl = document.getElementById('speech-transcript-result');
        const micBtn = document.getElementById('mic-listen-btn');

        if (micBtn) micBtn.className = "w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center text-lg animate-pulse shadow-md";
        if (resultEl) resultEl.textContent = "Escuchando...";

        startListening(
            (spokenText) => {
                if (micBtn) micBtn.className = "w-14 h-14 rounded-full bg-[#e06a4e] text-white flex items-center justify-center text-lg shadow-md";
                if (resultEl) resultEl.textContent = `Dijiste: "${spokenText}"`;

                if (spokenText.toLowerCase().includes(expectedWord.toLowerCase())) {
                    AudioEngine.speak("Great pronunciation!");
                    if (resultEl) resultEl.className = "text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400";
                    setTimeout(() => {
                        this.currentLessonIndex++;
                        this.renderSpeakingQuestion();
                    }, 1200);
                } else {
                    AudioEngine.speak("Try again");
                    if (resultEl) resultEl.className = "text-xs font-mono font-bold text-rose-500";
                }
            },
            (error) => {
                if (micBtn) micBtn.className = "w-14 h-14 rounded-full bg-[#e06a4e] text-white flex items-center justify-center text-lg shadow-md";
                if (resultEl) resultEl.textContent = "Error de micrófono.";
            }
        );
    },

    closeSpeakingModule() {
        stopListening();
        clearInterval(this.timerInterval);
        const deck = document.getElementById('lesson-interactive-deck');
        if (deck) deck.classList.add('hidden');
        if (typeof window.renderHomeLessonsModule === 'function') {
            window.renderHomeLessonsModule();
        }
    },

    exitSpeakingSession() {
        stopListening();
        clearInterval(this.timerInterval);
        const totalLearned = window.AppState?.studentStats?.wordsLearned || window.ProgressManager?.state?.mastered_words_ids?.length || 0;
        this.openSpeakingDashboard(totalLearned);
    },

    endSpeakingSession() {
        stopListening();

        if (window.ProgressManager?.state) {
            const currentMax = window.ProgressManager.state.completed_speaking_session || 0;
            if (this.currentSessionNumber > currentMax) {
                window.ProgressManager.state.completed_speaking_session = this.currentSessionNumber;
                if (typeof window.ProgressManager.syncToSupabase === 'function') {
                    window.ProgressManager.syncToSupabase();
                }
            }
        }

        const deck = document.getElementById('lesson-interactive-deck');
        if (deck) {
            deck.innerHTML = `
                <div class="flex-grow flex flex-col items-center justify-center p-4">
                    <div class="card-bg p-6 rounded-3xl border border-main shadow-2xl max-w-sm w-full text-center font-mono">
                        <h3 class="text-lg font-black text-[#23483f] dark:text-emerald-400">🎙️ ¡SESIÓN ${this.currentSessionNumber} COMPLETADA!</h3>
                        <p class="text-muted text-xs mt-2">Has finalizado la sesión oral de 3 minutos. La siguiente lección ha sido desbloqueada.</p>
                        <button onclick="window.SpeakingEngine.exitSpeakingSession()" 
                                class="bg-[#23483f] hover:bg-[#19322b] text-white font-bold text-xs py-3.5 px-6 rounded-xl cursor-pointer uppercase mt-5 w-full shadow-md transition-all active:scale-95">
                            ↩️ Volver a las Lecciones
                        </button>
                    </div>
                </div>
            `;
            if (window.confetti) window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
    }
};

window.SpeakingEngine = SpeakingEngine;
