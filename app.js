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

// History Elementsconst historySearch = document.getElementById('historySearch');
const historyStatusFilter = document.getElementById('historyStatusFilter');
const historyTableBody = document.getElementById('historyTableBody');
const historyEmptyState = document.getElementById('historyEmptyState');

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

// Navigation Logic
function showView(view) {
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
        viewTitle.textContent = 'Dashboard Overview';
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
        viewTitle.textContent = 'New Upload';
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
        viewTitle.textContent = 'Preview & Approval';
        welcomeMessage.classList.add('hidden');
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
        viewTitle.textContent = 'Job Details';
        welcomeMessage.classList.add('hidden');
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
        viewTitle.textContent = 'Import History';
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
        viewTitle.textContent = 'User Settings';
        welcomeMessage.classList.add('hidden');
        fetchSettings();
    }
}

// ==========================================
// PREVIEW & APPROVAL LOGIKA (A Scrapelt adatokhoz)
// ==========================================

// --- Most már igazi adatokat várunk! ---
let pendingJobs = [];

let currentActiveJobId = null;

// --- ÚJ HTML Elemek kiválasztása (A te DOM-odból) ---
// (Feltételezem, hogy ezeket már definiáltad a fájl elején, de biztos ami biztos, itt vannak az újak is!)
const editorSku = document.getElementById('editorSku');
const editorShortDesc = document.getElementById('editorShortDesc');
const editorLongDesc = document.getElementById('editorLongDesc');
const currencySymbol = document.getElementById('currencySymbol');
const editorThumbnails = document.getElementById('editorThumbnails');
const editorSpecsContainer = document.getElementById('editorSpecsContainer');
const editorSpecs = document.getElementById('editorSpecs');
const imageUploader = document.getElementById('imageUploader');

// 1. A Bal oldali lista kirajzolása (Ez a függvény fut le, amikor megnyílik a Preview)
function fetchPendingJobs() {
    pendingJobsList.innerHTML = ''; // Töröljük a jelenlegi listát

    if (pendingJobs.length === 0) {
        pendingJobsList.innerHTML = `
            <div class='p-8 text-center text-muted'>
                <p class='text-sm'>No pending jobs</p>
            </div>`;
        
        // Ha üres a lista, elrejtjük/letiltjuk a szerkesztőt
        editorCard.classList.add('opacity-50', 'pointer-events-none');
        editorJobId.textContent = 'No job selected';
        return;
    }

    pendingJobs.forEach(job => {
        const isSelected = job.id === currentActiveJobId;
        
        // Kártya HTML generálása (A te Tailwind stílusaiddal!)
        const btn = document.createElement('button');
        btn.className = `w-full text-left p-4 flex items-center gap-4 transition-colors hover:bg-primary/50 focus:outline-none ${
            isSelected ? 'bg-primary border-l-4 border-accent' : 'border-l-4 border-transparent'
        }`;
        
        btn.innerHTML = `
            <img src="${job.images[0]}" alt="" class="w-12 h-12 rounded object-cover border border-border-theme bg-primary shrink-0" />
            <div class="overflow-hidden">
                <h4 class="font-semibold text-main text-sm truncate">${job.title}</h4>
                <p class="text-xs text-muted mt-1 font-mono">${job.sku || 'No SKU'}</p>
            </div>
        `;

        btn.onclick = () => selectJob(job.id);
        pendingJobsList.appendChild(btn);
    });

    // Ha van termék, de még egy sincs kiválasztva, válasszuk ki az elsőt!
    if (pendingJobs.length > 0 && !currentActiveJobId) {
        selectJob(pendingJobs[0].id);
    }
}

// =====================================================================
// INNENTŐL KEZDVE MÁSOLD BE (Töröld ki a régit eddig a pontig!)
// =====================================================================

