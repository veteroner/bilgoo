// @ts-nocheck
/* eslint-disable */
// Bu dosya JavaScript'tir, TypeScript değildir.
// Script Version 3.0 - Firebase puan kaydetme sistemi tamamlandı

// Global debug fonksiyonları - İstatistik sorunlarını çözmek için
window.testProfileStats = function() {
    console.log('=== PROFİL İSTATİSTİK TEST ===');
    
    // Mevcut verileri kontrol et
    const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]');
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    
    console.log('GameHistory:', gameHistory);
    console.log('UserStats:', userStats);
    
    // İstatistikleri yeniden hesapla
    const calculatedStats = quizApp.calculateRealStats();
    console.log('Hesaplanan istatistikler:', calculatedStats);
    
    // Profil kutularını güncelle
    quizApp.updateProfileStats(calculatedStats);
    
    // Elementleri kontrol et
    const elements = {
        'stats-total-games': document.getElementById('stats-total-games'),
        'stats-total-questions': document.getElementById('stats-total-questions'),
        'stats-correct-answers': document.getElementById('stats-correct-answers'),
        'stats-accuracy': document.getElementById('stats-accuracy'),
        'total-games-stat': document.getElementById('total-games-stat'),
        'total-questions-stat': document.getElementById('total-questions-stat'),
        'correct-answers-stat': document.getElementById('correct-answers-stat'),
        'accuracy-stat': document.getElementById('accuracy-stat'),
        'highest-score-stat': document.getElementById('highest-score-stat')
    };
    
    console.log('Bulunan elementler:');
    Object.entries(elements).forEach(([id, element]) => {
        if (element) {
            console.log(`${id}: ${element.textContent} (bulundu)`);
        } else {
            console.log(`${id}: element bulunamadı`);
        }
    });
    
    console.log('=== TEST TAMAMLANDI ===');
    return calculatedStats;
};

window.forceUpdateStats = function() {
    console.log('İstatistikler zorla güncelleniyor...');
    
    // Test verisi oluştur
    const testStats = {
        totalGames: 5,
        totalQuestions: 50,
        correctAnswers: 35,
        totalScore: 350,
        highestScore: 90,
        accuracy: 70,
        categoryStats: {}
    };
    
    // Tüm istatistik elementlerini güncelle
    const updateElement = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            console.log(`${id} güncellendi: ${value}`);
            return true;
        } else {
            console.log(`${id} elementi bulunamadı`);
            return false;
        }
    };
    
    // Profil sayfası kutuları
    updateElement('stats-total-games', testStats.totalGames);
    updateElement('stats-total-questions', testStats.totalQuestions);
    updateElement('stats-correct-answers', testStats.correctAnswers);
    updateElement('stats-accuracy', `%${testStats.accuracy}`);
    
    // İstatistik sayfası kutuları
    updateElement('total-games-stat', testStats.totalGames);
    updateElement('total-questions-stat', testStats.totalQuestions);
    updateElement('correct-answers-stat', testStats.correctAnswers);
    updateElement('accuracy-stat', `%${testStats.accuracy}`);
    updateElement('highest-score-stat', testStats.highestScore);
    
    console.log('Zorla güncelleme tamamlandı!');
    return testStats;
};

window.debugStats = function() {
    console.log('=== İSTATİSTİK DEBUG ===');
    console.log('gameHistory:', JSON.parse(localStorage.getItem('gameHistory') || '[]'));
    console.log('userStats:', JSON.parse(localStorage.getItem('userStats') || '{}'));
    console.log('quiz-user-stats:', JSON.parse(localStorage.getItem('quiz-user-stats') || '{}'));
    
    // Tüm high scores
    const categories = ['Genel Kültür', 'Bilim', 'Teknoloji', 'Spor', 'Müzik', 'Tarih', 'Coğrafya', 'Sanat'];
    categories.forEach(cat => {
        const scores = JSON.parse(localStorage.getItem(`highScores_${cat}`) || '[]');
        if (scores.length > 0) {
            console.log(`highScores_${cat}:`, scores);
        }
    });
    console.log('========================');
};

window.fixStats = function() {
    console.log('İstatistikler düzeltiliyor...');
    
    // QuizApp'den gerçek istatistikleri hesapla
    if (window.quizApp && typeof window.quizApp.calculateRealStats === 'function') {
        const stats = window.quizApp.calculateRealStats();
        console.log('Düzeltilen istatistikler:', stats);
        
        // UI'yi güncelle
        if (typeof updateStatisticsUI === 'function') {
            updateStatisticsUI(stats);
        }
        
        return stats;
    } else {
        console.error('QuizApp.calculateRealStats fonksiyonu bulunamadı');
        return null;
    }
};

window.createTestStats = function() {
    console.log('Test istatistikleri oluşturuluyor...');
    
    // Test oyun verisi oluştur
    const testGameHistory = [
        {
            category: 'Genel Kültür',
            score: 8,
            totalQuestions: 10,
            correctAnswers: 8,
            lives: 3,
            averageTime: 15.5,
            date: new Date().toISOString(),
            timestamp: Date.now()
        },
        {
            category: 'Bilim',
            score: 6,
            totalQuestions: 10,
            correctAnswers: 6,
            lives: 2,
            averageTime: 18.2,
            date: new Date().toISOString(),
            timestamp: Date.now()
        },
        {
            category: 'Teknoloji',
            score: 9,
            totalQuestions: 10,
            correctAnswers: 9,
            lives: 4,
            averageTime: 12.8,
            date: new Date().toISOString(),
            timestamp: Date.now()
        }
    ];
    
    // Test istatistikleri hesapla
    const testStats = {
        totalGames: 3,
        totalQuestions: 30,
        correctAnswers: 23,
        totalScore: 23,
        highestScore: 9,
        averageScore: Math.round(23 / 3),
        accuracy: Math.round((23 / 30) * 100),
        categoryStats: {
            'Genel Kültür': { total: 10, correct: 8, games: 1 },
            'Bilim': { total: 10, correct: 6, games: 1 },
            'Teknoloji': { total: 10, correct: 9, games: 1 }
        }
    };
    
    // localStorage'a kaydet
    localStorage.setItem('gameHistory', JSON.stringify(testGameHistory));
    localStorage.setItem('userStats', JSON.stringify(testStats));
    localStorage.setItem('quiz-user-stats', JSON.stringify(testStats));
    
    console.log('Test verileri kaydedildi:', testStats);
    
    // UI'yi güncelle
    if (typeof updateStatisticsUI === 'function') {
        updateStatisticsUI(testStats);
    } else if (typeof loadStatisticsData === 'function') {
        loadStatisticsData();
    }
    
    return testStats;
};

window.clearAllStats = function() {
    if (confirm('Tüm istatistikleri silmek istediğinizden emin misiniz?')) {
        localStorage.removeItem('gameHistory');
        localStorage.removeItem('userStats');
        localStorage.removeItem('quiz-user-stats');
        
        const categories = ['Genel Kültür', 'Bilim', 'Teknoloji', 'Spor', 'Müzik', 'Tarih', 'Coğrafya', 'Sanat'];
        categories.forEach(cat => {
            localStorage.removeItem(`highScores_${cat}`);
        });
        
        console.log('Tüm istatistikler silindi');
        location.reload();
    }
};

