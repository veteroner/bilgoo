// 🌐 NETLIFY KONFİGÜRASYONU
// Static hosting için özel ayarlar

// Netlify ortamı tespiti
const isNetlify = window.location.hostname.includes('netlify.app') || 
                 window.location.hostname.includes('netlify.com') ||
                 typeof window.netlifyIdentity !== 'undefined';

// Production ama static hosting kontrolü
const isStaticHosting = isNetlify || 
                       window.location.hostname.includes('github.io') ||
                       window.location.hostname.includes('vercel.app') ||
                       window.location.hostname.includes('surge.sh');

console.info('🌐 Hosting ortamı tespit edildi:', {
    netlify: isNetlify,
    staticHosting: isStaticHosting,
    hostname: window.location.hostname
});

// Netlify için Firebase config (güvenli şekilde)
if (isStaticHosting) {
    console.info('📱 Static hosting için Firebase config yükleniyor...');
    
    // Netlify Environment Variables'dan al (Build time'da enjekte ediliyor)
    window.FIREBASE_API_KEY = process.env.REACT_APP_FIREBASE_API_KEY || window.NETLIFY_FIREBASE_API_KEY || "AIzaSyAbI5Swc136jjPCKeH1erjoDuhG2GUPnn0";
    window.FIREBASE_AUTH_DOMAIN = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || window.NETLIFY_FIREBASE_AUTH_DOMAIN || "bilgisel-3e9a0.firebaseapp.com";
    window.FIREBASE_DATABASE_URL = process.env.REACT_APP_FIREBASE_DATABASE_URL || window.NETLIFY_FIREBASE_DATABASE_URL || "https://bilgisel-3e9a0-default-rtdb.firebaseio.com";
    window.FIREBASE_PROJECT_ID = process.env.REACT_APP_FIREBASE_PROJECT_ID || window.NETLIFY_FIREBASE_PROJECT_ID || "bilgisel-3e9a0";
    window.FIREBASE_STORAGE_BUCKET = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || window.NETLIFY_FIREBASE_STORAGE_BUCKET || "bilgisel-3e9a0.appspot.com";
    window.FIREBASE_MESSAGING_SENDER_ID = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || window.NETLIFY_FIREBASE_MESSAGING_SENDER_ID || "921907280109";
    window.FIREBASE_APP_ID = process.env.REACT_APP_FIREBASE_APP_ID || window.NETLIFY_FIREBASE_APP_ID || "1:921907280109:web:7d9b4844067a7a1ac174e4";
    window.FIREBASE_MEASUREMENT_ID = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || window.NETLIFY_FIREBASE_MEASUREMENT_ID || "G-XH10LS7DW8";
    
    console.info('✅ Netlify Firebase config yüklendi');
    
    // SecurityConfig ayarlarını DOM yüklendikten sonra yap
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (typeof SecurityConfig !== 'undefined') {
                // DevTools detection'ı devre dışı bırak (Netlify'da sorun çıkarıyor)
                SecurityConfig.PRODUCTION_MODE = false;
                
                // Güvenlik kontrollerini yumuşat
                if (SecurityConfig.blockDevTools) {
                    const originalBlockDevTools = SecurityConfig.blockDevTools;
                    SecurityConfig.blockDevTools = function() {
                        // Netlify'da DevTools blocking'i devre dışı
                        console.info('🔧 DevTools blocking Netlify için devre dışı');
                    };
                }
                
                if (SecurityConfig.handleDevToolsOpen) {
                    const originalHandleDevToolsOpen = SecurityConfig.handleDevToolsOpen;
                    SecurityConfig.handleDevToolsOpen = function() {
                        // Sadece warning ver, sayfayı kapatma
                        console.warn('⚠️ DevTools açık tespit edildi ama Netlify'da izin veriliyor');
                    };
                }
                
                console.info('🔧 SecurityConfig Netlify için optimize edildi');
            } else {
                console.warn('⚠️ SecurityConfig henüz yüklenmedi, daha sonra denenecek');
            }
        }, 1000);
    });
} else {
    console.info('🔧 Server-based hosting tespit edildi, normal config kullanılıyor');
}

// Netlify Identity integration (opsiyonel)
if (isNetlify && typeof netlifyIdentity !== 'undefined') {
    console.info('🔑 Netlify Identity entegrasyonu aktif');
    
    // Netlify Identity olaylarını dinle
    netlifyIdentity.on('init', user => {
        if (user) {
            console.info('👤 Netlify user giriş yapmış:', user.email);
        }
    });
    
    netlifyIdentity.on('login', user => {
        console.info('✅ Netlify login başarılı:', user.email);
        netlifyIdentity.close();
    });
    
    netlifyIdentity.on('logout', () => {
        console.info('👋 Netlify logout');
    });
}

// Netlify Functions için API calls
window.NetlifyAPI = {
    // Netlify Functions endpoint'leri
    baseURL: isNetlify ? '/.netlify/functions/' : '/api/',
    
    // Güvenli API call
    call: async function(endpoint, options = {}) {
        try {
            const url = this.baseURL + endpoint;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`API call failed: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Netlify API call error:', error);
            throw error;
        }
    }
};

console.info('✅ Netlify konfigürasyonu tamamlandı'); 