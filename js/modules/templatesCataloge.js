// ==========================================================================
// 🔤 CATÁLOGO OFICIAL DE PLANTILLAS DE VOCABULARIO (IDs 1-37)
// ==========================================================================

export const VOCABULARY_TEMPLATES = {
    // ----------------------------------------------------------------------
    // 🎯 RECOGNIZE (Reconocer: IDs 1 a 7)
    // ----------------------------------------------------------------------
    1: { id: 1, goal: 'recognize', time: 15, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'choice' },
    2: { id: 2, goal: 'recognize', time: 15, skills: ['listening', 'reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'choice' },
    3: { id: 3, goal: 'recognize', time: 15, skills: ['reading', 'listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'choice' },
    4: { id: 4, goal: 'recognize', time: 15, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'audio_choice' },
    5: { id: 5, goal: 'recognize', time: 15, skills: ['writing'], max_consecutive: 1, level: ['A1', 'A2'], require_image: true, type: 'input' },
    6: { id: 6, goal: 'recognize', time: 15, skills: ['listening', 'speaking'], max_consecutive: 3, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'audio_input' },
    7: { id: 7, goal: 'recognize', time: 20, skills: ['speaking'], max_consecutive: 1, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'audio_input' },

    // ----------------------------------------------------------------------
    // 🔗 ASSOCIATE (Asociar: IDs 8 a 17)
    // ----------------------------------------------------------------------
    8: { id: 8, goal: 'associate', time: 20, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'match' },
    9: { id: 9, goal: 'associate', time: 20, skills: ['listening', 'reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'match' },
    10: { id: 10, goal: 'associate', time: 30, skills: ['reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'match' },
    11: { id: 11, goal: 'associate', time: 20, skills: ['reading'], max_consecutive: 3, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'choice' },
    12: { id: 12, goal: 'associate', time: 20, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'choice' },
    13: { id: 13, goal: 'associate', time: 10, skills: ['speaking', 'reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'speaking' },
    14: { id: 14, goal: 'associate', time: 30, skills: ['speaking', 'listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'speaking' },
    15: { id: 15, goal: 'associate', time: 30, skills: ['reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'drag' },
    16: { id: 16, goal: 'associate', time: 20, skills: ['reading', 'writing'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'choice' },
    17: { id: 17, goal: 'associate', time: 20, skills: ['speaking'], max_consecutive: 3, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'speaking' },

    // ----------------------------------------------------------------------
    // 🧠 RECALL (Evocación / Memoria: IDs 18 a 30)
    // ----------------------------------------------------------------------
    18: { id: 18, goal: 'recall', time: 20, skills: ['writing', 'reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'input' },
    19: { id: 19, goal: 'recall', time: 30, skills: ['listening', 'writing'], max_consecutive: 1, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'input' },
    20: { id: 20, goal: 'recall', time: 30, skills: ['listening', 'reading'], max_consecutive: 1, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'ordering' },
    21: { id: 21, goal: 'recall', time: 30, skills: ['listening'], max_consecutive: 1, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'ordering' },
    22: { id: 22, goal: 'recall', time: 30, skills: ['reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'drag' },
    23: { id: 23, goal: 'recall', time: 30, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'drag' },
    24: { id: 24, goal: 'recall', time: 20, skills: ['reading', 'listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'match' },
    25: { id: 25, goal: 'recall', time: 30, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'match' },
    26: { id: 26, goal: 'recall', time: 30, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'match' },
    27: { id: 27, goal: 'recall', time: 30, skills: ['reading', 'speaking'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'speaking' },
    28: { id: 28, goal: 'recall', time: 30, skills: ['listening', 'speaking'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'speaking' },
    29: { id: 29, goal: 'recall', time: 20, skills: ['reading'], max_consecutive: 3, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'choice' },
    30: { id: 30, goal: 'recall', time: 20, skills: ['listening'], max_consecutive: 3, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'choice' },

    // ----------------------------------------------------------------------
    // ✍️ PRODUCE (Producción: IDs 31 a 37)
    // ----------------------------------------------------------------------
    31: { id: 31, goal: 'produce', time: 25, skills: ['writing'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'input' },
    32: { id: 32, goal: 'produce', time: 30, skills: ['writing', 'listening'], max_consecutive: 1, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'input' },
    33: { id: 33, goal: 'produce', time: 40, skills: ['speaking'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'input' },
    34: { id: 34, goal: 'produce', time: 30, skills: ['speaking', 'reading'], max_consecutive: 1, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'input' },
    35: { id: 35, goal: 'produce', time: 20, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'choice' },
    36: { id: 36, goal: 'produce', time: 30, skills: ['writing'], max_consecutive: 1, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'input' },
    37: { id: 37, goal: 'produce', time: 25, skills: ['writing', 'listening'], max_consecutive: 1, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'input' }
};