// İstatistik kutularını test et
window.testStatsBoxes = function() {
    console.log('İstatistik kutuları test ediliyor...');
    
    // Test verileri oluştur
    createTestStats();
    
    // Önce tüm mögliche element ID'lerini kontrol et
    const possibleIds = [
        'total-games-stat', 'total-games', 'totalGames',
        'total-questions-stat', 'total-questions', 'totalQuestions', 
        'correct-answers-stat', 'correct-answers', 'correctAnswers',
        'accuracy-stat', 'accuracy', 'dogruluk-orani'
    ];
    
    console.log('Mevcut elementleri kontrol ediliyor...');
    possibleIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ Element bulundu: ${id} = "${element.textContent}"`);
        }
    });
    
    // Tüm istatistik içeren elementleri bul
    const allStatsElements = document.querySelectorAll('[id*="stat"], [class*="stat"]');
    console.log('Tüm istatistik elementleri:', Array.from(allStatsElements).map(el => ({
        id: el.id,
        className: el.className,
        textContent: el.textContent
    })));
    
    // Kutuları zorla güncelle
    setTimeout(() => {
        forceUpdateUI();
        
        // Manuel olarak tüm olası elementleri güncelle
        const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
        console.log('Manuel güncelleme için stats:', stats);
        
        // Farklı ID kombinasyonları dene
        const idVariants = [
            ['total-games-stat', 'total-games', 'totalGames'],
            ['total-questions-stat', 'total-questions', 'totalQuestions'],
            ['correct-answers-stat', 'correct-answers', 'correctAnswers'],
            ['accuracy-stat', 'accuracy', 'dogruluk-orani']
        ];
        
        const values = [
            stats.totalGames || 0,
            stats.totalQuestions || 0, 
            stats.correctAnswers || 0,
            '%' + (stats.accuracy || 0)
        ];
        
        idVariants.forEach((variants, index) => {
            variants.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = values[index];
                    console.log(`✅ ${id} güncellendi: ${values[index]}`);
                }
            });
        });
        
        // 2 saniye sonra sonuçları kontrol et
        setTimeout(() => {
            const boxes = {
                totalGames: document.getElementById('total-games-stat')?.textContent,
                totalQuestions: document.getElementById('total-questions-stat')?.textContent,
                correctAnswers: document.getElementById('correct-answers-stat')?.textContent,
                accuracy: document.getElementById('accuracy-stat')?.textContent
            };
            
            console.log('İstatistik kutularının güncel değerleri:', boxes);
            
            if (boxes.totalGames === '3' && boxes.totalQuestions === '30') {
                console.log('✅ İstatistik kutuları başarıyla güncellendi!');
            } else {
                console.log('❌ İstatistik kutuları güncellenemedi');
                console.log('🔍 Element ID\'lerini kontrol edin');
            }
        }, 2000);
    }, 1000);
};

window.forceUpdateUI = function() {
    console.log('UI zorla güncelleniyor...');
    
    // İstatistik elementlerini bul ve manuel güncelle
    const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
    console.log('Manuel UI güncellemesi için stats:', stats);
    
    // Elementleri bul
    const totalGamesEl = document.getElementById('total-games-stat');
    const totalQuestionsEl = document.getElementById('total-questions-stat');
    const correctAnswersEl = document.getElementById('correct-answers-stat');
    const accuracyEl = document.getElementById('accuracy-stat');
    
    console.log('Bulunan elementler:', {
        totalGamesEl: !!totalGamesEl,
        totalQuestionsEl: !!totalQuestionsEl,
        correctAnswersEl: !!correctAnswersEl,
        accuracyEl: !!accuracyEl
    });
    
    if (totalGamesEl) {
        totalGamesEl.textContent = stats.totalGames || 0;
        console.log('totalGames güncellendi:', stats.totalGames || 0);
    }
    if (totalQuestionsEl) {
        totalQuestionsEl.textContent = stats.totalQuestions || 0;
        console.log('totalQuestions güncellendi:', stats.totalQuestions || 0);
    }
    if (correctAnswersEl) {
        correctAnswersEl.textContent = stats.correctAnswers || 0;
        console.log('correctAnswers güncellendi:', stats.correctAnswers || 0);
    }
    if (accuracyEl) {
        const accuracy = stats.accuracy || 0;
        accuracyEl.textContent = '%' + accuracy;
        console.log('accuracy güncellendi:', accuracy);
    }
    
    // İstatistikler sayfasının yüklenmesini tetikle (grafik olmadan)
    if (typeof updateStatisticsUI === 'function') {
        console.log('updateStatisticsUI çağrılıyor...');
        // Grafik çizmeden sadece UI güncelle
        const simpleUpdateUI = function(stats) {
            const totalGames = stats.totalGames || 0;
            const totalQuestions = stats.totalQuestions || 0;
            const correctAnswers = stats.correctAnswers || 0;
            const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
            
            if (document.getElementById('total-games-stat')) {
                document.getElementById('total-games-stat').textContent = totalGames;
            }
            if (document.getElementById('total-questions-stat')) {
                document.getElementById('total-questions-stat').textContent = totalQuestions;
            }
            if (document.getElementById('correct-answers-stat')) {
                document.getElementById('correct-answers-stat').textContent = correctAnswers;
            }
            if (document.getElementById('accuracy-stat')) {
                document.getElementById('accuracy-stat').textContent = '%' + accuracy;
            }
            
            console.log('İstatistik kutuları güncellendi:', {totalGames, totalQuestions, correctAnswers, accuracy});
        };
        
        simpleUpdateUI(stats);
    }
};

// Tam Ekran Modunu Ayarla
function initFullscreenMode() {
    // PWA tam ekran modunu etkinleştir
    if ('serviceWorker' in navigator) {
        // PWA modunda çalışıyor mu kontrol et
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                           window.navigator.standalone ||
                           document.referrer.includes('android-app://');
        
        if (isStandalone) {
            console.log('✅ PWA standalone modunda çalışıyor');
            
            // Tam ekran için CSS sınıfları ekle
            document.body.classList.add('pwa-fullscreen');
            document.documentElement.classList.add('pwa-fullscreen');
            
            // Viewport meta tag güncelle
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
            console.log('⚠️ PWA standalone modunda çalışmıyor - tarayıcı modunda');
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
        
        /* Safe area için padding ekle */
        @supports (padding: max(0px)) {
            .pwa-fullscreen .container {
                padding-top: max(env(safe-area-inset-top), 0px) !important;
                padding-bottom: max(env(safe-area-inset-bottom), 0px) !important;
                padding-left: max(env(safe-area-inset-left), 0px) !important;
                padding-right: max(env(safe-area-inset-right), 0px) !important;
            }
        }
        
        /* Capacitor/Cordova için */
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

// Sayfa Yükleme İşlemleri
document.addEventListener('DOMContentLoaded', () => {
    // Tam ekran modunu başlat
    initFullscreenMode();
    
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
    totalStars: 0, // <-- EKLENDİ: Toplam kazanılan yıldız sayısı
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
    QUESTIONS_PER_GAME: 'dynamic', // Artık kategoriye göre dinamik
    STATS_KEY: 'quizStats',
    USER_SETTINGS_KEY: 'quizSettings',
    JOKER_INVENTORY_KEY: 'quizJokerInventory',
    LANGUAGE_KEY: 'quizLanguage',
    
    // Başlangıç
    init: function() {
        console.log("Quiz Uygulaması Başlatılıyor...");
        
        // İlk Firebase durumu kontrolü
        console.log('🔥 Firebase İlk Durum Kontrolü:');
        console.log('- Firebase nesnesi:', typeof firebase !== 'undefined' ? 'VAR' : 'YOK');
        console.log('- Firebase.auth:', firebase && firebase.auth ? 'VAR' : 'YOK');
        console.log('- Firebase.firestore:', firebase && firebase.firestore ? 'VAR' : 'YOK');
        
        // Tarayıcı özelliklerini kontrol et
        this.checkBrowserSupport();
        
        try {
            // Önce dil ayarlarını yükle
            this.loadLanguageSettings();
            
            // Kullanıcı arayüzünü hazırla
            this.initUI();
            
            // Önce kullanıcı ayarlarını yükle
            this.loadUserSettings();
            
            // Joker tab bar'ı başlat
            this.initJokerTabBar();
            
            // Kullanıcının quiz modunda olup olmadığını kontrol et (sayfa yenilemesi senaryosu için)
            if (localStorage.getItem('quizModeActive') === 'true' && document.getElementById('quiz').style.display !== 'none') {
                this.activateQuizMode();
            }
            
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
                console.warn('Dil dosyası yüklenemedi. Varsayılan metin gösteriliyor.');
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
        localStorage.setItem('user_language', language); // Kullanıcı dil tercihini kaydet
        
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
                // Türkçe kategorinin çevrilmiş adını bul
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
        
        // Mobil tab bar ve joker tab bar metinlerini güncelle
        this.updateMobileMenuTexts();
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
    
    // Mobil menü ve joker menü metinlerini güncelle
    updateMobileMenuTexts: function() {
        try {
            const lang = this.currentLanguage || 'tr';
            
            // Alt menü butonları
            this.updateMobileTabText('tab-home', 'Ana Sayfa', 'Home', 'Startseite');
            this.updateMobileTabText('tab-profile', 'Profil', 'Profile', 'Profil');
            this.updateMobileTabText('tab-friends', 'Arkadaş', 'Friends', 'Freunde');
            this.updateMobileTabText('tab-settings', 'Ayarlar', 'Settings', 'Einstellungen');
            
            // Joker butonları
            this.updateMobileTabText('joker-tab-fifty', '50:50', '50:50', '50:50');
            this.updateMobileTabText('joker-tab-hint', 'İpucu', 'Hint', 'Tipp');
            this.updateMobileTabText('joker-tab-time', 'Süre', 'Time', 'Zeit');
            this.updateMobileTabText('joker-tab-skip', 'Pas', 'Pass', 'Passen');
            this.updateMobileTabText('joker-tab-store', 'Mağaza', 'Store', 'Shop');
            this.updateMobileTabText('joker-tab-home', 'Çıkış', 'Exit', 'Beenden');
            
            console.log("Mobil menü ve joker menü çevirileri güncellendi. Dil:", lang);
        } catch (error) {
            console.error("Mobil menü çevirileri güncellenirken hata:", error);
        }
    },
    
    // Mobil tab metin güncelleme yardımcı fonksiyonu
    updateMobileTabText: function(elementId, textTR, textEN, textDE) {
        const element = document.getElementById(elementId);
        if (element && element.querySelector('span')) {
            let text = '';
            
            // Mevcut dile göre metni belirle
            if (this.currentLanguage === 'tr') {
                text = textTR;
            } else if (this.currentLanguage === 'en') {
                text = textEN;
            } else if (this.currentLanguage === 'de') {
                text = textDE;
            }
            
            // Metni uygula
            if (text) {
                element.querySelector('span').textContent = text;
            }
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
        
        // Mobil debug için
        console.log('Mobile device check:', /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        console.log('Touch events supported:', 'ontouchstart' in window);
        
        // Joker store modal element kontrolü
        const jokerStoreModal = document.getElementById('joker-store-modal');
        console.log('Joker store modal element:', jokerStoreModal);
        
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
                
                // Sadece aktif quiz container'daki seçenekleri al
                const optionsContainer = document.getElementById('options');
                const options = optionsContainer ? optionsContainer.querySelectorAll('.option') : document.querySelectorAll('#options .option');
                console.log('Bulunan seçenekler:', options.length);
                console.log('Options container:', optionsContainer);
                
                if (options.length < 3) {
                    console.warn('Yeterli seçenek yok, 50:50 joker kullanılamaz');
                    this.showToast("Bu soru tipinde 50:50 joker kullanılamaz!", "toast-warning");
                    return;
                }
                
                // Yanlış şıkları bul - case insensitive karşılaştırma
                const wrongOptions = Array.from(options).filter((option, index) => {
                    const optionText = option.textContent.trim();
                    const isCorrect = optionText.toLowerCase() === correctAnswer.toLowerCase();
                    console.log(`Seçenek ${index + 1}: "${optionText}" | Doğru cevap: "${correctAnswer}" | Eşit mi: ${isCorrect}`);
                    return !isCorrect;
                });
                
                console.log('Toplam seçenek sayısı:', options.length);
                console.log('Yanlış seçenek sayısı:', wrongOptions.length);
                console.log('Doğru seçenek sayısı:', options.length - wrongOptions.length);
                
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
                    option.style.background = 'linear-gradient(135deg, #ddd, #ccc)';
                    option.style.color = '#666';
                    option.style.textDecoration = 'line-through';
                    option.style.filter = 'blur(1px)';
                    option.style.border = '2px solid #f0f0f0';
                    option.style.transform = 'scale(0.95)';
                    option.style.transition = 'all 0.3s ease';
                    option.classList.add('disabled-option');
                    
                    // X işareti ekle
                    const xMark = document.createElement('div');
                    xMark.innerHTML = '❌';
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
                
                // Jokeri kullan (useJoker içinde zaten envanter düşürülüyor)
                this.useJoker('fifty');
                
                // Ses efekti çal
                if (this.soundEnabled) {
                    const fiftySound = document.getElementById('sound-correct');
                    if (fiftySound) fiftySound.play().catch(e => {
                        console.error("Ses çalınamadı:", e);
                    });
                }
                
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
                } else if (currentQuestion.type === "DoğruYanlış" || currentQuestion.type === "TrueFalse") {
                    // Doğru/Yanlış sorular için özel ipucu
                    const correctAnswer = currentQuestion.correctAnswer.toLowerCase();
                    if (correctAnswer === 'doğru' || correctAnswer === 'true' || correctAnswer === 'evet') {
                        hint = "İpucu: Bu ifade doğru bir bilgidir.";
                    } else {
                        hint = "İpucu: Bu ifadede bir yanlışlık vardır.";
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
                
                // Jokeri kullan (useJoker içinde zaten envanter düşürülüyor)
                this.useJoker('hint');
                
                // Ses efekti çal
                if (this.soundEnabled) {
                    const hintSound = document.getElementById('sound-correct');
                    if (hintSound) hintSound.play().catch(e => {
                        console.error("Ses çalınamadı:", e);
                    });
                }
                
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
                
                // Jokeri kullan (useJoker içinde zaten envanter düşürülüyor)
                this.useJoker('time');
                
                // Ses efekti çal
                if (this.soundEnabled) {
                    const timeSound = document.getElementById('sound-correct');
                    if (timeSound) timeSound.play().catch(e => {
                        console.error("Ses çalınamadı:", e);
                    });
                }
                
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
                
                // Jokeri kullan (useJoker içinde zaten envanter düşürülüyor)
                this.useJoker('skip');
                
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
            
            // Mobil cihazlarda butonun tıklanabilir olduğunu garanti et
            this.jokerStoreBtn.style.cursor = 'pointer';
            this.jokerStoreBtn.style.touchAction = 'manipulation';
        }
    },
    
    // Joker mağazasını aç
    openJokerStore: function() {
        console.log('🛒 Joker mağazası açılıyor...');
        console.log('📱 User Agent:', navigator.userAgent);
        console.log('🎮 Mevcut joker envanteri:', JSON.stringify(this.jokerInventory));
        console.log('💰 Mevcut puan:', this.score);
        
        var modal = document.getElementById('joker-store-modal');
        var closeBtn = modal.querySelector('.close-modal');
        var buyButtons = modal.querySelectorAll('.joker-buy-btn');
        var pointsDisplay = document.getElementById('joker-store-points-display');
        
        // Mevcut toplam puanları ve joker envanterini göster (misafir için sessionScore kullan)
        const currentPoints = this.isLoggedIn ? this.totalScore : this.sessionScore;
        pointsDisplay.textContent = this.formatNumber(currentPoints || 0);
        
        // Tooltip'leri ekle
        this.createTooltip(pointsDisplay.parentElement, `Coin: ${(currentPoints || 0).toLocaleString()}`);
        console.log(`🛒 Joker mağazası - Gösterilen puan: ${currentPoints} (Giriş durumu: ${this.isLoggedIn ? 'Kayıtlı' : 'Misafir'})`);
        console.log(`📊 Detay - totalScore: ${this.totalScore}, sessionScore: ${this.sessionScore}`);
        
        // Oyun ekranındaki joker butonlarını da güncelle
        this.updateJokerButtons();
        
        // Joker miktarlarını güncelle
        this.updateJokerStoreDisplay(modal);
        
        // Satın alma butonlarını etkinleştir
        buyButtons.forEach(function(btn) {
            var item = btn.closest('.joker-store-item');
            var jokerType = item.dataset.joker;
            var price = parseInt(item.dataset.price);
            
            // Yeterli puan varsa butonu etkinleştir (misafir için sessionScore kullan)
            const availablePoints = this.isLoggedIn ? this.totalScore : this.sessionScore;
            btn.disabled = availablePoints < price;
            
            // Satın alma fonksiyonu
            var self = this;
            const purchaseJoker = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const availablePoints = self.isLoggedIn ? self.totalScore : self.sessionScore;
                console.log(`Joker satın alma denemesi: ${jokerType}, Fiyat: ${price}, Mevcut Puan: ${availablePoints} (${self.isLoggedIn ? 'totalScore' : 'sessionScore'})`);
                console.log('Satın alma öncesi envanter:', JSON.stringify(self.jokerInventory));
                
                if (availablePoints >= price) {
                    // Puanı azalt (misafir için sessionScore, kayıtlı için totalScore)
                    if (self.isLoggedIn) {
                    self.totalScore -= price;
                    } else {
                        self.sessionScore -= price;
                    }
                    
                    // PUANI FIREBASE'E KAYDET
                    if (self.isLoggedIn) {
                        self.delayedSaveUserData(); // Firebase'e geciktirilmiş kaydet
                        console.log(`Joker satın alma: ${price} puan harcandı. Yeni toplam: ${self.totalScore}`);
                    }
                    
                    // Jokeri envantere ekle
                    var previousCount = self.jokerInventory[jokerType] || 0;
                    self.jokerInventory[jokerType]++;
                    
                    console.log(`${jokerType} joker sayısı: ${previousCount} -> ${self.jokerInventory[jokerType]}`);
                    
                    // Joker envanterini kaydet
                    self.saveJokerInventory();
                    
                    // Göstergeleri güncelle (misafir için sessionScore kullan)
                    const updatedPoints = self.isLoggedIn ? self.totalScore : self.sessionScore;
                    pointsDisplay.textContent = self.formatNumber(updatedPoints);
                    
                    // Joker mağazasındaki sayımları ve buton durumlarını güncelle
                    self.updateJokerStoreDisplay(modal);
                    
                    // OYUN EKRANINDAKİ JOKER BUTONLARINI DA GÜNCELLE
                    self.updateJokerButtons();
                    
                    // MOBİL JOKER TAB BAR'I DA GÜNCELLE
                    self.updateJokerTabBar();
                    
                    // Skor gösterimini güncelle
                    self.updateScoreDisplay();
                    
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
            
            // Hem click hem de touch event'lerini ekle
            btn.onclick = purchaseJoker;
            btn.addEventListener('touchend', purchaseJoker);
            
            // Mobil cihazlar için ek optimizasyonlar
            btn.style.touchAction = 'manipulation';
            btn.style.webkitTapHighlightColor = 'transparent';
        }.bind(this));
        
        // Modalı göster
        modal.style.display = 'block';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        
        // Mobil cihazlarda modalın üstte görünmesini garanti et
        modal.style.zIndex = '9999';
        modal.classList.add('show');
        
        // Body scroll'unu engelle (mobil cihazlarda önemli)
        document.body.style.overflow = 'hidden';
        
        console.log('✅ Joker mağazası modal açıldı');
        console.log('Modal visibility:', modal.style.visibility);
        console.log('Modal display:', modal.style.display);
        console.log('Modal z-index:', modal.style.zIndex);
        console.log('Modal classList:', modal.classList.toString());
        
        // Kapat butonuna tıklama olayı
        var self = this;
        const closeModal = function() {
            modal.style.display = 'none';
            modal.style.visibility = 'hidden';
            modal.style.opacity = '0';
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Body scroll'unu restore et
            // Mağaza kapandığında joker butonlarını güncelle
            self.updateJokerButtons();
        };
        
        // Close button events (both click and touch)
        closeBtn.onclick = closeModal;
        closeBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            closeModal();
        });
        
        // Modal dışına tıklama olayı
        window.onclick = function(event) {
            if (event.target === modal) {
                closeModal();
            }
        };
        
        // Modal dışına dokunma olayı (mobil)
        modal.addEventListener('touchend', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // Satın alma butonlarına da touch event ekle (mobil)
        buyButtons.forEach(function(btn) {
            btn.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // onclick event'i zaten çalışacak, sadece touch'u handle ediyoruz
            });
        });
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
        
        console.log('updateJokerButtons çağrıldı');
        console.log('Mevcut joker envanteri:', JSON.stringify(this.jokerInventory));
        console.log('Joker kullanım durumları:', JSON.stringify(this.jokersUsed));
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
            this.jokerFiftyBtn.disabled = (fiftyCount <= 0) || used || isTrueFalse || isBlankFilling;
            this.jokerFiftyBtn.style.opacity = (fiftyCount <= 0 || used || isTrueFalse || isBlankFilling) ? '0.3' : '1';
            this.jokerFiftyBtn.innerHTML = `<i class="fas fa-star-half-alt"></i>`;
        }
        // İpucu jokeri
        if (this.jokerHintBtn) {
            const hintCount = this.jokerInventory.hint || 0;
            const used = this.jokersUsed.hint;
            this.jokerHintBtn.disabled = (hintCount <= 0) || used;
            this.jokerHintBtn.style.opacity = (hintCount <= 0 || used) ? '0.3' : '1';
            this.jokerHintBtn.innerHTML = `<i class="fas fa-lightbulb"></i>`;
        }
        // Süre jokeri
        if (this.jokerTimeBtn) {
            const timeCount = this.jokerInventory.time || 0;
            const used = this.jokersUsed.time;
            this.jokerTimeBtn.disabled = (timeCount <= 0) || used;
            this.jokerTimeBtn.style.opacity = (timeCount <= 0 || used) ? '0.3' : '1';
            this.jokerTimeBtn.innerHTML = `<i class="fas fa-clock"></i>`;
        }
        // Pas jokeri
        if (this.jokerSkipBtn) {
            const skipCount = this.jokerInventory.skip || 0;
            const used = this.jokersUsed.skip;
            this.jokerSkipBtn.disabled = (skipCount <= 0) || used;
            this.jokerSkipBtn.style.opacity = (skipCount <= 0 || used) ? '0.3' : '1';
            this.jokerSkipBtn.innerHTML = `<i class="fas fa-forward"></i>`;
        }
        // Joker mağazası
        if (this.jokerStoreBtn) {
            this.jokerStoreBtn.innerHTML = `<i class="fas fa-store"></i>`;
        }
        
        // Mobil joker tab bar'ı da güncelle
        this.updateJokerTabBar();
        
        console.log('updateJokerButtons tamamlandı');
    },
    
    // Mobil joker tab bar'ını güncelle
    updateJokerTabBar: function() {
        const currentQuestion = this.questions[this.currentQuestionIndex] || {};
        const isTrueFalse = currentQuestion.type === "DoğruYanlış" || currentQuestion.type === "TrueFalse";
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
        
        // İpucu joker tab
        const jokerTabHint = document.getElementById('joker-tab-hint');
        if (jokerTabHint) {
            const hintCount = this.jokerInventory.hint || 0;
            const used = this.jokersUsed.hint;
            const disabled = (hintCount <= 0) || used || isBlankFilling;
            jokerTabHint.style.opacity = disabled ? '0.3' : '1';
            jokerTabHint.style.filter = disabled ? 'grayscale(100%)' : 'none';
        }
        
        // Süre joker tab
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
        
        // Mağaza tab her zaman aktif
        const jokerTabStore = document.getElementById('joker-tab-store');
        if (jokerTabStore) {
            jokerTabStore.style.opacity = '1';
            jokerTabStore.style.filter = 'none';
        }
    },
    
    // Joker kullanma fonksiyonu
    useJoker: function(jokerType) {
        // Envanter kontrolü - eksiye düşmesin
        if (this.jokerInventory[jokerType] > 0) {
            this.jokersUsed[jokerType] = true;
            this.jokerInventory[jokerType]--;
            this.saveJokerInventory();
            console.log(`${jokerType} joker kullanıldı. Kalan: ${this.jokerInventory[jokerType]}`);
            
            // Joker kullanımı için kısa modal göster
            this.showJokerUsageModal(jokerType);
            
            // Joker butonlarını güncelle
            this.updateJokerButtons();
        } else {
            console.warn(`${jokerType} joker envanterinde yok!`);
        }
    },
    
    // Joker kullanımı için kısa süreli modal göster
    showJokerUsageModal: function(jokerType) {
        console.log(`${jokerType} jokeri için modal gösteriliyor...`);
        
        // Modal HTML yapısını oluştur
        let modalTitle = "";
        let modalMessage = "";
        let modalIcon = "";
        
        // Joker tipine göre içeriği ayarla
        if (jokerType === 'fifty') {
            modalTitle = "50:50 Jokeri Kullanıldı";
            modalMessage = "İki yanlış şık elendi!";
            modalIcon = "fa-th-large";
        } else if (jokerType === 'hint') {
            modalTitle = "İpucu Jokeri Kullanıldı";
            modalMessage = "Doğru cevap için ipuçları verildi!";
            modalIcon = "fa-lightbulb";
        } else if (jokerType === 'time') {
            modalTitle = "Süre Jokeri Kullanıldı";
            modalMessage = "+15 saniye eklendi!";
            modalIcon = "fa-clock";
        } else if (jokerType === 'skip') {
            modalTitle = "Pas Jokeri Kullanıldı";
            modalMessage = "Bu soruyu geçiyorsunuz!";
            modalIcon = "fa-forward";
        }
        
        // Modal div'ini oluştur (CSS için stil ekleyeceğiz)
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
        
        // Joker tipine göre farklı renk şeması
        if (jokerType === 'fifty') {
            modalDiv.style.background = 'linear-gradient(135deg, #74b9ff, #0984e3)';
        } else if (jokerType === 'hint') {
            modalDiv.style.background = 'linear-gradient(135deg, #ffeaa7, #fdcb6e)';
        } else if (jokerType === 'time') {
            modalDiv.style.background = 'linear-gradient(135deg, #55efc4, #00b894)';
        } else if (jokerType === 'skip') {
            modalDiv.style.background = 'linear-gradient(135deg, #ff7675, #d63031)';
        }
        
        // İçerik stilini ayarla
        const contentDiv = modalDiv.querySelector('.joker-usage-content');
        contentDiv.style.cssText = `
            color: #fff;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        `;
        
        // İkon stilini ayarla
        const iconDiv = modalDiv.querySelector('.joker-usage-icon');
        iconDiv.style.cssText = `
            font-size: 40px;
            margin-bottom: 15px;
            animation: pulse 1s infinite;
        `;
        
        // Başlık stilini ayarla
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
        
        // Animasyonlar için stil ekle
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
        
        // Modalı DOM'a ekle
        document.body.appendChild(modalDiv);
        
        // Modalı kısa süre sonra kaldır (ip ucu jokeri için biraz daha uzun süre)
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
    
    // Joker mağazası sayım gösterimini güncelle
    updateJokerStoreDisplay: function(modal) {
        console.log('Joker mağazası sayımları güncelleniyor...');
        console.log('Mevcut joker envanteri:', JSON.stringify(this.jokerInventory));
        console.log('Mevcut toplam puan:', this.totalScore);
        
        const ownedCountElements = modal.querySelectorAll('.joker-owned-count');
        ownedCountElements.forEach((el) => {
            const jokerType = el.closest('.joker-store-item').dataset.joker;
            const count = this.jokerInventory[jokerType] || 0;
            el.textContent = count;
            console.log(`${jokerType} joker sayısı mağazada güncellendi: ${count}`);
        });
        
        // Satın alma butonlarının durumunu da güncelle
        const buyButtons = modal.querySelectorAll('.joker-buy-btn');
        buyButtons.forEach((btn) => {
            const item = btn.closest('.joker-store-item');
            const price = parseInt(item.dataset.price);
            btn.disabled = this.totalScore < price;
            console.log(`Buton durumu güncellendi: Fiyat ${price}, Toplam puan ${this.totalScore}, Aktif: ${this.totalScore >= price}`);
        });
    },

    // Joker kullanım durumlarını sıfırla (envanter korunur)
    resetJokerUsage: function() {
        console.log('Joker kullanım durumları sıfırlanıyor...');
        
        // Kullanılmış jokerleri sıfırla
        this.jokersUsed = {fifty: false, hint: false, time: false, skip: false};
        this.skipJokerActive = false;
        
        // 50:50 joker ile devre dışı bırakılan seçenekleri tekrar aktif et
        this.resetDisabledOptions();
        
        // Joker butonlarını güncelle
        setTimeout(() => {
            this.updateJokerButtons();
        }, 100);
    },

    // Reset jokers for new game (sadece oyun başlangıcında çağrılmalı)
    resetJokers: function() {
        console.log('resetJokers çağrıldı, mevcut envanter:', JSON.stringify(this.jokerInventory));
        
        // Önce joker kullanım durumlarını sıfırla
        this.resetJokerUsage();
        
        // Envanter kontrolü - sadece tanımsız veya boş ise başlangıç jokerleri ver
        if (!this.jokerInventory || Object.keys(this.jokerInventory).length === 0) {
            console.log('İlk oyun veya envanter tanımsız, başlangıç jokerleri veriliyor...');
            this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
            this.saveJokerInventory();
        }
        
        // Mevcut envanterde eksik joker türleri varsa tamamla
        if (this.jokerInventory.fifty === undefined) this.jokerInventory.fifty = 0;
        if (this.jokerInventory.hint === undefined) this.jokerInventory.hint = 0;
        if (this.jokerInventory.time === undefined) this.jokerInventory.time = 0;
        if (this.jokerInventory.skip === undefined) this.jokerInventory.skip = 0;
        
        console.log('resetJokers tamamlandı, final envanter:', JSON.stringify(this.jokerInventory));
    },
    
    // Yeni oyun için joker envanterini yenile
    refreshJokersForNewGame: function() {
        console.log('refreshJokersForNewGame çağrıldı, jokerler yenileniyor...');
        
        // Önce joker kullanım durumlarını sıfırla
        this.resetJokerUsage();
        
        // Her yeni oyunda fresh jokerler ver
        this.jokerInventory = {fifty: 1, hint: 1, time: 1, skip: 1};
        this.saveJokerInventory();
        
        console.log('Jokerler yenilendi, yeni envanter:', JSON.stringify(this.jokerInventory));
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
            
            // Soru ekle butonu
            const addQuestionBtn = document.getElementById('add-question-button');
            if (addQuestionBtn) {
                addQuestionBtn.addEventListener('click', () => {
                    // Ana menüyü gizle
                    const mainMenu = document.getElementById('main-menu');
                    if (mainMenu) {
                        mainMenu.style.display = 'none';
                    } else {
                        console.error('Ana menü elementi bulunamadı.');
                        return;
                    }
                    
                    // Doğrudan showAddQuestionModal fonksiyonunu çağır
                    try {
                        showAddQuestionModal();
                    } catch (err) {
                        console.error('showAddQuestionModal fonksiyonu çağrılırken hata:', err);
                        // Hata durumunda ana menüyü tekrar göster
                        if (mainMenu) {
                            mainMenu.style.display = 'block';
                        }
                    }
                });
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
        // Yeni soruya geçerken joker kullanımlarını sıfırla
        this.resetJokerUsage();
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
        
        // Soru sayacını artır
        this.currentQuestionIndex++;
        
        // Önceki ipucu mesajlarını temizle
        const existingHintMessages = document.querySelectorAll('.hint-message');
        existingHintMessages.forEach(element => {
            element.remove();
        });
        
        // Her 5 soruda bir bölüm geçişi göster
        if (this.currentQuestionIndex > 0 && this.currentQuestionIndex % 5 === 0 && this.currentQuestionIndex < this.questions.length) {
            // Bölüm sayısını artır
            this.currentSection++; 
            console.log(`🔼 Bölüm artırıldı: ${this.currentSection}`);
            
            // Progressive difficulty sistemi ile dinamik bölüm sayısı
            const maxSections = this.getMaxSectionsForCategory();
            console.log(`📊 Bölüm kontrolü: Şu anki bölüm ${this.currentSection}, Maksimum bölüm: ${maxSections}`);
            
            // Yeni zorluk seviyesini hesapla ve kaydet
            const newDifficulty = this.getProgressiveDifficulty();
            console.log(`🚀 Bölüm ${this.currentSection} - Yeni zorluk seviyesi: ${newDifficulty === 1 ? 'Kolay' : newDifficulty === 2 ? 'Orta' : 'Zor'} (${newDifficulty})`);
            
            // Maksimum bölüm sayısını aşıp aşmadığını kontrol et
            if (this.currentSection > maxSections) {
                console.log(`⚠️ Maksimum bölüm sayısı (${maxSections}) aşıldı! Kategori tamamlama ekranı gösteriliyor.`);
                this.showCategoryCompletion();
                return;
            }
            
            // Yeni bölüm için zorluk seviyesine göre soruları yükle
            console.log(`⭐ Bölüm ${this.currentSection} için yeni sorular yükleniyor...`);
            
            // Kategorinin tüm sorularını al
            const allCategoryQuestions = [...this.questionsData[this.selectedCategory]];
            
            // Progressive difficulty'ye göre hedef zorluk seviyesini belirle
            const targetDifficulty = this.getProgressiveDifficulty();
            
            // Soruları zorluğa göre grupla
            const easyQuestions = allCategoryQuestions.filter(q => (q.difficulty || 2) === 1);  
            const mediumQuestions = allCategoryQuestions.filter(q => (q.difficulty || 2) === 2);
            const hardQuestions = allCategoryQuestions.filter(q => (q.difficulty || 2) === 3);
            
            // Hedef zorluk seviyesine göre soru havuzu oluştur
            let nextSectionQuestions = [];
            
            if (targetDifficulty === 1 && easyQuestions.length > 0) {
                nextSectionQuestions = this.shuffleArray([...easyQuestions]);
                console.log(`✅ Bölüm ${this.currentSection} için kolay sorular seçildi.`);
            }
            else if (targetDifficulty === 2 && mediumQuestions.length > 0) {
                nextSectionQuestions = this.shuffleArray([...mediumQuestions]);
                console.log(`✅ Bölüm ${this.currentSection} için orta zorluktaki sorular seçildi.`);
            }
            else if (targetDifficulty === 3 && hardQuestions.length > 0) {
                nextSectionQuestions = this.shuffleArray([...hardQuestions]);
                console.log(`✅ Bölüm ${this.currentSection} için zor sorular seçildi.`);
            }
            else {
                // Hedef zorluk seviyesinde soru bulunamazsa, mevcut tüm sorulardan al
                nextSectionQuestions = this.shuffleArray([...allCategoryQuestions]);
                console.log(`⚠️ Bölüm ${this.currentSection} için ${targetDifficulty} zorluk seviyesinde soru bulunamadı, karışık sorular seçiliyor.`);
            }
            
            // İlk 5 soruyu seç (bir bölüm 5 soru içerir)
            const newSectionQuestions = nextSectionQuestions.slice(0, 5);
            console.log(`📝 Bölüm ${this.currentSection} için ${newSectionQuestions.length} soru seçildi.`);
            
            // Bu soruları mevcut sorularla birleştir
            this.questions = [...this.questions.slice(0, this.currentQuestionIndex), ...newSectionQuestions];
            
            // Bölüm geçiş ekranını göster
            this.showSectionTransition();
        } else if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion(this.questions[this.currentQuestionIndex]);
        } else {
            // Tüm sorular cevaplandı - yeni bölüm için sorular yükle
            console.log("Bölümdeki sorular tamamlandı, bir sonraki bölüm için sorular yükleniyor...");
            
            // Bölüm sayısını artır
            this.currentSection++;
            console.log(`🔼 Bölüm otomatik artırıldı: ${this.currentSection}`);
            
            // Yeni zorluk seviyesini hesapla ve kaydet
            const newDifficulty = this.getProgressiveDifficulty();
            console.log(`🚀 Bölüm ${this.currentSection} - Yeni zorluk seviyesi: ${newDifficulty === 1 ? 'Kolay' : newDifficulty === 2 ? 'Orta' : 'Zor'} (${newDifficulty})`);
            
            // Progressive difficulty sistemi ile dinamik bölüm sayısı
            const maxSections = this.getMaxSectionsForCategory();
            console.log(`📊 Bölüm kontrolü: Şu anki bölüm ${this.currentSection}, Maksimum bölüm: ${maxSections}`);
            
            // Maksimum bölüm sayısını aşıp aşmadığını kontrol et
            if (this.currentSection > maxSections) {
                console.log(`⚠️ Maksimum bölüm sayısı (${maxSections}) aşıldı! Kategori tamamlama ekranı gösteriliyor.`);
            this.showCategoryCompletion();
                return;
            }
            
            // Yeni bölüm için zorluk seviyesine göre soruları yükle
            console.log(`⭐ Bölüm ${this.currentSection} için yeni sorular yükleniyor...`);
            
            // Kategorinin tüm sorularını al
            const allCategoryQuestions = [...this.questionsData[this.selectedCategory]];
            
            // Progressive difficulty'ye göre hedef zorluk seviyesini belirle
            const targetDifficulty = this.getProgressiveDifficulty();
            
            // Soruları zorluğa göre grupla
            const easyQuestions = allCategoryQuestions.filter(q => (q.difficulty || 2) === 1);  
            const mediumQuestions = allCategoryQuestions.filter(q => (q.difficulty || 2) === 2);
            const hardQuestions = allCategoryQuestions.filter(q => (q.difficulty || 2) === 3);
            
            // Hedef zorluk seviyesine göre soru havuzu oluştur
            let nextSectionQuestions = [];
            
            if (targetDifficulty === 1 && easyQuestions.length > 0) {
                nextSectionQuestions = this.shuffleArray([...easyQuestions]);
                console.log(`✅ Bölüm ${this.currentSection} için kolay sorular seçildi.`);
            }
            else if (targetDifficulty === 2 && mediumQuestions.length > 0) {
                nextSectionQuestions = this.shuffleArray([...mediumQuestions]);
                console.log(`✅ Bölüm ${this.currentSection} için orta zorluktaki sorular seçildi.`);
            }
            else if (targetDifficulty === 3 && hardQuestions.length > 0) {
                nextSectionQuestions = this.shuffleArray([...hardQuestions]);
                console.log(`✅ Bölüm ${this.currentSection} için zor sorular seçildi.`);
            }
            else {
                // Hedef zorluk seviyesinde soru bulunamazsa, mevcut tüm sorulardan al
                nextSectionQuestions = this.shuffleArray([...allCategoryQuestions]);
                console.log(`⚠️ Bölüm ${this.currentSection} için ${targetDifficulty} zorluk seviyesinde soru bulunamadı, karışık sorular seçiliyor.`);
            }
            
            // İlk 5 soruyu seç (bir bölüm 5 soru içerir)
            const newSectionQuestions = nextSectionQuestions.slice(0, 5);
            console.log(`📝 Bölüm ${this.currentSection} için ${newSectionQuestions.length} soru seçildi.`);
            
            // Bu soruları mevcut sorulara ekle
            this.questions = newSectionQuestions;
            
            // Soru indeksini sıfırla
            this.currentQuestionIndex = 0;
            
            // Bölüm geçiş ekranını göster
            this.showSectionTransition();
        }
    },
    
    // Kategoriye göre maksimum bölüm sayısını belirle
    getMaxSectionsForCategory: function() {
        // Kategoriye özel zorluk seviyesi belirle
        const categoryDifficultyMap = {
            // Kolay kategoriler (12-15 bölüm)
            'Hayvanlar': 12,
            'Renkler': 12, 
            'Basit Kelimeler': 13,
            'Sayılar': 13,
            'Vücut': 14,
            'Aile': 14,
            'Yemek': 15,
            'Ev': 15,
            
            // Orta kategoriler (15-18 bölüm)
            'Spor': 15,
            'Müzik': 16,
            'Meslek': 16,
            'Ulaşım': 17,
            'Doğa': 17,
            'Teknoloji': 18,
            'Sağlık': 18,
            'Genel Kültür': 15,
            
            // Zor kategoriler (18-25 bölüm)
            'Bilim': 20,
            'Tarih': 20,
            'Edebiyat': 22,
            'Coğrafya': 22,
            'Felsefe': 24,
            'Matematik': 24,
            'Fizik': 25,
            'Kimya': 25
        };
        
        // Seçilen kategoriye göre bölüm sayısı döndür
        const maxSections = categoryDifficultyMap[this.selectedCategory] || 15; // Varsayılan 15 bölüm
        console.log(`Kategori: ${this.selectedCategory}, Maksimum Bölüm: ${maxSections}`);
        return maxSections;
    },
    
    // Kategori zorluk seviyesi metni
    getCategoryDifficultyText: function() {
        const maxSections = this.getMaxSectionsForCategory();
        
        if (maxSections <= 15) {
            return "🟢 Kolay Kategori";
        } else if (maxSections <= 18) {
            return "🟡 Orta Kategori";
        } else {
            return "🔴 Zor Kategori";
        }
    },
    
    // Progressive difficulty: Mevcut bölüme göre zorluk seviyesi belirle
    getProgressiveDifficulty: function() {
        const maxSections = this.getMaxSectionsForCategory();
        const currentProgress = this.currentSection / maxSections;
        
        // Debug bilgisi ekle
        console.log(`Progressive Difficulty Hesaplama: Bölüm ${this.currentSection}/${maxSections}, İlerleme: ${currentProgress}`);
        
        // Oyunun başında her zaman kolay zorluk seviyesi ile başla (bölüm ≤ 1)
        if (this.currentSection <= 1) {
            console.log("⭐ İlk bölüm - Kolay seviye (1) seçiliyor");
            return 1; // Her zaman Kolay ile başla
        }
        
        // İlk %40'ı kolay, sonraki %40'ı orta, son %20'si zor
        if (currentProgress <= 0.4) {
            console.log(`⭐ İlerleme: ${Math.round(currentProgress*100)}% - Kolay seviye (1) seçiliyor`);
            return 1; // Kolay
        } else if (currentProgress <= 0.8) {
            console.log(`🔶 İlerleme: ${Math.round(currentProgress*100)}% - Orta seviye (2) seçiliyor`);
            return 2; // Orta  
        } else {
            console.log(`🔴 İlerleme: ${Math.round(currentProgress*100)}% - Zor seviye (3) seçiliyor`);
            return 3; // Zor
        }
    },
    
    // Kategori Tamamlama Ekranını Göster (dinamik bölüm sayısına göre)
    showCategoryCompletion: function() {
        // Zamanlayıcıyı durdur
        clearInterval(this.timerInterval);
        
        console.log(`Genel Kültür kategorisi ${this.currentSection} bölüm ile tamamlandı!`);
        
        // Kategori tamamlama modalını oluştur
        const categoryCompletionModal = document.createElement('div');
        categoryCompletionModal.className = 'category-completion-modal';
        categoryCompletionModal.innerHTML = `
            <div class="category-completion-content">
                <div class="completion-header">
                    <div class="completion-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <h2>Kategori Tamamlandı!</h2>
                    <p class="completion-message">"${this.selectedCategory}" kategorisinin ${this.currentSection} bölümünü başarıyla tamamladınız!</p>
                    <p class="completion-difficulty" style="font-size: 14px; color: #64748b; margin-top: 10px;">
                        ${this.getCategoryDifficultyText()} • Progressive Zorluk Sistemi
                    </p>
                </div>
                
                <div class="completion-stats">
                                         <div class="stat-item">
                         <div class="stat-icon">
                             <i class="fas fa-layer-group"></i>
                         </div>
                         <div class="stat-content">
                             <div class="stat-value">${this.currentSection}</div>
                             <div class="stat-label">Bölüm Tamamlandı</div>
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
                            <div class="stat-label">Doğru Cevap</div>
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
                            <div class="stat-value" style="font-size: 14px;">Kolay → Orta → Zor</div>
                            <div class="stat-label">Zorluk Progresyonu</div>
                        </div>
                    </div>
                </div>
                
                <div class="completion-actions">
                    <button id="show-final-results" class="completion-btn primary">
                        <i class="fas fa-chart-line"></i>
                        Detaylı Sonuçları Gör
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(categoryCompletionModal);
        
        // Detaylı sonuçları göster butonu
        const showResultsBtn = document.getElementById('show-final-results');
        if (showResultsBtn) {
            showResultsBtn.addEventListener('click', () => {
                // Modalı kaldır
                categoryCompletionModal.remove();
                
                // Normal oyun bitiş ekranını göster
                setTimeout(() => {
            this.showResult();
                }, 500);
            });
        }
        
        // Modal dışına tıklanırsa da sonuç ekranını göster
        categoryCompletionModal.addEventListener('click', (e) => {
            if (e.target === categoryCompletionModal) {
                categoryCompletionModal.remove();
                setTimeout(() => {
                    this.showResult();
                }, 500);
            }
        });
        
        // Başarı ses efekti çal
        if (this.soundEnabled) {
            const victorySound = document.getElementById('sound-level-completion');
            if (victorySound) victorySound.play().catch(e => console.error("Ses çalınamadı:", e));
        }
        
        // 10 saniye sonra otomatik olarak sonuç ekranını göster
        setTimeout(() => {
            if (document.body.contains(categoryCompletionModal)) {
                categoryCompletionModal.remove();
                this.showResult();
            }
        }, 10000);
        
        // Konfeti efekti eklenebilir
        console.log(`${this.selectedCategory} kategorisi ${this.getMaxSectionsForCategory()} bölüm ile tamamlandı!`);
    },

    // DEBUG: Kategori tamamlama modalını test et
    testCategoryCompletion: function() {
        console.log("Test: Kategori tamamlama modalı manuel olarak gösteriliyor...");
        this.showCategoryCompletion();
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
                    <p><i class="fas fa-chart-line"></i> Sonraki Bölüm: ${['', 'Kolay', 'Orta', 'Zor'][this.getProgressiveDifficulty()]} Seviye</p>
                </div>
                <button id="next-section-btn" class="level-btn"><i class="fas fa-forward"></i> ${this.getTranslation('nextSection')}</button>
            </div>
        `;
        
        // Mevcut ekranı gizle ve geçiş ekranını göster
        if (this.quizElement) this.quizElement.style.display = 'none';
        document.body.appendChild(sectionElement);
        
        // Kazanılan yıldızları kaydet
        this.totalStars += starCount;
        
        // Kullanıcı giriş yapmışsa Firebase'de yıldız sayısını güncelle
        if (this.isLoggedIn && firebase && firebase.firestore) {
            const db = firebase.firestore();
            db.collection('users').doc(this.currentUser.uid).update({
                totalStars: firebase.firestore.FieldValue.increment(starCount)
            }).catch(error => {
                console.error("Yıldız kaydederken hata:", error);
            });
        }
        
        // Local storage'a kaydet
        localStorage.setItem('quizTotalStars', this.totalStars);
        
        // Puan göstergesini güncelle
        this.updateTotalScoreDisplay();
        
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
            this.currentSection = 1; // Bölüm numarasını sıfırla - Progressive Difficulty için önemli
            this.sectionStats = []; // Bölüm istatistiklerini sıfırla
            
            // Her yeni oyunda jokerları yenile
            this.refreshJokersForNewGame();
            
            // Kategori seçim ekranını gizle
            if (this.categorySelectionElement) this.categorySelectionElement.style.display = 'none';
            
            // Aktif soru verilerini al (çevrilmiş veya orijinal)
            const activeQuestionData = this.currentLanguage === 'tr' ? this.questionsData : this.translatedQuestions;
            
            // Seçilen kategori için özel soru yükleme algoritmasını kullan
            if (activeQuestionData && activeQuestionData[category]) {
                console.log(`🎯 Kategori seçildi: ${category}`);
                console.log("Aktif dil:", this.currentLanguage);
                
                // Doğru soru seçim algoritmasını kullan
                this.loadQuestionsForCategory(category);
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
        
        // Değişkenleri sıfırla - oyun başlangıcı için önemli
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.answeredQuestions = 0;
        this.answerTimes = [];
        this.sectionStats = []; // Bölüm istatistiklerini sıfırla
        this.currentSection = 1; // Bölüm numarasını sıfırla - en önemlisi bu
        this.resetJokerUsage(); // Sadece kullanım durumlarını sıfırla, envanter korunsun
        
        console.log("🔄 Yeni oyun başlıyor! Bölüm sıfırlandı: " + this.currentSection);
        
        // Kategorinin tüm sorularını al
        const allCategoryQuestions = [...this.questionsData[category]];
        
        // Soruları zorluğa göre grupla
        const easyQuestions = allCategoryQuestions.filter(q => (q.difficulty || 2) === 1);  
        const mediumQuestions = allCategoryQuestions.filter(q => (q.difficulty || 2) === 2);
        const hardQuestions = allCategoryQuestions.filter(q => (q.difficulty || 2) === 3);
        
        console.log(`📊 Zorluk dağılımı - Kolay: ${easyQuestions.length}, Orta: ${mediumQuestions.length}, Zor: ${hardQuestions.length}`);
        
        // Debug: İlk 5 sorunun zorluk seviyelerini kontrol et
        console.log("🔍 İlk 5 sorunun zorluk seviyeleri:");
        allCategoryQuestions.slice(0, 5).forEach((q, i) => {
            console.log(`  Soru ${i+1}: "${q.question}" - Zorluk: ${q.difficulty || 'undefined'}`);
        });
        
        // İlk bölüm için SADECE KOLAY sorular
        let firstSectionQuestions = [];
        
        // Kolay sorular varsa sadece onları kullan
        if (easyQuestions.length > 0) {
            firstSectionQuestions = this.shuffleArray([...easyQuestions]);
            console.log("✅ Oyun sadece kolay sorularla başlıyor! Kolay soru sayısı: " + easyQuestions.length);
            
            // Debug: Seçilen kolay soruları kontrol et
            console.log("🔍 Seçilen kolay sorular:");
            firstSectionQuestions.slice(0, 3).forEach((q, i) => {
                console.log(`  Kolay Soru ${i+1}: "${q.question}" - Zorluk: ${q.difficulty}`);
            });
        }
        // Kolay soru yoksa orta zorlukta soruları kullan
        else if (mediumQuestions.length > 0) {
            firstSectionQuestions = this.shuffleArray([...mediumQuestions]);
            console.log("⚠️ Kolay soru bulunamadı! Orta zorluktaki sorularla başlıyor.");
        }
        // Son çare olarak tüm soruları kullan
        else {
            firstSectionQuestions = this.shuffleArray([...allCategoryQuestions]);
            console.log("⚠️ Kolay ve orta soru bulunamadı! Mevcut tüm sorularla başlıyor.");
        }
        
        // İlk 10 soruyu seç
        this.questions = firstSectionQuestions.slice(0, 10);
        console.log(`📝 İlk bölüm için ${this.questions.length} soru seçildi.`);
        
        // Debug: Final seçilen soruların zorluk seviyelerini kontrol et
        console.log("🔍 Final seçilen soruların zorluk seviyeleri:");
        this.questions.forEach((q, i) => {
            console.log(`  Final Soru ${i+1}: "${q.question}" - Zorluk: ${q.difficulty || 'undefined'}`);
        });
        
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
    
    // Quiz modunu aktifleştir
    activateQuizMode: function() {
        // Joker tab menüsünü göster
        const jokerTabBar = document.getElementById('joker-tab-bar');
        if (jokerTabBar) jokerTabBar.style.display = 'flex';
        
        // Normal tab menüsünü gizle (mobile-tab-bar ID'sine sahip element kullanıldığı için düzeltildi)
        const tabBar = document.getElementById('mobile-tab-bar');
        if (tabBar) tabBar.style.display = 'none';
        
        document.body.classList.add('quiz-active');
        // Quiz modunda olduğumuzu localStorage'a kaydet
        localStorage.setItem('quizModeActive', 'true');
    },
    
    // Quiz modunu deaktive et
    deactivateQuizMode: function() {
        // Joker tab menüsünü gizle
        const jokerTabBar = document.getElementById('joker-tab-bar');
        if (jokerTabBar) jokerTabBar.style.display = 'none';
        
        // Normal tab menüsünü göster (mobile-tab-bar ID'sine sahip element kullanıldığı için düzeltildi)
        const tabBar = document.getElementById('mobile-tab-bar');
        if (tabBar) tabBar.style.display = 'flex';
        
        document.body.classList.remove('quiz-active');
        // Quiz modundan çıktığımızı localStorage'a kaydet
        localStorage.removeItem('quizModeActive');
    },
    
    // Joker tab butonlarına olay dinleyicileri ekle
    initJokerTabBar: function() {
        const self = this;
        
        // 50:50 jokeri
        const jokerTabFifty = document.getElementById('joker-tab-fifty');
        if (jokerTabFifty) {
            jokerTabFifty.addEventListener('click', function() {
                const jokerFiftyBtn = document.getElementById('joker-fifty');
                if (jokerFiftyBtn && !jokerFiftyBtn.disabled) {
                    jokerFiftyBtn.click();
                }
            });
        }

        // İpucu jokeri
        const jokerTabHint = document.getElementById('joker-tab-hint');
        if (jokerTabHint) {
            jokerTabHint.addEventListener('click', function() {
                const jokerHintBtn = document.getElementById('joker-hint');
                if (jokerHintBtn && !jokerHintBtn.disabled) {
                    jokerHintBtn.click();
                }
            });
        }

        // Süre jokeri
        const jokerTabTime = document.getElementById('joker-tab-time');
        if (jokerTabTime) {
            jokerTabTime.addEventListener('click', function() {
                const jokerTimeBtn = document.getElementById('joker-time');
                if (jokerTimeBtn && !jokerTimeBtn.disabled) {
                    jokerTimeBtn.click();
                }
            });
        }

        // Pas jokeri
        const jokerTabSkip = document.getElementById('joker-tab-skip');
        if (jokerTabSkip) {
            jokerTabSkip.addEventListener('click', function() {
                const jokerSkipBtn = document.getElementById('joker-skip');
                if (jokerSkipBtn && !jokerSkipBtn.disabled) {
                    jokerSkipBtn.click();
                }
            });
        }

        // Joker mağazası
        const jokerTabStore = document.getElementById('joker-tab-store');
        if (jokerTabStore) {
            jokerTabStore.addEventListener('click', function() {
                const jokerStoreBtn = document.getElementById('joker-store');
                if (jokerStoreBtn && !jokerStoreBtn.disabled) {
                    jokerStoreBtn.click();
                }
            });
        }

        // Ana sayfa butonu (quiz'den çıkış)
        const jokerTabHome = document.getElementById('joker-tab-home');
        if (jokerTabHome) {
            jokerTabHome.addEventListener('click', function() {
                // Quiz'den çıkış için onay sor
                if (confirm('Quiz\'den çıkmak istediğinize emin misiniz? İlerleyişiniz kaydedilecek.')) {
                    // Quiz'i gizle
                    const quizElement = document.getElementById('quiz');
                    if (quizElement) quizElement.style.display = 'none';
                    
                    // Ana menüyü göster
                    const mainMenu = document.getElementById('main-menu');
                    if (mainMenu) mainMenu.style.display = 'block';
                    
                    // Kategori seçimini göster
                    const categorySelection = document.getElementById('category-selection');
                    if (categorySelection) categorySelection.style.display = 'none';
                    
                    // Quiz modunu deaktive et
                    self.deactivateQuizMode();
                }
            });
        }
    },
    
    // Quiz'i başlat
    startQuiz: function() {
        // Body'ye quiz aktif class'ını ekle - logo gizlemek için ve mobil tab barın yer değiştirmesi için
        document.body.classList.add('quiz-active');
        document.body.classList.remove('category-selection');
        
        // Quiz modunu aktifleştir
        this.activateQuizMode();
        
        // Progressive Zorluk Sistemi - İlk başlangıç için bölümün 1 olduğundan emin ol
        this.currentSection = 1; // Zorluk seviyesi kolay başlaması için
        console.log('✅ startQuiz: currentSection ayarlandı:', this.currentSection);
        
        console.log('🚀 Quiz başlıyor - Progressive Zorluk Sistemi aktif, bölüm:', this.currentSection);
        
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
        
        // Skorları güncelle
        this.updateScoreDisplay();
        
        // Joker butonlarını başlangıç durumuna getir
        this.updateJokerButtons();
        
        // İlk soruyu göster
        // Debug: İlk soru gösterilmeden önce zorluk seviyesini kontrol et
        const difficulty = this.getProgressiveDifficulty();
        console.log(`🚀 Quiz başlıyor - İlk bölüm (${this.currentSection}) zorluk: ${difficulty === 1 ? 'Kolay' : difficulty === 2 ? 'Orta' : 'Zor'}`);
        
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

        // Can kontrolü kaldırıldı - loseLife fonksiyonu kendi başına can satın alma modalını handle ediyor
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
        
        // Progressive difficulty sistemi: Bölüme göre otomatik zorluk belirleme
        // İlk bölümde her zaman kolay sorular gösterildiğinden emin ol
        if (this.currentSection <= 1) {
            console.log("🔄 Yeni oyun/yeni bölüm başlıyor - currentSection:", this.currentSection);
            // Eğer currentSection 1 veya daha düşük değilse, 1 olarak ayarla
            this.currentSection = 1;
        }
        
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
        
        // Kolay, orta ve zor soruları ayır
        const easyQuestions = groupedByDifficulty[1] || [];
        const mediumQuestions = groupedByDifficulty[2] || [];
        const hardQuestions = groupedByDifficulty[3] || [];
        
        console.log(`🔍 Zorluk seviyesi dağılımı: Kolay: ${easyQuestions.length}, Orta: ${mediumQuestions.length}, Zor: ${hardQuestions.length}`);
        
        // İlk bölüm her zaman kolay sorularla başlar
        let levelQuestions = [];
        
        // İlk bölüm için sadece KOLAY sorular
        if (this.currentSection === 1) {
            if (easyQuestions.length > 0) {
                levelQuestions = this.shuffleArray([...easyQuestions]);
                console.log(`✅ İlk bölüm: ${easyQuestions.length} kolay soru bulundu`);
            } 
            // Kolay soru yoksa orta zorluk kullan
            else if (mediumQuestions.length > 0) {
                levelQuestions = this.shuffleArray([...mediumQuestions]);
                console.log(`⚠️ UYARI: Kolay soru bulunamadı! İlk bölüm için ${mediumQuestions.length} orta zorluktaki soru kullanılıyor`);
            }
            // Her ikisi de yoksa ne varsa kullan
            else {
                levelQuestions = this.shuffleArray([...categoryQuestions]);
                console.log(`⚠️ UYARI: Kolay veya orta soru bulunamadı! İlk bölüm için tüm sorular kullanılıyor`);
            }
        }
        // İkinci bölüm için ORTA sorular
        else if (this.currentSection === 2) {
            if (mediumQuestions.length > 0) {
                levelQuestions = this.shuffleArray([...mediumQuestions]);
                console.log(`✅ İkinci bölüm: ${mediumQuestions.length} orta zorlukta soru bulundu`);
            }
            // Orta yoksa kolay ile devam et
            else if (easyQuestions.length > 0) {
                levelQuestions = this.shuffleArray([...easyQuestions]);
                console.log(`⚠️ UYARI: Orta soru bulunamadı! İkinci bölüm için kolay sorular kullanılıyor`);
            }
            // Kolay da yoksa ne varsa kullan
            else {
                levelQuestions = this.shuffleArray([...categoryQuestions]);
                console.log(`⚠️ UYARI: Orta veya kolay soru bulunamadı! İkinci bölüm için tüm sorular kullanılıyor`);
            }
        }
        // Üçüncü ve sonraki bölümler için ZOR sorular
        else {
            if (hardQuestions.length > 0) {
                levelQuestions = this.shuffleArray([...hardQuestions]);
                console.log(`✅ İleri bölüm: ${hardQuestions.length} zor soru bulundu`);
            }
            // Zor yoksa orta ile devam et
            else if (mediumQuestions.length > 0) {
                levelQuestions = this.shuffleArray([...mediumQuestions]);
                console.log(`⚠️ UYARI: Zor soru bulunamadı! İleri bölüm için orta zorluktaki sorular kullanılıyor`);
            }
            // İkisi de yoksa ne varsa kullan
            else {
                levelQuestions = this.shuffleArray([...categoryQuestions]);
                console.log(`⚠️ UYARI: Zor veya orta soru bulunamadı! İleri bölüm için tüm sorular kullanılıyor`);
            }
        }
        
        // Eğer hiç soru yoksa uyarı gösterelim
        if (levelQuestions.length === 0) {
            console.error("⛔️ Bu bölüm için hiç soru bulunamadı!");
            alert("Bu kategoride yeterli soru bulunamadı. Lütfen başka bir kategori seçin.");
            
            // Kategori seçimine geri dön
            this.displayCategories();
            return;
        }
        
        // En fazla 10 soru göster (ilgili zorluk seviyesinden) - soru sayısı yetersizse hepsini kullan
        this.questions = levelQuestions.slice(0, Math.min(10, levelQuestions.length));
        
        // Soruları zorluk seviyesine göre sırala (kolaydan zora)
        this.questions.sort((a, b) => {
            const difficultyA = a.difficulty || 2;
            const difficultyB = b.difficulty || 2;
            return difficultyA - difficultyB;
        });
        
        console.log(`📊 Sorular zorluk seviyesine göre sıralandı: ${this.questions.map(q => q.difficulty || 2).join(', ')}`);
        
        this.arrangeBlankFillingFirst();
        
        // Debug: Yüklenen soruların zorluk seviyelerini kontrol et
        const difficultyCheck = {};
        this.questions.forEach(q => {
            const diff = q.difficulty || 'undefined';
            difficultyCheck[diff] = (difficultyCheck[diff] || 0) + 1;
        });
        
        // Bölüm bilgisini ekrana yazdır
        const sectionNames = { 1: 'Başlangıç (Kolay)', 2: 'Orta', 3: 'İleri (Zor)' };
        const sectionName = sectionNames[this.currentSection] || `Bölüm ${this.currentSection}`;
        console.log(`🎮 ${sectionName} bölümü için ${this.questions.length} soru yüklendi.`);
        console.log(`✅ Yüklenen soruların zorluk dağılımı:`, difficultyCheck);
        
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
        
        // Can kontrolü kaldırıldı - loseLife fonksiyonu kendi başına can satın alma modalını handle ediyor
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
            document.body.classList.add('profile-active');
            
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
                document.body.classList.remove('profile-active');
                
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
            console.log('Profil düzenleme butonu bulundu, olay dinleyicisi ekleniyor...');
            
            // Önceki onclick handler'ını temizle
            editProfileBtn.onclick = null;
            
            // Self referansı sakla (this context sorunu için)
            const self = this;
            
            // Yeni event listener ekle
            editProfileBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Profil düzenleme butonuna tıklandı!');
                console.log('Self objesi:', self);
                console.log('showEditProfileModal fonksiyonu var mı?', typeof self.showEditProfileModal);
                
                if (typeof self.showEditProfileModal === 'function') {
                    try {
                        console.log('showEditProfileModal çağrılıyor...');
                        self.showEditProfileModal();
                        console.log('showEditProfileModal başarıyla çağrıldı');
                    } catch (error) {
                        console.error('showEditProfileModal çağrılırken hata:', error);
                        alert('Profil düzenleme modalı açılırken hata oluştu: ' + error.message);
                    }
                } else {
                    console.error('showEditProfileModal fonksiyonu bulunamadı!');
                    alert('Profil düzenleme özelliği şu anda kullanılamıyor.');
                }
            });
            
            // Buton metnini güncelle
            editProfileBtn.innerHTML = '<i class="fas fa-edit"></i> Profili Düzenle';
            console.log('Profil düzenleme butonu hazırlandı');
        } else {
            console.error('Profil düzenleme butonu bulunamadı!');
        }
    },
    
    // Profil verilerini yükle
    loadProfileData: function() {
        const userId = this.getCurrentUserId();
        
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
                joinDate.textContent = date.toLocaleDateString('tr-TR');
            }
            }
            
        // Firebase'den kullanıcı verilerini yükle (puan, istatistikler vs.)
        this.loadFirebaseUserStats(userId);
        
        // Gerçek istatistikleri güncelle
        this.updateRealUserStats();
        
        // İstatistikleri hemen yeniden hesapla ve güncelle
        setTimeout(() => {
            const latestStats = this.calculateRealStats();
            console.log('Profil açıldığında hesaplanan son istatistikler:', latestStats);
            this.updateProfileStats(latestStats);
        }, 100);
            
            // Rozetleri yükle
        this.loadUserBadgesForProfile(userId);
            
            // Yüksek skorları yükle
        this.loadHighScoresForProfile(userId);
            
            // Son aktiviteleri yükle
        this.loadRecentActivitiesForProfile(userId);
    },

    // Mevcut kullanıcı ID'sini al
    getCurrentUserId: function() {
        if (firebase.auth && firebase.auth().currentUser) {
            return firebase.auth().currentUser.uid;
        }
        // Firebase yoksa yerel ID kullan
        return 'local-user';
    },

    // Test verileri oluştur (geliştirme amaçlı)
    createTestData: function() {
        const userId = this.getCurrentUserId();
        
        // Test skorları oluştur
        const testScores = [
            { category: 'Genel Kültür', score: 85, totalQuestions: 10, correctAnswers: 8, date: Date.now() - 86400000 },
            { category: 'Bilim', score: 92, totalQuestions: 10, correctAnswers: 9, date: Date.now() - 172800000 },
            { category: 'Tarih', score: 78, totalQuestions: 10, correctAnswers: 7, date: Date.now() - 259200000 },
            { category: 'Spor', score: 90, totalQuestions: 10, correctAnswers: 9, date: Date.now() - 345600000 },
            { category: 'Coğrafya', score: 100, totalQuestions: 10, correctAnswers: 10, date: Date.now() - 432000000 }
        ];
        
        // Skorları localStorage'a kaydet
        localStorage.setItem('quiz-high-scores', JSON.stringify(testScores));
        
        // Test oyun geçmişi oluştur
        const testGameHistory = [
            { category: 'Genel Kültür', score: 85, totalQuestions: 10, correctAnswers: 8, date: Date.now() - 86400000, averageTime: 12 },
            { category: 'Bilim', score: 92, totalQuestions: 10, correctAnswers: 9, date: Date.now() - 172800000, averageTime: 8 },
            { category: 'Tarih', score: 78, totalQuestions: 10, correctAnswers: 7, date: Date.now() - 259200000, averageTime: 15 },
            { category: 'Spor', score: 90, totalQuestions: 10, correctAnswers: 9, date: Date.now() - 345600000, averageTime: 9 },
            { category: 'Coğrafya', score: 100, totalQuestions: 10, correctAnswers: 10, date: Date.now() - 432000000, averageTime: 7 }
        ];
        
        localStorage.setItem('gameHistory', JSON.stringify(testGameHistory));
        
        // İstatistikleri hesapla ve kaydet
        const stats = this.calculateRealStats();
        
        // İlk oyun rozetini ver
        if (this.badgeSystem && this.badgeSystem.awardBadge && this.badgeSystem.badges) {
            console.log('İlk oyun rozeti veriliyor...');
        this.badgeSystem.awardBadge(userId, this.badgeSystem.badges.firstGame);
        }
        
        console.log('Test verileri oluşturuldu!', stats);
        this.showToast('Test verileri oluşturuldu! Profil sayfasını yenileyin.', 'toast-success');
        
        // İstatistikleri hemen güncelle
        this.updateRealUserStats();
        
        return stats;
    },
    
    // İstatistikleri manuel olarak yenile (debug için)
    refreshStats: function() {
        console.log('İstatistikler yenileniyor...');
        const stats = this.updateRealUserStats();
        console.log('Güncellenmiş istatistikler:', stats);
        this.showToast('İstatistikler yenilendi!', 'toast-success');
        return stats;
    },
    
    // Debug: Profil düzenleme testini çalıştır
    testProfileEdit: function() {
        console.log('Profil düzenleme testi başlatılıyor...');
        
        // Profil sayfasının açık olup olmadığını kontrol et
        const profilePage = document.getElementById('profile-page');
        if (!profilePage || profilePage.style.display === 'none') {
            console.log('Profil sayfası kapalı, açılıyor...');
            this.showProfilePage();
            
            // Sayfa açıldıktan sonra test et
            setTimeout(() => {
                this.testProfileEditButton();
            }, 1000);
        } else {
            this.testProfileEditButton();
        }
    },
    
    // Debug: Profil düzenleme modalını direkt aç
    openEditModal: function() {
        console.log('Profil düzenleme modalı direkt açılıyor...');
        if (typeof this.showEditProfileModal === 'function') {
            this.showEditProfileModal();
        } else {
            console.error('showEditProfileModal fonksiyonu bulunamadı!');
        }
    },
    
    // Profil düzenleme butonunu test et
    testProfileEditButton: function() {
        const editBtn = document.getElementById('edit-profile-btn');
        if (editBtn) {
            console.log('Profil düzenleme butonu bulundu:', editBtn);
            console.log('Buton görünür mü?', editBtn.offsetParent !== null);
            console.log('Buton event listener\'ları:', editBtn.onclick);
            
            // Butona programatik olarak tıkla
            editBtn.click();
        } else {
            console.error('Profil düzenleme butonu bulunamadı!');
        }
    },
    
    // Firebase'den kullanıcı istatistiklerini yükle
    loadFirebaseUserStats: function(userId) {
        if (!firebase.firestore) {
            // Firebase yoksa localStorage'dan istatistikleri al ve hesapla
            console.log('Firebase yok, localStorage\'dan istatistikler yükleniyor...');
            const stats = this.calculateRealStats();
            this.updateProfileStats(stats);
            
            // Toplam puanı da güncelle
            const profileTotalScore = document.getElementById('profile-total-score');
            if (profileTotalScore) {
                profileTotalScore.textContent = this.totalScore || stats.totalScore || 0;
            }
            
            // Seviyeyi güncelle
            const profileUserLevel = document.getElementById('profile-user-level');
            if (profileUserLevel) {
                const totalPoints = this.totalScore || stats.totalScore || 0;
                const level = Math.floor(totalPoints / 500) + 1;
                profileUserLevel.textContent = level;
            }
            return;
        }
        
        const db = firebase.firestore();
        
        // Kullanıcı dokümanından temel bilgileri al
        db.collection('users').doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    console.log('Kullanıcı verileri:', userData);
                    
                    // Firebase'den gelen totalScore'u quizApp'e ata
                    if (userData.totalScore !== undefined) {
                        this.totalScore = userData.totalScore;
                    }
                    
                    // Profilde toplam puanı göster
                    const profileTotalScore = document.getElementById('profile-total-score');
                    if (profileTotalScore) {
                        profileTotalScore.textContent = this.totalScore || 0;
                    }
                    
                    // Profilde seviyeyi göster
                    const profileUserLevel = document.getElementById('profile-user-level');
                    if (profileUserLevel) {
                        const level = Math.floor((this.totalScore || 0) / 500) + 1;
                        profileUserLevel.textContent = level;
                    }
                    
                    // Eğer kullanıcı verisinde istatistik yoksa skorlardan hesapla
                    if (!userData.stats) {
                        this.calculateStatsFromScores(userId);
                    } else {
                        this.updateProfileStats(userData.stats);
                    }
                } else {
                    // Kullanıcı verisi yoksa skorlardan hesapla
                    this.calculateStatsFromScores(userId);
                }
            })
            .catch((error) => {
                console.error('Kullanıcı verileri yüklenirken hata:', error);
                // Hata durumunda localStorage'dan al
                const stats = this.getStats();
                this.updateProfileStats(stats);
            });
    },
    
    // Skorlardan istatistikleri hesapla
    calculateStatsFromScores: function(userId) {
        if (!firebase.firestore) return;
        
        const db = firebase.firestore();
        
        // Firestore'daki highScores koleksiyonundan kullanıcının skorlarını al
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
                
                // İstatistikleri kullanıcı dokümanına kaydet
                db.collection('users').doc(userId).update({
                    stats: stats,
                    statsLastUpdated: new Date()
                }).catch((error) => {
                    console.error('İstatistikler kaydedilirken hata:', error);
                });
            })
            .catch((error) => {
                console.error('Skorlar alınırken hata:', error);
                // Hata durumunda localStorage'dan al
                const stats = this.getStats();
                this.updateProfileStats(stats);
            });
    },
    
    // Profil istatistiklerini güncelle
    updateProfileStats: function(stats) {
        console.log('updateProfileStats çağrıldı, stats:', stats);
        
        // Profil sayfasındaki istatistik kutuları
        const totalGames = document.getElementById('stats-total-games');
        if (totalGames) {
            totalGames.textContent = stats.totalGames || 0;
            console.log('Profil - Toplam oyun güncellendi:', stats.totalGames || 0);
        } else {
            console.log('stats-total-games elementi bulunamadı');
        }
        
        const totalQuestions = document.getElementById('stats-total-questions');
        if (totalQuestions) {
            totalQuestions.textContent = stats.totalQuestions || 0;
            console.log('Profil - Toplam soru güncellendi:', stats.totalQuestions || 0);
        } else {
            console.log('stats-total-questions elementi bulunamadı');
        }
        
        const correctAnswers = document.getElementById('stats-correct-answers');
        if (correctAnswers) {
            correctAnswers.textContent = stats.correctAnswers || 0;
            console.log('Profil - Doğru cevap güncellendi:', stats.correctAnswers || 0);
        } else {
            console.log('stats-correct-answers elementi bulunamadı');
        }
        
        // Doğruluk oranı
        const accuracy = document.getElementById('stats-accuracy');
        if (accuracy) {
            const accuracyValue = stats.totalQuestions > 0 
                ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
                : 0;
            accuracy.textContent = `%${accuracyValue}`;
            console.log('Profil - Doğruluk oranı güncellendi:', accuracyValue);
        } else {
            console.log('stats-accuracy elementi bulunamadı');
        }
        
        // İstatistik sayfasındaki kutular da varsa onları da güncelle
        const totalGamesStat = document.getElementById('total-games-stat');
        if (totalGamesStat) {
            totalGamesStat.textContent = stats.totalGames || 0;
            console.log('İstatistik sayfası - Toplam oyun güncellendi:', stats.totalGames || 0);
        }
        
        const totalQuestionsStat = document.getElementById('total-questions-stat');
        if (totalQuestionsStat) {
            totalQuestionsStat.textContent = stats.totalQuestions || 0;
            console.log('İstatistik sayfası - Toplam soru güncellendi:', stats.totalQuestions || 0);
        }
        
        const correctAnswersStat = document.getElementById('correct-answers-stat');
        if (correctAnswersStat) {
            correctAnswersStat.textContent = stats.correctAnswers || 0;
            console.log('İstatistik sayfası - Doğru cevap güncellendi:', stats.correctAnswers || 0);
        }
        
        const accuracyStat = document.getElementById('accuracy-stat');
        if (accuracyStat) {
            const accuracyValue = stats.totalQuestions > 0 
                ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
                : 0;
            accuracyStat.textContent = `%${accuracyValue}`;
            console.log('İstatistik sayfası - Doğruluk oranı güncellendi:', accuracyValue);
        }
        
        const highestScoreStat = document.getElementById('highest-score-stat');
        if (highestScoreStat) {
            highestScoreStat.textContent = stats.highestScore || 0;
            console.log('İstatistik sayfası - En yüksek skor güncellendi:', stats.highestScore || 0);
        }
    },

    // Gerçek kullanıcı istatistiklerini al ve güncelle
    updateRealUserStats: function() {
        const userId = this.getCurrentUserId();
        if (!userId) return;

        // localStorage'dan gerçek istatistikleri çek
        const realStats = this.calculateRealStats();
        console.log('updateRealUserStats - hesaplanan istatistikler:', realStats);
        
        // Profil sayfası açık olup olmadığına bakılmaksızın istatistikleri güncelle
            this.updateProfileStats(realStats);
            
        // Toplam puanı güncelle (hesaplanan istatistiklerden veya mevcut toplam puan)
            const profileTotalScore = document.getElementById('profile-total-score');
            if (profileTotalScore) {
            const totalPoints = this.totalScore || realStats.totalScore || 0;
            profileTotalScore.textContent = totalPoints;
            console.log('Toplam puan güncellendi:', totalPoints);
            }
            
            // Seviyeyi güncelle (toplam puana göre)
            const profileUserLevel = document.getElementById('profile-user-level');
            if (profileUserLevel) {
            const totalPoints = this.totalScore || realStats.totalScore || 0;
            const level = Math.floor(totalPoints / 500) + 1;
                profileUserLevel.textContent = level;
            console.log('Seviye güncellendi:', level);
        }

        // Rozet sistemini kontrol et
        if (this.badgeSystem && this.badgeSystem.checkAndAwardBadges) {
        this.badgeSystem.checkAndAwardBadges(userId, realStats);
        }
        
        return realStats;
    },

    // Gerçek istatistikleri hesapla
    calculateRealStats: function() {
        try {
            console.log('calculateRealStats çağrıldı');
            
            // Oyun geçmişini al
            const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
            console.log('Oyun geçmişi:', gameHistory);
            
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
                
                // Mükemmel oyunları say
                if (game.correctAnswers === game.totalQuestions && game.totalQuestions > 0) {
                    perfectGames++;
                }
                
                // Hızlı cevapları say (ortalama süre 10 saniyeden az ise)
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

            // High scores'tan da veri topla (eski format desteği için)
            const categories = ['Genel Kültür', 'Bilim', 'Teknoloji', 'Spor', 'Müzik', 'Tarih', 'Coğrafya', 'Sanat', 'Edebiyat', 'Hayvanlar', 'Matematik'];
            
            console.log('High scores kontrol ediliyor...');
            categories.forEach(category => {
                const categoryScores = JSON.parse(localStorage.getItem(`highScores_${category}`) || '[]');
                console.log(`${category} kategorisi skorları:`, categoryScores);
                
                categoryScores.forEach(score => {
                    if (score.score) {
                        // Sadece gameHistory'de yoksa ekle (duplikasyon önleme)
                        const existsInHistory = gameHistory.some(game => 
                            game.category === category && 
                            Math.abs((game.score || 0) - score.score) < 5 // Küçük fark toleransı
                        );
                        
                        if (!existsInHistory) {
                            console.log(`${category} kategorisinden skor ekleniyor:`, score);
                            totalGames++;
                        totalScore += score.score;
                            totalQuestions += score.totalQuestions || 10; // Varsayılan
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
            
            // Ayrıca genel high scores da kontrol et
            const generalHighScores = JSON.parse(localStorage.getItem('quiz-high-scores') || '[]');
            console.log('Genel high scores:', generalHighScores);
            
            generalHighScores.forEach(score => {
                if (score.score) {
                    const existsInHistory = gameHistory.some(game => 
                        Math.abs((game.score || 0) - score.score) < 5
                    );
                    
                    if (!existsInHistory) {
                        console.log('Genel high score\'dan skor ekleniyor:', score);
                        totalGames++;
                        totalScore += score.score;
                        totalQuestions += score.totalQuestions || 10;
                        correctAnswers += score.correctAnswers || Math.round(score.score / 10);
                        
                        if (score.correctAnswers === score.totalQuestions) {
                            perfectGames++;
                        }
                        
                        if (score.category) {
                            categoriesPlayed.add(score.category);
                            
                            if (!categoryStats[score.category]) {
                                categoryStats[score.category] = { total: 0, correct: 0, games: 0 };
                            }
                            categoryStats[score.category].total += score.totalQuestions || 10;
                            categoryStats[score.category].correct += score.correctAnswers || Math.round(score.score / 10);
                            categoryStats[score.category].games++;
                        }
                    }
                }
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

            // Toplam puanı this.totalScore'a ata (eğer daha büyükse)
            if (stats.totalScore > (this.totalScore || 0)) {
                this.totalScore = stats.totalScore;
                console.log('Toplam puan güncellendi:', this.totalScore);
            }

            // İstatistikleri localStorage'a kaydet
            localStorage.setItem('userStats', JSON.stringify(stats));
            localStorage.setItem('quiz-user-stats', JSON.stringify(stats));
            
            return stats;
        } catch (error) {
            console.error('İstatistikler hesaplanırken hata:', error);
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
    
    // Kullanıcı rozetlerini profil için yükle
    loadUserBadgesForProfile: function(userId) {
        const badgesContainer = document.getElementById('profile-badges-container');
        if (!badgesContainer) return;
        
        badgesContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Rozetler yükleniyor...</div>';
        
        // Kullanıcının kazandığı rozetleri al
        const userBadges = this.badgeSystem.getUserBadges(userId);
        // Tüm mevcut rozetleri al
        const allBadges = this.badgeSystem.badges;
        
        setTimeout(() => {
            badgesContainer.innerHTML = '';
            
            // Tüm rozetleri göster (kazanılan ve kazanılmayan)
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
                    badgeDate = 'Henüz kazanılmadı';
                }
                
                        badgeElement.innerHTML = `
                    <i class="badge-icon ${badge.icon || 'fas fa-award'}"></i>
                            <div class="badge-name">${badge.name || 'Bilinmeyen Rozet'}</div>
                    <div class="badge-date">${badgeDate}</div>
                        `;
                
                // Rozet tıklama olayı ekle
                badgeElement.addEventListener('click', () => {
                    this.showBadgeInfoModal(badge, isEarned, badgeDate);
                });
                        
                        badgesContainer.appendChild(badgeElement);
                    });
            
            // Rozetleri yükledikten sonra güncel istatistikleri kontrol et ve rozetleri güncelle
            this.checkAndUpdateBadges(userId);
            
            // Hiç rozet yoksa placeholder göster
            if (Object.keys(allBadges).length === 0) {
                badgesContainer.innerHTML = '<div class="badge-placeholder">Henüz tanımlı rozet yok</div>';
            }
        }, 500);
    },

    // Rozet bilgi modalını göster
    showBadgeInfoModal: function(badge, isEarned, earnedDate) {
        // Modal oluştur
        const modal = document.createElement('div');
        modal.className = 'modal badge-info-modal';
        modal.id = 'badge-info-modal';
        
        const statusText = isEarned ? '✅ Kazanıldı!' : '⏳ Henüz Kazanılmadı';
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
                            ${isEarned ? `<div class="badge-earned-date">Kazanıldı: ${earnedDate}</div>` : ''}
                        </div>
                    </div>
                    <div class="badge-requirements">
                        <h5><i class="fas fa-tasks"></i> Nasıl Kazanılır:</h5>
                        <p>${howToEarnText}</p>
                    </div>
                </div>
                </div>
            `;
        
        document.body.appendChild(modal);
        
        // Modal göster
        setTimeout(() => modal.classList.add('show'), 10);
    },

    // Rozet gereksinimlerini açıklayan metin
    getBadgeRequirementText: function(badge) {
        const requirements = {
            'firstGame': 'İlk quiz oyununuzu oynayın.',
            'perfectScore': 'Bir oyunda tüm soruları doğru cevaplayın (10/10 puan).',
            'speedster': '5 soruyu 10 saniyeden kısa sürede cevaplayın.',
            'scholar': 'Toplamda 50 soruyu doğru cevaplayın.',
            'dedicated': 'Toplamda 10 oyun tamamlayın.',
            'genius': 'En az 20 soru cevapladıktan sonra %90 veya üzeri doğruluk oranına sahip olun.',
            'explorer': '5 farklı kategoride oyun oynayın.'
        };
        return requirements[badge.id] || 'Bu rozetin gereksinimleri henüz tanımlanmamış.';
    },

    // Rozetleri kontrol et ve güncelle
    checkAndUpdateBadges: function(userId) {
        // Güncel istatistikleri al
        const currentStats = this.calculateRealStats();
        
        // Yeni rozetleri kontrol et
        const newBadges = this.badgeSystem.checkAndAwardBadges(userId, currentStats);
        
        // Eğer yeni rozet kazanıldıysa profili yenile
        if (newBadges && newBadges.length > 0) {
            setTimeout(() => {
                this.loadUserBadgesForProfile(userId);
            }, 1000);
        }
    },
    
    // Yüksek skorları profil için yükle
    loadHighScoresForProfile: function(userId) {
        const highScoresTable = document.getElementById('profile-high-scores');
        if (!highScoresTable) return;
        
        highScoresTable.innerHTML = '<tr><td colspan="3" class="loading">Skorlar yükleniyor...</td></tr>';
        
        if (firebase.firestore) {
            const db = firebase.firestore();
            
            // Firebase index hatası nedeniyle basit sorgu kullan
            db.collection('highScores')
                .where('userId', '==', userId)
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        // Firebase'de skor yoksa localStorage'dan al
                        this.loadHighScoresFromLocalStorage(highScoresTable);
                        return;
                    }
                    
                    // Skorları al ve JavaScript'te sırala
                    const scores = [];
                    querySnapshot.forEach(doc => {
                        scores.push({...doc.data(), id: doc.id});
                    });
                    
                    // Skora göre azalan sırada sırala
                    scores.sort((a, b) => (b.score || 0) - (a.score || 0));
                    
                    // İlk 10 skoru göster
                    highScoresTable.innerHTML = '';
                    scores.slice(0, 10).forEach(scoreData => {
                        const row = document.createElement('tr');
                        const scoreDate = this.formatScoreDate(scoreData.date);
                        row.innerHTML = `
                            <td>${scoreData.category || 'Genel'}</td>
                            <td>${scoreData.score || 0}</td>
                            <td>${scoreDate}</td>
                        `;
                        highScoresTable.appendChild(row);
                    });
                    
                    if (scores.length === 0) {
                        highScoresTable.innerHTML = '<tr><td colspan="3" class="no-data">Henüz kaydedilen skor yok</td></tr>';
                    }
                })
                .catch(error => {
                    console.error('Yüksek skorlar yüklenirken hata:', error);
                    // Hata durumunda localStorage'dan yükle
                    this.loadHighScoresFromLocalStorage(highScoresTable);
                });
        } else {
            // Firebase yoksa localStorage'dan al
            this.loadHighScoresFromLocalStorage(highScoresTable);
        }
    },
    
    // Tarih objesini güvenli şekilde formatla
    formatScoreDate: function(dateValue) {
        try {
            if (!dateValue) {
                return 'Bilinmiyor';
            }
            
            let dateObj;
            
            // Firebase Timestamp objesi kontrolü
            if (dateValue && typeof dateValue.toDate === 'function') {
                dateObj = dateValue.toDate();
            }
            // Firebase Timestamp objesi (seconds ve nanoseconds ile)
            else if (dateValue && dateValue.seconds) {
                dateObj = new Date(dateValue.seconds * 1000);
            }
            // Zaten Date objesi
            else if (dateValue instanceof Date) {
                dateObj = dateValue;
            }
            // String veya number timestamp
            else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
                dateObj = new Date(dateValue);
            }
            // Diğer durumlar
            else {
                console.warn('Bilinmeyen tarih formatı:', dateValue);
                return 'Bilinmiyor';
            }
            
            // Geçerli tarih kontrolü
            if (isNaN(dateObj.getTime())) {
                console.warn('Geçersiz tarih:', dateValue);
                return 'Bilinmiyor';
            }
            
            return dateObj.toLocaleDateString('tr-TR');
            
        } catch (error) {
            console.error('Tarih formatlanırken hata:', error, 'Değer:', dateValue);
            return 'Bilinmiyor';
        }
    },
    
    // LocalStorage'dan yüksek skorları yükle
    loadHighScoresFromLocalStorage: function(highScoresTable) {
        try {
            // Farklı kaynaklardan skorları topla
            const allScores = [];
            
            // 1. Genel high scores
            const generalScores = JSON.parse(localStorage.getItem('quiz-high-scores') || '[]');
            allScores.push(...generalScores);
            
            // 2. Kategori bazlı skorlar
            const categories = ['Genel Kültür', 'Bilim', 'Teknoloji', 'Spor', 'Müzik', 'Tarih', 'Coğrafya', 'Sanat', 'Edebiyat'];
            categories.forEach(category => {
                const categoryScores = JSON.parse(localStorage.getItem(`highScores_${category}`) || '[]');
                categoryScores.forEach(score => {
                    allScores.push({...score, category: category});
                });
            });
            
            // 3. Oyun geçmişinden
            const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]');
            gameHistory.forEach(game => {
                if (game.score) {
                    allScores.push({
                        score: game.score,
                        category: game.category || 'Genel',
                        date: game.date || Date.now(),
                        totalQuestions: game.totalQuestions,
                        correctAnswers: game.correctAnswers
                    });
                }
            });
            
            console.log('Toplanan tüm skorlar:', allScores);
            
            if (allScores.length === 0) {
                highScoresTable.innerHTML = '<tr><td colspan="3" class="no-data">Henüz kaydedilen skor yok</td></tr>';
                return;
            }
            
            // Skorları sırala (en yüksekten en düşüğe)
            allScores.sort((a, b) => (b.score || 0) - (a.score || 0));
            
            // Duplikatları kaldır ve en iyi 10'u al
            const uniqueScores = [];
            const seen = new Set();
            
            for (const score of allScores) {
                const key = `${score.category}-${score.score}`;
                if (!seen.has(key) && uniqueScores.length < 10) {
                    seen.add(key);
                    uniqueScores.push(score);
                }
            }
            
            // Tabloyu doldur
            highScoresTable.innerHTML = '';
            uniqueScores.forEach(score => {
                const row = document.createElement('tr');
                const scoreDate = this.formatScoreDate(score.date);
                row.innerHTML = `
                    <td>${score.category || 'Genel'}</td>
                    <td>${score.score || 0}</td>
                    <td>${scoreDate}</td>
                `;
                highScoresTable.appendChild(row);
            });
            
            console.log('Yüksek skorlar tablosu dolduruldu:', uniqueScores);
            
        } catch (error) {
            console.error('LocalStorage skorları yüklenirken hata:', error);
            highScoresTable.innerHTML = '<tr><td colspan="3" class="no-data">Skorlar yüklenirken hata oluştu</td></tr>';
        }
    },
    
    // Son aktiviteleri profil için yükle
    loadRecentActivitiesForProfile: function(userId) {
        const activitiesList = document.getElementById('recent-activities-list');
        if (!activitiesList) return;
        
        activitiesList.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Aktiviteler yükleniyor...</div>';
        
        // Firebase'den aktiviteleri yükleme
        if (firebase.auth && firebase.firestore && this.isLoggedIn) {
            const db = firebase.firestore();
            db.collection('users').doc(userId)
                .collection('activities')
                .orderBy('timestamp', 'desc')
                .limit(5)
                .get()
                .then((querySnapshot) => {
                    // Firebase'den gelen aktiviteleri işle
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
                    console.error("Aktiviteler yüklenirken hata oluştu:", error);
                    // Hata durumunda localStorage'a bak
                    this.loadLocalActivities(activitiesList, userId);
                });
        } else {
            // Firebase yoksa veya kullanıcı giriş yapmamışsa localStorage'a bak
            this.loadLocalActivities(activitiesList, userId);
        }
    },
    
    // LocalStorage'dan aktiviteleri yükle
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
            console.error("LocalStorage aktiviteleri işlenirken hata:", error);
            this.generateSampleActivities(activitiesList);
        }
    },
    
    // Aktivite oluştur
    createUserActivity: function(type, title, score = null, category = null) {
        const userId = this.getCurrentUserId();
        const now = new Date();
        
        const activityData = {
            type: type,           // 'game', 'badge', 'task', vb.
            title: title,         // Aktivite başlığı
            timestamp: now,       // Gerçekleşme zamanı
            score: score,         // Varsa skor değeri
            category: category,   // Varsa kategori
            icon: this.getActivityIcon(type) // Tür için uygun ikon
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
    
    // Aktivite tipi için uygun ikon sınıfı
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
    
    // Geçen zamanı belirtilen formatı çevir (1 saat önce, 2 gün önce vb.)
    getTimeAgo: function(timestamp) {
        try {
            if (!timestamp) {
                return 'Bilinmiyor';
            }
            
        const now = new Date();
            let activityTime;
            
            // Firebase Timestamp objesi kontrolü
            if (timestamp && typeof timestamp.toDate === 'function') {
                activityTime = timestamp.toDate();
            }
            // Firebase Timestamp objesi (seconds ile)
            else if (timestamp && timestamp.seconds) {
                activityTime = new Date(timestamp.seconds * 1000);
            }
            // Zaten Date objesi
            else if (timestamp instanceof Date) {
                activityTime = timestamp;
            }
            // String veya number
            else {
                activityTime = new Date(timestamp);
            }
            
            // Geçerli tarih kontrolü
            if (isNaN(activityTime.getTime())) {
                console.warn('Geçersiz timestamp:', timestamp);
                return 'Bilinmiyor';
            }
            
        const diffMs = now - activityTime;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffDay > 30) {
            return activityTime.toLocaleDateString('tr-TR');
        } else if (diffDay > 0) {
            return `${diffDay} gün önce`;
        } else if (diffHour > 0) {
            return `${diffHour} saat önce`;
        } else if (diffMin > 0) {
            return `${diffMin} dakika önce`;
        } else {
            return 'Az önce';
            }
        } catch (error) {
            console.error('Zaman hesaplanırken hata:', error, 'Timestamp:', timestamp);
            return 'Bilinmiyor';
        }
    },
    
    
    // Örnek aktiviteleri göster - veri yoksa
    generateSampleActivities: function(activitiesList) {
        activitiesList.innerHTML = '';
        
        // Rastgele kategori seç
        const categories = ['Genel Kültür', 'Tarih', 'Bilim', 'Spor', 'Sanat', 'Coğrafya'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        // Örnek aktiviteler
        const sampleActivities = [
            {
                icon: 'fas fa-gamepad',
                title: `${randomCategory} kategorisinde bir oyun oynandı`,
                time: '2 saat önce',
                score: Math.floor(Math.random() * 100)
            },
            {
                icon: 'fas fa-award',
                title: '"Bilgi Ustası" rozeti kazanıldı',
                time: '1 gün önce',
                score: null
            },
            {
                icon: 'fas fa-tasks',
                title: 'Günlük görev tamamlandı',
                time: '2 gün önce',
                score: null
            }
        ];
        
        // Örnek aktiviteleri render et
            sampleActivities.forEach(activity => {
            this.renderActivity(activity, activitiesList);
            });
    },
    
    // Profil düzenleme modalını göster
    showEditProfileModal: function() {
        console.log('showEditProfileModal fonksiyonu çağrıldı');
        
        // Mevcut modalı kapat (varsa)
        const existingModal = document.getElementById('edit-profile-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Modal oluştur
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.id = 'edit-profile-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                border-radius: 12px;
                padding: 20px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <div class="modal-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                ">
                    <h3 style="margin: 0; color: #333;">
                        <i class="fas fa-edit"></i> Profili Düzenle
                    </h3>
                    <button class="close-modal" style="
                        background: none;
                        border: none;
                        font-size: 20px;
                        cursor: pointer;
                        color: #666;
                        padding: 5px;
                    " onclick="document.getElementById('edit-profile-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="edit-display-name" style="
                            display: block;
                            margin-bottom: 5px;
                            font-weight: bold;
                            color: #333;
                        ">Görünen Ad:</label>
                        <input type="text" id="edit-display-name" placeholder="Adınızı girin" style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #ddd;
                            border-radius: 6px;
                            font-size: 14px;
                            box-sizing: border-box;
                        ">
                    </div>
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label for="edit-bio" style="
                            display: block;
                            margin-bottom: 5px;
                            font-weight: bold;
                            color: #333;
                        ">Hakkımda:</label>
                        <textarea id="edit-bio" placeholder="Kendiniz hakkında kısa bilgi..." rows="3" style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #ddd;
                            border-radius: 6px;
                            font-size: 14px;
                            resize: vertical;
                            box-sizing: border-box;
                        "></textarea>
                    </div>
                    <div class="modal-actions" style="
                        display: flex;
                        gap: 10px;
                        justify-content: flex-end;
                    ">
                        <button class="btn-secondary" onclick="document.getElementById('edit-profile-modal').remove()" style="
                            padding: 10px 20px;
                            border: 2px solid #ddd;
                            background: white;
                            color: #666;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                        ">İptal</button>
                        <button class="btn-primary" onclick="quizApp.saveProfileChanges()" style="
                            padding: 10px 20px;
                            border: none;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                        ">Kaydet</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        console.log('Modal DOM\'a eklendi');
        
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
                    // Varsayılan kullanıcı adını göster
                    const currentName = document.getElementById('profile-name')?.textContent;
                    if (displayNameInput && currentName) {
                        displayNameInput.value = currentName;
                    }
                }
            } catch (error) {
                console.error('Profil verileri yüklenemedi:', error);
            }
        }
        
        // Modal göster - artık inline style ile görünür
        console.log('Modal gösterildi');
    },
    
    // Profil değişikliklerini kaydet
    saveProfileChanges: function() {
        const displayName = document.getElementById('edit-display-name').value.trim();
        const bio = document.getElementById('edit-bio').value.trim();
        
        if (!displayName) {
            this.showToast('Görünen ad boş olamaz', 'toast-error');
            return;
        }
        
        // Firebase kullanıcısı varsa
        if (firebase.auth && firebase.auth().currentUser) {
            const user = firebase.auth().currentUser;
            
            // Firebase Authentication'da displayName güncelle
            user.updateProfile({
                displayName: displayName
            }).then(() => {
                // Firestore'da da güncelle (varsa)
                if (firebase.firestore) {
                    const db = firebase.firestore();
                    db.collection('users').doc(user.uid).update({
                        displayName: displayName,
                        bio: bio,
                        lastUpdated: new Date()
                    }).catch(error => {
                        console.error('Firestore güncelleme hatası:', error);
                    });
                }
                
                this.updateProfileUI(displayName, bio);
                this.showToast('Profil başarıyla güncellendi', 'toast-success');
            }).catch(error => {
                console.error('Profil güncelleme hatası:', error);
                this.showToast('Profil güncellenirken hata oluştu', 'toast-error');
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
                this.showToast('Profil başarıyla güncellendi', 'toast-success');
            } catch (error) {
                console.error('Profil localStorage\'a kaydedilemedi:', error);
                this.showToast('Profil kaydedilemedi', 'toast-error');
            }
        }
    },

    // Profil UI'sini güncelle
    updateProfileUI: function(displayName, bio) {
        // Profil sayfasındaki bilgileri güncelle
        const profileName = document.getElementById('profile-name');
        if (profileName) {
            profileName.textContent = displayName;
        }
        
        // Bio varsa göster (henüz UI'da yer yoksa eklenecek)
        const profileBio = document.getElementById('profile-bio');
        if (profileBio) {
            profileBio.textContent = bio;
        }
        
        // Modal kapat
        const modal = document.getElementById('edit-profile-modal');
        if (modal) modal.remove();
        
        // Profil sayfasını yenile
        this.loadProfileData();
    },

    // Zaman farkı hesaplama yardımcı fonksiyonu
    calculateTimeAgo: function(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (minutes < 60) {
            return minutes <= 1 ? '1 dakika önce' : `${minutes} dakika önce`;
        } else if (hours < 24) {
            return hours === 1 ? '1 saat önce' : `${hours} saat önce`;
        } else {
            return days === 1 ? '1 gün önce' : `${days} gün önce`;
        }
    },

    // Tüm yüksek skorları al (localStorage'dan)
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
        // Mevcut rozetler tanımları
        badges: {
            firstGame: {
                id: 'firstGame',
                name: 'İlk Oyun',
                description: 'İlk oyununu tamamladın!',
                icon: 'fas fa-play',
                condition: (stats) => stats.totalGames >= 1
            },
            perfectScore: {
                id: 'perfectScore',
                name: 'Mükemmel',
                description: 'Bir oyunda tüm soruları doğru cevapladın!',
                icon: 'fas fa-star',
                condition: (stats) => stats.perfectGames >= 1
            },
            speedster: {
                id: 'speedster',
                name: 'Hız Ustası',
                description: '10 saniyede altında cevap verdin!',
                icon: 'fas fa-bolt',
                condition: (stats) => stats.fastAnswers >= 5
            },
            scholar: {
                id: 'scholar',
                name: 'Bilgi Ustası',
                description: '50 soruyu doğru cevapladın!',
                icon: 'fas fa-graduation-cap',
                condition: (stats) => stats.correctAnswers >= 50
            },
            dedicated: {
                id: 'dedicated',
                name: 'Azimli',
                description: '10 oyun tamamladın!',
                icon: 'fas fa-trophy',
                condition: (stats) => stats.totalGames >= 10
            },
            genius: {
                id: 'genius',
                name: 'Deha',
                description: '%90 üzeri doğruluk oranına sahipsin!',
                icon: 'fas fa-brain',
                condition: (stats) => stats.totalQuestions > 20 && (stats.correctAnswers / stats.totalQuestions) >= 0.9
            },
            explorer: {
                id: 'explorer',
                name: 'Kaşif',
                description: '5 farklı kategoride oyun oynadın!',
                icon: 'fas fa-compass',
                condition: (stats) => stats.categoriesPlayed >= 5
            }
        },

        // Kullanıcının rozetlerini kontrol et ve yeni rozetler ver
        checkAndAwardBadges: function(userId, currentStats) {
            if (!userId) return;

            const userBadges = this.getUserBadges(userId);
            const newBadges = [];

            Object.values(this.badges).forEach(badge => {
                // Eğer kullanıcı bu rozeti henüz kazanmadıysa ve şartları sağlıyorsa
                if (!userBadges[badge.id] && badge.condition(currentStats)) {
                    this.awardBadge(userId, badge);
                    newBadges.push(badge);
                }
            });

            // Yeni rozet kazanıldıysa bildir
            if (newBadges.length > 0) {
                this.showBadgeNotification(newBadges);
            }

            return newBadges;
        },

        // Kullanıcının mevcut rozetlerini al
        getUserBadges: function(userId) {
            try {
                // Önce localStorage'dan al
                const localBadges = localStorage.getItem(`user-badges-${userId}`);
                let userBadges = localBadges ? JSON.parse(localBadges) : {};
                
                // Eğer localStorage'da rozet yoksa ve Firebase varsa oradan al
                if (Object.keys(userBadges).length === 0 && firebase.firestore) {
                    // Bu asenkron işlem, sonucu hemen döndüremeyiz
                    // Ancak localStorage'ı güncelleyebiliriz
                    this.syncBadgesFromFirebase(userId);
                }
                
                return userBadges;
            } catch (error) {
                console.error('Rozetler okunurken hata:', error);
                return {};
            }
        },
        
        // Firebase'den rozetleri senkronize et
        syncBadgesFromFirebase: function(userId) {
            if (!firebase.firestore) return;
            
            const db = firebase.firestore();
            db.collection('users').doc(userId).get()
                .then(doc => {
                    if (doc.exists && doc.data().badges) {
                        const firebaseBadges = doc.data().badges;
                        
                        // Firebase'den gelen rozetleri tam rozet objelerine dönüştür
                        const fullBadges = {};
                        Object.keys(firebaseBadges).forEach(badgeId => {
                            const firebaseBadge = firebaseBadges[badgeId];
                            const fullBadgeDefinition = this.badges[badgeId];
                            
                            if (fullBadgeDefinition) {
                                fullBadges[badgeId] = {
                                    ...fullBadgeDefinition,
                                    earnedDate: firebaseBadge.earnedDate
                                };
                            }
                        });
                        
                        // localStorage'ı güncelle
                        localStorage.setItem(`user-badges-${userId}`, JSON.stringify(fullBadges));
                        console.log('Rozetler Firebase\'den senkronize edildi:', Object.keys(fullBadges));
                    }
                })
                .catch(error => {
                    console.error('Firebase\'den rozetler alınırken hata:', error);
                });
        },

        // Rozet ver
        awardBadge: function(userId, badge) {
            const userBadges = this.getUserBadges(userId);
            
            // Firebase için güvenli badge verisi oluştur (fonksiyonları hariç tut)
            const safeBadgeData = {
                id: badge.id,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                earnedDate: new Date().toISOString()
            };
            
            // localStorage için tam veri (fonksiyonlar dahil)
            const fullBadgeData = {
                ...badge,
                earnedDate: new Date().toISOString()
            };
            
            userBadges[badge.id] = fullBadgeData;

            try {
                // LocalStorage'a kaydet (tam veri ile)
                localStorage.setItem(`user-badges-${userId}`, JSON.stringify(userBadges));
                console.log(`Rozet localStorage'a kaydedildi: ${badge.name}`);
                
                // Firebase için güvenli rozetler objesi oluştur
                const safeBadgesForFirebase = {};
                Object.keys(userBadges).forEach(badgeId => {
                    const userBadge = userBadges[badgeId];
                    safeBadgesForFirebase[badgeId] = {
                        id: userBadge.id,
                        name: userBadge.name,
                        description: userBadge.description,
                        icon: userBadge.icon,
                        earnedDate: userBadge.earnedDate
                    };
                });
                
                // Firestore'a kaydet (güvenli veri ile)
                if (firebase.firestore) {
                    const db = firebase.firestore();
                    db.collection('users').doc(userId).set({
                        badges: safeBadgesForFirebase,
                        lastUpdated: new Date()
                    }, { merge: true }).then(() => {
                        console.log(`Rozet Firestore'a kaydedildi: ${badge.name}`);
                    }).catch(error => {
                        console.error('Rozet Firestore\'a kaydedilemedi:', error);
                    });
                }
                
                // Firebase Realtime Database'e de kaydet (güvenli veri ile)
                if (firebase.database) {
                    firebase.database().ref(`users/${userId}/badges/${badge.id}`).set(safeBadgeData).then(() => {
                        console.log(`Rozet Realtime Database'e kaydedildi: ${badge.name}`);
                    }).catch(error => {
                        console.error('Rozet Firebase Realtime\'a kaydedilemedi:', error);
                    });
                }
            } catch (error) {
                console.error('Rozet kaydedilemedi:', error);
            }
        },

        // Rozet bildirimi göster
        showBadgeNotification: function(newBadges) {
            newBadges.forEach(badge => {
                // Toast ile kısa bildirimi göster
                quizApp.showToast(`🎉 Yeni rozet kazandınız: ${badge.name}!`, 'toast-success');
                
                // Tam ekran modal ile rozet bilgisini göster
                quizApp.showBadgeEarnedModal(badge);
            });
        }
    },
    
    // Rozet kazanma modalını göster (tam ekran)
    showBadgeEarnedModal: function(badge) {
        // Önceki badge modali varsa kapat
        const existingModal = document.querySelector('.badge-earned-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Arka plan müziği ve ses efektleri
        let badgeSound = null;
        if (this.soundEnabled) {
            badgeSound = new Audio('sounds/badge-earned.mp3');
            badgeSound.volume = 0.6;
            badgeSound.play();
        }
        
        // Modal oluştur
        const badgeModal = document.createElement('div');
        badgeModal.className = 'badge-earned-modal';
        
        // Rozet ikon renkleri ve arkaplanları
        let badgeColor = '#ffc107'; // Varsayılan sarı
        let badgeBg = 'linear-gradient(135deg, #fff9c4, #ffeb3b)';
        
        // Rozet türüne göre renklendirme
        if (badge.id === 'perfectScore' || badge.id === 'genius') {
            badgeColor = '#f44336'; // Kırmızı
            badgeBg = 'linear-gradient(135deg, #ffcdd2, #e57373)';
        } else if (badge.id === 'explorer' || badge.id === 'dedicated') {
            badgeColor = '#4caf50'; // Yeşil
            badgeBg = 'linear-gradient(135deg, #c8e6c9, #81c784)';
        } else if (badge.id === 'speedster') {
            badgeColor = '#2196f3'; // Mavi
            badgeBg = 'linear-gradient(135deg, #bbdefb, #64b5f6)';
        } else if (badge.id === 'scholar') {
            badgeColor = '#9c27b0'; // Mor
            badgeBg = 'linear-gradient(135deg, #e1bee7, #ba68c8)';
        }
        
        // Requirement text
        const requirementText = this.getBadgeRequirementText(badge);
        
        badgeModal.innerHTML = `
            <div class="badge-earned-content">
                <div class="badge-earned-overlay"></div>
                <div class="badge-earned-inner">
                    <div class="badge-earned-header">
                        <h2>🏆 Yeni Rozet Kazandınız!</h2>
                        <p>Tebrikler! Başarınız için yeni bir rozet kazandınız.</p>
                    </div>
                    
                    <div class="badge-earned-showcase" style="background: ${badgeBg};">
                        <div class="badge-earned-icon" style="color: ${badgeColor};">
                            <i class="${badge.icon}"></i>
                        </div>
                        <div class="badge-earned-info">
                            <h3>${badge.name}</h3>
                            <p>${badge.description}</p>
                        </div>
                        <div class="badge-earned-confetti">
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                        </div>
                    </div>
                    
                    <div class="badge-earned-details">
                        <div class="badge-earned-requirement">
                            <h4><i class="fas fa-check-circle"></i> Kazanma Koşulu</h4>
                            <p>${requirementText}</p>
                        </div>
                        <div class="badge-earned-date">
                            <h4><i class="fas fa-calendar-alt"></i> Kazanılma Tarihi</h4>
                            <p>${new Date().toLocaleDateString('tr-TR')} • ${new Date().toLocaleTimeString('tr-TR')}</p>
                        </div>
                    </div>
                    
                    <div class="badge-earned-actions">
                        <button class="btn-badge-close">
                            <i class="fas fa-check"></i> Harika!
                        </button>
                        <button class="btn-badge-share">
                            <i class="fas fa-share-alt"></i> Paylaş
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(badgeModal);
        
        // Modal efekti için kısa gecikme
        setTimeout(() => {
            badgeModal.classList.add('show');
        }, 100);
        
        // Badge aktivite kaydet
        this.createUserActivity('badge', `"${badge.name}" rozeti kazanıldı`);
        
        // Butonlara event listener ekle
        const closeButton = badgeModal.querySelector('.btn-badge-close');
        const shareButton = badgeModal.querySelector('.btn-badge-share');
        
        closeButton.addEventListener('click', () => {
            badgeModal.classList.remove('show');
            setTimeout(() => {
                badgeModal.remove();
            }, 300);
        });
        
        shareButton.addEventListener('click', () => {
            // Paylaşım fonksiyonu
            const shareText = `🏆 Bilgoo Quiz'de "${badge.name}" rozetini kazandım! #BilgooQuiz`;
            
            // Paylaşım bilgisini kopyala
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('Paylaşım metni kopyalandı!', 'toast-success');
            }).catch(err => {
                console.error('Clipboard write failed:', err);
                this.showToast('Paylaşım metni kopyalanamadı', 'toast-error');
            });
        });
        
        // Arka plana tıklayınca da kapat
        badgeModal.addEventListener('click', (e) => {
            if (e.target === badgeModal || e.target.classList.contains('badge-earned-overlay')) {
                badgeModal.classList.remove('show');
                setTimeout(() => {
                    badgeModal.remove();
                }, 300);
            }
        });
    },
    
    // Rozet gereksinimleri için açıklama metni oluştur
    getBadgeRequirementText: function(badge) {
        let text = "";
        
        switch(badge.id) {
            case 'perfectScore':
                text = "Bir kategoride %100 doğru cevap vererek mükemmel skor elde etmek.";
                break;
            case 'genius':
                text = "Arka arkaya 10 soruyu doğru cevaplamak.";
                break;
            case 'explorer':
                text = "5 farklı kategoride en az 5'er soru çözmek.";
                break;
            case 'dedicated':
                text = "Toplam 100 soru çözmek.";
                break;
            case 'speedster':
                text = "10 soruyu ortalama 5 saniyeden kısa sürede cevaplamak.";
                break;
            case 'scholar':
                text = "Tüm kategorilerde en az %70 başarı oranı elde etmek.";
                break;
            default:
                text = "Bu rozeti kazanmak için gerekli koşulları sağlamak.";
        }
        
        return text;
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
        // Mevcut bölüm numarası (0-tabanlı) - currentSection kullan
        const sectionIndex = this.currentSection - 1; // currentSection 1'den başladığı için -1
        
        console.log(`Cevap kaydediliyor: Soru: ${this.currentQuestionIndex+1}, Bölüm: ${this.currentSection}, Doğru mu: ${isCorrect}`);
        
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
        
        console.log(`Bölüm ${this.currentSection} istatistikleri güncellendi: Doğru: ${this.sectionStats[sectionIndex].correct}, Toplam: ${this.sectionStats[sectionIndex].total}`);
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
        // Can kontrolü kaldırıldı - loseLife fonksiyonu kendi başına can satın alma modalını handle ediyor
        
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
            
            // Can kontrolü kaldırıldı - loseLife fonksiyonu kendi başına can satın alma modalını handle ediyor
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
        const scoreForQuestion = Math.max(1, Math.ceil(this.timeLeft / 5));
        correctModal.innerHTML = `
            <div class="correct-modal-content">
                <div class="correct-modal-icon"><i class="fas fa-crown"></i></div>
                <div class="correct-modal-text">${this.getTranslation('correct')}</div>
                <div class="correct-modal-score">+${scoreForQuestion}</div>
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
        this.addScore(scoreForQuestion);
        
        // Cevabı kaydet - İSTATİSTİKLER İÇİN ÖNEMLİ!
        this.recordAnswer(true);
        
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
        
        // Cevabı kaydet - İSTATİSTİKLER İÇİN ÖNEMLİ!
        this.recordAnswer(false);
        
        if (this.soundEnabled) {
            const wrongSound = document.getElementById('sound-wrong');
            if (wrongSound) wrongSound.play().catch(e => {});
        }
        if (typeof onlineGame !== 'undefined' && onlineGame && onlineGame.gameStarted) {
            onlineGame.submitAnswer(false);
        }
        // Can kontrolü kaldırıldı - loseLife fonksiyonu kendi başına can satın alma modalını handle ediyor
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
            
            // Can kontrolü kaldırıldı - canlar bittiyse loseLife fonksiyonu zaten can satın alma modalını açıyor
            
            // Mevcut soru indeksi kontrolü
            if (this.currentQuestionIndex >= this.questions.length) {
                console.log("Tüm sorular tamamlandı, kategori tamamlama ekranı gösteriliyor...");
                this.showCategoryCompletion();
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
        
        // Quiz modunu deaktifleştir
        this.deactivateQuizMode();
        
        // Debug: Oyun sonu değerlerini logla
        console.log("=== OYUN SONU DEBUG ===");
        console.log("currentQuestionIndex:", this.currentQuestionIndex);
        console.log("answeredQuestions:", this.answeredQuestions);
        console.log("correctAnswers:", this.correctAnswers);
        console.log("score:", this.score);
        console.log("lives:", this.lives);
        console.log("answerTimes length:", this.answerTimes.length);
        
        // FİNAL SKORU ve istatistikleri saklayalım
        // Doğru cevap sayısını gerçek verilerden hesapla
        // Debug: Oyun sonu değerlerini kontrol et
        console.log("=== OYUN SONU DEBUG ===");
        console.log("currentQuestionIndex:", this.currentQuestionIndex);
        console.log("this.correctAnswers:", this.correctAnswers);
        console.log("questions.length:", this.questions.length);
        
        // Doğru cevap sayısını toplam soruya eşit veya daha az olacak şekilde sınırla
        const actualCorrectAnswers = Math.min(this.correctAnswers, this.currentQuestionIndex + 1);
        // Toplam soru sayısı: mevcut soru indeksi + 1 (çünkü 0'dan başlar) ama maksimum 10
        const actualTotalQuestions = Math.min(this.currentQuestionIndex + 1, 10);
        
        console.log("actualCorrectAnswers:", actualCorrectAnswers);
        console.log("actualTotalQuestions:", actualTotalQuestions);
        console.log("===================");
        
        const finalStats = {
            category: this.selectedCategory,
            score: this.score,
            correctAnswers: actualCorrectAnswers, // <-- DÜZELTİLDİ: Gerçek verilerden hesapla
            totalQuestions: actualTotalQuestions, // <-- DÜZELTİLDİ: Gerçekte cevaplanan soru sayısı
            lives: this.lives,
            avgTime: this.answerTimes.length > 0 ? 
                (this.answerTimes.reduce((a, b) => a + b, 0) / this.answerTimes.length).toFixed(1) : 0
        };
        
        console.log("finalStats:", finalStats);
        console.log("======================");
        
        // Oyun istatistiklerini kaydet
        this.saveGameStatistics();
        this.addNewHighScore(finalStats.category, finalStats.score, finalStats.totalQuestions);
        
        // İstatistikleri hemen güncelle
        setTimeout(() => {
            const updatedStats = this.calculateRealStats();
            console.log('Oyun sonu güncellenmiş istatistikler:', updatedStats);
            this.updateProfileStats(updatedStats);
        }, 200);
        
        // PUANLARI KULLANICI HESABINA KAYDET
        if (this.isLoggedIn) {
            this.totalScore += this.score;
            this.sessionScore += this.score;
            this.levelProgress += this.score;
            
            // Seviye kontrolü yap
            this.checkLevelUp();
            
            // Kullanıcı verilerini Firebase'e kaydet
            this.saveUserData();
            
            console.log(`Oyun sonu: ${this.score} puan hesaba eklendi. Toplam puan: ${this.totalScore}`);
        } else {
            // Giriş yapmamış kullanıcılar için session score'u kaydet
            this.sessionScore += this.score;
            this.saveScoreToLocalStorage();
            
            console.log(`Oyun sonu (misafir): ${this.score} puan session'a eklendi. Session toplam: ${this.sessionScore}`);
        }
        
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
        this.resetJokerUsage(); // Sadece kullanım durumlarını sıfırla, envanter korunsun
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
                const imageContainer = document.createElement('div');
                imageContainer.className = 'question-image';
                
                const img = document.createElement('img');
                img.src = question.imageUrl;
                img.alt = 'Soru görseli';
                img.style.maxWidth = '100%';
                img.style.maxHeight = '300px';
                img.style.margin = '10px auto';
                img.style.display = 'block';
                
                // Görsel yükleme hatası durumunda - soruyu değiştirme mekanizması
                img.onerror = () => {
                    console.warn(`Soru görseli yüklenemedi: ${question.imageUrl}. Sonraki soruya geçiliyor...`);
                    
                    // Toast bildirimi göster
                    this.showToast("Görsel yüklenemedi, başka bir soruya geçiliyor...", "toast-warning");
                    
                    // Görseli yüklenemeyen soruyu atla
                    if (this.questions.length > this.currentQuestionIndex + 1) {
                        // Zamanlayıcıyı durdur
                        clearInterval(this.timerInterval);
                        
                        // Sonraki soruya geç
                        setTimeout(() => {
                            this.currentQuestionIndex++;
                            this.displayQuestion(this.questions[this.currentQuestionIndex]);
                        }, 1000);
                    } else {
                        // Soru kalmadıysa sonucu göster
                        setTimeout(() => {
                            this.showResult();
                        }, 1000);
                    }
                    return;
                };
                
                // Önce tüm eski resim elementlerini kaldır
                const oldImages = this.questionElement.querySelectorAll('.question-image');
                oldImages.forEach(img => img.remove());
                
                // Yeni resmi ekle
                imageContainer.appendChild(img);
                this.questionElement.appendChild(imageContainer);
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
        
        // Can kontrolü - canlar bittiyse can satın alma teklifi göster
        if (this.lives <= 0) {
            console.log("Canlar bitti, can satın alma teklifi gösteriliyor...");
            
            // Zamanlayıcıyı durdur
            this.stopTimer();
            
            // Can satın alma modalını göster
            this.showBuyLivesModal();
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

    // Can satın alma modalını göster
    showBuyLivesModal: function() {
        const LIVES_PRICE = 500; // 3 can için 500 puan
        const LIVES_AMOUNT = 3; // Satın alınacak can sayısı
        
        // Oyuncunun puanını kontrol et
        const currentPoints = this.isLoggedIn ? this.totalScore : this.sessionScore;
        
        // Modal oluştur
        const buyLivesModal = document.createElement('div');
        buyLivesModal.className = 'buy-lives-modal';
        buyLivesModal.innerHTML = `
            <div class="buy-lives-modal-content">
                <div class="buy-lives-header">
                    <div class="lives-out-icon">
                        <i class="fas fa-heart-broken"></i>
                    </div>
                    <h2>Canlarınız Bitti!</h2>
                    <p class="lives-out-message">Oyuna devam etmek için can satın alabilirsiniz.</p>
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
                        <span>Mevcut Puanınız: ${currentPoints}</span>
                    </div>
                </div>
                
                <div class="buy-lives-actions">
                    ${currentPoints >= LIVES_PRICE ? 
                        `<button id="confirm-buy-lives" class="btn-buy-lives">
                            <i class="fas fa-shopping-cart"></i>
                            3 Can Satın Al (${LIVES_PRICE} Puan)
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
        
        // Satın alma butonuna event listener ekle
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
                // Oyun sonu ekranını göster
                setTimeout(() => {
                    this.showResult();
                }, 500);
            });
        }
        
        // Modal dışına tıklanırsa oyunu bitir
        buyLivesModal.addEventListener('click', (e) => {
            if (e.target === buyLivesModal) {
                buyLivesModal.remove();
                setTimeout(() => {
                    this.showResult();
                }, 500);
            }
        });
    },

    // Can satın alma işlemi
    buyLives: function(livesAmount, price) {
        const currentPoints = this.isLoggedIn ? this.totalScore : this.sessionScore;
        
        // Puan kontrolü
        if (currentPoints < price) {
            this.showToast('Yetersiz puan!', 'toast-error');
            return false;
        }
        
        // Puanı düş
        if (this.isLoggedIn) {
            this.totalScore -= price;
            this.delayedSaveUserData(); // Firebase'e kaydet
        } else {
            this.sessionScore -= price;
        }
        
        // Canları ekle
        this.lives = livesAmount;
        
        // Görüntüleri güncelle
        this.updateLives();
        this.updateScoreDisplay();
        this.updateTotalScoreDisplay();
        
        // Başarı mesajı göster
        this.showToast(`${livesAmount} can satın alındı! Oyun devam ediyor...`, 'toast-success');
        
        // Kısa bir gecikme ile oyunu devam ettir
        setTimeout(() => {
            // Zamanlayıcıyı yeniden başlat
            this.timeLeft = this.TIME_PER_QUESTION;
            this.startTimer();
        }, 1500);
        
        console.log(`${livesAmount} can satın alındı. Kalan puan: ${this.isLoggedIn ? this.totalScore : this.sessionScore}`);
        
        return true;
    },
    
    // Yüksek skor ekleme fonksiyonu - Firebase ve localStorage'a kaydet
    addNewHighScore: function(category, score, total) {
        try {
            // Tarih bilgisi
            const date = new Date().toLocaleDateString();
            const timestamp = new Date();
            
            // Yeni skor verisi
            const scoreData = {
                score: score,
                totalQuestions: total,
                correctAnswers: score, // Score genellikle doğru cevap sayısıdır
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
                
                // Kullanıcının kişisel skorlarını da güncelle
                const userScoreData = {
                    ...scoreData,
                    gameId: Date.now().toString() // Benzersiz oyun ID'si
                };
                
                db.collection('users').doc(this.currentUser.uid)
                    .collection('personalScores').add(userScoreData)
                    .then(() => {
                        console.log('Kullanıcının kişisel skorları güncellendi');
                    })
                    .catch((error) => {
                        console.error('Kişisel skorlar kaydedilirken hata:', error);
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
                
                // Skorları yüzdeye göre sırala (yüksekten düşüğe)
                highScores.sort((a, b) => b.percentage - a.percentage);
                
                // Maksimum 10 skor tut
                if (highScores.length > 10) {
                    highScores = highScores.slice(0, 10);
                }
                
                localStorage.setItem(highScoresKey, JSON.stringify(highScores));
            }
            
            return true;
        } catch (error) {
            console.error("Yüksek skor kaydetme hatası:", error);
            return false;
        }
    },
    
    
    // Oyun istatistiklerini kaydetme - Firebase ve localStorage'a
    saveGameStatistics: function() {
        try {
            // İstatistik verisi hazırla
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
                
                // Kullanıcının genel istatistiklerini güncelle
                const userStatsRef = db.collection('users').doc(this.currentUser.uid);
                
                userStatsRef.get().then((doc) => {
                    const userData = doc.exists ? doc.data() : {};
                    const currentStats = userData.stats || {
                        totalGames: 0,
                        totalQuestions: 0,
                        correctAnswers: 0,
                        categories: {}
                    };
                    
                    // İstatistikleri güncelle
                    currentStats.totalGames++;
                    currentStats.totalQuestions += this.questions.length;
                    currentStats.correctAnswers += this.score;
                    
                    // Kategori bazlı istatistikler
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
                    
                    // Firebase'e güncelleme kaydet
                    userStatsRef.update({ stats: currentStats })
                        .then(() => {
                            console.log('Kullanıcı istatistikleri güncellendi');
                        })
                        .catch((error) => {
                            console.error('Kullanıcı istatistikleri güncellenirken hata:', error);
                        });
                }).catch((error) => {
                    console.error('Kullanıcı istatistikleri alınırken hata:', error);
                });
            }
            
            // LOCALSTORAGE'A KAYDET (Yedek olarak)
            if (this.isLocalStorageAvailable()) {
                // Oyun geçmişine bu oyunu ekle
                const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
                const gameRecord = {
                    category: this.selectedCategory,
                    score: this.score,
                    totalQuestions: this.questions.length,
                    correctAnswers: this.score, // Bu örnekte score = correctAnswers
                    lives: this.lives,
                    averageTime: this.answerTimes.length > 0 ? 
                        (this.answerTimes.reduce((a, b) => a + b, 0) / this.answerTimes.length) : 0,
                    date: new Date().toISOString(),
                    timestamp: Date.now()
                };
                
                gameHistory.push(gameRecord);
                
                // Son 100 oyunu sakla (hafıza tasarrufu için)
                if (gameHistory.length > 100) {
                    gameHistory.splice(0, gameHistory.length - 100);
                }
                
                localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
                console.log('Oyun geçmişine eklendi:', gameRecord);
                
                // İstatistikleri yeniden hesapla ve kaydet
                const updatedStats = this.calculateRealStats();
                localStorage.setItem('userStats', JSON.stringify(updatedStats));
                localStorage.setItem('quiz-user-stats', JSON.stringify(updatedStats));
                console.log('İstatistikler güncellendi:', updatedStats);
                
                // Profil sayfası istatistiklerini hemen güncelle
                this.updateProfileStats(updatedStats);
                
                // Eski format istatistikler (uyumluluk için)
                const statsKey = 'gameStats';
                let stats = JSON.parse(localStorage.getItem(statsKey)) || {
                    totalGames: 0,
                    totalQuestions: 0,
                    correctAnswers: 0,
                    categories: {}
                };
                
                // İstatistikleri güncelle
                stats.totalGames++;
                stats.totalQuestions += this.questions.length;
                stats.correctAnswers += this.score;
                
                // Kategori bazlı istatistikler
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
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Yeni uyarı oluştur
        const alertElement = document.createElement('div');
        alertElement.className = `custom-alert ${type}`;
        alertElement.innerHTML = `<span>${message}</span>`;
        
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
            if (firebase.auth) {
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
                        
                        // Kullanıcı verilerini yükle ve Firebase'den senkronize et
                        this.loadUserData(user.uid);
                        this.syncUserStatsFromFirebase();
                        
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
                console.error("Firebase authentication bulunamadı!");
                
                // Firebase olmadan da uygulamanın çalışabilmesi için
                this.isLoggedIn = false;
                if (this.mainMenu) {
                    this.mainMenu.style.display = 'block';
                }
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
            totalStars: 0,
            createdAt: new Date(),
            lastPlayed: new Date()
        };
        
        db.collection('users').doc(userId).set(defaultUserData, { merge: true })
            .then(() => {
                console.log('Yeni kullanıcı verileri oluşturuldu');
                this.totalScore = 0;
                this.userLevel = 1;
                this.levelProgress = 0;
                this.totalStars = 0;
                this.updateTotalScoreDisplay();
            })
            .catch((error) => {
                console.error('Yeni kullanıcı verisi oluşturulurken hata:', error);
            });
    },
    
    // Kullanıcı verilerini kaydet
    saveUserData: function() {
        console.log('=== saveUserData çağrıldı ===');
        console.log('Giriş durumu:', this.isLoggedIn);
        console.log('Mevcut kullanıcı:', this.currentUser ? this.currentUser.uid : 'null');
        console.log('Firebase.firestore var mı:', firebase && firebase.firestore ? 'VAR' : 'YOK');
        
        if (!this.isLoggedIn || !this.currentUser || !firebase.firestore) {
            console.warn('Firebase kayıt atlanıyor - localStorage\'a kaydediliyor');
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
            totalStars: this.totalStars,
            lastPlayed: new Date()
        };
        
        console.log('Firebase\'e kaydedilecek veriler:', updateData);
        console.log('Kullanıcı ID:', userId);
        
        // Firebase isteklerini sinirla - son kaydetme ile arasinda en az 3 saniye olmali
        const now = Date.now();
        if (this.lastFirebaseSave && (now - this.lastFirebaseSave) < 3000) {
            console.log('Firebase kayıt çok sık - localStorage\'a kaydediliyor');
            this.saveScoreToLocalStorage();
            return;
        }
        
        this.lastFirebaseSave = now;
        
        console.log('Firebase\'e kayıt başlatılıyor...');
        
        db.collection('users').doc(userId).update(updateData)
            .then(() => {
                console.log('✅ Firebase\'e başarıyla kaydedildi!');
                // Aynı zamanda localStorage'a da kaydet (backup olarak)
                this.saveScoreToLocalStorage();
            })
            .catch((error) => {
                console.error('❌ Firebase kayıt hatası:', error.code, error.message);
                
                // Hata loglarını azalt - sadece önemli hataları logla
                if (error.code === 'not-found' || (error.message && error.message.includes('No document to update'))) {
                    console.log('Kullanıcı dokümanı yok - yeni oluşturuluyor...');
                    db.collection('users').doc(userId).set(updateData, { merge: true })
                        .then(() => {
                            console.log('✅ Yeni kullanıcı dokümanı oluşturuldu!');
                            this.saveScoreToLocalStorage();
                        })
                        .catch((err) => {
                            console.error('❌ Yeni dokuman oluşturma hatası:', err.code, err.message);
                            this.saveScoreToLocalStorage();
                        });
                } else {
                    console.error('❌ Diğer Firebase hatası:', error.code, error.message);
                    // Firebase hatası durumunda localStorage'a kaydet
                    this.saveScoreToLocalStorage();
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
                totalStars: this.totalStars,
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
                
                // Sadece giriş yapmamış kullanıcılar için localStorage'dan yükle
                if (!this.isLoggedIn) {
                    this.totalScore = parsedData.totalScore || 0;
                    this.userLevel = parsedData.userLevel || 1;
                    this.levelProgress = parsedData.levelProgress || 0;
                    this.sessionScore = parsedData.sessionScore || 0;
                    
                    console.log('Skor localStorage\'dan yüklendi:', parsedData);
                }
            }
            
            // Toplam yıldız sayısını yükle
            const storedTotalStars = localStorage.getItem('quizTotalStars');
            if (storedTotalStars) {
                this.totalStars = parseInt(storedTotalStars);
                console.log('Toplam yıldız sayısı yüklendi:', this.totalStars);
            }
            
            this.updateTotalScoreDisplay();
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
        
        // Firebase bağlantı durumunu kontrol et
        console.log('Firebase Durum Kontrolü:', {
            isLoggedIn: this.isLoggedIn,
            currentUser: this.currentUser ? this.currentUser.uid : 'null',
            firebaseExists: typeof firebase !== 'undefined',
            firestoreExists: firebase && firebase.firestore ? true : false
        });
        
        // Giriş yapılmışsa toplam puana ekle
        if (this.isLoggedIn) {
            this.totalScore += points;
            this.levelProgress += points;
            
            // Seviye kontrolü yap
            this.checkLevelUp();
            
            // Firebase kaydetmeyi geciktir (çok sık kayıt önleme)
            this.delayedSaveUserData();
            
            console.log(`Firebase'e kayıt için bekleniyor: +${points} puan`);
        } else {
            console.warn('Kullanıcı giriş yapmamış - sadece localStorage\'a kaydediliyor');
        }
        
        // Görüntüleri güncelle
        this.updateScoreDisplay();
        this.updateTotalScoreDisplay();
        
        console.log(`Puan eklendi: +${points} (Oyun: ${previousScore} → ${this.score}, Toplam: ${previousTotalScore} → ${this.totalScore})`);
    },
    
    // Geciktirilmiş kullanıcı verisi kaydetme (aşırı sık istekleri önlemek için)
    delayedSaveUserData: function() {
        // Önceki timeout'u temizle
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        
        // 2 saniye sonra kaydet (sürekli istek yerine toplu kaydetme)
        this.saveTimeout = setTimeout(() => {
            this.saveUserData();
            this.saveTimeout = null;
        }, 2000);
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

    
    // Sayıları kısaltma fonksiyonu
    formatNumber: function(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toString();
    },

    // Tooltip oluşturma fonksiyonu
    createTooltip: function(element, text) {
        element.setAttribute('title', text);
        element.style.cursor = 'pointer';
        
        // Mobil cihazlar için touch event
        element.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const existingTooltip = document.querySelector('.custom-tooltip');
            if (existingTooltip) {
                existingTooltip.remove();
            }
            
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = text;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                pointer-events: none;
                white-space: nowrap;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
            
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.remove();
                }
            }, 2000);
        });
    },

    // Toplam puan göstergesini güncelle
    updateTotalScoreDisplay: function() {
        // Yeni sadeleştirilmiş puan gösterimi
        const totalScoreElement = document.getElementById('total-score-value');
        if (totalScoreElement) {
            const scoreValue = this.isLoggedIn ? this.totalScore : this.sessionScore;
            const formattedScore = this.formatNumber(scoreValue);
            const formattedStars = this.formatNumber(this.totalStars);
            
            totalScoreElement.innerHTML = `
                <span class="coin-display" data-full-value="${scoreValue}">
                    ${formattedScore}
                </span>
                <span class="star-display" data-full-value="${this.totalStars}">
                    <span class="star-icon">⭐</span> ${formattedStars}
                </span>
            `;
            
            // Tooltip'leri ekle
            const coinDisplay = totalScoreElement.querySelector('.coin-display');
            const starDisplay = totalScoreElement.querySelector('.star-display');
            
            if (coinDisplay) {
                this.createTooltip(coinDisplay, `Coin: ${scoreValue.toLocaleString()}`);
            }
            if (starDisplay) {
                this.createTooltip(starDisplay, `Yıldız: ${this.totalStars.toLocaleString()}`);
            }
        }
        
        // Profil sayfasındaki puan gösterimini güncelle
        const profileTotalScore = document.getElementById('profile-total-score');
        if (profileTotalScore) {
            profileTotalScore.textContent = this.totalScore || 0;
        }
        
        // Profil sayfasındaki seviye gösterimini güncelle
        const profileUserLevel = document.getElementById('profile-user-level');
        if (profileUserLevel) {
            const level = Math.floor((this.totalScore || 0) / 500) + 1;
            profileUserLevel.textContent = level;
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
    },
    
    // Firebase'den en yüksek skorları çek
    loadFirebaseHighScores: function(category = null, limit = 10) {
        if (!firebase.firestore) {
            console.warn('Firebase Firestore kullanılamıyor');
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
                        // Tarih formatını düzelt
                        date: data.timestamp ? data.timestamp.toDate().toLocaleDateString() : data.date
                    });
                });
                
                console.log(`Firebase'den ${highScores.length} yüksek skor çekildi`);
                return highScores;
            })
            .catch((error) => {
                console.error('Firebase\'den yüksek skorlar çekilirken hata:', error);
                return [];
            });
    },
    
    // Kullanıcının kişisel en yüksek skorlarını çek
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
                
                console.log(`Kullanıcının ${personalScores.length} kişisel skoru çekildi`);
                return personalScores;
            })
            .catch((error) => {
                console.error('Kişisel skorlar çekilirken hata:', error);
                return [];
            });
    },
    
    // Firebase'den kullanıcı istatistiklerini çek ve senkronize et
    syncUserStatsFromFirebase: function() {
        if (!this.isLoggedIn || !firebase.firestore) {
            console.warn('syncUserStatsFromFirebase atlandı - kullanıcı giriş yapmamış veya Firebase yok');
            return Promise.resolve();
        }
        
        const db = firebase.firestore();
        const userId = this.currentUser.uid;
        
        console.log('Firebase\'den kullanıcı verileri çekiliyor:', userId);
        
        return db.collection('users').doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    console.log('Firebase\'den çekilen veri:', userData);
                    
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
                    if (userData.totalStars !== undefined) {
                        this.totalStars = userData.totalStars;
                        // localStorage'a da kaydet
                        localStorage.setItem('quizTotalStars', this.totalStars);
                    }
                    
                    // Görüntüyü güncelle
                    this.updateTotalScoreDisplay();
                    
                    console.log('Firebase\'den kullanıcı verileri senkronize edildi:', {
                        totalScore: this.totalScore,
                        userLevel: this.userLevel,
                        levelProgress: this.levelProgress
                    });
                } else {
                    console.log('Kullanıcı dokümanı bulunamadı - yeni oluşturuluyor');
                    // Kullanıcı verisi yoksa yeni oluştur
                    this.initializeNewUser(userId);
                }
            })
            .catch((error) => {
                console.error('Firebase\'den veri senkronizasyonu hatası:', error);
            });
    },
    
    // Firebase bağlantı durumunu kontrol et (debug amaçlı)
    checkFirebaseConnection: function() {
        console.log('=== Firebase Bağlantı Kontrolü ===');
        console.log('1. Firebase nesnesi var mı:', typeof firebase !== 'undefined');
        console.log('2. Firebase.auth var mı:', firebase && firebase.auth ? 'VAR' : 'YOK');
        console.log('3. Firebase.firestore var mı:', firebase && firebase.firestore ? 'VAR' : 'YOK');
        console.log('4. Kullanıcı giriş yapmış mı:', this.isLoggedIn);
        console.log('5. Mevcut kullanıcı:', this.currentUser ? this.currentUser.uid : 'YOK');
        
        if (firebase && firebase.auth) {
            const currentUser = firebase.auth().currentUser;
            console.log('6. Firebase.auth().currentUser:', currentUser ? currentUser.uid : 'YOK');
        }
        
        // Test kayıt yapma
        if (this.isLoggedIn && this.currentUser && firebase.firestore) {
            console.log('7. Test kayıt yapılıyor...');
            const db = firebase.firestore();
            const testData = {
                test: true,
                timestamp: new Date(),
                message: 'Bu bir test kaydıdır'
            };
            
            db.collection('users').doc(this.currentUser.uid).set(testData, { merge: true })
                .then(() => {
                    console.log('✅ Test kayıt başarılı!');
                })
                .catch((error) => {
                    console.error('❌ Test kayıt başarısız:', error);
                });
        } else {
            console.log('7. Test kayıt atlandı - gerekli şartlar sağlanmadı');
        }
    }
};

