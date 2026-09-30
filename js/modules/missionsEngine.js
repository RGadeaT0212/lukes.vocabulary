// ==========================================================================
// 🏆 MISSIONS ENGINE v3.0 - LISTA DE LOGROS ESTILO VIDEOJUEGO
// ==========================================================================
import { ProgressManager } from './progressManager.js';

export const MissionsEngine = {
    getMissionList() {
        const stats = ProgressManager?.state?.stats || {};
        const wordsLearned = stats.wordsLearned || ProgressManager?.state?.mastered_words_ids?.length || 0;
        const completedBubblesCount = ProgressManager?.state?.completed_bubbles?.length || 0;
        const challengesCount = stats.challengesCompleted || 0;

        return [
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

    renderMissionsDashboard() {
        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        const missions = this.getMissionList();
        const claimedMissions = ProgressManager?.state?.claimed_missions || [];

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

            <div class="flex-grow flex flex-col justify-start sm:justify-center w-full max-w-4xl mx-auto my-auto p-2 sm:p-4 overflow-hidden">
                <div class="card-bg w-full h-full sm:h-auto max-h-[82vh] p-3 sm:p-5 rounded-3xl border border-main shadow-md flex flex-col gap-3 relative font-mono overflow-hidden">
                    
                    <div class="flex items-center justify-between border-b border-main/10 pb-2.5 gap-2 shrink-0">
                        <div class="text-left">
                            <span class="text-xs font-bold text-main uppercase tracking-wider block">PANEL DE OBJETIVOS</span>
                            <span class="text-[10px] text-muted block">Reclama patitas 🐾 para continuar acumulando recompensas:</span>
                        </div>
                    </div>

                    <div class="flex-grow overflow-y-auto custom-scrollbar p-1">
                        <div class="flex flex-col gap-2">
                            ${sortedMissions.map(m => {
                                const isClaimed = claimedMissions.includes(m.id);
                                const isCompleted = m.current >= m.target;
                                const progressPercent = Math.min(100, Math.round((m.current / m.target) * 100));

                                return `
                                    <div id="mission-row-${m.id}" 
                                         class="subcard-bg border border-main p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left transition-all duration-500 ${isClaimed ? 'opacity-40 grayscale bg-gray-100 dark:bg-zinc-900/40' : ''}">
                                        
                                        <div class="flex items-center gap-3 w-full sm:w-1/3">
                                            <div class="w-9 h-9 rounded-xl ${isCompleted && !isClaimed ? 'bg-[#e06a4e] text-white animate-pulse' : 'bg-[#23483f] text-white'} flex items-center justify-center text-sm shrink-0 font-bold">
                                                ${isClaimed ? '✓' : isCompleted ? '🎁' : '🎯'}
                                            </div>
                                            <div class="truncate">
                                                <h4 class="font-black text-xs text-main uppercase truncate">${m.title}</h4>
                                                <p class="text-[9px] text-muted font-medium truncate">${m.desc}</p>
                                            </div>
                                        </div>

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
    }
};

window.MissionsEngine = MissionsEngine;
