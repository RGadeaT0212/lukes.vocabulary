// ==========================================================================
// 🌍 LUKES ACADEMY - I18N ENGINE v62.0
// ==========================================================================

export const SUPPORTED_LEARNING_LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

export const TEMPLATE_INSTRUCTIONS = {
    INTRO: {
        es: "👁️ Familiarízate con la palabra, su pronunciación y significado",
        en: "👁️ Familiarize yourself with the word, its pronunciation, and meaning"
    },
    '1': {
        es: "🔊 Escucha la locución y selecciona la opción correcta",
        en: "🔊 Listen to the audio and select the correct option"
    },
    '5': {
        es: "✏️ Completa las vocales faltantes de la palabra",
        en: "✏️ Fill in the missing vowels of the word"
    },
    '16': {
        es: "🧩 Elige la terminación correcta para completar la palabra",
        en: "🧩 Select the correct chunk to complete the word"
    },
    '18': {
        es: "🔊 Escucha el banco de palabras y escribe el término en inglés",
        en: "🔊 Listen to the word bank and type the term in English"
    },
    '19': {
        es: "🔊 Escucha el banco de palabras y escribe el término en inglés",
        en: "🔊 Listen to the word bank and type the term in English"
    },
    '29': {
        es: "⚖️ Evalúa la afirmación y selecciona Verdadero o Falso",
        en: "⚖️ Evaluate the statement and select True or False"
    },
    '30': {
        es: "⚖️ Evalúa la afirmación y selecciona Verdadero o Falso",
        en: "⚖️ Evaluate the statement and select True or False"
    },
    speaking: {
        es: "🎙️ Presiona el micrófono y pronuncia la palabra en voz alta",
        en: "🎙️ Press the microphone and pronounce the word out loud"
    },
    input: {
        es: "⌨️ Escribe libremente la traducción en inglés usando tu teclado",
        en: "⌨️ Type the English translation using your keyboard"
    }
};

export const I18nManager = {
    nativeLang: 'es',
    targetLang: 'en',

    init() {
        const sysLang = navigator.language || navigator.userLanguage || 'es';
        this.nativeLang = sysLang.startsWith('es') ? 'es' : 'en';
        const savedTarget = localStorage.getItem('lukes_target_lang');
        if (savedTarget) this.targetLang = savedTarget;
    },

    setTargetLanguage(code) {
        this.targetLang = code;
        localStorage.setItem('lukes_target_lang', code);
        if (window.AppState) window.AppState.targetLanguage = code;
        
        const langObj = SUPPORTED_LEARNING_LANGUAGES.find(l => l.code === code);
        if (langObj && typeof window.showToast === 'function') {
            window.showToast(`Idioma de aprendizaje: ${langObj.name} ${langObj.flag}`, 'info');
        }
        
        this.updateTargetLangUI();
    },

    updateTargetLangUI() {
        const langObj = SUPPORTED_LEARNING_LANGUAGES.find(l => l.code === this.targetLang) || SUPPORTED_LEARNING_LANGUAGES[0];
        document.querySelectorAll('.active-target-flag').forEach(el => el.textContent = langObj.flag);
        document.querySelectorAll('.active-target-name').forEach(el => el.textContent = langObj.name);
    },

    getInstruction(templateId, fallbackType = 'input') {
        const entry = TEMPLATE_INSTRUCTIONS[templateId] || TEMPLATE_INSTRUCTIONS[fallbackType];
        return entry ? (entry[this.nativeLang] || entry['es']) : "Sigue la indicación del ejercicio";
    }
};

I18nManager.init();
window.I18nManager = I18nManager;
