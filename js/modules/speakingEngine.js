// ==========================================================================
// 🎙️ SPEAKING ENGINE v1.0 - ALGORITMO PROGRESIVO DE PRÁCTICA ORAL
// ==========================================================================
import { VOCABULARY_DATABASE } from './database.js';
import { startListening, stopListening } from './speechEngine.js';

export const SpeakingEngine = {
    learnedWordsPool: [],
    activeSessionWords: [],
    currentLessonIndex: 0,
    lessonTimeRemaining: 300, // 5 minutos en segundos
    timerInterval: null,

    // Plantillas de Speaking exclusivamente orales
    speakingTemplates: ['Repeat', 'Repeat2', 'Say', 'Answer2', 'SentenceRepeater'],

    initSpeakingModule() {
        const totalLearned = window.AppState?.studentStats?.wordsLearned || 0;
    
        if (totalLearned < 10) {
            const remaining = 10 - totalLearned;
            window.showToast(`🔒 Módulo Bloqueado. Aprende ${remaining} palabra(s) más en Vocabulario para desbloquear.`, 'warning');
            return;
        }

        this.openSpeakingDashboard(totalLearned);
    },

    openSpeakingDashboard(totalLearned) {
        let modal = document.getElementById('speaking-dashboard-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'speaking-dashboard-modal';
            modal.className = "fixed inset-0 md:left-60 bg-[#f7f5f0] z-50 flex flex-col overflow-hidden text-[#1c2321] animate-fade-in p-4 sm:p-6 font-sans select-none";
            document.body.appendChild(modal);
        } else {
            modal.classList.remove('hidden');
        }

        // Cálculo de lecciones disponibles (2 lecciones a las 10 palabras + 2 por cada 5 adicionales)
        const bonusBlocks = Math.floor((totalLearned - 10) / 5);
        const totalAvailableLessons = 2 + (bonusBlocks * 2);

        modal.innerHTML = `
            <div class="w-full h-full flex flex-col justify-between relative">
                <div class="w-full flex justify-between items-center border-b border-[#e8e4d9] pb-4 z-20">
                    <div>
                        <span class="text-[8px] font-mono tracking-widest text-[#d97757] block font-bold uppercase">// PRÁCTICA ORAL PROGRESIVA</span>
                        <h2 class="title-brand font-black text-lg sm:text-xl text-[#1c2321] uppercase tracking-tight">
                            Laboratorio de Speaking
                        </h2>
                    </div>
                    <button onclick="document.getElementById('speaking-dashboard-modal').classList.add('hidden')" 
                            class="bg-[#2b3a35] hover:bg-[#1c2321] text-white font-mono text-[10px] tracking-widest uppercase font-black px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-2">
                        <span>SALIR</span> <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div class="flex-grow flex flex-col items-center justify-center w-full max-w-xl mx-auto my-auto z-10 text-center">
                    <div class="bg-white p-6 rounded-3xl border border-[#e8e4d9] shadow-sm w-full flex flex-col gap-4">
                        <span class="text-[9px] font-mono font-bold text-[#8a938e] uppercase tracking-wider">
                            PALABRAS APRENDIDAS: ${totalLearned} // LECCIONES DESBLOQUEADAS: ${totalAvailableLessons}
                        </span>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                            ${Array.from({ length: totalAvailableLessons }).map((_, idx) => `
                                <div onclick="window.SpeakingEngine.startSpeakingSession(${idx + 1}, ${totalLearned})" 
                                     class="bg-[#fcfbf9] hover:bg-[#fdf6f0] border border-[#e8e4d9] hover:border-[#d97757] p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between group text-left">
                                    <div>
                                        <span class="text-[8px] font-mono font-bold text-[#d97757] uppercase">// SESIÓN ${idx + 1}</span>
                                        <h4 class="font-black text-sm text-[#1c2321] uppercase mt-1">Lección de 5 Minutos</h4>
                                    </div>
                                    <span class="text-[9px] font-mono font-bold text-[#8a938e] group-hover:text-[#d97757] mt-3 block">INICIAR PRÁCTICA 🎙️ ➔</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    startSpeakingSession(sessionNum, totalLearned) {
        document.getElementById('speaking-dashboard-modal')?.classList.add('hidden');

        // Ponderar palabras: Seleccionar todas las palabras aprendidas hasta el momento
        const allLearnedWords = VOCABULARY_DATABASE.slice(0, totalLearned);
        
        // Las últimas 5 palabras tienen doble peso en el sorteo aleatorio
        const recent5 = allLearnedWords.slice(-5);
        const weightedPool = [...allLearnedWords, ...recent5, ...recent5];

        // Tomar muestra para la lección de 5 minutos
        this.activeSessionWords = weightedPool.sort(() => 0.5 - Math.random()).slice(0, 8);
        this.currentLessonIndex = 0;
        this.lessonTimeRemaining = 300;

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
            this.currentLessonIndex = 0; // Bucle de repaso continuo dentro de los 5 minutos
        }

        const currentWord = this.activeSessionWords[this.currentLessonIndex];
        const chosenTemplate = this.speakingTemplates[Math.floor(Math.random() * this.speakingTemplates.length)];
        const deck = document.getElementById('lesson-interactive-deck');

        if (!deck) return;

        deck.innerHTML = `
            <div class="w-full flex justify-between items-center border-b border-[#e8e4d9] pb-3 z-10">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-black uppercase text-[#2b3a35]">SPEAKING // MODALIDAD ORAL</span>
                    <span id="speaking-timer-display" class="text-xs font-mono bg-[#d97757] text-white px-2.5 py-0.5 rounded-full font-bold">5:00</span>
                </div>
                <button onclick="window.SpeakingEngine.exitSpeakingSession()" class="bg-[#2b3a35] hover:bg-[#1c2321] text-white font-mono text-[9px] px-3.5 py-2 rounded-xl uppercase font-black cursor-pointer flex items-center gap-1.5">
                    <span>SALIR</span> <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="flex-grow flex flex-col justify-center w-full max-w-xl mx-auto p-4 text-center">
                <div class="bg-white p-6 rounded-3xl border border-[#e8e4d9] shadow-sm flex flex-col gap-5 relative">
                    <span class="text-[8px] font-mono tracking-widest text-[#d97757] font-bold uppercase">// MÓDULO ${chosenTemplate}</span>

                    <button type="button" onclick="window.speakStrict('${currentWord.word}')" 
                            class="w-16 h-16 bg-[#2b3a35] text-white rounded-full mx-auto flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform">
                        <i class="fa-solid fa-volume-high text-xl"></i>
                    </button>

                    <div>
                        <h3 class="title-brand text-2xl font-black text-[#1c2321] uppercase">"${currentWord.word}"</h3>
                        <p class="text-xs text-[#8a938e] font-medium italic mt-1">${currentWord.spanish}</p>
                    </div>

                    <div id="mic-status-container" class="bg-[#fcfbf9] border border-[#e8e4d9] p-4 rounded-2xl flex flex-col items-center gap-3">
                        <span class="text-[10px] font-mono font-bold text-[#8a938e] uppercase">// PRESIONA Y PRONUNCIA EN INGLÉS</span>
                        
                        <button id="mic-listen-btn" onclick="window.SpeakingEngine.listenVoiceAnswer('${currentWord.word}')" 
                                class="w-16 h-16 rounded-full bg-[#d97757] hover:bg-[#c26548] text-white flex items-center justify-center text-xl cursor-pointer shadow-md transition-all active:scale-95">
                            <i class="fa-solid fa-microphone"></i>
                        </button>
                        
                        <span id="speech-transcript-result" class="text-xs font-mono font-bold text-[#1c2321] min-h-[16px]"></span>
                    </div>
                </div>
            </div>
        `;

        window.speakStrict(currentWord.word);
    },

    listenVoiceAnswer(expectedWord) {
        const resultEl = document.getElementById('speech-transcript-result');
        const micBtn = document.getElementById('mic-listen-btn');

        if (micBtn) micBtn.className = "w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center text-xl animate-pulse shadow-md";
        if (resultEl) resultEl.textContent = "Escuchando...";

        startListening(
            (spokenText) => {
                if (micBtn) micBtn.className = "w-16 h-16 rounded-full bg-[#d97757] text-white flex items-center justify-center text-xl shadow-md";
                if (resultEl) resultEl.textContent = `Dijiste: "${spokenText}"`;

                if (spokenText.toLowerCase().includes(expectedWord.toLowerCase())) {
                    window.speakStrict("Great pronunciation!");
                    if (resultEl) resultEl.className = "text-xs font-mono font-bold text-[#3a7d6e]";
                    setTimeout(() => {
                        this.currentLessonIndex++;
                        this.renderSpeakingQuestion();
                    }, 1200);
                } else {
                    window.speakStrict("Try again");
                    if (resultEl) resultEl.className = "text-xs font-mono font-bold text-rose-500";
                }
            },
            (error) => {
                if (micBtn) micBtn.className = "w-16 h-16 rounded-full bg-[#d97757] text-white flex items-center justify-center text-xl shadow-md";
                if (resultEl) resultEl.textContent = "Error al activar micrófono.";
            }
        );
    },

    exitSpeakingSession() {
        stopListening();
        clearInterval(this.timerInterval);
        document.getElementById('lesson-interactive-deck')?.classList.add('hidden');
    },

    endSpeakingSession() {
        stopListening();
        const deck = document.getElementById('lesson-interactive-deck');
        if (deck) {
            deck.innerHTML = `
                <div class="flex-grow flex flex-col items-center justify-center p-4">
                    <div class="bg-white p-6 rounded-3xl border border-[#e8e4d9] shadow-xl max-w-sm w-full text-center font-mono">
                        <h3 class="text-base font-black text-[#3a7d6e]">🎙️ ¡TIEMPO COMPLETADO!</h3>
                        <p class="text-[#525b56] text-[10px] mt-1">Has finalizado tu sesión de Speaking de 5 minutos.</p>
                        <button onclick="window.SpeakingEngine.exitSpeakingSession()" class="bg-[#2b3a35] text-white font-bold text-[10px] py-3.5 px-6 rounded-xl cursor-pointer uppercase mt-5 w-full shadow-md">
                            ↩️ VOLVER AL DASHBOARD
                        </button>
                    </div>
                </div>
            `;
            if (window.confetti) window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
    }
};

window.SpeakingEngine = SpeakingEngine;