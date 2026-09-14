// ==========================================================================
// 🪐 LUKES ACADEMY - CENTRAL ORCHESTRATOR v60.3
// ==========================================================================
import { supabaseClient } from './modules/supabaseClient.js';
import { ProgressManager } from './modules/progressManager.js';
import { VocabularyEngine, BUBBLE_COLOR_PALETTE } from './modules/vocabulary.js';
import { SpeakingEngine } from './modules/speakingEngine.js';
import { ChallengesEngine } from './modules/challengesEngine.js';
import { MissionsEngine } from './modules/missionsEngine.js';

window.MissionsEngine = MissionsEngine;
window.ChallengesEngine = ChallengesEngine;

window.AppState = {
    user: null,
    carouselIndex: 0,
    homeBubbleIndex: 0,
    activeLevel: 'A1',
    activeCategory: 'EXPRESSIONS',
    isDarkMode: false,
    targetLanguage: 'en',
    isFirstLoad: true
};

let currentAuthTab = 'login';

const carouselItems = [
    { text: "🚀 ¡RUTA CONTINUA DE LECCIONES! Avanza sin modales innecesarios.", tag: "NUEVO" },
    { text: "🔥 PROGRESO REAL: Completa las lecciones para desbloquear el mapa.", tag: "SISTEMA" },
    { text: "Aprende produciendo en inglés y desbloquea las Patitas de Gato 🐾.", tag: "MÉTODO" }
];

function dismissSplashScreen() {
    const splash = document.getElementById('app-splash-screen');
    if (!splash) return;

    setTimeout(() => {
        splash.style.opacity = '0';
        splash.style.transform = 'scale(0.95)';
        setTimeout(() => {
            splash.classList.add('hidden');
            splash.style.pointerEvents = 'none';
        }, 700);
    }, 1200);
}

window.toggleDarkMode = function() {
    window.AppState.isDarkMode = !window.AppState.isDarkMode;
    const html = document.documentElement;

    if (window.AppState.isDarkMode) {
        html.classList.add('dark');
        html.classList.remove('light');
    } else {
        html.classList.add('light');
        html.classList.remove('dark');
    }

    localStorage.setItem('lukes_dark_mode', window.AppState.isDarkMode ? 'true' : 'false');
    window.updateDarkModeSwitches();
};

window.updateDarkModeSwitches = function() {
    const isDark = window.AppState.isDarkMode;
    document.querySelectorAll('.dark-toggle-thumb').forEach(thumb => {
        if (isDark) {
            thumb.classList.add('translate-x-4');
        } else {
            thumb.classList.remove('translate-x-4');
        }
    });
};

function initDarkModePreference() {
    const savedTheme = localStorage.getItem('lukes_dark_mode');
    if (savedTheme === 'true') {
        window.AppState.isDarkMode = true;
        document.documentElement.classList.add('dark');
    }
    window.updateDarkModeSwitches();
}

window.changeTargetLanguage = function(lang) {
    window.AppState.targetLanguage = lang;
    window.showToast("Idioma de aprendizaje: Inglés 🇺🇸", "info");
};

