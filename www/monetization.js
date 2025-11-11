/**
 * PRODUCTION MONETIZATION SYSTEM
 * Unity Ads (Primary) + AdMob (Fallback)
 * Version: 3.0.0 Production
 * Risk Level: 0%
 */

// AdMob Plugin - Fallback (currently restricted)
let AdMob = null;
try {
    if (window.Capacitor?.Plugins?.AdMob) {
        AdMob = window.Capacitor.Plugins.AdMob;
    }
} catch (e) {
    // Silent fail
}

// Unity Ads - Native Bridge (Primary)
// Android native bridge is automatically available via MainActivity.java
// Provides: UnityAdsAndroid.showInterstitial(), showRewarded(), isInterstitialReady(), isRewardedReady()
// Reward callback: window.UnityAdsRewardCallback(true/false)

const MonetizationManager = {
    // State Management
    isInitialized: false,
    cookiePreferences: {
        essential: true,
        analytics: false,
        advertising: false
    },
    
    // Unity Ads Configuration (Primary) - PRODUCTION IDs
    _UNITY_CONFIG: {
        // NOT: Native taraf ile tutarlılık için ID'ler düzeltildi.
        // Android: 5968313  |  iOS: 5968312
        android: {
            gameId: '5968313', // Unity Dashboard - GROW project (Android)
            interstitial: 'Interstitial_Android',
            rewarded: 'Rewarded_Android'
        },
        ios: {
            gameId: '5968312', // Unity Dashboard - GROW project (iOS)
            interstitial: 'Interstitial_iOS',
            rewarded: 'Rewarded_iOS'
        },
        testMode: false // Production mode aktif
    },
    
    // AdMob Configuration (Fallback)
    _PROD_AD_UNITS: {
        android: {
            banner: 'ca-app-pub-7610338885240453/3665814891',
            interstitial: 'ca-app-pub-7610338885240453/1220131878',
            rewarded: 'ca-app-pub-7610338885240453/3634025302'
        },
        ios: {
            banner: 'ca-app-pub-7610338885240453/2815767654',
            interstitial: 'ca-app-pub-7610338885240453/5988725909',
            rewarded: 'ca-app-pub-7610338885240453/7876522645'
        }
    },
    
    // Ad provider status tracking
    _unityReady: false,
    _admobReady: false,
    _isInterstitialReady: false,
    _isRewardedReady: false,
    _rewardedCallbackResolve: null, // Unity Ads reward callback promise resolver
    
    // Top padding management
    defaultTopOffset: 0,

    // === INITIALIZATION ===
    init: function() {
        if (this.isInitialized) return;
        
        // Platform tespiti
        const platform = window.Capacitor ? window.Capacitor.getPlatform() : 'web';
        const isNativeApp = platform === 'ios' || platform === 'android';
        
        if (isNativeApp) {
            console.log('[Monetization] Native app detected, initializing Unity Ads + AdMob');
            this.cookiePreferences.advertising = true;
            this.setupEventListeners();
            this.ensureEarlyATTOnIOS();
            this.setupUnityAds(); // Unity Ads önce
            this.setupAdMobListeners(); // AdMob fallback
            this.initPlatformAds();
        } else {
            console.log('[Monetization] Web platform detected');
            this.checkCookieConsent();
            this.setupEventListeners();
            this.setupAdMobListeners();
            this.initPlatformAds();
        }
        
        this.isInitialized = true;
    },

    // Backward compatibility alias
    initialize: function() { return this.init(); },

    // === UNITY ADS SETUP ===
    setupUnityAds: async function() {
        // Unity Ads native bridge kontrolü (Android)
        if (window.UnityAdsAndroid) {
            console.log('[Unity Ads] ✅ Native bridge detected (Android)');
            this._unityReady = true;
            
            // Reward callback listener setup
            if (!window.UnityAdsRewardCallback) {
                window.UnityAdsRewardCallback = (rewarded) => {
                    console.log('[Unity Ads] 🎯 REWARD CALLBACK RECEIVED:', rewarded);
                    console.log('[Unity Ads] 📱 Callback details:', {
                        rewarded: rewarded,
                        hasResolver: !!this._rewardedCallbackResolve,
                        timestamp: new Date().toISOString()
                    });
                    
                    if (this._rewardedCallbackResolve) {
                        console.log('[Unity Ads] ✅ Resolving promise with reward:', rewarded);
                        this._rewardedCallbackResolve({ rewarded: rewarded, provider: 'unity' });
                        this._rewardedCallbackResolve = null;
                    } else {
                        console.warn('[Unity Ads] ⚠️ No resolver found - callback ignored!');
                    }
                };
            }
            
            // Native bridge üzerinden hazır durumu kontrol et
            setTimeout(() => {
                this.checkUnityAdsReady();
            }, 2000);
            
            return;
        }
        
        // Unity Ads native bridge kontrolü (iOS)
        if (window.webkit?.messageHandlers?.UnityAdsIOS) {
            console.log('[Unity Ads] ✅ Native bridge detected (iOS)');
            this._unityReady = true;
            
            // Reward callback listener setup
            if (!window.UnityAdsRewardCallback) {
                window.UnityAdsRewardCallback = (rewarded) => {
                    console.log('[Unity Ads] 🎯 REWARD CALLBACK RECEIVED (iOS):', rewarded);
                    console.log('[Unity Ads] 📱 iOS Callback details:', {
                        rewarded: rewarded,
                        hasResolver: !!this._rewardedCallbackResolve,
                        timestamp: new Date().toISOString()
                    });
                    
                    if (this._rewardedCallbackResolve) {
                        console.log('[Unity Ads] ✅ Resolving iOS promise with reward:', rewarded);
                        this._rewardedCallbackResolve({ rewarded: rewarded, provider: 'unity' });
                        this._rewardedCallbackResolve = null;
                    } else {
                        console.warn('[Unity Ads] ⚠️ No iOS resolver found - callback ignored!');
                    }
                };
            }
            
            // Ready status callback listeners
            if (!window.UnityAdsInterstitialReadyCallback) {
                window.UnityAdsInterstitialReadyCallback = (ready) => {
                    this._isInterstitialReady = ready;
                    console.log('[Unity Ads] Interstitial ready (iOS):', ready);
                };
            }
            
            if (!window.UnityAdsRewardedReadyCallback) {
                window.UnityAdsRewardedReadyCallback = (ready) => {
                    this._isRewardedReady = ready;
                    console.log('[Unity Ads] Rewarded ready (iOS):', ready);
                };
            }
            
            // iOS bridge üzerinden hazır durumu kontrol et
            setTimeout(() => {
                this.checkUnityAdsReady();
            }, 2000);
            
            return;
        }
        
        // Fallback
        console.log('[Monetization] Unity Ads native bridge not available, will use AdMob fallback');
    },

    checkUnityAdsReady: function() {
        // Android
        if (window.UnityAdsAndroid) {
            try {
                const interstitialReady = window.UnityAdsAndroid.isInterstitialReady();
                const rewardedReady = window.UnityAdsAndroid.isRewardedReady();
                
                this._isInterstitialReady = interstitialReady;
                this._isRewardedReady = rewardedReady;
                
                console.log('[Unity Ads] Interstitial ready:', interstitialReady);
                console.log('[Unity Ads] Rewarded ready:', rewardedReady);
                
                // Her 30 saniyede bir kontrol et
                setTimeout(() => this.checkUnityAdsReady(), 30000);
            } catch (error) {
                console.error('[Unity Ads] Error checking ready status:', error);
            }
            return;
        }
        
        // iOS
        if (window.webkit?.messageHandlers?.UnityAdsIOS) {
            try {
                // iOS için ready status istekleri gönder
                window.webkit.messageHandlers.UnityAdsIOS.postMessage({
                    action: 'isInterstitialReady'
                });
                
                window.webkit.messageHandlers.UnityAdsIOS.postMessage({
                    action: 'isRewardedReady'
                });
                
                // Her 30 saniyede bir kontrol et
                setTimeout(() => this.checkUnityAdsReady(), 30000);
            } catch (error) {
                console.error('[Unity Ads] Error checking ready status (iOS):', error);
            }
        }
    },

    loadUnityInterstitial: async function() {
        // Native bridge otomatik load ediyor, sadece ready durumunu kontrol et
        if (window.UnityAdsAndroid) {
            try {
                this._isInterstitialReady = window.UnityAdsAndroid.isInterstitialReady();
                console.log('[Unity Ads] Interstitial ready status:', this._isInterstitialReady);
            } catch (error) {
                console.error('[Unity Ads] Error checking interstitial:', error);
                this._isInterstitialReady = false;
            }
        }
    },

    loadUnityRewarded: async function() {
        // Native bridge otomatik load ediyor, sadece ready durumunu kontrol et
        if (window.UnityAdsAndroid) {
            try {
                this._isRewardedReady = window.UnityAdsAndroid.isRewardedReady();
                console.log('[Unity Ads] Rewarded ready status:', this._isRewardedReady);
            } catch (error) {
                console.error('[Unity Ads] Error checking rewarded:', error);
                this._isRewardedReady = false;
            }
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
        // Banner reklamları devre dışı: dinleyici eklenmiyor
        return;
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
            testingDevices: [], // ✅ PRODUCTION: Test devices kaldırıldı
            initializeForTesting: false, // ✅ PRODUCTION: Test mode kapalı
            tagForChildDirectedTreatment: false,
            tagForUnderAgeOfConsent: false,
            // ATT status'a göre tracking ayarları
            npa: trackingEnabled ? '0' : '1' // Non-personalized ads if no tracking
        };

        AdMob.initialize(initOptions).then(() => {
            console.log('AdMob initialized with ATT status:', attStatus);
            this._admobReady = true;
            // ✅ PRODUCTION: Test environment flag kapalı
            this._testEnv = false;
            try { 
                document.dispatchEvent(new Event('admob-ready')); 
                console.log('[Monetization Debug] admob-ready event dispatched (ATT)');
            } catch(_) {}
            // Interstitial reklamları aktifleştir
            setTimeout(() => this.prepareInterstitial(), 3000);
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
            testingDevices: [], // ✅ PRODUCTION: Test devices kaldırıldı
            initializeForTesting: false, // ✅ PRODUCTION: Test mode kapalı
            tagForChildDirectedTreatment: false,
            tagForUnderAgeOfConsent: false,
            npa: '1' // Non-personalized ads only
        };

        AdMob.initialize(initOptions).then(() => {
            console.log('AdMob initialized without tracking');
            this._admobReady = true;
            // ✅ PRODUCTION: Test environment flag kapalı
            this._testEnv = false;
            try { 
                document.dispatchEvent(new Event('admob-ready')); 
                console.log('[Monetization Debug] admob-ready event dispatched (no tracking)');
            } catch(_) {}
            // Interstitial reklamları aktifleştir
            setTimeout(() => this.prepareInterstitial(), 3000);
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
            testingDevices: [], // ✅ PRODUCTION: Test devices kaldırıldı
            initializeForTesting: false, // ✅ PRODUCTION: Test mode kapalı
            tagForChildDirectedTreatment: false,
            tagForUnderAgeOfConsent: false,
        };

        AdMob.initialize(initOptions).then(() => {
            console.log('AdMob initialized normally');
            this._admobReady = true;
            // ✅ PRODUCTION: Test environment flag kapalı
            this._testEnv = false;
            try { 
                document.dispatchEvent(new Event('admob-ready')); 
                console.log('[Monetization Debug] admob-ready event dispatched (normal)');
            } catch(_) {}
            // Interstitial reklamları aktifleştir
            setTimeout(() => this.prepareInterstitial(), 3000);
            this.isInterstitialReady = false;
        }).catch((error) => {
            console.error('AdMob initialization failed:', error);
            // Apply default padding if AdMob fails
            this.applyTopPadding(0);
        });
    },

    showBanner: function() {
        // Banner reklamları kaldırıldı
        return;
    },

    hideBanner: function() {
        // Banner reklamları kaldırıldı
        this.applyTopPadding(0);
        document.body.classList.remove('has-top-banner');
        return;
    },

    prepareInterstitial: function() {
        if (!AdMob) return;
        const platform = window.Capacitor ? window.Capacitor.getPlatform() : 'web';
        const isNative = platform === 'ios' || platform === 'android';
        if (!isNative) return;
        
        const units = this.getActiveAdUnits();
        const interstitialId = units.interstitial;
        
        if (!interstitialId) {
            console.log('[Monetization] Interstitial ID bulunamadı');
            return;
        }

        const useTestFlag = !!this._testEnv;
        const options = {
            adId: interstitialId,
            isTesting: useTestFlag
        };

        AdMob.prepareInterstitial(options).then(() => {
            console.log('[Monetization] Interstitial hazırlandı');
            this.isInterstitialReady = true;
        }).catch((error) => {
            console.error('[Monetization] Interstitial hazırlama hatası:', error);
            this.isInterstitialReady = false;
            // 30 saniye sonra tekrar dene
            setTimeout(() => this.prepareInterstitial(), 30000);
        });
    },

    // === SHOW INTERSTITIAL (Unity Ads + AdMob Fallback) ===
    showInterstitial: async function() {
        console.log('[Monetization] Interstitial gösterme talebi');
        
        // 1. Önce Unity Ads native bridge dene (Android)
        if (this._unityReady && window.UnityAdsAndroid) {
            try {
                const isReady = window.UnityAdsAndroid.isInterstitialReady();
                console.log('[Unity Ads] Interstitial ready status:', isReady);
                
                if (isReady) {
                    console.log('[Unity Ads] Interstitial gösteriliyor (Android)...');
                    window.UnityAdsAndroid.showInterstitial();
                    
                    // Native bridge callback beklemeden başarılı say
                    // Native kod kendi lifecycle'ını yönetiyor
                    this._isInterstitialReady = false;
                    
                    // 3 saniye sonra ready durumunu tekrar kontrol et
                    setTimeout(() => this.loadUnityInterstitial(), 3000);
                    
                    return true;
                }
            } catch (error) {
                console.error('[Unity Ads] ❌ Interstitial gösterme hatası:', error);
                // Unity başarısız, fallback dene
            }
        }
        
        // 1b. Unity Ads native bridge dene (iOS)
        if (this._unityReady && window.webkit?.messageHandlers?.UnityAdsIOS) {
            try {
                if (this._isInterstitialReady) {
                    console.log('[Unity Ads] Interstitial gösteriliyor (iOS)...');
                    window.webkit.messageHandlers.UnityAdsIOS.postMessage({
                        action: 'showInterstitial'
                    });
                    
                    this._isInterstitialReady = false;
                    
                    // 3 saniye sonra ready durumunu tekrar kontrol et
                    setTimeout(() => this.loadUnityInterstitial(), 3000);
                    
                    return true;
                }
            } catch (error) {
                console.error('[Unity Ads] ❌ Interstitial gösterme hatası (iOS):', error);
                // Unity başarısız, fallback dene
            }
        }
        
        // 2. Unity başarısız veya hazır değil - AdMob fallback
        if (AdMob && this.isInterstitialReady) {
            try {
                console.log('[AdMob] Fallback: Interstitial gösteriliyor...');
                await AdMob.showInterstitial();
                console.log('[AdMob] ✅ Interstitial başarıyla gösterildi');
                this.isInterstitialReady = false;
                setTimeout(() => this.prepareInterstitial(), 3000);
                return true;
            } catch (error) {
                console.error('[AdMob] ❌ Interstitial gösterme hatası:', error);
                this.isInterstitialReady = false;
                setTimeout(() => this.prepareInterstitial(), 5000);
                return false;
            }
        }
        
        console.log('[Monetization] ⚠️ Hiçbir reklam hazır değil');
        return false;
    },

    // === SHOW REWARDED (Unity Ads + AdMob Fallback) ===
    showRewarded: async function() {
        console.log('[Monetization] Rewarded ad gösterme talebi');
        
        return new Promise(async (resolve, reject) => {
            // 1. Önce Unity Ads native bridge dene (Android)
            if (this._unityReady && window.UnityAdsAndroid) {
                try {
                    const isReady = window.UnityAdsAndroid.isRewardedReady();
                    console.log('[Unity Ads] Rewarded ready status (Android):', isReady);
                    
                    if (isReady) {
                        console.log('[Unity Ads] 🎬 REWARDED AD GÖSTERILIYOR (Android)...');
                        console.log('[Unity Ads] 📊 Unity Ad Status:', {
                            ready: isReady,
                            hasCallback: !!window.UnityAdsRewardCallback,
                            platform: 'android'
                        });
                        
                        // Callback promise'i kaydet
                        this._rewardedCallbackResolve = resolve;
                        console.log('[Unity Ads] 🔗 Promise resolver kaydedildi');
                        
                        // Native bridge üzerinden göster
                        // Callback window.UnityAdsRewardCallback(true/false) ile gelecek
                        window.UnityAdsAndroid.showRewarded();
                        console.log('[Unity Ads] ✅ showRewarded() çağrıldı - callback bekleniyor...');
                        
                        this._isRewardedReady = false;
                        
                        // 3 saniye sonra ready durumunu tekrar kontrol et
                        setTimeout(() => this.loadUnityRewarded(), 3000);
                        
                        // Timeout: 60 saniye içinde callback gelmezse fallback
                        setTimeout(() => {
                            if (this._rewardedCallbackResolve) {
                                console.warn('[Unity Ads] ⚠️ Timeout - callback gelmedi');
                                this._rewardedCallbackResolve = null;
                                // AdMob fallback'e geç
                                this.showRewardedAdMobFallback(resolve, reject);
                            }
                        }, 60000);
                        
                        return; // Promise callback'ten resolve edilecek
                    }
                } catch (error) {
                    console.error('[Unity Ads] ❌ Rewarded ad gösterme hatası (Android):', error);
                    // Unity başarısız, fallback dene
                }
            }
            
            // 1b. Unity Ads native bridge dene (iOS)
            if (this._unityReady && window.webkit?.messageHandlers?.UnityAdsIOS) {
                try {
                    if (this._isRewardedReady) {
                        console.log('[Unity Ads] 🎬 REWARDED AD GÖSTERILIYOR (iOS)...');
                        console.log('[Unity Ads] 📊 Unity iOS Ad Status:', {
                            ready: this._isRewardedReady,
                            hasCallback: !!window.UnityAdsRewardCallback,
                            platform: 'ios'
                        });
                        
                        // Callback promise'i kaydet
                        this._rewardedCallbackResolve = resolve;
                        console.log('[Unity Ads] 🔗 iOS Promise resolver kaydedildi');
                        
                        // iOS bridge üzerinden göster
                        // Callback window.UnityAdsRewardCallback(true/false) ile gelecek
                        window.webkit.messageHandlers.UnityAdsIOS.postMessage({
                            action: 'showRewarded'
                        });
                        console.log('[Unity Ads] ✅ iOS showRewarded() çağrıldı - callback bekleniyor...');
                        
                        this._isRewardedReady = false;
                        
                        // 3 saniye sonra ready durumunu tekrar kontrol et
                        setTimeout(() => this.loadUnityRewarded(), 3000);
                        
                        // Timeout: 60 saniye içinde callback gelmezse fallback
                        setTimeout(() => {
                            if (this._rewardedCallbackResolve) {
                                console.warn('[Unity Ads] ⚠️ Timeout (iOS) - callback gelmedi');
                                this._rewardedCallbackResolve = null;
                                // AdMob fallback'e geç
                                this.showRewardedAdMobFallback(resolve, reject);
                            }
                        }, 60000);
                        
                        return; // Promise callback'ten resolve edilecek
                    }
                } catch (error) {
                    console.error('[Unity Ads] ❌ Rewarded ad gösterme hatası (iOS):', error);
                    // Unity başarısız, fallback dene
                }
            }
            
            // 2. Unity başarısız veya hazır değil - AdMob fallback
            this.showRewardedAdMobFallback(resolve, reject);
        });
    },
    
    showRewardedAdMobFallback: async function(resolve, reject) {
        if (AdMob) {
            try {
                console.log('[AdMob] Fallback: Rewarded ad gösteriliyor...');
                const result = await AdMob.showRewardVideoAd();
                
                if (result && result.rewarded) {
                    console.log('[AdMob] ✅ Rewarded ad tamamlandı - ödül verilecek');
                    resolve({ rewarded: true, provider: 'admob' });
                } else {
                    console.log('[AdMob] ⚠️ Kullanıcı reklamı tamamlamadı');
                    resolve({ rewarded: false, provider: 'admob' });
                }
            } catch (error) {
                console.error('[AdMob] ❌ Rewarded ad gösterme hatası:', error);
                reject(error);
            }
        } else {
            console.log('[Monetization] ⚠️ Hiçbir reklam sağlayıcı hazır değil');
            reject(new Error('No ad provider available'));
        }
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

    // === ANALYTICS & ERROR TRACKING ===
    trackAdError: function(adType, error) {
        try {
            // Firebase Analytics'e error gönder
            if (typeof gtag !== 'undefined') {
                gtag('event', 'ad_error', {
                    ad_format: adType,
                    error_code: error.code || 'unknown',
                    error_message: error.message || 'Unknown error',
                    custom_map: { error_details: JSON.stringify(error) }
                });
            }
            
            // Console'da detaylı log
            console.error(`[AdMob Error - ${adType}]:`, {
                code: error.code,
                message: error.message,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            });
        } catch (e) {
            console.error('Error tracking failed:', e);
        }
    },

    trackAdSuccess: function(adType, adUnitId) {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'ad_loaded', {
                    ad_format: adType,
                    ad_unit_id: adUnitId,
                    timestamp: Date.now()
                });
            }
        } catch (e) {
            console.error('Success tracking failed:', e);
        }
    },
    onQuizComplete: function() {
        this.trackEvent('quiz_complete');
        
        // Quiz tamamlandığında interstitial reklam göster
        const completions = parseInt(localStorage.getItem('quizCompletions') || '0') + 1;
        localStorage.setItem('quizCompletions', completions.toString());
        
        // Bölüm bazlı reklam gösterimi script.js'de yapılıyor
        // Bu fonksiyon sadece analytics için kullanılıyor
        console.log(`[Monetization] Quiz tamamlandı. Toplam: ${completions}`);
    },

    // Additional utility for manual interstitial trigger
    showInterstitialIfReady: function() {
        console.log('[Monetization] showInterstitialIfReady çağrıldı');
        console.log('[Monetization] Unity hazır:', this._unityReady && this._isInterstitialReady);
        console.log('[Monetization] AdMob hazır:', this.isInterstitialReady);
        
        if ((this._unityReady && this._isInterstitialReady) || this.isInterstitialReady) {
            console.log('[Monetization] ✅ Interstitial gösteriliyor...');
            return this.showInterstitial();
        } else {
            console.log('[Monetization] ⚠️ Interstitial henüz hazır değil');
            // Unity ve AdMob'u hazırla
            if (this._unityReady) this.loadUnityInterstitial();
            this.prepareInterstitial();
            return false;
        }
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
// Google'ın iOS sample ad unit ID'leri (diagnostic fallback)
// ✅ PRODUCTION: Test ad units tamamen kaldırıldı (Google policy compliance)
// _IOS_SAMPLE_UNITS objesi kaldırıldı

MonetizationManager.isTestMode = function() {
    return false; // ✅ PRODUCTION: Test mode kapalı
};

// Yeni net isimli yardımcı
MonetizationManager.getActiveAdUnits = function() {
    const platform = window.Capacitor ? window.Capacitor.getPlatform() : 'web';
    const isNative = platform === 'ios' || platform === 'android';
    
    // ✅ PRODUCTION: Sadece production ad units kullan
    const map = this._PROD_AD_UNITS;
    return isNative ? (map[platform] || this._PROD_AD_UNITS.android) : null;
};

// Geriye dönük uyumluluk (eski çağrılar)
MonetizationManager.getActiveTestUnits = function() { return this.getActiveAdUnits(); };

MonetizationManager.isAdMobReady = function() { return !!this._admobReady; };

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    MonetizationManager.init();
    MonetizationManager.checkMobileBannerPreferences();
});

// Global access for essential functions only
window.MonetizationManager = MonetizationManager;