// Monetization ve Çerez Yönetimi
const MonetizationManager = {
    // Çerez tercihlerini sakla
    cookiePreferences: {
        essential: true,
        analytics: false,
        advertising: false
    },

    // Sayfa yüklendiğinde başlat
    init: function() {
        this.checkCookieConsent();
        this.setupEventListeners();
        this.initializeAds();
    },

    // Çerez onayını kontrol et
    checkCookieConsent: function() {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            this.showCookieBanner();
        } else {
            this.cookiePreferences = JSON.parse(consent);
            this.loadTracking();
        }
    },

    // Çerez banner'ını göster
    showCookieBanner: function() {
        const banner = document.getElementById('cookie-consent');
        if (banner) {
            banner.style.display = 'block';
        }
    },

    // Event listener'ları kur
    setupEventListeners: function() {
        // Tümünü kabul et
        document.getElementById('accept-all')?.addEventListener('click', () => {
            this.cookiePreferences = {
                essential: true,
                analytics: true,
                advertising: true
            };
            this.saveCookiePreferences();
            this.hideCookieBanner();
            this.loadTracking();
        });

        // Sadece gerekli
        document.getElementById('accept-essential')?.addEventListener('click', () => {
            this.cookiePreferences = {
                essential: true,
                analytics: false,
                advertising: false
            };
            this.saveCookiePreferences();
            this.hideCookieBanner();
        });

        // Ayarlar modalını aç
        document.getElementById('cookie-settings')?.addEventListener('click', () => {
            this.showCookieSettings();
        });

        // Modal kapatma
        document.getElementById('close-cookie-modal')?.addEventListener('click', () => {
            this.hideCookieSettings();
        });

        // Ayarları kaydet
        document.getElementById('save-cookie-preferences')?.addEventListener('click', () => {
            this.saveCookieSettingsFromModal();
        });
    },

    // Çerez tercihlerini kaydet
    saveCookiePreferences: function() {
        localStorage.setItem('cookieConsent', JSON.stringify(this.cookiePreferences));
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
    },

    // Çerez banner'ını gizle
    hideCookieBanner: function() {
        const banner = document.getElementById('cookie-consent');
        if (banner) {
            banner.style.display = 'none';
        }
    },

    // Çerez ayarları modalını göster
    showCookieSettings: function() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.style.display = 'block';
            
            // Mevcut tercihleri yükle
            document.getElementById('analytics-cookies').checked = this.cookiePreferences.analytics;
            document.getElementById('advertising-cookies').checked = this.cookiePreferences.advertising;
        }
    },

    // Çerez ayarları modalını gizle
    hideCookieSettings: function() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    // Modal'dan ayarları kaydet
    saveCookieSettingsFromModal: function() {
        this.cookiePreferences.analytics = document.getElementById('analytics-cookies').checked;
        this.cookiePreferences.advertising = document.getElementById('advertising-cookies').checked;
        
        this.saveCookiePreferences();
        this.hideCookieSettings();
        this.hideCookieBanner();
        this.loadTracking();
    },

    // Tracking scriptlerini yükle
    loadTracking: function() {
        if (this.cookiePreferences.analytics) {
            this.initGoogleAnalytics();
        }
        
        if (this.cookiePreferences.advertising) {
            this.initMetaPixel();
            this.initAdSense();
        }
    },

    // Google Analytics'i başlat
    initGoogleAnalytics: function() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
            console.log('Google Analytics aktif');
        }
    },

    // Meta Pixel'i başlat
    initMetaPixel: function() {
        if (typeof fbq !== 'undefined') {
            fbq('consent', 'grant');
            console.log('Meta Pixel aktif');
        }
    },

    // AdSense'i başlat
    initAdSense: function() {
        console.log('AdSense reklamları aktif');
        // AdSense reklamlarını yeniden yükle
        this.refreshAds();
    },

    // Reklamları başlat
    initializeAds: function() {
        // Sayfanın tamamen yüklenmesini bekle
        window.addEventListener('load', () => {
            // Tüm reklam alanlarının görünür olduğunu doğrula
            const adElements = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status="done"])');
            
            if (adElements.length === 0) {
                console.log('Yüklenecek reklam alanı bulunamadı veya tümü zaten yüklü');
                return;
            }
            
            adElements.forEach(ad => {
                // Minimum genişlik ve yükseklik ayarla
                ad.style.minHeight = '100px';
                ad.style.minWidth = '300px';
            });
            
            // Reklamları bir kez yükle
            if (typeof adsbygoogle !== 'undefined') {
                try {
                    // Sadece henüz yüklenmemiş reklamları yükle
                    (adsbygoogle = window.adsbygoogle || []).push({});
                    console.log(adElements.length + ' adet reklam başlatıldı');
                } catch (e) {
                    // Sessizce devam et
                }
            }
        });

        // Oyun aralarında reklam gösterme
        this.setupGameAds();
    },

    // Oyun arası reklamlar
    setupGameAds: function() {
        // Quiz tamamlandığında reklam göster
        const originalShowResult = window.quizApp?.showResult;
        if (originalShowResult) {
            window.quizApp.showResult = function() {
                MonetizationManager.showInterstitialAd();
                originalShowResult.apply(this, arguments);
            };
        }
    },

    // Arabulucu reklam göster
    showInterstitialAd: function() {
        if (this.cookiePreferences.advertising) {
            // AdSense arabulucu reklamı
            const adContainer = document.createElement('div');
            adContainer.innerHTML = `
                <div class="interstitial-ad">
                    <ins class="adsbygoogle"
                         style="display:block; min-height: 300px; min-width: 300px;"
                         data-ad-client="ca-pub-7610338885240453"
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
                    <script>
                         (adsbygoogle = window.adsbygoogle || []).push({});
                    </script>
                </div>
            `;
            document.body.appendChild(adContainer);
            
            // 5 saniye sonra kaldır
            setTimeout(() => {
                if (adContainer.parentNode) {
                    adContainer.parentNode.removeChild(adContainer);
                }
            }, 5000);
        }
    },

    // Reklamları yenile
    refreshAds: function() {
        // Önce reklam alanlarının görünür olduğunu doğrula
        const adElements = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status="done"])');
        
        if (adElements.length === 0) {
            console.log('Reklam alanı bulunamadı veya tüm reklamlar zaten yüklenmiş');
            return;
        }
        
        adElements.forEach(ad => {
            // Minimum genişlik ve yükseklik ayarla
            if (!ad.style.minHeight) ad.style.minHeight = '100px';
            if (!ad.style.minWidth) ad.style.minWidth = '300px';
            
            // Reklam alanının görünür olduğunu doğrula
            const adContainer = ad.closest('div');
            if (adContainer) {
                adContainer.style.display = 'block';
                adContainer.style.minHeight = '100px';
                adContainer.style.width = '100%';
                adContainer.style.overflow = 'hidden';
            }
        });
        
        // Sadece henüz yüklenmemiş reklamları yükle
        if (typeof adsbygoogle !== 'undefined' && adElements.length > 0) {
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
                console.log(adElements.length + ' adet reklam yüklendi');
            } catch (e) {
                // Hata olursa sessizce devam et, konsolu kirletme
                console.log('Reklamlar zaten yüklenmiş');
            }
        }
    },

    // Analytics olayları gönder
    trackEvent: function(eventName, parameters = {}) {
        if (this.cookiePreferences.analytics && typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
        
        if (this.cookiePreferences.advertising && typeof fbq !== 'undefined') {
            fbq('track', eventName, parameters);
        }
    },

    // Oyun olaylarını izle
    trackGameEvents: function() {
        // Quiz başladığında
        this.trackEvent('quiz_start', {
            category: 'game'
        });

        // Quiz tamamlandığında
        this.trackEvent('quiz_complete', {
            category: 'game',
            score: window.quizApp?.score || 0
        });

        // Yüksek skor elde edildiğinde
        this.trackEvent('high_score', {
            category: 'achievement',
            value: window.quizApp?.score || 0
        });
    }
};

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    MonetizationManager.init();
});

// Global erişim için
window.MonetizationManager = MonetizationManager; 