window.openUserProfileModal = function() {
    const user = window.AppState.user || { name: 'Estudiante', email: 'Invitado / Sin cuenta' };
    const stats = ProgressManager.state.stats || {};
    const skillMastery = ProgressManager.state.skill_mastery || { listening: 0, reading: 0, writing: 0, speaking: 0 };
    
    const masteredWords = ProgressManager.state.mastered_words_ids?.length || stats.wordsLearned || 0;
    const completedBubbles = ProgressManager.state.completed_bubbles?.length || 0;
    const completedChallenges = stats.challengesCompleted || 0;
    const streakDays = Math.max(1, Math.ceil(completedBubbles / 2));

    let modal = document.getElementById('user-profile-detail-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'user-profile-detail-modal';
        modal.className = "fixed inset-0 bg-[#1c2321]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none";
        document.body.appendChild(modal);
    } else {
        modal.classList.remove('hidden');
    }

    modal.innerHTML = `
        <div class="card-bg border border-main text-main w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col gap-4 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onclick="document.getElementById('user-profile-detail-modal').classList.add('hidden')" 
                    class="absolute top-4 right-4 w-8 h-8 rounded-full subcard-bg text-muted flex items-center justify-center text-xs cursor-pointer">✕</button>

            <div class="flex items-center gap-4 border-b border-main/10 pb-4">
                <div class="w-14 h-14 rounded-2xl bg-[#e06a4e] text-white flex items-center justify-center font-black text-xl shadow-md">
                    <i class="fa-solid fa-user"></i>
                </div>
                <div class="flex flex-col text-left truncate">
                    <h3 class="font-black text-base text-main uppercase truncate">${user.name}</h3>
                    <span class="text-xs text-muted truncate">${user.email}</span>
                    <span class="text-[9px] text-[#e06a4e] font-bold mt-0.5">🔥 RACHA: ${streakDays} DÍAS CONSECUTIVOS</span>
                </div>
            </div>

            <div class="flex flex-col gap-2.5">
                <span class="text-[10px] font-bold text-muted uppercase tracking-wider text-left">// CRECIMIENTO DE FLUIDEZ DE HABILIDADES</span>
                
                <div class="subcard-bg p-3.5 rounded-2xl border border-main flex flex-col gap-2">
                    <div class="flex flex-col gap-1">
                        <div class="flex justify-between text-[9px] font-bold">
                            <span>🎧 LISTENING (ESCUCHA)</span>
                            <span>${Math.round(skillMastery.listening)}%</span>
                        </div>
                        <div class="skill-bar-bg h-2 w-full">
                            <div class="skill-bar-fill" style="width: ${skillMastery.listening}%"></div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1">
                        <div class="flex justify-between text-[9px] font-bold">
                            <span>📖 READING (LECTURA)</span>
                            <span>${Math.round(skillMastery.reading)}%</span>
                        </div>
                        <div class="skill-bar-bg h-2 w-full">
                            <div class="skill-bar-fill" style="width: ${skillMastery.reading}%"></div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1">
                        <div class="flex justify-between text-[9px] font-bold">
                            <span>✍️ WRITING (ESCRITURA)</span>
                            <span>${Math.round(skillMastery.writing)}%</span>
                        </div>
                        <div class="skill-bar-bg h-2 w-full">
                            <div class="skill-bar-fill" style="width: ${skillMastery.writing}%"></div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1">
                        <div class="flex justify-between text-[9px] font-bold">
                            <span>🎙️ SPEAKING (HABLA)</span>
                            <span>${Math.round(skillMastery.speaking)}%</span>
                        </div>
                        <div class="skill-bar-bg h-2 w-full">
                            <div class="skill-bar-fill" style="width: ${skillMastery.speaking}%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center">
                <div class="subcard-bg p-2.5 rounded-2xl border border-main">
                    <span class="text-[8px] text-muted font-bold block uppercase">DOMINADAS</span>
                    <span class="text-base font-black text-main">${masteredWords}</span>
                </div>
                <div class="subcard-bg p-2.5 rounded-2xl border border-main">
                    <span class="text-[8px] text-muted font-bold block uppercase">LECCIONES</span>
                    <span class="text-base font-black text-main">${completedBubbles}</span>
                </div>
                <div class="subcard-bg p-2.5 rounded-2xl border border-main">
                    <span class="text-[8px] text-muted font-bold block uppercase">DESAFÍOS</span>
                    <span class="text-base font-black text-main">${completedChallenges}</span>
                </div>
            </div>

            <div class="flex gap-2 mt-1">
                <button onclick="window.MissionsEngine.renderLukesGoldCardModal()" 
                        class="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold text-xs py-3 rounded-xl uppercase transition-all">
                    💳 Tarjeta Gold
                </button>
                <button onclick="document.getElementById('user-profile-detail-modal').classList.add('hidden')" 
                        class="flex-1 bg-[#23483f] text-white font-bold text-xs py-3 rounded-xl uppercase transition-all">
                    Cerrar
                </button>
            </div>
        </div>
    `;
};