// 2. Egy termék betöltése a jobb oldali szerkesztőbe
function selectJob(id, activeImgIndex = 0) {
    currentActiveJobId = id;
    fetchPendingJobs(); // Újrarajzoljuk a listát
    
    const job = pendingJobs.find(j => j.id === id);
    
    if (job) {
        // Megjelenítjük a szerkesztőt (Levesszük a letiltást)
        editorCard.classList.remove('opacity-50', 'pointer-events-none');
        editorJobId.textContent = `Job ID: ${job.id}`;

        // Inputok feltöltése
        editorTitle.value = job.title || '';
        if (editorSku) editorSku.value = job.sku || '';
        editorPrice.value = job.price || '';
        if (editorNetPrice) editorNetPrice.value = job.netPrice || '';
        if (currencySymbol) currencySymbol.innerText = job.currency === 'HUF' ? 'Ft' : (job.currency === 'EUR' ? '€' : '$');
        if (editorShortDesc) editorShortDesc.value = job.shortDesc || '';
        if (editorLongDesc) editorLongDesc.value = job.longDesc || '';

        // ==========================================
        // KÉP KEZELÉSE (BÉLYEGKÉPEK + TÖRLÉS GOMB)
        // ==========================================
        if (job.images && job.images.length > 0) {
            // Biztonsági ellenőrzés (ha töröltük az utolsót, ugorjon vissza eggyel)
            if (activeImgIndex >= job.images.length) activeImgIndex = Math.max(0, job.images.length - 1);

            editorImagePlaceholder.classList.add('hidden');
            editorImage.classList.remove('hidden');
            editorImage.src = job.images[activeImgIndex]; // Az aktív képet jelenítjük meg
        } else {
            editorImagePlaceholder.classList.remove('hidden');
            editorImage.classList.add('hidden');
        }

        // Bélyegképek területének megjelenítése (Mindig látszik a Plusz gomb miatt)
        editorThumbnails.classList.remove('hidden');
        editorThumbnails.innerHTML = ''; // Előző képek/gombok törlése
        
        // 1. Meglévő képek és a Delete gomb kirajzolása
        if (job.images && job.images.length > 0) {
            job.images.forEach((imgSrc, index) => {
                // Wrapper a képnek és a Delete szövegnek
                const thumbWrapper = document.createElement('div');
                thumbWrapper.className = "flex flex-col items-center gap-1 shrink-0";

                const thumb = document.createElement('img');
                thumb.src = imgSrc;
                
                const baseClass = "w-12 h-12 rounded object-cover cursor-pointer transition-colors border-2 bg-white ";
                thumb.className = baseClass + (index === activeImgIndex ? "border-accent" : "border-transparent hover:border-gray-300");
                
                // Kattintásra: újratöltjük az egész kártyát, fókuszban ezzel a képpel!
                thumb.onclick = () => selectJob(id, index);
                
                thumbWrapper.appendChild(thumb);

                // Ha ez az aktív kép, alárakjuk a Delete gombot!
                if (index === activeImgIndex) {
                    const delText = document.createElement('span');
                    delText.className = "text-[10px] text-red-500 font-bold cursor-pointer hover:underline";
                    delText.innerText = "Delete";
                    delText.onclick = (e) => {
                        e.stopPropagation(); // Ne kattintson a képre is
                        if(typeof saveState === 'function') saveState(); // Mentsünk a történelembe a törlés előtt!
                        job.images.splice(index, 1); // Kép törlése az adatok közül
                        selectJob(id, Math.max(0, index - 1)); // Visszaugrás az előző képre
                    };
                    thumbWrapper.appendChild(delText);
                }

                editorThumbnails.appendChild(thumbWrapper);
            });
        }

        // 2. PLUSZ GOMB hozzáadása
        const plusBtn = document.createElement('button');
        plusBtn.className = "w-12 h-12 shrink-0 flex items-center justify-center rounded-lg border-2 border-dashed border-border-theme text-muted hover:border-accent hover:text-accent hover:bg-accent/10 transition-all focus:outline-none";
        plusBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>`;
        
        // Gombnyomásra "bekattintjuk" a rejtett inputot (Golyóálló módszer)
        plusBtn.onclick = () => {
            const uploader = document.getElementById('imageUploader');
            if (uploader) {
                uploader.click(); 
            } else {
                console.error("❌ HIBA: Nem találom az 'imageUploader' inputot a HTML-ben!");
                alert("Hiba: Hiányzik a rejtett fájlfeltöltő a HTML-ből!");
            }
        };

        editorThumbnails.appendChild(plusBtn);

        // ==========================================
        // SPECIFIKÁCIÓK (PARAMÉTEREK) RAJZOLÁSA
        // ==========================================
        if (job.specs && Object.keys(job.specs).length > 0) {
            editorSpecsContainer.classList.remove('hidden');
            editorSpecs.innerHTML = '';
            Object.entries(job.specs).forEach(([key, value]) => {
                const specTag = document.createElement('div');
                specTag.className = "bg-primary border border-border-theme px-3 py-1.5 rounded text-xs flex gap-2 text-main shadow-sm";
                specTag.innerHTML = `<span class="font-bold opacity-70">${key}:</span> <span>${value}</span>`;
                editorSpecs.appendChild(specTag);
            });
        } else {
            editorSpecsContainer.classList.add('hidden');
        }

    } else {
        // Ha nincs termék kiválasztva
        editorCard.classList.add('opacity-50', 'pointer-events-none');
        editorJobId.textContent = 'No job selected';
    }
}

// 3. Élő mentés: Ahogy a user gépel, mentjük a memóriába (hogy ne vesszen el kattintáskor)
function updateActiveJob(field, value) {
    const job = pendingJobs.find(j => j.id === currentActiveJobId);
    if (job) { job[field] = value; }
}

editorTitle.addEventListener('input', (e) => updateActiveJob('title', e.target.value));
editorSku.addEventListener('input', (e) => updateActiveJob('sku', e.target.value));
editorPrice.addEventListener('input', (e) => updateActiveJob('price', e.target.value));
editorShortDesc.addEventListener('input', (e) => updateActiveJob('shortDesc', e.target.value));
editorLongDesc.addEventListener('input', (e) => updateActiveJob('longDesc', e.target.value));



function clearEditor() {
    // Fejléc visszaállítása
    if (editorJobId) editorJobId.textContent = 'No job selected';

    // Beviteli mezők kiürítése
    if (editorTitle) editorTitle.value = '';
    if (editorSku) editorSku.value = '';
    if (editorPrice) editorPrice.value = '';
    if (editorNetPrice) editorNetPrice.value = '';
    if (editorShortDesc) editorShortDesc.value = '';
    if (editorLongDesc) editorLongDesc.value = '';

    // Kép elrejtése és a szürke placeholder (üres kép ikon) megjelenítése
    if (editorImage) {
        editorImage.src = '';
        editorImage.classList.add('hidden'); 
    }
    if (editorImagePlaceholder) {
        editorImagePlaceholder.classList.remove('hidden');
    }
}



// ==========================================
// EGYSÉGESÍTETT APPROVE & PUBLISH FUNKCIÓ
// ==========================================
// ==========================================
// VAT KALKULÁTOR SIMPLE (HUF FIX + NORMÁL KALKULÁCIÓ)
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

        // Ha a nettó ár üres, de van bruttó, visszaszámoljuk a nettót a forrás áfával
        if (isNaN(netPrice) && !isNaN(grossPrice)) {
            const sourceMultiplier = 1 + (sourceVat / 100);
            netPrice = grossPrice / sourceMultiplier;
            editorNetPrice.value = parseFloat(netPrice.toFixed(2));
        }

        // A Cél Ország áfájának rászámolása a nettóra
        const targetMultiplier = 1 + (targetVat / 100);
        let newGrossPrice = netPrice * targetMultiplier;
        
        editorPrice.value = parseFloat(newGrossPrice.toFixed(2));

        // Vizuális visszajelzés a gombnak
        const originalText = btnApplyVatCalcSimple.innerText;
        btnApplyVatCalcSimple.innerText = 'Kész!';
        btnApplyVatCalcSimple.classList.add('bg-green-600');
        setTimeout(() => {
            btnApplyVatCalcSimple.innerText = originalText;
            btnApplyVatCalcSimple.classList.remove('bg-green-600');
        }, 1500);
    });
}

btnApprove.addEventListener('click', async () => {
    let rawJobId = editorJobId ? editorJobId.textContent : '';
    const jobId = rawJobId.replace('Job ID:', '').trim();

    if (!jobId || jobId === 'No job selected') {
        alert('Kérlek, válassz ki egy terméket a listából!');
        return;
    }

    const updatedData = {
        title: editorTitle.value,
        sku: editorSku.value,
        price: editorPrice.value,
        shortDescription: editorShortDesc.value,
        description: editorLongDesc.value, 
        imageUrl: editorImage ? editorImage.src : '' 
    };

    const originalText = btnApprove.innerText;
    btnApprove.innerText = 'Publishing...';
    btnApprove.disabled = true;

    try {
        const response = await fetch(`/api/user/job/${jobId}/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert('Termék sikeresen közzétéve!');
            
            // 1. KILÖVJÜK A MEMÓRIÁBÓL A TERMÉKET
            if (typeof pendingJobs !== 'undefined') {
                pendingJobs = pendingJobs.filter(j => j.id !== jobId);
            }
            if (typeof currentActiveJobId !== 'undefined') {
                currentActiveJobId = null;
            }

            // 2. Kiürítjük a szerkesztőt
            clearEditor(); 
            
        } else {
            const errorData = await response.json();
            alert('Hiba történt: ' + (errorData.error || 'Ismeretlen hiba'));
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('Hálózati hiba történt a küldés során.');
    } finally {
        btnApprove.innerText = originalText;
        btnApprove.disabled = false;
    }
});

