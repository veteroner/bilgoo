// 🌐 NETLIFY KONFİGÜRASYONU
// Static hosting için özel ayarlar

console.log('Netlify config loading...');

// Netlify ortamı tespiti
const isNetlify = window.location.hostname.includes('netlify.app') || 
                 window.location.hostname.includes('netlify.com');

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
if (isNetlify) {
    console.log('Loading Firebase config for static hosting...');
    
    // Netlify Environment Variables'dan al (Build time'da enjekte ediliyor)
    // BUILD_ENV runtime config'dan al, yoksa fallback kullan
    const buildEnv = window.BUILD_ENV || {};
    
    window.FIREBASE_API_KEY = buildEnv.FIREBASE_API_KEY || "AIzaSyAbI5Swc136jjPCKeH1erjoDuhG2GUPnn0";
    window.FIREBASE_AUTH_DOMAIN = buildEnv.FIREBASE_AUTH_DOMAIN || "bilgisel-3e9a0.firebaseapp.com";
    window.FIREBASE_DATABASE_URL = buildEnv.FIREBASE_DATABASE_URL || "https://bilgisel-3e9a0-default-rtdb.firebaseio.com";
    window.FIREBASE_PROJECT_ID = buildEnv.FIREBASE_PROJECT_ID || "bilgisel-3e9a0";
    window.FIREBASE_STORAGE_BUCKET = buildEnv.FIREBASE_STORAGE_BUCKET || "bilgisel-3e9a0.appspot.com";
    window.FIREBASE_MESSAGING_SENDER_ID = buildEnv.FIREBASE_MESSAGING_SENDER_ID || "921907280109";
    window.FIREBASE_APP_ID = buildEnv.FIREBASE_APP_ID || "1:921907280109:web:7d9b4844067a7a1ac174e4";
    window.FIREBASE_MEASUREMENT_ID = buildEnv.FIREBASE_MEASUREMENT_ID || "G-XH10LS7DW8";
    
    console.log('Firebase config loaded for Netlify');
} else {
    console.info('🔧 Server-based hosting tespit edildi, normal config kullanılıyor');
}

// Netlify Identity integration (opsiyonel)
if (isNetlify && typeof netlifyIdentity !== 'undefined') {
    console.info('🔑 Netlify Identity entegrasyonu aktif');
    
    // Netlify Identity olaylarını dinle
    netlifyIdentity.on('init', function(user) {
        if (user) {
            console.info('👤 Netlify user giriş yapmış:', user.email);
        }
    });
    
    netlifyIdentity.on('login', function(user) {
        console.info('✅ Netlify login başarılı:', user.email);
        netlifyIdentity.close();
    });
    
    netlifyIdentity.on('logout', function() {
        console.info('👋 Netlify logout');
    });
}

// Netlify Functions için API calls
window.NetlifyAPI = {
    // Netlify Functions endpoint'leri
    baseURL: isNetlify ? '/.netlify/functions/' : '/api/',
    
    // Güvenli API call
    call: function(endpoint, options) {
        options = options || {};
        
        return new Promise(function(resolve, reject) {
            try {
                const url = this.baseURL + endpoint;
                const headers = {
                    'Content-Type': 'application/json'
                };
                
                if (options.headers) {
                    Object.assign(headers, options.headers);
                }
                
                const fetchOptions = Object.assign({}, options, { headers: headers });
                
                fetch(url, fetchOptions)
                    .then(function(response) {
                        if (!response.ok) {
                            throw new Error('API call failed: ' + response.status);
                        }
                        return response.json();
                    })
                    .then(function(data) {
                        resolve(data);
                    })
                    .catch(function(error) {
                        console.error('Netlify API call error:', error);
                        reject(error);
                    });
            } catch (error) {
                console.error('Netlify API call error:', error);
                reject(error);
            }
        }.bind(this));
    }
};

console.log('Netlify configuration completed'); 