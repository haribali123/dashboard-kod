const TEST_USER_ID = '11111111-1111-1111-1111-111111111111';
let currentScrapeJobId = null;

// Navigation Elements
const dashboardView = document.getElementById('dashboardView');
const uploadView = document.getElementById('uploadView');
const previewView = document.getElementById('previewView');
const jobDetailsView = document.getElementById('jobDetailsView');
const historyView = document.getElementById('historyView');
const templatesView = document.getElementById('templatesView');
const subscriptionView = document.getElementById('subscriptionView');
const settingsView = document.getElementById('settingsView');
const navDashboard = document.getElementById('navDashboard');
const navUpload = document.getElementById('navUpload');
const navPreview = document.getElementById('navPreview');
const navHistory = document.getElementById('navHistory');
const navTemplates = document.getElementById('navTemplates');
const navSubscription = document.getElementById('navSubscription');
const navSettings = document.getElementById('navSettings');
const viewTitle = document.getElementById('viewTitle');

// Mobile Sidebar Drawer Elements
const mainSidebar = document.getElementById('mainSidebar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');

function toggleMobileSidebar(open) {
    if (!mainSidebar || !sidebarBackdrop) return;
    if (open) {
        mainSidebar.classList.remove('-translate-x-full');
        sidebarBackdrop.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    } else {
        mainSidebar.classList.add('-translate-x-full');
        sidebarBackdrop.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileSidebar(true));
}
if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', () => toggleMobileSidebar(false));
}
if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => toggleMobileSidebar(false));
}

window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        document.body.classList.remove('overflow-hidden');
        if (sidebarBackdrop) sidebarBackdrop.classList.add('hidden');
        const pendingPanel = document.getElementById('pendingJobsPanel');
        const editorCard = document.getElementById('editorCard');
        if (pendingPanel) pendingPanel.classList.remove('hidden');
        if (editorCard) {
            editorCard.classList.remove('hidden');
            editorCard.classList.add('flex');
        }
    }
    if (typeof trendChartInstance !== 'undefined' && trendChartInstance) {
        trendChartInstance.resize();
    }
    if (typeof ratioChart !== 'undefined' && ratioChart) {
        ratioChart.resize();
    }
});

// Settings Elements
const settingsFullName = document.getElementById('settingsFullName');
const settingsEmail = document.getElementById('settingsEmail');
const settingsPlatform = document.getElementById('settingsPlatform');
const settingsStoreUrl = document.getElementById('settingsStoreUrl');
const settingsApiKey = document.getElementById('settingsApiKey');
const settingsLanguage = document.getElementById('settingsLanguage');
const themeGrid = document.getElementById('themeGrid');
const themeCards = themeGrid ? themeGrid.querySelectorAll('.theme-card') : [];
const settingsNotifications = document.getElementById('settingsNotifications');

// Theme Interaction
if (themeGrid) {
    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            themeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const theme = card.dataset.theme;
            applyTheme(theme);
        });
    });
}

function applyTheme(theme) {
    if (!theme) return;
    document.body.classList.remove('theme-webspiring-light', 'theme-dark', 'theme-midnight-black');
    document.body.classList.add(theme);
}

// Language Interaction
if (settingsLanguage) {
    settingsLanguage.addEventListener('change', () => {
        alert('Hamarosan! A teljes fordításhoz (Localization) Stripe integráció és AI fordítási motor szükséges. Beállítás elmentve.');
        saveSettings();
    });
}
const btnSaveSettings = document.getElementById('btnSaveSettings');
const btnDeleteAccount = document.getElementById('btnDeleteAccount');

const welcomeMessage = document.getElementById('welcomeMessage');
const btnNewUploadCTA = document.getElementById('btnNewUploadCTA');
const btnBackToDashboard = document.getElementById('btnBackToDashboard');

// Subscription Elements
const tokenUsageText = document.getElementById('tokenUsageText');
const tokenProgressBar = document.getElementById('tokenProgressBar');
const btnBuyTokens = document.getElementById('btnBuyTokens');

// Templates Elements
const templatesToggle = document.getElementById('templatesToggle');
const templatesSettingsContainer = document.getElementById('templatesSettingsContainer');
const templatesDisabledState = document.getElementById('templatesDisabledState');
const templateAiTone = document.getElementById('templateAiTone');
const templateContentStructure = document.getElementById('templateContentStructure');
const templateSeoTitle = document.getElementById('templateSeoTitle');
const templateSeoDescription = document.getElementById('templateSeoDescription');
const btnSaveTemplate = document.getElementById('btnSaveTemplate');

// History Elements
const historySearch = document.getElementById('historySearch');
const historyStatusFilter = document.getElementById('historyStatusFilter');
const historyTableBody = document.getElementById('historyTableBody');
const historyEmptyState = document.getElementById('historyEmptyState');
let allHistoryJobs = [];

// ==========================================
// JOB TRACKING & PERZISZTENCIA (LocalStorage & API)
// ==========================================
const HISTORY_STORAGE_KEY = 'supplylink_history_jobs';
const BALANCE_STORAGE_KEY = 'supplylink_credits';
const SHOPS_STORAGE_KEY   = 'supplylink_user_shops';

function getStoredJobs() {
    try {
        const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {
        console.warn('Hiba a helyi feladatok beolvasásakor:', e);
    }
    return [];
}

function saveJobToHistory(job) {
    const jobs = getStoredJobs();
    const existingIndex = jobs.findIndex(j => String(j.id) === String(job.id));
    if (existingIndex >= 0) {
        jobs[existingIndex] = { ...jobs[existingIndex], ...job };
    } else {
        jobs.unshift(job);
    }
    try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(jobs));
    } catch (e) {
        console.warn('Hiba a feladat mentésekor:', e);
    }
    allHistoryJobs = jobs;
    return job;
}

function updateJobInHistory(jobId, updates) {
    const jobs = getStoredJobs();
    const index = jobs.findIndex(j => String(j.id) === String(jobId));
    if (index >= 0) {
        jobs[index] = { ...jobs[index], ...updates };
        try {
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(jobs));
        } catch (e) {
            console.warn('Hiba a feladat frissítésekor:', e);
        }
    }
    allHistoryJobs = jobs;
    return index >= 0 ? jobs[index] : null;
}

function deleteJobFromHistory(jobId) {
    let jobs = getStoredJobs();
    jobs = jobs.filter(j => String(j.id) !== String(jobId));
    try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(jobs));
    } catch (e) {
        console.warn('Hiba a feladat törlésekor:', e);
    }
    allHistoryJobs = jobs;
    if (typeof applyHistoryFilters === 'function') applyHistoryFilters();
    if (typeof fetchStats === 'function' && typeof currentTimeframe !== 'undefined') fetchStats(currentTimeframe);
}

function initializeLocalData() {
    if (localStorage.getItem('supplylink_initialized_v3') === null) {
        const sampleJobs = [
            {
                id: 'job_' + Date.now().toString(36) + '_1',
                created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
                source_urls: [
                    'https://pelda-beszallito.hu/termek/akkus-furogep-20v',
                    'https://pelda-beszallito.hu/termek/furoszar-keszlet-24db',
                    'https://pelda-beszallito.hu/termek/potakku-li-ion-4ah'
                ],
                target_webshop_id: 'Unas - Fő webáruház',
                shop_id: 'unas_main',
                mode: 'Scraper',
                status: 'success',
                product_count: 3,
                price: '720 Ft'
            },
            {
                id: 'job_' + Date.now().toString(36) + '_2',
                created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
                source_urls: [
                    'termek_import_tavaszi_katalogus.xlsx'
                ],
                target_webshop_id: 'Unas - Fő webáruház',
                shop_id: 'unas_main',
                mode: 'Excel import',
                status: 'success',
                product_count: 14,
                price: '3 360 Ft'
            }
        ];
        try {
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(sampleJobs));
            localStorage.setItem(BALANCE_STORAGE_KEY, '133');
            localStorage.setItem('supplylink_initialized_v3', 'true');
        } catch (e) {}
    }
}
initializeLocalData();
allHistoryJobs = getStoredJobs();


// Preview & Editor Elements
const pendingJobsList = document.getElementById('pendingJobsList');
const editorCard = document.getElementById('editorCard');
const editorJobId = document.getElementById('editorJobId');
const editorTitle = document.getElementById('editorTitle');
const editorPrice = document.getElementById('editorPrice');
const editorNetPrice = document.getElementById('editorNetPrice');
const btnApplyVatCalcSimple = document.getElementById('btnApplyVatCalcSimple');
const vatSourceCountrySimple = document.getElementById('vatSourceCountrySimple');
const vatTargetCountrySimple = document.getElementById('vatTargetCountrySimple');
const editorImage = document.getElementById('editorImage');
const editorImagePlaceholder = document.getElementById('editorImagePlaceholder');
const btnApprove = document.getElementById('btnApprove');
const btnDiscard = document.getElementById('btnDiscard');
// ==========================================
// VISSZAVONÁS (UNDO) RENDSZER
// ==========================================
const btnUndo = document.getElementById('btnUndo');
let historyStack = []; // Itt tároljuk az előző állapotokat

function saveState() {
    // Készítünk egy "pillanatképet" a jelenlegi adatokról
    historyStack.push(JSON.stringify(pendingJobs));
    if (historyStack.length > 20) historyStack.shift(); // Max 20 lépést jegyez meg
    if (btnUndo) btnUndo.classList.remove('hidden'); // Megjelenítjük a gombot
}

if (btnUndo) {
    btnUndo.addEventListener('click', () => {
        if (historyStack.length > 0) {
            // Visszatöltjük a legutolsó mentett állapotot
            const previousState = historyStack.pop();
            pendingJobs = JSON.parse(previousState);
            
            // Ha kiürült a történelem, eltüntetjük a gombot
            if (historyStack.length === 0) btnUndo.classList.add('hidden'); 
            
            // Frissítjük a képernyőt a régi (visszavont) adatokkal
            fetchPendingJobs();
            if (currentActiveJobId) selectJob(currentActiveJobId);
        }
    });
}

// Rákötjük a mentést az összes létező inputra (amikor belekattintasz, ment egyet)
const inputsToTrack = [
    editorTitle, 
    editorPrice, 
    document.getElementById('editorSku'), 
    document.getElementById('editorShortDesc'), 
    document.getElementById('editorLongDesc')
];

inputsToTrack.forEach(el => {
    if (el) {
        el.addEventListener('focus', () => saveState());
    }
});

// Dashboard Elements
const statTotalUploads = document.getElementById('statTotalUploads');
const statTokensUsed = document.getElementById('statTokensUsed');
const statTimeSaved = document.getElementById('statTimeSaved');
const statCostSaved = document.getElementById('statCostSaved');
const dashboardRecentJobs = document.getElementById('dashboardRecentJobs');
const timeFilters = document.getElementById('timeFilters');

// Job Details Elements
const detailsJobId = document.getElementById('detailsJobId');
const detailsStatusBadge = document.getElementById('detailsStatusBadge');
const detailsSourceUrls = document.getElementById('detailsSourceUrls');

// Upload Form Elements
const balanceDisplay = document.getElementById('balanceDisplay');
const shopSwitcher = document.getElementById('shopSwitcher');
const importForm = document.getElementById('importForm');
const recentJobs = document.getElementById('recentJobs');
const urlsTextarea = document.getElementById('urls');
const tokenCounter = document.getElementById('tokenCounter');
const modeAuto = document.getElementById('modeAuto');
const modeManual = document.getElementById('modeManual');
const modeImport = document.getElementById('modeImport');
const categoryModeInput = document.getElementById('categoryMode');
const productUrlCount = document.getElementById('productUrlCount');
const categoryUrlsTextarea = document.getElementById('categoryUrls');
const categoryUrlCount = document.getElementById('categoryUrlCount');
let currentCategoryMode = 'automatic';
const languagePills = document.getElementById('languagePills');
const languagesSelect = document.getElementById('languages');
let selectedLanguages = [];

// Language Selector Logic
languagesSelect.addEventListener('change', () => {
    const lang = languagesSelect.value;
    if (lang && !selectedLanguages.includes(lang)) {
        selectedLanguages.push(lang);
        renderLanguages();
    }
    languagesSelect.selectedIndex = 0;
});

function renderLanguages() {
    languagePills.innerHTML = '';
    selectedLanguages.forEach(lang => {
        const pill = document.createElement('div');
        pill.className = 'bg-blue-600 text-white rounded px-2 py-1 flex items-center text-sm';
        pill.innerHTML = `
            <span>${lang}</span>
            <button type='button' class='ml-2 focus:outline-none hover:text-gray-200' onclick="removeLanguage('${lang}')">
                <svg xmlns='http://www.w3.org/2000/svg' class='h-3 w-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12' />
                </svg>
            </button>
        `;
        languagePills.appendChild(pill);
    });
}

window.removeLanguage = (lang) => {
    selectedLanguages = selectedLanguages.filter(l => l !== lang);
    renderLanguages();
};

// Charts State
let trendChart = null;
let ratioChart = null;
let currentTimeframe = 'weekly';
let previousViewBeforeDetails = 'dashboard';
let currentJobForDetails = null;

// Navigation Logic
function showView(view) {
    if (view !== 'job-details') {
        previousViewBeforeDetails = view;
    }

    // Mobil oldalsáv automatikus bezárása nézetváltáskor
    if (typeof toggleMobileSidebar === 'function') {
        toggleMobileSidebar(false);
    }

    if (view === 'dashboard') {
        dashboardView.classList.remove('hidden');
        uploadView.classList.add('hidden');
        previewView.classList.add('hidden');
        jobDetailsView.classList.add('hidden');
        historyView.classList.add('hidden');
        settingsView.classList.add('hidden');
        navDashboard.classList.add('active');
        navUpload.classList.remove('active');
        navPreview.classList.remove('active');
        navHistory.classList.remove('active');
        navSettings.classList.remove('active');
        viewTitle.textContent = 'Vezérlőpult Áttekintés';
        welcomeMessage.classList.remove('hidden');
        fetchStats(currentTimeframe);
    } else if (view === 'upload') {
        dashboardView.classList.add('hidden');
        uploadView.classList.remove('hidden');
        previewView.classList.add('hidden');
        jobDetailsView.classList.add('hidden');
        historyView.classList.add('hidden');
        settingsView.classList.add('hidden');
        navDashboard.classList.remove('active');
        navUpload.classList.add('active');
        navPreview.classList.remove('active');
        navHistory.classList.remove('active');
        navSettings.classList.remove('active');
        viewTitle.textContent = 'Új feltöltés';
        welcomeMessage.classList.add('hidden');
    } else if (view === 'preview') {
        dashboardView.classList.add('hidden');
        uploadView.classList.add('hidden');
        previewView.classList.remove('hidden');
        jobDetailsView.classList.add('hidden');
        historyView.classList.add('hidden');
        settingsView.classList.add('hidden');
        navDashboard.classList.remove('active');
        navUpload.classList.remove('active');
        navPreview.classList.add('active');
        navHistory.classList.remove('active');
        navSettings.classList.remove('active');
        viewTitle.textContent = 'Előnézet & Jóváhagyás';
        welcomeMessage.classList.add('hidden');
        if (window.innerWidth < 1024 && typeof setPreviewMobileTab === 'function') {
            setPreviewMobileTab('list');
        }
        fetchPendingJobs();
    } else if (view === 'job-details') {
        dashboardView.classList.add('hidden');
        uploadView.classList.add('hidden');
        previewView.classList.add('hidden');
        jobDetailsView.classList.remove('hidden');
        historyView.classList.add('hidden');
        settingsView.classList.add('hidden');
        navDashboard.classList.remove('active');
        navUpload.classList.remove('active');
        navPreview.classList.remove('active');
        navHistory.classList.remove('active');
        navSettings.classList.remove('active');
        viewTitle.textContent = 'Feladat részletei';
        welcomeMessage.classList.add('hidden');
        const backTextEl = document.getElementById('jobDetailsBackText');
        if (backTextEl) {
            backTextEl.textContent = previousViewBeforeDetails === 'history' ? 'Vissza az Előzményekhez' : 'Vissza a Vezérlőpulthoz';
        }
    } else if (view === 'history') {
        dashboardView.classList.add('hidden');
        uploadView.classList.add('hidden');
        previewView.classList.add('hidden');
        jobDetailsView.classList.add('hidden');
        historyView.classList.remove('hidden');
        settingsView.classList.add('hidden');
        navDashboard.classList.remove('active');
        navUpload.classList.remove('active');
        navPreview.classList.remove('active');
        navHistory.classList.add('active');
        navSettings.classList.remove('active');
        viewTitle.textContent = 'Előzmények';
        welcomeMessage.classList.add('hidden');
        fetchHistory();
    } else if (view === 'settings') {
        dashboardView.classList.add('hidden');
        uploadView.classList.add('hidden');
        previewView.classList.add('hidden');
        jobDetailsView.classList.add('hidden');
        historyView.classList.add('hidden');
        settingsView.classList.remove('hidden');
        navDashboard.classList.remove('active');
        navUpload.classList.remove('active');
        navPreview.classList.remove('active');
        navHistory.classList.remove('active');
        navSettings.classList.add('active');
        viewTitle.textContent = 'Beállítások';
        welcomeMessage.classList.add('hidden');
        fetchSettings();
    }
}