// ==========================================
// EGYSÉGESÍTETT DISCARD FUNKCIÓ
// ==========================================
btnDiscard.addEventListener('click', async () => {
    let rawJobId = editorJobId ? editorJobId.textContent : '';
    const jobId = rawJobId.replace('Job ID:', '').trim();

    if (!jobId || jobId === 'No job selected') return;

    if (!confirm('Biztosan törölni szeretnéd ezt a tervet?')) return;

    const originalText = btnDiscard.innerText;
    btnDiscard.innerText = 'Törlés...';
    btnDiscard.disabled = true;

    try {
        const response = await fetch(`/api/user/job/${jobId}/discard`, {
            method: 'POST'
        });

        if (response.ok) {
            alert('Termék elvetve.');
            
            // 1. KILÖVJÜK A MEMÓRIÁBÓL A TERMÉKET
            if (typeof pendingJobs !== 'undefined') {
                pendingJobs = pendingJobs.filter(j => j.id !== jobId);
            }
            if (typeof currentActiveJobId !== 'undefined') {
                currentActiveJobId = null;
            }

            // 2. Kiürítjük a szerkesztőt
            clearEditor();
            
        } else {
            alert('Nem sikerült elvetni a terméket.');
        }
    } catch (error) {
        console.error('Discard Error:', error);
        alert('Hálózati hiba történt a törlés során.');
    } finally {
        btnDiscard.innerText = originalText;
        btnDiscard.disabled = false;
    }
});



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
btnBackToDashboard.addEventListener('click', () => history.back());

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
async function fetchStats(timeframe) {
    try {
        const response = await fetch(`/api/user/${TEST_USER_ID}/stats?timeframe=${timeframe}`);
        const data = await response.json();
        
        // Also fetch dashboard stats for the cards
        const dashRes = await fetch(`/api/user/${TEST_USER_ID}/dashboard-stats`);
        const dashData = await dashRes.json();
        
        updateDashboard(data, dashData);
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

function updateDashboard(data, dashData) {
    // 1. A kártyák és a felső egyenleg frissítése az új (eurós) backend alapján
    if (dashData) {
        if (typeof statTotalUploads !== 'undefined') statTotalUploads.textContent = dashData.totalUploads;
        if (typeof statTokensUsed !== 'undefined') statTokensUsed.textContent = `${dashData.currentTierPrice} eur / upload`;
        if (typeof statCostSaved !== 'undefined') statCostSaved.textContent = `${dashData.totalSpent} eur`;

        // A jobb felső Egyenleg (Balance) javítása
        const balanceDisplay = document.getElementById('balanceDisplay') || document.getElementById('topbar-balance-display');
        if (balanceDisplay) {
            balanceDisplay.textContent = `${dashData.balance} eur`;
            balanceDisplay.classList.remove('text-red-500'); // Levesszük a piros hibaszínt
        }

        // --- ÚJ: PROGRESS BAR LOGIKA BEILLESZTVE IDE ---
        const totalUploads = dashData.totalUploads || 0;
        let maxUploads = 100;
        let subText = "";
        let barWidth = 0;

        if (totalUploads <= 100) {
            maxUploads = 100;
            subText = `${100 - totalUploads} more uploads to unlock the 0.6 eur/upload tier!`;
            barWidth = (totalUploads / 100) * 100;
        } else if (totalUploads > 100 && totalUploads <= 500) {
            maxUploads = 500;
            subText = `${500 - totalUploads} more uploads to unlock the VIP 0.2 eur/upload tier!`;
            barWidth = (totalUploads / 500) * 100;
        } else {
            maxUploads = totalUploads; 
            subText = "Best tier unlocked! Enjoy 0.2 eur/upload.";
            barWidth = 100;
        }

        const pText = document.getElementById('progressText');
        const pSub = document.getElementById('progressSubtext');
        const pBar = document.getElementById('progressBar');

        if (pText) pText.innerText = `${totalUploads} / ${maxUploads} Uploads`;
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
                            const count = context.parsed.y;
                            // Kiolvassuk a "Current Tier Price" kártyáról a jelenlegi árat
                            const priceText = document.getElementById('statTokensUsed')?.innerText || '1';
                            const price = parseFloat(priceText) || 1; 
                            const cost = (count * price).toFixed(2);
                            
                            return ` Uploads: ${count} db | Est. Cost: ${cost} eur`;
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
        const response = await fetch(`/api/user/job/${jobId}`);
        if (!response.ok) throw new Error('Failed to fetch job details');
        
        const job = await response.json();
        
        // Populate Details View
        detailsJobId.textContent = job.id;
        
        // Status Badge
        let statusClass = 'text-accent bg-accent/10 border-accent/20';
        if (job.status === 'success') statusClass = 'text-green-600 bg-green-50 border-green-200';
        if (job.status === 'error') statusClass = 'text-red-600 bg-red-50 border-red-200';
        
        detailsStatusBadge.className = `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusClass}`;
        detailsStatusBadge.textContent = job.status;
        
        // Source URLs Table
        detailsSourceUrls.innerHTML = '';
        const urls = Array.isArray(job.source_urls) ? job.source_urls : [];
        
        if (urls.length === 0) {
            detailsSourceUrls.innerHTML = `<tr><td colspan='2' class='px-4 py-8 text-center text-muted'>No URLs found for this job.</td></tr>`;
        } else {
            urls.forEach((url, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class='px-4 py-3 text-xs text-muted font-mono'>${index + 1}</td>
                    <td class='px-4 py-3 text-sm text-main break-all'>${url}</td>
                `;
                detailsSourceUrls.appendChild(row);
            });
        }
        
        if (!skipHistory) {
            history.pushState({ view: 'job-details', jobId: jobId }, '', '#job/' + jobId);
        }
        
        showView('job-details');
    } catch (error) {
        console.error('Error handling job click:', error);
        alert('Could not load job details.');
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

// Fetch Shops
async function fetchShops() {
    try {
        const response = await fetch(`/api/user/${TEST_USER_ID}/shops`);
        const shops = await response.json();
        
        shopSwitcher.innerHTML = '';
        if (shops.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No shops found';
            shopSwitcher.appendChild(option);
            return;
        }

        shops.forEach(shop => {
            const option = document.createElement('option');
            option.value = shop.id; // This is the UUID
            option.textContent = shop.name || shop.platform || shop.id;
            shopSwitcher.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching shops:', error);
        shopSwitcher.innerHTML = '<option value="">Error loading shops</option>';
    }
}

// Fetch Balance (Kibővítve a titkos fegyverrel)
async function fetchBalance() {
    try {
        const response = await fetch(`/api/user/${TEST_USER_ID}/dashboard-stats`);
        const data = await response.json();
        
        // 🔥 EZ A TITKOS FEGYVER: Kiírjuk a böngésző konzoljába, mit küld a backend!
        console.log('🔥 API VÁLASZ A BACKENDTŐL:', data); 

        if (data.balance !== undefined) {
            balanceDisplay.textContent = `${data.balance} eur`;
            
            // 1. Kártyák frissítése
            if (statTokensUsed) statTokensUsed.textContent = `${data.currentTierPrice || 1} eur / upload`;
            if (statCostSaved) statCostSaved.textContent = `${(data.totalSpent || 0).toFixed(2)} eur`;

            // 🔥 ÚJ: ITT A HIÁNYZÓ LÁNCSZEM: A Total Uploads kártya frissítése!
            // Ha a HTML-ben más az ID-ja annak a számnak, írd át a 'statTotalUploads'-ot!
            const statTotalUploads = document.getElementById('statTotalUploads'); 
            if (statTotalUploads) {
                statTotalUploads.textContent = data.totalUploads || 0;
            }

            // 2. Csík (Progress bar) frissítése
            if (tokenUsageText && tokenProgressBar) {
                const uploads = data.totalUploads || 0;
                let limit = 100;
                
                if (uploads > 100 && uploads <= 500) {
                    limit = 500;
                } else if (uploads > 500) {
                    limit = uploads;
                }
                
                tokenUsageText.textContent = `${uploads} / ${limit} Uploads`;
                const percentage = limit > 0 ? Math.min((uploads / limit) * 100, 100) : 100;
                tokenProgressBar.style.width = `${percentage}%`;
            }
        } else {
            console.error('Nincs balance az adatban!', data);
            balanceDisplay.textContent = 'Error';
        }
    } catch (error) {
        console.error('🔥 CRITICAL Error fetching balance:', error);
        balanceDisplay.textContent = 'Error';
    }
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
    editorCard.classList.add('opacity-50', 'pointer-events-none');
    editorJobId.textContent = 'No job selected';
    
    // Alap inputok ürítése
    editorTitle.value = '';
    editorPrice.value = '';
    if (editorNetPrice) editorNetPrice.value = '';
    
    // ÚJ: A régi editorDescription helyett az új mezők ürítése!
    if (editorSku) editorSku.value = '';
    if (editorShortDesc) editorShortDesc.value = '';
    if (editorLongDesc) editorLongDesc.value = '';
    
    // Fő kép ürítése és elrejtése
    editorImage.src = '';
    editorImage.classList.add('hidden');
    editorImagePlaceholder.classList.remove('hidden');
    
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
    const bgColor = type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-800';
    const iconColor = type === 'warning' ? 'text-amber-400' : 'text-red-400';
    
    toast.className = `${bgColor} border p-4 rounded-xl shadow-lg flex items-start space-x-3 max-w-sm transform translate-y-10 opacity-0 transition-all duration-300 z-50`;
    
    const icon = type === 'warning' ? 
        `<svg class="h-5 w-5 ${iconColor}" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>` :
        `<svg class="h-5 w-5 ${iconColor}" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>`;

    toast.innerHTML = `
        <div class="flex-shrink-0">${icon}</div>
        <div class="flex-1 text-sm font-medium">${message}</div>
        <button class="flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none" onclick="this.parentElement.remove()">
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
        const response = await fetch(`/api/user/${TEST_USER_ID}/jobs`);
        if (!response.ok) throw new Error('Failed to fetch history');
        
        allHistoryJobs = await response.json();
        applyHistoryFilters();
    } catch (error) {
        console.error('Error fetching history:', error);
        historyTableBody.innerHTML = `<tr><td colspan='6' class='px-6 py-12 text-center text-red-600'>Error loading history.</td></tr>`;
    }
}

function applyHistoryFilters() {
    const searchTerm = historySearch.value.toLowerCase();
    const statusFilter = historyStatusFilter.value;
    
    const filteredJobs = allHistoryJobs.filter(job => {
        const matchesSearch = job.id.toLowerCase().includes(searchTerm) || 
                             (job.source_urls && job.source_urls.some(url => url.toLowerCase().includes(searchTerm)));
        const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    renderHistoryTable(filteredJobs);
}

function renderHistoryTable(jobs) {
    historyTableBody.innerHTML = '';
    
    if (jobs.length === 0) {
        historyEmptyState.classList.remove('hidden');
        return;
    }
    
    historyEmptyState.classList.add('hidden');
    
    jobs.forEach(job => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-primary transition-colors';
        
        let statusClass = 'text-accent bg-accent/10 border-accent/20';
        if (job.status === 'success') statusClass = 'text-green-600 bg-green-50 border-green-200';
        if (job.status === 'error') statusClass = 'text-red-600 bg-red-50 border-red-200';
        if (job.status === 'pending_approval') statusClass = 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (job.status === 'discarded') statusClass = 'text-muted bg-primary border-border-theme';

        const date = new Date(job.created_at).toLocaleDateString();
        const urlsCount = Array.isArray(job.source_urls) ? job.source_urls.length : 0;
        
        const canRetry = job.status === 'error' || job.status === 'discarded';
        const retryBtn = canRetry ? 
            `<button onclick="handleRetry('${job.id}')" class='text-accent hover:opacity-80 font-medium transition flex items-center gap-1 ml-auto'>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry
            </button>` : '';

        row.innerHTML = `
            <td class='px-6 py-4 text-muted'>${date}</td>
            <td class='px-6 py-4 font-mono text-accent cursor-pointer hover:underline' onclick="handleJobClick('${job.id}')">${job.id.substring(0, 8)}...</td>
            <td class='px-6 py-4 text-main'>${job.shop_id ? 'Store ID: ' + job.shop_id.substring(0,5) : 'Unknown'}</td>
            <td class='px-6 py-4 text-center text-muted'>${urlsCount}</td>
            <td class='px-6 py-4'>
                <span class='px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusClass}'>
                    ${job.status.toUpperCase()}
                </span>
            </td>
            <td class='px-6 py-4 text-right'>
                ${retryBtn}
            </td>
        `;
        historyTableBody.appendChild(row);
    });
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

// Ideiglenes: Teszteljük a Tier 2-es (0.6 eurós) árral
const USER_TIER_PRICE = 0.60;

// A régi 'keywords' változót teljesen kidobtuk, már nincs rá szükség!

// ÚJ: Aszinkron API hívás a backend felé
async function analyzeUrl(urlStr, expectedType) {
    let cleanUrl = urlStr.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
    }

    try {
        const response = await fetch('/api/validate-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: cleanUrl, expectedType: expectedType })
        });
        
        if (!response.ok) throw new Error('Network error');
        
        const data = await response.json();
        return data;

    } catch (error) {
        return { status: 'invalid', icon: '❌', color: 'text-red-600 border-red-200 bg-red-50', msg: 'Validation failed (Server error)' };
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
});
// --- OKOS URL ELLENŐRZŐ VÉGE ---



window.USER_TIER_PRICE = 0.60; 

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
    document.getElementById('summaryTierPrice').innerText = window.USER_TIER_PRICE.toFixed(2) + ' €';
    
    const finalCost = totalProducts * window.USER_TIER_PRICE;
    document.getElementById('summaryTotalCost').innerText = finalCost.toFixed(2) + ' €';
}


// ==========================================
// 1. URL VALIDÁCIÓ (A Checking Server hívása)
// ==========================================
{
    console.log("🚀 URL Validációs blokk betöltődött!"); // <-- Ezt látnunk kell a konzolban!

    const urlsEl = document.getElementById('urls');
    const submitBtnContainer = document.getElementById('submitButtonContainer');
    
    console.log("URL mező megvan?", urlsEl); // <-- Ki kell írnia a HTML elemet (vagy azt, hogy null)
    console.log("Gomb konténer megvan?", submitBtnContainer);

    let validationTimeout;

    if (urlsEl) {
        urlsEl.addEventListener('input', () => {
            console.log("✍️ Gépeltél valamit a dobozba!"); // <-- Amikor beteszed a linket, ennek meg kell jelennie!
            
            clearTimeout(validationTimeout);
            
            // Removed hiding button during validation

            validationTimeout = setTimeout(async () => {
                console.log("⏳ 1 másodperc letelt, indul a hívás..."); // <-- Ha eddig eljut, akkor az API hívásnál van a baj
                // ... (innen folytatódik a korábbi kód a const urls = urlsEl.value... résszel)
                const urls = urlsEl.value.split('\n').map(u => u.trim()).filter(u => u !== '');
                
                if (urls.length === 0) {
                    if (productUrlCount) productUrlCount.innerText = "0 products detected";
                    if (costSummaryCard) costSummaryCard.classList.add('hidden');
                    return;
                }

                let totalProducts = 0;
                let validUrls = 0;

                // Végigmegyünk a linkeken és meghívjuk a TE backend validálódat
                for (const url of urls) {
                    try {
                        // ⚠️ CSERÉLD KI a localhost-ot a te szervered címére (ahol a router.post('/validate-url' fut) ⚠️
                        const res = await fetch('http://localhost:3000/validate-url', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ url: url, expectedType: 'product' })
                        });
                        
                        const data = await res.json();
                        
                        if (data.status === 'valid' || data.status === 'warning') {
                            validUrls++;
                            totalProducts += data.product_count || 0;
                        }
                    } catch (e) {
                        console.error("Hiba az URL ellenőrzésekor:", url, e);
                    }
                }

                // UI Frissítése az eredményekkel
                if (productUrlCount) productUrlCount.innerText = `${totalProducts} products detected`;
                if (summaryUrlCount) summaryUrlCount.innerText = validUrls;
                if (summaryProductCount) summaryProductCount.innerText = totalProducts;

                // Ha van legalább 1 érvényes url, MEGJELENÍTJÜK A GOMBOT és a kártyát!
                if (validUrls > 0 || totalProducts > 0) {
                    if (costSummaryCard) costSummaryCard.classList.remove('hidden');
                    // Removed showing button here, it's always visible
                } else {
                    if (productUrlCount) productUrlCount.innerText = "❌ Invalid URLs or Cloudflare block";
                }
            }, 1000);
        });
    }
}

// ==========================================
// 2. A TÉNYLEGES IMPORTÁLÁS (A te szervered hívása)
// ==========================================
{
    const formEl = document.getElementById('importForm');
    const urlsEl = document.getElementById('urls');
    const progressContainer = document.getElementById('importProgressContainer');
    const spinnerEl = document.getElementById('importSpinner');
    const successIconEl = document.getElementById('importSuccessIcon');
    const statusTextEl = document.getElementById('importStatusText');
    const subStatusTextEl = document.getElementById('importSubStatusText');
    const btnPreview = document.getElementById('btnGoToPreview');

    if (formEl && urlsEl) {
        formEl.addEventListener('submit', async (e) => {
            e.preventDefault();

            const urls = urlsEl.value.split('\n').map(u => u.trim()).filter(u => u !== '');
            if (urls.length === 0) return;

            // UI átváltása: Form elrejtése, Töltőképernyő megjelenítése
            formEl.classList.add('hidden');
            if (progressContainer) {
                progressContainer.classList.remove('hidden');
                progressContainer.classList.add('flex');
            }
            if (spinnerEl) spinnerEl.classList.remove('hidden');
            if (successIconEl) successIconEl.classList.add('hidden');
            if (btnPreview) btnPreview.classList.add('hidden');

            if (statusTextEl) statusTextEl.innerText = `Analyzing URLs...`;
            if (subStatusTextEl) subStatusTextEl.innerText = `Running advanced scraper...`;

            try {
                // 1. Összeszedjük a form adatait
                const shopSwitcher = document.getElementById('shopSwitcher');
                const internalNoteEl = document.getElementById('internalNote');
                
                const requestBody = {
                    userId: typeof TEST_USER_ID !== 'undefined' ? TEST_USER_ID : 'test_user',
                    shopId: shopSwitcher ? shopSwitcher.value : '',
                    urls: urls,
                    languages: typeof selectedLanguages !== 'undefined' ? selectedLanguages : [],
                    categoryMode: false,
                    internalNote: internalNoteEl ? internalNoteEl.value : ''
                };

                // 2. Meghívjuk a TE VALÓS szerveredet!
                const response = await fetch('/api/upload/init', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody) 
                });

                if (!response.ok) throw new Error(`Szerver hiba: ${response.status}`);

                // 3. Visszakapjuk a szervertől a lekapart adatokat
                const scrapedData = await response.json();

                // Betesszük a frontend memóriájába
                if (Array.isArray(scrapedData)) {
                    scrapedData.forEach(item => pendingJobs.push(item));
                } else if (scrapedData) {
                    pendingJobs.push(scrapedData);
                }

                // 4. Siker képernyő megjelenítése
                if (spinnerEl) spinnerEl.classList.add('hidden');
                if (successIconEl) successIconEl.classList.remove('hidden');
                if (statusTextEl) statusTextEl.innerText = "Scraping Complete!";
                if (subStatusTextEl) subStatusTextEl.innerText = `Successfully processed URLs.`;
                if (btnPreview) btnPreview.classList.remove('hidden');

            } catch (error) {
                console.error("Scraping hiba:", error);
                
                if (spinnerEl) spinnerEl.classList.add('hidden');
                if (statusTextEl) statusTextEl.innerText = "Scraping Error!";
                if (subStatusTextEl) subStatusTextEl.innerText = "Sikertelen importálás. Nézd meg a konzolt!";
                
                setTimeout(() => {
                    formEl.classList.remove('hidden');
                    if (progressContainer) {
                        progressContainer.classList.add('hidden');
                        progressContainer.classList.remove('flex');
                    }
                }, 3000);
            }
        });
    }

    // "Review Extracted Products" gomb
    if (btnPreview) {
        btnPreview.addEventListener('click', () => {
            if (formEl) formEl.classList.remove('hidden');
            if (progressContainer) {
                progressContainer.classList.add('hidden');
                progressContainer.classList.remove('flex');
            }
            if (urlsEl) urlsEl.value = '';

            if (typeof showView === 'function') showView('preview');
            if (typeof fetchPendingJobs === 'function') fetchPendingJobs(); 
        });
    }
}


