// 🔒 PRODUCTION GÜVENLİK AYARLARI
// Console logları ve debug bilgilerini gizler

(function() {
    'use strict';
    
    // Production mode kontrolü - Netlify domain'ini de kontrol et
    const isProduction = (window.location.hostname !== 'localhost' && 
                         !window.location.hostname.includes('127.0.0.1') &&
                         !window.location.hostname.includes('192.168.') &&
                         !window.location.hostname.includes('10.0.') &&
                         !window.location.hostname.includes('172.')) ||
                         window.location.hostname.includes('netlify.app') ||
                         window.location.hostname.includes('netlify.com');
    
    if (isProduction) {
        console.log('🔒 Production güvenlik modu aktifleştiriliyor...');
        
        // Anında DevTools kontrolü
        let isDevToolsOpen = false;
        
        // İlk kontrol
        setTimeout(() => {
            if ((window.outerHeight - window.innerHeight) > 200 || 
                (window.outerWidth - window.innerWidth) > 200) {
                isDevToolsOpen = true;
                lockPage();
            }
        }, 500);
        
        // Sayfayı kapatma fonksiyonu
        const lockPage = () => {
            document.documentElement.innerHTML = `
                <html style="margin:0;padding:0;height:100vh;overflow:hidden;">
                <head><title>Erişim Engellendi</title></head>
                <body style="
                    margin:0;padding:0;height:100vh;
                    background: linear-gradient(45deg, #1a1a1a, #2d2d2d);
                    display:flex;align-items:center;justify-content:center;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    color: #ff6b6b;overflow:hidden;
                ">
                    <div style="text-align:center;max-width:500px;padding:2rem;">
                        <div style="font-size:4rem;margin-bottom:1rem;">🔒</div>
                        <h1 style="font-size:2rem;margin:1rem 0;color:#ff6b6b;">Erişim Engellendi</h1>
                        <p style="font-size:1.2rem;line-height:1.6;color:#ccc;margin-bottom:2rem;">
                            Bu sayfa güvenlik nedeniyle geliştirici araçlarını desteklememektedir.<br>
                            Lütfen normal kullanıcı deneyimi için geliştirici araçlarını kapatın.
                        </p>
                        <button onclick="window.location.reload()" style="
                            background: linear-gradient(45deg, #ff6b6b, #ee5a5a);
                            color: white;border: none;padding: 15px 30px;
                            border-radius: 10px;font-size: 1.1rem;cursor: pointer;
                            box-shadow: 0 4px 15px rgba(255,107,107,0.3);
                            transition: all 0.3s ease;
                        " onmouseover="this.style.transform='translateY(-2px)'" 
                           onmouseout="this.style.transform='translateY(0)'">
                            🔄 Sayfayı Yenile
                        </button>
                    </div>
                </body>
                </html>
            `;
            
            // Tüm event listener'ları temizle
            window.onbeforeunload = null;
            window.onunload = null;
            
            // History API'yi engelle
            history.pushState = null;
            history.replaceState = null;
            
            // setTimeout ve setInterval'ları temizle
            const highestTimeoutId = setTimeout(() => {}, 0);
            for (let i = 0; i < highestTimeoutId; i++) {
                clearTimeout(i);
            }
            
            const highestIntervalId = setInterval(() => {}, 0);
            for (let i = 0; i < highestIntervalId; i++) {
                clearInterval(i);
            }
        };
        
        // Console'u temizle ve devre dışı bırak
        setTimeout(() => {
            console.clear();
            console.log('🔒 Production güvenlik modu aktif - Console gizleniyor...');
            
            // Console fonksiyonlarını boş fonksiyonlarla değiştir
            const noOp = () => {};
            
            ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 
             'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 
             'profileEnd', 'table'].forEach(method => {
                console[method] = noOp;
            });
            
            // Console'u readonly yap
            Object.defineProperty(window, 'console', {
                value: console,
                writable: false,
                configurable: false
            });
            
        }, 1000);
        
        // Gelişmiş Developer Tools Detection
        let devtools = { open: false, orientation: null };
        let detectInterval;
        
        // Çoklu detection metodları
        const detectDevTools = () => {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            // Console detection hack
            let devtoolsDetected = false;
            const detectConsole = () => {
                const before = new Date();
                debugger;
                const after = new Date();
                devtoolsDetected = (after - before) > 100;
                return devtoolsDetected;
            };
            
            // Firebug detection
            const detectFirebug = () => {
                return window.console && (window.console.firebug || window.console.exception);
            };
            
            // DevTools detection via toString
            const detectToString = () => {
                let detected = false;
                const img = new Image();
                Object.defineProperty(img, 'id', {
                    get: function() {
                        detected = true;
                        return 'detected';
                    }
                });
                console.log(img);
                return detected;
            };
            
            return widthThreshold || heightThreshold || detectConsole() || detectFirebug() || detectToString();
        };
        
        // Ana detection loop
        detectInterval = setInterval(() => {
            try {
                if (detectDevTools()) {
                    if (!devtools.open) {
                        devtools.open = true;
                        clearInterval(detectInterval);
                        
                        // Anında sayfayı kilitle
                        setTimeout(lockPage, 100);
                    }
                } else {
                    devtools.open = false;
                }
            } catch (e) {
                // Hata durumunda da güvenlik önlemi al
                devtools.open = true;
                clearInterval(detectInterval);
                setTimeout(lockPage, 100);
            }
        }, 300); // Daha sık kontrol et
        
        // Debugging attempt detection
        let debugCount = 0;
        const originalConsole = window.console;
        window.console = new Proxy(originalConsole, {
            get: function(target, property) {
                debugCount++;
                if (debugCount > 3) {
                    setTimeout(lockPage, 100);
                }
                return target[property];
            }
        });
        
        // Right-click disable
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
        
        // Gelişmiş keyboard shortcut engelleme
        document.addEventListener('keydown', (e) => {
            // Developer tools shortcuts
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.ctrlKey && e.key === 'U') ||
                (e.ctrlKey && e.shiftKey && e.key === 'K') ||
                (e.metaKey && e.altKey && e.key === 'I') || // Mac
                (e.metaKey && e.altKey && e.key === 'J') || // Mac
                (e.metaKey && e.key === 'U') || // Mac
                e.key === 'F7') { // IE
                e.preventDefault();
                e.stopPropagation();
                
                // Deneme algılandı, sayfayı kilitle
                setTimeout(lockPage, 100);
                return false;
            }
            
            // Ctrl+A (select all) disable
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                return false;
            }
        }, true);
        
        // Select ve drag disable
        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        });
        
        document.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });
        
        // CSS ile debug engelleme
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
                -webkit-touch-callout: none !important;
                -webkit-tap-highlight-color: transparent !important;
            }
            
            input, textarea {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
        `;
        document.head.appendChild(style);
        
        // Console uyarı mesajı göster (son kez)
        console.log('%c🚫 UYARI', 'color: red; font-size: 20px; font-weight: bold;');
        console.log('%cBu sayfa güvenlik nedeniyle geliştirici araçlarını kısıtlamaktadır.', 'color: red; font-size: 14px;');
        console.log('%cKod inceleme ve debug işlemleri engellemiştir.', 'color: red; font-size: 14px;');
        
        // Script injection koruması
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            if (node.tagName === 'SCRIPT' || 
                                node.tagName === 'IFRAME' ||
                                node.tagName === 'EMBED' ||
                                node.tagName === 'OBJECT') {
                                // Şüpheli script/element ekleme algılandı
                                setTimeout(lockPage, 100);
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Performance timing ile hız analizi
        let pageStartTime = performance.now();
        setInterval(() => {
            const currentTime = performance.now();
            const elapsedTime = currentTime - pageStartTime;
            
            // Sayfa anormal yavaşsa (debugging işareti)
            if (elapsedTime > 30000 && performance.now() - pageStartTime > 35000) {
                setTimeout(lockPage, 100);
            }
        }, 5000);
        
        // Window manipulation detection
        let originalWindowProperties = {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight
        };
        
        setInterval(() => {
            const currentProperties = {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                outerWidth: window.outerWidth,
                outerHeight: window.outerHeight
            };
            
            // DevTools açılınca window size değişir
            if (Math.abs(currentProperties.outerWidth - currentProperties.innerWidth) > 200 ||
                Math.abs(currentProperties.outerHeight - currentProperties.innerHeight) > 200) {
                setTimeout(lockPage, 100);
            }
        }, 1000);
        
    } else {
        console.log('🔧 Development mode - Console aktif');
    }
})(); 