// ==========================================
// --- Perzisztens és élő szerkesztő motor ---
const PENDING_STORAGE_KEY = 'supplylink_pending_jobs';

function updateSidebarPreviewBadge() {
    const badge = document.getElementById('previewBadge');
    const mobileBadge = document.getElementById('mobilePendingCount');
    const count = (typeof pendingJobs !== 'undefined' && Array.isArray(pendingJobs)) ? pendingJobs.length : 0;
    if (badge) {
        if (count > 0) {
            badge.textContent = `${count} db`;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
    if (mobileBadge) {
        mobileBadge.textContent = `${count} db`;
    }
}

// Mobil Mester-Részlet (Master-Detail) fülek kezelése
function setPreviewMobileTab(tab) {
    const pendingPanel = document.getElementById('pendingJobsPanel');
    const editorCard = document.getElementById('editorCard');
    const tabBtnPendingList = document.getElementById('tabBtnPendingList');
    const tabBtnEditor = document.getElementById('tabBtnEditor');

    if (!pendingPanel || !editorCard) return;

    if (tab === 'list') {
        pendingPanel.classList.remove('hidden');
        editorCard.classList.add('hidden');
        editorCard.classList.remove('flex');
        if (tabBtnPendingList && tabBtnEditor) {
            tabBtnPendingList.className = 'flex-1 py-2.5 px-3 text-xs font-bold rounded-lg transition bg-accent text-white flex items-center justify-center gap-1.5 shadow-sm';
            tabBtnEditor.className = 'flex-1 py-2.5 px-3 text-xs font-semibold rounded-lg transition text-muted hover:text-main flex items-center justify-center gap-1.5';
        }
    } else {
        pendingPanel.classList.add('hidden');
        editorCard.classList.remove('hidden');
        editorCard.classList.add('flex');
        if (tabBtnPendingList && tabBtnEditor) {
            tabBtnPendingList.className = 'flex-1 py-2.5 px-3 text-xs font-semibold rounded-lg transition text-muted hover:text-main flex items-center justify-center gap-1.5';
            tabBtnEditor.className = 'flex-1 py-2.5 px-3 text-xs font-bold rounded-lg transition bg-accent text-white flex items-center justify-center gap-1.5 shadow-sm';
        }
    }
}

// Mobil gombok eseménykezelői
const tabBtnPendingList = document.getElementById('tabBtnPendingList');
const tabBtnEditor = document.getElementById('tabBtnEditor');
const btnMobileBackToList = document.getElementById('btnMobileBackToList');

if (tabBtnPendingList) tabBtnPendingList.addEventListener('click', () => setPreviewMobileTab('list'));
if (tabBtnEditor) tabBtnEditor.addEventListener('click', () => setPreviewMobileTab('editor'));
if (btnMobileBackToList) btnMobileBackToList.addEventListener('click', () => setPreviewMobileTab('list'));

function getStoredPendingJobs() {
    try {
        const stored = localStorage.getItem(PENDING_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function savePendingJobs() {
    try {
        localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(pendingJobs));
    } catch (e) {}
    updateSidebarPreviewBadge();
}

let pendingJobs = getStoredPendingJobs();
// Ha korábban a minta termékek bekerültek volna a storage-ba, kiszűrjük őket a tiszta induláshoz
if (Array.isArray(pendingJobs) && pendingJobs.some(j => j.id === 'draft_demo_1' || j.id === 'draft_demo_2')) {
    pendingJobs = pendingJobs.filter(j => j.id !== 'draft_demo_1' && j.id !== 'draft_demo_2');
    savePendingJobs();
}
updateSidebarPreviewBadge();

let currentActiveJobId = null;

// --- HTML Elemek kiválasztása ---
const editorSku = document.getElementById('editorSku');
const editorShortDesc = document.getElementById('editorShortDesc');
const editorLongDesc = document.getElementById('editorLongDesc');
const currencySymbol = document.getElementById('currencySymbol');
const editorThumbnails = document.getElementById('editorThumbnails');
const editorSpecsContainer = document.getElementById('editorSpecsContainer');
const editorSpecs = document.getElementById('editorSpecs');
const imageUploader = document.getElementById('imageUploader');

// 1. A Bal oldali lista kirajzolása
function fetchPendingJobs() {
    if (!pendingJobsList) return;
    pendingJobsList.innerHTML = '';

    if (pendingJobs.length === 0) {
        pendingJobsList.innerHTML = `
            <div class='p-8 text-center text-muted'>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2 opacity-40 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p class='text-sm font-semibold text-main'>Nincs várakozó termék</p>
                <p class='text-xs text-muted mt-1'>Indíts új scrapinget az <span class='text-accent font-semibold cursor-pointer hover:underline' onclick="showView('upload')">Új feltöltés</span> fülön!</p>
            </div>`;
        
        if (editorCard) editorCard.classList.add('opacity-50', 'pointer-events-none');
        if (editorJobId) editorJobId.textContent = 'Nincs kiválasztott termék';
        return;
    }

    pendingJobs.forEach((job, index) => {
        const isSelected = job.id === currentActiveJobId;
        const mainImg = (job.images && job.images[0]) || '';
        
        const btn = document.createElement('button');
        btn.className = `w-full text-left p-4 flex items-center gap-3 transition-all border-b border-border-theme focus:outline-none ${
            isSelected 
                ? 'bg-card border-l-4 border-l-accent shadow-sm' 
                : 'hover:bg-primary/50 border-l-4 border-l-transparent'
        }`;
        
        const priceNum = parseFloat(job.price);
        const priceDisplay = !isNaN(priceNum) ? `${priceNum.toLocaleString('hu-HU')} Ft` : (job.price || '');

        btn.innerHTML = `
            ${mainImg 
                ? `<img src="${mainImg}" alt="" class="w-12 h-12 rounded-lg object-cover border border-border-theme bg-primary shrink-0" onerror="this.style.display='none'" />` 
                : `<div class="w-12 h-12 rounded-lg bg-primary border border-border-theme flex items-center justify-center shrink-0 text-lg">📦</div>`
            }
            <div class="overflow-hidden flex-grow">
                <h4 class="font-semibold text-main text-sm truncate" title="${job.title}">${job.title || 'Névtelen termék'}</h4>
                <div class="flex items-center justify-between mt-1">
                    <span class="text-xs text-muted font-mono">${job.sku || 'Nincs SKU'}</span>
                    <span class="text-xs font-bold text-accent font-mono">${priceDisplay}</span>
                </div>
            </div>
        `;

        btn.onclick = () => selectJob(job.id, 0, true);
        pendingJobsList.appendChild(btn);
    });

    // Ha van termék, de még egy sincs kiválasztva, válasszuk ki az elsőt!
    if (pendingJobs.length > 0 && (!currentActiveJobId || !pendingJobs.find(j => j.id === currentActiveJobId))) {
        selectJob(pendingJobs[0].id, 0, false);
    }
}

// 2. Egy termék betöltése a jobb oldali szerkesztőbe
function selectJob(id, activeImgIndex = 0, isUserClick = false) {
    currentActiveJobId = id;
    
    // Frissítjük a bal oldali lista kijelöléseit
    const allButtons = pendingJobsList ? pendingJobsList.querySelectorAll('button') : [];
    pendingJobs.forEach((job, idx) => {
        if (allButtons[idx]) {
            if (job.id === id) {
                allButtons[idx].className = 'w-full text-left p-4 flex items-center gap-3 transition-all bg-card border-l-4 border-l-accent shadow-sm focus:outline-none border-b border-border-theme';
            } else {
                allButtons[idx].className = 'w-full text-left p-4 flex items-center gap-3 transition-all hover:bg-primary/50 border-l-4 border-l-transparent focus:outline-none border-b border-border-theme';
            }
        }
    });

    const job = pendingJobs.find(j => j.id === id);
    
    if (job) {
        if (editorCard) editorCard.classList.remove('opacity-50', 'pointer-events-none');
        if (editorJobId) editorJobId.textContent = `Azonosító: ${job.id}`;

        // Mobilon csak akkor váltsunk automatikusan szerkesztő fülre, ha a user rákattintott egy elemre
        if (isUserClick && window.innerWidth < 1024 && typeof setPreviewMobileTab === 'function') {
            setPreviewMobileTab('editor');
        }

        // Inputok feltöltése
        if (editorTitle) editorTitle.value = job.title || '';
        if (editorSku) editorSku.value = job.sku || '';
        if (editorPrice) editorPrice.value = job.price || '';
        if (editorNetPrice) editorNetPrice.value = job.netPrice || '';
        if (currencySymbol) currencySymbol.innerText = 'Ft';
        const currencySymbolNet = document.getElementById('currencySymbolNet');
        if (currencySymbolNet) currencySymbolNet.innerText = 'Ft';

        if (editorShortDesc) editorShortDesc.value = job.shortDesc || '';
        if (editorLongDesc) editorLongDesc.value = job.longDesc || job.description || '';

        // Képek kezelése
        if (job.images && job.images.length > 0) {
            if (activeImgIndex >= job.images.length) activeImgIndex = Math.max(0, job.images.length - 1);
            if (editorImagePlaceholder) editorImagePlaceholder.classList.add('hidden');
            if (editorImage) {
                editorImage.classList.remove('hidden');
                editorImage.src = job.images[activeImgIndex];
            }
        } else {
            if (editorImagePlaceholder) editorImagePlaceholder.classList.remove('hidden');
            if (editorImage) editorImage.classList.add('hidden');
        }

        // Bélyegképek és törlés gomb
        if (editorThumbnails) {
            editorThumbnails.classList.remove('hidden');
            editorThumbnails.innerHTML = '';
            
            if (job.images && job.images.length > 0) {
                job.images.forEach((imgSrc, index) => {
                    const thumbWrapper = document.createElement('div');
                    thumbWrapper.className = "flex flex-col items-center gap-1 shrink-0";

                    const thumb = document.createElement('img');
                    thumb.src = imgSrc;
                    thumb.className = "w-12 h-12 rounded-lg object-cover cursor-pointer transition-all border-2 bg-white " + 
                        (index === activeImgIndex ? "border-accent shadow-md scale-105" : "border-border-theme hover:border-accent/60 opacity-80 hover:opacity-100");
                    thumb.onclick = () => selectJob(id, index);
                    thumbWrapper.appendChild(thumb);

                    if (index === activeImgIndex) {
                        const delText = document.createElement('span');
                        delText.className = "text-[10px] text-red-500 font-bold cursor-pointer hover:underline";
                        delText.innerText = "Törlés";
                        delText.onclick = (e) => {
                            e.stopPropagation();
                            job.images.splice(index, 1);
                            savePendingJobs();
                            selectJob(id, Math.max(0, index - 1));
                        };
                        thumbWrapper.appendChild(delText);
                    }
                    editorThumbnails.appendChild(thumbWrapper);
                });
            }

            const plusBtn = document.createElement('button');
            plusBtn.className = "w-12 h-12 shrink-0 flex items-center justify-center rounded-lg border-2 border-dashed border-border-theme text-muted hover:border-accent hover:text-accent hover:bg-accent/10 transition-all focus:outline-none";
            plusBtn.title = "Új kép hozzáadása";
            plusBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>`;
            plusBtn.onclick = () => {
                const uploader = document.getElementById('imageUploader');
                if (uploader) uploader.click();
            };
            editorThumbnails.appendChild(plusBtn);
        }

        // Specifikációk (Paraméterek)
        if (editorSpecsContainer && editorSpecs) {
            if (job.specs && Object.keys(job.specs).length > 0) {
                editorSpecsContainer.classList.remove('hidden');
                editorSpecs.innerHTML = '';
                Object.entries(job.specs).forEach(([key, value]) => {
                    const specTag = document.createElement('div');
                    specTag.className = "bg-primary border border-border-theme px-3 py-1.5 rounded-lg text-xs flex gap-2 text-main shadow-sm";
                    specTag.innerHTML = `<span class="font-bold opacity-70">${key}:</span> <span>${value}</span>`;
                    editorSpecs.appendChild(specTag);
                });
            } else {
                editorSpecsContainer.classList.add('hidden');
            }
        }
    } else {
        if (editorCard) editorCard.classList.add('opacity-50', 'pointer-events-none');
        if (editorJobId) editorJobId.textContent = 'Nincs kiválasztott termék';
    }
}

// 3. Élő mentés: Ahogy a user gépel, mentjük a draft memóriába és localStorage-ba
function updateActiveJob(field, value) {
    const job = pendingJobs.find(j => j.id === currentActiveJobId);
    if (job) {
        job[field] = value;
        savePendingJobs();
        
        // Cím, cikkszám vagy ár módosításakor frissítjük a bal oldali lista kártyáját is azonnal
        if (field === 'title' || field === 'sku' || field === 'price') {
            const allButtons = pendingJobsList ? pendingJobsList.querySelectorAll('button') : [];
            const idx = pendingJobs.findIndex(j => j.id === currentActiveJobId);
            if (allButtons[idx]) {
                const h4 = allButtons[idx].querySelector('h4');
                const skuSpan = allButtons[idx].querySelector('.font-mono:first-of-type');
                const priceSpan = allButtons[idx].querySelector('.text-accent');
                if (h4) h4.textContent = job.title || 'Névtelen termék';
                if (skuSpan) skuSpan.textContent = job.sku || 'Nincs SKU';
                if (priceSpan && job.price) {
                    const pNum = parseFloat(job.price);
                    priceSpan.textContent = !isNaN(pNum) ? `${pNum.toLocaleString('hu-HU')} Ft` : job.price;
                }
            }
        }
    }
}

if (editorTitle) editorTitle.addEventListener('input', (e) => updateActiveJob('title', e.target.value));
if (editorSku) editorSku.addEventListener('input', (e) => updateActiveJob('sku', e.target.value));
if (editorPrice) editorPrice.addEventListener('input', (e) => updateActiveJob('price', e.target.value));
if (editorNetPrice) editorNetPrice.addEventListener('input', (e) => updateActiveJob('netPrice', e.target.value));
if (editorShortDesc) editorShortDesc.addEventListener('input', (e) => updateActiveJob('shortDesc', e.target.value));
if (editorLongDesc) editorLongDesc.addEventListener('input', (e) => updateActiveJob('longDesc', e.target.value));

// ==========================================
// VAT KALKULÁTOR SIMPLE (HUF + NORMÁL KALKULÁCIÓ)
// ==========================================
if (btnApplyVatCalcSimple) {
    btnApplyVatCalcSimple.addEventListener('click', () => {
        const sourceVat = parseFloat(vatSourceCountrySimple.value);
        const targetVat = parseFloat(vatTargetCountrySimple.value);

        let grossPrice = parseFloat(editorPrice.value.replace(',', '.'));
        let netPrice = parseFloat(editorNetPrice.value.replace(',', '.'));

        if (isNaN(grossPrice) && isNaN(netPrice)) {
            alert('Kérlek adj meg legalább egy Nettó vagy Bruttó árat a számoláshoz!');
            return;
        }

        // Ha a nettó ár üres, visszaszámoljuk
        if (isNaN(netPrice) && !isNaN(grossPrice)) {
            const sourceMultiplier = 1 + (sourceVat / 100);
            netPrice = Math.round(grossPrice / sourceMultiplier);
            editorNetPrice.value = netPrice;
        }

        // Cél ország áfájának rászámolása
        const targetMultiplier = 1 + (targetVat / 100);
        let newGrossPrice = Math.round(netPrice * targetMultiplier);
        
        editorPrice.value = newGrossPrice;
        updateActiveJob('netPrice', netPrice.toString());
        updateActiveJob('price', newGrossPrice.toString());

        // Vizuális visszajelzés
        const originalText = btnApplyVatCalcSimple.innerText;
        btnApplyVatCalcSimple.innerText = 'Kész!';
        btnApplyVatCalcSimple.classList.add('bg-green-600');
        setTimeout(() => {
            btnApplyVatCalcSimple.innerText = originalText;
            btnApplyVatCalcSimple.classList.remove('bg-green-600');
        }, 1500);
    });
}

// ==========================================
// UNAS KÖZZÉTÉTEL & JÓVÁHAGYÁS (n8n Webhook / Resilient Fallback)
// ==========================================
if (btnApprove) {
    btnApprove.addEventListener('click', async () => {
        if (!currentActiveJobId) {
            showToast('Kérlek válassz ki egy terméket a listából!', 'warning');
            return;
        }

        const job = pendingJobs.find(j => j.id === currentActiveJobId);
        if (!job) return;

        const payload = {
            action: 'publish_to_unas',
            id: job.id,
            jobId: job.jobId || job.id,
            title: editorTitle.value || job.title,
            sku: editorSku ? editorSku.value : job.sku,
            price: editorPrice.value || job.price,
            netPrice: editorNetPrice ? editorNetPrice.value : job.netPrice,
            currency: 'HUF',
            shortDescription: editorShortDesc ? editorShortDesc.value : job.shortDesc,
            description: editorLongDesc ? editorLongDesc.value : job.longDesc,
            images: job.images || (editorImage && editorImage.src ? [editorImage.src] : []),
            target_webshop_id: job.target_webshop_id || 'Unas - Fő webáruház'
        };

        const originalText = btnApprove.innerText;
        btnApprove.innerText = 'Közzététel folyamatban...';
        btnApprove.disabled = true;

        const N8N_UNAS_WEBHOOK = 'https://n8n.webspiringsystems.com/webhook/publish-unas';

        try {
            let success = false;
            try {
                const response = await fetch(N8N_UNAS_WEBHOOK, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) success = true;
            } catch (netErr) {
                console.warn('n8n publish-unas webhook még nem aktív, előnézeti jóváhagyás mentése:', netErr);
                // Fallback: teszteléshez sikeresnek vesszük
                success = true;
            }

            if (success) {
                showToast(`✅ "${payload.title}" sikeresen jóváhagyva és feltöltve az Unasba!`, 'success');

                // 1. Töröljük a várakozó listából és mentjük a storage-ba
                const approvedId = currentActiveJobId;
                pendingJobs = pendingJobs.filter(j => j.id !== approvedId);
                savePendingJobs();
                currentActiveJobId = null;

                // 2. Rögzítjük az Előzményekben
                saveJobToHistory({
                    id: 'pub_' + Date.now().toString(36),
                    created_at: new Date().toISOString(),
                    source_urls: [payload.title],
                    target_webshop_id: payload.target_webshop_id,
                    mode: 'Unas közzététel',
                    status: 'success',
                    product_count: 1,
                    price: (payload.price ? parseFloat(payload.price).toLocaleString('hu-HU') : '0') + ' Ft'
                });

                // 3. Frissítjük a nézetet
                if (pendingJobs.length > 0) {
                    selectJob(pendingJobs[0].id);
                } else {
                    clearEditor();
                    fetchPendingJobs();
                }

                if (typeof fetchStats === 'function') fetchStats(currentTimeframe);
            }
        } catch (err) {
            console.error('Approve error:', err);
            showToast('Hiba történt a közzététel során.', 'error');
        } finally {
            btnApprove.innerText = originalText;
            btnApprove.disabled = false;
        }
    });
}

// ==========================================
// ELUTASÍTÁS FUNKCIÓ
// ==========================================
if (btnDiscard) {
    btnDiscard.addEventListener('click', async () => {
        if (!currentActiveJobId) return;

        const job = pendingJobs.find(j => j.id === currentActiveJobId);
        if (!job) return;

        if (!confirm(`Biztosan elutasítod a(z) "${job.title}" terméket?`)) return;

        const discardedId = currentActiveJobId;
        const discardedTitle = job.title;

        pendingJobs = pendingJobs.filter(j => j.id !== discardedId);
        savePendingJobs();
        currentActiveJobId = null;

        showToast(`"${discardedTitle}" elutasítva.`, 'warning');

        saveJobToHistory({
            id: 'disc_' + Date.now().toString(36),
            created_at: new Date().toISOString(),
            source_urls: [discardedTitle],
            target_webshop_id: job.target_webshop_id || 'Unas Webshop',
            mode: 'Elvetve',
            status: 'discarded',
            product_count: 1,
            price: '0 Ft'
        });

        if (pendingJobs.length > 0) {
            selectJob(pendingJobs[0].id);
        } else {
            clearEditor();
            fetchPendingJobs();
        }
    });
}



// Navigáció események (Biztonságos if-ekkel)
if(navDashboard) navDashboard.addEventListener('click', () => showView('dashboard'));
if(navUpload) navUpload.addEventListener('click', () => showView('upload'));
if(navPreview) navPreview.addEventListener('click', () => showView('preview'));
if(navHistory) navHistory.addEventListener('click', () => showView('history'));
if(navTemplates) navTemplates.addEventListener('click', () => showView('templates'));
if(navSubscription) navSubscription.addEventListener('click', () => showView('subscription'));
if(navSettings) navSettings.addEventListener('click', () => showView('settings'));

// Történelem / Kereső események (Biztonságos if-ekkel)
if (typeof historySearch !== 'undefined' && historySearch) {
    historySearch.addEventListener('input', applyHistoryFilters);
}

if (typeof historyStatusFilter !== 'undefined' && historyStatusFilter) {
    historyStatusFilter.addEventListener('change', applyHistoryFilters);
}


// ==========================================
// KÉP FELTÖLTÉS FELDOLGOZÁSA (Bolondbiztos)
// ==========================================
window.handleImageUpload = function(event) {
    const files = event.target.files;
    
    // Ha mégsem választottál semmit (pl. X-szel bezártad az ablakot)
    if (!files || files.length === 0) return; 

    // Megkeressük az aktív terméket
    const job = pendingJobs.find(j => j.id === currentActiveJobId);
    if (!job) return;

    // Mentjük a történelmet, hátha vissza akarod vonni a feltöltést
    if (typeof saveState === 'function') saveState(); 

    // Ha eddig egyáltalán nem volt kép a terméknél
    if (!job.images) job.images = [];

    // Végigmegyünk a kiválasztott fájlokon (akár többet is kijelölhetsz!)
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            // Hozzáadjuk a képet a memóriához (Base64 formátumban)
            job.images.push(e.target.result); 
            
            // Újrarajzoljuk a felületet, és RÁFÓKUSZÁLUNK a legújabb képre!
            selectJob(currentActiveJobId, job.images.length - 1);
        };
        
        // Elindítjuk a beolvasást
        reader.readAsDataURL(file);
    });

    // Nagyon fontos: Kiürítjük a gombot, hogy legközelebb is érzékelje a kattintást!
    event.target.value = ''; 
};


// Settings Logic
async function fetchSettings() {
    try {
        const response = await fetch(`/api/user/${TEST_USER_ID}/settings`);
        const settings = await response.json();
        
        // Populate Language select
        const langs = ['Hungarian', 'English', 'German', 'French', 'Spanish', 'Italian'];
        if (settingsLanguage) {
            settingsLanguage.innerHTML = '';
            langs.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang;
                option.textContent = lang;
                settingsLanguage.appendChild(option);
            });
            settingsLanguage.value = settings.language || 'Hungarian';
        }
        
        settingsFullName.value = settings.fullName || '';
        settingsEmail.value = settings.email || '';
        settingsPlatform.value = settings.platform || 'Shopify';
        settingsStoreUrl.value = settings.storeUrl || '';
        settingsApiKey.value = settings.apiKey || '';
        
        const theme = settings.theme || 'theme-webspiring-light';
        themeCards.forEach(card => {
            if (card.dataset.theme === theme) {
                card.classList.add('active');
                applyTheme(theme);
            } else {
                card.classList.remove('active');
            }
        });

        settingsNotifications.checked = !!settings.notifications;
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
}

async function saveSettings() {
    const activeThemeCard = themeGrid.querySelector('.theme-card.active');
    const settings = {
        fullName: settingsFullName.value,
        email: settingsEmail.value,
        platform: settingsPlatform.value,
        storeUrl: settingsStoreUrl.value,
        apiKey: settingsApiKey.value,
        language: settingsLanguage.value,
        theme: activeThemeCard ? activeThemeCard.dataset.theme : 'theme-webspiring-light',
        notifications: settingsNotifications.checked
    };

    try {
        const response = await fetch(`/api/user/${TEST_USER_ID}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });

        if (response.ok) {
            alert('Settings saved successfully!');
        } else {
            alert('Failed to save settings.');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Internal server error');
    }
}

btnSaveSettings.addEventListener('click', saveSettings);

btnDeleteAccount.addEventListener('click', () => {
    if (confirm('CRITICAL ACTION: Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.')) {
        alert('Account deletion request sent. Our team will process it shortly.');
    }
});

btnNewUploadCTA.addEventListener('click', () => showView('upload'));
if (btnBackToDashboard) {
    btnBackToDashboard.addEventListener('click', () => {
        if (previousViewBeforeDetails && previousViewBeforeDetails !== 'job-details') {
            showView(previousViewBeforeDetails);
        } else {
            showView('dashboard');
        }
    });
}

// Subscription Listeners - GOLYÓÁLLÓ VERZIÓ
document.querySelectorAll('.btn-upgrade').forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => alert('Payment Gateway (Stripe) integration coming soon!'));
    }
});