// Bu modülü başlat
quizApp.init(); 

// QuizApp modülünü global olarak erişilebilir yap
window.quizApp = quizApp;

// Debug fonksiyonlarını global erişim için ekle
window.debugFirebase = function() {
    return quizApp.checkFirebaseConnection();
};

window.testFirebaseSave = function() {
    console.log('Manuel Firebase kayıt testi başlatılıyor...');
    quizApp.addScore(10); // 10 puan ekle ve Firebase'e kaydet
};

window.showUserData = function() {
    console.log('=== Kullanıcı Veri Durumu ===');
    console.log('Giriş durumu:', quizApp.isLoggedIn);
    console.log('Toplam puan:', quizApp.totalScore);
    console.log('Seviye:', quizApp.userLevel);
    console.log('Mevcut kullanıcı:', quizApp.currentUser ? quizApp.currentUser.uid : 'YOK');
};

// Profil için debug fonksiyonları
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
        console.log('✅ Tüm profil verileri temizlendi!');
    },
    getUserStats: () => {
        const stats = quizApp.calculateRealStats();
        console.log('📊 Kullanıcı İstatistikleri:', stats);
        return stats;
    },
    getBadges: () => {
        const userId = quizApp.getCurrentUserId();
        const badges = quizApp.badgeSystem.getUserBadges(userId);
        console.log('🏆 Kullanıcı Rozetleri:', badges);
        return badges;
    },
    testEditProfile: () => {
        // Profil düzenleme modalını test et
        console.log('🔧 Profil düzenleme modalı açılıyor...');
        quizApp.showEditProfileModal();
    },
    testProfileData: () => {
        const userId = quizApp.getCurrentUserId();
        const profileData = {
            displayName: 'Test Kullanıcısı',
            bio: 'Bu bir test biyografisidir.',
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(`user-profile-${userId}`, JSON.stringify(profileData));
        console.log('✅ Test profil verileri oluşturuldu:', profileData);
        
        // Profil sayfasını yenile
        if (document.getElementById('profile-container')) {
            quizApp.loadProfileData();
        }
    },
    checkProfileData: () => {
        const userId = quizApp.getCurrentUserId();
        const profileData = localStorage.getItem(`user-profile-${userId}`);
        console.log('📋 Mevcut profil verileri:', profileData ? JSON.parse(profileData) : 'Veri yok');
        return profileData ? JSON.parse(profileData) : null;
    }
};

 