// ==========================================================================
// 🌍 LUKES ACADEMY - I18N ENGINE v65.0 (VISUAL STATE HIGHLIGHTING)
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
        es: "🔊 Escucha el banco de palabras y escribe el término en el idioma seleccionado",
        en: "🔊 Listen to the word bank and type the term in the target language"
    },
    '19': {
        es: "🔊 Escucha el banco de palabras y escribe el término en el idioma seleccionado",
        en: "🔊 Listen to the word bank and type the term in the target language"
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
        es: "⌨️ Escribe libremente la traducción usando tu teclado",
        en: "⌨️️ Type the translation using your keyboard"
    }
};

export const I18nManager = {
    nativeLang: 'es',
    targetLang: 'en',

    init() {
        const sysLang = navigator.language || navigator.userLanguage || 'es';
        this.nativeLang = sysLang.startsWith('es') ? 'es' : 'en';
        const savedTarget = localStorage.getItem('lukes_target_lang');
        this.targetLang = savedTarget || 'en';
        if (window.AppState) window.AppState.targetLanguage = this.targetLang;
    },

    setTargetLanguage(code) {
        if (this.targetLang === code) {
            if (typeof window.toggleBottomSheetProfile === 'function') {
                const sheet = document.getElementById('profile-bottom-sheet');
                if (sheet && !sheet.classList.contains('pointer-events-none')) {
                    window.toggleBottomSheetProfile();
                }
            }
            return;
        }

        this.targetLang = code;
        localStorage.setItem('lukes_target_lang', code);
        if (window.AppState) window.AppState.targetLanguage = code;
        
        // 1. Activar Splash Screen de Carga
        const splash = document.getElementById('app-splash-screen');
        if (splash) {
            splash.classList.remove('hidden');
            splash.style.opacity = '1';
            splash.style.pointerEvents = 'auto';
        }

        // 2. Cerrar Bottom Sheet si está abierto en móvil
        const sheet = document.getElementById('profile-bottom-sheet');
        if (sheet && !sheet.classList.contains('pointer-events-none')) {
            window.toggleBottomSheetProfile();
        }

        this.updateTargetLangUI();

        // 3. Re-inicializar motores y vistas tras leve delay de carga
        setTimeout(() => {
            if (window.ProgressManager) {
                window.ProgressManager.saveToLocal();
            }

            if (window.VocabularyEngine) {
                window.VocabularyEngine.loadGymCategories();
            }

            if (typeof window.openHomeView === 'function') {
                window.openHomeView();
            }

            if (typeof window.updateStatsDisplay === 'function') {
                window.updateStatsDisplay();
            }

            const langObj = SUPPORTED_LEARNING_LANGUAGES.find(l => l.code === code);
            if (langObj && typeof window.showToast === 'function') {
                window.showToast(`Idioma activado: ${langObj.name} ${langObj.flag}`, 'info');
            }

            // 4. Ocultar Splash Screen
            if (splash) {
                splash.style.opacity = '0';
                setTimeout(() => {
                    splash.classList.add('hidden');
                    splash.style.pointerEvents = 'none';
                }, 500);
            }
        }, 800);
    },

    updateTargetLangUI() {
        const langObj = SUPPORTED_LEARNING_LANGUAGES.find(l => l.code === this.targetLang) || SUPPORTED_LEARNING_LANGUAGES[0];
        
        // Actualizar textos e iconos de cabecera
        document.querySelectorAll('.active-target-flag').forEach(el => el.textContent = langObj.flag);
        document.querySelectorAll('.active-target-name').forEach(el => el.textContent = langObj.name);
        document.querySelectorAll('.active-target-code').forEach(el => el.textContent = langObj.code.toUpperCase());

        // 🎨 RESALTAR EL IDIOMA SELECCIONADO EN LOS MENÚS (PC Y MÓVIL)
        document.querySelectorAll('.lang-option-btn').forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            const checkEl = btn.querySelector('.active-check');

            if (btnLang === this.targetLang) {
                btn.className = "lang-option-btn flex items-center justify-between p-2 rounded-xl text-xs font-bold text-left cursor-pointer transition-all bg-[#23483f] text-white shadow-md border border-[#23483f]";
                if (checkEl) checkEl.classList.remove('hidden');
            } else {
                btn.className = "lang-option-btn flex items-center justify-between p-2 rounded-xl text-xs font-bold text-left cursor-pointer transition-all subcard-bg hover:bg-[#23483f]/10 hover:border-[#e06a4e] border border-main/20 text-main";
                if (checkEl) checkEl.classList.add('hidden');
            }
        });
    },

    getInstruction(templateId, fallbackType = 'input') {
        const entry = TEMPLATE_INSTRUCTIONS[templateId] || TEMPLATE_INSTRUCTIONS[fallbackType];
        return entry ? (entry[this.nativeLang] || entry['es']) : "Sigue la indicación del ejercicio";
    }
};

I18nManager.init();
window.I18nManager = I18nManager;
