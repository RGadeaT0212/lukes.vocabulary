// ==========================================================================
// 🎙️️ MOTOR NATIVO DE RECONOCIMIENTO DE VOZ ADAPTATIVO POR IDIOMA
// ==========================================================================

let recognition = null;
let isListeningActive = false;

const SPEECH_LANG_MAP = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    it: 'it-IT',
    pt: 'pt-PT',
    de: 'de-DE'
};

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.error("Hardware/Navegador no compatible con SpeechRecognition.");
        return null;
    }

    const instance = new SpeechRecognition();
    instance.continuous = false;
    instance.interimResults = false;
    instance.maxAlternatives = 1;

    return instance;
}

export function startListening(onResultCallback, onErrorCallback) {
    // 1. Inicialización o reutilización
    if (!recognition) {
        recognition = initSpeechRecognition();
    }

    if (!recognition) {
        if (onErrorCallback) onErrorCallback("not-supported");
        return;
    }

    // 🌐 ASIGNAR IDIOMA DINÁMICO DE RECONOCIMIENTO SEGÚN EL OBJETIVO DE APRENDIZAJE
    const activeTargetLang = window.AppState?.targetLanguage || localStorage.getItem('lukes_target_lang') || 'en';
    recognition.lang = SPEECH_LANG_MAP[activeTargetLang] || 'en-US';

    // 2. Abortar cualquier sesión previa colgada
    try {
        recognition.abort();
    } catch (e) {}

    isListeningActive = false;

    // 3. Handlers de eventos
    recognition.onstart = () => {
        isListeningActive = true;
        console.log(`// Micrófono capturando audio para idioma [${recognition.lang}]...`);
    };

    recognition.onresult = (event) => {
        isListeningActive = false;
        if (event.results && event.results[0] && event.results[0][0]) {
            const spokenText = event.results[0][0].transcript;
            console.log(`// Pronunciación detectada: "${spokenText}"`);
            if (onResultCallback) onResultCallback(spokenText);
        }
    };

    recognition.onerror = (event) => {
        isListeningActive = false;
        console.warn(`// Evento de micrófono: ${event.error}`);
        
        if (onErrorCallback) {
            onErrorCallback(event.error);
        }
    };

    recognition.onend = () => {
        isListeningActive = false;
    };

    // 4. Disparo inmediato dentro del evento táctil del usuario
    try {
        recognition.start();
    } catch (e) {
        isListeningActive = false;
        setTimeout(() => {
            try {
                recognition.abort();
                recognition.start();
            } catch (err) {
                if (onErrorCallback) onErrorCallback("start-failed");
            }
        }, 150);
    }
}

export function stopListening() {
    if (recognition) {
        try {
            recognition.stop();
        } catch(e) {}
        isListeningActive = false;
    }
}

export const SpeechEngine = {
    startListening,
    stopListening
};

window.SpeechEngine = SpeechEngine;
export default SpeechEngine;
