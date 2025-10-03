/**
 * PRODUCTION MONETIZATION SYSTEM
    _PROD_AD_UNITS: {
        android: {
            banner: 'ca-app-pub-7610338885240453/6081192537',
            interstitial: 'ca-app-pub-7610338885240453/2112105479',
            rewarded: 'ca-app-pub-7610338885240453/6595381556' // Production ID
        },
        ios: {
            banner: 'ca-app-pub-7610338885240453/6497080109',
            interstitial: 'ca-app-pub-7610338885240453/2112105479',
            rewarded: 'ca-app-pub-7610338885240453/7161809021' // Production ID
        }
    },nimal, AdMob policy compliant
 * Version: 2.0.0 Production
 * Risk Level: 0%
 */

// AdMob Plugin - Production Only
let AdMob = null;
try {
    if (window.Capacitor?.Plugins?.AdMob) {
        AdMob = window.Capacitor.Plugins.AdMob;
    }
} catch (e) {
    // Silent fail - no debug logs in production
}

const MonetizationManager = {
    // State Management
    isInitialized: false,
    cookiePreferences: {
        essential: true,
        analytics: false,
        advertising: false
    },
    // Ad Unit Maps (Test & Production)
    _TEST_AD_UNITS: {
        android: {
            banner: 'ca-app-pub-3940256099942544/6300978111',
            interstitial: 'ca-app-pub-3940256099942544/1033173712',
            rewarded: 'ca-app-pub-3940256099942544/5224354917'
        },
        ios: {
            banner: 'ca-app-pub-3940256099942544/2934735716',
            interstitial: 'ca-app-pub-3940256099942544/4411468910',
            rewarded: 'ca-app-pub-3940256099942544/1712485313'
        }
    },
    _PROD_AD_UNITS: {
        android: {
            banner: 'ca-app-pub-7610338885240453/6081192537',
            interstitial: 'ca-app-pub-7610338885240453/2112105479',
            rewarded: 'ca-app-pub-7610338885240453/6595381556' // Production ID
        },
        ios: {
            banner: 'ca-app-pub-7610338885240453/6497080109',
            interstitial: 'ca-app-pub-7610338885240453/2112105479',
            rewarded: 'ca-app-pub-7610338885240453/7161809021' // Production ID
        }
    },
    _admobReady: false,
    
    // Top padding management
    defaultTopOffset: 60, // Base offset: 60px (+20px extra to avoid overlap)

    // === INITIALIZATION ===
    init: function() {
        if (this.isInitialized) return;
        
        // Platform tespiti
        const platform = window.Capacitor ? window.Capacitor.getPlatform() : 'web';
        const isNativeApp = platform === 'ios' || platform === 'android';
        
        if (isNativeApp) {
            // Native uygulamalar: Çerez bildirimi yok, direkt ATT + reklam
            console.log('[Monetization Debug] Native app detected, enabling ads directly');
            this.cookiePreferences.advertising = true; // Native'de reklam izni varsayılan
            this.setupEventListeners();
            this.ensureEarlyATTOnIOS();
            this.setupAdMobListeners();
            this.initPlatformAds();
        } else {
            // Web: GDPR için çerez bildirimi gerekli
            console.log('[Monetization Debug] Web platform detected, checking cookie consent');
            this.checkCookieConsent();
            this.setupEventListeners();
            this.setupAdMobListeners();
            this.initPlatformAds();
        }
        
        this.isInitialized = true;
    },

    // === EARLY ATT REQUEST (iOS) ===
    ensureEarlyATTOnIOS: function() {
        try {
            const isIOS = !!(window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() === 'ios');
            console.log('[Monetization Debug] ATT check:', {
                hasCapacitor: !!window.Capacitor,
                platform: window.Capacitor?.getPlatform?.() || 'unknown',
                isIOS: isIOS,
                hasATTManager: !!window.ATTManager
            });
            
            if (!isIOS) {
                console.log('[Monetization Debug] Not iOS platform, skipping ATT');
                return;
            }
            
            if (!window.ATTManager) {
                console.log('[Monetization Debug] ATTManager not available, will try later');
                // ATTManager henüz yüklenmemiş olabilir, biraz bekleyip tekrar dene
                setTimeout(() => {
                    if (window.ATTManager) {
                        console.log('[Monetization Debug] ATTManager now available, retrying...');
                        this.ensureEarlyATTOnIOS();
                    } else {
                        console.error('[Monetization Debug] ATTManager still not available after delay');
                    }
                }, 1000);
                return;
            }
            
            const alreadyAsked = localStorage.getItem('attAskedOnce');
            console.log('[Monetization Debug] ATT already asked once:', alreadyAsked);
            
            if (alreadyAsked === 'true') {
                console.log('[Monetization Debug] ATT already requested once, skipping');
                return;
            }

            console.log('[Monetization Debug] Starting ATT request process...');
            
            // Uygulama aktif olduğundan emin olmak için küçük bir gecikme
            setTimeout(() => {
                console.log('[Monetization Debug] Timeout triggered, requesting ATT...');
                // ATT durumunu başlat ve gerekirse izni iste
                window.ATTManager.init()
                    .then(() => {
                        console.log('[Monetization Debug] ATTManager.init() completed');
                        return window.ATTManager.requestPermissionIfNeeded();
                    })
                    .then((result) => {
                        console.log('[Monetization Debug] requestPermissionIfNeeded result:', result);
                    })
                    .catch((error) => {
                        console.error('[Monetization Debug] Error in ATT process:', error);
                    })
                    .finally(() => {
                        try { 
                            localStorage.setItem('attAskedOnce', 'true');
                            console.log('[Monetization Debug] Marked ATT as asked');
                        } catch(_) { 
                            console.warn('[Monetization Debug] Could not set localStorage flag');
                        }
                    });
            }, 800);
        } catch (error) {
            console.error('[Monetization Debug] Exception in ensureEarlyATTOnIOS:', error);
        }
    },

    // === TOP PADDING MANAGEMENT ===
    applyTopPadding: function(extraHeight = 0) {
        const totalPadding = this.defaultTopOffset + extraHeight;
        // Apply to body to push all content below the native banner
        document.body.style.paddingTop = totalPadding + 'px';
        // Also expose as CSS variable for any layout that prefers CSS-driven spacing
        try {
            document.documentElement.style.setProperty('--top-banner-offset', totalPadding + 'px');
        } catch (_) { /* no-op */ }
        console.log(`Applied top padding: ${totalPadding}px (base: ${this.defaultTopOffset}px + banner: ${extraHeight}px)`);
    },

    // === ADMOB EVENT LISTENERS ===
    setupAdMobListeners: function() {
        if (!AdMob) return;

        // Listen for banner load events (correct event name)
        AdMob.addListener('bannerAdLoaded', (info) => {
            console.log('Banner ad loaded:', info);
            const bannerHeight = info?.height || 0;
            this.applyTopPadding(bannerHeight);
            document.body.classList.add('has-top-banner');
        });

        // Listen for banner size changes (correct event name)
        AdMob.addListener('bannerAdSizeChanged', (info) => {
            console.log('Banner ad size changed:', info);
            const bannerHeight = info?.height || 0;
            this.applyTopPadding(bannerHeight);
            document.body.classList.add('has-top-banner');
        });

        // Listen for banner failures (correct event name)
        AdMob.addListener('bannerAdFailedToLoad', (error) => {
            console.log('Banner ad failed to load:', error);
            // Apply default padding when banner fails
            this.applyTopPadding(0);
            document.body.classList.remove('has-top-banner');
        });
    },

    // === COOKIE CONSENT MANAGEMENT ===
    checkCookieConsent: function() {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            this.showCookieBanner();
        } else {
            this.cookiePreferences = JSON.parse(consent);
            this.loadTracking();
        }
    },

    showCookieBanner: function() {
        const banner = document.getElementById('cookie-consent');
        if (banner) banner.style.display = 'block';
    },

    hideCookieBanner: function() {
        const banner = document.getElementById('cookie-consent');
        if (banner) banner.style.display = 'none';
    },

    setupEventListeners: function() {
        document.getElementById('accept-all')?.addEventListener('click', () => {
            this.acceptAllCookies();
        });

        document.getElementById('accept-essential')?.addEventListener('click', () => {
            this.acceptEssentialOnly();
        });
    },

    acceptAllCookies: function() {
        this.cookiePreferences = {
            essential: true,
            analytics: true,
            advertising: true
        };
        this.saveCookiePreferences();
        this.hideCookieBanner();
        this.loadTracking();
        
        // AdSense'i yükle
        if (window.loadAdSense) {
            window.loadAdSense();
        }

        // Kullanıcı reklam iznini verdiğinde platform reklamlarını hemen başlat
        // (iOS'ta ATT isteği bu noktada tetiklenecek)
        try {
            this.initPlatformAds();
        } catch (e) {
            // production: sessiz geç
        }
    },

    acceptEssentialOnly: function() {
        this.cookiePreferences = {
            essential: true,
            analytics: false,
            advertising: false
        };
        this.saveCookiePreferences();
        this.hideCookieBanner();
    },

    saveCookiePreferences: function() {
        localStorage.setItem('cookieConsent', JSON.stringify(this.cookiePreferences));
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
    },

    // === TRACKING SERVICES ===
    loadTracking: function() {
        if (this.cookiePreferences.analytics) {
            // Firebase Analytics'i yükle ve aktifleştir
            if (window.loadFirebaseAnalytics) {
                window.loadFirebaseAnalytics();
            }
            if (window.enableFirebaseAnalytics) {
                window.enableFirebaseAnalytics();
            }
            
            // Google Analytics (eğer varsa)
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', { 'analytics_storage': 'granted' });
            }
        }
        
        if (this.cookiePreferences.advertising) {
            this.initAds();
        }
    },

    // === PLATFORM DETECTION & ADS ===
    initPlatformAds: function() {
        const platform = window.Capacitor ? window.Capacitor.getPlatform() : null; // 'ios' | 'android' | 'web'
        const isNativeApp = platform === 'ios' || platform === 'android';
        const isMobileWeb = !isNativeApp && (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

        // iOS path previously skipped -> caused ATT uyarısı. Now both iOS & Android handled here.
        if (isNativeApp) {
            this.initAdMob();
        } else if (isMobileWeb) {
            this.initMobileWebAds();
        }
    },

    // === ADMOB (ANDROID/iOS) ===
    initAdMob: function() {
        if (!AdMob) return;

        // iOS App Tracking Transparency kontrolü
        const isIOS = window.Capacitor && window.Capacitor.getPlatform() === 'ios';
        
        if (isIOS) {
            // iOS'ta ATT framework kullan - yeni ATTManager ile
            console.log('iOS detected, initializing ATT...');
            
            // ATT Manager'ı başlat
            if (window.ATTManager) {
                window.ATTManager.init().then(() => {
                    // ATT hazır, izin iste
                    return window.ATTManager.requestPermissionIfNeeded();
                }).then((attStatus) => {
                    console.log('ATT Permission process completed:', attStatus);
                    this.initializeAdMobWithATT(attStatus);
                }).catch((error) => {
                    console.error('ATT process failed:', error);
                    // ATT başarısız olsa bile temel işlevsellik için AdMob'u başlat
                    this.initializeAdMobWithoutTracking();
                });
            } else {
                console.error('ATT Manager not available');
                // Fallback to legacy method
                this.requestATTPermission().then((attStatus) => {
                    console.log('Legacy ATT Status:', attStatus);
                    this.initializeAdMobWithATT(attStatus);
                }).catch((error) => {
                    console.error('Legacy ATT Permission error:', error);
                    this.initializeAdMobWithoutTracking();
                });
            }
        } else {
            // Android veya web için normal initialization
            this.initializeAdMobNormal();
        }
    },

    requestATTPermission: function() {
        return new Promise((resolve, reject) => {
            // Correct plugin reference for capacitor-plugin-app-tracking-transparency
            if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.AppTrackingTransparency) {
                const { AppTrackingTransparency } = window.Capacitor.Plugins;
                
                console.log('ATT Plugin found, requesting permission...');
                
                // Önce tracking authorization status'u kontrol et
                AppTrackingTransparency.getTrackingAuthorizationStatus().then((result) => {
                    console.log('Current ATT status:', result);
                    
                    if (result.status === 'authorized') {
                        resolve('authorized');
                    } else if (result.status === 'notDetermined') {
                        // Kullanıcıdan izin iste - bu noktada popup gösterilmeli
                        console.log('Requesting ATT authorization...');
                        AppTrackingTransparency.requestTrackingAuthorization().then((result) => {
                            console.log('ATT authorization result:', result);
                            resolve(result.status);
                        }).catch((error) => {
                            console.error('ATT authorization request failed:', error);
                            reject(error);
                        });
                    } else {
                        // denied, restricted, notDetermined
                        resolve(result.status);
                    }
                }).catch((error) => {
                    console.error('ATT status check failed:', error);
                    reject(error);
                });
            } else {
                console.log('ATT plugin not available, platform:', window.Capacitor?.getPlatform());
                // ATT plugin mevcut değil, web/android
                resolve('notRequired');
            }
        });
    },

    initializeAdMobWithATT: function(attStatus) {
        const trackingEnabled = (attStatus === 'authorized');
        
        const initOptions = {
            requestTrackingAuthorization: false, // Zaten yukarıda yaptık
            testingDevices: [],
            initializeForTesting: false, // PRODUCTION MODE
            tagForChildDirectedTreatment: false,
            tagForUnderAgeOfConsent: false,
            maxAdContentRating: 'MA',
            // ATT status'a göre tracking ayarları
            npa: trackingEnabled ? '0' : '1' // Non-personalized ads if no tracking
        };

        AdMob.initialize(initOptions).then(() => {
            console.log('AdMob initialized with ATT status:', attStatus);
            this._admobReady = true;
            try { 
                document.dispatchEvent(new Event('admob-ready')); 
                console.log('[Monetization Debug] ✅ admob-ready event dispatched (ATT)');
            } catch(_) {}
            setTimeout(() => this.showBanner(), 1500);
            // Interstitial ads disabled for better UX
            this.isInterstitialReady = false;
        }).catch((error) => {
            console.error('AdMob initialization failed:', error);
            // Apply default padding if AdMob fails
            this.applyTopPadding(0);
        });
    },

    initializeAdMobWithoutTracking: function() {
        const initOptions = {
            requestTrackingAuthorization: false,
            testingDevices: [],
            initializeForTesting: false, // PRODUCTION MODE
            tagForChildDirectedTreatment: false,
            tagForUnderAgeOfConsent: false,
            maxAdContentRating: 'MA',
            npa: '1' // Non-personalized ads only
        };

        AdMob.initialize(initOptions).then(() => {
            console.log('AdMob initialized without tracking');
            this._admobReady = true;
            try { 
                document.dispatchEvent(new Event('admob-ready')); 
                console.log('[Monetization Debug] ✅ admob-ready event dispatched (no tracking)');
            } catch(_) {}
            setTimeout(() => this.showBanner(), 1500);
            // Interstitial ads disabled for better UX
            this.isInterstitialReady = false;
        }).catch((error) => {
            console.error('AdMob initialization failed:', error);
            // Apply default padding if AdMob fails
            this.applyTopPadding(0);
        });
    },

    initializeAdMobNormal: function() {
        const initOptions = {
            requestTrackingAuthorization: false,
            testingDevices: [],
            initializeForTesting: false, // PRODUCTION MODE
            tagForChildDirectedTreatment: false,
            tagForUnderAgeOfConsent: false,
            maxAdContentRating: 'MA'
        };

        AdMob.initialize(initOptions).then(() => {
            console.log('AdMob initialized normally');
            this._admobReady = true;
            try { 
                document.dispatchEvent(new Event('admob-ready')); 
                console.log('[Monetization Debug] ✅ admob-ready event dispatched (normal)');
            } catch(_) {}
            setTimeout(() => this.showBanner(), 1500);
            // Interstitial ads disabled for better UX
            this.isInterstitialReady = false;
        }).catch((error) => {
            console.error('AdMob initialization failed:', error);
            // Apply default padding if AdMob fails
            this.applyTopPadding(0);
        });
    },

    showBanner: function() {
        if (!AdMob) return;
        const platform = window.Capacitor ? window.Capacitor.getPlatform() : 'web';
        const isNative = platform === 'ios' || platform === 'android';
        const units = this.getActiveTestUnits();
        const bannerId = isNative ? units.banner : 'ca-app-pub-3940256099942544/6300978111';
        const options = {
            adId: bannerId,
            adSize: 'ADAPTIVE_BANNER',
            position: 'TOP_CENTER',
            margin: 0,
            isTesting: this.isTestMode()
        };

        AdMob.showBanner(options).then(() => {
            // Initial fallback: apply 40px base padding
            setTimeout(() => {
                this.applyTopPadding(0); // Base 40px will be applied
                // Mark that a top banner is visible for container spacing
                document.body.classList.add('has-top-banner');
            }, 500);
        }).catch((error) => {
            console.error('Banner reklam gösterilemedi:', error);
            // Apply default padding when banner fails
            this.applyTopPadding(0);
            // Retry after 5 seconds
            setTimeout(() => this.showBanner(), 5000);
        });
    },

    hideBanner: function() {
        if (!AdMob) return;
        AdMob.hideBanner().then(() => {
            // Reset to default padding when banner is hidden
            this.applyTopPadding(0);
            document.body.classList.remove('has-top-banner');
        }).catch(() => {
            // Apply default padding even if hide fails
            this.applyTopPadding(0);
            document.body.classList.remove('has-top-banner');
        });
    },

    prepareInterstitial: function() {
        // Interstitial ads disabled for better user experience
        return;
    },

    showInterstitial: function() {
        // Interstitial ads disabled for better user experience
        return;
    },

    // === MOBILE WEB ADS ===
    initMobileWebAds: function() {
        // Web'de çerez izni kontrolü
        if (!this.cookiePreferences.advertising) return;
        
        // Only create top banner for mobile web
        setTimeout(() => this.createMobileTopBanner(), 1000);
    },

    createMobileTopBanner: function() {
    // Reklam alanı devre dışı bırakıldı. Artık hiçbir şey eklenmiyor.
    return;
    },

    hideMobileBanner: function() {
        const banner = document.querySelector('.mobile-top-banner');
        if (banner) {
            banner.style.display = 'none';
            const container = document.querySelector('.container');
            if (container) container.style.paddingTop = '40px'; // Updated to use 40px default
            localStorage.setItem('hideMobileTopBanner', 'true');
        }
    },

    // === ADSENSE (WEB) ===
    initAds: function() {
        // Web'de çerez izni kontrolü
        if (!this.cookiePreferences.advertising) return;
        
        // Simple AdSense initialization
        setTimeout(() => this.loadAdElements(), 2000);
    },

    loadAdElements: function() {
        if (typeof adsbygoogle === 'undefined') return;
        
        const adElements = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status="done"])');
        
        adElements.forEach((ad, index) => {
        setTimeout(() => {
            try {
                    (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                    // Silent fail
                }
            }, index * 1000);
        });
    },

    // === ANALYTICS ===
    trackEvent: function(eventName, parameters = {}) {
        if (this.cookiePreferences.analytics && typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
    },

    // === GAME INTEGRATION ===
    onQuizComplete: function() {
        this.trackEvent('quiz_complete');
        
        // Quiz completion tracking (interstitial ads disabled for better UX)
        const completions = parseInt(localStorage.getItem('quizCompletions') || '0') + 1;
        localStorage.setItem('quizCompletions', completions.toString());
    },

    // Additional utility for manual interstitial trigger
    showInterstitialIfReady: function() {
        // Interstitial ads disabled for better user experience
        return false;
    },

    // === MOBILE BANNER PREFERENCES ===
    checkMobileBannerPreferences: function() {
        if (localStorage.getItem('hideMobileTopBanner') === 'true') {
            const banner = document.querySelector('.mobile-top-banner');
            if (banner) {
                banner.style.display = 'none';
                const container = document.querySelector('.container');
                if (container) container.style.paddingTop = '40px'; // Updated to use 40px default
            }
        }
    }
};

