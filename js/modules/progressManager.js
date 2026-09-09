// ==========================================================================
// 🪐 LUKES ACADEMY - PROGRESS MANAGER (CACHE-FIRST ENGINE)
// ==========================================================================
import { supabase } from './supabaseClient.js';

const CACHE_KEY = 'lukes_student_progress';

export const ProgressManager = {
    // Estado en memoria
    state: {
        student_id: null,
        stats: {
            wordsLearned: 0,
            challengesCompleted: 0,
            missionsCompleted: 0,
            paws: 0,
            currentLevel: 'A1'
        },
        completed_bubbles: [1],
        spaced_repetition: {
            low: [],
            medium: [],
            high: [],
            schedule: {}
        }
    },

    // 1. Inicialización: Carga desde Supabase e inyecta en caché
    async init() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            this.state.student_id = user.id;

            // Intentar cargar desde caché local primero para velocidad
            const localData = localStorage.getItem(CACHE_KEY);
            if (localData) {
                this.state = JSON.parse(localData);
            }

            // Sincronizar/Descargar versión fresca de Supabase
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
                this.state = {
                    student_id: data.student_id,
                    stats: data.stats || this.state.stats,
                    completed_bubbles: data.completed_bubbles || [1],
                    spaced_repetition: data.spaced_repetition || this.state.spaced_repetition
                };
                this.saveToLocal();
            } else {
                // Si es un usuario nuevo sin fila de progreso, se crea la fila inicial
                await this.syncToSupabase();
            }

            return this.state;
        } catch (err) {
            console.error('[ProgressManager] Error en inicialización:', err);
            return this.state;
        }
    },

    // 2. Guardado ultra rápido en localStorage (Operación local)
    saveToLocal() {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(this.state));
            if (window.AppState) {
                window.AppState.studentStats = this.state.stats;
                window.AppState.completedBubbles = new Set(this.state.completed_bubbles);
            }
        } catch (e) {
            console.error('[ProgressManager] Error al guardar en localStorage:', e);
        }
    },

    // 3. Sincronización silenciosa con Supabase (Fire and Forget / Upsert)
    async syncToSupabase() {
        if (!this.state.student_id) return;

        this.saveToLocal();

        try {
            const payload = {
                student_id: this.state.student_id,
                stats: this.state.stats,
                completed_bubbles: this.state.completed_bubbles,
                spaced_repetition: this.state.spaced_repetition,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('student_progress')
                .upsert(payload, { onConflict: 'student_id' });

            if (error) {
                console.warn('[ProgressManager] Sincronización diferida (offline/error):', error.message);
            } else {
                console.log('[ProgressManager] Progreso sincronizado con Supabase.');
            }
        } catch (err) {
            console.error('[ProgressManager] Error en syncToSupabase:', err);
        }
    },

    // 4. Métodos de Actualización de Estado (Memoria Local)

    // Registrar Patitas de Gato ganadas por porcentaje de precisión (Tramo 20%)
    addPaws(amount) {
        if (typeof amount !== 'number' || amount <= 0) return;
        this.state.stats.paws = (this.state.stats.paws || 0) + amount;
        this.saveToLocal();
    },

    // Desbloquear/Completar una burbuja de lección
    completeBubble(bubbleNum) {
        if (!this.state.completed_bubbles.includes(bubbleNum)) {
            this.state.completed_bubbles.push(bubbleNum);
            this.saveToLocal();
        }
    },

    // Registrar nueva palabra aprendida
    incrementWordsLearned() {
        this.state.stats.wordsLearned = (this.state.stats.wordsLearned || 0) + 1;
        this.saveToLocal();
    },

    // Actualizar el estado de una palabra en la curva de repetición espaciada
    updateSpacedRepetition(itemId, level, targetDateStr) {
        const sr = this.state.spaced_repetition;

        // Remover de todos los arreglos de nivel para evitar duplicados
        sr.low = sr.low.filter(id => id !== itemId);
        sr.medium = sr.medium.filter(id => id !== itemId);
        sr.high = sr.high.filter(id => id !== itemId);

        // Asignar al nuevo nivel
        if (sr[level]) {
            sr[level].push(itemId);
        }

        // Programar en la agenda por fecha (YYYY-MM-DD)
        if (targetDateStr) {
            if (!sr.schedule[targetDateStr]) {
                sr.schedule[targetDateStr] = [];
            }
            if (!sr.schedule[targetDateStr].includes(itemId)) {
                sr.schedule[targetDateStr].push(itemId);
            }
        }

        this.saveToLocal();
    },

    // Obtener las palabras programadas para repasar el día de hoy
    getTodayScheduledItems() {
        const todayStr = new Date().toISOString().split('T')[0];
        return this.state.spaced_repetition.schedule[todayStr] || [];
    }
};

window.ProgressManager = ProgressManager;