window.toggleBottomSheetProfile = function() {
    window.openUserProfileModal();
};

window.renderHomeLessonsModule = function() {
    const titleEl = document.getElementById('home-category-title');
    const badgeEl = document.getElementById('home-level-badge');
    const trackEl = document.getElementById('home-bubbles-track');
    const accordionEl = document.getElementById('word-preview-accordion');
    if (!titleEl || !trackEl) return;

    VocabularyEngine.loadGymCategories();
    
    const availableCategories = [...new Set(VocabularyEngine.allWords.map(w => w.category_group))];
    if (availableCategories.length > 0 && !availableCategories.includes(window.AppState.activeCategory)) {
        window.AppState.activeCategory = availableCategories[0];
    }

    const categoryWords = VocabularyEngine.allWords.filter(w => w.category_group === window.AppState.activeCategory);
    const detectedLevel = categoryWords.length > 0 ? (categoryWords[0].level || categoryWords[0].unit || 'A1') : 'A1';
    
    titleEl.textContent = window.AppState.activeCategory.replace(/_/g, ' ').toUpperCase();
    if (badgeEl) badgeEl.textContent = `NIVEL ${detectedLevel}`;

    const wordCount = categoryWords.length > 0 ? categoryWords.length : 15;
    const totalBlocks = Math.ceil(wordCount / 5);
    const totalBubbles = totalBlocks * 3;

    const rawCompletedArr = ProgressManager.state.completed_bubbles;
    const completedBubbles = new Set(Array.isArray(rawCompletedArr) ? rawCompletedArr : [1]);

    if (window.AppState.isFirstLoad) {
        let activeIndex = 0;
        for (let i = 1; i <= totalBubbles; i++) {
            if (!completedBubbles.has(i)) {
                activeIndex = i - 1;
                break;
            }
        }
        window.AppState.homeBubbleIndex = activeIndex;
        window.AppState.isFirstLoad = false;
    }

    if (accordionEl) {
        const blockIndex = Math.floor(window.AppState.homeBubbleIndex / 3);
        const startIndex = blockIndex * 5;
        const previewWords = (categoryWords.length > 0 ? categoryWords : VocabularyEngine.allWords).slice(startIndex, startIndex + 5);
        
        accordionEl.innerHTML = previewWords.map(w => `
            <div class="flex flex-col text-center p-1.5 subcard-bg rounded-xl border border-main">
                <span class="text-[10px] font-bold text-main truncate">${w.english_word || w.word}</span>
                <span class="text-[8px] text-muted truncate">${w.spanish}</span>
            </div>
        `).join('');
    }

    trackEl.innerHTML = Array.from({ length: totalBubbles }).map((_, idx) => {
        const bubbleNum = idx + 1;
        const isCompleted = completedBubbles.has(bubbleNum);
        const isUnlocked = bubbleNum === 1 || completedBubbles.has(bubbleNum - 1);
        const color = BUBBLE_COLOR_PALETTE[(bubbleNum - 1) % BUBBLE_COLOR_PALETTE.length];

        if (isCompleted) {
            return `
                <div id="home-bubble-${bubbleNum}" class="home-bubble-node flex flex-col items-center shrink-0 transition-all duration-300">
                    <button type="button" class="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg transition-all bg-[#23483f] text-white border-2 border-[#23483f] cursor-pointer"
                            onclick="window.startHomeLesson('${window.AppState.activeCategory}', ${bubbleNum})">
                        ✓
                    </button>
                </div>
            `;
        } else if (isUnlocked) {
            return `
                <div id="home-bubble-${bubbleNum}" class="home-bubble-node flex flex-col items-center shrink-0 transition-all duration-300">
                    <button type="button" class="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer text-white"
                            style="background-color: ${color}; border-color: ${color};"
                            onclick="window.startHomeLesson('${window.AppState.activeCategory}', ${bubbleNum})">
                        ${bubbleNum}
                    </button>
                </div>
            `;
        } else {
            return `
                <div id="home-bubble-${bubbleNum}" class="home-bubble-node flex flex-col items-center shrink-0 transition-all duration-300">
                    <button type="button" class="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-black text-xl sm:text-2xl shadow-sm bg-[#e3dec3] dark:bg-[#222d29] text-muted cursor-not-allowed">
                        <i class="fa-solid fa-lock text-base sm:text-2xl lock-icon"></i>
                    </button>
                </div>
            `;
        }
    }).join('');

    window.updateHomeCarouselPosition();
    window.initTouchSwipeForBubbles();
};

