// ==========================================================================
// 🔊 MOTOR DE SÍNTESIS DE AUDIO NATIVO (WEB SPEECH API) v59.0
// ==========================================================================

let activeGender = 'female';

const LANG_CODE_MAP = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    it: 'it-IT',
    pt: 'pt-PT',
    de: 'de-DE'
};

export const AudioEngine = {
    toggleLessonVoiceGender() {
        activeGender = activeGender === 'female' ? 'male' : 'female';
        return activeGender;
    },

    speak(text, rate = 0.55, overrideGender = null) {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();

        if (!text) return;

        const targetGender = overrideGender || activeGender;
        const targetLangKey = window.AppState?.targetLanguage || localStorage.getItem('lukes_target_lang') || 'en';
        const expectedLangCode = LANG_CODE_MAP[targetLangKey] || 'en-US';

        const utterance = new SpeechSynthesisUtterance(String(text));
        utterance.lang = expectedLangCode;
        utterance.rate = rate;

        const applyVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            const matchingVoices = voices.filter(v => v.lang.startsWith(targetLangKey) || v.lang.startsWith(expectedLangCode.slice(0, 2)));

            if (matchingVoices.length > 0) {
                if (targetGender === 'female') {
                    const femaleVoice = matchingVoices.find(v => 
                        v.name.toLowerCase().includes('female') || 
                        v.name.toLowerCase().includes('zira') || 
                        v.name.toLowerCase().includes('samantha') || 
                        v.name.toLowerCase().includes('hazel') ||
                        v.name.toLowerCase().includes('hortense') ||
                        v.name.toLowerCase().includes('victoria')
                    );
                    if (femaleVoice) utterance.voice = femaleVoice;
                    else utterance.voice = matchingVoices[0];
                } else {
                    const maleVoice = matchingVoices.find(v => 
                        v.name.toLowerCase().includes('male') || 
                        v.name.toLowerCase().includes('david') || 
                        v.name.toLowerCase().includes('mark') ||
                        v.name.toLowerCase().includes('thomas') ||
                        v.name.toLowerCase().includes('george')
                    );
                    if (maleVoice) utterance.voice = maleVoice;
                    else utterance.voice = matchingVoices[0];
                }
            }
            window.speechSynthesis.speak(utterance);
        };

        if (window.speechSynthesis.getVoices().length > 0) {
            applyVoice();
        } else {
            window.speechSynthesis.onvoiceschanged = () => {
                applyVoice();
                window.speechSynthesis.onvoiceschanged = null;
            };
        }
    }
};

window.AudioEngine = AudioEngine;
export default AudioEngine;
