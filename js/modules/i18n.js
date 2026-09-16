// ==========================================================================
// 🌍 LUKES ACADEMY - I18N & TUTORIAL ENGINE v62.0
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
    },

    startInteractiveTutorial() {
        const deck = document.getElementById('lesson-interactive-deck');
        if (!deck) return;

        deck.classList.remove('hidden');
        let currentStep = 1;

        const renderStep = () => {
            if (currentStep === 1) {
                deck.innerHTML = `
                    <div class="w-full flex justify-between items-center border-b border-main pb-2 font-mono">
                        <span class="text-xs font-black uppercase text-[#e06a4e]">🎓 TUTORIAL DE INICIO // PASO 1 DE 3</span>
                        <button onclick="window.I18nManager.closeTutorial()" class="bg-[#23483f] text-white text-[9px] px-3 py-1.5 rounded-lg uppercase font-black cursor-pointer">SALIR ✕</button>
                    </div>
                    <div class="flex-grow flex flex-col justify-center max-w-xl mx-auto text-center font-mono my-auto">
                        <div class="card-bg p-6 rounded-3xl border border-main shadow-lg flex flex-col gap-4">
                            <span class="text-3xl">🎴</span>
                            <h3 class="font-black text-lg text-main uppercase">Cartas de Presentación y Audios</h3>
                            <p class="text-xs text-muted leading-relaxed">
                                Escucha la locución nativa en velocidad <strong>Normal</strong> o <strong>Lenta (🐢)</strong>. Si ya dominas el término, usa el botón <strong>"⚡ Ya me la sé"</strong> para avanzar rápido.
                            </p>
                            <button id="tut-next-btn" class="w-full bg-[#23483f] text-white font-black text-xs py-3.5 rounded-xl uppercase cursor-pointer">Siguiente Paso ➔</button>
                        </div>
                    </div>
                `;
            } else if (currentStep === 2) {
                deck.innerHTML = `
                    <div class="w-full flex justify-between items-center border-b border-main pb-2 font-mono">
                        <span class="text-xs font-black uppercase text-[#e06a4e]">🎓 TUTORIAL DE INICIO // PASO 2 DE 3</span>
                        <button onclick="window.I18nManager.closeTutorial()" class="bg-[#23483f] text-white text-[9px] px-3 py-1.5 rounded-lg uppercase font-black cursor-pointer">SALIR ✕</button>
                    </div>
                    <div class="flex-grow flex flex-col justify-center max-w-xl mx-auto text-center font-mono my-auto">
                        <div class="card-bg p-6 rounded-3xl border border-main shadow-lg flex flex-col gap-4">
                            <span class="text-3xl">🎙️</span>
                            <h3 class="font-black text-lg text-main uppercase">Speaking y Control de Micrófono</h3>
                            <p class="text-xs text-muted leading-relaxed">
                                Presiona el micrófono para evaluar tu voz. Si estás en la calle o sin micrófono, toca <strong>"🚫 No puedo hablar ahora"</strong> para que el motor omita los ejercicios orales de tu lección.
                            </p>
                            <button id="tut-next-btn" class="w-full bg-[#23483f] text-white font-black text-xs py-3.5 rounded-xl uppercase cursor-pointer">Siguiente Paso ➔</button>
                        </div>
                    </div>
                `;
            } else if (currentStep === 3) {
                deck.innerHTML = `
                    <div class="w-full flex justify-between items-center border-b border-main pb-2 font-mono">
                        <span class="text-xs font-black uppercase text-[#e06a4e]">🎓 TUTORIAL DE INICIO // PASO 3 DE 3</span>
                        <button onclick="window.I18nManager.closeTutorial()" class="bg-[#23483f] text-white text-[9px] px-3 py-1.5 rounded-lg uppercase font-black cursor-pointer">SALIR ✕</button>
                    </div>
                    <div class="flex-grow flex flex-col justify-center max-w-xl mx-auto text-center font-mono my-auto">
                        <div class="card-bg p-6 rounded-3xl border border-main shadow-lg flex flex-col gap-4">
                            <span class="text-3xl">🐾</span>
                            <h3 class="font-black text-lg text-main uppercase">Recompensas Paws 🐾</h3>
                            <p class="text-xs text-muted leading-relaxed">
                                Cada lección finalizada te recompensa con <strong>Paws 🐾</strong>. Utilízalas para acceder a minijuegos en la Arena y recuperar vidas en desafíos.
                            </p>
                            <button id="tut-next-btn" class="w-full bg-[#23483f] text-white font-black text-xs py-3.5 rounded-xl uppercase cursor-pointer">Reclamar Recompensa ➔</button>
                        </div>
                    </div>
                `;
            } else {
                if (window.ProgressManager) window.ProgressManager.addPaws(5);
                deck.innerHTML = `
                    <div class="flex-grow flex flex-col items-center justify-center p-4 font-mono my-auto">
                        <div class="card-bg p-7 rounded-3xl border border-main shadow-2xl max-w-sm w-full text-center flex flex-col gap-3">
                            <span class="text-4xl">🎉</span>
                            <h3 class="text-xl font-black text-main uppercase">¡TUTORIAL COMPLETADO!</h3>
                            <p class="text-xs text-muted">Has recibido tu premio de bienvenida:</p>
                            <div class="subcard-bg p-3 rounded-2xl border border-main text-lg font-black text-[#e06a4e]">
                                +5 PAWS DE BIENVENIDA 🐾
                            </div>
                            <button onclick="window.I18nManager.closeTutorial()" class="bg-[#23483f] text-white font-bold text-xs py-3.5 rounded-xl uppercase w-full cursor-pointer">
                                ¡Comenzar a Aprender! ➔
                            </button>
                        </div>
                    </div>
                `;
                if (window.confetti) window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                return;
            }

            const btn = document.getElementById('tut-next-btn');
            if (btn) {
                btn.onclick = () => {
                    currentStep++;
                    renderStep();
                };
            }
        };

        renderStep();
    },

    closeTutorial() {
        const deck = document.getElementById('lesson-interactive-deck');
        if (deck) deck.classList.add('hidden');
    }
};

I18nManager.init();
window.I18nManager = I18nManager;