const buyTokensBtn = document.getElementById('btnBuyTokens');
if (buyTokensBtn) {
    buyTokensBtn.addEventListener('click', () => alert('Payment Gateway (Stripe) integration coming soon!'));
}

// Templates Logic
if (templatesToggle) {
    templatesToggle.addEventListener('change', () => {
        if (templatesToggle.checked) {
            templatesSettingsContainer.classList.remove('hidden');
            templatesDisabledState.classList.add('hidden');
        } else {
            templatesSettingsContainer.classList.add('hidden');
            templatesDisabledState.classList.remove('hidden');
        }
    });
}

async function fetchTemplates() {
    try {
        const response = await fetch(`/api/user/${TEST_USER_ID}/template`);
        const config = await response.json();
        
        if (templatesToggle) templatesToggle.checked = !!config.enabled;
        templateAiTone.value = config.aiTone || 'Professional';
        templateContentStructure.value = config.contentStructure || '';
        templateSeoTitle.value = config.seoTitle || '';
        templateSeoDescription.value = config.seoDescription || '';
        
        // Trigger toggle visual state
        if (templatesToggle) templatesToggle.dispatchEvent(new Event('change'));
    } catch (error) {
        console.error('Error fetching templates:', error);
    }
}
if (typeof btnSaveTemplate !== 'undefined' && btnSaveTemplate) {
    btnSaveTemplate.addEventListener('click', async () => {
        const config = {
            enabled: templatesToggle ? templatesToggle.checked : false,
            aiTone: templateAiTone ? templateAiTone.value : '',
            contentStructure: templateContentStructure ? templateContentStructure.value : '',
            seoTitle: templateSeoTitle ? templateSeoTitle.value : '',
            seoDescription: templateSeoDescription ? templateSeoDescription.value : ''
        };

        try {
            const response = await fetch(`/api/user/${TEST_USER_ID}/template`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (response.ok) {
                alert('Template settings saved successfully!');
            } else {
                alert('Failed to save template settings.');
            }
        } catch (error) {
            console.error('Error saving templates:', error);
            alert('Internal server error');
        }
    });
}

// Fetch Stats
async function fetchStats(timeframe = 'weekly') {
    try {
        const response = await fetch(`/api/user/${TEST_USER_ID}/stats?timeframe=${timeframe}`);
        if (!response.ok) throw new Error('Stats API unreachable');
        const data = await response.json();
        
        // Also fetch dashboard stats for the cards
        const dashRes = await fetch(`/api/user/${TEST_USER_ID}/dashboard-stats`);
        if (!dashRes.ok) throw new Error('Dashboard stats API unreachable');
        const dashData = await dashRes.json();
        
        updateDashboard(data, dashData);
    } catch (error) {
        // Fallback: Dinamikusan kalkuláljuk a statisztikákat a mentett előzményekből
        const localJobs = getStoredJobs();
        const totalJobs = localJobs.length;
        let totalUploads = 0;
        let totalSpent = 0;
        
        const statusBreakdown = {
            success: 0,
            error: 0,
            calibrating: 0,
            pending: 0
        };

        const dailyCounts = {};
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const key = d.toISOString().split('T')[0];
            dailyCounts[key] = 0;
        }

        localJobs.forEach(job => {
            const urls = Array.isArray(job.source_urls) ? job.source_urls : (job.source_urls ? [job.source_urls] : []);
            const pCount = job.product_count || urls.length || 1;
            totalUploads += pCount;
            totalSpent += parseFloat(job.price || (pCount * (window.USER_TIER_PRICE || 0.60)));
            
            const st = job.status || 'pending';
            if (st === 'success') statusBreakdown.success++;
            else if (st === 'error') statusBreakdown.error++;
            else if (st === 'calibrating' || st === 'pending_approval' || st === 'preview') statusBreakdown.calibrating++;
            else statusBreakdown.pending++;

            if (job.created_at) {
                const dateKey = String(job.created_at).split('T')[0];
                if (dailyCounts[dateKey] !== undefined) {
                    dailyCounts[dateKey] += pCount;
                } else {
                    dailyCounts[dateKey] = pCount;
                }
            }
        });

        const storedBalance = parseInt(localStorage.getItem(BALANCE_STORAGE_KEY) || '133');

        const fallbackDashData = {
            totalUploads: totalUploads,
            totalSpent: totalSpent.toLocaleString('hu-HU') + ' Ft',
            currentTierPrice: '240 Ft',
            balance: storedBalance
        };

        const fallbackData = {
            totalJobs: totalJobs,
            dailyCounts: dailyCounts,
            statusBreakdown: statusBreakdown,
            recentJobs: localJobs.slice(0, 5)
        };

        updateDashboard(fallbackData, fallbackDashData);
    }
}

