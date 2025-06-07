// 🔧 NETLIFY FIREBASE HATA DÜZELTMESİ
// Firebase SDK yüklenmesini bekle ve hataları önle

// Production mode kontrolü
const isProductionMode = window.location.hostname !== 'localhost' && 
                         !window.location.hostname.includes('127.0.0.1');

if (!isProductionMode) console.info('🔧 Firebase Fix başlatılıyor...');

// Firebase SDK'ların yüklenmesini bekle
function waitForFirebaseSDK() {
    return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 50; // 5 saniye
        
        const checkFirebase = () => {
            attempts++;
            
            if (typeof firebase !== 'undefined' && firebase.auth && firebase.firestore && firebase.database) {
                if (!isProductionMode) console.info('✅ Firebase SDK yüklendi');
                resolve(true);
            } else if (attempts >= maxAttempts) {
                if (!isProductionMode) console.error('❌ Firebase SDK yüklenemedi (timeout)');
                resolve(false);
            } else {
                setTimeout(checkFirebase, 100);
            }
        };
        
        checkFirebase();
    });
}

// Firebase başlatma wrapper
async function initializeFirebaseSafely() {
    try {
        console.info('🔄 Firebase başlatma bekleniyor...');
        
        const sdkLoaded = await waitForFirebaseSDK();
        
        if (!sdkLoaded) {
            console.error('❌ Firebase SDK yüklenemedi');
            return false;
        }
        
        // Firebase config kontrolü
        if (!window.FIREBASE_API_KEY) {
            console.warn('⚠️ Firebase API key bulunamadı, fallback kullanılıyor');
        }
        
        // Firebase config
        const config = {
            apiKey: window.FIREBASE_API_KEY || "AIzaSyAbI5Swc136jjPCKeH1erjoDuhG2GUPnn0",
            authDomain: window.FIREBASE_AUTH_DOMAIN || "bilgisel-3e9a0.firebaseapp.com",
            databaseURL: window.FIREBASE_DATABASE_URL || "https://bilgisel-3e9a0-default-rtdb.firebaseio.com",
            projectId: window.FIREBASE_PROJECT_ID || "bilgisel-3e9a0",
            storageBucket: window.FIREBASE_STORAGE_BUCKET || "bilgisel-3e9a0.appspot.com",
            messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || "921907280109",
            appId: window.FIREBASE_APP_ID || "1:921907280109:web:7d9b4844067a7a1ac174e4",
            measurementId: window.FIREBASE_MEASUREMENT_ID || "G-XH10LS7DW8"
        };
        
        // Firebase'i başlat (eğer başlatılmamışsa)
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
            if (!isProductionMode) console.info('✅ Firebase app başlatıldı');
        } else {
            if (!isProductionMode) console.info('✅ Firebase app zaten başlatılmış');
        }
        
        // Firebase servislerini başlat
        const auth = firebase.auth();
        const database = firebase.database();
        const firestore = firebase.firestore();
        
        // Firestore ayarları - Netlify için optimize edildi
        try {
            firestore.settings({
                experimentalForceLongPolling: true,
                cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
                ignoreUndefinedProperties: true
            });
            
            // Offline persistence etkinleştir
            firestore.enablePersistence({ synchronizeTabs: true })
                .then(() => {
                    console.info('✅ Firestore offline persistence aktifleştirildi');
                })
                .catch((err) => {
                    if (err.code == 'failed-precondition') {
                        console.warn('⚠️ Firestore persistence: Birden fazla sekme açık');
                    } else if (err.code == 'unimplemented') {
                        console.warn('⚠️ Firestore persistence: Tarayıcı desteklemiyor');
                    } else {
                        console.warn('⚠️ Firestore persistence hatası:', err);
                    }
                });
                
            // Network durumunu izle
            firestore.enableNetwork()
                .then(() => {
                    console.info('✅ Firestore ağ bağlantısı aktif');
                })
                .catch((networkError) => {
                    console.warn('⚠️ Firestore ağ bağlantısı sorunu:', networkError);
                });
                
        } catch (persistError) {
            console.warn('⚠️ Firestore persistence ayarlanamadı:', persistError);
        }
        
        // Global erişim için
        window.firebaseAuth = auth;
        window.firebaseDatabase = database;
        window.firebaseFirestore = firestore;
        
        console.info('🎉 Firebase başarıyla başlatıldı');
        
        // Custom event fire et
        const firebaseReadyEvent = new CustomEvent('firebaseReady', {
            detail: { auth, database, firestore }
        });
        document.dispatchEvent(firebaseReadyEvent);
        
        return true;
        
    } catch (error) {
        console.error('❌ Firebase başlatma hatası:', error);
        
        // Hata durumunda fallback
        window.firebaseAuth = null;
        window.firebaseDatabase = null;
        window.firebaseFirestore = null;
        
        return false;
    }
}

// DOM yüklendiğinde Firebase'i başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeFirebaseSafely, 500);
    });
} else {
    setTimeout(initializeFirebaseSafely, 500);
}

// Error handlers
window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('firebase')) {
        console.error('🔥 Firebase hatası yakalandı:', event.message);
        event.preventDefault();
    }
});

// Unhandled promise rejections için
window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.toString().includes('firestore')) {
        console.error('🔥 Firestore promise hatası yakalandı:', event.reason);
        event.preventDefault();
    }
});

// CSP image loading errors için
document.addEventListener('securitypolicyviolation', (event) => {
    if (event.violatedDirective === 'img-src') {
        console.warn('🚫 CSP img-src violation:', event.blockedURI);
    }
});

if (!isProductionMode) console.info('✅ Firebase Fix hazır'); 