// ==========================================================================
// MOTOR DE SÍNTESIS DE AUDIO NATIVO (WEB SPEECH API)
// ==========================================================================

/**
 * Pronuncia cualquier texto en inglés de forma nativa a través de las bocinas del usuario.
 * @param {string} textToSpeak - La palabra o frase en inglés que se va a vocalizar.
 * @param {number} rate - La velocidad de la voz (1.0 es velocidad normal, 0.8 es más lento para principiantes).
 */
export function speakEnglish(text, rate = 0.85, gender = 'neutral') {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;

    // Función interna compacta para aplicar el filtro de género real
    const applyGenderVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const englishVoices = voices.filter(v => v.lang.startsWith('en'));
        
        if (gender === 'female') {
            const femaleVoice = englishVoices.find(v => 
                v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || 
                v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('hazel')
            );
            if (femaleVoice) utterance.voice = femaleVoice;
        } else if (gender === 'male') {
            const maleVoice = englishVoices.find(v => 
                v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || 
                v.name.toLowerCase().includes('mark')
            );
            if (maleVoice) utterance.voice = maleVoice;
        }
        window.speechSynthesis.speak(utterance);
    };

    // Si las voces ya están cargadas en caché, habla de inmediato. Si no, espera el milisegundo de carga.
    if (window.speechSynthesis.getVoices().length > 0) {
        applyGenderVoice();
    } else {
        window.speechSynthesis.onvoiceschanged = () => {
            applyGenderVoice();
            window.speechSynthesis.onvoiceschanged = null; // Limpia el evento para evitar bucles
        };
    }
}