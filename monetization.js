// Monetization ve Çerez Yönetimi
// AdMob Plugin Import (sadece Capacitor environment'ta çalışır)
let AdMob = null;
try {
    if (window.Capacitor && window.Capacitor.Plugins) {
        AdMob = window.Capacitor.Plugins.AdMob;
    }
} catch (e) {
    console.log('AdMob plugin bulunamadı - web environment');
}

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
        
        // Periyodik reklam kontrolü başlat
        this.startPeriodicAdCheck();
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
            
            // Dil desteğini uygula
            setTimeout(() => {
                if (window.updateCookieConsentLanguage) {
                    window.updateCookieConsentLanguage();
                }
            }, 100);
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

    // Reklamları yenile - İYİLEŞTİRİLMİŞ VERSİYON
    refreshAds: function() {
        console.log('🔄 Reklamlar yenileniyor (İyileştirilmiş)...');
        
        try {
            // Çerez onayını kontrol et
            if (!this.cookiePreferences.advertising) {
                console.log('⚠️ Reklam çerezleri onaylanmamış, reklamlar yenilenmeyecek');
                return;
            }
            
            // AdSense'in yüklü olduğundan emin ol
            if (typeof adsbygoogle === 'undefined') {
                console.log('⚠️ AdSense objesi tanımlı değil, 3 saniye sonra tekrar denenecek');
                setTimeout(() => {
                    this.refreshAds();
                }, 3000);
                return;
            }
            
            // TÜM reklam elementlerini bul (yüklenmiş ve yüklenmemiş)
            const allAdElements = document.querySelectorAll('.adsbygoogle');
            console.log(`📊 Toplam ${allAdElements.length} reklam elementi bulundu`);
            
            // Yüklenmemiş reklamları bul
            const unloadedAds = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status="done"])');
            
            // Yüklenmiş ama görünmeyen reklamları bul (KAYBOLMUŞ REKLAMLAR)
            const loadedButHiddenAds = [];
            document.querySelectorAll('.adsbygoogle[data-adsbygoogle-status="done"]').forEach(ad => {
                const rect = ad.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(ad);
                
                // Reklam yüklenmiş ama görünmüyor mu?
                if (rect.width === 0 || rect.height === 0 || 
                    computedStyle.display === 'none' || 
                    computedStyle.visibility === 'hidden' ||
                    ad.innerHTML.trim() === '') {
                    
                    console.log('🔍 Kaybolmuş reklam tespit edildi:', {
                        width: rect.width,
                        height: rect.height,
                        display: computedStyle.display,
                        visibility: computedStyle.visibility,
                        innerHTML: ad.innerHTML.length
                    });
                    
                    loadedButHiddenAds.push(ad);
                }
            });
            
            const totalAdsToProcess = unloadedAds.length + loadedButHiddenAds.length;
            
            if (totalAdsToProcess === 0) {
                console.log('✅ Tüm reklamlar düzgün çalışıyor, yenileme gerekmiyor');
                return;
            }
            
            console.log(`🎯 ${unloadedAds.length} yüklenmemiş + ${loadedButHiddenAds.length} kaybolmuş = ${totalAdsToProcess} reklam işlenecek`);
            
            // Yüklenmemiş reklamları işle
            this.processAdElements(unloadedAds, 'Yüklenmemiş');
            
            // Kaybolmuş reklamları işle (önce durumlarını resetle)
            loadedButHiddenAds.forEach((ad, index) => {
                console.log(`🔄 Kaybolmuş reklam ${index + 1} resetleniyor...`);
                
                // AdSense durumunu resetle
                ad.removeAttribute('data-adsbygoogle-status');
                ad.removeAttribute('data-ad-status');
                
                // Style'ları resetle
                ad.style.display = 'block';
                ad.style.visibility = 'visible';
                ad.style.width = '100%';
                ad.style.minWidth = '320px';
                ad.style.minHeight = '100px';
                
                // Parent container'ı da resetle
                const parent = ad.parentElement;
                if (parent) {
                    parent.style.display = 'block';
                    parent.style.visibility = 'visible';
                }
            });
            
            // Resetlenmiş reklamları işle
            setTimeout(() => {
                this.processAdElements(loadedButHiddenAds, 'Resetlenmiş');
            }, 1000);
            
        } catch (error) {
            console.error('❌ refreshAds fonksiyonunda hata:', error);
        }
    },

    // Reklam elementlerini işle - YENİ YARDIMCI FONKSİYON
    processAdElements: function(adElements, type) {
        if (adElements.length === 0) return;
        
        console.log(`🎯 ${adElements.length} adet ${type} reklam işleniyor...`);
        
        adElements.forEach((ad, index) => {
            // Reklam boyutlarını kontrol et ve düzelt
            const rect = ad.getBoundingClientRect();
            
            // Boyut sorunu varsa düzelt
            if (rect.width === 0 || rect.height === 0) {
                console.log(`📏 ${type} reklam ${index + 1} boyut sorunu düzeltiliyor...`);
                
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
            }
            
            // Reklam alanının görünür olduğunu doğrula
            const adContainer = ad.closest('div');
            if (adContainer) {
                adContainer.style.display = 'flex';
                adContainer.style.minHeight = '250px';
                adContainer.style.width = '100%';
                adContainer.style.overflow = 'hidden';
                
                // Mobil banner için özel kontrol - container margin'e dokunma
                if (adContainer.classList.contains('mobile-top-banner')) {
                    adContainer.style.display = 'block';
                    adContainer.style.position = 'fixed';
                    adContainer.style.top = '0';
                    adContainer.style.left = '0';
                    adContainer.style.width = '100%';
                    adContainer.style.zIndex = '1000';
                    // Ana container'ın margin ayarlarını değiştirme
                }
            }
        });
        
        // Her reklam için ayrı ayrı push et
        adElements.forEach((ad, index) => {
            setTimeout(() => {
                try {
                    console.log(`🚀 ${type} reklam ${index + 1} yükleniyor...`);
                    (adsbygoogle = window.adsbygoogle || []).push({
                        child_safe_ads_targeting: 'enabled'
                    });
                    console.log(`✅ ${type} reklam ${index + 1} yüklendi`);
                } catch (e) {
                    console.error(`❌ ${type} reklam ${index + 1} yüklenirken hata:`, e);
                }
            }, index * 1000); // Her reklam için 1 saniye gecikme
        });
    },

    // Mobil reklam yönetimi
    initMobileAds: function() {
        // Platform kontrolü
        const isAndroidApp = window.Capacitor && window.Capacitor.getPlatform() === 'android';
        const isMobileWeb = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        console.log('📱 Platform tespiti:');
        console.log('- Android App:', isAndroidApp);
        console.log('- Mobile Web:', isMobileWeb);
        console.log('- Capacitor Platform:', window.Capacitor?.getPlatform());
        
        if (isAndroidApp) {
            console.log('Android uygulaması tespit edildi, AdMob reklamları başlatılıyor...');
            this.initAdMob();
        } else if (isMobileWeb) {
            console.log('Mobil web tespit edildi, AdSense reklamları başlatılıyor...');
            // Üst banner reklam oluştur
            this.createMobileTopBanner();
            
            // Sayfa yüklendikten sonra inline reklamlar ekle
            setTimeout(() => {
                this.addMobileInlineAds();
            }, 3000);
        } else {
            console.log('Masaüstü cihaz tespit edildi, mobil reklamlar atlanıyor');
            return;
        }
    },

    // AdMob Test ve Debug Fonksiyonu
    testAdMobConnection: function() {
        console.log('🔧 AdMob Bağlantı Testi Başlatılıyor...');
        console.log('========================');
        
        // 1. Capacitor kontrolü
        console.log('1. Capacitor Durumu:');
        console.log('   - window.Capacitor:', !!window.Capacitor);
        console.log('   - Platform:', window.Capacitor?.getPlatform());
        console.log('   - Plugins:', Object.keys(window.Capacitor?.Plugins || {}));
        
        // 2. AdMob plugin kontrolü
        console.log('2. AdMob Plugin Durumu:');
        console.log('   - AdMob Plugin:', !!AdMob);
        console.log('   - Plugin Type:', typeof AdMob);
        
        if (AdMob) {
            console.log('   - Plugin Methods:', Object.getOwnPropertyNames(AdMob));
        }
        
        // 3. Test reklamını göstermeyi dene
        if (AdMob) {
            console.log('3. Test Banner Reklamı Deneniyor...');
            
            const testBannerOptions = {
                adId: 'ca-app-pub-7610338885240453/6081192537', // Gerçek Banner Unit ID
                adSize: 'BANNER',
                position: 'TOP_CENTER',
                margin: 0,
                isTesting: false
            };
            
            AdMob.showBanner(testBannerOptions).then(() => {
                console.log('✅ TEST BANNER BAŞARILI! AdMob çalışıyor.');
                console.log('🎯 Şimdi kendi reklam ID\'nizle deneyin.');
            }).catch((error) => {
                console.error('❌ TEST BANNER BAŞARISIZ:', error);
                console.log('🔍 Hata detayları:', JSON.stringify(error));
            });
        } else {
            console.log('❌ AdMob plugin bulunamadı! Plugin kurulumu gerekli.');
        }
        
        console.log('========================');
    },

    // AdMob Android reklamları başlat
    initAdMob: function() {
        if (!AdMob) {
            console.log('❌ AdMob plugin bulunamadı - Capacitor plugini yüklü mü kontrol edin');
            console.log('Debug: window.Capacitor:', window.Capacitor);
            console.log('Debug: window.Capacitor.Plugins:', window.Capacitor?.Plugins);
            return;
        }

        console.log('🚀 AdMob başlatılıyor...');

        // AdMob'u başlat - GERÇEK REKLAMLAR
        AdMob.initialize({
            requestTrackingAuthorization: true,
            testingDevices: [], // Test cihaz listesi boşaltıldı
            initializeForTesting: false // TEST MODU KAPALI - GERÇEK REKLAMLAR!
        }).then(() => {
            console.log('✅ AdMob başarıyla başlatıldı (Gerçek Reklamlar)');
            console.log('🎯 Gerçek reklamlar gösterilecek');
            
            // 2 saniye bekle, sonra banner reklam göster
            setTimeout(() => {
                this.showAdMobBanner();
            }, 2000);
            
            // 3 saniye bekle, sonra interstitial reklamı hazırla
            setTimeout(() => {
                this.prepareInterstitialAd();
            }, 3000);
            
        }).catch((error) => {
            console.error('❌ AdMob başlatılamadı:', error);
            console.log('Debug: AdMob Initialize Error Details:', JSON.stringify(error));
            
            // Eğer plugin eksikse kullanıcıya bildir
            if (error.message && error.message.includes('Plugin')) {
                console.log('💡 Çözüm: npm install @capacitor-community/admob komutu ile AdMob plugin\'i kurun');
                console.log('💡 Sonrasında: npx cap sync android komutu çalıştırın');
            }
        });
    },

    // AdMob Banner reklamı göster
    showAdMobBanner: function() {
        if (!AdMob) return;

        const bannerOptions = {
            adId: 'ca-app-pub-7610338885240453/6081192537', // Gerçek Banner Unit ID
            adSize: 'BANNER',
            position: 'TOP_CENTER',
            margin: 0,
            isTesting: false // Gerçek reklamlar aktif!
        };

        console.log('🎯 AdMob Banner gösteriliyor...', bannerOptions);

        AdMob.showBanner(bannerOptions).then(() => {
            console.log('✅ AdMob Banner başarıyla gösterildi');
        }).catch((error) => {
            console.error('❌ AdMob Banner gösterilemedi:', error);
            // Hata durumunda debug bilgileri
            console.log('Debug: Banner Options:', bannerOptions);
            console.log('Debug: AdMob Plugin Status:', AdMob);
        });
    },

    // Interstitial reklam hazırla
    prepareInterstitialAd: function() {
        if (!AdMob) return;

        const interstitialOptions = {
            adId: 'ca-app-pub-7610338885240453/2986050515', // Gerçek Interstitial Unit ID
            isTesting: false // Gerçek reklamlar aktif!
        };

        console.log('🎯 AdMob Interstitial hazırlanıyor...', interstitialOptions);

        AdMob.prepareInterstitial(interstitialOptions).then(() => {
            console.log('✅ AdMob Interstitial başarıyla hazırlandı');
        }).catch((error) => {
            console.error('❌ AdMob Interstitial hazırlanamadı:', error);
            // Hata durumunda debug bilgileri
            console.log('Debug: Interstitial Options:', interstitialOptions);
        });
    },

    // Interstitial reklam göster (oyun aralarında kullanın)
    showInterstitialAd: function() {
        if (!AdMob) {
            console.warn('⚠️ AdMob plugin bulunamadı');
            return;
        }

        console.log('🎯 AdMob Interstitial gösteriliyor...');

        AdMob.showInterstitial().then(() => {
            console.log('✅ AdMob Interstitial başarıyla gösterildi');
            // Yeni interstitial hazırla
            setTimeout(() => {
                this.prepareInterstitialAd();
            }, 1000);
        }).catch((error) => {
            console.error('❌ AdMob Interstitial gösterilemedi:', error);
            console.log('Debug: Interstitial hazırlıklı mı kontrol ediliyor...');
            // Hata durumunda yeniden hazırla
            setTimeout(() => {
                this.prepareInterstitialAd();
            }, 2000);
        });
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
                 data-ad-slot="6081192537"
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
            
            // Container'a otomatik padding ekle - CSS'i bozmadan
            if (!container.style.paddingTop || container.style.paddingTop === '0px') {
                container.style.paddingTop = '80px';
            }
            // marginTop'u değiştirme - CSS merkezlemeyi bozar
            console.log('📏 Container padding-top: 80px eklendi');
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
                 data-ad-slot="6081192537"
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
            
            // Eğer üst banner gizleniyorsa container padding'i kaldır
            if (position === 'top') {
                const container = document.querySelector('.container');
                if (container) {
                    container.style.paddingTop = '15px';
                    // marginTop'u resetleme - CSS merkezlemeyi bozar
                    console.log('📏 Container padding-top sıfırlandı');
                }
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
                
                // Container padding'i de kaldır
                const container = document.querySelector('.container');
                if (container) {
                    container.style.paddingTop = '15px';
                    // marginTop'u resetleme - CSS merkezlemeyi bozar
                    console.log('📏 Container padding-top sıfırlandı (tercihler)');
                }
            }
        }
        
        if (localStorage.getItem('hideMobileBottomBanner') === 'true') {
            const bottomBanner = document.querySelector('.mobile-bottom-banner');
            if (bottomBanner) {
                bottomBanner.style.display = 'none';
            }
        }
    },

    // Mobil banner durumunu kontrol et - YENİ FONKSİYON
    checkMobileBannerStatus: function() {
        const topBanner = document.querySelector('.mobile-top-banner');
        if (topBanner) {
            const isHidden = localStorage.getItem('hideMobileTopBanner') === 'true';
            const rect = topBanner.getBoundingClientRect();
            
            console.log('📱 Mobil banner durumu:', {
                hidden: isHidden,
                width: rect.width,
                height: rect.height,
                display: topBanner.style.display
            });
            
            // Eğer banner gizli değilse ama görünmüyorsa tekrar göster
            if (!isHidden && (rect.width === 0 || rect.height === 0 || topBanner.style.display === 'none')) {
                console.log('🔄 Mobil banner tekrar gösteriliyor...');
                topBanner.style.display = 'block';
                
                // Container padding'i de düzelt - margin'e dokunma
                const container = document.querySelector('.container');
                if (container) {
                    container.style.paddingTop = '80px';
                    // marginTop'u değiştirme - CSS merkezlemeyi bozar
                }
            }
                 }
     },

    // Periyodik reklam kontrolü başlat - YENİ FONKSİYON
    startPeriodicAdCheck: function() {
        console.log('⏰ Periyodik reklam kontrolü başlatıldı (2 dakikada bir)');
        
        // İlk kontrol 30 saniye sonra
        setTimeout(() => {
            this.performAdHealthCheck();
        }, 30000);
        
        // Her 2 dakikada bir kontrol et
        setInterval(() => {
            this.performAdHealthCheck();
        }, 120000); // 2 dakika = 120000ms
    },

    // Reklam sağlık kontrolü - YENİ FONKSİYON
    performAdHealthCheck: function() {
        if (!this.cookiePreferences.advertising) {
            return; // Reklam izni yoksa kontrol etme
        }
        
        console.log('🔍 Reklam sağlık kontrolü yapılıyor...');
        
        // Mobil banner'ı kontrol et
        this.checkMobileBannerStatus();
        
        // Tüm reklamları kontrol et
        const allAds = document.querySelectorAll('.adsbygoogle');
        let problematicAds = 0;
        
        allAds.forEach((ad, index) => {
            const rect = ad.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(ad);
            const hasContent = ad.innerHTML.trim().length > 0;
            
            // Reklam problemi var mı?
            const hasIssue = rect.width === 0 || rect.height === 0 || 
                           computedStyle.display === 'none' || 
                           computedStyle.visibility === 'hidden' ||
                           !hasContent;
            
            if (hasIssue) {
                problematicAds++;
                console.log(`⚠️ Problemli reklam ${index + 1}:`, {
                    width: rect.width,
                    height: rect.height,
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    hasContent: hasContent
                });
            }
        });
        
        if (problematicAds > 0) {
            console.log(`🔄 ${problematicAds} problemli reklam bulundu, yenileme başlatılıyor...`);
            this.refreshAds();
        } else {
            console.log('✅ Tüm reklamlar sağlıklı durumda');
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

// Test fonksiyonunu global erişim için ayrıca ekle
window.testAdMobConnection = function() {
    MonetizationManager.testAdMobConnection();
};

// Debug fonksiyonları - Console'dan kullanım için
window.debugAds = function() {
    console.log('🔧 REKLAM DEBUG RAPORU');
    console.log('======================');
    
    const allAds = document.querySelectorAll('.adsbygoogle');
    console.log(`📊 Toplam reklam sayısı: ${allAds.length}`);
    
    allAds.forEach((ad, index) => {
        const rect = ad.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(ad);
        
        console.log(`🎯 Reklam ${index + 1}:`, {
            'data-ad-status': ad.getAttribute('data-adsbygoogle-status'),
            'boyutlar': `${rect.width}x${rect.height}`,
            'display': computedStyle.display,
            'visibility': computedStyle.visibility,
            'innerHTML uzunluğu': ad.innerHTML.length,
            'parent class': ad.parentElement?.className || 'yok'
        });
    });
    
    // Mobil banner durumu
    const banner = document.querySelector('.mobile-top-banner');
    if (banner) {
        const bannerRect = banner.getBoundingClientRect();
        console.log('📱 Mobil Banner:', {
            'boyutlar': `${bannerRect.width}x${bannerRect.height}`,
            'display': banner.style.display,
            'localStorage gizli': localStorage.getItem('hideMobileTopBanner')
        });
    }
    
    console.log('======================');
};

window.forceRefreshAds = function() {
    console.log('🔄 Reklamlar zorla yenileniyor...');
    MonetizationManager.refreshAds();
};

window.resetBannerPreferences = function() {
    localStorage.removeItem('hideMobileTopBanner');
    localStorage.removeItem('hideMobileBottomBanner');
    console.log('🔄 Banner tercihleri sıfırlandı, sayfa yenileyin');
}; 