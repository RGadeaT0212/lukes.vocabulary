// ==========================================================================
// 🎙️ MOTOR NATIVO DE RECONOCIMIENTO DE VOZ OPTIMIZADO PARA MÓVILES Y DESKTOP
// ==========================================================================

let recognition = null;
let isListeningActive = false;

/**
 * Inicializa y configura el motor de escucha del micrófono de forma nativa.
 * @returns {Object|null} Instancia del reconocedor de voz configurada.
 */
function initSpeechRecognition() {
    // 1. Compatibilidad Multi-Navegador (Chrome / Safari iOS / Edge / Android)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.error("Error de Hardware: Este navegador no soporta el reconocimiento de voz por micrófono.");
        return null;
    }

    const instance = new SpeechRecognition();
    
    // 2. Ajustes de captura fonética para teléfonos móviles
    instance.lang = 'en-US';              // Captura en inglés americano
    instance.continuous = false;          // Finaliza tras capturar la frase
    instance.interimResults = false;       // Solo procesa el resultado final procesado
    instance.maxAlternatives = 1;          // Coincidencia con mayor índice de confianza

    return instance;
}

/**
 * Escucha al usuario a través del micrófono y devuelve el texto procesado.
 * @param {Function} onResultCallback - Recibe el texto final pronunciado.
 * @param {Function} onErrorCallback - Captura errores de hardware o silencios.
 */
export function startListening(onResultCallback, onErrorCallback) {
    if (!recognition) {
        recognition = initSpeechRecognition();
    }

    if (!recognition) {
        if (onErrorCallback) onErrorCallback("not-supported");
        return;
    }

    // Si la captura estaba activa en el teléfono, la reseteamos de forma segura
    if (isListeningActive) {
        try {
            recognition.abort();
        } catch (e) {}
    }

    // 3. Configurar eventos de captura
    recognition.onstart = () => {
        isListeningActive = true;
        console.log("// Micrófono Móvil/Desktop Activo: Escuchando...");
    };

    recognition.onresult = (event) => {
        isListeningActive = false;
        if (event.results && event.results[0] && event.results[0][0]) {
            const spokenText = event.results[0][0].transcript;
            console.log(`// Texto detectado en el canal de entrada: "${spokenText}"`);
            if (onResultCallback) onResultCallback(spokenText);
        }
    };

    recognition.onerror = (event) => {
        isListeningActive = false;
        console.error(`// Fallo en captura de micrófono [Código: ${event.error}]`);
        if (onErrorCallback) onErrorCallback(event.error);
    };

    recognition.onend = () => {
        isListeningActive = false;
        console.log("// Canal del micrófono cerrado.");
    };

    // 4. Encendido del hardware en móviles (Invocación directa)
    try {
        recognition.start();
    } catch (e) {
        isListeningActive = false;
        // Si el reconocedor estaba colgado, lo abortamos y reiniciamos
        try {
            recognition.abort();
            setTimeout(() => {
                try { recognition.start(); } catch (err) {}
            }, 100);
        } catch (err) {}
    }
}

/**
 * Apaga forzadamente la captura del micrófono.
 */
export function stopListening() {
    if (recognition && isListeningActive) {
        try {
            recognition.stop();
        } catch(e) {}
        isListeningActive = false;
        console.log("// Canal del micrófono cerrado de forma segura.");
    }
}

export const SpeechEngine = {
    startListening,
    stopListening
};

window.SpeechEngine = SpeechEngine;
export default SpeechEngine;
