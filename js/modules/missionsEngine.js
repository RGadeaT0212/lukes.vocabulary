// ==========================================================================
// 🏆 MISSIONS ENGINE v3.0 - LISTA DE LOGROS ESTILO VIDEOJUEGO
// ==========================================================================
import { ProgressManager } from './progressManager.js';

export const MissionsEngine = {
    // 🎯 GENERADOR DE LA LISTA PROGRESIVA DE LOGROS (ESCALA DEL DOBLE)
    getMissionList() {
        const stats = ProgressManager?.state?.stats || {};
        const wordsLearned = stats.wordsLearned || ProgressManager?.state?.mastered_words_ids?.length || 0;
        const completedBubblesCount = ProgressManager?.state?.completed_bubbles?.length || 0;
        const challengesCount = stats.challengesCompleted || 0;

        return [
            // 📚 CATEGORÍA: PALABRAS APRENDIDAS
            {
                id: 'words_5',
                title: 'Primer Vocabulario',
                desc: 'Aprende 5 palabras en las lecciones',
                target: 5,
                current: wordsLearned,
                reward: 5,
                type: 'words'
            },
            {
                id: 'words_30',
                title: 'Léxico Progresivo',
                desc: 'Aprende 30 palabras en las lecciones',
                target: 30,
                current: wordsLearned,
                reward: 10,
                type: 'words'
            },
            {
                id: 'words_60',
                title: 'Dominio Vocabular',
                desc: 'Aprende 60 palabras en las lecciones',
                target: 60,
                current: wordsLearned,
                reward: 20,
                type: 'words'
            },
            {
                id: 'words_120',
                title: 'Maestro de Palabras',
                desc: 'Aprende 120 palabras en las lecciones',
                target: 120,
                current: wordsLearned,
                reward: 40,
                type: 'words'
            },

            // 🗺️ CATEGORÍA: LECCIONES COMPLETADAS
            {
                id: 'lessons_20',
                title: 'Explorador del Mapa',
                desc: 'Llega y completa la lección 20',
                target: 20,
                current: completedBubblesCount,
                reward: 5,
                type: 'lessons'
            },
            {
                id: 'lessons_40',
                title: 'Camino a la Fluidez',
                desc: 'Completa 40 lecciones del mapa',
                target: 40,
                current: completedBubblesCount,
                reward: 10,
                type: 'lessons'
            },
            {
                id: 'lessons_80',
                title: 'Veterano de Lecciones',
                desc: 'Completa 80 lecciones del mapa',
                target: 80,
                current: completedBubblesCount,
                reward: 20,
                type: 'lessons'
            },

            // ⚡ CATEGORÍA: DESAFÍOS COMPLETADOS
            {
                id: 'challenges_12',
                title: 'Guerrero del Repaso',
                desc: 'Completa 12 Desafíos Diarios',
                target: 12,
                current: challengesCount,
                reward: 4,
                type: 'challenges'
            },
            {
                id: 'challenges_24',
                title: 'Implacable en la Arena',
                desc: 'Completa 24 Desafíos Diarios',
                target: 24,
                current: challengesCount,
                reward: 8,
                type: 'challenges'
            },
            {
                id: 'challenges_48',
                title: 'Leyenda de la Memoria',
                desc: 'Completa 48 Desafíos Diarios',
                target: 48,
                current: challengesCount,
                reward: 16,
                type: 'challenges'
            }
        ];
    },

    initMissionsModule() {
        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        deck.classList.remove('hidden');
        this.renderMissionsDashboard();
    },

    // 🎯 VISTA UNIFICADA ESTILO LISTA DE VIDEOJUEGO
    renderMissionsDashboard() {
        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        const missions = this.getMissionList();
        const claimedMissions = ProgressManager?.state?.claimed_missions || [];

        // 🔄 ALGORITMO DE ORDENAMIENTO:
        // 1. Recompensas listas para reclamar (arriba del todo)
        // 2. Misiones en progreso (al centro)
        // 3. Misiones ya reclamadas (al fondo de la cola)
        const sortedMissions = missions.sort((a, b) => {
            const aClaimed = claimedMissions.includes(a.id);
            const bClaimed = claimedMissions.includes(b.id);
            const aReady = a.current >= a.target && !aClaimed;
            const bReady = b.current >= b.target && !bClaimed;

            if (aReady && !bReady) return -1;
            if (!aReady && bReady) return 1;
            if (!aClaimed && bClaimed) return -1;
            if (aClaimed && !bClaimed) return 1;
            return 0;
        });

        deck.innerHTML = `
            <div class="w-full flex justify-between items-center border-b border-main pb-3 z-10 shrink-0">
                <div class="flex items-center gap-2">
                    <span class="text-sm font-mono font-black uppercase text-[#23483f] dark:text-white">
                        🏆 LOGROS Y RECOMPENSAS
                    </span>
                    <span class="text-[9px] font-mono subcard-bg px-2.5 py-0.5 rounded-full font-bold text-[#e06a4e] border border-main">
                        MODO VIDEOJUEGO
                    </span>
                </div>
                <button onclick="window.MissionsEngine.closeMissionsModule()" 
                        class="bg-[#23483f] hover:bg-[#19322b] text-white font-mono text-[9px] px-3.5 py-1.5 rounded-lg uppercase font-black cursor-pointer transition-all">
                    SALIR ✕
                </button>
            </div>

            <!-- CONTENEDOR PRINCIPAL -->
            <div class="flex-grow flex flex-col justify-start sm:justify-center w-full max-w-4xl mx-auto my-auto p-2 sm:p-4 overflow-hidden">
                <div class="card-bg w-full h-full sm:h-auto max-h-[82vh] p-3 sm:p-5 rounded-3xl border border-main shadow-md flex flex-col gap-3 relative font-mono overflow-hidden">
                    
                    <div class="flex items-center justify-between border-b border-main/10 pb-2.5 gap-2 shrink-0">
                        <div class="text-left">
                            <span class="text-xs font-bold text-main uppercase tracking-wider block">PANEL DE OBJETIVOS</span>
                            <span class="text-[10px] text-muted block">Reclama patitas 🐾 para desbloquear recompensas en tu perfil:</span>
                        </div>
                        <button onclick="window.MissionsEngine.renderLukesGoldCardModal()" 
                                class="bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[10px] font-mono font-black px-3 py-1 rounded-xl cursor-pointer transition-all">
                            💳 Tarjeta Gold
                        </button>
                    </div>

                    <!-- 📜 LISTA UNIFICADA VERTICAL ESTILO VIDEOJUEGO -->
                    <div class="flex-grow overflow-y-auto custom-scrollbar p-1">
                        <div class="flex flex-col gap-2">
                            ${sortedMissions.map(m => {
                                const isClaimed = claimedMissions.includes(m.id);
                                const isCompleted = m.current >= m.target;
                                const progressPercent = Math.min(100, Math.round((m.current / m.target) * 100));

                                return `
                                    <div id="mission-row-${m.id}" 
                                         class="subcard-bg border border-main p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left transition-all duration-500 ${isClaimed ? 'opacity-40 grayscale bg-gray-100 dark:bg-zinc-900/40' : ''}">
                                        
                                        <!-- Detalles de la Misión (Izquierda) -->
                                        <div class="flex items-center gap-3 w-full sm:w-1/3">
                                            <div class="w-9 h-9 rounded-xl ${isCompleted && !isClaimed ? 'bg-[#e06a4e] text-white animate-pulse' : 'bg-[#23483f] text-white'} flex items-center justify-center text-sm shrink-0 font-bold">
                                                ${isClaimed ? '✓' : isCompleted ? '🎁' : '🎯'}
                                            </div>
                                            <div class="truncate">
                                                <h4 class="font-black text-xs text-main uppercase truncate">${m.title}</h4>
                                                <p class="text-[9px] text-muted font-medium truncate">${m.desc}</p>
                                            </div>
                                        </div>

                                        <!-- Barra de Progreso y Recompensa (Centro) -->
                                        <div class="flex items-center gap-4 w-full sm:w-2/5">
                                            <div class="flex-grow flex flex-col gap-1">
                                                <div class="flex justify-between text-[8px] font-bold text-muted uppercase">
                                                    <span>Progreso</span>
                                                    <span>${Math.min(m.current, m.target)} / ${m.target}</span>
                                                </div>
                                                <div class="w-full bg-[#f1ede4] dark:bg-[#222d29] h-2 rounded-full overflow-hidden border border-main/10">
                                                    <div class="bg-[#e06a4e] h-full transition-all duration-300" style="width: ${progressPercent}%"></div>
                                                </div>
                                            </div>
                                            <span class="text-xs font-black text-[#e06a4e] shrink-0 font-mono">+${m.reward} 🐾</span>
                                        </div>

                                        <!-- Botón de Acción Alineado a la Derecha con Animación -->
                                        <div class="w-full sm:w-auto shrink-0 flex justify-end">
                                            ${isClaimed ? `
                                                <button disabled class="w-full sm:w-32 bg-gray-200 dark:bg-zinc-800 text-gray-500 text-[9px] font-black py-2 rounded-xl uppercase cursor-not-allowed">
                                                    RECLAMADO
                                                </button>
                                            ` : isCompleted ? `
                                                <button onclick="window.MissionsEngine.claimReward('${m.id}', ${m.reward})" 
                                                        class="w-full sm:w-36 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black py-2.5 px-3 rounded-xl uppercase cursor-pointer shadow-md transition-all active:scale-95 animate-bounce">
                                                    🎁 RECLAMAR
                                                </button>
                                            ` : `
                                                <button disabled class="w-full sm:w-32 subcard-bg text-muted border border-main/20 text-[9px] font-black py-2 rounded-xl uppercase cursor-not-allowed">
                                                    ${progressPercent}%
                                                </button>
                                            `}
                                        </div>

                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                </div>
            </div>
        `;
    },

    // 🎁 RECLAMO CON ANIMACIÓN DE DESPLAZAMIENTO HACIA ABAJO
    claimReward(missionId, rewardAmount) {
        if (!ProgressManager?.state) return;

        if (!ProgressManager.state.claimed_missions) {
            ProgressManager.state.claimed_missions = [];
        }

        if (!ProgressManager.state.claimed_missions.includes(missionId)) {
            ProgressManager.state.claimed_missions.push(missionId);
            ProgressManager.addPaws(rewardAmount);

            if (typeof window.showToast === 'function') {
                window.showToast(`🏆 ¡Recompensa reclamada! Ganaste +${rewardAmount} paws.`, 'success');
            }

            if (window.confetti) {
                window.confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
            }

            // Animación visual de desplazamiento y reordenamiento hacia abajo
            const rowEl = document.getElementById(`mission-row-${missionId}`);
            if (rowEl) {
                rowEl.classList.add('opacity-40', 'grayscale', 'translate-y-4');
                setTimeout(() => {
                    this.renderMissionsDashboard();
                }, 400);
            } else {
                this.renderMissionsDashboard();
            }
        }
    },

    closeMissionsModule() {
        const deck = document.getElementById('lesson-interactive-deck');
        if (deck) deck.classList.add('hidden');
        if (typeof window.renderHomeLessonsModule === 'function') {
            window.renderHomeLessonsModule();
        }
    },

    // Generar datos y mostrar la Tarjeta Lukes Gold
    generateCardNumber(userId) {
        const seed = userId || 'LUKES-GUEST-999';
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const pad = (num, size) => ('00000000' + Math.abs(num)).slice(-size);
        const part1 = '4532';
        const part2 = pad(hash % 8999 + 1000, 4);
        const part3 = pad((hash * 3) % 8999 + 1000, 4);
        const part4 = pad((hash * 7) % 8999 + 1000, 4);

        return `${part1} ${part2} ${part3} ${part4}`;
    },

    generateCardDetails(userId) {
        const now = new Date();
        const expMonth = String(now.getMonth() + 1).padStart(2, '0');
        const expYear = String(now.getFullYear() + 3).slice(-2);
        const cvv = Math.abs((userId ? userId.length * 137 : 888) % 900) + 100;

        return {
            expDate: `${expMonth}/${expYear}`,
            cvv: cvv
        };
    },

    renderLukesGoldCardModal() {
    const user = window.AppState?.user || { name: 'Estudiante', id: 'GUEST123', email: 'estudiante@lukes.com' };
    const cardNumber = this.generateCardNumber(user.id || user.email);
    const details = this.generateCardDetails(user.id || user.email);
    const isMastered = (window.ProgressManager?.state?.mastered_words_ids?.length || 0) >= 5;

    let modal = document.getElementById('lukes-gold-card-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'lukes-gold-card-modal';
        modal.className = "fixed inset-0 bg-[#1c2321]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans animate-fade-in select-none";
        document.body.appendChild(modal);
    } else {
        modal.classList.remove('hidden');
    }

    modal.innerHTML = `
        <div class="card-bg border border-main text-main w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-5 text-center relative font-mono">
            <button onclick="document.getElementById('lukes-gold-card-modal').classList.add('hidden')" 
                    class="absolute top-4 right-4 w-8 h-8 rounded-full subcard-bg text-muted flex items-center justify-center text-xs cursor-pointer transition-all">✕</button>

            <div>
                <span class="text-[9px] font-mono text-[#d97757] font-bold uppercase tracking-widest">// TITULAR EXCLUSIVO</span>
                <h2 class="title-brand font-black text-xl text-main uppercase tracking-tight mt-1">Lukes Gold Member</h2>
            </div>

            <!-- CONTENEDOR FLIP 3D -->
            <div id="gold-card-flip-target" onclick="this.classList.toggle('is-flipped')" 
                 class="flip-card-container w-full h-52 cursor-pointer">
                <div class="flip-card-inner">
                    
                    <!-- CARA FRONTAL -->
                    <div class="flip-card-front bg-gradient-to-tr from-[#b8860b] via-[#d4af37] to-[#ffd700] text-stone-900 p-5 shadow-xl flex flex-col justify-between border border-[#ffe87c]/60">
                        <div class="flex justify-between items-start z-10">
                            <div class="text-left">
                                <span class="title-brand font-black text-base tracking-wider text-stone-900 block leading-none">lukes</span>
                                <span class="text-[7px] font-mono font-black text-stone-800 tracking-widest uppercase">GOLD DEBIT</span>
                            </div>
                            <i class="fa-solid fa-wifi text-stone-800 text-sm"></i>
                        </div>

                        <div class="w-10 h-8 rounded-md bg-gradient-to-r from-amber-200 to-amber-400 border border-amber-500/50 my-1 z-10 flex items-center justify-center">
                            <div class="w-full h-[1px] bg-amber-600/40"></div>
                        </div>

                        <div class="z-10 text-left">
                            <span class="font-mono text-sm sm:text-base font-black tracking-widest text-stone-950 block drop-shadow-xs">
                                ${cardNumber}
                            </span>
                            
                            <div class="flex justify-between items-end mt-2">
                                <div>
                                    <span class="text-[7px] font-mono text-stone-800 uppercase block font-bold">TITULAR</span>
                                    <span class="font-mono text-xs font-black uppercase text-stone-950 truncate max-w-[160px] block">
                                        ${user.name}
                                    </span>
                                </div>
                                <div class="text-right">
                                    <span class="text-[7px] font-mono text-stone-800 uppercase block font-bold">EXPIRES</span>
                                    <span class="font-mono text-xs font-black text-stone-950 block">
                                        ${details.expDate}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- CARA POSTERIOR -->
                    <div class="flip-card-back bg-stone-900 text-stone-100 p-5 shadow-xl flex flex-col justify-between border border-stone-700">
                        <div class="w-full h-9 bg-black -mx-5 mt-1"></div>
                        
                        <div class="flex items-center justify-between bg-stone-200 text-stone-900 px-3 py-1.5 rounded text-left my-2">
                            <span class="font-mono text-[9px] font-bold italic">AUTHORIZED SIGNATURE</span>
                            <span class="font-mono text-xs font-black tracking-widest">${details.cvv}</span>
                        </div>

                        <div class="text-left text-[8px] font-mono text-stone-400 leading-tight">
                            Esta tarjeta acredita al estudiante en la plataforma de Lukes English Academy. Toca nuevamente para voltear.
                        </div>
                    </div>

                </div>
            </div>

            <p class="text-xs text-muted leading-relaxed font-medium">
                ${isMastered 
                    ? `Tarjeta de membresía activa de <strong>${user.name}</strong>. Toca la tarjeta para ver el reverso.` 
                    : `¡Felicidades por aprender tus primeras palabras! Tu <strong>Tarjeta Virtual Lukes Gold</strong> está activa.`}
            </p>

            <button onclick="document.getElementById('lukes-gold-card-modal').classList.add('hidden')" 
                    class="w-full bg-[#23483f] hover:bg-[#19322b] text-white font-mono text-xs font-black py-3.5 rounded-xl uppercase tracking-widest cursor-pointer transition-all shadow-md">
                Volver a la Plataforma ➔
            </button>
        </div>
    `;
    }
};

window.MissionsEngine = MissionsEngine;
