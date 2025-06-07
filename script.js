// @ts-nocheck
/* eslint-disable */
// Bu dosya JavaScript'tir, TypeScript değildir.

// 🔒 GÜVENLİK: Production mode kontrolü
const PRODUCTION_MODE = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');

// 🔒 GÜVENLİ CONSOLE LOGGING
const secureLog = {
    info: function(message, data = null) {
        if (!PRODUCTION_MODE) {
            console.log(message, data);
        }
    },
    error: function(message, error = null) {
        if (!PRODUCTION_MODE) {
            console.error(message, error);
        }
    },
    warn: function(message, data = null) {
        if (!PRODUCTION_MODE) {
            console.warn(message, data);
        }
    }
};

// Console override - production modda tüm console çıktılarını gizle
if (PRODUCTION_MODE) {
    // Önce orijinal console'u sakla
    const originalConsole = { ...window.console };
    
    // Production modda console'ı override et
    window.console = {
        log: () => {},
        error: (msg, ...args) => {
            // Sadece kritik hataları göster
            if (msg && typeof msg === 'string' && msg.includes('KRITIK')) {
                originalConsole.error(msg, ...args);
            }
        },
        warn: () => {},
        info: () => {},
        debug: () => {},
        trace: () => {},
        clear: () => {},
        dir: () => {},
        group: () => {},
        groupEnd: () => {},
        time: () => {},
        timeEnd: () => {},
        count: () => {},
        assert: () => {},
        table: () => {},
        dirxml: () => {},
        profile: () => {},
        profileEnd: () => {}
    };
    
    // Console'u readonly yap
    Object.defineProperty(window, 'console', {
        value: window.console,
        writable: false,
        configurable: false
    });
}

