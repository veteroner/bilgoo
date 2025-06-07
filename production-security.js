// 🔒 PRODUCTION GÜVENLİK AYARLARI
// Console logları ve debug bilgilerini gizler

(function() {
    'use strict';
    
    // Production mode kontrolü
    const isProduction = window.location.hostname !== 'localhost' && 
                        !window.location.hostname.includes('127.0.0.1') &&
                        !window.location.hostname.includes('192.168.') &&
                        !window.location.hostname.includes('10.0.') &&
                        !window.location.hostname.includes('172.');
    
    if (isProduction) {
        console.log('🔒 Production güvenlik modu aktifleştiriliyor...');
        
        // Console'u temizle ve devre dışı bırak
        setTimeout(() => {
            console.clear();
            
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
        
        // Developer tools detection
        let devtools = { open: false, orientation: null };
        const threshold = 160;
        
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    // Developer tools açıldığında uyarı ver
                    document.body.innerHTML = `
                        <div style="
                            position: fixed; 
                            top: 0; left: 0; right: 0; bottom: 0; 
                            background: #1a1a1a; 
                            color: #ff6b6b; 
                            display: flex; 
                            flex-direction: column;
                            align-items: center; 
                            justify-content: center; 
                            font-family: 'Courier New', monospace; 
                            z-index: 99999;
                        ">
                            <h1 style="font-size: 3rem; margin-bottom: 2rem;">🚫</h1>
                            <h2>Geliştirici Araçları Engellendi</h2>
                            <p style="text-align: center; max-width: 600px; line-height: 1.6;">
                                Bu sayfa güvenlik nedeniyle geliştirici araçlarının kullanımını kısıtlamaktadır.<br>
                                Geliştirici araçlarını kapatın ve sayfayı yenileyin.
                            </p>
                            <button onclick="window.location.reload()" style="
                                margin-top: 2rem; 
                                padding: 15px 30px; 
                                background: #ff6b6b; 
                                color: white; 
                                border: none; 
                                border-radius: 5px; 
                                cursor: pointer; 
                                font-size: 1.1rem;
                            ">
                                Sayfayı Yenile
                            </button>
                        </div>
                    `;
                }
            } else {
                devtools.open = false;
            }
        }, 500);
        
        // Right-click disable
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
        
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U disable
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
                (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                return false;
            }
        });
        
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
        
    } else {
        console.log('🔧 Development mode - Console aktif');
    }
})(); 