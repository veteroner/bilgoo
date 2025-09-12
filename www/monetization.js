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
    
    // Top padding management
    defaultTopOffset: 60, // Base offset: 60px (+20px extra to avoid overlap)

    // === INITIALIZATION ===
    init: function() {
        if (this.isInitialized) return;
        
        // Network durumunu test et
        this.testNetworkConnection();
        
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

    // Network bağlantısını test et
    testNetworkConnection: function() {
        console.log('[Monetization Debug] Testing network connection...');
        console.log('[Monetization Debug] Navigator.onLine:', navigator.onLine);
        
        // Google DNS'e ping atarak gerçek bağlantıyı test et
        if (navigator.onLine) {
            fetch('https://dns.google/resolve?name=google.com&type=A', {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            }).then(response => {
                if (response.ok) {
                    console.log('[Monetization Debug] Network connection verified: OK');
                } else {
                    console.log('[Monetization Debug] Network connection test failed: Response not OK');
                }
            }).catch(error => {
                console.log('[Monetization Debug] Network connection test failed:', error.message);
                console.log('[Monetization Debug] This might be an emulator without internet access');
            });
        }
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
            // Apply default padding if AdMob fails
            this.applyTopPadding(0);
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
            // Apply default padding if AdMob fails
            this.applyTopPadding(0);
        });
    },

    initializeAdMobNormal: function() {
        // Network bağlantısını kontrol et
        const isOnline = navigator.onLine;
        if (!isOnline) {
            console.log('[Monetization Debug] Device is offline, applying default padding');
            this.applyTopPadding(0);
            // Online olduğunda tekrar dene
            window.addEventListener('online', () => {
                console.log('[Monetization Debug] Device came online, retrying AdMob initialization');
                this.initializeAdMobNormal();
            }, { once: true });
            return;
        }

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
            // Apply default padding if AdMob fails
            this.applyTopPadding(0);
            
            // Network error ise 10 saniye sonra tekrar dene
            if (error.message && error.message.includes('Unable to resolve host')) {
                console.log('[Monetization Debug] Network error detected, retrying in 10 seconds');
                setTimeout(() => {
                    if (navigator.onLine) {
                        console.log('[Monetization Debug] Retrying AdMob initialization after network error');
                        this.initializeAdMobNormal();
                    }
                }, 10000);
            }
        });
    },

    showBanner: function() {
        if (!AdMob) return;
        
        // Network bağlantısını kontrol et
        if (!navigator.onLine) {
            console.log('[Monetization Debug] Device offline, cannot show banner');
            this.applyTopPadding(0);
            return;
        }

        const options = {
            adId: 'ca-app-pub-7610338885240453/6081192537', // Production Banner Unit ID
            adSize: 'ADAPTIVE_BANNER',
            position: 'TOP_CENTER',
            margin: 0,
            isTesting: false
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
            
            // Network error değilse retry, network error ise bekle
            if (error.message && error.message.includes('Unable to resolve host')) {
                console.log('[Monetization Debug] Network error in banner, waiting for connection');
                // Online olduğunda tekrar dene
                window.addEventListener('online', () => {
                    console.log('[Monetization Debug] Connection restored, retrying banner');
                    setTimeout(() => this.showBanner(), 2000);
                }, { once: true });
            } else {
                // Diğer hatalar için 5 saniye sonra tekrar dene
                setTimeout(() => this.showBanner(), 5000);
            }
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
                if (container) container.style.paddingTop = '40px'; // Updated to use 40px default
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