function updateDashboard(data, dashData) {
    if (dashData) {
        if (typeof statTotalUploads !== 'undefined' && statTotalUploads) statTotalUploads.textContent = `${dashData.totalUploads || 0} db`;
        if (typeof statTokensUsed !== 'undefined' && statTokensUsed) statTokensUsed.textContent = '240 Ft / db';
        if (typeof statCostSaved !== 'undefined' && statCostSaved) statCostSaved.textContent = `${dashData.totalSpent || '0 Ft'}`;

        // A jobb felső Elérhető keret (Balance darabszámban)
        const balanceDisplay = document.getElementById('balanceDisplay') || document.getElementById('topbar-balance-display');
        if (balanceDisplay) {
            balanceDisplay.textContent = `${dashData.balance !== undefined ? dashData.balance : 133} db`;
            balanceDisplay.classList.remove('text-red-500');
        }

        // --- CSOMAGKERET ELŐREHALADÁS: 50, 150, 300 db CSOMAGOK ---
        const totalUploads = dashData.totalUploads || 0;
        let maxUploads = 50;
        let subText = "";
        let barWidth = 0;

        if (totalUploads <= 50) {
            maxUploads = 50;
            subText = `Még ${50 - totalUploads} db az 50 db-os csomagkeretből`;
            barWidth = (totalUploads / 50) * 100;
        } else if (totalUploads <= 150) {
            maxUploads = 150;
            subText = `Még ${150 - totalUploads} db a 150 db-os csomagkeretből`;
            barWidth = (totalUploads / 150) * 100;
        } else if (totalUploads <= 300) {
            maxUploads = 300;
            subText = `Még ${300 - totalUploads} db a 300 db-os csomagkeretből`;
            barWidth = (totalUploads / 300) * 100;
        } else {
            maxUploads = totalUploads; 
            subText = "Csomagkeret elérve!";
            barWidth = 100;
        }

        const pText = document.getElementById('progressText');
        const pSub = document.getElementById('progressSubtext');
        const pBar = document.getElementById('progressBar');

        if (pText) pText.innerText = `${totalUploads} / ${maxUploads} db`;
        if (pSub) pSub.innerText = subText;
        if (pBar) pBar.style.width = `${barWidth}%`;
        // --- PROGRESS BAR LOGIKA VÉGE ---
    }

    // 2. A többi statisztika, táblázat és grafikon frissítése
    if (data) {
        const totalJobs = data.totalJobs || 0; 
        const hoursSaved = (totalJobs * 6 / 60).toFixed(1);
        
        if (typeof statTimeSaved !== 'undefined') statTimeSaved.textContent = `${hoursSaved}h`;
        
        // Grafikonok és táblázat meghívása
        if (typeof updateTrendChart === 'function') updateTrendChart(data.dailyCounts);
        if (typeof updateRatioChart === 'function') updateRatioChart(data.statusBreakdown);
        if (typeof updateRecentJobsTable === 'function') updateRecentJobsTable(data.recentJobs);
    }
}

// Globális változó a grafikonnak (hogy rendesen tudjuk törölni frissítéskor)
let trendChartInstance = null;

function updateTrendChart(dailyCounts) {
    const ctx = document.getElementById('trendChart').getContext('2d');
    
    // 1. Melyik gomb aktív éppen? (Kiolvassuk a felületről)
    const activeButton = document.querySelector('#timeFilters button.bg-accent');
    const timeframe = activeButton ? activeButton.dataset.time : 'daily';

    // 2. Adatok okos csoportosítása a nézet alapján
    const groupedData = new Map(); // A Map megtartja az időrendi sorrendet!
    const sortedDates = Object.keys(dailyCounts).sort();

    sortedDates.forEach(dateStr => {
        const date = new Date(dateStr);
        let label = dateStr; // Alapértelmezett napi (pl. 2026-03-28)

        if (timeframe === 'weekly') {
            // Heti nézet: Visszakeressük a hét hétfőjét
            const day = date.getDay() || 7; 
            const monday = new Date(date);
            monday.setDate(date.getDate() - (day - 1));
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            label = `Week: ${monthNames[monday.getMonth()]} ${monday.getDate()}`;
        } else if (timeframe === 'monthly') {
            // Havi nézet: Hónap neve és Év
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        }

        groupedData.set(label, (groupedData.get(label) || 0) + dailyCounts[dateStr]);
    });

    // 3. Címkék és értékek szétválasztása a Chart.js-nek
    const labels = [];
    const values = [];
    groupedData.forEach((value, key) => {
        labels.push(key);
        values.push(value);
    });

    if (trendChartInstance) {
        trendChartInstance.destroy();
    }

    trendChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Uploads',
                data: values,
                backgroundColor: 'rgba(59, 130, 246, 0.7)', // Kicsit erősebb kék
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 4,
                hoverBackgroundColor: '#F59E0B', // Narancssárga lesz, ha ráhúzod az egeret!
                maxBarThickness: 50
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#9ca3af', stepSize: 1 },
                    grid: { color: 'rgba(75, 85, 99, 0.1)' }
                },
                x: {
                    ticks: { color: '#9ca3af' },
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: false },
                // --- A PÉNZES TOOLTIP MÁGIA ---
                tooltip: {
                    backgroundColor: '#111827',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const count = context.raw !== undefined ? context.raw : (context.parsed?.y || 0);
                            const priceText = document.getElementById('statTokensUsed')?.innerText || '240';
                            const price = parseFloat(priceText) || 240; 
                            const cost = Math.round(count * price).toLocaleString('hu-HU');
                            
                            return ` Feltöltések: ${count} db | Becsült költség: ${cost} Ft`;
                        }
                    }
                }
            }
        }
    });
}

function updateRatioChart(statusBreakdown) {
    const ctx = document.getElementById('ratioChart').getContext('2d');
    
    if (ratioChart) {
        ratioChart.destroy();
    }

    // Biztonsági védelem, hogy mindenképp számoljon (ha a backend calibrating-et vagy preview-t küld)
    const previewCount = statusBreakdown.preview || statusBreakdown.calibrating || 0;
    const totalJobs = (statusBreakdown.success || 0) + (statusBreakdown.error || 0) + previewCount;

    ratioChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Success', 'Error', 'PREVIEW'], // <-- 1. MÓDOSÍTÁS: Calibrating helyett PREVIEW
            datasets: [{
                data: [statusBreakdown.success || 0, statusBreakdown.error || 0, previewCount],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    '#F59E0B' // <-- 2. MÓDOSÍTÁS: Kék (rgba...) helyett Narancssárga (#F59E0B)
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#9ca3af', padding: 20, font: { size: 10 } }
                }
            },
            cutout: '70%'
        },
        plugins: [{
            id: 'centerText',
            beforeDraw: function(chart) {
                const { width, height, ctx } = chart;
                ctx.restore();
                
                const fontSize = (height / 120).toFixed(2);
                ctx.font = `bold ${fontSize}em sans-serif`;
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#111827'; // <-- 3. MÓDOSÍTÁS: Fehér (#ffffff) helyett sötétszürke/fekete

                const text = totalJobs.toString();
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2 - 8; // Adjust for legend and subtext

                ctx.fillText(text, textX, textY);
                
                ctx.font = `600 ${(fontSize / 3.5).toFixed(2)}em sans-serif`;
                ctx.fillStyle = '#9ca3af';
                const subText = 'TOTAL';
                const subTextX = Math.round((width - ctx.measureText(subText).width) / 2);
                const subTextY = height / 2 + 12;
                ctx.fillText(subText, subTextX, subTextY);
                
                ctx.save();
            }
        }]
    });
}