window.moveHomeCarousel = function(direction) {
    const track = document.getElementById('home-bubbles-track');
    if (!track) return;

    const totalNodes = track.querySelectorAll('.home-bubble-node').length;
    let nextIdx = window.AppState.homeBubbleIndex + direction;

    if (nextIdx < 0) nextIdx = 0;
    if (nextIdx >= totalNodes) nextIdx = totalNodes - 1;

    window.AppState.homeBubbleIndex = nextIdx;
    window.updateHomeCarouselPosition();
};

window.triggerHomeCarouselTransition = function(completedBubbleNum) {
    if (typeof window.renderHomeLessonsModule === 'function') {
        window.renderHomeLessonsModule();
    }

    const currentBubbleEl = document.getElementById(`home-bubble-${completedBubbleNum}`);
    const nextBubbleNum = completedBubbleNum + 1;
    const nextBubbleEl = document.getElementById(`home-bubble-${nextBubbleNum}`);

    if (currentBubbleEl && window.confetti) {
        const rect = currentBubbleEl.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        window.confetti({
            particleCount: 60,
            spread: 60,
            origin: { x, y }
        });
    }

    if (nextBubbleEl) {
        const lockIcon = nextBubbleEl.querySelector('.lock-icon');
        if (lockIcon) {
            lockIcon.className = 'fa-solid fa-lock-open text-sm sm:text-xl text-[#e06a4e] animate-unlock';
        }
    }

    setTimeout(() => {
        window.AppState.homeBubbleIndex = Math.max(0, nextBubbleNum - 1);
        window.updateHomeCarouselPosition();
    }, 850);
};

window.updateHomeCarouselPosition = function() {
    const track = document.getElementById('home-bubbles-track');
    if (!track) return;

    const isDesktop = window.innerWidth >= 640;
    const stepWidth = isDesktop ? 120 : 88;
    const currentIndex = window.AppState.homeBubbleIndex || 0;
    const offset = -(currentIndex * stepWidth);

    track.style.transform = `translateX(${offset}px)`;

    const nodes = track.querySelectorAll('.home-bubble-node');
    nodes.forEach((node, i) => {
        if (i === currentIndex) {
            node.style.transform = 'scale(1.25)';
            node.style.opacity = '1';
            node.style.zIndex = '10';
        } else {
            node.style.transform = 'scale(0.85)';
            node.style.opacity = '0.45';
            node.style.zIndex = '1';
        }
    });
};

window.initTouchSwipeForBubbles = function() {
    const trackContainer = document.getElementById('home-bubbles-track')?.parentElement;
    if (!trackContainer || trackContainer.dataset.swipeInitialized) return;

    let touchStartX = 0;

    trackContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    trackContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diffX = touchStartX - touchEndX;

        if (Math.abs(diffX) > 35) {
            if (diffX > 0) {
                window.moveHomeCarousel(1);
            } else {
                window.moveHomeCarousel(-1);
            }
        }
    }, { passive: true });

    trackContainer.dataset.swipeInitialized = "true";
};

