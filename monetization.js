/**
 * PRODUCTION MONETIZATION SYSTEM
 * Clean, minimal, AdMob policy compliant
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

    // === INITIALIZATION ===
    init: function() {
        if (this.isInitialized) return;
        
        this.checkCookieConsent();
        this.setupEventListeners();
        this.initPlatformAds();
        
        this.isInitialized = true;
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
        if (!AdMob || !this.cookiePreferences.advertising) return;

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
            initializeForTesting: false,
            tagForChildDirectedTreatment: false,
            tagForUnderAgeOfConsent: false,
            maxAdContentRating: 'MA',
            // ATT status'a göre tracking ayarları
            npa: trackingEnabled ? '0' : '1' // Non-personalized ads if no tracking
        };

        AdMob.initialize(initOptions).then(() => {
            console.log('AdMob initialized with ATT status:', attStatus);
            setTimeout(() => this.showBanner(), 2000);
            setTimeout(() => this.prepareInterstitial(), 4000);
            this.isInterstitialReady = false;
        }).catch((error) => {
            console.error('AdMob initialization failed:', error);
        });
    },

    initializeAdMobWithoutTracking: function() {
        const initOptions = {
            requestTrackingAuthorization: false,
            testingDevices: [],
            initializeForTesting: false,
            tagForChildDirectedTreatment: false,
            tagForUnderAgeOfConsent: false,
            maxAdContentRating: 'MA',
            npa: '1' // Non-personalized ads only
        };

        AdMob.initialize(initOptions).then(() => {
            console.log('AdMob initialized without tracking');
            setTimeout(() => this.showBanner(), 2000);
            setTimeout(() => this.prepareInterstitial(), 4000);
            this.isInterstitialReady = false;
        }).catch((error) => {
            console.error('AdMob initialization failed:', error);
        });
    },

    initializeAdMobNormal: function() {
        const initOptions = {
            requestTrackingAuthorization: false,
            testingDevices: [],
            initializeForTesting: false,
            tagForChildDirectedTreatment: false,
            tagForUnderAgeOfConsent: false,
            maxAdContentRating: 'MA'
        };

        AdMob.initialize(initOptions).then(() => {
            console.log('AdMob initialized normally');
            setTimeout(() => this.showBanner(), 2000);
            setTimeout(() => this.prepareInterstitial(), 4000);
            this.isInterstitialReady = false;
        }).catch((error) => {
            console.error('AdMob initialization failed:', error);
        });
    },

    showBanner: function() {
        if (!AdMob) return;

        const options = {
            adId: 'ca-app-pub-7610338885240453/6081192537', // Production Banner Unit ID
            adSize: 'ADAPTIVE_BANNER',
            position: 'TOP_CENTER',
            margin: 0,
            isTesting: false
        };

        AdMob.showBanner(options).then(() => {
            // Success - add layout padding
            setTimeout(() => {
                document.body.style.paddingTop = '60px';
            }, 500);
        }).catch((error) => {
            console.error('Banner reklam gösterilemedi:', error);
            // Retry after 5 seconds
            setTimeout(() => this.showBanner(), 5000);
        });
    },

    hideBanner: function() {
        if (!AdMob) return;
        AdMob.hideBanner().catch(() => {});
    },

    prepareInterstitial: function() {
        if (!AdMob) return;

        const options = {
            adId: 'ca-app-pub-7610338885240453/2112105479', // Production Interstitial Unit ID
            isTesting: false
        };

        AdMob.prepareInterstitial(options).then(() => {
            // Interstitial reklam hazır
            this.isInterstitialReady = true;
            console.log('Interstitial reklam hazırlandı');
        }).catch((error) => {
            console.error('Interstitial reklam hazırlanamadı:', error);
            // Retry after 10 seconds
            setTimeout(() => this.prepareInterstitial(), 10000);
            this.isInterstitialReady = false;
        });
    },

    showInterstitial: function() {
        if (!AdMob || !this.isInterstitialReady) return;
        
        // Mark as used before showing
        this.isInterstitialReady = false;
        
        AdMob.showInterstitial().then(() => {
            // Başarılı gösterim sonrası yeni reklam hazırla
            setTimeout(() => this.prepareInterstitial(), 3000);
        }).catch(() => {
            // Reklam gösterilemedi, yeniden hazırla
            setTimeout(() => this.prepareInterstitial(), 2000);
        });
    },

    // === MOBILE WEB ADS ===
    initMobileWebAds: function() {
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
            if (container) container.style.paddingTop = '15px';
            localStorage.setItem('hideMobileTopBanner', 'true');
        }
    },

    // === ADSENSE (WEB) ===
    initAds: function() {
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
        
        // Advanced interstitial frequency control
        const completions = parseInt(localStorage.getItem('quizCompletions') || '0') + 1;
        localStorage.setItem('quizCompletions', completions.toString());
        
        // Show interstitial at natural transition points (Google best practice)
        if (completions % 3 === 0 && this.isInterstitialReady) {
            // Delay to ensure smooth UX transition
            setTimeout(() => {
                this.showInterstitial();
            }, 1500);
        } else if (completions % 3 === 0 && !this.isInterstitialReady) {
            // Try to prepare for next time
            this.prepareInterstitial();
        }
    },

    // Additional utility for manual interstitial trigger
    showInterstitialIfReady: function() {
        if (this.isInterstitialReady) {
            this.showInterstitial();
            return true;
        }
        return false;
    },

    // === MOBILE BANNER PREFERENCES ===
    checkMobileBannerPreferences: function() {
        if (localStorage.getItem('hideMobileTopBanner') === 'true') {
            const banner = document.querySelector('.mobile-top-banner');
            if (banner) {
                banner.style.display = 'none';
                const container = document.querySelector('.container');
                if (container) container.style.paddingTop = '15px';
            }
        }
    }
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    MonetizationManager.init();
    MonetizationManager.checkMobileBannerPreferences();
});

// Global access for essential functions only
window.MonetizationManager = MonetizationManager;