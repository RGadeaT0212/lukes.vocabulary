// ==========================================================================
// 🪐 LUKES ACADEMY - CENTRAL ORCHESTRATOR v63.0 (PRIVACY & ISOLATED LOCKS)
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

// 🔔 EVALUADOR DE BADGES / ALERTAS RED DOT (! OBLIGATORIO)
window.updateAlertBadges = function() {
    const completedBubblesCount = ProgressManager?.state?.completed_bubbles?.length || 0;
    const isArenaUnlocked = completedBubblesCount >= 3;

    const missions = MissionsEngine.getMissionList ? MissionsEngine.getMissionList() : [];
    const claimed = ProgressManager?.state?.claimed_missions || [];
    const hasUnclaimedMissions = missions.some(m => m.current >= m.target && !claimed.includes(m.id));

    const challengesCompleted = ProgressManager?.state?.stats?.challengesCompleted || 0;
    const hasPendingChallenges = isArenaUnlocked && challengesCompleted === 0;

    const renderBadge = (elementId, show) => {
        const el = document.getElementById(elementId);
        if (!el) return;
        if (show) {
            el.innerHTML = `<span class="w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-black animate-pulse shadow-sm">!</span>`;
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    };

    renderBadge('missions-badge-desktop', hasUnclaimedMissions);
    renderBadge('missions-badge-mobile', hasUnclaimedMissions);
    renderBadge('challenges-badge-desktop', hasPendingChallenges);
    renderBadge('challenges-badge-mobile', hasPendingChallenges);
};

window.switchAuthTab = function(tab) {
    currentAuthTab = tab;
    const title = document.getElementById('auth-modal-title');
    const btnSubmit = document.getElementById('auth-submit-btn');
    const nameGroup = document.getElementById('field-name-group');
    const confirmGroup = document.getElementById('field-confirm-group');
    const privacyGroup = document.getElementById('field-privacy-group');
    const formContent = document.getElementById('auth-form-content');
    const pendingNotice = document.getElementById('auth-pending-notice');

    if (formContent && pendingNotice) {
        formContent.classList.remove('hidden');
        pendingNotice.classList.add('hidden');
    }

    if (tab === 'register') {
        if (title) title.textContent = "Crear Cuenta";
        if (btnSubmit) btnSubmit.textContent = "Registrar Cuenta ➔";
        if (nameGroup) nameGroup.classList.remove('hidden');
        if (confirmGroup) confirmGroup.classList.remove('hidden');
        if (privacyGroup) privacyGroup.classList.remove('hidden'); // 👈 Desoculta Política de Privacidad
    } else {
        if (title) title.textContent = "Iniciar Sesión";
        if (btnSubmit) btnSubmit.textContent = "Ingresar a la Plataforma ➔";
        if (nameGroup) nameGroup.classList.add('hidden');
        if (confirmGroup) confirmGroup.classList.add('hidden');
        if (privacyGroup) privacyGroup.classList.add('hidden');
    }
};

window.openPrivacyPolicyModal = function() {
    let modal = document.getElementById('privacy-policy-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'privacy-policy-modal';
        modal.className = "fixed inset-0 bg-[#1c2321]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none animate-fade-in";
        document.body.appendChild(modal);
    } else {
        modal.classList.remove('hidden');
    }

    modal.innerHTML = `
        <div class="card-bg border border-main text-main w-full max-w-lg rounded-3xl p-6 shadow-2xl flex flex-col gap-4 relative max-h-[85vh] overflow-y-auto custom-scrollbar text-left">
            <button onclick="document.getElementById('privacy-policy-modal').classList.add('hidden')" 
                    class="absolute top-4 right-4 w-8 h-8 rounded-full subcard-bg text-muted flex items-center justify-center text-xs cursor-pointer">✕</button>

            <div class="border-b border-main/10 pb-3">
                <span class="text-[9px] text-[#e06a4e] font-bold uppercase tracking-widest">// MARCO LEGAL Y PROTECCIÓN DE DATOS</span>
                <h3 class="font-black text-base text-main uppercase mt-0.5">Política de Privacidad</h3>
            </div>

            <div class="flex flex-col gap-3 text-xs text-muted leading-relaxed font-sans">
                <p>En <strong>Lukes English Academy</strong>, respetamos y protegemos la privacidad de nuestros estudiantes. Esta política describe cómo manejamos tus datos:</p>
                
                <div class="subcard-bg p-3 rounded-2xl border border-main flex flex-col gap-1.5 font-mono text-[10px]">
                    <strong class="text-main uppercase">1. Uso Exclusivo del Correo Electrónico:</strong>
                    <p>Tu correo electrónico se recopila únicamente para autenticar tu identidad y guardar en tiempo real tu progreso académico, vocabulario aprendido y recompensas.</p>
                </div>

                <div class="subcard-bg p-3 rounded-2xl border border-main flex flex-col gap-1.5 font-mono text-[10px]">
                    <strong class="text-main uppercase">2. No Spam y Cero Correos No Deseados:</strong>
                    <p>No enviamos boletines publicitarios ni correos comerciales. Únicamente recibirás mensajes esenciales del sistema (como enlaces de activación de cuenta o restablecimiento de contraseña).</p>
                </div>

                <div class="subcard-bg p-3 rounded-2xl border border-main flex flex-col gap-1.5 font-mono text-[10px]">
                    <strong class="text-main uppercase">3. Confidencialidad y No Compartición:</strong>
                    <p>Tus datos personales jamás serán vendidos, alquilados ni compartidos con empresas terceras ni anunciantes.</p>
                </div>
            </div>

            <button onclick="document.getElementById('privacy-policy-modal').classList.add('hidden')" 
                    class="w-full bg-[#23483f] hover:bg-[#19322b] text-white font-mono text-xs font-black py-3.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-md mt-2">
                Entendido y Cerrar ➔
            </button>
        </div>
    `;
};

// 🔐 CIERRA SESIÓN CON PURGA ABSOLUTA DE CACHÉ
window.handleLogout = function() {
    window.showConfirmModal({
        title: "¿Cerrar Sesión?",
        message: "¿Seguro que quieres salir de tu cuenta de estudiante? Se purgará el caché local temporal.",
        onConfirm: async () => {
            try {
                await supabaseClient.auth.signOut();
                
                // 🧹 Reset completo de estado y localStorage
                ProgressManager.resetProgressState();
                
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
                
                updateUI(false);
                window.updateStatsDisplay();
                window.renderHomeLessonsModule();
                window.updateAlertBadges();
                
                window.showToast("Sesión cerrada y caché purgado.", 'info');
            } catch (e) {
                console.error("Error al cerrar sesión:", e);
            }
        }
    });
};

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
                const privacyCheck = document.getElementById('auth-privacy-checkbox');

                if (password !== confirm) {
                    window.showToast("Las contraseñas no coinciden.", 'warning');
                    btn.disabled = false;
                    btn.textContent = "Registrar Cuenta ➔";
                    return;
                }

                if (privacyCheck && !privacyCheck.checked) {
                    window.showToast("Debes aceptar la Política de Privacidad para registrarte.", 'warning');
                    btn.disabled = false;
                    btn.textContent = "Registrar Cuenta ➔";
                    return;
                }

                const redirectUrl = window.location.origin.includes('github.io')
                    ? `${window.location.origin}/lukes.vocabulary/verify.html`
                    : `${window.location.origin}/verify.html`;

                const { error } = await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { first_name: name || 'Estudiante' },
                        emailRedirectTo: redirectUrl
                    }
                });

                if (error) throw error;
                showPendingEmailNotice(email);
            } else {
                const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
                if (error) throw error;

                // 🧹 Limpieza preventiva antes de cargar los datos de la cuenta que ingresa
                ProgressManager.resetProgressState();

                window.AppState.user = {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.user_metadata?.first_name || data.user.email.split('@')[0]
                };
                await ProgressManager.init();
                updateUI(true);
                window.showToast(`¡Bienvenido, ${window.AppState.user.name}!`, 'success');
                window.closeAuthModal();
                window.updateStatsDisplay();
                window.renderHomeLessonsModule();
                window.updateAlertBadges();
            }
        } catch (err) {
            window.showToast(`Error: ${err.message}`, 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = currentAuthTab === 'register' ? "Registrar Cuenta ➔" : "Ingresar a la Plataforma ➔";
        }
    });
}

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

            await ProgressManager.init();
            updateUI(true);
            window.updateAlertBadges();
            return;
        }
    } catch (e) {
        console.error("Error comprobando sesión:", e);
    }
    window.AppState.user = null;
    updateUI(false);
    window.updateAlertBadges();
}