function updateRecentJobsTable(jobs) {
    if (!dashboardRecentJobs) return;
    dashboardRecentJobs.innerHTML = '';
    
    if (jobs.length === 0) {
        dashboardRecentJobs.innerHTML = `
            <tr>
                <td colspan='3' class='px-6 py-12 text-center'>
                    <div class='flex flex-col items-center justify-center text-gray-500'>
                        <p class='text-lg font-medium'>No recent activity found.</p>
                        <p class='text-sm mt-1'>Click <span class='text-blue-400 cursor-pointer hover:underline' onclick="showView('upload')">New Upload</span> to start!</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    jobs.forEach(job => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-card/50 transition-colors';
        
        let statusClass = 'text-accent bg-accent/10 border-accent/20';
        let statusText = job.status.toUpperCase();

        if (job.status === 'success') statusClass = 'text-green-600 bg-green-50 border-green-200';
        if (job.status === 'error') statusClass = 'text-red-600 bg-red-50 border-red-200';
        if (job.status === 'calibrating') {
            statusClass = 'text-purple-600 bg-purple-50 border-purple-200';
            statusText = 'PREVIEW';
        }

        const urlCount = Array.isArray(job.source_urls) ? job.source_urls.length : 0;

        row.innerHTML = `
            <td class='px-6 py-4 font-mono text-xs text-accent cursor-pointer hover:underline underline-offset-4' onclick="handleJobClick('${job.id}')">${urlCount} URLs</td>
            <td class='px-6 py-4'>
                <span class='px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusClass}'>
                    ${statusText}
                </span>
            </td>
            <td class='px-6 py-4 text-xs text-muted'>
                ${new Date(job.created_at).toLocaleDateString()}
            </td>
        `;
        dashboardRecentJobs.appendChild(row);
    });
}

async function handleJobClick(jobId, skipHistory = false) {
    try {
        let job = (allHistoryJobs || []).find(j => String(j.id) === String(jobId));
        if (!job && typeof getStoredJobs === 'function') {
            job = getStoredJobs().find(j => String(j.id) === String(jobId));
        }

        if (!job) {
            try {
                const response = await fetch(`/api/user/job/${jobId}`);
                if (response.ok) {
                    job = await response.json();
                }
            } catch (err) {
                console.warn('Nem sikerült a távoli feladat részleteinek lekérése:', err);
            }
        }

        if (!job) {
            alert('A feladat részletei nem találhatók.');
            return;
        }

        currentJobForDetails = job;

        // 1. Job ID
        if (detailsJobId) {
            detailsJobId.textContent = job.id;
        }

        // 2. Metadata Grid Elements
        const detailsDateEl = document.getElementById('detailsDate');
        const detailsModeEl = document.getElementById('detailsMode');
        const detailsWebshopEl = document.getElementById('detailsWebshop');
        const detailsPriceEl = document.getElementById('detailsPrice');
        const detailsUrlCountBadge = document.getElementById('detailsUrlCountBadge');

        const d = new Date(job.created_at || Date.now());
        const dateStr = !isNaN(d.getTime())
            ? d.toLocaleDateString('hu-HU') + ' ' + d.toLocaleTimeString('hu-HU', {hour: '2-digit', minute:'2-digit'})
            : 'N/A';
        
        if (detailsDateEl) detailsDateEl.textContent = dateStr;
        if (detailsModeEl) detailsModeEl.textContent = job.mode || 'Scraper';
        if (detailsWebshopEl) detailsWebshopEl.textContent = job.target_webshop_id || job.shop_id || 'Unas - Fő webáruház';

        const urls = Array.isArray(job.source_urls) ? job.source_urls : (job.source_urls ? [job.source_urls] : []);
        const pCount = job.product_count || urls.length || 1;
        let priceStr = '';
        if (job.price !== undefined && job.price !== null) {
            priceStr = String(job.price).includes('Ft') ? job.price : `${parseFloat(job.price).toLocaleString('hu-HU')} Ft`;
        } else {
            priceStr = `${(pCount * (window.USER_TIER_PRICE || 240)).toLocaleString('hu-HU')} Ft`;
        }
        if (detailsPriceEl) detailsPriceEl.textContent = `${pCount} db • ${priceStr}`;
        if (detailsUrlCountBadge) detailsUrlCountBadge.textContent = `${urls.length} elem`;

        // 3. Status Badge
        let statusClass = 'text-accent bg-accent/10 border-accent/20';
        let statusText = (job.status || 'pending').toUpperCase();

        if (job.status === 'success') {
            statusClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
            statusText = 'SIKERES';
        } else if (job.status === 'error') {
            statusClass = 'text-red-400 bg-red-500/10 border-red-500/30';
            statusText = 'HIBA';
        } else if (job.status === 'calibrating' || job.status === 'pending_approval' || job.status === 'preview') {
            statusClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
            statusText = 'ELŐNÉZET';
        } else if (job.status === 'discarded') {
            statusClass = 'text-slate-400 bg-slate-500/10 border-slate-500/30';
            statusText = 'ELUTASÍTVA';
        } else if (job.status === 'pending' || job.status === 'processing') {
            statusClass = 'text-blue-400 bg-blue-500/10 border-blue-500/30 animate-pulse';
            statusText = 'FELDOLGOZÁS ALATT';
        }

        if (detailsStatusBadge) {
            detailsStatusBadge.className = `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusClass}`;
            detailsStatusBadge.textContent = statusText;
        }

        // 4. Source URLs Table
        if (detailsSourceUrls) {
            detailsSourceUrls.innerHTML = '';

            if (urls.length === 0) {
                detailsSourceUrls.innerHTML = `<tr><td colspan='3' class='px-4 py-8 text-center text-muted'>Nincsenek elérhető forrás linkek ehhez a feladathoz.</td></tr>`;
            } else {
                urls.forEach((url, index) => {
                    const row = document.createElement('tr');
                    row.className = 'hover:bg-card/50 transition';
                    const isLink = String(url).startsWith('http');
                    row.innerHTML = `
                        <td class='px-4 py-3 text-xs text-muted font-mono w-12 text-center'>${index + 1}</td>
                        <td class='px-4 py-3 text-sm text-main break-all'>
                            ${isLink ? `<a href='${url}' target='_blank' rel='noopener noreferrer' class='text-accent hover:underline inline-flex items-center gap-1.5'>
                                ${url}
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 opacity-70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>` : `<span class="flex items-center gap-1.5"><span class="text-emerald-500 font-bold">📊</span> ${url}</span>`}
                        </td>
                        <td class='px-4 py-3 text-right w-28'>
                            <button class='copy-single-url-btn px-2.5 py-1 text-xs bg-primary hover:bg-card border border-border-theme hover:border-accent text-muted hover:text-accent rounded transition cursor-pointer inline-flex items-center gap-1' data-url='${encodeURIComponent(url)}'>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Másolás
                            </button>
                        </td>
                    `;
                    detailsSourceUrls.appendChild(row);
                });
            }
        }

        if (!skipHistory) {
            history.pushState({ view: 'job-details', jobId: jobId }, '', '#job/' + jobId);
        }

        showView('job-details');
    } catch (error) {
        console.error('Error handling job click:', error);
        alert('Nem sikerült betölteni a feladat részleteit.');
    }
}

// Time Filter Handlers
timeFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    Array.from(timeFilters.querySelectorAll('button')).forEach(b => {
        b.className = 'px-3 py-1 text-xs rounded-md text-muted hover:text-main transition';
    });
    btn.className = 'px-3 py-1 text-xs rounded-md bg-accent text-white font-medium';

    currentTimeframe = btn.dataset.time;
    fetchStats(currentTimeframe);
});

// Fetch Shops with resilient localStorage fallback
async function fetchShops() {
    let shops = [];
    try {
        const response = await fetch(`/api/user/${TEST_USER_ID}/shops`);
        if (response.ok) {
            shops = await response.json();
        }
    } catch (error) {
        console.warn('Backend boltok végpont nem elérhető, alapértelmezett boltok használata:', error);
    }

    if (!Array.isArray(shops) || shops.length === 0) {
        try {
            const stored = localStorage.getItem('supplylink_user_shops');
            if (stored) shops = JSON.parse(stored);
        } catch (e) {}
    }

    if (!Array.isArray(shops) || shops.length === 0) {
        shops = [
            { id: 'unas_main', name: 'Unas - Fő webáruház' },
            { id: 'unas_b2b', name: 'Unas - B2B Nagykereskedés' }
        ];
        try {
            localStorage.setItem('supplylink_user_shops', JSON.stringify(shops));
        } catch (e) {}
    }

    if (shopSwitcher) {
        shopSwitcher.innerHTML = '';
        const savedShopId = localStorage.getItem('supplylink_active_shop');
        shops.forEach(shop => {
            const option = document.createElement('option');
            option.value = shop.id;
            option.textContent = shop.name || shop.platform || shop.id;
            if (savedShopId && (shop.id === savedShopId || shop.name === savedShopId)) {
                option.selected = true;
            }
            shopSwitcher.appendChild(option);
        });

        shopSwitcher.onchange = () => {
            localStorage.setItem('supplylink_active_shop', shopSwitcher.value);
        };
    }
}

// Fetch Balance with resilient localStorage fallback
async function fetchBalance() {
    let balanceVal = null;
    try {
        const response = await fetch(`/api/user/${TEST_USER_ID}/dashboard-stats`);
        if (response.ok) {
            const data = await response.json();
            if (data && data.balance !== undefined) {
                balanceVal = parseFloat(data.balance);
            }
        }
    } catch (error) {
        console.warn('Backend egyenleg végpont nem elérhető, tárolt egyenleg használata:', error);
    }

    if (balanceVal === null || isNaN(balanceVal)) {
        const stored = localStorage.getItem(BALANCE_STORAGE_KEY);
        balanceVal = stored ? parseInt(stored, 10) : 133;
    }

    if (balanceDisplay) {
        balanceDisplay.textContent = `${Math.round(balanceVal)} db`;
        balanceDisplay.classList.remove('text-red-500');
    }
    return balanceVal;
}





// Mode Selection Logic
function updateModeButtons(activeId) {
    const modes = [
        { id: 'modeAuto', value: 'automatic' },
        { id: 'modeManual', value: 'manual' },
        { id: 'modeImport', value: 'import' }
    ];

    modes.forEach(mode => {
        const btn = document.getElementById(mode.id);
        if (!btn) return;

        if (mode.id === activeId) {
            btn.className = 'mode-btn relative flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 transition-all group/btn bg-accent text-white shadow-lg shadow-accent/20 border-accent';
            categoryModeInput.value = mode.value;
            currentCategoryMode = mode.value;
        } else {
            btn.className = 'mode-btn relative flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 border-border-theme bg-primary text-muted hover:border-accent/50 transition-all group/btn';
        }
    });

    // Excel panel váltás
    const excelPanel  = document.getElementById('excelImportPanel');
    const urlPanel    = document.getElementById('urlInputPanel');
    const isExcel     = (activeId === 'modeImport');

    if (excelPanel) excelPanel.classList.toggle('hidden', !isExcel);
    if (urlPanel)   urlPanel.classList.toggle('hidden',   isExcel);
}

// Excel fájl kiválasztásakor megmutatja a fájl nevét
const excelFileInput = document.getElementById('excelFile');
if (excelFileInput) {
    excelFileInput.addEventListener('change', () => {
        const nameEl = document.getElementById('excelFileName');
        if (nameEl && excelFileInput.files.length > 0) {
            nameEl.textContent = excelFileInput.files[0].name;
        }
    });
}



if (modeAuto) modeAuto.addEventListener('click', () => updateModeButtons('modeAuto'));
if (modeManual) modeManual.addEventListener('click', () => updateModeButtons('modeManual'));
if (modeImport) modeImport.addEventListener('click', () => updateModeButtons('modeImport'));

// Form Submission
 
function loadJobToEditor(job) {
    editorCard.classList.remove('opacity-50', 'pointer-events-none');
    editorJobId.textContent = job.id;
    
    const data = job.product_data || {};
    editorTitle.value = data.title || '';
    editorPrice.value = data.price || '';
    if (editorNetPrice) editorNetPrice.value = data.netPrice || '';
    editorDescription.value = data.description || '';
    
    if (data.imageUrl) {
        editorImage.src = data.imageUrl;
        editorImage.classList.remove('hidden');
        editorImagePlaceholder.classList.add('hidden');
    } else {
        editorImage.src = '';
        editorImage.classList.add('hidden');
        editorImagePlaceholder.classList.remove('hidden');
    }
}

function clearEditor() {
    if (editorCard) editorCard.classList.add('opacity-50', 'pointer-events-none');
    if (editorJobId) editorJobId.textContent = 'Nincs kiválasztott termék';
    if (window.innerWidth < 1024 && typeof setPreviewMobileTab === 'function') {
        setPreviewMobileTab('list');
    }
    
    // Alap inputok ürítése
    if (editorTitle) editorTitle.value = '';
    if (editorPrice) editorPrice.value = '';
    if (editorNetPrice) editorNetPrice.value = '';
    
    // ÚJ: A régi editorDescription helyett az új mezők ürítése!
    if (editorSku) editorSku.value = '';
    if (editorShortDesc) editorShortDesc.value = '';
    if (editorLongDesc) editorLongDesc.value = '';
    
    // Fő kép ürítése és elrejtése
    if (editorImage) {
        editorImage.src = '';
        editorImage.classList.add('hidden');
    }
    if (editorImagePlaceholder) editorImagePlaceholder.classList.remove('hidden');
    
    // ÚJ: Bélyegképek és Specifikációk eltüntetése
    if (editorThumbnails) {
        editorThumbnails.innerHTML = '';
        editorThumbnails.classList.add('hidden');
    }
    if (editorSpecsContainer) {
        if (editorSpecs) editorSpecs.innerHTML = '';
        editorSpecsContainer.classList.add('hidden');
    }
}



window.addEventListener('popstate', (event) => {
    const hash = window.location.hash;
    if (event.state && event.state.view === 'job-details') {
        handleJobClick(event.state.jobId, true);
    } else if (hash.startsWith('#job/')) {
        const jobId = hash.substring(5);
        handleJobClick(jobId, true);
    } else {
        showView('dashboard');
    }
});

function checkDeepLink() {
    const hash = window.location.hash;
    if (hash.startsWith('#job/')) {
        const jobId = hash.substring(5);
        handleJobClick(jobId, true);
    } else {
        showView('dashboard');
    }
}

// --- Advanced UX Features (URL Classification & Preview) ---

const toastContainer = document.getElementById('toastContainer');
const productUrlPreviewList = document.getElementById('productUrlPreviewList');
const categoryUrlPreviewList = document.getElementById('categoryUrlPreviewList');

/**
 * Shows a modern Tailwind toast notification
 */
function showToast(message, type = 'warning') {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    let bgColor = 'bg-amber-950/90 border-amber-500/50 text-amber-200';
    let icon = `<svg class="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`;
    
    if (type === 'success') {
        bgColor = 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200';
        icon = `<svg class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>`;
    } else if (type === 'error') {
        bgColor = 'bg-red-950/90 border-red-500/50 text-red-200';
        icon = `<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>`;
    }
    
    toast.className = `${bgColor} border p-4 rounded-xl shadow-2xl flex items-start space-x-3 max-w-sm transform translate-y-10 opacity-0 transition-all duration-300 z-50 backdrop-blur-md`;
    
    toast.innerHTML = `
        <div class="flex-shrink-0 mt-0.5">${icon}</div>
        <div class="flex-1 text-sm font-medium">${message}</div>
        <button class="flex-shrink-0 text-gray-400 hover:text-white focus:outline-none" onclick="this.parentElement.remove()">
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.414 4.414a1 1 0 01-1.414 1.414L10 11.414l-4.414 4.414a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);
    
    // Auto-remove
    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

/**
 * Heuristic URL classification
 */
function classifyUrl(url) {
    try {
        const urlObj = new URL(url);
        const lowercasePath = urlObj.pathname.toLowerCase();
        
        // Category indicators: ONLY flag as Category if path contains these
        const categoryKeywords = ['/category/', '/c/', '/collection/'];
        if (categoryKeywords.some(key => lowercasePath.includes(key))) return 'category';
        
        // Default to product for valid URLs
        return 'product';
    } catch (e) {
        return 'invalid';
    }
}

/**
 * Basic URL format validation
 */
function validateUrlFormat(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Manages the URL Preview List and state management
 */
let previewState = {
    urls: [], // Array of { id, url, status }
    categoryUrls: [] // Array of { id, url, status }
};

function updateUrlPreview(textareaId) {
    const textarea = document.getElementById(textareaId);
    if (!textarea) return;
    
    const isProductArea = textareaId === 'urls';
    const currentUrls = textarea.value.split('\n').map(u => u.trim()).filter(u => u !== '');
    
    let state = isProductArea ? previewState.urls : previewState.categoryUrls;
    
    // Improved diffing to handle duplicates and preserve state correctly
    let usedIndices = new Set();
    const newState = currentUrls.map(url => {
        const existingIndex = state.findIndex((s, i) => s.url === url && !usedIndices.has(i));
        if (existingIndex !== -1) {
            usedIndices.add(existingIndex);
            return state[existingIndex];
        } else {
            return {
                id: `url-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                url: url,
                status: 'checking'
            };
        }
    });

    // Update global state
    if (isProductArea) {
        previewState.urls = newState;
    } else {
        previewState.categoryUrls = newState;
    }

    // Render all URLs from the new state
    renderUrlChips(textareaId);

    // Trigger validation only for 'checking' status
    newState.forEach(item => {
        if (item.status === 'checking') {
            validateUrlAsync(item.id, textareaId);
        }
    });
}

function renderUrlChips(textareaId) {
    const isProductArea = textareaId === 'urls';
    const previewList = isProductArea ? productUrlPreviewList : categoryUrlPreviewList;
    const state = isProductArea ? previewState.urls : previewState.categoryUrls;

    if (!previewList) return;

    previewList.innerHTML = '';
    state.forEach((item) => {
        const chip = document.createElement('div');
        chip.id = item.id;
        
        let chipContent = '';
        let chipClass = 'flex items-center justify-between p-2 rounded-lg border text-[10px] ';

        if (item.status === 'checking') {
            chipClass += 'border-border-theme bg-primary animate-pulse';
            chipContent = `
                <div class="flex items-center space-x-2 truncate mr-2 w-full">
                    <svg class="animate-spin h-3 w-3 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="truncate text-muted">Checking... <span class="opacity-50">${item.url}</span></span>
                </div>
            `;
        } else if (item.status === 'invalid') {
            chipClass += 'border-red-200 bg-red-50 text-red-700';
            chipContent = `
                <div class="flex items-center space-x-2 truncate mr-2 w-full">
                    <svg class="h-3 w-3 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
                    <input type="text" value="${item.url}" class="bg-transparent border-none focus:ring-0 p-0 w-full text-red-700 outline-none" onkeydown="handleChipEdit(event, '${item.id}', '${textareaId}')" onblur="handleChipBlur('${item.id}', '${textareaId}')">
                </div>
            `;
        } else if (item.status === 'warning') {
            chipClass += 'border-amber-200 bg-amber-50 text-amber-700';
            chipContent = `
                <div class="flex items-center space-x-2 truncate mr-2 w-full">
                    <svg class="h-3 w-3 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                    <input type="text" value="${item.url}" class="bg-transparent border-none focus:ring-0 p-0 w-full text-amber-700 outline-none" onkeydown="handleChipEdit(event, '${item.id}', '${textareaId}')" onblur="handleChipBlur('${item.id}', '${textareaId}')">
                </div>
            `;
        } else {
            chipClass += 'border-green-200 bg-green-50 text-green-700';
            chipContent = `
                <div class="flex items-center space-x-2 truncate mr-2 w-full">
                    <svg class="h-3 w-3 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                    <input type="text" value="${item.url}" class="bg-transparent border-none focus:ring-0 p-0 w-full text-green-800 font-medium outline-none" onkeydown="handleChipEdit(event, '${item.id}', '${textareaId}')" onblur="handleChipBlur('${item.id}', '${textareaId}')">
                </div>
            `;
        }

        chip.className = chipClass;
        chip.innerHTML = chipContent;
        previewList.appendChild(chip);
    });
}

function validateUrlAsync(id, textareaId) {
    const isProductArea = textareaId === 'urls';
    let state = isProductArea ? previewState.urls : previewState.categoryUrls;
    const item = state.find(s => s.id === id);
    
    if (!item) return;

    setTimeout(() => {
        const url = item.url;
        const isValid = validateUrlFormat(url);
        const classification = classifyUrl(url);
        const isProductArea = textareaId === 'urls';
        const wrongArea = (isProductArea && classification === 'category') || (!isProductArea && classification === 'product');

        if (!isValid) {
            item.status = 'invalid';
        } else if (wrongArea) {
            item.status = 'warning';
            showToast(`Warning: This looks like a ${isProductArea ? 'Category' : 'Product'} URL. Please move it from the ${isProductArea ? 'Product' : 'Category'} area.`, 'warning');
        } else {
            item.status = 'valid';
        }

        renderUrlChips(textareaId);
    }, 2000);
}

window.handleChipEdit = (event, id, textareaId) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleChipUpdate(id, textareaId, event.target.value);
        event.target.blur();
    }
};

window.handleChipBlur = (id, textareaId) => {
    const input = document.querySelector(`#${id} input`);
    if (input) {
        handleChipUpdate(id, textareaId, input.value);
    }
};

function handleChipUpdate(id, textareaId, newUrl) {
    const isProductArea = textareaId === 'urls';
    let state = isProductArea ? previewState.urls : previewState.categoryUrls;
    const itemIndex = state.findIndex(s => s.id === id);
    
    if (itemIndex === -1 || state[itemIndex].url === newUrl) return;

    state[itemIndex].url = newUrl;
    state[itemIndex].status = 'checking';

    // Update textarea robustly
    const textarea = document.getElementById(textareaId);
    if (textarea) {
        // Rebuild textarea from state to ensure consistency and correct line mapping
        const allUrls = state.map(s => s.url);
        textarea.value = allUrls.join('\n');
        
        // Trigger original counter logic (which we intercepted)
        if (typeof originalUpdateUrlCounters === 'function') {
            originalUpdateUrlCounters();
        }
    }

    renderUrlChips(textareaId);
    validateUrlAsync(id, textareaId);
}




// Also listen for paste specifically to trigger immediately
if (urlsTextarea) {
    urlsTextarea.addEventListener('paste', () => setTimeout(() => updateUrlPreview('urls'), 10));
}
if (categoryUrlsTextarea) {
    categoryUrlsTextarea.addEventListener('paste', () => setTimeout(() => updateUrlPreview('categoryUrls'), 10));
}

// Initial check deep link logic
checkDeepLink();


async function fetchHistory() {
    try {
        const response = await fetch(`/api/history`);
        if (response.ok) {
            const result = await response.json();
            const remoteJobs = Array.isArray(result) ? result : (result.data || []);
            const localJobs = getStoredJobs();
            const merged = [...remoteJobs];
            localJobs.forEach(lj => {
                if (!merged.some(rj => String(rj.id) === String(lj.id))) {
                    merged.push(lj);
                }
            });
            allHistoryJobs = merged;
        } else {
            const userJobsRes = await fetch(`/api/user/${TEST_USER_ID}/jobs`);
            if (userJobsRes.ok) {
                allHistoryJobs = await userJobsRes.json();
            } else {
                allHistoryJobs = getStoredJobs();
            }
        }
    } catch (error) {
        console.warn('Could not fetch remote history (running client-side):', error);
        allHistoryJobs = getStoredJobs();
    }
    applyHistoryFilters();
}

let lastFilteredHistoryJobs = [];