window.toggleWordPreviewAccordion = function() {
    const accordion = document.getElementById('word-preview-accordion');
    const chevron = document.getElementById('preview-chevron');
    if (!accordion) return;

    const isHidden = accordion.classList.contains('hidden');
    if (isHidden) {
        accordion.classList.remove('hidden');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
    } else {
        accordion.classList.add('hidden');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
};

window.changeAppLevel = function(newLevel) {
    window.AppState.activeLevel = newLevel;
    window.AppState.homeBubbleIndex = 0;
    window.AppState.isFirstLoad = true;
    window.renderHomeLessonsModule();
};

window.startHomeLesson = function(categoryName, bubbleNum) {
    VocabularyEngine.startLessonBlock(categoryName, bubbleNum);
};

window.showToast = function(message, type = 'info') {
    const container = document.getElementById('luke-alert-container');
    if (!container) return;

    const toast = document.createElement('div');
    let bgStyle = 'bg-[#23483f] border-[#19322b] text-white';
    if (type === 'error') bgStyle = 'bg-rose-50 border-rose-200 text-rose-600';
    if (type === 'success') bgStyle = 'bg-[#f0f7f4] border-[#d2e8e2] text-[#23483f]';
    if (type === 'warning') bgStyle = 'bg-[#fdf6f0] border-[#f3d5c8] text-[#e06a4e]';

    toast.className = `p-4 rounded-2xl border text-xs font-mono font-bold uppercase tracking-wider shadow-xl transition-all duration-300 translate-y-2 opacity-0 text-center z-50 pointer-events-auto min-w-[280px] max-w-sm ${bgStyle}`;
    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 10);
    setTimeout(() => {
        toast.classList.add('opacity-0', '-translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};

window.updateStatsDisplay = function() {
    const stats = ProgressManager.state.stats || {};
    const masteredIds = ProgressManager.state.mastered_words_ids || [];
    const totalVocabularyCount = 340;

    const learnedCount = masteredIds.length || stats.wordsLearned || 0;
    const wordPercentage = Math.min(100, Math.round((learnedCount / totalVocabularyCount) * 100));

    const completedBubbles = ProgressManager.state.completed_bubbles?.length || 0;
    const lessonPercentage = Math.min(100, Math.round((completedBubbles / 60) * 100));
    const challengesCount = stats.challengesCompleted || 0;
    const challengePercentage = Math.min(100, Math.round((challengesCount / 20) * 100));

    const setCircleProgress = (elementId, percentage) => {
        const el = document.getElementById(elementId);
        if (el) el.setAttribute('stroke-dasharray', `${percentage}, 100`);
    };

    setCircleProgress('circle-words-progress', wordPercentage);
    setCircleProgress('circle-challenges-progress', challengePercentage);
    setCircleProgress('circle-missions-progress', lessonPercentage);

    const wordsEl = document.getElementById('stat-words-learned');
    const challengesEl = document.getElementById('stat-challenges-completed');
    const missionsEl = document.getElementById('stat-missions-completed');
    const pawsHeaderEl = document.getElementById('header-coins-display');
    const pawsMobileEl = document.getElementById('mobile-coins-display');

    if (wordsEl) wordsEl.textContent = `${wordPercentage}%`;
    if (challengesEl) challengesEl.textContent = challengesCount;
    if (missionsEl) missionsEl.textContent = `${lessonPercentage}%`;
    if (pawsHeaderEl) pawsHeaderEl.textContent = stats.paws || 0;
    if (pawsMobileEl) pawsMobileEl.textContent = stats.paws || 0;
};

window.openSpeakingManager = function() { SpeakingEngine.initSpeakingModule(); };
window.openChallengesManager = function() { ChallengesEngine.openChallengesHub(); };
window.openMissionsManager = function() { MissionsEngine.initMissionsModule(); };

window.openAuthModal = function(tab = 'login') {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        window.switchAuthTab(tab);
    }
};

window.closeAuthModal = function() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('opacity-0', 'pointer-events-none');
};

window.switchAuthTab = function(tab) {
    currentAuthTab = tab;
    const title = document.getElementById('auth-modal-title');
    const btnSubmit = document.getElementById('auth-submit-btn');
    const nameGroup = document.getElementById('field-name-group');
    const confirmGroup = document.getElementById('field-confirm-group');

    if (tab === 'register') {
        if (title) title.textContent = "Crear Cuenta";
        if (btnSubmit) btnSubmit.textContent = "Registrar Cuenta ➔";
        if (nameGroup) nameGroup.classList.remove('hidden');
        if (confirmGroup) confirmGroup.classList.remove('hidden');
    } else {
        if (title) title.textContent = "Iniciar Sesión";
        if (btnSubmit) btnSubmit.textContent = "Ingresar a la Plataforma ➔";
        if (nameGroup) nameGroup.classList.add('hidden');
        if (confirmGroup) confirmGroup.classList.add('hidden');
    }
};

function updateUI(isLoggedIn) {
    const guestBlock = document.getElementById('guest-auth-actions');
    const userBlock = document.getElementById('logged-user-actions');
    const mobGuestBtns = document.getElementById('mobile-auth-guest-btns');
    const mobUserBtn = document.getElementById('mobile-auth-user-btn');
    const nameDisp = document.getElementById('student-name-display');
    const mobNameDisp = document.getElementById('mobile-name-display');

    if (isLoggedIn && window.AppState.user) {
        if (guestBlock) guestBlock.classList.add('hidden');
        if (userBlock) userBlock.classList.remove('hidden');
        if (mobGuestBtns) mobGuestBtns.classList.add('hidden');
        if (mobUserBtn) mobUserBtn.classList.remove('hidden');

        const displayName = window.AppState.user.name || 'Estudiante';
        if (nameDisp) nameDisp.textContent = displayName;
        if (mobNameDisp) mobNameDisp.textContent = displayName;
    } else {
        if (guestBlock) guestBlock.classList.remove('hidden');
        if (userBlock) userBlock.classList.add('hidden');
        if (mobGuestBtns) mobGuestBtns.classList.remove('hidden');
        if (mobUserBtn) mobUserBtn.classList.add('hidden');
    }
}

async function checkSession() {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session && session.user) {
            window.AppState.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.first_name || session.user.email.split('@')[0]
            };
            updateUI(true);
            return;
        }
    } catch (e) {
        console.error("Error comprobando sesión:", e);
    }
    window.AppState.user = null;
    updateUI(false);
}

