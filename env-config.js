// 🔒 ENVIRONMENT KONFİGÜRASYONU
// Bu dosya production'da gerçek environment variables ile değiştirilmelidir

// Production kontrolü
const isProduction = window.location.hostname !== 'localhost' && 
                    !window.location.hostname.includes('127.0.0.1') && 
                    !window.location.hostname.includes('192.168.');

// Static hosting tespiti (Netlify, Vercel, GitHub Pages, vb.)
const isStaticHosting = window.location.hostname.includes('netlify.app') ||
                       window.location.hostname.includes('netlify.com') ||
                       window.location.hostname.includes('github.io') ||
                       window.location.hostname.includes('vercel.app') ||
                       window.location.hostname.includes('surge.sh');

if (isProduction && !isStaticHosting) {
    // Server-based production ortamında - API anahtarları server'dan fetch edilir
    console.info('🔒 SERVER PRODUCTION: API anahtarları server\'dan güvenli şekilde alınıyor...');
    
    // Server'dan config al
    fetch('/api/config', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'dev-key-12345' // Development key - production'da gerçek key
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.config) {
            // Firebase config'i window objesine yükle
            Object.keys(data.config.firebase).forEach(key => {
                window[`FIREBASE_${key.toUpperCase()}`] = data.config.firebase[key];
            });
            
            console.info('✅ Server-side config başarıyla yüklendi');
            
            // Config yüklendikten sonra Firebase'i başlat
            if (typeof initializeFirebaseAfterConfig === 'function') {
                initializeFirebaseAfterConfig();
            }
        } else {
            console.error('❌ Server config alınamadı:', data.error);
            // Fallback değerler kullan
            loadFallbackConfig();
        }
    })
    .catch(error => {
        console.error('❌ Server config fetch hatası:', error);
        loadFallbackConfig();
    });

} else if (isStaticHosting) {
    // Static hosting (Netlify, Vercel, vb.) - netlify-config.js yönetir
    console.info('📱 STATIC HOSTING: Config netlify-config.js tarafından yönetiliyor');
    
} else {
    // Development ortamında - test değerleri
    console.info('🔧 DEVELOPMENT: Test environment variables yüklendi');
    
    window.FIREBASE_API_KEY = "AIzaSyAbI5Swc136jjPCKeH1erjoDuhG2GUPnn0";
    window.FIREBASE_AUTH_DOMAIN = "bilgisel-3e9a0.firebaseapp.com";
    window.FIREBASE_DATABASE_URL = "https://bilgisel-3e9a0-default-rtdb.firebaseio.com";
    window.FIREBASE_PROJECT_ID = "bilgisel-3e9a0";
    window.FIREBASE_STORAGE_BUCKET = "bilgisel-3e9a0.appspot.com";
    window.FIREBASE_MESSAGING_SENDER_ID = "921907280109";
    window.FIREBASE_APP_ID = "1:921907280109:web:7d9b4844067a7a1ac174e4";
    window.FIREBASE_MEASUREMENT_ID = "G-XH10LS7DW8";
}

// API rate limiting konfigürasyonu
window.API_RATE_LIMIT = {
    requestsPerMinute: 60,
    requestsPerHour: 1000,
    blockDuration: 300000 // 5 dakika
};

// Güvenlik konfigürasyonu
window.SECURITY_CONFIG = {
    maxFailedAttempts: 5,
    lockoutDuration: 900000, // 15 dakika
    sessionTimeout: 3600000, // 1 saat
    encryptLocalStorage: true,
    enableCSP: isProduction,
    blockDevTools: isProduction,
    disableConsole: isProduction
};

// Fallback config function
function loadFallbackConfig() {
    console.warn('⚠️ Fallback config kullanılıyor - bazı özellikler çalışmayabilir');
    
    // Minimal fallback değerler
    window.FIREBASE_API_KEY = "fallback-api-key";
    window.FIREBASE_AUTH_DOMAIN = "fallback.firebaseapp.com";
    window.FIREBASE_DATABASE_URL = "https://fallback-default-rtdb.firebaseio.com";
    window.FIREBASE_PROJECT_ID = "fallback-project";
    window.FIREBASE_STORAGE_BUCKET = "fallback.appspot.com";
    window.FIREBASE_MESSAGING_SENDER_ID = "000000000000";
    window.FIREBASE_APP_ID = "1:000000000000:web:fallback";
    window.FIREBASE_MEASUREMENT_ID = "G-FALLBACK";
}

console.info('✅ Environment konfigürasyonu yüklendi'); 