// ==========================================
// 🚀 N8N WEBHOOK IMPORT (Fire & Forget)
// ==========================================
(function() {
    const fixForm = document.getElementById('importForm');
    if (!fixForm) return;

    // n8n webhook URL-ek
    const N8N_SCRAPER_WEBHOOK = 'https://n8n.webspiringsystems.com/webhook/start-upload';
    const N8N_EXCEL_WEBHOOK   = 'https://n8n.webspiringsystems.com/webhook/excel-import';

    fixForm.onsubmit = async function(e) {
        e.preventDefault();

        // Mi az aktív mód? (Termék Kinyerés vs Excel Import)
        const activeMode = document.getElementById('categoryMode')?.value || 'automatic';
        const isExcelMode = (activeMode === 'import');

        // UI → TÖLTŐ ÁLLAPOT
        const progressContainer = document.getElementById('importProgressContainer');
        const statusText        = document.getElementById('importStatusText');
        const subStatusText     = document.getElementById('importSubStatusText');
        const spinner           = document.getElementById('importSpinner');
        const successIcon       = document.getElementById('importSuccessIcon');

        fixForm.classList.add('hidden');
        if (progressContainer) {
            progressContainer.classList.remove('hidden');
            progressContainer.classList.add('flex');
        }
        if (spinner)       spinner.classList.remove('hidden');
        if (successIcon)   successIcon.classList.add('hidden');

        try {
            let response;

            if (isExcelMode) {
                // ==========================================
                // 📊 EXCEL IMPORT MÓD → excel-import webhook
                // ==========================================
                const fileInput = document.getElementById('excelFile') || fixForm.querySelector('input[type="file"]');
                if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                    alert('Hiba: Válassz ki egy Excel fájlt!');
                    fixForm.classList.remove('hidden');
                    if (progressContainer) { progressContainer.classList.add('hidden'); progressContainer.classList.remove('flex'); }
                    return;
                }

                if (statusText)    statusText.innerText    = 'Excel fájl feltöltése...';
                if (subStatusText) subStatusText.innerText = 'Az n8n feldolgozza az Excel adatokat.';

                const formData = new FormData();
                formData.append('file', fileInput.files[0]);

                // NE adj hozzá Content-Type headert — a browser állítja be a boundary-val együtt!
                response = await fetch(N8N_EXCEL_WEBHOOK, {
                    method: 'POST',
                    body: formData
                });

            } else {
                // ==========================================
                // 🔗 TERMÉK KINYERÉS MÓD → start-upload webhook
                // ==========================================
                const urlEl      = document.getElementById('urls') || document.getElementById('categoryUrls');
                const sourceEl   = document.getElementById('adatforras') || document.getElementById('source');
                const carModelEl = document.getElementById('carModel');
                const tipusEl    = document.getElementById('tipus') || document.getElementById('Típus');

                const url      = urlEl?.value?.trim() || '';
                const source   = sourceEl?.value?.trim() || 'HTML';
                const carModel = carModelEl?.value?.trim() || '';
                const tipus    = tipusEl?.value?.trim() || 'termék';

                if (!url) {
                    alert('Hiba: Adj meg egy URL-t!');
                    fixForm.classList.remove('hidden');
                    if (progressContainer) { progressContainer.classList.add('hidden'); progressContainer.classList.remove('flex'); }
                    return;
                }

                if (statusText)    statusText.innerText    = 'Scraping elindítva...';
                if (subStatusText) subStatusText.innerText = 'Az n8n átvette a feladatot. Ez eltarthat néhány percig.';

                // A Karmester "Respond: Immediately" módban → azonnal visszaküld 200-as OK-t,
                // majd háttérben fut: scraping + fordítás + Unas feltöltés.
                response = await fetch(N8N_SCRAPER_WEBHOOK, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url:      url,
                        source:   source,
                        carModel: carModel,
                        Típus:    tipus
                    })
                });
            }

            if (!response.ok) {
                throw new Error(`n8n webhook hiba (HTTP ${response.status})`);
            }

            // SIKER → ÜZENET MEGJELENÍTÉSE
            if (spinner)       spinner.classList.add('hidden');
            if (successIcon)   successIcon.classList.remove('hidden');
            if (statusText)    statusText.innerText = '✅ Feldolgozás elindítva!';
            if (subStatusText) subStatusText.innerText = isExcelMode
                ? 'Az n8n feldolgozza az Excel fájlt és feltölti a termékeket az Unasra. Ha kész, emailben kapsz értesítést.'
                : 'Az n8n a háttérben dolgozik. A termékek scraping-je, fordítása és Unasra való feltöltése automatikusan megtörténik. Ha kész, emailben kapsz értesítést.';

            console.log('✅ n8n webhook sikeresen elindítva:', isExcelMode ? 'Excel mód' : 'Scraper mód');

        } catch (err) {
            // 5. HIBA KEZELÉS
            console.error('❌ n8n webhook hívás sikertelen:', err);
            if (spinner)       spinner.classList.add('hidden');
            if (statusText)    statusText.innerText    = '❌ Hiba történt!';
            if (subStatusText) subStatusText.innerText =
                `Nem sikerült kapcsolódni az n8n-hez. Ellenőrizd a hálózatot és az n8n állapotát. (${err.message})`;

            // Visszaengedjük az űrlapot
            setTimeout(() => {
                fixForm.classList.remove('hidden');
                if (progressContainer) {
                    progressContainer.classList.add('hidden');
                    progressContainer.classList.remove('flex');
                }
            }, 3000);
        }
    };
})();

