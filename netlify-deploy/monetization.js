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
        
        // Mobil reklamları başlat
        this.initMobileAds();
        
        // AdSense init için gecikme ekle
        setTimeout(() => {
            this.initializeAds();
        }, 2000);
        
        // Mobil banner tercihlerini kontrol et
        this.checkMobileBannerPreferences();
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
        }, 3000);
    },

    // Reklamları başlat
    initializeAds: function() {
        try {
            // Reklam hata işleyicisi
            window.onerror = function(msg, url, line, col, error) {
                if (url && url.includes('pagead')) {
                    console.log('AdSense hatası yakalandı ve bastırıldı:', msg);
                    return true; // Hatayı bastır
                }
            };
            
            // AdSense'in yüklenmesini bekle
            if (typeof adsbygoogle === 'undefined') {
                console.log('AdSense henüz yüklenmedi, bekleniyor...');
                
                // AdSense script'i manuel olarak yükle
                const script = document.createElement('script');
                script.async = true;
                script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7610338885240453";
                script.crossOrigin = "anonymous";
                document.head.appendChild(script);
                
                // Script yüklenene kadar bekle
                script.onload = () => {
                    console.log('AdSense script yüklendi, reklamlar başlatılıyor');
                    this.loadAdsWhenReady();
                };
                
                script.onerror = (e) => {
                    console.error('AdSense script yüklenemedi:', e);
                };
                
                return;
            }
            
            this.loadAdsWhenReady();
        } catch (error) {
            console.error('Reklam başlatılırken hata:', error);
        }
    },
    
    // AdSense yüklendikten sonra reklamları yükle
    loadAdsWhenReady: function() {
        // Sayfanın tamamen yüklenmesini bekle
        if (document.readyState === 'complete') {
            this.loadAdElements();
        } else {
            window.addEventListener('load', () => {
                // 400 hatalarının önlenmesi için reklam yükleme gecikmesi
                setTimeout(() => {
                    this.loadAdElements();
                }, 1500); // 1.5 saniye gecikme
            });
        }
    },
    
    // Reklam elementlerini yükle
    loadAdElements: function() {
        // Önce tüm reklam alanlarını kontrol et ve stilleri düzelt
        const allAdElements = document.querySelectorAll('.adsbygoogle');
        console.log(`Toplam ${allAdElements.length} reklam alanı bulundu, stiller kontrol ediliyor...`);
        
        allAdElements.forEach((ad, index) => {
            // Temel stilleri zorla uygula
            ad.style.display = 'block';
            ad.style.width = '100%';
            ad.style.minWidth = '320px';
            ad.style.maxWidth = '100%';
            ad.style.visibility = 'visible';
            ad.style.opacity = '1';
            
            // Parent container'ı da kontrol et
            const parent = ad.parentElement;
            if (parent) {
                parent.style.width = '100%';
                parent.style.minWidth = '320px';
                parent.style.display = 'block';
                parent.style.visibility = 'visible';
            }
            
            console.log(`Reklam ${index + 1} stilleri düzeltildi`);
        });
        
        // Tüm reklam alanlarının görünür olduğunu doğrula
        const adElements = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status="done"])');
        
        if (adElements.length === 0) {
            console.log('Yüklenecek reklam alanı bulunamadı veya tümü zaten yüklü');
            return;
        }
        
        adElements.forEach(ad => {
            // Minimum genişlik ve yükseklik ayarla
            if (!ad.style.minHeight) ad.style.minHeight = '100px';
            if (!ad.style.minWidth) ad.style.minWidth = '320px';
            
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
        
        // Her reklam için ayrı ayrı push et
        if (typeof adsbygoogle !== 'undefined') {
            try {
                adElements.forEach((ad, index) => {
                    setTimeout(() => {
                        try {
                            // Her reklam için ayrı bir push
                            (adsbygoogle = window.adsbygoogle || []).push({});
                            console.log(`Reklam ${index + 1} başlatıldı`);
                        } catch (e) {
                            console.log(`Reklam ${index + 1} yüklenirken hata:`, e);
                        }
                    }, index * 300); // Her reklam için 300ms gecikme
                });
                
                console.log(adElements.length + ' adet reklam başlatıldı');
            } catch (e) {
                // Sessizce devam et
                console.log('Reklam yükleme hatası: ', e);
            }
        } else {
            console.log('AdSense objesi bulunamadı');
        }
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
                setTimeout(() => {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                }, 500);
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
        setTimeout(() => {
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
            
            // Her reklam için ayrı ayrı push et
            if (typeof adsbygoogle !== 'undefined' && adElements.length > 0) {
                adElements.forEach((ad, index) => {
                    setTimeout(() => {
                        try {
                            (adsbygoogle = window.adsbygoogle || []).push({});
                            console.log(`Reklam ${index + 1} yenilendi`);
                        } catch (e) {
                            console.log(`Reklam ${index + 1} yenilenirken hata:`, e);
                        }
                    }, index * 300);
                });
            }
        }, 2000);
    },

    // Mobil reklam yönetimi
    initMobileAds: function() {
        // Mobil cihaz kontrolü
        const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (!isMobile) {
            console.log('Masaüstü cihaz tespit edildi, mobil reklamlar atlanıyor');
            return;
        }
        
        console.log('Mobil cihaz tespit edildi, mobil reklamlar başlatılıyor...');
        
        // Üst banner reklam oluştur
        this.createMobileTopBanner();
        
        // Sayfa yüklendikten sonra inline reklamlar ekle
        setTimeout(() => {
            this.addMobileInlineAds();
        }, 3000);
    },

    // Mobil üst banner oluştur
    createMobileTopBanner: function() {
        // Zaten varsa ekleme
        if (document.querySelector('.mobile-top-banner')) {
            console.log('⚠️ Mobil banner zaten mevcut');
            return;
        }
        
        console.log('🎯 Mobil üst banner oluşturuluyor...');
        
        const banner = document.createElement('div');
        banner.className = 'mobile-top-banner';
        // CSS'teki stilleri kullan, JavaScript ile override etme
        
        // Gerçek AdSense reklamı ekle
        banner.innerHTML = `
            <ins class="adsbygoogle mobile-banner"
                 style="display:block; width: 320px; height: 50px;"
                 data-ad-client="ca-pub-7610338885240453"
                 data-ad-slot="1234567890"
                 data-ad-format="banner"
                 data-full-width-responsive="false"></ins>
            <button class="mobile-ad-close" onclick="MonetizationManager.hideMobileBanner('top')" title="Reklamı Gizle">×</button>
        `;
        
        // Container'ın başına ekle (body'nin başına değil)
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(banner, container.firstChild);
            console.log('✅ Mobil üst banner container başına eklendi');
        } else {
            document.body.insertBefore(banner, document.body.firstChild);
            console.log('✅ Mobil üst banner body başına eklendi');
        }
        
        // Body padding'i kaldır - artık gerek yok
        document.body.style.paddingTop = '';
        console.log('📏 Body padding kaldırıldı');
        
        // AdSense reklamını yükle
        setTimeout(() => {
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
                console.log('🎯 Mobil AdSense reklamı yüklendi');
            } catch (e) {
                console.error('❌ Mobil AdSense yüklenemedi:', e);
            }
        }, 1000);
    },

    // Mobil inline reklamlar ekle
    addMobileInlineAds: function() {
        // Kategori seçimi sonrasına reklam ekle
        const categoriesDiv = document.getElementById('categories');
        if (categoriesDiv && !categoriesDiv.querySelector('.mobile-inline-ad')) {
            const inlineAd = document.createElement('div');
            inlineAd.className = 'mobile-inline-ad';
            inlineAd.innerHTML = `
                <ins class="adsbygoogle mobile-inline"
                     style="display:block"
                     data-ad-client="ca-pub-7610338885240453"
                     data-ad-slot="1234567892"
                     data-ad-format="rectangle"
                     data-full-width-responsive="false"></ins>
            `;
            
            categoriesDiv.appendChild(inlineAd);
            
            // AdSense reklamını yükle
            setTimeout(() => {
                try {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                    console.log('Mobil inline reklam yüklendi');
                } catch (e) {
                    console.error('Mobil inline reklam yüklenemedi:', e);
                }
            }, 500);
        }
    },

    // Mobil banner gizle
    hideMobileBanner: function(position) {
        const banner = document.querySelector(`.mobile-${position}-banner`);
        if (banner) {
            banner.style.display = 'none';
            
            console.log(`Mobil ${position} banner gizlendi`);
            
            // Kullanıcı tercihini kaydet
            localStorage.setItem(`hideMobile${position.charAt(0).toUpperCase() + position.slice(1)}Banner`, 'true');
        }
    },

    // Mobil banner tercihlerini kontrol et
    checkMobileBannerPreferences: function() {
        if (localStorage.getItem('hideMobileTopBanner') === 'true') {
            const topBanner = document.querySelector('.mobile-top-banner');
            if (topBanner) {
                topBanner.style.display = 'none';
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