function initRealtimeAuthListener() {
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
            window.AppState.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.first_name || session.user.email.split('@')[0]
            };

            const isNewUser = !session.user.last_sign_in_at || session.user.last_sign_in_at === session.user.created_at;
            if (isNewUser) {
                ProgressManager.resetProgressState();
            }

            await ProgressManager.init();
            updateUI(true);
            window.closeAuthModal();
            window.updateStatsDisplay();
            window.renderHomeLessonsModule();
            window.updateAlertBadges();
            window.showToast(`🎉 ¡Cuenta confirmada! Bienvenido, ${window.AppState.user.name}`, 'success');
        }
    });
}

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
        if (isDark) thumb.classList.add('translate-x-4');
        else thumb.classList.remove('translate-x-4');
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

    const rawCompletedArr = ProgressManager.state.completed_bubbles || [];
    const completedBubbles = new Set(Array.isArray(rawCompletedArr) ? rawCompletedArr : []);

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

window.startHomeLesson = function(categoryName, bubbleNum) {
    VocabularyEngine.startLessonBlock(categoryName, bubbleNum);
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

window.togglePasswordVisibility = function(inputId, eyeIconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(eyeIconId);
    if (!input) return;

    if (input.type === 'password') {
        input.type = 'text';
        if (icon) icon.className = 'fa-solid fa-eye-slash text-muted';
    } else {
        input.type = 'password';
        if (icon) icon.className = 'fa-solid fa-eye text-muted';
    }
};

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

function showPendingEmailNotice(email) {
    const formContent = document.getElementById('auth-form-content');
    const pendingNotice = document.getElementById('auth-pending-notice');
    const emailTarget = document.getElementById('pending-email-target');

    if (formContent && pendingNotice) {
        formContent.classList.add('hidden');
        pendingNotice.classList.remove('hidden');
        if (emailTarget) emailTarget.textContent = email;
    }
}

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
    initRealtimeAuthListener();
    bindAuthEvents();
    window.updateStatsDisplay();
    window.renderHomeLessonsModule();
    window.updateAlertBadges();
    dismissSplashScreen();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mainAppBoot);
} else {
    mainAppBoot();
}
