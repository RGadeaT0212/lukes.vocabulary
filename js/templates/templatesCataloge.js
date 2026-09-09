// ==========================================================================
// 🔤 CATÁLOGO EXCLUSIVO DE PLANTILLAS DE VOCABULARIO
// ==========================================================================

export const VOCABULARY_TEMPLATES = {
    // ----------------------------------------------------------------------
    // 🎯 RECOGNIZE (Reconocer - Carga Baja)
    // ----------------------------------------------------------------------
    ChoosePic: { goal: 'Recognize', load: 'low', time: 15, skills: ['listening', 'reading'], max_consecutive: 3, level: 'A1', could_be_used_for: ['vocabulary'] },
    ChooseWord: { goal: 'Recognize', load: 'low', time: 15, skills: ['reading', 'listening'], max_consecutive: 3, level: 'A1', could_be_used_for: ['vocabulary'] },
    image_choice: { goal: 'Recognize', load: 'low', time: 15, skills: ['listening', 'reading'], max_consecutive: 3, level: 'A1', could_be_used_for: ['vocabulary'] },
    AudioWordPicker: { goal: 'Recognize', load: 'low', time: 15, skills: ['listening', 'reading'], max_consecutive: 3, level: 'A1', could_be_used_for: ['vocabulary', 'learningPath'] },
    VisualPatternCheck: { goal: 'Recognize', load: 'low', time: 15, skills: ['reading'], max_consecutive: 3, level: 'A1', could_be_used_for: ['vocabulary', 'learningPath'] },
    SoundMatchPicker: { goal: 'Recognize', load: 'low', time: 20, skills: ['listening'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary', 'learningPath'] },

    // ----------------------------------------------------------------------
    // 🔗 ASSOCIATE (Asociar - Carga Media/Baja)
    // ----------------------------------------------------------------------
    MatchPic: { goal: 'Associate', load: 'low', time: 20, skills: ['listening', 'reading'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary'] },
    MatchWord: { goal: 'Associate', load: 'low', time: 20, skills: ['reading'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary'] },
    Label: { goal: 'Associate', load: 'medium', time: 30, skills: ['reading', 'writing'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary'] },
    Repeat: { goal: 'Associate', load: 'low', time: 10, skills: ['speaking', 'listening'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary'] },
    Repeat2: { goal: 'Associate', load: 'medium', time: 30, skills: ['speaking', 'listening'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary'] },
    Drag2: { goal: 'Associate', load: 'medium', time: 30, skills: ['reading'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary'] },
    Pick: { goal: 'Associate', load: 'low', time: 20, skills: ['reading', 'writing'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary'] },
    CardCategorySorter: { goal: 'Associate', load: 'medium', time: 25, skills: ['reading'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary', 'learningPath'] },

    // ----------------------------------------------------------------------
    // 🧠 RECALL (Recordar / Memoria - Carga Media)
    // ----------------------------------------------------------------------
    Complete: { goal: 'Recall', load: 'medium', time: 20, skills: ['writing', 'reading'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary'] },
    Drag: { goal: 'Recall', load: 'medium', time: 30, skills: ['reading'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary'] },
    MatchPic2: { goal: 'Recall', load: 'medium', time: 20, skills: ['reading', 'listening'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary'] },
    MatchWord2: { goal: 'Recall', load: 'medium', time: 30, skills: ['listening'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary'] },
    Pick2: { goal: 'Recall', load: 'medium', time: 30, skills: ['listening'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary'] },
    WordScramble: { goal: 'Recall', load: 'medium', time: 20, skills: ['writing', 'reading'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary'] },
    grammar_blank: { goal: 'Recall', load: 'medium', time: 20, skills: ['reading', 'writing'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary', 'learningPath'] },
    Say: { goal: 'Recall', load: 'medium', time: 10, skills: ['speaking'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary'] },
    MissingWordFiller: { goal: 'Recall', load: 'medium', time: 20, skills: ['reading', 'writing'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary', 'learningPath'] },

    // ----------------------------------------------------------------------
    // ✍️ PRODUCE (Producir - Carga Alta)
    // ----------------------------------------------------------------------
    WriteWord: { goal: 'Produce', load: 'high', time: 25, skills: ['writing'], max_consecutive: 1, level: 'A1', could_be_used_for: ['vocabulary'] },
    Dictation: { goal: 'Produce', load: 'high', time: 30, skills: ['writing', 'listening'], max_consecutive: 1, level: 'A1', could_be_used_for: ['vocabulary'] },
    Label2: { goal: 'Produce', load: 'high', time: 40, skills: ['writing'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary'] },
    CompleteSentence: { goal: 'Produce', load: 'high', time: 30, skills: ['writing', 'reading'], max_consecutive: 1, level: 'A1', could_be_used_for: ['vocabulary', 'learningPath'] },
    CompleteSentence2: { goal: 'Produce', load: 'medium', time: 20, skills: ['writing', 'reading'], max_consecutive: 2, level: 'A1', could_be_used_for: ['vocabulary', 'learningPath'] },
    CompleteSentence3: { goal: 'Produce', load: 'high', time: 30, skills: ['writing', 'listening'], max_consecutive: 1, level: 'A1', could_be_used_for: ['vocabulary', 'learningPath'] },
    Answer: { goal: 'Produce', load: 'high', time: 25, skills: ['writing', 'reading'], max_consecutive: 1, level: 'A1', could_be_used_for: ['vocabulary', 'learningPath'] },
    Answer2: { goal: 'Produce', load: 'high', time: 30, skills: ['speaking', 'listening'], max_consecutive: 1, level: 'A1', could_be_used_for: ['vocabulary', 'learningPath'] }
};