// === TEST / PROD HELPERS ===
MonetizationManager.isTestMode = function() {
    // Explicit override (developer toggle)
    const forced = localStorage.getItem('admobTestMode');
    if (forced === 'true') return true;
    if (forced === 'false') return false;

    const qp = /[?&]testads=1/.test(location.search);
    if (qp) return true; // explicit query param

    // Native (Capacitor) ortamında hostname genelde 'localhost' gelir; PROD'da test moduna düşmemeli
    const isNative = !!(window.Capacitor && (['ios','android'].includes(window.Capacitor.getPlatform?.() || '')));
    if (isNative) return false; // sadece explicit override / query ile açılabilir

    // Web geliştirme ortamı
    const host = location.hostname;
    return host === 'localhost' || host === '127.0.0.1';
};

// Yeni net isimli yardımcı
MonetizationManager.getActiveAdUnits = function() {
    const platform = window.Capacitor ? window.Capacitor.getPlatform() : 'web';
    const isNative = platform === 'ios' || platform === 'android';
    const map = this.isTestMode() ? this._TEST_AD_UNITS : this._PROD_AD_UNITS;
    return isNative ? (map[platform] || this._PROD_AD_UNITS.android) : this._TEST_AD_UNITS.android;
};

// Geriye dönük uyumluluk (eski çağrılar)
MonetizationManager.getActiveTestUnits = function() { return this.getActiveAdUnits(); };

MonetizationManager.isAdMobReady = function() { return !!this._admobReady; };

// Backward compatibility alias (script.js initialize() çağırabiliyor)
MonetizationManager.initialize = function() { return this.init(); };

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    MonetizationManager.init();
    MonetizationManager.checkMobileBannerPreferences();
});

// Global access for essential functions only
window.MonetizationManager = MonetizationManager;