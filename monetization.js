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
        }, 3000); // 3 saniye gecikme
        
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
            
            // Banner'a ek bilgi ekle
            const existingText = banner.querySelector('p');
            if (existingText && !existingText.textContent.includes('Tracking Protection')) {
                existingText.innerHTML += '<br><br><strong>⚠️ Önemli:</strong> Tarayıcınızda "Tracking Prevention" veya "Gizlilik Koruması" aktifse, bu siteye özel olarak devre dışı bırakmanız önerilir. Aksi takdirde reklamlar ve bazı özellikler düzgün çalışmayabilir.';
            }
        }
    },

    // Tracking Prevention uyarısı göster
    showTrackingPreventionWarning: function() {
        // Eğer uyarı zaten varsa gösterme
        if (document.getElementById('tracking-warning')) return;
        
        const warning = document.createElement('div');
        warning.id = 'tracking-warning';
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 350px;
            font-size: 0.9rem;
            line-height: 1.4;
        `;
        
        warning.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <div style="font-size: 1.5rem;">⚠️</div>
                <div style="flex: 1;">
                    <strong>Tracking Protection Algılandı</strong><br>
                    Reklamların düzgün çalışması için tarayıcı ayarlarından bu site için tracking korumasını devre dışı bırakın.
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; padding: 0; margin-left: 5px;">×</button>
            </div>
        `;
        
        document.body.appendChild(warning);
        
        // 10 saniye sonra otomatik kapat
        setTimeout(() => {
            if (warning.parentElement) {
                warning.remove();
            }
        }, 10000);
    },

    // AdSense hata bildirimi göster
    showAdSenseErrorNotification: function() {
        // Eğer bildirim zaten varsa gösterme
        if (document.getElementById('adsense-error')) return;
        
        const notification = document.createElement('div');
        notification.id = 'adsense-error';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10002;
            max-width: 500px;
            text-align: center;
            font-size: 0.9rem;
            line-height: 1.4;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 8px;">
                <div style="font-size: 1.5rem;">🚫</div>
                <strong>AdSense Reklamları Yüklenemedi</strong>
            </div>
            <div style="font-size: 0.8rem; opacity: 0.9;">
                Reklamlar görünmeyebilir. Tracking Protection'ı kapatın veya ad blocker'ı devre dışı bırakın.
            </div>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255,255,255,0.2); 
                border: none; 
                color: white; 
                padding: 5px 10px; 
                border-radius: 5px; 
                cursor: pointer; 
                margin-top: 8px;
                font-size: 0.8rem;
            ">Tamam</button>
        `;
        
        document.body.appendChild(notification);
        
        // 15 saniye sonra otomatik kapat
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 15000);
    },

    // Tüm çerezleri kabul et (Global fonksiyon)
    acceptAllCookies: function() {
        this.cookiePreferences = {
            essential: true,
            analytics: true,
            advertising: true
        };
        this.saveCookiePreferences();
        this.hideCookieBanner();
        this.loadTracking();
        console.log('✅ Tüm çerezler kabul edildi, reklamlar yüklenecek');
        
        // Audit log'a kaydet
        if (window.AuditLogger) {
            window.AuditLogger.logConsentEvent('cookies_accepted', 'all_cookies', true, {
                method: 'banner_accept_all'
            });
        }
    },

    // Sadece gerekli çerezleri kabul et (Global fonksiyon)
    acceptEssentialOnly: function() {
        this.cookiePreferences = {
            essential: true,
            analytics: false,
            advertising: false
        };
        this.saveCookiePreferences();
        this.hideCookieBanner();
        console.log('⚠️ Sadece gerekli çerezler kabul edildi, reklamlar gösterilmeyecek');
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

    // AdSense'i başlat - İyileştirilmiş versiyon
    initAdSense: function() {
        console.log('AdSense reklamları başlatılıyor...');
        
        // Çerez onayını kontrol et
        if (!this.cookiePreferences.advertising) {
            console.log('⚠️ Reklam çerezleri onaylanmamış, AdSense yüklenmeyecek');
            this.showCookieBanner();
            return;
        }
        
        // Tracking Prevention kontrolü
        try {
            localStorage.setItem('adsense_test', 'test');
            localStorage.removeItem('adsense_test');
            console.log('✅ LocalStorage erişimi normal');
        } catch (e) {
            console.warn('⚠️ Tracking Prevention aktif - AdSense sorunları olabilir');
            console.log('Çözüm: Tarayıcı ayarlarından bu site için tracking korumasını devre dışı bırakın');
            console.log('Safari: Ayarlar > Gizlilik ve Güvenlik > Çapraz Site İzlemeyi Engelle (Kapat)');
            console.log('Chrome: Ayarlar > Gizlilik ve Güvenlik > Çerezler > Bu site için izin ver');
            console.log('Firefox: Ayarlar > Gizlilik ve Güvenlik > Gelişmiş İzleme Koruması (Standart)');
            
            // Kullanıcıya bildirim göster
            this.showTrackingPreventionWarning();
        }
        
        // Önce AdSense hesap durumunu kontrol et
        this.checkAdSenseStatus();
        
        // SSL sertifika hatalarını önlemek için güvenlik ayarlarını kontrol et
        const date = new Date();
        if (Math.abs(date.getTime() - Date.now()) > 24 * 60 * 60 * 1000) {
            console.warn('Sistem saati sorunlu olabilir, AdSense yüklemede sorunlar oluşturabilir');
        }
        
        // AdSense script'i index.html'de zaten yükleniyor, sadece elementleri yükle
        setTimeout(() => {
            this.loadAdsWhenReady();
        }, 3000); // 3 saniye gecikme
    },

    // AdSense hesap durumunu kontrol et
    checkAdSenseStatus: function() {
        // Publisher ID kontrolü
        const pubId = 'ca-pub-7610338885240453';
        console.log('AdSense Publisher ID:', pubId);
        
        // Site URL kontrolü
        const currentDomain = window.location.hostname;
        console.log('Mevcut domain:', currentDomain);
        
        if (currentDomain === 'localhost' || currentDomain === '127.0.0.1') {
            console.warn('⚠️ Localhost\'ta AdSense reklamları gösterilmez!');
            return false;
        }
        
        return true;
    },

    // Reklamları başlat - Sadece reklam elementlerini yükle
    initializeAds: function() {
        console.log('🎯 AdSense reklamları başlatılıyor...');
        
        // AdSense script zaten index.html'de yüklendiği için sadece elementleri kontrol et
        const checkAndLoadAds = () => {
            if (typeof adsbygoogle !== 'undefined') {
                console.log('✅ AdSense objesi hazır, reklamlar yükleniyor');
                this.loadAdsWhenReady();
            } else {
                console.log('⏳ AdSense objesi henüz hazır değil, 2 saniye sonra tekrar kontrol edilecek');
                setTimeout(checkAndLoadAds, 2000);
            }
        };
        
        // Hata yakalayıcı ekle
            window.onerror = function(msg, url, line, col, error) {
                if (url && url.includes('pagead')) {
                    console.log('AdSense hatası yakalandı ve bastırıldı:', msg);
                    return true; // Hatayı bastır
                }
            };
            
        checkAndLoadAds();
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
    
    // Reklam elementlerini yükle - Basitleştirilmiş versiyon
    loadAdElements: function() {
        try {
            console.log('🎯 Reklam elementleri yükleniyor...');
            
            // AdSense'in tanımlandığından emin ol
            if (typeof adsbygoogle === 'undefined') {
                console.error('❌ AdSense objesi tanımlı değil, reklamlar yüklenemiyor');
                // 5 saniye sonra tekrar dene
                setTimeout(() => {
                    this.loadAdElements();
                }, 5000);
                return;
            }

            // Sadece yüklenmemiş reklamları seç
            const adElements = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status="done"])');
            
            if (adElements.length === 0) {
                console.log('✅ Yüklenecek reklam alanı bulunamadı veya tümü zaten yüklü');
                return;
            }
            
            console.log(`📍 ${adElements.length} adet reklam alanı bulundu, yükleme başlatılıyor...`);
            
            // Her reklam için temel stiller uygula
            adElements.forEach((ad, index) => {
                // Temel boyut ve görünürlük ayarları
                ad.style.display = 'block';
                ad.style.width = '100%';
                ad.style.minWidth = '160px';
                ad.style.visibility = 'visible';
                ad.style.opacity = '1';
                
                console.log(`📝 Reklam ${index + 1} stilleri ayarlandı`);
            });
            
            // Reklamları yükle (tek seferde tümü)
                    adElements.forEach((ad, index) => {
                        setTimeout(() => {
                            try {
                        // Son bir kez kontrol et
                        if (!ad.hasAttribute('data-adsbygoogle-status') || ad.getAttribute('data-adsbygoogle-status') !== 'done') {
                            console.log(`🚀 Reklam ${index + 1} yükleniyor...`);
                                (adsbygoogle = window.adsbygoogle || []).push({
                                    child_safe_ads_targeting: 'enabled'
                                });
                            console.log(`✅ Reklam ${index + 1} yüklendi`);
                        } else {
                            console.log(`⚠️ Reklam ${index + 1} zaten yüklenmiş, atlanıyor`);
                        }
                } catch (e) {
                        console.error(`❌ Reklam ${index + 1} yüklenirken hata:`, e);
                    }
                }, index * 1000); // Her reklam için 1 saniye gecikme
            });
            
        } catch (error) {
            console.error('❌ loadAdElements fonksiyonunda beklenmeyen hata:', error);
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
                         data-full-width-responsive="true"
                         data-child-safe-ads-targeting="enabled"></ins>
                </div>
            `;
            
            document.body.appendChild(adContainer);
            
            // Reklamı yükle
            try {
                setTimeout(() => {
                    // Reklam elementi zaten yüklenmiş mi kontrol et
                    const adElement = adContainer.querySelector('.adsbygoogle');
                    if (adElement && (!adElement.hasAttribute('data-adsbygoogle-status') || adElement.getAttribute('data-adsbygoogle-status') !== 'done')) {
                    (adsbygoogle = window.adsbygoogle || []).push({
                        child_safe_ads_targeting: 'enabled'
                    });
                    }
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
        console.log('🔄 Reklamlar yenileniyor...');
        
        try {
            // Çerez onayını kontrol et
            if (!this.cookiePreferences.advertising) {
                console.log('⚠️ Reklam çerezleri onaylanmamış, reklamlar yenilenmeyecek');
                return;
            }
            
            // AdSense'in yüklü olduğundan emin ol (script index.html'de yükleniyor)
            if (typeof adsbygoogle === 'undefined') {
                console.log('⚠️ AdSense objesi tanımlı değil, 3 saniye sonra tekrar denenecek');
                    setTimeout(() => {
                        this.refreshAds();
                    }, 3000);
                return;
            }
            
            // DÜZELTME: Sadece yüklenmemiş reklamları seç (data-adsbygoogle-status="done" olmayanlar)
            const adElements = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status="done"])');
            
            if (adElements.length === 0) {
                console.log('Yenilenecek reklam alanı bulunamadı veya tüm reklamlar zaten yüklenmiş');
                return;
            }
            
            console.log(`${adElements.length} adet reklam bulundu, yenileme işlemi başlatılıyor...`);
            
            adElements.forEach((ad, index) => {
                // Reklam boyutlarını kontrol et ve düzelt
                const rect = ad.getBoundingClientRect();
                console.log(`Yenileme - Reklam ${index + 1} mevcut boyutları:`, {
                    width: rect.width,
                    height: rect.height,
                    display: ad.style.display,
                    visibility: ad.style.visibility
                });
                
                // Boyut sorunu varsa düzelt
                if (rect.width === 0 || rect.height === 0) {
                    console.log(`Yenileme - Reklam ${index + 1} boyut sorunu tespit edildi, düzeltiliyor...`);
                    
                    // Minimum boyutları ayarla
                    ad.style.minHeight = '100px';
                    ad.style.minWidth = '320px';
                    ad.style.width = '100%';
                    ad.style.maxWidth = '100%';
                    ad.style.display = 'block';
                    ad.style.visibility = 'visible';
                    
                    // Parent container'ı da kontrol et
                    const parent = ad.parentElement;
                    if (parent) {
                        parent.style.width = '100%';
                        parent.style.minWidth = '320px';
                        parent.style.display = 'block';
                        parent.style.visibility = 'visible';
                    }
                } else {
                    // Minimum boyutları yine de ayarla (güvenlik için)
                    if (!ad.style.minHeight) ad.style.minHeight = '100px';
                    if (!ad.style.minWidth) ad.style.minWidth = '320px';
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
                        adContainer.style.minHeight = '350px';
                        adContainer.style.width = '180px';
                        adContainer.style.margin = '5px';
                        adContainer.style.borderRadius = '12px';
                        adContainer.style.background = 'transparent';
                    }
                }
            });
            
            // Her reklam için ayrı ayrı push et
            if (typeof adsbygoogle !== 'undefined' && adElements.length > 0) {
                adElements.forEach((ad, index) => {
                    setTimeout(() => {
                        try {
                            // Reklam hala yüklenmemiş mi kontrol et
                            if (!ad.hasAttribute('data-adsbygoogle-status') || ad.getAttribute('data-adsbygoogle-status') !== 'done') {
                            console.log(`Reklam ${index + 1} yenileniyor...`);
                            (adsbygoogle = window.adsbygoogle || []).push({
                                child_safe_ads_targeting: 'enabled'
                            });
                            console.log(`Reklam ${index + 1} yenilendi`);
                            } else {
                                console.log(`Reklam ${index + 1} zaten yüklenmiş, işlem atlanıyor`);
                            }
                        } catch (e) {
                            console.error(`Reklam ${index + 1} yenilenirken hata:`, e);
                            // Hata durumunda temizleme işlemleri
                            if (ad.getAttribute('data-adsbygoogle-status') === 'done') {
                                // Reklamın durumu "done" olarak işaretlenmişse, ancak yine de hata varsa
                                ad.removeAttribute('data-adsbygoogle-status');
                                // Bir süre sonra tekrar deneyelim
                                setTimeout(() => {
                                    try {
                                        (adsbygoogle = window.adsbygoogle || []).push({
                                            child_safe_ads_targeting: 'enabled'
                                        });
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
                 data-full-width-responsive="false"
                 data-child-safe-ads-targeting="enabled"></ins>
            <button class="mobile-ad-close" onclick="MonetizationManager.hideMobileBanner('top')" title="Reklamı Gizle">×</button>
        `;
        
        // Container'ın hemen üstüne ekle (logo üstü)
        const container = document.querySelector('.container');
        if (container) {
            container.parentNode.insertBefore(banner, container);
            console.log('✅ Mobil üst banner container üstüne eklendi');
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
                (adsbygoogle = window.adsbygoogle || []).push({
                    child_safe_ads_targeting: 'enabled'
                });
                console.log('🎯 Mobil AdSense reklamı yüklendi');
            } catch (e) {
                console.error('❌ Mobil AdSense yüklenemedi:', e);
            }
        }, 1000);
    },

    // Mobil alt banner oluştur (opsiyonel)
    createMobileBottomBanner: function() {
        // Zaten varsa ekleme
        if (document.querySelector('.mobile-bottom-banner')) {
            return;
        }
        
        const banner = document.createElement('div');
        banner.className = 'mobile-bottom-banner';
        banner.innerHTML = `
            <ins class="adsbygoogle mobile-banner"
                 style="display:block"
                 data-ad-client="ca-pub-7610338885240453"
                 data-ad-slot="1234567891"
                 data-ad-format="banner"
                 data-full-width-responsive="false"
                 data-child-safe-ads-targeting="enabled"></ins>
            <button class="mobile-ad-close" onclick="MonetizationManager.hideMobileBanner('bottom')" title="Reklamı Gizle">×</button>
        `;
        
        document.body.appendChild(banner);
        
        // AdSense reklamını yükle
        setTimeout(() => {
            try {
                (adsbygoogle = window.adsbygoogle || []).push({
                    child_safe_ads_targeting: 'enabled'
                });
                console.log('Mobil alt banner reklamı yüklendi');
            } catch (e) {
                console.error('Mobil alt banner yüklenemedi:', e);
            }
        }, 1500);
    },

    // Mobil inline reklamlar ekle - DEVRE DIŞI
    addMobileInlineAds: function() {
        // Kategori içindeki inline reklamlar kaldırıldı
        // Sadece üst banner reklamı aktif kalacak
        console.log('Kategori inline reklamlar devre dışı bırakıldı');
        
        // Mevcut inline reklamları temizle
        this.removeExistingInlineAds();
    },
    
    // Mevcut inline reklamları kaldır
    removeExistingInlineAds: function() {
        const existingInlineAds = document.querySelectorAll('.mobile-inline-ad');
        existingInlineAds.forEach(ad => {
            console.log('Mevcut inline reklam kaldırılıyor:', ad);
            ad.remove();
        });
        
        // Kategoriler container'ında kalan herhangi bir adsense elemanını temizle
        const categoriesDiv = document.getElementById('categories');
        if (categoriesDiv) {
            const inlineAdsenseElements = categoriesDiv.querySelectorAll('.adsbygoogle.mobile-inline');
            inlineAdsenseElements.forEach(ad => {
                console.log('Kategoriler içindeki AdSense elemanı kaldırılıyor:', ad);
                ad.parentElement?.remove();
            });
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
        
        if (localStorage.getItem('hideMobileBottomBanner') === 'true') {
            const bottomBanner = document.querySelector('.mobile-bottom-banner');
            if (bottomBanner) {
                bottomBanner.style.display = 'none';
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