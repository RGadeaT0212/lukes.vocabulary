// ==========================================================================
// 🎙 SPEAKING ENGINE v3.5 - INTEGRATED CENTRAL VIEW & DYNAMIC I18N
// ==========================================================================
import { getVocabularyForTargetLang } from './database.js';
import { startListening, stopListening } from './speechEngine.js';
import { AudioEngine } from './audioEngine.js';

export const SpeakingEngine = {
    learnedWordsPool: [],
    activeSessionWords: [],
    currentLessonIndex: 0,
    currentSessionNumber: 1,
    lessonTimeRemaining: 180,
    timerInterval: null,

    speakingTemplates: ['Repeat', 'Say', 'Answer', 'SentenceRepeater'],

    initSpeakingModule() {
        const completedBubblesCount = window.ProgressManager?.getLangProgress()?.completed_bubbles?.length || 0;
        
        if (completedBubblesCount < 3) {
            const remaining = 3 - completedBubblesCount;
            this.renderSpeakingLockedNotice(completedBubblesCount, remaining);
            return;
        }

        const totalLearned = window.AppState?.studentStats?.wordsLearned || window.ProgressManager?.getLangProgress()?.mastered_words_ids?.length || 5;
        this.openSpeakingDashboard(totalLearned);
    },

    renderSpeakingLockedNotice(completed, remaining) {
        const targetView = document.getElementById('main-content-view');
        if (!targetView) return;

        targetView.innerHTML = `
            <div class="card-bg w-full p-6 sm:p-8 rounded-3xl border border-main shadow-md flex flex-col items-center gap-4 font-mono text-center">
                <div class="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl border border-amber-500/20 shadow-xs">
                    🔒
                </div>

                <div class="flex flex-col gap-1">
                    <span class="text-[9px] text-[#e06a4e] font-bold uppercase tracking-widest">// REQUISITO PREVIO</span>
                    <h3 class="font-black text-lg sm:text-xl text-main uppercase">Laboratorio de Speaking Bloqueado</h3>
                    <p class="text-xs text-muted leading-relaxed mt-1 max-w-sm">
                        Debes completar al menos <strong>3 lecciones</strong> en el mapa para activar las actividades de práctica oral.
                    </p>
                </div>

                <div class="w-full max-w-sm subcard-bg p-3.5 rounded-2xl border border-main flex items-center justify-between font-bold text-xs">
                    <span class="text-muted">Progreso actual:</span>
                    <span class="text-[#e06a4e]">${completed} / 3 lecciones (${remaining} restante${remaining > 1 ? 's' : ''})</span>
                </div>

                <button onclick="window.openHomeView()" 
                        class="w-full max-w-sm bg-[#23483f] hover:bg-[#19322b] text-white font-bold text-xs py-3.5 px-6 rounded-xl uppercase shadow-md transition-all active:scale-95 cursor-pointer mt-1">
                     Ir a las Lecciones del Mapa ➔
                </button>
            </div>
        `;
    },

    openSpeakingDashboard(totalLearned) {
        const targetView = document.getElementById('main-content-view');
        if (!targetView) return;

        const totalAvailableLessons = Math.max(2, Math.floor(totalLearned / 5) * 2);
        const completedSpeakingLevel = window.ProgressManager?.getLangProgress()?.completed_speaking_session || 0;

        targetView.innerHTML = `
            <div class="card-bg w-full p-4 sm:p-6 rounded-3xl border border-main shadow-md flex flex-col gap-4 font-mono">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-main/10 pb-3 gap-2">
                    <div class="text-left">
                        <span class="text-xs sm:text-sm font-bold text-main uppercase tracking-wider block">🎙️ LABORATORIO DE SPEAKING</span>
                        <span class="text-[10px] text-muted block">Practica tu pronunciación en sesiones orales de 3 minutos:</span>
                    </div>
                    <span class="text-[9px] font-mono subcard-bg px-2.5 py-1 rounded-full font-bold text-[#e06a4e] border border-main shrink-0">
                        +2 lecciones por cada 5 palabras
                    </span>
                </div>

                <div class="w-full">
                    <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4 justify-items-center my-2">
                        ${Array.from({ length: totalAvailableLessons }).map((_, idx) => {
                            const sessionNum = idx + 1;
                            const isUnlocked = sessionNum <= (completedSpeakingLevel + 1);
                            const isCompleted = sessionNum <= completedSpeakingLevel;

                            if (isUnlocked) {
                                return `
                                    <button onclick="window.SpeakingEngine.startSpeakingSession(${sessionNum},${totalLearned})" 
                                            class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${isCompleted ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-[#23483f] hover:bg-[#19322b]'} text-white flex flex-col items-center justify-center text-sm font-black shadow-md cursor-pointer transition-all active:scale-95 border border-main">
                                        <span class="text-[8px] opacity-80 uppercase">SESIÓN</span>
                                        <span class="text-base">${sessionNum}${isCompleted ? '✓' : ''}</span>
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
        `;
    },

    startSpeakingSession(sessionNum, totalLearned) {
        this.currentSessionNumber = sessionNum;

        // 🌐 Obtener el vocabulario construido dinámicamente según AppState.targetLanguage
        const dynamicDatabase = getVocabularyForTargetLang();
        const allWords = dynamicDatabase.slice(0, Math.max(5, totalLearned));
        const recent5 = allWords.slice(-5);
        const weightedPool = [...allWords, ...recent5, ...recent5];

        this.activeSessionWords = weightedPool.sort(() => 0.5 - Math.random()).slice(0, 8);
        this.currentLessonIndex = 0;
        this.lessonTimeRemaining = 180;

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
        const targetView = document.getElementById('main-content-view');

        if (!targetView) return;

        targetView.innerHTML = `
            <div class="card-bg w-full p-4 sm:p-6 rounded-3xl border border-main shadow-md flex flex-col gap-4 font-mono">
                <div class="flex justify-between items-center border-b border-main/10 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-xs sm:text-sm font-mono font-black uppercase text-[#23483f] dark:text-white">SPEAKING // SESIÓN ${this.currentSessionNumber}</span>
                        <span id="speaking-timer-display" class="text-xs font-mono bg-[#e06a4e] text-white px-2.5 py-0.5 rounded-full font-bold">3:00</span>
                    </div>
                    <button onclick="window.SpeakingEngine.exitSpeakingSession()" class="bg-[#23483f] hover:bg-[#19322b] text-white font-mono text-[9px] px-3 py-1.5 rounded-lg uppercase font-black cursor-pointer transition-all">
                        CAMBIAR SESIÓN ↩
                    </button>
                </div>

                <div class="flex flex-col items-center justify-center p-2 sm:p-4 text-center my-auto">
                    <div class="w-full max-w-xl subcard-bg p-5 sm:p-7 rounded-3xl border border-main shadow-xs flex flex-col gap-4 relative">
                        
                        <span class="text-[9px] font-mono font-bold text-muted uppercase tracking-wider">// ESCUCHA Y PRONUNCIA</span>

                        <button type="button" onclick="AudioEngine.speak('${targetWord}')" 
                                class="w-16 h-16 bg-[#23483f] hover:bg-[#19322b] text-white rounded-full mx-auto flex items-center justify-center shadow-md cursor-pointer active:scale-95 transition-all">
                            <i class="fa-solid fa-volume-high text-xl"></i>
                        </button>

                        <div>
                            <h3 class="title-brand text-2xl sm:text-3xl font-black text-main uppercase">"${targetWord}"</h3>
                            <p class="text-xs text-muted font-bold italic mt-1 font-sans">"${currentWord.spanish}"</p>
                        </div>

                        <div id="mic-status-container" class="card-bg border border-main p-4 rounded-2xl flex flex-col items-center gap-3 mt-1">
                            <span class="text-[9px] font-mono font-bold text-muted uppercase">// PRESIONA Y PRONUNCIA</span>
                            
                            <div class="relative flex items-center justify-center">
                                <div id="speaking-pulse-ring" class="hidden absolute w-24 h-24 rounded-full bg-amber-500/30 animate-ping"></div>
                                <button id="mic-listen-btn" onclick="window.SpeakingEngine.listenVoiceAnswer('${targetWord}')" 
                                        class="w-18 h-18 rounded-full bg-[#e06a4e] hover:bg-[#c8573b] text-white flex items-center justify-center text-2xl cursor-pointer shadow-xl transition-all active:scale-95 z-10 border-2 border-white/20">
                                    <i class="fa-solid fa-microphone"></i>
                                </button>
                            </div>
                            
                            <span id="speech-transcript-result" class="text-xs font-mono font-bold text-main min-h-[16px]"></span>
                        </div>
                    </div>
                </div>

                <div class="w-full bg-[#f1ede4] dark:bg-[#222d29] h-2 rounded-full overflow-hidden max-w-xl mx-auto shrink-0 mt-1">
                    <div class="bg-[#e06a4e] h-full transition-all duration-300" style="width: ${((180 - this.lessonTimeRemaining) / 180) * 100}%"></div>
                </div>
            </div>
        `;

        AudioEngine.speak(targetWord);
    },

    listenVoiceAnswer(expectedWord) {
        const resultEl = document.getElementById('speech-transcript-result');
        const micBtn = document.getElementById('mic-listen-btn');
        const pulseRing = document.getElementById('speaking-pulse-ring');

        if (micBtn) micBtn.className = "w-18 h-18 rounded-full bg-amber-500 text-white flex items-center justify-center text-2xl animate-pulse shadow-xl ring-4 ring-amber-400/50 z-10";
        if (pulseRing) pulseRing.classList.remove('hidden');
        if (resultEl) resultEl.textContent = "Escuchando...";

        startListening(
            (spokenText) => {
                if (micBtn) micBtn.className = "w-18 h-18 rounded-full bg-[#e06a4e] text-white flex items-center justify-center text-2xl shadow-xl z-10";
                if (pulseRing) pulseRing.classList.add('hidden');
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
                if (micBtn) micBtn.className = "w-18 h-18 rounded-full bg-[#e06a4e] text-white flex items-center justify-center text-2xl shadow-xl z-10";
                if (pulseRing) pulseRing.classList.add('hidden');
                if (resultEl) resultEl.textContent = "Error de micrófono.";
            }
        );
    },

    closeSpeakingModule() {
        stopListening();
        clearInterval(this.timerInterval);
        if (typeof window.openHomeView === 'function') {
            window.openHomeView();
        }
    },

    exitSpeakingSession() {
        stopListening();
        clearInterval(this.timerInterval);
        const totalLearned = window.AppState?.studentStats?.wordsLearned || window.ProgressManager?.getLangProgress()?.mastered_words_ids?.length || 0;
        this.openSpeakingDashboard(totalLearned);
    },

    endSpeakingSession() {
        stopListening();

        const langProgress = window.ProgressManager?.getLangProgress();
        if (langProgress) {
            const currentMax = langProgress.completed_speaking_session || 0;
            if (this.currentSessionNumber > currentMax) {
                langProgress.completed_speaking_session = this.currentSessionNumber;
                if (typeof window.ProgressManager.syncToSupabase === 'function') {
                    window.ProgressManager.syncToSupabase();
                }
            }
        }

        const targetView = document.getElementById('main-content-view');
        if (targetView) {
            targetView.innerHTML = `
                <div class="card-bg w-full p-6 rounded-3xl border border-main shadow-md flex flex-col items-center justify-center text-center font-mono">
                    <h3 class="text-lg font-black text-[#23483f] dark:text-emerald-400">🎙️ ¡SESIÓN ${this.currentSessionNumber} COMPLETADA!</h3>
                    <p class="text-muted text-xs mt-2">Has finalizado la sesión oral de 3 minutos. La siguiente lección ha sido desbloqueada.</p>
                    <button onclick="window.SpeakingEngine.exitSpeakingSession()" 
                            class="bg-[#23483f] hover:bg-[#19322b] text-white font-bold text-xs py-3.5 px-6 rounded-xl cursor-pointer uppercase mt-5 w-full max-w-xs shadow-md transition-all active:scale-95">
                        ↩️ Volver a las Lecciones
                    </button>
                </div>
            `;
            if (window.confetti) window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
    }
};

window.SpeakingEngine = SpeakingEngine;
export default SpeakingEngine;