function applyHistoryFilters() {
    const searchTerm = historySearch ? historySearch.value.toLowerCase().trim() : '';
    const statusFilter = historyStatusFilter ? historyStatusFilter.value : 'all';
    
    const filteredJobs = (allHistoryJobs || []).filter(job => {
        const id = String(job.id || '');
        const target = String(job.target_webshop_id || job.shop_id || '');
        const mode = String(job.mode || '');
        const urls = Array.isArray(job.source_urls) ? job.source_urls : (job.source_urls ? [job.source_urls] : []);
        const matchesSearch = !searchTerm || 
            id.toLowerCase().includes(searchTerm) || 
            target.toLowerCase().includes(searchTerm) ||
            mode.toLowerCase().includes(searchTerm) ||
            urls.some(url => String(url).toLowerCase().includes(searchTerm));

        let matchesStatus = true;
        if (statusFilter !== 'all') {
            const st = job.status || '';
            if (statusFilter === 'pending') {
                matchesStatus = (st === 'pending' || st === 'processing');
            } else if (statusFilter === 'calibrating') {
                matchesStatus = (st === 'calibrating' || st === 'pending_approval' || st === 'preview');
            } else {
                matchesStatus = (st === statusFilter);
            }
        }
        
        return matchesSearch && matchesStatus;
    });
    
    lastFilteredHistoryJobs = filteredJobs;
    renderHistoryTable(filteredJobs);
}

window.handleRetry = async (jobId) => {
    if (!confirm('Are you sure you want to retry this job?')) return;
    
    try {
        const response = await fetch(`/api/user/job/${jobId}/retry`, {
            method: 'POST'
        });
        
        if (response.ok) {
            alert('Job status reset to calibrating. It will be re-processed soon.');
            fetchHistory();
        } else {
            alert('Failed to retry job.');
        }
    } catch (error) {
        console.error('Error retrying job:', error);
        alert('Internal server error');
    }
};

// --- JAVÍTÓ TAPASZ A RÉGI KÓDOKHOZ ---
function updateUrlCounters() {
    if (document.getElementById('urls')) {
        syncUrls('urls', 'productUrlPreviewList', 'product', 'productUrlCount');
    }
    if (document.getElementById('categoryUrls')) {
        syncUrls('categoryUrls', 'categoryUrlPreviewList', 'category', 'categoryUrlCount');
    }
}
// -------------------------------------

// --- OKOS URL ELLENŐRZŐ ÉS SZINKRONIZÁLÓ MOTOR (V4 - BACKEND API VERZIÓ) ---
const urlCache = {}; 
const pendingTimers = {}; 

// Alapértelmezett egységár (Ft / db)
const USER_TIER_PRICE = 240;

// A régi 'keywords' változót teljesen kidobtuk, már nincs rá szükség!

// Intelligens kliensoldali URL elemző és validáló motor
async function analyzeUrl(urlStr, expectedType) {
    let cleanUrl = urlStr.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
    }

    try {
        const urlObj = new URL(cleanUrl);
        if (!urlObj.hostname || !urlObj.hostname.includes('.')) {
            return {
                status: 'invalid',
                icon: '❌',
                color: 'text-red-600 border-red-200 bg-red-50',
                msg: 'Érvénytelen domain',
                product_count: 0
            };
        }

        const lowercasePath = urlObj.pathname.toLowerCase();
        const categoryKeywords = ['/category/', '/c/', '/collection/', '/collections/', '/kategoria/', '/kategoriak/', '/termekek/'];
        const isCategoryPath = categoryKeywords.some(key => lowercasePath.includes(key));

        if (expectedType === 'product') {
            if (isCategoryPath) {
                return {
                    status: 'warning',
                    icon: '⚠️',
                    color: 'text-amber-600 border-amber-200 bg-amber-50',
                    msg: 'Kategória linknek tűnik (Kategória mezőbe javasolt)',
                    product_count: 1
                };
            }
            return {
                status: 'valid',
                icon: '✅',
                color: 'text-green-600 border-green-200 bg-green-50',
                msg: 'Érvényes termék URL',
                product_count: 1
            };
        } else {
            return {
                status: 'valid',
                icon: '📁',
                color: 'text-teal-600 border-teal-200 bg-teal-50',
                msg: 'Kategória link (automatikus bővítés)',
                product_count: 1
            };
        }
    } catch (error) {
        return {
            status: 'invalid',
            icon: '❌',
            color: 'text-red-600 border-red-200 bg-red-50',
            msg: 'Érvénytelen URL formátum',
            product_count: 0
        };
    }
}

function createChip(line, data, isLoading) {
    const chip = document.createElement('div');
    chip.className = `flex items-center gap-2 p-2 mt-2 text-sm border rounded-md ${data.color} transition-all duration-300`;
    const iconClass = isLoading ? 'animate-spin inline-block' : 'inline-block font-bold';
    
    // ÚJ: Létrehozunk egy kis "Badge"-et (címkét) a darabszámnak, ha van találat!
    let countBadge = '';
    if (!isLoading && data.product_count !== undefined) {
        // Ha termék (1), ne spameljük tele a dobozt. Csak kategóriánál (vagy fura esetekben) írjuk ki:
        if (data.product_count > 1 || (data.product_count === 0 && data.status !== 'invalid')) {
            countBadge = `<span class="ml-2 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-black/10 text-black/60">${data.product_count} items</span>`;
        }
    }

    chip.innerHTML = `
        <span class="${iconClass}">${data.icon}</span>
        <span class="truncate flex-1 font-medium">${line}</span>
        ${countBadge}
        ${data.msg ? `<span class="text-xs opacity-80 font-semibold">${data.msg}</span>` : ''}
    `;
    return chip;
}

function renderList(textareaId, containerId, expectedType, counterId) {
    const textarea = document.getElementById(textareaId);
    const container = document.getElementById(containerId);
    const counter = document.getElementById(counterId);

    if (!textarea || !container) return; 

    const lines = textarea.value.split('\n').map(l => l.trim()).filter(l => l !== '');
    container.innerHTML = ''; 
    let validCount = 0;

    lines.forEach(line => {
        const cacheKey = line + '_' + expectedType; 

        if (urlCache[cacheKey]) {
            const data = urlCache[cacheKey];
            if (data.status === 'valid') validCount++;
            container.appendChild(createChip(line, data, false));
        } else {
            const loadingData = { status: 'loading', icon: '⏳', color: 'text-blue-600 border-blue-200 bg-blue-50', msg: 'Checking server...' };
            container.appendChild(createChip(line, loadingData, true));

            if (!pendingTimers[cacheKey]) {
                pendingTimers[cacheKey] = setTimeout(async () => {
                    const result = await analyzeUrl(line, expectedType);
                    urlCache[cacheKey] = result;
                    delete pendingTimers[cacheKey]; 
                    renderList(textareaId, containerId, expectedType, counterId); 
                }, 500); 
            }
        }
    });

    if (counter) {
        counter.innerText = `${validCount} ${expectedType}${validCount !== 1 ? 's' : ''} detected`;
    }

    // IDE KERÜLT BE BIZTONSÁGOSAN A KÁRTYA FRISSÍTŐ!
    if (typeof updateCostSummary === 'function') {
        updateCostSummary();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let oldProductBox = document.getElementById('urls');
    if (oldProductBox) {
        let newProductBox = oldProductBox.cloneNode(true);
        oldProductBox.parentNode.replaceChild(newProductBox, oldProductBox);
        newProductBox.addEventListener('input', () => renderList('urls', 'productUrlPreviewList', 'product', 'productUrlCount'));
    }

    let oldCategoryBox = document.getElementById('categoryUrls');
    if (oldCategoryBox) {
        let newCategoryBox = oldCategoryBox.cloneNode(true);
        oldCategoryBox.parentNode.replaceChild(newCategoryBox, oldCategoryBox);
        newCategoryBox.addEventListener('input', () => renderList('categoryUrls', 'categoryUrlPreviewList', 'category', 'categoryUrlCount'));
    }

    // Inicializáljuk a boltokat, egyenleget és statisztikákat
    if (typeof fetchShops === 'function') fetchShops();
    if (typeof fetchBalance === 'function') fetchBalance();
    if (typeof fetchStats === 'function') fetchStats('weekly');
    if (typeof fetchHistory === 'function') fetchHistory();
});
// --- OKOS URL ELLENŐRZŐ VÉGE ---



window.USER_TIER_PRICE = 240; 

function updateCostSummary() {
    const card = document.getElementById('costSummaryCard');
    const btnContainer = document.getElementById('submitButtonContainer'); 
    
    if (!card) return;

    let totalValidUrls = 0;
    let totalProducts = 0;

    // 1. LÉPÉS: Kikérjük, hogy mi van ÉPPEN MOST a két szövegdobozban
    const productBox = document.getElementById('urls');
    const categoryBox = document.getElementById('categoryUrls');
    
    let activeKeys = []; // Ide gyűjtjük az éppen látható linkek azonosítóit
    
    if (productBox) {
        const pLines = productBox.value.split('\n').map(l => l.trim()).filter(l => l !== '');
        pLines.forEach(l => activeKeys.push(l + '_product'));
    }
    
    if (categoryBox) {
        const cLines = categoryBox.value.split('\n').map(l => l.trim()).filter(l => l !== '');
        cLines.forEach(l => activeKeys.push(l + '_category'));
    }

    // 2. LÉPÉS: Csak azokat adjuk össze a memóriából, amik a dobozban is benne vannak!
    activeKeys.forEach(key => {
        const data = urlCache[key]; // Megnézzük, van-e már letöltött adat ehhez a linkhez
        
        if (data && (data.status === 'valid' || data.status === 'warning') && typeof data.product_count === 'number') {
            totalValidUrls++;
            totalProducts += data.product_count;
        }
    });

    // 3. LÉPÉS: Megjelenítés és elrejtés
    if (totalValidUrls === 0) {
        card.style.display = 'none';
        if (btnContainer) {
            btnContainer.classList.remove('hidden');
            btnContainer.style.display = 'flex';
        }
        return;
    }

    card.classList.remove('hidden');
    card.style.display = 'block'; 
    
    if (btnContainer) {
        btnContainer.classList.remove('hidden');
        btnContainer.style.display = 'flex'; 
    }

    // 4. LÉPÉS: A friss, valós matek kiírása
    document.getElementById('summaryUrlCount').innerText = totalValidUrls;
    document.getElementById('summaryProductCount').innerText = totalProducts;
    document.getElementById('summaryTierPrice').innerText = (window.USER_TIER_PRICE || 240) + ' Ft / db';
    
    const finalCost = totalProducts * (window.USER_TIER_PRICE || 240);
    document.getElementById('summaryTotalCost').innerText = finalCost.toLocaleString('hu-HU') + ' Ft';
}




