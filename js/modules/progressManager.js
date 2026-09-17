// ==========================================================================
// 🪐 LUKES ACADEMY - PROGRESS MANAGER (REAL-TIME SUPABASE SYNC) v60.0
// ==========================================================================
import { supabase } from './supabaseClient.js';

const CACHE_KEY = 'lukes_student_progress';

export const ProgressManager = {
    state: {
        student_id: null,
        stats: {
            wordsLearned: 0,
            challengesCompleted: 0,
            missionsCompleted: 0,
            paws: 0,
            currentLevel: 'A1'
        },
        skill_mastery: {
            listening: 0,
            reading: 0,
            writing: 0,
            speaking: 0
        },
        completed_bubbles: [], // 👈 Estado inicial completamente limpio
        completed_blocks: {},
        mastered_words_ids: [],
        claimed_missions: [],
        completed_speaking_session: 0,
        spaced_repetition: { low: [], medium: [], high: [], schedule: {} }
    },

    // 🧹 PURGA Y RESET ABSOLUTO DE CACHÉ LOCAL Y MEMORIA
    resetProgressState() {
        this.state = {
            student_id: null,
            stats: {
                wordsLearned: 0,
                challengesCompleted: 0,
                missionsCompleted: 0,
                paws: 0,
                currentLevel: 'A1'
            },
            skill_mastery: { listening: 0, reading: 0, writing: 0, speaking: 0 },
            completed_bubbles: [],
            completed_blocks: {},
            mastered_words_ids: [],
            claimed_missions: [],
            completed_speaking_session: 0,
            spaced_repetition: { low: [], medium: [], high: [], schedule: {} }
        };

        try {
            localStorage.clear(); // 🧹 Purga total del almacenamiento del navegador
            if (window.AppState) {
                window.AppState.studentStats = this.state.stats;
                window.AppState.completedBubbles = new Set();
                window.AppState.homeBubbleIndex = 0;
            }
        } catch (e) {
            console.error('[ProgressManager] Error al limpiar caché:', e);
        }
        this.refreshUI();
    },

    async init() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            // Si es un invitado / no hay usuario autenticado
            if (!user) {
                const localData = localStorage.getItem(CACHE_KEY);
                if (localData) {
                    this.state = JSON.parse(localData);
                } else {
                    this.state.completed_bubbles = [];
                }
                this.ensureLevelFormat();
                this.refreshUI();
                return this.state;
            }

            this.state.student_id = user.id;

            const { data, error } = await supabase
                .from('student_progress')
                .select('*')
                .eq('student_id', user.id)
                .maybeSingle();

            if (error) {
                console.warn('[ProgressManager] Error al descargar progreso:', error.message);
                this.ensureLevelFormat();
                this.refreshUI();
                return this.state;
            }

            if (data) {
                const remoteBubbles = data.completed_bubbles || [];
                
                this.state = {
                    student_id: data.student_id,
                    stats: data.stats || this.state.stats,
                    skill_mastery: data.skill_mastery || { listening: 0, reading: 0, writing: 0, speaking: 0 },
                    completed_bubbles: remoteBubbles,
                    completed_blocks: data.completed_blocks || {},
                    mastered_words_ids: data.mastered_words_ids || [],
                    claimed_missions: data.claimed_missions || [],
                    completed_speaking_session: data.completed_speaking_session || 0,
                    spaced_repetition: data.spaced_repetition || { low: [], medium: [], high: [], schedule: {} }
                };

                this.state.stats.wordsLearned = this.state.mastered_words_ids.length;
                this.state.stats.missionsCompleted = this.state.claimed_missions.length;

                this.ensureLevelFormat();
                this.saveToLocal();
            } else {
                // CUANTA NUEVA EN SUPABASE: Iniciar con estado Cero limpio
                this.state.completed_bubbles = [];
                this.ensureLevelFormat();
                await this.syncToSupabase();
            }

            this.refreshUI();
            return this.state;
        } catch (err) {
            console.error('[ProgressManager] Error en inicialización:', err);
            this.ensureLevelFormat();
            this.refreshUI();
            return this.state;
        }
    },

    ensureLevelFormat() {
        if (!this.state.stats) this.state.stats = {};
        const levelMap = { '1': 'A1', '2': 'A2', '3': 'B1', '4': 'B2' };
        if (levelMap[this.state.stats.currentLevel]) {
            this.state.stats.currentLevel = levelMap[this.state.stats.currentLevel];
        } else if (!['A1', 'A2', 'B1', 'B2'].includes(this.state.stats.currentLevel)) {
            this.state.stats.currentLevel = 'A1';
        }
    },

    saveToLocal() {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(this.state));
            if (window.AppState) {
                window.AppState.studentStats = this.state.stats;
                window.AppState.completedBubbles = new Set(this.state.completed_bubbles);
                window.AppState.activeLevel = this.state.stats.currentLevel;
            }
            this.refreshUI();
        } catch (e) {
            console.error('[ProgressManager] Error en localStorage:', e);
        }
    },

    refreshUI() {
        if (typeof window.updateStatsDisplay === 'function') {
            window.updateStatsDisplay();
        }
    },

    async syncToSupabase() {
        this.saveToLocal();
        if (!this.state.student_id) return;

        try {
            const payload = {
                student_id: this.state.student_id,
                stats: this.state.stats,
                skill_mastery: this.state.skill_mastery,
                completed_bubbles: this.state.completed_bubbles,
                completed_blocks: this.state.completed_blocks,
                mastered_words_ids: this.state.mastered_words_ids,
                claimed_missions: this.state.claimed_missions,
                completed_speaking_session: this.state.completed_speaking_session,
                spaced_repetition: this.state.spaced_repetition,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('student_progress')
                .upsert(payload, { onConflict: 'student_id' });

            if (error) {
                console.warn('[ProgressManager] Sincronización offline:', error.message);
            }
        } catch (err) {
            console.error('[ProgressManager] Error en syncToSupabase:', err);
        }
    },

    updateSkillMastery(skills = [], delta = 1.0) {
        if (!this.state.skill_mastery) {
            this.state.skill_mastery = { listening: 0, reading: 0, writing: 0, speaking: 0 };
        }

        skills.forEach(skill => {
            const key = skill.toLowerCase();
            if (this.state.skill_mastery[key] !== undefined) {
                const current = this.state.skill_mastery[key];
                this.state.skill_mastery[key] = Math.min(100, Math.max(0, current + delta));
            }
        });

        this.saveToLocal();
    },

    completeBubble(bubbleNum) {
        const num = Number(bubbleNum);
        if (!this.state.completed_bubbles.includes(num)) {
            this.state.completed_bubbles.push(num);
            this.syncToSupabase();
        }
    },

    recordLessonCompletion(unitId, blockId, lessonLevel, hitsCount, totalAttempts, blockWordIds = []) {
        const blockKey = `unit${unitId}_block${blockId}`;

        if (!this.state.completed_blocks[blockKey]) {
            this.state.completed_blocks[blockKey] = { L1: false, L2: false, L3: false, hits: 0, attempts: 0, score: 0, status: 'IN_PROGRESS' };
        }

        const block = this.state.completed_blocks[blockKey];
        block[lessonLevel] = true;
        block.hits += hitsCount;
        block.attempts += totalAttempts;

        if (lessonLevel === 'L3') {
            const domainScore = block.attempts > 0 ? (block.hits / block.attempts) * 100 : 0;
            block.score = domainScore;

            if (domainScore >= 80) {
                blockWordIds.forEach(id => {
                    if (!this.state.mastered_words_ids.includes(id)) {
                        this.state.mastered_words_ids.push(id);
                    }
                });
                this.state.stats.wordsLearned = this.state.mastered_words_ids.length;
                block.status = 'MASTERED';
            } else {
                block.status = 'NEEDS_REVIEW';
            }
        }

        this.syncToSupabase();
        return block;
    },

    addPaws(amount) {
        if (typeof amount !== 'number') return;
        this.state.stats.paws = Math.max(0, (this.state.stats.paws || 0) + amount);
        this.syncToSupabase();
    },

    recordMissionClaimed(missionId, rewardPaws) {
        if (!this.state.claimed_missions) this.state.claimed_missions = [];
        if (!this.state.claimed_missions.includes(missionId)) {
            this.state.claimed_missions.push(missionId);
            this.state.stats.missionsCompleted = this.state.claimed_missions.length;
            this.addPaws(rewardPaws);
        }
    }
};

window.ProgressManager = ProgressManager;
