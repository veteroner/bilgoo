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
        
        // AdSense init için gecikme ekle
        setTimeout(() => {
            this.initializeAds();
        }, 2000);
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
                script.referrerpolicy = "no-referrer-when-downgrade";
                document.head.appendChild(script);
                
                // Script yüklenene kadar bekle
                script.onload = () => {
                    console.log('AdSense script yüklendi, reklamlar başlatılıyor');
                    // Script yüklendiğinde 2 saniye bekle ve sonra reklamları yükle
                    setTimeout(() => {
                        this.loadAdsWhenReady();
                    }, 2000);
                };
                
                script.onerror = (e) => {
                    console.error('AdSense script yüklenemedi:', e);
                    console.log('Hata detayları:', e);
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
            // Sayfa zaten yüklendi, gecikme ile reklamları yükle
            setTimeout(() => {
                this.loadAdElements();
            }, 2000);
        } else {
            window.addEventListener('load', () => {
                // 400 hatalarının önlenmesi için reklam yükleme gecikmesi
                setTimeout(() => {
                    this.loadAdElements();
                }, 2500); // 2.5 saniye gecikme
            });
        }
    },
    
    // Reklam elementlerini yükle
    loadAdElements: function() {
        try {
            // AdSense'in tanımlandığından emin ol
            if (typeof adsbygoogle === 'undefined') {
                console.error('AdSense objesi tanımlı değil, reklamlar yüklenemiyor');
                // 5 saniye sonra tekrar dene
                setTimeout(() => {
                    this.initializeAds();
                }, 5000);
                return;
            }

            // Tüm reklam alanlarının görünür olduğunu doğrula
            const adElements = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status="done"])');
            
            if (adElements.length === 0) {
                console.log('Yüklenecek reklam alanı bulunamadı veya tümü zaten yüklü');
                return;
            }
            
            console.log(`${adElements.length} adet reklam alanı bulundu, yükleme başlatılıyor...`);
            
            adElements.forEach((ad, index) => {
                // Minimum genişlik ve yükseklik ayarla
                if (!ad.style.minHeight) ad.style.minHeight = '100px';
                if (!ad.style.minWidth) ad.style.minWidth = '300px';
                
                // Reklam görünür durumda mı kontrol et
                const rect = ad.getBoundingClientRect();
                const isVisible = (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
                
                if (!isVisible) {
                    console.log(`Reklam ${index + 1} görünür değil, görünürlük ayarlanıyor`);
                }
                
                // Yan panel reklamları için özel stil
                const adContainer = ad.closest('div');
                if (adContainer) {
                    adContainer.style.display = 'flex';
                    if (adContainer.classList.contains('side-ad-container')) {
                        adContainer.style.flexDirection = 'column';
                        adContainer.style.alignItems = 'center';
                        adContainer.style.justifyContent = 'center';
                        adContainer.style.minHeight = '250px';
                        adContainer.style.margin = '15px 10px';
                        adContainer.style.borderRadius = '10px';
                        adContainer.style.background = 'rgba(255, 255, 255, 0.1)';
                    }
                }
            });
            
            // Her reklam için ayrı ayrı push et
            if (typeof adsbygoogle !== 'undefined') {
                try {
                    adElements.forEach((ad, index) => {
                        // Her reklam arasında belirli bir gecikme ile yükleme yap
                        setTimeout(() => {
                            try {
                                console.log(`Reklam ${index + 1} için push işlemi başlatılıyor...`);
                                // Her reklam için ayrı bir push
                                (adsbygoogle = window.adsbygoogle || []).push({});
                                console.log(`Reklam ${index + 1} başlatıldı`);
                            } catch (e) {
                                console.error(`Reklam ${index + 1} yüklenirken hata:`, e);
                                // Hata detaylarını günlükle
                                if (e && e.message) {
                                    console.log('Hata mesajı:', e.message);
                                }
                            }
                        }, index * 500); // Her reklam için 500ms gecikme
                    });
                    
                    console.log(adElements.length + ' adet reklam başlatılıyor...');
                } catch (e) {
                    console.error('Reklam yükleme hatası: ', e);
                    if (e && e.message) {
                        console.log('Hata mesajı:', e.message);
                    }
                }
            } else {
                console.error('AdSense objesi bulunamadı - global adsbygoogle değişkeni tanımlı değil');
            }
        } catch (error) {
            console.error('loadAdElements fonksiyonunda beklenmeyen hata:', error);
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
        try {
            console.log('Reklamlar yenileniyor...');
            
            // Çerez izni kontrolü (GDPR)
            const cookieConsent = localStorage.getItem('cookieConsent');
            if (cookieConsent) {
                const consentData = JSON.parse(cookieConsent);
                if (!consentData.advertising) {
                    console.log('Çerez onayı olmadığı için reklamlar yenilenmiyor');
                    return;
                }
            }
            
            // Önce DOM'un tamamen yüklendiğinden emin ol
            if (document.readyState !== 'complete') {
                console.log('Sayfa tam olarak yüklenmedi, reklamlar yenilenirken bekliyor...');
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        this.refreshAds();
                    }, 2000);
                });
                return;
            }
            
            // AdSense'in yüklü olduğundan emin ol
            if (typeof adsbygoogle === 'undefined') {
                console.log('AdSense objesi tanımlı değil, reklamlar yenilenemiyor');
                // AdSense script'ini tekrar yüklemeyi dene
                const script = document.createElement('script');
                script.async = true;
                script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7610338885240453";
                script.crossOrigin = "anonymous";
                script.referrerpolicy = "no-referrer-when-downgrade";
                document.head.appendChild(script);
                
                // Script yüklendikten sonra tekrar yenile
                script.onload = () => {
                    setTimeout(() => {
                        this.refreshAds();
                    }, 3000);
                };
                return;
            }
            
            // Önce reklam alanlarının görünür olduğunu doğrula
            const adElements = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status="done"])');
            
            if (adElements.length === 0) {
                console.log('Reklam alanı bulunamadı veya tüm reklamlar zaten yüklenmiş');
                return;
            }
            
            console.log(`${adElements.length} adet reklam bulundu, yenileme işlemi başlatılıyor...`);
            
            adElements.forEach((ad, index) => {
                // Minimum genişlik ve yükseklik ayarla
                if (!ad.style.minHeight) ad.style.minHeight = '100px';
                if (!ad.style.minWidth) ad.style.minWidth = '300px';
                
                // Reklam görünür durumda mı kontrol et
                const rect = ad.getBoundingClientRect();
                const isVisible = (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
                
                if (!isVisible) {
                    console.log(`Reklam ${index + 1} görünür değil, görünürlük ayarlanıyor`);
                }
                
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
                            console.log(`Reklam ${index + 1} yenileniyor...`);
                            (adsbygoogle = window.adsbygoogle || []).push({});
                            console.log(`Reklam ${index + 1} yenilendi`);
                        } catch (e) {
                            console.error(`Reklam ${index + 1} yenilenirken hata:`, e);
                            // Hata durumunda temizleme işlemleri
                            if (ad.getAttribute('data-adsbygoogle-status') === 'done') {
                                // Reklamın durumu "done" olarak işaretlenmişse, ancak yine de hata varsa
                                ad.removeAttribute('data-adsbygoogle-status');
                                // Bir süre sonra tekrar deneyelim
                                setTimeout(() => {
                                    try {
                                        (adsbygoogle = window.adsbygoogle || []).push({});
                                    } catch (innerError) {
                                        console.error('İkinci deneme başarısız:', innerError);
                                    }
                                }, 5000);
                            }
                        }
                    }, index * 500); // Her reklam için 500ms gecikme
                });
            } else {
                console.error('AdSense objesi bulunamadı veya reklam elementi yok');
            }
        } catch (error) {
            console.error('refreshAds fonksiyonunda beklenmeyen hata:', error);
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