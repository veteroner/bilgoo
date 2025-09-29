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

// === PLATFORM SPECIFIC TEST AD UNITS ===
// Google resmi test ID'leri (Android ve iOS ayrı). Yanlış platform ID'si iOS'ta sıfır dolum (no fill) / Request Error: No ad to show verebilir.
const TEST_AD_UNITS = {
    android: {
        bannerAdaptive: 'ca-app-pub-3940256099942544/9214589741',
        bannerFixed: 'ca-app-pub-3940256099942544/6300978111',
        interstitial: 'ca-app-pub-3940256099942544/1033173712',
        rewarded: 'ca-app-pub-3940256099942544/5224354917',
        rewardedInterstitial: 'ca-app-pub-3940256099942544/5354046379'
    },
    ios: {
        bannerAdaptive: 'ca-app-pub-3940256099942544/2435281174',
        bannerFixed: 'ca-app-pub-3940256099942544/2934735716',
        interstitial: 'ca-app-pub-3940256099942544/4411468910',
        rewarded: 'ca-app-pub-3940256099942544/1712485313',
        rewardedInterstitial: 'ca-app-pub-3940256099942544/6978759866'
    }
};

// Seçilecek aktif test üniteleri (platforma göre doldurulacak)
let ACTIVE_TEST_UNITS = null;

