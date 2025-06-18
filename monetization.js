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
        
        // SSL sertifika hatalarını önlemek için güvenlik ayarlarını kontrol et
        const date = new Date();
        if (Math.abs(date.getTime() - Date.now()) > 24 * 60 * 60 * 1000) {
            console.warn('Sistem saati sorunlu olabilir, AdSense yüklemede sorunlar oluşturabilir');
        }
        
        // Sayfa tamamen yüklendikten sonra yenile
        setTimeout(() => {
            this.refreshAds();
        }, 1000);
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
                if (!ad.style.minHeight) ad.style.minHeight = '100px';
                if (!ad.style.minWidth) ad.style.minWidth = '300px';
                
                // Yan panel reklamları için özel stil
                const adContainer = ad.closest('div');
                if (adContainer && adContainer.classList.contains('side-ad-container')) {
                    adContainer.style.display = 'flex';
                    adContainer.style.flexDirection = 'column';
                    adContainer.style.alignItems = 'center';
                    adContainer.style.justifyContent = 'center';
                    adContainer.style.minHeight = '250px';
                    adContainer.style.margin = '15px 10px';
                    adContainer.style.borderRadius = '10px';
                    adContainer.style.background = 'rgba(255, 255, 255, 0.1)';
                }
            });
            
            // Reklamları bir kez yükle
            if (typeof adsbygoogle !== 'undefined') {
                try {
                    // Sadece henüz yüklenmemiş reklamları yükle
                    (adsbygoogle = window.adsbygoogle || []).push({});
                    console.log(adElements.length + ' adet reklam başlatıldı');
                } catch (e) {
                    // Sessizce devam et
                    console.log('Reklam yükleme hatası: ', e);
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
            adContainer.className = 'interstitial-ad-container';
            adContainer.style.position = 'fixed';
            adContainer.style.zIndex = '9999';
            adContainer.style.top = '0';
            adContainer.style.left = '0';
            adContainer.style.width = '100%';
            adContainer.style.height = '100%';
            adContainer.style.display = 'flex';
            adContainer.style.alignItems = 'center';
            adContainer.style.justifyContent = 'center';
            adContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
            
            adContainer.innerHTML = `
                <div class="interstitial-ad" style="position: relative; width: 100%; max-width: 800px; min-height: 400px; background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <div style="position: absolute; top: 10px; right: 10px; cursor: pointer; font-size: 20px; color: #666;" class="close-ad">×</div>
                    <div style="text-align: center; margin-bottom: 15px; color: #333;"><strong>Reklam</strong> - <span class="ad-timer">5</span> saniye sonra kapatabilirsiniz</div>
                    <ins class="adsbygoogle"
                         style="display:block; min-height: 280px; width: 100%;"
                         data-ad-client="ca-pub-7610338885240453"
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
                </div>
            `;
            
            document.body.appendChild(adContainer);
            
            // Reklamı yükle
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.log('Arabulucu reklam yüklenemedi', e);
            }
            
            // Zamanlayıcı
            let seconds = 5;
            const timerEl = adContainer.querySelector('.ad-timer');
            const closeBtn = adContainer.querySelector('.close-ad');
            
            // İlk 5 saniye kapat düğmesi devre dışı
            closeBtn.style.opacity = '0.5';
            closeBtn.style.pointerEvents = 'none';
            
            const timer = setInterval(() => {
                seconds--;
                if (timerEl) timerEl.textContent = seconds;
                
                if (seconds <= 0) {
                    clearInterval(timer);
                    closeBtn.style.opacity = '1';
                    closeBtn.style.pointerEvents = 'auto';
                }
            }, 1000);
            
            // Kapatma düğmesine tıklama işleyicisi ekle
            closeBtn.addEventListener('click', () => {
                if (seconds <= 0) {
                    if (adContainer.parentNode) {
                        adContainer.parentNode.removeChild(adContainer);
                    }
                    clearInterval(timer);
                }
            });
            
            // 60 saniye sonra otomatik kapat (düğmeye basılmazsa)
            setTimeout(() => {
                if (adContainer.parentNode) {
                    adContainer.parentNode.removeChild(adContainer);
                }
            }, 60000);
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
                adContainer.style.display = 'flex';
                adContainer.style.minHeight = '250px';
                adContainer.style.width = '100%';
                adContainer.style.overflow = 'hidden';
                
                // Yan panel reklamları için özel stil
                if (adContainer.classList.contains('side-ad-container')) {
                    adContainer.style.flexDirection = 'column';
                    adContainer.style.alignItems = 'center';
                    adContainer.style.justifyContent = 'center';
                    adContainer.style.margin = '15px 10px';
                    adContainer.style.borderRadius = '10px';
                    adContainer.style.background = 'rgba(255, 255, 255, 0.1)';
                }
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