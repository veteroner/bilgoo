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
        
        // Sayfa tamamen yüklendikten sonra yenile
        setTimeout(() => {
            this.refreshAds();
        }, 8000); // 8 saniye gecikme (artırıldı)
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

    // Reklamları başlat - İyileştirilmiş versiyon
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
                console.log('AdSense henüz yüklenmedi, script yükleniyor...');
                
                // AdSense script'i manuel olarak yükle
                const script = document.createElement('script');
                script.async = true;
                script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7610338885240453";
                script.crossOrigin = "anonymous";
                script.referrerpolicy = "no-referrer-when-downgrade";
                
                // İlave güvenlik ayarları
                script.setAttribute('data-ad-client', 'ca-pub-7610338885240453');
                script.setAttribute('data-ad-frequency-hint', '30s');
                
                // Script başarıyla yüklendiğinde
                script.onload = () => {
                    console.log('✅ AdSense script başarıyla yüklendi');
                    
                    // AdSense'in hazır olmasını bekle
                    const checkAdSenseReady = () => {
                        if (typeof adsbygoogle !== 'undefined') {
                            console.log('✅ AdSense objesi hazır');
                            setTimeout(() => {
                                this.loadAdsWhenReady();
                            }, 2000);
                        } else {
                            console.log('AdSense objesi henüz hazır değil, tekrar kontrol ediliyor...');
                            setTimeout(checkAdSenseReady, 1000);
                        }
                    };
                    
                    checkAdSenseReady();
                };
                
                // Script yüklenemediğinde
                script.onerror = (e) => {
                    console.error('❌ AdSense script yüklenemedi:', e);
                    console.log('🔍 Olası nedenler:');
                    console.log('  1. AdSense hesabı henüz aktif değil veya onay bekliyor');
                    console.log('  2. Site AdSense\'de onaylanmamış');
                    console.log('  3. Ad blocker veya tracking prevention aktif');
                    console.log('  4. İnternet bağlantısı sorunu');
                    console.log('  5. HTTPS sertifikası sorunu');
                    
                    // Kullanıcıya bildirim göster
                    this.showAdSenseErrorNotification();
                };
                
                // Script timeout kontrolü
                setTimeout(() => {
                    if (typeof adsbygoogle === 'undefined') {
                        console.warn('⏰ AdSense script yükleme timeout - 15 saniye geçti');
                        this.showAdSenseErrorNotification();
                    }
                }, 15000);
                
                document.head.appendChild(script);
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
            // DÜZELTME: Sadece yüklenmemiş reklamları seç (data-adsbygoogle-status="done" olmayanlar)
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
                        adContainer.style.minHeight = '600px';
                        adContainer.style.width = '300px';
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
                                // Reklam hala yüklenmemiş mi kontrol et
                                if (!ad.hasAttribute('data-adsbygoogle-status') || ad.getAttribute('data-adsbygoogle-status') !== 'done') {
                                    
                                    // Reklam alanının boyutlarını kontrol et ve düzelt
                                    const rect = ad.getBoundingClientRect();
                                    console.log(`Reklam ${index + 1} boyutları:`, {
                                        width: rect.width,
                                        height: rect.height,
                                        visible: rect.width > 0 && rect.height > 0
                                    });
                                    
                                    // Eğer genişlik 0 ise, minimum boyutları ayarla
                                    if (rect.width === 0) {
                                        console.log(`Reklam ${index + 1} genişliği 0, minimum boyutlar ayarlanıyor...`);
                                        ad.style.minWidth = '320px';
                                        ad.style.width = '100%';
                                        ad.style.maxWidth = '100%';
                                        ad.style.display = 'block';
                                        
                                        // Parent container da kontrol et
                                        const parent = ad.parentElement;
                                        if (parent) {
                                            parent.style.width = '100%';
                                            parent.style.minWidth = '320px';
                                        }
                                        
                                        // Boyut düzeltmesinden sonra kısa bir bekleme
                                        setTimeout(() => {
                                            const newRect = ad.getBoundingClientRect();
                                            if (newRect.width > 0) {
                                                console.log(`Reklam ${index + 1} için push işlemi başlatılıyor... (düzeltilmiş boyut: ${newRect.width}px)`);
                                                (adsbygoogle = window.adsbygoogle || []).push({});
                                                console.log(`Reklam ${index + 1} başlatıldı`);
                                            } else {
                                                console.warn(`Reklam ${index + 1} boyut düzeltmesi başarısız, yükleme atlanıyor`);
                                            }
                                        }, 200);
                                    } else {
                                        console.log(`Reklam ${index + 1} için push işlemi başlatılıyor...`);
                                        (adsbygoogle = window.adsbygoogle || []).push({});
                                        console.log(`Reklam ${index + 1} başlatıldı`);
                                    }
                                } else {
                                    console.log(`Reklam ${index + 1} zaten yüklenmiş, işlem atlanıyor`);
                                }
                            } catch (e) {
                                console.error(`Reklam ${index + 1} yüklenirken hata:`, e);
                                // Hata detaylarını günlükle
                                if (e && e.message) {
                                    console.log('Hata mesajı:', e.message);
                                }
                            }
                        }, index * 800); // Gecikmeyi artırdık (800ms)
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
                    // Reklam elementi zaten yüklenmiş mi kontrol et
                    const adElement = adContainer.querySelector('.adsbygoogle');
                    if (adElement && (!adElement.hasAttribute('data-adsbygoogle-status') || adElement.getAttribute('data-adsbygoogle-status') !== 'done')) {
                    (adsbygoogle = window.adsbygoogle || []).push({});
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
            
            // DÜZELTME: Sadece yüklenmemiş reklamları seç (data-adsbygoogle-status="done" olmayanlar)
            const adElements = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status="done"])');
            
            if (adElements.length === 0) {
                console.log('Reklam alanı bulunamadı veya tüm reklamlar zaten yüklenmiş');
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
                        adContainer.style.minHeight = '600px';
                        adContainer.style.width = '300px';
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
                            // Reklam hala yüklenmemiş mi kontrol et
                            if (!ad.hasAttribute('data-adsbygoogle-status') || ad.getAttribute('data-adsbygoogle-status') !== 'done') {
                            console.log(`Reklam ${index + 1} yenileniyor...`);
                            (adsbygoogle = window.adsbygoogle || []).push({});
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
        banner.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            height: 60px !important;
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            z-index: 9999 !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
        `;
        
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
        
        document.body.insertBefore(banner, document.body.firstChild);
        console.log('✅ Mobil üst banner eklendi');
        
        // Body'ye padding ekle
        document.body.style.paddingTop = '60px';
        console.log('📏 Body padding-top: 60px eklendi');
        
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
                 data-full-width-responsive="false"></ins>
            <button class="mobile-ad-close" onclick="MonetizationManager.hideMobileBanner('bottom')" title="Reklamı Gizle">×</button>
        `;
        
        document.body.appendChild(banner);
        
        // AdSense reklamını yükle
        setTimeout(() => {
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
                console.log('Mobil alt banner reklamı yüklendi');
            } catch (e) {
                console.error('Mobil alt banner yüklenemedi:', e);
            }
        }, 1500);
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
            
            // Üst banner gizlenirse body padding'ini kaldır
            if (position === 'top') {
                document.body.style.paddingTop = '0';
            }
            
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
                document.body.style.paddingTop = '0';
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