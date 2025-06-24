// @ts-nocheck
/* eslint-disable */
// Bu dosya JavaScript'tir, TypeScript de�ildir.
// Script Version 3.0 - Firebase puan kaydetme sistemi tamamland�

// Tam Ekran Modunu Ayarla
function initFullscreenMode() {
    // PWA tam ekran modunu etkinle�tir
    if ('serviceWorker' in navigator) {
        // PWA modunda �al���yor mu kontrol et
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                           window.navigator.standalone ||
                           document.referrer.includes('android-app://');
        
        if (isStandalone) {
            console.log('? PWA standalone modunda �al���yor');
            
            // Tam ekran i�in CSS s�n�flar� ekle
            document.body.classList.add('pwa-fullscreen');
            document.documentElement.classList.add('pwa-fullscreen');
            
            // Viewport meta tag g�ncelle
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
            }
            
            // Status bar rengi ayarla
            const themeColor = document.querySelector('meta[name="theme-color"]');
            if (themeColor) {
                themeColor.setAttribute('content', '#1e40af');
            }
        } else {
            console.log('?? PWA standalone modunda �al��m�yor - taray�c� modunda');
        }
    }
    
    // CSS ile tam ekran stillerini uygula
    const fullscreenStyles = `
        .pwa-fullscreen {
            height: 100vh !important;
            height: 100dvh !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        .pwa-fullscreen .container {
            height: 100vh !important;
            height: 100dvh !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow-y: auto !important;
        }
        
        /* Safe area i�in padding ekle */
        @supports (padding: max(0px)) {
            .pwa-fullscreen .container {
                padding-top: max(env(safe-area-inset-top), 0px) !important;
                padding-bottom: max(env(safe-area-inset-bottom), 0px) !important;
                padding-left: max(env(safe-area-inset-left), 0px) !important;
                padding-right: max(env(safe-area-inset-right), 0px) !important;
            }
        }
        
        /* Capacitor/Cordova i�in */
        .platform-cordova .pwa-fullscreen,
        .platform-capacitor .pwa-fullscreen {
            height: 100vh !important;
            overflow: hidden !important;
        }
    `;
    
    // Stilleri head'e ekle
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = fullscreenStyles;
    document.head.appendChild(styleSheet);
}

// Sayfa Y�kleme ��lemleri
document.addEventListener('DOMContentLoaded', () => {
    // Tam ekran modunu ba�lat
    initFullscreenMode();
    
    // Ana i�eri�i g�r�n�r yap
    const container = document.querySelector('.container');
    if (container) {
        container.style.visibility = 'visible';
        container.classList.add('fade-in');
    }
});

const quizApp = {
    // DOM Elements
    questionElement: document.getElementById('question'),
    optionsElement: document.getElementById('options'),
    resultElement: document.getElementById('result'),
    scoreElement: document.getElementById('score'),
    restartButton: document.getElementById('restart'),
    quizElement: document.getElementById('quiz'),
    containerElement: document.querySelector('.container'),
    categorySelectionElement: document.getElementById('category-selection'),
    categoriesElement: document.getElementById('categories'),
    nextButton: document.getElementById('next-question'),
    highScoresListElement: document.getElementById('high-scores-list'),
    timeLeftElement: document.getElementById('time-left'),
    badgesContainer: document.getElementById('badges'),
    themeToggle: document.getElementById('checkbox'),
    jokerFiftyBtn: null, // document.getElementById('joker-fifty'),
    jokerHintBtn: null, // document.getElementById('joker-hint'),
    jokerTimeBtn: null, // document.getElementById('joker-time'),
    jokerSkipBtn: null, // document.getElementById('joker-skip'),
    jokerStoreBtn: null, // document.getElementById('joker-store'),
    
    // State Variables
    currentQuestionIndex: 0,
    score: 0,
    totalScore: 0, // <-- EKLEND�: Toplam birikmi� puan
    sessionScore: 0, // <-- EKLEND�: Bu oturumdaki toplam puan
    userLevel: 1, // <-- EKLEND�: Kullan�c� seviyesi
    levelProgress: 0, // <-- EKLEND�: Seviye ilerlemesi (XP)
    correctAnswers: 0,
    selectedCategory: null,
    questions: [],
    allQuestionsData: {},
    questionsData: {}, 
    timerInterval: null,
    timeLeft: 0,
    answeredQuestions: 0,
    answerTimes: [],
    jokersUsed: {fifty: false, hint: false, time: false, skip: false},
    jokerInventory: {fifty: 0, hint: 0, time: 0, skip: 0},
    soundEnabled: true,
    lives: 5,
    currentLevel: 1,
    levelProgress: 0,
    skipJokerActive: false,
    currentSection: 1, // �u anki b�l�m numaras�
    totalSections: 50, // Toplam b�l�m say�s�
    sectionStats: [], // Her b�l�m i�in do�ru/yanl�� cevap istatistiklerini saklayacak dizi
    currentLanguage: 'tr', // Varsay�lan dil
    translatedQuestions: {}, // �evrilmi� sorular
    isLoggedIn: false, // <-- EKLEND�: Kullan�c� giri� durumu
    currentUser: null, // <-- EKLEND�: Mevcut kullan�c�
    userSettings: {}, // <-- EKLEND�: Kullan�c� ayarlar�
    totalScore: 0, // <-- EKLEND�: Toplam puan
    sessionScore: 0, // <-- EKLEND�: Oturum puan�
    userLevel: 1, // <-- EKLEND�: Kullan�c� seviyesi
    levelProgress: 0, // <-- EKLEND�: Seviye ilerlemesi
    totalStars: 0, // <-- EKLEND�: Toplam y�ld�z say�s�
    
    // Constants
    HIGH_SCORES_KEY: 'quizHighScores',
    MAX_HIGH_SCORES: 5,
    TIME_PER_QUESTION: 45,
    TIME_PER_BLANK_FILLING_QUESTION: 60,
    SEEN_QUESTIONS_KEY: 'quizSeenQuestions',
    QUESTIONS_PER_GAME: 'dynamic', // Art�k kategoriye g�re dinamik
    STATS_KEY: 'quizStats',
    USER_SETTINGS_KEY: 'quizSettings',
    JOKER_INVENTORY_KEY: 'quizJokerInventory',
    LANGUAGE_KEY: 'quizLanguage',
    
    // Ba�lang��
    init: function() {
        console.log("Quiz Uygulamas� Ba�lat�l�yor...");
        
        // �lk Firebase durumu kontrol�
        console.log('?? Firebase �lk Durum Kontrol�:');
        console.log('- Firebase nesnesi:', typeof firebase !== 'undefined' ? 'VAR' : 'YOK');
        console.log('- Firebase.auth:', firebase && firebase.auth ? 'VAR' : 'YOK');
        console.log('- Firebase.firestore:', firebase && firebase.firestore ? 'VAR' : 'YOK');
        
        // Taray�c� �zelliklerini kontrol et
        this.checkBrowserSupport();
        
        try {
            // �nce dil ayarlar�n� y�kle
            this.loadLanguageSettings();
            
            // Kullan�c� aray�z�n� haz�rla
            this.initUI();
            
            // �nce kullan�c� ayarlar�n� y�kle
            this.loadUserSettings();
            
            // Joker tab bar'� ba�lat
            this.initJokerTabBar();
            
            // Kullan�c�n�n quiz modunda olup olmad���n� kontrol et (sayfa yenilemesi senaryosu i�in)
            if (localStorage.getItem('quizModeActive') === 'true' && document.getElementById('quiz').style.display !== 'none') {
                this.activateQuizMode();
            }
            
            // localStorage'dan skor verilerini y�kle
            this.loadScoreFromLocalStorage();
            
            // Soru verilerini y�kle
            this.loadQuestionsData()
                .then(() => {
                    console.log("T�m veriler ba�ar�yla y�klendi.");
                    
                    // Soru verilerinin y�klenip y�klenmedi�ini kontrol et
                    if (!this.questionsData || Object.keys(this.questionsData).length === 0) {
                        console.error("Soru verileri y�klenemedi veya bo�!");
                        
                        // Tekrar y�klemeyi dene
                        this.loadQuestionsData()
                            .then(() => {
                                console.log("�kinci deneme: Soru verileri y�klendi");
                            })
                            .catch(err => {
                                console.error("�kinci deneme ba�ar�s�z:", err);
                                this.showAlert(this.getTranslation('questionLoadError'));
                            });
                    }
                    
                    // Sorular� �evir
                    this.translateQuestions();
                })
                .catch(error => {
                    console.error("Soru verileri y�klenirken hata olu�tu:", error);
                });
        } catch (error) {
            console.error("Ba�latma s�ras�nda kritik hata:", error);
        }
    },
    
    // Mevcut dil i�in metni getir
    getTranslation: function(key) {
        try {
            // Dil dosyas� import edilmi� mi kontrol et
            if (typeof languages === 'undefined') {
                console.warn('Dil dosyas� y�klenemedi. Varsay�lan metin g�steriliyor.');
                return this.getDefaultTranslation(key);
            }
            
            // Mevcut dil i�in �eviri var m�?
            if (languages[this.currentLanguage] && languages[this.currentLanguage][key] !== undefined) {
                return languages[this.currentLanguage][key];
            }
            
            // T�rk�e varsay�lan dil olarak kullan�l�r
            if (languages.tr && languages.tr[key] !== undefined) {
                return languages.tr[key];
            }
            
            // �eviri bulunamazsa, anahtar� d�nd�r
            console.warn(`'${key}' i�in �eviri bulunamad�.`);
            return key;
        } catch (error) {
            console.error('�eviri al�n�rken hata olu�tu:', error);
            return this.getDefaultTranslation(key);
        }
    },
    
    // Varsay�lan �evirileri d�nd�r
    getDefaultTranslation: function(key) {
        // S�k kullan�lan metinler i�in varsay�lan de�erler
        const defaults = {
            'appName': 'Quiz Game',
            'loading': 'Loading...',
            'restart': 'Restart',
            'next': 'Next',
            'score': 'Score',
            'correct': 'Correct!',
            'wrong': 'Wrong!',
            'timeUp': 'Time is up!',
            'correctAnswer': 'Correct answer',
            'questionImage': 'Question image',
            'true': 'TRUE',
            'false': 'FALSE'
        };
        
        return defaults[key] || key;
    },
    
    // Dil ayarlar�n� y�kle
    loadLanguageSettings: function() {
        try {
            // Local storage'dan tercihler ekran�nda se�ilen dili kontrol et
            const userLanguage = localStorage.getItem('user_language');
            
            if (userLanguage && ['tr', 'en', 'de'].includes(userLanguage)) {
                this.currentLanguage = userLanguage;
                console.log(`Kullan�c� tercih etti�i dil: ${this.currentLanguage}`);
                
                // HTML dil etiketini g�ncelle
                document.documentElement.setAttribute('lang', this.currentLanguage);
                document.documentElement.setAttribute('data-language', this.currentLanguage);
            } else {
                // Kaydedilmi� dil ayar� varsa y�kle
                const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY);
                if (savedLanguage && ['tr', 'en', 'de'].includes(savedLanguage)) {
                    this.currentLanguage = savedLanguage;
                    console.log(`Kaydedilmi� dil ayar�: ${this.currentLanguage}`);
                } else {
                    // Taray�c� dilini kontrol et
                    const browserLang = navigator.language || navigator.userLanguage;
                    if (browserLang) {
                        const lang = browserLang.substring(0, 2).toLowerCase();
                        
                        // Desteklenen diller
                        if (['tr', 'en', 'de'].includes(lang)) {
                            this.currentLanguage = lang;
                        } else {
                            // Desteklenmeyen dil durumunda varsay�lan olarak �ngilizce
                            this.currentLanguage = 'en';
                        }
                        
                        console.log(`Taray�c� dili: ${browserLang}, Uygulama dili: ${this.currentLanguage}`);
                    }
                }
            }
            
            // Dil de�i�tirme elementini olu�tur
            this.createLanguageSelector();
        } catch (e) {
            console.error("Dil ayarlar� y�klenirken hata:", e);
            this.currentLanguage = 'tr'; // Hata durumunda varsay�lan dil
        }
    },
    
    // Dil se�ici olu�tur
    createLanguageSelector: function() {
        // Men�de zaten bir dil se�ici oldu�u i�in sayfa �zerinde ekstra bir dil se�ici olu�turmuyoruz
        console.log("Men�de zaten dil se�im alan� bulundu�u i�in ek bir dil se�ici olu�turulmad�");
        return;
    },
    
    // Dili de�i�tir
    switchLanguage: function(language) {
        if (this.currentLanguage === language) return;
        
        console.log(`Dil de�i�tiriliyor: ${this.currentLanguage} -> ${language}`);
        
        // Dili kaydet
        this.currentLanguage = language;
        localStorage.setItem(this.LANGUAGE_KEY, language);
        localStorage.setItem('quizLanguage', language); // Eski referans i�in uyumluluk
        
        // HTML etiketinin dil �zelliklerini g�ncelle
        const htmlRoot = document.getElementById('html-root') || document.documentElement;
        htmlRoot.setAttribute('lang', language);
        htmlRoot.setAttribute('data-language', language);
        
        // Soru verilerini yeniden y�kle
        this.loadQuestionsData()
            .then(() => {
                console.log("Dil de�i�ikli�i sonras� yeni soru verileri y�klendi");
                
                // UI metinlerini g�ncelle
                this.updateUITexts();
                
                // Dil de�i�ikli�i olay�n� tetikle - bu, di�er mod�llerin �evirilerini g�ncellemesini sa�lar
                document.dispatchEvent(new Event('languageChanged'));
                
                // E�er aktif bir kategori varsa ve sorular g�steriliyorsa, sorular� g�ncelle
                if (this.selectedCategory && this.quizElement && this.quizElement.style.display !== 'none') {
                    // Kategorileri yeniden g�ster (mevcut dildeki kategorileri g�stermek i�in)
                    this.displayCategories();
                    
                    // Se�ili kategori ad�n� kontrol et ve mevcut dildeki kar��l���n� bul
                    const translatedCategoryName = this.getCurrentCategoryName(this.selectedCategory);
                    
                    if (this.questionsData[translatedCategoryName]) {
                        // Kategori mevcut dildeki sorularla g�ncellenir
                        this.selectedCategory = translatedCategoryName;
                        
                        // Sorular� g�ncelle
                        this.questions = this.shuffleArray([...this.questionsData[this.selectedCategory]]);
                        this.arrangeBlankFillingFirst();
                        
                        // Mevcut soruyu s�f�rla ve ilk soruyu g�ster
                        this.currentQuestionIndex = 0;
                        this.displayQuestion(this.questions[0]);
                    }
                }
                
                // Mevcut g�sterilen i�eri�i g�ncelle
                this.updateCurrentContent();
                
                // Dil de�i�ikli�ini kullan�c�ya bildir
                this.showToast(this.getTranslation('languageChanged'), 'toast-success');
                this.updateResultAndWarningTexts();
            })
            .catch(error => {
                console.error("Dil de�i�ikli�i sonras� soru verileri y�klenirken hata:", error);
                this.showToast("Sorular y�klenirken bir hata olu�tu", "toast-error");
            });
    },
    
    // Sorular� �evir
    translateQuestions: function() {
        if (!this.questionsData || Object.keys(this.questionsData).length === 0) {
            console.warn('�evrilecek soru verisi bulunamad�.');
            return;
        }
        
        if (this.currentLanguage === 'tr') {
            // T�rk�e i�in �eviriye gerek yok, orijinal sorular� kullan
            this.translatedQuestions = this.cloneObject(this.questionsData);
            // Mevcut sorular� g�ncelle
            this.updateCurrentQuestionsWithTranslations();
            return;
        }
        
        // �evrilmi� sorular zaten varsa ve ge�erli dilde ise tekrar �evirme
        if (this.hasTranslatedQuestions(this.currentLanguage)) {
            console.log(`${this.currentLanguage} dilinde �evrilmi� sorular zaten mevcut, tekrar �evirme i�lemi yap�lmayacak.`);
            
            // Mevcut sorular� g�ncelle
            this.updateCurrentQuestionsWithTranslations();
            return;
        }
        
        console.log(`Sorular ${this.currentLanguage} diline �evriliyor...`);
        
        // Bo� �eviri nesnesini olu�tur
        this.translatedQuestions = {};
        
        // Her kategori i�in
        Object.keys(this.questionsData).forEach(categoryTR => {
            // Kategori ad�n� �evir
            const translatedCategoryName = this.getTranslatedCategoryName(categoryTR, this.currentLanguage);
            this.translatedQuestions[translatedCategoryName] = [];
            
            // Kategorideki her soru i�in
            this.questionsData[categoryTR].forEach(questionObj => {
                // Soru nesnesinin kopyas�n� olu�tur
                const translatedQuestion = this.cloneObject(questionObj);
                
                // Translations �zelli�i varsa ve istenen dilde �eviri varsa kullan
                if (questionObj.translations && questionObj.translations[this.currentLanguage]) {
                    const translation = questionObj.translations[this.currentLanguage];
                    if (translation.question) translatedQuestion.question = translation.question;
                    if (translation.options) translatedQuestion.options = translation.options;
                    if (translation.correctAnswer) translatedQuestion.correctAnswer = translation.correctAnswer;
                } else {
                    // Soru metnini ve ��klar� �evir (otomatik �eviri yerine �zelle�tirilmi� metin)
                    if (this.currentLanguage === 'en') {
                        translatedQuestion.question = this.translateToEnglish(questionObj.question);
                        
                        if (Array.isArray(translatedQuestion.options)) {
                            translatedQuestion.options = translatedQuestion.options.map(option => 
                                this.translateToEnglish(option)
                            );
                        }
                        
                        if (translatedQuestion.correctAnswer) {
                            translatedQuestion.correctAnswer = this.translateToEnglish(questionObj.correctAnswer);
                        }
                        
                        // Do�ru/Yanl�� sorular� i�in
                        if (translatedQuestion.type === "Do�ruYanl��" || translatedQuestion.type === "TrueFalse") {
                            translatedQuestion.type = "TrueFalse";
                            
                            if (translatedQuestion.correctAnswer === "DO�RU" || translatedQuestion.correctAnswer === "YANLI�") {
                                translatedQuestion.correctAnswer = trueFalseMapping[translatedQuestion.correctAnswer].en;
                            }
                        }
                    } else if (this.currentLanguage === 'de') {
                        translatedQuestion.question = this.translateToGerman(questionObj.question);
                        
                        if (Array.isArray(translatedQuestion.options)) {
                            translatedQuestion.options = translatedQuestion.options.map(option => 
                                this.translateToGerman(option)
                            );
                        }
                        
                        if (translatedQuestion.correctAnswer) {
                            translatedQuestion.correctAnswer = this.translateToGerman(questionObj.correctAnswer);
                        }
                        
                        // Do�ru/Yanl�� sorular� i�in
                        if (translatedQuestion.type === "Do�ruYanl��" || translatedQuestion.type === "TrueFalse") {
                            translatedQuestion.type = "TrueFalse";
                            
                            if (translatedQuestion.correctAnswer === "DO�RU" || translatedQuestion.correctAnswer === "YANLI�") {
                                translatedQuestion.correctAnswer = trueFalseMapping[translatedQuestion.correctAnswer].de;
                            }
                        }
                    }
                }
                
                // Kategori ad�n� g�ncelle
                translatedQuestion.category = translatedCategoryName;
                
                // Bo�luk doldurma sorular� i�in
                if (translatedQuestion.type === "BlankFilling" && translatedQuestion.choices) {
                    // Harfleri �evir (�rne�in Almanca'da �, � gibi harfler i�in)
                    translatedQuestion.choices = this.translateChoices(questionObj.choices, this.currentLanguage);
                }
                
                // �evrilmi� soruyu kategoriye ekle
                this.translatedQuestions[translatedCategoryName].push(translatedQuestion);
            });
        });
        
        console.log(`Soru �evirisi tamamland�. ${Object.keys(this.translatedQuestions).length} kategori �evrildi.`);
        
        // Mevcut sorular� g�ncelle
        this.updateCurrentQuestionsWithTranslations();
    },
    
    // �evrilmi� sorular var m� kontrol et
    hasTranslatedQuestions: function(language) {
        // �evrilmi� sorular bo�sa veya dil T�rk�e ise kontrol etmeye gerek yok
        if (language === 'tr' || !this.translatedQuestions) {
            return false;
        }
        
        // �evrilmi� sorular�n i�inde en az bir kategori var m�?
        const hasCategories = Object.keys(this.translatedQuestions).length > 0;
        
        if (hasCategories) {
            // Rastgele bir kategori se�
            const sampleCategory = Object.keys(this.translatedQuestions)[0];
            
            // Bu kategoride soru var m�?
            const hasQuestions = this.translatedQuestions[sampleCategory] && 
                                this.translatedQuestions[sampleCategory].length > 0;
            
            if (hasQuestions) {
                // Rastgele bir soru se�
                const sampleQuestion = this.translatedQuestions[sampleCategory][0];
                
                // Bu soru �evrilmi� mi? (Kategori ad�n� kontrol et)
                // T�rk�e kategorinin �evrilmi� ad�n� bul
                const originalCategoryName = Object.keys(this.questionsData)[0]; // �lk T�rk�e kategori
                const expectedTranslatedName = this.getTranslatedCategoryName(originalCategoryName, language);
                
                // �evirinin do�ru dilde olup olmad���n� kontrol et
                return sampleCategory === expectedTranslatedName;
            }
        }
        
        return false;
    },
    
    // Mevcut sorular� �evirilerle g�ncelle
    updateCurrentQuestionsWithTranslations: function() {
        // E�er bir kategori se�ilmi�se ve sorular y�klenmi�se, mevcut sorular� da g�ncelle
        if (this.selectedCategory && this.questions.length > 0) {
            console.log(`Se�ili kategori: ${this.selectedCategory}`);
            
            // Mevcut sorular dil de�i�iminden sonra g�ncellenecek
            const translatedCategoryName = this.getCurrentCategoryName(this.selectedCategory);
            
            console.log(`Se�ili kategori: ${this.selectedCategory}, �evrilmi� ad�: ${translatedCategoryName}`);
            
            // �evrilmi� kategorideki sorular� al
            const translatedCategoryQuestions = this.currentLanguage === 'tr' ? 
                this.questionsData[translatedCategoryName] : 
                this.translatedQuestions[translatedCategoryName];
            
            if (translatedCategoryQuestions) {
                console.log(`${translatedCategoryName} kategorisinde ${translatedCategoryQuestions.length} �evrilmi� soru bulundu.`);
                
                // Sorular� g�ncelle
                this.questions = this.shuffleArray([...translatedCategoryQuestions]);
                this.arrangeBlankFillingFirst();
                
                // Mevcut soruyu g�ncelle
                if (this.currentQuestionIndex < this.questions.length) {
                    this.displayQuestion(this.questions[this.currentQuestionIndex]);
                }
            } else {
                console.warn(`${translatedCategoryName} kategorisinde �evrilmi� soru bulunamad�!`);
            }
        }
    },
    
    // Nesne kopyalama (deep clone)
    cloneObject: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // Kategori ad�n� �evir
    getTranslatedCategoryName: function(categoryTR, targetLang) {
        if (categoryMappings[categoryTR] && categoryMappings[categoryTR][targetLang]) {
            return categoryMappings[categoryTR][targetLang];
        }
        
        // E�le�me yoksa orijinal kategori ad�n� d�nd�r
        return categoryTR;
    },
    
    // UI elemanlar�n� g�ncelle
    updateUITexts: function() {
        // Ba�l�k
        document.title = this.getTranslation('appName');
        
        // Navbar ba�l���
        const navbarTitle = document.querySelector('.navbar-title');
        if (navbarTitle) navbarTitle.textContent = this.getTranslation('appName');
        const appTitle = document.querySelector('.app-title');
        if (appTitle) appTitle.textContent = this.getTranslation('appName');
        const mainTitle = document.querySelector('.main-title');
        if (mainTitle) mainTitle.textContent = this.getTranslation('appName');
        
        // Yan men� (sidebar) metinleri
        const sidebarHome = document.querySelector('.sidebar-home');
        if (sidebarHome) sidebarHome.textContent = this.getTranslation('home');
        const sidebarFriends = document.querySelector('.sidebar-friends');
        if (sidebarFriends) sidebarFriends.textContent = this.getTranslation('friends');
        const sidebarLeaderboard = document.querySelector('.sidebar-leaderboard');
        if (sidebarLeaderboard) sidebarLeaderboard.textContent = this.getTranslation('leaderboardMenu');
        
        // Ana men� ba�l���
        const menuTitle = document.querySelector('.menu-title');
        if (menuTitle) {
            menuTitle.textContent = this.getTranslation('quiz');
        }
        
        // Quiz ba�l��� (soru ekran� �st�)
        const quizHeader = document.querySelector('#quiz h2');
        if (quizHeader) {
            quizHeader.textContent = this.getTranslation('quiz');
        }
        
        // ��k�� butonu kald�r�ld�
        
        // Ana men� butonlar�
        const singlePlayerBtn = document.getElementById('single-player-btn');
        if (singlePlayerBtn) {
            singlePlayerBtn.textContent = this.getTranslation('singlePlayer');
        }
        const multiPlayerBtn = document.getElementById('online-game-button');
        if (multiPlayerBtn) {
            multiPlayerBtn.textContent = this.getTranslation('multiPlayer');
        }
        const leaderboardBtn = document.getElementById('view-global-leaderboard');
        if (leaderboardBtn) {
            leaderboardBtn.textContent = this.getTranslation('leaderboard');
        }
        const statsBtn = document.getElementById('show-stats');
        if (statsBtn) {
            statsBtn.textContent = this.getTranslation('statistics');
        }
        const settingsBtn = document.getElementById('show-settings');
        if (settingsBtn) {
            settingsBtn.textContent = this.getTranslation('settings');
        }
        const addQuestionBtn = document.getElementById('add-question-button');
        if (addQuestionBtn) {
            addQuestionBtn.textContent = this.getTranslation('addQuestion');
        }
        // Logout butonu kald�r�ld�
        
        // Kategori ba�l���
        const categoryTitle = document.querySelector('#category-selection h2 span');
        if (categoryTitle) {
            categoryTitle.textContent = this.getTranslation('categories');
        }
        
        // Puan etiketi
        if (this.scoreElement) {
            const scoreLabel = this.scoreElement.querySelector('.score-label');
            if (scoreLabel) {
                scoreLabel.textContent = this.getTranslation('score');
            }
        }
        
        // Sonraki soru butonu
        if (this.nextButton) {
            const nextBtnText = this.nextButton.querySelector('span');
            if (nextBtnText) {
                nextBtnText.textContent = this.getTranslation('next');
            } else {
                this.nextButton.textContent = this.getTranslation('next');
            }
        }
        
        // Yeniden ba�lat butonu
        if (this.restartButton) {
            this.restartButton.textContent = this.getTranslation('restart');
        }
        
        // Joker butonlar�
        this.updateJokerButtonsText();
        
        // Dil etiketi
        const langLabel = document.getElementById('language-label');
        if (langLabel) {
            langLabel.textContent = this.getTranslation('language') + ':';
        }
        
        // Hamburger men� ��eleri - Yeni ID'ler ile g�ncelleme
        const appTitleElement = document.getElementById('menu-app-title');
        if (appTitleElement) {
            appTitleElement.textContent = this.getTranslation('app');
        }
        
        const settingsTitleElement = document.getElementById('menu-settings-title');
        if (settingsTitleElement) {
            settingsTitleElement.textContent = this.getTranslation('settings');
        }
        
        // Men� ��eleri metinleri
        const homeText = document.getElementById('menu-home-text');
        if (homeText) {
            homeText.textContent = this.getTranslation('home');
        }
        
        const profileText = document.getElementById('menu-profile-text');
        if (profileText) {
            profileText.textContent = this.getTranslation('profile');
        }
        
        const friendsText = document.getElementById('menu-friends-text');
        if (friendsText) {
            friendsText.textContent = this.getTranslation('friends');
        }
        
        const leaderboardText = document.getElementById('menu-leaderboard-text');
        if (leaderboardText) {
            leaderboardText.textContent = this.getTranslation('leaderboardMenu');
        }
        
        // Ayarlar metinleri
        const languageText = document.getElementById('menu-language-text');
        if (languageText) {
            languageText.textContent = this.getTranslation('language');
        }
        
        const difficultyText = document.getElementById('menu-difficulty-text');
        if (difficultyText) {
            difficultyText.textContent = this.getTranslation('difficulty');
        }
        
        const soundText = document.getElementById('menu-sound-text');
        if (soundText) {
            soundText.textContent = this.getTranslation('sound');
        }
        
        const themeText = document.getElementById('menu-theme-text');
        if (themeText) {
            themeText.textContent = this.getTranslation('darkTheme');
        }
        
        const logoutText = document.getElementById('menu-logout-text');
        if (logoutText) {
            logoutText.textContent = this.getTranslation('logout');
        }
        
        // Zorluk seviyeleri
        const difficultySelect = document.getElementById('difficulty-level');
        if (difficultySelect) {
            const options = difficultySelect.options;
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                if (option.value === 'easy') {
                    option.textContent = this.getTranslation('easy');
                } else if (option.value === 'medium') {
                    option.textContent = this.getTranslation('medium');
                } else if (option.value === 'hard') {
                    option.textContent = this.getTranslation('hard');
                }
            }
        }
        
        // data-i18n �zniteli�i olan t�m elemanlar� g�ncelle
        const i18nElements = document.querySelectorAll('[data-i18n]');
        i18nElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key && languages[this.currentLanguage] && languages[this.currentLanguage][key]) {
                element.textContent = languages[this.currentLanguage][key];
            }
        });
        

    },
    
    // Joker butonlar� metinlerini g�ncelle
    updateJokerButtonsText: function() {
        if (this.jokerFiftyBtn && !this.jokersUsed.fifty) {
            this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i>`;
        } else if (this.jokerFiftyBtn && this.jokersUsed.fifty) {
            this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i>`;
        }
        
        if (this.jokerHintBtn && !this.jokersUsed.hint) {
            this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i>`;
        } else if (this.jokerHintBtn && this.jokersUsed.hint) {
            this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i>`;
        }
        
        if (this.jokerTimeBtn && !this.jokersUsed.time) {
            this.jokerTimeBtn.innerHTML = `<i class="fas fa-clock"></i>`;
        } else if (this.jokerTimeBtn && this.jokersUsed.time) {
            this.jokerTimeBtn.innerHTML = `<i class="fas fa-clock"></i>`;
        }
        
        if (this.jokerSkipBtn && !this.jokersUsed.skip) {
            this.jokerSkipBtn.innerHTML = `<i class="fas fa-forward"></i>`;
        } else if (this.jokerSkipBtn && this.jokersUsed.skip) {
            this.jokerSkipBtn.innerHTML = `<i class="fas fa-forward"></i>`;
        }
        
        if (this.jokerStoreBtn) {
            this.jokerStoreBtn.innerHTML = `<i class="fas fa-store"></i>`;
        }
        
        // Mobil joker tab bar'� da g�ncelle
        this.updateJokerTabBar();
        
        console.log('updateJokerButtons tamamland�');
    },
    
    // Mobil joker tab bar'�n� g�ncelle
    updateJokerTabBar: function() {
        const currentQuestion = this.questions[this.currentQuestionIndex] || {};
        const isTrueFalse = currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse";
        const isBlankFilling = currentQuestion.type === "BlankFilling";
        
        // 50:50 joker tab
        const jokerTabFifty = document.getElementById('joker-tab-fifty');
        if (jokerTabFifty) {
            const fiftyCount = this.jokerInventory.fifty || 0;
            const used = this.jokersUsed.fifty;
            const disabled = (fiftyCount <= 0) || used || isTrueFalse || isBlankFilling;
            jokerTabFifty.style.opacity = disabled ? '0.3' : '1';
            jokerTabFifty.style.filter = disabled ? 'grayscale(100%)' : 'none';
        }
        
        // �pucu joker tab
        const jokerTabHint = document.getElementById('joker-tab-hint');
        if (jokerTabHint) {
            const hintCount = this.jokerInventory.hint || 0;
            const used = this.jokersUsed.hint;
            const disabled = (hintCount <= 0) || used || isBlankFilling;
            jokerTabHint.style.opacity = disabled ? '0.3' : '1';
            jokerTabHint.style.filter = disabled ? 'grayscale(100%)' : 'none';
        }
        
        // S�re joker tab
        const jokerTabTime = document.getElementById('joker-tab-time');
        if (jokerTabTime) {
            const timeCount = this.jokerInventory.time || 0;
            const used = this.jokersUsed.time;
            const disabled = (timeCount <= 0) || used;
            jokerTabTime.style.opacity = disabled ? '0.3' : '1';
            jokerTabTime.style.filter = disabled ? 'grayscale(100%)' : 'none';
        }
        
        // Pas joker tab
        const jokerTabSkip = document.getElementById('joker-tab-skip');
        if (jokerTabSkip) {
            const skipCount = this.jokerInventory.skip || 0;
            const used = this.jokersUsed.skip;
            const disabled = (skipCount <= 0) || used;
            jokerTabSkip.style.opacity = disabled ? '0.3' : '1';
            jokerTabSkip.style.filter = disabled ? 'grayscale(100%)' : 'none';
        }
        
        // Ma�aza tab her zaman aktif
        const jokerTabStore = document.getElementById('joker-tab-store');
        if (jokerTabStore) {
            jokerTabStore.style.opacity = '1';
            jokerTabStore.style.filter = 'none';
        }
    },
    
    // Mevcut i�eri�i g�ncelle
    updateCurrentContent: function() {
        // Ana men� butonlar� ve di�er UI elemanlar�n� g�ncelle
        this.updateUITexts();
        
        // Hangi sayfa g�r�n�rse onu g�ncelle
        if (this.categorySelectionElement && this.categorySelectionElement.style.display !== 'none') {
            // Kategori se�im ekran� g�r�n�yorsa
            this.displayCategories();
        } else if (this.quizElement && this.quizElement.style.display !== 'none' && this.questions.length > 0) {
            // Quiz ekran� g�r�n�yorsa
            if (this.resultElement && this.resultElement.style.display !== 'none') {
                // Sonu� g�steriliyorsa sonu� metnini g�ncelle
                const correctAnswer = this.questions[this.currentQuestionIndex].correctAnswer;
                if (this.resultElement.classList.contains('correct')) {
                    this.resultElement.innerHTML = `
                        <div class="correct-answer-container">
                            <div class="correct-icon"><i class="fas fa-badge-check"></i></div>
                            <div class="correct-text">${this.getTranslation('correct')}</div>
                            <div class="correct-animation">
                                <span>+</span>
                                <span>${Math.max(1, Math.ceil(this.timeLeft / (this.questions[this.currentQuestionIndex].type === "BlankFilling" ? 5 : 3)))}</span>
                            </div>
                        </div>
                        <button id="next-question" class="next-button">${this.getTranslation('next')}</button>
                    `;
                } else if (this.resultElement.classList.contains('wrong')) {
                    this.resultElement.innerHTML = `${this.getTranslation('timeUp')} ${this.getTranslation('correctAnswer')}: <strong>${correctAnswer}</strong>
                        <button id="next-question" class="next-button">${this.getTranslation('next')}</button>`;
                }
            } else {
                // Aktif soru varsa yeniden y�kle
                this.displayQuestion(this.questions[this.currentQuestionIndex]);
            }
        }
        this.updateResultAndWarningTexts();
    },
    
    // Basit �eviri fonksiyonlar� (ger�ek bir projede daha profesyonel bir ��z�m kullan�lmal�d�r)
    translateToEnglish: function(text) {
        // Bo� metin kontrol�
        if (!text) return '';
        
        // Bu sadece basit bir �rnektir - ger�ek projede buraya �zelle�tirilmi� �eviri eklenebilir
        // Not: Ger�ek bir uygulamada burada �nceden haz�rlanm�� �eviriler veya API kullan�labilir
        return text; // �u an i�in orijinal metni koruyoruz
    },
    
    translateToGerman: function(text) {
        // Bo� metin kontrol�
        if (!text) return '';
        
        // Almanca �eviri - bu basit bir �rnek
        return text; // �u an i�in orijinal metni koruyoruz
    },
    
    // Bo�luk doldurma i�in harfleri �evir
    translateChoices: function(choices, targetLang) {
        if (!choices) return [];
        
        // Bu fonksiyon �zellikle Almanca gibi dillerde �, �, � gibi harfler i�in kullan�labilir
        // �u an i�in orijinal harfleri koruyoruz
        return choices;
    },
    
    // Mevcut dil i�in ge�erli kategori ad�n� al
    getCurrentCategoryName: function(originalCategory) {
        if (this.currentLanguage === 'tr') return originalCategory;
        
        // T�rk�e kategori ad� m� kontrol et
        if (categoryMappings[originalCategory] && categoryMappings[originalCategory][this.currentLanguage]) {
            return categoryMappings[originalCategory][this.currentLanguage];
        }
        
        // Bu kategori ad� zaten �evrilmi� bir isim mi kontrol et
        if (reverseCategoryMappings[originalCategory] && 
            reverseCategoryMappings[originalCategory]['tr']) {
            return originalCategory; // Zaten �evrilmi� durumda, aynen d�nd�r
        }
        
        // Burada e�er kategori �evrilmi� bir isimse, mevcut dilde do�ru versiyonunu bul
        for (const [sourceCat, translations] of Object.entries(reverseCategoryMappings)) {
            // E�er bu bir yabanc� kategori ad�ysa ve bizim istedi�imiz dilde bir kar��l��� varsa
            if (sourceCat === originalCategory && translations[this.currentLanguage]) {
                return translations[this.currentLanguage];
            }
        }
        
        // Hi�bir e�le�me bulunamazsa orijinal kategori ad�n� d�nd�r
        return originalCategory;
    },
    
    // Toast mesaj� g�ster
    showToast: function(message, type = 'toast-info') {
        // Toast container'� kontrol et veya olu�tur
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Yeni toast olu�tur
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // �kon ekle
        let icon = '<i class="fas fa-info-circle"></i>';
        if (type === 'toast-success') icon = '<i class="fas fa-check-circle"></i>';
        if (type === 'toast-warning') icon = '<i class="fas fa-exclamation-triangle"></i>';
        if (type === 'toast-error') icon = '<i class="fas fa-times-circle"></i>';
        
        // Toast i�eri�i
        toast.innerHTML = `
            <div class="toast-content">
                ${icon}
                <span>${message}</span>
            </div>
        `;
        
        // Toast'u ekle
        toastContainer.appendChild(toast);
        
        // �pucu jokeri ve s�re jokeri i�in farkl� konumland�rma
        // Toast'� joker butonlar�n�n hemen �zerinde g�ster
        if (message.includes("�pucu jokeri kullan�ld�") || message.includes("S�re jokeri kullan�ld�")) {
            toast.style.position = "fixed";
            toast.style.bottom = "180px"; // Joker butonlar�n�n �zerinde
            toast.style.left = "50%";
            toast.style.transform = "translateX(-50%)";
            toast.style.zIndex = "10002"; // Joker butonlar�ndan daha y�ksek
        }
        
        // Toast'u g�ster
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Toast'u belirli bir s�re sonra kald�r
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    },
    
    // Taray�c� deste�ini kontrol et
    checkBrowserSupport: function() {
        console.log("Taray�c� �zellikleri kontrol ediliyor...");
        
        // localStorage deste�i
        let hasLocalStorage = false;
        try {
            hasLocalStorage = 'localStorage' in window && window.localStorage !== null;
            if (hasLocalStorage) {
                // Test et
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                console.log("localStorage destekleniyor");
                    } else {
                console.warn("localStorage desteklenmiyor");
            }
        } catch (e) {
            console.error("localStorage eri�ilemez:", e);
            hasLocalStorage = false;
        }
        
        // Fetch API deste�i
        const hasFetch = 'fetch' in window;
        console.log("Fetch API deste�i:", hasFetch);
        
        // Firebase SDK varl���
        const hasFirebase = typeof firebase !== 'undefined' && firebase.app;
        console.log("Firebase SDK durumu:", hasFirebase ? "Y�kl�" : "Y�kl� de�il");
        
        // JSON i�leme deste�i
        const hasJSON = typeof JSON !== 'undefined' && typeof JSON.parse === 'function';
        console.log("JSON deste�i:", hasJSON);
        
        // Eksik �zellikler varsa kullan�c�y� bilgilendir
        if (!hasLocalStorage || !hasFetch || !hasJSON) {
            console.warn("Baz� taray�c� �zellikleri eksik, uygulama s�n�rl� �al��abilir");
            // Uyar� mesaj� g�ster
            const warningDiv = document.createElement('div');
            warningDiv.className = 'browser-warning';
            warningDiv.innerHTML = `
                <div class="warning-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${this.getTranslation('browserWarning')}</p>
                    <button class="close-warning">${this.getTranslation('understood')}</button>
                </div>
            `;
            document.body.appendChild(warningDiv);
            
            // Kapat butonuna t�klama olay�
            const closeBtn = warningDiv.querySelector('.close-warning');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    warningDiv.remove();
                });
            }
        }
        
        return {
            localStorage: hasLocalStorage,
            fetch: hasFetch,
            firebase: hasFirebase,
            json: hasJSON
        };
    },
    
    // Joker envanterini y�kle
    loadJokerInventory: function() {
        console.log('Joker envanteri y�kleniyor...');
        console.log('localStorage anahtar�:', this.JOKER_INVENTORY_KEY);
        
        var inventoryJSON = localStorage.getItem(this.JOKER_INVENTORY_KEY);
        console.log('localStorage\'dan al�nan veri:', inventoryJSON);
        
        if (inventoryJSON && inventoryJSON !== 'null' && inventoryJSON !== 'undefined') {
            try {
                const parsed = JSON.parse(inventoryJSON);
                
                // Ge�erli bir obje ve t�m joker t�rleri var m� kontrol et
                if (parsed && typeof parsed === 'object' && 
                    parsed.hasOwnProperty('fifty') && 
                    parsed.hasOwnProperty('hint') && 
                    parsed.hasOwnProperty('time') && 
                    parsed.hasOwnProperty('skip')) {
                    
                    this.jokerInventory = parsed;
                    console.log("Joker envanteri ba�ar�yla y�klendi:", this.jokerInventory);
                } else {
                    console.warn("Ge�ersiz joker envanteri format�, varsay�lan envanter atan�yor");
                    this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
                    this.saveJokerInventory();
                }
            } catch (e) {
                console.error("Joker envanteri y�klenirken hata olu�tu:", e);
                this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
                this.saveJokerInventory();
                console.log("Varsay�lan envanter atand�:", this.jokerInventory);
            }
        } else {
            // �lk kez �al��t�r�l�yorsa veya ge�ersiz veri varsa her joker t�r�nden birer tane ver
            console.log("�lk kez �al��t�r�l�yor veya ge�ersiz veri, varsay�lan envanter olu�turuluyor...");
            this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
            this.saveJokerInventory();
        }
        
        // Negatif de�erleri �nle
        Object.keys(this.jokerInventory).forEach(key => {
            if (this.jokerInventory[key] < 0) {
                this.jokerInventory[key] = 0;
            }
        });
        
        // Final kontrol
        console.log('loadJokerInventory tamamland�, final envanter:', this.jokerInventory);
    },
    
    // Joker envanterini kaydet
    saveJokerInventory: function() {
        try {
            localStorage.setItem(this.JOKER_INVENTORY_KEY, JSON.stringify(this.jokerInventory));
            console.log("Joker envanteri kaydedildi:", this.jokerInventory);
            
            // Kaydetmenin ba�ar�l� olup olmad���n� kontrol et
            var saved = localStorage.getItem(this.JOKER_INVENTORY_KEY);
            if (saved) {
                var parsedSaved = JSON.parse(saved);
                console.log("Kaydedilen veri do�ruland�:", parsedSaved);
            } else {
                console.error("Joker envanteri kaydedilemedi!");
            }
        } catch (e) {
            console.error("Joker envanteri kaydedilirken hata olu�tu:", e);
        }
    },
    
    // Joker butonlar�na olay dinleyicileri ekle
    addJokerEventListeners: function() {
        console.log('addJokerEventListeners �a�r�ld�...');
        
        // Elementleri dinamik olarak al
        this.jokerFiftyBtn = document.getElementById('joker-fifty');
        this.jokerHintBtn = document.getElementById('joker-hint');
        this.jokerTimeBtn = document.getElementById('joker-time');
        this.jokerSkipBtn = document.getElementById('joker-skip');
        this.jokerStoreBtn = document.getElementById('joker-store');
        
        console.log('jokerFiftyBtn:', this.jokerFiftyBtn);
        console.log('jokerHintBtn:', this.jokerHintBtn);
        console.log('jokerTimeBtn:', this.jokerTimeBtn);
        console.log('jokerSkipBtn:', this.jokerSkipBtn);
        console.log('jokerStoreBtn:', this.jokerStoreBtn);
        
        // Mobil debug i�in
        console.log('Mobile device check:', /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        console.log('Touch events supported:', 'ontouchstart' in window);
        
        // Joker store modal element kontrol�
        const jokerStoreModal = document.getElementById('joker-store-modal');
        console.log('Joker store modal element:', jokerStoreModal);
        
        // 50:50 jokeri
        if (this.jokerFiftyBtn) {
            this.jokerFiftyBtn.addEventListener('click', () => {
                if (this.jokerFiftyBtn.disabled) return;
                
                console.log('50:50 joker kullan�l�yor...');
                
                // Mevcut sorunun do�ru cevab�n� al
                const currentQuestion = this.questions[this.currentQuestionIndex];
                const correctAnswer = currentQuestion.correctAnswer;
                
                // BlankFilling sorular�nda 50:50 joker kullan�lamaz
                if (currentQuestion.type === "BlankFilling") {
                    console.warn('BlankFilling sorular�nda 50:50 joker kullan�lamaz');
                    this.showToast("Bo�luk doldurma sorular�nda 50:50 joker kullan�lamaz!", "toast-warning");
                    return;
                }
                
                // Do�ruYanl�� sorular�nda da 50:50 joker kullan�lamaz
                if (currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse") {
                    console.warn('Do�ru/Yanl�� sorular�nda 50:50 joker kullan�lamaz');
                    this.showToast("Do�ru/Yanl�� sorular�nda 50:50 joker kullan�lamaz!", "toast-warning");
                    return;
                }
                
                console.log('Do�ru cevap:', correctAnswer);
                
                // Sadece aktif quiz container'daki se�enekleri al
                const optionsContainer = document.getElementById('options');
                const options = optionsContainer ? optionsContainer.querySelectorAll('.option') : document.querySelectorAll('#options .option');
                console.log('Bulunan se�enekler:', options.length);
                console.log('Options container:', optionsContainer);
                
                if (options.length < 3) {
                    console.warn('Yeterli se�enek yok, 50:50 joker kullan�lamaz');
                    this.showToast("Bu soru tipinde 50:50 joker kullan�lamaz!", "toast-warning");
                    return;
                }
                
                // Yanl�� ��klar� bul - case insensitive kar��la�t�rma
                const wrongOptions = Array.from(options).filter((option, index) => {
                    const optionText = option.textContent.trim();
                    const isCorrect = optionText.toLowerCase() === correctAnswer.toLowerCase();
                    console.log(`Se�enek ${index + 1}: "${optionText}" | Do�ru cevap: "${correctAnswer}" | E�it mi: ${isCorrect}`);
                    return !isCorrect;
                });
                
                console.log('Toplam se�enek say�s�:', options.length);
                console.log('Yanl�� se�enek say�s�:', wrongOptions.length);
                console.log('Do�ru se�enek say�s�:', options.length - wrongOptions.length);
                
                if (wrongOptions.length < 2) {
                    console.warn('Yeterli yanl�� se�enek yok');
                    this.showToast("Bu soruda yeterli yanl�� se�enek yok!", "toast-warning");
                    return;
                }
                
                // �ki yanl�� ��kk� rastgele se�
                const shuffledWrong = this.shuffleArray([...wrongOptions]);
                const toHide = shuffledWrong.slice(0, 2);
                
                console.log('S�nd�r�lecek se�enekler:', toHide.length);
                
                // Se�ili ��klar� s�nd�r
                toHide.forEach(option => {
                    option.style.opacity = '0.3';
                    option.style.pointerEvents = 'none';
                    option.style.background = 'linear-gradient(135deg, #ddd, #ccc)';
                    option.style.color = '#666';
                    option.style.textDecoration = 'line-through';
                    option.style.filter = 'blur(1px)';
                    option.style.border = '2px solid #f0f0f0';
                    option.style.transform = 'scale(0.95)';
                    option.style.transition = 'all 0.3s ease';
                    option.classList.add('disabled-option');
                    
                    // X i�areti ekle
                    const xMark = document.createElement('div');
                    xMark.innerHTML = '?';
                    xMark.style.cssText = `
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        font-size: 20px;
                        z-index: 10;
                        animation: bounceIn 0.5s ease;
                    `;
                    option.style.position = 'relative';
                    option.appendChild(xMark);
                });
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('fifty');
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const fiftySound = document.getElementById('sound-correct');
                    if (fiftySound) fiftySound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Toast bildirimi g�ster
                this.showToast("50:50 jokeri kullan�ld�! �ki yanl�� ��k s�nd�r�ld�.", "toast-success");
            });
        }
        
        // �pucu jokeri
        if (this.jokerHintBtn) {
            this.jokerHintBtn.addEventListener('click', () => {
                if (this.jokerHintBtn.disabled) return;
                
                console.log('�pucu joker kullan�l�yor...');
                
                // Mevcut soru i�in bir ipucu g�ster
                const currentQuestion = this.questions[this.currentQuestionIndex];
                let hint = '';
                
                // �pucu olu�tur - farkl� soru tiplerine g�re
                if (currentQuestion.category === "Bo�luk Doldurma" || currentQuestion.type === "BlankFilling") {
                    hint = "�pucu: Cevab�n ilk harfi \"" + currentQuestion.correctAnswer.charAt(0) + "\" ";
                    if (currentQuestion.correctAnswer.length > 3) {
                        hint += "ve son harfi \"" + currentQuestion.correctAnswer.charAt(currentQuestion.correctAnswer.length - 1) + "\"";
                    }
                } else if (currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse") {
                    // Do�ru/Yanl�� sorular i�in �zel ipucu
                    const correctAnswer = currentQuestion.correctAnswer.toLowerCase();
                    if (correctAnswer === 'do�ru' || correctAnswer === 'true' || correctAnswer === 'evet') {
                        hint = "�pucu: Bu ifade do�ru bir bilgidir.";
                    } else {
                        hint = "�pucu: Bu ifadede bir yanl��l�k vard�r.";
                    }
                } else {
                    const correctAnswer = currentQuestion.correctAnswer;
                    // Cevab�n ilk ve varsa son harfini ipucu olarak ver
                    hint = "�pucu: Do�ru cevab�n ilk harfi \"" + correctAnswer.charAt(0) + "\" ";
                    if (correctAnswer.length > 3) {
                        hint += "ve son harfi \"" + correctAnswer.charAt(correctAnswer.length - 1) + "\"";
                    }
                }
                
                console.log('Olu�turulan ipucu:', hint);
                
                // �pucunu g�ster
                const hintElement = document.createElement('div');
                hintElement.className = 'hint-message';
                hintElement.innerHTML = '<i class="fas fa-lightbulb"></i> ' + hint;
                hintElement.style.cssText = `
                    background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
                    color: #2d3436;
                    padding: 15px 20px;
                    margin: 15px 0;
                    border-radius: 10px;
                    border-left: 4px solid #e17055;
                    box-shadow: 0 4px 15px rgba(253, 203, 110, 0.3);
                    animation: fadeInUp 0.5s ease;
                    font-weight: 600;
                    text-align: center;
                `;
                
                // �pucu mesaj�n� ekleme
                const questionElement = document.getElementById('question');
                if (questionElement && questionElement.parentNode) {
                    // Eski ipucu mesaj�n� kald�r
                    const oldHint = document.querySelector('.hint-message');
                    if (oldHint) oldHint.remove();
                    
                    // Yeni ipucunu ekle
                    questionElement.parentNode.insertBefore(hintElement, questionElement.nextSibling);
                    console.log('�pucu mesaj� DOM\'a eklendi');
                }
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('hint');
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const hintSound = document.getElementById('sound-correct');
                    if (hintSound) hintSound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Toast bildirimi g�ster
                this.showToast("�pucu jokeri kullan�ld�! " + hint, "toast-success");
            });
        }
        
        // +S�re jokeri
        if (this.jokerTimeBtn) {
            this.jokerTimeBtn.addEventListener('click', () => {
                if (this.jokerTimeBtn.disabled) return;
                
                console.log('S�re joker kullan�l�yor...');
                console.log('Kullan�m �ncesi s�re:', this.timeLeft);
                
                // Mevcut sorunun s�resini 15 saniye uzat
                this.timeLeft += 15;
                
                console.log('Kullan�m sonras� s�re:', this.timeLeft);
                
                // S�re g�stergesini g�ncelle
                this.updateTimeDisplay();
                
                // Zaman�n azald���n� belirten s�n�f� kald�r
                if (this.timeLeftElement && this.timeLeftElement.classList.contains('time-low')) {
                    this.timeLeftElement.classList.remove('time-low');
                }
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('time');
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const timeSound = document.getElementById('sound-correct');
                    if (timeSound) timeSound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Toast bildirimi g�ster
                this.showToast("S�re jokeri kullan�ld�! 15 saniye eklendi. Yeni s�re: " + this.timeLeft + " saniye", "toast-success");
            });
        }
        
        // Pas jokeri
        if (this.jokerSkipBtn) {
            this.jokerSkipBtn.addEventListener('click', () => {
                if (this.jokerSkipBtn.disabled) return;
                
                console.log('Pas joker kullan�l�yor...');
                console.log('Pas joker kullan�m �ncesi envanter:', JSON.stringify(this.jokerInventory));
                
                // Joker envanterini kontrol et
                if (this.jokerInventory.skip <= 0) {
                    console.warn('Pas joker envanteri bo�!');
                    this.showToast("Pas jokeriniz kalmad�!", "toast-warning");
                    return;
                }
                
                // S�reyi s�f�rlamak yerine do�rudan sonraki soruya ge�i� yapal�m
                clearInterval(this.timerInterval);
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const skipSound = document.getElementById('sound-correct');
                    if (skipSound) skipSound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('skip');
                
                // Toast bildirimi g�ster
                this.showToast("Pas jokeri kullan�ld�! Sonraki soruya ge�iliyor.", "toast-success");
                
                console.log('Pas joker kullan�m sonras� envanter:', JSON.stringify(this.jokerInventory));
                
                // Bir sonraki soruya ge�
                setTimeout(() => {
                    this.showNextQuestion();
                }, 800);
            });
        }
        
        // Joker ma�azas� butonu
        if (this.jokerStoreBtn) {
            // Click event (desktop)
            this.jokerStoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openJokerStore();
            });
            
            // Touch event (mobile)
            this.jokerStoreBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            
            this.jokerStoreBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openJokerStore();
            });
            
            // Mobil cihazlarda butonun t�klanabilir oldu�unu garanti et
            this.jokerStoreBtn.style.cursor = 'pointer';
            this.jokerStoreBtn.style.touchAction = 'manipulation';
        }
    },
    
    // Joker ma�azas�n� a�
    openJokerStore: function() {
        console.log('?? Joker ma�azas� a��l�yor...');
        console.log('?? User Agent:', navigator.userAgent);
        console.log('?? Mevcut joker envanteri:', JSON.stringify(this.jokerInventory));
        console.log('?? Mevcut puan:', this.score);
        
        var modal = document.getElementById('joker-store-modal');
        var closeBtn = modal.querySelector('.close-modal');
        var buyButtons = modal.querySelectorAll('.joker-buy-btn');
        var pointsDisplay = document.getElementById('joker-store-points-display');
        
        // Mevcut toplam puanlar� ve joker envanterini g�ster (misafir i�in sessionScore kullan)
        const currentPoints = this.isLoggedIn ? this.totalScore : this.sessionScore;
        pointsDisplay.textContent = currentPoints || 0;
        console.log('?? Joker ma�azas� - G�sterilen puan: ' + currentPoints + ' (Giri� durumu: ' + (this.isLoggedIn ? 'Kay�tl�' : 'Misafir') + ')');
        console.log('?? Detay - totalScore: ' + this.totalScore + ', sessionScore: ' + this.sessionScore);
        
        // Oyun ekran�ndaki joker butonlar�n� da g�ncelle
        this.updateJokerButtons();
        
        // Joker miktarlar�n� g�ncelle
        this.updateJokerStoreDisplay(modal);
        
        // Sat�n alma butonlar�n� etkinle�tir
        buyButtons.forEach(function(btn) {
            var item = btn.closest('.joker-store-item');
            var jokerType = item.dataset.joker;
            var price = parseInt(item.dataset.price);
            
            // Yeterli puan varsa butonu etkinle�tir (misafir i�in sessionScore kullan)
            const availablePoints = this.isLoggedIn ? this.totalScore : this.sessionScore;
            btn.disabled = availablePoints < price;
            
            // Sat�n alma fonksiyonu
            var self = this;
            const purchaseJoker = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const availablePoints = self.isLoggedIn ? self.totalScore : self.sessionScore;
                console.log('Joker sat�n alma denemesi: ' + jokerType + ', Fiyat: ' + price + ', Mevcut Puan: ' + availablePoints + ' (' + (self.isLoggedIn ? 'totalScore' : 'sessionScore') + ')');
                console.log('Sat�n alma �ncesi envanter:', JSON.stringify(self.jokerInventory));
                
                if (availablePoints >= price) {
                    // Puan� azalt (misafir i�in sessionScore, kay�tl� i�in totalScore)
                    if (self.isLoggedIn) {
                        self.totalScore -= price;
                    } else {
                        self.sessionScore -= price;
                    }
                    
                    // PUANI FIREBASE'E KAYDET
                    if (self.isLoggedIn) {
                        self.delayedSaveUserData(); // Firebase'e geciktirilmi� kaydet
                        console.log(`Joker sat�n alma: ${price} puan harcand�. Yeni toplam: ${self.totalScore}`);
                    }
                    
                    // Jokeri envantere ekle
                    var previousCount = self.jokerInventory[jokerType] || 0;
                    self.jokerInventory[jokerType]++;
                    
                    console.log(`${jokerType} joker say�s�: ${previousCount} -> ${self.jokerInventory[jokerType]}`);
                    
                    // Joker envanterini kaydet
                    self.saveJokerInventory();
                    
                    // G�stergeleri g�ncelle (misafir i�in sessionScore kullan)
                    const updatedPoints = self.isLoggedIn ? self.totalScore : self.sessionScore;
                    pointsDisplay.textContent = updatedPoints;
                    
                    // Joker ma�azas�ndaki say�mlar� ve buton durumlar�n� g�ncelle
                    self.updateJokerStoreDisplay(modal);
                    
                    // OYUN EKRANINDAK� JOKER BUTONLARINI DA G�NCELLE
                    self.updateJokerButtons();
                    
                    // MOB�L JOKER TAB BAR'I DA G�NCELLE
                    self.updateJokerTabBar();
                    
                    // Skor g�sterimini g�ncelle
                    self.updateScoreDisplay();
                    
                    // Toast bildirimi g�ster
                    var jokerName = jokerType === 'fifty' ? '50:50' : 
                        jokerType === 'hint' ? '�pucu' : 
                        jokerType === 'time' ? 'S�re' : 'Pas';
                    self.showToast(jokerName + ' jokeri sat�n al�nd�!', "toast-success");
                    
                    // Joker butonlar�n� g�ncelle
                    self.updateJokerButtons();
                    
                    console.log('Sat�n alma sonras� envanter:', JSON.stringify(self.jokerInventory));
                } else {
                    console.warn('Yeterli puan yok!');
                    self.showToast("Yeterli puan�n�z yok!", "toast-error");
                }
            };
            
            // Hem click hem de touch event'lerini ekle
            btn.onclick = purchaseJoker;
            btn.addEventListener('touchend', purchaseJoker);
            
            // Mobil cihazlar i�in ek optimizasyonlar
            btn.style.touchAction = 'manipulation';
            btn.style.webkitTapHighlightColor = 'transparent';
        }.bind(this));
        
        // Modal� g�ster
        modal.style.display = 'block';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        
        // Mobil cihazlarda modal�n �stte g�r�nmesini garanti et
        modal.style.zIndex = '9999';
        modal.classList.add('show');
        
        // Body scroll'unu engelle (mobil cihazlarda �nemli)
        document.body.style.overflow = 'hidden';
        
        console.log('? Joker ma�azas� modal a��ld�');
        console.log('Modal visibility:', modal.style.visibility);
        console.log('Modal display:', modal.style.display);
        console.log('Modal z-index:', modal.style.zIndex);
        console.log('Modal classList:', modal.classList.toString());
        
        // Kapat butonuna t�klama olay�
        var self = this;
        const closeModal = function() {
            modal.style.display = 'none';
            modal.style.visibility = 'hidden';
            modal.style.opacity = '0';
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Body scroll'unu restore et
            // Ma�aza kapand���nda joker butonlar�n� g�ncelle
            self.updateJokerButtons();
        };
        
        // Close button events (both click and touch)
        closeBtn.onclick = closeModal;
        closeBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            closeModal();
        });
        
        // Modal d���na t�klama olay�
        window.onclick = function(event) {
            if (event.target === modal) {
                closeModal();
            }
        };
        
        // Modal d���na dokunma olay� (mobil)
        modal.addEventListener('touchend', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // Sat�n alma butonlar�na da touch event ekle (mobil)
        buyButtons.forEach(function(btn) {
            btn.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // onclick event'i zaten �al��acak, sadece touch'u handle ediyoruz
            });
        });
    },
    
    // Joker butonlar�n� g�ncelle
    updateJokerButtons: function() {
        // Elementleri dinamik olarak al (e�er hen�z null ise)
        if (!this.jokerFiftyBtn) this.jokerFiftyBtn = document.getElementById('joker-fifty');
        if (!this.jokerHintBtn) this.jokerHintBtn = document.getElementById('joker-hint');
        if (!this.jokerTimeBtn) this.jokerTimeBtn = document.getElementById('joker-time');
        if (!this.jokerSkipBtn) this.jokerSkipBtn = document.getElementById('joker-skip');
        if (!this.jokerStoreBtn) this.jokerStoreBtn = document.getElementById('joker-store');
        
        const currentQuestion = this.questions[this.currentQuestionIndex] || {};
        const isTrueFalse = currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse";
        const isBlankFilling = currentQuestion.type === "BlankFilling";
        
        console.log('updateJokerButtons �a�r�ld�');
        console.log('Mevcut joker envanteri:', JSON.stringify(this.jokerInventory));
        console.log('Joker kullan�m durumlar�:', JSON.stringify(this.jokersUsed));
        console.log('updateJokerButtons - elementler:', {
            fifty: !!this.jokerFiftyBtn,
            hint: !!this.jokerHintBtn,
            time: !!this.jokerTimeBtn,
            skip: !!this.jokerSkipBtn,
            store: !!this.jokerStoreBtn
        });
        
        // 50:50 jokeri
        if (this.jokerFiftyBtn) {
            const fiftyCount = this.jokerInventory.fifty || 0;
            const used = this.jokersUsed.fifty;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${fiftyCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerFiftyBtn.disabled = (fiftyCount <= 0) || used || isTrueFalse || isBlankFilling;
            this.jokerFiftyBtn.style.opacity = (fiftyCount <= 0 || used || isTrueFalse || isBlankFilling) ? '0.3' : '1';
            this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i>${badgeHtml}`;
        }
        // �pucu jokeri
        if (this.jokerHintBtn) {
            const hintCount = this.jokerInventory.hint || 0;
            const used = this.jokersUsed.hint;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${hintCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerHintBtn.disabled = (hintCount <= 0) || used;
            this.jokerHintBtn.style.opacity = (hintCount <= 0 || used) ? '0.3' : '1';
            this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i>${badgeHtml}`;
        }
        // S�re jokeri
        if (this.jokerTimeBtn) {
            const timeCount = this.jokerInventory.time || 0;
            const used = this.jokersUsed.time;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${timeCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerTimeBtn.disabled = (timeCount <= 0) || used;
            this.jokerTimeBtn.style.opacity = (timeCount <= 0 || used) ? '0.3' : '1';
            this.jokerTimeBtn.innerHTML = `<i class="fas fa-clock"></i>${badgeHtml}`;
        }
        // Pas jokeri
        if (this.jokerSkipBtn) {
            const skipCount = this.jokerInventory.skip || 0;
            const used = this.jokersUsed.skip;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${skipCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerSkipBtn.disabled = (skipCount <= 0) || used;
            this.jokerSkipBtn.style.opacity = (skipCount <= 0 || used) ? '0.3' : '1';
            this.jokerSkipBtn.innerHTML = `<i class="fas fa-forward"></i>${badgeHtml}`;
        }
        // Joker ma�azas�
        if (this.jokerStoreBtn) {
            this.jokerStoreBtn.innerHTML = '<i class="fas fa-store"></i>';
        }
        
        // Mobil joker tab bar'�n� da g�ncelle
        this.updateJokerTabBar();
    },
    
    // Joker kullanma fonksiyonu
    useJoker: function(jokerType) {
// @ts-nocheck
/* eslint-disable */
// Bu dosya JavaScript'tir, TypeScript de�ildir.
// Script Version 3.0 - Firebase puan kaydetme sistemi tamamland�

// Tam Ekran Modunu Ayarla
function initFullscreenMode() {
    // PWA tam ekran modunu etkinle�tir
    if ('serviceWorker' in navigator) {
        // PWA modunda �al���yor mu kontrol et
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                           window.navigator.standalone ||
                           document.referrer.includes('android-app://');
        
        if (isStandalone) {
            console.log('? PWA standalone modunda �al���yor');
            
            // Tam ekran i�in CSS s�n�flar� ekle
            document.body.classList.add('pwa-fullscreen');
            document.documentElement.classList.add('pwa-fullscreen');
            
            // Viewport meta tag g�ncelle
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
            }
            
            // Status bar rengi ayarla
            const themeColor = document.querySelector('meta[name="theme-color"]');
            if (themeColor) {
                themeColor.setAttribute('content', '#1e40af');
            }
        } else {
            console.log('?? PWA standalone modunda �al��m�yor - taray�c� modunda');
        }
    }
    
    // CSS ile tam ekran stillerini uygula
    const fullscreenStyles = `
        .pwa-fullscreen {
            height: 100vh !important;
            height: 100dvh !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        .pwa-fullscreen .container {
            height: 100vh !important;
            height: 100dvh !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow-y: auto !important;
        }
        
        /* Safe area i�in padding ekle */
        @supports (padding: max(0px)) {
            .pwa-fullscreen .container {
                padding-top: max(env(safe-area-inset-top), 0px) !important;
                padding-bottom: max(env(safe-area-inset-bottom), 0px) !important;
                padding-left: max(env(safe-area-inset-left), 0px) !important;
                padding-right: max(env(safe-area-inset-right), 0px) !important;
            }
        }
        
        /* Capacitor/Cordova i�in */
        .platform-cordova .pwa-fullscreen,
        .platform-capacitor .pwa-fullscreen {
            height: 100vh !important;
            overflow: hidden !important;
        }
    `;
    
    // Stilleri head'e ekle
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = fullscreenStyles;
    document.head.appendChild(styleSheet);
}

// Sayfa Y�kleme ��lemleri
document.addEventListener('DOMContentLoaded', () => {
    // Tam ekran modunu ba�lat
    initFullscreenMode();
    
    // Ana i�eri�i g�r�n�r yap
    const container = document.querySelector('.container');
    if (container) {
        container.style.visibility = 'visible';
        container.classList.add('fade-in');
    }
});

const quizApp = {
    // DOM Elements
    questionElement: document.getElementById('question'),
    optionsElement: document.getElementById('options'),
    resultElement: document.getElementById('result'),
    scoreElement: document.getElementById('score'),
    restartButton: document.getElementById('restart'),
    quizElement: document.getElementById('quiz'),
    containerElement: document.querySelector('.container'),
    categorySelectionElement: document.getElementById('category-selection'),
    categoriesElement: document.getElementById('categories'),
    nextButton: document.getElementById('next-question'),
    highScoresListElement: document.getElementById('high-scores-list'),
    timeLeftElement: document.getElementById('time-left'),
    badgesContainer: document.getElementById('badges'),
    themeToggle: document.getElementById('checkbox'),
    jokerFiftyBtn: null, // document.getElementById('joker-fifty'),
    jokerHintBtn: null, // document.getElementById('joker-hint'),
    jokerTimeBtn: null, // document.getElementById('joker-time'),
    jokerSkipBtn: null, // document.getElementById('joker-skip'),
    jokerStoreBtn: null, // document.getElementById('joker-store'),
    
    // State Variables
    currentQuestionIndex: 0,
    score: 0,
    totalScore: 0, // <-- EKLEND�: Toplam birikmi� puan
    sessionScore: 0, // <-- EKLEND�: Bu oturumdaki toplam puan
    userLevel: 1, // <-- EKLEND�: Kullan�c� seviyesi
    levelProgress: 0, // <-- EKLEND�: Seviye ilerlemesi (XP)
    correctAnswers: 0,
    selectedCategory: null,
    questions: [],
    allQuestionsData: {},
    questionsData: {}, 
    timerInterval: null,
    timeLeft: 0,
    answeredQuestions: 0,
    answerTimes: [],
    jokersUsed: {fifty: false, hint: false, time: false, skip: false},
    jokerInventory: {fifty: 0, hint: 0, time: 0, skip: 0},
    soundEnabled: true,
    lives: 5,
    currentLevel: 1,
    levelProgress: 0,
    skipJokerActive: false,
    currentSection: 1, // �u anki b�l�m numaras�
    totalSections: 50, // Toplam b�l�m say�s�
    sectionStats: [], // Her b�l�m i�in do�ru/yanl�� cevap istatistiklerini saklayacak dizi
    currentLanguage: 'tr', // Varsay�lan dil
    translatedQuestions: {}, // �evrilmi� sorular
    isLoggedIn: false, // <-- EKLEND�: Kullan�c� giri� durumu
    currentUser: null, // <-- EKLEND�: Mevcut kullan�c�
    userSettings: {}, // <-- EKLEND�: Kullan�c� ayarlar�
    totalScore: 0, // <-- EKLEND�: Toplam puan
    sessionScore: 0, // <-- EKLEND�: Oturum puan�
    userLevel: 1, // <-- EKLEND�: Kullan�c� seviyesi
    levelProgress: 0, // <-- EKLEND�: Seviye ilerlemesi
    totalStars: 0, // <-- EKLEND�: Toplam y�ld�z say�s�
    
    // Constants
    HIGH_SCORES_KEY: 'quizHighScores',
    MAX_HIGH_SCORES: 5,
    TIME_PER_QUESTION: 45,
    TIME_PER_BLANK_FILLING_QUESTION: 60,
    SEEN_QUESTIONS_KEY: 'quizSeenQuestions',
    QUESTIONS_PER_GAME: 'dynamic', // Art�k kategoriye g�re dinamik
    STATS_KEY: 'quizStats',
    USER_SETTINGS_KEY: 'quizSettings',
    JOKER_INVENTORY_KEY: 'quizJokerInventory',
    LANGUAGE_KEY: 'quizLanguage',
    
    // Ba�lang��
    init: function() {
        console.log("Quiz Uygulamas� Ba�lat�l�yor...");
        
        // �lk Firebase durumu kontrol�
        console.log('?? Firebase �lk Durum Kontrol�:');
        console.log('- Firebase nesnesi:', typeof firebase !== 'undefined' ? 'VAR' : 'YOK');
        console.log('- Firebase.auth:', firebase && firebase.auth ? 'VAR' : 'YOK');
        console.log('- Firebase.firestore:', firebase && firebase.firestore ? 'VAR' : 'YOK');
        
        // Taray�c� �zelliklerini kontrol et
        this.checkBrowserSupport();
        
        try {
            // �nce dil ayarlar�n� y�kle
            this.loadLanguageSettings();
            
            // Kullan�c� aray�z�n� haz�rla
            this.initUI();
            
            // �nce kullan�c� ayarlar�n� y�kle
            this.loadUserSettings();
            
            // Joker tab bar'� ba�lat
            this.initJokerTabBar();
            
            // Kullan�c�n�n quiz modunda olup olmad���n� kontrol et (sayfa yenilemesi senaryosu i�in)
            if (localStorage.getItem('quizModeActive') === 'true' && document.getElementById('quiz').style.display !== 'none') {
                this.activateQuizMode();
            }
            
            // localStorage'dan skor verilerini y�kle
            this.loadScoreFromLocalStorage();
            
            // Soru verilerini y�kle
            this.loadQuestionsData()
                .then(() => {
                    console.log("T�m veriler ba�ar�yla y�klendi.");
                    
                    // Soru verilerinin y�klenip y�klenmedi�ini kontrol et
                    if (!this.questionsData || Object.keys(this.questionsData).length === 0) {
                        console.error("Soru verileri y�klenemedi veya bo�!");
                        
                        // Tekrar y�klemeyi dene
                        this.loadQuestionsData()
                            .then(() => {
                                console.log("�kinci deneme: Soru verileri y�klendi");
                            })
                            .catch(err => {
                                console.error("�kinci deneme ba�ar�s�z:", err);
                                this.showAlert(this.getTranslation('questionLoadError'));
                            });
                    }
                    
                    // Sorular� �evir
                    this.translateQuestions();
                })
                .catch(error => {
                    console.error("Soru verileri y�klenirken hata olu�tu:", error);
                });
        } catch (error) {
            console.error("Ba�latma s�ras�nda kritik hata:", error);
        }
    },
    
    // Mevcut dil i�in metni getir
    getTranslation: function(key) {
        try {
            // Dil dosyas� import edilmi� mi kontrol et
            if (typeof languages === 'undefined') {
                console.warn('Dil dosyas� y�klenemedi. Varsay�lan metin g�steriliyor.');
                return this.getDefaultTranslation(key);
            }
            
            // Mevcut dil i�in �eviri var m�?
            if (languages[this.currentLanguage] && languages[this.currentLanguage][key] !== undefined) {
                return languages[this.currentLanguage][key];
            }
            
            // T�rk�e varsay�lan dil olarak kullan�l�r
            if (languages.tr && languages.tr[key] !== undefined) {
                return languages.tr[key];
            }
            
            // �eviri bulunamazsa, anahtar� d�nd�r
            console.warn(`'${key}' i�in �eviri bulunamad�.`);
            return key;
        } catch (error) {
            console.error('�eviri al�n�rken hata olu�tu:', error);
            return this.getDefaultTranslation(key);
        }
    },
    
    // Varsay�lan �evirileri d�nd�r
    getDefaultTranslation: function(key) {
        // S�k kullan�lan metinler i�in varsay�lan de�erler
        const defaults = {
            'appName': 'Quiz Game',
            'loading': 'Loading...',
            'restart': 'Restart',
            'next': 'Next',
            'score': 'Score',
            'correct': 'Correct!',
            'wrong': 'Wrong!',
            'timeUp': 'Time is up!',
            'correctAnswer': 'Correct answer',
            'questionImage': 'Question image',
            'true': 'TRUE',
            'false': 'FALSE'
        };
        
        return defaults[key] || key;
    },
    
    // Dil ayarlar�n� y�kle
    loadLanguageSettings: function() {
        try {
            // Local storage'dan tercihler ekran�nda se�ilen dili kontrol et
            const userLanguage = localStorage.getItem('user_language');
            
            if (userLanguage && ['tr', 'en', 'de'].includes(userLanguage)) {
                this.currentLanguage = userLanguage;
                console.log(`Kullan�c� tercih etti�i dil: ${this.currentLanguage}`);
                
                // HTML dil etiketini g�ncelle
                document.documentElement.setAttribute('lang', this.currentLanguage);
                document.documentElement.setAttribute('data-language', this.currentLanguage);
            } else {
                // Kaydedilmi� dil ayar� varsa y�kle
                const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY);
                if (savedLanguage && ['tr', 'en', 'de'].includes(savedLanguage)) {
                    this.currentLanguage = savedLanguage;
                    console.log(`Kaydedilmi� dil ayar�: ${this.currentLanguage}`);
                } else {
                    // Taray�c� dilini kontrol et
                    const browserLang = navigator.language || navigator.userLanguage;
                    if (browserLang) {
                        const lang = browserLang.substring(0, 2).toLowerCase();
                        
                        // Desteklenen diller
                        if (['tr', 'en', 'de'].includes(lang)) {
                            this.currentLanguage = lang;
                        } else {
                            // Desteklenmeyen dil durumunda varsay�lan olarak �ngilizce
                            this.currentLanguage = 'en';
                        }
                        
                        console.log(`Taray�c� dili: ${browserLang}, Uygulama dili: ${this.currentLanguage}`);
                    }
                }
            }
            
            // Dil de�i�tirme elementini olu�tur
            this.createLanguageSelector();
        } catch (e) {
            console.error("Dil ayarlar� y�klenirken hata:", e);
            this.currentLanguage = 'tr'; // Hata durumunda varsay�lan dil
        }
    },
    
    // Dil se�ici olu�tur
    createLanguageSelector: function() {
        // Men�de zaten bir dil se�ici oldu�u i�in sayfa �zerinde ekstra bir dil se�ici olu�turmuyoruz
        console.log("Men�de zaten dil se�im alan� bulundu�u i�in ek bir dil se�ici olu�turulmad�");
        return;
    },
    
    // Dili de�i�tir
    switchLanguage: function(language) {
        if (this.currentLanguage === language) return;
        
        console.log(`Dil de�i�tiriliyor: ${this.currentLanguage} -> ${language}`);
        
        // Dili kaydet
        this.currentLanguage = language;
        localStorage.setItem(this.LANGUAGE_KEY, language);
        localStorage.setItem('quizLanguage', language); // Eski referans i�in uyumluluk
        
        // HTML etiketinin dil �zelliklerini g�ncelle
        const htmlRoot = document.getElementById('html-root') || document.documentElement;
        htmlRoot.setAttribute('lang', language);
        htmlRoot.setAttribute('data-language', language);
        
        // Soru verilerini yeniden y�kle
        this.loadQuestionsData()
            .then(() => {
                console.log("Dil de�i�ikli�i sonras� yeni soru verileri y�klendi");
                
                // UI metinlerini g�ncelle
                this.updateUITexts();
                
                // Dil de�i�ikli�i olay�n� tetikle - bu, di�er mod�llerin �evirilerini g�ncellemesini sa�lar
                document.dispatchEvent(new Event('languageChanged'));
                
                // E�er aktif bir kategori varsa ve sorular g�steriliyorsa, sorular� g�ncelle
                if (this.selectedCategory && this.quizElement && this.quizElement.style.display !== 'none') {
                    // Kategorileri yeniden g�ster (mevcut dildeki kategorileri g�stermek i�in)
                    this.displayCategories();
                    
                    // Se�ili kategori ad�n� kontrol et ve mevcut dildeki kar��l���n� bul
                    const translatedCategoryName = this.getCurrentCategoryName(this.selectedCategory);
                    
                    if (this.questionsData[translatedCategoryName]) {
                        // Kategori mevcut dildeki sorularla g�ncellenir
                        this.selectedCategory = translatedCategoryName;
                        
                        // Sorular� g�ncelle
                        this.questions = this.shuffleArray([...this.questionsData[this.selectedCategory]]);
                        this.arrangeBlankFillingFirst();
                        
                        // Mevcut soruyu s�f�rla ve ilk soruyu g�ster
                        this.currentQuestionIndex = 0;
                        this.displayQuestion(this.questions[0]);
                    }
                }
                
                // Mevcut g�sterilen i�eri�i g�ncelle
                this.updateCurrentContent();
                
                // Dil de�i�ikli�ini kullan�c�ya bildir
                this.showToast(this.getTranslation('languageChanged'), 'toast-success');
                this.updateResultAndWarningTexts();
            })
            .catch(error => {
                console.error("Dil de�i�ikli�i sonras� soru verileri y�klenirken hata:", error);
                this.showToast("Sorular y�klenirken bir hata olu�tu", "toast-error");
            });
    },
    
    // Sorular� �evir
    translateQuestions: function() {
        if (!this.questionsData || Object.keys(this.questionsData).length === 0) {
            console.warn('�evrilecek soru verisi bulunamad�.');
            return;
        }
        
        if (this.currentLanguage === 'tr') {
            // T�rk�e i�in �eviriye gerek yok, orijinal sorular� kullan
            this.translatedQuestions = this.cloneObject(this.questionsData);
            // Mevcut sorular� g�ncelle
            this.updateCurrentQuestionsWithTranslations();
            return;
        }
        
        // �evrilmi� sorular zaten varsa ve ge�erli dilde ise tekrar �evirme
        if (this.hasTranslatedQuestions(this.currentLanguage)) {
            console.log(`${this.currentLanguage} dilinde �evrilmi� sorular zaten mevcut, tekrar �evirme i�lemi yap�lmayacak.`);
            
            // Mevcut sorular� g�ncelle
            this.updateCurrentQuestionsWithTranslations();
            return;
        }
        
        console.log(`Sorular ${this.currentLanguage} diline �evriliyor...`);
        
        // Bo� �eviri nesnesini olu�tur
        this.translatedQuestions = {};
        
        // Her kategori i�in
        Object.keys(this.questionsData).forEach(categoryTR => {
            // Kategori ad�n� �evir
            const translatedCategoryName = this.getTranslatedCategoryName(categoryTR, this.currentLanguage);
            this.translatedQuestions[translatedCategoryName] = [];
            
            // Kategorideki her soru i�in
            this.questionsData[categoryTR].forEach(questionObj => {
                // Soru nesnesinin kopyas�n� olu�tur
                const translatedQuestion = this.cloneObject(questionObj);
                
                // Translations �zelli�i varsa ve istenen dilde �eviri varsa kullan
                if (questionObj.translations && questionObj.translations[this.currentLanguage]) {
                    const translation = questionObj.translations[this.currentLanguage];
                    if (translation.question) translatedQuestion.question = translation.question;
                    if (translation.options) translatedQuestion.options = translation.options;
                    if (translation.correctAnswer) translatedQuestion.correctAnswer = translation.correctAnswer;
                } else {
                    // Soru metnini ve ��klar� �evir (otomatik �eviri yerine �zelle�tirilmi� metin)
                    if (this.currentLanguage === 'en') {
                        translatedQuestion.question = this.translateToEnglish(questionObj.question);
                        
                        if (Array.isArray(translatedQuestion.options)) {
                            translatedQuestion.options = translatedQuestion.options.map(option => 
                                this.translateToEnglish(option)
                            );
                        }
                        
                        if (translatedQuestion.correctAnswer) {
                            translatedQuestion.correctAnswer = this.translateToEnglish(questionObj.correctAnswer);
                        }
                        
                        // Do�ru/Yanl�� sorular� i�in
                        if (translatedQuestion.type === "Do�ruYanl��" || translatedQuestion.type === "TrueFalse") {
                            translatedQuestion.type = "TrueFalse";
                            
                            if (translatedQuestion.correctAnswer === "DO�RU" || translatedQuestion.correctAnswer === "YANLI�") {
                                translatedQuestion.correctAnswer = trueFalseMapping[translatedQuestion.correctAnswer].en;
                            }
                        }
                    } else if (this.currentLanguage === 'de') {
                        translatedQuestion.question = this.translateToGerman(questionObj.question);
                        
                        if (Array.isArray(translatedQuestion.options)) {
                            translatedQuestion.options = translatedQuestion.options.map(option => 
                                this.translateToGerman(option)
                            );
                        }
                        
                        if (translatedQuestion.correctAnswer) {
                            translatedQuestion.correctAnswer = this.translateToGerman(questionObj.correctAnswer);
                        }
                        
                        // Do�ru/Yanl�� sorular� i�in
                        if (translatedQuestion.type === "Do�ruYanl��" || translatedQuestion.type === "TrueFalse") {
                            translatedQuestion.type = "TrueFalse";
                            
                            if (translatedQuestion.correctAnswer === "DO�RU" || translatedQuestion.correctAnswer === "YANLI�") {
                                translatedQuestion.correctAnswer = trueFalseMapping[translatedQuestion.correctAnswer].de;
                            }
                        }
                    }
                }
                
                // Kategori ad�n� g�ncelle
                translatedQuestion.category = translatedCategoryName;
                
                // Bo�luk doldurma sorular� i�in
                if (translatedQuestion.type === "BlankFilling" && translatedQuestion.choices) {
                    // Harfleri �evir (�rne�in Almanca'da �, � gibi harfler i�in)
                    translatedQuestion.choices = this.translateChoices(questionObj.choices, this.currentLanguage);
                }
                
                // �evrilmi� soruyu kategoriye ekle
                this.translatedQuestions[translatedCategoryName].push(translatedQuestion);
            });
        });
        
        console.log(`Soru �evirisi tamamland�. ${Object.keys(this.translatedQuestions).length} kategori �evrildi.`);
        
        // Mevcut sorular� g�ncelle
        this.updateCurrentQuestionsWithTranslations();
    },
    
    // �evrilmi� sorular var m� kontrol et
    hasTranslatedQuestions: function(language) {
        // �evrilmi� sorular bo�sa veya dil T�rk�e ise kontrol etmeye gerek yok
        if (language === 'tr' || !this.translatedQuestions) {
            return false;
        }
        
        // �evrilmi� sorular�n i�inde en az bir kategori var m�?
        const hasCategories = Object.keys(this.translatedQuestions).length > 0;
        
        if (hasCategories) {
            // Rastgele bir kategori se�
            const sampleCategory = Object.keys(this.translatedQuestions)[0];
            
            // Bu kategoride soru var m�?
            const hasQuestions = this.translatedQuestions[sampleCategory] && 
                                this.translatedQuestions[sampleCategory].length > 0;
            
            if (hasQuestions) {
                // Rastgele bir soru se�
                const sampleQuestion = this.translatedQuestions[sampleCategory][0];
                
                // Bu soru �evrilmi� mi? (Kategori ad�n� kontrol et)
                // T�rk�e kategorinin �evrilmi� ad�n� bul
                const originalCategoryName = Object.keys(this.questionsData)[0]; // �lk T�rk�e kategori
                const expectedTranslatedName = this.getTranslatedCategoryName(originalCategoryName, language);
                
                // �evirinin do�ru dilde olup olmad���n� kontrol et
                return sampleCategory === expectedTranslatedName;
            }
        }
        
        return false;
    },
    
    // Mevcut sorular� �evirilerle g�ncelle
    updateCurrentQuestionsWithTranslations: function() {
        // E�er bir kategori se�ilmi�se ve sorular y�klenmi�se, mevcut sorular� da g�ncelle
        if (this.selectedCategory && this.questions.length > 0) {
            console.log(`Se�ili kategori: ${this.selectedCategory}`);
            
            // Mevcut sorular dil de�i�iminden sonra g�ncellenecek
            const translatedCategoryName = this.getCurrentCategoryName(this.selectedCategory);
            
            console.log(`Se�ili kategori: ${this.selectedCategory}, �evrilmi� ad�: ${translatedCategoryName}`);
            
            // �evrilmi� kategorideki sorular� al
            const translatedCategoryQuestions = this.currentLanguage === 'tr' ? 
                this.questionsData[translatedCategoryName] : 
                this.translatedQuestions[translatedCategoryName];
            
            if (translatedCategoryQuestions) {
                console.log(`${translatedCategoryName} kategorisinde ${translatedCategoryQuestions.length} �evrilmi� soru bulundu.`);
                
                // Sorular� g�ncelle
                this.questions = this.shuffleArray([...translatedCategoryQuestions]);
                this.arrangeBlankFillingFirst();
                
                // Mevcut soruyu g�ncelle
                if (this.currentQuestionIndex < this.questions.length) {
                    this.displayQuestion(this.questions[this.currentQuestionIndex]);
                }
            } else {
                console.warn(`${translatedCategoryName} kategorisinde �evrilmi� soru bulunamad�!`);
            }
        }
    },
    
    // Nesne kopyalama (deep clone)
    cloneObject: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // Kategori ad�n� �evir
    getTranslatedCategoryName: function(categoryTR, targetLang) {
        if (categoryMappings[categoryTR] && categoryMappings[categoryTR][targetLang]) {
            return categoryMappings[categoryTR][targetLang];
        }
        
        // E�le�me yoksa orijinal kategori ad�n� d�nd�r
        return categoryTR;
    },
    
    // UI elemanlar�n� g�ncelle
    updateUITexts: function() {
        // Ba�l�k
        document.title = this.getTranslation('appName');
        
        // Navbar ba�l���
        const navbarTitle = document.querySelector('.navbar-title');
        if (navbarTitle) navbarTitle.textContent = this.getTranslation('appName');
        const appTitle = document.querySelector('.app-title');
        if (appTitle) appTitle.textContent = this.getTranslation('appName');
        const mainTitle = document.querySelector('.main-title');
        if (mainTitle) mainTitle.textContent = this.getTranslation('appName');
        
        // Yan men� (sidebar) metinleri
        const sidebarHome = document.querySelector('.sidebar-home');
        if (sidebarHome) sidebarHome.textContent = this.getTranslation('home');
        const sidebarFriends = document.querySelector('.sidebar-friends');
        if (sidebarFriends) sidebarFriends.textContent = this.getTranslation('friends');
        const sidebarLeaderboard = document.querySelector('.sidebar-leaderboard');
        if (sidebarLeaderboard) sidebarLeaderboard.textContent = this.getTranslation('leaderboardMenu');
        
        // Ana men� ba�l���
        const menuTitle = document.querySelector('.menu-title');
        if (menuTitle) {
            menuTitle.textContent = this.getTranslation('quiz');
        }
        
        // Quiz ba�l��� (soru ekran� �st�)
        const quizHeader = document.querySelector('#quiz h2');
        if (quizHeader) {
            quizHeader.textContent = this.getTranslation('quiz');
        }
        
        // ��k�� butonu kald�r�ld�
        
        // Ana men� butonlar�
        const singlePlayerBtn = document.getElementById('single-player-btn');
        if (singlePlayerBtn) {
            singlePlayerBtn.textContent = this.getTranslation('singlePlayer');
        }
        const multiPlayerBtn = document.getElementById('online-game-button');
        if (multiPlayerBtn) {
            multiPlayerBtn.textContent = this.getTranslation('multiPlayer');
        }
        const leaderboardBtn = document.getElementById('view-global-leaderboard');
        if (leaderboardBtn) {
            leaderboardBtn.textContent = this.getTranslation('leaderboard');
        }
        const statsBtn = document.getElementById('show-stats');
        if (statsBtn) {
            statsBtn.textContent = this.getTranslation('statistics');
        }
        const settingsBtn = document.getElementById('show-settings');
        if (settingsBtn) {
            settingsBtn.textContent = this.getTranslation('settings');
        }
        const addQuestionBtn = document.getElementById('add-question-button');
        if (addQuestionBtn) {
            addQuestionBtn.textContent = this.getTranslation('addQuestion');
        }
        // Logout butonu kald�r�ld�
        
        // Kategori ba�l���
        const categoryTitle = document.querySelector('#category-selection h2 span');
        if (categoryTitle) {
            categoryTitle.textContent = this.getTranslation('categories');
        }
        
        // Puan etiketi
        if (this.scoreElement) {
            const scoreLabel = this.scoreElement.querySelector('.score-label');
            if (scoreLabel) {
                scoreLabel.textContent = this.getTranslation('score');
            }
        }
        
        // Sonraki soru butonu
        if (this.nextButton) {
            const nextBtnText = this.nextButton.querySelector('span');
            if (nextBtnText) {
                nextBtnText.textContent = this.getTranslation('next');
            } else {
                this.nextButton.textContent = this.getTranslation('next');
            }
        }
        
        // Yeniden ba�lat butonu
        if (this.restartButton) {
            this.restartButton.textContent = this.getTranslation('restart');
        }
        
        // Joker butonlar�
        this.updateJokerButtonsText();
        
        // Dil etiketi
        const langLabel = document.getElementById('language-label');
        if (langLabel) {
            langLabel.textContent = this.getTranslation('language') + ':';
        }
        
        // Hamburger men� ��eleri - Yeni ID'ler ile g�ncelleme
        const appTitleElement = document.getElementById('menu-app-title');
        if (appTitleElement) {
            appTitleElement.textContent = this.getTranslation('app');
        }
        
        const settingsTitleElement = document.getElementById('menu-settings-title');
        if (settingsTitleElement) {
            settingsTitleElement.textContent = this.getTranslation('settings');
        }
        
        // Men� ��eleri metinleri
        const homeText = document.getElementById('menu-home-text');
        if (homeText) {
            homeText.textContent = this.getTranslation('home');
        }
        
        const profileText = document.getElementById('menu-profile-text');
        if (profileText) {
            profileText.textContent = this.getTranslation('profile');
        }
        
        const friendsText = document.getElementById('menu-friends-text');
        if (friendsText) {
            friendsText.textContent = this.getTranslation('friends');
        }
        
        const leaderboardText = document.getElementById('menu-leaderboard-text');
        if (leaderboardText) {
            leaderboardText.textContent = this.getTranslation('leaderboardMenu');
        }
        
        // Ayarlar metinleri
        const languageText = document.getElementById('menu-language-text');
        if (languageText) {
            languageText.textContent = this.getTranslation('language');
        }
        
        const difficultyText = document.getElementById('menu-difficulty-text');
        if (difficultyText) {
            difficultyText.textContent = this.getTranslation('difficulty');
        }
        
        const soundText = document.getElementById('menu-sound-text');
        if (soundText) {
            soundText.textContent = this.getTranslation('sound');
        }
        
        const themeText = document.getElementById('menu-theme-text');
        if (themeText) {
            themeText.textContent = this.getTranslation('darkTheme');
        }
        
        const logoutText = document.getElementById('menu-logout-text');
        if (logoutText) {
            logoutText.textContent = this.getTranslation('logout');
        }
        
        // Zorluk seviyeleri
        const difficultySelect = document.getElementById('difficulty-level');
        if (difficultySelect) {
            const options = difficultySelect.options;
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                if (option.value === 'easy') {
                    option.textContent = this.getTranslation('easy');
                } else if (option.value === 'medium') {
                    option.textContent = this.getTranslation('medium');
                } else if (option.value === 'hard') {
                    option.textContent = this.getTranslation('hard');
                }
            }
        }
        
        // data-i18n �zniteli�i olan t�m elemanlar� g�ncelle
        const i18nElements = document.querySelectorAll('[data-i18n]');
        i18nElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key && languages[this.currentLanguage] && languages[this.currentLanguage][key]) {
                element.textContent = languages[this.currentLanguage][key];
            }
        });
        

    },
    
    // Joker butonlar� metinlerini g�ncelle
    updateJokerButtonsText: function() {
        if (this.jokerFiftyBtn && !this.jokersUsed.fifty) {
            this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i>`;
        } else if (this.jokerFiftyBtn && this.jokersUsed.fifty) {
            this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i>`;
        }
        
        if (this.jokerHintBtn && !this.jokersUsed.hint) {
            this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i>`;
        } else if (this.jokerHintBtn && this.jokersUsed.hint) {
            this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i>`;
        }
        
        if (this.jokerTimeBtn && !this.jokersUsed.time) {
            this.jokerTimeBtn.innerHTML = `<i class="fas fa-clock"></i>`;
        } else if (this.jokerTimeBtn && this.jokersUsed.time) {
            this.jokerTimeBtn.innerHTML = `<i class="fas fa-clock"></i>`;
        }
        
        if (this.jokerSkipBtn && !this.jokersUsed.skip) {
            this.jokerSkipBtn.innerHTML = `<i class="fas fa-forward"></i>`;
        } else if (this.jokerSkipBtn && this.jokersUsed.skip) {
            this.jokerSkipBtn.innerHTML = `<i class="fas fa-forward"></i>`;
        }
        
        if (this.jokerStoreBtn) {
            this.jokerStoreBtn.innerHTML = `<i class="fas fa-store"></i>`;
        }
        
        // Mobil joker tab bar'� da g�ncelle
        this.updateJokerTabBar();
        
        console.log('updateJokerButtons tamamland�');
    },
    
    // Mobil joker tab bar'�n� g�ncelle
    updateJokerTabBar: function() {
        const currentQuestion = this.questions[this.currentQuestionIndex] || {};
        const isTrueFalse = currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse";
        const isBlankFilling = currentQuestion.type === "BlankFilling";
        
        // 50:50 joker tab
        const jokerTabFifty = document.getElementById('joker-tab-fifty');
        if (jokerTabFifty) {
            const fiftyCount = this.jokerInventory.fifty || 0;
            const used = this.jokersUsed.fifty;
            const disabled = (fiftyCount <= 0) || used || isTrueFalse || isBlankFilling;
            jokerTabFifty.style.opacity = disabled ? '0.3' : '1';
            jokerTabFifty.style.filter = disabled ? 'grayscale(100%)' : 'none';
        }
        
        // �pucu joker tab
        const jokerTabHint = document.getElementById('joker-tab-hint');
        if (jokerTabHint) {
            const hintCount = this.jokerInventory.hint || 0;
            const used = this.jokersUsed.hint;
            const disabled = (hintCount <= 0) || used || isBlankFilling;
            jokerTabHint.style.opacity = disabled ? '0.3' : '1';
            jokerTabHint.style.filter = disabled ? 'grayscale(100%)' : 'none';
        }
        
        // S�re joker tab
        const jokerTabTime = document.getElementById('joker-tab-time');
        if (jokerTabTime) {
            const timeCount = this.jokerInventory.time || 0;
            const used = this.jokersUsed.time;
            const disabled = (timeCount <= 0) || used;
            jokerTabTime.style.opacity = disabled ? '0.3' : '1';
            jokerTabTime.style.filter = disabled ? 'grayscale(100%)' : 'none';
        }
        
        // Pas joker tab
        const jokerTabSkip = document.getElementById('joker-tab-skip');
        if (jokerTabSkip) {
            const skipCount = this.jokerInventory.skip || 0;
            const used = this.jokersUsed.skip;
            const disabled = (skipCount <= 0) || used;
            jokerTabSkip.style.opacity = disabled ? '0.3' : '1';
            jokerTabSkip.style.filter = disabled ? 'grayscale(100%)' : 'none';
        }
        
        // Ma�aza tab her zaman aktif
        const jokerTabStore = document.getElementById('joker-tab-store');
        if (jokerTabStore) {
            jokerTabStore.style.opacity = '1';
            jokerTabStore.style.filter = 'none';
        }
    },
    
    // Mevcut i�eri�i g�ncelle
    updateCurrentContent: function() {
        // Ana men� butonlar� ve di�er UI elemanlar�n� g�ncelle
        this.updateUITexts();
        
        // Hangi sayfa g�r�n�rse onu g�ncelle
        if (this.categorySelectionElement && this.categorySelectionElement.style.display !== 'none') {
            // Kategori se�im ekran� g�r�n�yorsa
            this.displayCategories();
        } else if (this.quizElement && this.quizElement.style.display !== 'none' && this.questions.length > 0) {
            // Quiz ekran� g�r�n�yorsa
            if (this.resultElement && this.resultElement.style.display !== 'none') {
                // Sonu� g�steriliyorsa sonu� metnini g�ncelle
                const correctAnswer = this.questions[this.currentQuestionIndex].correctAnswer;
                if (this.resultElement.classList.contains('correct')) {
                    this.resultElement.innerHTML = `
                        <div class="correct-answer-container">
                            <div class="correct-icon"><i class="fas fa-badge-check"></i></div>
                            <div class="correct-text">${this.getTranslation('correct')}</div>
                            <div class="correct-animation">
                                <span>+</span>
                                <span>${Math.max(1, Math.ceil(this.timeLeft / (this.questions[this.currentQuestionIndex].type === "BlankFilling" ? 5 : 3)))}</span>
                            </div>
                        </div>
                        <button id="next-question" class="next-button">${this.getTranslation('next')}</button>
                    `;
                } else if (this.resultElement.classList.contains('wrong')) {
                    this.resultElement.innerHTML = `${this.getTranslation('timeUp')} ${this.getTranslation('correctAnswer')}: <strong>${correctAnswer}</strong>
                        <button id="next-question" class="next-button">${this.getTranslation('next')}</button>`;
                }
            } else {
                // Aktif soru varsa yeniden y�kle
                this.displayQuestion(this.questions[this.currentQuestionIndex]);
            }
        }
        this.updateResultAndWarningTexts();
    },
    
    // Basit �eviri fonksiyonlar� (ger�ek bir projede daha profesyonel bir ��z�m kullan�lmal�d�r)
    translateToEnglish: function(text) {
        // Bo� metin kontrol�
        if (!text) return '';
        
        // Bu sadece basit bir �rnektir - ger�ek projede buraya �zelle�tirilmi� �eviri eklenebilir
        // Not: Ger�ek bir uygulamada burada �nceden haz�rlanm�� �eviriler veya API kullan�labilir
        return text; // �u an i�in orijinal metni koruyoruz
    },
    
    translateToGerman: function(text) {
        // Bo� metin kontrol�
        if (!text) return '';
        
        // Almanca �eviri - bu basit bir �rnek
        return text; // �u an i�in orijinal metni koruyoruz
    },
    
    // Bo�luk doldurma i�in harfleri �evir
    translateChoices: function(choices, targetLang) {
        if (!choices) return [];
        
        // Bu fonksiyon �zellikle Almanca gibi dillerde �, �, � gibi harfler i�in kullan�labilir
        // �u an i�in orijinal harfleri koruyoruz
        return choices;
    },
    
    // Mevcut dil i�in ge�erli kategori ad�n� al
    getCurrentCategoryName: function(originalCategory) {
        if (this.currentLanguage === 'tr') return originalCategory;
        
        // T�rk�e kategori ad� m� kontrol et
        if (categoryMappings[originalCategory] && categoryMappings[originalCategory][this.currentLanguage]) {
            return categoryMappings[originalCategory][this.currentLanguage];
        }
        
        // Bu kategori ad� zaten �evrilmi� bir isim mi kontrol et
        if (reverseCategoryMappings[originalCategory] && 
            reverseCategoryMappings[originalCategory]['tr']) {
            return originalCategory; // Zaten �evrilmi� durumda, aynen d�nd�r
        }
        
        // Burada e�er kategori �evrilmi� bir isimse, mevcut dilde do�ru versiyonunu bul
        for (const [sourceCat, translations] of Object.entries(reverseCategoryMappings)) {
            // E�er bu bir yabanc� kategori ad�ysa ve bizim istedi�imiz dilde bir kar��l��� varsa
            if (sourceCat === originalCategory && translations[this.currentLanguage]) {
                return translations[this.currentLanguage];
            }
        }
        
        // Hi�bir e�le�me bulunamazsa orijinal kategori ad�n� d�nd�r
        return originalCategory;
    },
    
    // Toast mesaj� g�ster
    showToast: function(message, type = 'toast-info') {
        // Toast container'� kontrol et veya olu�tur
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Yeni toast olu�tur
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // �kon ekle
        let icon = '<i class="fas fa-info-circle"></i>';
        if (type === 'toast-success') icon = '<i class="fas fa-check-circle"></i>';
        if (type === 'toast-warning') icon = '<i class="fas fa-exclamation-triangle"></i>';
        if (type === 'toast-error') icon = '<i class="fas fa-times-circle"></i>';
        
        // Toast i�eri�i
        toast.innerHTML = `
            <div class="toast-content">
                ${icon}
                <span>${message}</span>
            </div>
        `;
        
        // Toast'u ekle
        toastContainer.appendChild(toast);
        
        // �pucu jokeri ve s�re jokeri i�in farkl� konumland�rma
        // Toast'� joker butonlar�n�n hemen �zerinde g�ster
        if (message.includes("�pucu jokeri kullan�ld�") || message.includes("S�re jokeri kullan�ld�")) {
            toast.style.position = "fixed";
            toast.style.bottom = "180px"; // Joker butonlar�n�n �zerinde
            toast.style.left = "50%";
            toast.style.transform = "translateX(-50%)";
            toast.style.zIndex = "10002"; // Joker butonlar�ndan daha y�ksek
        }
        
        // Toast'u g�ster
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Toast'u belirli bir s�re sonra kald�r
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    },
    
    // Taray�c� deste�ini kontrol et
    checkBrowserSupport: function() {
        console.log("Taray�c� �zellikleri kontrol ediliyor...");
        
        // localStorage deste�i
        let hasLocalStorage = false;
        try {
            hasLocalStorage = 'localStorage' in window && window.localStorage !== null;
            if (hasLocalStorage) {
                // Test et
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                console.log("localStorage destekleniyor");
                    } else {
                console.warn("localStorage desteklenmiyor");
            }
        } catch (e) {
            console.error("localStorage eri�ilemez:", e);
            hasLocalStorage = false;
        }
        
        // Fetch API deste�i
        const hasFetch = 'fetch' in window;
        console.log("Fetch API deste�i:", hasFetch);
        
        // Firebase SDK varl���
        const hasFirebase = typeof firebase !== 'undefined' && firebase.app;
        console.log("Firebase SDK durumu:", hasFirebase ? "Y�kl�" : "Y�kl� de�il");
        
        // JSON i�leme deste�i
        const hasJSON = typeof JSON !== 'undefined' && typeof JSON.parse === 'function';
        console.log("JSON deste�i:", hasJSON);
        
        // Eksik �zellikler varsa kullan�c�y� bilgilendir
        if (!hasLocalStorage || !hasFetch || !hasJSON) {
            console.warn("Baz� taray�c� �zellikleri eksik, uygulama s�n�rl� �al��abilir");
            // Uyar� mesaj� g�ster
            const warningDiv = document.createElement('div');
            warningDiv.className = 'browser-warning';
            warningDiv.innerHTML = `
                <div class="warning-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${this.getTranslation('browserWarning')}</p>
                    <button class="close-warning">${this.getTranslation('understood')}</button>
                </div>
            `;
            document.body.appendChild(warningDiv);
            
            // Kapat butonuna t�klama olay�
            const closeBtn = warningDiv.querySelector('.close-warning');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    warningDiv.remove();
                });
            }
        }
        
        return {
            localStorage: hasLocalStorage,
            fetch: hasFetch,
            firebase: hasFirebase,
            json: hasJSON
        };
    },
    
    // Joker envanterini y�kle
    loadJokerInventory: function() {
        console.log('Joker envanteri y�kleniyor...');
        console.log('localStorage anahtar�:', this.JOKER_INVENTORY_KEY);
        
        var inventoryJSON = localStorage.getItem(this.JOKER_INVENTORY_KEY);
        console.log('localStorage\'dan al�nan veri:', inventoryJSON);
        
        if (inventoryJSON && inventoryJSON !== 'null' && inventoryJSON !== 'undefined') {
            try {
                const parsed = JSON.parse(inventoryJSON);
                
                // Ge�erli bir obje ve t�m joker t�rleri var m� kontrol et
                if (parsed && typeof parsed === 'object' && 
                    parsed.hasOwnProperty('fifty') && 
                    parsed.hasOwnProperty('hint') && 
                    parsed.hasOwnProperty('time') && 
                    parsed.hasOwnProperty('skip')) {
                    
                    this.jokerInventory = parsed;
                    console.log("Joker envanteri ba�ar�yla y�klendi:", this.jokerInventory);
                } else {
                    console.warn("Ge�ersiz joker envanteri format�, varsay�lan envanter atan�yor");
                    this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
                    this.saveJokerInventory();
                }
            } catch (e) {
                console.error("Joker envanteri y�klenirken hata olu�tu:", e);
                this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
                this.saveJokerInventory();
                console.log("Varsay�lan envanter atand�:", this.jokerInventory);
            }
        } else {
            // �lk kez �al��t�r�l�yorsa veya ge�ersiz veri varsa her joker t�r�nden birer tane ver
            console.log("�lk kez �al��t�r�l�yor veya ge�ersiz veri, varsay�lan envanter olu�turuluyor...");
            this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
            this.saveJokerInventory();
        }
        
        // Negatif de�erleri �nle
        Object.keys(this.jokerInventory).forEach(key => {
            if (this.jokerInventory[key] < 0) {
                this.jokerInventory[key] = 0;
            }
        });
        
        // Final kontrol
        console.log('loadJokerInventory tamamland�, final envanter:', this.jokerInventory);
    },
    
    // Joker envanterini kaydet
    saveJokerInventory: function() {
        try {
            localStorage.setItem(this.JOKER_INVENTORY_KEY, JSON.stringify(this.jokerInventory));
            console.log("Joker envanteri kaydedildi:", this.jokerInventory);
            
            // Kaydetmenin ba�ar�l� olup olmad���n� kontrol et
            var saved = localStorage.getItem(this.JOKER_INVENTORY_KEY);
            if (saved) {
                var parsedSaved = JSON.parse(saved);
                console.log("Kaydedilen veri do�ruland�:", parsedSaved);
            } else {
                console.error("Joker envanteri kaydedilemedi!");
            }
        } catch (e) {
            console.error("Joker envanteri kaydedilirken hata olu�tu:", e);
        }
    },
    
    // Joker butonlar�na olay dinleyicileri ekle
    addJokerEventListeners: function() {
        console.log('addJokerEventListeners �a�r�ld�...');
        
        // Elementleri dinamik olarak al
        this.jokerFiftyBtn = document.getElementById('joker-fifty');
        this.jokerHintBtn = document.getElementById('joker-hint');
        this.jokerTimeBtn = document.getElementById('joker-time');
        this.jokerSkipBtn = document.getElementById('joker-skip');
        this.jokerStoreBtn = document.getElementById('joker-store');
        
        console.log('jokerFiftyBtn:', this.jokerFiftyBtn);
        console.log('jokerHintBtn:', this.jokerHintBtn);
        console.log('jokerTimeBtn:', this.jokerTimeBtn);
        console.log('jokerSkipBtn:', this.jokerSkipBtn);
        console.log('jokerStoreBtn:', this.jokerStoreBtn);
        
        // Mobil debug i�in
        console.log('Mobile device check:', /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        console.log('Touch events supported:', 'ontouchstart' in window);
        
        // Joker store modal element kontrol�
        const jokerStoreModal = document.getElementById('joker-store-modal');
        console.log('Joker store modal element:', jokerStoreModal);
        
        // 50:50 jokeri
        if (this.jokerFiftyBtn) {
            this.jokerFiftyBtn.addEventListener('click', () => {
                if (this.jokerFiftyBtn.disabled) return;
                
                console.log('50:50 joker kullan�l�yor...');
                
                // Mevcut sorunun do�ru cevab�n� al
                const currentQuestion = this.questions[this.currentQuestionIndex];
                const correctAnswer = currentQuestion.correctAnswer;
                
                // BlankFilling sorular�nda 50:50 joker kullan�lamaz
                if (currentQuestion.type === "BlankFilling") {
                    console.warn('BlankFilling sorular�nda 50:50 joker kullan�lamaz');
                    this.showToast("Bo�luk doldurma sorular�nda 50:50 joker kullan�lamaz!", "toast-warning");
                    return;
                }
                
                // Do�ruYanl�� sorular�nda da 50:50 joker kullan�lamaz
                if (currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse") {
                    console.warn('Do�ru/Yanl�� sorular�nda 50:50 joker kullan�lamaz');
                    this.showToast("Do�ru/Yanl�� sorular�nda 50:50 joker kullan�lamaz!", "toast-warning");
                    return;
                }
                
                console.log('Do�ru cevap:', correctAnswer);
                
                // Sadece aktif quiz container'daki se�enekleri al
                const optionsContainer = document.getElementById('options');
                const options = optionsContainer ? optionsContainer.querySelectorAll('.option') : document.querySelectorAll('#options .option');
                console.log('Bulunan se�enekler:', options.length);
                console.log('Options container:', optionsContainer);
                
                if (options.length < 3) {
                    console.warn('Yeterli se�enek yok, 50:50 joker kullan�lamaz');
                    this.showToast("Bu soru tipinde 50:50 joker kullan�lamaz!", "toast-warning");
                    return;
                }
                
                // Yanl�� ��klar� bul - case insensitive kar��la�t�rma
                const wrongOptions = Array.from(options).filter((option, index) => {
                    const optionText = option.textContent.trim();
                    const isCorrect = optionText.toLowerCase() === correctAnswer.toLowerCase();
                    console.log(`Se�enek ${index + 1}: "${optionText}" | Do�ru cevap: "${correctAnswer}" | E�it mi: ${isCorrect}`);
                    return !isCorrect;
                });
                
                console.log('Toplam se�enek say�s�:', options.length);
                console.log('Yanl�� se�enek say�s�:', wrongOptions.length);
                console.log('Do�ru se�enek say�s�:', options.length - wrongOptions.length);
                
                if (wrongOptions.length < 2) {
                    console.warn('Yeterli yanl�� se�enek yok');
                    this.showToast("Bu soruda yeterli yanl�� se�enek yok!", "toast-warning");
                    return;
                }
                
                // �ki yanl�� ��kk� rastgele se�
                const shuffledWrong = this.shuffleArray([...wrongOptions]);
                const toHide = shuffledWrong.slice(0, 2);
                
                console.log('S�nd�r�lecek se�enekler:', toHide.length);
                
                // Se�ili ��klar� s�nd�r
                toHide.forEach(option => {
                    option.style.opacity = '0.3';
                    option.style.pointerEvents = 'none';
                    option.style.background = 'linear-gradient(135deg, #ddd, #ccc)';
                    option.style.color = '#666';
                    option.style.textDecoration = 'line-through';
                    option.style.filter = 'blur(1px)';
                    option.style.border = '2px solid #f0f0f0';
                    option.style.transform = 'scale(0.95)';
                    option.style.transition = 'all 0.3s ease';
                    option.classList.add('disabled-option');
                    
                    // X i�areti ekle
                    const xMark = document.createElement('div');
                    xMark.innerHTML = '?';
                    xMark.style.cssText = `
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        font-size: 20px;
                        z-index: 10;
                        animation: bounceIn 0.5s ease;
                    `;
                    option.style.position = 'relative';
                    option.appendChild(xMark);
                });
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('fifty');
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const fiftySound = document.getElementById('sound-correct');
                    if (fiftySound) fiftySound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Toast bildirimi g�ster
                this.showToast("50:50 jokeri kullan�ld�! �ki yanl�� ��k s�nd�r�ld�.", "toast-success");
            });
        }
        
        // �pucu jokeri
        if (this.jokerHintBtn) {
            this.jokerHintBtn.addEventListener('click', () => {
                if (this.jokerHintBtn.disabled) return;
                
                console.log('�pucu joker kullan�l�yor...');
                
                // Mevcut soru i�in bir ipucu g�ster
                const currentQuestion = this.questions[this.currentQuestionIndex];
                let hint = '';
                
                // �pucu olu�tur - farkl� soru tiplerine g�re
                if (currentQuestion.category === "Bo�luk Doldurma" || currentQuestion.type === "BlankFilling") {
                    hint = "�pucu: Cevab�n ilk harfi \"" + currentQuestion.correctAnswer.charAt(0) + "\" ";
                    if (currentQuestion.correctAnswer.length > 3) {
                        hint += "ve son harfi \"" + currentQuestion.correctAnswer.charAt(currentQuestion.correctAnswer.length - 1) + "\"";
                    }
                } else if (currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse") {
                    // Do�ru/Yanl�� sorular i�in �zel ipucu
                    const correctAnswer = currentQuestion.correctAnswer.toLowerCase();
                    if (correctAnswer === 'do�ru' || correctAnswer === 'true' || correctAnswer === 'evet') {
                        hint = "�pucu: Bu ifade do�ru bir bilgidir.";
                    } else {
                        hint = "�pucu: Bu ifadede bir yanl��l�k vard�r.";
                    }
                } else {
                    const correctAnswer = currentQuestion.correctAnswer;
                    // Cevab�n ilk ve varsa son harfini ipucu olarak ver
                    hint = "�pucu: Do�ru cevab�n ilk harfi \"" + correctAnswer.charAt(0) + "\" ";
                    if (correctAnswer.length > 3) {
                        hint += "ve son harfi \"" + correctAnswer.charAt(correctAnswer.length - 1) + "\"";
                    }
                }
                
                console.log('Olu�turulan ipucu:', hint);
                
                // �pucunu g�ster
                const hintElement = document.createElement('div');
                hintElement.className = 'hint-message';
                hintElement.innerHTML = '<i class="fas fa-lightbulb"></i> ' + hint;
                hintElement.style.cssText = `
                    background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
                    color: #2d3436;
                    padding: 15px 20px;
                    margin: 15px 0;
                    border-radius: 10px;
                    border-left: 4px solid #e17055;
                    box-shadow: 0 4px 15px rgba(253, 203, 110, 0.3);
                    animation: fadeInUp 0.5s ease;
                    font-weight: 600;
                    text-align: center;
                `;
                
                // �pucu mesaj�n� ekleme
                const questionElement = document.getElementById('question');
                if (questionElement && questionElement.parentNode) {
                    // Eski ipucu mesaj�n� kald�r
                    const oldHint = document.querySelector('.hint-message');
                    if (oldHint) oldHint.remove();
                    
                    // Yeni ipucunu ekle
                    questionElement.parentNode.insertBefore(hintElement, questionElement.nextSibling);
                    console.log('�pucu mesaj� DOM\'a eklendi');
                }
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('hint');
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const hintSound = document.getElementById('sound-correct');
                    if (hintSound) hintSound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Toast bildirimi g�ster
                this.showToast("�pucu jokeri kullan�ld�! " + hint, "toast-success");
            });
        }
        
        // +S�re jokeri
        if (this.jokerTimeBtn) {
            this.jokerTimeBtn.addEventListener('click', () => {
                if (this.jokerTimeBtn.disabled) return;
                
                console.log('S�re joker kullan�l�yor...');
                console.log('Kullan�m �ncesi s�re:', this.timeLeft);
                
                // Mevcut sorunun s�resini 15 saniye uzat
                this.timeLeft += 15;
                
                console.log('Kullan�m sonras� s�re:', this.timeLeft);
                
                // S�re g�stergesini g�ncelle
                this.updateTimeDisplay();
                
                // Zaman�n azald���n� belirten s�n�f� kald�r
                if (this.timeLeftElement && this.timeLeftElement.classList.contains('time-low')) {
                    this.timeLeftElement.classList.remove('time-low');
                }
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('time');
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const timeSound = document.getElementById('sound-correct');
                    if (timeSound) timeSound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Toast bildirimi g�ster
                this.showToast("S�re jokeri kullan�ld�! 15 saniye eklendi. Yeni s�re: " + this.timeLeft + " saniye", "toast-success");
            });
        }
        
        // Pas jokeri
        if (this.jokerSkipBtn) {
            this.jokerSkipBtn.addEventListener('click', () => {
                if (this.jokerSkipBtn.disabled) return;
                
                console.log('Pas joker kullan�l�yor...');
                console.log('Pas joker kullan�m �ncesi envanter:', JSON.stringify(this.jokerInventory));
                
                // Joker envanterini kontrol et
                if (this.jokerInventory.skip <= 0) {
                    console.warn('Pas joker envanteri bo�!');
                    this.showToast("Pas jokeriniz kalmad�!", "toast-warning");
                    return;
                }
                
                // S�reyi s�f�rlamak yerine do�rudan sonraki soruya ge�i� yapal�m
                clearInterval(this.timerInterval);
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const skipSound = document.getElementById('sound-correct');
                    if (skipSound) skipSound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('skip');
                
                // Toast bildirimi g�ster
                this.showToast("Pas jokeri kullan�ld�! Sonraki soruya ge�iliyor.", "toast-success");
                
                console.log('Pas joker kullan�m sonras� envanter:', JSON.stringify(this.jokerInventory));
                
                // Bir sonraki soruya ge�
                setTimeout(() => {
                    this.showNextQuestion();
                }, 800);
            });
        }
        
        // Joker ma�azas� butonu
        if (this.jokerStoreBtn) {
            // Click event (desktop)
            this.jokerStoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openJokerStore();
            });
            
            // Touch event (mobile)
            this.jokerStoreBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            
            this.jokerStoreBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openJokerStore();
            });
            
            // Mobil cihazlarda butonun t�klanabilir oldu�unu garanti et
            this.jokerStoreBtn.style.cursor = 'pointer';
            this.jokerStoreBtn.style.touchAction = 'manipulation';
        }
    },
    
    // Joker ma�azas�n� a�
    openJokerStore: function() {
        console.log('?? Joker ma�azas� a��l�yor...');
        console.log('?? User Agent:', navigator.userAgent);
        console.log('?? Mevcut joker envanteri:', JSON.stringify(this.jokerInventory));
        console.log('?? Mevcut puan:', this.score);
        
        var modal = document.getElementById('joker-store-modal');
        var closeBtn = modal.querySelector('.close-modal');
        var buyButtons = modal.querySelectorAll('.joker-buy-btn');
        var pointsDisplay = document.getElementById('joker-store-points-display');
        
        // Mevcut toplam puanlar� ve joker envanterini g�ster (misafir i�in sessionScore kullan)
        const currentPoints = this.isLoggedIn ? this.totalScore : this.sessionScore;
        pointsDisplay.textContent = currentPoints || 0;
        console.log('?? Joker ma�azas� - G�sterilen puan: ' + currentPoints + ' (Giri� durumu: ' + (this.isLoggedIn ? 'Kay�tl�' : 'Misafir') + ')');
        console.log('?? Detay - totalScore: ' + this.totalScore + ', sessionScore: ' + this.sessionScore);
        
        // Oyun ekran�ndaki joker butonlar�n� da g�ncelle
        this.updateJokerButtons();
        
        // Joker miktarlar�n� g�ncelle
        this.updateJokerStoreDisplay(modal);
        
        // Sat�n alma butonlar�n� etkinle�tir
        buyButtons.forEach(function(btn) {
            var item = btn.closest('.joker-store-item');
            var jokerType = item.dataset.joker;
            var price = parseInt(item.dataset.price);
            
            // Yeterli puan varsa butonu etkinle�tir (misafir i�in sessionScore kullan)
            const availablePoints = this.isLoggedIn ? this.totalScore : this.sessionScore;
            btn.disabled = availablePoints < price;
            
            // Sat�n alma fonksiyonu
            var self = this;
            const purchaseJoker = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const availablePoints = self.isLoggedIn ? self.totalScore : self.sessionScore;
                console.log('Joker sat�n alma denemesi: ' + jokerType + ', Fiyat: ' + price + ', Mevcut Puan: ' + availablePoints + ' (' + (self.isLoggedIn ? 'totalScore' : 'sessionScore') + ')');
                console.log('Sat�n alma �ncesi envanter:', JSON.stringify(self.jokerInventory));
                
                if (availablePoints >= price) {
                    // Puan� azalt (misafir i�in sessionScore, kay�tl� i�in totalScore)
                    if (self.isLoggedIn) {
                        self.totalScore -= price;
                    } else {
                        self.sessionScore -= price;
                    }
                    
                    // PUANI FIREBASE'E KAYDET
                    if (self.isLoggedIn) {
                        self.delayedSaveUserData(); // Firebase'e geciktirilmi� kaydet
                        console.log(`Joker sat�n alma: ${price} puan harcand�. Yeni toplam: ${self.totalScore}`);
                    }
                    
                    // Jokeri envantere ekle
                    var previousCount = self.jokerInventory[jokerType] || 0;
                    self.jokerInventory[jokerType]++;
                    
                    console.log(`${jokerType} joker say�s�: ${previousCount} -> ${self.jokerInventory[jokerType]}`);
                    
                    // Joker envanterini kaydet
                    self.saveJokerInventory();
                    
                    // G�stergeleri g�ncelle (misafir i�in sessionScore kullan)
                    const updatedPoints = self.isLoggedIn ? self.totalScore : self.sessionScore;
                    pointsDisplay.textContent = updatedPoints;
                    
                    // Joker ma�azas�ndaki say�mlar� ve buton durumlar�n� g�ncelle
                    self.updateJokerStoreDisplay(modal);
                    
                    // OYUN EKRANINDAK� JOKER BUTONLARINI DA G�NCELLE
                    self.updateJokerButtons();
                    
                    // MOB�L JOKER TAB BAR'I DA G�NCELLE
                    self.updateJokerTabBar();
                    
                    // Skor g�sterimini g�ncelle
                    self.updateScoreDisplay();
                    
                    // Toast bildirimi g�ster
                    var jokerName = jokerType === 'fifty' ? '50:50' : 
                        jokerType === 'hint' ? '�pucu' : 
                        jokerType === 'time' ? 'S�re' : 'Pas';
                    self.showToast(jokerName + ' jokeri sat�n al�nd�!', "toast-success");
                    
                    // Joker butonlar�n� g�ncelle
                    self.updateJokerButtons();
                    
                    console.log('Sat�n alma sonras� envanter:', JSON.stringify(self.jokerInventory));
                } else {
                    console.warn('Yeterli puan yok!');
                    self.showToast("Yeterli puan�n�z yok!", "toast-error");
                }
            };
            
            // Hem click hem de touch event'lerini ekle
            btn.onclick = purchaseJoker;
            btn.addEventListener('touchend', purchaseJoker);
            
            // Mobil cihazlar i�in ek optimizasyonlar
            btn.style.touchAction = 'manipulation';
            btn.style.webkitTapHighlightColor = 'transparent';
        }.bind(this));
        
        // Modal� g�ster
        modal.style.display = 'block';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        
        // Mobil cihazlarda modal�n �stte g�r�nmesini garanti et
        modal.style.zIndex = '9999';
        modal.classList.add('show');
        
        // Body scroll'unu engelle (mobil cihazlarda �nemli)
        document.body.style.overflow = 'hidden';
        
        console.log('? Joker ma�azas� modal a��ld�');
        console.log('Modal visibility:', modal.style.visibility);
        console.log('Modal display:', modal.style.display);
        console.log('Modal z-index:', modal.style.zIndex);
        console.log('Modal classList:', modal.classList.toString());
        
        // Kapat butonuna t�klama olay�
        var self = this;
        const closeModal = function() {
            modal.style.display = 'none';
            modal.style.visibility = 'hidden';
            modal.style.opacity = '0';
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Body scroll'unu restore et
            // Ma�aza kapand���nda joker butonlar�n� g�ncelle
            self.updateJokerButtons();
        };
        
        // Close button events (both click and touch)
        closeBtn.onclick = closeModal;
        closeBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            closeModal();
        });
        
        // Modal d���na t�klama olay�
        window.onclick = function(event) {
            if (event.target === modal) {
                closeModal();
            }
        };
        
        // Modal d���na dokunma olay� (mobil)
        modal.addEventListener('touchend', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // Sat�n alma butonlar�na da touch event ekle (mobil)
        buyButtons.forEach(function(btn) {
            btn.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // onclick event'i zaten �al��acak, sadece touch'u handle ediyoruz
            });
        });
    },
    
    // Joker butonlar�n� g�ncelle
    updateJokerButtons: function() {
        // Elementleri dinamik olarak al (e�er hen�z null ise)
        if (!this.jokerFiftyBtn) this.jokerFiftyBtn = document.getElementById('joker-fifty');
        if (!this.jokerHintBtn) this.jokerHintBtn = document.getElementById('joker-hint');
        if (!this.jokerTimeBtn) this.jokerTimeBtn = document.getElementById('joker-time');
        if (!this.jokerSkipBtn) this.jokerSkipBtn = document.getElementById('joker-skip');
        if (!this.jokerStoreBtn) this.jokerStoreBtn = document.getElementById('joker-store');
        
        const currentQuestion = this.questions[this.currentQuestionIndex] || {};
        const isTrueFalse = currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse";
        const isBlankFilling = currentQuestion.type === "BlankFilling";
        
        console.log('updateJokerButtons �a�r�ld�');
        console.log('Mevcut joker envanteri:', JSON.stringify(this.jokerInventory));
        console.log('Joker kullan�m durumlar�:', JSON.stringify(this.jokersUsed));
        console.log('updateJokerButtons - elementler:', {
            fifty: !!this.jokerFiftyBtn,
            hint: !!this.jokerHintBtn,
            time: !!this.jokerTimeBtn,
            skip: !!this.jokerSkipBtn,
            store: !!this.jokerStoreBtn
        });
        
        // 50:50 jokeri
        if (this.jokerFiftyBtn) {
            const fiftyCount = this.jokerInventory.fifty || 0;
            const used = this.jokersUsed.fifty;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${fiftyCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerFiftyBtn.disabled = (fiftyCount <= 0) || used || isTrueFalse || isBlankFilling;
            this.jokerFiftyBtn.style.opacity = (fiftyCount <= 0 || used || isTrueFalse || isBlankFilling) ? '0.3' : '1';
            this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i>${badgeHtml}`;
        }
        // �pucu jokeri
        if (this.jokerHintBtn) {
            const hintCount = this.jokerInventory.hint || 0;
            const used = this.jokersUsed.hint;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${hintCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerHintBtn.disabled = (hintCount <= 0) || used;
            this.jokerHintBtn.style.opacity = (hintCount <= 0 || used) ? '0.3' : '1';
            this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i>${badgeHtml}`;
        }
        // S�re jokeri
        if (this.jokerTimeBtn) {
            const timeCount = this.jokerInventory.time || 0;
            const used = this.jokersUsed.time;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${timeCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerTimeBtn.disabled = (timeCount <= 0) || used;
            this.jokerTimeBtn.style.opacity = (timeCount <= 0 || used) ? '0.3' : '1';
            this.jokerTimeBtn.innerHTML = `<i class="fas fa-clock"></i>${badgeHtml}`;
        }
        // Pas jokeri
        if (this.jokerSkipBtn) {
            const skipCount = this.jokerInventory.skip || 0;
            const used = this.jokersUsed.skip;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${skipCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerSkipBtn.disabled = (skipCount <= 0) || used;
            this.jokerSkipBtn.style.opacity = (skipCount <= 0 || used) ? '0.3' : '1';
            this.jokerSkipBtn.innerHTML = `<i class="fas fa-forward"></i>${badgeHtml}`;
        }
        // Joker ma�azas�
        if (this.jokerStoreBtn) {
            this.jokerStoreBtn.innerHTML = '<i class="fas fa-store"></i>';
        }
    },
    
    // Joker kullanma fonksiyonu
    useJoker: function(jokerType) {
        // Envanter kontrol� - eksiye d��mesin
        if (this.jokerInventory[jokerType] > 0) {
            this.jokersUsed[jokerType] = true;
            this.jokerInventory[jokerType]--;
            this.saveJokerInventory();
            console.log(`${jokerType} joker kullan�ld�. Kalan: ${this.jokerInventory[jokerType]}`);
            
            // Joker kullan�m� i�in k�sa modal g�ster
            this.showJokerUsageModal(jokerType);
            
            // Joker butonlar�n� g�ncelle
            this.updateJokerButtons();
        } else {
            console.warn(`${jokerType} joker envanterinde yok!`);
        }
    },
    
    // Joker kullan�m� i�in k�sa s�reli modal g�ster
    showJokerUsageModal: function(jokerType) {
        console.log(`${jokerType} jokeri i�in modal g�steriliyor...`);
        
        // Modal HTML yap�s�n� olu�tur
        let modalTitle = "";
        let modalMessage = "";
        let modalIcon = "";
        
        // Joker tipine g�re i�eri�i ayarla
        if (jokerType === 'fifty') {
            modalTitle = "50:50 Jokeri Kullan�ld�";
            modalMessage = "�ki yanl�� ��k elendi!";
            modalIcon = "fa-th-large";
        } else if (jokerType === 'hint') {
            modalTitle = "�pucu Jokeri Kullan�ld�";
            modalMessage = "Do�ru cevap i�in ipu�lar� verildi!";
            modalIcon = "fa-lightbulb";
        } else if (jokerType === 'time') {
            modalTitle = "S�re Jokeri Kullan�ld�";
            modalMessage = "+15 saniye eklendi!";
            modalIcon = "fa-clock";
        } else if (jokerType === 'skip') {
            modalTitle = "Pas Jokeri Kullan�ld�";
            modalMessage = "Bu soruyu ge�iyorsunuz!";
            modalIcon = "fa-forward";
        }
        
        // Modal div'ini olu�tur (CSS i�in stil ekleyece�iz)
        const modalDiv = document.createElement('div');
        modalDiv.className = `joker-usage-modal joker-usage-${jokerType}`;
        modalDiv.innerHTML = `
            <div class="joker-usage-content">
                <div class="joker-usage-icon">
                    <i class="fas ${modalIcon}"></i>
                </div>
                <h3>${modalTitle}</h3>
                <p>${modalMessage}</p>
            </div>
        `;
        
        // Stil ekle
        modalDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #fff, #f8f9fa);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            text-align: center;
            min-width: 300px;
            animation: fadeInScale 0.3s ease-out;
        `;
        
        // Joker tipine g�re farkl� renk �emas�
        if (jokerType === 'fifty') {
            modalDiv.style.background = 'linear-gradient(135deg, #74b9ff, #0984e3)';
        } else if (jokerType === 'hint') {
            modalDiv.style.background = 'linear-gradient(135deg, #ffeaa7, #fdcb6e)';
        } else if (jokerType === 'time') {
            modalDiv.style.background = 'linear-gradient(135deg, #55efc4, #00b894)';
        } else if (jokerType === 'skip') {
            modalDiv.style.background = 'linear-gradient(135deg, #ff7675, #d63031)';
        }
        
        // ��erik stilini ayarla
        const contentDiv = modalDiv.querySelector('.joker-usage-content');
        contentDiv.style.cssText = `
            color: #fff;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        `;
        
        // �kon stilini ayarla
        const iconDiv = modalDiv.querySelector('.joker-usage-icon');
        iconDiv.style.cssText = `
            font-size: 40px;
            margin-bottom: 15px;
            animation: pulse 1s infinite;
        `;
        
        // Ba�l�k stilini ayarla
        const titleEl = modalDiv.querySelector('h3');
        titleEl.style.cssText = `
            font-size: 22px;
            margin-bottom: 10px;
            font-weight: bold;
        `;
        
        // Mesaj stilini ayarla
        const messageEl = modalDiv.querySelector('p');
        messageEl.style.cssText = `
            font-size: 16px;
            opacity: 0.9;
        `;
        
        // Animasyonlar i�in stil ekle
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInScale {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            
            @keyframes fadeOutScale {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        // Modal� DOM'a ekle
        document.body.appendChild(modalDiv);
        
        // Modal� k�sa s�re sonra kald�r (ip ucu jokeri i�in biraz daha uzun s�re)
        const displayTime = jokerType === 'hint' ? 2000 : 1500;
        
        setTimeout(() => {
            modalDiv.style.animation = 'fadeOutScale 0.3s ease-out';
            setTimeout(() => {
                if (document.body.contains(modalDiv)) {
                    document.body.removeChild(modalDiv);
                }
                
                if (document.head.contains(style)) {
                    document.head.removeChild(style);
                }
            }, 300);
        }, displayTime);
    },
    
    // Joker ma�azas� say�m g�sterimini g�ncelle
    updateJokerStoreDisplay: function(modal) {
        console.log('Joker ma�azas� say�mlar� g�ncelleniyor...');
        console.log('Mevcut joker envanteri:', JSON.stringify(this.jokerInventory));
        console.log('Mevcut toplam puan:', this.totalScore);
        
        const ownedCountElements = modal.querySelectorAll('.joker-owned-count');
        ownedCountElements.forEach((el) => {
            const jokerType = el.closest('.joker-store-item').dataset.joker;
            const count = this.jokerInventory[jokerType] || 0;
            el.textContent = count;
            console.log(`${jokerType} joker say�s� ma�azada g�ncellendi: ${count}`);
        });
        
        // Sat�n alma butonlar�n�n durumunu da g�ncelle
        const buyButtons = modal.querySelectorAll('.joker-buy-btn');
        buyButtons.forEach((btn) => {
            const item = btn.closest('.joker-store-item');
            const price = parseInt(item.dataset.price);
            btn.disabled = this.totalScore < price;
            console.log(`Buton durumu g�ncellendi: Fiyat ${price}, Toplam puan ${this.totalScore}, Aktif: ${this.totalScore >= price}`);
        });
    },

    // Joker kullan�m durumlar�n� s�f�rla (envanter korunur)
    resetJokerUsage: function() {
        console.log('Joker kullan�m durumlar� s�f�rlan�yor...');
        
        // Kullan�lm�� jokerleri s�f�rla
        this.jokersUsed = {fifty: false, hint: false, time: false, skip: false};
        this.skipJokerActive = false;
        
        // 50:50 joker ile devre d��� b�rak�lan se�enekleri tekrar aktif et
        this.resetDisabledOptions();
        
        // Joker butonlar�n� g�ncelle
        setTimeout(() => {
            this.updateJokerButtons();
        }, 100);
    },

    // Reset jokers for new game (sadece oyun ba�lang�c�nda �a�r�lmal�)
    resetJokers: function() {
        console.log('resetJokers �a�r�ld�, mevcut envanter:', JSON.stringify(this.jokerInventory));
        
        // �nce joker kullan�m durumlar�n� s�f�rla
        this.resetJokerUsage();
        
        // Envanter kontrol� - sadece tan�ms�z veya bo� ise ba�lang�� jokerleri ver
        if (!this.jokerInventory || Object.keys(this.jokerInventory).length === 0) {
            console.log('�lk oyun veya envanter tan�ms�z, ba�lang�� jokerleri veriliyor...');
            this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
            this.saveJokerInventory();
        }
        
        // Mevcut envanterde eksik joker t�rleri varsa tamamla
        if (this.jokerInventory.fifty === undefined) this.jokerInventory.fifty = 0;
        if (this.jokerInventory.hint === undefined) this.jokerInventory.hint = 0;
        if (this.jokerInventory.time === undefined) this.jokerInventory.time = 0;
        if (this.jokerInventory.skip === undefined) this.jokerInventory.skip = 0;
        
        console.log('resetJokers tamamland�, final envanter:', JSON.stringify(this.jokerInventory));
    },
    
    // Yeni oyun i�in joker envanterini yenile
    refreshJokersForNewGame: function() {
        console.log('refreshJokersForNewGame �a�r�ld�, jokerler yenileniyor...');
        
        // �nce joker kullan�m durumlar�n� s�f�rla
        this.resetJokerUsage();
        
        // Her yeni oyunda fresh jokerler ver
        this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
        this.saveJokerInventory();
        
        console.log('Jokerler yenilendi, yeni envanter:', JSON.stringify(this.jokerInventory));
    },
    
    // 50:50 joker ile devre d��� b�rak�lan se�enekleri s�f�rla
    resetDisabledOptions: function() {
        const disabledOptions = document.querySelectorAll('.option.disabled-option');
        disabledOptions.forEach(option => {
            option.style.opacity = '';
            option.style.pointerEvents = '';
            option.style.background = '';
            option.style.color = '';
            option.classList.remove('disabled-option');
        });
        
        // �pucu mesajlar�n� da temizle
        const hintMessages = document.querySelectorAll('.hint-message');
        hintMessages.forEach(hint => {
            hint.remove();
        });
    },
    
// @ts-nocheck
/* eslint-disable */
// Bu dosya JavaScript'tir, TypeScript de�ildir.
// Script Version 3.0 - Firebase puan kaydetme sistemi tamamland�

// Tam Ekran Modunu Ayarla
function initFullscreenMode() {
    // PWA tam ekran modunu etkinle�tir
    if ('serviceWorker' in navigator) {
        // PWA modunda �al���yor mu kontrol et
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                           window.navigator.standalone ||
                           document.referrer.includes('android-app://');
        
        if (isStandalone) {
            console.log('? PWA standalone modunda �al���yor');
            
            // Tam ekran i�in CSS s�n�flar� ekle
            document.body.classList.add('pwa-fullscreen');
            document.documentElement.classList.add('pwa-fullscreen');
            
            // Viewport meta tag g�ncelle
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
            }
            
            // Status bar rengi ayarla
            const themeColor = document.querySelector('meta[name="theme-color"]');
            if (themeColor) {
                themeColor.setAttribute('content', '#1e40af');
            }
        } else {
            console.log('?? PWA standalone modunda �al��m�yor - taray�c� modunda');
        }
    }
    
    // CSS ile tam ekran stillerini uygula
    const fullscreenStyles = `
        .pwa-fullscreen {
            height: 100vh !important;
            height: 100dvh !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        .pwa-fullscreen .container {
            height: 100vh !important;
            height: 100dvh !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow-y: auto !important;
        }
        
        /* Safe area i�in padding ekle */
        @supports (padding: max(0px)) {
            .pwa-fullscreen .container {
                padding-top: max(env(safe-area-inset-top), 0px) !important;
                padding-bottom: max(env(safe-area-inset-bottom), 0px) !important;
                padding-left: max(env(safe-area-inset-left), 0px) !important;
                padding-right: max(env(safe-area-inset-right), 0px) !important;
            }
        }
        
        /* Capacitor/Cordova i�in */
        .platform-cordova .pwa-fullscreen,
        .platform-capacitor .pwa-fullscreen {
            height: 100vh !important;
            overflow: hidden !important;
        }
    `;
    
    // Stilleri head'e ekle
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = fullscreenStyles;
    document.head.appendChild(styleSheet);
}

// Sayfa Y�kleme ��lemleri
document.addEventListener('DOMContentLoaded', () => {
    // Tam ekran modunu ba�lat
    initFullscreenMode();
    
    // Ana i�eri�i g�r�n�r yap
    const container = document.querySelector('.container');
    if (container) {
        container.style.visibility = 'visible';
        container.classList.add('fade-in');
    }
});

const quizApp = {
    // DOM Elements
    questionElement: document.getElementById('question'),
    optionsElement: document.getElementById('options'),
    resultElement: document.getElementById('result'),
    scoreElement: document.getElementById('score'),
    restartButton: document.getElementById('restart'),
    quizElement: document.getElementById('quiz'),
    containerElement: document.querySelector('.container'),
    categorySelectionElement: document.getElementById('category-selection'),
    categoriesElement: document.getElementById('categories'),
    nextButton: document.getElementById('next-question'),
    highScoresListElement: document.getElementById('high-scores-list'),
    timeLeftElement: document.getElementById('time-left'),
    badgesContainer: document.getElementById('badges'),
    themeToggle: document.getElementById('checkbox'),
    jokerFiftyBtn: null, // document.getElementById('joker-fifty'),
    jokerHintBtn: null, // document.getElementById('joker-hint'),
    jokerTimeBtn: null, // document.getElementById('joker-time'),
    jokerSkipBtn: null, // document.getElementById('joker-skip'),
    jokerStoreBtn: null, // document.getElementById('joker-store'),
    
    // State Variables
    currentQuestionIndex: 0,
    score: 0,
    totalScore: 0, // <-- EKLEND�: Toplam birikmi� puan
    sessionScore: 0, // <-- EKLEND�: Bu oturumdaki toplam puan
    userLevel: 1, // <-- EKLEND�: Kullan�c� seviyesi
    levelProgress: 0, // <-- EKLEND�: Seviye ilerlemesi (XP)
    correctAnswers: 0,
    selectedCategory: null,
    questions: [],
    allQuestionsData: {},
    questionsData: {}, 
    timerInterval: null,
    timeLeft: 0,
    answeredQuestions: 0,
    answerTimes: [],
    jokersUsed: {fifty: false, hint: false, time: false, skip: false},
    jokerInventory: {fifty: 0, hint: 0, time: 0, skip: 0},
    soundEnabled: true,
    lives: 5,
    currentLevel: 1,
    levelProgress: 0,
    skipJokerActive: false,
    currentSection: 1, // �u anki b�l�m numaras�
    totalSections: 50, // Toplam b�l�m say�s�
    sectionStats: [], // Her b�l�m i�in do�ru/yanl�� cevap istatistiklerini saklayacak dizi
    currentLanguage: 'tr', // Varsay�lan dil
    translatedQuestions: {}, // �evrilmi� sorular
    isLoggedIn: false, // <-- EKLEND�: Kullan�c� giri� durumu
    currentUser: null, // <-- EKLEND�: Mevcut kullan�c�
    userSettings: {}, // <-- EKLEND�: Kullan�c� ayarlar�
    totalScore: 0, // <-- EKLEND�: Toplam puan
    sessionScore: 0, // <-- EKLEND�: Oturum puan�
    userLevel: 1, // <-- EKLEND�: Kullan�c� seviyesi
    levelProgress: 0, // <-- EKLEND�: Seviye ilerlemesi
    
    // Constants
    HIGH_SCORES_KEY: 'quizHighScores',
    MAX_HIGH_SCORES: 5,
    TIME_PER_QUESTION: 45,
    TIME_PER_BLANK_FILLING_QUESTION: 60,
    SEEN_QUESTIONS_KEY: 'quizSeenQuestions',
    QUESTIONS_PER_GAME: 'dynamic', // Art�k kategoriye g�re dinamik
    STATS_KEY: 'quizStats',
    USER_SETTINGS_KEY: 'quizSettings',
    JOKER_INVENTORY_KEY: 'quizJokerInventory',
    LANGUAGE_KEY: 'quizLanguage',
    
    // Ba�lang��
    init: function() {
        console.log("Quiz Uygulamas� Ba�lat�l�yor...");
        
        // �lk Firebase durumu kontrol�
        console.log('?? Firebase �lk Durum Kontrol�:');
        console.log('- Firebase nesnesi:', typeof firebase !== 'undefined' ? 'VAR' : 'YOK');
        console.log('- Firebase.auth:', firebase && firebase.auth ? 'VAR' : 'YOK');
        console.log('- Firebase.firestore:', firebase && firebase.firestore ? 'VAR' : 'YOK');
        
        // Taray�c� �zelliklerini kontrol et
        this.checkBrowserSupport();
        
        try {
            // �nce dil ayarlar�n� y�kle
            this.loadLanguageSettings();
            
            // Kullan�c� aray�z�n� haz�rla
            this.initUI();
            
            // �nce kullan�c� ayarlar�n� y�kle
            this.loadUserSettings();
            
            // Joker tab bar'� ba�lat
            this.initJokerTabBar();
            
            // Kullan�c�n�n quiz modunda olup olmad���n� kontrol et (sayfa yenilemesi senaryosu i�in)
            if (localStorage.getItem('quizModeActive') === 'true' && document.getElementById('quiz').style.display !== 'none') {
                this.activateQuizMode();
            }
            
            // localStorage'dan skor verilerini y�kle
            this.loadScoreFromLocalStorage();
            
            // Soru verilerini y�kle
            this.loadQuestionsData()
                .then(() => {
                    console.log("T�m veriler ba�ar�yla y�klendi.");
                    
                    // Soru verilerinin y�klenip y�klenmedi�ini kontrol et
                    if (!this.questionsData || Object.keys(this.questionsData).length === 0) {
                        console.error("Soru verileri y�klenemedi veya bo�!");
                        
                        // Tekrar y�klemeyi dene
                        this.loadQuestionsData()
                            .then(() => {
                                console.log("�kinci deneme: Soru verileri y�klendi");
                            })
                            .catch(err => {
                                console.error("�kinci deneme ba�ar�s�z:", err);
                                this.showAlert(this.getTranslation('questionLoadError'));
                            });
                    }
                    
                    // Sorular� �evir
                    this.translateQuestions();
                })
                .catch(error => {
                    console.error("Soru verileri y�klenirken hata olu�tu:", error);
                });
        } catch (error) {
            console.error("Ba�latma s�ras�nda kritik hata:", error);
        }
    },
    
    // Mevcut dil i�in metni getir
    getTranslation: function(key) {
        try {
            // Dil dosyas� import edilmi� mi kontrol et
            if (typeof languages === 'undefined') {
                console.warn('Dil dosyas� y�klenemedi. Varsay�lan metin g�steriliyor.');
                return this.getDefaultTranslation(key);
            }
            
            // Mevcut dil i�in �eviri var m�?
            if (languages[this.currentLanguage] && languages[this.currentLanguage][key] !== undefined) {
                return languages[this.currentLanguage][key];
            }
            
            // T�rk�e varsay�lan dil olarak kullan�l�r
            if (languages.tr && languages.tr[key] !== undefined) {
                return languages.tr[key];
            }
            
            // �eviri bulunamazsa, anahtar� d�nd�r
            console.warn(`'${key}' i�in �eviri bulunamad�.`);
            return key;
        } catch (error) {
            console.error('�eviri al�n�rken hata olu�tu:', error);
            return this.getDefaultTranslation(key);
        }
    },
    
    // Varsay�lan �evirileri d�nd�r
    getDefaultTranslation: function(key) {
        // S�k kullan�lan metinler i�in varsay�lan de�erler
        const defaults = {
            'appName': 'Quiz Game',
            'loading': 'Loading...',
            'restart': 'Restart',
            'next': 'Next',
            'score': 'Score',
            'correct': 'Correct!',
            'wrong': 'Wrong!',
            'timeUp': 'Time is up!',
            'correctAnswer': 'Correct answer',
            'questionImage': 'Question image',
            'true': 'TRUE',
            'false': 'FALSE'
        };
        
        return defaults[key] || key;
    },
    
    // Dil ayarlar�n� y�kle
    loadLanguageSettings: function() {
        try {
            // Local storage'dan tercihler ekran�nda se�ilen dili kontrol et
            const userLanguage = localStorage.getItem('user_language');
            
            if (userLanguage && ['tr', 'en', 'de'].includes(userLanguage)) {
                this.currentLanguage = userLanguage;
                console.log(`Kullan�c� tercih etti�i dil: ${this.currentLanguage}`);
                
                // HTML dil etiketini g�ncelle
                document.documentElement.setAttribute('lang', this.currentLanguage);
                document.documentElement.setAttribute('data-language', this.currentLanguage);
            } else {
                // Kaydedilmi� dil ayar� varsa y�kle
                const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY);
                if (savedLanguage && ['tr', 'en', 'de'].includes(savedLanguage)) {
                    this.currentLanguage = savedLanguage;
                    console.log(`Kaydedilmi� dil ayar�: ${this.currentLanguage}`);
                } else {
                    // Taray�c� dilini kontrol et
                    const browserLang = navigator.language || navigator.userLanguage;
                    if (browserLang) {
                        const lang = browserLang.substring(0, 2).toLowerCase();
                        
                        // Desteklenen diller
                        if (['tr', 'en', 'de'].includes(lang)) {
                            this.currentLanguage = lang;
                        } else {
                            // Desteklenmeyen dil durumunda varsay�lan olarak �ngilizce
                            this.currentLanguage = 'en';
                        }
                        
                        console.log(`Taray�c� dili: ${browserLang}, Uygulama dili: ${this.currentLanguage}`);
                    }
                }
            }
            
            // Dil de�i�tirme elementini olu�tur
            this.createLanguageSelector();
        } catch (e) {
            console.error("Dil ayarlar� y�klenirken hata:", e);
            this.currentLanguage = 'tr'; // Hata durumunda varsay�lan dil
        }
    },
    
    // Dil se�ici olu�tur
    createLanguageSelector: function() {
        // Men�de zaten bir dil se�ici oldu�u i�in sayfa �zerinde ekstra bir dil se�ici olu�turmuyoruz
        console.log("Men�de zaten dil se�im alan� bulundu�u i�in ek bir dil se�ici olu�turulmad�");
        return;
    },
    
    // Dili de�i�tir
    switchLanguage: function(language) {
        if (this.currentLanguage === language) return;
        
        console.log(`Dil de�i�tiriliyor: ${this.currentLanguage} -> ${language}`);
        
        // Dili kaydet
        this.currentLanguage = language;
        localStorage.setItem(this.LANGUAGE_KEY, language);
        localStorage.setItem('quizLanguage', language); // Eski referans i�in uyumluluk
        
        // HTML etiketinin dil �zelliklerini g�ncelle
        const htmlRoot = document.getElementById('html-root') || document.documentElement;
        htmlRoot.setAttribute('lang', language);
        htmlRoot.setAttribute('data-language', language);
        
        // Soru verilerini yeniden y�kle
        this.loadQuestionsData()
            .then(() => {
                console.log("Dil de�i�ikli�i sonras� yeni soru verileri y�klendi");
                
                // UI metinlerini g�ncelle
                this.updateUITexts();
                
                // Dil de�i�ikli�i olay�n� tetikle - bu, di�er mod�llerin �evirilerini g�ncellemesini sa�lar
                document.dispatchEvent(new Event('languageChanged'));
                
                // E�er aktif bir kategori varsa ve sorular g�steriliyorsa, sorular� g�ncelle
                if (this.selectedCategory && this.quizElement && this.quizElement.style.display !== 'none') {
                    // Kategorileri yeniden g�ster (mevcut dildeki kategorileri g�stermek i�in)
                    this.displayCategories();
                    
                    // Se�ili kategori ad�n� kontrol et ve mevcut dildeki kar��l���n� bul
                    const translatedCategoryName = this.getCurrentCategoryName(this.selectedCategory);
                    
                    if (this.questionsData[translatedCategoryName]) {
                        // Kategori mevcut dildeki sorularla g�ncellenir
                        this.selectedCategory = translatedCategoryName;
                        
                        // Sorular� g�ncelle
                        this.questions = this.shuffleArray([...this.questionsData[this.selectedCategory]]);
                        this.arrangeBlankFillingFirst();
                        
                        // Mevcut soruyu s�f�rla ve ilk soruyu g�ster
                        this.currentQuestionIndex = 0;
                        this.displayQuestion(this.questions[0]);
                    }
                }
                
                // Mevcut g�sterilen i�eri�i g�ncelle
                this.updateCurrentContent();
                
                // Dil de�i�ikli�ini kullan�c�ya bildir
                this.showToast(this.getTranslation('languageChanged'), 'toast-success');
                this.updateResultAndWarningTexts();
            })
            .catch(error => {
                console.error("Dil de�i�ikli�i sonras� soru verileri y�klenirken hata:", error);
                this.showToast("Sorular y�klenirken bir hata olu�tu", "toast-error");
            });
    },
    
    // Sorular� �evir
    translateQuestions: function() {
        if (!this.questionsData || Object.keys(this.questionsData).length === 0) {
            console.warn('�evrilecek soru verisi bulunamad�.');
            return;
        }
        
        if (this.currentLanguage === 'tr') {
            // T�rk�e i�in �eviriye gerek yok, orijinal sorular� kullan
            this.translatedQuestions = this.cloneObject(this.questionsData);
            // Mevcut sorular� g�ncelle
            this.updateCurrentQuestionsWithTranslations();
            return;
        }
        
        // �evrilmi� sorular zaten varsa ve ge�erli dilde ise tekrar �evirme
        if (this.hasTranslatedQuestions(this.currentLanguage)) {
            console.log(`${this.currentLanguage} dilinde �evrilmi� sorular zaten mevcut, tekrar �evirme i�lemi yap�lmayacak.`);
            
            // Mevcut sorular� g�ncelle
            this.updateCurrentQuestionsWithTranslations();
            return;
        }
        
        console.log(`Sorular ${this.currentLanguage} diline �evriliyor...`);
        
        // Bo� �eviri nesnesini olu�tur
        this.translatedQuestions = {};
        
        // Her kategori i�in
        Object.keys(this.questionsData).forEach(categoryTR => {
            // Kategori ad�n� �evir
            const translatedCategoryName = this.getTranslatedCategoryName(categoryTR, this.currentLanguage);
            this.translatedQuestions[translatedCategoryName] = [];
            
            // Kategorideki her soru i�in
            this.questionsData[categoryTR].forEach(questionObj => {
                // Soru nesnesinin kopyas�n� olu�tur
                const translatedQuestion = this.cloneObject(questionObj);
                
                // Translations �zelli�i varsa ve istenen dilde �eviri varsa kullan
                if (questionObj.translations && questionObj.translations[this.currentLanguage]) {
                    const translation = questionObj.translations[this.currentLanguage];
                    if (translation.question) translatedQuestion.question = translation.question;
                    if (translation.options) translatedQuestion.options = translation.options;
                    if (translation.correctAnswer) translatedQuestion.correctAnswer = translation.correctAnswer;
                } else {
                    // Soru metnini ve ��klar� �evir (otomatik �eviri yerine �zelle�tirilmi� metin)
                    if (this.currentLanguage === 'en') {
                        translatedQuestion.question = this.translateToEnglish(questionObj.question);
                        
                        if (Array.isArray(translatedQuestion.options)) {
                            translatedQuestion.options = translatedQuestion.options.map(option => 
                                this.translateToEnglish(option)
                            );
                        }
                        
                        if (translatedQuestion.correctAnswer) {
                            translatedQuestion.correctAnswer = this.translateToEnglish(questionObj.correctAnswer);
                        }
                        
                        // Do�ru/Yanl�� sorular� i�in
                        if (translatedQuestion.type === "Do�ruYanl��" || translatedQuestion.type === "TrueFalse") {
                            translatedQuestion.type = "TrueFalse";
                            
                            if (translatedQuestion.correctAnswer === "DO�RU" || translatedQuestion.correctAnswer === "YANLI�") {
                                translatedQuestion.correctAnswer = trueFalseMapping[translatedQuestion.correctAnswer].en;
                            }
                        }
                    } else if (this.currentLanguage === 'de') {
                        translatedQuestion.question = this.translateToGerman(questionObj.question);
                        
                        if (Array.isArray(translatedQuestion.options)) {
                            translatedQuestion.options = translatedQuestion.options.map(option => 
                                this.translateToGerman(option)
                            );
                        }
                        
                        if (translatedQuestion.correctAnswer) {
                            translatedQuestion.correctAnswer = this.translateToGerman(questionObj.correctAnswer);
                        }
                        
                        // Do�ru/Yanl�� sorular� i�in
                        if (translatedQuestion.type === "Do�ruYanl��" || translatedQuestion.type === "TrueFalse") {
                            translatedQuestion.type = "TrueFalse";
                            
                            if (translatedQuestion.correctAnswer === "DO�RU" || translatedQuestion.correctAnswer === "YANLI�") {
                                translatedQuestion.correctAnswer = trueFalseMapping[translatedQuestion.correctAnswer].de;
                            }
                        }
                    }
                }
                
                // Kategori ad�n� g�ncelle
                translatedQuestion.category = translatedCategoryName;
                
                // Bo�luk doldurma sorular� i�in
                if (translatedQuestion.type === "BlankFilling" && translatedQuestion.choices) {
                    // Harfleri �evir (�rne�in Almanca'da �, � gibi harfler i�in)
                    translatedQuestion.choices = this.translateChoices(questionObj.choices, this.currentLanguage);
                }
                
                // �evrilmi� soruyu kategoriye ekle
                this.translatedQuestions[translatedCategoryName].push(translatedQuestion);
            });
        });
        
        console.log(`Soru �evirisi tamamland�. ${Object.keys(this.translatedQuestions).length} kategori �evrildi.`);
        
        // Mevcut sorular� g�ncelle
        this.updateCurrentQuestionsWithTranslations();
    },
    
    // �evrilmi� sorular var m� kontrol et
    hasTranslatedQuestions: function(language) {
        // �evrilmi� sorular bo�sa veya dil T�rk�e ise kontrol etmeye gerek yok
        if (language === 'tr' || !this.translatedQuestions) {
            return false;
        }
        
        // �evrilmi� sorular�n i�inde en az bir kategori var m�?
        const hasCategories = Object.keys(this.translatedQuestions).length > 0;
        
        if (hasCategories) {
            // Rastgele bir kategori se�
            const sampleCategory = Object.keys(this.translatedQuestions)[0];
            
            // Bu kategoride soru var m�?
            const hasQuestions = this.translatedQuestions[sampleCategory] && 
                                this.translatedQuestions[sampleCategory].length > 0;
            
            if (hasQuestions) {
                // Rastgele bir soru se�
                const sampleQuestion = this.translatedQuestions[sampleCategory][0];
                
                // Bu soru �evrilmi� mi? (Kategori ad�n� kontrol et)
                // T�rk�e kategorinin �evrilmi� ad�n� bul
                const originalCategoryName = Object.keys(this.questionsData)[0]; // �lk T�rk�e kategori
                const expectedTranslatedName = this.getTranslatedCategoryName(originalCategoryName, language);
                
                // �evirinin do�ru dilde olup olmad���n� kontrol et
                return sampleCategory === expectedTranslatedName;
            }
        }
        
        return false;
    },
    
    // Mevcut sorular� �evirilerle g�ncelle
    updateCurrentQuestionsWithTranslations: function() {
        // E�er bir kategori se�ilmi�se ve sorular y�klenmi�se, mevcut sorular� da g�ncelle
        if (this.selectedCategory && this.questions.length > 0) {
            console.log(`Se�ili kategori: ${this.selectedCategory}`);
            
            // Mevcut sorular dil de�i�iminden sonra g�ncellenecek
            const translatedCategoryName = this.getCurrentCategoryName(this.selectedCategory);
            
            console.log(`Se�ili kategori: ${this.selectedCategory}, �evrilmi� ad�: ${translatedCategoryName}`);
            
            // �evrilmi� kategorideki sorular� al
            const translatedCategoryQuestions = this.currentLanguage === 'tr' ? 
                this.questionsData[translatedCategoryName] : 
                this.translatedQuestions[translatedCategoryName];
            
            if (translatedCategoryQuestions) {
                console.log(`${translatedCategoryName} kategorisinde ${translatedCategoryQuestions.length} �evrilmi� soru bulundu.`);
                
                // Sorular� g�ncelle
                this.questions = this.shuffleArray([...translatedCategoryQuestions]);
                this.arrangeBlankFillingFirst();
                
                // Mevcut soruyu g�ncelle
                if (this.currentQuestionIndex < this.questions.length) {
                    this.displayQuestion(this.questions[this.currentQuestionIndex]);
                }
            } else {
                console.warn(`${translatedCategoryName} kategorisinde �evrilmi� soru bulunamad�!`);
            }
        }
    },
    
    // Nesne kopyalama (deep clone)
    cloneObject: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // Kategori ad�n� �evir
    getTranslatedCategoryName: function(categoryTR, targetLang) {
        if (categoryMappings[categoryTR] && categoryMappings[categoryTR][targetLang]) {
            return categoryMappings[categoryTR][targetLang];
        }
        
        // E�le�me yoksa orijinal kategori ad�n� d�nd�r
        return categoryTR;
    },
    
    // UI elemanlar�n� g�ncelle
    updateUITexts: function() {
        // Ba�l�k
        document.title = this.getTranslation('appName');
        
        // Navbar ba�l���
        const navbarTitle = document.querySelector('.navbar-title');
        if (navbarTitle) navbarTitle.textContent = this.getTranslation('appName');
        const appTitle = document.querySelector('.app-title');
        if (appTitle) appTitle.textContent = this.getTranslation('appName');
        const mainTitle = document.querySelector('.main-title');
        if (mainTitle) mainTitle.textContent = this.getTranslation('appName');
        
        // Yan men� (sidebar) metinleri
        const sidebarHome = document.querySelector('.sidebar-home');
        if (sidebarHome) sidebarHome.textContent = this.getTranslation('home');
        const sidebarFriends = document.querySelector('.sidebar-friends');
        if (sidebarFriends) sidebarFriends.textContent = this.getTranslation('friends');
        const sidebarLeaderboard = document.querySelector('.sidebar-leaderboard');
        if (sidebarLeaderboard) sidebarLeaderboard.textContent = this.getTranslation('leaderboardMenu');
        
        // Ana men� ba�l���
        const menuTitle = document.querySelector('.menu-title');
        if (menuTitle) {
            menuTitle.textContent = this.getTranslation('quiz');
        }
        
        // Quiz ba�l��� (soru ekran� �st�)
        const quizHeader = document.querySelector('#quiz h2');
        if (quizHeader) {
            quizHeader.textContent = this.getTranslation('quiz');
        }
        
        // ��k�� butonu kald�r�ld�
        
        // Ana men� butonlar�
        const singlePlayerBtn = document.getElementById('single-player-btn');
        if (singlePlayerBtn) {
            singlePlayerBtn.textContent = this.getTranslation('singlePlayer');
        }
        const multiPlayerBtn = document.getElementById('online-game-button');
        if (multiPlayerBtn) {
            multiPlayerBtn.textContent = this.getTranslation('multiPlayer');
        }
        const leaderboardBtn = document.getElementById('view-global-leaderboard');
        if (leaderboardBtn) {
            leaderboardBtn.textContent = this.getTranslation('leaderboard');
        }
        const statsBtn = document.getElementById('show-stats');
        if (statsBtn) {
            statsBtn.textContent = this.getTranslation('statistics');
        }
        const settingsBtn = document.getElementById('show-settings');
        if (settingsBtn) {
            settingsBtn.textContent = this.getTranslation('settings');
        }
        const addQuestionBtn = document.getElementById('add-question-button');
        if (addQuestionBtn) {
            addQuestionBtn.textContent = this.getTranslation('addQuestion');
        }
        // Logout butonu kald�r�ld�
        
        // Kategori ba�l���
        const categoryTitle = document.querySelector('#category-selection h2 span');
        if (categoryTitle) {
            categoryTitle.textContent = this.getTranslation('categories');
        }
        
        // Puan etiketi
        if (this.scoreElement) {
            const scoreLabel = this.scoreElement.querySelector('.score-label');
            if (scoreLabel) {
                scoreLabel.textContent = this.getTranslation('score');
            }
        }
        
        // Sonraki soru butonu
        if (this.nextButton) {
            const nextBtnText = this.nextButton.querySelector('span');
            if (nextBtnText) {
                nextBtnText.textContent = this.getTranslation('next');
            } else {
                this.nextButton.textContent = this.getTranslation('next');
            }
        }
        
        // Yeniden ba�lat butonu
        if (this.restartButton) {
            this.restartButton.textContent = this.getTranslation('restart');
        }
        
        // Joker butonlar�
        this.updateJokerButtonsText();
        
        // Dil etiketi
        const langLabel = document.getElementById('language-label');
        if (langLabel) {
            langLabel.textContent = this.getTranslation('language') + ':';
        }
        
        // Hamburger men� ��eleri - Yeni ID'ler ile g�ncelleme
        const appTitleElement = document.getElementById('menu-app-title');
        if (appTitleElement) {
            appTitleElement.textContent = this.getTranslation('app');
        }
        
        const settingsTitleElement = document.getElementById('menu-settings-title');
        if (settingsTitleElement) {
            settingsTitleElement.textContent = this.getTranslation('settings');
        }
        
        // Men� ��eleri metinleri
        const homeText = document.getElementById('menu-home-text');
        if (homeText) {
            homeText.textContent = this.getTranslation('home');
        }
        
        const profileText = document.getElementById('menu-profile-text');
        if (profileText) {
            profileText.textContent = this.getTranslation('profile');
        }
        
        const friendsText = document.getElementById('menu-friends-text');
        if (friendsText) {
            friendsText.textContent = this.getTranslation('friends');
        }
        
        const leaderboardText = document.getElementById('menu-leaderboard-text');
        if (leaderboardText) {
            leaderboardText.textContent = this.getTranslation('leaderboardMenu');
        }
        
        // Ayarlar metinleri
        const languageText = document.getElementById('menu-language-text');
        if (languageText) {
            languageText.textContent = this.getTranslation('language');
        }
        
        const difficultyText = document.getElementById('menu-difficulty-text');
        if (difficultyText) {
            difficultyText.textContent = this.getTranslation('difficulty');
        }
        
        const soundText = document.getElementById('menu-sound-text');
        if (soundText) {
            soundText.textContent = this.getTranslation('sound');
        }
        
        const themeText = document.getElementById('menu-theme-text');
        if (themeText) {
            themeText.textContent = this.getTranslation('darkTheme');
        }
        
        const logoutText = document.getElementById('menu-logout-text');
        if (logoutText) {
            logoutText.textContent = this.getTranslation('logout');
        }
        
        // Zorluk seviyeleri
        const difficultySelect = document.getElementById('difficulty-level');
        if (difficultySelect) {
            const options = difficultySelect.options;
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                if (option.value === 'easy') {
                    option.textContent = this.getTranslation('easy');
                } else if (option.value === 'medium') {
                    option.textContent = this.getTranslation('medium');
                } else if (option.value === 'hard') {
                    option.textContent = this.getTranslation('hard');
                }
            }
        }
        
        // data-i18n �zniteli�i olan t�m elemanlar� g�ncelle
        const i18nElements = document.querySelectorAll('[data-i18n]');
        i18nElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key && languages[this.currentLanguage] && languages[this.currentLanguage][key]) {
                element.textContent = languages[this.currentLanguage][key];
            }
        });
        

    },
    
    // Joker butonlar� metinlerini g�ncelle
    updateJokerButtonsText: function() {
        if (this.jokerFiftyBtn && !this.jokersUsed.fifty) {
            this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i>`;
        } else if (this.jokerFiftyBtn && this.jokersUsed.fifty) {
            this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i>`;
        }
        
        if (this.jokerHintBtn && !this.jokersUsed.hint) {
            this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i>`;
        } else if (this.jokerHintBtn && this.jokersUsed.hint) {
            this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i>`;
        }
        
        if (this.jokerTimeBtn && !this.jokersUsed.time) {
            this.jokerTimeBtn.innerHTML = `<i class="fas fa-clock"></i>`;
        } else if (this.jokerTimeBtn && this.jokersUsed.time) {
            this.jokerTimeBtn.innerHTML = `<i class="fas fa-clock"></i>`;
        }
        
        if (this.jokerSkipBtn && !this.jokersUsed.skip) {
            this.jokerSkipBtn.innerHTML = `<i class="fas fa-forward"></i>`;
        } else if (this.jokerSkipBtn && this.jokersUsed.skip) {
            this.jokerSkipBtn.innerHTML = `<i class="fas fa-forward"></i>`;
        }
        
        if (this.jokerStoreBtn) {
            this.jokerStoreBtn.innerHTML = `<i class="fas fa-store"></i>`;
        }
    },
    
    // Mevcut i�eri�i g�ncelle
    updateCurrentContent: function() {
        // Ana men� butonlar� ve di�er UI elemanlar�n� g�ncelle
        this.updateUITexts();
        
        // Hangi sayfa g�r�n�rse onu g�ncelle
        if (this.categorySelectionElement && this.categorySelectionElement.style.display !== 'none') {
            // Kategori se�im ekran� g�r�n�yorsa
            this.displayCategories();
        } else if (this.quizElement && this.quizElement.style.display !== 'none' && this.questions.length > 0) {
            // Quiz ekran� g�r�n�yorsa
            if (this.resultElement && this.resultElement.style.display !== 'none') {
                // Sonu� g�steriliyorsa sonu� metnini g�ncelle
                const correctAnswer = this.questions[this.currentQuestionIndex].correctAnswer;
                if (this.resultElement.classList.contains('correct')) {
                    this.resultElement.innerHTML = `
                        <div class="correct-answer-container">
                            <div class="correct-icon"><i class="fas fa-badge-check"></i></div>
                            <div class="correct-text">${this.getTranslation('correct')}</div>
                            <div class="correct-animation">
                                <span>+</span>
                                <span>${Math.max(1, Math.ceil(this.timeLeft / (this.questions[this.currentQuestionIndex].type === "BlankFilling" ? 5 : 3)))}</span>
                            </div>
                        </div>
                        <button id="next-question" class="next-button">${this.getTranslation('next')}</button>
                    `;
                } else if (this.resultElement.classList.contains('wrong')) {
                    this.resultElement.innerHTML = `${this.getTranslation('timeUp')} ${this.getTranslation('correctAnswer')}: <strong>${correctAnswer}</strong>
                        <button id="next-question" class="next-button">${this.getTranslation('next')}</button>`;
                }
            } else {
                // Aktif soru varsa yeniden y�kle
                this.displayQuestion(this.questions[this.currentQuestionIndex]);
            }
        }
        this.updateResultAndWarningTexts();
    },
    
    // Basit �eviri fonksiyonlar� (ger�ek bir projede daha profesyonel bir ��z�m kullan�lmal�d�r)
    translateToEnglish: function(text) {
        // Bo� metin kontrol�
        if (!text) return '';
        
        // Bu sadece basit bir �rnektir - ger�ek projede buraya �zelle�tirilmi� �eviri eklenebilir
        // Not: Ger�ek bir uygulamada burada �nceden haz�rlanm�� �eviriler veya API kullan�labilir
        return text; // �u an i�in orijinal metni koruyoruz
    },
    
    translateToGerman: function(text) {
        // Bo� metin kontrol�
        if (!text) return '';
        
        // Almanca �eviri - bu basit bir �rnek
        return text; // �u an i�in orijinal metni koruyoruz
    },
    
    // Bo�luk doldurma i�in harfleri �evir
    translateChoices: function(choices, targetLang) {
        if (!choices) return [];
        
        // Bu fonksiyon �zellikle Almanca gibi dillerde �, �, � gibi harfler i�in kullan�labilir
        // �u an i�in orijinal harfleri koruyoruz
        return choices;
    },
    
    // Mevcut dil i�in ge�erli kategori ad�n� al
    getCurrentCategoryName: function(originalCategory) {
        if (this.currentLanguage === 'tr') return originalCategory;
        
        // T�rk�e kategori ad� m� kontrol et
        if (categoryMappings[originalCategory] && categoryMappings[originalCategory][this.currentLanguage]) {
            return categoryMappings[originalCategory][this.currentLanguage];
        }
        
        // Bu kategori ad� zaten �evrilmi� bir isim mi kontrol et
        if (reverseCategoryMappings[originalCategory] && 
            reverseCategoryMappings[originalCategory]['tr']) {
            return originalCategory; // Zaten �evrilmi� durumda, aynen d�nd�r
        }
        
        // Burada e�er kategori �evrilmi� bir isimse, mevcut dilde do�ru versiyonunu bul
        for (const [sourceCat, translations] of Object.entries(reverseCategoryMappings)) {
            // E�er bu bir yabanc� kategori ad�ysa ve bizim istedi�imiz dilde bir kar��l��� varsa
            if (sourceCat === originalCategory && translations[this.currentLanguage]) {
                return translations[this.currentLanguage];
            }
        }
        
        // Hi�bir e�le�me bulunamazsa orijinal kategori ad�n� d�nd�r
        return originalCategory;
    },
    
    // Toast mesaj� g�ster
    showToast: function(message, type = 'toast-info') {
        // Toast container'� kontrol et veya olu�tur
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Yeni toast olu�tur
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // �kon ekle
        let icon = '<i class="fas fa-info-circle"></i>';
        if (type === 'toast-success') icon = '<i class="fas fa-check-circle"></i>';
        if (type === 'toast-warning') icon = '<i class="fas fa-exclamation-triangle"></i>';
        if (type === 'toast-error') icon = '<i class="fas fa-times-circle"></i>';
        
        // Toast i�eri�i
        toast.innerHTML = `
            <div class="toast-content">
                ${icon}
                <span>${message}</span>
            </div>
        `;
        
        // Toast'u ekle
        toastContainer.appendChild(toast);
        
        // �pucu jokeri ve s�re jokeri i�in farkl� konumland�rma
        // Toast'� joker butonlar�n�n hemen �zerinde g�ster
        if (message.includes("�pucu jokeri kullan�ld�") || message.includes("S�re jokeri kullan�ld�")) {
            toast.style.position = "fixed";
            toast.style.bottom = "180px"; // Joker butonlar�n�n �zerinde
            toast.style.left = "50%";
            toast.style.transform = "translateX(-50%)";
            toast.style.zIndex = "10002"; // Joker butonlar�ndan daha y�ksek
        }
        
        // Toast'u g�ster
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Toast'u belirli bir s�re sonra kald�r
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    },
    
    // Taray�c� deste�ini kontrol et
    checkBrowserSupport: function() {
        console.log("Taray�c� �zellikleri kontrol ediliyor...");
        
        // localStorage deste�i
        let hasLocalStorage = false;
        try {
            hasLocalStorage = 'localStorage' in window && window.localStorage !== null;
            if (hasLocalStorage) {
                // Test et
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                console.log("localStorage destekleniyor");
                    } else {
                console.warn("localStorage desteklenmiyor");
            }
        } catch (e) {
            console.error("localStorage eri�ilemez:", e);
            hasLocalStorage = false;
        }
        
        // Fetch API deste�i
        const hasFetch = 'fetch' in window;
        console.log("Fetch API deste�i:", hasFetch);
        
        // Firebase SDK varl���
        const hasFirebase = typeof firebase !== 'undefined' && firebase.app;
        console.log("Firebase SDK durumu:", hasFirebase ? "Y�kl�" : "Y�kl� de�il");
        
        // JSON i�leme deste�i
        const hasJSON = typeof JSON !== 'undefined' && typeof JSON.parse === 'function';
        console.log("JSON deste�i:", hasJSON);
        
        // Eksik �zellikler varsa kullan�c�y� bilgilendir
        if (!hasLocalStorage || !hasFetch || !hasJSON) {
            console.warn("Baz� taray�c� �zellikleri eksik, uygulama s�n�rl� �al��abilir");
            // Uyar� mesaj� g�ster
            const warningDiv = document.createElement('div');
            warningDiv.className = 'browser-warning';
            warningDiv.innerHTML = `
                <div class="warning-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${this.getTranslation('browserWarning')}</p>
                    <button class="close-warning">${this.getTranslation('understood')}</button>
                </div>
            `;
            document.body.appendChild(warningDiv);
            
            // Kapat butonuna t�klama olay�
            const closeBtn = warningDiv.querySelector('.close-warning');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    warningDiv.remove();
                });
            }
        }
        
        return {
            localStorage: hasLocalStorage,
            fetch: hasFetch,
            firebase: hasFirebase,
            json: hasJSON
        };
    },
    
    // Joker envanterini y�kle
    loadJokerInventory: function() {
        console.log('Joker envanteri y�kleniyor...');
        console.log('localStorage anahtar�:', this.JOKER_INVENTORY_KEY);
        
        var inventoryJSON = localStorage.getItem(this.JOKER_INVENTORY_KEY);
        console.log('localStorage\'dan al�nan veri:', inventoryJSON);
        
        if (inventoryJSON && inventoryJSON !== 'null' && inventoryJSON !== 'undefined') {
            try {
                const parsed = JSON.parse(inventoryJSON);
                
                // Ge�erli bir obje ve t�m joker t�rleri var m� kontrol et
                if (parsed && typeof parsed === 'object' && 
                    parsed.hasOwnProperty('fifty') && 
                    parsed.hasOwnProperty('hint') && 
                    parsed.hasOwnProperty('time') && 
                    parsed.hasOwnProperty('skip')) {
                    
                    this.jokerInventory = parsed;
                    console.log("Joker envanteri ba�ar�yla y�klendi:", this.jokerInventory);
                } else {
                    console.warn("Ge�ersiz joker envanteri format�, varsay�lan envanter atan�yor");
                    this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
                    this.saveJokerInventory();
                }
            } catch (e) {
                console.error("Joker envanteri y�klenirken hata olu�tu:", e);
                this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
                this.saveJokerInventory();
                console.log("Varsay�lan envanter atand�:", this.jokerInventory);
            }
        } else {
            // �lk kez �al��t�r�l�yorsa veya ge�ersiz veri varsa her joker t�r�nden birer tane ver
            console.log("�lk kez �al��t�r�l�yor veya ge�ersiz veri, varsay�lan envanter olu�turuluyor...");
            this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
            this.saveJokerInventory();
        }
        
        // Negatif de�erleri �nle
        Object.keys(this.jokerInventory).forEach(key => {
            if (this.jokerInventory[key] < 0) {
                this.jokerInventory[key] = 0;
            }
        });
        
        // Final kontrol
        console.log('loadJokerInventory tamamland�, final envanter:', this.jokerInventory);
    },
    
    // Joker envanterini kaydet
    saveJokerInventory: function() {
        try {
            localStorage.setItem(this.JOKER_INVENTORY_KEY, JSON.stringify(this.jokerInventory));
            console.log("Joker envanteri kaydedildi:", this.jokerInventory);
            
            // Kaydetmenin ba�ar�l� olup olmad���n� kontrol et
            var saved = localStorage.getItem(this.JOKER_INVENTORY_KEY);
            if (saved) {
                var parsedSaved = JSON.parse(saved);
                console.log("Kaydedilen veri do�ruland�:", parsedSaved);
            } else {
                console.error("Joker envanteri kaydedilemedi!");
            }
        } catch (e) {
            console.error("Joker envanteri kaydedilirken hata olu�tu:", e);
        }
    },
    
    // Joker butonlar�na olay dinleyicileri ekle
    addJokerEventListeners: function() {
        console.log('addJokerEventListeners �a�r�ld�...');
        
        // Elementleri dinamik olarak al
        this.jokerFiftyBtn = document.getElementById('joker-fifty');
        this.jokerHintBtn = document.getElementById('joker-hint');
        this.jokerTimeBtn = document.getElementById('joker-time');
        this.jokerSkipBtn = document.getElementById('joker-skip');
        this.jokerStoreBtn = document.getElementById('joker-store');
        
        console.log('jokerFiftyBtn:', this.jokerFiftyBtn);
        console.log('jokerHintBtn:', this.jokerHintBtn);
        console.log('jokerTimeBtn:', this.jokerTimeBtn);
        console.log('jokerSkipBtn:', this.jokerSkipBtn);
        console.log('jokerStoreBtn:', this.jokerStoreBtn);
        
        // Mobil debug i�in
        console.log('Mobile device check:', /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        console.log('Touch events supported:', 'ontouchstart' in window);
        
        // Joker store modal element kontrol�
        const jokerStoreModal = document.getElementById('joker-store-modal');
        console.log('Joker store modal element:', jokerStoreModal);
        
        // 50:50 jokeri
        if (this.jokerFiftyBtn) {
            this.jokerFiftyBtn.addEventListener('click', () => {
                if (this.jokerFiftyBtn.disabled) return;
                
                console.log('50:50 joker kullan�l�yor...');
                
                // Mevcut sorunun do�ru cevab�n� al
                const currentQuestion = this.questions[this.currentQuestionIndex];
                const correctAnswer = currentQuestion.correctAnswer;
                
                // BlankFilling sorular�nda 50:50 joker kullan�lamaz
                if (currentQuestion.type === "BlankFilling") {
                    console.warn('BlankFilling sorular�nda 50:50 joker kullan�lamaz');
                    this.showToast("Bo�luk doldurma sorular�nda 50:50 joker kullan�lamaz!", "toast-warning");
                    return;
                }
                
                // Do�ruYanl�� sorular�nda da 50:50 joker kullan�lamaz
                if (currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse") {
                    console.warn('Do�ru/Yanl�� sorular�nda 50:50 joker kullan�lamaz');
                    this.showToast("Do�ru/Yanl�� sorular�nda 50:50 joker kullan�lamaz!", "toast-warning");
                    return;
                }
                
                console.log('Do�ru cevap:', correctAnswer);
                
                // Sadece aktif quiz container'daki se�enekleri al
                const optionsContainer = document.getElementById('options');
                const options = optionsContainer ? optionsContainer.querySelectorAll('.option') : document.querySelectorAll('#options .option');
                console.log('Bulunan se�enekler:', options.length);
                console.log('Options container:', optionsContainer);
                
                if (options.length < 3) {
                    console.warn('Yeterli se�enek yok, 50:50 joker kullan�lamaz');
                    this.showToast("Bu soru tipinde 50:50 joker kullan�lamaz!", "toast-warning");
                    return;
                }
                
                // Yanl�� ��klar� bul - case insensitive kar��la�t�rma
                const wrongOptions = Array.from(options).filter((option, index) => {
                    const optionText = option.textContent.trim();
                    const isCorrect = optionText.toLowerCase() === correctAnswer.toLowerCase();
                    console.log(`Se�enek ${index + 1}: "${optionText}" | Do�ru cevap: "${correctAnswer}" | E�it mi: ${isCorrect}`);
                    return !isCorrect;
                });
                
                console.log('Toplam se�enek say�s�:', options.length);
                console.log('Yanl�� se�enek say�s�:', wrongOptions.length);
                console.log('Do�ru se�enek say�s�:', options.length - wrongOptions.length);
                
                if (wrongOptions.length < 2) {
                    console.warn('Yeterli yanl�� se�enek yok');
                    this.showToast("Bu soruda yeterli yanl�� se�enek yok!", "toast-warning");
                    return;
                }
                
                // �ki yanl�� ��kk� rastgele se�
                const shuffledWrong = this.shuffleArray([...wrongOptions]);
                const toHide = shuffledWrong.slice(0, 2);
                
                console.log('S�nd�r�lecek se�enekler:', toHide.length);
                
                // Se�ili ��klar� s�nd�r
                toHide.forEach(option => {
                    option.style.opacity = '0.3';
                    option.style.pointerEvents = 'none';
                    option.style.background = 'linear-gradient(135deg, #ddd, #ccc)';
                    option.style.color = '#666';
                    option.style.textDecoration = 'line-through';
                    option.style.filter = 'blur(1px)';
                    option.style.border = '2px solid #f0f0f0';
                    option.style.transform = 'scale(0.95)';
                    option.style.transition = 'all 0.3s ease';
                    option.classList.add('disabled-option');
                    
                    // X i�areti ekle
                    const xMark = document.createElement('div');
                    xMark.innerHTML = '?';
                    xMark.style.cssText = `
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        font-size: 20px;
                        z-index: 10;
                        animation: bounceIn 0.5s ease;
                    `;
                    option.style.position = 'relative';
                    option.appendChild(xMark);
                });
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('fifty');
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const fiftySound = document.getElementById('sound-correct');
                    if (fiftySound) fiftySound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Toast bildirimi g�ster
                this.showToast("50:50 jokeri kullan�ld�! �ki yanl�� ��k s�nd�r�ld�.", "toast-success");
            });
        }
        
        // �pucu jokeri
        if (this.jokerHintBtn) {
            this.jokerHintBtn.addEventListener('click', () => {
                if (this.jokerHintBtn.disabled) return;
                
                console.log('�pucu joker kullan�l�yor...');
                
                // Mevcut soru i�in bir ipucu g�ster
                const currentQuestion = this.questions[this.currentQuestionIndex];
                let hint = '';
                
                // �pucu olu�tur - farkl� soru tiplerine g�re
                if (currentQuestion.category === "Bo�luk Doldurma" || currentQuestion.type === "BlankFilling") {
                    hint = "�pucu: Cevab�n ilk harfi \"" + currentQuestion.correctAnswer.charAt(0) + "\" ";
                    if (currentQuestion.correctAnswer.length > 3) {
                        hint += "ve son harfi \"" + currentQuestion.correctAnswer.charAt(currentQuestion.correctAnswer.length - 1) + "\"";
                    }
                } else if (currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse") {
                    // Do�ru/Yanl�� sorular i�in �zel ipucu
                    const correctAnswer = currentQuestion.correctAnswer.toLowerCase();
                    if (correctAnswer === 'do�ru' || correctAnswer === 'true' || correctAnswer === 'evet') {
                        hint = "�pucu: Bu ifade do�ru bir bilgidir.";
                    } else {
                        hint = "�pucu: Bu ifadede bir yanl��l�k vard�r.";
                    }
                } else {
                    const correctAnswer = currentQuestion.correctAnswer;
                    // Cevab�n ilk ve varsa son harfini ipucu olarak ver
                    hint = "�pucu: Do�ru cevab�n ilk harfi \"" + correctAnswer.charAt(0) + "\" ";
                    if (correctAnswer.length > 3) {
                        hint += "ve son harfi \"" + correctAnswer.charAt(correctAnswer.length - 1) + "\"";
                    }
                }
                
                console.log('Olu�turulan ipucu:', hint);
                
                // �pucunu g�ster
                const hintElement = document.createElement('div');
                hintElement.className = 'hint-message';
                hintElement.innerHTML = '<i class="fas fa-lightbulb"></i> ' + hint;
                hintElement.style.cssText = `
                    background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
                    color: #2d3436;
                    padding: 15px 20px;
                    margin: 15px 0;
                    border-radius: 10px;
                    border-left: 4px solid #e17055;
                    box-shadow: 0 4px 15px rgba(253, 203, 110, 0.3);
                    animation: fadeInUp 0.5s ease;
                    font-weight: 600;
                    text-align: center;
                `;
                
                // �pucu mesaj�n� ekleme
                const questionElement = document.getElementById('question');
                if (questionElement && questionElement.parentNode) {
                    // Eski ipucu mesaj�n� kald�r
                    const oldHint = document.querySelector('.hint-message');
                    if (oldHint) oldHint.remove();
                    
                    // Yeni ipucunu ekle
                    questionElement.parentNode.insertBefore(hintElement, questionElement.nextSibling);
                    console.log('�pucu mesaj� DOM\'a eklendi');
                }
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('hint');
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const hintSound = document.getElementById('sound-correct');
                    if (hintSound) hintSound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Toast bildirimi g�ster
                this.showToast("�pucu jokeri kullan�ld�! " + hint, "toast-success");
            });
        }
        
        // +S�re jokeri
        if (this.jokerTimeBtn) {
            this.jokerTimeBtn.addEventListener('click', () => {
                if (this.jokerTimeBtn.disabled) return;
                
                console.log('S�re joker kullan�l�yor...');
                console.log('Kullan�m �ncesi s�re:', this.timeLeft);
                
                // Mevcut sorunun s�resini 15 saniye uzat
                this.timeLeft += 15;
                
                console.log('Kullan�m sonras� s�re:', this.timeLeft);
                
                // S�re g�stergesini g�ncelle
                this.updateTimeDisplay();
                
                // Zaman�n azald���n� belirten s�n�f� kald�r
                if (this.timeLeftElement && this.timeLeftElement.classList.contains('time-low')) {
                    this.timeLeftElement.classList.remove('time-low');
                }
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('time');
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const timeSound = document.getElementById('sound-correct');
                    if (timeSound) timeSound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Toast bildirimi g�ster
                this.showToast("S�re jokeri kullan�ld�! 15 saniye eklendi. Yeni s�re: " + this.timeLeft + " saniye", "toast-success");
            });
        }
        
        // Pas jokeri
        if (this.jokerSkipBtn) {
            this.jokerSkipBtn.addEventListener('click', () => {
                if (this.jokerSkipBtn.disabled) return;
                
                console.log('Pas joker kullan�l�yor...');
                console.log('Pas joker kullan�m �ncesi envanter:', JSON.stringify(this.jokerInventory));
                
                // Joker envanterini kontrol et
                if (this.jokerInventory.skip <= 0) {
                    console.warn('Pas joker envanteri bo�!');
                    this.showToast("Pas jokeriniz kalmad�!", "toast-warning");
                    return;
                }
                
                // S�reyi s�f�rlamak yerine do�rudan sonraki soruya ge�i� yapal�m
                clearInterval(this.timerInterval);
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const skipSound = document.getElementById('sound-correct');
                    if (skipSound) skipSound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('skip');
                
                // Toast bildirimi g�ster
                this.showToast("Pas jokeri kullan�ld�! Sonraki soruya ge�iliyor.", "toast-success");
                
                console.log('Pas joker kullan�m sonras� envanter:', JSON.stringify(this.jokerInventory));
                
                // Bir sonraki soruya ge�
                setTimeout(() => {
                    this.showNextQuestion();
                }, 800);
            });
        }
        
        // Joker ma�azas� butonu
        if (this.jokerStoreBtn) {
            // Click event (desktop)
            this.jokerStoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openJokerStore();
            });
            
            // Touch event (mobile)
            this.jokerStoreBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            
            this.jokerStoreBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openJokerStore();
            });
            
            // Mobil cihazlarda butonun t�klanabilir oldu�unu garanti et
            this.jokerStoreBtn.style.cursor = 'pointer';
            this.jokerStoreBtn.style.touchAction = 'manipulation';
        }
    },
    
    // Joker ma�azas�n� a�
    openJokerStore: function() {
        console.log('?? Joker ma�azas� a��l�yor...');
        console.log('?? User Agent:', navigator.userAgent);
        console.log('?? Mevcut joker envanteri:', JSON.stringify(this.jokerInventory));
        console.log('?? Mevcut puan:', this.score);
        
        var modal = document.getElementById('joker-store-modal');
        var closeBtn = modal.querySelector('.close-modal');
        var buyButtons = modal.querySelectorAll('.joker-buy-btn');
        var pointsDisplay = document.getElementById('joker-store-points-display');
        
        // Mevcut toplam puanlar� ve joker envanterini g�ster (misafir i�in sessionScore kullan)
        const currentPoints = this.isLoggedIn ? this.totalScore : this.sessionScore;
        pointsDisplay.textContent = currentPoints || 0;
        console.log('?? Joker ma�azas� - G�sterilen puan: ' + currentPoints + ' (Giri� durumu: ' + (this.isLoggedIn ? 'Kay�tl�' : 'Misafir') + ')');
        console.log('?? Detay - totalScore: ' + this.totalScore + ', sessionScore: ' + this.sessionScore);
        
        // Oyun ekran�ndaki joker butonlar�n� da g�ncelle
        this.updateJokerButtons();
        
        // Joker miktarlar�n� g�ncelle
        this.updateJokerStoreDisplay(modal);
        
        // Sat�n alma butonlar�n� etkinle�tir
        buyButtons.forEach(function(btn) {
            var item = btn.closest('.joker-store-item');
            var jokerType = item.dataset.joker;
            var price = parseInt(item.dataset.price);
            
            // Yeterli puan varsa butonu etkinle�tir (misafir i�in sessionScore kullan)
            const availablePoints = this.isLoggedIn ? this.totalScore : this.sessionScore;
            btn.disabled = availablePoints < price;
            
            // Sat�n alma olay�
            var self = this;
            btn.onclick = function() {
                const availablePoints = self.isLoggedIn ? self.totalScore : self.sessionScore;
                console.log('Joker sat�n alma denemesi: ' + jokerType + ', Fiyat: ' + price + ', Mevcut Puan: ' + availablePoints + ' (' + (self.isLoggedIn ? 'totalScore' : 'sessionScore') + ')');
                console.log('Sat�n alma �ncesi envanter:', JSON.stringify(self.jokerInventory));
                
                if (availablePoints >= price) {
                    // Puan� azalt (misafir i�in sessionScore, kay�tl� i�in totalScore)
                    if (self.isLoggedIn) {
                    self.totalScore -= price;
                    } else {
                        self.sessionScore -= price;
                    }
                    
                    // PUANI FIREBASE'E KAYDET
                    if (self.isLoggedIn) {
                        self.delayedSaveUserData(); // Firebase'e geciktirilmi� kaydet
                        console.log(`Joker sat�n alma: ${price} puan harcand�. Yeni toplam: ${self.totalScore}`);
                    }
                    
                    // Jokeri envantere ekle
                    var previousCount = self.jokerInventory[jokerType] || 0;
                    self.jokerInventory[jokerType]++;
                    
                    console.log(`${jokerType} joker say�s�: ${previousCount} -> ${self.jokerInventory[jokerType]}`);
                    
                    // Joker envanterini kaydet
                    self.saveJokerInventory();
                    
                    // G�stergeleri g�ncelle (misafir i�in sessionScore kullan)
                    const updatedPoints = self.isLoggedIn ? self.totalScore : self.sessionScore;
                    pointsDisplay.textContent = updatedPoints;
                    
                    // Joker ma�azas�ndaki say�mlar� ve buton durumlar�n� g�ncelle
                    self.updateJokerStoreDisplay(modal);
                    
                    // OYUN EKRANINDAK� JOKER BUTONLARINI DA G�NCELLE
                    self.updateJokerButtons();
                    
                    // Skor g�sterimini g�ncelle
                    self.updateScoreDisplay();
                    
                    // Toast bildirimi g�ster
                    var jokerName = jokerType === 'fifty' ? '50:50' : 
                        jokerType === 'hint' ? '�pucu' : 
                        jokerType === 'time' ? 'S�re' : 'Pas';
                    self.showToast(jokerName + ' jokeri sat�n al�nd�!', "toast-success");
                    
                    // Joker butonlar�n� g�ncelle
                    self.updateJokerButtons();
                    
                    console.log('Sat�n alma sonras� envanter:', JSON.stringify(self.jokerInventory));
                } else {
                    console.warn('Yeterli puan yok!');
                    self.showToast("Yeterli puan�n�z yok!", "toast-error");
                }
            };
        }.bind(this));
        
        // Modal� g�ster
        modal.style.display = 'block';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        
        // Mobil cihazlarda modal�n �stte g�r�nmesini garanti et
        modal.style.zIndex = '9999';
        modal.classList.add('show');
        
        // Body scroll'unu engelle (mobil cihazlarda �nemli)
        document.body.style.overflow = 'hidden';
        
        console.log('? Joker ma�azas� modal a��ld�');
        console.log('Modal visibility:', modal.style.visibility);
        console.log('Modal display:', modal.style.display);
        console.log('Modal z-index:', modal.style.zIndex);
        console.log('Modal classList:', modal.classList.toString());
        
        // Kapat butonuna t�klama olay�
        var self = this;
        const closeModal = function() {
            modal.style.display = 'none';
            modal.style.visibility = 'hidden';
            modal.style.opacity = '0';
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Body scroll'unu restore et
            // Ma�aza kapand���nda joker butonlar�n� g�ncelle
            self.updateJokerButtons();
        };
        
        // Close button events (both click and touch)
        closeBtn.onclick = closeModal;
        closeBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            closeModal();
        });
        
        // Modal d���na t�klama olay�
        window.onclick = function(event) {
            if (event.target === modal) {
                closeModal();
            }
        };
        
        // Modal d���na dokunma olay� (mobil)
        modal.addEventListener('touchend', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // Sat�n alma butonlar�na da touch event ekle (mobil)
        buyButtons.forEach(function(btn) {
            btn.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // onclick event'i zaten �al��acak, sadece touch'u handle ediyoruz
            });
        });
    },
    
    // Joker butonlar�n� g�ncelle
    updateJokerButtons: function() {
        // Elementleri dinamik olarak al (e�er hen�z null ise)
        if (!this.jokerFiftyBtn) this.jokerFiftyBtn = document.getElementById('joker-fifty');
        if (!this.jokerHintBtn) this.jokerHintBtn = document.getElementById('joker-hint');
        if (!this.jokerTimeBtn) this.jokerTimeBtn = document.getElementById('joker-time');
        if (!this.jokerSkipBtn) this.jokerSkipBtn = document.getElementById('joker-skip');
        if (!this.jokerStoreBtn) this.jokerStoreBtn = document.getElementById('joker-store');
        
        const currentQuestion = this.questions[this.currentQuestionIndex] || {};
        const isTrueFalse = currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse";
        const isBlankFilling = currentQuestion.type === "BlankFilling";
        
        console.log('updateJokerButtons �a�r�ld�');
        console.log('Mevcut joker envanteri:', JSON.stringify(this.jokerInventory));
        console.log('Joker kullan�m durumlar�:', JSON.stringify(this.jokersUsed));
        console.log('updateJokerButtons - elementler:', {
            fifty: !!this.jokerFiftyBtn,
            hint: !!this.jokerHintBtn,
            time: !!this.jokerTimeBtn,
            skip: !!this.jokerSkipBtn,
            store: !!this.jokerStoreBtn
        });
        
        // 50:50 jokeri
        if (this.jokerFiftyBtn) {
            const fiftyCount = this.jokerInventory.fifty || 0;
            const used = this.jokersUsed.fifty;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${fiftyCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerFiftyBtn.disabled = (fiftyCount <= 0) || used || isTrueFalse || isBlankFilling;
            this.jokerFiftyBtn.style.opacity = (fiftyCount <= 0 || used || isTrueFalse || isBlankFilling) ? '0.3' : '1';
            this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i>${badgeHtml}`;
        }
        // �pucu jokeri
        if (this.jokerHintBtn) {
            const hintCount = this.jokerInventory.hint || 0;
            const used = this.jokersUsed.hint;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${hintCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerHintBtn.disabled = (hintCount <= 0) || used;
            this.jokerHintBtn.style.opacity = (hintCount <= 0 || used) ? '0.3' : '1';
            this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i>${badgeHtml}`;
        }
        // S�re jokeri
        if (this.jokerTimeBtn) {
            const timeCount = this.jokerInventory.time || 0;
            const used = this.jokersUsed.time;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${timeCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerTimeBtn.disabled = (timeCount <= 0) || used;
            this.jokerTimeBtn.style.opacity = (timeCount <= 0 || used) ? '0.3' : '1';
            this.jokerTimeBtn.innerHTML = `<i class="fas fa-clock"></i>${badgeHtml}`;
        }
        // Pas jokeri
        if (this.jokerSkipBtn) {
            const skipCount = this.jokerInventory.skip || 0;
            const used = this.jokersUsed.skip;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${skipCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerSkipBtn.disabled = (skipCount <= 0) || used;
            this.jokerSkipBtn.style.opacity = (skipCount <= 0 || used) ? '0.3' : '1';
            this.jokerSkipBtn.innerHTML = `<i class="fas fa-forward"></i>${badgeHtml}`;
        }
        // Joker ma�azas�
        if (this.jokerStoreBtn) {
            this.jokerStoreBtn.innerHTML = '<i class="fas fa-store"></i>';
        }
    },
    
    // Joker kullanma fonksiyonu
    useJoker: function(jokerType) {
        // Envanter kontrol� - eksiye d��mesin
        if (this.jokerInventory[jokerType] > 0) {
            this.jokersUsed[jokerType] = true;
            this.jokerInventory[jokerType]--;
            this.saveJokerInventory();
            console.log(`${jokerType} joker kullan�ld�. Kalan: ${this.jokerInventory[jokerType]}`);
            
            // Joker butonlar�n� g�ncelle
            this.updateJokerButtons();
        } else {
            console.warn(`${jokerType} joker envanterinde yok!`);
        }
    },
    
    // Joker ma�azas� say�m g�sterimini g�ncelle
    updateJokerStoreDisplay: function(modal) {
        console.log('Joker ma�azas� say�mlar� g�ncelleniyor...');
        console.log('Mevcut joker envanteri:', JSON.stringify(this.jokerInventory));
        console.log('Mevcut toplam puan:', this.totalScore);
        
        const ownedCountElements = modal.querySelectorAll('.joker-owned-count');
        ownedCountElements.forEach((el) => {
            const jokerType = el.closest('.joker-store-item').dataset.joker;
            const count = this.jokerInventory[jokerType] || 0;
            el.textContent = count;
            console.log(`${jokerType} joker say�s� ma�azada g�ncellendi: ${count}`);
        });
        
        // Sat�n alma butonlar�n�n durumunu da g�ncelle
        const buyButtons = modal.querySelectorAll('.joker-buy-btn');
        buyButtons.forEach((btn) => {
            const item = btn.closest('.joker-store-item');
            const price = parseInt(item.dataset.price);
            btn.disabled = this.totalScore < price;
            console.log(`Buton durumu g�ncellendi: Fiyat ${price}, Toplam puan ${this.totalScore}, Aktif: ${this.totalScore >= price}`);
        });
    },

    // Joker kullan�m durumlar�n� s�f�rla (envanter korunur)
    resetJokerUsage: function() {
        console.log('Joker kullan�m durumlar� s�f�rlan�yor...');
        
        // Kullan�lm�� jokerleri s�f�rla
        this.jokersUsed = {fifty: false, hint: false, time: false, skip: false};
        this.skipJokerActive = false;
        
        // 50:50 joker ile devre d��� b�rak�lan se�enekleri tekrar aktif et
        this.resetDisabledOptions();
        
        // Joker butonlar�n� g�ncelle
        setTimeout(() => {
            this.updateJokerButtons();
        }, 100);
    },

    // Reset jokers for new game (sadece oyun ba�lang�c�nda �a�r�lmal�)
    resetJokers: function() {
        console.log('resetJokers �a�r�ld�, mevcut envanter:', JSON.stringify(this.jokerInventory));
        
        // �nce joker kullan�m durumlar�n� s�f�rla
        this.resetJokerUsage();
        
        // Envanter kontrol� - sadece tan�ms�z veya bo� ise ba�lang�� jokerleri ver
        if (!this.jokerInventory || Object.keys(this.jokerInventory).length === 0) {
            console.log('�lk oyun veya envanter tan�ms�z, ba�lang�� jokerleri veriliyor...');
            this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
            this.saveJokerInventory();
        }
        
        // Mevcut envanterde eksik joker t�rleri varsa tamamla
        if (this.jokerInventory.fifty === undefined) this.jokerInventory.fifty = 0;
        if (this.jokerInventory.hint === undefined) this.jokerInventory.hint = 0;
        if (this.jokerInventory.time === undefined) this.jokerInventory.time = 0;
        if (this.jokerInventory.skip === undefined) this.jokerInventory.skip = 0;
        
        console.log('resetJokers tamamland�, final envanter:', JSON.stringify(this.jokerInventory));
    },
    
    // Yeni oyun i�in joker envanterini yenile
    refreshJokersForNewGame: function() {
        console.log('refreshJokersForNewGame �a�r�ld�, jokerler yenileniyor...');
        
        // �nce joker kullan�m durumlar�n� s�f�rla
        this.resetJokerUsage();
        
        // Her yeni oyunda fresh jokerler ver
        this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
        this.saveJokerInventory();
        
        console.log('Jokerler yenilendi, yeni envanter:', JSON.stringify(this.jokerInventory));
    },
    
    // 50:50 joker ile devre d��� b�rak�lan se�enekleri s�f�rla
    resetDisabledOptions: function() {
        const disabledOptions = document.querySelectorAll('.option.disabled-option');
        disabledOptions.forEach(option => {
            option.style.opacity = '';
            option.style.pointerEvents = '';
            option.style.background = '';
            option.style.color = '';
            option.classList.remove('disabled-option');
        });
        
        // �pucu mesajlar�n� da temizle
        const hintMessages = document.querySelectorAll('.hint-message');
        hintMessages.forEach(hint => {
            hint.remove();
        });
    },
    
    // Kullan�c� ayarlar�n� y�kle
    loadUserSettings: function() {
        try {
            // Kaydedilmi� ayarlar� kontrol et
            const settings = localStorage.getItem(this.USER_SETTINGS_KEY);
            
            // Hamburger men�s�ndeki zorluk ayar�n� �ncelikle kontrol et
            const hamburg�rDifficulty = localStorage.getItem('difficulty');
            
            // Tercihler ekran�ndan zorluk seviyesi ayar�n� kontrol et
            const difficultyPreference = localStorage.getItem('difficulty_preference');
            let calculatedDifficulty = null;
            
            // �ncelik s�ras�: hamburger men�s� > tercihler > hesaplanm�� zorluk
            if (hamburg�rDifficulty && ['easy', 'medium', 'hard'].includes(hamburg�rDifficulty)) {
                calculatedDifficulty = hamburg�rDifficulty;
                console.log(`Zorluk seviyesi hamburger men�s�nden al�nd�: ${calculatedDifficulty}`);
            } else if (difficultyPreference) {
                // Otomatik zorluk ayar� ise, hesaplanm�� zorlu�u kontrol et
                if (difficultyPreference === 'auto') {
                    calculatedDifficulty = localStorage.getItem('calculated_difficulty');
                } else {
                    // Do�rudan se�ilen zorlu�u kullan
                    calculatedDifficulty = difficultyPreference;
                }
                
                if (calculatedDifficulty) {
                    console.log(`Zorluk seviyesi tercihlere g�re ayarland�: ${calculatedDifficulty}`);
                }
            }
            
            if (settings) {
                this.userSettings = JSON.parse(settings);
                
                // Tercihlerden zorluk seviyesi ayarlanmad�ysa kaydedilmi� ayarlar� kullan
                if (!calculatedDifficulty && this.userSettings.difficulty) {
                    calculatedDifficulty = this.userSettings.difficulty;
                }
                
                this.soundEnabled = this.userSettings.soundEnabled !== undefined ? this.userSettings.soundEnabled : true;
                this.animationsEnabled = this.userSettings.animationsEnabled !== undefined ? this.userSettings.animationsEnabled : true;
                this.notificationsEnabled = this.userSettings.notificationsEnabled !== undefined ? this.userSettings.notificationsEnabled : true;
                this.theme = this.userSettings.theme || 'light';
                
                console.log("Kullan�c� ayarlar� y�klendi:", this.userSettings);
            } else {
                // Varsay�lan ayarlar
                this.userSettings = {};
                this.soundEnabled = true;
                this.animationsEnabled = true;
                this.notificationsEnabled = true;
                this.theme = 'light';
                
                console.log("Varsay�lan ayarlar kullan�l�yor");
            }
            
            // Zorluk seviyesini ayarla
            this.currentDifficulty = calculatedDifficulty || 'medium';
            this.userSettings.difficulty = this.currentDifficulty;
            
            console.log(`Final zorluk seviyesi: ${this.currentDifficulty}`);
            
            // Tema ayar�n� uygula
            this.applyTheme();
            
            // Joker envanterini y�kle
            this.loadJokerInventory();
        } catch (e) {
            console.error("Ayarlar y�klenirken hata:", e);
        }
    },
    
    // Kullan�c� ayarlar�n� kaydet
    saveUserSettings: function() {
        try {
            // userSettings objesini g�ncelle
            if (!this.userSettings) {
                this.userSettings = {};
            }
            
            this.userSettings.difficulty = this.currentDifficulty;
            this.userSettings.soundEnabled = this.soundEnabled;
            this.userSettings.animationsEnabled = this.animationsEnabled;
            this.userSettings.notificationsEnabled = this.notificationsEnabled;
            this.userSettings.theme = this.theme;
            
            localStorage.setItem(this.USER_SETTINGS_KEY, JSON.stringify(this.userSettings));
            console.log("Kullan�c� ayarlar� kaydedildi:", this.userSettings);
        } catch (e) {
            console.error("Kullan�c� ayarlar� kaydedilirken hata olu�tu:", e);
        }
    },
    
    // Tema uygula
    applyTheme: function() {
        document.body.className = this.theme === 'dark' ? 'dark-theme' : '';
    },
    
    // Quiz aktivasyon i�levi - CSS class� ekleyerek tab bar�n g�r�n�rl���n� kontrol eder
    activateQuizMode: function() {
        document.body.classList.add('quiz-active');
        // Quiz modunda oldu�umuzu localStorage'a kaydet
        localStorage.setItem('quizModeActive', 'true');
    },

    // Quiz deaktivasyon i�levi
    deactivateQuizMode: function() {
        document.body.classList.remove('quiz-active');
        // Quiz modundan ��kt���m�z� localStorage'a kaydet
        localStorage.removeItem('quizModeActive');
    },
    
    // Joker tab butonlar�na olay dinleyicileri ekle
    initJokerTabBar: function() {
        const self = this;
        
        // 50:50 jokeri
        document.getElementById('joker-tab-fifty').addEventListener('click', function() {
            const jokerFiftyBtn = document.getElementById('joker-fifty');
            if (jokerFiftyBtn && !jokerFiftyBtn.disabled) {
                jokerFiftyBtn.click();
            }
        });

        // �pucu jokeri
        document.getElementById('joker-tab-hint').addEventListener('click', function() {
            const jokerHintBtn = document.getElementById('joker-hint');
            if (jokerHintBtn && !jokerHintBtn.disabled) {
                jokerHintBtn.click();
            }
        });

        // S�re jokeri
        document.getElementById('joker-tab-time').addEventListener('click', function() {
            const jokerTimeBtn = document.getElementById('joker-time');
            if (jokerTimeBtn && !jokerTimeBtn.disabled) {
                jokerTimeBtn.click();
            }
        });

        // Pas jokeri
        document.getElementById('joker-tab-skip').addEventListener('click', function() {
            const jokerSkipBtn = document.getElementById('joker-skip');
            if (jokerSkipBtn && !jokerSkipBtn.disabled) {
                jokerSkipBtn.click();
            }
        });

        // Joker ma�azas�
        document.getElementById('joker-tab-store').addEventListener('click', function() {
            const jokerStoreBtn = document.getElementById('joker-store');
            if (jokerStoreBtn && !jokerStoreBtn.disabled) {
                jokerStoreBtn.click();
            }
        });

        // Ana sayfa butonu (quiz'den ��k��)
        document.getElementById('joker-tab-home').addEventListener('click', function() {
            // Quiz'den ��k�� i�in onay sor
            if (confirm('Quiz\'den ��kmak istedi�inize emin misiniz? �lerleyi�iniz kaydedilecek.')) {
                // Quiz'i gizle
                document.getElementById('quiz').style.display = 'none';
                // Ana men�y� g�ster
                document.getElementById('main-menu').style.display = 'block';
                // Kategori se�imini g�ster
                document.getElementById('category-selection').style.display = 'none';
                // Quiz modunu deaktive et
                self.deactivateQuizMode();
            }
        });
    },
    
    // �statistikleri getir
    getStats: function() {
        const statsJSON = localStorage.getItem(this.STATS_KEY);
        let stats = {
            totalQuestions: 0,
            correctAnswers: 0,
            totalGames: 0,
            categoryStats: {},
            recentGames: []
        };
        
        if (statsJSON) {
            try {
                stats = JSON.parse(statsJSON);
            } catch (e) {
                console.error("�statistikler y�klenirken hata olu�tu:", e);
            }
        }
        
        return stats;
    },
    
    // Seviye tamamland�, sonraki seviyeyi g�ster
    showLevelCompletionScreen: function(completedLevel) {
        clearInterval(this.timerInterval);
        
        // Seviye tamamlama ses efekti
        if (this.soundEnabled) {
            const completionSound = document.getElementById('sound-level-completion');
            if (completionSound) completionSound.play().catch(e => console.error("Ses �al�namad�:", e));
        }
        
        // Oyuncuyu tebrik et
        const levelCompletionElement = document.createElement('div');
        levelCompletionElement.className = 'level-completion-screen';
        levelCompletionElement.innerHTML = `
            <div class="level-completion-content">
                <h2>${completedLevel}. Seviye Tamamland�!</h2>
                <div class="level-completion-stats">
                    <p><i class="fas fa-star"></i> Skor: ${this.score}</p>
                    <p><i class="fas fa-check-circle"></i> Do�ru: ${this.score}/${this.answeredQuestions}</p>
                    <p><i class="fas fa-clock"></i> Ortalama S�re: ${Math.round(this.answerTimes.reduce((a, b) => a + b, 0) / this.answerTimes.length)} saniye</p>
                </div>
                <div class="confetti-animation">
                    <i class="fas fa-trophy"></i>
                </div>
                <button id="next-level-btn" class="shiny-btn">Sonraki Seviyeye Ge�</button>
            </div>
        `;
        
        document.body.appendChild(levelCompletionElement);
        
        // Sonraki seviyeye ge�me butonu
        const nextLevelBtn = document.getElementById('next-level-btn');
        nextLevelBtn.addEventListener('click', () => {
            // Sonu� ekran�n� kald�r
            document.body.removeChild(levelCompletionElement);
            
            // Sonraki seviyeye devam et
            this.currentQuestionIndex = 0;
            this.resetJokers();
            // Canlar� koruyoruz, s�f�rlam�yoruz ki �nceki seviyeden kalan canlarla devam edilsin
            this.score = 0;
            this.answerTimes = [];
            this.answeredQuestions = 0;
            
            // Sonraki seviye i�in sorular� y�kle
            this.loadQuestionsForCurrentLevel();
        });
    },
    
    // Olay dinleyicilerini ekle
    addEventListeners: function() {
        try {
            console.log("Event listener'lar ekleniyor...");
            
        // Tema de�i�tirme butonu i�in olay dinleyicisi
        if (this.themeToggle) {
            this.themeToggle.addEventListener('change', () => {
                const theme = this.themeToggle.checked ? 'dark' : 'light';
                this.userSettings.theme = theme;
                this.applyTheme(theme);
                this.saveUserSettings();
            });
        }
        
        // Yeniden ba�latma butonu i�in olay dinleyicisi
        if (this.restartButton) {
            this.restartButton.addEventListener('click', () => {
                this.restartGame();
            });
        }
        
        // Sonraki soru butonu i�in olay dinleyicisi
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.showNextQuestion();
            });
        }
        
            // Joker butonlar� i�in olay dinleyicileri
            console.log('DOM haz�r, joker event listener\'lar� ekleniyor...');
            this.addJokerEventListeners();
            
            // Tekli oyun butonu
            if (this.singlePlayerBtn) {
                console.log("Tekli oyun butonu bulundu, dinleyici ekleniyor");
                this.singlePlayerBtn.addEventListener('click', () => {
                    console.log("Tekli oyun butonuna t�kland�");
                    if (this.mainMenu) this.mainMenu.style.display = 'none';
                    
                    // Tekli oyun modunda chat ekran�n� gizle
                    const gameChatContainer = document.getElementById('game-chat-container');
                    if (gameChatContainer) {
                        gameChatContainer.style.display = 'none';
                    }
                    
                    if (this.categorySelectionElement) {
                        this.categorySelectionElement.style.display = 'block';
                        // Kategorileri g�ster
                        this.displayCategories();
                    } else {
                        console.error("Kategori se�im elementi bulunamad�!");
                    }
                });
            } else {
                console.error("Tekli oyun butonu bulunamad�! ID: single-player-btn");
            }
            
            console.log("Event listener'lar ba�ar�yla eklendi");
        } catch (error) {
            console.error("addEventListeners fonksiyonunda hata:", error);
        }
    },
    
    // Joker butonlar�n� ayarla (setupJokerButtons'un yerine kullan�yoruz)
    setupJokerButtons: function() {
        // Bu fonksiyon gerekti�inde joker butonlar�n� ayarlar
        console.log("Joker butonlar� ayarlan�yor");
        this.updateJokerButtons();
    },
    
    // Soru verilerini y�kle
    loadQuestionsData: function() {
            console.log("Soru verileri y�kleniyor...");
            
        return new Promise((resolve, reject) => {
            // Se�ilen dile g�re dosya belirle
            let questionsFile = 'languages/tr/questions.json'; // T�rk�e i�in varsay�lan
            
            if (this.currentLanguage === 'en') {
                questionsFile = 'languages/en/questions.json';
            } else if (this.currentLanguage === 'de') {
                questionsFile = 'languages/de/questions.json';
            }
            
            console.log(`Dil: ${this.currentLanguage}, Y�klenen dosya: ${questionsFile}`);
            
            // Sorular� belirlenen JSON dosyas�ndan y�kle
            fetch(questionsFile)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Sorular y�klenemedi: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data) {
                    this.questionsData = data;
                        // allQuestionsData'y� questionsData ile ayn� verilere i�aret edecek �ekilde atayal�m
                        this.allQuestionsData = data; 
                        console.log("Soru verileri ba�ar�yla y�klendi:", Object.keys(data).length, "kategori");
                        console.log("Kategoriler:", Object.keys(data));
                        resolve(data);
                    } else {
                        console.log("Sorular y�klenemedi, varsay�lan veriler kullan�lacak.");
                        this.loadDefaultQuestions();
                        resolve(this.questionsData);
                    }
                })
                .catch(error => {
                    console.error("Sorular y�klenirken hata:", error);
                    console.log("Varsay�lan sorular kullan�lacak");
                    this.loadDefaultQuestions();
                    resolve(this.questionsData);
                });
        });
    },
    
    // Varsay�lan sorular� y�kle (offline durumlar i�in)
    loadDefaultQuestions: function() {
        // Varsay�lan baz� sorular
        this.questionsData = {
            "Genel K�lt�r": [
                {
                    question: "T�rkiye'nin ba�kenti hangi �ehirdir?",
                                options: ["�stanbul", "Ankara", "�zmir", "Bursa"],
                                correctAnswer: "Ankara",
                    difficulty: "easy"
                },
                {
                    question: "Hangi gezegen G�ne� Sistemi'nde en b�y�k olan�d�r?",
                    options: ["Mars", "Ven�s", "J�piter", "Sat�rn"],
                    correctAnswer: "J�piter",
                    difficulty: "easy"
                            },
                            {
                                question: "D�nyan�n en b�y�k okyanusu hangisidir?",
                    options: ["Atlas Okyanusu", "Hint Okyanusu", "Pasifik Okyanusu", "Arktik Okyanusu"],
                    correctAnswer: "Pasifik Okyanusu",
                    difficulty: "medium"
                }
            ],
            "Teknoloji": [
                {
                    question: "HTML'in a��l�m� nedir?",
                    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Mode Language", "Home Tool Markup Language"],
                    correctAnswer: "Hyper Text Markup Language",
                    difficulty: "easy"
                },
                {
                    question: "Hangi �irket Windows i�letim sistemini geli�tirmi�tir?",
                    options: ["Apple", "Google", "Microsoft", "IBM"],
                    correctAnswer: "Microsoft",
                    difficulty: "easy"
                }
            ],
            "Bilim": [
                {
                    question: "Periyodik tabloda 'Fe' hangi elementi simgeler?",
                    options: ["Flor", "Demir", "Fosfor", "Fermiyum"],
                    correctAnswer: "Demir",
                    difficulty: "medium"
                },
                {
                    question: "I��k h�z� yakla��k ka� km/s'dir?",
                    options: ["100.000 km/s", "200.000 km/s", "300.000 km/s", "400.000 km/s"],
                    correctAnswer: "300.000 km/s",
                    difficulty: "medium"
                }
            ]
        };
        // allQuestionsData'y� da g�ncelle
        this.allQuestionsData = this.questionsData;
        console.log("Varsay�lan sorular y�klendi:", Object.keys(this.questionsData).length, "kategori");
    },
    
    // Restartlama i�levi
    restartGame: function() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0; // <-- EKLEND�: Do�ru cevap say�s�n� s�f�rla
        this.sessionScore = 0; // Oturum puan�n� s�f�rla
        this.lives = 5;
        this.answeredQuestions = 0;
        this.answerTimes = [];
        this.currentSection = 1; // B�l�m say�s�n� da s�f�rla
        this.resetJokers();
        
        // Body'den quiz ve kategori class'lar�n� kald�r - logo tekrar g�r�ns�n
        document.body.classList.remove('quiz-active', 'category-selection');
        
        // Tekli oyun modunda chat ekran�n� gizle
        const gameChatContainer = document.getElementById('game-chat-container');
        if (gameChatContainer) {
            gameChatContainer.style.display = 'none';
        }
        
        // Kategorileri yeniden g�ster
        this.displayCategories();
        
        // �statistikleri s�f�rla
        this.updateScoreDisplay();
    },
    
    // Sonraki soruyu g�ster
    showNextQuestion: function() {
        // Yeni soruya ge�erken joker kullan�mlar�n� s�f�rla
        this.resetJokerUsage();
        // �nceki sonu� ve se�ili ��klar� temizle
        if (this.resultElement) {
            this.resultElement.style.display = 'none';
            this.resultElement.innerHTML = '';
        }
        
        // T�m se�ilmi� ��klar�n se�imini kald�r
        const selectedOptions = document.querySelectorAll('.option.selected, .true-false-option.selected, .option.answered, .true-false-option.answered');
        selectedOptions.forEach(option => {
            option.classList.remove('selected', 'answered', 'correct', 'wrong');
            option.disabled = false;
        });
        
        // 50:50 joker ile devre d��� b�rak�lan se�enekleri s�f�rla
        this.resetDisabledOptions();
        
        // Bo�luk doldurma ekran�ndaki cevap g�stergesini temizle
        const answerDisplay = document.getElementById('blank-filling-answer');
        if (answerDisplay) {
            answerDisplay.textContent = '';
            answerDisplay.classList.remove('correct', 'wrong');
        }
        
        // Se�ilmi� harfleri s�f�rla
        this.selectedLetters = [];
        
        // Soru sayac�n� art�r
        this.currentQuestionIndex++;
        
        // �nceki ipucu mesajlar�n� temizle
        const existingHintMessages = document.querySelectorAll('.hint-message');
        existingHintMessages.forEach(element => {
            element.remove();
        });
        
        // Her 5 soruda bir b�l�m ge�i�i g�ster
        if (this.currentQuestionIndex > 0 && this.currentQuestionIndex % 5 === 0 && this.currentQuestionIndex < this.questions.length) {
            this.currentSection++; // B�l�m say�s�n� art�r
            
                    // Progressive difficulty sistemi ile dinamik b�l�m say�s�
            const maxSections = this.getMaxSectionsForCategory();
            if (this.currentSection > maxSections) {
                this.showCategoryCompletion();
                return;
            }
            
            // Eski 50 b�l�m kontrol� kald�r�ld� - art�k dinamik sistem kullan�l�yor
            
            this.showSectionTransition();
        } else if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion(this.questions[this.currentQuestionIndex]);
        } else {
            // T�m sorular cevapland� - kategori tamamlama ekran�n� g�ster
            console.log("T�m sorular cevapland�, kategori tamamlama ekran� g�steriliyor...");
            this.showCategoryCompletion();
        }
    },
    
    // Kategoriye g�re maksimum b�l�m say�s�n� belirle
    getMaxSectionsForCategory: function() {
        // Kategoriye �zel zorluk seviyesi belirle
        const categoryDifficultyMap = {
            // Kolay kategoriler (12-15 b�l�m)
            'Hayvanlar': 12,
            'Renkler': 12, 
            'Basit Kelimeler': 13,
            'Say�lar': 13,
            'V�cut': 14,
            'Aile': 14,
            'Yemek': 15,
            'Ev': 15,
            
            // Orta kategoriler (15-18 b�l�m)
            'Spor': 15,
            'M�zik': 16,
            'Meslek': 16,
            'Ula��m': 17,
            'Do�a': 17,
            'Teknoloji': 18,
            'Sa�l�k': 18,
            
            // Zor kategoriler (18-25 b�l�m)
            'Bilim': 20,
            'Tarih': 20,
            'Edebiyat': 22,
            'Co�rafya': 22,
            'Felsefe': 24,
            'Matematik': 24,
            'Fizik': 25,
            'Kimya': 25
        };
        
        // Se�ilen kategoriye g�re b�l�m say�s� d�nd�r
        const maxSections = categoryDifficultyMap[this.selectedCategory] || 15; // Varsay�lan 15 b�l�m
        console.log(`Kategori: ${this.selectedCategory}, Maksimum B�l�m: ${maxSections}`);
        return maxSections;
    },
    
    // Kategori zorluk seviyesi metni
    getCategoryDifficultyText: function() {
        const maxSections = this.getMaxSectionsForCategory();
        
        if (maxSections <= 15) {
            return "?? Kolay Kategori";
        } else if (maxSections <= 18) {
            return "?? Orta Kategori";
        } else {
            return "?? Zor Kategori";
        }
    },
    
    // Progressive difficulty: Mevcut b�l�me g�re zorluk seviyesi belirle
    getProgressiveDifficulty: function() {
        const maxSections = this.getMaxSectionsForCategory();
        const currentProgress = this.currentSection / maxSections;
        
        // �lk %40'� kolay, sonraki %40'� orta, son %20'si zor
        if (currentProgress <= 0.4) {
            return 1; // Kolay
        } else if (currentProgress <= 0.8) {
            return 2; // Orta  
        } else {
            return 3; // Zor
        }
    },
    
    // Kategori Tamamlama Ekran�n� G�ster (dinamik b�l�m say�s�na g�re)
    showCategoryCompletion: function() {
        // Zamanlay�c�y� durdur
        clearInterval(this.timerInterval);
        
        // Kategori tamamlama modal�n� olu�tur
        const categoryCompletionModal = document.createElement('div');
        categoryCompletionModal.className = 'category-completion-modal';
        categoryCompletionModal.innerHTML = `
            <div class="category-completion-content">
                <div class="completion-header">
                    <div class="completion-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <h2>Kategori Tamamland�!</h2>
                    <p class="completion-message">"${this.selectedCategory}" kategorisinin ${this.getMaxSectionsForCategory()} b�l�m�n� ba�ar�yla tamamlad�n�z!</p>
                    <p class="completion-difficulty" style="font-size: 14px; color: #64748b; margin-top: 10px;">
                        ${this.getCategoryDifficultyText()} � Progressive Zorluk Sistemi
                    </p>
                </div>
                
                <div class="completion-stats">
                                         <div class="stat-item">
                         <div class="stat-icon">
                             <i class="fas fa-layer-group"></i>
                         </div>
                         <div class="stat-content">
                             <div class="stat-value">${this.getMaxSectionsForCategory()}</div>
                             <div class="stat-label">B�l�m Tamamland�</div>
                         </div>
                     </div>
                    
                    <div class="stat-item">
                        <div class="stat-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${this.score}</div>
                            <div class="stat-label">Toplam Puan</div>
                        </div>
                    </div>
                    
                    <div class="stat-item">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${this.correctAnswers}</div>
                            <div class="stat-label">Do�ru Cevap</div>
                        </div>
                    </div>
                    
                    <div class="stat-item">
                        <div class="stat-icon">
                            <i class="fas fa-heart"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${this.lives}</div>
                            <div class="stat-label">Kalan Can</div>
                        </div>
                    </div>
                    
                    <div class="stat-item" style="grid-column: 1 / -1;">
                        <div class="stat-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value" style="font-size: 14px;">Kolay � Orta � Zor</div>
                            <div class="stat-label">Zorluk Progresyonu</div>
                        </div>
                    </div>
                </div>
                
                <div class="completion-actions">
                    <button id="show-final-results" class="completion-btn primary">
                        <i class="fas fa-chart-line"></i>
                        Detayl� Sonu�lar� G�r
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(categoryCompletionModal);
        
        // Detayl� sonu�lar� g�ster butonu
        const showResultsBtn = document.getElementById('show-final-results');
        if (showResultsBtn) {
            showResultsBtn.addEventListener('click', () => {
                // Modal� kald�r
                categoryCompletionModal.remove();
                
                // Normal oyun biti� ekran�n� g�ster
                setTimeout(() => {
            this.showResult();
                }, 500);
            });
        }
        
        // Modal d���na t�klan�rsa da sonu� ekran�n� g�ster
        categoryCompletionModal.addEventListener('click', (e) => {
            if (e.target === categoryCompletionModal) {
                categoryCompletionModal.remove();
                setTimeout(() => {
                    this.showResult();
                }, 500);
            }
        });
        
        // Ba�ar� ses efekti �al
        if (this.soundEnabled) {
            const victorySound = document.getElementById('sound-level-completion');
            if (victorySound) victorySound.play().catch(e => console.error("Ses �al�namad�:", e));
        }
        
        // 10 saniye sonra otomatik olarak sonu� ekran�n� g�ster
        setTimeout(() => {
            if (document.body.contains(categoryCompletionModal)) {
                categoryCompletionModal.remove();
                this.showResult();
            }
        }, 10000);
        
        // Konfeti efekti eklenebilir
        console.log(`${this.selectedCategory} kategorisi ${this.getMaxSectionsForCategory()} b�l�m ile tamamland�!`);
    },

    // DEBUG: Kategori tamamlama modal�n� test et
    testCategoryCompletion: function() {
        console.log("Test: Kategori tamamlama modal� manuel olarak g�steriliyor...");
        this.showCategoryCompletion();
    },
    
    // Oyun Tamamlama Ekran�n� G�ster (50 b�l�m tamamland���nda)
    showGameCompletion: function() {
        // Sayac� durdur
        clearInterval(this.timerInterval);
        
        // Oyun tamamlama ekran�n� olu�tur
        const completionElement = document.createElement('div');
        completionElement.className = 'game-completion-screen';
        completionElement.innerHTML = `
            <div class="game-completion-content">
                <div class="trophy-container">
                    <i class="fas fa-trophy trophy-icon"></i>
                </div>
                <h2>Tebrikler! Oyunu Tamamlad�n�z!</h2>
                <div class="completion-info">
                    <p class="completion-congrats">50 b�l�m� ba�ar�yla tamamlad�n�z!</p>
                    <p>Toplam Puan: <strong>${this.score}</strong></p>
                    <p class="completion-message">Bu muhte�em ba�ar�n�z i�in kutlar�z!</p>
                </div>
                <div class="completion-buttons">
                    <button id="restart-game-btn" class="completion-btn"><i class="fas fa-redo"></i> Yeniden Oyna</button>
                    <button id="share-result-btn" class="completion-btn"><i class="fas fa-share-alt"></i> Sonucu Payla�</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(completionElement);
        
        // Yeniden ba�latma butonu
        const restartGameBtn = document.getElementById('restart-game-btn');
        if (restartGameBtn) {
            restartGameBtn.addEventListener('click', () => {
                document.body.removeChild(completionElement);
                this.restartGame();
            });
        }
        
        // Payla��m butonu
        const shareResultBtn = document.getElementById('share-result-btn');
        if (shareResultBtn) {
            shareResultBtn.addEventListener('click', () => {
                // Payla��m �zelli�i eklenebilir
                const shareText = `Bilgoo'yu ${this.score} puanla tamamlad�m! Sende oynamak ister misin?`;
                
                if (navigator.share) {
                    navigator.share({
                        title: 'Bilgoo',
                        text: shareText,
                        url: window.location.href
                    }).catch(err => {
                        console.error('Payla��m hatas�:', err);
                        this.showToast('Sonu� payla��lamad�', 'toast-error');
                    });
                } else {
                    // Taray�c� payla��m� desteklemiyorsa panoya kopyala
                    navigator.clipboard.writeText(shareText)
                        .then(() => {
                            this.showToast('Sonu� panoya kopyaland�!', 'toast-success');
                        })
                        .catch(err => {
                            console.error('Panoya kopyalama hatas�:', err);
                            this.showToast('Sonu� kopyalanamad�', 'toast-error');
                        });
                }
            });
        }
        
        // Konfeti efekti veya ses efekti eklenebilir
        if (this.soundEnabled) {
            const victorySound = document.getElementById('sound-level-completion');
            if (victorySound) victorySound.play().catch(e => console.error("Ses �al�namad�:", e));
        }
        
        // �statistikleri kaydet
        this.saveStats(this.selectedCategory, this.score, this.answeredQuestions, 
            this.answerTimes.length > 0 ? Math.round(this.answerTimes.reduce((a, b) => a + b, 0) / this.answerTimes.length) : 0);
    },
    
    // B�l�m ge�i� ekran�n� g�ster
    showSectionTransition: function() {
        // Sayac� durdur
        clearInterval(this.timerInterval);
        
        // Tamamlanan b�l�m numaras� (0-tabanl�) - currentSection 1'den ba�lad��� i�in -1
        const sectionIndex = this.currentSection - 2; // Bir �nceki tamamlanan b�l�m
        
        // B�l�m istatistiklerini al
        const stats = this.sectionStats[sectionIndex] || { correct: 0, total: 0 };
        
        console.log(`B�l�m ge�i�i g�steriliyor. B�l�m: ${sectionIndex+1}, �statistikler:`, stats);
        
        // Do�ru cevap y�zdesini hesapla
        const correctPercentage = stats.total > 0 
            ? Math.round((stats.correct / stats.total) * 100) 
            : 0;
        
        console.log(`B�l�m istatistikleri hesapland�: Do�ru: ${stats.correct}, Toplam: ${stats.total}, Y�zde: ${correctPercentage}%`);
        
        // Y�ld�z tipini belirle (alt�n, g�m�� veya bronz)
        let starType, starColor, starText;
        if (correctPercentage >= 80) {
            starType = 'gold';
            starColor = '#ffd700';
            starText = 'Alt�n Y�ld�z';
        } else if (correctPercentage >= 50) {
            starType = 'silver';
            starColor = '#c0c0c0';
            starText = 'G�m�� Y�ld�z';
        } else {
            starType = 'bronze';
            starColor = '#cd7f32';
            starText = 'Bronz Y�ld�z';
        }
        
        // Performansa g�re ka� y�ld�z verilecek
        let starCount;
        if (correctPercentage >= 80) {
            starCount = 3; // �ok iyi performans: 3 y�ld�z
        } else if (correctPercentage >= 50) {
            starCount = 2; // Orta performans: 2 y�ld�z
        } else {
            starCount = 1; // D���k performans: 1 y�ld�z
        }
        
        // Y�ld�z HTML'ini olu�tur
        let starsHTML = '';
        for (let i = 0; i < 3; i++) {
            if (i < starCount) {
                // Aktif y�ld�z (kazan�lan)
                starsHTML += `<i class="fas fa-star" style="color: ${starColor};"></i>`;
            } else {
                // Gri y�ld�z (kazan�lmayan)
                starsHTML += `<i class="fas fa-star" style="color: #888; opacity: 0.5;"></i>`;
            }
        }
        
        // B�l�m ge�i� ekran�n� olu�tur - �nceki tasar�ma benzer bir stil kullan�l�yor
        const sectionElement = document.createElement('div');
        sectionElement.className = 'section-transition';
        sectionElement.innerHTML = `
            <div class="section-transition-content">
                <h2>${this.currentSection-1}. ${this.getTranslation('sectionCompleted')}</h2>
                
                <div class="stars-container">
                    ${starsHTML}
                </div>
                
                <div class="level-info">
                    <p class="level-congrats">${starCount} ${this.getTranslation('earnedStars')}</p>
                </div>
                
                <div class="section-stats">
                    <p><i class="fas fa-star"></i> ${this.getTranslation('currentScore')}: ${this.score}</p>
                    <p><i class="fas fa-heart"></i> ${this.getTranslation('remainingLives')}: ${this.lives}</p>
                    <p><i class="fas fa-check-circle"></i> ${this.getTranslation('correctAnswers')}: ${stats.correct}/${stats.total} (${correctPercentage}%)</p>
                    <p><i class="fas fa-chart-line"></i> Sonraki B�l�m: ${['', 'Kolay', 'Orta', 'Zor'][this.getProgressiveDifficulty()]} Seviye</p>
                </div>
                <button id="next-section-btn" class="level-btn"><i class="fas fa-forward"></i> ${this.getTranslation('nextSection')}</button>
            </div>
        `;
        
        // Mevcut ekran� gizle ve ge�i� ekran�n� g�ster
        if (this.quizElement) this.quizElement.style.display = 'none';
        document.body.appendChild(sectionElement);
        
        // Sonraki b�l�me ge�i� butonu
        const nextSectionBtn = document.getElementById('next-section-btn');
        nextSectionBtn.addEventListener('click', () => {
            // Ge�i� ekran�n� kald�r
            document.body.removeChild(sectionElement);
            
            // Quiz ekran�n� g�ster
            if (this.quizElement) this.quizElement.style.display = 'block';
            
            // Sonraki soruyu g�ster
            this.displayQuestion(this.questions[this.currentQuestionIndex]);
        });
        
        // Ses efekti �al
        if (this.soundEnabled) {
            const sectionSound = document.getElementById('sound-correct');
            if (sectionSound) sectionSound.play().catch(e => console.error("Ses �al�namad�:", e));
        }
        
        // Tebrik toast mesaj� g�ster
        this.showToast(`${this.currentSection-1}. ${this.getTranslation('sectionCompleted')}`, "toast-success");
    },
    
    // Kategorileri g�ster
    displayCategories: function() {
        const categoriesContainer = document.getElementById('categories');
        if (!categoriesContainer) {
            console.error("Kategoriler i�in DOM elementi bulunamad�! (ID: categories)");
            return;
        }
        // Kategorileri temizle
        categoriesContainer.innerHTML = '';
        
        // Body'ye kategori se�imi class'�n� ekle - logo gizlemek i�in
        document.body.classList.add('category-selection');
        document.body.classList.remove('quiz-active');
        
        // Tekli oyun modunda chat ekran�n� gizle
        const gameChatContainer = document.getElementById('game-chat-container');
        if (gameChatContainer) {
            gameChatContainer.style.display = 'none';
        }
        
        // Aktif kategori verilerini al
        const activeQuestionData = this.currentLanguage === 'tr' ? this.questionsData : this.translatedQuestions;
        
        console.log("displayCategories �a�r�ld�! Mevcut kategoriler:", activeQuestionData ? Object.keys(activeQuestionData) : "Veri yok");
        if (!activeQuestionData || Object.keys(activeQuestionData).length === 0) {
            // Y�kleniyor mesaj� g�ster
            categoriesContainer.innerHTML = `<div class="loading">${this.getTranslation('loading')}</div>`;
            return;
        }
        
        // T�m kategorileri g�ster
        Object.keys(activeQuestionData).forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category category-btn';
            categoryElement.innerHTML = `
                <div class="category-icon">
                    <i class="${this.getCategoryIcon(category)}"></i>
                </div>
                <div class="category-name">${category}</div>
            `;
            // Kategori elementine t�klama olay� ekle
            categoryElement.addEventListener('click', () => {
                this.selectCategory(category);
            });
            categoriesContainer.appendChild(categoryElement);
        });
        console.log("Toplam", Object.keys(activeQuestionData).length, "kategori g�r�nt�lendi");
    },
    
    // Kategori simgesini belirle
    getCategoryIcon: function(category) {
        // Kategori ad�na g�re uygun simge d�nd�r
        const categoryIcons = {
            // T�rk�e kategoriler
            'Genel K�lt�r': 'fas fa-globe',
            'Bilim': 'fas fa-flask',
            'Teknoloji': 'fas fa-microchip',
            'Spor': 'fas fa-futbol',
            'M�zik': 'fas fa-music',
            'Tarih': 'fas fa-landmark',
            'Co�rafya': 'fas fa-mountain',
            'Sanat': 'fas fa-palette',
            'Edebiyat': 'fas fa-book',
            'Sinema': 'fas fa-film',
            'Yemek': 'fas fa-utensils',
            'Bilgisayar': 'fas fa-laptop-code',
            'Matematik': 'fas fa-calculator',
            'Bo�luk Doldurma': 'fas fa-keyboard',
            'Di�er': 'fas fa-question-circle',
            
            // �ngilizce kategoriler
            'General Knowledge': 'fas fa-globe',
            'Science': 'fas fa-flask',
            'Technology': 'fas fa-microchip',
            'Sports': 'fas fa-futbol',
            'Music': 'fas fa-music',
            'History': 'fas fa-landmark',
            'Geography': 'fas fa-mountain',
            'Art': 'fas fa-palette',
            'Literature': 'fas fa-book',
            'Movies': 'fas fa-film',
            'Food': 'fas fa-utensils',
            'Computer': 'fas fa-laptop-code',
            'Mathematics': 'fas fa-calculator',
            'Fill in the Blank': 'fas fa-keyboard',
            'Other': 'fas fa-question-circle',
            
            // Almanca kategoriler
            'Allgemeinwissen': 'fas fa-globe',
            'Wissenschaft': 'fas fa-flask',
            'Technologie': 'fas fa-microchip',
            'Sport': 'fas fa-futbol',
            'Musik': 'fas fa-music',
            'Geschichte': 'fas fa-landmark',
            'Geographie': 'fas fa-mountain',
            'Kunst': 'fas fa-palette',
            'Literatur': 'fas fa-book',
            'Filme': 'fas fa-film',
            'Essen': 'fas fa-utensils',
            'Computer': 'fas fa-laptop-code',
            'Mathematik': 'fas fa-calculator',
            'L�ckentext': 'fas fa-keyboard',
            'Sonstiges': 'fas fa-question-circle'
        };
        
        return categoryIcons[category] || 'fas fa-question-circle';
    },
    
    // Kategori se�
    selectCategory: function(category) {
        try {
            console.log("Se�ilen kategori:", category);
            this.selectedCategory = category;
            
            // Yeni oyun ba�lad���nda de�i�kenleri s�f�rla
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.correctAnswers = 0; // <-- EKLEND�: Do�ru cevap say�s�n� s�f�rla
            this.sessionScore = 0;
            this.answeredQuestions = 0;
            this.answerTimes = [];
            this.lives = 5;
            
            // Her yeni oyunda jokerlar� yenile
            this.refreshJokersForNewGame();
            
            // Kategori se�im ekran�n� gizle
            if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'none';
            
            // Aktif soru verilerini al (�evrilmi� veya orijinal)
            const activeQuestionData = this.currentLanguage === 'tr' ? this.questionsData : this.translatedQuestions;
            
            // Se�ilen kategorideki sorular� kar��t�r
            if (activeQuestionData && activeQuestionData[category]) {
                this.questions = this.shuffleArray([...activeQuestionData[category]]);
                this.arrangeBlankFillingFirst();
                console.log("Soru say�s�:", this.questions.length);
                console.log("Aktif dil:", this.currentLanguage);
                
                // Maksimum soru say�s�n� dinamik olarak hesapla
                const maxSections = this.getMaxSectionsForCategory();
                const maxQuestions = maxSections * 5; // Her b�l�mde 5 soru
                
                console.log(`Kategori: ${this.selectedCategory}`);
                console.log(`Maksimum b�l�m: ${maxSections}`);
                console.log(`Maksimum soru: ${maxQuestions}`);
                
                if (this.questions.length > maxQuestions) {
                    this.questions = this.questions.slice(0, maxQuestions);
                    console.log("Sorular", maxQuestions, "ile s�n�rland�r�ld� (dinamik sistem)");
                } else if (this.questions.length < maxQuestions) {
                    // E�er yeterli soru yoksa mevcut sorular� tekrarla
                    const originalQuestions = [...this.questions];
                    while (this.questions.length < maxQuestions) {
                        this.questions = this.questions.concat(this.shuffleArray([...originalQuestions]));
                    }
                    this.questions = this.questions.slice(0, maxQuestions);
                    console.log("Yetersiz soru! Sorular tekrarlanarak", maxQuestions, "soraya ��kar�ld�");
                }
                
                // Toplam puan g�stergesini ba�lat
                this.updateTotalScoreDisplay();
                
                // Oyunu ba�lat
                this.startQuiz();
            } else {
                console.error("Kategori verileri bulunamad�:", category);
                this.showToast(this.getTranslation('categoryLoadError') || "Se�ilen kategoride soru bulunamad�. L�tfen ba�ka bir kategori se�in.", "toast-error");
                
                // Kategori se�im ekran�n� tekrar g�ster
                if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'block';
            }
        } catch (error) {
            console.error("selectCategory fonksiyonunda hata:", error);
            this.showToast(this.getTranslation('categorySelectionError') || "Kategori se�ilirken bir hata olu�tu. L�tfen tekrar deneyin.", "toast-error");
            
            // Kategori se�im ekran�n� tekrar g�ster
            if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'block';
        }
    },
    
    // Se�ilen kategori i�in sorular� y�kle
    loadQuestionsForCategory: function(category) {
        if (!this.questionsData[category]) {
            console.error(`${category} kategorisi i�in soru bulunamad�!`);
            return;
        }
        
        // Kategorinin sorular�n� al ve kar��t�r
        this.questions = this.shuffleArray([...this.questionsData[category]]);
        
        // Zorluk seviyesine g�re s�rala (iste�e ba�l�)
        // this.questions.sort((a, b) => (a.difficulty || 1) - (b.difficulty || 1));
        
        // �lk soruyu g�ster
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0; // <-- EKLEND�
        // this.lives = 5; // BUNU S�L�YORUM
        this.answeredQuestions = 0;
        this.answerTimes = [];
        this.sectionStats = []; // B�l�m istatistiklerini s�f�rla
        this.currentSection = 1; // B�l�m numaras�n� s�f�rla
        this.resetJokerUsage(); // Sadece kullan�m durumlar�n� s�f�rla, envanter korunsun
        
        // Quiz ekran�n� g�ster ve ilk soruyu y�kle
        this.startQuiz();
    },
    
    // Diziyi kar��t�r (Fisher-Yates algoritmas�)
    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },
    
    // Quiz'i ba�lat
    startQuiz: function() {
        // Body'ye quiz aktif class'�n� ekle - logo gizlemek i�in ve mobil tab bar�n yer de�i�tirmesi i�in
        document.body.classList.add('quiz-active');
        document.body.classList.remove('category-selection');
        
        // Quiz modunu aktifle�tir
        this.activateQuizMode();
        
        // �nce t�m ana b�l�mleri gizle, sadece quiz ekran�n� g�ster
        if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'none';
        if (this.quizElement) this.quizElement.style.display = 'block';
        if (this.resultElement) this.resultElement.style.display = 'none';
        
        // Oyun aray�z�ne kalan di�er elemanlar� da gizle
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.style.display = 'none';
        
        const onlineGameOptions = document.getElementById('online-game-options');
        if (onlineGameOptions) onlineGameOptions.style.display = 'none';
        
        const globalLeaderboard = document.getElementById('global-leaderboard'); 
        if (globalLeaderboard) globalLeaderboard.style.display = 'none';
        
        const winnerScreen = document.getElementById('winner-screen');
        if (winnerScreen) winnerScreen.style.display = 'none';
        
        // Tekli oyun modunda chat ekran�n� gizle
        const gameChatContainer = document.getElementById('game-chat-container');
        if (gameChatContainer) {
            gameChatContainer.style.display = 'none';
        }
        
        // "Bilgisel Bilgi Yar��mas�" ba�l���n� ve ikonunu gizle
        const quizTitle = document.querySelector('h1');
        if (quizTitle && quizTitle.innerText.includes('Bilgisel Bilgi Yar��mas�')) {
            quizTitle.style.display = 'none';
        }
        
        // Footer i�erisindeki t�m i�eri�i (TEKNOVA B�L���M yaz�s�, logo, ikon vb.) gizle
        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.display = 'none';
        }
        
        // Logo veya di�er ikonlar� da gizle
        const logoIcons = document.querySelectorAll('.logo, .logo-icon, .company-info, .company-logo');
        logoIcons.forEach(icon => {
            icon.style.display = 'none';
        });
        
        // Skorlar� g�ncelle
        this.updateScoreDisplay();
        
        // Joker butonlar�n� ba�lang�� durumuna getir
        this.updateJokerButtons();
        
        // �lk soruyu g�ster
        this.displayQuestion(this.questions[0]);
    },
    
    // Skoru g�ncelle
    updateScoreDisplay: function() {
        if (this.scoreElement) {
            this.scoreElement.innerHTML = `
                <div class="score-container">
                    <span class="score-value">${this.score}</span>
                    <span class="score-label">${this.getTranslation('score')}</span>
                </div>
            `;
        }
        
        // Oyun s�ras�ndaki puan g�stergesini g�ncelle
        const currentScoreElement = document.getElementById('current-score');
        if (currentScoreElement) {
            currentScoreElement.textContent = this.score;
        }
        
        // Toplam puan g�stergesini g�ncelle
        this.updateTotalScoreDisplay();
        
        // Canlar� g�ncelle
        this.updateLives();
    },
    
    // Soruyu g�ster
    displayQuestion: function(questionData) {
        if (!questionData) {
            console.error("Soru verisi bulunamad�!");
            return;
        }
        
        // �nceki ipucu mesajlar�n� temizle
        const existingHintMessages = document.querySelectorAll('.hint-message');
        existingHintMessages.forEach(element => {
            element.remove();
        });
        
        // E�er soru bo�luk doldurma ise farkl� g�ster
        if (questionData.type === "BlankFilling") {
            this.loadBlankFillingQuestion(questionData);
            return;
        }
        
        // E�er soru do�ru/yanl�� tipindeyse farkl� g�ster
        if (questionData.type === "Do�ruYanl��" || questionData.type === "TrueFalse") {
            this.loadTrueFalseQuestion(questionData);
            return;
        }
        
        // Sonu� alan�n� temizle
        if (this.resultElement) {
            this.resultElement.innerHTML = '';
            this.resultElement.className = 'result';
            this.resultElement.style.display = 'none';
        }
        
        // Sonraki soru butununu gizle
        if (this.nextButton) {
            this.nextButton.style.display = 'none';
        }
        
        // Soru metnini g�ster
        if (this.questionElement) {
            // �evrilmi� soru kullan (e�er varsa)
            if (questionData.translations && questionData.translations[this.currentLanguage] && questionData.translations[this.currentLanguage].question) {
                this.questionElement.textContent = questionData.translations[this.currentLanguage].question;
            } else {
                this.questionElement.textContent = questionData.question;
            }
            
            // E�er soruda g�rsel varsa g�ster
            if (questionData.imageUrl) {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'question-image';
                const img = document.createElement('img');
                img.src = questionData.imageUrl;
                img.alt = this.getTranslation('questionImage');
                img.style.maxWidth = '100%';
                img.style.maxHeight = '300px';
                img.style.margin = '10px auto';
                img.style.display = 'block';
                img.onerror = () => {
                    console.warn(`${this.getTranslation('imageLoadError')}: ${questionData.imageUrl}`);
                    this.showToast(this.getTranslation('imageLoadError'), "toast-warning");
                    if (this.questions.length > this.currentQuestionIndex + 1) {
                        clearInterval(this.timerInterval);
                        setTimeout(() => {
                            this.currentQuestionIndex++;
                            this.displayQuestion(this.questions[this.currentQuestionIndex]);
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            this.showResult();
                        }, 1000);
                    }
                    return;
                };
                const oldImages = this.questionElement.querySelectorAll('.question-image');
                oldImages.forEach(img => img.remove());
                imageContainer.appendChild(img);
                this.questionElement.appendChild(imageContainer);
            }
        }
        
        // ��klar� g�ster
        if (this.optionsElement) {
            this.optionsElement.innerHTML = '';
            this.optionsElement.style.display = '';
            this.optionsElement.style.justifyContent = '';
            this.optionsElement.style.width = '';
            
            // �evrilmi� ��klar� kullan (e�er varsa)
            let displayOptions = [];
            if (questionData.translations && questionData.translations[this.currentLanguage] && questionData.translations[this.currentLanguage].options) {
                displayOptions = questionData.translations[this.currentLanguage].options;
            } else {
                displayOptions = questionData.options || [];
            }
            
            if (!Array.isArray(displayOptions) && questionData.correctAnswer) {
                const wrongOptions = this.generateWrongOptions(questionData.correctAnswer);
                const allOptions = [questionData.correctAnswer, ...wrongOptions];
                this.displayOptions(this.shuffleArray(allOptions));
            } else {
                this.displayOptions(displayOptions);
            }
        }
        
        // Joker butonlar�n�n durumunu g�ncelle
        this.updateJokerButtons();

        // Sayac� ba�lat
        this.startTimer();
    },
    
    // ��klar� ekrana yazd�r
    displayOptions: function(options) {
        if (!this.optionsElement) return;
        
        options.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.className = 'option';
            optionButton.textContent = option;
            
            // ��k t�klama olay�
            optionButton.addEventListener('click', (e) => {
                // Zaten t�klanm�� veya devre d��� b�rak�lm�� ��klara t�klamay� �nle
                if (e.target.disabled || e.target.classList.contains('selected') || 
                    document.querySelector('.option.selected')) {
                    return;
                }
                
                // T�klanan ��k� i�aretle
                e.target.classList.add('selected');
                
                // Cevab� kontrol et
                this.checkAnswer(option);
            });
            
            this.optionsElement.appendChild(optionButton);
        });
    },
    
    // Zamanlay�c�y� ba�lat
    startTimer: function() {
        // Var olan zamanlay�c�y� temizle
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const isBlankFilling = currentQuestion.type === "BlankFilling";
        this.timeLeft = isBlankFilling ? this.TIME_PER_BLANK_FILLING_QUESTION : this.TIME_PER_QUESTION;
        this.updateTimeDisplay();
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimeDisplay();
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.handleTimeUp(); // T�m soru tiplerinde handleTimeUp �a�r�lacak
            }
        }, 1000);
    },
    
    // Zaman g�stergesini g�ncelle
    updateTimeDisplay: function() {
        if (this.timeLeftElement) {
            this.timeLeftElement.textContent = this.timeLeft;
            
            // Son 5 saniyede k�rm�z� yap
            if (this.timeLeft <= 5) {
                this.timeLeftElement.classList.add('time-low');
            } else {
                this.timeLeftElement.classList.remove('time-low');
            }
        }
    },
    
    // Cevab� kontrol et
    checkAnswer: function(selectedAnswer) {
        // E�er zaten cevap verilmi�se i�lem yapma
        if (document.querySelector('.result').style.display === 'block') {
            return;
        }
        
        // Sayac� durdur
        clearInterval(this.timerInterval);
        
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const correctAnswer = currentQuestion.correctAnswer;
        
        // Cevap do�ru mu?
        const isCorrect = selectedAnswer === correctAnswer;
        
        // Cevab� mevcut b�l�m istatisti�ine ekle
        this.recordAnswer(isCorrect);

        // Do�ru/Yanl�� tipindeki sorular i�in
        if (currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse") {
            const tfOptions = document.querySelectorAll('.true-false-option');
            tfOptions.forEach(option => {
                option.disabled = true;
                const isTrue = option.classList.contains('true');
                const isFalse = option.classList.contains('false');
                
                // Do�ru cevap DO�RU ise
                if (correctAnswer === this.getTranslation('trueOption') && isTrue) {
                    option.classList.add('correct');
                }
                // Do�ru cevap YANLI� ise
                else if (correctAnswer === this.getTranslation('falseOption') && isFalse) {
                    option.classList.add('correct');
                }
                
                // Se�ilen yanl�� ise
                if ((isTrue && selectedAnswer === this.getTranslation('trueOption') && !isCorrect) ||
                    (isFalse && selectedAnswer === this.getTranslation('falseOption') && !isCorrect)) {
                    option.classList.add('wrong');
                }
                
                // Se�ilen buton ise
                if ((isTrue && selectedAnswer === this.getTranslation('trueOption')) ||
                    (isFalse && selectedAnswer === this.getTranslation('falseOption'))) {
                    option.classList.add('selected');
                }
            });
        } else {
            // Normal �oktan se�meli sorular i�in
            const options = document.querySelectorAll('.option');
            options.forEach(option => {
                option.disabled = true;
                option.classList.add('answered'); // Cevapland���n� belirt
                
                if (option.textContent === correctAnswer) {
                    option.classList.add('correct');
                } else if (option.textContent === selectedAnswer && !isCorrect) {
                    option.classList.add('wrong');
                }
            });
        }
        
        // Sonucu g�ster
        const resultElement = document.getElementById('result');
        if (!resultElement) {
            console.warn('Result elementi bulunamad�, olu�turuluyor...');
            this.createResultElement();
        }
        
        if (resultElement) {
            if (isCorrect) {
                // Tam ekran do�ru modal�
                const correctModal = document.createElement('div');
                correctModal.className = 'correct-modal';
                correctModal.innerHTML = `
                    <div class="correct-modal-content">
                        <div class="correct-modal-icon">
                            <i class="fas fa-crown"></i>
                        </div>
                        <div class="correct-modal-text">${this.getTranslation('correct')}</div>
                        <div class="correct-modal-score">+${Math.max(1, Math.ceil(this.timeLeft / 5))}</div>
                        <button id="next-question" class="next-button">${this.getTranslation('next')}</button>
                    </div>
                `;
                document.body.appendChild(correctModal);
                correctModal.querySelector('#next-question').onclick = () => {
                    correctModal.remove();
                    this.showNextQuestion();
                };
                correctModal.onclick = (e) => {
                    if (e.target === correctModal) {
                        correctModal.remove();
                        this.showNextQuestion();
                    }
                };
                this.resultElement.style.display = 'none';
                this.resultElement.innerHTML = '';
                this.resultElement.className = 'result';
                // Puan� art�r
                const scoreForQuestion = Math.max(1, Math.ceil(this.timeLeft / 5));
                this.addScore(scoreForQuestion);
        this.recordAnswer(true);
                this.correctAnswers++;
                // Ses efekti �al
                if (this.soundEnabled) {
                    const correctSound = document.getElementById('sound-correct');
                    if (correctSound) correctSound.play().catch(e => console.error("Ses �al�namad�:", e));
                }
            } else {
                // Tam ekran yanl�� modal�
                this.loseLife();
                const wrongModal = document.createElement('div');
                wrongModal.className = 'wrong-modal';
                wrongModal.innerHTML = `
                    <div class="wrong-modal-content">
                        <div class="wrong-modal-icon">
                            <i class="fas fa-times-circle"></i>
                        </div>
                        <div class="wrong-modal-text">${this.getTranslation('wrong')}</div>
                        <div class="wrong-modal-correct">${this.getTranslation('correctAnswer')}: <strong>${correctAnswer}</strong></div>
                        <button id="next-question" class="next-button">${this.getTranslation('next')}</button>
                    </div>
                `;
                document.body.appendChild(wrongModal);
                wrongModal.querySelector('#next-question').onclick = () => {
                    wrongModal.remove();
                    this.showNextQuestion();
                };
                wrongModal.onclick = (e) => {
                    if (e.target === wrongModal) {
                        wrongModal.remove();
                        this.showNextQuestion();
                    }
                };
                this.resultElement.style.display = 'none';
                this.resultElement.innerHTML = '';
                this.resultElement.className = 'result';
                // Ses efekti �al
                if (this.soundEnabled) {
                    const wrongSound = document.getElementById('sound-wrong');
                    if (wrongSound) wrongSound.play().catch(e => console.error("Ses �al�namad�:", e));
                }
            }
        }
        
        // Sonuc elementini g�r�n�r yap
        resultElement.style.display = 'block';
        
        // Sonraki soru butonuna olay dinleyicisi ekle
        const nextBtn = resultElement.querySelector('#next-question');
        if (nextBtn) {
            nextBtn.id = 'next-question';
            nextBtn.className = 'next-button';
            nextBtn.textContent = this.getTranslation('next');
            nextBtn.addEventListener('click', () => this.showNextQuestion());
            resultElement.appendChild(nextBtn);
        }
    },
    
    // Bo�luk doldurma cevab�n� kontrol et
    checkBlankFillingAnswer: function(userAnswer, correctAnswer) {
        clearInterval(this.timerInterval);
        const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
        this.recordAnswer(isCorrect);

        const answerInput = document.getElementById('blank-answer');
        const submitButton = document.getElementById('submit-answer');
        if (answerInput) answerInput.disabled = true;
        if (submitButton) submitButton.disabled = true;

        // Sonucu tam ekran modal ile g�ster
        if (isCorrect) {
            // DO�RU MODAL
            const correctModal = document.createElement('div');
            correctModal.className = 'correct-modal';
            correctModal.innerHTML = `
                <div class="correct-modal-content">
                    <div class="correct-modal-icon"><i class="fas fa-crown"></i></div>
                    <div class="correct-modal-text">${this.getTranslation('correct')}</div>
                    <div class="correct-modal-score">+${Math.max(1, Math.ceil(this.timeLeft / 5))}</div>
                    <button id="next-question" class="next-button">${this.getTranslation('next')}</button>
                </div>
            `;
            document.body.appendChild(correctModal);
            correctModal.querySelector('#next-question').onclick = () => {
                correctModal.remove();
                this.showNextQuestion();
            };
            correctModal.onclick = (e) => {
                if (e.target === correctModal) correctModal.remove();
            };
            // Puan� art�r
            const scoreForQuestion = Math.max(1, Math.ceil(this.timeLeft / 5));
            this.addScore(scoreForQuestion);
        this.recordAnswer(true);
            this.correctAnswers++;
            if (this.soundEnabled) {
                const correctSound = document.getElementById('sound-correct');
                if (correctSound) correctSound.play().catch(e => {});
            }
        } else {
            // YANLI� MODAL
            this.loseLife();
            const wrongModal = document.createElement('div');
            wrongModal.className = 'wrong-modal';
            wrongModal.innerHTML = `
                <div class="wrong-modal-content">
                    <div class="wrong-modal-icon"><i class="fas fa-times-circle"></i></div>
                    <div class="wrong-modal-text">${this.getTranslation('wrong')}</div>
                    <div class="wrong-modal-correct">${this.getTranslation('correctAnswer')}: <strong>${correctAnswer}</strong></div>
                    <button id="next-question" class="next-button">${this.getTranslation('next')}</button>
                </div>
            `;
            document.body.appendChild(wrongModal);
            wrongModal.querySelector('#next-question').onclick = () => {
                wrongModal.remove();
                this.showNextQuestion();
            };
            wrongModal.onclick = (e) => {
                if (e.target === wrongModal) wrongModal.remove();
            };
            if (this.soundEnabled) {
                const wrongSound = document.getElementById('sound-wrong');
                if (wrongSound) wrongSound.play().catch(e => {});
            }
        }

        this.updateScoreDisplay();
        this.answeredQuestions++;
        this.answerTimes.push(this.TIME_PER_BLANK_FILLING_QUESTION - this.timeLeft);

        // Can kontrol� kald�r�ld� - loseLife fonksiyonu kendi ba��na can sat�n alma modal�n� handle ediyor
    },
    
    // Do�ru cevaba benzer yanl�� ��klar �ret
    generateWrongOptions: function(correctAnswer) {
        // Bu fonksiyon, do�ru cevaba benzer yanl�� ��klar �retmek i�in �e�itli stratejiler kullan�r
        
        // Basit bir strateji: T�rk�e'deki yayg�n kelimelerden rastgele 3 tane se�
        const commonWords = [
            "Elma", "T�rkiye", "Ankara", "�stanbul", "Kitap", "Bilgisayar", "Araba", 
            "Deniz", "G�ne�", "Ay", "Y�ld�z", "Okul", "��retmen", "��renci",
            "�i�ek", "A�a�", "Orman", "Da�", "Nehir", "G�l", "Okyanus", "M�zik",
            "Film", "Tiyatro", "Spor", "Futbol", "Basketbol", "Voleybol", "Tenis"
        ];
        
        let wrongOptions = [];
        
        // Do�ru cevab� d�n��t�r (say� ise kelimeye �evir, tek kelime ise ba�ka kelimeler se�)
        if (!isNaN(correctAnswer)) {
            // Say�ysa, yak�n say�lar �ret
            const correctNum = parseInt(correctAnswer);
            const randomOffset = () => Math.floor(Math.random() * 10) + 1;
            
            wrongOptions = [
                String(correctNum + randomOffset()),
                String(correctNum - randomOffset()),
                String(correctNum * 2)
            ];
        } else {
            // Kelime ise, rastgele kelimeler se�
            let availableWords = commonWords.filter(word => word.toLowerCase() !== correctAnswer.toLowerCase());
            availableWords = this.shuffleArray(availableWords);
            wrongOptions = availableWords.slice(0, 3);
        }
        
        return wrongOptions;
    },
    
    // Mevcut seviye i�in sorular� y�kle
    loadQuestionsForCurrentLevel: function() {
        console.log(`Seviye ${this.currentLevel} i�in sorular y�kleniyor...`);
        
        if (!this.questionsData || !this.selectedCategory) {
            console.error("Soru verisi veya se�ili kategori bulunamad�!");
            return;
        }
        
        // Se�ilen kategoriden sorular
        let categoryQuestions = this.questionsData[this.selectedCategory] || [];
        
        if (categoryQuestions.length === 0) {
            console.error(`${this.selectedCategory} kategorisinde soru bulunamad�!`);
            return;
        }
        
        // Progressive difficulty sistemi: B�l�me g�re otomatik zorluk belirleme
        const targetDifficulty = this.getProgressiveDifficulty();
        const difficultyNames = { 1: 'Kolay', 2: 'Orta', 3: 'Zor' };
        const difficultyName = difficultyNames[targetDifficulty];
        
        console.log(`?? Progressive Difficulty: B�l�m ${this.currentSection}/${this.getMaxSectionsForCategory()} - Zorluk: ${difficultyName} (${targetDifficulty})`);
        
        // Sorular� zorluklar�na g�re grupla
        const groupedByDifficulty = {};
        categoryQuestions.forEach(question => {
            // Zorluk seviyesi belirtilmemi�se 2 olarak kabul et (orta seviye)
            const difficulty = question.difficulty || 2;
            
            if (!groupedByDifficulty[difficulty]) {
                groupedByDifficulty[difficulty] = [];
            }
            
            groupedByDifficulty[difficulty].push(question);
        });
        
        // Debug bilgisi
        console.log('Se�ilen kategori:', this.selectedCategory);
        console.log('Kategoride toplam soru say�s�:', categoryQuestions.length);
        console.log('Zorluk seviyelerine g�re grupland�r�lm�� sorular:', groupedByDifficulty);
        console.log('Zorluk seviyesi 3 olan soru say�s�:', (groupedByDifficulty[3] || []).length);
        
        // Se�ilen zorluk seviyesinden sorular al
        let levelQuestions = [];
        
        // SADECE hedef zorluk seviyesinden sorular al
        const targetQuestions = groupedByDifficulty[targetDifficulty] || [];
        console.log(`Hedef zorluk seviyesi ${targetDifficulty} i�in mevcut soru say�s�:`, targetQuestions.length);
        
        if (targetQuestions.length > 0) {
            const shuffled = this.shuffleArray([...targetQuestions]);
            levelQuestions = shuffled;
            console.log(`? Se�ilen zorluk seviyesi (${targetDifficulty}) i�in ${levelQuestions.length} soru bulundu`);
        } else {
            console.warn(`?? Se�ilen zorluk seviyesi (${targetDifficulty}) i�in hi� soru bulunamad�!`);
        }
        
        // E�er hi� soru yoksa kullan�c�y� bilgilendir
        if (levelQuestions.length === 0) {
            const difficultyName = difficultyNames[targetDifficulty] || 'Bilinmeyen';
            
            alert(`Bu kategoride "${difficultyName}" seviyesinde soru bulunmuyor. L�tfen ba�ka bir kategori veya zorluk seviyesi se�in.`);
            
            // Kategori se�imine geri d�n
            this.displayCategories();
            return;
        }
        
        // En fazla 10 soru g�ster (kullan�c�n�n se�ti�i zorluk seviyesinden)
        this.questions = levelQuestions.slice(0, Math.min(10, levelQuestions.length));
        this.arrangeBlankFillingFirst();
        
        // Debug: Y�klenen sorular�n zorluk seviyelerini kontrol et
        const difficultyCheck = {};
        this.questions.forEach(q => {
            const diff = q.difficulty || 'undefined';
            difficultyCheck[diff] = (difficultyCheck[diff] || 0) + 1;
        });
        console.log(`?? Progressive Zorluk: ${difficultyNames[targetDifficulty]} (${targetDifficulty})`);
        console.log(`? Y�klenen ${this.questions.length} sorunun zorluk da��l�m�:`, difficultyCheck);
        console.log(`B�l�m ${this.currentSection} i�in ${this.questions.length} soru y�klendi.`);
        
        // �lk soruyu g�ster
        if (this.questions.length > 0) {
            this.currentQuestionIndex = 0;
            this.startQuiz();
        } else {
            // Yeterli soru yoksa kategori se�imine geri d�n
            console.error("Bu seviye i�in yeterli soru bulunamad�!");
            this.displayCategories();
        }
    },
    
    // Do�ru/Yanl�� tipi sorular� g�ster
    loadTrueFalseQuestion: function(questionData) {
        // Sonu� alan�n� temizle
        if (this.resultElement) {
            this.resultElement.innerHTML = '';
            this.resultElement.className = 'result';
            this.resultElement.style.display = 'none';
        }
        
        // Sonraki soru butununu gizle
        if (this.nextButton) {
            this.nextButton.style.display = 'none';
        }
        
        // Soruyu g�ster
        if (this.questionElement) {
            // �evirisi varsa �eviriyi g�ster
            if (questionData.translations && questionData.translations[this.currentLanguage] && questionData.translations[this.currentLanguage].question) {
                this.questionElement.textContent = questionData.translations[this.currentLanguage].question;
            } else {
                this.questionElement.textContent = questionData.question;
            }
            
            // E�er soruda g�rsel varsa g�ster
            if (questionData.imageUrl) {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'question-image';
                const img = document.createElement('img');
                img.src = questionData.imageUrl;
                img.alt = this.getTranslation('questionImage');
                img.style.maxWidth = '100%';
                img.style.maxHeight = '300px';
                img.style.margin = '10px auto';
                img.style.display = 'block';
                const oldImages = this.questionElement.querySelectorAll('.question-image');
                oldImages.forEach(img => img.remove());
                imageContainer.appendChild(img);
                this.questionElement.appendChild(imageContainer);
            }
        }
        
        // Do�ru/Yanl�� se�eneklerini g�ster
        if (this.optionsElement) {
            this.optionsElement.innerHTML = '';
            this.optionsElement.style.display = 'flex';
            this.optionsElement.style.flexDirection = 'column';
            this.optionsElement.style.alignItems = 'center';
            this.optionsElement.style.justifyContent = 'center';
            this.optionsElement.style.width = '100%';
            
            // Se�enekler
            const trueOption = document.createElement('button');
            trueOption.className = 'true-false-option true';
            trueOption.innerHTML = `<i class="fas fa-check"></i> ${this.getTranslation('trueOption')}`;
            
            const falseOption = document.createElement('button');
            falseOption.className = 'true-false-option false';
            falseOption.innerHTML = `<i class="fas fa-times"></i> ${this.getTranslation('falseOption')}`;
            
            // T�klama olaylar�
            trueOption.addEventListener('click', (e) => {
                // Zaten cevapland�ysa i�lem yapma
                if (e.target.disabled || e.target.classList.contains('selected') || 
                    document.querySelector('.true-false-option.selected') || 
                    document.querySelector('.result').style.display === 'block') {
                    return;
                }
                
                // T�klanan ��k� i�aretle
                e.target.classList.add('selected');
                
                this.checkAnswer(this.getTranslation('trueOption'));
            });
            
            falseOption.addEventListener('click', (e) => {
                // Zaten cevapland�ysa i�lem yapma
                if (e.target.disabled || e.target.classList.contains('selected') || 
                    document.querySelector('.true-false-option.selected') || 
                    document.querySelector('.result').style.display === 'block') {
                    return;
                }
                
                // T�klanan ��k� i�aretle
                e.target.classList.add('selected');
                
                this.checkAnswer(this.getTranslation('falseOption'));
            });
            
            // Se�enekleri ekle
            this.optionsElement.appendChild(trueOption);
            this.optionsElement.appendChild(falseOption);
        }
        
        // Sayac� ba�lat
        this.startTimer();
    },
    
    // Do�ru/Yanl�� cevab�n� kontrol et
    selectTrueFalseAnswer: function(selectedAnswer, correctAnswer) {
        // Sayac� durdur
        clearInterval(this.timerInterval);
        
        const isCorrect = selectedAnswer === correctAnswer;
        
        // Cevab� mevcut b�l�m istatisti�ine ekle
        this.recordAnswer(isCorrect);
        
        // ��klar� devre d��� b�rak ve do�ru/yanl�� renklendir
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.disabled = true;
            
            if (option.textContent === correctAnswer) {
                option.classList.add('correct');
            } else if (option.textContent === selectedAnswer && !isCorrect) {
                option.classList.add('wrong');
            }
        });
        
        // Sonucu g�ster
        if (this.resultElement) {
            if (isCorrect) {
                this.resultElement.innerHTML = `
                    <div class="correct-answer-container">
                        <div class="correct-icon"><i class="fas fa-badge-check"></i></div>
                        <div class="correct-text">Do�ru!</div>
                        <div class="correct-animation">
                            <span>+</span>
                            <span>${Math.max(1, Math.ceil(this.timeLeft / 3))}</span>
                        </div>
                    </div>
                    <button id="next-question" class="next-button">Sonraki Soru</button>
                `;
                this.resultElement.className = 'result correct';
                
                // Sonraki soru butonuna olay dinleyicisi ekle - showNextQuestion fonksiyonunu �a��r
                const nextBtn = this.resultElement.querySelector('#next-question');
                if (nextBtn) {
                    nextBtn.addEventListener('click', () => this.showNextQuestion());
                }
                
                // Puan� art�r - kalan s�reye g�re puan ver (min 1, max 5)
                const scoreForQuestion = Math.max(1, Math.ceil(this.timeLeft / 3));
                this.addScore(scoreForQuestion);
        this.recordAnswer(true);
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const correctSound = document.getElementById('sound-correct');
                    if (correctSound) correctSound.play().catch(e => console.error("Ses �al�namad�:", e));
                }
            } else {
                this.resultElement.innerHTML = `Yanl��! Do�ru cevap: <strong>${correctAnswer}</strong>`;
                this.resultElement.className = 'result wrong';
                
                // Can azalt
                this.loseLife();
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const wrongSound = document.getElementById('sound-wrong');
                    if (wrongSound) wrongSound.play().catch(e => console.error("Ses �al�namad�:", e));
                }
                
                // Yanl�� cevap durumunda sonraki soru butonunu g�ster
                if (this.nextButton) {
                    this.nextButton.style.display = 'block';
                }
            }
            
            this.resultElement.style.display = 'block';
        }
        
        // Skoru g�ncelle
        this.updateScoreDisplay();
        
        // �statisti�i g�ncelle
        this.answeredQuestions++;
        this.answerTimes.push(this.TIME_PER_QUESTION - this.timeLeft);
        
        // Can kontrol� kald�r�ld� - loseLife fonksiyonu kendi ba��na can sat�n alma modal�n� handle ediyor
    },
    
    // Profil sayfas�n� g�ster
    showProfilePage: function() {
        // Ana i�erikleri gizle
        if (this.quizElement) this.quizElement.style.display = 'none';
        if (this.resultElement) this.resultElement.style.display = 'none';
        if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'none';
        
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.style.display = 'none';
        
        const onlineGameOptions = document.getElementById('online-game-options');
        if (onlineGameOptions) onlineGameOptions.style.display = 'none';
        
        const globalLeaderboard = document.getElementById('global-leaderboard'); 
        if (globalLeaderboard) globalLeaderboard.style.display = 'none';
        
        // Di�er sayfalar� da gizle
        const friendsPage = document.getElementById('friends-page');
        if (friendsPage) friendsPage.style.display = 'none';
        
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) adminPanel.style.display = 'none';
        
        // Profil sayfas�n� g�r�nt�le
        const profilePage = document.getElementById('profile-page');
        if (profilePage) {
            profilePage.style.display = 'block';
            document.body.classList.add('profile-active');
            
            // Profil bilgilerini y�kle
            this.loadProfileData();
            
            // Profil sayfas� butonlar�na event listener'lar� ekle
            this.addProfileEventListeners();
        } else {
            // Profil sayfas� yoksa uyar� g�ster
            this.showToast("Profil sayfas� hen�z eklenmemi�", "toast-warning");
            
            // Ana men�ye geri d�n
            if (mainMenu) mainMenu.style.display = 'block';
        }
    },
    
    // Profil sayfas� butonlar�na olay dinleyicileri ekle
    addProfileEventListeners: function() {
        // Ana men�ye d�n butonu
        const backFromProfileBtn = document.getElementById('back-from-profile');
        if (backFromProfileBtn) {
            backFromProfileBtn.addEventListener('click', () => {
                // Profil sayfas�n� gizle
                const profilePage = document.getElementById('profile-page');
                if (profilePage) profilePage.style.display = 'none';
                document.body.classList.remove('profile-active');
                
                // Ana men�y� g�ster
                const mainMenu = document.getElementById('main-menu');
                if (mainMenu) mainMenu.style.display = 'block';
            });
        }
        
        // ��k�� yap butonu
        const logoutFromProfileBtn = document.getElementById('logout-from-profile');
        if (logoutFromProfileBtn) {
            logoutFromProfileBtn.addEventListener('click', () => {
                // Firebase ile ��k�� yap
                if (firebase.auth) {
                    firebase.auth().signOut().then(() => {
                        window.location.href = 'login.html';
                    }).catch(error => {
                        console.error("��k�� yap�l�rken hata olu�tu:", error);
                        this.showToast("��k�� yap�l�rken bir hata olu�tu", "toast-error");
                    });
                }
            });
        }
        
        // Profili d�zenle butonu
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                this.showEditProfileModal();
            });
            // Buton metnini g�ncelle
            editProfileBtn.innerHTML = '<i class="fas fa-edit"></i> Profili D�zenle';
        }
    },
    
    // Profil verilerini y�kle
    loadProfileData: function() {
        const userId = this.getCurrentUserId();
        
        // Kullan�c� bilgilerini y�kle
        if (firebase.auth && firebase.auth().currentUser) {
            const user = firebase.auth().currentUser;
            
            // Kullan�c� ad� ve e-posta
            const profileName = document.getElementById('profile-name');
            if (profileName) profileName.textContent = user.displayName || user.email || 'Kullan�c�';
            
            const profileEmail = document.getElementById('profile-email');
            if (profileEmail) profileEmail.textContent = user.email || '';
            
            // �yelik tarihi
            const joinDate = document.getElementById('profile-join-date');
            if (joinDate && user.metadata && user.metadata.creationTime) {
                const date = new Date(user.metadata.creationTime);
                joinDate.textContent = date.toLocaleDateString('tr-TR');
            }
        }
        
        // Firebase'den kullan�c� verilerini y�kle (puan, istatistikler vs.)
        this.loadFirebaseUserStats(userId);
        
        // Ger�ek istatistikleri g�ncelle
        this.updateRealUserStats();
            
        // Rozetleri y�kle
        this.loadUserBadgesForProfile(userId);
            
        // Y�ksek skorlar� y�kle
        this.loadHighScoresForProfile(userId);
            
        // Son aktiviteleri y�kle
        this.loadRecentActivitiesForProfile(userId);
    },

    // Mevcut kullan�c� ID'sini al
    getCurrentUserId: function() {
        if (firebase.auth && firebase.auth().currentUser) {
            return firebase.auth().currentUser.uid;
        }
        // Firebase yoksa yerel ID kullan
        return 'local-user';
    },

    // Test verileri olu�tur (geli�tirme ama�l�)
    createTestData: function() {
        const userId = this.getCurrentUserId();
        
        // Test skorlar� olu�tur
        const testScores = [
            { category: 'Genel K�lt�r', score: 85, totalQuestions: 10, correctAnswers: 8, date: Date.now() - 86400000 },
            { category: 'Bilim', score: 92, totalQuestions: 10, correctAnswers: 9, date: Date.now() - 172800000 },
            { category: 'Tarih', score: 78, totalQuestions: 10, correctAnswers: 7, date: Date.now() - 259200000 },
            { category: 'Spor', score: 90, totalQuestions: 10, correctAnswers: 9, date: Date.now() - 345600000 },
            { category: 'Co�rafya', score: 100, totalQuestions: 10, correctAnswers: 10, date: Date.now() - 432000000 }
        ];
        
        // Skorlar� localStorage'a kaydet
        localStorage.setItem('quiz-high-scores', JSON.stringify(testScores));
        
        // �statistikleri hesapla ve kaydet
        this.calculateRealStats();
        
        // �lk oyun rozetini ver
        this.badgeSystem.awardBadge(userId, this.badgeSystem.badges.firstGame);
        
        console.log('Test verileri olu�turuldu!');
        this.showToast('Test verileri olu�turuldu! Profil sayfas�n� yenileyin.', 'toast-success');
    },
    
    // Firebase'den kullan�c� istatistiklerini y�kle
    loadFirebaseUserStats: function(userId) {
        if (!firebase.firestore) {
            // Firebase yoksa localStorage'dan istatistikleri al
            const stats = this.getStats();
            this.updateProfileStats(stats);
            return;
        }
        
        const db = firebase.firestore();
        
        // Kullan�c� dok�man�ndan temel bilgileri al
        db.collection('users').doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    console.log('Kullan�c� verileri:', userData);
                    
                    // Firebase'den gelen totalScore'u quizApp'e ata
                    if (userData.totalScore !== undefined) {
                        this.totalScore = userData.totalScore;
                    }
                    
                    // Profilde toplam puan� g�ster
                    const profileTotalScore = document.getElementById('profile-total-score');
                    if (profileTotalScore) {
                        profileTotalScore.textContent = this.totalScore || 0;
                    }
                    
                    // Profilde seviyeyi g�ster
                    const profileUserLevel = document.getElementById('profile-user-level');
                    if (profileUserLevel) {
                        const level = Math.floor((this.totalScore || 0) / 500) + 1;
                        profileUserLevel.textContent = level;
                    }
                    
                    // E�er kullan�c� verisinde istatistik yoksa skorlardan hesapla
                    if (!userData.stats) {
                        this.calculateStatsFromScores(userId);
                    } else {
                        this.updateProfileStats(userData.stats);
                    }
                } else {
                    // Kullan�c� verisi yoksa skorlardan hesapla
                    this.calculateStatsFromScores(userId);
                }
            })
            .catch((error) => {
                console.error('Kullan�c� verileri y�klenirken hata:', error);
                // Hata durumunda localStorage'dan al
                const stats = this.getStats();
                this.updateProfileStats(stats);
            });
    },
    
    // Skorlardan istatistikleri hesapla
    calculateStatsFromScores: function(userId) {
        if (!firebase.firestore) return;
        
        const db = firebase.firestore();
        
        // Firestore'daki highScores koleksiyonundan kullan�c�n�n skorlar�n� al
        db.collection('highScores')
            .where('userId', '==', userId)
            .get()
            .then((querySnapshot) => {
                let totalGames = 0;
                let totalQuestions = 0;
                let totalCorrect = 0;
                let categoryStats = {};
                
                querySnapshot.forEach((doc) => {
                    const scoreData = doc.data();
                    totalGames++;
                    totalQuestions += scoreData.totalQuestions || 0;
                    totalCorrect += scoreData.correctAnswers || scoreData.score || 0;
                    
                    // Kategori istatistikleri
                    const category = scoreData.category || 'Genel';
                    if (!categoryStats[category]) {
                        categoryStats[category] = {
                            games: 0,
                            questions: 0,
                            correct: 0
                        };
                    }
                    categoryStats[category].games++;
                    categoryStats[category].questions += scoreData.totalQuestions || 0;
                    categoryStats[category].correct += scoreData.correctAnswers || scoreData.score || 0;
                });
                
                const stats = {
                    totalGames,
                    totalQuestions,
                    correctAnswers: totalCorrect,
                    categoryStats
                };
                
                console.log('Hesaplanan istatistikler:', stats);
                this.updateProfileStats(stats);
                
                // �statistikleri kullan�c� dok�man�na kaydet
                db.collection('users').doc(userId).update({
                    stats: stats,
                    statsLastUpdated: new Date()
                }).catch((error) => {
                    console.error('�statistikler kaydedilirken hata:', error);
                });
            })
            .catch((error) => {
                console.error('Skorlar al�n�rken hata:', error);
                // Hata durumunda localStorage'dan al
                const stats = this.getStats();
                this.updateProfileStats(stats);
            });
    },
    
    // Profil istatistiklerini g�ncelle
    updateProfileStats: function(stats) {
        console.log('updateProfileStats �a�r�ld�, stats:', stats);
        
        const totalGames = document.getElementById('stats-total-games');
        if (totalGames) {
            totalGames.textContent = stats.totalGames || 0;
            console.log('Toplam oyun g�ncellendi:', stats.totalGames || 0);
        }
        
        const totalQuestions = document.getElementById('stats-total-questions');
        if (totalQuestions) {
            totalQuestions.textContent = stats.totalQuestions || 0;
            console.log('Toplam soru g�ncellendi:', stats.totalQuestions || 0);
        }
        
        const correctAnswers = document.getElementById('stats-correct-answers');
        if (correctAnswers) {
            correctAnswers.textContent = stats.correctAnswers || 0;
            console.log('Do�ru cevap g�ncellendi:', stats.correctAnswers || 0);
        }
        
        // Do�ruluk oran�
        const accuracy = document.getElementById('stats-accuracy');
        if (accuracy) {
            const accuracyValue = stats.totalQuestions > 0 
                ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
                : 0;
            accuracy.textContent = `%${accuracyValue}`;
            console.log('Do�ruluk oran� g�ncellendi:', accuracyValue);
        }
    },

    // Ger�ek kullan�c� istatistiklerini al ve g�ncelle
    updateRealUserStats: function() {
        const userId = this.getCurrentUserId();
        if (!userId) return;

        // localStorage'dan ger�ek istatistikleri �ek
        const realStats = this.calculateRealStats();
        
        // Profil sayfas� a��ksa istatistikleri g�ncelle
        const profilePage = document.getElementById('profile-page');
        if (profilePage && profilePage.style.display !== 'none') {
            this.updateProfileStats(realStats);
            
            // Toplam puan� g�ncelle (Firebase'den gelen veya mevcut toplam puan)
            const profileTotalScore = document.getElementById('profile-total-score');
            if (profileTotalScore) {
                profileTotalScore.textContent = this.totalScore || 0;
            }
            
            // Seviyeyi g�ncelle (toplam puana g�re)
            const profileUserLevel = document.getElementById('profile-user-level');
            if (profileUserLevel) {
                const level = Math.floor((this.totalScore || 0) / 500) + 1;
                profileUserLevel.textContent = level;
            }
        }

        // Rozet sistemini kontrol et
        this.badgeSystem.checkAndAwardBadges(userId, realStats);
        
        return realStats;
    },

    // Ger�ek istatistikleri hesapla
    calculateRealStats: function() {
        try {
            console.log('calculateRealStats �a�r�ld�');
            
            // Oyun ge�mi�ini al
            const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
            console.log('Oyun ge�mi�i:', gameHistory);
            
            let totalGames = 0;
            let totalQuestions = 0;
            let correctAnswers = 0;
            let totalScore = 0;
            let perfectGames = 0;
            let fastAnswers = 0;
            let categoriesPlayed = new Set();
            let categoryStats = {};

            // Her oyunu analiz et
            gameHistory.forEach(game => {
                totalGames++;
                totalQuestions += game.totalQuestions || 0;
                correctAnswers += game.correctAnswers || 0;
                totalScore += game.score || 0;
                
                // M�kemmel oyunlar� say
                if (game.correctAnswers === game.totalQuestions && game.totalQuestions > 0) {
                    perfectGames++;
                }
                
                // H�zl� cevaplar� say (ortalama s�re 10 saniyeden az ise)
                if (game.averageTime && game.averageTime < 10) {
                    fastAnswers++;
                }
                
                // Kategorileri topla
                if (game.category) {
                    categoriesPlayed.add(game.category);
                    
                    // Kategori istatistikleri
                    if (!categoryStats[game.category]) {
                        categoryStats[game.category] = { total: 0, correct: 0, games: 0 };
            }
                    categoryStats[game.category].total += game.totalQuestions || 0;
                    categoryStats[game.category].correct += game.correctAnswers || 0;
                    categoryStats[game.category].games++;
                }
            });

            // High scores'tan da veri topla (eski format deste�i i�in)
            const categories = ['Genel K�lt�r', 'Bilim', 'Teknoloji', 'Spor', 'M�zik', 'Tarih', 'Co�rafya', 'Sanat', 'Edebiyat', 'Hayvanlar', 'Matematik'];
            
            categories.forEach(category => {
                const categoryScores = JSON.parse(localStorage.getItem(`highScores_${category}`) || '[]');
                categoryScores.forEach(score => {
                    if (score.score) {
                        // Sadece gameHistory'de yoksa ekle (duplikasyon �nleme)
                        const existsInHistory = gameHistory.some(game => 
                            game.category === category && 
                            Math.abs((game.score || 0) - score.score) < 5 // K���k fark tolerans�
                        );
                        
                        if (!existsInHistory) {
                            totalGames++;
                        totalScore += score.score;
                            totalQuestions += score.totalQuestions || 10; // Varsay�lan
                            correctAnswers += score.correctAnswers || Math.round(score.score / 10);
                        
                        if (score.percentage === 100) {
                            perfectGames++;
                        }
                        categoriesPlayed.add(category);
                            
                            // Kategori istatistikleri
                            if (!categoryStats[category]) {
                                categoryStats[category] = { total: 0, correct: 0, games: 0 };
                            }
                            categoryStats[category].total += score.totalQuestions || 10;
                            categoryStats[category].correct += score.correctAnswers || Math.round(score.score / 10);
                            categoryStats[category].games++;
                        }
                    }
                });
            });

            const stats = {
                totalGames,
                totalQuestions,
                correctAnswers,
                totalScore,
                perfectGames,
                fastAnswers,
                categoriesPlayed: categoriesPlayed.size,
                accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
                averageScore: totalGames > 0 ? Math.round(totalScore / totalGames) : 0,
                highestScore: Math.max(...[totalScore, ...categories.map(cat => {
                    const scores = JSON.parse(localStorage.getItem(`highScores_${cat}`) || '[]');
                    return scores.length > 0 ? Math.max(...scores.map(s => s.score || 0)) : 0;
                })]),
                categoryStats
            };

            console.log('Hesaplanan istatistikler:', stats);

            // �statistikleri localStorage'a kaydet
            localStorage.setItem('userStats', JSON.stringify(stats));
            localStorage.setItem('quiz-user-stats', JSON.stringify(stats));
            
            return stats;
        } catch (error) {
            console.error('�statistikler hesaplan�rken hata:', error);
            return {
                totalGames: 0,
                totalQuestions: 0,
                correctAnswers: 0,
                totalScore: 0,
                perfectGames: 0,
                fastAnswers: 0,
                categoriesPlayed: 0,
                accuracy: 0,
                averageScore: 0,
                highestScore: 0,
                categoryStats: {}
            };
        }
    },
    
    // Kullan�c� rozetlerini profil i�in y�kle
    loadUserBadgesForProfile: function(userId) {
        const badgesContainer = document.getElementById('profile-badges-container');
        if (!badgesContainer) return;
        
        badgesContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Rozetler y�kleniyor...</div>';
        
        // Kullan�c�n�n kazand��� rozetleri al
        const userBadges = this.badgeSystem.getUserBadges(userId);
        // T�m mevcut rozetleri al
        const allBadges = this.badgeSystem.badges;
        
        setTimeout(() => {
            badgesContainer.innerHTML = '';
            
            // T�m rozetleri g�ster (kazan�lan ve kazan�lmayan)
            Object.values(allBadges).forEach(badge => {
                const badgeElement = document.createElement('div');
                const isEarned = userBadges[badge.id] !== undefined;
                
                badgeElement.className = isEarned ? 'badge-item earned' : 'badge-item';
                badgeElement.setAttribute('data-badge-id', badge.id);
                
                let badgeDate = '';
                if (isEarned) {
                    const earnedDate = userBadges[badge.id].earnedDate ? 
                        new Date(userBadges[badge.id].earnedDate).toLocaleDateString('tr-TR') : 
                        'Bilinmiyor';
                    badgeDate = earnedDate;
                } else {
                    badgeDate = 'Hen�z kazan�lmad�';
                }
                
                        badgeElement.innerHTML = `
                    <i class="badge-icon ${badge.icon || 'fas fa-award'}"></i>
                            <div class="badge-name">${badge.name || 'Bilinmeyen Rozet'}</div>
                    <div class="badge-date">${badgeDate}</div>
                        `;
                
                // Rozet t�klama olay� ekle
                badgeElement.addEventListener('click', () => {
                    this.showBadgeInfoModal(badge, isEarned, badgeDate);
                });
                        
                        badgesContainer.appendChild(badgeElement);
                    });
            
            // Rozetleri y�kledikten sonra g�ncel istatistikleri kontrol et ve rozetleri g�ncelle
            this.checkAndUpdateBadges(userId);
            
            // Hi� rozet yoksa placeholder g�ster
            if (Object.keys(allBadges).length === 0) {
                badgesContainer.innerHTML = '<div class="badge-placeholder">Hen�z tan�ml� rozet yok</div>';
            }
        }, 500);
    },

    // Rozet bilgi modal�n� g�ster
    showBadgeInfoModal: function(badge, isEarned, earnedDate) {
        // Modal olu�tur
        const modal = document.createElement('div');
        modal.className = 'modal badge-info-modal';
        modal.id = 'badge-info-modal';
        
        const statusText = isEarned ? '? Kazan�ld�!' : '? Hen�z Kazan�lmad�';
        const statusClass = isEarned ? 'earned' : 'not-earned';
        const howToEarnText = this.getBadgeRequirementText(badge);
        
        modal.innerHTML = `
            <div class="modal-content badge-modal-content">
                <div class="modal-header">
                    <h3><i class="${badge.icon}"></i> ${badge.name}</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="badge-info-display">
                        <div class="badge-icon-large ${statusClass}">
                            <i class="${badge.icon}"></i>
                </div>
                        <div class="badge-details">
                            <h4>${badge.name}</h4>
                            <p class="badge-description">${badge.description}</p>
                            <div class="badge-status ${statusClass}">
                                ${statusText}
                            </div>
                            ${isEarned ? `<div class="badge-earned-date">Kazan�ld�: ${earnedDate}</div>` : ''}
                        </div>
                    </div>
                    <div class="badge-requirements">
                        <h5><i class="fas fa-tasks"></i> Nas�l Kazan�l�r:</h5>
                        <p>${howToEarnText}</p>
                    </div>
                </div>
                </div>
            `;
        
        document.body.appendChild(modal);
        
        // Modal g�ster
        setTimeout(() => modal.classList.add('show'), 10);
    },

    // Rozet gereksinimlerini a��klayan metin
    getBadgeRequirementText: function(badge) {
        const requirements = {
            'firstGame': '�lk quiz oyununuzu oynay�n.',
            'perfectScore': 'Bir oyunda t�m sorular� do�ru cevaplay�n (10/10 puan).',
            'speedster': '5 soruyu 10 saniyeden k�sa s�rede cevaplay�n.',
            'scholar': 'Toplamda 50 soruyu do�ru cevaplay�n.',
            'dedicated': 'Toplamda 10 oyun tamamlay�n.',
            'genius': 'En az 20 soru cevaplad�ktan sonra %90 veya �zeri do�ruluk oran�na sahip olun.',
            'explorer': '5 farkl� kategoride oyun oynay�n.'
        };
        return requirements[badge.id] || 'Bu rozetin gereksinimleri hen�z tan�mlanmam��.';
    },

    // Rozetleri kontrol et ve g�ncelle
    checkAndUpdateBadges: function(userId) {
        // G�ncel istatistikleri al
        const currentStats = this.calculateRealStats();
        
        // Yeni rozetleri kontrol et
        const newBadges = this.badgeSystem.checkAndAwardBadges(userId, currentStats);
        
        // E�er yeni rozet kazan�ld�ysa profili yenile
        if (newBadges && newBadges.length > 0) {
            setTimeout(() => {
                this.loadUserBadgesForProfile(userId);
            }, 1000);
        }
    },
    
    // Y�ksek skorlar� profil i�in y�kle
    loadHighScoresForProfile: function(userId) {
        const highScoresTable = document.getElementById('profile-high-scores');
        if (!highScoresTable) return;
        
        highScoresTable.innerHTML = '<tr><td colspan="3" class="loading">Skorlar y�kleniyor...</td></tr>';
        
        if (firebase.firestore) {
            const db = firebase.firestore();
            
            db.collection('highScores')
                .where('userId', '==', userId)
                .orderBy('score', 'desc')
                .limit(10)
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        highScoresTable.innerHTML = '<tr><td colspan="3" class="no-data">Hen�z kaydedilen skor yok</td></tr>';
                        return;
                    }
                    
                    highScoresTable.innerHTML = '';
                    querySnapshot.forEach(doc => {
                        const scoreData = doc.data();
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${scoreData.category || 'Genel'}</td>
                            <td>${scoreData.score || 0}</td>
                            <td>${scoreData.date ? new Date(scoreData.date.toDate()).toLocaleDateString('tr-TR') : 'Bilinmiyor'}</td>
                        `;
                        highScoresTable.appendChild(row);
                    });
                })
                .catch(error => {
                    console.error('Y�ksek skorlar y�klenirken hata:', error);
                    highScoresTable.innerHTML = '<tr><td colspan="3" class="no-data">Skorlar y�klenirken hata olu�tu</td></tr>';
                });
        } else {
            // Firebase yoksa localStorage'dan al
            const scores = this.getHighScores();
            if (scores.length === 0) {
                highScoresTable.innerHTML = '<tr><td colspan="3" class="no-data">Hen�z kaydedilen skor yok</td></tr>';
                return;
            }
            
            highScoresTable.innerHTML = '';
            scores.slice(0, 10).forEach(score => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${score.category || 'Genel'}</td>
                    <td>${score.score || 0}</td>
                    <td>${score.date ? new Date(score.date).toLocaleDateString('tr-TR') : 'Bug�n'}</td>
                `;
                highScoresTable.appendChild(row);
            });
        }
    },
    
    // Son aktiviteleri profil i�in y�kle
    loadRecentActivitiesForProfile: function(userId) {
        const activitiesList = document.getElementById('recent-activities-list');
        if (!activitiesList) return;
        
        activitiesList.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Aktiviteler y�kleniyor...</div>';
        
        // Firebase'den aktiviteleri y�kleme
        if (firebase.auth && firebase.firestore && this.isLoggedIn) {
            const db = firebase.firestore();
            db.collection('users').doc(userId)
                .collection('activities')
                .orderBy('timestamp', 'desc')
                .limit(5)
                .get()
                .then((querySnapshot) => {
                    // Firebase'den gelen aktiviteleri i�le
                    if (!querySnapshot.empty) {
                        activitiesList.innerHTML = '';
                        querySnapshot.forEach((doc) => {
                            const activity = doc.data();
                            this.renderActivity(activity, activitiesList);
                        });
                    } else {
                        // Firebase'de aktivite yoksa localStorage'a bak
                        this.loadLocalActivities(activitiesList, userId);
                    }
                })
                .catch((error) => {
                    console.error("Aktiviteler y�klenirken hata olu�tu:", error);
                    // Hata durumunda localStorage'a bak
                    this.loadLocalActivities(activitiesList, userId);
                });
        } else {
            // Firebase yoksa veya kullan�c� giri� yapmam��sa localStorage'a bak
            this.loadLocalActivities(activitiesList, userId);
        }
    },
    
    // LocalStorage'dan aktiviteleri y�kle
    loadLocalActivities: function(activitiesList, userId) {
        try {
            const storedActivities = localStorage.getItem(`user-activities-${userId}`);
            const activities = storedActivities ? JSON.parse(storedActivities) : [];
            
            if (activities && activities.length > 0) {
                activitiesList.innerHTML = '';
                activities.forEach(activity => {
                    this.renderActivity(activity, activitiesList);
                });
            } else {
                this.generateSampleActivities(activitiesList);
            }
        } catch (error) {
            console.error("LocalStorage aktiviteleri i�lenirken hata:", error);
            this.generateSampleActivities(activitiesList);
        }
    },
    
    // Aktivite olu�tur
    createUserActivity: function(type, title, score = null, category = null) {
        const userId = this.getCurrentUserId();
        const now = new Date();
        
        const activityData = {
            type: type,           // 'game', 'badge', 'task', vb.
            title: title,         // Aktivite ba�l���
            timestamp: now,       // Ger�ekle�me zaman�
            score: score,         // Varsa skor de�eri
            category: category,   // Varsa kategori
            icon: this.getActivityIcon(type) // T�r i�in uygun ikon
        };
        
        // Firebase'e aktiviteyi kaydet
        if (firebase.auth && firebase.firestore && this.isLoggedIn) {
            const db = firebase.firestore();
            db.collection('users').doc(userId)
                .collection('activities')
                .add(activityData)
                .then(() => {
                    console.log("Aktivite Firebase'e kaydedildi:", title);
                })
                .catch((error) => {
                    console.error("Aktivite kaydedilirken hata:", error);
                    // Hata durumunda localStorage'a kaydet
                    this.saveActivityToLocalStorage(userId, activityData);
                });
        } else {
            // Firebase yoksa localStorage'a kaydet
            this.saveActivityToLocalStorage(userId, activityData);
        }
    },
    
    // Aktiviteyi LocalStorage'a kaydet
    saveActivityToLocalStorage: function(userId, activityData) {
        try {
            const storedActivities = localStorage.getItem(`user-activities-${userId}`);
            const activities = storedActivities ? JSON.parse(storedActivities) : [];
            
            // Aktiviteyi ekle ve en fazla 10 aktivite sakla
            activities.unshift(activityData);
            if (activities.length > 10) activities.pop();
            
            localStorage.setItem(`user-activities-${userId}`, JSON.stringify(activities));
            console.log("Aktivite localStorage'a kaydedildi");
        } catch (error) {
            console.error("Aktivite localStorage'a kaydedilirken hata:", error);
        }
    },
    
    // Aktivite tipi i�in uygun ikon s�n�f�
    getActivityIcon: function(type) {
        switch(type) {
            case 'game': return 'fas fa-gamepad';
            case 'badge': return 'fas fa-award';
            case 'task': return 'fas fa-tasks';
            case 'level': return 'fas fa-level-up-alt';
            case 'purchase': return 'fas fa-shopping-cart';
            case 'achievement': return 'fas fa-trophy';
            default: return 'fas fa-history';
        }
    },
    
    // Aktiviteyi HTML olarak render et
    renderActivity: function(activity, container) {
        const activityTime = activity.timestamp ? this.getTimeAgo(activity.timestamp) : activity.time;
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';
        activityElement.innerHTML = `
            <div class="activity-icon"><i class="${activity.icon}"></i></div>
            <div class="activity-details">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activityTime}</div>
            </div>
            ${activity.score ? `<div class="activity-score">Skor: ${activity.score}</div>` : ''}
        `;
        container.appendChild(activityElement);
    },
    
    // Ge�en zaman� belirtilen format� �evir (1 saat �nce, 2 g�n �nce vb.)
    getTimeAgo: function(timestamp) {
        const now = new Date();
        const activityTime = timestamp instanceof Date ? timestamp : new Date(timestamp);
        const diffMs = now - activityTime;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffDay > 30) {
            return activityTime.toLocaleDateString('tr-TR');
        } else if (diffDay > 0) {
            return `${diffDay} g�n �nce`;
        } else if (diffHour > 0) {
            return `${diffHour} saat �nce`;
        } else if (diffMin > 0) {
            return `${diffMin} dakika �nce`;
        } else {
            return 'Az �nce';
        }
    },
    
    // �rnek aktiviteleri g�ster - veri yoksa
    generateSampleActivities: function(activitiesList) {
        activitiesList.innerHTML = '';
        
        // Rastgele kategori se�
        const categories = ['Genel K�lt�r', 'Tarih', 'Bilim', 'Spor', 'Sanat', 'Co�rafya'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        // �rnek aktiviteler
        const sampleActivities = [
            {
                icon: 'fas fa-gamepad',
                title: `${randomCategory} kategorisinde bir oyun oynand�`,
                time: '2 saat �nce',
                score: Math.floor(Math.random() * 100)
            },
            {
                icon: 'fas fa-award',
                title: '"Bilgi Ustas�" rozeti kazan�ld�',
                time: '1 g�n �nce',
                score: null
            },
            {
                icon: 'fas fa-tasks',
                title: 'G�nl�k g�rev tamamland�',
                time: '2 g�n �nce',
                score: null
            }
        ];
        
        // �rnek aktiviteleri render et
        sampleActivities.forEach(activity => {
            this.renderActivity(activity, activitiesList);
        });
    },
    
    // Profil d�zenleme modal�n� g�ster
    showEditProfileModal: function() {
        // Modal olu�tur
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'edit-profile-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> Profili D�zenle</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="edit-display-name">G�r�nen Ad:</label>
                        <input type="text" id="edit-display-name" placeholder="Ad�n�z� girin">
                    </div>
                    <div class="form-group">
                        <label for="edit-bio">Hakk�mda:</label>
                        <textarea id="edit-bio" placeholder="Kendiniz hakk�nda k�sa bilgi..." rows="3"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="this.closest('.modal').remove()">�ptal</button>
                        <button class="btn-primary" onclick="quizApp.saveProfileChanges()">Kaydet</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Mevcut verileri doldur
        const displayNameInput = document.getElementById('edit-display-name');
        const bioInput = document.getElementById('edit-bio');
        
        if (firebase.auth && firebase.auth().currentUser) {
            const user = firebase.auth().currentUser;
            if (displayNameInput && user.displayName) {
                displayNameInput.value = user.displayName;
            }
                            } else {
            // Firebase yoksa localStorage'dan al
            const userId = this.getCurrentUserId();
            try {
                const profileData = localStorage.getItem(`user-profile-${userId}`);
                if (profileData) {
                    const profile = JSON.parse(profileData);
                    if (displayNameInput && profile.displayName) {
                        displayNameInput.value = profile.displayName;
                    }
                    if (bioInput && profile.bio) {
                        bioInput.value = profile.bio;
                            }
                        } else {
                    // Varsay�lan kullan�c� ad�n� g�ster
                    const currentName = document.getElementById('profile-name')?.textContent;
                    if (displayNameInput && currentName) {
                        displayNameInput.value = currentName;
                    }
                }
            } catch (error) {
                console.error('Profil verileri y�klenemedi:', error);
            }
        }
        
        // Modal g�ster
        setTimeout(() => modal.classList.add('show'), 10);
    },
    
    // Profil de�i�ikliklerini kaydet
    saveProfileChanges: function() {
        const displayName = document.getElementById('edit-display-name').value.trim();
        const bio = document.getElementById('edit-bio').value.trim();
        
        if (!displayName) {
            this.showToast('G�r�nen ad bo� olamaz', 'toast-error');
            return;
        }
        
        // Firebase kullan�c�s� varsa
        if (firebase.auth && firebase.auth().currentUser) {
            const user = firebase.auth().currentUser;
            
            // Firebase Authentication'da displayName g�ncelle
            user.updateProfile({
                displayName: displayName
            }).then(() => {
                // Firestore'da da g�ncelle (varsa)
                if (firebase.firestore) {
                    const db = firebase.firestore();
                    db.collection('users').doc(user.uid).update({
                        displayName: displayName,
                        bio: bio,
                        lastUpdated: new Date()
                    }).catch(error => {
                        console.error('Firestore g�ncelleme hatas�:', error);
                    });
                }
                
                this.updateProfileUI(displayName, bio);
                this.showToast('Profil ba�ar�yla g�ncellendi', 'toast-success');
            }).catch(error => {
                console.error('Profil g�ncelleme hatas�:', error);
                this.showToast('Profil g�ncellenirken hata olu�tu', 'toast-error');
                });
        } else {
            // Firebase yoksa localStorage'a kaydet
            const userId = this.getCurrentUserId();
            const profileData = {
                displayName: displayName,
                bio: bio,
                lastUpdated: new Date().toISOString()
            };
            
            try {
                localStorage.setItem(`user-profile-${userId}`, JSON.stringify(profileData));
                this.updateProfileUI(displayName, bio);
                this.showToast('Profil ba�ar�yla g�ncellendi', 'toast-success');
            } catch (error) {
                console.error('Profil localStorage\'a kaydedilemedi:', error);
                this.showToast('Profil kaydedilemedi', 'toast-error');
            }
        }
    },

    // Profil UI'sini g�ncelle
    updateProfileUI: function(displayName, bio) {
        // Profil sayfas�ndaki bilgileri g�ncelle
        const profileName = document.getElementById('profile-name');
        if (profileName) {
            profileName.textContent = displayName;
        }
        
        // Bio varsa g�ster (hen�z UI'da yer yoksa eklenecek)
        const profileBio = document.getElementById('profile-bio');
        if (profileBio) {
            profileBio.textContent = bio;
        }
        
        // Modal kapat
        const modal = document.getElementById('edit-profile-modal');
        if (modal) modal.remove();
        
        // Profil sayfas�n� yenile
        this.loadProfileData();
    },

// @ts-nocheck
/* eslint-disable */
// Bu dosya JavaScript'tir, TypeScript de�ildir.
// Script Version 3.0 - Firebase puan kaydetme sistemi tamamland�

// Tam Ekran Modunu Ayarla
function initFullscreenMode() {
    // PWA tam ekran modunu etkinle�tir
    if ('serviceWorker' in navigator) {
        // PWA modunda �al���yor mu kontrol et
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                           window.navigator.standalone ||
                           document.referrer.includes('android-app://');
        
        if (isStandalone) {
            console.log('? PWA standalone modunda �al���yor');
            
            // Tam ekran i�in CSS s�n�flar� ekle
            document.body.classList.add('pwa-fullscreen');
            document.documentElement.classList.add('pwa-fullscreen');
            
            // Viewport meta tag g�ncelle
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
            }
            
            // Status bar rengi ayarla
            const themeColor = document.querySelector('meta[name="theme-color"]');
            if (themeColor) {
                themeColor.setAttribute('content', '#1e40af');
            }
        } else {
            console.log('?? PWA standalone modunda �al��m�yor - taray�c� modunda');
        }
    }
    
    // CSS ile tam ekran stillerini uygula
    const fullscreenStyles = `
        .pwa-fullscreen {
            height: 100vh !important;
            height: 100dvh !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        .pwa-fullscreen .container {
            height: 100vh !important;
            height: 100dvh !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow-y: auto !important;
        }
        
        /* Safe area i�in padding ekle */
        @supports (padding: max(0px)) {
            .pwa-fullscreen .container {
                padding-top: max(env(safe-area-inset-top), 0px) !important;
                padding-bottom: max(env(safe-area-inset-bottom), 0px) !important;
                padding-left: max(env(safe-area-inset-left), 0px) !important;
                padding-right: max(env(safe-area-inset-right), 0px) !important;
            }
        }
        
        /* Capacitor/Cordova i�in */
        .platform-cordova .pwa-fullscreen,
        .platform-capacitor .pwa-fullscreen {
            height: 100vh !important;
            overflow: hidden !important;
        }
    `;
    
    // Stilleri head'e ekle
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = fullscreenStyles;
    document.head.appendChild(styleSheet);
}

// Sayfa Y�kleme ��lemleri
document.addEventListener('DOMContentLoaded', () => {
    // Tam ekran modunu ba�lat
    initFullscreenMode();
    
    // Ana i�eri�i g�r�n�r yap
    const container = document.querySelector('.container');
    if (container) {
        container.style.visibility = 'visible';
        container.classList.add('fade-in');
    }
});

const quizApp = {
    // DOM Elements
    questionElement: document.getElementById('question'),
    optionsElement: document.getElementById('options'),
    resultElement: document.getElementById('result'),
    scoreElement: document.getElementById('score'),
    restartButton: document.getElementById('restart'),
    quizElement: document.getElementById('quiz'),
    containerElement: document.querySelector('.container'),
    categorySelectionElement: document.getElementById('category-selection'),
    categoriesElement: document.getElementById('categories'),
    nextButton: document.getElementById('next-question'),
    highScoresListElement: document.getElementById('high-scores-list'),
    timeLeftElement: document.getElementById('time-left'),
    badgesContainer: document.getElementById('badges'),
    themeToggle: document.getElementById('checkbox'),
    jokerFiftyBtn: null, // document.getElementById('joker-fifty'),
    jokerHintBtn: null, // document.getElementById('joker-hint'),
    jokerTimeBtn: null, // document.getElementById('joker-time'),
    jokerSkipBtn: null, // document.getElementById('joker-skip'),
    jokerStoreBtn: null, // document.getElementById('joker-store'),
    
    // State Variables
    currentQuestionIndex: 0,
    score: 0,
    totalScore: 0, // <-- EKLEND�: Toplam birikmi� puan
    sessionScore: 0, // <-- EKLEND�: Bu oturumdaki toplam puan
    userLevel: 1, // <-- EKLEND�: Kullan�c� seviyesi
    levelProgress: 0, // <-- EKLEND�: Seviye ilerlemesi (XP)
    correctAnswers: 0,
    selectedCategory: null,
    questions: [],
    allQuestionsData: {},
    questionsData: {}, 
    timerInterval: null,
    timeLeft: 0,
    answeredQuestions: 0,
    answerTimes: [],
    jokersUsed: {fifty: false, hint: false, time: false, skip: false},
    jokerInventory: {fifty: 0, hint: 0, time: 0, skip: 0},
    soundEnabled: true,
    lives: 5,
    currentLevel: 1,
    levelProgress: 0,
    skipJokerActive: false,
    currentSection: 1, // �u anki b�l�m numaras�
    totalSections: 50, // Toplam b�l�m say�s�
    sectionStats: [], // Her b�l�m i�in do�ru/yanl�� cevap istatistiklerini saklayacak dizi
    currentLanguage: 'tr', // Varsay�lan dil
    translatedQuestions: {}, // �evrilmi� sorular
    isLoggedIn: false, // <-- EKLEND�: Kullan�c� giri� durumu
    currentUser: null, // <-- EKLEND�: Mevcut kullan�c�
    userSettings: {}, // <-- EKLEND�: Kullan�c� ayarlar�
    totalScore: 0, // <-- EKLEND�: Toplam puan
    sessionScore: 0, // <-- EKLEND�: Oturum puan�
    userLevel: 1, // <-- EKLEND�: Kullan�c� seviyesi
    levelProgress: 0, // <-- EKLEND�: Seviye ilerlemesi
    
    // Constants
    HIGH_SCORES_KEY: 'quizHighScores',
    MAX_HIGH_SCORES: 5,
    TIME_PER_QUESTION: 45,
    TIME_PER_BLANK_FILLING_QUESTION: 60,
    SEEN_QUESTIONS_KEY: 'quizSeenQuestions',
    QUESTIONS_PER_GAME: 'dynamic', // Art�k kategoriye g�re dinamik
    STATS_KEY: 'quizStats',
    USER_SETTINGS_KEY: 'quizSettings',
    JOKER_INVENTORY_KEY: 'quizJokerInventory',
    LANGUAGE_KEY: 'quizLanguage',
    
    // Ba�lang��
    init: function() {
        console.log("Quiz Uygulamas� Ba�lat�l�yor...");
        
        // �lk Firebase durumu kontrol�
        console.log('?? Firebase �lk Durum Kontrol�:');
        console.log('- Firebase nesnesi:', typeof firebase !== 'undefined' ? 'VAR' : 'YOK');
        console.log('- Firebase.auth:', firebase && firebase.auth ? 'VAR' : 'YOK');
        console.log('- Firebase.firestore:', firebase && firebase.firestore ? 'VAR' : 'YOK');
        
        // Taray�c� �zelliklerini kontrol et
        this.checkBrowserSupport();
        
        try {
            // �nce dil ayarlar�n� y�kle
            this.loadLanguageSettings();
            
            // Kullan�c� aray�z�n� haz�rla
            this.initUI();
            
            // �nce kullan�c� ayarlar�n� y�kle
            this.loadUserSettings();
            
            // localStorage'dan skor verilerini y�kle
            this.loadScoreFromLocalStorage();
            
            // Soru verilerini y�kle
            this.loadQuestionsData()
                .then(() => {
                    console.log("T�m veriler ba�ar�yla y�klendi.");
                    
                    // Soru verilerinin y�klenip y�klenmedi�ini kontrol et
                    if (!this.questionsData || Object.keys(this.questionsData).length === 0) {
                        console.error("Soru verileri y�klenemedi veya bo�!");
                        
                        // Tekrar y�klemeyi dene
                        this.loadQuestionsData()
                            .then(() => {
                                console.log("�kinci deneme: Soru verileri y�klendi");
                            })
                            .catch(err => {
                                console.error("�kinci deneme ba�ar�s�z:", err);
                                this.showAlert(this.getTranslation('questionLoadError'));
                            });
                    }
                    
                    // Sorular� �evir
                    this.translateQuestions();
                })
                .catch(error => {
                    console.error("Soru verileri y�klenirken hata olu�tu:", error);
                });
        } catch (error) {
            console.error("Ba�latma s�ras�nda kritik hata:", error);
        }
    },
    
    // Mevcut dil i�in metni getir
    getTranslation: function(key) {
        try {
            // Dil dosyas� import edilmi� mi kontrol et
            if (typeof languages === 'undefined') {
                console.warn('Dil dosyas� y�klenemedi. Varsay�lan metin g�steriliyor.');
                return this.getDefaultTranslation(key);
            }
            
            // Mevcut dil i�in �eviri var m�?
            if (languages[this.currentLanguage] && languages[this.currentLanguage][key] !== undefined) {
                return languages[this.currentLanguage][key];
            }
            
            // T�rk�e varsay�lan dil olarak kullan�l�r
            if (languages.tr && languages.tr[key] !== undefined) {
                return languages.tr[key];
            }
            
            // �eviri bulunamazsa, anahtar� d�nd�r
            console.warn(`'${key}' i�in �eviri bulunamad�.`);
            return key;
        } catch (error) {
            console.error('�eviri al�n�rken hata olu�tu:', error);
            return this.getDefaultTranslation(key);
        }
    },
    
    // Varsay�lan �evirileri d�nd�r
    getDefaultTranslation: function(key) {
        // S�k kullan�lan metinler i�in varsay�lan de�erler
        const defaults = {
            'appName': 'Quiz Game',
            'loading': 'Loading...',
            'restart': 'Restart',
            'next': 'Next',
            'score': 'Score',
            'correct': 'Correct!',
            'wrong': 'Wrong!',
            'timeUp': 'Time is up!',
            'correctAnswer': 'Correct answer',
            'questionImage': 'Question image',
            'true': 'TRUE',
            'false': 'FALSE'
        };
        
        return defaults[key] || key;
    },
    
    // Dil ayarlar�n� y�kle
    loadLanguageSettings: function() {
        try {
            // Local storage'dan tercihler ekran�nda se�ilen dili kontrol et
            const userLanguage = localStorage.getItem('user_language');
            
            if (userLanguage && ['tr', 'en', 'de'].includes(userLanguage)) {
                this.currentLanguage = userLanguage;
                console.log(`Kullan�c� tercih etti�i dil: ${this.currentLanguage}`);
                
                // HTML dil etiketini g�ncelle
                document.documentElement.setAttribute('lang', this.currentLanguage);
                document.documentElement.setAttribute('data-language', this.currentLanguage);
            } else {
                // Kaydedilmi� dil ayar� varsa y�kle
                const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY);
                if (savedLanguage && ['tr', 'en', 'de'].includes(savedLanguage)) {
                    this.currentLanguage = savedLanguage;
                    console.log(`Kaydedilmi� dil ayar�: ${this.currentLanguage}`);
                } else {
                    // Taray�c� dilini kontrol et
                    const browserLang = navigator.language || navigator.userLanguage;
                    if (browserLang) {
                        const lang = browserLang.substring(0, 2).toLowerCase();
                        
                        // Desteklenen diller
                        if (['tr', 'en', 'de'].includes(lang)) {
                            this.currentLanguage = lang;
                        } else {
                            // Desteklenmeyen dil durumunda varsay�lan olarak �ngilizce
                            this.currentLanguage = 'en';
                        }
                        
                        console.log(`Taray�c� dili: ${browserLang}, Uygulama dili: ${this.currentLanguage}`);
                    }
                }
            }
            
            // Dil de�i�tirme elementini olu�tur
            this.createLanguageSelector();
        } catch (e) {
            console.error("Dil ayarlar� y�klenirken hata:", e);
            this.currentLanguage = 'tr'; // Hata durumunda varsay�lan dil
        }
    },
    
    // Dil se�ici olu�tur
    createLanguageSelector: function() {
        // Men�de zaten bir dil se�ici oldu�u i�in sayfa �zerinde ekstra bir dil se�ici olu�turmuyoruz
        console.log("Men�de zaten dil se�im alan� bulundu�u i�in ek bir dil se�ici olu�turulmad�");
        return;
    },
    
    // Dili de�i�tir
    switchLanguage: function(language) {
        if (this.currentLanguage === language) return;
        
        console.log(`Dil de�i�tiriliyor: ${this.currentLanguage} -> ${language}`);
        
        // Dili kaydet
        this.currentLanguage = language;
        localStorage.setItem(this.LANGUAGE_KEY, language);
        localStorage.setItem('quizLanguage', language); // Eski referans i�in uyumluluk
        
        // HTML etiketinin dil �zelliklerini g�ncelle
        const htmlRoot = document.getElementById('html-root') || document.documentElement;
        htmlRoot.setAttribute('lang', language);
        htmlRoot.setAttribute('data-language', language);
        
        // Soru verilerini yeniden y�kle
        this.loadQuestionsData()
            .then(() => {
                console.log("Dil de�i�ikli�i sonras� yeni soru verileri y�klendi");
                
                // UI metinlerini g�ncelle
                this.updateUITexts();
                
                // Dil de�i�ikli�i olay�n� tetikle - bu, di�er mod�llerin �evirilerini g�ncellemesini sa�lar
                document.dispatchEvent(new Event('languageChanged'));
                
                // E�er aktif bir kategori varsa ve sorular g�steriliyorsa, sorular� g�ncelle
                if (this.selectedCategory && this.quizElement && this.quizElement.style.display !== 'none') {
                    // Kategorileri yeniden g�ster (mevcut dildeki kategorileri g�stermek i�in)
                    this.displayCategories();
                    
                    // Se�ili kategori ad�n� kontrol et ve mevcut dildeki kar��l���n� bul
                    const translatedCategoryName = this.getCurrentCategoryName(this.selectedCategory);
                    
                    if (this.questionsData[translatedCategoryName]) {
                        // Kategori mevcut dildeki sorularla g�ncellenir
                        this.selectedCategory = translatedCategoryName;
                        
                        // Sorular� g�ncelle
                        this.questions = this.shuffleArray([...this.questionsData[this.selectedCategory]]);
                        this.arrangeBlankFillingFirst();
                        
                        // Mevcut soruyu s�f�rla ve ilk soruyu g�ster
                        this.currentQuestionIndex = 0;
                        this.displayQuestion(this.questions[0]);
                    }
                }
                
                // Mevcut g�sterilen i�eri�i g�ncelle
                this.updateCurrentContent();
                
                // Dil de�i�ikli�ini kullan�c�ya bildir
                this.showToast(this.getTranslation('languageChanged'), 'toast-success');
                this.updateResultAndWarningTexts();
            })
            .catch(error => {
                console.error("Dil de�i�ikli�i sonras� soru verileri y�klenirken hata:", error);
                this.showToast("Sorular y�klenirken bir hata olu�tu", "toast-error");
            });
    },
    
    // Sorular� �evir
    translateQuestions: function() {
        if (!this.questionsData || Object.keys(this.questionsData).length === 0) {
            console.warn('�evrilecek soru verisi bulunamad�.');
            return;
        }
        
        if (this.currentLanguage === 'tr') {
            // T�rk�e i�in �eviriye gerek yok, orijinal sorular� kullan
            this.translatedQuestions = this.cloneObject(this.questionsData);
            // Mevcut sorular� g�ncelle
            this.updateCurrentQuestionsWithTranslations();
            return;
        }
        
        // �evrilmi� sorular zaten varsa ve ge�erli dilde ise tekrar �evirme
        if (this.hasTranslatedQuestions(this.currentLanguage)) {
            console.log(`${this.currentLanguage} dilinde �evrilmi� sorular zaten mevcut, tekrar �evirme i�lemi yap�lmayacak.`);
            
            // Mevcut sorular� g�ncelle
            this.updateCurrentQuestionsWithTranslations();
            return;
        }
        
        console.log(`Sorular ${this.currentLanguage} diline �evriliyor...`);
        
        // Bo� �eviri nesnesini olu�tur
        this.translatedQuestions = {};
        
        // Her kategori i�in
        Object.keys(this.questionsData).forEach(categoryTR => {
            // Kategori ad�n� �evir
            const translatedCategoryName = this.getTranslatedCategoryName(categoryTR, this.currentLanguage);
            this.translatedQuestions[translatedCategoryName] = [];
            
            // Kategorideki her soru i�in
            this.questionsData[categoryTR].forEach(questionObj => {
                // Soru nesnesinin kopyas�n� olu�tur
                const translatedQuestion = this.cloneObject(questionObj);
                
                // Translations �zelli�i varsa ve istenen dilde �eviri varsa kullan
                if (questionObj.translations && questionObj.translations[this.currentLanguage]) {
                    const translation = questionObj.translations[this.currentLanguage];
                    if (translation.question) translatedQuestion.question = translation.question;
                    if (translation.options) translatedQuestion.options = translation.options;
                    if (translation.correctAnswer) translatedQuestion.correctAnswer = translation.correctAnswer;
                } else {
                    // Soru metnini ve ��klar� �evir (otomatik �eviri yerine �zelle�tirilmi� metin)
                    if (this.currentLanguage === 'en') {
                        translatedQuestion.question = this.translateToEnglish(questionObj.question);
                        
                        if (Array.isArray(translatedQuestion.options)) {
                            translatedQuestion.options = translatedQuestion.options.map(option => 
                                this.translateToEnglish(option)
                            );
                        }
                        
                        if (translatedQuestion.correctAnswer) {
                            translatedQuestion.correctAnswer = this.translateToEnglish(questionObj.correctAnswer);
                        }
                        
                        // Do�ru/Yanl�� sorular� i�in
                        if (translatedQuestion.type === "Do�ruYanl��" || translatedQuestion.type === "TrueFalse") {
                            translatedQuestion.type = "TrueFalse";
                            
                            if (translatedQuestion.correctAnswer === "DO�RU" || translatedQuestion.correctAnswer === "YANLI�") {
                                translatedQuestion.correctAnswer = trueFalseMapping[translatedQuestion.correctAnswer].en;
                            }
                        }
                    } else if (this.currentLanguage === 'de') {
                        translatedQuestion.question = this.translateToGerman(questionObj.question);
                        
                        if (Array.isArray(translatedQuestion.options)) {
                            translatedQuestion.options = translatedQuestion.options.map(option => 
                                this.translateToGerman(option)
                            );
                        }
                        
                        if (translatedQuestion.correctAnswer) {
                            translatedQuestion.correctAnswer = this.translateToGerman(questionObj.correctAnswer);
                        }
                        
                        // Do�ru/Yanl�� sorular� i�in
                        if (translatedQuestion.type === "Do�ruYanl��" || translatedQuestion.type === "TrueFalse") {
                            translatedQuestion.type = "TrueFalse";
                            
                            if (translatedQuestion.correctAnswer === "DO�RU" || translatedQuestion.correctAnswer === "YANLI�") {
                                translatedQuestion.correctAnswer = trueFalseMapping[translatedQuestion.correctAnswer].de;
                            }
                        }
                    }
                }
                
                // Kategori ad�n� g�ncelle
                translatedQuestion.category = translatedCategoryName;
                
                // Bo�luk doldurma sorular� i�in
                if (translatedQuestion.type === "BlankFilling" && translatedQuestion.choices) {
                    // Harfleri �evir (�rne�in Almanca'da �, � gibi harfler i�in)
                    translatedQuestion.choices = this.translateChoices(questionObj.choices, this.currentLanguage);
                }
                
                // �evrilmi� soruyu kategoriye ekle
                this.translatedQuestions[translatedCategoryName].push(translatedQuestion);
            });
        });
        
        console.log(`Soru �evirisi tamamland�. ${Object.keys(this.translatedQuestions).length} kategori �evrildi.`);
        
        // Mevcut sorular� g�ncelle
        this.updateCurrentQuestionsWithTranslations();
    },
    
    // �evrilmi� sorular var m� kontrol et
    hasTranslatedQuestions: function(language) {
        // �evrilmi� sorular bo�sa veya dil T�rk�e ise kontrol etmeye gerek yok
        if (language === 'tr' || !this.translatedQuestions) {
            return false;
        }
        
        // �evrilmi� sorular�n i�inde en az bir kategori var m�?
        const hasCategories = Object.keys(this.translatedQuestions).length > 0;
        
        if (hasCategories) {
            // Rastgele bir kategori se�
            const sampleCategory = Object.keys(this.translatedQuestions)[0];
            
            // Bu kategoride soru var m�?
            const hasQuestions = this.translatedQuestions[sampleCategory] && 
                                this.translatedQuestions[sampleCategory].length > 0;
            
            if (hasQuestions) {
                // Rastgele bir soru se�
                const sampleQuestion = this.translatedQuestions[sampleCategory][0];
                
                // Bu soru �evrilmi� mi? (Kategori ad�n� kontrol et)
                // T�rk�e kategorinin �evrilmi� ad�n� bul
                const originalCategoryName = Object.keys(this.questionsData)[0]; // �lk T�rk�e kategori
                const expectedTranslatedName = this.getTranslatedCategoryName(originalCategoryName, language);
                
                // �evirinin do�ru dilde olup olmad���n� kontrol et
                return sampleCategory === expectedTranslatedName;
            }
        }
        
        return false;
    },
    
    // Mevcut sorular� �evirilerle g�ncelle
    updateCurrentQuestionsWithTranslations: function() {
        // E�er bir kategori se�ilmi�se ve sorular y�klenmi�se, mevcut sorular� da g�ncelle
        if (this.selectedCategory && this.questions.length > 0) {
            console.log(`Se�ili kategori: ${this.selectedCategory}`);
            
            // Mevcut sorular dil de�i�iminden sonra g�ncellenecek
            const translatedCategoryName = this.getCurrentCategoryName(this.selectedCategory);
            
            console.log(`Se�ili kategori: ${this.selectedCategory}, �evrilmi� ad�: ${translatedCategoryName}`);
            
            // �evrilmi� kategorideki sorular� al
            const translatedCategoryQuestions = this.currentLanguage === 'tr' ? 
                this.questionsData[translatedCategoryName] : 
                this.translatedQuestions[translatedCategoryName];
            
            if (translatedCategoryQuestions) {
                console.log(`${translatedCategoryName} kategorisinde ${translatedCategoryQuestions.length} �evrilmi� soru bulundu.`);
                
                // Sorular� g�ncelle
                this.questions = this.shuffleArray([...translatedCategoryQuestions]);
                this.arrangeBlankFillingFirst();
                
                // Mevcut soruyu g�ncelle
                if (this.currentQuestionIndex < this.questions.length) {
                    this.displayQuestion(this.questions[this.currentQuestionIndex]);
                }
            } else {
                console.warn(`${translatedCategoryName} kategorisinde �evrilmi� soru bulunamad�!`);
            }
        }
    },
    
    // Nesne kopyalama (deep clone)
    cloneObject: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // Kategori ad�n� �evir
    getTranslatedCategoryName: function(categoryTR, targetLang) {
        if (categoryMappings[categoryTR] && categoryMappings[categoryTR][targetLang]) {
            return categoryMappings[categoryTR][targetLang];
        }
        
        // E�le�me yoksa orijinal kategori ad�n� d�nd�r
        return categoryTR;
    },
    
    // UI elemanlar�n� g�ncelle
    updateUITexts: function() {
        // Ba�l�k
        document.title = this.getTranslation('appName');
        
        // Navbar ba�l���
        const navbarTitle = document.querySelector('.navbar-title');
        if (navbarTitle) navbarTitle.textContent = this.getTranslation('appName');
        const appTitle = document.querySelector('.app-title');
        if (appTitle) appTitle.textContent = this.getTranslation('appName');
        const mainTitle = document.querySelector('.main-title');
        if (mainTitle) mainTitle.textContent = this.getTranslation('appName');
        
        // Yan men� (sidebar) metinleri
        const sidebarHome = document.querySelector('.sidebar-home');
        if (sidebarHome) sidebarHome.textContent = this.getTranslation('home');
        const sidebarFriends = document.querySelector('.sidebar-friends');
        if (sidebarFriends) sidebarFriends.textContent = this.getTranslation('friends');
        const sidebarLeaderboard = document.querySelector('.sidebar-leaderboard');
        if (sidebarLeaderboard) sidebarLeaderboard.textContent = this.getTranslation('leaderboardMenu');
        
        // Ana men� ba�l���
        const menuTitle = document.querySelector('.menu-title');
        if (menuTitle) {
            menuTitle.textContent = this.getTranslation('quiz');
        }
        
        // Quiz ba�l��� (soru ekran� �st�)
        const quizHeader = document.querySelector('#quiz h2');
        if (quizHeader) {
            quizHeader.textContent = this.getTranslation('quiz');
        }
        
        // ��k�� butonu kald�r�ld�
        
        // Ana men� butonlar�
        const singlePlayerBtn = document.getElementById('single-player-btn');
        if (singlePlayerBtn) {
            singlePlayerBtn.textContent = this.getTranslation('singlePlayer');
        }
        const multiPlayerBtn = document.getElementById('online-game-button');
        if (multiPlayerBtn) {
            multiPlayerBtn.textContent = this.getTranslation('multiPlayer');
        }
        const leaderboardBtn = document.getElementById('view-global-leaderboard');
        if (leaderboardBtn) {
            leaderboardBtn.textContent = this.getTranslation('leaderboard');
        }
        const statsBtn = document.getElementById('show-stats');
        if (statsBtn) {
            statsBtn.textContent = this.getTranslation('statistics');
        }
        const settingsBtn = document.getElementById('show-settings');
        if (settingsBtn) {
            settingsBtn.textContent = this.getTranslation('settings');
        }
        const addQuestionBtn = document.getElementById('add-question-button');
        if (addQuestionBtn) {
            addQuestionBtn.textContent = this.getTranslation('addQuestion');
        }
        // Logout butonu kald�r�ld�
        
        // Kategori ba�l���
        const categoryTitle = document.querySelector('#category-selection h2 span');
        if (categoryTitle) {
            categoryTitle.textContent = this.getTranslation('categories');
        }
        
        // Puan etiketi
        if (this.scoreElement) {
            const scoreLabel = this.scoreElement.querySelector('.score-label');
            if (scoreLabel) {
                scoreLabel.textContent = this.getTranslation('score');
            }
        }
        
        // Sonraki soru butonu
        if (this.nextButton) {
            const nextBtnText = this.nextButton.querySelector('span');
            if (nextBtnText) {
                nextBtnText.textContent = this.getTranslation('next');
            } else {
                this.nextButton.textContent = this.getTranslation('next');
            }
        }
        
        // Yeniden ba�lat butonu
        if (this.restartButton) {
            this.restartButton.textContent = this.getTranslation('restart');
        }
        
        // Joker butonlar�
        this.updateJokerButtonsText();
        
        // Dil etiketi
        const langLabel = document.getElementById('language-label');
        if (langLabel) {
            langLabel.textContent = this.getTranslation('language') + ':';
        }
        
        // Hamburger men� ��eleri - Yeni ID'ler ile g�ncelleme
        const appTitleElement = document.getElementById('menu-app-title');
        if (appTitleElement) {
            appTitleElement.textContent = this.getTranslation('app');
        }
        
        const settingsTitleElement = document.getElementById('menu-settings-title');
        if (settingsTitleElement) {
            settingsTitleElement.textContent = this.getTranslation('settings');
        }
        
        // Men� ��eleri metinleri
        const homeText = document.getElementById('menu-home-text');
        if (homeText) {
            homeText.textContent = this.getTranslation('home');
        }
        
        const profileText = document.getElementById('menu-profile-text');
        if (profileText) {
            profileText.textContent = this.getTranslation('profile');
        }
        
        const friendsText = document.getElementById('menu-friends-text');
        if (friendsText) {
            friendsText.textContent = this.getTranslation('friends');
        }
        
        const leaderboardText = document.getElementById('menu-leaderboard-text');
        if (leaderboardText) {
            leaderboardText.textContent = this.getTranslation('leaderboardMenu');
        }
        
        // Ayarlar metinleri
        const languageText = document.getElementById('menu-language-text');
        if (languageText) {
            languageText.textContent = this.getTranslation('language');
        }
        
        const difficultyText = document.getElementById('menu-difficulty-text');
        if (difficultyText) {
            difficultyText.textContent = this.getTranslation('difficulty');
        }
        
        const soundText = document.getElementById('menu-sound-text');
        if (soundText) {
            soundText.textContent = this.getTranslation('sound');
        }
        
        const themeText = document.getElementById('menu-theme-text');
        if (themeText) {
            themeText.textContent = this.getTranslation('darkTheme');
        }
        
        const logoutText = document.getElementById('menu-logout-text');
        if (logoutText) {
            logoutText.textContent = this.getTranslation('logout');
        }
        
        // Zorluk seviyeleri
        const difficultySelect = document.getElementById('difficulty-level');
        if (difficultySelect) {
            const options = difficultySelect.options;
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                if (option.value === 'easy') {
                    option.textContent = this.getTranslation('easy');
                } else if (option.value === 'medium') {
                    option.textContent = this.getTranslation('medium');
                } else if (option.value === 'hard') {
                    option.textContent = this.getTranslation('hard');
                }
            }
        }
        
        // data-i18n �zniteli�i olan t�m elemanlar� g�ncelle
        const i18nElements = document.querySelectorAll('[data-i18n]');
        i18nElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key && languages[this.currentLanguage] && languages[this.currentLanguage][key]) {
                element.textContent = languages[this.currentLanguage][key];
            }
        });
        

    },
    
    // Joker butonlar� metinlerini g�ncelle
    updateJokerButtonsText: function() {
        if (this.jokerFiftyBtn && !this.jokersUsed.fifty) {
            this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i>`;
        } else if (this.jokerFiftyBtn && this.jokersUsed.fifty) {
            this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i>`;
        }
        
        if (this.jokerHintBtn && !this.jokersUsed.hint) {
            this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i>`;
        } else if (this.jokerHintBtn && this.jokersUsed.hint) {
            this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i>`;
        }
        
        if (this.jokerTimeBtn && !this.jokersUsed.time) {
            this.jokerTimeBtn.innerHTML = `<i class="fas fa-clock"></i>`;
        } else if (this.jokerTimeBtn && this.jokersUsed.time) {
            this.jokerTimeBtn.innerHTML = `<i class="fas fa-clock"></i>`;
        }
        
        if (this.jokerSkipBtn && !this.jokersUsed.skip) {
            this.jokerSkipBtn.innerHTML = `<i class="fas fa-forward"></i>`;
        } else if (this.jokerSkipBtn && this.jokersUsed.skip) {
            this.jokerSkipBtn.innerHTML = `<i class="fas fa-forward"></i>`;
        }
        
        if (this.jokerStoreBtn) {
            this.jokerStoreBtn.innerHTML = `<i class="fas fa-store"></i>`;
        }
    },
    
    // Mevcut i�eri�i g�ncelle
    updateCurrentContent: function() {
        // Ana men� butonlar� ve di�er UI elemanlar�n� g�ncelle
        this.updateUITexts();
        
        // Hangi sayfa g�r�n�rse onu g�ncelle
        if (this.categorySelectionElement && this.categorySelectionElement.style.display !== 'none') {
            // Kategori se�im ekran� g�r�n�yorsa
            this.displayCategories();
        } else if (this.quizElement && this.quizElement.style.display !== 'none' && this.questions.length > 0) {
            // Quiz ekran� g�r�n�yorsa
            if (this.resultElement && this.resultElement.style.display !== 'none') {
                // Sonu� g�steriliyorsa sonu� metnini g�ncelle
                const correctAnswer = this.questions[this.currentQuestionIndex].correctAnswer;
                if (this.resultElement.classList.contains('correct')) {
                    this.resultElement.innerHTML = `
                        <div class="correct-answer-container">
                            <div class="correct-icon"><i class="fas fa-badge-check"></i></div>
                            <div class="correct-text">${this.getTranslation('correct')}</div>
                            <div class="correct-animation">
                                <span>+</span>
                                <span>${Math.max(1, Math.ceil(this.timeLeft / (this.questions[this.currentQuestionIndex].type === "BlankFilling" ? 5 : 3)))}</span>
                            </div>
                        </div>
                        <button id="next-question" class="next-button">${this.getTranslation('next')}</button>
                    `;
                } else if (this.resultElement.classList.contains('wrong')) {
                    this.resultElement.innerHTML = `${this.getTranslation('timeUp')} ${this.getTranslation('correctAnswer')}: <strong>${correctAnswer}</strong>
                        <button id="next-question" class="next-button">${this.getTranslation('next')}</button>`;
                }
            } else {
                // Aktif soru varsa yeniden y�kle
                this.displayQuestion(this.questions[this.currentQuestionIndex]);
            }
        }
        this.updateResultAndWarningTexts();
    },
    
    // Basit �eviri fonksiyonlar� (ger�ek bir projede daha profesyonel bir ��z�m kullan�lmal�d�r)
    translateToEnglish: function(text) {
        // Bo� metin kontrol�
        if (!text) return '';
        
        // Bu sadece basit bir �rnektir - ger�ek projede buraya �zelle�tirilmi� �eviri eklenebilir
        // Not: Ger�ek bir uygulamada burada �nceden haz�rlanm�� �eviriler veya API kullan�labilir
        return text; // �u an i�in orijinal metni koruyoruz
    },
    
    translateToGerman: function(text) {
        // Bo� metin kontrol�
        if (!text) return '';
        
        // Almanca �eviri - bu basit bir �rnek
        return text; // �u an i�in orijinal metni koruyoruz
    },
    
    // Bo�luk doldurma i�in harfleri �evir
    translateChoices: function(choices, targetLang) {
        if (!choices) return [];
        
        // Bu fonksiyon �zellikle Almanca gibi dillerde �, �, � gibi harfler i�in kullan�labilir
        // �u an i�in orijinal harfleri koruyoruz
        return choices;
    },
    
    // Mevcut dil i�in ge�erli kategori ad�n� al
    getCurrentCategoryName: function(originalCategory) {
        if (this.currentLanguage === 'tr') return originalCategory;
        
        // T�rk�e kategori ad� m� kontrol et
        if (categoryMappings[originalCategory] && categoryMappings[originalCategory][this.currentLanguage]) {
            return categoryMappings[originalCategory][this.currentLanguage];
        }
        
        // Bu kategori ad� zaten �evrilmi� bir isim mi kontrol et
        if (reverseCategoryMappings[originalCategory] && 
            reverseCategoryMappings[originalCategory]['tr']) {
            return originalCategory; // Zaten �evrilmi� durumda, aynen d�nd�r
        }
        
        // Burada e�er kategori �evrilmi� bir isimse, mevcut dilde do�ru versiyonunu bul
        for (const [sourceCat, translations] of Object.entries(reverseCategoryMappings)) {
            // E�er bu bir yabanc� kategori ad�ysa ve bizim istedi�imiz dilde bir kar��l��� varsa
            if (sourceCat === originalCategory && translations[this.currentLanguage]) {
                return translations[this.currentLanguage];
            }
        }
        
        // Hi�bir e�le�me bulunamazsa orijinal kategori ad�n� d�nd�r
        return originalCategory;
    },
    
    // Toast mesaj� g�ster
    showToast: function(message, type = 'toast-info') {
        // Toast container'� kontrol et veya olu�tur
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Yeni toast olu�tur
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // �kon ekle
        let icon = '<i class="fas fa-info-circle"></i>';
        if (type === 'toast-success') icon = '<i class="fas fa-check-circle"></i>';
        if (type === 'toast-warning') icon = '<i class="fas fa-exclamation-triangle"></i>';
        if (type === 'toast-error') icon = '<i class="fas fa-times-circle"></i>';
        
        // Toast i�eri�i
        toast.innerHTML = `
            <div class="toast-content">
                ${icon}
                <span>${message}</span>
            </div>
        `;
        
        // Toast'u ekle
        toastContainer.appendChild(toast);
        
        // �pucu jokeri ve s�re jokeri i�in farkl� konumland�rma
        // Toast'� joker butonlar�n�n hemen �zerinde g�ster
        if (message.includes("�pucu jokeri kullan�ld�") || message.includes("S�re jokeri kullan�ld�")) {
            toast.style.position = "fixed";
            toast.style.bottom = "180px"; // Joker butonlar�n�n �zerinde
            toast.style.left = "50%";
            toast.style.transform = "translateX(-50%)";
            toast.style.zIndex = "10002"; // Joker butonlar�ndan daha y�ksek
        }
        
        // Toast'u g�ster
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Toast'u belirli bir s�re sonra kald�r
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    },
    
    // Taray�c� deste�ini kontrol et
    checkBrowserSupport: function() {
        console.log("Taray�c� �zellikleri kontrol ediliyor...");
        
        // localStorage deste�i
        let hasLocalStorage = false;
        try {
            hasLocalStorage = 'localStorage' in window && window.localStorage !== null;
            if (hasLocalStorage) {
                // Test et
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                console.log("localStorage destekleniyor");
                    } else {
                console.warn("localStorage desteklenmiyor");
            }
        } catch (e) {
            console.error("localStorage eri�ilemez:", e);
            hasLocalStorage = false;
        }
        
        // Fetch API deste�i
        const hasFetch = 'fetch' in window;
        console.log("Fetch API deste�i:", hasFetch);
        
        // Firebase SDK varl���
        const hasFirebase = typeof firebase !== 'undefined' && firebase.app;
        console.log("Firebase SDK durumu:", hasFirebase ? "Y�kl�" : "Y�kl� de�il");
        
        // JSON i�leme deste�i
        const hasJSON = typeof JSON !== 'undefined' && typeof JSON.parse === 'function';
        console.log("JSON deste�i:", hasJSON);
        
        // Eksik �zellikler varsa kullan�c�y� bilgilendir
        if (!hasLocalStorage || !hasFetch || !hasJSON) {
            console.warn("Baz� taray�c� �zellikleri eksik, uygulama s�n�rl� �al��abilir");
            // Uyar� mesaj� g�ster
            const warningDiv = document.createElement('div');
            warningDiv.className = 'browser-warning';
            warningDiv.innerHTML = `
                <div class="warning-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${this.getTranslation('browserWarning')}</p>
                    <button class="close-warning">${this.getTranslation('understood')}</button>
                </div>
            `;
            document.body.appendChild(warningDiv);
            
            // Kapat butonuna t�klama olay�
            const closeBtn = warningDiv.querySelector('.close-warning');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    warningDiv.remove();
                });
            }
        }
        
        return {
            localStorage: hasLocalStorage,
            fetch: hasFetch,
            firebase: hasFirebase,
            json: hasJSON
        };
    },
    
    // Joker envanterini y�kle
    loadJokerInventory: function() {
        console.log('Joker envanteri y�kleniyor...');
        console.log('localStorage anahtar�:', this.JOKER_INVENTORY_KEY);
        
        var inventoryJSON = localStorage.getItem(this.JOKER_INVENTORY_KEY);
        console.log('localStorage\'dan al�nan veri:', inventoryJSON);
        
        if (inventoryJSON && inventoryJSON !== 'null' && inventoryJSON !== 'undefined') {
            try {
                const parsed = JSON.parse(inventoryJSON);
                
                // Ge�erli bir obje ve t�m joker t�rleri var m� kontrol et
                if (parsed && typeof parsed === 'object' && 
                    parsed.hasOwnProperty('fifty') && 
                    parsed.hasOwnProperty('hint') && 
                    parsed.hasOwnProperty('time') && 
                    parsed.hasOwnProperty('skip')) {
                    
                    this.jokerInventory = parsed;
                    console.log("Joker envanteri ba�ar�yla y�klendi:", this.jokerInventory);
                } else {
                    console.warn("Ge�ersiz joker envanteri format�, varsay�lan envanter atan�yor");
                    this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
                    this.saveJokerInventory();
                }
            } catch (e) {
                console.error("Joker envanteri y�klenirken hata olu�tu:", e);
                this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
                this.saveJokerInventory();
                console.log("Varsay�lan envanter atand�:", this.jokerInventory);
            }
        } else {
            // �lk kez �al��t�r�l�yorsa veya ge�ersiz veri varsa her joker t�r�nden birer tane ver
            console.log("�lk kez �al��t�r�l�yor veya ge�ersiz veri, varsay�lan envanter olu�turuluyor...");
            this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
            this.saveJokerInventory();
        }
        
        // Negatif de�erleri �nle
        Object.keys(this.jokerInventory).forEach(key => {
            if (this.jokerInventory[key] < 0) {
                this.jokerInventory[key] = 0;
            }
        });
        
        // Final kontrol
        console.log('loadJokerInventory tamamland�, final envanter:', this.jokerInventory);
    },
    
    // Joker envanterini kaydet
    saveJokerInventory: function() {
        try {
            localStorage.setItem(this.JOKER_INVENTORY_KEY, JSON.stringify(this.jokerInventory));
            console.log("Joker envanteri kaydedildi:", this.jokerInventory);
            
            // Kaydetmenin ba�ar�l� olup olmad���n� kontrol et
            var saved = localStorage.getItem(this.JOKER_INVENTORY_KEY);
            if (saved) {
                var parsedSaved = JSON.parse(saved);
                console.log("Kaydedilen veri do�ruland�:", parsedSaved);
            } else {
                console.error("Joker envanteri kaydedilemedi!");
            }
        } catch (e) {
            console.error("Joker envanteri kaydedilirken hata olu�tu:", e);
        }
    },
    
    // Joker butonlar�na olay dinleyicileri ekle
    addJokerEventListeners: function() {
        console.log('addJokerEventListeners �a�r�ld�...');
        
        // Elementleri dinamik olarak al
        this.jokerFiftyBtn = document.getElementById('joker-fifty');
        this.jokerHintBtn = document.getElementById('joker-hint');
        this.jokerTimeBtn = document.getElementById('joker-time');
        this.jokerSkipBtn = document.getElementById('joker-skip');
        this.jokerStoreBtn = document.getElementById('joker-store');
        
        console.log('jokerFiftyBtn:', this.jokerFiftyBtn);
        console.log('jokerHintBtn:', this.jokerHintBtn);
        console.log('jokerTimeBtn:', this.jokerTimeBtn);
        console.log('jokerSkipBtn:', this.jokerSkipBtn);
        console.log('jokerStoreBtn:', this.jokerStoreBtn);
        
        // Mobil debug i�in
        console.log('Mobile device check:', /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        console.log('Touch events supported:', 'ontouchstart' in window);
        
        // Joker store modal element kontrol�
        const jokerStoreModal = document.getElementById('joker-store-modal');
        console.log('Joker store modal element:', jokerStoreModal);
        
        // 50:50 jokeri
        if (this.jokerFiftyBtn) {
            this.jokerFiftyBtn.addEventListener('click', () => {
                if (this.jokerFiftyBtn.disabled) return;
                
                console.log('50:50 joker kullan�l�yor...');
                
                // Mevcut sorunun do�ru cevab�n� al
                const currentQuestion = this.questions[this.currentQuestionIndex];
                const correctAnswer = currentQuestion.correctAnswer;
                
                // BlankFilling sorular�nda 50:50 joker kullan�lamaz
                if (currentQuestion.type === "BlankFilling") {
                    console.warn('BlankFilling sorular�nda 50:50 joker kullan�lamaz');
                    this.showToast("Bo�luk doldurma sorular�nda 50:50 joker kullan�lamaz!", "toast-warning");
                    return;
                }
                
                // Do�ruYanl�� sorular�nda da 50:50 joker kullan�lamaz
                if (currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse") {
                    console.warn('Do�ru/Yanl�� sorular�nda 50:50 joker kullan�lamaz');
                    this.showToast("Do�ru/Yanl�� sorular�nda 50:50 joker kullan�lamaz!", "toast-warning");
                    return;
                }
                
                console.log('Do�ru cevap:', correctAnswer);
                
                // Sadece aktif quiz container'daki se�enekleri al
                const optionsContainer = document.getElementById('options');
                const options = optionsContainer ? optionsContainer.querySelectorAll('.option') : document.querySelectorAll('#options .option');
                console.log('Bulunan se�enekler:', options.length);
                console.log('Options container:', optionsContainer);
                
                if (options.length < 3) {
                    console.warn('Yeterli se�enek yok, 50:50 joker kullan�lamaz');
                    this.showToast("Bu soru tipinde 50:50 joker kullan�lamaz!", "toast-warning");
                    return;
                }
                
                // Yanl�� ��klar� bul - case insensitive kar��la�t�rma
                const wrongOptions = Array.from(options).filter((option, index) => {
                    const optionText = option.textContent.trim();
                    const isCorrect = optionText.toLowerCase() === correctAnswer.toLowerCase();
                    console.log(`Se�enek ${index + 1}: "${optionText}" | Do�ru cevap: "${correctAnswer}" | E�it mi: ${isCorrect}`);
                    return !isCorrect;
                });
                
                console.log('Toplam se�enek say�s�:', options.length);
                console.log('Yanl�� se�enek say�s�:', wrongOptions.length);
                console.log('Do�ru se�enek say�s�:', options.length - wrongOptions.length);
                
                if (wrongOptions.length < 2) {
                    console.warn('Yeterli yanl�� se�enek yok');
                    this.showToast("Bu soruda yeterli yanl�� se�enek yok!", "toast-warning");
                    return;
                }
                
                // �ki yanl�� ��kk� rastgele se�
                const shuffledWrong = this.shuffleArray([...wrongOptions]);
                const toHide = shuffledWrong.slice(0, 2);
                
                console.log('S�nd�r�lecek se�enekler:', toHide.length);
                
                // Se�ili ��klar� s�nd�r
                toHide.forEach(option => {
                    option.style.opacity = '0.3';
                    option.style.pointerEvents = 'none';
                    option.style.background = 'linear-gradient(135deg, #ddd, #ccc)';
                    option.style.color = '#666';
                    option.style.textDecoration = 'line-through';
                    option.style.filter = 'blur(1px)';
                    option.style.border = '2px solid #f0f0f0';
                    option.style.transform = 'scale(0.95)';
                    option.style.transition = 'all 0.3s ease';
                    option.classList.add('disabled-option');
                    
                    // X i�areti ekle
                    const xMark = document.createElement('div');
                    xMark.innerHTML = '?';
                    xMark.style.cssText = `
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        font-size: 20px;
                        z-index: 10;
                        animation: bounceIn 0.5s ease;
                    `;
                    option.style.position = 'relative';
                    option.appendChild(xMark);
                });
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('fifty');
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const fiftySound = document.getElementById('sound-correct');
                    if (fiftySound) fiftySound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Toast bildirimi g�ster
                this.showToast("50:50 jokeri kullan�ld�! �ki yanl�� ��k s�nd�r�ld�.", "toast-success");
            });
        }
        
        // �pucu jokeri
        if (this.jokerHintBtn) {
            this.jokerHintBtn.addEventListener('click', () => {
                if (this.jokerHintBtn.disabled) return;
                
                console.log('�pucu joker kullan�l�yor...');
                
                // Mevcut soru i�in bir ipucu g�ster
                const currentQuestion = this.questions[this.currentQuestionIndex];
                let hint = '';
                
                // �pucu olu�tur - farkl� soru tiplerine g�re
                if (currentQuestion.category === "Bo�luk Doldurma" || currentQuestion.type === "BlankFilling") {
                    hint = "�pucu: Cevab�n ilk harfi \"" + currentQuestion.correctAnswer.charAt(0) + "\" ";
                    if (currentQuestion.correctAnswer.length > 3) {
                        hint += "ve son harfi \"" + currentQuestion.correctAnswer.charAt(currentQuestion.correctAnswer.length - 1) + "\"";
                    }
                } else if (currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse") {
                    // Do�ru/Yanl�� sorular i�in �zel ipucu
                    const correctAnswer = currentQuestion.correctAnswer.toLowerCase();
                    if (correctAnswer === 'do�ru' || correctAnswer === 'true' || correctAnswer === 'evet') {
                        hint = "�pucu: Bu ifade do�ru bir bilgidir.";
                    } else {
                        hint = "�pucu: Bu ifadede bir yanl��l�k vard�r.";
                    }
                } else {
                    const correctAnswer = currentQuestion.correctAnswer;
                    // Cevab�n ilk ve varsa son harfini ipucu olarak ver
                    hint = "�pucu: Do�ru cevab�n ilk harfi \"" + correctAnswer.charAt(0) + "\" ";
                    if (correctAnswer.length > 3) {
                        hint += "ve son harfi \"" + correctAnswer.charAt(correctAnswer.length - 1) + "\"";
                    }
                }
                
                console.log('Olu�turulan ipucu:', hint);
                
                // �pucunu g�ster
                const hintElement = document.createElement('div');
                hintElement.className = 'hint-message';
                hintElement.innerHTML = '<i class="fas fa-lightbulb"></i> ' + hint;
                hintElement.style.cssText = `
                    background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
                    color: #2d3436;
                    padding: 15px 20px;
                    margin: 15px 0;
                    border-radius: 10px;
                    border-left: 4px solid #e17055;
                    box-shadow: 0 4px 15px rgba(253, 203, 110, 0.3);
                    animation: fadeInUp 0.5s ease;
                    font-weight: 600;
                    text-align: center;
                `;
                
                // �pucu mesaj�n� ekleme
                const questionElement = document.getElementById('question');
                if (questionElement && questionElement.parentNode) {
                    // Eski ipucu mesaj�n� kald�r
                    const oldHint = document.querySelector('.hint-message');
                    if (oldHint) oldHint.remove();
                    
                    // Yeni ipucunu ekle
                    questionElement.parentNode.insertBefore(hintElement, questionElement.nextSibling);
                    console.log('�pucu mesaj� DOM\'a eklendi');
                }
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('hint');
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const hintSound = document.getElementById('sound-correct');
                    if (hintSound) hintSound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Toast bildirimi g�ster
                this.showToast("�pucu jokeri kullan�ld�! " + hint, "toast-success");
            });
        }
        
        // +S�re jokeri
        if (this.jokerTimeBtn) {
            this.jokerTimeBtn.addEventListener('click', () => {
                if (this.jokerTimeBtn.disabled) return;
                
                console.log('S�re joker kullan�l�yor...');
                console.log('Kullan�m �ncesi s�re:', this.timeLeft);
                
                // Mevcut sorunun s�resini 15 saniye uzat
                this.timeLeft += 15;
                
                console.log('Kullan�m sonras� s�re:', this.timeLeft);
                
                // S�re g�stergesini g�ncelle
                this.updateTimeDisplay();
                
                // Zaman�n azald���n� belirten s�n�f� kald�r
                if (this.timeLeftElement && this.timeLeftElement.classList.contains('time-low')) {
                    this.timeLeftElement.classList.remove('time-low');
                }
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('time');
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const timeSound = document.getElementById('sound-correct');
                    if (timeSound) timeSound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Toast bildirimi g�ster
                this.showToast("S�re jokeri kullan�ld�! 15 saniye eklendi. Yeni s�re: " + this.timeLeft + " saniye", "toast-success");
            });
        }
        
        // Pas jokeri
        if (this.jokerSkipBtn) {
            this.jokerSkipBtn.addEventListener('click', () => {
                if (this.jokerSkipBtn.disabled) return;
                
                console.log('Pas joker kullan�l�yor...');
                console.log('Pas joker kullan�m �ncesi envanter:', JSON.stringify(this.jokerInventory));
                
                // Joker envanterini kontrol et
                if (this.jokerInventory.skip <= 0) {
                    console.warn('Pas joker envanteri bo�!');
                    this.showToast("Pas jokeriniz kalmad�!", "toast-warning");
                    return;
                }
                
                // S�reyi s�f�rlamak yerine do�rudan sonraki soruya ge�i� yapal�m
                clearInterval(this.timerInterval);
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const skipSound = document.getElementById('sound-correct');
                    if (skipSound) skipSound.play().catch(e => {
                        console.error("Ses �al�namad�:", e);
                    });
                }
                
                // Jokeri kullan (useJoker i�inde zaten envanter d���r�l�yor)
                this.useJoker('skip');
                
                // Toast bildirimi g�ster
                this.showToast("Pas jokeri kullan�ld�! Sonraki soruya ge�iliyor.", "toast-success");
                
                console.log('Pas joker kullan�m sonras� envanter:', JSON.stringify(this.jokerInventory));
                
                // Bir sonraki soruya ge�
                setTimeout(() => {
                    this.showNextQuestion();
                }, 800);
            });
        }
        
        // Joker ma�azas� butonu
        if (this.jokerStoreBtn) {
            // Click event (desktop)
            this.jokerStoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openJokerStore();
            });
            
            // Touch event (mobile)
            this.jokerStoreBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            
            this.jokerStoreBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openJokerStore();
            });
            
            // Mobil cihazlarda butonun t�klanabilir oldu�unu garanti et
            this.jokerStoreBtn.style.cursor = 'pointer';
            this.jokerStoreBtn.style.touchAction = 'manipulation';
        }
    },
    
    // Joker ma�azas�n� a�
    openJokerStore: function() {
        console.log('?? Joker ma�azas� a��l�yor...');
        console.log('?? User Agent:', navigator.userAgent);
        console.log('?? Mevcut joker envanteri:', JSON.stringify(this.jokerInventory));
        console.log('?? Mevcut puan:', this.score);
        
        var modal = document.getElementById('joker-store-modal');
        var closeBtn = modal.querySelector('.close-modal');
        var buyButtons = modal.querySelectorAll('.joker-buy-btn');
        var pointsDisplay = document.getElementById('joker-store-points-display');
        
        // Mevcut toplam puanlar� ve joker envanterini g�ster (misafir i�in sessionScore kullan)
        const currentPoints = this.isLoggedIn ? this.totalScore : this.sessionScore;
        pointsDisplay.textContent = currentPoints || 0;
        console.log('?? Joker ma�azas� - G�sterilen puan: ' + currentPoints + ' (Giri� durumu: ' + (this.isLoggedIn ? 'Kay�tl�' : 'Misafir') + ')');
        console.log('?? Detay - totalScore: ' + this.totalScore + ', sessionScore: ' + this.sessionScore);
        
        // Oyun ekran�ndaki joker butonlar�n� da g�ncelle
        this.updateJokerButtons();
        
        // Joker miktarlar�n� g�ncelle
        this.updateJokerStoreDisplay(modal);
        
        // Sat�n alma butonlar�n� etkinle�tir
        buyButtons.forEach(function(btn) {
            var item = btn.closest('.joker-store-item');
            var jokerType = item.dataset.joker;
            var price = parseInt(item.dataset.price);
            
            // Yeterli puan varsa butonu etkinle�tir (misafir i�in sessionScore kullan)
            const availablePoints = this.isLoggedIn ? this.totalScore : this.sessionScore;
            btn.disabled = availablePoints < price;
            
            // Sat�n alma olay�
            var self = this;
            btn.onclick = function() {
                const availablePoints = self.isLoggedIn ? self.totalScore : self.sessionScore;
                console.log('Joker sat�n alma denemesi: ' + jokerType + ', Fiyat: ' + price + ', Mevcut Puan: ' + availablePoints + ' (' + (self.isLoggedIn ? 'totalScore' : 'sessionScore') + ')');
                console.log('Sat�n alma �ncesi envanter:', JSON.stringify(self.jokerInventory));
                
                if (availablePoints >= price) {
                    // Puan� azalt (misafir i�in sessionScore, kay�tl� i�in totalScore)
                    if (self.isLoggedIn) {
                    self.totalScore -= price;
                    } else {
                        self.sessionScore -= price;
                    }
                    
                    // PUANI FIREBASE'E KAYDET
                    if (self.isLoggedIn) {
                        self.delayedSaveUserData(); // Firebase'e geciktirilmi� kaydet
                        console.log(`Joker sat�n alma: ${price} puan harcand�. Yeni toplam: ${self.totalScore}`);
                    }
                    
                    // Jokeri envantere ekle
                    var previousCount = self.jokerInventory[jokerType] || 0;
                    self.jokerInventory[jokerType]++;
                    
                    console.log(`${jokerType} joker say�s�: ${previousCount} -> ${self.jokerInventory[jokerType]}`);
                    
                    // Joker envanterini kaydet
                    self.saveJokerInventory();
                    
                    // G�stergeleri g�ncelle (misafir i�in sessionScore kullan)
                    const updatedPoints = self.isLoggedIn ? self.totalScore : self.sessionScore;
                    pointsDisplay.textContent = updatedPoints;
                    
                    // Joker ma�azas�ndaki say�mlar� ve buton durumlar�n� g�ncelle
                    self.updateJokerStoreDisplay(modal);
                    
                    // OYUN EKRANINDAK� JOKER BUTONLARINI DA G�NCELLE
                    self.updateJokerButtons();
                    
                    // Skor g�sterimini g�ncelle
                    self.updateScoreDisplay();
                    
                    // Toast bildirimi g�ster
                    var jokerName = jokerType === 'fifty' ? '50:50' : 
                        jokerType === 'hint' ? '�pucu' : 
                        jokerType === 'time' ? 'S�re' : 'Pas';
                    self.showToast(jokerName + ' jokeri sat�n al�nd�!', "toast-success");
                    
                    // Joker butonlar�n� g�ncelle
                    self.updateJokerButtons();
                    
                    console.log('Sat�n alma sonras� envanter:', JSON.stringify(self.jokerInventory));
                } else {
                    console.warn('Yeterli puan yok!');
                    self.showToast("Yeterli puan�n�z yok!", "toast-error");
                }
            };
        }.bind(this));
        
        // Modal� g�ster
        modal.style.display = 'block';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        
        // Mobil cihazlarda modal�n �stte g�r�nmesini garanti et
        modal.style.zIndex = '9999';
        modal.classList.add('show');
        
        // Body scroll'unu engelle (mobil cihazlarda �nemli)
        document.body.style.overflow = 'hidden';
        
        console.log('? Joker ma�azas� modal a��ld�');
        console.log('Modal visibility:', modal.style.visibility);
        console.log('Modal display:', modal.style.display);
        console.log('Modal z-index:', modal.style.zIndex);
        console.log('Modal classList:', modal.classList.toString());
        
        // Kapat butonuna t�klama olay�
        var self = this;
        const closeModal = function() {
            modal.style.display = 'none';
            modal.style.visibility = 'hidden';
            modal.style.opacity = '0';
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Body scroll'unu restore et
            // Ma�aza kapand���nda joker butonlar�n� g�ncelle
            self.updateJokerButtons();
        };
        
        // Close button events (both click and touch)
        closeBtn.onclick = closeModal;
        closeBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            closeModal();
        });
        
        // Modal d���na t�klama olay�
        window.onclick = function(event) {
            if (event.target === modal) {
                closeModal();
            }
        };
        
        // Modal d���na dokunma olay� (mobil)
        modal.addEventListener('touchend', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // Sat�n alma butonlar�na da touch event ekle (mobil)
        buyButtons.forEach(function(btn) {
            btn.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // onclick event'i zaten �al��acak, sadece touch'u handle ediyoruz
            });
        });
    },
    
    // Joker butonlar�n� g�ncelle
    updateJokerButtons: function() {
        // Elementleri dinamik olarak al (e�er hen�z null ise)
        if (!this.jokerFiftyBtn) this.jokerFiftyBtn = document.getElementById('joker-fifty');
        if (!this.jokerHintBtn) this.jokerHintBtn = document.getElementById('joker-hint');
        if (!this.jokerTimeBtn) this.jokerTimeBtn = document.getElementById('joker-time');
        if (!this.jokerSkipBtn) this.jokerSkipBtn = document.getElementById('joker-skip');
        if (!this.jokerStoreBtn) this.jokerStoreBtn = document.getElementById('joker-store');
        
        const currentQuestion = this.questions[this.currentQuestionIndex] || {};
        const isTrueFalse = currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse";
        const isBlankFilling = currentQuestion.type === "BlankFilling";
        
        console.log('updateJokerButtons �a�r�ld�');
        console.log('Mevcut joker envanteri:', JSON.stringify(this.jokerInventory));
        console.log('Joker kullan�m durumlar�:', JSON.stringify(this.jokersUsed));
        console.log('updateJokerButtons - elementler:', {
            fifty: !!this.jokerFiftyBtn,
            hint: !!this.jokerHintBtn,
            time: !!this.jokerTimeBtn,
            skip: !!this.jokerSkipBtn,
            store: !!this.jokerStoreBtn
        });
        
        // 50:50 jokeri
        if (this.jokerFiftyBtn) {
            const fiftyCount = this.jokerInventory.fifty || 0;
            const used = this.jokersUsed.fifty;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${fiftyCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerFiftyBtn.disabled = (fiftyCount <= 0) || used || isTrueFalse || isBlankFilling;
            this.jokerFiftyBtn.style.opacity = (fiftyCount <= 0 || used || isTrueFalse || isBlankFilling) ? '0.3' : '1';
            this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i>${badgeHtml}`;
        }
        // �pucu jokeri
        if (this.jokerHintBtn) {
            const hintCount = this.jokerInventory.hint || 0;
            const used = this.jokersUsed.hint;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${hintCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerHintBtn.disabled = (hintCount <= 0) || used;
            this.jokerHintBtn.style.opacity = (hintCount <= 0 || used) ? '0.3' : '1';
            this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i>${badgeHtml}`;
        }
        // S�re jokeri
        if (this.jokerTimeBtn) {
            const timeCount = this.jokerInventory.time || 0;
            const used = this.jokersUsed.time;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${timeCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerTimeBtn.disabled = (timeCount <= 0) || used;
            this.jokerTimeBtn.style.opacity = (timeCount <= 0 || used) ? '0.3' : '1';
            this.jokerTimeBtn.innerHTML = `<i class="fas fa-clock"></i>${badgeHtml}`;
        }
        // Pas jokeri
        if (this.jokerSkipBtn) {
            const skipCount = this.jokerInventory.skip || 0;
            const used = this.jokersUsed.skip;
            let badgeHtml = `<span class="joker-count-badge${used ? ' used' : ''}">${skipCount}${used ? '<span class=\'joker-used-text\'>?</span>' : ''}</span>`;
            this.jokerSkipBtn.disabled = (skipCount <= 0) || used;
            this.jokerSkipBtn.style.opacity = (skipCount <= 0 || used) ? '0.3' : '1';
            this.jokerSkipBtn.innerHTML = `<i class="fas fa-forward"></i>${badgeHtml}`;
        }
        // Joker ma�azas�
        if (this.jokerStoreBtn) {
            this.jokerStoreBtn.innerHTML = '<i class="fas fa-store"></i>';
        }
    },
    
    // Joker kullanma fonksiyonu
    useJoker: function(jokerType) {
        // Envanter kontrol� - eksiye d��mesin
        if (this.jokerInventory[jokerType] > 0) {
            this.jokersUsed[jokerType] = true;
            this.jokerInventory[jokerType]--;
            this.saveJokerInventory();
            console.log(`${jokerType} joker kullan�ld�. Kalan: ${this.jokerInventory[jokerType]}`);
            
            // Joker butonlar�n� g�ncelle
            this.updateJokerButtons();
        } else {
            console.warn(`${jokerType} joker envanterinde yok!`);
        }
    },
    
    // Joker ma�azas� say�m g�sterimini g�ncelle
    updateJokerStoreDisplay: function(modal) {
        console.log('Joker ma�azas� say�mlar� g�ncelleniyor...');
        console.log('Mevcut joker envanteri:', JSON.stringify(this.jokerInventory));
        console.log('Mevcut toplam puan:', this.totalScore);
        
        const ownedCountElements = modal.querySelectorAll('.joker-owned-count');
        ownedCountElements.forEach((el) => {
            const jokerType = el.closest('.joker-store-item').dataset.joker;
            const count = this.jokerInventory[jokerType] || 0;
            el.textContent = count;
            console.log(`${jokerType} joker say�s� ma�azada g�ncellendi: ${count}`);
        });
        
        // Sat�n alma butonlar�n�n durumunu da g�ncelle
        const buyButtons = modal.querySelectorAll('.joker-buy-btn');
        buyButtons.forEach((btn) => {
            const item = btn.closest('.joker-store-item');
            const price = parseInt(item.dataset.price);
            btn.disabled = this.totalScore < price;
            console.log(`Buton durumu g�ncellendi: Fiyat ${price}, Toplam puan ${this.totalScore}, Aktif: ${this.totalScore >= price}`);
        });
    },

    // Joker kullan�m durumlar�n� s�f�rla (envanter korunur)
    resetJokerUsage: function() {
        console.log('Joker kullan�m durumlar� s�f�rlan�yor...');
        
        // Kullan�lm�� jokerleri s�f�rla
        this.jokersUsed = {fifty: false, hint: false, time: false, skip: false};
        this.skipJokerActive = false;
        
        // 50:50 joker ile devre d��� b�rak�lan se�enekleri tekrar aktif et
        this.resetDisabledOptions();
        
        // Joker butonlar�n� g�ncelle
        setTimeout(() => {
            this.updateJokerButtons();
        }, 100);
    },

    // Reset jokers for new game (sadece oyun ba�lang�c�nda �a�r�lmal�)
    resetJokers: function() {
        console.log('resetJokers �a�r�ld�, mevcut envanter:', JSON.stringify(this.jokerInventory));
        
        // �nce joker kullan�m durumlar�n� s�f�rla
        this.resetJokerUsage();
        
        // Envanter kontrol� - sadece tan�ms�z veya bo� ise ba�lang�� jokerleri ver
        if (!this.jokerInventory || Object.keys(this.jokerInventory).length === 0) {
            console.log('�lk oyun veya envanter tan�ms�z, ba�lang�� jokerleri veriliyor...');
            this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
            this.saveJokerInventory();
        }
        
        // Mevcut envanterde eksik joker t�rleri varsa tamamla
        if (this.jokerInventory.fifty === undefined) this.jokerInventory.fifty = 0;
        if (this.jokerInventory.hint === undefined) this.jokerInventory.hint = 0;
        if (this.jokerInventory.time === undefined) this.jokerInventory.time = 0;
        if (this.jokerInventory.skip === undefined) this.jokerInventory.skip = 0;
        
        console.log('resetJokers tamamland�, final envanter:', JSON.stringify(this.jokerInventory));
    },
    
    // Yeni oyun i�in joker envanterini yenile
    refreshJokersForNewGame: function() {
        console.log('refreshJokersForNewGame �a�r�ld�, jokerler yenileniyor...');
        
        // �nce joker kullan�m durumlar�n� s�f�rla
        this.resetJokerUsage();
        
        // Her yeni oyunda fresh jokerler ver
        this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
        this.saveJokerInventory();
        
        console.log('Jokerler yenilendi, yeni envanter:', JSON.stringify(this.jokerInventory));
    },
    
    // 50:50 joker ile devre d��� b�rak�lan se�enekleri s�f�rla
    resetDisabledOptions: function() {
        const disabledOptions = document.querySelectorAll('.option.disabled-option');
        disabledOptions.forEach(option => {
            option.style.opacity = '';
            option.style.pointerEvents = '';
            option.style.background = '';
            option.style.color = '';
            option.classList.remove('disabled-option');
        });
        
        // �pucu mesajlar�n� da temizle
        const hintMessages = document.querySelectorAll('.hint-message');
        hintMessages.forEach(hint => {
            hint.remove();
        });
    },
    
    // Kullan�c� ayarlar�n� y�kle
    loadUserSettings: function() {
        try {
            // Kaydedilmi� ayarlar� kontrol et
            const settings = localStorage.getItem(this.USER_SETTINGS_KEY);
            
            // Hamburger men�s�ndeki zorluk ayar�n� �ncelikle kontrol et
            const hamburg�rDifficulty = localStorage.getItem('difficulty');
            
            // Tercihler ekran�ndan zorluk seviyesi ayar�n� kontrol et
            const difficultyPreference = localStorage.getItem('difficulty_preference');
            let calculatedDifficulty = null;
            
            // �ncelik s�ras�: hamburger men�s� > tercihler > hesaplanm�� zorluk
            if (hamburg�rDifficulty && ['easy', 'medium', 'hard'].includes(hamburg�rDifficulty)) {
                calculatedDifficulty = hamburg�rDifficulty;
                console.log(`Zorluk seviyesi hamburger men�s�nden al�nd�: ${calculatedDifficulty}`);
            } else if (difficultyPreference) {
                // Otomatik zorluk ayar� ise, hesaplanm�� zorlu�u kontrol et
                if (difficultyPreference === 'auto') {
                    calculatedDifficulty = localStorage.getItem('calculated_difficulty');
                } else {
                    // Do�rudan se�ilen zorlu�u kullan
                    calculatedDifficulty = difficultyPreference;
                }
                
                if (calculatedDifficulty) {
                    console.log(`Zorluk seviyesi tercihlere g�re ayarland�: ${calculatedDifficulty}`);
                }
            }
            
            if (settings) {
                this.userSettings = JSON.parse(settings);
                
                // Tercihlerden zorluk seviyesi ayarlanmad�ysa kaydedilmi� ayarlar� kullan
                if (!calculatedDifficulty && this.userSettings.difficulty) {
                    calculatedDifficulty = this.userSettings.difficulty;
                }
                
                this.soundEnabled = this.userSettings.soundEnabled !== undefined ? this.userSettings.soundEnabled : true;
                this.animationsEnabled = this.userSettings.animationsEnabled !== undefined ? this.userSettings.animationsEnabled : true;
                this.notificationsEnabled = this.userSettings.notificationsEnabled !== undefined ? this.userSettings.notificationsEnabled : true;
                this.theme = this.userSettings.theme || 'light';
                
                console.log("Kullan�c� ayarlar� y�klendi:", this.userSettings);
            } else {
                // Varsay�lan ayarlar
                this.userSettings = {};
                this.soundEnabled = true;
                this.animationsEnabled = true;
                this.notificationsEnabled = true;
                this.theme = 'light';
                
                console.log("Varsay�lan ayarlar kullan�l�yor");
            }
            
            // Zorluk seviyesini ayarla
            this.currentDifficulty = calculatedDifficulty || 'medium';
            this.userSettings.difficulty = this.currentDifficulty;
            
            console.log(`Final zorluk seviyesi: ${this.currentDifficulty}`);
            
            // Tema ayar�n� uygula
            this.applyTheme();
            
            // Joker envanterini y�kle
            this.loadJokerInventory();
        } catch (e) {
            console.error("Ayarlar y�klenirken hata:", e);
        }
    },
    
    // Kullan�c� ayarlar�n� kaydet
    saveUserSettings: function() {
        try {
            // userSettings objesini g�ncelle
            if (!this.userSettings) {
                this.userSettings = {};
            }
            
            this.userSettings.difficulty = this.currentDifficulty;
            this.userSettings.soundEnabled = this.soundEnabled;
            this.userSettings.animationsEnabled = this.animationsEnabled;
            this.userSettings.notificationsEnabled = this.notificationsEnabled;
            this.userSettings.theme = this.theme;
            
            localStorage.setItem(this.USER_SETTINGS_KEY, JSON.stringify(this.userSettings));
            console.log("Kullan�c� ayarlar� kaydedildi:", this.userSettings);
        } catch (e) {
            console.error("Kullan�c� ayarlar� kaydedilirken hata olu�tu:", e);
        }
    },
    
    // Tema uygula
    applyTheme: function() {
        document.body.className = this.theme === 'dark' ? 'dark-theme' : '';
    },
    
    // �statistikleri getir
    getStats: function() {
        const statsJSON = localStorage.getItem(this.STATS_KEY);
        let stats = {
            totalQuestions: 0,
            correctAnswers: 0,
            totalGames: 0,
            categoryStats: {},
            recentGames: []
        };
        
        if (statsJSON) {
            try {
                stats = JSON.parse(statsJSON);
            } catch (e) {
                console.error("�statistikler y�klenirken hata olu�tu:", e);
            }
        }
        
        return stats;
    },
    
    // Seviye tamamland�, sonraki seviyeyi g�ster
    showLevelCompletionScreen: function(completedLevel) {
        clearInterval(this.timerInterval);
        
        // Seviye tamamlama ses efekti
        if (this.soundEnabled) {
            const completionSound = document.getElementById('sound-level-completion');
            if (completionSound) completionSound.play().catch(e => console.error("Ses �al�namad�:", e));
        }
        
        // Oyuncuyu tebrik et
        const levelCompletionElement = document.createElement('div');
        levelCompletionElement.className = 'level-completion-screen';
        levelCompletionElement.innerHTML = `
            <div class="level-completion-content">
                <h2>${completedLevel}. Seviye Tamamland�!</h2>
                <div class="level-completion-stats">
                    <p><i class="fas fa-star"></i> Skor: ${this.score}</p>
                    <p><i class="fas fa-check-circle"></i> Do�ru: ${this.score}/${this.answeredQuestions}</p>
                    <p><i class="fas fa-clock"></i> Ortalama S�re: ${Math.round(this.answerTimes.reduce((a, b) => a + b, 0) / this.answerTimes.length)} saniye</p>
                </div>
                <div class="confetti-animation">
                    <i class="fas fa-trophy"></i>
                </div>
                <button id="next-level-btn" class="shiny-btn">Sonraki Seviyeye Ge�</button>
            </div>
        `;
        
        document.body.appendChild(levelCompletionElement);
        
        // Sonraki seviyeye ge�me butonu
        const nextLevelBtn = document.getElementById('next-level-btn');
        nextLevelBtn.addEventListener('click', () => {
            // Sonu� ekran�n� kald�r
            document.body.removeChild(levelCompletionElement);
            
            // Sonraki seviyeye devam et
            this.currentQuestionIndex = 0;
            this.resetJokers();
            // Canlar� koruyoruz, s�f�rlam�yoruz ki �nceki seviyeden kalan canlarla devam edilsin
            this.score = 0;
            this.answerTimes = [];
            this.answeredQuestions = 0;
            
            // Sonraki seviye i�in sorular� y�kle
            this.loadQuestionsForCurrentLevel();
        });
    },
    
    // Olay dinleyicilerini ekle
    addEventListeners: function() {
        try {
            console.log("Event listener'lar ekleniyor...");
            
        // Tema de�i�tirme butonu i�in olay dinleyicisi
        if (this.themeToggle) {
            this.themeToggle.addEventListener('change', () => {
                const theme = this.themeToggle.checked ? 'dark' : 'light';
                this.userSettings.theme = theme;
                this.applyTheme(theme);
                this.saveUserSettings();
            });
        }
        
        // Yeniden ba�latma butonu i�in olay dinleyicisi
        if (this.restartButton) {
            this.restartButton.addEventListener('click', () => {
                this.restartGame();
            });
        }
        
        // Sonraki soru butonu i�in olay dinleyicisi
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.showNextQuestion();
            });
        }
        
            // Joker butonlar� i�in olay dinleyicileri
            console.log('DOM haz�r, joker event listener\'lar� ekleniyor...');
            this.addJokerEventListeners();
            
            // Tekli oyun butonu
            if (this.singlePlayerBtn) {
                console.log("Tekli oyun butonu bulundu, dinleyici ekleniyor");
                this.singlePlayerBtn.addEventListener('click', () => {
                    console.log("Tekli oyun butonuna t�kland�");
                    if (this.mainMenu) this.mainMenu.style.display = 'none';
                    
                    // Tekli oyun modunda chat ekran�n� gizle
                    const gameChatContainer = document.getElementById('game-chat-container');
                    if (gameChatContainer) {
                        gameChatContainer.style.display = 'none';
                    }
                    
                    if (this.categorySelectionElement) {
                        this.categorySelectionElement.style.display = 'block';
                        // Kategorileri g�ster
                        this.displayCategories();
                    } else {
                        console.error("Kategori se�im elementi bulunamad�!");
                    }
                });
            } else {
                console.error("Tekli oyun butonu bulunamad�! ID: single-player-btn");
            }
            
            console.log("Event listener'lar ba�ar�yla eklendi");
        } catch (error) {
            console.error("addEventListeners fonksiyonunda hata:", error);
        }
    },
    
    // Joker butonlar�n� ayarla (setupJokerButtons'un yerine kullan�yoruz)
    setupJokerButtons: function() {
        // Bu fonksiyon gerekti�inde joker butonlar�n� ayarlar
        console.log("Joker butonlar� ayarlan�yor");
        this.updateJokerButtons();
    },
    
    // Soru verilerini y�kle
    loadQuestionsData: function() {
            console.log("Soru verileri y�kleniyor...");
            
        return new Promise((resolve, reject) => {
            // Se�ilen dile g�re dosya belirle
            let questionsFile = 'languages/tr/questions.json'; // T�rk�e i�in varsay�lan
            
            if (this.currentLanguage === 'en') {
                questionsFile = 'languages/en/questions.json';
            } else if (this.currentLanguage === 'de') {
                questionsFile = 'languages/de/questions.json';
            }
            
            console.log(`Dil: ${this.currentLanguage}, Y�klenen dosya: ${questionsFile}`);
            
            // Sorular� belirlenen JSON dosyas�ndan y�kle
            fetch(questionsFile)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Sorular y�klenemedi: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data) {
                    this.questionsData = data;
                        // allQuestionsData'y� questionsData ile ayn� verilere i�aret edecek �ekilde atayal�m
                        this.allQuestionsData = data; 
                        console.log("Soru verileri ba�ar�yla y�klendi:", Object.keys(data).length, "kategori");
                        console.log("Kategoriler:", Object.keys(data));
                        resolve(data);
                    } else {
                        console.log("Sorular y�klenemedi, varsay�lan veriler kullan�lacak.");
                        this.loadDefaultQuestions();
                        resolve(this.questionsData);
                    }
                })
                .catch(error => {
                    console.error("Sorular y�klenirken hata:", error);
                    console.log("Varsay�lan sorular kullan�lacak");
                    this.loadDefaultQuestions();
                    resolve(this.questionsData);
                });
        });
    },
    
    // Varsay�lan sorular� y�kle (offline durumlar i�in)
    loadDefaultQuestions: function() {
        // Varsay�lan baz� sorular
        this.questionsData = {
            "Genel K�lt�r": [
                {
                    question: "T�rkiye'nin ba�kenti hangi �ehirdir?",
                                options: ["�stanbul", "Ankara", "�zmir", "Bursa"],
                                correctAnswer: "Ankara",
                    difficulty: "easy"
                },
                {
                    question: "Hangi gezegen G�ne� Sistemi'nde en b�y�k olan�d�r?",
                    options: ["Mars", "Ven�s", "J�piter", "Sat�rn"],
                    correctAnswer: "J�piter",
                    difficulty: "easy"
                            },
                            {
                                question: "D�nyan�n en b�y�k okyanusu hangisidir?",
                    options: ["Atlas Okyanusu", "Hint Okyanusu", "Pasifik Okyanusu", "Arktik Okyanusu"],
                    correctAnswer: "Pasifik Okyanusu",
                    difficulty: "medium"
                }
            ],
            "Teknoloji": [
                {
                    question: "HTML'in a��l�m� nedir?",
                    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Mode Language", "Home Tool Markup Language"],
                    correctAnswer: "Hyper Text Markup Language",
                    difficulty: "easy"
                },
                {
                    question: "Hangi �irket Windows i�letim sistemini geli�tirmi�tir?",
                    options: ["Apple", "Google", "Microsoft", "IBM"],
                    correctAnswer: "Microsoft",
                    difficulty: "easy"
                }
            ],
            "Bilim": [
                {
                    question: "Periyodik tabloda 'Fe' hangi elementi simgeler?",
                    options: ["Flor", "Demir", "Fosfor", "Fermiyum"],
                    correctAnswer: "Demir",
                    difficulty: "medium"
                },
                {
                    question: "I��k h�z� yakla��k ka� km/s'dir?",
                    options: ["100.000 km/s", "200.000 km/s", "300.000 km/s", "400.000 km/s"],
                    correctAnswer: "300.000 km/s",
                    difficulty: "medium"
                }
            ]
        };
        // allQuestionsData'y� da g�ncelle
        this.allQuestionsData = this.questionsData;
        console.log("Varsay�lan sorular y�klendi:", Object.keys(this.questionsData).length, "kategori");
    },
    
    // Restartlama i�levi
    restartGame: function() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0; // <-- EKLEND�: Do�ru cevap say�s�n� s�f�rla
        this.sessionScore = 0; // Oturum puan�n� s�f�rla
        this.lives = 5;
        this.answeredQuestions = 0;
        this.answerTimes = [];
        this.currentSection = 1; // B�l�m say�s�n� da s�f�rla
        this.resetJokers();
        
        // Body'den quiz ve kategori class'lar�n� kald�r - logo tekrar g�r�ns�n
        document.body.classList.remove('quiz-active', 'category-selection');
        
        // Tekli oyun modunda chat ekran�n� gizle
        const gameChatContainer = document.getElementById('game-chat-container');
        if (gameChatContainer) {
            gameChatContainer.style.display = 'none';
        }
        
        // Kategorileri yeniden g�ster
        this.displayCategories();
        
        // �statistikleri s�f�rla
        this.updateScoreDisplay();
    },
    
    // Sonraki soruyu g�ster
    showNextQuestion: function() {
        // Yeni soruya ge�erken joker kullan�mlar�n� s�f�rla
        this.resetJokerUsage();
        // �nceki sonu� ve se�ili ��klar� temizle
        if (this.resultElement) {
            this.resultElement.style.display = 'none';
            this.resultElement.innerHTML = '';
        }
        
        // T�m se�ilmi� ��klar�n se�imini kald�r
        const selectedOptions = document.querySelectorAll('.option.selected, .true-false-option.selected, .option.answered, .true-false-option.answered');
        selectedOptions.forEach(option => {
            option.classList.remove('selected', 'answered', 'correct', 'wrong');
            option.disabled = false;
        });
        
        // 50:50 joker ile devre d��� b�rak�lan se�enekleri s�f�rla
        this.resetDisabledOptions();
        
        // Bo�luk doldurma ekran�ndaki cevap g�stergesini temizle
        const answerDisplay = document.getElementById('blank-filling-answer');
        if (answerDisplay) {
            answerDisplay.textContent = '';
            answerDisplay.classList.remove('correct', 'wrong');
        }
        
        // Se�ilmi� harfleri s�f�rla
        this.selectedLetters = [];
        
        // Soru sayac�n� art�r
        this.currentQuestionIndex++;
        
        // �nceki ipucu mesajlar�n� temizle
        const existingHintMessages = document.querySelectorAll('.hint-message');
        existingHintMessages.forEach(element => {
            element.remove();
        });
        
        // Her 5 soruda bir b�l�m ge�i�i g�ster
        if (this.currentQuestionIndex > 0 && this.currentQuestionIndex % 5 === 0 && this.currentQuestionIndex < this.questions.length) {
            this.currentSection++; // B�l�m say�s�n� art�r
            
                    // Progressive difficulty sistemi ile dinamik b�l�m say�s�
            const maxSections = this.getMaxSectionsForCategory();
            if (this.currentSection > maxSections) {
                this.showCategoryCompletion();
                return;
            }
            
            // Eski 50 b�l�m kontrol� kald�r�ld� - art�k dinamik sistem kullan�l�yor
            
            this.showSectionTransition();
        } else if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion(this.questions[this.currentQuestionIndex]);
        } else {
            // T�m sorular cevapland� - kategori tamamlama ekran�n� g�ster
            console.log("T�m sorular cevapland�, kategori tamamlama ekran� g�steriliyor...");
            this.showCategoryCompletion();
        }
    },
    
    // Kategoriye g�re maksimum b�l�m say�s�n� belirle
    getMaxSectionsForCategory: function() {
        // Kategoriye �zel zorluk seviyesi belirle
        const categoryDifficultyMap = {
            // Kolay kategoriler (12-15 b�l�m)
            'Hayvanlar': 12,
            'Renkler': 12, 
            'Basit Kelimeler': 13,
            'Say�lar': 13,
            'V�cut': 14,
            'Aile': 14,
            'Yemek': 15,
            'Ev': 15,
            
            // Orta kategoriler (15-18 b�l�m)
            'Spor': 15,
            'M�zik': 16,
            'Meslek': 16,
            'Ula��m': 17,
            'Do�a': 17,
            'Teknoloji': 18,
            'Sa�l�k': 18,
            
            // Zor kategoriler (18-25 b�l�m)
            'Bilim': 20,
            'Tarih': 20,
            'Edebiyat': 22,
            'Co�rafya': 22,
            'Felsefe': 24,
            'Matematik': 24,
            'Fizik': 25,
            'Kimya': 25
        };
        
        // Se�ilen kategoriye g�re b�l�m say�s� d�nd�r
        const maxSections = categoryDifficultyMap[this.selectedCategory] || 15; // Varsay�lan 15 b�l�m
        console.log(`Kategori: ${this.selectedCategory}, Maksimum B�l�m: ${maxSections}`);
        return maxSections;
    },
    
    // Kategori zorluk seviyesi metni
    getCategoryDifficultyText: function() {
        const maxSections = this.getMaxSectionsForCategory();
        
        if (maxSections <= 15) {
            return "?? Kolay Kategori";
        } else if (maxSections <= 18) {
            return "?? Orta Kategori";
        } else {
            return "?? Zor Kategori";
        }
    },
    
    // Progressive difficulty: Mevcut b�l�me g�re zorluk seviyesi belirle
    getProgressiveDifficulty: function() {
        const maxSections = this.getMaxSectionsForCategory();
        const currentProgress = this.currentSection / maxSections;
        
        // �lk %40'� kolay, sonraki %40'� orta, son %20'si zor
        if (currentProgress <= 0.4) {
            return 1; // Kolay
        } else if (currentProgress <= 0.8) {
            return 2; // Orta  
        } else {
            return 3; // Zor
        }
    },
    
    // Kategori Tamamlama Ekran�n� G�ster (dinamik b�l�m say�s�na g�re)
    showCategoryCompletion: function() {
        // Zamanlay�c�y� durdur
        clearInterval(this.timerInterval);
        
        // Kategori tamamlama modal�n� olu�tur
        const categoryCompletionModal = document.createElement('div');
        categoryCompletionModal.className = 'category-completion-modal';
        categoryCompletionModal.innerHTML = `
            <div class="category-completion-content">
                <div class="completion-header">
                    <div class="completion-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <h2>Kategori Tamamland�!</h2>
                    <p class="completion-message">"${this.selectedCategory}" kategorisinin ${this.getMaxSectionsForCategory()} b�l�m�n� ba�ar�yla tamamlad�n�z!</p>
                    <p class="completion-difficulty" style="font-size: 14px; color: #64748b; margin-top: 10px;">
                        ${this.getCategoryDifficultyText()} � Progressive Zorluk Sistemi
                    </p>
                </div>
                
                <div class="completion-stats">
                                         <div class="stat-item">
                         <div class="stat-icon">
                             <i class="fas fa-layer-group"></i>
                         </div>
                         <div class="stat-content">
                             <div class="stat-value">${this.getMaxSectionsForCategory()}</div>
                             <div class="stat-label">B�l�m Tamamland�</div>
                         </div>
                     </div>
                    
                    <div class="stat-item">
                        <div class="stat-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${this.score}</div>
                            <div class="stat-label">Toplam Puan</div>
                        </div>
                    </div>
                    
                    <div class="stat-item">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${this.correctAnswers}</div>
                            <div class="stat-label">Do�ru Cevap</div>
                        </div>
                    </div>
                    
                    <div class="stat-item">
                        <div class="stat-icon">
                            <i class="fas fa-heart"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${this.lives}</div>
                            <div class="stat-label">Kalan Can</div>
                        </div>
                    </div>
                    
                    <div class="stat-item" style="grid-column: 1 / -1;">
                        <div class="stat-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value" style="font-size: 14px;">Kolay � Orta � Zor</div>
                            <div class="stat-label">Zorluk Progresyonu</div>
                        </div>
                    </div>
                </div>
                
                <div class="completion-actions">
                    <button id="show-final-results" class="completion-btn primary">
                        <i class="fas fa-chart-line"></i>
                        Detayl� Sonu�lar� G�r
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(categoryCompletionModal);
        
        // Detayl� sonu�lar� g�ster butonu
        const showResultsBtn = document.getElementById('show-final-results');
        if (showResultsBtn) {
            showResultsBtn.addEventListener('click', () => {
                // Modal� kald�r
                categoryCompletionModal.remove();
                
                // Normal oyun biti� ekran�n� g�ster
                setTimeout(() => {
            this.showResult();
                }, 500);
            });
        }
        
        // Modal d���na t�klan�rsa da sonu� ekran�n� g�ster
        categoryCompletionModal.addEventListener('click', (e) => {
            if (e.target === categoryCompletionModal) {
                categoryCompletionModal.remove();
                setTimeout(() => {
                    this.showResult();
                }, 500);
            }
        });
        
        // Ba�ar� ses efekti �al
        if (this.soundEnabled) {
            const victorySound = document.getElementById('sound-level-completion');
            if (victorySound) victorySound.play().catch(e => console.error("Ses �al�namad�:", e));
        }
        
        // 10 saniye sonra otomatik olarak sonu� ekran�n� g�ster
        setTimeout(() => {
            if (document.body.contains(categoryCompletionModal)) {
                categoryCompletionModal.remove();
                this.showResult();
            }
        }, 10000);
        
        // Konfeti efekti eklenebilir
        console.log(`${this.selectedCategory} kategorisi ${this.getMaxSectionsForCategory()} b�l�m ile tamamland�!`);
    },

    // DEBUG: Kategori tamamlama modal�n� test et
    testCategoryCompletion: function() {
        console.log("Test: Kategori tamamlama modal� manuel olarak g�steriliyor...");
        this.showCategoryCompletion();
    },
    
    // Oyun Tamamlama Ekran�n� G�ster (50 b�l�m tamamland���nda)
    showGameCompletion: function() {
        // Sayac� durdur
        clearInterval(this.timerInterval);
        
        // Oyun tamamlama ekran�n� olu�tur
        const completionElement = document.createElement('div');
        completionElement.className = 'game-completion-screen';
        completionElement.innerHTML = `
            <div class="game-completion-content">
                <div class="trophy-container">
                    <i class="fas fa-trophy trophy-icon"></i>
                </div>
                <h2>Tebrikler! Oyunu Tamamlad�n�z!</h2>
                <div class="completion-info">
                    <p class="completion-congrats">50 b�l�m� ba�ar�yla tamamlad�n�z!</p>
                    <p>Toplam Puan: <strong>${this.score}</strong></p>
                    <p class="completion-message">Bu muhte�em ba�ar�n�z i�in kutlar�z!</p>
                </div>
                <div class="completion-buttons">
                    <button id="restart-game-btn" class="completion-btn"><i class="fas fa-redo"></i> Yeniden Oyna</button>
                    <button id="share-result-btn" class="completion-btn"><i class="fas fa-share-alt"></i> Sonucu Payla�</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(completionElement);
        
        // Yeniden ba�latma butonu
        const restartGameBtn = document.getElementById('restart-game-btn');
        if (restartGameBtn) {
            restartGameBtn.addEventListener('click', () => {
                document.body.removeChild(completionElement);
                this.restartGame();
            });
        }
        
        // Payla��m butonu
        const shareResultBtn = document.getElementById('share-result-btn');
        if (shareResultBtn) {
            shareResultBtn.addEventListener('click', () => {
                // Payla��m �zelli�i eklenebilir
                const shareText = `Bilgoo'yu ${this.score} puanla tamamlad�m! Sende oynamak ister misin?`;
                
                if (navigator.share) {
                    navigator.share({
                        title: 'Bilgoo',
                        text: shareText,
                        url: window.location.href
                    }).catch(err => {
                        console.error('Payla��m hatas�:', err);
                        this.showToast('Sonu� payla��lamad�', 'toast-error');
                    });
                } else {
                    // Taray�c� payla��m� desteklemiyorsa panoya kopyala
                    navigator.clipboard.writeText(shareText)
                        .then(() => {
                            this.showToast('Sonu� panoya kopyaland�!', 'toast-success');
                        })
                        .catch(err => {
                            console.error('Panoya kopyalama hatas�:', err);
                            this.showToast('Sonu� kopyalanamad�', 'toast-error');
                        });
                }
            });
        }
        
        // Konfeti efekti veya ses efekti eklenebilir
        if (this.soundEnabled) {
            const victorySound = document.getElementById('sound-level-completion');
            if (victorySound) victorySound.play().catch(e => console.error("Ses �al�namad�:", e));
        }
        
        // �statistikleri kaydet
        this.saveStats(this.selectedCategory, this.score, this.answeredQuestions, 
            this.answerTimes.length > 0 ? Math.round(this.answerTimes.reduce((a, b) => a + b, 0) / this.answerTimes.length) : 0);
    },
    
    // B�l�m ge�i� ekran�n� g�ster
    showSectionTransition: function() {
        // Sayac� durdur
        clearInterval(this.timerInterval);
        
        // Tamamlanan b�l�m numaras� (0-tabanl�) - currentSection 1'den ba�lad��� i�in -1
        const sectionIndex = this.currentSection - 2; // Bir �nceki tamamlanan b�l�m
        
        // B�l�m istatistiklerini al
        const stats = this.sectionStats[sectionIndex] || { correct: 0, total: 0 };
        
        console.log(`B�l�m ge�i�i g�steriliyor. B�l�m: ${sectionIndex+1}, �statistikler:`, stats);
        
        // Do�ru cevap y�zdesini hesapla
        const correctPercentage = stats.total > 0 
            ? Math.round((stats.correct / stats.total) * 100) 
            : 0;
        
        console.log(`B�l�m istatistikleri hesapland�: Do�ru: ${stats.correct}, Toplam: ${stats.total}, Y�zde: ${correctPercentage}%`);
        
        // Y�ld�z tipini belirle (alt�n, g�m�� veya bronz)
        let starType, starColor, starText;
        if (correctPercentage >= 80) {
            starType = 'gold';
            starColor = '#ffd700';
            starText = 'Alt�n Y�ld�z';
        } else if (correctPercentage >= 50) {
            starType = 'silver';
            starColor = '#c0c0c0';
            starText = 'G�m�� Y�ld�z';
        } else {
            starType = 'bronze';
            starColor = '#cd7f32';
            starText = 'Bronz Y�ld�z';
        }
        
        // Performansa g�re ka� y�ld�z verilecek
        let starCount;
        if (correctPercentage >= 80) {
            starCount = 3; // �ok iyi performans: 3 y�ld�z
        } else if (correctPercentage >= 50) {
            starCount = 2; // Orta performans: 2 y�ld�z
        } else {
            starCount = 1; // D���k performans: 1 y�ld�z
        }
        
        // Y�ld�z HTML'ini olu�tur
        let starsHTML = '';
        for (let i = 0; i < 3; i++) {
            if (i < starCount) {
                // Aktif y�ld�z (kazan�lan)
                starsHTML += `<i class="fas fa-star" style="color: ${starColor};"></i>`;
            } else {
                // Gri y�ld�z (kazan�lmayan)
                starsHTML += `<i class="fas fa-star" style="color: #888; opacity: 0.5;"></i>`;
            }
        }
        
        // B�l�m ge�i� ekran�n� olu�tur - �nceki tasar�ma benzer bir stil kullan�l�yor
        const sectionElement = document.createElement('div');
        sectionElement.className = 'section-transition';
        sectionElement.innerHTML = `
            <div class="section-transition-content">
                <h2>${this.currentSection-1}. ${this.getTranslation('sectionCompleted')}</h2>
                
                <div class="stars-container">
                    ${starsHTML}
                </div>
                
                <div class="level-info">
                    <p class="level-congrats">${starCount} ${this.getTranslation('earnedStars')}</p>
                </div>
                
                <div class="section-stats">
                    <p><i class="fas fa-star"></i> ${this.getTranslation('currentScore')}: ${this.score}</p>
                    <p><i class="fas fa-heart"></i> ${this.getTranslation('remainingLives')}: ${this.lives}</p>
                    <p><i class="fas fa-check-circle"></i> ${this.getTranslation('correctAnswers')}: ${stats.correct}/${stats.total} (${correctPercentage}%)</p>
                    <p><i class="fas fa-chart-line"></i> Sonraki B�l�m: ${['', 'Kolay', 'Orta', 'Zor'][this.getProgressiveDifficulty()]} Seviye</p>
                </div>
                <button id="next-section-btn" class="level-btn"><i class="fas fa-forward"></i> ${this.getTranslation('nextSection')}</button>
            </div>
        `;
        
        // Mevcut ekran� gizle ve ge�i� ekran�n� g�ster
        if (this.quizElement) this.quizElement.style.display = 'none';
        document.body.appendChild(sectionElement);
        
        // Sonraki b�l�me ge�i� butonu
        const nextSectionBtn = document.getElementById('next-section-btn');
        nextSectionBtn.addEventListener('click', () => {
            // Ge�i� ekran�n� kald�r
            document.body.removeChild(sectionElement);
            
            // Quiz ekran�n� g�ster
            if (this.quizElement) this.quizElement.style.display = 'block';
            
            // Sonraki soruyu g�ster
            this.displayQuestion(this.questions[this.currentQuestionIndex]);
        });
        
        // Ses efekti �al
        if (this.soundEnabled) {
            const sectionSound = document.getElementById('sound-correct');
            if (sectionSound) sectionSound.play().catch(e => console.error("Ses �al�namad�:", e));
        }
        
        // Tebrik toast mesaj� g�ster
        this.showToast(`${this.currentSection-1}. ${this.getTranslation('sectionCompleted')}`, "toast-success");
    },
    
    // Kategorileri g�ster
    displayCategories: function() {
        const categoriesContainer = document.getElementById('categories');
        if (!categoriesContainer) {
            console.error("Kategoriler i�in DOM elementi bulunamad�! (ID: categories)");
            return;
        }
        // Kategorileri temizle
        categoriesContainer.innerHTML = '';
        
        // Body'ye kategori se�imi class'�n� ekle - logo gizlemek i�in
        document.body.classList.add('category-selection');
        document.body.classList.remove('quiz-active');
        
        // Tekli oyun modunda chat ekran�n� gizle
        const gameChatContainer = document.getElementById('game-chat-container');
        if (gameChatContainer) {
            gameChatContainer.style.display = 'none';
        }
        
        // Aktif kategori verilerini al
        const activeQuestionData = this.currentLanguage === 'tr' ? this.questionsData : this.translatedQuestions;
        
        console.log("displayCategories �a�r�ld�! Mevcut kategoriler:", activeQuestionData ? Object.keys(activeQuestionData) : "Veri yok");
        if (!activeQuestionData || Object.keys(activeQuestionData).length === 0) {
            // Y�kleniyor mesaj� g�ster
            categoriesContainer.innerHTML = `<div class="loading">${this.getTranslation('loading')}</div>`;
            return;
        }
        
        // T�m kategorileri g�ster
        Object.keys(activeQuestionData).forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category category-btn';
            categoryElement.innerHTML = `
                <div class="category-icon">
                    <i class="${this.getCategoryIcon(category)}"></i>
                </div>
                <div class="category-name">${category}</div>
            `;
            // Kategori elementine t�klama olay� ekle
            categoryElement.addEventListener('click', () => {
                this.selectCategory(category);
            });
            categoriesContainer.appendChild(categoryElement);
        });
        console.log("Toplam", Object.keys(activeQuestionData).length, "kategori g�r�nt�lendi");
    },
    
    // Kategori simgesini belirle
    getCategoryIcon: function(category) {
        // Kategori ad�na g�re uygun simge d�nd�r
        const categoryIcons = {
            // T�rk�e kategoriler
            'Genel K�lt�r': 'fas fa-globe',
            'Bilim': 'fas fa-flask',
            'Teknoloji': 'fas fa-microchip',
            'Spor': 'fas fa-futbol',
            'M�zik': 'fas fa-music',
            'Tarih': 'fas fa-landmark',
            'Co�rafya': 'fas fa-mountain',
            'Sanat': 'fas fa-palette',
            'Edebiyat': 'fas fa-book',
            'Sinema': 'fas fa-film',
            'Yemek': 'fas fa-utensils',
            'Bilgisayar': 'fas fa-laptop-code',
            'Matematik': 'fas fa-calculator',
            'Bo�luk Doldurma': 'fas fa-keyboard',
            'Di�er': 'fas fa-question-circle',
            
            // �ngilizce kategoriler
            'General Knowledge': 'fas fa-globe',
            'Science': 'fas fa-flask',
            'Technology': 'fas fa-microchip',
            'Sports': 'fas fa-futbol',
            'Music': 'fas fa-music',
            'History': 'fas fa-landmark',
            'Geography': 'fas fa-mountain',
            'Art': 'fas fa-palette',
            'Literature': 'fas fa-book',
            'Movies': 'fas fa-film',
            'Food': 'fas fa-utensils',
            'Computer': 'fas fa-laptop-code',
            'Mathematics': 'fas fa-calculator',
            'Fill in the Blank': 'fas fa-keyboard',
            'Other': 'fas fa-question-circle',
            
            // Almanca kategoriler
            'Allgemeinwissen': 'fas fa-globe',
            'Wissenschaft': 'fas fa-flask',
            'Technologie': 'fas fa-microchip',
            'Sport': 'fas fa-futbol',
            'Musik': 'fas fa-music',
            'Geschichte': 'fas fa-landmark',
            'Geographie': 'fas fa-mountain',
            'Kunst': 'fas fa-palette',
            'Literatur': 'fas fa-book',
            'Filme': 'fas fa-film',
            'Essen': 'fas fa-utensils',
            'Computer': 'fas fa-laptop-code',
            'Mathematik': 'fas fa-calculator',
            'L�ckentext': 'fas fa-keyboard',
            'Sonstiges': 'fas fa-question-circle'
        };
        
        return categoryIcons[category] || 'fas fa-question-circle';
    },
    
    // Kategori se�
    selectCategory: function(category) {
        try {
            console.log("Se�ilen kategori:", category);
            this.selectedCategory = category;
            
            // Yeni oyun ba�lad���nda de�i�kenleri s�f�rla
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.correctAnswers = 0; // <-- EKLEND�: Do�ru cevap say�s�n� s�f�rla
            this.sessionScore = 0;
            this.answeredQuestions = 0;
            this.answerTimes = [];
            this.lives = 5;
            
            // Her yeni oyunda jokerlar� yenile
            this.refreshJokersForNewGame();
            
            // Kategori se�im ekran�n� gizle
            if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'none';
            
            // Aktif soru verilerini al (�evrilmi� veya orijinal)
            const activeQuestionData = this.currentLanguage === 'tr' ? this.questionsData : this.translatedQuestions;
            
            // Se�ilen kategorideki sorular� kar��t�r
            if (activeQuestionData && activeQuestionData[category]) {
                this.questions = this.shuffleArray([...activeQuestionData[category]]);
                this.arrangeBlankFillingFirst();
                console.log("Soru say�s�:", this.questions.length);
                console.log("Aktif dil:", this.currentLanguage);
                
                // Maksimum soru say�s�n� dinamik olarak hesapla
                const maxSections = this.getMaxSectionsForCategory();
                const maxQuestions = maxSections * 5; // Her b�l�mde 5 soru
                
                console.log(`Kategori: ${this.selectedCategory}`);
                console.log(`Maksimum b�l�m: ${maxSections}`);
                console.log(`Maksimum soru: ${maxQuestions}`);
                
                if (this.questions.length > maxQuestions) {
                    this.questions = this.questions.slice(0, maxQuestions);
                    console.log("Sorular", maxQuestions, "ile s�n�rland�r�ld� (dinamik sistem)");
                } else if (this.questions.length < maxQuestions) {
                    // E�er yeterli soru yoksa mevcut sorular� tekrarla
                    const originalQuestions = [...this.questions];
                    while (this.questions.length < maxQuestions) {
                        this.questions = this.questions.concat(this.shuffleArray([...originalQuestions]));
                    }
                    this.questions = this.questions.slice(0, maxQuestions);
                    console.log("Yetersiz soru! Sorular tekrarlanarak", maxQuestions, "soraya ��kar�ld�");
                }
                
                // Toplam puan g�stergesini ba�lat
                this.updateTotalScoreDisplay();
                
                // Oyunu ba�lat
                this.startQuiz();
            } else {
                console.error("Kategori verileri bulunamad�:", category);
                this.showToast(this.getTranslation('categoryLoadError') || "Se�ilen kategoride soru bulunamad�. L�tfen ba�ka bir kategori se�in.", "toast-error");
                
                // Kategori se�im ekran�n� tekrar g�ster
                if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'block';
            }
        } catch (error) {
            console.error("selectCategory fonksiyonunda hata:", error);
            this.showToast(this.getTranslation('categorySelectionError') || "Kategori se�ilirken bir hata olu�tu. L�tfen tekrar deneyin.", "toast-error");
            
            // Kategori se�im ekran�n� tekrar g�ster
            if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'block';
        }
    },
    
    // Se�ilen kategori i�in sorular� y�kle
    loadQuestionsForCategory: function(category) {
        if (!this.questionsData[category]) {
            console.error(`${category} kategorisi i�in soru bulunamad�!`);
            return;
        }
        
        // Kategorinin sorular�n� al ve kar��t�r
        this.questions = this.shuffleArray([...this.questionsData[category]]);
        
        // Zorluk seviyesine g�re s�rala (iste�e ba�l�)
        // this.questions.sort((a, b) => (a.difficulty || 1) - (b.difficulty || 1));
        
        // �lk soruyu g�ster
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0; // <-- EKLEND�
        // this.lives = 5; // BUNU S�L�YORUM
        this.answeredQuestions = 0;
        this.answerTimes = [];
        this.sectionStats = []; // B�l�m istatistiklerini s�f�rla
        this.currentSection = 1; // B�l�m numaras�n� s�f�rla
        this.resetJokerUsage(); // Sadece kullan�m durumlar�n� s�f�rla, envanter korunsun
        
        // Quiz ekran�n� g�ster ve ilk soruyu y�kle
        this.startQuiz();
    },
    
    // Diziyi kar��t�r (Fisher-Yates algoritmas�)
    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },
    
    // Quiz'i ba�lat
    startQuiz: function() {
        // Body'ye quiz aktif class'�n� ekle - logo gizlemek i�in
        document.body.classList.add('quiz-active');
        document.body.classList.remove('category-selection');
        
        // �nce t�m ana b�l�mleri gizle, sadece quiz ekran�n� g�ster
        if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'none';
        if (this.quizElement) this.quizElement.style.display = 'block';
        if (this.resultElement) this.resultElement.style.display = 'none';
        
        // Oyun aray�z�ne kalan di�er elemanlar� da gizle
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.style.display = 'none';
        
        const onlineGameOptions = document.getElementById('online-game-options');
        if (onlineGameOptions) onlineGameOptions.style.display = 'none';
        
        const globalLeaderboard = document.getElementById('global-leaderboard'); 
        if (globalLeaderboard) globalLeaderboard.style.display = 'none';
        
        const winnerScreen = document.getElementById('winner-screen');
        if (winnerScreen) winnerScreen.style.display = 'none';
        
        // Tekli oyun modunda chat ekran�n� gizle
        const gameChatContainer = document.getElementById('game-chat-container');
        if (gameChatContainer) {
            gameChatContainer.style.display = 'none';
        }
        
        // "Bilgisel Bilgi Yar��mas�" ba�l���n� ve ikonunu gizle
        const quizTitle = document.querySelector('h1');
        if (quizTitle && quizTitle.innerText.includes('Bilgisel Bilgi Yar��mas�')) {
            quizTitle.style.display = 'none';
        }
        
        // Footer i�erisindeki t�m i�eri�i (TEKNOVA B�L���M yaz�s�, logo, ikon vb.) gizle
        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.display = 'none';
        }
        
        // Logo veya di�er ikonlar� da gizle
        const logoIcons = document.querySelectorAll('.logo, .logo-icon, .company-info, .company-logo');
        logoIcons.forEach(icon => {
            icon.style.display = 'none';
        });
        
        // Skorlar� g�ncelle
        this.updateScoreDisplay();
        
        // Joker butonlar�n� ba�lang�� durumuna getir
        this.updateJokerButtons();
        
        // �lk soruyu g�ster
        this.displayQuestion(this.questions[0]);
    },
    
    // Skoru g�ncelle
    updateScoreDisplay: function() {
        if (this.scoreElement) {
            this.scoreElement.innerHTML = `
                <div class="score-container">
                    <span class="score-value">${this.score}</span>
                    <span class="score-label">${this.getTranslation('score')}</span>
                </div>
            `;
        }
        
        // Oyun s�ras�ndaki puan g�stergesini g�ncelle
        const currentScoreElement = document.getElementById('current-score');
        if (currentScoreElement) {
            currentScoreElement.textContent = this.score;
        }
        
        // Toplam puan g�stergesini g�ncelle
        this.updateTotalScoreDisplay();
        
        // Canlar� g�ncelle
        this.updateLives();
    },
    
    // Soruyu g�ster
    displayQuestion: function(questionData) {
        if (!questionData) {
            console.error("Soru verisi bulunamad�!");
            return;
        }
        
        // �nceki ipucu mesajlar�n� temizle
        const existingHintMessages = document.querySelectorAll('.hint-message');
        existingHintMessages.forEach(element => {
            element.remove();
        });
        
        // E�er soru bo�luk doldurma ise farkl� g�ster
        if (questionData.type === "BlankFilling") {
            this.loadBlankFillingQuestion(questionData);
            return;
        }
        
        // E�er soru do�ru/yanl�� tipindeyse farkl� g�ster
        if (questionData.type === "Do�ruYanl��" || questionData.type === "TrueFalse") {
            this.loadTrueFalseQuestion(questionData);
            return;
        }
        
        // Sonu� alan�n� temizle
        if (this.resultElement) {
            this.resultElement.innerHTML = '';
            this.resultElement.className = 'result';
            this.resultElement.style.display = 'none';
        }
        
        // Sonraki soru butununu gizle
        if (this.nextButton) {
            this.nextButton.style.display = 'none';
        }
        
        // Soru metnini g�ster
        if (this.questionElement) {
            // �evrilmi� soru kullan (e�er varsa)
            if (questionData.translations && questionData.translations[this.currentLanguage] && questionData.translations[this.currentLanguage].question) {
                this.questionElement.textContent = questionData.translations[this.currentLanguage].question;
            } else {
                this.questionElement.textContent = questionData.question;
            }
            
            // E�er soruda g�rsel varsa g�ster
            if (questionData.imageUrl) {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'question-image';
                const img = document.createElement('img');
                img.src = questionData.imageUrl;
                img.alt = this.getTranslation('questionImage');
                img.style.maxWidth = '100%';
                img.style.maxHeight = '300px';
                img.style.margin = '10px auto';
                img.style.display = 'block';
                img.onerror = () => {
                    console.warn(`${this.getTranslation('imageLoadError')}: ${questionData.imageUrl}`);
                    this.showToast(this.getTranslation('imageLoadError'), "toast-warning");
                    if (this.questions.length > this.currentQuestionIndex + 1) {
                        clearInterval(this.timerInterval);
                        setTimeout(() => {
                            this.currentQuestionIndex++;
                            this.displayQuestion(this.questions[this.currentQuestionIndex]);
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            this.showResult();
                        }, 1000);
                    }
                    return;
                };
                const oldImages = this.questionElement.querySelectorAll('.question-image');
                oldImages.forEach(img => img.remove());
                imageContainer.appendChild(img);
                this.questionElement.appendChild(imageContainer);
            }
        }
        
        // ��klar� g�ster
        if (this.optionsElement) {
            this.optionsElement.innerHTML = '';
            this.optionsElement.style.display = '';
            this.optionsElement.style.justifyContent = '';
            this.optionsElement.style.width = '';
            
            // �evrilmi� ��klar� kullan (e�er varsa)
            let displayOptions = [];
            if (questionData.translations && questionData.translations[this.currentLanguage] && questionData.translations[this.currentLanguage].options) {
                displayOptions = questionData.translations[this.currentLanguage].options;
            } else {
                displayOptions = questionData.options || [];
            }
            
            if (!Array.isArray(displayOptions) && questionData.correctAnswer) {
                const wrongOptions = this.generateWrongOptions(questionData.correctAnswer);
                const allOptions = [questionData.correctAnswer, ...wrongOptions];
                this.displayOptions(this.shuffleArray(allOptions));
            } else {
                this.displayOptions(displayOptions);
            }
        }
        
        // Joker butonlar�n�n durumunu g�ncelle
        this.updateJokerButtons();

        // Sayac� ba�lat
        this.startTimer();
    },
    
    // ��klar� ekrana yazd�r
    displayOptions: function(options) {
        if (!this.optionsElement) return;
        
        options.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.className = 'option';
            optionButton.textContent = option;
            
            // ��k t�klama olay�
            optionButton.addEventListener('click', (e) => {
                // Zaten t�klanm�� veya devre d��� b�rak�lm�� ��klara t�klamay� �nle
                if (e.target.disabled || e.target.classList.contains('selected') || 
                    document.querySelector('.option.selected')) {
                    return;
                }
                
                // T�klanan ��k� i�aretle
                e.target.classList.add('selected');
                
                // Cevab� kontrol et
                this.checkAnswer(option);
            });
            
            this.optionsElement.appendChild(optionButton);
        });
    },
    
    // Zamanlay�c�y� ba�lat
    startTimer: function() {
        // Var olan zamanlay�c�y� temizle
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const isBlankFilling = currentQuestion.type === "BlankFilling";
        this.timeLeft = isBlankFilling ? this.TIME_PER_BLANK_FILLING_QUESTION : this.TIME_PER_QUESTION;
        this.updateTimeDisplay();
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimeDisplay();
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.handleTimeUp(); // T�m soru tiplerinde handleTimeUp �a�r�lacak
            }
        }, 1000);
    },
    
    // Zaman g�stergesini g�ncelle
    updateTimeDisplay: function() {
        if (this.timeLeftElement) {
            this.timeLeftElement.textContent = this.timeLeft;
            
            // Son 5 saniyede k�rm�z� yap
            if (this.timeLeft <= 5) {
                this.timeLeftElement.classList.add('time-low');
            } else {
                this.timeLeftElement.classList.remove('time-low');
            }
        }
    },
    
    // Cevab� kontrol et
    checkAnswer: function(selectedAnswer) {
        // E�er zaten cevap verilmi�se i�lem yapma
        if (document.querySelector('.result').style.display === 'block') {
            return;
        }
        
        // Sayac� durdur
        clearInterval(this.timerInterval);
        
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const correctAnswer = currentQuestion.correctAnswer;
        
        // Cevap do�ru mu?
        const isCorrect = selectedAnswer === correctAnswer;
        
        // Cevab� mevcut b�l�m istatisti�ine ekle
        this.recordAnswer(isCorrect);

        // Do�ru/Yanl�� tipindeki sorular i�in
        if (currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse") {
            const tfOptions = document.querySelectorAll('.true-false-option');
            tfOptions.forEach(option => {
                option.disabled = true;
                const isTrue = option.classList.contains('true');
                const isFalse = option.classList.contains('false');
                
                // Do�ru cevap DO�RU ise
                if (correctAnswer === this.getTranslation('trueOption') && isTrue) {
                    option.classList.add('correct');
                }
                // Do�ru cevap YANLI� ise
                else if (correctAnswer === this.getTranslation('falseOption') && isFalse) {
                    option.classList.add('correct');
                }
                
                // Se�ilen yanl�� ise
                if ((isTrue && selectedAnswer === this.getTranslation('trueOption') && !isCorrect) ||
                    (isFalse && selectedAnswer === this.getTranslation('falseOption') && !isCorrect)) {
                    option.classList.add('wrong');
                }
                
                // Se�ilen buton ise
                if ((isTrue && selectedAnswer === this.getTranslation('trueOption')) ||
                    (isFalse && selectedAnswer === this.getTranslation('falseOption'))) {
                    option.classList.add('selected');
                }
            });
        } else {
            // Normal �oktan se�meli sorular i�in
            const options = document.querySelectorAll('.option');
            options.forEach(option => {
                option.disabled = true;
                option.classList.add('answered'); // Cevapland���n� belirt
                
                if (option.textContent === correctAnswer) {
                    option.classList.add('correct');
                } else if (option.textContent === selectedAnswer && !isCorrect) {
                    option.classList.add('wrong');
                }
            });
        }
        
        // Sonucu g�ster
        const resultElement = document.getElementById('result');
        if (!resultElement) {
            console.warn('Result elementi bulunamad�, olu�turuluyor...');
            this.createResultElement();
        }
        
        if (resultElement) {
            if (isCorrect) {
                // Tam ekran do�ru modal�
                const correctModal = document.createElement('div');
                correctModal.className = 'correct-modal';
                correctModal.innerHTML = `
                    <div class="correct-modal-content">
                        <div class="correct-modal-icon">
                            <i class="fas fa-crown"></i>
                        </div>
                        <div class="correct-modal-text">${this.getTranslation('correct')}</div>
                        <div class="correct-modal-score">+${Math.max(1, Math.ceil(this.timeLeft / 5))}</div>
                        <button id="next-question" class="next-button">${this.getTranslation('next')}</button>
                    </div>
                `;
                document.body.appendChild(correctModal);
                correctModal.querySelector('#next-question').onclick = () => {
                    correctModal.remove();
                    this.showNextQuestion();
                };
                correctModal.onclick = (e) => {
                    if (e.target === correctModal) {
                        correctModal.remove();
                        this.showNextQuestion();
                    }
                };
                this.resultElement.style.display = 'none';
                this.resultElement.innerHTML = '';
                this.resultElement.className = 'result';
                // Puan� art�r
                const scoreForQuestion = Math.max(1, Math.ceil(this.timeLeft / 5));
                this.addScore(scoreForQuestion);
        this.recordAnswer(true);
                this.correctAnswers++;
                // Ses efekti �al
                if (this.soundEnabled) {
                    const correctSound = document.getElementById('sound-correct');
                    if (correctSound) correctSound.play().catch(e => console.error("Ses �al�namad�:", e));
                }
            } else {
                // Tam ekran yanl�� modal�
                this.loseLife();
                const wrongModal = document.createElement('div');
                wrongModal.className = 'wrong-modal';
                wrongModal.innerHTML = `
                    <div class="wrong-modal-content">
                        <div class="wrong-modal-icon">
                            <i class="fas fa-times-circle"></i>
                        </div>
                        <div class="wrong-modal-text">${this.getTranslation('wrong')}</div>
                        <div class="wrong-modal-correct">${this.getTranslation('correctAnswer')}: <strong>${correctAnswer}</strong></div>
                        <button id="next-question" class="next-button">${this.getTranslation('next')}</button>
                    </div>
                `;
                document.body.appendChild(wrongModal);
                wrongModal.querySelector('#next-question').onclick = () => {
                    wrongModal.remove();
                    this.showNextQuestion();
                };
                wrongModal.onclick = (e) => {
                    if (e.target === wrongModal) {
                        wrongModal.remove();
                        this.showNextQuestion();
                    }
                };
                this.resultElement.style.display = 'none';
                this.resultElement.innerHTML = '';
                this.resultElement.className = 'result';
                // Ses efekti �al
                if (this.soundEnabled) {
                    const wrongSound = document.getElementById('sound-wrong');
                    if (wrongSound) wrongSound.play().catch(e => console.error("Ses �al�namad�:", e));
                }
            }
        }
        
        // Sonuc elementini g�r�n�r yap
        resultElement.style.display = 'block';
        
        // Sonraki soru butonuna olay dinleyicisi ekle
        const nextBtn = resultElement.querySelector('#next-question');
        if (nextBtn) {
            nextBtn.id = 'next-question';
            nextBtn.className = 'next-button';
            nextBtn.textContent = this.getTranslation('next');
            nextBtn.addEventListener('click', () => this.showNextQuestion());
            resultElement.appendChild(nextBtn);
        }
    },
    
    // Bo�luk doldurma cevab�n� kontrol et
    checkBlankFillingAnswer: function(userAnswer, correctAnswer) {
        clearInterval(this.timerInterval);
        const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
        this.recordAnswer(isCorrect);

        const answerInput = document.getElementById('blank-answer');
        const submitButton = document.getElementById('submit-answer');
        if (answerInput) answerInput.disabled = true;
        if (submitButton) submitButton.disabled = true;

        // Sonucu tam ekran modal ile g�ster
        if (isCorrect) {
            // DO�RU MODAL
            const correctModal = document.createElement('div');
            correctModal.className = 'correct-modal';
            correctModal.innerHTML = `
                <div class="correct-modal-content">
                    <div class="correct-modal-icon"><i class="fas fa-crown"></i></div>
                    <div class="correct-modal-text">${this.getTranslation('correct')}</div>
                    <div class="correct-modal-score">+${Math.max(1, Math.ceil(this.timeLeft / 5))}</div>
                    <button id="next-question" class="next-button">${this.getTranslation('next')}</button>
                </div>
            `;
            document.body.appendChild(correctModal);
            correctModal.querySelector('#next-question').onclick = () => {
                correctModal.remove();
                this.showNextQuestion();
            };
            correctModal.onclick = (e) => {
                if (e.target === correctModal) correctModal.remove();
            };
            // Puan� art�r
            const scoreForQuestion = Math.max(1, Math.ceil(this.timeLeft / 5));
            this.addScore(scoreForQuestion);
        this.recordAnswer(true);
            this.correctAnswers++;
            if (this.soundEnabled) {
                const correctSound = document.getElementById('sound-correct');
                if (correctSound) correctSound.play().catch(e => {});
            }
        } else {
            // YANLI� MODAL
            this.loseLife();
            const wrongModal = document.createElement('div');
            wrongModal.className = 'wrong-modal';
            wrongModal.innerHTML = `
                <div class="wrong-modal-content">
                    <div class="wrong-modal-icon"><i class="fas fa-times-circle"></i></div>
                    <div class="wrong-modal-text">${this.getTranslation('wrong')}</div>
                    <div class="wrong-modal-correct">${this.getTranslation('correctAnswer')}: <strong>${correctAnswer}</strong></div>
                    <button id="next-question" class="next-button">${this.getTranslation('next')}</button>
                </div>
            `;
            document.body.appendChild(wrongModal);
            wrongModal.querySelector('#next-question').onclick = () => {
                wrongModal.remove();
                this.showNextQuestion();
            };
            wrongModal.onclick = (e) => {
                if (e.target === wrongModal) wrongModal.remove();
            };
            if (this.soundEnabled) {
                const wrongSound = document.getElementById('sound-wrong');
                if (wrongSound) wrongSound.play().catch(e => {});
            }
        }

        this.updateScoreDisplay();
        this.answeredQuestions++;
        this.answerTimes.push(this.TIME_PER_BLANK_FILLING_QUESTION - this.timeLeft);

        // Can kontrol� kald�r�ld� - loseLife fonksiyonu kendi ba��na can sat�n alma modal�n� handle ediyor
    },
    
    // Do�ru cevaba benzer yanl�� ��klar �ret
    generateWrongOptions: function(correctAnswer) {
        // Bu fonksiyon, do�ru cevaba benzer yanl�� ��klar �retmek i�in �e�itli stratejiler kullan�r
        
        // Basit bir strateji: T�rk�e'deki yayg�n kelimelerden rastgele 3 tane se�
        const commonWords = [
            "Elma", "T�rkiye", "Ankara", "�stanbul", "Kitap", "Bilgisayar", "Araba", 
            "Deniz", "G�ne�", "Ay", "Y�ld�z", "Okul", "��retmen", "��renci",
            "�i�ek", "A�a�", "Orman", "Da�", "Nehir", "G�l", "Okyanus", "M�zik",
            "Film", "Tiyatro", "Spor", "Futbol", "Basketbol", "Voleybol", "Tenis"
        ];
        
        let wrongOptions = [];
        
        // Do�ru cevab� d�n��t�r (say� ise kelimeye �evir, tek kelime ise ba�ka kelimeler se�)
        if (!isNaN(correctAnswer)) {
            // Say�ysa, yak�n say�lar �ret
            const correctNum = parseInt(correctAnswer);
            const randomOffset = () => Math.floor(Math.random() * 10) + 1;
            
            wrongOptions = [
                String(correctNum + randomOffset()),
                String(correctNum - randomOffset()),
                String(correctNum * 2)
            ];
        } else {
            // Kelime ise, rastgele kelimeler se�
            let availableWords = commonWords.filter(word => word.toLowerCase() !== correctAnswer.toLowerCase());
            availableWords = this.shuffleArray(availableWords);
            wrongOptions = availableWords.slice(0, 3);
        }
        
        return wrongOptions;
    },
    
    // Mevcut seviye i�in sorular� y�kle
    loadQuestionsForCurrentLevel: function() {
        console.log(`Seviye ${this.currentLevel} i�in sorular y�kleniyor...`);
        
        if (!this.questionsData || !this.selectedCategory) {
            console.error("Soru verisi veya se�ili kategori bulunamad�!");
            return;
        }
        
        // Se�ilen kategoriden sorular
        let categoryQuestions = this.questionsData[this.selectedCategory] || [];
        
        if (categoryQuestions.length === 0) {
            console.error(`${this.selectedCategory} kategorisinde soru bulunamad�!`);
            return;
        }
        
        // Progressive difficulty sistemi: B�l�me g�re otomatik zorluk belirleme
        const targetDifficulty = this.getProgressiveDifficulty();
        const difficultyNames = { 1: 'Kolay', 2: 'Orta', 3: 'Zor' };
        const difficultyName = difficultyNames[targetDifficulty];
        
        console.log(`?? Progressive Difficulty: B�l�m ${this.currentSection}/${this.getMaxSectionsForCategory()} - Zorluk: ${difficultyName} (${targetDifficulty})`);
        
        // Sorular� zorluklar�na g�re grupla
        const groupedByDifficulty = {};
        categoryQuestions.forEach(question => {
            // Zorluk seviyesi belirtilmemi�se 2 olarak kabul et (orta seviye)
            const difficulty = question.difficulty || 2;
            
            if (!groupedByDifficulty[difficulty]) {
                groupedByDifficulty[difficulty] = [];
            }
            
            groupedByDifficulty[difficulty].push(question);
        });
        
        // Debug bilgisi
        console.log('Se�ilen kategori:', this.selectedCategory);
        console.log('Kategoride toplam soru say�s�:', categoryQuestions.length);
        console.log('Zorluk seviyelerine g�re grupland�r�lm�� sorular:', groupedByDifficulty);
        console.log('Zorluk seviyesi 3 olan soru say�s�:', (groupedByDifficulty[3] || []).length);
        
        // Se�ilen zorluk seviyesinden sorular al
        let levelQuestions = [];
        
        // SADECE hedef zorluk seviyesinden sorular al
        const targetQuestions = groupedByDifficulty[targetDifficulty] || [];
        console.log(`Hedef zorluk seviyesi ${targetDifficulty} i�in mevcut soru say�s�:`, targetQuestions.length);
        
        if (targetQuestions.length > 0) {
            const shuffled = this.shuffleArray([...targetQuestions]);
            levelQuestions = shuffled;
            console.log(`? Se�ilen zorluk seviyesi (${targetDifficulty}) i�in ${levelQuestions.length} soru bulundu`);
        } else {
            console.warn(`?? Se�ilen zorluk seviyesi (${targetDifficulty}) i�in hi� soru bulunamad�!`);
        }
        
        // E�er hi� soru yoksa kullan�c�y� bilgilendir
        if (levelQuestions.length === 0) {
            const difficultyName = difficultyNames[targetDifficulty] || 'Bilinmeyen';
            
            alert(`Bu kategoride "${difficultyName}" seviyesinde soru bulunmuyor. L�tfen ba�ka bir kategori veya zorluk seviyesi se�in.`);
            
            // Kategori se�imine geri d�n
            this.displayCategories();
            return;
        }
        
        // En fazla 10 soru g�ster (kullan�c�n�n se�ti�i zorluk seviyesinden)
        this.questions = levelQuestions.slice(0, Math.min(10, levelQuestions.length));
        this.arrangeBlankFillingFirst();
        
        // Debug: Y�klenen sorular�n zorluk seviyelerini kontrol et
        const difficultyCheck = {};
        this.questions.forEach(q => {
            const diff = q.difficulty || 'undefined';
            difficultyCheck[diff] = (difficultyCheck[diff] || 0) + 1;
        });
        console.log(`?? Progressive Zorluk: ${difficultyNames[targetDifficulty]} (${targetDifficulty})`);
        console.log(`? Y�klenen ${this.questions.length} sorunun zorluk da��l�m�:`, difficultyCheck);
        console.log(`B�l�m ${this.currentSection} i�in ${this.questions.length} soru y�klendi.`);
        
        // �lk soruyu g�ster
        if (this.questions.length > 0) {
            this.currentQuestionIndex = 0;
            this.startQuiz();
        } else {
            // Yeterli soru yoksa kategori se�imine geri d�n
            console.error("Bu seviye i�in yeterli soru bulunamad�!");
            this.displayCategories();
        }
    },
    
    // Do�ru/Yanl�� tipi sorular� g�ster
    loadTrueFalseQuestion: function(questionData) {
        // Sonu� alan�n� temizle
        if (this.resultElement) {
            this.resultElement.innerHTML = '';
            this.resultElement.className = 'result';
            this.resultElement.style.display = 'none';
        }
        
        // Sonraki soru butununu gizle
        if (this.nextButton) {
            this.nextButton.style.display = 'none';
        }
        
        // Soruyu g�ster
        if (this.questionElement) {
            // �evirisi varsa �eviriyi g�ster
            if (questionData.translations && questionData.translations[this.currentLanguage] && questionData.translations[this.currentLanguage].question) {
                this.questionElement.textContent = questionData.translations[this.currentLanguage].question;
            } else {
                this.questionElement.textContent = questionData.question;
            }
            
            // E�er soruda g�rsel varsa g�ster
            if (questionData.imageUrl) {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'question-image';
                const img = document.createElement('img');
                img.src = questionData.imageUrl;
                img.alt = this.getTranslation('questionImage');
                img.style.maxWidth = '100%';
                img.style.maxHeight = '300px';
                img.style.margin = '10px auto';
                img.style.display = 'block';
                const oldImages = this.questionElement.querySelectorAll('.question-image');
                oldImages.forEach(img => img.remove());
                imageContainer.appendChild(img);
                this.questionElement.appendChild(imageContainer);
            }
        }
        
        // Do�ru/Yanl�� se�eneklerini g�ster
        if (this.optionsElement) {
            this.optionsElement.innerHTML = '';
            this.optionsElement.style.display = 'flex';
            this.optionsElement.style.flexDirection = 'column';
            this.optionsElement.style.alignItems = 'center';
            this.optionsElement.style.justifyContent = 'center';
            this.optionsElement.style.width = '100%';
            
            // Se�enekler
            const trueOption = document.createElement('button');
            trueOption.className = 'true-false-option true';
            trueOption.innerHTML = `<i class="fas fa-check"></i> ${this.getTranslation('trueOption')}`;
            
            const falseOption = document.createElement('button');
            falseOption.className = 'true-false-option false';
            falseOption.innerHTML = `<i class="fas fa-times"></i> ${this.getTranslation('falseOption')}`;
            
            // T�klama olaylar�
            trueOption.addEventListener('click', (e) => {
                // Zaten cevapland�ysa i�lem yapma
                if (e.target.disabled || e.target.classList.contains('selected') || 
                    document.querySelector('.true-false-option.selected') || 
                    document.querySelector('.result').style.display === 'block') {
                    return;
                }
                
                // T�klanan ��k� i�aretle
                e.target.classList.add('selected');
                
                this.checkAnswer(this.getTranslation('trueOption'));
            });
            
            falseOption.addEventListener('click', (e) => {
                // Zaten cevapland�ysa i�lem yapma
                if (e.target.disabled || e.target.classList.contains('selected') || 
                    document.querySelector('.true-false-option.selected') || 
                    document.querySelector('.result').style.display === 'block') {
                    return;
                }
                
                // T�klanan ��k� i�aretle
                e.target.classList.add('selected');
                
                this.checkAnswer(this.getTranslation('falseOption'));
            });
            
            // Se�enekleri ekle
            this.optionsElement.appendChild(trueOption);
            this.optionsElement.appendChild(falseOption);
        }
        
        // Sayac� ba�lat
        this.startTimer();
    },
    
    // Do�ru/Yanl�� cevab�n� kontrol et
    selectTrueFalseAnswer: function(selectedAnswer, correctAnswer) {
        // Sayac� durdur
        clearInterval(this.timerInterval);
        
        const isCorrect = selectedAnswer === correctAnswer;
        
        // Cevab� mevcut b�l�m istatisti�ine ekle
        this.recordAnswer(isCorrect);
        
        // ��klar� devre d��� b�rak ve do�ru/yanl�� renklendir
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.disabled = true;
            
            if (option.textContent === correctAnswer) {
                option.classList.add('correct');
            } else if (option.textContent === selectedAnswer && !isCorrect) {
                option.classList.add('wrong');
            }
        });
        
        // Sonucu g�ster
        if (this.resultElement) {
            if (isCorrect) {
                this.resultElement.innerHTML = `
                    <div class="correct-answer-container">
                        <div class="correct-icon"><i class="fas fa-badge-check"></i></div>
                        <div class="correct-text">Do�ru!</div>
                        <div class="correct-animation">
                            <span>+</span>
                            <span>${Math.max(1, Math.ceil(this.timeLeft / 3))}</span>
                        </div>
                    </div>
                    <button id="next-question" class="next-button">Sonraki Soru</button>
                `;
                this.resultElement.className = 'result correct';
                
                // Sonraki soru butonuna olay dinleyicisi ekle - showNextQuestion fonksiyonunu �a��r
                const nextBtn = this.resultElement.querySelector('#next-question');
                if (nextBtn) {
                    nextBtn.addEventListener('click', () => this.showNextQuestion());
                }
                
                // Puan� art�r - kalan s�reye g�re puan ver (min 1, max 5)
                const scoreForQuestion = Math.max(1, Math.ceil(this.timeLeft / 3));
                this.addScore(scoreForQuestion);
        this.recordAnswer(true);
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const correctSound = document.getElementById('sound-correct');
                    if (correctSound) correctSound.play().catch(e => console.error("Ses �al�namad�:", e));
                }
            } else {
                this.resultElement.innerHTML = `Yanl��! Do�ru cevap: <strong>${correctAnswer}</strong>`;
                this.resultElement.className = 'result wrong';
                
                // Can azalt
                this.loseLife();
                
                // Ses efekti �al
                if (this.soundEnabled) {
                    const wrongSound = document.getElementById('sound-wrong');
                    if (wrongSound) wrongSound.play().catch(e => console.error("Ses �al�namad�:", e));
                }
                
                // Yanl�� cevap durumunda sonraki soru butonunu g�ster
                if (this.nextButton) {
                    this.nextButton.style.display = 'block';
                }
            }
            
            this.resultElement.style.display = 'block';
        }
        
        // Skoru g�ncelle
        this.updateScoreDisplay();
        
        // �statisti�i g�ncelle
        this.answeredQuestions++;
        this.answerTimes.push(this.TIME_PER_QUESTION - this.timeLeft);
        
        // Can kontrol� kald�r�ld� - loseLife fonksiyonu kendi ba��na can sat�n alma modal�n� handle ediyor
    },
    
    // Profil sayfas�n� g�ster
    showProfilePage: function() {
        // Ana i�erikleri gizle
        if (this.quizElement) this.quizElement.style.display = 'none';
        if (this.resultElement) this.resultElement.style.display = 'none';
        if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'none';
        
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.style.display = 'none';
        
        const onlineGameOptions = document.getElementById('online-game-options');
        if (onlineGameOptions) onlineGameOptions.style.display = 'none';
        
        const globalLeaderboard = document.getElementById('global-leaderboard'); 
        if (globalLeaderboard) globalLeaderboard.style.display = 'none';
        
        // Di�er sayfalar� da gizle
        const friendsPage = document.getElementById('friends-page');
        if (friendsPage) friendsPage.style.display = 'none';
        
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) adminPanel.style.display = 'none';
        
        // Profil sayfas�n� g�r�nt�le
        const profilePage = document.getElementById('profile-page');
        if (profilePage) {
            profilePage.style.display = 'block';
            document.body.classList.add('profile-active');
            
            // Profil bilgilerini y�kle
            this.loadProfileData();
            
            // Profil sayfas� butonlar�na event listener'lar� ekle
            this.addProfileEventListeners();
        } else {
            // Profil sayfas� yoksa uyar� g�ster
            this.showToast("Profil sayfas� hen�z eklenmemi�", "toast-warning");
            
            // Ana men�ye geri d�n
            if (mainMenu) mainMenu.style.display = 'block';
        }
    },
    
    // Profil sayfas� butonlar�na olay dinleyicileri ekle
    addProfileEventListeners: function() {
        // Ana men�ye d�n butonu
        const backFromProfileBtn = document.getElementById('back-from-profile');
        if (backFromProfileBtn) {
            backFromProfileBtn.addEventListener('click', () => {
                // Profil sayfas�n� gizle
                const profilePage = document.getElementById('profile-page');
                if (profilePage) profilePage.style.display = 'none';
                document.body.classList.remove('profile-active');
                
                // Ana men�y� g�ster
                const mainMenu = document.getElementById('main-menu');
                if (mainMenu) mainMenu.style.display = 'block';
            });
        }
        
        // ��k�� yap butonu
        const logoutFromProfileBtn = document.getElementById('logout-from-profile');
        if (logoutFromProfileBtn) {
            logoutFromProfileBtn.addEventListener('click', () => {
                // Firebase ile ��k�� yap
                if (firebase.auth) {
                    firebase.auth().signOut().then(() => {
                        window.location.href = 'login.html';
                    }).catch(error => {
                        console.error("��k�� yap�l�rken hata olu�tu:", error);
                        this.showToast("��k�� yap�l�rken bir hata olu�tu", "toast-error");
                    });
                }
            });
        }
        
        // Profili d�zenle butonu
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                this.showEditProfileModal();
            });
            // Buton metnini g�ncelle
            editProfileBtn.innerHTML = '<i class="fas fa-edit"></i> Profili D�zenle';
        }
    },
    
    // Profil verilerini y�kle
    loadProfileData: function() {
        const userId = this.getCurrentUserId();
        
        // Kullan�c� bilgilerini y�kle
        if (firebase.auth && firebase.auth().currentUser) {
            const user = firebase.auth().currentUser;
            
            // Kullan�c� ad� ve e-posta
            const profileName = document.getElementById('profile-name');
            if (profileName) profileName.textContent = user.displayName || user.email || 'Kullan�c�';
            
            const profileEmail = document.getElementById('profile-email');
            if (profileEmail) profileEmail.textContent = user.email || '';
            
            // �yelik tarihi
            const joinDate = document.getElementById('profile-join-date');
            if (joinDate && user.metadata && user.metadata.creationTime) {
                const date = new Date(user.metadata.creationTime);
                joinDate.textContent = date.toLocaleDateString('tr-TR');
            }
        }
        
        // Firebase'den kullan�c� verilerini y�kle (puan, istatistikler vs.)
        this.loadFirebaseUserStats(userId);
        
        // Ger�ek istatistikleri g�ncelle
        this.updateRealUserStats();
            
        // Rozetleri y�kle
        this.loadUserBadgesForProfile(userId);
            
        // Y�ksek skorlar� y�kle
        this.loadHighScoresForProfile(userId);
            
        // Son aktiviteleri y�kle
        this.loadRecentActivitiesForProfile(userId);
    },

    // Mevcut kullan�c� ID'sini al
    getCurrentUserId: function() {
        if (firebase.auth && firebase.auth().currentUser) {
            return firebase.auth().currentUser.uid;
        }
        // Firebase yoksa yerel ID kullan
        return 'local-user';
    },

    // Test verileri olu�tur (geli�tirme ama�l�)
    createTestData: function() {
        const userId = this.getCurrentUserId();
        
        // Test skorlar� olu�tur
        const testScores = [
            { category: 'Genel K�lt�r', score: 85, totalQuestions: 10, correctAnswers: 8, date: Date.now() - 86400000 },
            { category: 'Bilim', score: 92, totalQuestions: 10, correctAnswers: 9, date: Date.now() - 172800000 },
            { category: 'Tarih', score: 78, totalQuestions: 10, correctAnswers: 7, date: Date.now() - 259200000 },
            { category: 'Spor', score: 90, totalQuestions: 10, correctAnswers: 9, date: Date.now() - 345600000 },
            { category: 'Co�rafya', score: 100, totalQuestions: 10, correctAnswers: 10, date: Date.now() - 432000000 }
        ];
        
        // Skorlar� localStorage'a kaydet
        localStorage.setItem('quiz-high-scores', JSON.stringify(testScores));
        
        // �statistikleri hesapla ve kaydet
        this.calculateRealStats();
        
        // �lk oyun rozetini ver
        this.badgeSystem.awardBadge(userId, this.badgeSystem.badges.firstGame);
        
        console.log('Test verileri olu�turuldu!');
        this.showToast('Test verileri olu�turuldu! Profil sayfas�n� yenileyin.', 'toast-success');
    },
    
    // Firebase'den kullan�c� istatistiklerini y�kle
    loadFirebaseUserStats: function(userId) {
        if (!firebase.firestore) {
            // Firebase yoksa localStorage'dan istatistikleri al
            const stats = this.getStats();
            this.updateProfileStats(stats);
            return;
        }
        
        const db = firebase.firestore();
        
        // Kullan�c� dok�man�ndan temel bilgileri al
        db.collection('users').doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    console.log('Kullan�c� verileri:', userData);
                    
                    // Firebase'den gelen totalScore'u quizApp'e ata
                    if (userData.totalScore !== undefined) {
                        this.totalScore = userData.totalScore;
                    }
                    
                    // Profilde toplam puan� g�ster
                    const profileTotalScore = document.getElementById('profile-total-score');
                    if (profileTotalScore) {
                        profileTotalScore.textContent = this.totalScore || 0;
                    }
                    
                    // Profilde seviyeyi g�ster
                    const profileUserLevel = document.getElementById('profile-user-level');
                    if (profileUserLevel) {
                        const level = Math.floor((this.totalScore || 0) / 500) + 1;
                        profileUserLevel.textContent = level;
                    }
                    
                    // E�er kullan�c� verisinde istatistik yoksa skorlardan hesapla
                    if (!userData.stats) {
                        this.calculateStatsFromScores(userId);
                    } else {
                        this.updateProfileStats(userData.stats);
                    }
                } else {
                    // Kullan�c� verisi yoksa skorlardan hesapla
                    this.calculateStatsFromScores(userId);
                }
            })
            .catch((error) => {
                console.error('Kullan�c� verileri y�klenirken hata:', error);
                // Hata durumunda localStorage'dan al
                const stats = this.getStats();
                this.updateProfileStats(stats);
            });
    },
    
    // Skorlardan istatistikleri hesapla
    calculateStatsFromScores: function(userId) {
        if (!firebase.firestore) return;
        
        const db = firebase.firestore();
        
        // Firestore'daki highScores koleksiyonundan kullan�c�n�n skorlar�n� al
        db.collection('highScores')
            .where('userId', '==', userId)
            .get()
            .then((querySnapshot) => {
                let totalGames = 0;
                let totalQuestions = 0;
                let totalCorrect = 0;
                let categoryStats = {};
                
                querySnapshot.forEach((doc) => {
                    const scoreData = doc.data();
                    totalGames++;
                    totalQuestions += scoreData.totalQuestions || 0;
                    totalCorrect += scoreData.correctAnswers || scoreData.score || 0;
                    
                    // Kategori istatistikleri
                    const category = scoreData.category || 'Genel';
                    if (!categoryStats[category]) {
                        categoryStats[category] = {
                            games: 0,
                            questions: 0,
                            correct: 0
                        };
                    }
                    categoryStats[category].games++;
                    categoryStats[category].questions += scoreData.totalQuestions || 0;
                    categoryStats[category].correct += scoreData.correctAnswers || scoreData.score || 0;
                });
                
                const stats = {
                    totalGames,
                    totalQuestions,
                    correctAnswers: totalCorrect,
                    categoryStats
                };
                
                console.log('Hesaplanan istatistikler:', stats);
                this.updateProfileStats(stats);
                
                // �statistikleri kullan�c� dok�man�na kaydet
                db.collection('users').doc(userId).update({
                    stats: stats,
                    statsLastUpdated: new Date()
                }).catch((error) => {
                    console.error('�statistikler kaydedilirken hata:', error);
                });
            })
            .catch((error) => {
                console.error('Skorlar al�n�rken hata:', error);
                // Hata durumunda localStorage'dan al
                const stats = this.getStats();
                this.updateProfileStats(stats);
            });
    },
    
    // Profil istatistiklerini g�ncelle
    updateProfileStats: function(stats) {
        console.log('updateProfileStats �a�r�ld�, stats:', stats);
        
        const totalGames = document.getElementById('stats-total-games');
        if (totalGames) {
            totalGames.textContent = stats.totalGames || 0;
            console.log('Toplam oyun g�ncellendi:', stats.totalGames || 0);
        }
        
        const totalQuestions = document.getElementById('stats-total-questions');
        if (totalQuestions) {
            totalQuestions.textContent = stats.totalQuestions || 0;
            console.log('Toplam soru g�ncellendi:', stats.totalQuestions || 0);
        }
        
        const correctAnswers = document.getElementById('stats-correct-answers');
        if (correctAnswers) {
            correctAnswers.textContent = stats.correctAnswers || 0;
            console.log('Do�ru cevap g�ncellendi:', stats.correctAnswers || 0);
        }
        
        // Do�ruluk oran�
        const accuracy = document.getElementById('stats-accuracy');
        if (accuracy) {
            const accuracyValue = stats.totalQuestions > 0 
                ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
                : 0;
            accuracy.textContent = `%${accuracyValue}`;
            console.log('Do�ruluk oran� g�ncellendi:', accuracyValue);
        }
    },

    // Ger�ek kullan�c� istatistiklerini al ve g�ncelle
    updateRealUserStats: function() {
        const userId = this.getCurrentUserId();
        if (!userId) return;

        // localStorage'dan ger�ek istatistikleri �ek
        const realStats = this.calculateRealStats();
        
        // Profil sayfas� a��ksa istatistikleri g�ncelle
        const profilePage = document.getElementById('profile-page');
        if (profilePage && profilePage.style.display !== 'none') {
            this.updateProfileStats(realStats);
            
            // Toplam puan� g�ncelle (Firebase'den gelen veya mevcut toplam puan)
            const profileTotalScore = document.getElementById('profile-total-score');
            if (profileTotalScore) {
                profileTotalScore.textContent = this.totalScore || 0;
            }
            
            // Seviyeyi g�ncelle (toplam puana g�re)
            const profileUserLevel = document.getElementById('profile-user-level');
            if (profileUserLevel) {
                const level = Math.floor((this.totalScore || 0) / 500) + 1;
                profileUserLevel.textContent = level;
            }
        }

        // Rozet sistemini kontrol et
        this.badgeSystem.checkAndAwardBadges(userId, realStats);
        
        return realStats;
    },

    // Ger�ek istatistikleri hesapla
    calculateRealStats: function() {
        try {
            console.log('calculateRealStats �a�r�ld�');
            
            // Oyun ge�mi�ini al
            const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
            console.log('Oyun ge�mi�i:', gameHistory);
            
            let totalGames = 0;
            let totalQuestions = 0;
            let correctAnswers = 0;
            let totalScore = 0;
            let perfectGames = 0;
            let fastAnswers = 0;
            let categoriesPlayed = new Set();
            let categoryStats = {};

            // Her oyunu analiz et
            gameHistory.forEach(game => {
                totalGames++;
                totalQuestions += game.totalQuestions || 0;
                correctAnswers += game.correctAnswers || 0;
                totalScore += game.score || 0;
                
                // M�kemmel oyunlar� say
                if (game.correctAnswers === game.totalQuestions && game.totalQuestions > 0) {
                    perfectGames++;
                }
                
                // H�zl� cevaplar� say (ortalama s�re 10 saniyeden az ise)
                if (game.averageTime && game.averageTime < 10) {
                    fastAnswers++;
                }
                
                // Kategorileri topla
                if (game.category) {
                    categoriesPlayed.add(game.category);
                    
                    // Kategori istatistikleri
                    if (!categoryStats[game.category]) {
                        categoryStats[game.category] = { total: 0, correct: 0, games: 0 };
            }
                    categoryStats[game.category].total += game.totalQuestions || 0;
                    categoryStats[game.category].correct += game.correctAnswers || 0;
                    categoryStats[game.category].games++;
                }
            });

            // High scores'tan da veri topla (eski format deste�i i�in)
            const categories = ['Genel K�lt�r', 'Bilim', 'Teknoloji', 'Spor', 'M�zik', 'Tarih', 'Co�rafya', 'Sanat', 'Edebiyat', 'Hayvanlar', 'Matematik'];
            
            categories.forEach(category => {
                const categoryScores = JSON.parse(localStorage.getItem(`highScores_${category}`) || '[]');
                categoryScores.forEach(score => {
                    if (score.score) {
                        // Sadece gameHistory'de yoksa ekle (duplikasyon �nleme)
                        const existsInHistory = gameHistory.some(game => 
                            game.category === category && 
                            Math.abs((game.score || 0) - score.score) < 5 // K���k fark tolerans�
                        );
                        
                        if (!existsInHistory) {
                            totalGames++;
                        totalScore += score.score;
                            totalQuestions += score.totalQuestions || 10; // Varsay�lan
                            correctAnswers += score.correctAnswers || Math.round(score.score / 10);
                        
                        if (score.percentage === 100) {
                            perfectGames++;
                        }
                        categoriesPlayed.add(category);
                            
                            // Kategori istatistikleri
                            if (!categoryStats[category]) {
                                categoryStats[category] = { total: 0, correct: 0, games: 0 };
                            }
                            categoryStats[category].total += score.totalQuestions || 10;
                            categoryStats[category].correct += score.correctAnswers || Math.round(score.score / 10);
                            categoryStats[category].games++;
                        }
                    }
                });
            });

            const stats = {
                totalGames,
                totalQuestions,
                correctAnswers,
                totalScore,
                perfectGames,
                fastAnswers,
                categoriesPlayed: categoriesPlayed.size,
                accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
                averageScore: totalGames > 0 ? Math.round(totalScore / totalGames) : 0,
                highestScore: Math.max(...[totalScore, ...categories.map(cat => {
                    const scores = JSON.parse(localStorage.getItem(`highScores_${cat}`) || '[]');
                    return scores.length > 0 ? Math.max(...scores.map(s => s.score || 0)) : 0;
                })]),
                categoryStats
            };

            console.log('Hesaplanan istatistikler:', stats);

            // �statistikleri localStorage'a kaydet
            localStorage.setItem('userStats', JSON.stringify(stats));
            localStorage.setItem('quiz-user-stats', JSON.stringify(stats));
            
            return stats;
        } catch (error) {
            console.error('�statistikler hesaplan�rken hata:', error);
            return {
                totalGames: 0,
                totalQuestions: 0,
                correctAnswers: 0,
                totalScore: 0,
                perfectGames: 0,
                fastAnswers: 0,
                categoriesPlayed: 0,
                accuracy: 0,
                averageScore: 0,
                highestScore: 0,
                categoryStats: {}
            };
        }
    },
    
    // Kullan�c� rozetlerini profil i�in y�kle
    loadUserBadgesForProfile: function(userId) {
        const badgesContainer = document.getElementById('profile-badges-container');
        if (!badgesContainer) return;
        
        badgesContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Rozetler y�kleniyor...</div>';
        
        // Kullan�c�n�n kazand��� rozetleri al
        const userBadges = this.badgeSystem.getUserBadges(userId);
        // T�m mevcut rozetleri al
        const allBadges = this.badgeSystem.badges;
        
        setTimeout(() => {
            badgesContainer.innerHTML = '';
            
            // T�m rozetleri g�ster (kazan�lan ve kazan�lmayan)
            Object.values(allBadges).forEach(badge => {
                const badgeElement = document.createElement('div');
                const isEarned = userBadges[badge.id] !== undefined;
                
                badgeElement.className = isEarned ? 'badge-item earned' : 'badge-item';
                badgeElement.setAttribute('data-badge-id', badge.id);
                
                let badgeDate = '';
                if (isEarned) {
                    const earnedDate = userBadges[badge.id].earnedDate ? 
                        new Date(userBadges[badge.id].earnedDate).toLocaleDateString('tr-TR') : 
                        'Bilinmiyor';
                    badgeDate = earnedDate;
                } else {
                    badgeDate = 'Hen�z kazan�lmad�';
                }
                
                        badgeElement.innerHTML = `
                    <i class="badge-icon ${badge.icon || 'fas fa-award'}"></i>
                            <div class="badge-name">${badge.name || 'Bilinmeyen Rozet'}</div>
                    <div class="badge-date">${badgeDate}</div>
                        `;
                
                // Rozet t�klama olay� ekle
                badgeElement.addEventListener('click', () => {
                    this.showBadgeInfoModal(badge, isEarned, badgeDate);
                });
                        
                        badgesContainer.appendChild(badgeElement);
                    });
            
            // Rozetleri y�kledikten sonra g�ncel istatistikleri kontrol et ve rozetleri g�ncelle
            this.checkAndUpdateBadges(userId);
            
            // Hi� rozet yoksa placeholder g�ster
            if (Object.keys(allBadges).length === 0) {
                badgesContainer.innerHTML = '<div class="badge-placeholder">Hen�z tan�ml� rozet yok</div>';
            }
        }, 500);
    },

    // Rozet bilgi modal�n� g�ster
    showBadgeInfoModal: function(badge, isEarned, earnedDate) {
        // Modal olu�tur
        const modal = document.createElement('div');
        modal.className = 'modal badge-info-modal';
        modal.id = 'badge-info-modal';
        
        const statusText = isEarned ? '? Kazan�ld�!' : '? Hen�z Kazan�lmad�';
        const statusClass = isEarned ? 'earned' : 'not-earned';
        const howToEarnText = this.getBadgeRequirementText(badge);
        
        modal.innerHTML = `
            <div class="modal-content badge-modal-content">
                <div class="modal-header">
                    <h3><i class="${badge.icon}"></i> ${badge.name}</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="badge-info-display">
                        <div class="badge-icon-large ${statusClass}">
                            <i class="${badge.icon}"></i>
                </div>
                        <div class="badge-details">
                            <h4>${badge.name}</h4>
                            <p class="badge-description">${badge.description}</p>
                            <div class="badge-status ${statusClass}">
                                ${statusText}
                            </div>
                            ${isEarned ? `<div class="badge-earned-date">Kazan�ld�: ${earnedDate}</div>` : ''}
                        </div>
                    </div>
                    <div class="badge-requirements">
                        <h5><i class="fas fa-tasks"></i> Nas�l Kazan�l�r:</h5>
                        <p>${howToEarnText}</p>
                    </div>
                </div>
                </div>
            `;
        
        document.body.appendChild(modal);
        
        // Modal g�ster
        setTimeout(() => modal.classList.add('show'), 10);
    },

    // Rozet gereksinimlerini a��klayan metin
    getBadgeRequirementText: function(badge) {
        const requirements = {
            'firstGame': '�lk quiz oyununuzu oynay�n.',
            'perfectScore': 'Bir oyunda t�m sorular� do�ru cevaplay�n (10/10 puan).',
            'speedster': '5 soruyu 10 saniyeden k�sa s�rede cevaplay�n.',
            'scholar': 'Toplamda 50 soruyu do�ru cevaplay�n.',
            'dedicated': 'Toplamda 10 oyun tamamlay�n.',
            'genius': 'En az 20 soru cevaplad�ktan sonra %90 veya �zeri do�ruluk oran�na sahip olun.',
            'explorer': '5 farkl� kategoride oyun oynay�n.'
        };
        return requirements[badge.id] || 'Bu rozetin gereksinimleri hen�z tan�mlanmam��.';
    },

    // Rozetleri kontrol et ve g�ncelle
    checkAndUpdateBadges: function(userId) {
        // G�ncel istatistikleri al
        const currentStats = this.calculateRealStats();
        
        // Yeni rozetleri kontrol et
        const newBadges = this.badgeSystem.checkAndAwardBadges(userId, currentStats);
        
        // E�er yeni rozet kazan�ld�ysa profili yenile
        if (newBadges && newBadges.length > 0) {
            setTimeout(() => {
                this.loadUserBadgesForProfile(userId);
            }, 1000);
        }
    },
    
    // Y�ksek skorlar� profil i�in y�kle
    loadHighScoresForProfile: function(userId) {
        const highScoresTable = document.getElementById('profile-high-scores');
        if (!highScoresTable) return;
        
        highScoresTable.innerHTML = '<tr><td colspan="3" class="loading">Skorlar y�kleniyor...</td></tr>';
        
        if (firebase.firestore) {
            const db = firebase.firestore();
            
            db.collection('highScores')
                .where('userId', '==', userId)
                .orderBy('score', 'desc')
                .limit(10)
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        highScoresTable.innerHTML = '<tr><td colspan="3" class="no-data">Hen�z kaydedilen skor yok</td></tr>';
                        return;
                    }
                    
                    highScoresTable.innerHTML = '';
                    querySnapshot.forEach(doc => {
                        const scoreData = doc.data();
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${scoreData.category || 'Genel'}</td>
                            <td>${scoreData.score || 0}</td>
                            <td>${scoreData.date ? new Date(scoreData.date.toDate()).toLocaleDateString('tr-TR') : 'Bilinmiyor'}</td>
                        `;
                        highScoresTable.appendChild(row);
                    });
                })
                .catch(error => {
                    console.error('Y�ksek skorlar y�klenirken hata:', error);
                    highScoresTable.innerHTML = '<tr><td colspan="3" class="no-data">Skorlar y�klenirken hata olu�tu</td></tr>';
                });
        } else {
            // Firebase yoksa localStorage'dan al
            const scores = this.getHighScores();
            if (scores.length === 0) {
                highScoresTable.innerHTML = '<tr><td colspan="3" class="no-data">Hen�z kaydedilen skor yok</td></tr>';
                return;
            }
            
            highScoresTable.innerHTML = '';
            scores.slice(0, 10).forEach(score => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${score.category || 'Genel'}</td>
                    <td>${score.score || 0}</td>
                    <td>${score.date ? new Date(score.date).toLocaleDateString('tr-TR') : 'Bug�n'}</td>
                `;
                highScoresTable.appendChild(row);
            });
        }
    },
    
    // Son aktiviteleri profil i�in y�kle
    loadRecentActivitiesForProfile: function(userId) {
        const activitiesList = document.getElementById('recent-activities-list');
        if (!activitiesList) return;
        
        activitiesList.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Aktiviteler y�kleniyor...</div>';
        
        // Firebase'den aktiviteleri y�kleme
        if (firebase.auth && firebase.firestore && this.isLoggedIn) {
            const db = firebase.firestore();
            db.collection('users').doc(userId)
                .collection('activities')
                .orderBy('timestamp', 'desc')
                .limit(5)
                .get()
                .then((querySnapshot) => {
                    // Firebase'den gelen aktiviteleri i�le
                    if (!querySnapshot.empty) {
                        activitiesList.innerHTML = '';
                        querySnapshot.forEach((doc) => {
                            const activity = doc.data();
                            this.renderActivity(activity, activitiesList);
                        });
                    } else {
                        // Firebase'de aktivite yoksa localStorage'a bak
                        this.loadLocalActivities(activitiesList, userId);
                    }
                })
                .catch((error) => {
                    console.error("Aktiviteler y�klenirken hata olu�tu:", error);
                    // Hata durumunda localStorage'a bak
                    this.loadLocalActivities(activitiesList, userId);
                });
        } else {
            // Firebase yoksa veya kullan�c� giri� yapmam��sa localStorage'a bak
            this.loadLocalActivities(activitiesList, userId);
        }
    },
    
    // LocalStorage'dan aktiviteleri y�kle
    loadLocalActivities: function(activitiesList, userId) {
        try {
            const storedActivities = localStorage.getItem(`user-activities-${userId}`);
            const activities = storedActivities ? JSON.parse(storedActivities) : [];
            
            if (activities && activities.length > 0) {
                activitiesList.innerHTML = '';
                activities.forEach(activity => {
                    this.renderActivity(activity, activitiesList);
                });
            } else {
                this.generateSampleActivities(activitiesList);
            }
        } catch (error) {
            console.error("LocalStorage aktiviteleri i�lenirken hata:", error);
            this.generateSampleActivities(activitiesList);
        }
    },
    
    // Aktivite olu�tur
    createUserActivity: function(type, title, score = null, category = null) {
        const userId = this.getCurrentUserId();
        const now = new Date();
        
        const activityData = {
            type: type,           // 'game', 'badge', 'task', vb.
            title: title,         // Aktivite ba�l���
            timestamp: now,       // Ger�ekle�me zaman�
            score: score,         // Varsa skor de�eri
            category: category,   // Varsa kategori
            icon: this.getActivityIcon(type) // T�r i�in uygun ikon
        };
        
        // Firebase'e aktiviteyi kaydet
        if (firebase.auth && firebase.firestore && this.isLoggedIn) {
            const db = firebase.firestore();
            db.collection('users').doc(userId)
                .collection('activities')
                .add(activityData)
                .then(() => {
                    console.log("Aktivite Firebase'e kaydedildi:", title);
                })
                .catch((error) => {
                    console.error("Aktivite kaydedilirken hata:", error);
                    // Hata durumunda localStorage'a kaydet
                    this.saveActivityToLocalStorage(userId, activityData);
                });
        } else {
            // Firebase yoksa localStorage'a kaydet
            this.saveActivityToLocalStorage(userId, activityData);
        }
    },
    
    // Aktiviteyi LocalStorage'a kaydet
    saveActivityToLocalStorage: function(userId, activityData) {
        try {
            const storedActivities = localStorage.getItem(`user-activities-${userId}`);
            const activities = storedActivities ? JSON.parse(storedActivities) : [];
            
            // Aktiviteyi ekle ve en fazla 10 aktivite sakla
            activities.unshift(activityData);
            if (activities.length > 10) activities.pop();
            
            localStorage.setItem(`user-activities-${userId}`, JSON.stringify(activities));
            console.log("Aktivite localStorage'a kaydedildi");
        } catch (error) {
            console.error("Aktivite localStorage'a kaydedilirken hata:", error);
        }
    },
    
    // Aktivite tipi i�in uygun ikon s�n�f�
    getActivityIcon: function(type) {
        switch(type) {
            case 'game': return 'fas fa-gamepad';
            case 'badge': return 'fas fa-award';
            case 'task': return 'fas fa-tasks';
            case 'level': return 'fas fa-level-up-alt';
            case 'purchase': return 'fas fa-shopping-cart';
            case 'achievement': return 'fas fa-trophy';
            default: return 'fas fa-history';
        }
    },
    
    // Aktiviteyi HTML olarak render et
    renderActivity: function(activity, container) {
        const activityTime = activity.timestamp ? this.getTimeAgo(activity.timestamp) : activity.time;
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';
        activityElement.innerHTML = `
            <div class="activity-icon"><i class="${activity.icon}"></i></div>
            <div class="activity-details">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activityTime}</div>
            </div>
            ${activity.score ? `<div class="activity-score">Skor: ${activity.score}</div>` : ''}
        `;
        container.appendChild(activityElement);
    },
    
    // Ge�en zaman� belirtilen format� �evir (1 saat �nce, 2 g�n �nce vb.)
    getTimeAgo: function(timestamp) {
        const now = new Date();
        const activityTime = timestamp instanceof Date ? timestamp : new Date(timestamp);
        const diffMs = now - activityTime;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffDay > 30) {
            return activityTime.toLocaleDateString('tr-TR');
        } else if (diffDay > 0) {
            return `${diffDay} g�n �nce`;
        } else if (diffHour > 0) {
            return `${diffHour} saat �nce`;
        } else if (diffMin > 0) {
            return `${diffMin} dakika �nce`;
        } else {
            return 'Az �nce';
        }
    },
    
    // �rnek aktiviteleri g�ster - veri yoksa
    generateSampleActivities: function(activitiesList) {
        activitiesList.innerHTML = '';
        
        // Rastgele kategori se�
        const categories = ['Genel K�lt�r', 'Tarih', 'Bilim', 'Spor', 'Sanat', 'Co�rafya'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        // �rnek aktiviteler
        const sampleActivities = [
            {
                icon: 'fas fa-gamepad',
                title: `${randomCategory} kategorisinde bir oyun oynand�`,
                time: '2 saat �nce',
                score: Math.floor(Math.random() * 100)
            },
            {
                icon: 'fas fa-award',
                title: '"Bilgi Ustas�" rozeti kazan�ld�',
                time: '1 g�n �nce',
                score: null
            },
            {
                icon: 'fas fa-tasks',
                title: 'G�nl�k g�rev tamamland�',
                time: '2 g�n �nce',
                score: null
            }
        ];
        
        // �rnek aktiviteleri render et
        sampleActivities.forEach(activity => {
            this.renderActivity(activity, activitiesList);
        });
    },
    
    // Profil d�zenleme modal�n� g�ster
    showEditProfileModal: function() {
        // Modal olu�tur
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'edit-profile-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> Profili D�zenle</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="edit-display-name">G�r�nen Ad:</label>
                        <input type="text" id="edit-display-name" placeholder="Ad�n�z� girin">
                    </div>
                    <div class="form-group">
                        <label for="edit-bio">Hakk�mda:</label>
                        <textarea id="edit-bio" placeholder="Kendiniz hakk�nda k�sa bilgi..." rows="3"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="this.closest('.modal').remove()">�ptal</button>
                        <button class="btn-primary" onclick="quizApp.saveProfileChanges()">Kaydet</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Mevcut verileri doldur
        const displayNameInput = document.getElementById('edit-display-name');
        const bioInput = document.getElementById('edit-bio');
        
        if (firebase.auth && firebase.auth().currentUser) {
            const user = firebase.auth().currentUser;
            if (displayNameInput && user.displayName) {
                displayNameInput.value = user.displayName;
            }
                            } else {
            // Firebase yoksa localStorage'dan al
            const userId = this.getCurrentUserId();
            try {
                const profileData = localStorage.getItem(`user-profile-${userId}`);
                if (profileData) {
                    const profile = JSON.parse(profileData);
                    if (displayNameInput && profile.displayName) {
                        displayNameInput.value = profile.displayName;
                    }
                    if (bioInput && profile.bio) {
                        bioInput.value = profile.bio;
                            }
                        } else {
                    // Varsay�lan kullan�c� ad�n� g�ster
                    const currentName = document.getElementById('profile-name')?.textContent;
                    if (displayNameInput && currentName) {
                        displayNameInput.value = currentName;
                    }
                }
            } catch (error) {
                console.error('Profil verileri y�klenemedi:', error);
            }
        }
        
        // Modal g�ster
        setTimeout(() => modal.classList.add('show'), 10);
    },
    
    // Profil de�i�ikliklerini kaydet
    saveProfileChanges: function() {
        const displayName = document.getElementById('edit-display-name').value.trim();
        const bio = document.getElementById('edit-bio').value.trim();
        
        if (!displayName) {
            this.showToast('G�r�nen ad bo� olamaz', 'toast-error');
            return;
        }
        
        // Firebase kullan�c�s� varsa
        if (firebase.auth && firebase.auth().currentUser) {
            const user = firebase.auth().currentUser;
            
            // Firebase Authentication'da displayName g�ncelle
            user.updateProfile({
                displayName: displayName
            }).then(() => {
                // Firestore'da da g�ncelle (varsa)
                if (firebase.firestore) {
                    const db = firebase.firestore();
                    db.collection('users').doc(user.uid).update({
                        displayName: displayName,
                        bio: bio,
                        lastUpdated: new Date()
                    }).catch(error => {
                        console.error('Firestore g�ncelleme hatas�:', error);
                    });
                }
                
                this.updateProfileUI(displayName, bio);
                this.showToast('Profil ba�ar�yla g�ncellendi', 'toast-success');
            }).catch(error => {
                console.error('Profil g�ncelleme hatas�:', error);
                this.showToast('Profil g�ncellenirken hata olu�tu', 'toast-error');
                });
        } else {
            // Firebase yoksa localStorage'a kaydet
            const userId = this.getCurrentUserId();
            const profileData = {
                displayName: displayName,
                bio: bio,
                lastUpdated: new Date().toISOString()
            };
            
            try {
                localStorage.setItem(`user-profile-${userId}`, JSON.stringify(profileData));
                this.updateProfileUI(displayName, bio);
                this.showToast('Profil ba�ar�yla g�ncellendi', 'toast-success');
            } catch (error) {
                console.error('Profil localStorage\'a kaydedilemedi:', error);
                this.showToast('Profil kaydedilemedi', 'toast-error');
            }
        }
    },

    // Profil UI'sini g�ncelle
    updateProfileUI: function(displayName, bio) {
        // Profil sayfas�ndaki bilgileri g�ncelle
        const profileName = document.getElementById('profile-name');
        if (profileName) {
            profileName.textContent = displayName;
        }
        
        // Bio varsa g�ster (hen�z UI'da yer yoksa eklenecek)
        const profileBio = document.getElementById('profile-bio');
        if (profileBio) {
            profileBio.textContent = bio;
        }
        
        // Modal kapat
        const modal = document.getElementById('edit-profile-modal');
        if (modal) modal.remove();
        
        // Profil sayfas�n� yenile
        this.loadProfileData();
    },

    // Zaman fark� hesaplama yard�mc� fonksiyonu
    calculateTimeAgo: function(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (minutes < 60) {
            return minutes <= 1 ? '1 dakika �nce' : `${minutes} dakika �nce`;
        } else if (hours < 24) {
            return hours === 1 ? '1 saat �nce' : `${hours} saat �nce`;
        } else {
            return days === 1 ? '1 g�n �nce' : `${days} g�n �nce`;
        }
    },

    // T�m y�ksek skorlar� al (localStorage'dan)
    getAllHighScores: function() {
        try {
            const scores = localStorage.getItem('quiz-high-scores');
            return scores ? JSON.parse(scores) : [];
        } catch (error) {
            console.error('Skorlar okunurken hata:', error);
            return [];
        }
    },

    // Rozet sistemi
    badgeSystem: {
        // Mevcut rozetler tan�mlar�
        badges: {
            firstGame: {
                id: 'firstGame',
                name: '�lk Oyun',
                description: '�lk oyununu tamamlad�n!',
                icon: 'fas fa-play',
                condition: (stats) => stats.totalGames >= 1
            },
            perfectScore: {
                id: 'perfectScore',
                name: 'M�kemmel',
                description: 'Bir oyunda t�m sorular� do�ru cevaplad�n!',
                icon: 'fas fa-star',
                condition: (stats) => stats.perfectGames >= 1
            },
            speedster: {
                id: 'speedster',
                name: 'H�z Ustas�',
                description: '10 saniyede alt�nda cevap verdin!',
                icon: 'fas fa-bolt',
                condition: (stats) => stats.fastAnswers >= 5
            },
            scholar: {
                id: 'scholar',
                name: 'Bilgi Ustas�',
                description: '50 soruyu do�ru cevaplad�n!',
                icon: 'fas fa-graduation-cap',
                condition: (stats) => stats.correctAnswers >= 50
            },
            dedicated: {
                id: 'dedicated',
                name: 'Azimli',
                description: '10 oyun tamamlad�n!',
                icon: 'fas fa-trophy',
                condition: (stats) => stats.totalGames >= 10
            },
            genius: {
                id: 'genius',
                name: 'Deha',
                description: '%90 �zeri do�ruluk oran�na sahipsin!',
                icon: 'fas fa-brain',
                condition: (stats) => stats.totalQuestions > 20 && (stats.correctAnswers / stats.totalQuestions) >= 0.9
            },
            explorer: {
                id: 'explorer',
                name: 'Ka�if',
                description: '5 farkl� kategoride oyun oynad�n!',
                icon: 'fas fa-compass',
                condition: (stats) => stats.categoriesPlayed >= 5
            }
        },

        // Kullan�c�n�n rozetlerini kontrol et ve yeni rozetler ver
        checkAndAwardBadges: function(userId, currentStats) {
            if (!userId) return;

            const userBadges = this.getUserBadges(userId);
            const newBadges = [];

            Object.values(this.badges).forEach(badge => {
                // E�er kullan�c� bu rozeti hen�z kazanmad�ysa ve �artlar� sa�l�yorsa
                if (!userBadges[badge.id] && badge.condition(currentStats)) {
                    this.awardBadge(userId, badge);
                    newBadges.push(badge);
                }
            });

            // Yeni rozet kazan�ld�ysa bildir
            if (newBadges.length > 0) {
                this.showBadgeNotification(newBadges);
            }

            return newBadges;
        },

        // Kullan�c�n�n mevcut rozetlerini al
        getUserBadges: function(userId) {
            try {
                const badges = localStorage.getItem(`user-badges-${userId}`);
                return badges ? JSON.parse(badges) : {};
            } catch (error) {
                console.error('Rozetler okunurken hata:', error);
                return {};
            }
        },

        // Rozet ver
        awardBadge: function(userId, badge) {
            const userBadges = this.getUserBadges(userId);
            const badgeData = {
                ...badge,
                earnedDate: new Date().toISOString()
            };
            
            userBadges[badge.id] = badgeData;

            try {
                // LocalStorage'a kaydet
                localStorage.setItem(`user-badges-${userId}`, JSON.stringify(userBadges));
                
                // Firestore'a kaydet (varsa)
                if (firebase.firestore) {
                    const db = firebase.firestore();
                    db.collection('users').doc(userId).set({
                        badges: userBadges,
                        lastUpdated: new Date()
                    }, { merge: true }).catch(error => {
                        console.error('Rozet Firestore\'a kaydedilemedi:', error);
                    });
                }
                
                // Firebase Realtime Database'e de kaydet (geriye uyumluluk)
                if (firebase.database) {
                    firebase.database().ref(`users/${userId}/badges/${badge.id}`).set(badgeData).catch(error => {
                        console.error('Rozet Firebase Realtime\'a kaydedilemedi:', error);
                    });
                }
            } catch (error) {
                console.error('Rozet kaydedilemedi:', error);
            }
        },

        // Rozet bildirimi g�ster
        showBadgeNotification: function(newBadges) {
            newBadges.forEach(badge => {
                quizApp.showToast(`?? Yeni rozet kazand�n�z: ${badge.name}!`, 'toast-success');
            });
        }
    },
    
    // Rozet gereksinimleri i�in a��klama metni olu�tur
    getBadgeRequirementText: function(badge) {
        let text = "";
        
        switch(badge.id) {
            case 'perfectScore':
                text = "Bir kategoride %100 do�ru cevap vererek m�kemmel skor elde etmek.";
                break;
            case 'genius':
                text = "Arka arkaya 10 soruyu do�ru cevaplamak.";
                break;
            case 'explorer':
                text = "5 farkl� kategoride en az 5'er soru ��zmek.";
                break;
            case 'dedicated':
                text = "Toplam 100 soru ��zmek.";
                break;
            case 'speedster':
                text = "10 soruyu ortalama 5 saniyeden k�sa s�rede cevaplamak.";
                break;
            case 'scholar':
                text = "T�m kategorilerde en az %70 ba�ar� oran� elde etmek.";
                break;
            default:
                text = "Bu rozeti kazanmak i�in gerekli ko�ullar� sa�lamak.";
        }
        
        return text;
    },
    
    // Zaman fark�n� hesapla (ne kadar zaman �nce)
    calculateTimeAgo: function(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        // Zaman fark�n� insan dostu formata �evir
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return days === 1 ? '1 g�n �nce' : `${days} g�n �nce`;
        } else if (hours > 0) {
            return hours === 1 ? '1 saat �nce' : `${hours} saat �nce`;
        } else if (minutes > 0) {
            return minutes === 1 ? '1 dakika �nce' : `${minutes} dakika �nce`;
        } else {
            return seconds <= 5 ? 'Az �nce' : `${seconds} saniye �nce`;
        }
    },
    
    // Lider tablosunu g�ster
    showGlobalLeaderboard: function() {
        // Ana i�erikleri gizle
        if (this.quizElement) this.quizElement.style.display = 'none';
        if (this.resultElement) this.resultElement.style.display = 'none';
        if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'none';
        
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.style.display = 'none';
        
        const onlineGameOptions = document.getElementById('online-game-options');
        if (onlineGameOptions) onlineGameOptions.style.display = 'none';
        
        const profilePage = document.getElementById('profile-page');
        if (profilePage) profilePage.style.display = 'none';
        
        // Di�er sayfalar� da gizle
        const friendsPage = document.getElementById('friends-page');
        if (friendsPage) friendsPage.style.display = 'none';
        
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) adminPanel.style.display = 'none';
        
        const winnerScreen = document.getElementById('winner-screen');
        if (winnerScreen) winnerScreen.style.display = 'none';
        
        // Lider tablosunu g�r�nt�le
        const globalLeaderboard = document.getElementById('global-leaderboard');
        if (globalLeaderboard) {
            globalLeaderboard.style.display = 'block';
            
            // Lider tablosu verilerini y�kle
            this.loadLeaderboardData();
        }
    },
    
    // Lider tablosu verilerini y�kle
    loadLeaderboardData: function() {
        const leaderboardList = document.getElementById('leaderboard-list');
        if (!leaderboardList) return;
        
        // Y�kleniyor mesaj� g�ster
        leaderboardList.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Lider tablosu y�kleniyor...</p></div>';
        
        // Firebase'den verileri �ek
        if (firebase.database) {
            const leaderboardRef = firebase.database().ref('leaderboard');
            const categoryFilter = document.getElementById('leaderboard-category').value;
            const timeFilter = document.getElementById('leaderboard-time').value;
            
            leaderboardRef.orderByChild('score').limitToLast(50).once('value')
                .then(snapshot => {
                    const data = snapshot.val();
                    if (!data) {
                        leaderboardList.innerHTML = '<div class="no-data-message">Hen�z kay�t yok</div>';
                        return;
                    }
                    
                    // Verileri skor s�ras�na g�re diziye �evir
                    const leaderboardArray = [];
                    Object.keys(data).forEach(key => {
                        leaderboardArray.push({
                            id: key,
                            ...data[key]
                        });
                    });
                    
                    // Skora g�re s�rala (azalan)
                    leaderboardArray.sort((a, b) => b.score - a.score);
                    
                    // Tabloya ekle
                    leaderboardList.innerHTML = '';
                    const table = document.createElement('table');
                    table.className = 'leaderboard-table';
                    
                    // Tablo ba�l���
                    const thead = document.createElement('thead');
                    thead.innerHTML = `
                        <tr>
                            <th>S�ra</th>
                            <th>Kullan�c�</th>
                            <th>Skor</th>
                            <th>Kategori</th>
                            <th>Tarih</th>
                        </tr>
                    `;
                    table.appendChild(thead);
                    
                    // Tablo i�eri�i
                    const tbody = document.createElement('tbody');
                    leaderboardArray.forEach((item, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${item.userName || 'Anonim'}</td>
                            <td>${item.score || 0}</td>
                            <td>${item.category || 'Genel'}</td>
                            <td>${new Date(item.date || Date.now()).toLocaleDateString()}</td>
                        `;
                        tbody.appendChild(row);
                    });
                    table.appendChild(tbody);
                    
                    leaderboardList.appendChild(table);
                })
                .catch(error => {
                    console.error("Lider tablosu y�klenirken hata:", error);
                    leaderboardList.innerHTML = '<div class="error-message">Lider tablosu y�klenemedi</div>';
                });
        } else {
            // Firebase yoksa demo veri g�ster
            leaderboardList.innerHTML = `
                <div class="demo-data-message">
                    <p>Demo verileri g�steriliyor (Firebase ba�lant�s� yok)</p>
                    <table class="leaderboard-table">
                        <thead>
                            <tr>
                                <th>S�ra</th>
                                <th>Kullan�c�</th>
                                <th>Skor</th>
                                <th>Kategori</th>
                                <th>Tarih</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>1</td><td>Oyuncu123</td><td>95</td><td>Genel K�lt�r</td><td>01.05.2025</td></tr>
                            <tr><td>2</td><td>BilgiKral�</td><td>87</td><td>Bilim</td><td>30.04.2025</td></tr>
                            <tr><td>3</td><td>QuizMaster</td><td>82</td><td>Tarih</td><td>29.04.2025</td></tr>
                        </tbody>
                    </table>
                </div>
            `;
        }
    },
    
    // updateTimer fonksiyonunu g�ncelle
    updateTimer: function() {
        this.timeLeft--;
        
        // Zaman� g�ster
        this.updateTimeDisplay();
        
        // S�re bitti mi?
        if (this.timeLeft <= 0) {
            clearInterval(this.timerInterval);
            this.handleTimeUp();
        }
    },
    
    // Cevab� kaydet - b�l�m istatistiklerini takip etmek i�in
    recordAnswer: function(isCorrect) {
        // Mevcut b�l�m numaras� (0-tabanl�)
        const sectionIndex = Math.floor(this.currentQuestionIndex / 5);
        
        console.log(`Cevap kaydediliyor: Soru: ${this.currentQuestionIndex+1}, B�l�m: ${sectionIndex+1}, Do�ru mu: ${isCorrect}`);
        
        // E�er bu b�l�m i�in hen�z istatistik olu�turulmad�ysa, yeni olu�tur
        if (!this.sectionStats[sectionIndex]) {
            this.sectionStats[sectionIndex] = { correct: 0, total: 0 };
        }
        
        // Toplam cevap say�s�n� art�r
        this.sectionStats[sectionIndex].total++;
        
        // Do�ru ise do�ru cevap say�s�n� art�r
        if (isCorrect) {
            this.sectionStats[sectionIndex].correct++;
        }
        
        console.log(`B�l�m ${sectionIndex+1} istatistikleri g�ncellendi: Do�ru: ${this.sectionStats[sectionIndex].correct}, Toplam: ${this.sectionStats[sectionIndex].total}`);
        console.log('T�m b�l�m istatistikleri:', JSON.stringify(this.sectionStats));
    },
    
    // S�re doldu�unda yap�lacaklar
    handleTimeUp: function() {
        this.stopTimer();
        this.timeLeftElement.textContent = "S�re Bitti!";
        const optionButtons = this.optionsElement.querySelectorAll('.option');
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const questionTime = currentQuestion.category === "Bo�luk Doldurma" ? 
            this.TIME_PER_BLANK_FILLING_QUESTION : this.TIME_PER_QUESTION;
        this.answerTimes.push(questionTime); // Max s�re
        this.answeredQuestions++;
        this.recordAnswer(false);
        optionButtons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === currentQuestion.correctAnswer) {
                btn.classList.add('correct');
            }
        });
        if (this.skipJokerActive) {
            this.skipJokerActive = false;
            // Pas jokeri kullan�ld�ysa can eksilmesin, modal ��kmas�n, direkt sonraki soruya ge�
            setTimeout(() => {
                this.showNextQuestion();
            }, 800);
            return;
        } else {
            this.loseLife();
            this.updateScoreDisplay();
            // TAM EKRAN MODAL
            const timeoutModal = document.createElement('div');
            timeoutModal.className = 'timeout-modal';
            timeoutModal.innerHTML = `
                <div class="timeout-modal-content">
                    <div class="timeout-modal-icon">
                        <i class="fas fa-hourglass-end"></i>
                    </div>
                    <div class="timeout-modal-text">S�re Doldu!</div>
                    <div class="timeout-modal-correct">Do�ru cevap: <strong>${currentQuestion.correctAnswer}</strong></div>
                    <button id="next-question" class="next-button">${this.getTranslation('next')}</button>
                </div>
            `;
            document.body.appendChild(timeoutModal);
            timeoutModal.querySelector('#next-question').onclick = () => {
                timeoutModal.remove();
                this.showNextQuestion();
            };
            timeoutModal.onclick = (e) => {
                if (e.target === timeoutModal) {
                    timeoutModal.remove();
                    this.showNextQuestion();
                }
            };
            if (this.resultElement) {
                this.resultElement.style.display = 'none';
                this.resultElement.innerHTML = '';
                this.resultElement.className = 'result';
            }
            if (this.soundEnabled) {
                const wrongSound = document.getElementById('sound-wrong');
                if (wrongSound) wrongSound.play().catch(e => {});
            }
            if (typeof onlineGame !== 'undefined' && onlineGame && onlineGame.gameStarted) {
                onlineGame.submitAnswer(false);
            }
        }
        // Can kontrol� kald�r�ld� - loseLife fonksiyonu kendi ba��na can sat�n alma modal�n� handle ediyor
        
        if (this.nextButton) {
            this.nextButton.style.display = 'block';
        } else {
            setTimeout(() => {
                this.showNextQuestion();
            }, 2000);
        }
    },
    
    // Canlar bitti�inde oyun sonucunu g�sterecek fonksiyonlar
    
    handleAnswerClick: function(button) {
        // Zamanlay�c�y� durdur
        this.stopTimer();
        
        // Sonu� elementini temizle
        if (this.resultElement) {
            this.resultElement.textContent = '';
            this.resultElement.style.display = 'none';
        }
        
        // T�klanan butonu se�
        const selectedOption = button.textContent;
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        // Cevapland���n� belirt ve istatistiklere ekle
        const timeSpent = this.TIME_PER_QUESTION - this.timeLeft;
        this.answerTimes.push(timeSpent);
        this.answeredQuestions++;
        
        // T�m ��klar� devre d��� b�rak
        const optionButtons = this.optionsElement.querySelectorAll('.option');
        optionButtons.forEach(btn => btn.disabled = true);
        
        // Do�ru/yanl�� kontrol�
        if (selectedOption === currentQuestion.correctAnswer) {
            button.classList.add('correct');
            
            // Skoru g�ncelle
            this.score++;
            // this.correctAnswers++; // <-- KALDIRILDI: Tekrar eden kod
            this.updateScoreDisplay();
            
            // Seviye ilerleme kontrol�
            this.levelProgress++;
            
            // Do�ru cevap ses efekti
            this.playSound(this.soundCorrect);
            
            // �evrimi�i oyunda skoru g�ncelle
            if (onlineGame && onlineGame.gameStarted) {
                onlineGame.submitAnswer(true);
            }
        } else {
            button.classList.add('wrong');
            
            // Do�ru cevab� g�ster
            optionButtons.forEach(button => {
                if (button.textContent === currentQuestion.correctAnswer) {
                    button.classList.add('correct');
                }
            });
            
            this.playSound(this.soundWrong);
            
            // Can� azalt
            this.loseLife();
            
            // �evrimi�i oyunda skoru g�ncelle
            if (onlineGame && onlineGame.gameStarted) {
                onlineGame.submitAnswer(false);
            }
            
            // Can kontrol� kald�r�ld� - loseLife fonksiyonu kendi ba��na can sat�n alma modal�n� handle ediyor
        }
        
        // Bir sonraki soruya ge�
        setTimeout(() => {
            // Son soru ise sonu� ekran�n� g�ster
            if (this.currentQuestionIndex >= this.questions.length - 1) {
                this.showResult();
            } else {
                this.currentQuestionIndex++;
                this.loadQuestion();
            }
        }, 1500);
    },
    
    // Bo�luk doldurma sorular� i�in
    handleBlankFillingCorrectAnswer: function() {
        this.stopTimer();
        this.disableBlankFillingControls();
        // Tam ekran do�ru modal�
        const correctModal = document.createElement('div');
        correctModal.className = 'correct-modal';
        correctModal.innerHTML = `
            <div class="correct-modal-content">
                <div class="correct-modal-icon"><i class="fas fa-crown"></i></div>
                <div class="correct-modal-text">${this.getTranslation('correct')}</div>
                <div class="correct-modal-score">+${Math.max(1, Math.ceil(this.timeLeft / 5))}</div>
                <button id="next-question" class="next-button">${this.getTranslation('next')}</button>
            </div>
        `;
        document.body.appendChild(correctModal);
        correctModal.querySelector('#next-question').onclick = () => {
            correctModal.remove();
            this.showNextQuestion();
        };
        correctModal.onclick = (e) => {
            if (e.target === correctModal) correctModal.remove();
        };
        // Skor ve istatistikler
        const timeSpent = this.TIME_PER_BLANK_FILLING_QUESTION - this.timeLeft;
        this.answerTimes.push(timeSpent);
        this.answeredQuestions++;
        const scoreForQuestion = Math.max(1, Math.ceil(this.timeLeft / 5));
        this.addScore(scoreForQuestion);
        this.recordAnswer(true);
        // this.correctAnswers++; // <-- KALDIRILDI: Tekrar eden kod, zaten checkBlankFillingAnswer i�inde say�l�yor
        if (this.soundEnabled) {
            const correctSound = document.getElementById('sound-correct');
            if (correctSound) correctSound.play().catch(e => {});
        }
        if (typeof onlineGame !== 'undefined' && onlineGame && onlineGame.gameStarted) {
            onlineGame.submitAnswer(true);
        }
    },
    handleBlankFillingWrongAnswer: function() {
        this.stopTimer();
        this.disableBlankFillingControls();
        // Tam ekran yanl�� modal�
        this.loseLife();
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const wrongModal = document.createElement('div');
        wrongModal.className = 'wrong-modal';
        wrongModal.innerHTML = `
            <div class="wrong-modal-content">
                <div class="wrong-modal-icon"><i class="fas fa-times-circle"></i></div>
                <div class="wrong-modal-text">${this.getTranslation('wrong')}</div>
                <div class="wrong-modal-correct">${this.getTranslation('correctAnswer')}: <strong>${currentQuestion.correctAnswer}</strong></div>
                <button id="next-question" class="next-button">${this.getTranslation('next')}</button>
            </div>
        `;
        document.body.appendChild(wrongModal);
        wrongModal.querySelector('#next-question').onclick = () => {
            wrongModal.remove();
            this.showNextQuestion();
        };
        wrongModal.onclick = (e) => {
            if (e.target === wrongModal) wrongModal.remove();
        };
        // Skor ve istatistikler
        const timeSpent = this.TIME_PER_BLANK_FILLING_QUESTION - this.timeLeft;
        this.answerTimes.push(timeSpent);
        this.answeredQuestions++;
        
        // Cevabı kaydet - İSTATİSTİKLER İÇİN ÖNEMLİ!
        this.recordAnswer(false);
        
        if (this.soundEnabled) {
            const wrongSound = document.getElementById('sound-wrong');
            if (wrongSound) wrongSound.play().catch(e => {});
        }
        if (typeof onlineGame !== 'undefined' && onlineGame && onlineGame.gameStarted) {
            onlineGame.submitAnswer(false);
        }
        // Can kontrol� kald�r�ld� - loseLife fonksiyonu kendi ba��na can sat�n alma modal�n� handle ediyor
    },
    
    // Load question i�levini g�ncelle
    loadQuestion: function() {
        console.log('loadQuestion �a�r�ld�, soru indeksi:', this.currentQuestionIndex);
        
        try {
            // �nce �nceki sorunun kal�nt�lar�n� temizle
            this.cleanupPreviousQuestion();
            
            // "Do�ru!" yaz�s�n�n oldu�u elementi varsa gizle
            const correctMessageElement = document.querySelector('.correct-answer-container');
            if (correctMessageElement) {
                correctMessageElement.remove();
            }
            
            // Can kontrol� kald�r�ld� - canlar bittiyse loseLife fonksiyonu zaten can sat�n alma modal�n� a��yor
            
            // Mevcut soru indeksi kontrol�
            if (this.currentQuestionIndex >= this.questions.length) {
                console.log("T�m sorular tamamland�, kategori tamamlama ekran� g�steriliyor...");
                this.showCategoryCompletion();
                return;
            }
            
            const currentQuestion = this.questions[this.currentQuestionIndex];
            console.log('Y�klenen soru:', currentQuestion);
            
            // �oklu oyun i�in extra kontroller
            const isOnlineGame = typeof onlineGame !== 'undefined' && onlineGame && onlineGame.gameStarted;
            
            // Zamanlay�c� elementini kontrol et ve olu�tur
            let timerElement = document.getElementById('timer');
            if (!timerElement) {
                console.log('Timer elementi bulunamad�, olu�turuluyor...');
                timerElement = document.createElement('div');
                timerElement.id = 'timer';
                timerElement.className = 'timer';
                timerElement.innerHTML = `
                    <div class="timer-bar">
                        <div class="timer-progress" style="width: 100%;"></div>
                    </div>
                    <div class="timer-text">${this.TIME_PER_QUESTION}</div>
                `;
                
                // Quiz container'a ekle
                const quizContainer = document.getElementById('quiz-container');
                if (quizContainer) {
                    // E�er question-container varsa onun �st�ne ekle
                    const questionContainer = quizContainer.querySelector('.question-container');
                    if (questionContainer) {
                        quizContainer.insertBefore(timerElement, questionContainer);
                    } else {
                        quizContainer.appendChild(timerElement);
                    }
                }
            } else {
                // Zamanlay�c�y� g�r�n�r yap ve s�f�rla
                timerElement.style.display = 'block';
                
                // Zamanlay�c� i�indeki ilerleme �ubu�unu s�f�rla
                const progressBar = timerElement.querySelector('.timer-progress');
                if (progressBar) {
                    progressBar.style.width = '100%';
                }
                
                // Zamanlay�c� metnini g�ncelleyelim
                const timerText = timerElement.querySelector('.timer-text');
                if (timerText) {
                    timerText.textContent = this.TIME_PER_QUESTION;
                }
            }
            
            // Sonu� elementini kontrol et ve olu�tur
            let resultElement = document.getElementById('result');
            if (!resultElement) {
                console.log('Result elementi bulunamad�, olu�turuluyor...');
                resultElement = document.createElement('div');
                resultElement.id = 'result';
                resultElement.className = 'result';
                resultElement.style.display = 'none';
                
                // Quiz container'a ekle
                const optionsContainer = document.querySelector('.options-container');
                if (optionsContainer) {
                    optionsContainer.parentNode.insertBefore(resultElement, optionsContainer.nextSibling);
                } else {
                    const quizContainer = document.getElementById('quiz-container');
                    if (quizContainer) {
                        quizContainer.appendChild(resultElement);
                    }
                }
            } else {
                resultElement.innerHTML = '';
                resultElement.className = 'result';
                resultElement.style.display = 'none';
            }
            
            // Soru tipine g�re y�kleme i�lemini yap
            if (currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse") {
                this.loadTrueFalseQuestion(currentQuestion);
            } else if (currentQuestion.type === "BlankFilling") {
                this.loadBlankFillingQuestion(currentQuestion);
            } else {
                this.displayQuestion(currentQuestion);
            }
            
            // Zamanlay�c�y� ba�lat
            this.startTimer();
            
            // �oklu oyun i�in extra gecikme ile y�kleme kontrol�
            if (isOnlineGame) {
                // �nce t�m elementlerin g�r�n�rl���n� kontrol et
                setTimeout(() => {
                    console.log('�oklu oyun i�in soru g�r�n�rl��� kontrol ediliyor');
                    
                    // Soru i�eri�ini kontrol et ve yeniden y�kle
                    if (this.questionElement && (!this.questionElement.textContent || this.questionElement.textContent === '')) {
                        console.log('Soru metni eksik, yeniden y�kleniyor:', currentQuestion.question);
                        this.questionElement.textContent = currentQuestion.question;
                    }
                    
                    // ��klar� kontrol et
                    if (this.optionsElement && this.optionsElement.children.length === 0) {
                        console.log('��klar eksik, yeniden y�kleniyor');
                        this.displayOptions(currentQuestion.options || []);
                    }
                    
                    // Zamanlay�c�y� kontrol et ve yeniden ba�lat
                    if (this.timeLeft <= 0 || !this.timerInterval) {
                        console.log('Zamanlay�c� yeniden ba�lat�l�yor');
                        this.startTimer();
                    }
                }, 300);
            }
        } catch (error) {
            console.error('Soru y�kleme hatas�:', error);
        }
    },
    
    // Timer elementini olu�tur
    createTimerElement: function() {
        console.log('Timer elementi olu�turuluyor...');
        const timerElement = document.createElement('div');
        timerElement.id = 'timer';
        timerElement.className = 'timer';
        timerElement.innerHTML = `
            <div class="timer-bar">
                <div class="timer-progress"></div>
            </div>
            <div class="timer-text">${this.TIME_PER_QUESTION}</div>
        `;
        
        // Quiz container'a ekle
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            // E�er question-container varsa onun �st�ne ekle
            const questionContainer = quizContainer.querySelector('.question-container');
            if (questionContainer) {
                quizContainer.insertBefore(timerElement, questionContainer);
            } else {
                quizContainer.appendChild(timerElement);
            }
            console.log('Timer elementi ba�ar�yla olu�turuldu');
        } else {
            console.error('Quiz container bulunamad�!');
        }
    },
    
    // Result elementini olu�tur
    createResultElement: function() {
        console.log('Result elementi olu�turuluyor...');
        const resultElement = document.createElement('div');
        resultElement.id = 'result';
        resultElement.className = 'result';
        resultElement.style.display = 'none';
        
        // Quiz container'a ekle
        const optionsContainer = document.querySelector('.options-container');
        if (optionsContainer) {
            optionsContainer.parentNode.insertBefore(resultElement, optionsContainer.nextSibling);
            console.log('Result elementi ba�ar�yla olu�turuldu');
        } else {
            const quizContainer = document.getElementById('quiz-container');
            if (quizContainer) {
                quizContainer.appendChild(resultElement);
                console.log('Result elementi quiz container\'a eklendi');
            } else {
                console.error('Quiz container bulunamad�!');
            }
        }
    },
    
    // showResult g�ncelleme
    showResult: function() {
        // Zamanlay�c�y� durdur
        this.stopTimer();
        
        // Quiz modunu deaktifle�tir
        this.deactivateQuizMode();
        
        // Debug: Oyun sonu de�erlerini logla
        console.log("=== OYUN SONU DEBUG ===");
        console.log("currentQuestionIndex:", this.currentQuestionIndex);
        console.log("answeredQuestions:", this.answeredQuestions);
        console.log("correctAnswers:", this.correctAnswers);
        console.log("score:", this.score);
        console.log("lives:", this.lives);
        console.log("answerTimes length:", this.answerTimes.length);
        
        // F�NAL SKORU ve istatistikleri saklayal�m
        const finalStats = {
            category: this.selectedCategory,
            score: this.score,
            correctAnswers: this.correctAnswers, // <-- EKLEND�
            totalQuestions: this.questions.length, // <-- D�ZELT�LD�: Oyunun toplam soru say�s�
            lives: this.lives,
            avgTime: this.answerTimes.length > 0 ? 
                (this.answerTimes.reduce((a, b) => a + b, 0) / this.answerTimes.length).toFixed(1) : 0
        };
        
        console.log("finalStats:", finalStats);
        console.log("======================");
        
        // Oyun istatistiklerini kaydet
        this.saveGameStatistics();
        this.addNewHighScore(finalStats.category, finalStats.score, finalStats.totalQuestions);
        
        // PUANLARI KULLANICI HESABINA KAYDET
        if (this.isLoggedIn) {
            this.totalScore += this.score;
            this.sessionScore += this.score;
            this.levelProgress += this.score;
            
            // Seviye kontrol� yap
            this.checkLevelUp();
            
            // Kullan�c� verilerini Firebase'e kaydet
            this.saveUserData();
            
            console.log(`Oyun sonu: ${this.score} puan hesaba eklendi. Toplam puan: ${this.totalScore}`);
        } else {
            // Giri� yapmam�� kullan�c�lar i�in session score'u kaydet
            this.sessionScore += this.score;
            this.saveScoreToLocalStorage();
            
            console.log(`Oyun sonu (misafir): ${this.score} puan session'a eklendi. Session toplam: ${this.sessionScore}`);
        }
        
        try {
            // TAM SAYFA SONU� EKRANI ���N SAYFAYI TEM�ZLE
            // Body i�eri�ini tamamen siliyoruz!
            // OVERLAY SONUÇ EKRANI (GÜVENLİ YAKLAŞIM)
            // Body içeriğini silmek yerine overlay kullanıyoruz
            
            // Mevcut overlay'i temizle
            const existingOverlay = document.getElementById('fullscreen-result-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }
            
            // OVERLAY CONTAINER
            const resultScreen = document.createElement('div');
            resultScreen.id = 'fullscreen-result-overlay';
            resultScreen.className = 'result-overlay';
            
            // Overlay CSS Stilleri
            resultScreen.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, #4a148c, #e91e63);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                padding: 20px;
                font-family: 'Poppins', sans-serif;
                color: white;
                box-sizing: border-box;
                text-align: center;
                overflow-y: auto;
            `;
            
            // Dil se�imine g�re ba�l�k ve sonu� metinleri
            const appName = languages[this.currentLanguage].quizAppName;
            const resultText = languages[this.currentLanguage].resultTitle;
            
            // Ba�l�k
            const header = document.createElement('div');
            header.className = 'result-header';
            header.innerHTML = `
                <h1 style="font-size: 2rem; margin-bottom: 5px; color: white;">${appName}</h1>
                <h2 style="font-size: 1.5rem; margin-top: 0; color: white;"><i class="fas fa-trophy"></i> ${resultText}</h2>
            `;
            
            // Sonu� kart�
            const resultCard = document.createElement('div');
            resultCard.className = 'result-card';
            resultCard.style.cssText = `
                background-color: rgba(255, 255, 255, 0.95);
                border-radius: 15px;
                padding: 30px;
                margin: 20px 0;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                max-width: 500px;
                width: 90%;
                color: #333;
            `;
            
            // Sonu� mesaj�
            let resultMessage = '';
            let perfectScore = false;
            
            // Dilin �evirilerini al
            const categoryResultText = languages[this.currentLanguage].categoryResult;
            const outOfLivesText = languages[this.currentLanguage].outOfLives;
            const answeredQuestionsText = languages[this.currentLanguage].answeredQuestions;
            const ofQuestionsText = languages[this.currentLanguage].ofQuestions;
            const correctlyAnsweredText = languages[this.currentLanguage].correctlyAnswered;
            const withLivesText = languages[this.currentLanguage].withLives;
            
            if (finalStats.lives <= 0) {
                // Canlar bitti
                resultMessage = `<b>${finalStats.category}</b> ${categoryResultText} ${outOfLivesText}. ${answeredQuestionsText} 
                <span style="color: #4a148c; font-weight: bold;">${finalStats.totalQuestions}</span> ${ofQuestionsText} 
                <span style="color: #e91e63; font-weight: bold;">${finalStats.correctAnswers}</span> ${correctlyAnsweredText}.`;
            } else if (finalStats.correctAnswers === finalStats.totalQuestions && finalStats.correctAnswers > 0) {
                // T�m sorular� do�ru cevaplad�
                resultMessage = `<b>${finalStats.category}</b> ${categoryResultText} 
                <span style="color: #4a148c; font-weight: bold;">${finalStats.totalQuestions}</span> ${ofQuestionsText} 
                <span style="color: #e91e63; font-weight: bold;">${finalStats.correctAnswers}</span> ${correctlyAnsweredText}
                <span style="color: #4CAF50; font-weight: bold;">${finalStats.lives}</span> ${withLivesText}!`;
                perfectScore = true;
            } else {
                // Normal oyun sonu
                resultMessage = `<b>${finalStats.category}</b> ${categoryResultText} ${answeredQuestionsText} 
                <span style="color: #4a148c; font-weight: bold;">${finalStats.totalQuestions}</span> ${ofQuestionsText} 
                <span style="color: #e91e63; font-weight: bold;">${finalStats.correctAnswers}</span> ${correctlyAnsweredText}
                <span style="color: #4CAF50; font-weight: bold;">${finalStats.lives}</span> ${withLivesText}.`;
            }
            
            // Sonu� mesaj�n� ekleyelim
            const messageDiv = document.createElement('div');
            messageDiv.className = 'result-message';
            messageDiv.innerHTML = `<p>${resultMessage}</p>`;
            
            // �statistikler b�l�m�
            const statsDiv = document.createElement('div');
            statsDiv.className = 'statistics-section';
            
            // Dil se�imine g�re istatistik ba�l���
            const statsTitle = languages[this.currentLanguage].statistics;
            const totalQuestionText = languages[this.currentLanguage].totalQuestion;
            const totalCorrectText = languages[this.currentLanguage].totalCorrect;
            const avgTimeText = languages[this.currentLanguage].avgTime;
            const totalScoreText = languages[this.currentLanguage].totalScore;
            
            statsDiv.innerHTML = `
                <h3 style="color: #4a148c; margin-bottom: 15px;">${statsTitle}</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">
                    <div style="background: linear-gradient(145deg, #f6f6f6, #ffffff); border-radius: 10px; padding: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #4a148c;">${finalStats.totalQuestions}</div>
                        <div style="font-size: 0.9rem; color: #666;">${totalQuestionText}</div>
                    </div>
                    <div style="background: linear-gradient(145deg, #f6f6f6, #ffffff); border-radius: 10px; padding: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #e91e63;">${finalStats.correctAnswers}</div>
                        <div style="font-size: 0.9rem; color: #666;">${totalCorrectText}</div>
                    </div>
                    <div style="background: linear-gradient(145deg, #f6f6f6, #ffffff); border-radius: 10px; padding: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #2196F3;">${finalStats.avgTime}s</div>
                        <div style="font-size: 0.9rem; color: #666;">${avgTimeText}</div>
                    </div>
                    <div style="background: linear-gradient(145deg, #f6f6f6, #ffffff); border-radius: 10px; padding: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #009688;">${finalStats.score}</div>
                        <div style="font-size: 0.9rem; color: #666;">${totalScoreText}</div>
                    </div>
                </div>
            `;
            
            // Butonlar
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'result-buttons';
            buttonsDiv.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 15px;
                margin-top: 25px;
            `;
            
            // Ana men�ye d�n�� butonu
            const mainMenuBtn = document.createElement('button');
            const backToCategoriesText = languages[this.currentLanguage].backToCategories;
            mainMenuBtn.innerHTML = `<i class="fas fa-home"></i> ${backToCategoriesText}`;
            mainMenuBtn.style.cssText = `
                background: linear-gradient(45deg, #4a148c, #7b1fa2);
                border: none;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
                box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            `;
            
            mainMenuBtn.addEventListener('click', () => {
                // Sayfay� yeniden y�kle ve ana sayfaya d�n
                window.location.reload();
            });
            
            // Payla� butonu
            const shareBtn = document.createElement('button');
            const shareScoreText = languages[this.currentLanguage].shareScore;
            shareBtn.innerHTML = `<i class="fas fa-share-alt"></i> ${shareScoreText}`;
            shareBtn.style.cssText = `
                background: linear-gradient(45deg, #00a0b0, #3f8ffc);
                border: none;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
                box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            `;
            
            shareBtn.addEventListener('click', () => {
                const appName = languages[this.currentLanguage].quizAppName;
                const ofQuestionsText = languages[this.currentLanguage].ofQuestions;
                const correctlyAnsweredText = languages[this.currentLanguage].correctlyAnswered;
                
                let shareText;
                if (this.currentLanguage === 'tr') {
                    shareText = `${appName}'nda ${finalStats.category} kategorisinde ${finalStats.totalQuestions} sorudan ${finalStats.correctAnswers} tanesini do�ru cevaplad�m!`;
                } else if (this.currentLanguage === 'en') {
                    shareText = `I correctly answered ${finalStats.correctAnswers} ${ofQuestionsText} ${finalStats.totalQuestions} questions in the ${finalStats.category} category of ${appName}!`;
                } else if (this.currentLanguage === 'de') {
                    shareText = `Im ${appName} habe ich ${finalStats.correctAnswers} ${ofQuestionsText} ${finalStats.totalQuestions} Fragen in der Kategorie ${finalStats.category} richtig beantwortet!`;
                }
                
                if (navigator.share) {
                    navigator.share({
                        title: appName,
                        text: shareText,
                        url: window.location.href
                    }).catch(() => {
                        // Panoya kopyala
                        navigator.clipboard.writeText(shareText)
                            .then(() => alert('Skor metni panoya kopyaland�!'));
                    });
                } else {
                    // Panoya kopyala
                    navigator.clipboard.writeText(shareText)
                        .then(() => alert('Skor metni panoya kopyaland�!'));
                }
            });
            
            // Butonlar� ekle
            buttonsDiv.appendChild(mainMenuBtn);
            buttonsDiv.appendChild(shareBtn);
            
            // T�m bile�enleri ana karta ekleyelim
            resultCard.appendChild(messageDiv);
            resultCard.appendChild(statsDiv);
            resultCard.appendChild(buttonsDiv);
            
            // Bile�enleri sonu� ekran�na ekleyelim
            resultScreen.appendChild(header);
            resultScreen.appendChild(resultCard);
            
            // Perfect Score i�in konfeti efekti
            if (perfectScore && finalStats.totalQuestions >= 5) {
                this.createSimpleConfetti(resultScreen);
            }
            
            // FontAwesome ekleyelim
            const fontAwesome = document.createElement('link');
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
            document.head.appendChild(fontAwesome);
            
            // Google Fonts ekleyelim
            const googleFonts = document.createElement('link');
            googleFonts.rel = 'stylesheet';
            googleFonts.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap';
            document.head.appendChild(googleFonts);
            
            // Sonu� ekran�n� body'ye ekle
            document.body.appendChild(resultScreen);
            
            // Ses efekti
            if (perfectScore) {
                const winSound = document.getElementById('sound-win');
                if (winSound) this.playSoundSafely(winSound);
            } else if (finalStats.lives <= 0) {
                const gameoverSound = document.getElementById('sound-gameover');
                if (gameoverSound) this.playSoundSafely(gameoverSound);
            } else {
                const completionSound = document.getElementById('sound-level-completion');
                if (completionSound) this.playSoundSafely(completionSound);
            }
            
        } catch (error) {
            console.error("Sonu� ekran� olu�turulurken hata:", error);
            alert("Sonu� ekran� olu�turulurken bir hata olu�tu. L�tfen sayfay� yenileyiniz.");
            window.location.reload();
        }
        
        // Oyun durumunu s�f�rla
        this.score = 0;
        // this.lives = 5; // BUNU S�L�YORUM
        this.currentQuestionIndex = 0;
        this.answeredQuestions = 0;
        this.answerTimes = [];
        this.currentSection = 1;
        this.resetJokerUsage(); // Sadece kullan�m durumlar�n� s�f�rla, envanter korunsun
    },
    
    // Sesi g�venli �ekilde �al
    playSoundSafely: function(audioElement) {
        if (audioElement && this.soundEnabled) {
            audioElement.play().catch(e => console.log("Ses �alma hatas�:", e));
        }
    },
    
    // Basit konfeti efekti
    createSimpleConfetti: function(container) {
        // Konfeti container
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 1;
        `;
        
        // Konfeti par�ac�klar� i�in renkler
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
        
        // Konfeti par�ac�klar� olu�tur
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 10 + 5}px;
                    height: ${Math.random() * 10 + 5}px;
                    background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}%;
                    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                    animation: confetti-fall ${Math.random() * 3 + 3}s ease-in-out forwards;
                `;
                
                confettiContainer.appendChild(confetti);
                
                // Her par�ac��� 3-6 saniye sonra kald�r
                setTimeout(() => {
                    confetti.remove();
                }, (Math.random() * 3 + 3) * 1000);
            }, Math.random() * 2000); // 0-2 saniye aras�nda rastgele zamanlama ile ekle
        }
        
        container.appendChild(confettiContainer);
        
        // 8 saniye sonra konfeti container'� kald�r
        setTimeout(() => {
            confettiContainer.remove();
        }, 8000);
    },
    
    // Bo�luk doldurma sorusunu y�kle
    loadBlankFillingQuestion: function(question) {
        console.log("Bo�luk doldurma sorusu y�kleniyor:", question);
        
        // �nceki sorunun kal�nt�lar�n� temizle
        this.cleanupPreviousQuestion();
        
        // Var olan do�ru/yanl�� mesajlar�n� temizle
        const existingMessages = document.querySelectorAll('.correct-answer-container, .wrong-answer-container');
        existingMessages.forEach(element => {
            element.remove();
        });
        
        // Sonu� mesaj�n� gizle
        if (this.resultElement) {
            this.resultElement.innerHTML = '';
            this.resultElement.style.display = 'none';
        }
        
        // Sorunun do�ru formatlanmas� i�in kontrol
        if (!question || !question.question || !question.correctAnswer || !question.choices) {
            console.error("Bo�luk doldurma sorusu eksik veya hatal� veri i�eriyor:", question);
            this.loadNextQuestion(); // Sonraki soruya ge�
            return;
        }
        
        // Soruyu g�ster
        if (this.questionElement) {
            this.questionElement.textContent = question.question;
            
            // E�er soruda g�rsel varsa g�ster
            if (question.imageUrl) {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'question-image';
                
                const img = document.createElement('img');
                img.src = question.imageUrl;
                img.alt = 'Soru g�rseli';
                img.style.maxWidth = '100%';
                img.style.maxHeight = '300px';
                img.style.margin = '10px auto';
                img.style.display = 'block';
                
                // G�rsel y�kleme hatas� durumunda - soruyu de�i�tirme mekanizmas�
                img.onerror = () => {
                    console.warn(`Soru g�rseli y�klenemedi: ${question.imageUrl}. Sonraki soruya ge�iliyor...`);
                    
                    // Toast bildirimi g�ster
                    this.showToast("G�rsel y�klenemedi, ba�ka bir soruya ge�iliyor...", "toast-warning");
                    
                    // G�rseli y�klenemeyen soruyu atla
                    if (this.questions.length > this.currentQuestionIndex + 1) {
                        // Zamanlay�c�y� durdur
                        clearInterval(this.timerInterval);
                        
                        // Sonraki soruya ge�
                        setTimeout(() => {
                            this.currentQuestionIndex++;
                            this.displayQuestion(this.questions[this.currentQuestionIndex]);
                        }, 1000);
                    } else {
                        // Soru kalmad�ysa sonucu g�ster
                        setTimeout(() => {
                            this.showResult();
                        }, 1000);
                    }
                    return;
                };
                
                // �nce t�m eski resim elementlerini kald�r
                const oldImages = this.questionElement.querySelectorAll('.question-image');
                oldImages.forEach(img => img.remove());
                
                // Yeni resmi ekle
                imageContainer.appendChild(img);
                this.questionElement.appendChild(imageContainer);
            }
        }
        
        // Se�enekleri g�ster
        if (this.optionsElement) {
            // �nceki i�eri�i temizle
            this.optionsElement.innerHTML = '';
            
            // Ana container - t�m i�eri�i sa�a yaslamak i�in flex kullanaca��z
            const mainContainer = document.createElement('div');
            mainContainer.className = 'main-blank-filling-container';
            mainContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                width: 100%;
                align-items: center;
                justify-content: center;
                padding: 0;
            `;
            
            // Bo�luk doldurma UI olu�tur - ortaya yaslanacak
            const blankFillingContainer = document.createElement('div');
            blankFillingContainer.className = 'blank-filling-container';
            blankFillingContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                max-width: 450px;
                width: 100%;
                align-items: center;
                justify-content: center;
                margin: 0 auto;
            `;
            
            // Cevap g�sterim alan�
            const answerDisplay = document.createElement('div');
            answerDisplay.className = 'answer-display';
            answerDisplay.id = 'blank-filling-answer';
            answerDisplay.style.cssText = `
                min-height: 40px;
                padding: 10px 15px;
                border: 2px solid #ccc;
                border-radius: 5px;
                margin: 15px auto;
                font-size: 18px;
                font-weight: bold;
                text-align: center;
                letter-spacing: 1px;
                background: white;
                width: 80%;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            `;
            blankFillingContainer.appendChild(answerDisplay);
            
            // Se�ilen harfleri saklamak i�in array
            this.selectedLetters = [];
            
            // T�m harfleri cevaptan al (b�y�k/k���k dahil)
            const correctLetters = [...question.choices];
            const shuffledLetters = this.shuffleArray([...correctLetters]);
            // Harfleri g�stermek i�in bir container olu�tur
            const lettersContainer = document.createElement('div');
            lettersContainer.className = 'letters-container';
            if (shuffledLetters.length === 8) {
                lettersContainer.classList.add('letters-8');
                lettersContainer.style.cssText = `
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    grid-template-rows: repeat(2, 1fr);
                    gap: 10px;
                    justify-items: center;
                    align-items: center;
                    margin: 15px auto;
                    width: 100%;
                    max-width: 350px;
                `;
            } else {
                // Di�er durumlar i�in eski flex yap�s�
                lettersContainer.style.cssText = `
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    margin: 15px auto;
                    gap: 10px;
                    width: 100%;
                    max-width: 450px;
                `;
            }
            // Harf butonlar�n� olu�tur
            shuffledLetters.forEach((letter, idx) => {
                const letterButton = document.createElement('button');
                letterButton.className = 'letter-button';
                letterButton.textContent = letter.toUpperCase();
                letterButton.style.cssText = `
                    width: 45px;
                    height: 45px;
                    font-size: 1.2rem;
                    background: #f5f5f5;
                    color: #333;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    margin: 5px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                `;
                
                letterButton.addEventListener('click', () => {
                    if (!letterButton.disabled) {
                        this.selectedLetters.push(letter);
                        this.updateBlankFillingAnswer();
                        
                        // Se�ilen harfi s�nd�r (disabled durumuna getir)
                        letterButton.disabled = true;
                        letterButton.style.opacity = '0.3';
                        letterButton.style.cursor = 'not-allowed';
                        letterButton.style.background = '#d3d3d3';
                        letterButton.style.color = '#888';
                        
                        // Harfi geri almak i�in data attribute'unu ayarla
                        letterButton.setAttribute('data-letter', letter);
                        letterButton.setAttribute('data-index', this.selectedLetters.length - 1);
                    }
                });
                
                // Hover efekti ekle
                letterButton.addEventListener('mouseenter', () => {
                    if (!letterButton.disabled) {
                        letterButton.style.background = '#e0e0e0';
                    }
                });
                letterButton.addEventListener('mouseleave', () => {
                    if (!letterButton.disabled) {
                        letterButton.style.background = '#f5f5f5';
                    }
                });
                
                lettersContainer.appendChild(letterButton);
            });
            
            blankFillingContainer.appendChild(lettersContainer);
            
            // Butonlar i�in container
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'blank-filling-buttons';
            buttonsContainer.style.cssText = `
                display: flex;
                justify-content: center;
                gap: 15px;
                margin: 15px auto;
                width: 100%;
                max-width: 450px;
            `;
            
            // Harf silme butonu
            const deleteButton = document.createElement('button');
            deleteButton.className = 'action-button delete-button';
            deleteButton.innerHTML = '<i class="fas fa-backspace"></i>';
            deleteButton.style.cssText = `
                padding: 12px;
                background: #f44336;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                width: 45px;
                height: 45px;
            `;
            deleteButton.addEventListener('click', () => {
                if (this.selectedLetters.length > 0) {
                    const removedLetter = this.selectedLetters.pop();
                    this.updateBlankFillingAnswer();
                    
                    // Son se�ilen harfin butonunu normale d�nd�r
                    const letterButtons = lettersContainer.querySelectorAll('.letter-button');
                    // En son se�ilen harfi bulup normale d�nd�r
                    for (let i = letterButtons.length - 1; i >= 0; i--) {
                        const btn = letterButtons[i];
                        if (btn.disabled && btn.textContent === removedLetter.toUpperCase()) {
                            btn.disabled = false;
                            btn.style.opacity = '1';
                            btn.style.cursor = 'pointer';
                            btn.style.background = '#f5f5f5';
                            btn.style.color = '#333';
                            btn.removeAttribute('data-letter');
                            btn.removeAttribute('data-index');
                            break; // Sadece bir tanesini geri d�nd�r
                        }
                    }
                } else {
                    this.showToast("Silinecek harf yok!", "toast-warning");
                }
            });
            
            // Temizleme butonu
            const clearButton = document.createElement('button');
            clearButton.className = 'action-button clear-button';
            clearButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            clearButton.style.cssText = `
                padding: 12px;
                background: #ff9800;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                width: 45px;
                height: 45px;
            `;
            clearButton.addEventListener('click', () => {
                this.selectedLetters = [];
                this.updateBlankFillingAnswer();
                
                // T�m harf butonlar�n� normale d�nd�r
                const letterButtons = lettersContainer.querySelectorAll('.letter-button');
                letterButtons.forEach(btn => {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                    btn.style.background = '#f5f5f5';
                    btn.style.color = '#333';
                    btn.removeAttribute('data-letter');
                    btn.removeAttribute('data-index');
                });
            });
            
            // Kontrol et butonu
            const checkButton = document.createElement('button');
            checkButton.id = 'check-answer-button';
            checkButton.className = 'action-button check-button';
            checkButton.innerHTML = '<i class="fas fa-check"></i>';
            checkButton.style.cssText = `
                padding: 12px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                width: 45px;
                height: 45px;
            `;
            checkButton.addEventListener('click', () => {
                // E�er sonu� zaten g�sterilmi�se veya buton devre d��� b�rak�lm��sa hi�bir �ey yapma
                if (this.resultElement.style.display === 'block' || checkButton.disabled) {
                    return;
                }
                
                const userAnswer = this.selectedLetters.join('');
                if (userAnswer.length === 0) {
                    this.showToast("L�tfen bir cevap girin!", "toast-warning");
                    return;
                }
                
                // Butonu devre d��� b�rak, tekrar t�klanmas�n� �nle
                checkButton.disabled = true;
                checkButton.style.opacity = '0.5';
                checkButton.style.cursor = 'not-allowed';
                
                // T�m harf butonlar�n� ve di�er action butonlar�n� devre d��� b�rak
                const letterButtons = lettersContainer.querySelectorAll('.letter-button');
                letterButtons.forEach(btn => {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                });
                deleteButton.disabled = true;
                deleteButton.style.opacity = '0.5';
                clearButton.disabled = true;
                clearButton.style.opacity = '0.5';
                
                if (userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
                    // Do�ru cevap
                    answerDisplay.classList.add('correct');
                    this.handleBlankFillingCorrectAnswer();
                } else {
                    // Yanl�� cevap
                    answerDisplay.classList.add('wrong');
                    this.handleBlankFillingWrongAnswer();
                }
            });
            
            // Butonlar� ekle
            buttonsContainer.appendChild(deleteButton);
            buttonsContainer.appendChild(clearButton);
            buttonsContainer.appendChild(checkButton);
            blankFillingContainer.appendChild(buttonsContainer);
            
            // Ana containere ekle
            mainContainer.appendChild(blankFillingContainer);
            
            // Options elementine ana containeri ekle
            this.optionsElement.innerHTML = '';
            this.optionsElement.style.display = 'flex';
            this.optionsElement.style.justifyContent = 'center';
            this.optionsElement.style.width = '100%';
            this.optionsElement.appendChild(mainContainer);
        }
        
        // Zamanlay�c�y� ba�lat - bo�luk doldurma i�in daha uzun s�re
        this.timeLeft = this.TIME_PER_BLANK_FILLING_QUESTION || 60; // Varsay�lan olarak 60 saniye
        this.updateTimeDisplay();
        this.startTimer();
    },
    
    // Bo�luk doldurma cevap g�sterimini g�ncelle
    updateBlankFillingAnswer: function() {
        const answerDisplay = document.getElementById('blank-filling-answer');
        if (answerDisplay) {
            answerDisplay.textContent = this.selectedLetters.join('');
            
            // Varsa s�n�flar� temizle (do�ru/yanl�� olarak i�aretlenmi�se)
            answerDisplay.classList.remove('correct', 'wrong');
        }
    },
    
    // Bo�luk doldurma sorular� i�in kategoriye g�re getirme
    getBlankFillingQuestionsForCategory: function(category, count) {
        // T�m bo�luk doldurma sorular�n� al
        const allBlankFillingQuestions = this.allQuestionsData["Bo�luk Doldurma"] || [];
        
        // �stenen kategorideki sorular� filtrele
        let categoryQuestions = allBlankFillingQuestions.filter(q => q.category === category);
        
        // Daha �nce sorulmu� sorular� filtrele
        const seenIndices = this.getSeenQuestions("Bo�luk Doldurma_" + category) || [];
        
        if (seenIndices.length >= categoryQuestions.length) {
            // T�m sorular sorulmu�sa s�f�rla
            this.saveSeenQuestions("Bo�luk Doldurma_" + category, []);
            console.log(`${category} kategorisinde t�m bo�luk doldurma sorular� tamamland�, s�f�rland�.`);
        } else {
            // Daha �nce sorulmam�� sorular� se�
            categoryQuestions = categoryQuestions.filter((_, index) => !seenIndices.includes(index));
        }
        
        // Rastgele sorular se�
        const shuffledQuestions = this.shuffleArray(categoryQuestions);
        const selectedQuestions = shuffledQuestions.slice(0, count);
        
        // Se�ilen sorular�n indekslerini bul
        const selectedIndices = selectedQuestions.map(q => 
            allBlankFillingQuestions.findIndex(origQ => origQ.question === q.question)
        ).filter(index => index !== -1);
        
        // Sorular�n birer kopyas�n� olu�tur ve �zel i�aretleme ekle
        const processedQuestions = selectedQuestions.map(q => ({
            ...q,
            category: "Bo�luk Doldurma",
            originalCategory: category // Orijinal kategoriyi sakla
        }));
        
        return { questions: processedQuestions, indices: selectedIndices };
    },
    
    // Soru y�klemesini d�zenle
    prepareQuestions: function(category) {
        return new Promise((resolve, reject) => {
            try {
                console.log(`${category} kategorisi i�in sorular haz�rlan�yor...`);
                
                // Kategori i�in soru say�s� belirleme
                const totalQuestionsCount = 10;
                
                // Normal sorular�n say�s�
                const normalQuestionsCount = Math.floor(totalQuestionsCount * 0.8); // %80'i normal sorular
                
                // Bo�luk doldurma sorular�n�n say�s�
                const blankFillingQuestionsCount = Math.floor(totalQuestionsCount * 0.2); // %20'si bo�luk doldurma
                
                // Normal sorular� al
                const result = this.getCategoryQuestions(category, normalQuestionsCount);
                
                // Normal sorular
                const selectedQuestions = result.questions;
                const selectedIndices = result.indices;
                
                // Bo�luk doldurma sorular� da ekleyelim
                let processedQuestions = selectedQuestions;
                
                // Kategori i�in bo�luk doldurma sorular�
                const blankFillingResult = this.getBlankFillingQuestionsForCategory(category, blankFillingQuestionsCount);
                
                if (blankFillingResult.questions.length > 0) {
                    // Bo�luk doldurma sorular�n� normal sorular aras�na da��t
                    const blankFillingQuestions = blankFillingResult.questions;
                    
                    // T�m sorular� birle�tir
                    processedQuestions = [...selectedQuestions, ...blankFillingQuestions];
                    
                    // Sorular� kar��t�r
                    processedQuestions = this.shuffleArray(processedQuestions);
                    
                    // Bo�luk doldurma sorular�n� takip et
                    this.saveSeenQuestions("Bo�luk Doldurma_" + category, blankFillingResult.indices);
                }
                
                // Sorular� d�zenle
                this.questions = processedQuestions;
                
                // G�r�len sorular� kaydet
                this.saveSeenQuestions(category, selectedIndices);
                
                // Oyun durumunu s�f�rla
                this.currentQuestionIndex = 0;
                this.resetJokers();
                
                console.log(`${category} kategorisi i�in ${this.questions.length} soru haz�rland�.`);
                console.log(`Normal sorular: ${this.questions.filter(q => q.category !== "Bo�luk Doldurma").length}`);
                console.log(`Bo�luk doldurma sorular�: ${this.questions.filter(q => q.category === "Bo�luk Doldurma").length}`);
                
                resolve();
            } catch (error) {
                console.error("Sorular haz�rlan�rken hata olu�tu:", error);
                reject(error);
            }
        });
    },
    
    // Zamanlay�c�y� durdur
    stopTimer: function() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },
    
    // Ses �almak i�in yard�mc� fonksiyon
    playSound: function(soundElement) {
        if (this.soundEnabled && soundElement) {
            soundElement.currentTime = 0;
            soundElement.play().catch(e => console.error("Ses �al�namad�:", e));
        }
    },
    
    // Can kaybetme fonksiyonu
    loseLife: function() {
        // �nce can� azalt
        this.lives--; 
        
        // DOM'u g�ncelle
        this.updateLives();
        
        // Can kontrol� - canlar bittiyse can sat�n alma teklifi g�ster
        if (this.lives <= 0) {
            console.log("Canlar bitti, can sat�n alma teklifi g�steriliyor...");
            
            // Zamanlay�c�y� durdur
            this.stopTimer();
            
            // Can sat�n alma modal�n� g�ster
            this.showBuyLivesModal();
        }
    },
    
    // Canlar� g�ncelle
    updateLives: function() {
        const livesContainer = document.getElementById('lives-container');
        if (livesContainer) {
            // �nce t�m eski ikonlar� temizle
            livesContainer.innerHTML = '';
            // this.lives kadar aktif ikon ekle
            for (let i = 0; i < this.lives; i++) {
                const span = document.createElement('span');
                span.className = 'life-icon active';
                const icon = document.createElement('i');
                icon.className = 'fas fa-heart';
                span.appendChild(icon);
                livesContainer.appendChild(span);
            }
        }
    },

    // Can sat�n alma modal�n� g�ster
    showBuyLivesModal: function() {
        const LIVES_PRICE = 500; // 3 can i�in 500 puan
        const LIVES_AMOUNT = 3; // Sat�n al�nacak can say�s�
        
        // Oyuncunun puan�n� kontrol et
        const currentPoints = this.isLoggedIn ? this.totalScore : this.sessionScore;
        
        // Modal olu�tur
        const buyLivesModal = document.createElement('div');
        buyLivesModal.className = 'buy-lives-modal';
        buyLivesModal.innerHTML = `
            <div class="buy-lives-modal-content">
                <div class="buy-lives-header">
                    <div class="lives-out-icon">
                        <i class="fas fa-heart-broken"></i>
                    </div>
                    <h2>Canlar�n�z Bitti!</h2>
                    <p class="lives-out-message">Oyuna devam etmek i�in can sat�n alabilirsiniz.</p>
                </div>
                
                <div class="buy-lives-offer">
                    <div class="lives-package">
                        <div class="package-icon">
                            <i class="fas fa-heart"></i>
                            <i class="fas fa-heart"></i>
                            <i class="fas fa-heart"></i>
                        </div>
                        <div class="package-details">
                            <h3>3 Can Paketi</h3>
                            <p class="package-description">Oyuna 3 canla devam edin!</p>
                            <div class="package-price">
                                <span class="price-amount">${LIVES_PRICE}</span>
                                <i class="fas fa-coins"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="current-points">
                        <i class="fas fa-wallet"></i>
                        <span>Mevcut Puan�n�z: ${currentPoints}</span>
                    </div>
                </div>
                
                <div class="buy-lives-actions">
                    ${currentPoints >= LIVES_PRICE ? 
                        `<button id="confirm-buy-lives" class="btn-buy-lives">
                            <i class="fas fa-shopping-cart"></i>
                            3 Can Sat�n Al (${LIVES_PRICE} Puan)
                        </button>` : 
                        `<button class="btn-buy-lives disabled" disabled>
                            <i class="fas fa-times"></i>
                            Yetersiz Puan (${LIVES_PRICE} Gerekli)
                        </button>`
                    }
                    <button id="decline-buy-lives" class="btn-decline-lives">
                        <i class="fas fa-flag-checkered"></i>
                        Oyunu Bitir
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(buyLivesModal);
        
        // Sat�n alma butonuna event listener ekle
        const confirmBuyBtn = document.getElementById('confirm-buy-lives');
        if (confirmBuyBtn) {
            confirmBuyBtn.addEventListener('click', () => {
                this.buyLives(LIVES_AMOUNT, LIVES_PRICE);
                buyLivesModal.remove();
            });
        }
        
        // Oyunu bitir butonuna event listener ekle
        const declineBuyBtn = document.getElementById('decline-buy-lives');
        if (declineBuyBtn) {
            declineBuyBtn.addEventListener('click', () => {
                buyLivesModal.remove();
                // Oyun sonu ekran�n� g�ster
                setTimeout(() => {
                    this.showResult();
                }, 500);
            });
        }
        
        // Modal d���na t�klan�rsa oyunu bitir
        buyLivesModal.addEventListener('click', (e) => {
            if (e.target === buyLivesModal) {
                buyLivesModal.remove();
                setTimeout(() => {
                    this.showResult();
                }, 500);
            }
        });
    },

    // Can sat�n alma i�lemi
    buyLives: function(livesAmount, price) {
        const currentPoints = this.isLoggedIn ? this.totalScore : this.sessionScore;
        
        // Puan kontrol�
        if (currentPoints < price) {
            this.showToast('Yetersiz puan!', 'toast-error');
            return false;
        }
        
        // Puan� d��
        if (this.isLoggedIn) {
            this.totalScore -= price;
            this.delayedSaveUserData(); // Firebase'e kaydet
        } else {
            this.sessionScore -= price;
        }
        
        // Canlar� ekle
        this.lives = livesAmount;
        
        // G�r�nt�leri g�ncelle
        this.updateLives();
        this.updateScoreDisplay();
        this.updateTotalScoreDisplay();
        
        // Ba�ar� mesaj� g�ster
        this.showToast(`${livesAmount} can sat�n al�nd�! Oyun devam ediyor...`, 'toast-success');
        
        // K�sa bir gecikme ile oyunu devam ettir
        setTimeout(() => {
            // Zamanlay�c�y� yeniden ba�lat
            this.timeLeft = this.TIME_PER_QUESTION;
            this.startTimer();
        }, 1500);
        
        console.log(`${livesAmount} can sat�n al�nd�. Kalan puan: ${this.isLoggedIn ? this.totalScore : this.sessionScore}`);
        
        return true;
    },
    
    // Y�ksek skor ekleme fonksiyonu - Firebase ve localStorage'a kaydet
    addNewHighScore: function(category, score, total) {
        try {
            // Tarih bilgisi
            const date = new Date().toLocaleDateString();
            const timestamp = new Date();
            
            // Yeni skor verisi
            const scoreData = {
                score: score,
                totalQuestions: total,
                correctAnswers: score, // Score genellikle do�ru cevap say�s�d�r
                category: category,
                percentage: Math.round((score / total) * 100),
                date: date,
                timestamp: timestamp,
                userId: this.isLoggedIn ? this.currentUser.uid : 'guest',
                userName: this.isLoggedIn ? (this.currentUser.displayName || this.currentUser.email) : 'Misafir'
            };
            
            // FIREBASE'E KAYDET
            if (this.isLoggedIn && firebase.firestore) {
                const db = firebase.firestore();
                
                // highScores koleksiyonuna ekle
                db.collection('highScores').add(scoreData)
                    .then((docRef) => {
                        console.log('Firebase\'e skor kaydedildi, ID:', docRef.id);
                    })
                    .catch((error) => {
                        console.error('Firebase\'e skor kaydedilirken hata:', error);
                    });
                
                // Kullan�c�n�n ki�isel skorlar�n� da g�ncelle
                const userScoreData = {
                    ...scoreData,
                    gameId: Date.now().toString() // Benzersiz oyun ID'si
                };
                
                db.collection('users').doc(this.currentUser.uid)
                    .collection('personalScores').add(userScoreData)
                    .then(() => {
                        console.log('Kullan�c�n�n ki�isel skorlar� g�ncellendi');
                    })
                    .catch((error) => {
                        console.error('Ki�isel skorlar kaydedilirken hata:', error);
                    });
            }
            
            // LOCALSTORAGE'A KAYDET (Yedek olarak)
            if (this.isLocalStorageAvailable()) {
                const highScoresKey = 'highScores_' + category;
                let highScores = JSON.parse(localStorage.getItem(highScoresKey)) || [];
                
                highScores.push({
                    score: score,
                    total: total,
                    percentage: Math.round((score / total) * 100),
                    date: date
                });
                
                // Skorlar� y�zdeye g�re s�rala (y�ksekten d����e)
                highScores.sort((a, b) => b.percentage - a.percentage);
                
                // Maksimum 10 skor tut
                if (highScores.length > 10) {
                    highScores = highScores.slice(0, 10);
                }
                
                localStorage.setItem(highScoresKey, JSON.stringify(highScores));
            }
            
            return true;
        } catch (error) {
            console.error("Y�ksek skor kaydetme hatas�:", error);
            return false;
        }
    },
    
    // Oyun istatistiklerini kaydetme - Firebase ve localStorage'a
    saveGameStatistics: function() {
        try {
            // �statistik verisi haz�rla
            const gameStatsData = {
                category: this.selectedCategory,
                score: this.score,
                totalQuestions: this.questions.length,
                correctAnswers: this.score,
                lives: this.lives,
                averageTime: this.answerTimes.length > 0 ? 
                    (this.answerTimes.reduce((a, b) => a + b, 0) / this.answerTimes.length) : 0,
                timestamp: new Date(),
                userId: this.isLoggedIn ? this.currentUser.uid : 'guest'
            };
            
            // FIREBASE'E KAYDET
            if (this.isLoggedIn && firebase.firestore) {
                const db = firebase.firestore();
                
                // gameStats koleksiyonuna oyun verilerini kaydet
                db.collection('gameStats').add(gameStatsData)
                    .then(() => {
                        console.log('Oyun istatistikleri Firebase\'e kaydedildi');
                    })
                    .catch((error) => {
                        console.error('Firebase\'e istatistik kaydedilirken hata:', error);
                    });
                
                // Kullan�c�n�n genel istatistiklerini g�ncelle
                const userStatsRef = db.collection('users').doc(this.currentUser.uid);
                
                userStatsRef.get().then((doc) => {
                    const userData = doc.exists ? doc.data() : {};
                    const currentStats = userData.stats || {
                        totalGames: 0,
                        totalQuestions: 0,
                        correctAnswers: 0,
                        categories: {}
                    };
                    
                    // �statistikleri g�ncelle
                    currentStats.totalGames++;
                    currentStats.totalQuestions += this.questions.length;
                    currentStats.correctAnswers += this.score;
                    
                    // Kategori bazl� istatistikler
                    if (!currentStats.categories[this.selectedCategory]) {
                        currentStats.categories[this.selectedCategory] = {
                            games: 0,
                            questions: 0,
                            correct: 0
                        };
                    }
                    
                    currentStats.categories[this.selectedCategory].games++;
                    currentStats.categories[this.selectedCategory].questions += this.questions.length;
                    currentStats.categories[this.selectedCategory].correct += this.score;
                    
                    // Firebase'e g�ncelleme kaydet
                    userStatsRef.update({ stats: currentStats })
                        .then(() => {
                            console.log('Kullan�c� istatistikleri g�ncellendi');
                        })
                        .catch((error) => {
                            console.error('Kullan�c� istatistikleri g�ncellenirken hata:', error);
                        });
                }).catch((error) => {
                    console.error('Kullan�c� istatistikleri al�n�rken hata:', error);
                });
            }
            
            // LOCALSTORAGE'A KAYDET (Yedek olarak)
            if (this.isLocalStorageAvailable()) {
                // Oyun ge�mi�ine bu oyunu ekle
                const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
                const gameRecord = {
                    category: this.selectedCategory,
                    score: this.score,
                    totalQuestions: this.questions.length,
                    correctAnswers: this.score, // Bu �rnekte score = correctAnswers
                    lives: this.lives,
                    averageTime: this.answerTimes.length > 0 ? 
                        (this.answerTimes.reduce((a, b) => a + b, 0) / this.answerTimes.length) : 0,
                    date: new Date().toISOString(),
                    timestamp: Date.now()
                };
                
                gameHistory.push(gameRecord);
                
                // Son 100 oyunu sakla (haf�za tasarrufu i�in)
                if (gameHistory.length > 100) {
                    gameHistory.splice(0, gameHistory.length - 100);
                }
                
                localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
                console.log('Oyun ge�mi�ine eklendi:', gameRecord);
                
                // Eski format istatistikler (uyumluluk i�in)
                const statsKey = 'gameStats';
                let stats = JSON.parse(localStorage.getItem(statsKey)) || {
                    totalGames: 0,
                    totalQuestions: 0,
                    correctAnswers: 0,
                    categories: {}
                };
                
                // �statistikleri g�ncelle
                stats.totalGames++;
                stats.totalQuestions += this.questions.length;
                stats.correctAnswers += this.score;
                
                // Kategori bazl� istatistikler
                if (!stats.categories[this.selectedCategory]) {
                    stats.categories[this.selectedCategory] = {
                        games: 0,
                        questions: 0,
                        correct: 0
                    };
                }
                
                stats.categories[this.selectedCategory].games++;
                stats.categories[this.selectedCategory].questions += this.questions.length;
                stats.categories[this.selectedCategory].correct += this.score;
                
                localStorage.setItem(statsKey, JSON.stringify(stats));
            }
            
            return true;
        } catch (error) {
            console.error("�statistik kaydetme hatas�:", error);
            return false;
        }
    },
    
    // Yerel depolama kullan�labilirli�ini kontrol et
    isLocalStorageAvailable: function() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    // Kullan�c� rozetlerini y�kle
    loadUserBadges: function() {
        // Kullan�c� rozetleri ile ilgili i�lemleri burada yap�n
        // �imdilik sadece bo� bir fonksiyon olarak tan�ml�yoruz
        return;
    },
    
    // Y�ksek skorlar� g�r�nt�le
    displayHighScores: function() {
        try {
            // Y�ksek skorlar listesi elementini bul
            const highScoresList = document.getElementById('high-scores-list');
            if (!highScoresList) {
                return false;
            }
            
            // Listeyi temizle
            highScoresList.innerHTML = '';
            
            // Se�ilen kategori i�in y�ksek skorlar� al
            const highScoresKey = 'highScores_' + this.selectedCategory;
            const highScores = JSON.parse(localStorage.getItem(highScoresKey)) || [];
            
            // E�er y�ksek skorlar yoksa mesaj g�ster
            if (highScores.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'Hen�z y�ksek skor kaydedilmemi�.';
                li.style.textAlign = 'center';
                li.style.fontStyle = 'italic';
                li.style.color = '#666';
                highScoresList.appendChild(li);
                return true;
            }
            
            // Y�ksek skorlar� listele
            highScores.forEach((scoreData, index) => {
                const li = document.createElement('li');
                const scoreSpan = document.createElement('span');
                const dateSpan = document.createElement('span');
                
                scoreSpan.textContent = `${index + 1}. ${scoreData.score}/${scoreData.total} (${scoreData.percentage}%)`;
                dateSpan.textContent = scoreData.date;
                
                li.appendChild(scoreSpan);
                li.appendChild(dateSpan);
                highScoresList.appendChild(li);
            });
            
            return true;
        } catch (error) {
            console.error("Y�ksek skorlar� g�r�nt�leme hatas�:", error);
            return false;
        }
    },
    
    // Y�kleniyor mesaj�n� g�ster
    showLoadingMessage: function() {
        if (this.questionElement) {
            this.questionElement.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Sorular y�kleniyor...</div>';
        }
    },
    
    // Dizi kar��t�rma fonksiyonu
    shuffleArray: function(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },
    
    // Zamanlay�c� �ubu�unu g�ncelleyen fonksiyon
    updateTimerProgress: function(percentage) {
        const timerProgress = document.getElementById('timer-progress');
        if (timerProgress) {
            timerProgress.style.width = `${percentage}%`;
            
            // Rengi g�ncelle
            if (percentage > 60) {
                timerProgress.className = 'timer-progress good';
            } else if (percentage > 30) {
                timerProgress.className = 'timer-progress warning';
            } else {
                timerProgress.className = 'timer-progress danger';
            }
        }
    },
    
    // Uyar� mesaj� g�ster
    showAlert: function(message, type = 'info') {
        console.log("Uyar� mesaj� g�steriliyor:", message, type);
        
        // Daha �nce olu�turulmu� uyar� varsa kald�r
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Yeni uyar� olu�tur
        const alertElement = document.createElement('div');
        alertElement.className = `custom-alert ${type}`;
        alertElement.innerHTML = `<span>${message}</span>`;
        
        // Sayfaya ekle
        document.body.appendChild(alertElement);
        
        // Belirli bir s�re sonra kald�r
        setTimeout(() => {
            alertElement.classList.add('hide');
            setTimeout(() => alertElement.remove(), 500);
        }, 3000);
    },
    
    // �nceki sorunun kal�nt�lar�n� temizleyen fonksiyon
    cleanupPreviousQuestion: function() {
        // �nceki ipucu mesajlar�n� temizle
        const existingHintMessages = document.querySelectorAll('.hint-message');
        existingHintMessages.forEach(element => {
            element.remove();
        });
        
        // "Do�ru!" veya "Yanl��!" mesajlar�n� temizle
        const correctMessageElements = document.querySelectorAll('.correct-answer-container');
        correctMessageElements.forEach(element => {
            element.remove();
        });
        
        // Sonu� mesaj�n� temizle
        if (this.resultElement) {
            this.resultElement.innerHTML = '';
            this.resultElement.style.display = 'none';
        }
        
        // Zamanlay�c�y� durdur
        clearInterval(this.timerInterval);
        
        // Sonraki soru butonunu gizle
        if (this.nextButton) {
            this.nextButton.style.display = 'none';
        }
        
        // Options elementinin stilini s�f�rla - bo�luk doldurma sorular�ndan �oktan se�meliye ge�i�i d�zelt
        if (this.optionsElement) {
            // Inline stilleri temizle
            this.optionsElement.style.display = '';
            this.optionsElement.style.justifyContent = '';
            this.optionsElement.style.width = '';
        }
    },
    
    // Bu fonksiyon, daha �nce se�eneklere t�kland���nda �al��an i�levden �a�r�l�yor olmal�
    handleCorrectAnswer: function() {
        // Zamanlay�c�y� durdur
        this.stopTimer();
    },
    
    // Kullan�c� ilerlemesini y�kle (�imdilik bo�, hata engelleme ama�l�)
    loadUserProgress: function(uid, category) {
        // Kullan�c� ilerlemesi burada y�klenecek
        // �imdilik hata almamak i�in bo� b�rak�ld�
        return;
    },
    
    // Kullan�c� istatistiklerini y�kle
    loadUserStats: function(userId) {
        // �nce �evrimi�i kontrol� yap
        if (!navigator.onLine) {
            console.log('�evrimd��� mod - yerel istatistikler kullan�l�yor');
            // Yerel veri yoksa varsay�lan de�erlerle devam et
            this.userStats = {
                gamesPlayed: 0,
                totalQuestions: 0,
                totalCorrect: 0,
                averageTime: 0,
                perfectRounds: 0,
                categoryStats: {}
            };
            
            // Yerel depolamadan veriler varsa onlar� kullan
            try {
                const localStats = localStorage.getItem('userStats_' + userId);
                if (localStats) {
                    this.userStats = JSON.parse(localStats);
                    console.log('Yerel istatistikler y�klendi:', this.userStats);
                    this.updateStatsDisplay();
                }
            } catch (e) {
                console.error('Yerel istatistikler y�klenirken hata:', e);
            }
            
            return;
        }
        
        // �evrimi�i ise Firestore'dan y�kle
        const db = firebase.firestore();
        db.collection('users').doc(userId).get()
            .then((doc) => {
                if (doc.exists && doc.data().stats) {
                    const userStats = doc.data().stats;
                    console.log('Kullan�c� istatistikleri y�klendi:', userStats);
                    this.userStats = userStats;
                    
                    // Yerel kopyas�n� da sakla
                    try {
                        localStorage.setItem('userStats_' + userId, JSON.stringify(userStats));
                    } catch (e) {
                        console.warn('�statistikler yerel olarak kaydedilemedi:', e);
                    }
                    
                    // Gerekli UI g�ncellemeleri yap�labilir
                    this.updateStatsDisplay();
                } else {
                    console.log('Kullan�c� istatistikleri bulunamad�, yeni olu�turuluyor');
                    this.userStats = {
                        gamesPlayed: 0,
                        totalQuestions: 0,
                        totalCorrect: 0,
                        averageTime: 0,
                        perfectRounds: 0,
                        categoryStats: {}
                    };
                    
                    // Firestore'a bo� istatistik verisi kaydet
                    db.collection('users').doc(userId).update({
                        stats: this.userStats
                    }).catch(error => {
                        console.error('�statistik g�ncelleme hatas�:', error);
                    });
                }
            })
            .catch((error) => {
                console.error('Kullan�c� istatistiklerini y�kleme hatas�:', error);
                
                // Hata durumunda yerel verileri kullan
                try {
                    const localStats = localStorage.getItem('userStats_' + userId);
                    if (localStats) {
                        this.userStats = JSON.parse(localStats);
                        console.log('Hata nedeniyle yerel istatistikler kullan�l�yor:', this.userStats);
                        this.updateStatsDisplay();
                    } else {
                        // Yerel veri yoksa varsay�lan de�erler kullan
                        this.userStats = {
                            gamesPlayed: 0,
                            totalQuestions: 0,
                            totalCorrect: 0,
                            averageTime: 0,
                            perfectRounds: 0,
                            categoryStats: {}
                        };
                    }
                } catch (e) {
                    console.error('Yerel istatistikler y�klenirken hata:', e);
                }
            });
    },
    
    // �statistik ekran�n� g�ncelle
    updateStatsDisplay: function() {
        // �statistikleri g�steren UI elementleri varsa g�ncelle
        const statsContainer = document.getElementById('user-stats');
        if (statsContainer && this.userStats) {
            // �rnek istatistik g�sterimi
            let statsHTML = `
                <div class="stats-item">
                    <span class="stat-label">Toplam Oyun:</span>
                    <span class="stat-value">${this.userStats.gamesPlayed || 0}</span>
                </div>
                <div class="stats-item">
                    <span class="stat-label">Do�ru Cevap Oran�:</span>
                    <span class="stat-value">${this.userStats.totalQuestions > 0 ? 
                        Math.round((this.userStats.totalCorrect / this.userStats.totalQuestions) * 100) : 0}%</span>
                </div>
                <div class="stats-item">
                    <span class="stat-label">Ortalama S�re:</span>
                    <span class="stat-value">${this.userStats.averageTime ? 
                        this.userStats.averageTime.toFixed(1) : 0} sn</span>
                </div>
            `;
            statsContainer.innerHTML = statsHTML;
        }
    },
    
    // Taray�c� izleme �nleme sorunlar�n� kontrol et
    checkBrowserBlockingIssues: function(user) {
        // Edge veya di�er taray�c�larda tracking prevention sorunlar� kontrol�
        try {
            // localStorage'� test et
            const testKey = 'browserBlockingTest';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            
            // �nternet ba�lant�s�n� kontrol et
            if (!navigator.onLine) {
                console.log('�nternet ba�lant�s� yok, �evrimd��� mod aktif');
                // this.showToast('�nternet ba�lant�s� olmadan �evrimd��� modda �al���yorsunuz. Tek oyunculu modda oynayabilirsiniz.', 'toast-info');
                return;
            }
            
            // IndexedDB'yi test et
            const request = indexedDB.open('testDB', 1);
            request.onerror = () => {
                console.warn('IndexedDB eri�imi engellenmi� olabilir - taray�c� izleme korumas� aktif olabilir');
                // this.showToast('Taray�c� ayarlar�n�z veritaban� eri�imine izin vermiyor. Tek oyunculu modda oynayabilirsiniz.', 'toast-warning');
            };
            
            // Firestore ba�lant�s�n� daha nazik test et
            if (firebase.firestore) {
                // Firestore ba�lant�s�n� ping ile test et
                firebase.firestore().collection('test').doc('test')
                    .get()
                    .then(() => {
                        console.log('Firestore ba�lant�s� ba�ar�l�');
                    })
                    .catch(error => {
                        // Ba�lant� hatas� olu�ursa
                        console.warn('Firestore ba�lant� sorunu: ' + error.message);
                        
                        // Firebase uyar�s� kald�r�ld� - art�k g�sterilmeyecek
                        // if (error.code === 'unavailable' || error.code === 'failed-precondition') {
                        //     this.showToast('Firebase sunucular�na ba�lan�lamad�. �nternet ba�lant�n�z� kontrol edin veya tek oyunculu modda oynay�n.', 'toast-info');
                        // }
                    });
            }
        } catch (error) {
            console.error('Taray�c� engelleme testi s�ras�nda hata:', error);
            // this.showToast('Baz� taray�c� �zellikleri kullan�lam�yor. Ancak tek oyunculu modu kullanabilirsiniz.', 'toast-info');
        }
    },
    
    // Kullan�c� aray�z�n� haz�rla
    initUI: function() {
        try {
            console.log("UI ba�lat�l�yor...");
            
            // DOM elementleri
            this.quizElement = document.getElementById('quiz');
            this.questionElement = document.getElementById('question');
            this.optionsElement = document.getElementById('options');
            this.nextButton = document.getElementById('next-question');
            this.timerElement = document.getElementById('time-left');
            this.resultElement = document.getElementById('result');
            this.categoriesElement = document.getElementById('categories');
            this.categorySelectionElement = document.getElementById('category-selection');
            this.livesContainer = document.getElementById('lives-container');
            this.hamburgerToggle = document.getElementById('hamburger-toggle');
            this.mainMenu = document.getElementById('main-menu');
            this.singlePlayerBtn = document.getElementById('single-player-btn');
            
            // DOM elementlerinin varl���n� kontrol et
            if (!this.categoriesElement) {
                console.error("Kategoriler elementi bulunamad�! ID: categories");
            }
            
            if (!this.categorySelectionElement) {
                console.error("Kategori se�im elementi bulunamad�! ID: category-selection");
            }
            
            if (!this.mainMenu) {
                console.error("Ana men� elementi bulunamad�! ID: main-menu");
            }
            
            if (!this.singlePlayerBtn) {
                console.error("Tekli oyun butonu bulunamad�! ID: single-player-btn");
            }
            
            console.log("UI elementleri haz�rland�.");
            
            // Event listener'lar� ekle
            this.addEventListeners();
            
            // Firebase authentication state listener
            if (firebase.auth) {
                firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                        // Kullan�c� giri� yapm��
                        console.log("Giri� yapan kullan�c�:", user.email || user.displayName || user.uid);
                        
                        // Kullan�c� bilgilerini kaydet
                        this.isLoggedIn = true;
                        this.currentUser = user;
                        
                        // Ana men�y� g�ster
                        if (this.mainMenu) {
                            this.mainMenu.style.display = 'block';
                        } else {
                            console.error("mainMenu elementi null!");
                        }
                        
                        // Kullan�c� verilerini y�kle ve Firebase'den senkronize et
                        this.loadUserData(user.uid);
                        this.syncUserStatsFromFirebase();
                        
                        // Joker ve ayarlar� y�kle
                        this.loadUserSettings();
                        this.loadJokerInventory();
                        
                        // Kullan�c� istatistiklerini y�kle
                        if (typeof this.loadUserStats === 'function') {
                            this.loadUserStats(user.uid);
                        }
                        
                        // Taray�c� �zleme �nleme kontrol�
                        if (typeof this.checkBrowserBlockingIssues === 'function') {
                            this.checkBrowserBlockingIssues(user);
                        }
                    } else {
                        // Kullan�c� giri� yapmam��
                        this.isLoggedIn = false;
                        this.currentUser = null;
                        
                        // Giri� sayfas�na y�nlendir
                        window.location.href = 'login.html';
                    }
                });
            } else {
                console.error("Firebase authentication bulunamad�!");
                
                // Firebase olmadan da uygulaman�n �al��abilmesi i�in
                this.isLoggedIn = false;
                if (this.mainMenu) {
                    this.mainMenu.style.display = 'block';
                }
            }
        } catch (error) {
            console.error("initUI fonksiyonunda kritik hata:", error);
            alert("Uygulama ba�lat�l�rken bir hata olu�tu. L�tfen sayfay� yenileyin.");
        }
    },
    
    // --- Soru dizisini her b�l�m�n ilk sorusu bo�luk doldurma olacak �ekilde d�zenle ---
    // Bu fonksiyonu, sorular kar��t�r�ld�ktan ve se�ildikten sonra �a��r�n
    arrangeBlankFillingFirst: function() {
        // Her 5'lik b�l�m�n ilk sorusu bo�luk doldurma olacak
        for (let i = 0; i < this.questions.length; i += 5) {
            // O b�l�mde bo�luk doldurma sorusu var m�?
            const section = this.questions.slice(i, i + 5);
            const blankIndex = section.findIndex(q => q.type === 'BlankFilling');
            if (blankIndex > 0) {
                // O b�l�mde bo�luk doldurma varsa, ilk s�raya al
                const temp = this.questions[i];
                this.questions[i] = this.questions[i + blankIndex];
                this.questions[i + blankIndex] = temp;
            }
        }
    },
    
    // Konfeti efekti olu�tur
    createConfetti: function(container) {
        // Konfeti par�ac�klar� i�in container
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.position = 'absolute';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.overflow = 'hidden';
        confettiContainer.style.zIndex = '1000';
        
        container.appendChild(confettiContainer);
        
        // Konfeti par�ac�klar�
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
        
        // Konfeti par�ac�klar� olu�tur
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            
            // Rastgele stil ver
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            
            confetti.style.position = 'absolute';
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;
            confetti.style.left = `${left}%`;
            confetti.style.top = `-${size}px`;
            confetti.style.opacity = Math.random() + 0.5;
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.animation = `confetti-fall ${animationDuration}s ease-in-out infinite`;
            
            // CSS Animation ekle
            const styleSheet = document.styleSheets[0];
            if (!document.querySelector('style.confetti-style')) {
                const style = document.createElement('style');
                style.className = 'confetti-style';
                style.textContent = `
                    @keyframes confetti-fall {
                        0% {
                            top: -10px;
                            transform: translateX(0) rotate(0deg);
                        }
                        100% {
                            top: 100%;
                            transform: translateX(${Math.random() > 0.5 ? '+' : '-'}${Math.random() * 100}px) rotate(${Math.random() * 360}deg);
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            confettiContainer.appendChild(confetti);
        }
        
        // 6 saniye sonra konfetileri kald�r
        setTimeout(() => {
            confettiContainer.remove();
        }, 6000);
    },
    
    // Sonraki soruyu y�kle - cleanupPreviousQuestion ile �zellikle options elementinin stillerini temizler
    loadNextQuestion: function() {
        this.currentQuestionIndex++;
        
        // �nceki sorunun t�m elementlerini ve stilleri temizleyelim
        this.cleanupPreviousQuestion();
        
        // Options elementini �zel olarak s�f�rla
        if (this.optionsElement) {
            this.optionsElement.innerHTML = '';
            this.optionsElement.style.display = '';
            this.optionsElement.style.justifyContent = '';
            this.optionsElement.style.width = '';
        }
        
        // Oyun bitti kontrol�
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResult();
            return;
        }
        
        // Sorug�sterimi
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        // Soru tipine g�re y�kleme
        if (currentQuestion.type === "BlankFilling") {
            this.loadBlankFillingQuestion(currentQuestion);
        } else if (currentQuestion.type === "Do�ruYanl��" || currentQuestion.type === "TrueFalse") {
            this.loadTrueFalseQuestion(currentQuestion);
        } else {
            this.displayQuestion(currentQuestion);
        }
    },
    
    // Sonu� ve uyar� mesajlar�n� g�ncelle (her durumda)
    updateResultAndWarningTexts: function() {
        // Sonu�/uyar� alan�
        const resultEls = document.querySelectorAll('.result, .result-message, .warning-message, .alert-message');
        resultEls.forEach(el => {
            // 'S�re doldu!' veya 'Time is up!' gibi dille ilgili metinleri kontrol etmek yerine
            // i�erik ve s�n�f yap�s�na g�re tan�mlama yapal�m
            if (el.classList.contains('wrong') || el.textContent.includes('doldu') || el.textContent.includes('is up')) {
                // Do�ru cevap metni varsa onu koru
                const match = el.innerHTML.match(/<strong>(.*?)<\/strong>/);
                const answer = match ? match[1] : '';
                
                el.innerHTML = `${this.getTranslation('timeUp')} ${this.getTranslation('correctAnswer')}: <strong>${answer}</strong>
                    <button id="next-question" class="next-button">${this.getTranslation('next')}</button>`;
                
                // Sonraki butona olay dinleyici ekle
                const nextBtn = el.querySelector('#next-question');
                if (nextBtn) {
                    nextBtn.addEventListener('click', () => this.showNextQuestion());
                }
            }
        });
    },
    
    // Bo�luk doldurma kontrollerini devre d��� b�rak
    disableBlankFillingControls: function() {
        // Kontrol et butonunu devre d��� b�rak
        const checkButton = document.querySelector('.check-button');
        if (checkButton) {
            checkButton.disabled = true;
            checkButton.style.opacity = '0.5';
            checkButton.style.cursor = 'not-allowed';
        }
        
        // Temizle butonunu devre d��� b�rak
        const clearButton = document.querySelector('.clear-button');
        if (clearButton) {
            clearButton.disabled = true;
            clearButton.style.opacity = '0.5';
            clearButton.style.cursor = 'not-allowed';
        }
        
        // Sil butonunu devre d��� b�rak
        const deleteButton = document.querySelector('.delete-button');
        if (deleteButton) {
            deleteButton.disabled = true;
            deleteButton.style.opacity = '0.5';
            deleteButton.style.cursor = 'not-allowed';
        }
        
        // Harf butonlar�n� devre d��� b�rak
        const letterButtons = document.querySelectorAll('.letter-button');
        letterButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        });
    },
    
    // Kullan�c� verilerini y�kle
    loadUserData: function(userId) {
        if (!userId || !firebase.firestore) {
            console.log("Firebase firestore bulunamad� veya kullan�c� ID yok");
            return;
        }
        
        const db = firebase.firestore();
        
        db.collection('users').doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    console.log('Kullan�c� verileri y�klendi:', userData);
                    
                    // Kullan�c� verilerini uygula
                    this.totalScore = userData.totalScore || 0;
                    this.userLevel = userData.userLevel || 1;
                    this.levelProgress = userData.levelProgress || 0;
                    
                    // Puan g�stergesini g�ncelle
                    this.updateScoreDisplay();
                    this.updateTotalScoreDisplay();
                } else {
                    console.log('Yeni kullan�c�, varsay�lan veriler olu�turuluyor');
                    this.initializeNewUser(userId);
                }
            })
            .catch((error) => {
                console.error('Kullan�c� verileri y�klenirken hata:', error);
            });
    },
    
    // Yeni kullan�c� i�in varsay�lan veriler olu�tur
    initializeNewUser: function(userId) {
        if (!firebase.firestore) return;
        
        const db = firebase.firestore();
        const defaultUserData = {
            totalScore: 0,
            userLevel: 1,
            levelProgress: 0,
            createdAt: new Date(),
            lastPlayed: new Date()
        };
        
        db.collection('users').doc(userId).set(defaultUserData, { merge: true })
            .then(() => {
                console.log('Yeni kullan�c� verileri olu�turuldu');
                this.totalScore = 0;
                this.userLevel = 1;
                this.levelProgress = 0;
                this.updateTotalScoreDisplay();
            })
            .catch((error) => {
                console.error('Yeni kullan�c� verisi olu�turulurken hata:', error);
            });
    },
    
    // Kullan�c� verilerini kaydet
    saveUserData: function() {
        console.log('=== saveUserData �a�r�ld� ===');
        console.log('Giri� durumu:', this.isLoggedIn);
        console.log('Mevcut kullan�c�:', this.currentUser ? this.currentUser.uid : 'null');
        console.log('Firebase.firestore var m�:', firebase && firebase.firestore ? 'VAR' : 'YOK');
        
        if (!this.isLoggedIn || !this.currentUser || !firebase.firestore) {
            console.warn('Firebase kay�t atlan�yor - localStorage\'a kaydediliyor');
            // LocalStorage'a da kaydet (giri� yapmadan da skor tutulsun)
            this.saveScoreToLocalStorage();
            return;
        }
        
        const db = firebase.firestore();
        const userId = this.currentUser.uid;
        
        const updateData = {
            totalScore: this.totalScore,
            userLevel: this.userLevel,
            levelProgress: this.levelProgress,
            lastPlayed: new Date()
        };
        
        console.log('Firebase\'e kaydedilecek veriler:', updateData);
        console.log('Kullan�c� ID:', userId);
        
        // Firebase isteklerini sinirla - son kaydetme ile arasinda en az 3 saniye olmali
        const now = Date.now();
        if (this.lastFirebaseSave && (now - this.lastFirebaseSave) < 3000) {
            console.log('Firebase kay�t �ok s�k - localStorage\'a kaydediliyor');
            this.saveScoreToLocalStorage();
            return;
        }
        
        this.lastFirebaseSave = now;
        
        console.log('Firebase\'e kay�t ba�lat�l�yor...');
        
        db.collection('users').doc(userId).update(updateData)
            .then(() => {
                console.log('? Firebase\'e ba�ar�yla kaydedildi!');
                // Ayn� zamanda localStorage'a da kaydet (backup olarak)
                this.saveScoreToLocalStorage();
            })
            .catch((error) => {
                console.error('? Firebase kay�t hatas�:', error.code, error.message);
                
                // Hata loglar�n� azalt - sadece �nemli hatalar� logla
                if (error.code === 'not-found' || (error.message && error.message.includes('No document to update'))) {
                    console.log('Kullan�c� dok�man� yok - yeni olu�turuluyor...');
                    db.collection('users').doc(userId).set(updateData, { merge: true })
                        .then(() => {
                            console.log('? Yeni kullan�c� dok�man� olu�turuldu!');
                            this.saveScoreToLocalStorage();
                        })
                        .catch((err) => {
                            console.error('? Yeni dokuman olu�turma hatas�:', err.code, err.message);
                            this.saveScoreToLocalStorage();
                        });
                } else {
                    console.error('? Di�er Firebase hatas�:', error.code, error.message);
                    // Firebase hatas� durumunda localStorage'a kaydet
                    this.saveScoreToLocalStorage();
                }
            });
    },
    
    // localStorage'a skor kaydet (backup veya giri� yapmam�� kullan�c�lar i�in)
    saveScoreToLocalStorage: function() {
        try {
            const scoreData = {
                totalScore: this.totalScore,
                userLevel: this.userLevel,
                levelProgress: this.levelProgress,
                sessionScore: this.sessionScore,
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem('userScoreData', JSON.stringify(scoreData));
            console.log('Skor localStorage\'a kaydedildi:', scoreData);
        } catch (e) {
            console.error('localStorage\'a skor kaydedilirken hata:', e);
        }
    },
    
    // localStorage'dan skor y�kle
    loadScoreFromLocalStorage: function() {
        try {
            const scoreData = localStorage.getItem('userScoreData');
            if (scoreData) {
                const parsedData = JSON.parse(scoreData);
                
                // Sadece giri� yapmam�� kullan�c�lar i�in localStorage'dan y�kle
                if (!this.isLoggedIn) {
                    this.totalScore = parsedData.totalScore || 0;
                    this.userLevel = parsedData.userLevel || 1;
                    this.levelProgress = parsedData.levelProgress || 0;
                    this.sessionScore = parsedData.sessionScore || 0;
                    
                    console.log('Skor localStorage\'dan y�klendi:', parsedData);
                    this.updateTotalScoreDisplay();
                }
            }
        } catch (e) {
            console.error('localStorage\'dan skor y�klenirken hata:', e);
        }
    },
    
    // Puan ekle ve seviye kontrol� yap
    addScore: function(points) {
        const previousScore = this.score;
        const previousTotalScore = this.totalScore;
        const previousLevel = this.userLevel;
        
        // Mevcut oyun puan�n� g�ncelle
        this.score += points;
        this.sessionScore += points;
        
        // Firebase ba�lant� durumunu kontrol et
        console.log('Firebase Durum Kontrol�:', {
            isLoggedIn: this.isLoggedIn,
            currentUser: this.currentUser ? this.currentUser.uid : 'null',
            firebaseExists: typeof firebase !== 'undefined',
            firestoreExists: firebase && firebase.firestore ? true : false
        });
        
        // Giri� yap�lm��sa toplam puana ekle
        if (this.isLoggedIn) {
            this.totalScore += points;
            this.levelProgress += points;
            
            // Seviye kontrol� yap
            this.checkLevelUp();
            
            // Firebase kaydetmeyi geciktir (�ok s�k kay�t �nleme)
            this.delayedSaveUserData();
            
            console.log(`Firebase'e kay�t i�in bekleniyor: +${points} puan`);
        } else {
            console.warn('Kullan�c� giri� yapmam�� - sadece localStorage\'a kaydediliyor');
        }
        
        // G�r�nt�leri g�ncelle
        this.updateScoreDisplay();
        this.updateTotalScoreDisplay();
        
        console.log(`Puan eklendi: +${points} (Oyun: ${previousScore} � ${this.score}, Toplam: ${previousTotalScore} � ${this.totalScore})`);
    },
    
    // Geciktirilmi� kullan�c� verisi kaydetme (a��r� s�k istekleri �nlemek i�in)
    delayedSaveUserData: function() {
        // �nceki timeout'u temizle
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        
        // 2 saniye sonra kaydet (s�rekli istek yerine toplu kaydetme)
        this.saveTimeout = setTimeout(() => {
            this.saveUserData();
            this.saveTimeout = null;
        }, 2000);
    },
    
    // Seviye atlatma kontrol�
    checkLevelUp: function() {
        const requiredXP = this.getRequiredXPForNextLevel();
        
        if (this.levelProgress >= requiredXP) {
            const previousLevel = this.userLevel;
            this.userLevel++;
            this.levelProgress -= requiredXP;
            
            console.log(`Seviye atlad�! ${previousLevel} � ${this.userLevel}`);
            
            // Seviye atlama animasyonu kald�r�ld� (gereksiz modal)
        }
    },
    
    // Sonraki seviye i�in gerekli XP hesapla
    getRequiredXPForNextLevel: function() {
        // Seviye ba��na 100 * seviye kadar XP gerekir
        return this.userLevel * 100;
    },
    

    
    // Toplam puan g�stergesini g�ncelle
    updateTotalScoreDisplay: function() {
        // Yeni sadele�tirilmi� puan g�sterimi
        const totalScoreElement = document.getElementById('total-score-value');
        if (totalScoreElement) {
            const scoreValue = this.isLoggedIn ? this.totalScore : this.sessionScore;
            totalScoreElement.textContent = scoreValue;
        }
        
        // Profil sayfas�ndaki puan g�sterimini g�ncelle
        const profileTotalScore = document.getElementById('profile-total-score');
        if (profileTotalScore) {
            profileTotalScore.textContent = this.totalScore || 0;
        }
        
        // Profil sayfas�ndaki seviye g�sterimini g�ncelle
        const profileUserLevel = document.getElementById('profile-user-level');
        if (profileUserLevel) {
            const level = Math.floor((this.totalScore || 0) / 500) + 1;
            profileUserLevel.textContent = level;
        }
        
        // Eski puan g�sterimini de destekle (geriye uyumluluk i�in)
        const totalScoreElements = document.querySelectorAll('.total-score-display');
        totalScoreElements.forEach(element => {
            if (element && !element.closest('.game-header')) {
                const scoreValue = this.isLoggedIn ? this.totalScore : this.sessionScore;
                const levelText = this.isLoggedIn ? `Seviye ${this.userLevel}` : 'Misafir';
                
                element.innerHTML = `
                    <div class="total-score-info">
                        <div class="user-level">${levelText}</div>
                        <div class="user-total-score">Toplam: ${scoreValue}</div>
                        ${this.isLoggedIn ? `<div class="level-progress">XP: ${this.levelProgress}/${this.getRequiredXPForNextLevel()}</div>` : ''}
                    </div>
                `;
            }
        });
    },
    
    // Firebase'den en y�ksek skorlar� �ek
    loadFirebaseHighScores: function(category = null, limit = 10) {
        if (!firebase.firestore) {
            console.warn('Firebase Firestore kullan�lam�yor');
            return Promise.resolve([]);
        }
        
        const db = firebase.firestore();
        let query = db.collection('highScores')
            .orderBy('score', 'desc')
            .limit(limit);
        
        // Kategori filtresi varsa ekle
        if (category && category !== 'all') {
            query = query.where('category', '==', category);
        }
        
        return query.get()
            .then((querySnapshot) => {
                const highScores = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    highScores.push({
                        id: doc.id,
                        ...data,
                        // Tarih format�n� d�zelt
                        date: data.timestamp ? data.timestamp.toDate().toLocaleDateString() : data.date
                    });
                });
                
                console.log(`Firebase'den ${highScores.length} y�ksek skor �ekildi`);
                return highScores;
            })
            .catch((error) => {
                console.error('Firebase\'den y�ksek skorlar �ekilirken hata:', error);
                return [];
            });
    },
    
    // Kullan�c�n�n ki�isel en y�ksek skorlar�n� �ek
    loadUserPersonalScores: function(userId, limit = 10) {
        if (!firebase.firestore || !userId) {
            return Promise.resolve([]);
        }
        
        const db = firebase.firestore();
        
        return db.collection('users').doc(userId)
            .collection('personalScores')
            .orderBy('score', 'desc')
            .limit(limit)
            .get()
            .then((querySnapshot) => {
                const personalScores = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    personalScores.push({
                        id: doc.id,
                        ...data,
                        date: data.timestamp ? data.timestamp.toDate().toLocaleDateString() : data.date
                    });
                });
                
                console.log(`Kullan�c�n�n ${personalScores.length} ki�isel skoru �ekildi`);
                return personalScores;
            })
            .catch((error) => {
                console.error('Ki�isel skorlar �ekilirken hata:', error);
                return [];
            });
    },
    
    // Firebase'den kullan�c� istatistiklerini �ek ve senkronize et
    syncUserStatsFromFirebase: function() {
        if (!this.isLoggedIn || !firebase.firestore) {
            console.warn('syncUserStatsFromFirebase atland� - kullan�c� giri� yapmam�� veya Firebase yok');
            return Promise.resolve();
        }
        
        const db = firebase.firestore();
        const userId = this.currentUser.uid;
        
        console.log('Firebase\'den kullan�c� verileri �ekiliyor:', userId);
        
        return db.collection('users').doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    console.log('Firebase\'den �ekilen veri:', userData);
                    
                    // Puan verilerini senkronize et
                    if (userData.totalScore !== undefined) {
                        this.totalScore = userData.totalScore;
                    }
                    if (userData.userLevel !== undefined) {
                        this.userLevel = userData.userLevel;
                    }
                    if (userData.levelProgress !== undefined) {
                        this.levelProgress = userData.levelProgress;
                    }
                    
                    // G�r�nt�y� g�ncelle
                    this.updateTotalScoreDisplay();
                    
                    console.log('Firebase\'den kullan�c� verileri senkronize edildi:', {
                        totalScore: this.totalScore,
                        userLevel: this.userLevel,
                        levelProgress: this.levelProgress
                    });
                } else {
                    console.log('Kullan�c� dok�man� bulunamad� - yeni olu�turuluyor');
                    // Kullan�c� verisi yoksa yeni olu�tur
                    this.initializeNewUser(userId);
                }
            })
            .catch((error) => {
                console.error('Firebase\'den veri senkronizasyonu hatas�:', error);
            });
    },
    
    // Firebase ba�lant� durumunu kontrol et (debug ama�l�)
    checkFirebaseConnection: function() {
        console.log('=== Firebase Ba�lant� Kontrol� ===');
        console.log('1. Firebase nesnesi var m�:', typeof firebase !== 'undefined');
        console.log('2. Firebase.auth var m�:', firebase && firebase.auth ? 'VAR' : 'YOK');
        console.log('3. Firebase.firestore var m�:', firebase && firebase.firestore ? 'VAR' : 'YOK');
        console.log('4. Kullan�c� giri� yapm�� m�:', this.isLoggedIn);
        console.log('5. Mevcut kullan�c�:', this.currentUser ? this.currentUser.uid : 'YOK');
        
        if (firebase && firebase.auth) {
            const currentUser = firebase.auth().currentUser;
            console.log('6. Firebase.auth().currentUser:', currentUser ? currentUser.uid : 'YOK');
        }
        
        // Test kay�t yapma
        if (this.isLoggedIn && this.currentUser && firebase.firestore) {
            console.log('7. Test kay�t yap�l�yor...');
            const db = firebase.firestore();
            const testData = {
                test: true,
                timestamp: new Date(),
                message: 'Bu bir test kayd�d�r'
            };
            
            db.collection('users').doc(this.currentUser.uid).set(testData, { merge: true })
                .then(() => {
                    console.log('? Test kay�t ba�ar�l�!');
                })
                .catch((error) => {
                    console.error('? Test kay�t ba�ar�s�z:', error);
                });
        } else {
            console.log('7. Test kay�t atland� - gerekli �artlar sa�lanmad�');
        }
    }
};

// Bu mod�l� ba�lat
quizApp.init(); 

// QuizApp mod�l�n� global olarak eri�ilebilir yap
window.quizApp = quizApp;

// Debug fonksiyonlar�n� global eri�im i�in ekle
window.debugFirebase = function() {
    return quizApp.checkFirebaseConnection();
};

window.testFirebaseSave = function() {
    console.log('Manuel Firebase kay�t testi ba�lat�l�yor...');
    quizApp.addScore(10); // 10 puan ekle ve Firebase'e kaydet
};

window.showUserData = function() {
    console.log('=== Kullan�c� Veri Durumu ===');
    console.log('Giri� durumu:', quizApp.isLoggedIn);
    console.log('Toplam puan:', quizApp.totalScore);
    console.log('Seviye:', quizApp.userLevel);
    console.log('Mevcut kullan�c�:', quizApp.currentUser ? quizApp.currentUser.uid : 'YOK');
};

// Profil i�in debug fonksiyonlar�
window.debugProfile = {
    createTestData: () => quizApp.createTestData(),
    showProfile: () => quizApp.showProfilePage(),
    refreshProfile: () => quizApp.loadProfileData(),
    clearAllData: () => {
        localStorage.removeItem('quiz-high-scores');
        localStorage.removeItem('quiz-stats');
        localStorage.removeItem('quiz-user-stats');
        const userId = quizApp.getCurrentUserId();
        localStorage.removeItem(`user-badges-${userId}`);
        localStorage.removeItem(`user-profile-${userId}`);
        console.log('? T�m profil verileri temizlendi!');
    },
    getUserStats: () => {
        const stats = quizApp.calculateRealStats();
        console.log('?? Kullan�c� �statistikleri:', stats);
        return stats;
    },
    getBadges: () => {
        const userId = quizApp.getCurrentUserId();
        const badges = quizApp.badgeSystem.getUserBadges(userId);
        console.log('?? Kullan�c� Rozetleri:', badges);
        return badges;
    },
    testEditProfile: () => {
        // Profil d�zenleme modal�n� test et
        console.log('?? Profil d�zenleme modal� a��l�yor...');
        quizApp.showEditProfileModal();
    },
    testProfileData: () => {
        const userId = quizApp.getCurrentUserId();
        const profileData = {
            displayName: 'Test Kullan�c�s�',
            bio: 'Bu bir test biyografisidir.',
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(`user-profile-${userId}`, JSON.stringify(profileData));
        console.log('? Test profil verileri olu�turuldu:', profileData);
        
        // Profil sayfas�n� yenile
        if (document.getElementById('profile-container')) {
            quizApp.loadProfileData();
        }
    },
    checkProfileData: () => {
        const userId = quizApp.getCurrentUserId();
        const profileData = localStorage.getItem(`user-profile-${userId}`);
        console.log('?? Mevcut profil verileri:', profileData ? JSON.parse(profileData) : 'Veri yok');
        return profileData ? JSON.parse(profileData) : null;
    }
};

 
