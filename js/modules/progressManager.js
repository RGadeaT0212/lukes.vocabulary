// ==========================================================================
// 🪐 LUKES ACADEMY - PROGRESS MANAGER (REAL-TIME SUPABASE SYNC)
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
            currentLevel: '1'
        },
        completed_bubbles: [1],
        completed_blocks: {},
        mastered_words_ids: [],
        spaced_repetition: {
            low: [],
            medium: [],
            high: [],
            schedule: {}
        }
    },

    async init() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                const localData = localStorage.getItem(CACHE_KEY);
                if (localData) this.state = JSON.parse(localData);
                return this.state;
            }

            this.state.student_id = user.id;

            // Carga local previa
            const localData = localStorage.getItem(CACHE_KEY);
            if (localData) {
                this.state = JSON.parse(localData);
            }

            // Descarga/Sincronización desde Supabase
            const { data, error } = await supabase
                .from('student_progress')
                .select('*')
                .eq('student_id', user.id)
                .maybeSingle();

            if (error) {
                console.warn('[ProgressManager] Error al descargar progreso:', error.message);
                return this.state;
            }

            if (data) {
                // Fusión de burbujas completadas sin perder avance local
                const remoteBubbles = data.completed_bubbles || [1];
                const localBubbles = this.state.completed_bubbles || [1];
                const mergedBubbles = Array.from(new Set([...remoteBubbles, ...localBubbles]));

                this.state = {
                    student_id: data.student_id,
                    stats: data.stats || this.state.stats,
                    completed_bubbles: mergedBubbles,
                    completed_blocks: data.completed_blocks || this.state.completed_blocks,
                    mastered_words_ids: data.mastered_words_ids || this.state.mastered_words_ids,
                    spaced_repetition: data.spaced_repetition || this.state.spaced_repetition
                };
                this.saveToLocal();
            } else {
                await this.syncToSupabase();
            }

            return this.state;
        } catch (err) {
            console.error('[ProgressManager] Error en inicialización:', err);
            return this.state;
        }
    },

    saveToLocal() {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(this.state));
            if (window.AppState) {
                window.AppState.studentStats = this.state.stats;
                window.AppState.completedBubbles = new Set(this.state.completed_bubbles);
            }
        } catch (e) {
            console.error('[ProgressManager] Error en localStorage:', e);
        }
    },

    async syncToSupabase() {
        this.saveToLocal();
        if (!this.state.student_id) return;

        try {
            const payload = {
                student_id: this.state.student_id,
                stats: this.state.stats,
                completed_bubbles: this.state.completed_bubbles,
                completed_blocks: this.state.completed_blocks,
                mastered_words_ids: this.state.mastered_words_ids,
                spaced_repetition: this.state.spaced_repetition,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('student_progress')
                .upsert(payload, { onConflict: 'student_id' });

            if (error) {
                console.warn('[ProgressManager] Sincronización offline:', error.message);
            } else {
                console.log('[ProgressManager] Progreso guardado exitosamente en Supabase.');
            }
        } catch (err) {
            console.error('[ProgressManager] Error en syncToSupabase:', err);
        }
    },

    sanitizeTypingText(text) {
        if (!text) return '';
        return text.trim().replace(/\s+/g, '\u00A0');
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
        if (typeof amount !== 'number' || amount <= 0) return;
        this.state.stats.paws = (this.state.stats.paws || 0) + amount;
        this.syncToSupabase();
    }
};

window.ProgressManager = ProgressManager;