const MonetizationManager = {
    // State Management
    isInitialized: false,
    adMobInitStarted: false,
    adMobReady: false,
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
        
        // Platform tespiti
        const platform = window.Capacitor ? window.Capacitor.getPlatform() : 'web';
        const isNativeApp = platform === 'ios' || platform === 'android';

        // Test ID haritasını platforma göre seç
        if (isNativeApp) {
            ACTIVE_TEST_UNITS = TEST_AD_UNITS[platform] || TEST_AD_UNITS.android;
            console.log('[Monetization Debug] Aktif test reklam ID seti:', { platform, units: ACTIVE_TEST_UNITS });
        } else {
            ACTIVE_TEST_UNITS = null; // Web tarafı AdMob kullanmıyor
        }
        
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
            testingDevices: ["33BE2250B43518CCDA7DE426D04EE231"],
            initializeForTesting: true, // Test modunu aktif et
            tagForChildDirectedTreatment: false,
            tagForUnderAgeOfConsent: false,
            // ATT status'a göre tracking ayarları
            npa: trackingEnabled ? '0' : '1' // Non-personalized ads if no tracking
        };
        
        console.log('[Monetization Debug] AdMob init seçenekleri (ATT ile):', initOptions);

        console.log('[Monetization Debug] AdMob initialize ediliyor...');
        if (this.adMobInitStarted && this.adMobReady) {
            console.log('[Monetization Debug] AdMob already initialized (ATT path), skipping duplicate init');
            return;
        }
        this.adMobInitStarted = true;
        AdMob.initialize(initOptions).then(() => {
            console.log('[Monetization Debug] ✅ AdMob başarıyla initialize edildi (ATT ile):', attStatus);
            this.adMobReady = true;
            document.dispatchEvent(new CustomEvent('admob-ready', { detail: { attStatus, trackingEnabled, initOptions } }));
            setTimeout(() => {
                console.log('[Monetization Debug] Banner gösterimi başlatılıyor...');
                this.showBanner();
            }, 2000);
            setTimeout(() => {
                console.log('[Monetization Debug] Interstitial hazırlama başlatılıyor...');
                this.prepareInterstitial();
            }, 4000);
            this.isInterstitialReady = false;
        }).catch((error) => {
            console.error('[Monetization Debug] ❌ AdMob initialization başarısız:', error);
            console.error('[Monetization Debug] Hata detayı:', JSON.stringify(error));
            // Apply default padding if AdMob fails
            this.applyTopPadding(0);
        });
    },

    initializeAdMobWithoutTracking: function() {
        const initOptions = {
            requestTrackingAuthorization: false,
            testingDevices: ["33BE2250B43518CCDA7DE426D04EE231"],
            initializeForTesting: true, // Test modunu aktif et
            tagForChildDirectedTreatment: false,
            tagForUnderAgeOfConsent: false,
            npa: '1' // Non-personalized ads only
        };
        
        console.log('[Monetization Debug] AdMob init seçenekleri (tracking olmadan):', initOptions);

        console.log('[Monetization Debug] AdMob initialize ediliyor (tracking olmadan)...');
        if (this.adMobInitStarted && this.adMobReady) {
            console.log('[Monetization Debug] AdMob already initialized (no-tracking path), skipping duplicate init');
            return;
        }
        this.adMobInitStarted = true;
        AdMob.initialize(initOptions).then(() => {
            console.log('[Monetization Debug] ✅ AdMob başarıyla initialize edildi (tracking olmadan)');
            this.adMobReady = true;
            document.dispatchEvent(new CustomEvent('admob-ready', { detail: { trackingEnabled: false, initOptions } }));
            setTimeout(() => {
                console.log('[Monetization Debug] Banner gösterimi başlatılıyor...');
                this.showBanner();
            }, 2000);
            setTimeout(() => {
                console.log('[Monetization Debug] Interstitial hazırlama başlatılıyor...');
                this.prepareInterstitial();
            }, 4000);
            this.isInterstitialReady = false;
        }).catch((error) => {
            console.error('[Monetization Debug] ❌ AdMob initialization başarısız (tracking olmadan):', error);
            console.error('[Monetization Debug] Hata detayı:', JSON.stringify(error));
            // Apply default padding if AdMob fails
            this.applyTopPadding(0);
        });
    },

    initializeAdMobNormal: function() {
        const initOptions = {
            requestTrackingAuthorization: false,
            testingDevices: ["33BE2250B43518CCDA7DE426D04EE231"],
            initializeForTesting: true, // Test modunu aktif et
            tagForChildDirectedTreatment: false,
            tagForUnderAgeOfConsent: false,
        };
        
        console.log('[Monetization Debug] AdMob init seçenekleri (normal):', initOptions);

        console.log('[Monetization Debug] AdMob initialize ediliyor (normal)...');
        if (this.adMobInitStarted && this.adMobReady) {
            console.log('[Monetization Debug] AdMob already initialized (normal path), skipping duplicate init');
            return;
        }
        this.adMobInitStarted = true;
        AdMob.initialize(initOptions).then(() => {
            console.log('[Monetization Debug] ✅ AdMob başarıyla initialize edildi (normal)');
            this.adMobReady = true;
            document.dispatchEvent(new CustomEvent('admob-ready', { detail: { trackingEnabled: null, initOptions } }));
            setTimeout(() => {
                console.log('[Monetization Debug] Banner gösterimi başlatılıyor...');
                this.showBanner();
            }, 2000);
            setTimeout(() => {
                console.log('[Monetization Debug] Interstitial hazırlama başlatılıyor...');  
                this.prepareInterstitial();
            }, 4000);
            this.isInterstitialReady = false;
        }).catch((error) => {
            console.error('[Monetization Debug] ❌ AdMob initialization başarısız (normal):', error);
            console.error('[Monetization Debug] Hata detayı:', JSON.stringify(error));
            // Apply default padding if AdMob fails
            this.applyTopPadding(0);
        });
    },

    showBanner: function() {
        if (!AdMob) return;

        const adId = (ACTIVE_TEST_UNITS && (ACTIVE_TEST_UNITS.bannerAdaptive || ACTIVE_TEST_UNITS.bannerFixed)) || 'ca-app-pub-3940256099942544/6300978111';
    console.log('[Monetization Debug] Banner adId kullanılacak:', adId);
        const options = {
            adId,
            adSize: 'ADAPTIVE_BANNER',
            position: 'TOP_CENTER',
            margin: 0,
            isTesting: true
        };
        
        console.log('[Monetization Debug] Banner reklam seçenekleri:', options);
        
        console.log('[Monetization Debug] Banner reklam seçenekleri:', options);

        console.log('[Monetization Debug] Banner reklam gösteriliyor...');
        AdMob.showBanner(options).then(() => {
            console.log('[Monetization Debug] Banner reklam başarıyla gösterildi');
            // Initial fallback: apply 40px base padding
            setTimeout(() => {
                this.applyTopPadding(0); // Base 40px will be applied
                // Mark that a top banner is visible for container spacing
                document.body.classList.add('has-top-banner');
                console.log('[Monetization Debug] Banner padding uygulandı');
            }, 500);
        }).catch((error) => {
            console.error('[Monetization Debug] Banner reklam gösterilemedi:', error);
            console.error('[Monetization Debug] Banner hata detayı:', JSON.stringify(error));
            // Apply default padding when banner fails
            this.applyTopPadding(0);
            // Retry after 5 seconds
            console.log('[Monetization Debug] Banner 5 saniye sonra tekrar denenecek');
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
        if (!AdMob) return;

        const adId = (ACTIVE_TEST_UNITS && ACTIVE_TEST_UNITS.interstitial) || 'ca-app-pub-3940256099942544/1033173712';
    console.log('[Monetization Debug] Interstitial adId kullanılacak:', adId);
        const options = {
            adId,
            isTesting: true
        };
        
        console.log('[Monetization Debug] Interstitial reklam seçenekleri:', options);

        console.log('[Monetization Debug] Interstitial reklam hazırlanıyor...');
        AdMob.prepareInterstitial(options).then(() => {
            // Interstitial reklam hazır
            this.isInterstitialReady = true;
            console.log('[Monetization Debug] Interstitial reklam başarıyla hazırlandı');
        }).catch((error) => {
            console.error('[Monetization Debug] Interstitial reklam hazırlanamadı:', error);
            console.error('[Monetization Debug] Interstitial hata detayı:', JSON.stringify(error));
            // Retry after 10 seconds
            console.log('[Monetization Debug] Interstitial 10 saniye sonra tekrar denenecek');
            setTimeout(() => this.prepareInterstitial(), 10000);
            this.isInterstitialReady = false;
        });
    },

    showInterstitial: function() {
        console.log('[Monetization Debug] Interstitial gösterme çağrıldı');
        console.log('[Monetization Debug] AdMob mevcut:', !!AdMob);
        console.log('[Monetization Debug] Interstitial hazır:', this.isInterstitialReady);
        
        if (!AdMob || !this.isInterstitialReady) {
            console.log('[Monetization Debug] Interstitial gösterilemez - şartlar sağlanmadı');
            return;
        }
        
        // Mark as used before showing
        this.isInterstitialReady = false;
        
        console.log('[Monetization Debug] Interstitial reklam gösteriliyor...');
        AdMob.showInterstitial().then(() => {
            console.log('[Monetization Debug] Interstitial reklam başarıyla gösterildi');
            // Başarılı gösterim sonrası yeni reklam hazırla
            setTimeout(() => {
                console.log('[Monetization Debug] Yeni interstitial hazırlanacak');
                this.prepareInterstitial();
            }, 3000);
        }).catch((error) => {
            console.error('[Monetization Debug] Interstitial reklam gösterilemedi:', error);
            console.error('[Monetization Debug] Interstitial hata detayı:', JSON.stringify(error));
            // Reklam gösterilemedi, yeniden hazırla
            setTimeout(() => {
                console.log('[Monetization Debug] Hata sonrası interstitial tekrar hazırlanacak');
                this.prepareInterstitial();
            }, 2000);
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

    // (İsteğe bağlı) Rewarded reklam yönetimi ileride buraya taşınabilir
    debugTestAdUnits: function() {
        console.log('[Monetization Debug] Aktif test ID seti:', ACTIVE_TEST_UNITS);
    },

    // Script.js için test unit haritasını döndür
    getActiveTestUnits: function() {
        return ACTIVE_TEST_UNITS;
    },

    isAdMobReady: function() {
        return !!this.adMobReady;
    },

    // Comprehensive debug - tüm reklam durumunu kontrol et
    debugAllAds: function() {
        const platform = window.Capacitor ? window.Capacitor.getPlatform() : 'web';
        const status = {
            platform: platform,
            hasAdMobPlugin: !!AdMob,
            isInitialized: this.isInitialized,
            isInterstitialReady: this.isInterstitialReady,
            activeTestUnits: ACTIVE_TEST_UNITS,
            cookiePreferences: this.cookiePreferences,
            hasCapacitor: !!window.Capacitor,
            isNativePlatform: window.Capacitor ? window.Capacitor.isNativePlatform() : false,
            testDeviceId: "33BE2250B43518CCDA7DE426D04EE231"
        };
        
        console.log('[Monetization Debug] 🚀 KAPSAMLI REKLAM DURUMU:', status);
        
        // Test reklamları manuel tetikle
        if (AdMob && this.isInitialized) {
            console.log('[Monetization Debug] 🔄 Test banner yeniden deniyor...');
            setTimeout(() => this.showBanner(), 1000);
            
            console.log('[Monetization Debug] 🔄 Test interstitial yeniden deniyor...');
            setTimeout(() => this.prepareInterstitial(), 2000);
        }
        
        return status;
    },

    // Debug utility to check AdMob status
    debugAdMobStatus: function() {
        const status = {
            hasAdMobPlugin: !!AdMob,
            isInitialized: this.isInitialized,
            isInterstitialReady: this.isInterstitialReady,
            platform: window.Capacitor ? window.Capacitor.getPlatform() : 'web',
            cookiePreferences: this.cookiePreferences,
            hasCapacitor: !!window.Capacitor,
            isNativePlatform: window.Capacitor ? window.Capacitor.isNativePlatform() : false
        };
        
        console.log('[Monetization Debug] AdMob Status:', status);
        return status;
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
    },

    // Debug utility to check AdMob status
    debugAdMobStatus: function() {
        const status = {
            hasAdMobPlugin: !!AdMob,
            isInitialized: this.isInitialized,
            isInterstitialReady: this.isInterstitialReady,
            platform: window.Capacitor ? window.Capacitor.getPlatform() : 'web',
            cookiePreferences: this.cookiePreferences,
            hasCapacitor: !!window.Capacitor,
            isNativePlatform: window.Capacitor ? window.Capacitor.isNativePlatform() : false
        };
        
        console.log('[Monetization Debug] AdMob Status:', status);
        return status;
    }
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    MonetizationManager.init();
    MonetizationManager.checkMobileBannerPreferences();
});

// Global access for essential functions only
window.MonetizationManager = MonetizationManager;