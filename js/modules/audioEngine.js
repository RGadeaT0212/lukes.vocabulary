// ==========================================================================
// 🔊 MOTOR DE SÍNTESIS DE AUDIO NATIVO (WEB SPEECH API) v58.0
// ==========================================================================

let activeGender = 'female';

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
        const utterance = new SpeechSynthesisUtterance(String(text));
        utterance.lang = 'en-US';
        utterance.rate = rate;

        const applyVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            const englishVoices = voices.filter(v => v.lang.startsWith('en'));

            if (englishVoices.length > 0) {
                if (targetGender === 'female') {
                    const femaleVoice = englishVoices.find(v => 
                        v.name.toLowerCase().includes('female') || 
                        v.name.toLowerCase().includes('zira') || 
                        v.name.toLowerCase().includes('samantha') || 
                        v.name.toLowerCase().includes('hazel') ||
                        v.name.toLowerCase().includes('victoria')
                    );
                    if (femaleVoice) utterance.voice = femaleVoice;
                } else {
                    const maleVoice = englishVoices.find(v => 
                        v.name.toLowerCase().includes('male') || 
                        v.name.toLowerCase().includes('david') || 
                        v.name.toLowerCase().includes('mark') ||
                        v.name.toLowerCase().includes('george')
                    );
                    if (maleVoice) utterance.voice = maleVoice;
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
export default AudioEngine; // 👈 Agregado para compatibilidad total