// ==========================================
// HISTORY NÉZET LOGIKA
// ==========================================

async function fetchAndDisplayHistory() {
    const tbody = document.getElementById('historyTableBody');
    const emptyState = document.getElementById('historyEmptyState');
    
    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-muted">Loading history...</td></tr>';
    emptyState.classList.add('hidden');

    try {
        const response = await fetch('/api/history');
        const result = await response.json();

        if (result.success) {
            renderHistoryTable(result.data);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error("Hiba a betöltéskor:", error);
        tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">Failed to load history data.</td></tr>`;
    }
}

function renderHistoryTable(jobs) {
    const tbody = document.getElementById('historyTableBody');
    const emptyState = document.getElementById('historyEmptyState');
    
    tbody.innerHTML = ''; 

    if (!jobs || jobs.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
    }

    jobs.forEach(job => {
        const tr = document.createElement('tr');
        
        const dateObj = new Date(job.created_at);
        const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        const urls = job.source_urls || [];
        const firstUrl = urls.length > 0 ? urls[0] : 'N/A';
        const displayUrl = firstUrl.replace(/^https?:\/\/(www\.)?/, ''); 

        let urlHtml = `<div class="flex items-center gap-2">
            <span class="truncate max-w-[200px] text-muted block" title="${firstUrl}">${displayUrl}</span>`;

        if (urls.length > 1) {
            const encodedUrls = encodeURIComponent(JSON.stringify(urls));
            urlHtml += `
            <button class="show-more-urls-btn px-2 py-0.5 bg-accent/10 text-accent border border-accent/20 rounded-full text-xs font-bold hover:bg-accent hover:text-white transition cursor-pointer" data-urls="${encodedUrls}">
                +${urls.length - 1}
            </button>`;
        }
        urlHtml += `</div>`;

        const price = (urls.length * 0.05).toFixed(2);

        let statusText = job.status;
        let badgeClass = 'bg-primary border-border-theme text-muted';

        if (job.status === 'calibrating') {
            statusText = 'PREVIEW';
            badgeClass = 'bg-amber-100/10 border-amber-500/50 text-amber-500';
        } else if (job.status === 'success') {
            badgeClass = 'bg-emerald-100/10 border-emerald-500/50 text-emerald-500';
        } else if (job.status === 'error') {
            badgeClass = 'bg-red-100/10 border-red-500/50 text-red-500';
        }

        tr.className = 'hover:bg-primary/50 transition';
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-main">${dateStr}</td>
            <td class="px-6 py-4">${urlHtml}</td>
            <td class="px-6 py-4 whitespace-nowrap text-muted">${job.target_webshop_id || 'Unknown'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-main font-medium font-mono">$${price}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 text-[11px] font-bold rounded-full border uppercase tracking-wider ${badgeClass}">
                    ${statusText}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
                <button class="text-accent hover:underline text-sm font-medium">Actions</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Modal kezelése az app.js-ben
const urlModal = document.getElementById('urlModal');
const urlModalList = document.getElementById('urlModalList');

document.getElementById('closeUrlModalBtnBottom')?.addEventListener('click', () => urlModal.classList.add('hidden'));
document.getElementById('closeUrlModalBtn')?.addEventListener('click', () => urlModal.classList.add('hidden'));
urlModal?.addEventListener('click', (e) => {
    if (e.target === urlModal) urlModal.classList.add('hidden');
});

document.getElementById('historyTableBody').addEventListener('click', (e) => {
    const btn = e.target.closest('.show-more-urls-btn');
    if (btn) {
        const urlsArray = JSON.parse(decodeURIComponent(btn.getAttribute('data-urls')));
        urlModalList.innerHTML = urlsArray.map(url => `
            <div class="p-3 bg-primary border border-border-theme rounded-lg text-sm text-accent truncate hover:bg-card transition" title="${url}">
                <a href="${url}" target="_blank" class="hover:underline">${url}</a>
            </div>
        `).join('');
        urlModal.classList.remove('hidden');
    }
});
