// ==========================================================================
// ⚡ LUKES ACADEMY - CHALLENGES ENGINE (SPACED REPETITION ARENA)
// ==========================================================================
import { VOCABULARY_DATABASE } from './database.js';
import { ProgressManager } from './progressManager.js';

export const ChallengesEngine = {
    activeQueue: [],
    currentIndex: 0,
    totalQuestions: 0,
    correctHits: 0,
    totalErrors: 0,
    typedAnswer: '',

    // 1. Inicializar el Desafío Diario (Sesión Exprés ~3 min, 100% Produce)
    startDailyChallenge() {
        const todayStr = new Date().toISOString().split('T')[0];
        const scheduledIds = ProgressManager.getTodayScheduledItems();
        
        const allSpaced = ProgressManager.state.spaced_repetition;
        const lowIds = allSpaced.low || [];
        const mediumIds = allSpaced.medium || [];
        const highIds = allSpaced.high || [];

        // Algoritmo 80/20: 80% vulnerables/programadas de hoy, 20% maestría/mantenimiento
        let priorityPoolIds = [...new Set([...scheduledIds, ...lowIds, ...mediumIds])];
        
        // Si no hay suficientes palabras vulnerables, tomar del banco general de vocabulario
        if (priorityPoolIds.length < 4) {
            const fallbackIds = VOCABULARY_DATABASE.slice(0, 10).map(w => w.id);
            priorityPoolIds = [...new Set([...priorityPoolIds, ...fallbackIds])];
        }

        // Selección de la muestra (5 ejercicios intensivos)
        const targetCount = 5;
        const priorityCount = Math.ceil(targetCount * 0.8); // 4 ejercicios vulnerables
        const highCount = targetCount - priorityCount;       // 1 ejercicio de mantenimiento

        const selectedPriority = priorityPoolIds.sort(() => 0.5 - Math.random()).slice(0, priorityCount);
        const selectedHigh = highIds.sort(() => 0.5 - Math.random()).slice(0, highCount);

        let finalSelectedIds = [...selectedPriority, ...selectedHigh];

        // Rellenar si la muestra aún es menor a 5
        if (finalSelectedIds.length < targetCount) {
            const extra = VOCABULARY_DATABASE.map(w => w.id)
                .filter(id => !finalSelectedIds.includes(id))
                .sort(() => 0.5 - Math.random())
                .slice(0, targetCount - finalSelectedIds.length);
            finalSelectedIds = [...finalSelectedIds, ...extra];
        }

        // Construir la cola en formato 100% PRODUCE
        this.activeQueue = finalSelectedIds.map(id => {
            const wordObj = VOCABULARY_DATABASE.find(w => w.id === id) || VOCABULARY_DATABASE[0];
            return {
                id: wordObj.id,
                word: wordObj.word,
                spanish: wordObj.spanish,
                media_url: wordObj.hasImage !== false ? wordObj.media_url : null
            };
        });

        this.currentIndex = 0;
        this.correctHits = 0;
        this.totalErrors = 0;
        this.totalQuestions = this.activeQueue.length;

        this.renderChallengeArena();
    },

    // 2. Renderizado de la Interfaz de Desafío
    renderChallengeArena() {
        let deck = document.getElementById('lesson-interactive-deck');
        if (!deck) {
            deck = document.createElement('div');
            deck.id = 'lesson-interactive-deck';
            deck.className = "fixed inset-0 bg-[#f7f5f0] z-50 flex flex-col p-3 sm:p-6 overflow-hidden select-none";
            document.body.appendChild(deck);
        } else {
            deck.classList.remove('hidden');
        }

        if (this.currentIndex >= this.activeQueue.length) {
            this.finishChallengeSession();
            return;
        }

        const currentItem = this.activeQueue[this.currentIndex];
        this.typedAnswer = '';

        deck.innerHTML = `
            <!-- Cabecera de Desafío -->
            <div class="w-full flex justify-between items-center border-b border-[#e8e4d9] pb-3 z-10 shrink-0">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-black uppercase text-[#d97757]">
                        ⚡ DESAFÍO DIARIO // ${this.currentIndex + 1}/${this.totalQuestions}
                    </span>
                    <span class="text-[9px] font-mono bg-[#f0e3ce] px-2 py-0.5 rounded-full font-bold text-[#8c503e]">
                        PRODUCE 100%
                    </span>
                </div>
                <button onclick="window.ChallengesEngine.exitChallenge()" class="bg-[#2b3a35] hover:bg-[#1c2321] text-white font-mono text-[9px] px-2.5 py-1.5 rounded-lg uppercase font-black cursor-pointer flex items-center gap-1">
                    <span>SALIR</span> <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <!-- Tarjeta Central de Producción Directa -->
            <div class="flex-grow flex flex-col justify-center w-full max-w-xl mx-auto my-auto p-2 sm:p-4 text-center overflow-y-auto custom-scrollbar">
                <div class="bg-white p-4 sm:p-6 rounded-3xl border border-[#e8e4d9] shadow-xs flex flex-col gap-4 relative my-auto">
                    
                    ${currentItem.media_url ? `<img src="${currentItem.media_url}" class="w-20 h-20 mx-auto object-contain my-1" onerror="this.remove()">` : ''}

                    <div class="leading-tight">
                        <span class="text-[9px] font-mono font-bold text-[#8a938e] uppercase tracking-wider block">// TRADUCE AL INGLÉS:</span>
                        <h3 class="title-brand text-lg sm:text-2xl font-black text-[#1c2321] uppercase tracking-wide mt-1">
                            "${currentItem.spanish}"
                        </h3>
                    </div>

                    <div class="flex items-center justify-center gap-2 my-1">
                        <button type="button" onclick="window.speakStrict('${currentItem.word}', 0.8)" class="w-10 h-10 bg-[#2b3a35] text-white rounded-full flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all">
                            <i class="fa-solid fa-volume-high text-sm"></i>
                        </button>
                        <button type="button" onclick="window.speakStrict('${currentItem.word}', 0.45)" class="w-8 h-8 bg-[#e8e4d9] text-[#2b3a35] rounded-full flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all" title="Escuchar lento">
                            <span class="text-xs">🐢</span>
                        </button>
                    </div>

                    <div class="flex flex-col gap-2">
                        <input type="text" id="challenge-input" autocomplete="off" placeholder="Escribe en inglés..." 
                               oninput="window.ChallengesEngine.handleInput(this.value)"
                               class="w-full bg-[#fcfbf9] border border-[#e8e4d9] rounded-xl p-3 text-center font-mono text-sm font-bold text-[#1c2321] focus:outline-none focus:border-[#d97757]">
                    </div>

                    <button id="challenge-check-btn" disabled onclick="window.ChallengesEngine.checkAnswer()" 
                            class="w-full mt-2 bg-[#e8e4d9] text-[#8a938e] font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider transition-all cursor-not-allowed">
                        Comprobar Respuesta ➔
                    </button>
                </div>
            </div>

            <!-- Barra de Progreso Inferior -->
            <div class="w-full bg-[#e8e4d9] h-2 rounded-full overflow-hidden max-w-xl mx-auto shrink-0 mt-2">
                <div class="bg-[#d97757] h-full transition-all duration-300" style="width: ${((this.currentIndex + 1) / this.totalQuestions) * 100}%"></div>
            </div>
        `;

        setTimeout(() => {
            const input = document.getElementById('challenge-input');
            if (input) input.focus();
        }, 100);
    },

    handleInput(val) {
        this.typedAnswer = val.trim();
        const btn = document.getElementById('challenge-check-btn');
        if (!btn) return;

        if (this.typedAnswer.length > 0) {
            btn.disabled = false;
            btn.className = "w-full mt-2 bg-[#d97757] hover:bg-[#c26548] text-white font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-98";
        } else {
            btn.disabled = true;
            btn.className = "w-full mt-2 bg-[#e8e4d9] text-[#8a938e] font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider cursor-not-allowed";
        }
    },

    // 3. Validación y Reagendamiento en el JSON de Repetición Espaciada
    checkAnswer() {
        const item = this.activeQueue[this.currentIndex];
        const isCorrect = this.typedAnswer.toLowerCase() === item.word.toLowerCase();
        const btn = document.getElementById('challenge-check-btn');

        const now = new Date();
        let addDays = 1;

        if (isCorrect) {
            this.correctHits++;
            if (btn) {
                btn.className = "w-full mt-2 bg-[#3a7d6e] text-white font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider shadow-md";
                btn.innerText = "¡EXCELENTE! ✓";
            }
            window.speakStrict("Excellent!", 0.9);

            // Acierto: Promover nivel e incrementar intervalo (Bajo: +5 días, Med: +15 días, Alto: +20 días)
            const sr = ProgressManager.state.spaced_repetition;
            if (sr.low.includes(item.id)) {
                addDays = 5;
                ProgressManager.updateSpacedRepetition(item.id, 'medium', this.getFutureDateStr(addDays));
            } else if (sr.medium.includes(item.id)) {
                addDays = 15;
                ProgressManager.updateSpacedRepetition(item.id, 'high', this.getFutureDateStr(addDays));
            } else {
                addDays = 20;
                ProgressManager.updateSpacedRepetition(item.id, 'high', this.getFutureDateStr(addDays));
            }
        } else {
            this.totalErrors++;
            if (btn) {
                btn.className = "w-full mt-2 bg-rose-500 text-white font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider animate-shake";
                btn.innerText = `INCORRECTO - ERA: "${item.word}"`;
            }

            // Fallo: Reiniciar palabra al Nivel Bajo y agendar para mañana
            ProgressManager.updateSpacedRepetition(item.id, 'low', this.getFutureDateStr(1));
        }

        setTimeout(() => {
            this.currentIndex++;
            this.renderChallengeArena();
        }, 1200);
    },

    getFutureDateStr(days) {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    },

    exitChallenge() {
        const deck = document.getElementById('lesson-interactive-deck');
        if (deck) deck.classList.add('hidden');
    },

    // 4. Reporte Final de Desafío y Recompensa por Tramos del 20%
    finishChallengeSession() {
        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        const accuracy = (this.correctHits / this.totalQuestions) * 100;

        // Recompensa de Patitas de Gato por tramos cerrados del 20%
        let pawsEarned = 0;
        if (accuracy >= 100) pawsEarned = 5;
        else if (accuracy >= 80) pawsEarned = 4;
        else if (accuracy >= 60) pawsEarned = 3;
        else if (accuracy >= 40) pawsEarned = 2;
        else if (accuracy >= 20) pawsEarned = 1;

        // Actualizar estadísticas globales
        ProgressManager.addPaws(pawsEarned);
        ProgressManager.state.stats.challengesCompleted = (ProgressManager.state.stats.challengesCompleted || 0) + 1;
        
        // Sincronización silenciosa con Supabase
        ProgressManager.syncToSupabase();

        deck.innerHTML = `
            <div class="flex-grow flex flex-col items-center justify-center p-4">
                <div class="bg-white p-6 rounded-3xl border border-[#e8e4d9] shadow-xl max-w-sm w-full text-center font-mono">
                    <span class="text-[8px] text-[#8a938e] font-bold tracking-widest block uppercase mb-1">// DESAFÍO DIARIO COMPLETADO //</span>
                    <h3 class="text-base font-black text-[#d97757] mt-2">⚡ ARENA DE REPETICIÓN</h3>
                    
                    <div class="my-4 bg-[#fcfbf9] p-3 rounded-2xl border border-[#e8e4d9]">
                        <div class="text-[10px] font-bold text-[#525b56]">PRECISIÓN: ${accuracy.toFixed(1)}%</div>
                        <div class="text-xs font-black text-[#d97757] mt-1 flex items-center justify-center gap-1">
                            <span>+${pawsEarned}</span>
                            <span class="text-base">🐾</span>
                            <span>PATITAS DE GATO</span>
                        </div>
                    </div>

                    <p class="text-[#525b56] text-[10px]">Calendario de repetición espaciada actualizado en tu memoria local.</p>
                    <button onclick="window.ChallengesEngine.exitChallenge()" class="bg-[#2b3a35] text-white font-bold text-[10px] py-3.5 px-6 rounded-xl cursor-pointer uppercase mt-4 w-full shadow-md">
                        ↩️ REGRESAR AL DISTRITO
                    </button>
                </div>
            </div>
        `;

        if (window.confetti) window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
};

window.ChallengesEngine = ChallengesEngine;