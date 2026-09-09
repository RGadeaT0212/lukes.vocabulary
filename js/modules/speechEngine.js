// ==========================================================================
// MOTOR NATIVO DE RECONOCIMIENTO DE VOZ (WEB SPEECH RECOGNITION API)
// ==========================================================================

let recognition = null;

/**
 * Inicializa y configura el motor de escucha del micrófono de forma nativa.
 * @returns {Object|null} Instancia del reconocedor de voz configurada.
 */
function initSpeechRecognition() {
    // 1. Validar compatibilidad entre navegadores (Webkit para Chrome/Safari/Edge)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.error("Error de Hardware: Este navegador no soporta el reconocimiento de voz por micrófono.");
        return null;
    }

    const instance = new SpeechRecognition();
    
    // 2. Ajustes de captura fonética
    instance.lang = 'en-US';              // Forzamos la captura en inglés americano nativo
    instance.continuous = false;          // Detiene la escucha automáticamente cuando el alumno hace una pausa larga
    instance.interimResults = false;       // Solo nos interesa el resultado final procesado, no los borradores en tiempo real

    return instance;
}

/**
 * Escucha al usuario a través del micrófono y devuelve el texto procesado.
 * @param {Function} onResultCallback - Función que recibe el texto final pronunciado por el alumno.
 * @param {Function} onErrorCallback - Función que captura errores de hardware (micrófono apagado, bloqueo de permisos, etc).
 */
export function startListening(onResultCallback, onErrorCallback) {
    if (!recognition) {
        recognition = initSpeechRecognition();
    }

    if (!recognition) return;

    // 3. Configurar eventos de captura de datos
    recognition.onstart = () => {
        console.log("// Micrófono Activo: Escuchando fonemas en inglés...");
    };

    recognition.onresult = (event) => {
        // Extraemos el string de texto de la primera coincidencia con mayor índice de confianza
        const spokenText = event.results[0][0].transcript;
        console.log(`// Texto detectado en el canal de entrada: "${spokenText}"`);
        onResultCallback(spokenText);
    };

    recognition.onerror = (event) => {
        console.error(`// Fallo en la captura del micrófono [Código: ${event.error}]`);
        if (onErrorCallback) onErrorCallback(event.error);
    };

    // 4. Encendido del hardware
    try {
        recognition.start();
    } catch (e) {
        // Previene caídas del sistema si el usuario hace clic repetidamente antes de que cierre el ciclo anterior
        window.speechSynthesis.cancel();
    }
}

/**
 * Apaga forzadamente la captura del micrófono si la lección se cancela.
 */
export function stopListening() {
    if (recognition) {
        recognition.stop();
        console.log("// Canal del micrófono cerrado de forma segura.");
    }
}