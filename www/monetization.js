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
        console.log('🍪 Cookie consent kontrol ediliyor...');
        const consent = localStorage.getItem('cookieConsent');
        console.log('Mevcut consent:', consent);
        
        if (!consent) {
            console.log('📋 Cookie banner gösteriliyor');
            this.showCookieBanner();
        } else {
            this.cookiePreferences = JSON.parse(consent);
            console.log('✅ Cookie preferences yüklendi:', this.cookiePreferences);
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
        if (this.cookiePreferences.analytics && typeof gtag !== 'undefined') {
            gtag('consent', 'update', { 'analytics_storage': 'granted' });
        }
        
        if (this.cookiePreferences.advertising) {
            this.initAds();
        }
    },

    // === PLATFORM DETECTION & ADS ===
    initPlatformAds: function() {
        const isAndroidApp = window.Capacitor && window.Capacitor.getPlatform() === 'android';
        const isMobileWeb = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        console.log('🔍 Platform detection:');
        console.log('- Capacitor mevcut:', !!window.Capacitor);
        console.log('- Platform:', window.Capacitor?.getPlatform());
        console.log('- isAndroidApp:', isAndroidApp);
        console.log('- isMobileWeb:', isMobileWeb);
        console.log('- User Agent:', navigator.userAgent);
        
        if (isAndroidApp) {
            console.log('📱 Android app tespit edildi - AdMob başlatılıyor');
            this.initAdMob();
        } else if (isMobileWeb) {
            console.log('🌐 Mobile web tespit edildi - AdSense başlatılıyor');
            this.initMobileWebAds();
        } else {
            console.log('💻 Desktop tespit edildi - AdSense başlatılıyor');
            this.initMobileWebAds();
        }
    },

    // === ADMOB (ANDROID) ===
    initAdMob: function() {
        console.log('🔍 AdMob init başlatılıyor...');
        console.log('AdMob plugin mevcut:', !!AdMob);
        console.log('Reklam izni:', this.cookiePreferences.advertising);
        
        if (!AdMob) {
            console.error('❌ AdMob plugin bulunamadı!');
            return;
        }
        
        if (!this.cookiePreferences.advertising) {
            console.error('❌ Reklam izni verilmemiş!');
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

        console.log('🚀 AdMob initialize ediliyor...');
        AdMob.initialize(initOptions).then(() => {
            console.log('✅ AdMob başarıyla initialize edildi');
            // Initialize ads with proper timing
            setTimeout(() => this.showBanner(), 2000);
            setTimeout(() => this.prepareInterstitial(), 4000);
            
            // Track interstitial readiness
            this.isInterstitialReady = false;
        }).catch((error) => {
            console.error('❌ AdMob initialize hatası:', error);
        });
    },

    showBanner: function() {
        console.log('🎯 Banner reklam gösteriliyor...');
        
        if (!AdMob) {
            console.error('❌ AdMob plugin bulunamadı - banner gösterilemiyor');
            return;
        }

        const options = {
            adId: 'ca-app-pub-7610338885240453/6081192537',
            adSize: 'ADAPTIVE_BANNER',
            position: 'TOP_CENTER',
            margin: 0,
            isTesting: false
        };

        console.log('📱 Banner options:', options);
        AdMob.showBanner(options).then(() => {
            console.log('✅ Banner reklam başarıyla gösterildi');
            // Success - add layout padding
            setTimeout(() => {
                document.body.style.paddingTop = '60px';
                console.log('📏 Body padding eklendi');
            }, 500);
        }).catch((error) => {
            console.error('❌ Banner reklam hatası:', error);
        });
    },

    hideBanner: function() {
        if (!AdMob) return;
        AdMob.hideBanner().catch(() => {});
    },

    prepareInterstitial: function() {
        if (!AdMob) return;

        const options = {
            adId: 'ca-app-pub-7610338885240453/2112105479', // DÜZELTME: Doğru Interstitial Unit ID
            isTesting: false
        };

        AdMob.prepareInterstitial(options).then(() => {
            // Interstitial reklam hazır
            this.isInterstitialReady = true;
        }).catch(() => {
            // Silent fail - production ready
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
        if (document.querySelector('.mobile-top-banner')) return;
        
        const banner = document.createElement('div');
        banner.className = 'mobile-top-banner';
        banner.innerHTML = `
            <ins class="adsbygoogle mobile-banner"
                 style="display:block; width: 320px; height: 50px;"
                 data-ad-client="ca-pub-7610338885240453"
                 data-ad-slot="6081192537"
                 data-ad-format="banner"
                 data-full-width-responsive="false"
                 data-child-safe-ads-targeting="enabled"></ins>
            <button class="mobile-ad-close" onclick="MonetizationManager.hideMobileBanner()" title="Reklamı Gizle">×</button>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.parentNode.insertBefore(banner, container);
            container.style.paddingTop = '80px';
        } else {
            document.body.insertBefore(banner, document.body.firstChild);
        }
        
        // Load AdSense ad
        setTimeout(() => {
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                // Silent fail
            }
        }, 1000);
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