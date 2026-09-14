// ==========================================================================
// ⚡ LUKES ACADEMY - CHALLENGES & REAL GAMES ENGINE v4.3 (TEMPORIZADOR & SILENT SEQUENCE)
// ==========================================================================
import { VOCABULARY_DATABASE } from './database.js';
import { ProgressManager } from './progressManager.js';
import { AudioEngine } from './audioEngine.js';

export const ChallengesEngine = {
    activeQueue: [],
    currentIndex: 0,
    totalQuestions: 0,
    correctHits: 0,
    consecutiveErrors: 0,
    lives: 3,
    typedAnswer: '',
    activeChallengeType: null,
    challengeTimeRemaining: 120, // 2 minutos por desafío
    timerInterval: null,

    getLearnedWordsPool() {
        const masteredIds = ProgressManager?.state?.mastered_words_ids || [];
        const wordsLearnedCount = ProgressManager?.state?.stats?.wordsLearned || 0;

        let learned = VOCABULARY_DATABASE.filter(w => masteredIds.includes(w.id));
        
        if (learned.length === 0 && wordsLearnedCount > 0) {
            learned = VOCABULARY_DATABASE.slice(0, Math.max(5, wordsLearnedCount));
        }

        return learned;
    },

    openChallengesHub() {
        this.stopTimer();
        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        deck.classList.remove('hidden');
        const userPaws = ProgressManager?.state?.stats?.paws || 0;
        const learnedWords = this.getLearnedWordsPool();
        const imageWordsCount = learnedWords.filter(w => w.hasImage !== false && !!w.media_url).length;

        deck.innerHTML = `
            <div class="w-full flex justify-between items-center border-b border-main pb-3 z-10 shrink-0 font-mono">
                <div class="flex items-center gap-2">
                    <span class="text-sm font-black uppercase text-[#23483f] dark:text-white">
                        ⚡ ARENA DE DESAFÍOS Y JUEGOS
                    </span>
                    <span class="text-[10px] subcard-bg px-2.5 py-0.5 rounded-full font-bold text-[#e06a4e] border border-main flex items-center gap-1">
                        <span>🐾</span> <span id="hub-paws-counter">${userPaws} PAWS</span>
                    </span>
                </div>
                <button onclick="window.ChallengesEngine.closeEngine()" 
                        class="bg-[#23483f] hover:bg-[#19322b] text-white text-[9px] px-3.5 py-1.5 rounded-lg uppercase font-black cursor-pointer transition-all">
                    SALIR ✕
                </button>
            </div>

            <div class="flex-grow flex flex-col justify-start sm:justify-center w-full max-w-4xl mx-auto my-auto p-2 sm:p-4 overflow-hidden">
                <div class="card-bg w-full h-full sm:h-auto max-h-[82vh] p-4 sm:p-6 rounded-3xl border border-main shadow-md flex flex-col gap-5 relative font-mono overflow-y-auto custom-scrollbar">
                    
                    <div class="flex flex-col gap-2.5 border-b border-main/10 pb-4">
                        <div class="text-left">
                            <span class="text-xs font-bold text-main uppercase tracking-wider block">DESAFÍOS DIARIOS DE HOY (3)</span>
                            <span class="text-[10px] text-muted block">Gana Paws demostrando el nivel de retención de tus palabras aprendidas:</span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                            <div onclick="window.ChallengesEngine.startDailyChallenge('lesson_a')" 
                                 class="subcard-bg border border-main hover:border-[#e06a4e] p-3.5 rounded-2xl cursor-pointer transition-all flex justify-between items-center group">
                                <div class="text-left">
                                    <span class="text-[8px] font-mono font-bold text-[#e06a4e] uppercase">// DESAFÍO 1</span>
                                    <h4 class="font-black text-xs text-main uppercase mt-0.5">Lección Exprés 1</h4>
                                    <p class="text-[9px] text-muted">Acierta 10 palabras aprendidas</p>
                                </div>
                                <span class="text-base group-hover:scale-110 transition-transform">🎯</span>
                            </div>

                            <div onclick="window.ChallengesEngine.startDailyChallenge('lesson_b')" 
                                 class="subcard-bg border border-main hover:border-[#e06a4e] p-3.5 rounded-2xl cursor-pointer transition-all flex justify-between items-center group">
                                <div class="text-left">
                                    <span class="text-[8px] font-mono font-bold text-[#e06a4e] uppercase">// DESAFÍO 2</span>
                                    <h4 class="font-black text-xs text-main uppercase mt-0.5">Lección Exprés 2</h4>
                                    <p class="text-[9px] text-muted">Reto de precisión escrita</p>
                                </div>
                                <span class="text-base group-hover:scale-110 transition-transform">✍️</span>
                            </div>

                            <div onclick="window.ChallengesEngine.startRandomGameChallenge()" 
                                 class="subcard-bg border border-main hover:border-[#e06a4e] p-3.5 rounded-2xl cursor-pointer transition-all flex justify-between items-center group">
                                <div class="text-left">
                                    <span class="text-[8px] font-mono font-bold text-[#e06a4e] uppercase">// DESAFÍO 3</span>
                                    <h4 class="font-black text-xs text-main uppercase mt-0.5">Juego Diario</h4>
                                    <p class="text-[9px] text-muted">Reto al azar sin costo de Paws</p>
                                </div>
                                <span class="text-base group-hover:scale-110 transition-transform">🎲</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2.5">
                        <div class="text-left flex justify-between items-center">
                            <div>
                                <span class="text-xs font-bold text-main uppercase tracking-wider block">🎮 MINIJUEGOS (SIN TIEMPO NI PRISA)</span>
                                <span class="text-[10px] text-muted block">Juega libremente pagando con Paws. Sin recompensas monetarias.</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            <button onclick="window.ChallengesEngine.launchWordSearchGame(3)" 
                                    class="subcard-bg border border-main hover:bg-[#23483f] hover:text-white p-3 rounded-2xl flex flex-col items-center gap-1 cursor-pointer transition-all text-center">
                                <span class="text-lg">🔍</span>
                                <span class="font-black text-[10px] uppercase">Sopa de Letras</span>
                                <span class="text-[8px] text-amber-600 dark:text-amber-400 font-bold">COSTO: 3 PAWS</span>
                            </button>

                            ${imageWordsCount >= 5 ? `
                                <button onclick="window.ChallengesEngine.launchCrosswordGame(3)" 
                                        class="subcard-bg border border-main hover:bg-[#23483f] hover:text-white p-3 rounded-2xl flex flex-col items-center gap-1 cursor-pointer transition-all text-center">
                                    <span class="text-lg">🧩</span>
                                    <span class="font-black text-[10px] uppercase">Crucigrama</span>
                                    <span class="text-[8px] text-amber-600 dark:text-amber-400 font-bold">COSTO: 3 PAWS</span>
                                </button>
                            ` : `
                                <div class="bg-gray-100 dark:bg-zinc-800/40 border border-main/20 p-3 rounded-2xl flex flex-col items-center gap-1 opacity-50 cursor-not-allowed text-center">
                                    <span class="text-lg">🔒</span>
                                    <span class="font-black text-[10px] uppercase">Crucigrama</span>
                                    <span class="text-[7px] text-muted">Aprende 5 palabras con imagen (${imageWordsCount}/5)</span>
                                </div>
                            `}

                            <button onclick="window.ChallengesEngine.launchHangmanGame(2)" 
                                    class="subcard-bg border border-main hover:bg-[#23483f] hover:text-white p-3 rounded-2xl flex flex-col items-center gap-1 cursor-pointer transition-all text-center">
                                <span class="text-lg">🔤</span>
                                <span class="font-black text-[10px] uppercase">Ahorcado</span>
                                <span class="text-[8px] text-amber-600 dark:text-amber-400 font-bold">COSTO: 2 PAWS</span>
                            </button>

                            ${imageWordsCount >= 4 ? `
                                <button onclick="window.ChallengesEngine.launchMemoryGame(1)" 
                                        class="subcard-bg border border-main hover:bg-[#23483f] hover:text-white p-3 rounded-2xl flex flex-col items-center gap-1 cursor-pointer transition-all text-center">
                                    <span class="text-lg">🃏</span>
                                    <span class="font-black text-[10px] uppercase">Memorama</span>
                                    <span class="text-[8px] text-amber-600 dark:text-amber-400 font-bold">COSTO: 1 PAW</span>
                                </button>
                            ` : `
                                <div class="bg-gray-100 dark:bg-zinc-800/40 border border-main/20 p-3 rounded-2xl flex flex-col items-center gap-1 opacity-50 cursor-not-allowed text-center">
                                    <span class="text-lg">🔒</span>
                                    <span class="font-black text-[10px] uppercase">Memorama</span>
                                    <span class="text-[7px] text-muted">Aprende 4 palabras con imagen (${imageWordsCount}/4)</span>
                                </div>
                            `}
                        </div>
                    </div>

                </div>
            </div>
        `;
    },

    startDailyChallenge(type) {
        const learnedWords = this.getLearnedWordsPool();

        if (learnedWords.length < 3) {
            if (typeof window.showToast === 'function') {
                window.showToast("🔒 Completa primero tus primeras lecciones en el Mapa para generar Desafíos.", "warning");
            }
            return;
        }

        this.activeChallengeType = type;
        const selected = [...learnedWords].sort(() => 0.5 - Math.random()).slice(0, 10);

        this.activeQueue = selected.map(w => ({
            id: w.id,
            word: w.word || w.english_word,
            spanish: w.spanish,
            media_url: w.hasImage !== false ? w.media_url : null
        }));

        this.currentIndex = 0;
        this.correctHits = 0;
        this.consecutiveErrors = 0;
        this.lives = 3;
        this.totalQuestions = this.activeQueue.length;
        this.challengeTimeRemaining = 120;

        this.startTimer();
        this.renderChallengeQuestion();
    },

    startRandomGameChallenge() {
        const games = ['wordsearch', 'hangman'];
        const randomGame = games[Math.floor(Math.random() * games.length)];
        if (randomGame === 'wordsearch') this.launchWordSearchGame(0);
        else this.launchHangmanGame(0);
    },

    startTimer() {
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            this.challengeTimeRemaining--;
            const timerEl = document.getElementById('challenge-timer-display');
            if (timerEl) {
                const mins = Math.floor(this.challengeTimeRemaining / 60);
                const secs = this.challengeTimeRemaining % 60;
                timerEl.textContent = `⏱️ ${mins}:${secs < 10 ? '0' : ''}${secs}`;
            }

            if (this.challengeTimeRemaining <= 0) {
                this.stopTimer();
                this.finishChallengeSession();
            }
        }, 1000);
    },

    stopTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
    },

    renderChallengeQuestion() {
        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        if (this.currentIndex >= this.activeQueue.length) {
            this.stopTimer();
            this.finishChallengeSession();
            return;
        }

        const currentItem = this.activeQueue[this.currentIndex];
        this.typedAnswer = '';

        const catsHtml = Array.from({ length: 3 }).map((_, idx) => idx < this.lives ? '🐱' : '💀').join(' ');
        const mins = Math.floor(this.challengeTimeRemaining / 60);
        const secs = this.challengeTimeRemaining % 60;

        deck.innerHTML = `
            <div class="w-full flex justify-between items-center border-b border-main pb-2 z-10 shrink-0 font-mono">
                <div class="flex items-center gap-3">
                    <span class="text-xs font-black uppercase text-[#23483f] dark:text-white">DESAFÍO ${this.currentIndex + 1}/${this.totalQuestions}</span>
                    
                    <!-- TEMPORIZADOR VISIBLE DESTACADO -->
                    <span id="challenge-timer-display" class="text-xs bg-[#e06a4e] text-white px-3 py-1 rounded-full font-black shadow-xs">
                        ⏱️ ${mins}:${secs < 10 ? '0' : ''}${secs}
                    </span>

                    <span class="text-xs subcard-bg border border-main px-2 py-0.5 rounded-full font-bold">
                        ${catsHtml}
                    </span>
                </div>
                <button onclick="window.ChallengesEngine.openChallengesHub()" class="bg-[#23483f] text-white text-[9px] px-3 py-1.5 rounded-lg uppercase font-black cursor-pointer">
                    SALIR ✕
                </button>
            </div>

            <div class="flex-grow flex flex-col justify-center w-full max-w-xl mx-auto my-auto p-2 sm:p-4 text-center font-mono">
                <div id="exercise-card-container" class="card-bg p-5 sm:p-7 rounded-3xl border border-main shadow-xs flex flex-col gap-4 relative">
                    
                    <span class="text-[9px] font-bold text-muted uppercase tracking-wider block">// ESCUCHA Y ESCRIBE EN INGLÉS:</span>

                    ${currentItem.media_url ? `<img src="${currentItem.media_url}" class="w-24 h-24 mx-auto object-contain my-1" onerror="this.remove()">` : ''}

                    <div class="flex items-center justify-center gap-2 my-1">
                        <button type="button" onclick="AudioEngine.speak('${currentItem.word}')" class="w-14 h-14 bg-[#23483f] hover:bg-[#19322b] text-white rounded-full flex items-center justify-center shadow-md cursor-pointer active:scale-95 transition-all">
                            <i class="fa-solid fa-volume-high text-lg"></i>
                        </button>
                    </div>

                    <div class="flex flex-col gap-2">
                        <input type="text" id="challenge-input" autocomplete="off" placeholder="Escribe la palabra escuchada..." 
                               oninput="window.ChallengesEngine.handleInput(this.value)"
                               onkeypress="if(event.key==='Enter' && !document.getElementById('challenge-check-btn').disabled) window.ChallengesEngine.checkAnswer()"
                               class="w-full subcard-bg border border-main rounded-xl p-3.5 text-center font-mono text-sm font-bold text-main focus:outline-none focus:border-[#e06a4e]">
                    </div>

                    <button id="challenge-check-btn" disabled onclick="window.ChallengesEngine.checkAnswer()" 
                            class="w-full mt-2 subcard-bg text-muted font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider transition-all cursor-not-allowed">
                        Comprobar Respuesta ➔
                    </button>
                </div>
            </div>
        `;

        AudioEngine.speak(currentItem.word);
        setTimeout(() => document.getElementById('challenge-input')?.focus(), 100);
    },

    handleInput(val) {
        this.typedAnswer = val.trim();
        const btn = document.getElementById('challenge-check-btn');
        if (!btn) return;

        if (this.typedAnswer.length > 0) {
            btn.disabled = false;
            btn.className = "w-full mt-2 bg-[#e06a4e] hover:bg-[#c8573b] text-white font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-98";
        } else {
            btn.disabled = true;
            btn.className = "w-full mt-2 subcard-bg text-muted font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider cursor-not-allowed";
        }
    },

    checkAnswer() {
        const item = this.activeQueue[this.currentIndex];
        const isCorrect = this.typedAnswer.toLowerCase() === item.word.toLowerCase();
        const btn = document.getElementById('challenge-check-btn');

        if (isCorrect) {
            this.correctHits++;
            this.consecutiveErrors = 0;
            if (btn) {
                btn.className = "w-full mt-2 bg-[#23483f] text-white font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider shadow-md";
                btn.innerText = "¡CORRECTO! ✓";
            }

            // Transición limpia sin locución "great"
            setTimeout(() => {
                this.currentIndex++;
                this.renderChallengeQuestion();
            }, 600);
        } else {
            this.consecutiveErrors++;
            this.lives--;

            if (btn) {
                btn.className = "w-full mt-2 bg-rose-500 text-white font-mono text-xs font-black py-3 rounded-xl uppercase tracking-wider animate-shake";
                btn.innerText = `INCORRECTO - ERA: "${item.word}"`;
            }

            if (this.lives <= 0) {
                this.stopTimer();
                setTimeout(() => this.promptContinueForPaws(), 900);
                return;
            }

            setTimeout(() => {
                this.currentIndex++;
                this.renderChallengeQuestion();
            }, 1100);
        }
    },

    promptContinueForPaws() {
        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        deck.innerHTML = `
            <div class="flex-grow flex flex-col items-center justify-center p-4 font-mono">
                <div class="card-bg p-6 rounded-3xl border border-main shadow-2xl max-w-sm w-full text-center">
                    <span class="text-3xl block mb-2">🙀</span>
                    <h3 class="text-lg font-black text-rose-500">¡HAS PERDIDO TUS 3 GATITOS!</h3>
                    <p class="text-muted text-xs mt-2 leading-relaxed">¿Deseas pagar 5 Paws para restaurar tus gatitos y continuar este desafío?</p>
                    
                    <div class="flex flex-col gap-2 mt-5">
                        <button onclick="window.ChallengesEngine.payToContinue()" 
                                class="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs py-3.5 px-4 rounded-xl cursor-pointer uppercase w-full shadow-md transition-all active:scale-95">
                            🐾 Continuar por 5 Paws
                        </button>
                        <button onclick="window.ChallengesEngine.openChallengesHub()" 
                                class="subcard-bg text-main border border-main font-bold text-xs py-3 px-4 rounded-xl cursor-pointer uppercase w-full transition-all">
                            Reiniciar Desafío
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    payToContinue() {
        const userPaws = ProgressManager?.state?.stats?.paws || 0;
        if (userPaws < 5) {
            if (typeof window.showToast === 'function') {
                window.showToast("No tienes suficientes Paws (requieres 5).", "warning");
            }
            return;
        }

        ProgressManager.addPaws(-5);
        this.lives = 3;
        this.consecutiveErrors = 0;
        if (typeof window.showToast === 'function') {
            window.showToast("¡Vidas restauradas! -5 Paws.", "success");
        }
        this.startTimer();
        this.renderChallengeQuestion();
    },

    finishChallengeSession() {
        this.stopTimer();
        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        const accuracy = Math.round((this.correctHits / this.totalQuestions) * 100);
        let pawsEarned = 0;

        if (accuracy >= 100) pawsEarned = 5;
        else if (accuracy >= 80) pawsEarned = 4;
        else if (accuracy >= 60) pawsEarned = 3;
        else if (accuracy >= 40) pawsEarned = 2;
        else if (accuracy >= 20) pawsEarned = 1;

        ProgressManager.addPaws(pawsEarned);
        ProgressManager.state.stats.challengesCompleted = (ProgressManager.state.stats.challengesCompleted || 0) + 1;
        ProgressManager.syncToSupabase();

        deck.innerHTML = `
            <div class="flex-grow flex flex-col items-center justify-center p-4 font-mono">
                <div class="card-bg p-6 rounded-3xl border border-main shadow-2xl max-w-sm w-full text-center">
                    <span class="text-[9px] text-muted font-bold tracking-widest block uppercase mb-1">// DESAFÍO COMPLETADO //</span>
                    <h3 class="text-lg font-black text-[#23483f] dark:text-emerald-400 mt-1">🏆 DESEMPEÑO: ${accuracy}%</h3>
                    
                    <div class="my-4 subcard-bg p-3.5 rounded-2xl border border-main flex flex-col gap-2">
                        <span class="text-[10px] text-muted font-bold uppercase">RECOMPENSA DE DESEMPEÑO</span>
                        <span class="text-xl font-black text-[#e06a4e]">+${pawsEarned} PAWS 🐾</span>
                    </div>

                    <button onclick="window.ChallengesEngine.openChallengesHub()" 
                            class="bg-[#23483f] hover:bg-[#19322b] text-white font-bold text-xs py-3.5 px-6 rounded-xl cursor-pointer uppercase w-full shadow-md transition-all active:scale-95">
                        ↩️ Volver a la Arena
                    </button>
                </div>
            </div>
        `;

        if (window.confetti) window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    },

    launchWordSearchGame(cost) {
        this.stopTimer();
        const userPaws = ProgressManager?.state?.stats?.paws || 0;
        if (cost > 0 && userPaws < cost) {
            if (typeof window.showToast === 'function') window.showToast(`Requiere ${cost} Paws para jugar.`, 'warning');
            return;
        }

        if (cost > 0) ProgressManager.addPaws(-cost);

        const learnedWords = this.getLearnedWordsPool();
        const targetWords = [...learnedWords].sort(() => 0.5 - Math.random()).slice(0, 7).map(w => (w.word || w.english_word).toUpperCase().replace(/[^A-Z]/g, ''));

        if (targetWords.length < 3) {
            if (typeof window.showToast === 'function') window.showToast("Aprende al menos 3 palabras en el Mapa para generar la Sopa de Letras.", "warning");
            return;
        }

        const gridSize = 10;
        let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));

        targetWords.forEach(word => {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 100) {
                attempts++;
                const isHoriz = Math.random() > 0.5;
                const row = Math.floor(Math.random() * (isHoriz ? gridSize : gridSize - word.length));
                const col = Math.floor(Math.random() * (isHoriz ? gridSize - word.length : gridSize));

                let fits = true;
                for (let i = 0; i < word.length; i++) {
                    const r = isHoriz ? row : row + i;
                    const c = isHoriz ? col + i : col;
                    if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
                        fits = false;
                        break;
                    }
                }

                if (fits) {
                    for (let i = 0; i < word.length; i++) {
                        const r = isHoriz ? row : row + i;
                        const c = isHoriz ? col + i : col;
                        grid[r][c] = word[i];
                    }
                    placed = true;
                }
            }
        });

        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === '') {
                    grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
                }
            }
        }

        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        deck.innerHTML = `
            <div class="w-full flex justify-between items-center border-b border-main pb-2 z-10 shrink-0 font-mono">
                <span class="text-xs font-black uppercase text-[#23483f] dark:text-white">🔍 SOPA DE LETRAS (${targetWords.length} PALABRAS)</span>
                <button onclick="window.ChallengesEngine.openChallengesHub()" class="bg-[#23483f] text-white text-[9px] px-3 py-1.5 rounded-lg uppercase font-black cursor-pointer">
                    SALIR ✕
                </button>
            </div>

            <div class="flex-grow flex flex-col items-center justify-center p-2 sm:p-4 text-center font-mono my-auto">
                <div class="card-bg p-4 rounded-3xl border border-main shadow-md max-w-lg w-full flex flex-col gap-3">
                    
                    <div class="flex flex-wrap justify-center gap-2 subcard-bg p-2.5 rounded-2xl border border-main">
                        ${targetWords.map(w => `<span class="text-[10px] font-bold text-main border border-main/20 px-2 py-0.5 rounded-lg">${w}</span>`).join('')}
                    </div>

                    <div class="grid grid-cols-10 gap-1 bg-main/10 p-2 rounded-2xl mx-auto w-full max-w-[340px] aspect-square">
                        ${grid.flatMap((row, r) => row.map((char, c) => `
                            <button onclick="this.classList.toggle('bg-[#e06a4e]'); this.classList.toggle('text-white');" 
                                    class="w-full h-full subcard-bg border border-main/10 rounded-lg flex items-center justify-center font-black text-xs cursor-pointer select-none">
                                ${char}
                            </button>
                        `)).join('')}
                    </div>

                    <button onclick="window.ChallengesEngine.openChallengesHub()" class="bg-[#23483f] text-white font-bold text-xs py-3 rounded-xl uppercase mt-1">
                        ✓ Finalizar Juego
                    </button>
                </div>
            </div>
        `;
    },

    launchHangmanGame(cost) {
        this.stopTimer();
        const userPaws = ProgressManager?.state?.stats?.paws || 0;
        if (cost > 0 && userPaws < cost) {
            if (typeof window.showToast === 'function') window.showToast(`Requiere ${cost} Paws para jugar.`, 'warning');
            return;
        }

        if (cost > 0) ProgressManager.addPaws(-cost);

        const learnedWords = this.getLearnedWordsPool();
        const selected = learnedWords[Math.floor(Math.random() * learnedWords.length)];

        if (!selected) {
            if (typeof window.showToast === 'function') window.showToast("Aprende palabras en el Mapa para jugar al Ahorcado.", "warning");
            return;
        }

        const targetWord = (selected.word || selected.english_word).toUpperCase();
        let guessedLetters = new Set();
        let errors = 0;
        const maxErrors = 6;

        window.guestLetterHangman = (letterChar) => {
            guessedLetters.add(letterChar);
            if (!targetWord.includes(letterChar)) errors++;
            this.renderHangmanUI(selected, targetWord, guessedLetters, errors, maxErrors);
        };

        this.renderHangmanUI(selected, targetWord, guessedLetters, errors, maxErrors);
    },

    renderHangmanUI(wordObj, targetWord, guessedLetters, errors, maxErrors) {
        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        const isLost = errors >= maxErrors;
        const isWon = targetWord.split('').every(char => char === ' ' || guessedLetters.has(char));

        const wordDisplay = targetWord.split('').map(char => {
            if (char === ' ') return ' ';
            return guessedLetters.has(char) ? char : '_';
        }).join(' ');

        const alphabetList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

        deck.innerHTML = `
            <div class="w-full flex justify-between items-center border-b border-main pb-2 z-10 shrink-0 font-mono">
                <span class="text-xs font-black uppercase text-[#23483f] dark:text-white">🔤 AHORCADO // ERRORES: ${errors}/${maxErrors}</span>
                <button onclick="window.ChallengesEngine.openChallengesHub()" class="bg-[#23483f] text-white text-[9px] px-3 py-1.5 rounded-lg uppercase font-black cursor-pointer">
                    SALIR ✕
                </button>
            </div>

            <div class="flex-grow flex flex-col items-center justify-center p-2 sm:p-4 text-center font-mono my-auto">
                <div class="card-bg p-5 rounded-3xl border border-main shadow-md max-w-md w-full flex flex-col gap-4">
                    
                    ${wordObj.media_url ? `<img src="${wordObj.media_url}" class="w-24 h-24 mx-auto object-contain ${isLost || isWon ? '' : 'blur-md'}" onerror="this.remove()">` : ''}

                    <div class="text-2xl font-black text-main tracking-widest my-2">${wordDisplay}</div>

                    ${isWon ? `
                        <div class="bg-emerald-500/10 border border-emerald-500 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl text-xs font-black">
                            🏆 ¡PALABRA DESCUBIERTA CON ÉXITO!
                        </div>
                    ` : isLost ? `
                        <div class="bg-rose-500/10 border border-rose-500 text-rose-500 p-3 rounded-xl text-xs font-black">
                            💀 PERDISTE. ERA: "${targetWord}"
                        </div>
                    ` : `
                        <div class="flex flex-wrap justify-center gap-1.5 max-w-xs mx-auto">
                            ${alphabetList.map(letterChar => `
                                <button onclick="window.guestLetterHangman('${letterChar}')" ${guessedLetters.has(letterChar) ? 'disabled' : ''} 
                                        class="w-8 h-8 rounded-lg font-bold text-xs ${guessedLetters.has(letterChar) ? 'bg-gray-300 text-gray-500 opacity-40 cursor-not-allowed' : 'bg-[#23483f] text-white hover:bg-[#19322b] cursor-pointer'}">
                                    ${letterChar}
                                </button>
                            `).join('')}
                        </div>
                    `}

                    <button onclick="window.ChallengesEngine.openChallengesHub()" class="bg-[#23483f] text-white font-bold text-xs py-3 rounded-xl uppercase mt-2">
                        ↩️ Volver a la Arena
                    </button>
                </div>
            </div>
        `;
    },

    launchCrosswordGame(cost) {
        this.launchWordSearchGame(cost);
    },

    launchMemoryGame(cost) {
        this.launchHangmanGame(cost);
    },

    closeEngine() {
        this.stopTimer();
        const deck = document.getElementById('lesson-interactive-deck');
        if (deck) deck.classList.add('hidden');
        if (typeof window.renderHomeLessonsModule === 'function') {
            window.renderHomeLessonsModule();
        }
    }
};

window.ChallengesEngine = ChallengesEngine;
