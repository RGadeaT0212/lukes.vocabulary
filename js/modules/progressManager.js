// ==========================================================================
// 🪐 LUKES ACADEMY - PROGRESS MANAGER (REAL-TIME SUPABASE SYNC & MULTI-LANG)
// ==========================================================================
import { supabase } from './supabaseClient.js';

const CACHE_KEY = 'lukes_student_progress';

export const ProgressManager = {
    state: {
        student_id: null,
        progress_by_language: {
            en: {
                stats: { wordsLearned: 0, challengesCompleted: 0, missionsCompleted: 0, paws: 0, currentLevel: 'A1' },
                skill_mastery: { listening: 0, reading: 0, writing: 0, speaking: 0 },
                completed_bubbles: [],
                completed_blocks: {},
                mastered_words_ids: [],
                claimed_missions: [],
                completed_speaking_session: 0,
                spaced_repetition: { low: [], medium: [], high: [], schedule: {} }
            }
        }
    },

    getCurrentLang() {
        return window.AppState?.targetLanguage || localStorage.getItem('lukes_target_lang') || 'en';
    },

    getLangProgress() {
        const lang = this.getCurrentLang();
        if (!this.state.progress_by_language[lang]) {
            this.state.progress_by_language[lang] = {
                stats: { wordsLearned: 0, challengesCompleted: 0, missionsCompleted: 0, paws: 0, currentLevel: 'A1' },
                skill_mastery: { listening: 0, reading: 0, writing: 0, speaking: 0 },
                completed_bubbles: [],
                completed_blocks: {},
                mastered_words_ids: [],
                claimed_missions: [],
                completed_speaking_session: 0,
                spaced_repetition: { low: [], medium: [], high: [], schedule: {} }
            };
        }
        return this.state.progress_by_language[lang];
    },

    get currentLangState() {
        return this.getLangProgress();
    },

    resetProgressState() {
        const lang = this.getCurrentLang();
        this.state.progress_by_language[lang] = {
            stats: { wordsLearned: 0, challengesCompleted: 0, missionsCompleted: 0, paws: 0, currentLevel: 'A1' },
            skill_mastery: { listening: 0, reading: 0, writing: 0, speaking: 0 },
            completed_bubbles: [],
            completed_blocks: {},
            mastered_words_ids: [],
            claimed_missions: [],
            completed_speaking_session: 0,
            spaced_repetition: { low: [], medium: [], high: [], schedule: {} }
        };

        try {
            localStorage.removeItem(CACHE_KEY);
            if (window.AppState) {
                window.AppState.studentStats = this.currentLangState.stats;
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
            const localData = localStorage.getItem(CACHE_KEY);

            if (localData) {
                const parsed = JSON.parse(localData);
                if (parsed.progress_by_language) {
                    this.state.progress_by_language = parsed.progress_by_language;
                }
            }

            if (!user) {
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
                // Recuperar la estructura JSONB guardada en Supabase
                if (data.completed_bubbles && typeof data.completed_bubbles === 'object' && !Array.isArray(data.completed_bubbles)) {
                    this.state.progress_by_language = data.completed_bubbles;
                }
                this.ensureLevelFormat();
                this.saveToLocal();
            } else {
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
        const langProgress = this.getLangProgress();
        if (!langProgress.stats) langProgress.stats = {};
        const levelMap = { '1': 'A1', '2': 'A2', '3': 'B1', '4': 'B2' };
        if (levelMap[langProgress.stats.currentLevel]) {
            langProgress.stats.currentLevel = levelMap[langProgress.stats.currentLevel];
        } else if (!['A1', 'A2', 'B1', 'B2'].includes(langProgress.stats.currentLevel)) {
            langProgress.stats.currentLevel = 'A1';
        }
    },

    saveToLocal() {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(this.state));
            const langProgress = this.getLangProgress();
            
            if (window.AppState) {
                window.AppState.studentStats = langProgress.stats;
                window.AppState.completedBubbles = new Set(langProgress.completed_bubbles);
                window.AppState.activeLevel = langProgress.stats.currentLevel;
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
            const currentLangProgress = this.getLangProgress();

            // Mapeo seguro utilizando las columnas UUID + JSONB estrictas de Supabase
            const payload = {
                student_id: this.state.student_id,
                stats: currentLangProgress.stats,
                completed_bubbles: this.state.progress_by_language, // Guardamos la colección multi-idioma en completed_bubbles
                spaced_repetition: currentLangProgress.spaced_repetition,
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
        const langProgress = this.getLangProgress();
        if (!langProgress.skill_mastery) {
            langProgress.skill_mastery = { listening: 0, reading: 0, writing: 0, speaking: 0 };
        }

        skills.forEach(skill => {
            const key = skill.toLowerCase();
            if (langProgress.skill_mastery[key] !== undefined) {
                const current = langProgress.skill_mastery[key];
                langProgress.skill_mastery[key] = Math.min(100, Math.max(0, current + delta));
            }
        });

        this.saveToLocal();
    },

    completeBubble(bubbleNum) {
        const langProgress = this.getLangProgress();
        const num = Number(bubbleNum);
        if (!langProgress.completed_bubbles.includes(num)) {
            langProgress.completed_bubbles.push(num);
            this.syncToSupabase();
        }
    },

    recordLessonCompletion(unitId, blockId, lessonLevel, hitsCount, totalAttempts, blockWordIds = []) {
        const langProgress = this.getLangProgress();
        const blockKey = `unit${unitId}_block${blockId}`;

        if (!langProgress.completed_blocks[blockKey]) {
            langProgress.completed_blocks[blockKey] = { L1: false, L2: false, L3: false, hits: 0, attempts: 0, score: 0, status: 'IN_PROGRESS' };
        }

        const block = langProgress.completed_blocks[blockKey];
        block[lessonLevel] = true;
        block.hits += hitsCount;
        block.attempts += totalAttempts;

        if (lessonLevel === 'L3') {
            const domainScore = block.attempts > 0 ? (block.hits / block.attempts) * 100 : 0;
            block.score = domainScore;

            if (domainScore >= 80) {
                blockWordIds.forEach(id => {
                    if (!langProgress.mastered_words_ids.includes(id)) {
                        langProgress.mastered_words_ids.push(id);
                    }
                });
                langProgress.stats.wordsLearned = langProgress.mastered_words_ids.length;
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
        const langProgress = this.getLangProgress();
        langProgress.stats.paws = Math.max(0, (langProgress.stats.paws || 0) + amount);
        this.syncToSupabase();
    },

    recordMissionClaimed(missionId, rewardPaws) {
        const langProgress = this.getLangProgress();
        if (!langProgress.claimed_missions) langProgress.claimed_missions = [];
        if (!langProgress.claimed_missions.includes(missionId)) {
            langProgress.claimed_missions.push(missionId);
            langProgress.stats.missionsCompleted = langProgress.claimed_missions.length;
            this.addPaws(rewardPaws);
        }
    }
};

window.ProgressManager = ProgressManager;
export default ProgressManager;