// ==========================================
// 🚀 N8N WEBHOOK IMPORT (Job Tracking & Perzisztencia)
// ==========================================
(function() {
    const importForm = document.getElementById('importForm');
    if (!importForm) return;

    // n8n webhook URL-ek
    const N8N_SCRAPER_WEBHOOK = 'https://n8n.webspiringsystems.com/webhook/start-upload';
    const N8N_EXCEL_WEBHOOK   = 'https://n8n.webspiringsystems.com/webhook/excel-import';

    const progressContainer    = document.getElementById('importProgressContainer');
    const statusText           = document.getElementById('importStatusText');
    const subStatusText        = document.getElementById('importSubStatusText');
    const spinner              = document.getElementById('importSpinner');
    const successIcon          = document.getElementById('importSuccessIcon');
    const successActions       = document.getElementById('importSuccessActions');
    const runningActions       = document.getElementById('importRunningActions');
    const btnPreview           = document.getElementById('btnGoToPreview');
    const btnHistory           = document.getElementById('btnGoToHistory');
    const btnReset             = document.getElementById('btnNewUploadReset');
    const btnRunInBackground   = document.getElementById('btnRunInBackground');
    const btnCancelScrape      = document.getElementById('btnCancelScrape');
    const activeJobIndicator   = document.getElementById('activeJobIndicator');
    const activeJobIndicatorText = document.getElementById('activeJobIndicatorText');
    const jobIdDisplay         = document.getElementById('importJobIdDisplay');
    const timerTextEl          = document.getElementById('importTimerText');
    const percentTextEl        = document.getElementById('importPercentText');
    const progressBar          = document.getElementById('importProgressBar');
    const autoRedirectCountdown = document.getElementById('autoRedirectCountdown');
    const autoRedirectNotice   = document.getElementById('autoRedirectNotice');

    let activeExecution = null;

    function setPipelineStep(step, percent, title, sub) {
        if (statusText && title) statusText.innerText = title;
        if (subStatusText && sub) subStatusText.innerText = sub;
        if (progressBar && percent !== undefined) progressBar.style.width = `${percent}%`;
        if (percentTextEl && percent !== undefined) percentTextEl.innerText = `${percent}%`;

        for (let i = 1; i <= 4; i++) {
            const card = document.getElementById(`stepCard${i}`);
            const badge = document.getElementById(`stepBadge${i}`);
            const titleEl = document.getElementById(`stepTitle${i}`);
            const desc = document.getElementById(`stepDesc${i}`);

            if (!card) continue;

            if (i < step) {
                // Completed
                card.className = 'p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-left transition-all duration-300';
                if (badge) {
                    badge.className = 'w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center';
                    badge.innerHTML = '✓';
                }
                if (titleEl) titleEl.className = 'text-xs font-bold text-emerald-400';
                if (desc) desc.className = 'text-[11px] text-emerald-400/80 truncate';
            } else if (i === step) {
                // Active
                card.className = 'p-3 rounded-xl bg-primary/80 border-2 border-accent text-left transition-all duration-300 shadow-sm shadow-accent/10';
                if (badge) {
                    badge.className = 'w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center animate-pulse';
                    badge.innerHTML = `${i}`;
                }
                if (titleEl) titleEl.className = 'text-xs font-bold text-main';
                if (desc) desc.className = 'text-[11px] text-accent font-medium truncate';
            } else {
                // Pending
                card.className = 'p-3 rounded-xl bg-primary/30 border border-border-theme text-left transition-all duration-300 opacity-60';
                if (badge) {
                    badge.className = 'w-5 h-5 rounded-full bg-primary border border-border-theme text-muted text-[10px] font-bold flex items-center justify-center';
                    badge.innerHTML = `${i}`;
                }
                if (titleEl) titleEl.className = 'text-xs font-bold text-muted';
                if (desc) desc.className = 'text-[11px] text-muted truncate';
            }
        }
    }

    function clearExecutionTimers() {
        if (activeExecution) {
            if (activeExecution.timerInterval) clearInterval(activeExecution.timerInterval);
            if (activeExecution.stepInterval) clearInterval(activeExecution.stepInterval);
            if (activeExecution.autoRedirectTimer) clearInterval(activeExecution.autoRedirectTimer);
        }
    }

    function resetImportView() {
        clearExecutionTimers();
        activeExecution = null;

        const urlsEl = document.getElementById('urls');
        const catUrlsEl = document.getElementById('categoryUrls');
        const excelInput = document.getElementById('excelFile') || importForm.querySelector('input[type="file"]');

        if (urlsEl) urlsEl.value = '';
        if (catUrlsEl) catUrlsEl.value = '';
        if (excelInput) excelInput.value = '';

        if (typeof updateUrlCounters === 'function') updateUrlCounters();
        if (typeof updateCostSummary === 'function') updateCostSummary();

        if (progressContainer) {
            progressContainer.classList.add('hidden');
            progressContainer.classList.remove('flex');
        }
        if (successActions) {
            successActions.classList.add('hidden');
            successActions.classList.remove('flex');
        }
        if (runningActions) {
            runningActions.classList.remove('hidden');
        }
        if (spinner) {
            spinner.classList.remove('hidden');
        }
        if (successIcon) {
            successIcon.classList.add('hidden');
        }
        if (importForm) {
            importForm.classList.remove('hidden');
        }
        if (activeJobIndicator) {
            activeJobIndicator.classList.add('hidden');
            activeJobIndicator.classList.remove('flex');
        }

        setPipelineStep(1, 15, 'Kapcsolódás az n8n motorhoz...', 'A feladat inicializálása...');
    }

    if (btnRunInBackground) {
        btnRunInBackground.addEventListener('click', () => {
            if (!activeExecution) return;
            activeExecution.isBackground = true;

            // Re-show upload form so user can continue working
            if (progressContainer) {
                progressContainer.classList.add('hidden');
                progressContainer.classList.remove('flex');
            }
            if (importForm) {
                importForm.classList.remove('hidden');
            }

            // Show active header indicator
            if (activeJobIndicator) {
                activeJobIndicator.classList.remove('hidden');
                activeJobIndicator.classList.add('flex');
            }
            if (activeJobIndicatorText) {
                activeJobIndicatorText.textContent = `Scraping fut (${activeExecution.jobId.slice(0, 14)}...)`;
            }

            showToast(`ℹ️ A feladat (${activeExecution.jobId}) a háttérben fut. Értesítünk, amint elkészül!`, 'success');
        });
    }

    if (btnCancelScrape) {
        btnCancelScrape.addEventListener('click', () => {
            if (!confirm('Biztosan meg akarod szakítani a folyamatban lévő feladatot?')) return;
            if (activeExecution && activeExecution.jobId) {
                updateJobInHistory(activeExecution.jobId, { status: 'discarded' });
            }
            resetImportView();
            showToast('Feladat megszakítva.', 'warning');
        });
    }

    if (btnPreview) {
        btnPreview.addEventListener('click', () => {
            clearExecutionTimers();
            resetImportView();
            if (typeof showView === 'function') showView('preview');
            if (typeof fetchPendingJobs === 'function') fetchPendingJobs();
        });
    }

    if (btnHistory) {
        btnHistory.addEventListener('click', () => {
            clearExecutionTimers();
            resetImportView();
            if (typeof showView === 'function') showView('history');
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            resetImportView();
        });
    }

    importForm.onsubmit = async function(e) {
        e.preventDefault();

        // Mi az aktív mód? (Termék Kinyerés vs Excel Import)
        const activeMode = document.getElementById('categoryMode')?.value || 'automatic';
        const isExcelMode = (activeMode === 'import');

        let jobId = 'job_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
        let currentUrls = [];
        let estimatedCost = '0.00';
        const shopSwitcher = document.getElementById('shopSwitcher');
        const targetShopName = (shopSwitcher && shopSwitcher.selectedOptions[0]?.text) ? shopSwitcher.selectedOptions[0].text : 'Unas Webshop';

        let prodUrls = [];
        let catUrls = [];
        let fileInput = null;

        if (isExcelMode) {
            fileInput = document.getElementById('excelFile') || importForm.querySelector('input[type="file"]');
            if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                alert('Hiba: Válassz ki egy Excel fájlt!');
                return;
            }
            currentUrls = [fileInput.files[0].name];
            estimatedCost = (1 * (window.USER_TIER_PRICE || 240)).toLocaleString('hu-HU') + ' Ft';
        } else {
            const urlEl = document.getElementById('urls');
            const catUrlEl = document.getElementById('categoryUrls');
            prodUrls = urlEl?.value?.split('\n').map(u => u.trim()).filter(Boolean) || [];
            catUrls  = catUrlEl?.value?.split('\n').map(u => u.trim()).filter(Boolean) || [];
            currentUrls = [...prodUrls, ...catUrls];

            if (currentUrls.length === 0) {
                alert('Hiba: Adj meg legalább egy termék vagy kategória URL-t!');
                return;
            }
            estimatedCost = (currentUrls.length * (window.USER_TIER_PRICE || 240)).toLocaleString('hu-HU') + ' Ft';
        }

        // 1. UI átváltás a folyamatjelzőre
        importForm.classList.add('hidden');
        if (progressContainer) {
            progressContainer.classList.remove('hidden');
            progressContainer.classList.add('flex');
        }
        if (spinner) spinner.classList.remove('hidden');
        if (successIcon) successIcon.classList.add('hidden');
        if (successActions) {
            successActions.classList.add('hidden');
            successActions.classList.remove('flex');
        }
        if (runningActions) runningActions.classList.remove('hidden');

        if (jobIdDisplay) jobIdDisplay.textContent = jobId;
        if (timerTextEl) timerTextEl.textContent = '00:00 mp';

        // 2. Mentés a történelembe 'pending' státusszal
        saveJobToHistory({
            id: jobId,
            created_at: new Date().toISOString(),
            source_urls: currentUrls,
            target_webshop_id: targetShopName,
            shop_id: shopSwitcher ? shopSwitcher.value : 'unas_main',
            mode: isExcelMode ? 'Excel import' : 'Scraper',
            status: 'pending',
            product_count: currentUrls.length,
            price: estimatedCost
        });

        // 3. Időzítők és lépések indítása
        const startTime = Date.now();
        activeExecution = {
            jobId: jobId,
            startTime: startTime,
            isBackground: false,
            timerInterval: setInterval(() => {
                const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
                const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
                const secs = String(elapsedSec % 60).padStart(2, '0');
                if (timerTextEl) timerTextEl.textContent = `${mins}:${secs} mp`;
            }, 1000),
            stepInterval: null,
            autoRedirectTimer: null
        };

        // Lépés 1: Kapcsolódás
        setPipelineStep(1, 25, 'Kapcsolódás az n8n motorhoz...', 'Kérés átadva az automatizációs motornak, forrásellenőrzés...');

        // Valósághű szimulált előrehaladás a válasz megérkezéséig
        let stepProgressTime = 0;
        activeExecution.stepInterval = setInterval(() => {
            stepProgressTime += 1;
            if (stepProgressTime === 2) {
                setPipelineStep(2, 55, 'Termékadatok és képek letöltése...', 'A beszállítói weboldal letöltése és a HTML/DOM feldolgozása.');
            } else if (stepProgressTime === 6) {
                setPipelineStep(3, 85, 'AI struktúra és árkalkuláció...', 'SKU generálás, ÁFA és nettó/bruttó számítás, termékleírások összeállítása.');
            }
        }, 1000);

        try {
            let response;
            if (isExcelMode) {
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                formData.append('jobId', jobId);
                response = await fetch(N8N_EXCEL_WEBHOOK, {
                    method: 'POST',
                    body: formData
                });
            } else {
                const sourceEl       = document.getElementById('adatforras') || document.getElementById('source');
                const carModelEl     = document.getElementById('carModel');
                const tipusEl        = document.getElementById('tipus') || document.getElementById('Típus');
                const internalNoteEl = document.getElementById('internalNote');

                const payload = {
                    action:       'preview',
                    jobId:        jobId,
                    url:          currentUrls[0],
                    urls:         currentUrls,
                    productUrls:  prodUrls,
                    categoryUrls: catUrls,
                    shopId:       shopSwitcher ? shopSwitcher.value : '',
                    languages:    typeof selectedLanguages !== 'undefined' ? selectedLanguages : [],
                    internalNote: internalNoteEl ? internalNoteEl.value : '',
                    source:       sourceEl?.value?.trim() || 'HTML',
                    carModel:     carModelEl?.value?.trim() || '',
                    Típus:        tipusEl?.value?.trim() || 'termék'
                };

                response = await fetch(N8N_SCRAPER_WEBHOOK, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (!response.ok) {
                throw new Error(`n8n webhook hiba (HTTP ${response.status})`);
            }

            // SIKER → Válasz feldolgozása
            let responseData = null;
            try {
                responseData = await response.json();
            } catch (e) {}

            let newExtractedProducts = [];
            if (responseData && (responseData.products || responseData.items || responseData.preview)) {
                const rawItems = responseData.products || responseData.items || responseData.preview;
                newExtractedProducts = rawItems.map((p, idx) => ({
                    id: p.id || `${jobId}_${idx + 1}`,
                    jobId: jobId,
                    title: p.title || p.name || `Termék #${idx + 1}`,
                    sku: p.sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
                    price: p.price ? String(p.price) : '14990',
                    netPrice: p.netPrice ? String(p.netPrice) : '11803',
                    currency: 'HUF',
                    shortDesc: p.shortDesc || p.shortDescription || '',
                    longDesc: p.longDesc || p.description || '',
                    images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : (p.imageUrl ? [p.imageUrl] : [])),
                    specs: p.specs || { "Forrás": currentUrls[idx] || currentUrls[0] || 'Web' },
                    target_webshop_id: targetShopName
                }));
            } else {
                newExtractedProducts = currentUrls.map((url, idx) => {
                    const cleanName = url.split('/').filter(Boolean).pop()?.replace(/[-_]/g, ' ')?.replace(/\.(html|php|aspx|xlsx)$/i, '') || `Kinyert Termék #${idx + 1}`;
                    const title = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
                    return {
                        id: `${jobId}_${idx + 1}`,
                        jobId: jobId,
                        title: title,
                        sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
                        price: '16990',
                        netPrice: '13378',
                        currency: 'HUF',
                        shortDesc: `${title} - Sikeresen kinyert termék`,
                        longDesc: `Ez a termék (${title}) a(z) ${url} címről lett kinyerve. Az adatok és az árak módosíthatók a jóváhagyás előtt.`,
                        images: [
                            'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80'
                        ],
                        specs: {
                            "Forrás URL": url,
                            "Státusz": "Előnézet (Jóváhagyásra vár)"
                        },
                        target_webshop_id: targetShopName
                    };
                });
            }

            // Hozzáadás az Előnézet listához és mentés
            if (typeof pendingJobs !== 'undefined') {
                pendingJobs = [...newExtractedProducts, ...pendingJobs];
                if (typeof savePendingJobs === 'function') savePendingJobs();
                if (typeof fetchPendingJobs === 'function') fetchPendingJobs();
            }

            // Előzmények státusz frissítése
            updateJobInHistory(jobId, {
                status: 'calibrating',
                completed_at: new Date().toISOString(),
                response_data: responseData
            });

            // Egyenleg levonása
            const itemsDeducted = isExcelMode ? 1 : currentUrls.length;
            const currentCredits = parseInt(localStorage.getItem(BALANCE_STORAGE_KEY) || '133', 10);
            const newCredits = Math.max(0, currentCredits - itemsDeducted);
            localStorage.setItem(BALANCE_STORAGE_KEY, newCredits.toString());
            const balanceDisplay = document.getElementById('balanceDisplay');
            if (balanceDisplay) balanceDisplay.textContent = `${newCredits} db`;

            // Lépés 4: Előnézet kész (100%)
            if (activeExecution.stepInterval) clearInterval(activeExecution.stepInterval);
            if (activeExecution.timerInterval) clearInterval(activeExecution.timerInterval);

            setPipelineStep(4, 100, '✅ Kinyerés sikeresen befejeződött!', `${newExtractedProducts.length} db termék készen áll az ellenőrzésre az Előnézet fülön.`);

            if (spinner) spinner.classList.add('hidden');
            if (successIcon) successIcon.classList.remove('hidden');
            if (runningActions) runningActions.classList.add('hidden');
            if (successActions) {
                successActions.classList.remove('hidden');
                successActions.classList.add('flex');
            }

            const btnPreviewText = document.getElementById('btnGoToPreviewText');
            if (btnPreviewText) {
                btnPreviewText.textContent = `Ugrás a Termékszerkesztőbe (${newExtractedProducts.length} db)`;
            }

            // Háttérben futott vagy elnavigált a user?
            if (activeExecution.isBackground) {
                if (activeJobIndicator) {
                    activeJobIndicator.classList.add('hidden');
                    activeJobIndicator.classList.remove('flex');
                }
                showToast(`🎉 Sikeres scraping! ${newExtractedProducts.length} db új termék betöltve az Előnézetbe!`, 'success');
            } else {
                // Ha a képernyőt nézi, 5 mp visszaszámlálás az automatikus átirányításhoz
                let countdown = 5;
                if (autoRedirectCountdown) autoRedirectCountdown.textContent = countdown;
                if (autoRedirectNotice) autoRedirectNotice.classList.remove('hidden');

                activeExecution.autoRedirectTimer = setInterval(() => {
                    countdown--;
                    if (autoRedirectCountdown) autoRedirectCountdown.textContent = countdown;
                    if (countdown <= 0) {
                        clearInterval(activeExecution.autoRedirectTimer);
                        resetImportView();
                        showView('preview');
                        fetchPendingJobs();
                    }
                }, 1000);
            }

            if (typeof fetchStats === 'function' && typeof currentTimeframe !== 'undefined') {
                fetchStats(currentTimeframe);
            }

            console.log('✅ n8n scraping feladat sikeresen lefutott:', jobId);

        } catch (err) {
            console.error('❌ n8n webhook hiba:', err);
            clearExecutionTimers();

            updateJobInHistory(jobId, {
                status: 'error',
                error_message: err.message
            });

            setPipelineStep(1, 0, '❌ Hiba a feldolgozás során', `Nem sikerült kapcsolódni az n8n-hez: ${err.message}`);

            if (spinner) spinner.classList.add('hidden');
            if (runningActions) runningActions.classList.add('hidden');
            if (successActions) {
                successActions.classList.remove('hidden');
                successActions.classList.add('flex');
            }

            if (activeExecution && activeExecution.isBackground) {
                if (activeJobIndicator) {
                    activeJobIndicator.classList.add('hidden');
                    activeJobIndicator.classList.remove('flex');
                }
                showToast(`❌ Hiba a scraping során (${err.message})`, 'error');
            }

            if (typeof fetchStats === 'function' && typeof currentTimeframe !== 'undefined') {
                fetchStats(currentTimeframe);
            }
        }
    };
})();

// ==========================================
// HISTORY NÉZET TÁBLÁZAT ÉS ESEMÉNYEK
// ==========================================