function bindAuthEvents() {
    const form = document.getElementById('auth-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email-input').value.trim();
        const password = document.getElementById('auth-password-input').value;
        const btn = document.getElementById('auth-submit-btn');

        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Procesando...`;

        try {
            if (currentAuthTab === 'register') {
                const name = document.getElementById('auth-name-input').value.trim();
                const confirm = document.getElementById('auth-confirm-input').value;

                if (password !== confirm) {
                    window.showToast("Las contraseñas no coinciden.", 'warning');
                    return;
                }

                const { error } = await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: { data: { first_name: name || 'Estudiante' } }
                });

                if (error) throw error;
                window.showToast("¡Registro enviado! Revisa tu correo.", 'success');
                window.closeAuthModal();
            } else {
                const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
                if (error) throw error;

                window.AppState.user = {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.user_metadata?.first_name || data.user.email.split('@')[0]
                };
                updateUI(true);
                window.showToast(`¡Bienvenido, ${window.AppState.user.name}!`, 'success');
                window.closeAuthModal();
            }
        } catch (err) {
            window.showToast(`Error: ${err.message}`, 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = currentAuthTab === 'register' ? "Registrar Cuenta ➔" : "Ingresar a la Plataforma ➔";
        }
    });
}

// 🔐 CIERRA SESIÓN Y REINICIA EL MAPA Y LAS ESTADÍSTICAS A ESTADO INVITADO
// 🛑 MODAL CENTRADO DE CONFIRMACIÓN GLOBAL (YES / NO)
window.showConfirmModal = function({ title = "¿Seguro que quieres salir?", message = "Perderás el progreso que no hayas guardado.", onConfirm }) {
    let modal = document.getElementById('global-confirm-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'global-confirm-modal';
        modal.className = "fixed inset-0 bg-[#1c2321]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none animate-fade-in";
        document.body.appendChild(modal);
    } else {
        modal.classList.remove('hidden');
    }

    modal.innerHTML = `
        <div class="card-bg border border-main text-main w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center relative">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl border border-amber-500/20">
                <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            
            <div class="flex flex-col gap-1">
                <h3 class="font-black text-base text-main uppercase">${title}</h3>
                <p class="text-xs text-muted leading-relaxed">${message}</p>
            </div>

            <div class="flex gap-2.5 w-full mt-2">
                <button id="confirm-modal-no-btn" 
                        class="flex-1 subcard-bg hover:bg-main text-main font-bold text-xs py-3 rounded-xl uppercase transition-all border border-main cursor-pointer">
                    No
                </button>
                <button id="confirm-modal-yes-btn" 
                        class="flex-1 bg-[#e06a4e] hover:bg-[#c8573b] text-white font-bold text-xs py-3 rounded-xl uppercase transition-all shadow-md cursor-pointer">
                    Sí, salir
                </button>
            </div>
        </div>
    `;

    document.getElementById('confirm-modal-no-btn').onclick = () => {
        modal.classList.add('hidden');
    };

    document.getElementById('confirm-modal-yes-btn').onclick = () => {
        modal.classList.add('hidden');
        if (typeof onConfirm === 'function') onConfirm();
    };
};

// 🔐 CIERRA SESIÓN CON CONFIRMACIÓN
window.handleLogout = function() {
    window.showConfirmModal({
        title: "¿Cerrar Sesión?",
        message: "¿Seguro que quieres salir de tu cuenta de estudiante?",
        onConfirm: async () => {
            try {
                await supabaseClient.auth.signOut();
                window.AppState.user = null;
                
                if (ProgressManager.resetProgressState) {
                    ProgressManager.resetProgressState();
                }
                
                updateUI(false);
                window.AppState.isFirstLoad = true;
                window.AppState.homeBubbleIndex = 0;
                
                window.updateStatsDisplay();
                window.renderHomeLessonsModule();
                
                window.showToast("Sesión cerrada.", 'info');
            } catch (e) {
                console.error("Error al cerrar sesión:", e);
            }
        }
    });
};

function initCarousel() {
    const track = document.getElementById('carousel-track');
    const dots = document.getElementById('carousel-dots');
    if (!track || !dots) return;

    track.innerHTML = carouselItems.map((item) => `
        <div class="w-full flex-shrink-0 h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 subcard-bg transition-all select-none">
            <span class="text-[9px] sm:text-[10px] font-black px-3 py-1 bg-[#23483f] text-white rounded-full tracking-widest mb-2">${item.tag}</span>
            <p class="text-main font-extrabold text-xs sm:text-base max-w-lg leading-relaxed">${item.text}</p>
        </div>
    `).join('');

    dots.innerHTML = carouselItems.map((_, idx) => `
        <div class="w-2 h-2 rounded-full bg-[#8a938e] transition-all duration-300" id="dot-${idx}"></div>
    `).join('');

    updateCarouselView();
    setInterval(() => {
        window.AppState.carouselIndex = (window.AppState.carouselIndex + 1) % carouselItems.length;
        updateCarouselView();
    }, 5000);
}

function updateCarouselView() {
    const track = document.getElementById('carousel-track');
    const offset = window.AppState.carouselIndex * -100;
    if (track) track.style.transform = `translateX(${offset}%)`;

    carouselItems.forEach((_, idx) => {
        const dot = document.getElementById(`dot-${idx}`);
        if (dot) {
            dot.className = idx === window.AppState.carouselIndex
                ? "w-6 h-2 rounded-full bg-[#23483f] dark:bg-white transition-all duration-300 shadow-xs"
                : "w-2 h-2 rounded-full bg-[#8a938e]/60 transition-all duration-300";
        }
    });
}

async function mainAppBoot() {
    console.log("// Lukes Central Orchestrator Booted.");
    initDarkModePreference();
    await ProgressManager.init();
    initCarousel();
    checkSession();
    bindAuthEvents();
    window.updateStatsDisplay();
    window.renderHomeLessonsModule();
    dismissSplashScreen();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mainAppBoot);
} else {
    mainAppBoot();
}
