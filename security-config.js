// 🔒 GÜVENLİK KONFİGÜRASYONU
// Bu dosya uygulamanın güvenlik ayarlarını yönetir

class SecurityManager {
    constructor() {
        this.PRODUCTION_MODE = this.detectProductionMode();
        this.SECURITY_KEY = this.generateSecurityKey();
        this.ALLOWED_DOMAINS = ['localhost', '127.0.0.1', 'bilgoo.com', '*.bilgoo.com'];
        this.BLOCKED_PATTERNS = ['<script', 'javascript:', 'eval\\(', 'onclick=', 'onerror='];
        
        this.initSecurity();
    }
    
    // Production mode tespiti
    detectProductionMode() {
        const hostname = window.location.hostname;
        return hostname !== 'localhost' && 
               !hostname.includes('127.0.0.1') && 
               !hostname.includes('192.168.');
    }
    
    // Güvenlik anahtarı oluştur
    generateSecurityKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 32; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    // Güvenlik başlatma
    initSecurity() {
        this.setupCSP();
        this.blockDebugConsole();
        this.preventContextMenu();
        this.blockDevTools();
        this.sanitizeInputs();
    }
    
    // Content Security Policy
    setupCSP() {
        if (this.PRODUCTION_MODE) {
            const meta = document.createElement('meta');
            meta.httpEquiv = 'Content-Security-Policy';
            meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googleapis.com https://apis.google.com https://www.gstatic.com https://cdnjs.cloudflare.com https://*.firebaseapp.com https://*.firebaseio.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.firebaseapp.com https://*.firebaseio.com https://firestore.googleapis.com";
            document.head.appendChild(meta);
        }
    }
    
    // Console debug engelleme (production'da)
    blockDebugConsole() {
        if (this.PRODUCTION_MODE) {
            // Console'u devre dışı bırak
            window.console = {
                log: () => {},
                warn: () => {},
                error: () => {},
                info: () => {},
                debug: () => {},
                trace: () => {},
                clear: () => {},
                dir: () => {},
                group: () => {},
                groupEnd: () => {},
                time: () => {},
                timeEnd: () => {}
            };
        }
    }
    
    // Sağ tık menü engelleme (production'da)
    preventContextMenu() {
        if (this.PRODUCTION_MODE) {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                return false;
            });
            
            // F12, Ctrl+Shift+I vb. engelleme
            document.addEventListener('keydown', (e) => {
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
                    (e.ctrlKey && e.key === 'U')) {
                    e.preventDefault();
                    return false;
                }
            });
        }
    }
    
    // DevTools tespiti
    blockDevTools() {
        if (this.PRODUCTION_MODE) {
            let devtools = {
                open: false,
                orientation: null
            };
            
            const threshold = 160;
            
            setInterval(() => {
                if (window.outerHeight - window.innerHeight > threshold || 
                    window.outerWidth - window.innerWidth > threshold) {
                    if (!devtools.open) {
                        devtools.open = true;
                        this.handleDevToolsOpen();
                    }
                } else {
                    devtools.open = false;
                }
            }, 500);
        }
    }
    
    // DevTools açıldığında
    handleDevToolsOpen() {
        // Sayfa içeriğini gizle
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial;"><h2>⚠️ Güvenlik İhlali Tespit Edildi</h2></div>';
        
        // Sayfa yönlendirmesi
        setTimeout(() => {
            window.location.href = 'about:blank';
        }, 2000);
    }
    
    // Input sanitization
    sanitizeInputs() {
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                e.target.value = this.sanitizeString(e.target.value);
            }
        });
    }
    
    // String sanitization
    sanitizeString(str) {
        if (typeof str !== 'string') return str;
        
        // XSS koruması
        this.BLOCKED_PATTERNS.forEach(pattern => {
            const regex = new RegExp(pattern, 'gi');
            str = str.replace(regex, '');
        });
        
        // HTML encode
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
    
    // LocalStorage güvenli erişim
    secureLocalStorage = {
        setItem: (key, value) => {
            try {
                const encryptedValue = this.encrypt(JSON.stringify(value));
                localStorage.setItem(key, encryptedValue);
            } catch (e) {
                // Hata durumunda sessizce başarısız ol
            }
        },
        
        getItem: (key) => {
            try {
                const encryptedValue = localStorage.getItem(key);
                if (!encryptedValue) return null;
                
                const decryptedValue = this.decrypt(encryptedValue);
                return JSON.parse(decryptedValue);
            } catch (e) {
                return null;
            }
        },
        
        removeItem: (key) => {
            localStorage.removeItem(key);
        }
    };
    
    // Basit şifreleme (development - production'da daha güçlü kullanın)
    encrypt(text) {
        // Basit XOR şifreleme
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ this.SECURITY_KEY.charCodeAt(i % this.SECURITY_KEY.length));
        }
        return btoa(result);
    }
    
    // Basit şifre çözme
    decrypt(encryptedText) {
        const text = atob(encryptedText);
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ this.SECURITY_KEY.charCodeAt(i % this.SECURITY_KEY.length));
        }
        return result;
    }
    
    // Güvenli alert (XSS korumalı)
    secureAlert(message, type = 'info') {
        const sanitizedMessage = this.sanitizeString(message);
        
        // Custom modal oluştur
        const modal = document.createElement('div');
        modal.className = 'security-alert-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); z-index: 9999;
            display: flex; justify-content: center; align-items: center;
        `;
        
        const alertBox = document.createElement('div');
        alertBox.style.cssText = `
            background: white; padding: 20px; border-radius: 8px;
            max-width: 400px; margin: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        const icon = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
        alertBox.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 24px; margin-bottom: 10px;">${icon}</div>
                <p>${sanitizedMessage}</p>
                <button id="security-alert-ok" style="background: #007cba; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Tamam</button>
            </div>
        `;
        
        modal.appendChild(alertBox);
        document.body.appendChild(modal);
        
        // Tamam butonuna event listener ekle
        document.getElementById('security-alert-ok').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // ESC tuşu ile kapatma
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
    
    // Güvenli logging
    secureLog = {
        info: (message, data = null) => {
            if (!this.PRODUCTION_MODE) {
                console.log(`🔍 ${message}`, data);
            }
        },
        error: (message, error = null) => {
            if (!this.PRODUCTION_MODE) {
                console.error(`❌ ${message}`, error);
            } else {
                // Production'da kritik hataları kaydet
                this.logSecurityEvent('error', message, error);
            }
        },
        warn: (message, data = null) => {
            if (!this.PRODUCTION_MODE) {
                console.warn(`⚠️ ${message}`, data);
            }
        },
        security: (message, data = null) => {
            // Güvenlik olaylarını her zaman kaydet
            this.logSecurityEvent('security', message, data);
        }
    };
    
    // Güvenlik olayı kayıt
    logSecurityEvent(type, message, data) {
        // Firebase'e veya başka bir güvenlik log servisine gönder
        const event = {
            timestamp: new Date().toISOString(),
            type: type,
            message: message,
            userAgent: navigator.userAgent,
            url: window.location.href,
            data: data
        };
        
        // Burada güvenlik log servisinize gönderin
        // Örnek: Firebase Functions, CloudFlare Workers vb.
    }
}

// Global güvenlik manager'ı başlat
const SecurityConfig = new SecurityManager();

// Global olarak erişilebilir hale getir
window.SecurityConfig = SecurityConfig; 