// Sayfa Yükleme İşlemleri
document.addEventListener('DOMContentLoaded', () => {
    // Ana içeriği görünür yap
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
    totalScore: 0, // <-- EKLENDİ: Toplam birikmiş puan
    sessionScore: 0, // <-- EKLENDİ: Bu oturumdaki toplam puan
    userLevel: 1, // <-- EKLENDİ: Kullanıcı seviyesi
    levelProgress: 0, // <-- EKLENDİ: Seviye ilerlemesi (XP)
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
    currentSection: 1, // Şu anki bölüm numarası
    totalSections: 50, // Toplam bölüm sayısı
    sectionStats: [], // Her bölüm için doğru/yanlış cevap istatistiklerini saklayacak dizi
    currentLanguage: 'tr', // Varsayılan dil
    translatedQuestions: {}, // Çevrilmiş sorular
    isLoggedIn: false, // <-- EKLENDİ: Kullanıcı giriş durumu
    currentUser: null, // <-- EKLENDİ: Mevcut kullanıcı
    userSettings: {}, // <-- EKLENDİ: Kullanıcı ayarları
    totalScore: 0, // <-- EKLENDİ: Toplam puan
    sessionScore: 0, // <-- EKLENDİ: Oturum puanı
    userLevel: 1, // <-- EKLENDİ: Kullanıcı seviyesi
    levelProgress: 0, // <-- EKLENDİ: Seviye ilerlemesi
    
    // Constants
    HIGH_SCORES_KEY: 'quizHighScores',
    MAX_HIGH_SCORES: 5,
    TIME_PER_QUESTION: 45,
    TIME_PER_BLANK_FILLING_QUESTION: 60,
    SEEN_QUESTIONS_KEY: 'quizSeenQuestions',
    QUESTIONS_PER_GAME: 50,
    STATS_KEY: 'quizStats',
    USER_SETTINGS_KEY: 'quizSettings',
    JOKER_INVENTORY_KEY: 'quizJokerInventory',
    LANGUAGE_KEY: 'quizLanguage',
    
    // Başlangıç
    init: function() {
        secureLog.info("Quiz Uygulaması Başlatılıyor...");
        
        // Tarayıcı özelliklerini kontrol et
        this.checkBrowserSupport();
        
        try {
            // Önce dil ayarlarını yükle
            this.loadLanguageSettings();
            
            // Kullanıcı arayüzünü hazırla
            this.initUI();
            
            // Önce kullanıcı ayarlarını yükle
            this.loadUserSettings();
            
            // localStorage'dan skor verilerini yükle
            this.loadScoreFromLocalStorage();
            
            // Soru verilerini yükle
            this.loadQuestionsData()
                .then(() => {
                    console.log("Tüm veriler başarıyla yüklendi.");
                    
                    // Soru verilerinin yüklenip yüklenmediğini kontrol et
                    if (!this.questionsData || Object.keys(this.questionsData).length === 0) {
                        console.error("Soru verileri yüklenemedi veya boş!");
                        
                        // Tekrar yüklemeyi dene
                        this.loadQuestionsData()
                            .then(() => {
                                console.log("İkinci deneme: Soru verileri yüklendi");
                            })
                            .catch(err => {
                                console.error("İkinci deneme başarısız:", err);
                                this.showAlert(this.getTranslation('questionLoadError'));
                            });
                    }
                    
                    // Soruları çevir
                    this.translateQuestions();
                })
                .catch(error => {
                    console.error("Soru verileri yüklenirken hata oluştu:", error);
                });
        } catch (error) {
            console.error("Başlatma sırasında kritik hata:", error);
        }
    },
    
    // Mevcut dil için metni getir
    getTranslation: function(key) {
        try {
            // Dil dosyası import edilmiş mi kontrol et
            if (typeof languages === 'undefined') {
                SecurityConfig.secureLog.warn('Dil dosyası yüklenemedi. Varsayılan metin gösteriliyor.');
                return this.getDefaultTranslation(key);
            }
            
            // Mevcut dil için çeviri var mı?
            if (languages[this.currentLanguage] && languages[this.currentLanguage][key] !== undefined) {
                return languages[this.currentLanguage][key];
            }
            
            // Türkçe varsayılan dil olarak kullanılır
            if (languages.tr && languages.tr[key] !== undefined) {
                return languages.tr[key];
            }
            
            // Çeviri bulunamazsa, anahtarı döndür
            console.warn(`'${key}' için çeviri bulunamadı.`);
            return key;
        } catch (error) {
            console.error('Çeviri alınırken hata oluştu:', error);
            return this.getDefaultTranslation(key);
        }
    },
    
    // Varsayılan çevirileri döndür
    getDefaultTranslation: function(key) {
        // Sık kullanılan metinler için varsayılan değerler
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
    
    // Dil ayarlarını yükle
    loadLanguageSettings: function() {
        try {
            // Local storage'dan tercihler ekranında seçilen dili kontrol et
            const userLanguage = localStorage.getItem('user_language');
            
            if (userLanguage && ['tr', 'en', 'de'].includes(userLanguage)) {
                this.currentLanguage = userLanguage;
                console.log(`Kullanıcı tercih ettiği dil: ${this.currentLanguage}`);
                
                // HTML dil etiketini güncelle
                document.documentElement.setAttribute('lang', this.currentLanguage);
                document.documentElement.setAttribute('data-language', this.currentLanguage);
            } else {
                // Kaydedilmiş dil ayarı varsa yükle
                const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY);
                if (savedLanguage && ['tr', 'en', 'de'].includes(savedLanguage)) {
                    this.currentLanguage = savedLanguage;
                    console.log(`Kaydedilmiş dil ayarı: ${this.currentLanguage}`);
                } else {
                    // Tarayıcı dilini kontrol et
                    const browserLang = navigator.language || navigator.userLanguage;
                    if (browserLang) {
                        const lang = browserLang.substring(0, 2).toLowerCase();
                        
                        // Desteklenen diller
                        if (['tr', 'en', 'de'].includes(lang)) {
                            this.currentLanguage = lang;
                        } else {
                            // Desteklenmeyen dil durumunda varsayılan olarak İngilizce
                            this.currentLanguage = 'en';
                        }
                        
                        console.log(`Tarayıcı dili: ${browserLang}, Uygulama dili: ${this.currentLanguage}`);
                    }
                }
            }
            
            // Dil değiştirme elementini oluştur
            this.createLanguageSelector();
        } catch (e) {
            console.error("Dil ayarları yüklenirken hata:", e);
            this.currentLanguage = 'tr'; // Hata durumunda varsayılan dil
        }
    },
    
    // Dil seçici oluştur
    createLanguageSelector: function() {
        // Menüde zaten bir dil seçici olduğu için sayfa üzerinde ekstra bir dil seçici oluşturmuyoruz
        console.log("Menüde zaten dil seçim alanı bulunduğu için ek bir dil seçici oluşturulmadı");
        return;
    },
    
    // Dili değiştir
    switchLanguage: function(language) {
        if (this.currentLanguage === language) return;
        
        console.log(`Dil değiştiriliyor: ${this.currentLanguage} -> ${language}`);
        
        // Dili kaydet
        this.currentLanguage = language;
        localStorage.setItem(this.LANGUAGE_KEY, language);
        localStorage.setItem('quizLanguage', language); // Eski referans için uyumluluk
        
        // HTML etiketinin dil özelliklerini güncelle
        const htmlRoot = document.getElementById('html-root') || document.documentElement;
        htmlRoot.setAttribute('lang', language);
        htmlRoot.setAttribute('data-language', language);
        
        // Soru verilerini yeniden yükle
        this.loadQuestionsData()
            .then(() => {
                console.log("Dil değişikliği sonrası yeni soru verileri yüklendi");
                
                // UI metinlerini güncelle
                this.updateUITexts();
                
                // Dil değişikliği olayını tetikle - bu, diğer modüllerin çevirilerini güncellemesini sağlar
                document.dispatchEvent(new Event('languageChanged'));
                
                // Eğer aktif bir kategori varsa ve sorular gösteriliyorsa, soruları güncelle
                if (this.selectedCategory && this.quizElement && this.quizElement.style.display !== 'none') {
                    // Kategorileri yeniden göster (mevcut dildeki kategorileri göstermek için)
                    this.displayCategories();
                    
                    // Seçili kategori adını kontrol et ve mevcut dildeki karşılığını bul
                    const translatedCategoryName = this.getCurrentCategoryName(this.selectedCategory);
                    
                    if (this.questionsData[translatedCategoryName]) {
                        // Kategori mevcut dildeki sorularla güncellenir
                        this.selectedCategory = translatedCategoryName;
                        
                        // Soruları güncelle
                        this.questions = this.shuffleArray([...this.questionsData[this.selectedCategory]]);
                        this.arrangeBlankFillingFirst();
                        
                        // Mevcut soruyu sıfırla ve ilk soruyu göster
                        this.currentQuestionIndex = 0;
                        this.displayQuestion(this.questions[0]);
                    }
                }
                
                // Mevcut gösterilen içeriği güncelle
                this.updateCurrentContent();
                
                // Dil değişikliğini kullanıcıya bildir
                this.showToast(this.getTranslation('languageChanged'), 'toast-success');
                this.updateResultAndWarningTexts();
            })
            .catch(error => {
                console.error("Dil değişikliği sonrası soru verileri yüklenirken hata:", error);
                this.showToast("Sorular yüklenirken bir hata oluştu", "toast-error");
            });
    },
    
    // Soruları çevir
    translateQuestions: function() {
        if (!this.questionsData || Object.keys(this.questionsData).length === 0) {
            console.warn('Çevrilecek soru verisi bulunamadı.');
            return;
        }
        
        if (this.currentLanguage === 'tr') {
            // Türkçe için çeviriye gerek yok, orijinal soruları kullan
            this.translatedQuestions = this.cloneObject(this.questionsData);
            // Mevcut soruları güncelle
            this.updateCurrentQuestionsWithTranslations();
            return;
        }
        
        // Çevrilmiş sorular zaten varsa ve geçerli dilde ise tekrar çevirme
        if (this.hasTranslatedQuestions(this.currentLanguage)) {
            console.log(`${this.currentLanguage} dilinde çevrilmiş sorular zaten mevcut, tekrar çevirme işlemi yapılmayacak.`);
            
            // Mevcut soruları güncelle
            this.updateCurrentQuestionsWithTranslations();
            return;
        }
        
        console.log(`Sorular ${this.currentLanguage} diline çevriliyor...`);
        
        // Boş çeviri nesnesini oluştur
        this.translatedQuestions = {};
        
        // Her kategori için
        Object.keys(this.questionsData).forEach(categoryTR => {
            // Kategori adını çevir
            const translatedCategoryName = this.getTranslatedCategoryName(categoryTR, this.currentLanguage);
            this.translatedQuestions[translatedCategoryName] = [];
            
            // Kategorideki her soru için
            this.questionsData[categoryTR].forEach(questionObj => {
                // Soru nesnesinin kopyasını oluştur
                const translatedQuestion = this.cloneObject(questionObj);
                
                // Translations özelliği varsa ve istenen dilde çeviri varsa kullan
                if (questionObj.translations && questionObj.translations[this.currentLanguage]) {
                    const translation = questionObj.translations[this.currentLanguage];
                    if (translation.question) translatedQuestion.question = translation.question;
                    if (translation.options) translatedQuestion.options = translation.options;
                    if (translation.correctAnswer) translatedQuestion.correctAnswer = translation.correctAnswer;
                } else {
                    // Soru metnini ve şıkları çevir (otomatik çeviri yerine özelleştirilmiş metin)
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
                        
                        // Doğru/Yanlış soruları için
                        if (translatedQuestion.type === "DoğruYanlış" || translatedQuestion.type === "TrueFalse") {
                            translatedQuestion.type = "TrueFalse";
                            
                            if (translatedQuestion.correctAnswer === "DOĞRU" || translatedQuestion.correctAnswer === "YANLIŞ") {
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
                        
                        // Doğru/Yanlış soruları için
                        if (translatedQuestion.type === "DoğruYanlış" || translatedQuestion.type === "TrueFalse") {
                            translatedQuestion.type = "TrueFalse";
                            
                            if (translatedQuestion.correctAnswer === "DOĞRU" || translatedQuestion.correctAnswer === "YANLIŞ") {
                                translatedQuestion.correctAnswer = trueFalseMapping[translatedQuestion.correctAnswer].de;
                            }
                        }
                    }
                }
                
                // Kategori adını güncelle
                translatedQuestion.category = translatedCategoryName;
                
                // Boşluk doldurma soruları için
                if (translatedQuestion.type === "BlankFilling" && translatedQuestion.choices) {
                    // Harfleri çevir (örneğin Almanca'da ö, ü gibi harfler için)
                    translatedQuestion.choices = this.translateChoices(questionObj.choices, this.currentLanguage);
                }
                
                // Çevrilmiş soruyu kategoriye ekle
                this.translatedQuestions[translatedCategoryName].push(translatedQuestion);
            });
        });
        
        console.log(`Soru çevirisi tamamlandı. ${Object.keys(this.translatedQuestions).length} kategori çevrildi.`);
        
        // Mevcut soruları güncelle
        this.updateCurrentQuestionsWithTranslations();
    },
    
    // Çevrilmiş sorular var mı kontrol et
    hasTranslatedQuestions: function(language) {
        // Çevrilmiş sorular boşsa veya dil Türkçe ise kontrol etmeye gerek yok
        if (language === 'tr' || !this.translatedQuestions) {
            return false;
        }
        
        // Çevrilmiş soruların içinde en az bir kategori var mı?
        const hasCategories = Object.keys(this.translatedQuestions).length > 0;
        
        if (hasCategories) {
            // Rastgele bir kategori seç
            const sampleCategory = Object.keys(this.translatedQuestions)[0];
            
            // Bu kategoride soru var mı?
            const hasQuestions = this.translatedQuestions[sampleCategory] && 
                                this.translatedQuestions[sampleCategory].length > 0;
            
            if (hasQuestions) {
                // Rastgele bir soru seç
                const sampleQuestion = this.translatedQuestions[sampleCategory][0];
                
                // Bu soru çevrilmiş mi? (Kategori adını kontrol et)
                // Türkçe kategorinin çevrilmiş adıyla karşılaştır
                const originalCategoryName = Object.keys(this.questionsData)[0]; // İlk Türkçe kategori
                const expectedTranslatedName = this.getTranslatedCategoryName(originalCategoryName, language);
                
                // Çevirinin doğru dilde olup olmadığını kontrol et
                return sampleCategory === expectedTranslatedName;
            }
        }
        
        return false;
    },
    
    // Mevcut soruları çevirilerle güncelle
    updateCurrentQuestionsWithTranslations: function() {
        // Eğer bir kategori seçilmişse ve sorular yüklenmişse, mevcut soruları da güncelle
        if (this.selectedCategory && this.questions.length > 0) {
            console.log(`Seçili kategori: ${this.selectedCategory}`);
            
            // Mevcut sorular dil değişiminden sonra güncellenecek
            const translatedCategoryName = this.getCurrentCategoryName(this.selectedCategory);
            
            console.log(`Seçili kategori: ${this.selectedCategory}, Çevrilmiş adı: ${translatedCategoryName}`);
            
            // Çevrilmiş kategorideki soruları al
            const translatedCategoryQuestions = this.currentLanguage === 'tr' ? 
                this.questionsData[translatedCategoryName] : 
                this.translatedQuestions[translatedCategoryName];
            
            if (translatedCategoryQuestions) {
                console.log(`${translatedCategoryName} kategorisinde ${translatedCategoryQuestions.length} çevrilmiş soru bulundu.`);
                
                // Soruları güncelle
                this.questions = this.shuffleArray([...translatedCategoryQuestions]);
                this.arrangeBlankFillingFirst();
                
                // Mevcut soruyu güncelle
                if (this.currentQuestionIndex < this.questions.length) {
                    this.displayQuestion(this.questions[this.currentQuestionIndex]);
                }
            } else {
                console.warn(`${translatedCategoryName} kategorisinde çevrilmiş soru bulunamadı!`);
            }
        }
    },
    
    // Nesne kopyalama (deep clone)
    cloneObject: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // Kategori adını çevir
    getTranslatedCategoryName: function(categoryTR, targetLang) {
        if (categoryMappings[categoryTR] && categoryMappings[categoryTR][targetLang]) {
            return categoryMappings[categoryTR][targetLang];
        }
        
        // Eşleşme yoksa orijinal kategori adını döndür
        return categoryTR;
    },
    
    // UI elemanlarını güncelle
    updateUITexts: function() {
        // Başlık
        document.title = this.getTranslation('appName');
        
        // Navbar başlığı
        const navbarTitle = document.querySelector('.navbar-title');
        if (navbarTitle) navbarTitle.textContent = this.getTranslation('appName');
        const appTitle = document.querySelector('.app-title');
        if (appTitle) appTitle.textContent = this.getTranslation('appName');
        const mainTitle = document.querySelector('.main-title');
        if (mainTitle) mainTitle.textContent = this.getTranslation('appName');
        
        // Yan menü (sidebar) metinleri
        const sidebarHome = document.querySelector('.sidebar-home');
        if (sidebarHome) sidebarHome.textContent = this.getTranslation('home');
        const sidebarFriends = document.querySelector('.sidebar-friends');
        if (sidebarFriends) sidebarFriends.textContent = this.getTranslation('friends');
        const sidebarLeaderboard = document.querySelector('.sidebar-leaderboard');
        if (sidebarLeaderboard) sidebarLeaderboard.textContent = this.getTranslation('leaderboardMenu');
        
        // Ana menü başlığı
        const menuTitle = document.querySelector('.menu-title');
        if (menuTitle) {
            menuTitle.textContent = this.getTranslation('quiz');
        }
        
        // Quiz başlığı (soru ekranı üstü)
        const quizHeader = document.querySelector('#quiz h2');
        if (quizHeader) {
            quizHeader.textContent = this.getTranslation('quiz');
        }
        
        // Çıkış butonu kaldırıldı
        
        // Ana menü butonları
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
        // Logout butonu kaldırıldı
        
        // Kategori başlığı
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
        
        // Yeniden başlat butonu
        if (this.restartButton) {
            this.restartButton.textContent = this.getTranslation('restart');
        }
        
        // Joker butonları
        this.updateJokerButtonsText();
        
        // Dil etiketi
        const langLabel = document.getElementById('language-label');
        if (langLabel) {
            langLabel.textContent = this.getTranslation('language') + ':';
        }
        
        // Hamburger menü öğeleri - Yeni ID'ler ile güncelleme
        const appTitleElement = document.getElementById('menu-app-title');
        if (appTitleElement) {
            appTitleElement.textContent = this.getTranslation('app');
        }
        
        const settingsTitleElement = document.getElementById('menu-settings-title');
        if (settingsTitleElement) {
            settingsTitleElement.textContent = this.getTranslation('settings');
        }
        
        // Menü öğeleri metinleri
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
        
        // data-i18n özniteliği olan tüm elemanları güncelle
        const i18nElements = document.querySelectorAll('[data-i18n]');
        i18nElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key && languages[this.currentLanguage] && languages[this.currentLanguage][key]) {
                element.textContent = languages[this.currentLanguage][key];
            }
        });
        

    },
    
    // Joker butonları metinlerini güncelle
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
    
    // Mevcut içeriği güncelle
    updateCurrentContent: function() {
        // Ana menü butonları ve diğer UI elemanlarını güncelle
        this.updateUITexts();
        
        // Hangi sayfa görünürse onu güncelle
        if (this.categorySelectionElement && this.categorySelectionElement.style.display !== 'none') {
            // Kategori seçim ekranı görünüyorsa
            this.displayCategories();
        } else if (this.quizElement && this.quizElement.style.display !== 'none' && this.questions.length > 0) {
            // Quiz ekranı görünüyorsa
            if (this.resultElement && this.resultElement.style.display !== 'none') {
                // Sonuç gösteriliyorsa sonuç metnini güncelle
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
                // Aktif soru varsa yeniden yükle
                this.displayQuestion(this.questions[this.currentQuestionIndex]);
            }
        }
        this.updateResultAndWarningTexts();
    },
    
    // Basit çeviri fonksiyonları (gerçek bir projede daha profesyonel bir çözüm kullanılmalıdır)
    translateToEnglish: function(text) {
        // Boş metin kontrolü
        if (!text) return '';
        
        // Bu sadece basit bir örnektir - gerçek projede buraya özelleştirilmiş çeviri eklenebilir
        // Not: Gerçek bir uygulamada burada önceden hazırlanmış çeviriler veya API kullanılabilir
        return text; // Şu an için orijinal metni koruyoruz
    },
    
    translateToGerman: function(text) {
        // Boş metin kontrolü
        if (!text) return '';
        
        // Almanca çeviri - bu basit bir örnek
        return text; // Şu an için orijinal metni koruyoruz
    },
    
    // Boşluk doldurma için harfleri çevir
    translateChoices: function(choices, targetLang) {
        if (!choices) return [];
        
        // Bu fonksiyon özellikle Almanca gibi dillerde ö, ü, ß gibi harfler için kullanılabilir
        // Şu an için orijinal harfleri koruyoruz
        return choices;
    },
    
    // Mevcut dil için geçerli kategori adını al
    getCurrentCategoryName: function(originalCategory) {
        if (this.currentLanguage === 'tr') return originalCategory;
        
        // Türkçe kategori adı mı kontrol et
        if (categoryMappings[originalCategory] && categoryMappings[originalCategory][this.currentLanguage]) {
            return categoryMappings[originalCategory][this.currentLanguage];
        }
        
        // Bu kategori adı zaten çevrilmiş bir isim mi kontrol et
        if (reverseCategoryMappings[originalCategory] && 
            reverseCategoryMappings[originalCategory]['tr']) {
            return originalCategory; // Zaten çevrilmiş durumda, aynen döndür
        }
        
        // Burada eğer kategori çevrilmiş bir isimse, mevcut dilde doğru versiyonunu bul
        for (const [sourceCat, translations] of Object.entries(reverseCategoryMappings)) {
            // Eğer bu bir yabancı kategori adıysa ve bizim istediğimiz dilde bir karşılığı varsa
            if (sourceCat === originalCategory && translations[this.currentLanguage]) {
                return translations[this.currentLanguage];
            }
        }
        
        // Hiçbir eşleşme bulunamazsa orijinal kategori adını döndür
        return originalCategory;
    },
    
    // Toast mesajı göster
    showToast: function(message, type = 'toast-info') {
        // Toast container'ı kontrol et veya oluştur
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Yeni toast oluştur
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // İkon ekle
        let icon = '<i class="fas fa-info-circle"></i>';
        if (type === 'toast-success') icon = '<i class="fas fa-check-circle"></i>';
        if (type === 'toast-warning') icon = '<i class="fas fa-exclamation-triangle"></i>';
        if (type === 'toast-error') icon = '<i class="fas fa-times-circle"></i>';
        
        // Toast içeriği
        toast.innerHTML = `
            <div class="toast-content">
                ${icon}
                <span>${message}</span>
            </div>
        `;
        
        // Toast'u ekle
        toastContainer.appendChild(toast);
        
        // Toast'u göster
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Toast'u belirli bir süre sonra kaldır
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    },
    
    // Tarayıcı desteğini kontrol et
    checkBrowserSupport: function() {
        console.log("Tarayıcı özellikleri kontrol ediliyor...");
        
        // localStorage desteği
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
            console.error("localStorage erişilemez:", e);
            hasLocalStorage = false;
        }
        
        // Fetch API desteği
        const hasFetch = 'fetch' in window;
        console.log("Fetch API desteği:", hasFetch);
        
        // Firebase SDK varlığı
        const hasFirebase = typeof firebase !== 'undefined' && firebase.app;
        console.log("Firebase SDK durumu:", hasFirebase ? "Yüklü" : "Yüklü değil");
        
        // JSON işleme desteği
        const hasJSON = typeof JSON !== 'undefined' && typeof JSON.parse === 'function';
        console.log("JSON desteği:", hasJSON);
        
        // Eksik özellikler varsa kullanıcıyı bilgilendir
        if (!hasLocalStorage || !hasFetch || !hasJSON) {
            console.warn("Bazı tarayıcı özellikleri eksik, uygulama sınırlı çalışabilir");
            // Uyarı mesajı göster
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
            
            // Kapat butonuna tıklama olayı
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
    
    // Joker envanterini yükle
    loadJokerInventory: function() {
        console.log('Joker envanteri yükleniyor...');
        console.log('localStorage anahtarı:', this.JOKER_INVENTORY_KEY);
        
        var inventoryJSON = localStorage.getItem(this.JOKER_INVENTORY_KEY);
        console.log('localStorage\'dan alınan veri:', inventoryJSON);
        
        if (inventoryJSON && inventoryJSON !== 'null' && inventoryJSON !== 'undefined') {
            try {
                const parsed = JSON.parse(inventoryJSON);
                
                // Geçerli bir obje ve tüm joker türleri var mı kontrol et
                if (parsed && typeof parsed === 'object' && 
                    parsed.hasOwnProperty('fifty') && 
                    parsed.hasOwnProperty('hint') && 
                    parsed.hasOwnProperty('time') && 
                    parsed.hasOwnProperty('skip')) {
                    
                    this.jokerInventory = parsed;
                    console.log("Joker envanteri başarıyla yüklendi:", this.jokerInventory);
                } else {
                    console.warn("Geçersiz joker envanteri formatı, varsayılan envanter atanıyor");
                    this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
                    this.saveJokerInventory();
                }
            } catch (e) {
                console.error("Joker envanteri yüklenirken hata oluştu:", e);
                this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
                this.saveJokerInventory();
                console.log("Varsayılan envanter atandı:", this.jokerInventory);
            }
        } else {
            // İlk kez çalıştırılıyorsa veya geçersiz veri varsa her joker türünden birer tane ver
            console.log("İlk kez çalıştırılıyor veya geçersiz veri, varsayılan envanter oluşturuluyor...");
            this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
            this.saveJokerInventory();
        }
        
        // Negatif değerleri önle
        Object.keys(this.jokerInventory).forEach(key => {
            if (this.jokerInventory[key] < 0) {
                this.jokerInventory[key] = 0;
            }
        });
        
        // Final kontrol
        console.log('loadJokerInventory tamamlandı, final envanter:', this.jokerInventory);
    },
    
    // Joker envanterini kaydet
    saveJokerInventory: function() {
        try {
            localStorage.setItem(this.JOKER_INVENTORY_KEY, JSON.stringify(this.jokerInventory));
            console.log("Joker envanteri kaydedildi:", this.jokerInventory);
            
            // Kaydetmenin başarılı olup olmadığını kontrol et
            var saved = localStorage.getItem(this.JOKER_INVENTORY_KEY);
            if (saved) {
                var parsedSaved = JSON.parse(saved);
                console.log("Kaydedilen veri doğrulandı:", parsedSaved);
            } else {
                console.error("Joker envanteri kaydedilemedi!");
            }
        } catch (e) {
            console.error("Joker envanteri kaydedilirken hata oluştu:", e);
        }
    },
    
    // Joker butonlarına olay dinleyicileri ekle
    addJokerEventListeners: function() {
        console.log('addJokerEventListeners çağrıldı...');
        
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
        
        // 50:50 jokeri
        if (this.jokerFiftyBtn) {
            this.jokerFiftyBtn.addEventListener('click', () => {
                if (this.jokerFiftyBtn.disabled) return;
                
                console.log('50:50 joker kullanılıyor...');
                
                // Mevcut sorunun doğru cevabını al
                const currentQuestion = this.questions[this.currentQuestionIndex];
                const correctAnswer = currentQuestion.correctAnswer;
                
                // BlankFilling sorularında 50:50 joker kullanılamaz
                if (currentQuestion.type === "BlankFilling") {
                    console.warn('BlankFilling sorularında 50:50 joker kullanılamaz');
                    this.showToast("Boşluk doldurma sorularında 50:50 joker kullanılamaz!", "toast-warning");
                    return;
                }
                
                // DoğruYanlış sorularında da 50:50 joker kullanılamaz
                if (currentQuestion.type === "DoğruYanlış" || currentQuestion.type === "TrueFalse") {
                    console.warn('Doğru/Yanlış sorularında 50:50 joker kullanılamaz');
                    this.showToast("Doğru/Yanlış sorularında 50:50 joker kullanılamaz!", "toast-warning");
                    return;
                }
                
                console.log('Doğru cevap:', correctAnswer);
                
                // Tüm seçenekleri al (.option class'ına sahip olanlar)
                const options = document.querySelectorAll('.option');
                console.log('Bulunan seçenekler:', options.length);
                
                if (options.length < 3) {
                    console.warn('Yeterli seçenek yok, 50:50 joker kullanılamaz');
                    this.showToast("Bu soru tipinde 50:50 joker kullanılamaz!", "toast-warning");
                    return;
                }
                
                // Yanlış şıkları bul
                const wrongOptions = Array.from(options).filter(option => {
                    const optionText = option.textContent.trim().toLowerCase();
                    const correctText = correctAnswer.trim().toLowerCase();
                    // Zaten devre dışıysa veya görünmüyorsa dahil etme
                    if (
                        option.disabled ||
                        option.classList.contains('disabled-option') ||
                        option.style.opacity === '0.3' ||
                        option.offsetParent === null // Ekranda görünmüyorsa
                    ) return false;
                    return optionText !== correctText;
                });
                
                console.log('Yanlış seçenekler:', wrongOptions.length);
                
                if (wrongOptions.length < 2) {
                    console.warn('Yeterli yanlış seçenek yok');
                    this.showToast("Bu soruda yeterli yanlış seçenek yok!", "toast-warning");
                    return;
                }
                
                // İki yanlış şıkkı rastgele seç
                const shuffledWrong = this.shuffleArray([...wrongOptions]);
                const toHide = shuffledWrong.slice(0, 2);
                
                console.log('Söndürülecek seçenekler:', toHide.length);
                
                // Seçili şıkları söndür
                toHide.forEach(option => {
                    option.style.opacity = '0.3';
                    option.style.pointerEvents = 'none';
                    option.style.background = '#f0f0f0';
                    option.style.color = '#999';
                    option.classList.add('disabled-option');
                });
                
                // Jokeri kullan
                this.useJoker('fifty');
                
                // Ses efekti çal
                if (this.soundEnabled) {
                    const fiftySound = document.getElementById('sound-correct');
                    if (fiftySound) fiftySound.play().catch(e => {
                        console.error("Ses çalınamadı:", e);
                    });
                }
                
                // Joker butonlarını güncelle
                this.updateJokerButtons();
                
                // Toast bildirimi göster
                this.showToast("50:50 jokeri kullanıldı! İki yanlış şık söndürüldü.", "toast-success");
            });
        }
        
        // İpucu jokeri
        if (this.jokerHintBtn) {
            this.jokerHintBtn.addEventListener('click', () => {
                if (this.jokerHintBtn.disabled) return;
                
                console.log('İpucu joker kullanılıyor...');
                
                // Mevcut soru için bir ipucu göster
                const currentQuestion = this.questions[this.currentQuestionIndex];
                let hint = '';
                
                // İpucu oluştur - farklı soru tiplerine göre
                if (currentQuestion.category === "Boşluk Doldurma" || currentQuestion.type === "BlankFilling") {
                    hint = "İpucu: Cevabın ilk harfi \"" + currentQuestion.correctAnswer.charAt(0) + "\" ";
                    if (currentQuestion.correctAnswer.length > 3) {
                        hint += "ve son harfi \"" + currentQuestion.correctAnswer.charAt(currentQuestion.correctAnswer.length - 1) + "\"";
                    }
                } else {
                    const correctAnswer = currentQuestion.correctAnswer;
                    // Cevabın ilk ve varsa son harfini ipucu olarak ver
                    hint = "İpucu: Doğru cevabın ilk harfi \"" + correctAnswer.charAt(0) + "\" ";
                    if (correctAnswer.length > 3) {
                        hint += "ve son harfi \"" + correctAnswer.charAt(correctAnswer.length - 1) + "\"";
                    }
                }
                
                console.log('Oluşturulan ipucu:', hint);
                
                // İpucunu göster
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
                
                // İpucu mesajını ekleme
                const questionElement = document.getElementById('question');
                if (questionElement && questionElement.parentNode) {
                    // Eski ipucu mesajını kaldır
                    const oldHint = document.querySelector('.hint-message');
                    if (oldHint) oldHint.remove();
                    
                    // Yeni ipucunu ekle
                    questionElement.parentNode.insertBefore(hintElement, questionElement.nextSibling);
                    console.log('İpucu mesajı DOM\'a eklendi');
                }
                
                // Jokeri kullan
                this.useJoker('hint');
                
                // Ses efekti çal
                if (this.soundEnabled) {
                    const hintSound = document.getElementById('sound-correct');
                    if (hintSound) hintSound.play().catch(e => {
                        console.error("Ses çalınamadı:", e);
                    });
                }
                
                // Joker butonlarını güncelle
                this.updateJokerButtons();
                
                // Toast bildirimi göster
                this.showToast("İpucu jokeri kullanıldı! " + hint, "toast-success");
            });
        }
        
        // +Süre jokeri
        if (this.jokerTimeBtn) {
            this.jokerTimeBtn.addEventListener('click', () => {
                if (this.jokerTimeBtn.disabled) return;
                
                console.log('Süre joker kullanılıyor...');
                console.log('Kullanım öncesi süre:', this.timeLeft);
                
                // Mevcut sorunun süresini 15 saniye uzat
                this.timeLeft += 15;
                
                console.log('Kullanım sonrası süre:', this.timeLeft);
                
                // Süre göstergesini güncelle
                this.updateTimeDisplay();
                
                // Zamanın azaldığını belirten sınıfı kaldır
                if (this.timeLeftElement && this.timeLeftElement.classList.contains('time-low')) {
                    this.timeLeftElement.classList.remove('time-low');
                }
                
                // Jokeri kullan
                this.useJoker('time');
                
                // Ses efekti çal
                if (this.soundEnabled) {
                    const timeSound = document.getElementById('sound-correct');
                    if (timeSound) timeSound.play().catch(e => {
                        console.error("Ses çalınamadı:", e);
                    });
                }
                
                // Joker butonlarını güncelle
                this.updateJokerButtons();
                
                // Toast bildirimi göster
                this.showToast("Süre jokeri kullanıldı! 15 saniye eklendi. Yeni süre: " + this.timeLeft + " saniye", "toast-success");
            });
        }
        
        // Pas jokeri
        if (this.jokerSkipBtn) {
            this.jokerSkipBtn.addEventListener('click', () => {
                if (this.jokerSkipBtn.disabled) return;
                
                console.log('Pas joker kullanılıyor...');
                console.log('Pas joker kullanım öncesi envanter:', JSON.stringify(this.jokerInventory));
                
                // Joker envanterini kontrol et
                if (this.jokerInventory.skip <= 0) {
                    console.warn('Pas joker envanteri boş!');
                    this.showToast("Pas jokeriniz kalmadı!", "toast-warning");
                    return;
                }
                
                // Süreyi sıfırlamak yerine doğrudan sonraki soruya geçiş yapalım
                clearInterval(this.timerInterval);
                
                // Ses efekti çal
                if (this.soundEnabled) {
                    const skipSound = document.getElementById('sound-correct');
                    if (skipSound) skipSound.play().catch(e => {
                        console.error("Ses çalınamadı:", e);
                    });
                }
                
                // Jokeri kullan
                this.useJoker('skip');
                
                // Joker butonlarını güncelle
                this.updateJokerButtons();
                
                // Toast bildirimi göster
                this.showToast("Pas jokeri kullanıldı! Sonraki soruya geçiliyor.", "toast-success");
                
                console.log('Pas joker kullanım sonrası envanter:', JSON.stringify(this.jokerInventory));
                
                // Bir sonraki soruya geç
                setTimeout(() => {
                    this.showNextQuestion();
                }, 800);
            });
        }
        
        // Joker mağazası butonu
        if (this.jokerStoreBtn) {
            this.jokerStoreBtn.addEventListener('click', () => {
                this.openJokerStore();
            });
        }
    },
    
    // Joker mağazasını aç
    openJokerStore: function() {
        console.log('Joker mağazası açılıyor...');
        console.log('Mevcut joker envanteri:', JSON.stringify(this.jokerInventory));
        console.log('Mevcut puan:', this.score);
        
        var modal = document.getElementById('joker-store-modal');
        var closeBtn = modal.querySelector('.close-modal');
        var buyButtons = modal.querySelectorAll('.joker-buy-btn');
        var pointsDisplay = document.getElementById('joker-store-points-display');
        
        // Mevcut puanları ve joker envanterini göster
        pointsDisplay.textContent = this.score || 0;
        
        // Joker miktarlarını güncelle (önce negatif değerleri düzelt)
        Object.keys(this.jokerInventory).forEach(key => {
            if (this.jokerInventory[key] < 0) {
                console.log(`Negatif joker değeri düzeltiliyor: ${key} = ${this.jokerInventory[key]} -> 0`);
                this.jokerInventory[key] = 0;
                this.saveJokerInventory();
            }
        });
        
        var ownedCountElements = modal.querySelectorAll('.joker-owned-count');
        ownedCountElements.forEach(function(el) {
            var jokerType = el.closest('.joker-store-item').dataset.joker;
            var count = this.jokerInventory[jokerType] || 0;
            el.textContent = count; // Math.max gereksiz çünkü yukarıda düzelttik
            console.log(`${jokerType} joker sayısı mağazada gösteriliyor: ${count}`);
        }.bind(this));
        
        // Satın alma butonlarını etkinleştir
        buyButtons.forEach(function(btn) {
            var item = btn.closest('.joker-store-item');
            var jokerType = item.dataset.joker;
            var price = parseInt(item.dataset.price);
            
            // Yeterli puan varsa butonu etkinleştir
            btn.disabled = this.score < price;
            
            // Satın alma olayı
            var self = this;
            btn.onclick = function() {
                console.log(`Joker satın alma denemesi: ${jokerType}, Fiyat: ${price}, Mevcut Puan: ${self.score}`);
                console.log('Satın alma öncesi envanter:', JSON.stringify(self.jokerInventory));
                
                if (self.score >= price) {
                    // Puanı azalt
                    self.score -= price;
                    
                    // Jokeri envantere ekle
                    var previousCount = self.jokerInventory[jokerType] || 0;
                    self.jokerInventory[jokerType]++;
                    
                    // Satın alınan jokerin kullanılmış durumunu sıfırla
                    self.jokersUsed[jokerType] = false;
                    
                    console.log(`${jokerType} joker sayısı: ${previousCount} -> ${self.jokerInventory[jokerType]}`);
                    console.log(`${jokerType} jokerinin kullanılmış durumu sıfırlandı:`, self.jokersUsed[jokerType]);
                    
                    // Joker envanterini kaydet
                    self.saveJokerInventory();
                    
                    // Puanı da kaydet (yoksa sayfa yenilendiğinde kaybolur)
                    self.saveScoreToLocalStorage();
                    
                    // Göstergeleri güncelle
                    pointsDisplay.textContent = self.score;
                    item.querySelector('.joker-owned-count').textContent = self.jokerInventory[jokerType];
                    
                    // Oyun ekranındaki puanı da güncelle
                    self.updateScoreDisplay();
                    
                    // Yeterli puan kaldıysa butonu aktif tut, yoksa devre dışı bırak
                    btn.disabled = self.score < price;
                    
                    // Toast bildirimi göster
                    var jokerName = jokerType === 'fifty' ? '50:50' : 
                        jokerType === 'hint' ? 'İpucu' : 
                        jokerType === 'time' ? 'Süre' : 'Pas';
                    self.showToast(jokerName + ' jokeri satın alındı!', "toast-success");
                    
                    // Joker butonlarını güncelle
                    self.updateJokerButtons();
                    
                    console.log('Satın alma sonrası envanter:', JSON.stringify(self.jokerInventory));
                } else {
                    console.warn('Yeterli puan yok!');
                    self.showToast("Yeterli puanınız yok!", "toast-error");
                }
            };
        }.bind(this));
        
        // Modalı göster
        modal.style.display = 'block';
        
        // Kapat butonuna tıklama olayı
        var self = this;
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
        
        // Modal dışına tıklama olayı
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    },
    
    // Joker butonlarını güncelle
    updateJokerButtons: function() {
        // Elementleri dinamik olarak al (eğer henüz null ise)
        if (!this.jokerFiftyBtn) this.jokerFiftyBtn = document.getElementById('joker-fifty');
        if (!this.jokerHintBtn) this.jokerHintBtn = document.getElementById('joker-hint');
        if (!this.jokerTimeBtn) this.jokerTimeBtn = document.getElementById('joker-time');
        if (!this.jokerSkipBtn) this.jokerSkipBtn = document.getElementById('joker-skip');
        if (!this.jokerStoreBtn) this.jokerStoreBtn = document.getElementById('joker-store');
        
        const currentQuestion = this.questions[this.currentQuestionIndex] || {};
        const isTrueFalse = currentQuestion.type === "DoğruYanlış" || currentQuestion.type === "TrueFalse";
        const isBlankFilling = currentQuestion.type === "BlankFilling";
        
        console.log('updateJokerButtons - elementler:', {
            fifty: !!this.jokerFiftyBtn,
            hint: !!this.jokerHintBtn,
            time: !!this.jokerTimeBtn,
            skip: !!this.jokerSkipBtn,
            store: !!this.jokerStoreBtn
        });
        
        console.log('updateJokerButtons - mevcut envanter:', JSON.stringify(this.jokerInventory));
        console.log('updateJokerButtons - kullanılmış jokerler:', JSON.stringify(this.jokersUsed));
        console.log('updateJokerButtons - soru tipi:', currentQuestion.type, 'isTrueFalse:', isTrueFalse, 'isBlankFilling:', isBlankFilling);
        
        // 50:50 jokeri
        if (this.jokerFiftyBtn) {
            if (isTrueFalse || isBlankFilling) {
                this.jokerFiftyBtn.disabled = true;
                this.jokerFiftyBtn.style.opacity = '0.3';
                this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i> (${this.jokerInventory.fifty || 0})`;
            } else if (this.jokersUsed.fifty) {
                // Bu soruda zaten kullanılmış
                this.jokerFiftyBtn.disabled = true;
                this.jokerFiftyBtn.style.opacity = '0.5';
                this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i> (${this.jokerInventory.fifty || 0})`;
            } else {
                // Envantere göre durumu ayarla
                this.jokerFiftyBtn.disabled = this.jokerInventory.fifty <= 0;
                this.jokerFiftyBtn.style.opacity = this.jokerInventory.fifty <= 0 ? '0.5' : '1';
                this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i> (${this.jokerInventory.fifty || 0})`;
            }
        }
        // İpucu jokeri
        if (this.jokerHintBtn) {
            if (isTrueFalse || isBlankFilling) {
                this.jokerHintBtn.disabled = true;
                this.jokerHintBtn.style.opacity = '0.3';
                this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i> (${this.jokerInventory.hint || 0})`;
            } else if (this.jokersUsed.hint) {
                // Bu soruda zaten kullanılmış
                this.jokerHintBtn.disabled = true;
                this.jokerHintBtn.style.opacity = '0.5';
                this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i> (${this.jokerInventory.hint || 0})`;
            } else {
                // Envantere göre durumu ayarla
                this.jokerHintBtn.disabled = this.jokerInventory.hint <= 0;
                this.jokerHintBtn.style.opacity = this.jokerInventory.hint <= 0 ? '0.5' : '1';
                this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i> (${this.jokerInventory.hint})`;
            }
        }
        // Süre jokeri (her soru tipinde kullanılabilir)
        if (this.jokerTimeBtn) {
            if (this.jokersUsed.time) {
                // Bu soruda zaten kullanılmış
                this.jokerTimeBtn.disabled = true;
                this.jokerTimeBtn.style.opacity = '0.5';
                this.jokerTimeBtn.innerHTML = `<i class="fas fa-clock"></i> (${this.jokerInventory.time || 0})`;
            } else {
                // Envantere göre durumu ayarla
                this.jokerTimeBtn.disabled = this.jokerInventory.time <= 0;
                this.jokerTimeBtn.style.opacity = this.jokerInventory.time <= 0 ? '0.5' : '1';
                this.jokerTimeBtn.innerHTML = `<i class="fas fa-clock"></i> (${this.jokerInventory.time || 0})`;
            }
        }
        // Pas jokeri (her soru tipinde kullanılabilir)
        if (this.jokerSkipBtn) {
            if (this.jokersUsed.skip) {
                // Bu soruda zaten kullanılmış
                this.jokerSkipBtn.disabled = true;
                this.jokerSkipBtn.style.opacity = '0.5';
                this.jokerSkipBtn.innerHTML = `<i class="fas fa-forward"></i> (${this.jokerInventory.skip || 0})`;
            } else {
                // Envantere göre durumu ayarla
                this.jokerSkipBtn.disabled = this.jokerInventory.skip <= 0;
                this.jokerSkipBtn.style.opacity = this.jokerInventory.skip <= 0 ? '0.5' : '1';
                this.jokerSkipBtn.innerHTML = `<i class="fas fa-forward"></i> (${this.jokerInventory.skip || 0})`;
            }
        }
        // Joker mağazası
        if (this.jokerStoreBtn) {
            this.jokerStoreBtn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        }
    },
    
    // Joker kullanma fonksiyonu
    useJoker: function(jokerType) {
        // Joker envanterini kontrol et
        if (!this.jokerInventory[jokerType] || this.jokerInventory[jokerType] <= 0) {
            console.warn(`${jokerType} jokeri kullanılamıyor, envanter boş:`, this.jokerInventory[jokerType]);
            return false;
        }
        
        this.jokersUsed[jokerType] = true;
        this.jokerInventory[jokerType] = Math.max(0, this.jokerInventory[jokerType] - 1);
        this.saveJokerInventory();
        
        console.log(`${jokerType} jokeri kullanıldı, kalan: ${this.jokerInventory[jokerType]}`);
        return true;
    },
    
    // Reset jokers for new game
    resetJokers: function() {
        console.log('resetJokers çağrıldı, mevcut envanter:', JSON.stringify(this.jokerInventory));
        
        // Kullanılmış jokerleri sıfırla
        this.jokersUsed = {fifty: false, hint: false, time: false, skip: false};
        this.skipJokerActive = false;
        
        // 50:50 joker ile devre dışı bırakılan seçenekleri tekrar aktif et
        this.resetDisabledOptions();
        
        // Joker butonlarının görünümünü sıfırla
        this.resetJokerButtonsUI();
        
        // Joker envanterini her zaman başlangıç değerlerine sıfırla
        console.log('Joker envanteri başlangıç değerlerine sıfırlanıyor...');
        this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
        this.saveJokerInventory();
        
        // Negatif değerleri düzelt
        Object.keys(this.jokerInventory).forEach(key => {
            if (this.jokerInventory[key] < 0) {
                this.jokerInventory[key] = 0;
                console.log(`${key} jokerinin negatif değeri düzeltildi:`, this.jokerInventory[key]);
            }
        });
        
        // Joker butonlarını güncelle
        setTimeout(() => {
            this.updateJokerButtons();
        }, 100);
        
        console.log('resetJokers tamamlandı, final envanter:', JSON.stringify(this.jokerInventory));
    },
    
    // 50:50 joker ile devre dışı bırakılan seçenekleri sıfırla
    resetDisabledOptions: function() {
        const disabledOptions = document.querySelectorAll('.option.disabled-option');
        disabledOptions.forEach(option => {
            option.style.opacity = '';
            option.style.pointerEvents = '';
            option.style.background = '';
            option.style.color = '';
            option.classList.remove('disabled-option');
        });
        
        // İpucu mesajlarını da temizle
        const hintMessages = document.querySelectorAll('.hint-message');
        hintMessages.forEach(hint => {
            hint.remove();
        });
    },
    
    // Joker butonlarının UI durumunu sıfırla
    resetJokerButtonsUI: function() {
        console.log('Joker butonları UI sıfırlanıyor...');
        
        // Elementleri al
        const jokerFiftyBtn = document.getElementById('joker-fifty');
        const jokerHintBtn = document.getElementById('joker-hint');
        const jokerTimeBtn = document.getElementById('joker-time');
        const jokerSkipBtn = document.getElementById('joker-skip');
        
        // Her joker butonunu sıfırla
        [jokerFiftyBtn, jokerHintBtn, jokerTimeBtn, jokerSkipBtn].forEach((btn, index) => {
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.classList.remove('joker-used');
                
                // HTML içeriğini sıfırla - joker sayısı eklemeden
                const icons = ['fas fa-star-half-alt', 'fas fa-lightbulb', 'fas fa-clock', 'fas fa-forward'];
                btn.innerHTML = `<i class="${icons[index]}"></i>`;
                
                console.log(`Joker butonu sıfırlandı: ${btn.id}`);
            }
        });
        
        // Butonları güncelle (joker sayılarını göstermek için)
        setTimeout(() => {
            this.updateJokerButtons();
        }, 50);
    },
    
    // Kullanıcı ayarlarını yükle
    loadUserSettings: function() {
        try {
            // Kaydedilmiş ayarları kontrol et
            const settings = localStorage.getItem(this.USER_SETTINGS_KEY);
            
            // Hamburger menüsündeki zorluk ayarını öncelikle kontrol et
            const hamburgırDifficulty = localStorage.getItem('difficulty');
            
            // Tercihler ekranından zorluk seviyesi ayarını kontrol et
            const difficultyPreference = localStorage.getItem('difficulty_preference');
            let calculatedDifficulty = null;
            
            // Öncelik sırası: hamburger menüsü > tercihler > hesaplanmış zorluk
            if (hamburgırDifficulty && ['easy', 'medium', 'hard'].includes(hamburgırDifficulty)) {
                calculatedDifficulty = hamburgırDifficulty;
                console.log(`Zorluk seviyesi hamburger menüsünden alındı: ${calculatedDifficulty}`);
            } else if (difficultyPreference) {
                // Otomatik zorluk ayarı ise, hesaplanmış zorluğu kontrol et
                if (difficultyPreference === 'auto') {
                    calculatedDifficulty = localStorage.getItem('calculated_difficulty');
                } else {
                    // Doğrudan seçilen zorluğu kullan
                    calculatedDifficulty = difficultyPreference;
                }
                
                if (calculatedDifficulty) {
                    console.log(`Zorluk seviyesi tercihlere göre ayarlandı: ${calculatedDifficulty}`);
                }
            }
            
            if (settings) {
                this.userSettings = JSON.parse(settings);
                
                // Tercihlerden zorluk seviyesi ayarlanmadıysa kaydedilmiş ayarları kullan
                if (!calculatedDifficulty && this.userSettings.difficulty) {
                    calculatedDifficulty = this.userSettings.difficulty;
                }
                
                this.soundEnabled = this.userSettings.soundEnabled !== undefined ? this.userSettings.soundEnabled : true;
                this.animationsEnabled = this.userSettings.animationsEnabled !== undefined ? this.userSettings.animationsEnabled : true;
                this.notificationsEnabled = this.userSettings.notificationsEnabled !== undefined ? this.userSettings.notificationsEnabled : true;
                this.theme = this.userSettings.theme || 'light';
                
                console.log("Kullanıcı ayarları yüklendi:", this.userSettings);
            } else {
                // Varsayılan ayarlar
                this.userSettings = {};
                this.soundEnabled = true;
                this.animationsEnabled = true;
                this.notificationsEnabled = true;
                this.theme = 'light';
                
                console.log("Varsayılan ayarlar kullanılıyor");
            }
            
            // Zorluk seviyesini ayarla
            this.currentDifficulty = calculatedDifficulty || 'medium';
            this.userSettings.difficulty = this.currentDifficulty;
            
            console.log(`Final zorluk seviyesi: ${this.currentDifficulty}`);
            
            // Tema ayarını uygula
            this.applyTheme();
            
            // Joker envanterini yükle
            this.loadJokerInventory();
        } catch (e) {
            console.error("Ayarlar yüklenirken hata:", e);
        }
    },
    
    // Kullanıcı ayarlarını kaydet
    saveUserSettings: function() {
        try {
            // userSettings objesini güncelle
            if (!this.userSettings) {
                this.userSettings = {};
            }
            
            this.userSettings.difficulty = this.currentDifficulty;
            this.userSettings.soundEnabled = this.soundEnabled;
            this.userSettings.animationsEnabled = this.animationsEnabled;
            this.userSettings.notificationsEnabled = this.notificationsEnabled;
            this.userSettings.theme = this.theme;
            
            localStorage.setItem(this.USER_SETTINGS_KEY, JSON.stringify(this.userSettings));
            console.log("Kullanıcı ayarları kaydedildi:", this.userSettings);
        } catch (e) {
            console.error("Kullanıcı ayarları kaydedilirken hata oluştu:", e);
        }
    },
    
    // Tema uygula
    applyTheme: function() {
        document.body.className = this.theme === 'dark' ? 'dark-theme' : '';
    },
    
    // İstatistikleri getir
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
                console.error("İstatistikler yüklenirken hata oluştu:", e);
            }
        }
        
        return stats;
    },
    
    // Seviye tamamlandı, sonraki seviyeyi göster
    showLevelCompletionScreen: function(completedLevel) {
        clearInterval(this.timerInterval);
        
        // Seviye tamamlama ses efekti
        if (this.soundEnabled) {
            const completionSound = document.getElementById('sound-level-completion');
            if (completionSound) completionSound.play().catch(e => console.error("Ses çalınamadı:", e));
        }
        
        // Oyuncuyu tebrik et
        const levelCompletionElement = document.createElement('div');
        levelCompletionElement.className = 'level-completion-screen';
        levelCompletionElement.innerHTML = `
            <div class="level-completion-content">
                <h2>${completedLevel}. Seviye Tamamlandı!</h2>
                <div class="level-completion-stats">
                    <p><i class="fas fa-star"></i> Skor: ${this.score}</p>
                    <p><i class="fas fa-check-circle"></i> Doğru: ${this.score}/${this.answeredQuestions}</p>
                    <p><i class="fas fa-clock"></i> Ortalama Süre: ${Math.round(this.answerTimes.reduce((a, b) => a + b, 0) / this.answerTimes.length)} saniye</p>
                </div>
                <div class="confetti-animation">
                    <i class="fas fa-trophy"></i>
                </div>
                <button id="next-level-btn" class="shiny-btn">Sonraki Seviyeye Geç</button>
            </div>
        `;
        
        document.body.appendChild(levelCompletionElement);
        
        // Sonraki seviyeye geçme butonu
        const nextLevelBtn = document.getElementById('next-level-btn');
        nextLevelBtn.addEventListener('click', () => {
            // Sonuç ekranını kaldır
            document.body.removeChild(levelCompletionElement);
            
            // Sonraki seviyeye devam et
            this.currentQuestionIndex = 0;
            this.resetJokers();
            // Canları koruyoruz, sıfırlamıyoruz ki önceki seviyeden kalan canlarla devam edilsin
            this.score = 0;
            this.answerTimes = [];
            this.answeredQuestions = 0;
            
            // Sonraki seviye için soruları yükle
            this.loadQuestionsForCurrentLevel();
        });
    },
    
    // Olay dinleyicilerini ekle
    addEventListeners: function() {
        try {
            console.log("Event listener'lar ekleniyor...");
            
        // Tema değiştirme butonu için olay dinleyicisi
        if (this.themeToggle) {
            this.themeToggle.addEventListener('change', () => {
                const theme = this.themeToggle.checked ? 'dark' : 'light';
                this.userSettings.theme = theme;
                this.applyTheme(theme);
                this.saveUserSettings();
            });
        }
        
        // Yeniden başlatma butonu için olay dinleyicisi
        if (this.restartButton) {
            this.restartButton.addEventListener('click', () => {
                this.restartGame();
            });
        }
        
        // Sonraki soru butonu için olay dinleyicisi
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.showNextQuestion();
            });
        }
        
            // Joker butonları için olay dinleyicileri
            console.log('DOM hazır, joker event listener\'ları ekleniyor...');
            this.addJokerEventListeners();
            
            // Tekli oyun butonu
            if (this.singlePlayerBtn) {
                console.log("Tekli oyun butonu bulundu, dinleyici ekleniyor");
                this.singlePlayerBtn.addEventListener('click', () => {
                    console.log("Tekli oyun butonuna tıklandı");
                    if (this.mainMenu) this.mainMenu.style.display = 'none';
                    
                    // Tekli oyun modunda chat ekranını gizle
                    const gameChatContainer = document.getElementById('game-chat-container');
                    if (gameChatContainer) {
                        gameChatContainer.style.display = 'none';
                    }
                    
                    if (this.categorySelectionElement) {
                        this.categorySelectionElement.style.display = 'block';
                        // Kategorileri göster
                        this.displayCategories();
                    } else {
                        console.error("Kategori seçim elementi bulunamadı!");
                    }
                });
            } else {
                console.error("Tekli oyun butonu bulunamadı! ID: single-player-btn");
            }
            
            console.log("Event listener'lar başarıyla eklendi");
        } catch (error) {
            console.error("addEventListeners fonksiyonunda hata:", error);
        }
    },
    
    // Joker butonlarını ayarla (setupJokerButtons'un yerine kullanıyoruz)
    setupJokerButtons: function() {
        // Bu fonksiyon gerektiğinde joker butonlarını ayarlar
        console.log("Joker butonları ayarlanıyor");
        this.updateJokerButtons();
    },
    
    // Soru verilerini yükle
    loadQuestionsData: function() {
            console.log("Soru verileri yükleniyor...");
            
        return new Promise((resolve, reject) => {
            // Seçilen dile göre dosya belirle
            let questionsFile = 'languages/tr/questions.json'; // Türkçe için varsayılan
            
            if (this.currentLanguage === 'en') {
                questionsFile = 'languages/en/questions.json';
            } else if (this.currentLanguage === 'de') {
                questionsFile = 'languages/de/questions.json';
            }
            
            console.log(`Dil: ${this.currentLanguage}, Yüklenen dosya: ${questionsFile}`);
            
            // Soruları belirlenen JSON dosyasından yükle
            fetch(questionsFile)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Sorular yüklenemedi: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data) {
                    this.questionsData = data;
                        // allQuestionsData'yı questionsData ile aynı verilere işaret edecek şekilde atayalım
                        this.allQuestionsData = data; 
                        console.log("Soru verileri başarıyla yüklendi:", Object.keys(data).length, "kategori");
                        console.log("Kategoriler:", Object.keys(data));
                        resolve(data);
                    } else {
                        console.log("Sorular yüklenemedi, varsayılan veriler kullanılacak.");
                        this.loadDefaultQuestions();
                        resolve(this.questionsData);
                    }
                })
                .catch(error => {
                    console.error("Sorular yüklenirken hata:", error);
                    console.log("Varsayılan sorular kullanılacak");
                    this.loadDefaultQuestions();
                    resolve(this.questionsData);
                });
        });
    },
    
    // Varsayılan soruları yükle (offline durumlar için)
    loadDefaultQuestions: function() {
        // Varsayılan bazı sorular
        this.questionsData = {
            "Genel Kültür": [
                {
                    question: "Türkiye'nin başkenti hangi şehirdir?",
                                options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
                                correctAnswer: "Ankara",
                    difficulty: "easy"
                },
                {
                    question: "Hangi gezegen Güneş Sistemi'nde en büyük olanıdır?",
                    options: ["Mars", "Venüs", "Jüpiter", "Satürn"],
                    correctAnswer: "Jüpiter",
                    difficulty: "easy"
                            },
                            {
                                question: "Dünyanın en büyük okyanusu hangisidir?",
                    options: ["Atlas Okyanusu", "Hint Okyanusu", "Pasifik Okyanusu", "Arktik Okyanusu"],
                    correctAnswer: "Pasifik Okyanusu",
                    difficulty: "medium"
                }
            ],
            "Teknoloji": [
                {
                    question: "HTML'in açılımı nedir?",
                    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Mode Language", "Home Tool Markup Language"],
                    correctAnswer: "Hyper Text Markup Language",
                    difficulty: "easy"
                },
                {
                    question: "Hangi şirket Windows işletim sistemini geliştirmiştir?",
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
                    question: "Işık hızı yaklaşık kaç km/s'dir?",
                    options: ["100.000 km/s", "200.000 km/s", "300.000 km/s", "400.000 km/s"],
                    correctAnswer: "300.000 km/s",
                    difficulty: "medium"
                }
            ]
        };
        // allQuestionsData'yı da güncelle
        this.allQuestionsData = this.questionsData;
        console.log("Varsayılan sorular yüklendi:", Object.keys(this.questionsData).length, "kategori");
    },
    
    // Restartlama işlevi
    restartGame: function() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0; // <-- EKLENDİ: Doğru cevap sayısını sıfırla
        this.sessionScore = 0; // Oturum puanını sıfırla
        this.lives = 5;
        this.answeredQuestions = 0;
        this.answerTimes = [];
        this.currentSection = 1; // Bölüm sayısını da sıfırla
        this.resetJokers();
        
        // Puanın sıfırlanmasını localStorage'a kaydet
        this.saveScoreToLocalStorage();
        
        // Body'den quiz ve kategori class'larını kaldır - logo tekrar görünsün
        document.body.classList.remove('quiz-active', 'category-selection');
        
        // Tekli oyun modunda chat ekranını gizle
        const gameChatContainer = document.getElementById('game-chat-container');
        if (gameChatContainer) {
            gameChatContainer.style.display = 'none';
        }
        
        // Kategorileri yeniden göster
        this.displayCategories();
        
        // İstatistikleri sıfırla
        this.updateScoreDisplay();
    },
    
    // Sonraki soruyu göster
    showNextQuestion: function() {
        // Önceki sonuç ve seçili şıkları temizle
        if (this.resultElement) {
            this.resultElement.style.display = 'none';
            this.resultElement.innerHTML = '';
        }
        
        // Tüm seçilmiş şıkların seçimini kaldır
        const selectedOptions = document.querySelectorAll('.option.selected, .true-false-option.selected, .option.answered, .true-false-option.answered');
        selectedOptions.forEach(option => {
            option.classList.remove('selected', 'answered', 'correct', 'wrong');
            option.disabled = false;
        });
        
        // 50:50 joker ile devre dışı bırakılan seçenekleri sıfırla
        this.resetDisabledOptions();
        
        // Boşluk doldurma ekranındaki cevap göstergesini temizle
        const answerDisplay = document.getElementById('blank-filling-answer');
        if (answerDisplay) {
            answerDisplay.textContent = '';
            answerDisplay.classList.remove('correct', 'wrong');
        }
        
        // Seçilmiş harfleri sıfırla
        this.selectedLetters = [];
        
        // Jokerlerin kullanılmış durumunu sıfırla (yeni soru için) - UPDATED_20241216
        this.jokersUsed = {fifty: false, hint: false, time: false, skip: false};
        this.skipJokerActive = false;
        
        // Soru sayacını artır
        this.currentQuestionIndex++;
        
        // Önceki ipucu mesajlarını temizle
        const existingHintMessages = document.querySelectorAll('.hint-message');
        existingHintMessages.forEach(element => {
            element.remove();
        });
        
        // Her 5 soruda bir bölüm geçişi göster
        if (this.currentQuestionIndex > 0 && this.currentQuestionIndex % 5 === 0 && this.currentQuestionIndex < this.questions.length) {
            this.currentSection++; // Bölüm sayısını artır
            
            // 50 bölüm tamamlandıysa, oyunu bitir
            if (this.currentSection > this.totalSections) {
                this.showGameCompletion();
                return;
            }
            
            this.showSectionTransition();
        } else if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion(this.questions[this.currentQuestionIndex]);
            // Joker butonlarını güncelle
            this.updateJokerButtons();
        } else {
            this.showResult();
        }
    },
    
    // Oyun Tamamlama Ekranını Göster (50 bölüm tamamlandığında)
    showGameCompletion: function() {
        // Sayacı durdur
        clearInterval(this.timerInterval);
        
        // Oyun tamamlama ekranını oluştur
        const completionElement = document.createElement('div');
        completionElement.className = 'game-completion-screen';
        completionElement.innerHTML = `
            <div class="game-completion-content">
                <div class="trophy-container">
                    <i class="fas fa-trophy trophy-icon"></i>
                </div>
                <h2>Tebrikler! Oyunu Tamamladınız!</h2>
                <div class="completion-info">
                    <p class="completion-congrats">50 bölümü başarıyla tamamladınız!</p>
                    <p>Toplam Puan: <strong>${this.score}</strong></p>
                    <p class="completion-message">Bu muhteşem başarınız için kutlarız!</p>
                </div>
                <div class="completion-buttons">
                    <button id="restart-game-btn" class="completion-btn"><i class="fas fa-redo"></i> Yeniden Oyna</button>
                    <button id="share-result-btn" class="completion-btn"><i class="fas fa-share-alt"></i> Sonucu Paylaş</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(completionElement);
        
        // Yeniden başlatma butonu
        const restartGameBtn = document.getElementById('restart-game-btn');
        if (restartGameBtn) {
            restartGameBtn.addEventListener('click', () => {
                document.body.removeChild(completionElement);
                this.restartGame();
            });
        }
        
        // Paylaşım butonu
        const shareResultBtn = document.getElementById('share-result-btn');
        if (shareResultBtn) {
            shareResultBtn.addEventListener('click', () => {
                // Paylaşım özelliği eklenebilir
                const shareText = `Bilgoo'yu ${this.score} puanla tamamladım! Sende oynamak ister misin?`;
                
                if (navigator.share) {
                    navigator.share({
                        title: 'Bilgoo',
                        text: shareText,
                        url: window.location.href
                    }).catch(err => {
                        console.error('Paylaşım hatası:', err);
                        this.showToast('Sonuç paylaşılamadı', 'toast-error');
                    });
                } else {
                    // Tarayıcı paylaşımı desteklemiyorsa panoya kopyala
                    navigator.clipboard.writeText(shareText)
                        .then(() => {
                            this.showToast('Sonuç panoya kopyalandı!', 'toast-success');
                        })
                        .catch(err => {
                            console.error('Panoya kopyalama hatası:', err);
                            this.showToast('Sonuç kopyalanamadı', 'toast-error');
                        });
                }
            });
        }
        
        // Konfeti efekti veya ses efekti eklenebilir
        if (this.soundEnabled) {
            const victorySound = document.getElementById('sound-level-completion');
            if (victorySound) victorySound.play().catch(e => console.error("Ses çalınamadı:", e));
        }
        
        // İstatistikleri kaydet
        this.saveStats(this.selectedCategory, this.score, this.answeredQuestions, 
            this.answerTimes.length > 0 ? Math.round(this.answerTimes.reduce((a, b) => a + b, 0) / this.answerTimes.length) : 0);
    },
    
    // Bölüm geçiş ekranını göster
    showSectionTransition: function() {
        // Sayacı durdur
        clearInterval(this.timerInterval);
        
        // Tamamlanan bölüm numarası (0-tabanlı) - currentSection 1'den başladığı için -1
        const sectionIndex = this.currentSection - 2; // Bir önceki tamamlanan bölüm
        
        // Bölüm istatistiklerini al
        const stats = this.sectionStats[sectionIndex] || { correct: 0, total: 0 };
        
        console.log(`Bölüm geçişi gösteriliyor. Bölüm: ${sectionIndex+1}, İstatistikler:`, stats);
        
        // Doğru cevap yüzdesini hesapla
        const correctPercentage = stats.total > 0 
            ? Math.round((stats.correct / stats.total) * 100) 
            : 0;
        
        console.log(`Bölüm istatistikleri hesaplandı: Doğru: ${stats.correct}, Toplam: ${stats.total}, Yüzde: ${correctPercentage}%`);
        
        // Yıldız tipini belirle (altın, gümüş veya bronz)
        let starType, starColor, starText;
        if (correctPercentage >= 80) {
            starType = 'gold';
            starColor = '#ffd700';
            starText = 'Altın Yıldız';
        } else if (correctPercentage >= 50) {
            starType = 'silver';
            starColor = '#c0c0c0';
            starText = 'Gümüş Yıldız';
        } else {
            starType = 'bronze';
            starColor = '#cd7f32';
            starText = 'Bronz Yıldız';
        }
        
        // Performansa göre kaç yıldız verilecek
        let starCount;
        if (correctPercentage >= 80) {
            starCount = 3; // Çok iyi performans: 3 yıldız
        } else if (correctPercentage >= 50) {
            starCount = 2; // Orta performans: 2 yıldız
        } else {
            starCount = 1; // Düşük performans: 1 yıldız
        }
        
        // Yıldız HTML'ini oluştur
        let starsHTML = '';
        for (let i = 0; i < 3; i++) {
            if (i < starCount) {
                // Aktif yıldız (kazanılan)
                starsHTML += `<i class="fas fa-star" style="color: ${starColor};"></i>`;
            } else {
                // Gri yıldız (kazanılmayan)
                starsHTML += `<i class="fas fa-star" style="color: #888; opacity: 0.5;"></i>`;
            }
        }
        
        // Bölüm geçiş ekranını oluştur - önceki tasarıma benzer bir stil kullanılıyor
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
                </div>
                <button id="next-section-btn" class="level-btn"><i class="fas fa-forward"></i> ${this.getTranslation('nextSection')}</button>
            </div>
        `;
        
        // Mevcut ekranı gizle ve geçiş ekranını göster
        if (this.quizElement) this.quizElement.style.display = 'none';
        document.body.appendChild(sectionElement);
        
        // Sonraki bölüme geçiş butonu
        const nextSectionBtn = document.getElementById('next-section-btn');
        nextSectionBtn.addEventListener('click', () => {
            // Geçiş ekranını kaldır
            document.body.removeChild(sectionElement);
            
            // Quiz ekranını göster
            if (this.quizElement) this.quizElement.style.display = 'block';
            
            // Sonraki soruyu göster
            this.displayQuestion(this.questions[this.currentQuestionIndex]);
        });
        
        // Ses efekti çal
        if (this.soundEnabled) {
            const sectionSound = document.getElementById('sound-correct');
            if (sectionSound) sectionSound.play().catch(e => console.error("Ses çalınamadı:", e));
        }
        
        // Tebrik toast mesajı göster
        this.showToast(`${this.currentSection-1}. ${this.getTranslation('sectionCompleted')}`, "toast-success");
    },
    
    // Kategorileri göster
    displayCategories: function() {
        const categoriesContainer = document.getElementById('categories');
        if (!categoriesContainer) {
            console.error("Kategoriler için DOM elementi bulunamadı! (ID: categories)");
            return;
        }
        // Kategorileri temizle
        categoriesContainer.innerHTML = '';
        
        // Body'ye kategori seçimi class'ını ekle - logo gizlemek için
        document.body.classList.add('category-selection');
        document.body.classList.remove('quiz-active');
        
        // Tekli oyun modunda chat ekranını gizle
        const gameChatContainer = document.getElementById('game-chat-container');
        if (gameChatContainer) {
            gameChatContainer.style.display = 'none';
        }
        
        // Aktif kategori verilerini al
        const activeQuestionData = this.currentLanguage === 'tr' ? this.questionsData : this.translatedQuestions;
        
        console.log("displayCategories çağrıldı! Mevcut kategoriler:", activeQuestionData ? Object.keys(activeQuestionData) : "Veri yok");
        if (!activeQuestionData || Object.keys(activeQuestionData).length === 0) {
            // Yükleniyor mesajı göster
            categoriesContainer.innerHTML = `<div class="loading">${this.getTranslation('loading')}</div>`;
            return;
        }
        
        // Tüm kategorileri göster
        Object.keys(activeQuestionData).forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category category-btn';
            categoryElement.innerHTML = `
                <div class="category-icon">
                    <i class="${this.getCategoryIcon(category)}"></i>
                </div>
                <div class="category-name">${category}</div>
            `;
            // Kategori elementine tıklama olayı ekle
            categoryElement.addEventListener('click', () => {
                this.selectCategory(category);
            });
            categoriesContainer.appendChild(categoryElement);
        });
        console.log("Toplam", Object.keys(activeQuestionData).length, "kategori görüntülendi");
    },
    
    // Kategori simgesini belirle
    getCategoryIcon: function(category) {
        // Kategori adına göre uygun simge döndür
        const categoryIcons = {
            // Türkçe kategoriler
            'Genel Kültür': 'fas fa-globe',
            'Bilim': 'fas fa-flask',
            'Teknoloji': 'fas fa-microchip',
            'Spor': 'fas fa-futbol',
            'Müzik': 'fas fa-music',
            'Tarih': 'fas fa-landmark',
            'Coğrafya': 'fas fa-mountain',
            'Sanat': 'fas fa-palette',
            'Edebiyat': 'fas fa-book',
            'Sinema': 'fas fa-film',
            'Yemek': 'fas fa-utensils',
            'Bilgisayar': 'fas fa-laptop-code',
            'Matematik': 'fas fa-calculator',
            'Boşluk Doldurma': 'fas fa-keyboard',
            'Diğer': 'fas fa-question-circle',
            
            // İngilizce kategoriler
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
            'Lückentext': 'fas fa-keyboard',
            'Sonstiges': 'fas fa-question-circle'
        };
        
        return categoryIcons[category] || 'fas fa-question-circle';
    },
    
    // Kategori seç
    selectCategory: function(category) {
        try {
            console.log("Seçilen kategori:", category);
            this.selectedCategory = category;
            
            // Yeni oyun başladığında değişkenleri sıfırla
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.correctAnswers = 0; // <-- EKLENDİ: Doğru cevap sayısını sıfırla
            this.sessionScore = 0;
            this.answeredQuestions = 0;
            this.answerTimes = [];
            this.lives = 5;
            
            // Jokerleri sıfırla
            this.resetJokers();
            console.log('Kategori seçimi: Jokerler sıfırlandı');
            
            // Joker butonlarını güncelle
            setTimeout(() => {
                this.updateJokerButtons();
                console.log('Kategori seçimi: Joker butonları güncellendi');
            }, 200);
            
            // Puanın sıfırlanmasını localStorage'a kaydet
            this.saveScoreToLocalStorage();
            
            // Kategori seçim ekranını gizle
            if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'none';
            
            // Aktif soru verilerini al (çevrilmiş veya orijinal)
            const activeQuestionData = this.currentLanguage === 'tr' ? this.questionsData : this.translatedQuestions;
            
            // Seçilen kategorideki soruları karıştır
            if (activeQuestionData && activeQuestionData[category]) {
                this.questions = this.shuffleArray([...activeQuestionData[category]]);
                this.arrangeBlankFillingFirst();
                console.log("Soru sayısı:", this.questions.length);
                console.log("Aktif dil:", this.currentLanguage);
                
                // Maksimum soru sayısını sınırla (opsiyonel)
                const maxQuestions = this.MAX_QUESTIONS || 50; // MAX_QUESTIONS tanımlanmamışsa 50 kullan
                if (this.questions.length > maxQuestions) {
                    this.questions = this.questions.slice(0, maxQuestions);
                    console.log("Sorular", maxQuestions, "ile sınırlandırıldı");
                }
                
                // Toplam puan göstergesini başlat
                this.updateTotalScoreDisplay();
                
                // Oyunu başlat
                this.startQuiz();
            } else {
                console.error("Kategori verileri bulunamadı:", category);
                this.showToast(this.getTranslation('categoryLoadError') || "Seçilen kategoride soru bulunamadı. Lütfen başka bir kategori seçin.", "toast-error");
                
                // Kategori seçim ekranını tekrar göster
                if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'block';
            }
        } catch (error) {
            console.error("selectCategory fonksiyonunda hata:", error);
            this.showToast(this.getTranslation('categorySelectionError') || "Kategori seçilirken bir hata oluştu. Lütfen tekrar deneyin.", "toast-error");
            
            // Kategori seçim ekranını tekrar göster
            if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'block';
        }
    },
    
    // Seçilen kategori için soruları yükle
    loadQuestionsForCategory: function(category) {
        if (!this.questionsData[category]) {
            console.error(`${category} kategorisi için soru bulunamadı!`);
            return;
        }
        
        // Kategorinin sorularını al ve karıştır
        this.questions = this.shuffleArray([...this.questionsData[category]]);
        
        // Zorluk seviyesine göre sırala (isteğe bağlı)
        // this.questions.sort((a, b) => (a.difficulty || 1) - (b.difficulty || 1));
        
        // İlk soruyu göster
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0; // <-- EKLENDİ
        // this.lives = 5; // BUNU SİLİYORUM
        this.answeredQuestions = 0;
        this.answerTimes = [];
        this.sectionStats = []; // Bölüm istatistiklerini sıfırla
        this.currentSection = 1; // Bölüm numarasını sıfırla
        this.resetJokers();
        
        // Puanın sıfırlanmasını localStorage'a kaydet
        this.saveScoreToLocalStorage();
        
        // Quiz ekranını göster ve ilk soruyu yükle
        this.startQuiz();
    },
    
    // Diziyi karıştır (Fisher-Yates algoritması)
    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },
    
    // Quiz'i başlat
    startQuiz: function() {
        // Body'ye quiz aktif class'ını ekle - logo gizlemek için
        document.body.classList.add('quiz-active');
        document.body.classList.remove('category-selection');
        
        // Önce tüm ana bölümleri gizle, sadece quiz ekranını göster
        if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'none';
        if (this.quizElement) this.quizElement.style.display = 'block';
        if (this.resultElement) this.resultElement.style.display = 'none';
        
        // Oyun arayüzüne kalan diğer elemanları da gizle
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.style.display = 'none';
        
        const onlineGameOptions = document.getElementById('online-game-options');
        if (onlineGameOptions) onlineGameOptions.style.display = 'none';
        
        const globalLeaderboard = document.getElementById('global-leaderboard'); 
        if (globalLeaderboard) globalLeaderboard.style.display = 'none';
        
        const winnerScreen = document.getElementById('winner-screen');
        if (winnerScreen) winnerScreen.style.display = 'none';
        
        // Tekli oyun modunda chat ekranını gizle
        const gameChatContainer = document.getElementById('game-chat-container');
        if (gameChatContainer) {
            gameChatContainer.style.display = 'none';
        }
        
        // "Bilgisel Bilgi Yarışması" başlığını ve ikonunu gizle
        const quizTitle = document.querySelector('h1');
        if (quizTitle && quizTitle.innerText.includes('Bilgisel Bilgi Yarışması')) {
            quizTitle.style.display = 'none';
        }
        
        // Footer içerisindeki tüm içeriği (TEKNOVA BİLİŞİM yazısı, logo, ikon vb.) gizle
        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.display = 'none';
        }
        
        // Logo veya diğer ikonları da gizle
        const logoIcons = document.querySelectorAll('.logo, .logo-icon, .company-info, .company-logo');
        logoIcons.forEach(icon => {
            icon.style.display = 'none';
        });
        
        // Skorları güncelle (önce localStorage'dan yükle)
        this.loadScoreFromLocalStorage();
        this.updateScoreDisplay();
        
        // İlk soruyu göster
        this.displayQuestion(this.questions[0]);
    },
    
    // Skoru güncelle
    updateScoreDisplay: function() {
        if (this.scoreElement) {
            this.scoreElement.innerHTML = `
                <div class="score-container">
                    <span class="score-value">${this.score}</span>
                    <span class="score-label">${this.getTranslation('score')}</span>
                </div>
            `;
        }
        
        // Oyun sırasındaki puan göstergesini güncelle
        const currentScoreElement = document.getElementById('current-score');
        if (currentScoreElement) {
            currentScoreElement.textContent = this.score;
        }
        
        // Toplam puan göstergesini güncelle
        this.updateTotalScoreDisplay();
        
        // Canları güncelle
        this.updateLives();
    },
    
    // Soruyu göster
    displayQuestion: function(questionData) {
        if (!questionData) {
            console.error("Soru verisi bulunamadı!");
            return;
        }
        
        // Önceki ipucu mesajlarını temizle
        const existingHintMessages = document.querySelectorAll('.hint-message');
        existingHintMessages.forEach(element => {
            element.remove();
        });
        
        // Eğer soru boşluk doldurma ise farklı göster
        if (questionData.type === "BlankFilling") {
            this.loadBlankFillingQuestion(questionData);
            return;
        }
        
        // Eğer soru doğru/yanlış tipindeyse farklı göster
        if (questionData.type === "DoğruYanlış" || questionData.type === "TrueFalse") {
            this.loadTrueFalseQuestion(questionData);
            return;
        }
        
        // Sonuç alanını temizle
        if (this.resultElement) {
            this.resultElement.innerHTML = '';
            this.resultElement.className = 'result';
            this.resultElement.style.display = 'none';
        }
        
        // Sonraki soru butununu gizle
        if (this.nextButton) {
            this.nextButton.style.display = 'none';
        }
        
        // Soru metnini göster
        if (this.questionElement) {
            // Çevrilmiş soru kullan (eğer varsa)
            if (questionData.translations && questionData.translations[this.currentLanguage] && questionData.translations[this.currentLanguage].question) {
                this.questionElement.textContent = questionData.translations[this.currentLanguage].question;
            } else {
                this.questionElement.textContent = questionData.question;
            }
            
            // Eğer soruda görsel varsa göster
            if (questionData.imageUrl) {
                this.loadQuestionImage(questionData);
            }
        }
        
        // Şıkları göster
        if (this.optionsElement) {
            this.optionsElement.innerHTML = '';
            this.optionsElement.style.display = '';
            this.optionsElement.style.justifyContent = '';
            this.optionsElement.style.width = '';
            
            // Çevrilmiş şıkları kullan (eğer varsa)
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
        
        // Joker butonlarının durumunu güncelle
        this.updateJokerButtons();

        // Sayacı başlat
        this.startTimer();
    },
    
    // Şıkları ekrana yazdır
    displayOptions: function(options) {
        if (!this.optionsElement) return;
        
        options.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.className = 'option';
            optionButton.textContent = option;
            
            // Şık tıklama olayı
            optionButton.addEventListener('click', (e) => {
                // Zaten tıklanmış veya devre dışı bırakılmış şıklara tıklamayı önle
                if (e.target.disabled || e.target.classList.contains('selected') || 
                    document.querySelector('.option.selected')) {
                    return;
                }
                
                // Tıklanan şıkı işaretle
                e.target.classList.add('selected');
                
                // Cevabı kontrol et
                this.checkAnswer(option);
            });
            
            this.optionsElement.appendChild(optionButton);
        });
    },
    
    // Zamanlayıcıyı başlat
    startTimer: function() {
        // Var olan zamanlayıcıyı temizle
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
                this.handleTimeUp(); // Tüm soru tiplerinde handleTimeUp çağrılacak
            }
        }, 1000);
    },
    
    // Zaman göstergesini güncelle
    updateTimeDisplay: function() {
        if (this.timeLeftElement) {
            this.timeLeftElement.textContent = this.timeLeft;
            
            // Son 5 saniyede kırmızı yap
            if (this.timeLeft <= 5) {
                this.timeLeftElement.classList.add('time-low');
            } else {
                this.timeLeftElement.classList.remove('time-low');
            }
        }
    },
    
    // Cevabı kontrol et
    checkAnswer: function(selectedAnswer) {
        // Eğer zaten cevap verilmişse işlem yapma
        if (document.querySelector('.result').style.display === 'block') {
            return;
        }
        
        // Sayacı durdur
        clearInterval(this.timerInterval);
        
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const correctAnswer = currentQuestion.correctAnswer;
        
        // Cevap doğru mu?
        const isCorrect = selectedAnswer === correctAnswer;
        
        // Cevabı mevcut bölüm istatistiğine ekle
        this.recordAnswer(isCorrect);

        // Doğru/Yanlış tipindeki sorular için
        if (currentQuestion.type === "DoğruYanlış" || currentQuestion.type === "TrueFalse") {
            const tfOptions = document.querySelectorAll('.true-false-option');
            tfOptions.forEach(option => {
                option.disabled = true;
                const isTrue = option.classList.contains('true');
                const isFalse = option.classList.contains('false');
                
                // Doğru cevap DOĞRU ise
                if (correctAnswer === this.getTranslation('trueOption') && isTrue) {
                    option.classList.add('correct');
                }
                // Doğru cevap YANLIŞ ise
                else if (correctAnswer === this.getTranslation('falseOption') && isFalse) {
                    option.classList.add('correct');
                }
                
                // Seçilen yanlış ise
                if ((isTrue && selectedAnswer === this.getTranslation('trueOption') && !isCorrect) ||
                    (isFalse && selectedAnswer === this.getTranslation('falseOption') && !isCorrect)) {
                    option.classList.add('wrong');
                }
                
                // Seçilen buton ise
                if ((isTrue && selectedAnswer === this.getTranslation('trueOption')) ||
                    (isFalse && selectedAnswer === this.getTranslation('falseOption'))) {
                    option.classList.add('selected');
                }
            });
        } else {
            // Normal çoktan seçmeli sorular için
            const options = document.querySelectorAll('.option');
            options.forEach(option => {
                option.disabled = true;
                option.classList.add('answered'); // Cevaplandığını belirt
                
                if (option.textContent === correctAnswer) {
                    option.classList.add('correct');
                } else if (option.textContent === selectedAnswer && !isCorrect) {
                    option.classList.add('wrong');
                }
            });
        }
        
        // Sonucu göster
        const resultElement = document.getElementById('result');
        if (!resultElement) {
            console.warn('Result elementi bulunamadı, oluşturuluyor...');
            this.createResultElement();
        }
        
        if (resultElement) {
            if (isCorrect) {
                // Tam ekran doğru modalı
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
                // Puanı artır
                const scoreForQuestion = Math.max(1, Math.ceil(this.timeLeft / 5));
                this.addScore(scoreForQuestion);
                this.correctAnswers++;
                // Ses efekti çal
                if (this.soundEnabled) {
                    const correctSound = document.getElementById('sound-correct');
                    if (correctSound) correctSound.play().catch(e => console.error("Ses çalınamadı:", e));
                }
            } else {
                // Tam ekran yanlış modalı
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
                // Ses efekti çal
                if (this.soundEnabled) {
                    const wrongSound = document.getElementById('sound-wrong');
                    if (wrongSound) wrongSound.play().catch(e => console.error("Ses çalınamadı:", e));
                }
            }
        }
        
        // Sonuc elementini görünür yap
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
    
    // Boşluk doldurma cevabını kontrol et
    checkBlankFillingAnswer: function(userAnswer, correctAnswer) {
        clearInterval(this.timerInterval);
        const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
        this.recordAnswer(isCorrect);

        const answerInput = document.getElementById('blank-answer');
        const submitButton = document.getElementById('submit-answer');
        if (answerInput) answerInput.disabled = true;
        if (submitButton) submitButton.disabled = true;

        // Sonucu tam ekran modal ile göster
        if (isCorrect) {
            // DOĞRU MODAL
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
            // Puanı artır
            const scoreForQuestion = Math.max(1, Math.ceil(this.timeLeft / 5));
            this.addScore(scoreForQuestion);
            this.correctAnswers++;
            if (this.soundEnabled) {
                const correctSound = document.getElementById('sound-correct');
                if (correctSound) correctSound.play().catch(e => {});
            }
        } else {
            // YANLIŞ MODAL
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

        if (this.lives <= 0) {
            setTimeout(() => {
                this.showResult();
            }, 1500);
        }
    },
    
    // Doğru cevaba benzer yanlış şıklar üret
    generateWrongOptions: function(correctAnswer) {
        // Bu fonksiyon, doğru cevaba benzer yanlış şıklar üretmek için çeşitli stratejiler kullanır
        
        // Basit bir strateji: Türkçe'deki yaygın kelimelerden rastgele 3 tane seç
        const commonWords = [
            "Elma", "Türkiye", "Ankara", "İstanbul", "Kitap", "Bilgisayar", "Araba", 
            "Deniz", "Güneş", "Ay", "Yıldız", "Okul", "Öğretmen", "Öğrenci",
            "Çiçek", "Ağaç", "Orman", "Dağ", "Nehir", "Göl", "Okyanus", "Müzik",
            "Film", "Tiyatro", "Spor", "Futbol", "Basketbol", "Voleybol", "Tenis"
        ];
        
        let wrongOptions = [];
        
        // Doğru cevabı dönüştür (sayı ise kelimeye çevir, tek kelime ise başka kelimeler seç)
        if (!isNaN(correctAnswer)) {
            // Sayıysa, yakın sayılar üret
            const correctNum = parseInt(correctAnswer);
            const randomOffset = () => Math.floor(Math.random() * 10) + 1;
            
            wrongOptions = [
                String(correctNum + randomOffset()),
                String(correctNum - randomOffset()),
                String(correctNum * 2)
            ];
        } else {
            // Kelime ise, rastgele kelimeler seç
            let availableWords = commonWords.filter(word => word.toLowerCase() !== correctAnswer.toLowerCase());
            availableWords = this.shuffleArray(availableWords);
            wrongOptions = availableWords.slice(0, 3);
        }
        
        return wrongOptions;
    },
    
    // Mevcut seviye için soruları yükle
    loadQuestionsForCurrentLevel: function() {
        console.log(`Seviye ${this.currentLevel} için sorular yükleniyor...`);
        
        if (!this.questionsData || !this.selectedCategory) {
            console.error("Soru verisi veya seçili kategori bulunamadı!");
            return;
        }
        
        // Seçilen kategoriden sorular
        let categoryQuestions = this.questionsData[this.selectedCategory] || [];
        
        if (categoryQuestions.length === 0) {
            console.error(`${this.selectedCategory} kategorisinde soru bulunamadı!`);
            return;
        }
        
        // Hamburger menüdeki zorluk ayarını al
        const difficultySelect = document.getElementById('difficulty-level');
        let selectedDifficulty = 'medium'; // varsayılan
        
        if (difficultySelect && difficultySelect.value) {
            selectedDifficulty = difficultySelect.value;
            console.log('Zorluk dropdown\'dan alındı:', selectedDifficulty);
        } else {
            // localStorage'dan zorluk ayarını al
            selectedDifficulty = localStorage.getItem('difficulty') || 
                                localStorage.getItem('calculated_difficulty') || 
                                (this.userSettings && this.userSettings.difficulty) ||
                                this.currentDifficulty || 'medium';
            console.log('Zorluk localStorage\'dan alındı:', selectedDifficulty);
        }
        
        // Zorluk seviyesini sayısal değere çevir
        const difficultyMapping = {
            'easy': 1,
            'medium': 2, 
            'hard': 3
        };
        
        const targetDifficulty = difficultyMapping[selectedDifficulty] || 2;
        console.log(`Seçilen zorluk: ${selectedDifficulty} (seviye ${targetDifficulty})`);
        console.log('Zorluk eşleme tablosu:', difficultyMapping);
        console.log('localStorage difficulty:', localStorage.getItem('difficulty'));
        console.log('localStorage calculated_difficulty:', localStorage.getItem('calculated_difficulty'));
        
        // Soruları zorluklarına göre grupla
        const groupedByDifficulty = {};
        categoryQuestions.forEach(question => {
            // Zorluk seviyesi belirtilmemişse 2 olarak kabul et (orta seviye)
            const difficulty = question.difficulty || 2;
            
            if (!groupedByDifficulty[difficulty]) {
                groupedByDifficulty[difficulty] = [];
            }
            
            groupedByDifficulty[difficulty].push(question);
        });
        
        // Debug bilgisi
        console.log('Seçilen kategori:', this.selectedCategory);
        console.log('Kategoride toplam soru sayısı:', categoryQuestions.length);
        console.log('Zorluk seviyelerine göre gruplandırılmış sorular:', groupedByDifficulty);
        console.log('Zorluk seviyesi 3 olan soru sayısı:', (groupedByDifficulty[3] || []).length);
        
        // Seçilen zorluk seviyesindeki soruları kesinlikle al - karışım yok!
        let levelQuestions = [];
        
        // SADECE hedef zorluk seviyesinden sorular al
        const targetQuestions = groupedByDifficulty[targetDifficulty] || [];
        console.log(`Hedef zorluk seviyesi ${targetDifficulty} için mevcut soru sayısı:`, targetQuestions.length);
        
        if (targetQuestions.length > 0) {
            const shuffled = this.shuffleArray([...targetQuestions]);
            levelQuestions = shuffled;
            console.log(`✅ Seçilen zorluk seviyesi (${targetDifficulty}) için ${levelQuestions.length} soru bulundu`);
        } else {
            console.warn(`⚠️ Seçilen zorluk seviyesi (${targetDifficulty}) için hiç soru bulunamadı!`);
        }
        
        // Eğer hiç soru yoksa kullanıcıyı bilgilendir
        if (levelQuestions.length === 0) {
            const difficultyNames = { 1: 'Kolay', 2: 'Orta', 3: 'Zor' };
            const difficultyName = difficultyNames[targetDifficulty] || 'Bilinmeyen';
            
            alert(`Bu kategoride "${difficultyName}" seviyesinde soru bulunmuyor. Lütfen başka bir kategori veya zorluk seviyesi seçin.`);
            
            // Kategori seçimine geri dön
            this.displayCategories();
            return;
        }
        
        // En fazla 10 soru göster (kullanıcının seçtiği zorluk seviyesinden)
        this.questions = levelQuestions.slice(0, Math.min(10, levelQuestions.length));
        this.arrangeBlankFillingFirst();
        
        // Debug: Yüklenen soruların zorluk seviyelerini kontrol et
        const difficultyCheck = {};
        this.questions.forEach(q => {
            const diff = q.difficulty || 'undefined';
            difficultyCheck[diff] = (difficultyCheck[diff] || 0) + 1;
        });
        const difficultyNames = { 1: 'Kolay', 2: 'Orta', 3: 'Zor' };
        console.log(`🎯 Seçilen zorluk: ${difficultyNames[targetDifficulty]} (${targetDifficulty})`);
        console.log(`✅ Yüklenen ${this.questions.length} sorunun zorluk dağılımı:`, difficultyCheck);
        console.log(`Seviye ${this.currentLevel} için ${this.questions.length} soru yüklendi.`);
        
        // İlk soruyu göster
        if (this.questions.length > 0) {
            this.currentQuestionIndex = 0;
            this.startQuiz();
        } else {
            // Yeterli soru yoksa kategori seçimine geri dön
            console.error("Bu seviye için yeterli soru bulunamadı!");
            this.displayCategories();
        }
    },
    
    // Doğru/Yanlış tipi soruları göster
    loadTrueFalseQuestion: function(questionData) {
        // Sonuç alanını temizle
        if (this.resultElement) {
            this.resultElement.innerHTML = '';
            this.resultElement.className = 'result';
            this.resultElement.style.display = 'none';
        }
        
        // Sonraki soru butununu gizle
        if (this.nextButton) {
            this.nextButton.style.display = 'none';
        }
        
        // Soruyu göster
        if (this.questionElement) {
            // Çevirisi varsa çeviriyi göster
            if (questionData.translations && questionData.translations[this.currentLanguage] && questionData.translations[this.currentLanguage].question) {
                this.questionElement.textContent = questionData.translations[this.currentLanguage].question;
            } else {
                this.questionElement.textContent = questionData.question;
            }
            
            // Eğer soruda görsel varsa göster
            if (questionData.imageUrl) {
                this.loadQuestionImage(questionData);
            }
        }
        
        // Doğru/Yanlış seçeneklerini göster
        if (this.optionsElement) {
            this.optionsElement.innerHTML = '';
            this.optionsElement.style.display = 'flex';
            this.optionsElement.style.flexDirection = 'column';
            this.optionsElement.style.alignItems = 'center';
            this.optionsElement.style.justifyContent = 'center';
            this.optionsElement.style.width = '100%';
            
            // Seçenekler
            const trueOption = document.createElement('button');
            trueOption.className = 'true-false-option true';
            trueOption.innerHTML = `<i class="fas fa-check"></i> ${this.getTranslation('trueOption')}`;
            
            const falseOption = document.createElement('button');
            falseOption.className = 'true-false-option false';
            falseOption.innerHTML = `<i class="fas fa-times"></i> ${this.getTranslation('falseOption')}`;
            
            // Tıklama olayları
            trueOption.addEventListener('click', (e) => {
                // Zaten cevaplandıysa işlem yapma
                if (e.target.disabled || e.target.classList.contains('selected') || 
                    document.querySelector('.true-false-option.selected') || 
                    document.querySelector('.result').style.display === 'block') {
                    return;
                }
                
                // Tıklanan şıkı işaretle
                e.target.classList.add('selected');
                
                this.checkAnswer(this.getTranslation('trueOption'));
            });
            
            falseOption.addEventListener('click', (e) => {
                // Zaten cevaplandıysa işlem yapma
                if (e.target.disabled || e.target.classList.contains('selected') || 
                    document.querySelector('.true-false-option.selected') || 
                    document.querySelector('.result').style.display === 'block') {
                    return;
                }
                
                // Tıklanan şıkı işaretle
                e.target.classList.add('selected');
                
                this.checkAnswer(this.getTranslation('falseOption'));
            });
            
            // Seçenekleri ekle
            this.optionsElement.appendChild(trueOption);
            this.optionsElement.appendChild(falseOption);
        }
        
        // Sayacı başlat
        this.startTimer();
    },
    
    // Doğru/Yanlış cevabını kontrol et
    selectTrueFalseAnswer: function(selectedAnswer, correctAnswer) {
        // Sayacı durdur
        clearInterval(this.timerInterval);
        
        const isCorrect = selectedAnswer === correctAnswer;
        
        // Cevabı mevcut bölüm istatistiğine ekle
        this.recordAnswer(isCorrect);
        
        // Şıkları devre dışı bırak ve doğru/yanlış renklendir
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.disabled = true;
            
            if (option.textContent === correctAnswer) {
                option.classList.add('correct');
            } else if (option.textContent === selectedAnswer && !isCorrect) {
                option.classList.add('wrong');
            }
        });
        
        // Sonucu göster
        if (this.resultElement) {
            if (isCorrect) {
                this.resultElement.innerHTML = `
                    <div class="correct-answer-container">
                        <div class="correct-icon"><i class="fas fa-badge-check"></i></div>
                        <div class="correct-text">Doğru!</div>
                        <div class="correct-animation">
                            <span>+</span>
                            <span>${Math.max(1, Math.ceil(this.timeLeft / 3))}</span>
                        </div>
                    </div>
                    <button id="next-question" class="next-button">Sonraki Soru</button>
                `;
                this.resultElement.className = 'result correct';
                
                // Sonraki soru butonuna olay dinleyicisi ekle - showNextQuestion fonksiyonunu çağır
                const nextBtn = this.resultElement.querySelector('#next-question');
                if (nextBtn) {
                    nextBtn.addEventListener('click', () => this.showNextQuestion());
                }
                
                // Puanı artır - kalan süreye göre puan ver (min 1, max 5)
                const scoreForQuestion = Math.max(1, Math.ceil(this.timeLeft / 3));
                this.addScore(scoreForQuestion);
                
                // Ses efekti çal
                if (this.soundEnabled) {
                    const correctSound = document.getElementById('sound-correct');
                    if (correctSound) correctSound.play().catch(e => console.error("Ses çalınamadı:", e));
                }
            } else {
                this.resultElement.innerHTML = `Yanlış! Doğru cevap: <strong>${correctAnswer}</strong>`;
                this.resultElement.className = 'result wrong';
                
                // Can azalt
                this.loseLife();
                
                // Ses efekti çal
                if (this.soundEnabled) {
                    const wrongSound = document.getElementById('sound-wrong');
                    if (wrongSound) wrongSound.play().catch(e => console.error("Ses çalınamadı:", e));
                }
                
                // Yanlış cevap durumunda sonraki soru butonunu göster
                if (this.nextButton) {
                    this.nextButton.style.display = 'block';
                }
            }
            
            this.resultElement.style.display = 'block';
        }
        
        // Skoru güncelle
        this.updateScoreDisplay();
        
        // İstatistiği güncelle
        this.answeredQuestions++;
        this.answerTimes.push(this.TIME_PER_QUESTION - this.timeLeft);
        
        // Oyun bitti mi kontrol et
        if (this.lives <= 0) {
            setTimeout(() => {
                this.showResult();
            }, 1500);
        }
    },
    
    // Profil sayfasını göster
    showProfilePage: function() {
        // Ana içerikleri gizle
        if (this.quizElement) this.quizElement.style.display = 'none';
        if (this.resultElement) this.resultElement.style.display = 'none';
        if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'none';
        
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.style.display = 'none';
        
        const onlineGameOptions = document.getElementById('online-game-options');
        if (onlineGameOptions) onlineGameOptions.style.display = 'none';
        
        const globalLeaderboard = document.getElementById('global-leaderboard'); 
        if (globalLeaderboard) globalLeaderboard.style.display = 'none';
        
        // Diğer sayfaları da gizle
        const friendsPage = document.getElementById('friends-page');
        if (friendsPage) friendsPage.style.display = 'none';
        
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) adminPanel.style.display = 'none';
        
        // Profil sayfasını görüntüle
        const profilePage = document.getElementById('profile-page');
        if (profilePage) {
            profilePage.style.display = 'block';
            
            // Profil bilgilerini yükle
            this.loadProfileData();
            
            // Profil sayfası butonlarına event listener'ları ekle
            this.addProfileEventListeners();
        } else {
            // Profil sayfası yoksa uyarı göster
            this.showToast("Profil sayfası henüz eklenmemiş", "toast-warning");
            
            // Ana menüye geri dön
            if (mainMenu) mainMenu.style.display = 'block';
        }
    },
    
    // Profil sayfası butonlarına olay dinleyicileri ekle
    addProfileEventListeners: function() {
        // Ana menüye dön butonu
        const backFromProfileBtn = document.getElementById('back-from-profile');
        if (backFromProfileBtn) {
            backFromProfileBtn.addEventListener('click', () => {
                // Profil sayfasını gizle
                const profilePage = document.getElementById('profile-page');
                if (profilePage) profilePage.style.display = 'none';
                
                // Ana menüyü göster
                const mainMenu = document.getElementById('main-menu');
                if (mainMenu) mainMenu.style.display = 'block';
            });
        }
        
        // Çıkış yap butonu
        const logoutFromProfileBtn = document.getElementById('logout-from-profile');
        if (logoutFromProfileBtn) {
            logoutFromProfileBtn.addEventListener('click', () => {
                // Firebase ile çıkış yap
                if (firebase.auth) {
                    firebase.auth().signOut().then(() => {
                        window.location.href = 'login.html';
                    }).catch(error => {
                        console.error("Çıkış yapılırken hata oluştu:", error);
                        this.showToast("Çıkış yapılırken bir hata oluştu", "toast-error");
                    });
                }
            });
        }
        
        // Profili düzenle butonu
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                this.showToast("Profil düzenleme özelliği yakında eklenecek", "toast-info");
            });
        }
    },
    
    // Profil verilerini yükle
    loadProfileData: function() {
        // Kullanıcı bilgilerini yükle
        if (firebase.auth && firebase.auth().currentUser) {
            const user = firebase.auth().currentUser;
            
            // Kullanıcı adı ve e-posta
            const profileName = document.getElementById('profile-name');
            if (profileName) profileName.textContent = user.displayName || user.email || 'Kullanıcı';
            
            const profileEmail = document.getElementById('profile-email');
            if (profileEmail) profileEmail.textContent = user.email || '';
            
            // Üyelik tarihi
            const joinDate = document.getElementById('profile-join-date');
            if (joinDate && user.metadata && user.metadata.creationTime) {
                const date = new Date(user.metadata.creationTime);
                joinDate.textContent = date.toLocaleDateString();
            }
            
            // İstatistikler
            const stats = this.getStats();
            
            const totalGames = document.getElementById('stats-total-games');
            if (totalGames) totalGames.textContent = stats.totalGames || 0;
            
            const totalQuestions = document.getElementById('stats-total-questions');
            if (totalQuestions) totalQuestions.textContent = stats.totalQuestions || 0;
            
            const correctAnswers = document.getElementById('stats-correct-answers');
            if (correctAnswers) correctAnswers.textContent = stats.correctAnswers || 0;
            
            // Doğruluk oranı
            const accuracy = document.getElementById('stats-accuracy');
            if (accuracy) {
                const accuracyValue = stats.totalQuestions > 0 
                    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
                    : 0;
                accuracy.textContent = `%${accuracyValue}`;
            }
            
            // Rozetleri yükle
            this.loadUserBadgesForProfile(user.uid);
            
            // Yüksek skorları yükle
            this.loadHighScoresForProfile(user.uid);
            
            // Son aktiviteleri yükle
            this.loadRecentActivitiesForProfile(user.uid);
        }
    },
    
    // Kullanıcı rozetlerini profil için yükle
    loadUserBadgesForProfile: function(userId) {
        const badgesContainer = document.getElementById('profile-badges-container');
        if (!badgesContainer) return;
        
        badgesContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Rozetler yükleniyor...</div>';
        
        // Firebase'den kullanıcı rozetlerini çek
        if (firebase.database) {
            const badgesRef = firebase.database().ref(`users/${userId}/badges`);
            
            badgesRef.once('value')
                .then(snapshot => {
                    const badges = snapshot.val();
                    
                    if (!badges) {
                        badgesContainer.innerHTML = '<div class="badge-placeholder">Henüz rozet kazanılmadı</div>';
                        return;
                    }
                    
                    // Rozetleri ekrana yazdir
                    badgesContainer.innerHTML = '';
                    
                    Object.keys(badges).forEach(badgeId => {
                        const badge = badges[badgeId];
                        
                        const badgeElement = document.createElement('div');
                        badgeElement.className = 'badge-item';
                        badgeElement.innerHTML = `
                            <div class="badge-icon">
                                <i class="fas ${badge.icon || 'fa-award'}"></i>
                            </div>
                            <div class="badge-name">${badge.name || 'Bilinmeyen Rozet'}</div>
                            <div class="badge-date">${new Date(badge.earnedDate || Date.now()).toLocaleDateString()}</div>
                        `;
                        
                        badgesContainer.appendChild(badgeElement);
                    });
                })
                .catch(error => {
                    console.error("Rozetler yüklenirken hata oluştu:", error);
                    badgesContainer.innerHTML = '<div class="error-message">Rozetler yüklenemedi</div>';
                });
        } else {
            // Firebase yoksa demo veriler göster
            badgesContainer.innerHTML = `
                <div class="badge-item">
                    <div class="badge-icon"><i class="fas fa-trophy"></i></div>
                    <div class="badge-name">Bilgi Kralı</div>
                    <div class="badge-date">01.01.2025</div>
                </div>
                <div class="badge-item">
                    <div class="badge-icon"><i class="fas fa-bolt"></i></div>
                    <div class="badge-name">Hız Ustası</div>
                    <div class="badge-date">15.02.2025</div>
                </div>
                <div class="badge-item">
                    <div class="badge-icon"><i class="fas fa-book"></i></div>
                    <div class="badge-name">Bilim Dahisi</div>
                    <div class="badge-date">23.03.2025</div>
                </div>
            `;
        }
    },
    
    // Yüksek skorları profil için yükle
    loadHighScoresForProfile: function(userId) {
        const highScoresTable = document.getElementById('profile-high-scores');
        if (!highScoresTable) return;
        
        highScoresTable.innerHTML = '<tr><td colspan="3" class="loading-scores">Skorlar yükleniyor...</td></tr>';
        
        // Firebase'den kullanıcının yüksek skorlarını çek
        if (firebase.database) {
            const scoresRef = firebase.database().ref(`users/${userId}/scores`)
                .orderByChild('score')
                .limitToLast(10);
            
            scoresRef.once('value')
                .then(snapshot => {
                    const scores = snapshot.val();
                    
                    if (!scores) {
                        highScoresTable.innerHTML = '<tr><td colspan="3" class="no-data">Henüz kaydedilen skor yok</td></tr>';
                        return;
                    }
                    
                    // Skorları diziye çevir ve skora göre sırala
                    const scoresArray = [];
                    Object.keys(scores).forEach(key => {
                        scoresArray.push({
                            id: key,
                            ...scores[key]
                        });
                    });
                    
                    // Skora göre azalan sıralama
                    scoresArray.sort((a, b) => b.score - a.score);
                    
                    // Tabloyu oluştur
                    highScoresTable.innerHTML = '';
                    
                    scoresArray.forEach(score => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${score.category || 'Genel'}</td>
                            <td>${score.score || 0}</td>
                            <td>${new Date(score.date || Date.now()).toLocaleDateString()}</td>
                        `;
                        
                        highScoresTable.appendChild(row);
                    });
                })
                .catch(error => {
                    console.error("Skorlar yüklenirken hata oluştu:", error);
                    highScoresTable.innerHTML = '<tr><td colspan="3" class="error-data">Skorlar yüklenemedi</td></tr>';
                });
        } else {
            // Firebase yoksa demo veriler göster
            highScoresTable.innerHTML = `
                <tr><td>Genel Kültür</td><td>85</td><td>01.04.2025</td></tr>
                <tr><td>Bilim</td><td>78</td><td>28.03.2025</td></tr>
                <tr><td>Tarih</td><td>72</td><td>15.03.2025</td></tr>
            `;
        }
    },
    
    // Son aktiviteleri profil için yükle
    loadRecentActivitiesForProfile: function(userId) {
        const activitiesList = document.getElementById('recent-activities-list');
        if (!activitiesList) return;
        
        // Firebase'den kullanıcının son aktivitelerini çek
        if (firebase.database) {
            const activitiesRef = firebase.database().ref(`users/${userId}/activities`)
                .orderByChild('timestamp')
                .limitToLast(5);
            
            activitiesRef.once('value')
                .then(snapshot => {
                    const activities = snapshot.val();
                    
                    if (!activities) {
                        activitiesList.innerHTML = '<div class="no-activity">Henüz aktivite yok</div>';
                        return;
                    }
                    
                    // Aktiviteleri diziye çevir ve zamana göre sırala
                    const activitiesArray = [];
                    Object.keys(activities).forEach(key => {
                        activitiesArray.push({
                            id: key,
                            ...activities[key]
                        });
                    });
                    
                    // Zamana göre azalan sıralama (en yeni en üstte)
                    activitiesArray.sort((a, b) => b.timestamp - a.timestamp);
                    
                    // Listeyi oluştur
                    activitiesList.innerHTML = '';
                    
                    activitiesArray.forEach(activity => {
                        const activityElement = document.createElement('div');
                        activityElement.className = 'activity-item';
                        
                        // Aktivite tipine göre ikon seç
                        let icon = 'fa-star';
                        switch (activity.type) {
                            case 'game':
                                icon = 'fa-gamepad';
                                break;
                            case 'badge':
                                icon = 'fa-award';
                                break;
                            case 'task':
                                icon = 'fa-tasks';
                                break;
                        }
                        
                        // Aktivite zaman bilgisini hesapla
                        const timeAgo = this.calculateTimeAgo(activity.timestamp);
                        
                        activityElement.innerHTML = `
                            <div class="activity-icon"><i class="fas ${icon}"></i></div>
                            <div class="activity-details">
                                <div class="activity-title">${activity.description || 'Bilinmeyen aktivite'}</div>
                                <div class="activity-time">${timeAgo}</div>
                            </div>
                            ${activity.score ? `<div class="activity-score">Skor: ${activity.score}</div>` : ''}
                        `;
                        
                        activitiesList.appendChild(activityElement);
                    });
                })
                .catch(error => {
                    console.error("Aktiviteler yüklenirken hata oluştu:", error);
                    activitiesList.innerHTML = '<div class="error-activity">Aktiviteler yüklenemedi</div>';
                });
        }
    },
    
    // Zaman farkını hesapla (ne kadar zaman önce)
    calculateTimeAgo: function(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        // Zaman farkını insan dostu formata çevir
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return days === 1 ? '1 gün önce' : `${days} gün önce`;
        } else if (hours > 0) {
            return hours === 1 ? '1 saat önce' : `${hours} saat önce`;
        } else if (minutes > 0) {
            return minutes === 1 ? '1 dakika önce' : `${minutes} dakika önce`;
        } else {
            return seconds <= 5 ? 'Az önce' : `${seconds} saniye önce`;
        }
    },
    
    // Lider tablosunu göster
    showGlobalLeaderboard: function() {
        // Ana içerikleri gizle
        if (this.quizElement) this.quizElement.style.display = 'none';
        if (this.resultElement) this.resultElement.style.display = 'none';
        if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'none';
        
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.style.display = 'none';
        
        const onlineGameOptions = document.getElementById('online-game-options');
        if (onlineGameOptions) onlineGameOptions.style.display = 'none';
        
        const profilePage = document.getElementById('profile-page');
        if (profilePage) profilePage.style.display = 'none';
        
        // Diğer sayfaları da gizle
        const friendsPage = document.getElementById('friends-page');
        if (friendsPage) friendsPage.style.display = 'none';
        
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) adminPanel.style.display = 'none';
        
        const winnerScreen = document.getElementById('winner-screen');
        if (winnerScreen) winnerScreen.style.display = 'none';
        
        // Lider tablosunu görüntüle
        const globalLeaderboard = document.getElementById('global-leaderboard');
        if (globalLeaderboard) {
            globalLeaderboard.style.display = 'block';
            
            // Lider tablosu verilerini yükle
            this.loadLeaderboardData();
        }
    },
    
    // Lider tablosu verilerini yükle
    loadLeaderboardData: function() {
        const leaderboardList = document.getElementById('leaderboard-list');
        if (!leaderboardList) return;
        
        // Yükleniyor mesajı göster
        leaderboardList.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Lider tablosu yükleniyor...</p></div>';
        
        // Firebase'den verileri çek
        if (firebase.database) {
            const leaderboardRef = firebase.database().ref('leaderboard');
            const categoryFilter = document.getElementById('leaderboard-category').value;
            const timeFilter = document.getElementById('leaderboard-time').value;
            
            leaderboardRef.orderByChild('score').limitToLast(50).once('value')
                .then(snapshot => {
                    const data = snapshot.val();
                    if (!data) {
                        leaderboardList.innerHTML = '<div class="no-data-message">Henüz kayıt yok</div>';
                        return;
                    }
                    
                    // Verileri skor sırasına göre diziye çevir
                    const leaderboardArray = [];
                    Object.keys(data).forEach(key => {
                        leaderboardArray.push({
                            id: key,
                            ...data[key]
                        });
                    });
                    
                    // Skora göre sırala (azalan)
                    leaderboardArray.sort((a, b) => b.score - a.score);
                    
                    // Tabloya ekle
                    leaderboardList.innerHTML = '';
                    const table = document.createElement('table');
                    table.className = 'leaderboard-table';
                    
                    // Tablo başlığı
                    const thead = document.createElement('thead');
                    thead.innerHTML = `
                        <tr>
                            <th>Sıra</th>
                            <th>Kullanıcı</th>
                            <th>Skor</th>
                            <th>Kategori</th>
                            <th>Tarih</th>
                        </tr>
                    `;
                    table.appendChild(thead);
                    
                    // Tablo içeriği
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
                    console.error("Lider tablosu yüklenirken hata:", error);
                    leaderboardList.innerHTML = '<div class="error-message">Lider tablosu yüklenemedi</div>';
                });
        } else {
            // Firebase yoksa demo veri göster
            leaderboardList.innerHTML = `
                <div class="demo-data-message">
                    <p>Demo verileri gösteriliyor (Firebase bağlantısı yok)</p>
                    <table class="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Sıra</th>
                                <th>Kullanıcı</th>
                                <th>Skor</th>
                                <th>Kategori</th>
                                <th>Tarih</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>1</td><td>Oyuncu123</td><td>95</td><td>Genel Kültür</td><td>01.05.2025</td></tr>
                            <tr><td>2</td><td>BilgiKralı</td><td>87</td><td>Bilim</td><td>30.04.2025</td></tr>
                            <tr><td>3</td><td>QuizMaster</td><td>82</td><td>Tarih</td><td>29.04.2025</td></tr>
                        </tbody>
                    </table>
                </div>
            `;
        }
    },
    
    // updateTimer fonksiyonunu güncelle
    updateTimer: function() {
        this.timeLeft--;
        
        // Zamanı göster
        this.updateTimeDisplay();
        
        // Süre bitti mi?
        if (this.timeLeft <= 0) {
            clearInterval(this.timerInterval);
            this.handleTimeUp();
        }
    },
    
    // Cevabı kaydet - bölüm istatistiklerini takip etmek için
    recordAnswer: function(isCorrect) {
        // Mevcut bölüm numarası (0-tabanlı)
        const sectionIndex = Math.floor(this.currentQuestionIndex / 5);
        
        console.log(`Cevap kaydediliyor: Soru: ${this.currentQuestionIndex+1}, Bölüm: ${sectionIndex+1}, Doğru mu: ${isCorrect}`);
        
        // Eğer bu bölüm için henüz istatistik oluşturulmadıysa, yeni oluştur
        if (!this.sectionStats[sectionIndex]) {
            this.sectionStats[sectionIndex] = { correct: 0, total: 0 };
        }
        
        // Toplam cevap sayısını artır
        this.sectionStats[sectionIndex].total++;
        
        // Doğru ise doğru cevap sayısını artır
        if (isCorrect) {
            this.sectionStats[sectionIndex].correct++;
        }
        
        console.log(`Bölüm ${sectionIndex+1} istatistikleri güncellendi: Doğru: ${this.sectionStats[sectionIndex].correct}, Toplam: ${this.sectionStats[sectionIndex].total}`);
        console.log('Tüm bölüm istatistikleri:', JSON.stringify(this.sectionStats));
    },
    
    // Süre dolduğunda yapılacaklar
    handleTimeUp: function() {
        this.stopTimer();
        this.timeLeftElement.textContent = "Süre Bitti!";
        const optionButtons = this.optionsElement.querySelectorAll('.option');
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const questionTime = currentQuestion.category === "Boşluk Doldurma" ? 
            this.TIME_PER_BLANK_FILLING_QUESTION : this.TIME_PER_QUESTION;
        this.answerTimes.push(questionTime); // Max süre
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
            // Pas jokeri kullanıldıysa can eksilmesin, modal çıkmasın, direkt sonraki soruya geç
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
                    <div class="timeout-modal-text">Süre Doldu!</div>
                    <div class="timeout-modal-correct">Doğru cevap: <strong>${currentQuestion.correctAnswer}</strong></div>
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
        if (this.lives <= 0) {
            setTimeout(() => {
                this.showResult();
            }, 1500);
            return;
        }
        if (this.nextButton) {
            this.nextButton.style.display = 'block';
        } else {
            setTimeout(() => {
                this.showNextQuestion();
            }, 2000);
        }
    },
    
    // Canlar bittiğinde oyun sonucunu gösterecek fonksiyonlar
    
    handleAnswerClick: function(button) {
        // Zamanlayıcıyı durdur
        this.stopTimer();
        
        // Sonuç elementini temizle
        if (this.resultElement) {
            this.resultElement.textContent = '';
            this.resultElement.style.display = 'none';
        }
        
        // Tıklanan butonu seç
        const selectedOption = button.textContent;
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        // Cevaplandığını belirt ve istatistiklere ekle
        const timeSpent = this.TIME_PER_QUESTION - this.timeLeft;
        this.answerTimes.push(timeSpent);
        this.answeredQuestions++;
        
        // Tüm şıkları devre dışı bırak
        const optionButtons = this.optionsElement.querySelectorAll('.option');
        optionButtons.forEach(btn => btn.disabled = true);
        
        // Doğru/yanlış kontrolü
        if (selectedOption === currentQuestion.correctAnswer) {
            button.classList.add('correct');
            
            // Skoru güncelle
            this.score++;
            // this.correctAnswers++; // <-- KALDIRILDI: Tekrar eden kod
            this.updateScoreDisplay();
            
            // Seviye ilerleme kontrolü
            this.levelProgress++;
            
            // Doğru cevap ses efekti
            this.playSound(this.soundCorrect);
            
            // Çevrimiçi oyunda skoru güncelle
            if (onlineGame && onlineGame.gameStarted) {
                onlineGame.submitAnswer(true);
            }
        } else {
            button.classList.add('wrong');
            
            // Doğru cevabı göster
            optionButtons.forEach(button => {
                if (button.textContent === currentQuestion.correctAnswer) {
                    button.classList.add('correct');
                }
            });
            
            this.playSound(this.soundWrong);
            
            // Canı azalt
            this.loseLife();
            
            // Çevrimiçi oyunda skoru güncelle
            if (onlineGame && onlineGame.gameStarted) {
                onlineGame.submitAnswer(false);
            }
            
            // Can kontrolü
            if (this.lives <= 0) {
                setTimeout(() => {
                    this.showResult();
                }, 1500);
                return;
            }
        }
        
        // Bir sonraki soruya geç
        setTimeout(() => {
            // Son soru ise sonuç ekranını göster
            if (this.currentQuestionIndex >= this.questions.length - 1) {
                this.showResult();
            } else {
                this.currentQuestionIndex++;
                this.loadQuestion();
            }
        }, 1500);
    },
    
    // Boşluk doldurma soruları için
    handleBlankFillingCorrectAnswer: function() {
        this.stopTimer();
        this.disableBlankFillingControls();
        // Tam ekran doğru modalı
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
        // this.correctAnswers++; // <-- KALDIRILDI: Tekrar eden kod, zaten checkBlankFillingAnswer içinde sayılıyor
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
        // Tam ekran yanlış modalı
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
        if (this.soundEnabled) {
            const wrongSound = document.getElementById('sound-wrong');
            if (wrongSound) wrongSound.play().catch(e => {});
        }
        if (typeof onlineGame !== 'undefined' && onlineGame && onlineGame.gameStarted) {
            onlineGame.submitAnswer(false);
        }
        if (this.lives <= 0) {
            setTimeout(() => {
                this.showResult();
            }, 1500);
            return;
        }
    },
    
    // Load question işlevini güncelle
    loadQuestion: function() {
        console.log('loadQuestion çağrıldı, soru indeksi:', this.currentQuestionIndex);
        
        try {
            // Önce önceki sorunun kalıntılarını temizle
            this.cleanupPreviousQuestion();
            
            // "Doğru!" yazısının olduğu elementi varsa gizle
            const correctMessageElement = document.querySelector('.correct-answer-container');
            if (correctMessageElement) {
                correctMessageElement.remove();
            }
            
            // Oyun bitti kontrolü yap
            if (this.lives <= 0) {
                this.showResult();
                return;
            }
            
            // Mevcut soru indeksi kontrolü
            if (this.currentQuestionIndex >= this.questions.length) {
                this.showResult();
                return;
            }
            
            const currentQuestion = this.questions[this.currentQuestionIndex];
            console.log('Yüklenen soru:', currentQuestion);
            
            // Çoklu oyun için extra kontroller
            const isOnlineGame = typeof onlineGame !== 'undefined' && onlineGame && onlineGame.gameStarted;
            
            // Zamanlayıcı elementini kontrol et ve oluştur
            let timerElement = document.getElementById('timer');
            if (!timerElement) {
                console.log('Timer elementi bulunamadı, oluşturuluyor...');
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
                    // Eğer question-container varsa onun üstüne ekle
                    const questionContainer = quizContainer.querySelector('.question-container');
                    if (questionContainer) {
                        quizContainer.insertBefore(timerElement, questionContainer);
                    } else {
                        quizContainer.appendChild(timerElement);
                    }
                }
            } else {
                // Zamanlayıcıyı görünür yap ve sıfırla
                timerElement.style.display = 'block';
                
                // Zamanlayıcı içindeki ilerleme çubuğunu sıfırla
                const progressBar = timerElement.querySelector('.timer-progress');
                if (progressBar) {
                    progressBar.style.width = '100%';
                }
                
                // Zamanlayıcı metnini güncelleyelim
                const timerText = timerElement.querySelector('.timer-text');
                if (timerText) {
                    timerText.textContent = this.TIME_PER_QUESTION;
                }
            }
            
            // Sonuç elementini kontrol et ve oluştur
            let resultElement = document.getElementById('result');
            if (!resultElement) {
                console.log('Result elementi bulunamadı, oluşturuluyor...');
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
            
            // Soru tipine göre yükleme işlemini yap
            if (currentQuestion.type === "DoğruYanlış" || currentQuestion.type === "TrueFalse") {
                this.loadTrueFalseQuestion(currentQuestion);
            } else if (currentQuestion.type === "BlankFilling") {
                this.loadBlankFillingQuestion(currentQuestion);
            } else {
                this.displayQuestion(currentQuestion);
            }
            
            // Zamanlayıcıyı başlat
            this.startTimer();
            
            // Çoklu oyun için extra gecikme ile yükleme kontrolü
            if (isOnlineGame) {
                // Önce tüm elementlerin görünürlüğünü kontrol et
                setTimeout(() => {
                    console.log('Çoklu oyun için soru görünürlüğü kontrol ediliyor');
                    
                    // Soru içeriğini kontrol et ve yeniden yükle
                    if (this.questionElement && (!this.questionElement.textContent || this.questionElement.textContent === '')) {
                        console.log('Soru metni eksik, yeniden yükleniyor:', currentQuestion.question);
                        this.questionElement.textContent = currentQuestion.question;
                    }
                    
                    // Şıkları kontrol et
                    if (this.optionsElement && this.optionsElement.children.length === 0) {
                        console.log('Şıklar eksik, yeniden yükleniyor');
                        this.displayOptions(currentQuestion.options || []);
                    }
                    
                    // Zamanlayıcıyı kontrol et ve yeniden başlat
                    if (this.timeLeft <= 0 || !this.timerInterval) {
                        console.log('Zamanlayıcı yeniden başlatılıyor');
                        this.startTimer();
                    }
                }, 300);
            }
        } catch (error) {
            console.error('Soru yükleme hatası:', error);
        }
    },
    
    // Timer elementini oluştur
    createTimerElement: function() {
        console.log('Timer elementi oluşturuluyor...');
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
            // Eğer question-container varsa onun üstüne ekle
            const questionContainer = quizContainer.querySelector('.question-container');
            if (questionContainer) {
                quizContainer.insertBefore(timerElement, questionContainer);
            } else {
                quizContainer.appendChild(timerElement);
            }
            console.log('Timer elementi başarıyla oluşturuldu');
        } else {
            console.error('Quiz container bulunamadı!');
        }
    },
    
    // Result elementini oluştur
    createResultElement: function() {
        console.log('Result elementi oluşturuluyor...');
        const resultElement = document.createElement('div');
        resultElement.id = 'result';
        resultElement.className = 'result';
        resultElement.style.display = 'none';
        
        // Quiz container'a ekle
        const optionsContainer = document.querySelector('.options-container');
        if (optionsContainer) {
            optionsContainer.parentNode.insertBefore(resultElement, optionsContainer.nextSibling);
            console.log('Result elementi başarıyla oluşturuldu');
        } else {
            const quizContainer = document.getElementById('quiz-container');
            if (quizContainer) {
                quizContainer.appendChild(resultElement);
                console.log('Result elementi quiz container\'a eklendi');
            } else {
                console.error('Quiz container bulunamadı!');
            }
        }
    },
    
    // showResult güncelleme
    showResult: function() {
        // Zamanlayıcıyı durdur
        this.stopTimer();
        
        // Debug: Oyun sonu değerlerini logla
        console.log("=== OYUN SONU DEBUG ===");
        console.log("currentQuestionIndex:", this.currentQuestionIndex);
        console.log("answeredQuestions:", this.answeredQuestions);
        console.log("correctAnswers:", this.correctAnswers);
        console.log("score:", this.score);
        console.log("lives:", this.lives);
        console.log("answerTimes length:", this.answerTimes.length);
        
        // FİNAL SKORU ve istatistikleri saklayalım
        const finalStats = {
            category: this.selectedCategory,
            score: this.score,
            correctAnswers: this.correctAnswers, // <-- EKLENDİ
            totalQuestions: this.currentQuestionIndex + 1, // <-- DÜZELTİLDİ: Gerçek cevaplanan soru sayısı
            lives: this.lives,
            avgTime: this.answerTimes.length > 0 ? 
                (this.answerTimes.reduce((a, b) => a + b, 0) / this.answerTimes.length).toFixed(1) : 0
        };
        
        console.log("finalStats:", finalStats);
        console.log("======================");
        
        // Oyun istatistiklerini kaydet
        this.saveGameStatistics();
        this.addNewHighScore(finalStats.category, finalStats.score, finalStats.totalQuestions);
        
        try {
            // TAM SAYFA SONUÇ EKRANI İÇİN SAYFAYI TEMİZLE
            // Body içeriğini tamamen siliyoruz!
            document.body.innerHTML = '';
            
            // CLEAN SONUÇ EKRANI
            const resultScreen = document.createElement('div');
            resultScreen.id = 'fullscreen-result';
            resultScreen.className = 'result-screen';
            
            // CSS Stilleri
            resultScreen.style.cssText = `
                background: linear-gradient(45deg, #4a148c, #e91e63);
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                padding: 20px;
                font-family: 'Poppins', sans-serif;
                color: white;
                box-sizing: border-box;
                text-align: center;
            `;
            
            // Dil seçimine göre başlık ve sonuç metinleri
            const appName = languages[this.currentLanguage].quizAppName;
            const resultText = languages[this.currentLanguage].resultTitle;
            
            // Başlık
            const header = document.createElement('div');
            header.className = 'result-header';
            header.innerHTML = `
                <h1 style="font-size: 2rem; margin-bottom: 5px; color: white;">${appName}</h1>
                <h2 style="font-size: 1.5rem; margin-top: 0; color: white;"><i class="fas fa-trophy"></i> ${resultText}</h2>
            `;
            
            // Sonuç kartı
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
            
            // Sonuç mesajı
            let resultMessage = '';
            let perfectScore = false;
            
            // Dilin çevirilerini al
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
                // Tüm soruları doğru cevapladı
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
            
            // Sonuç mesajını ekleyelim
            const messageDiv = document.createElement('div');
            messageDiv.className = 'result-message';
            messageDiv.innerHTML = `<p>${resultMessage}</p>`;
            
            // İstatistikler bölümü
            const statsDiv = document.createElement('div');
            statsDiv.className = 'statistics-section';
            
            // Dil seçimine göre istatistik başlığı
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
            
            // Ana menüye dönüş butonu
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
                // Sayfayı yeniden yükle ve ana sayfaya dön
                window.location.reload();
            });
            
            // Paylaş butonu
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
                    shareText = `${appName}'nda ${finalStats.category} kategorisinde ${finalStats.totalQuestions} sorudan ${finalStats.correctAnswers} tanesini doğru cevapladım!`;
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
                            .then(() => alert('Skor metni panoya kopyalandı!'));
                    });
                } else {
                    // Panoya kopyala
                    navigator.clipboard.writeText(shareText)
                        .then(() => alert('Skor metni panoya kopyalandı!'));
                }
            });
            
            // Butonları ekle
            buttonsDiv.appendChild(mainMenuBtn);
            buttonsDiv.appendChild(shareBtn);
            
            // Tüm bileşenleri ana karta ekleyelim
            resultCard.appendChild(messageDiv);
            resultCard.appendChild(statsDiv);
            resultCard.appendChild(buttonsDiv);
            
            // Bileşenleri sonuç ekranına ekleyelim
            resultScreen.appendChild(header);
            resultScreen.appendChild(resultCard);
            
            // Perfect Score için konfeti efekti
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
            
            // Sonuç ekranını body'ye ekle
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
            console.error("Sonuç ekranı oluşturulurken hata:", error);
            alert("Sonuç ekranı oluşturulurken bir hata oluştu. Lütfen sayfayı yenileyiniz.");
            window.location.reload();
        }
        
        // Oyun durumunu sıfırla
        this.score = 0;
        // this.lives = 5; // BUNU SİLİYORUM
        this.currentQuestionIndex = 0;
        this.answeredQuestions = 0;
        this.answerTimes = [];
        this.currentSection = 1;
        this.resetJokers();
    },
    
    // Sesi güvenli şekilde çal
    playSoundSafely: function(audioElement) {
        if (audioElement && this.soundEnabled) {
            audioElement.play().catch(e => console.log("Ses çalma hatası:", e));
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
        
        // Konfeti parçacıkları için renkler
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
        
        // Konfeti parçacıkları oluştur
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
                
                // Her parçacığı 3-6 saniye sonra kaldır
                setTimeout(() => {
                    confetti.remove();
                }, (Math.random() * 3 + 3) * 1000);
            }, Math.random() * 2000); // 0-2 saniye arasında rastgele zamanlama ile ekle
        }
        
        container.appendChild(confettiContainer);
        
        // 8 saniye sonra konfeti container'ı kaldır
        setTimeout(() => {
            confettiContainer.remove();
        }, 8000);
    },
    
    // Boşluk doldurma sorusunu yükle
    loadBlankFillingQuestion: function(question) {
        console.log("Boşluk doldurma sorusu yükleniyor:", question);
        
        // Önceki sorunun kalıntılarını temizle
        this.cleanupPreviousQuestion();
        
        // Var olan doğru/yanlış mesajlarını temizle
        const existingMessages = document.querySelectorAll('.correct-answer-container, .wrong-answer-container');
        existingMessages.forEach(element => {
            element.remove();
        });
        
        // Sonuç mesajını gizle
        if (this.resultElement) {
            this.resultElement.innerHTML = '';
            this.resultElement.style.display = 'none';
        }
        
        // Sorunun doğru formatlanması için kontrol
        if (!question || !question.question || !question.correctAnswer || !question.choices) {
            console.error("Boşluk doldurma sorusu eksik veya hatalı veri içeriyor:", question);
            this.loadNextQuestion(); // Sonraki soruya geç
            return;
        }
        
        // Soruyu göster
        if (this.questionElement) {
            this.questionElement.textContent = question.question;
            
            // Eğer soruda görsel varsa göster
            if (question.imageUrl) {
                this.loadQuestionImage(question);
            }
        }
        
        // Seçenekleri göster
        if (this.optionsElement) {
            // Önceki içeriği temizle
            this.optionsElement.innerHTML = '';
            
            // Ana container - tüm içeriği sağa yaslamak için flex kullanacağız
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
            
            // Boşluk doldurma UI oluştur - ortaya yaslanacak
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
            
            // Cevap gösterim alanı
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
            
            // Seçilen harfleri saklamak için array
            this.selectedLetters = [];
            
            // Tüm harfleri cevaptan al (büyük/küçük dahil)
            const correctLetters = [...question.choices];
            const shuffledLetters = this.shuffleArray([...correctLetters]);
            // Harfleri göstermek için bir container oluştur
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
                // Diğer durumlar için eski flex yapısı
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
            // Harf butonlarını oluştur
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
                        
                        // Seçilen harfi söndür (disabled durumuna getir)
                        letterButton.disabled = true;
                        letterButton.style.opacity = '0.3';
                        letterButton.style.cursor = 'not-allowed';
                        letterButton.style.background = '#d3d3d3';
                        letterButton.style.color = '#888';
                        
                        // Harfi geri almak için data attribute'unu ayarla
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
            
            // Butonlar için container
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
                    
                    // Son seçilen harfin butonunu normale döndür
                    const letterButtons = lettersContainer.querySelectorAll('.letter-button');
                    // En son seçilen harfi bulup normale döndür
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
                            break; // Sadece bir tanesini geri döndür
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
                
                // Tüm harf butonlarını normale döndür
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
                // Eğer sonuç zaten gösterilmişse veya buton devre dışı bırakılmışsa hiçbir şey yapma
                if (this.resultElement.style.display === 'block' || checkButton.disabled) {
                    return;
                }
                
                const userAnswer = this.selectedLetters.join('');
                if (userAnswer.length === 0) {
                    this.showToast("Lütfen bir cevap girin!", "toast-warning");
                    return;
                }
                
                // Butonu devre dışı bırak, tekrar tıklanmasını önle
                checkButton.disabled = true;
                checkButton.style.opacity = '0.5';
                checkButton.style.cursor = 'not-allowed';
                
                // Tüm harf butonlarını ve diğer action butonlarını devre dışı bırak
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
                    // Doğru cevap
                    answerDisplay.classList.add('correct');
                    this.handleBlankFillingCorrectAnswer();
                } else {
                    // Yanlış cevap
                    answerDisplay.classList.add('wrong');
                    this.handleBlankFillingWrongAnswer();
                }
            });
            
            // Butonları ekle
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
        
        // Zamanlayıcıyı başlat - boşluk doldurma için daha uzun süre
        this.timeLeft = this.TIME_PER_BLANK_FILLING_QUESTION || 60; // Varsayılan olarak 60 saniye
        this.updateTimeDisplay();
        this.startTimer();
    },
    
    // Boşluk doldurma cevap gösterimini güncelle
    updateBlankFillingAnswer: function() {
        const answerDisplay = document.getElementById('blank-filling-answer');
        if (answerDisplay) {
            answerDisplay.textContent = this.selectedLetters.join('');
            
            // Varsa sınıfları temizle (doğru/yanlış olarak işaretlenmişse)
            answerDisplay.classList.remove('correct', 'wrong');
        }
    },
    
    // Boşluk doldurma soruları için kategoriye göre getirme
    getBlankFillingQuestionsForCategory: function(category, count) {
        // Tüm boşluk doldurma sorularını al
        const allBlankFillingQuestions = this.allQuestionsData["Boşluk Doldurma"] || [];
        
        // İstenen kategorideki soruları filtrele
        let categoryQuestions = allBlankFillingQuestions.filter(q => q.category === category);
        
        // Daha önce sorulmuş soruları filtrele
        const seenIndices = this.getSeenQuestions("Boşluk Doldurma_" + category) || [];
        
        if (seenIndices.length >= categoryQuestions.length) {
            // Tüm sorular sorulmuşsa sıfırla
            this.saveSeenQuestions("Boşluk Doldurma_" + category, []);
            console.log(`${category} kategorisinde tüm boşluk doldurma soruları tamamlandı, sıfırlandı.`);
        } else {
            // Daha önce sorulmamış soruları seç
            categoryQuestions = categoryQuestions.filter((_, index) => !seenIndices.includes(index));
        }
        
        // Rastgele sorular seç
        const shuffledQuestions = this.shuffleArray(categoryQuestions);
        const selectedQuestions = shuffledQuestions.slice(0, count);
        
        // Seçilen soruların indekslerini bul
        const selectedIndices = selectedQuestions.map(q => 
            allBlankFillingQuestions.findIndex(origQ => origQ.question === q.question)
        ).filter(index => index !== -1);
        
        // Soruların birer kopyasını oluştur ve özel işaretleme ekle
        const processedQuestions = selectedQuestions.map(q => ({
            ...q,
            category: "Boşluk Doldurma",
            originalCategory: category // Orijinal kategoriyi sakla
        }));
        
        return { questions: processedQuestions, indices: selectedIndices };
    },
    
    // Soru yüklemesini düzenle
    prepareQuestions: function(category) {
        return new Promise((resolve, reject) => {
            try {
                console.log(`${category} kategorisi için sorular hazırlanıyor...`);
                
                // Kategori için soru sayısı belirleme
                const totalQuestionsCount = this.QUESTIONS_PER_GAME;
                
                // Normal soruların sayısı
                const normalQuestionsCount = Math.floor(totalQuestionsCount * 0.8); // %80'i normal sorular
                
                // Boşluk doldurma sorularının sayısı
                const blankFillingQuestionsCount = Math.floor(totalQuestionsCount * 0.2); // %20'si boşluk doldurma
                
                // Normal soruları al
                const result = this.getCategoryQuestions(category, normalQuestionsCount);
                
                // Normal sorular
                const selectedQuestions = result.questions;
                const selectedIndices = result.indices;
                
                // Boşluk doldurma soruları da ekleyelim
                let processedQuestions = selectedQuestions;
                
                // Kategori için boşluk doldurma soruları
                const blankFillingResult = this.getBlankFillingQuestionsForCategory(category, blankFillingQuestionsCount);
                
                if (blankFillingResult.questions.length > 0) {
                    // Boşluk doldurma sorularını normal sorular arasına dağıt
                    const blankFillingQuestions = blankFillingResult.questions;
                    
                    // Tüm soruları birleştir
                    processedQuestions = [...selectedQuestions, ...blankFillingQuestions];
                    
                    // Soruları karıştır
                    processedQuestions = this.shuffleArray(processedQuestions);
                    
                    // Boşluk doldurma sorularını takip et
                    this.saveSeenQuestions("Boşluk Doldurma_" + category, blankFillingResult.indices);
                }
                
                // Soruları düzenle
                this.questions = processedQuestions;
                
                // Görülen soruları kaydet
                this.saveSeenQuestions(category, selectedIndices);
                
                // Oyun durumunu sıfırla
                this.currentQuestionIndex = 0;
                this.resetJokers();
                
                console.log(`${category} kategorisi için ${this.questions.length} soru hazırlandı.`);
                console.log(`Normal sorular: ${this.questions.filter(q => q.category !== "Boşluk Doldurma").length}`);
                console.log(`Boşluk doldurma soruları: ${this.questions.filter(q => q.category === "Boşluk Doldurma").length}`);
                
                resolve();
            } catch (error) {
                console.error("Sorular hazırlanırken hata oluştu:", error);
                reject(error);
            }
        });
    },
    
    // Zamanlayıcıyı durdur
    stopTimer: function() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },
    
    // Ses çalmak için yardımcı fonksiyon
    playSound: function(soundElement) {
        if (this.soundEnabled && soundElement) {
            soundElement.currentTime = 0;
            soundElement.play().catch(e => console.error("Ses çalınamadı:", e));
        }
    },
    
    // Can kaybetme fonksiyonu
    loseLife: function() {
        // Önce canı azalt
        this.lives--; 
        
        // DOM'u güncelle
        this.updateLives();
        
        // Can kontrolü - canlar bittiyse oyunu bitir
        if (this.lives <= 0) {
            console.log("Canlar bitti, oyun sona eriyor...");
            
            // Zamanlayıcıyı durdur
            this.stopTimer();
            
            // Kısa bir gecikme ile oyun sonu ekranını göster
            setTimeout(() => {
                this.showResult();
            }, 1000); // 1 saniye gecikme ile oyuncu durumu anlasın
        }
    },
    
    // Canları güncelle
    updateLives: function() {
        const livesContainer = document.getElementById('lives-container');
        if (livesContainer) {
            // Önce tüm eski ikonları temizle
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
    
    // Yüksek skor ekleme fonksiyonu
    addNewHighScore: function(category, score, total) {
        try {
            // Eğer yerel depolama desteklenmiyorsa çık
            if (!this.isLocalStorageAvailable()) {
                return false;
            }
            
            // Tarih bilgisi
            const date = new Date().toLocaleDateString();
            
            // Yüksek skorlar için yerel depolama anahtarı
            const highScoresKey = 'highScores_' + category;
            
            // Mevcut yüksek skorları al
            let highScores = JSON.parse(localStorage.getItem(highScoresKey)) || [];
            
            // Yeni skoru ekle
            highScores.push({
                score: score,
                total: total,
                percentage: Math.round((score / total) * 100),
                date: date
            });
            
            // Skorları yüzdeye göre sırala (yüksekten düşüğe)
            highScores.sort((a, b) => b.percentage - a.percentage);
            
            // Maksimum 10 skor tut
            if (highScores.length > 10) {
                highScores = highScores.slice(0, 10);
            }
            
            // Güncellenmiş listeyi kaydet
            localStorage.setItem(highScoresKey, JSON.stringify(highScores));
            return true;
        } catch (error) {
            console.error("Yüksek skor kaydetme hatası:", error);
            return false;
        }
    },
    
    // Oyun istatistiklerini kaydetme
    saveGameStatistics: function() {
        try {
            // Eğer yerel depolama desteklenmiyorsa çık
            if (!this.isLocalStorageAvailable()) {
                return false;
            }
            
            // Genel istatistikler için yerel depolama anahtarı
            const statsKey = 'gameStats';
            
            // Mevcut istatistikleri al
            let stats = JSON.parse(localStorage.getItem(statsKey)) || {
                totalGames: 0,
                totalQuestions: 0,
                correctAnswers: 0,
                categories: {}
            };
            
            // İstatistikleri güncelle
            stats.totalGames++;
            stats.totalQuestions += this.answeredQuestions;
            stats.correctAnswers += this.score;
            
            // Kategori bazlı istatistikler
            if (!stats.categories[this.selectedCategory]) {
                stats.categories[this.selectedCategory] = {
                    games: 0,
                    questions: 0,
                    correct: 0
                };
            }
            
            // Kategori istatistiklerini güncelle
            stats.categories[this.selectedCategory].games++;
            stats.categories[this.selectedCategory].questions += this.answeredQuestions;
            stats.categories[this.selectedCategory].correct += this.score;
            
            // Güncellenmiş istatistikleri kaydet
            localStorage.setItem(statsKey, JSON.stringify(stats));
            return true;
        } catch (error) {
            console.error("İstatistik kaydetme hatası:", error);
            return false;
        }
    },
    
    // Yerel depolama kullanılabilirliğini kontrol et
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
    
    // Kullanıcı rozetlerini yükle
    loadUserBadges: function() {
        // Kullanıcı rozetleri ile ilgili işlemleri burada yapın
        // Şimdilik sadece boş bir fonksiyon olarak tanımlıyoruz
        return;
    },
    
    // Yüksek skorları görüntüle
    displayHighScores: function() {
        try {
            // Yüksek skorlar listesi elementini bul
            const highScoresList = document.getElementById('high-scores-list');
            if (!highScoresList) {
                return false;
            }
            
            // Listeyi temizle
            highScoresList.innerHTML = '';
            
            // Seçilen kategori için yüksek skorları al
            const highScoresKey = 'highScores_' + this.selectedCategory;
            const highScores = JSON.parse(localStorage.getItem(highScoresKey)) || [];
            
            // Eğer yüksek skorlar yoksa mesaj göster
            if (highScores.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'Henüz yüksek skor kaydedilmemiş.';
                li.style.textAlign = 'center';
                li.style.fontStyle = 'italic';
                li.style.color = '#666';
                highScoresList.appendChild(li);
                return true;
            }
            
            // Yüksek skorları listele
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
            console.error("Yüksek skorları görüntüleme hatası:", error);
            return false;
        }
    },
    
    // Yükleniyor mesajını göster
    showLoadingMessage: function() {
        if (this.questionElement) {
            this.questionElement.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Sorular yükleniyor...</div>';
        }
    },
    
    // Dizi karıştırma fonksiyonu
    shuffleArray: function(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },
    
    // Zamanlayıcı çubuğunu güncelleyen fonksiyon
    updateTimerProgress: function(percentage) {
        const timerProgress = document.getElementById('timer-progress');
        if (timerProgress) {
            timerProgress.style.width = `${percentage}%`;
            
            // Rengi güncelle
            if (percentage > 60) {
                timerProgress.className = 'timer-progress good';
            } else if (percentage > 30) {
                timerProgress.className = 'timer-progress warning';
            } else {
                timerProgress.className = 'timer-progress danger';
            }
        }
    },
    
    // Uyarı mesajı göster
    showAlert: function(message, type = 'info') {
        console.log("Uyarı mesajı gösteriliyor:", message, type);
        
        // Daha önce oluşturulmuş uyarı varsa kaldır
        // 🔒 GÜVENLİ ALERT: SecurityConfig kullan
        if (typeof SecurityConfig !== 'undefined') {
            SecurityConfig.secureAlert(message, type);
            return;
        }
        
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Yeni uyarı oluştur (XSS korumalı)
        const alertElement = document.createElement('div');
        alertElement.className = `custom-alert ${type}`;
        const span = document.createElement('span');
        span.textContent = message; // XSS koruması için textContent kullan
        alertElement.appendChild(span);
        
        // Sayfaya ekle
        document.body.appendChild(alertElement);
        
        // Belirli bir süre sonra kaldır
        setTimeout(() => {
            alertElement.classList.add('hide');
            setTimeout(() => alertElement.remove(), 500);
        }, 3000);
    },
    
    // Önceki sorunun kalıntılarını temizleyen fonksiyon
    cleanupPreviousQuestion: function() {
        // Önceki ipucu mesajlarını temizle
        const existingHintMessages = document.querySelectorAll('.hint-message');
        existingHintMessages.forEach(element => {
            element.remove();
        });
        
        // "Doğru!" veya "Yanlış!" mesajlarını temizle
        const correctMessageElements = document.querySelectorAll('.correct-answer-container');
        correctMessageElements.forEach(element => {
            element.remove();
        });
        
        // Sonuç mesajını temizle
        if (this.resultElement) {
            this.resultElement.innerHTML = '';
            this.resultElement.style.display = 'none';
        }
        
        // Zamanlayıcıyı durdur
        clearInterval(this.timerInterval);
        
        // Sonraki soru butonunu gizle
        if (this.nextButton) {
            this.nextButton.style.display = 'none';
        }
        
        // Options elementinin stilini sıfırla - boşluk doldurma sorularından çoktan seçmeliye geçişi düzelt
        if (this.optionsElement) {
            // Inline stilleri temizle
            this.optionsElement.style.display = '';
            this.optionsElement.style.justifyContent = '';
            this.optionsElement.style.width = '';
        }
    },
    
    // Bu fonksiyon, daha önce seçeneklere tıklandığında çalışan işlevden çağrılıyor olmalı
    handleCorrectAnswer: function() {
        // Zamanlayıcıyı durdur
        this.stopTimer();
    },
    
    // Kullanıcı ilerlemesini yükle (şimdilik boş, hata engelleme amaçlı)
    loadUserProgress: function(uid, category) {
        // Kullanıcı ilerlemesi burada yüklenecek
        // Şimdilik hata almamak için boş bırakıldı
        return;
    },
    
    // Kullanıcı istatistiklerini yükle
    loadUserStats: function(userId) {
        // Önce çevrimiçi kontrolü yap
        if (!navigator.onLine) {
            console.log('Çevrimdışı mod - yerel istatistikler kullanılıyor');
            // Yerel veri yoksa varsayılan değerlerle devam et
            this.userStats = {
                gamesPlayed: 0,
                totalQuestions: 0,
                totalCorrect: 0,
                averageTime: 0,
                perfectRounds: 0,
                categoryStats: {}
            };
            
            // Yerel depolamadan veriler varsa onları kullan
            try {
                const localStats = localStorage.getItem('userStats_' + userId);
                if (localStats) {
                    this.userStats = JSON.parse(localStats);
                    console.log('Yerel istatistikler yüklendi:', this.userStats);
                    this.updateStatsDisplay();
                }
            } catch (e) {
                console.error('Yerel istatistikler yüklenirken hata:', e);
            }
            
            return;
        }
        
        // Çevrimiçi ise Firestore'dan yükle
        const db = firebase.firestore();
        db.collection('users').doc(userId).get()
            .then((doc) => {
                if (doc.exists && doc.data().stats) {
                    const userStats = doc.data().stats;
                    console.log('Kullanıcı istatistikleri yüklendi:', userStats);
                    this.userStats = userStats;
                    
                    // Yerel kopyasını da sakla
                    try {
                        localStorage.setItem('userStats_' + userId, JSON.stringify(userStats));
                    } catch (e) {
                        console.warn('İstatistikler yerel olarak kaydedilemedi:', e);
                    }
                    
                    // Gerekli UI güncellemeleri yapılabilir
                    this.updateStatsDisplay();
                } else {
                    console.log('Kullanıcı istatistikleri bulunamadı, yeni oluşturuluyor');
                    this.userStats = {
                        gamesPlayed: 0,
                        totalQuestions: 0,
                        totalCorrect: 0,
                        averageTime: 0,
                        perfectRounds: 0,
                        categoryStats: {}
                    };
                    
                    // Firestore'a boş istatistik verisi kaydet
                    db.collection('users').doc(userId).update({
                        stats: this.userStats
                    }).catch(error => {
                        console.error('İstatistik güncelleme hatası:', error);
                    });
                }
            })
            .catch((error) => {
                console.error('Kullanıcı istatistiklerini yükleme hatası:', error);
                
                // Hata durumunda yerel verileri kullan
                try {
                    const localStats = localStorage.getItem('userStats_' + userId);
                    if (localStats) {
                        this.userStats = JSON.parse(localStats);
                        console.log('Hata nedeniyle yerel istatistikler kullanılıyor:', this.userStats);
                        this.updateStatsDisplay();
                    } else {
                        // Yerel veri yoksa varsayılan değerler kullan
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
                    console.error('Yerel istatistikler yüklenirken hata:', e);
                }
            });
    },
    
    // İstatistik ekranını güncelle
    updateStatsDisplay: function() {
        // İstatistikleri gösteren UI elementleri varsa güncelle
        const statsContainer = document.getElementById('user-stats');
        if (statsContainer && this.userStats) {
            // Örnek istatistik gösterimi
            let statsHTML = `
                <div class="stats-item">
                    <span class="stat-label">Toplam Oyun:</span>
                    <span class="stat-value">${this.userStats.gamesPlayed || 0}</span>
                </div>
                <div class="stats-item">
                    <span class="stat-label">Doğru Cevap Oranı:</span>
                    <span class="stat-value">${this.userStats.totalQuestions > 0 ? 
                        Math.round((this.userStats.totalCorrect / this.userStats.totalQuestions) * 100) : 0}%</span>
                </div>
                <div class="stats-item">
                    <span class="stat-label">Ortalama Süre:</span>
                    <span class="stat-value">${this.userStats.averageTime ? 
                        this.userStats.averageTime.toFixed(1) : 0} sn</span>
                </div>
            `;
            statsContainer.innerHTML = statsHTML;
        }
    },
    
    // Tarayıcı izleme önleme sorunlarını kontrol et
    checkBrowserBlockingIssues: function(user) {
        // Edge veya diğer tarayıcılarda tracking prevention sorunları kontrolü
        try {
            // localStorage'ı test et
            const testKey = 'browserBlockingTest';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            
            // İnternet bağlantısını kontrol et
            if (!navigator.onLine) {
                console.log('İnternet bağlantısı yok, çevrimdışı mod aktif');
                // this.showToast('İnternet bağlantısı olmadan çevrimdışı modda çalışıyorsunuz. Tek oyunculu modda oynayabilirsiniz.', 'toast-info');
                return;
            }
            
            // IndexedDB'yi test et
            const request = indexedDB.open('testDB', 1);
            request.onerror = () => {
                console.warn('IndexedDB erişimi engellenmiş olabilir - tarayıcı izleme koruması aktif olabilir');
                // this.showToast('Tarayıcı ayarlarınız veritabanı erişimine izin vermiyor. Tek oyunculu modda oynayabilirsiniz.', 'toast-warning');
            };
            
            // Firestore bağlantısını daha nazik test et
            if (firebase.firestore) {
                // Firestore bağlantısını ping ile test et
                firebase.firestore().collection('test').doc('test')
                    .get()
                    .then(() => {
                        console.log('Firestore bağlantısı başarılı');
                    })
                    .catch(error => {
                        // Bağlantı hatası oluşursa
                        console.warn('Firestore bağlantı sorunu: ' + error.message);
                        
                        // Firebase uyarısı kaldırıldı - artık gösterilmeyecek
                        // if (error.code === 'unavailable' || error.code === 'failed-precondition') {
                        //     this.showToast('Firebase sunucularına bağlanılamadı. İnternet bağlantınızı kontrol edin veya tek oyunculu modda oynayın.', 'toast-info');
                        // }
                    });
            }
        } catch (error) {
            console.error('Tarayıcı engelleme testi sırasında hata:', error);
            // this.showToast('Bazı tarayıcı özellikleri kullanılamıyor. Ancak tek oyunculu modu kullanabilirsiniz.', 'toast-info');
        }
    },
    
    // Kullanıcı arayüzünü hazırla
    initUI: function() {
        try {
            console.log("UI başlatılıyor...");
            
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
            
            // DOM elementlerinin varlığını kontrol et
            if (!this.categoriesElement) {
                console.error("Kategoriler elementi bulunamadı! ID: categories");
            }
            
            if (!this.categorySelectionElement) {
                console.error("Kategori seçim elementi bulunamadı! ID: category-selection");
            }
            
            if (!this.mainMenu) {
                console.error("Ana menü elementi bulunamadı! ID: main-menu");
            }
            
            if (!this.singlePlayerBtn) {
                console.error("Tekli oyun butonu bulunamadı! ID: single-player-btn");
            }
            
            console.log("UI elementleri hazırlandı.");
            
            // Event listener'ları ekle
            this.addEventListeners();
            
            // Firebase authentication state listener
            if (typeof firebase !== 'undefined' && firebase.auth) {
                firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                        // Kullanıcı giriş yapmış
                        console.log("Giriş yapan kullanıcı:", user.email || user.displayName || user.uid);
                        
                        // Kullanıcı bilgilerini kaydet
                        this.isLoggedIn = true;
                        this.currentUser = user;
                        
                        // Ana menüyü göster
                        if (this.mainMenu) {
                            this.mainMenu.style.display = 'block';
                        } else {
                            console.error("mainMenu elementi null!");
                        }
                        
                        // Kullanıcı verilerini yükle
                        this.loadUserData(user.uid);
                        
                        // Joker ve ayarları yükle
                        this.loadUserSettings();
                        this.loadJokerInventory();
                        
                        // Kullanıcı istatistiklerini yükle
                        if (typeof this.loadUserStats === 'function') {
                            this.loadUserStats(user.uid);
                        }
                        
                        // Tarayıcı İzleme Önleme kontrolü
                        if (typeof this.checkBrowserBlockingIssues === 'function') {
                            this.checkBrowserBlockingIssues(user);
                        }
                    } else {
                        // Kullanıcı giriş yapmamış
                        this.isLoggedIn = false;
                        this.currentUser = null;
                        
                        // Giriş sayfasına yönlendir
                        window.location.href = 'login.html';
                    }
                });
            } else {
                console.warn("Firebase authentication henüz yüklenmedi, event listener ekleniyor...");
                
                // Firebase ready event'ini dinle
                document.addEventListener('firebaseReady', (event) => {
                    console.info('🔥 Firebase Ready event alındı');
                    const { auth } = event.detail;
                    
                    if (auth) {
                        auth.onAuthStateChanged(user => {
                            if (user) {
                                this.isLoggedIn = true;
                                this.currentUser = user;
                                
                                if (this.mainMenu) {
                                    this.mainMenu.style.display = 'block';
                                }
                                
                                this.loadUserData(user.uid);
                                this.loadUserSettings();
                                this.loadJokerInventory();
                            } else {
                                this.isLoggedIn = false;
                                this.currentUser = null;
                                window.location.href = 'login.html';
                            }
                        });
                    }
                });
                
                // Firebase olmadan da uygulamanın çalışabilmesi için (fallback)
                setTimeout(() => {
                    if (!this.isLoggedIn && this.mainMenu) {
                        console.warn('⚠️ Firebase yüklenmedi, misafir modda çalışıyor');
                        this.mainMenu.style.display = 'block';
                    }
                }, 3000);
            }
        } catch (error) {
            console.error("initUI fonksiyonunda kritik hata:", error);
            alert("Uygulama başlatılırken bir hata oluştu. Lütfen sayfayı yenileyin.");
        }
    },
    
    // --- Soru dizisini her bölümün ilk sorusu boşluk doldurma olacak şekilde düzenle ---
    // Bu fonksiyonu, sorular karıştırıldıktan ve seçildikten sonra çağırın
    arrangeBlankFillingFirst: function() {
        // Her 5'lik bölümün ilk sorusu boşluk doldurma olacak
        for (let i = 0; i < this.questions.length; i += 5) {
            // O bölümde boşluk doldurma sorusu var mı?
            const section = this.questions.slice(i, i + 5);
            const blankIndex = section.findIndex(q => q.type === 'BlankFilling');
            if (blankIndex > 0) {
                // O bölümde boşluk doldurma varsa, ilk sıraya al
                const temp = this.questions[i];
                this.questions[i] = this.questions[i + blankIndex];
                this.questions[i + blankIndex] = temp;
            }
        }
    },
    
    // Konfeti efekti oluştur
    createConfetti: function(container) {
        // Konfeti parçacıkları için container
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
        
        // Konfeti parçacıkları
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
        
        // Konfeti parçacıkları oluştur
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
        
        // 6 saniye sonra konfetileri kaldır
        setTimeout(() => {
            confettiContainer.remove();
        }, 6000);
    },
    
    // Sonraki soruyu yükle - cleanupPreviousQuestion ile özellikle options elementinin stillerini temizler
    loadNextQuestion: function() {
        this.currentQuestionIndex++;
        
        // Önceki sorunun tüm elementlerini ve stilleri temizleyelim
        this.cleanupPreviousQuestion();
        
        // Options elementini özel olarak sıfırla
        if (this.optionsElement) {
            this.optionsElement.innerHTML = '';
            this.optionsElement.style.display = '';
            this.optionsElement.style.justifyContent = '';
            this.optionsElement.style.width = '';
        }
        
        // Oyun bitti kontrolü
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResult();
            return;
        }
        
        // Sorugösterimi
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        // Soru tipine göre yükleme
        if (currentQuestion.type === "BlankFilling") {
            this.loadBlankFillingQuestion(currentQuestion);
        } else if (currentQuestion.type === "DoğruYanlış" || currentQuestion.type === "TrueFalse") {
            this.loadTrueFalseQuestion(currentQuestion);
        } else {
            this.displayQuestion(currentQuestion);
        }
    },
    
    // Sonuç ve uyarı mesajlarını güncelle (her durumda)
    updateResultAndWarningTexts: function() {
        // Sonuç/uyarı alanı
        const resultEls = document.querySelectorAll('.result, .result-message, .warning-message, .alert-message');
        resultEls.forEach(el => {
            // 'Süre doldu!' veya 'Time is up!' gibi dille ilgili metinleri kontrol etmek yerine
            // içerik ve sınıf yapısına göre tanımlama yapalım
            if (el.classList.contains('wrong') || el.textContent.includes('doldu') || el.textContent.includes('is up')) {
                // Doğru cevap metni varsa onu koru
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
    
    // Boşluk doldurma kontrollerini devre dışı bırak
    disableBlankFillingControls: function() {
        // Kontrol et butonunu devre dışı bırak
        const checkButton = document.querySelector('.check-button');
        if (checkButton) {
            checkButton.disabled = true;
            checkButton.style.opacity = '0.5';
            checkButton.style.cursor = 'not-allowed';
        }
        
        // Temizle butonunu devre dışı bırak
        const clearButton = document.querySelector('.clear-button');
        if (clearButton) {
            clearButton.disabled = true;
            clearButton.style.opacity = '0.5';
            clearButton.style.cursor = 'not-allowed';
        }
        
        // Sil butonunu devre dışı bırak
        const deleteButton = document.querySelector('.delete-button');
        if (deleteButton) {
            deleteButton.disabled = true;
            deleteButton.style.opacity = '0.5';
            deleteButton.style.cursor = 'not-allowed';
        }
        
        // Harf butonlarını devre dışı bırak
        const letterButtons = document.querySelectorAll('.letter-button');
        letterButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        });
    },
    
    // Kullanıcı verilerini yükle
    loadUserData: function(userId) {
        if (!userId || !firebase.firestore) {
            console.log("Firebase firestore bulunamadı veya kullanıcı ID yok");
            return;
        }
        
        const db = firebase.firestore();
        
        db.collection('users').doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    console.log('Kullanıcı verileri yüklendi:', userData);
                    
                    // Kullanıcı verilerini uygula
                    this.totalScore = userData.totalScore || 0;
                    this.userLevel = userData.userLevel || 1;
                    this.levelProgress = userData.levelProgress || 0;
                    
                    // Puan göstergesini güncelle
                    this.updateScoreDisplay();
                    this.updateTotalScoreDisplay();
                } else {
                    console.log('Yeni kullanıcı, varsayılan veriler oluşturuluyor');
                    this.initializeNewUser(userId);
                }
            })
            .catch((error) => {
                console.error('Kullanıcı verileri yüklenirken hata:', error);
            });
    },
    
    // Yeni kullanıcı için varsayılan veriler oluştur
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
                console.log('Yeni kullanıcı verileri oluşturuldu');
                this.totalScore = 0;
                this.userLevel = 1;
                this.levelProgress = 0;
                this.updateTotalScoreDisplay();
            })
            .catch((error) => {
                console.error('Yeni kullanıcı verisi oluşturulurken hata:', error);
            });
    },
    
    // Kullanıcı verilerini kaydet
    saveUserData: function() {
        if (!this.isLoggedIn || !this.currentUser || !firebase.firestore) {
            console.log("Kullanıcı giriş yapmamış veya Firebase mevcut değil");
            // LocalStorage'a da kaydet (giriş yapmadan da skor tutulsun)
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
        
        db.collection('users').doc(userId).update(updateData)
            .then(() => {
                console.log('Kullanıcı verileri Firebase\'e kaydedildi');
                // Aynı zamanda localStorage'a da kaydet (backup olarak)
                this.saveScoreToLocalStorage();
            })
            .catch((error) => {
                console.error('Kullanıcı verileri Firebase\'e kaydedilirken hata:', error);
                // Firebase hatası durumunda localStorage'a kaydet
                this.saveScoreToLocalStorage();
                
                // Eğer doküman yoksa yeni oluştur
                if (error.code === 'not-found') {
                    this.initializeNewUser(userId);
                }
                          });
    },
    
    // localStorage'a skor kaydet (backup veya giriş yapmamış kullanıcılar için)
    saveScoreToLocalStorage: function() {
        try {
            const scoreData = {
                totalScore: this.totalScore,
                userLevel: this.userLevel,
                levelProgress: this.levelProgress,
                sessionScore: this.sessionScore,
                currentGameScore: this.score, // Oyun içi puan da kaydedilsin
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem('userScoreData', JSON.stringify(scoreData));
            console.log('Skor localStorage\'a kaydedildi:', scoreData);
        } catch (e) {
            console.error('localStorage\'a skor kaydedilirken hata:', e);
        }
    },
    
    // localStorage'dan skor yükle
    loadScoreFromLocalStorage: function() {
        try {
            const scoreData = localStorage.getItem('userScoreData');
            if (scoreData) {
                const parsedData = JSON.parse(scoreData);
                
                // Her durumda oyun puanını yükle (giriş yapmış/yapmamış fark etmez)
                this.score = parsedData.currentGameScore || 0;
                
                // Sadece giriş yapmamış kullanıcılar için localStorage'dan yükle
                if (!this.isLoggedIn) {
                    this.totalScore = parsedData.totalScore || 0;
                    this.userLevel = parsedData.userLevel || 1;
                    this.levelProgress = parsedData.levelProgress || 0;
                    this.sessionScore = parsedData.sessionScore || 0;
                    
                    console.log('Skor localStorage\'dan yüklendi:', parsedData);
                    this.updateTotalScoreDisplay();
                } else {
                    console.log('Oyun puanı localStorage\'dan yüklendi:', this.score);
                }
            }
        } catch (e) {
            console.error('localStorage\'dan skor yüklenirken hata:', e);
        }
    },
    
    // Puan ekle ve seviye kontrolü yap
    addScore: function(points) {
        const previousScore = this.score;
        const previousTotalScore = this.totalScore;
        const previousLevel = this.userLevel;
        
        // Mevcut oyun puanını güncelle
        this.score += points;
        this.sessionScore += points;
        
        // Giriş yapılmışsa toplam puana ekle
        if (this.isLoggedIn) {
            this.totalScore += points;
            this.levelProgress += points;
            
            // Seviye kontrolü yap
            this.checkLevelUp();
            
            // Verileri kaydet
            this.saveUserData();
        }
        
        // Görüntüleri güncelle
        this.updateScoreDisplay();
        this.updateTotalScoreDisplay();
        
        console.log(`Puan eklendi: +${points} (Oyun: ${previousScore} → ${this.score}, Toplam: ${previousTotalScore} → ${this.totalScore})`);
    },
    
    // Seviye atlatma kontrolü
    checkLevelUp: function() {
        const requiredXP = this.getRequiredXPForNextLevel();
        
        if (this.levelProgress >= requiredXP) {
            const previousLevel = this.userLevel;
            this.userLevel++;
            this.levelProgress -= requiredXP;
            
            console.log(`Seviye atladı! ${previousLevel} → ${this.userLevel}`);
            
            // Seviye atlama animasyonu kaldırıldı (gereksiz modal)
        }
    },
    
    // Sonraki seviye için gerekli XP hesapla
    getRequiredXPForNextLevel: function() {
        // Seviye başına 100 * seviye kadar XP gerekir
        return this.userLevel * 100;
    },
    

    
    // Soru resmini yükle - gelişmiş hata yönetimi ile
    loadQuestionImage: function(questionData) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'question-image';
        
        // Loading göstergesi
        const loadingDiv = document.createElement('div');
        loadingDiv.innerHTML = '🖼️ Görsel yükleniyor...';
        loadingDiv.style.cssText = `
            padding: 20px;
            text-align: center;
            color: #666;
            font-style: italic;
        `;
        imageContainer.appendChild(loadingDiv);
        
        // Önce tüm eski resim elementlerini kaldır
        const oldImages = this.questionElement.querySelectorAll('.question-image');
        oldImages.forEach(img => img.remove());
        
        // Loading state'i göster
        this.questionElement.appendChild(imageContainer);
        
        const img = document.createElement('img');
        img.style.cssText = `
            max-width: 100%;
            max-height: 300px;
            margin: 10px auto;
            display: block;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            border: 1px solid #ddd;
        `;
        img.alt = this.getTranslation ? this.getTranslation('questionImage') : 'Soru görseli';
        
        // Başarılı yükleme durumu
        img.onload = () => {
            loadingDiv.remove();
            imageContainer.appendChild(img);
            secureLog.info(`Görsel başarıyla yüklendi: ${questionData.imageUrl}`);
        };
        
        // Hata durumu - gelişmiş yönetim
        img.onerror = () => {
            secureLog.warn(`Soru görseli yüklenemedi: ${questionData.imageUrl}`);
            
            // Loading göstergesini kaldır
            loadingDiv.remove();
            
            // Hata mesajı göster
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #666; border: 2px dashed #ccc; border-radius: 8px; margin: 10px;">
                    <div style="font-size: 24px; margin-bottom: 10px;">🚫</div>
                    <div>Görsel yüklenemedi</div>
                    <small style="display: block; margin-top: 5px; color: #999;">
                        Ağ bağlantınızı kontrol edin
                    </small>
                </div>
            `;
            imageContainer.appendChild(errorDiv);
            
            // Toast bildirimi göster (eğer fonksiyon varsa)
            if (this.showToast) {
                const errorMessage = this.getTranslation ? 
                    this.getTranslation('imageLoadError') : 
                    "Görsel yüklenemedi, başka bir soruya geçiliyor...";
                this.showToast(errorMessage, "toast-warning");
            }
            
            // 3 saniye sonra soruyu atla
            setTimeout(() => {
                if (this.questions.length > this.currentQuestionIndex + 1) {
                    // Zamanlayıcıyı durdur
                    if (this.timerInterval) {
                        clearInterval(this.timerInterval);
                    }
                    
                    // Sonraki soruya geç
                    this.currentQuestionIndex++;
                    this.displayQuestion(this.questions[this.currentQuestionIndex]);
                } else {
                    // Soru kalmadıysa sonucu göster
                    if (this.showResult) {
                        this.showResult();
                    }
                }
            }, 3000);
        };
        
        // Timeout mekanizması - 10 saniye sonra hata ver
        setTimeout(() => {
            if (!img.complete || img.naturalHeight === 0) {
                secureLog.warn(`Görsel yükleme zaman aşımı: ${questionData.imageUrl}`);
                img.onerror();
            }
        }, 10000);
        
        // Direkt olarak orijinal URL'yi yükle (proxy gerekmedi)
        img.src = questionData.imageUrl;
    },

    // Oyun durumunu tamamen sıfırla (hamburger menü için)
    resetGameState: function() {
        console.log('Oyun durumu sıfırlanıyor...');
        
        // Timer'ı durdur
        this.stopTimer();
        
        // Oyun durumunu sıfırla
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.lives = 3;
        this.questions = [];
        this.selectedCategory = null;
        this.gameStarted = false;
        this.timeLeft = 20; // Default time
        this.isAnswered = false;
        
        // Joker durumunu sıfırla
        this.jokersUsed = {
            fifty: false,
            hint: false,
            time: false,
            skip: false
        };
        
        // DOM elementlerini temizle
        if (this.questionElement) this.questionElement.innerHTML = '';
        if (this.optionsElement) this.optionsElement.innerHTML = '';
        if (this.resultElement) this.resultElement.innerHTML = '';
        if (this.timerElement) this.timerElement.textContent = '20';
        
        // Body class'larını temizle
        document.body.classList.remove('quiz-active', 'category-selection');
        
        // Lives display'i güncelle
        this.updateLives();
        
        // Score display'i güncelle
        this.updateScoreDisplay();
        
        console.log('Oyun durumu başarıyla sıfırlandı');
    },
    
    // Toplam puan göstergesini güncelle
    updateTotalScoreDisplay: function() {
        // Yeni sadeleştirilmiş puan gösterimi
        const totalScoreElement = document.getElementById('total-score-value');
        if (totalScoreElement) {
            const scoreValue = this.isLoggedIn ? this.totalScore : this.sessionScore;
            totalScoreElement.textContent = scoreValue;
        }
        
        // Eski puan gösterimini de destekle (geriye uyumluluk için)
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
    }
};

// Bu modülü başlat
quizApp.init(); 

// QuizApp modülünü global olarak erişilebilir yap
window.quizApp = quizApp; 