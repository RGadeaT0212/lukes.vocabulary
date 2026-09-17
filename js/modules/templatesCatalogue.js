// ==========================================================================
// 🔤 CATÁLOGO OFICIAL DE PLANTILLAS DE VOCABULARIO (IDs 1-42)
// ==========================================================================

export const VOCABULARY_TEMPLATES = {
    // ----------------------------------------------------------------------
    // 🎯 RECOGNIZE (Reconocer: Sin Imagen - IDs 1 a 6)
    // ----------------------------------------------------------------------
    1: { id: 1, goal: 'recognize', time: 15, skills: ['listening', 'reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'choice_audio_text' },
    2: { id: 2, goal: 'recognize', time: 15, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'choice_audio_audio' },
    3: { id: 3, goal: 'recognize', time: 15, skills: ['reading', 'listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'choice_text_audio' },
    4: { id: 4, goal: 'recognize', time: 20, skills: ['reading', 'listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'match_audio_text' },
    5: { id: 5, goal: 'recognize', time: 20, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'match_audio_audio' },
    6: { id: 6, goal: 'recognize', time: 25, skills: ['reading', 'writing'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'shadowing_text' },

    // ----------------------------------------------------------------------
    // 🎯 RECOGNIZE (Reconocer: Con Imagen - IDs 7 y 38 a 42)
    // ----------------------------------------------------------------------
    7: { id: 7, goal: 'recognize', time: 15, skills: ['reading', 'listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'choice_image_text' },
    38: { id: 38, goal: 'recognize', time: 15, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'choice_image_audio' },
    39: { id: 39, goal: 'recognize', time: 15, skills: ['listening', 'reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'choice_text_image' },
    40: { id: 40, goal: 'recognize', time: 20, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'match_image_audio' },
    41: { id: 41, goal: 'recognize', time: 20, skills: ['listening', 'reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'match_image_text' },
    42: { id: 42, goal: 'recognize', time: 25, skills: ['reading', 'writing'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'shadowing_image' },

    // ----------------------------------------------------------------------
    // 🔗 ASSOCIATE (Asociar: IDs 8 a 17)
    // ----------------------------------------------------------------------
    8: { id: 8, goal: 'associate', time: 25, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'match' },
    9: { id: 9, goal: 'associate', time: 25, skills: ['listening', 'reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'match' },
    10: { id: 10, goal: 'associate', time: 30, skills: ['reading', 'listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'match' },
    11: { id: 11, goal: 'associate', time: 20, skills: ['reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'choice' },
    12: { id: 12, goal: 'associate', time: 20, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'choice' },
    13: { id: 13, goal: 'associate', time: 20, skills: ['speaking', 'reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'speaking' },
    14: { id: 14, goal: 'associate', time: 25, skills: ['speaking', 'listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'speaking' },
    15: { id: 15, goal: 'associate', time: 30, skills: ['reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'drag' },
    16: { id: 16, goal: 'associate', time: 30, skills: ['reading', 'writing'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'drag' },
    17: { id: 17, goal: 'associate', time: 20, skills: ['speaking'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'speaking' },

    // ----------------------------------------------------------------------
    // 🧠 RECALL (Evocación / Memoria: IDs 18 a 30)
    // ----------------------------------------------------------------------
    18: { id: 18, goal: 'recall', time: 25, skills: ['writing', 'reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'input' },
    19: { id: 19, goal: 'recall', time: 30, skills: ['listening', 'writing'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'input' },
    20: { id: 20, goal: 'recall', time: 30, skills: ['listening', 'reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'ordering' },
    21: { id: 21, goal: 'recall', time: 30, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'ordering' },
    22: { id: 22, goal: 'recall', time: 30, skills: ['reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'drag' },
    23: { id: 23, goal: 'recall', time: 30, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'drag' },
    24: { id: 24, goal: 'recall', time: 30, skills: ['reading', 'listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'match' },
    25: { id: 25, goal: 'recall', time: 30, skills: ['listening', 'reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'match' },
    26: { id: 26, goal: 'recall', time: 30, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'match' },
    27: { id: 27, goal: 'recall', time: 20, skills: ['reading', 'speaking'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'speaking' },
    28: { id: 28, goal: 'recall', time: 20, skills: ['listening', 'speaking'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'speaking' },
    29: { id: 29, goal: 'recall', time: 20, skills: ['reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'choice' },
    30: { id: 30, goal: 'recall', time: 20, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'choice' },

    // ----------------------------------------------------------------------
    // ✍️ PRODUCE (Producción: IDs 31 a 37)
    // ----------------------------------------------------------------------
    31: { id: 31, goal: 'produce', time: 25, skills: ['writing'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'input' },
    32: { id: 32, goal: 'produce', time: 30, skills: ['writing', 'listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'input' },
    33: { id: 33, goal: 'produce', time: 25, skills: ['speaking'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'speaking' },
    34: { id: 34, goal: 'produce', time: 25, skills: ['speaking', 'reading'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'speaking' },
    35: { id: 35, goal: 'produce', time: 30, skills: ['listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'ordering' },
    36: { id: 36, goal: 'produce', time: 35, skills: ['writing'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: true, type: 'input' },
    37: { id: 37, goal: 'produce', time: 35, skills: ['writing', 'listening'], max_consecutive: 2, level: ['A1', 'A2', 'B1', 'B2'], require_image: false, type: 'input' }
};
