// 🔒 BİLGOO GÜVENLİK MANAGER'I
// Basit ve etkili güvenlik kontrolleri

class BilgooSecurity {
    constructor() {
        this.isProduction = !this.isDevelopment();
        this.initSecurity();
    }

    // Geliştirme ortamı kontrolü
    isDevelopment() {
        return location.hostname === 'localhost' || 
               location.hostname === '127.0.0.1' || 
               location.protocol === 'file:';
    }

    // Güvenlik kontrollerini başlat
    initSecurity() {
        this.setupConsoleProtection();
        this.setupDevToolsDetection();
        
        if (this.isProduction) {
            this.setupProductionSecurity();
        }
        
        this.logSecurityStatus();
    }

    // Console koruması
    setupConsoleProtection() {
        if (typeof console !== 'undefined') {
            console.warn('%c⚠️ DİKKAT!', 'font-size:20px;color:red;font-weight:bold;');
            console.warn('%cBu bölüm sadece geliştiriciler içindir. Bilinmeyen kodları buraya yapıştırmayın!', 'font-size:14px;color:orange;');
            console.warn('%cEğer birisi size buraya kod yapıştırmanızı söylediyse, büyük ihtimalle dolandırılıyorsunuz.', 'font-size:12px;color:red;');
        }
    }

    // DevTools algılama
    setupDevToolsDetection() {
        let devtools = false;
        const threshold = 160;

        const detectDevTools = () => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools) {
                    devtools = true;
                    console.warn('🔒 Geliştirici araçları algılandı!');
                }
            } else {
                devtools = false;
            }
        };

        // Her 500ms'de bir kontrol et
        setInterval(detectDevTools, 500);
    }

    // Production güvenlik önlemleri
    setupProductionSecurity() {
        // Sağ tık engelleme
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showSecurityMessage('Sağ tık devre dışı bırakılmıştır.');
        });

        // Klavye kısayolları engelleme
        document.addEventListener('keydown', (e) => {
            // F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S kısayollarını engelle
            if (e.keyCode === 123 || 
                (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
                (e.ctrlKey && e.keyCode === 85) ||
                (e.ctrlKey && e.keyCode === 83)) {
                e.preventDefault();
                this.showSecurityMessage('Bu işlem güvenlik nedeniyle engellenmiştir.');
                return false;
            }
        });

        // Sayfa kaynağını görüntüleme engelleme
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && (e.keyCode === 85)) {
                e.preventDefault();
                return false;
            }
        });

        // Metin seçimi engelleme (isteğe bağlı)
        // document.addEventListener('selectstart', (e) => {
        //     e.preventDefault();
        // });
    }

    // Güvenlik mesajı göster
    showSecurityMessage(message) {
        // Basit alert yerine custom toast message kullanılabilir
        if (!document.querySelector('.security-message')) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'security-message';
            messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f44336;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 10000;
                font-size: 14px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            `;
            messageDiv.textContent = message;
            document.body.appendChild(messageDiv);

            // 3 saniye sonra kaldır
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 3000);
        }
    }

    // Güvenlik durumu loglama
    logSecurityStatus() {
        const status = {
            production: this.isProduction,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: location.href
        };

        console.info('🔒 Güvenlik kontrolleri aktif:', status);
    }

    // Güvenli veri saklama (localStorage wrapper)
    secureStore(key, value) {
        try {
            const secureData = {
                data: value,
                timestamp: Date.now(),
                hash: this.simpleHash(JSON.stringify(value))
            };
            localStorage.setItem(key, JSON.stringify(secureData));
            return true;
        } catch (error) {
            console.error('Secure store error:', error);
            return false;
        }
    }

    // Güvenli veri okuma
    secureRetrieve(key) {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) return null;

            const secureData = JSON.parse(stored);
            const currentHash = this.simpleHash(JSON.stringify(secureData.data));
            
            if (currentHash === secureData.hash) {
                return secureData.data;
            } else {
                console.warn('Data integrity check failed for:', key);
                localStorage.removeItem(key);
                return null;
            }
        } catch (error) {
            console.error('Secure retrieve error:', error);
            return null;
        }
    }

    // Basit hash fonksiyonu
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit integer'a çevir
        }
        return hash.toString();
    }

    // XSS koruması için string temizleme
    sanitizeString(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // URL validation
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

// Global güvenlik manager'ını başlat
window.BilgooSecurity = new BilgooSecurity();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BilgooSecurity;
} 