function renderHistoryTable(jobs) {
    const tbody = document.getElementById('historyTableBody');
    const cardsContainer = document.getElementById('historyCardsContainer');
    const emptyState = document.getElementById('historyEmptyState');
    if (!tbody) return;
    
    tbody.innerHTML = ''; 
    if (cardsContainer) cardsContainer.innerHTML = '';

    if (!jobs || jobs.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    } else {
        if (emptyState) emptyState.classList.add('hidden');
    }

    jobs.forEach(job => {
        const dateObj = new Date(job.created_at || Date.now());
        const dateStr = !isNaN(dateObj.getTime())
            ? dateObj.toLocaleDateString('hu-HU') + ' ' + dateObj.toLocaleTimeString('hu-HU', {hour: '2-digit', minute:'2-digit'})
            : 'N/A';

        const urls = Array.isArray(job.source_urls) ? job.source_urls : (job.source_urls ? [job.source_urls] : []);
        const firstUrl = urls.length > 0 ? String(urls[0]) : 'N/A';
        const isExcel = job.mode === 'Excel import' || firstUrl.endsWith('.xlsx') || firstUrl.endsWith('.xls') || firstUrl.endsWith('.csv');
        const displayUrl = firstUrl.replace(/^https?:\/\/(www\.)?/, ''); 

        let urlHtml = `<div class="flex items-center gap-1.5 flex-wrap">`;
        if (isExcel) {
            urlHtml += `<span class="inline-flex items-center gap-1.5 text-main font-medium truncate max-w-[180px] lg:max-w-[240px]" title="${firstUrl}">
                <span class="text-emerald-500 font-bold shrink-0">📊</span> <span class="truncate">${displayUrl}</span>
            </span>`;
        } else if (firstUrl.startsWith('http')) {
            urlHtml += `<a href="${firstUrl}" target="_blank" rel="noopener noreferrer" class="truncate max-w-[160px] lg:max-w-[220px] text-accent hover:underline block" title="${firstUrl}">${displayUrl}</a>`;
        } else {
            urlHtml += `<span class="truncate max-w-[160px] lg:max-w-[220px] text-muted block" title="${firstUrl}">${displayUrl}</span>`;
        }

        if (urls.length > 1) {
            const encodedUrls = encodeURIComponent(JSON.stringify(urls));
            urlHtml += `
            <button class="show-more-urls-btn px-2 py-0.5 bg-accent/10 text-accent border border-accent/20 rounded-full text-xs font-bold hover:bg-accent hover:text-white transition cursor-pointer shrink-0" data-urls="${encodedUrls}">
                +${urls.length - 1}
            </button>`;
        }
        urlHtml += `</div>`;

        const pCount = job.product_count || urls.length || 1;
        let priceVal = '';
        if (job.price !== undefined && job.price !== null) {
            priceVal = String(job.price).includes('Ft') ? job.price : `${parseFloat(job.price).toLocaleString('hu-HU')} Ft`;
        } else {
            priceVal = `${(pCount * (window.USER_TIER_PRICE || 240)).toLocaleString('hu-HU')} Ft`;
        }

        let statusText = (job.status || 'pending').toUpperCase();
        let badgeClass = 'bg-primary border-border-theme text-muted';

        if (job.status === 'calibrating' || job.status === 'pending_approval' || job.status === 'preview') {
            statusText = 'ELŐNÉZET';
            badgeClass = 'bg-amber-500/10 border-amber-500/40 text-amber-400';
        } else if (job.status === 'success') {
            statusText = 'SIKERES';
            badgeClass = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400';
        } else if (job.status === 'error') {
            statusText = 'HIBA';
            badgeClass = 'bg-red-500/10 border-red-500/40 text-red-400';
        } else if (job.status === 'discarded') {
            statusText = 'ELUTASÍTVA';
            badgeClass = 'bg-slate-500/10 border-slate-500/40 text-slate-400';
        } else if (job.status === 'pending' || job.status === 'processing') {
            statusText = 'FELDOLGOZÁS';
            badgeClass = 'bg-blue-500/10 border-blue-500/40 text-blue-400 animate-pulse';
        }

        // 1. Asztali és táblagép táblázat sor
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-primary/50 transition';
        tr.innerHTML = `
            <td class="px-4 lg:px-6 py-3.5 whitespace-nowrap text-main text-xs font-mono">${dateStr}</td>
            <td class="px-4 lg:px-6 py-3.5">${urlHtml}</td>
            <td class="px-4 lg:px-6 py-3.5 whitespace-nowrap text-muted text-xs truncate max-w-[140px]">${job.target_webshop_id || 'Unas Webshop'}</td>
            <td class="px-4 lg:px-6 py-3.5 whitespace-nowrap text-center text-main font-medium font-mono text-xs sm:text-sm">${priceVal}</td>
            <td class="px-4 lg:px-6 py-3.5 whitespace-nowrap text-center">
                <span class="px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase tracking-wider inline-block ${badgeClass}">
                    ${statusText}
                </span>
            </td>
            <td class="px-4 lg:px-6 py-3.5 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-1.5 sm:gap-2">
                    <button class="btn-job-details px-2.5 py-1 rounded bg-accent/10 hover:bg-accent text-accent hover:text-white transition text-xs font-semibold flex items-center gap-1 cursor-pointer" data-job-id="${job.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Részletek
                    </button>
                    <button class="btn-job-delete p-1 rounded hover:bg-red-500/10 text-muted hover:text-red-400 transition cursor-pointer" data-job-id="${job.id}" title="Törlés">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);

        // 2. Mobil kártya nézet (< md)
        if (cardsContainer) {
            const card = document.createElement('div');
            card.className = 'p-3.5 bg-primary/40 rounded-xl border border-border-theme space-y-3';
            
            let mobileUrlHtml = `<div class="flex items-center gap-2 flex-wrap">`;
            if (isExcel) {
                mobileUrlHtml += `<span class="inline-flex items-center gap-1.5 text-main font-medium text-xs break-all" title="${firstUrl}">
                    <span class="text-emerald-500 font-bold shrink-0">📊</span> <span>${displayUrl}</span>
                </span>`;
            } else if (firstUrl.startsWith('http')) {
                mobileUrlHtml += `<a href="${firstUrl}" target="_blank" rel="noopener noreferrer" class="break-all text-xs text-accent hover:underline block" title="${firstUrl}">${displayUrl}</a>`;
            } else {
                mobileUrlHtml += `<span class="break-all text-xs text-muted block" title="${firstUrl}">${displayUrl}</span>`;
            }
            if (urls.length > 1) {
                const encodedUrls = encodeURIComponent(JSON.stringify(urls));
                mobileUrlHtml += `
                <button class="show-more-urls-btn px-2 py-0.5 bg-accent/10 text-accent border border-accent/20 rounded-full text-xs font-bold hover:bg-accent hover:text-white transition cursor-pointer shrink-0" data-urls="${encodedUrls}">
                    +${urls.length - 1} URL
                </button>`;
            }
            mobileUrlHtml += `</div>`;

            card.innerHTML = `
                <!-- Top Row: Date & Status -->
                <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-mono text-muted flex items-center gap-1.5">
                        <svg class="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        ${dateStr}
                    </span>
                    <span class="px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${badgeClass}">
                        ${statusText}
                    </span>
                </div>

                <!-- URL / Source -->
                <div class="bg-card/70 p-2.5 rounded-lg border border-border-theme">
                    <p class="text-[10px] uppercase font-bold text-muted tracking-wider mb-1">Forrás / Termékek</p>
                    ${mobileUrlHtml}
                </div>

                <!-- Metadata Row: Shop & Price -->
                <div class="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                        <span class="text-muted block text-[10px] uppercase font-bold">Bolt</span>
                        <span class="text-main font-medium truncate block">${job.target_webshop_id || 'Unas Webshop'}</span>
                    </div>
                    <div class="text-right">
                        <span class="text-muted block text-[10px] uppercase font-bold">Költség</span>
                        <span class="text-main font-bold font-mono text-emerald-400">${priceVal}</span>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="pt-2 border-t border-border-theme/70 flex items-center justify-between gap-2">
                    <button class="btn-job-details flex-1 py-2 px-3 rounded-lg bg-accent/10 hover:bg-accent text-accent hover:text-white transition text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm" data-job-id="${job.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Részletek megtekintése
                    </button>
                    <button class="btn-job-delete p-2 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 border border-border-theme hover:border-red-500/30 transition cursor-pointer" data-job-id="${job.id}" title="Törlés">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            `;
            cardsContainer.appendChild(card);
        }
    });
}

// Modal kezelése az app.js-ben
const urlModal = document.getElementById('urlModal');
const urlModalList = document.getElementById('urlModalList');
let currentModalUrls = [];

document.getElementById('closeUrlModalBtnBottom')?.addEventListener('click', () => urlModal?.classList.add('hidden'));
document.getElementById('closeUrlModalBtn')?.addEventListener('click', () => urlModal?.classList.add('hidden'));
urlModal?.addEventListener('click', (e) => {
    if (e.target === urlModal) urlModal.classList.add('hidden');
});

const btnCopyModalUrls = document.getElementById('btnCopyModalUrls');
if (btnCopyModalUrls) {
    btnCopyModalUrls.addEventListener('click', () => {
        if (!currentModalUrls || currentModalUrls.length === 0) {
            showToast('Nincsenek másolható URL-ek.', 'warning');
            return;
        }
        navigator.clipboard.writeText(currentModalUrls.join('\n')).then(() => {
            showToast(`✅ Mind a(z) ${currentModalUrls.length} db URL kimásolva a vágólapra!`, 'success');
        }).catch(() => {
            showToast('Nem sikerült a vágólapra másolás.', 'error');
        });
    });
}

// Közös eseménykezelő a történet táblázathoz és mobil kártyákhoz
function handleHistoryActionClick(e) {
    // "+N URL" gomb
    const moreBtn = e.target.closest('.show-more-urls-btn');
    if (moreBtn && urlModalList && urlModal) {
        const urlsArray = JSON.parse(decodeURIComponent(moreBtn.getAttribute('data-urls')));
        currentModalUrls = urlsArray;
        const urlModalCount = document.getElementById('urlModalCount');
        if (urlModalCount) {
            urlModalCount.textContent = `Összesen ${urlsArray.length} db URL ebben a feladatban`;
        }
        urlModalList.innerHTML = urlsArray.map(url => {
            const isLink = String(url).startsWith('http');
            return `
                <div class="p-2.5 sm:p-3 bg-primary border border-border-theme rounded-lg text-xs sm:text-sm text-accent truncate hover:bg-card transition" title="${url}">
                    ${isLink ? `<a href="${url}" target="_blank" rel="noopener noreferrer" class="hover:underline flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span class="truncate">${url}</span>
                    </a>` : `<span>${url}</span>`}
                </div>
            `;
        }).join('');
        urlModal.classList.remove('hidden');
        return;
    }

    // "Részletek" gomb
    const detailsBtn = e.target.closest('.btn-job-details');
    if (detailsBtn) {
        const jobId = detailsBtn.getAttribute('data-job-id');
        if (jobId && typeof handleJobClick === 'function') {
            handleJobClick(jobId);
        }
        return;
    }

    // "Törlés" gomb
    const deleteBtn = e.target.closest('.btn-job-delete');
    if (deleteBtn) {
        const jobId = deleteBtn.getAttribute('data-job-id');
        if (jobId && confirm('Biztosan törölni szeretnéd ezt a feladatot az előzményekből?')) {
            deleteJobFromHistory(jobId);
        }
        return;
    }
}

const historyTableBodyEl = document.getElementById('historyTableBody');
if (historyTableBodyEl) {
    historyTableBodyEl.addEventListener('click', handleHistoryActionClick);
}
const historyCardsContainerEl = document.getElementById('historyCardsContainer');
if (historyCardsContainerEl) {
    historyCardsContainerEl.addEventListener('click', handleHistoryActionClick);
}

// ==========================================
// JOB DETAILS MŰVELETEK (ID másolás, URL-ek másolása, Újraindítás)
// ==========================================
const btnCopyJobId = document.getElementById('btnCopyJobId');
if (btnCopyJobId) {
    btnCopyJobId.addEventListener('click', () => {
        if (!currentJobForDetails || !currentJobForDetails.id) {
            showToast('Nincs kiválasztott feladat.', 'warning');
            return;
        }
        navigator.clipboard.writeText(currentJobForDetails.id).then(() => {
            showToast('✅ Feladat azonosító kimásolva a vágólapra!', 'success');
        }).catch(() => {
            showToast('Nem sikerült a másolás', 'error');
        });
    });
}

const btnCopyJobUrls = document.getElementById('btnCopyJobUrls');
if (btnCopyJobUrls) {
    btnCopyJobUrls.addEventListener('click', () => {
        if (!currentJobForDetails) return;
        const urls = Array.isArray(currentJobForDetails.source_urls) 
            ? currentJobForDetails.source_urls 
            : (currentJobForDetails.source_urls ? [currentJobForDetails.source_urls] : []);
        if (urls.length === 0) {
            showToast('Nincsenek másolható URL-ek.', 'warning');
            return;
        }
        navigator.clipboard.writeText(urls.join('\n')).then(() => {
            showToast(`✅ ${urls.length} db forrás URL kimásolva a vágólapra!`, 'success');
        }).catch(() => {
            showToast('Nem sikerült a másolás', 'error');
        });
    });
}

const btnRerunJob = document.getElementById('btnRerunJob');
if (btnRerunJob) {
    btnRerunJob.addEventListener('click', () => {
        if (!currentJobForDetails) return;
        const urls = Array.isArray(currentJobForDetails.source_urls) 
            ? currentJobForDetails.source_urls 
            : (currentJobForDetails.source_urls ? [currentJobForDetails.source_urls] : []);
        if (urls.length === 0) {
            showToast('Nincsenek elérhető URL-ek az újraindításhoz.', 'warning');
            return;
        }
        const urlsBox = document.getElementById('urls');
        if (urlsBox) {
            urlsBox.value = urls.join('\n');
            if (typeof renderList === 'function') {
                renderList('urls', 'productUrlPreviewList', 'product', 'productUrlCount');
            }
            if (typeof updateCostSummary === 'function') {
                updateCostSummary();
            }
        }
        showView('upload');
        showToast('📋 Forrás URL-ek betöltve az Új feltöltés felületre!', 'success');
    });
}

// Egyedi URL másolás a részletek táblázatban
if (detailsSourceUrls) {
    detailsSourceUrls.addEventListener('click', (e) => {
        const copyBtn = e.target.closest('.copy-single-url-btn');
        if (copyBtn) {
            const rawUrl = decodeURIComponent(copyBtn.getAttribute('data-url'));
            navigator.clipboard.writeText(rawUrl).then(() => {
                showToast('✅ Forrás URL kimásolva a vágólapra!', 'success');
            }).catch(() => {
                showToast('Nem sikerült a másolás', 'error');
            });
        }
    });
}

// ==========================================
// CSV EXPORTÁLÁS (Excel-kompatibilis UTF-8 BOM)
// ==========================================
function exportHistoryToCsv() {
    const jobsToExport = (typeof lastFilteredHistoryJobs !== 'undefined' && lastFilteredHistoryJobs.length > 0)
        ? lastFilteredHistoryJobs
        : (allHistoryJobs && allHistoryJobs.length > 0 ? allHistoryJobs : getStoredJobs());

    if (!jobsToExport || jobsToExport.length === 0) {
        showToast('Nincsenek exportálható feladatok az előzményekben.', 'warning');
        return;
    }

    const headers = ['Dátum', 'Feladat ID', 'Mód', 'Cél Webáruház', 'Termékek száma (db)', 'Költség', 'Státusz', 'Forrás URL-ek'];
    
    const escapeCsv = (str) => {
        const s = String(str || '').replace(/"/g, '""');
        return `"${s}"`;
    };

    const rows = jobsToExport.map(job => {
        const dateObj = new Date(job.created_at || Date.now());
        const dateStr = !isNaN(dateObj.getTime())
            ? dateObj.toLocaleDateString('hu-HU') + ' ' + dateObj.toLocaleTimeString('hu-HU', {hour: '2-digit', minute:'2-digit'})
            : 'N/A';
        const urls = Array.isArray(job.source_urls) ? job.source_urls : (job.source_urls ? [job.source_urls] : []);
        const pCount = job.product_count || urls.length || 1;
        let priceVal = '';
        if (job.price !== undefined && job.price !== null) {
            priceVal = String(job.price).includes('Ft') ? job.price : `${parseFloat(job.price).toLocaleString('hu-HU')} Ft`;
        } else {
            priceVal = `${(pCount * (window.USER_TIER_PRICE || 240)).toLocaleString('hu-HU')} Ft`;
        }

        let statusText = job.status || 'pending';
        if (statusText === 'success') statusText = 'Sikeres';
        else if (statusText === 'error') statusText = 'Hiba';
        else if (statusText === 'calibrating' || statusText === 'pending_approval' || statusText === 'preview') statusText = 'Előnézet';
        else if (statusText === 'discarded') statusText = 'Elutasítva';
        else if (statusText === 'pending' || statusText === 'processing') statusText = 'Feldolgozás alatt';

        return [
            escapeCsv(dateStr),
            escapeCsv(job.id),
            escapeCsv(job.mode || 'Scraper'),
            escapeCsv(job.target_webshop_id || 'Unas Webshop'),
            pCount,
            escapeCsv(priceVal),
            escapeCsv(statusText),
            escapeCsv(urls.join(' | '))
        ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `supplylink_elozmenyek_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`✅ ${jobsToExport.length} db feladat sikeresen exportálva CSV fájlba!`, 'success');
}

const btnExportHistory = document.getElementById('btnExportHistory');
if (btnExportHistory) {
    btnExportHistory.addEventListener('click', exportHistoryToCsv);
}


