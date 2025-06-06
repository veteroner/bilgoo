// 🌐 NETLIFY FIREBASE BAŞLATMA
// Netlify static hosting için Firebase konfigürasyonu

console.info('🚀 Netlify Firebase Init başlatılıyor...');

// Netlify ortamı tespiti
const isNetlify = window.location.hostname.includes('netlify.app') || 
                 window.location.hostname.includes('netlify.com');

// Firebase config değişkenleri
let firebaseInitialized = false;
let database = null;
let auth = null;
let firestore = null;

// Firebase başlatma fonksiyonu
function initializeFirebaseForNetlify() {
    return new Promise((resolve, reject) => {
        try {
            // Firebase SDK'ların yüklenip yüklenmediğini kontrol et
            if (typeof firebase === 'undefined') {
                console.error('❌ Firebase SDK yüklenmedi!');
                reject(new Error('Firebase SDK bulunamadı'));
                return;
            }
            
            // Netlify config'den Firebase ayarlarını al
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
            
            console.info('🔧 Firebase config:', {
                apiKey: config.apiKey.substring(0, 10) + '...',
                authDomain: config.authDomain,
                projectId: config.projectId
            });
            
            // Firebase'i başlat (eğer başlatılmamışsa)
            if (!firebase.apps.length) {
                firebase.initializeApp(config);
                console.info('✅ Firebase başlatıldı');
            } else {
                console.info('✅ Firebase zaten başlatılmış');
            }
            
            // Firebase servislerini başlat
            database = firebase.database();
            auth = firebase.auth();
            
            if (firebase.firestore) {
                firestore = firebase.firestore();
                
                // Firestore ayarları
                firestore.settings({
                    experimentalForceLongPolling: true,
                    merge: true
                });
                
                console.info('✅ Firestore başlatıldı');
            }
            
            // Auth state listener
            auth.onAuthStateChanged((user) => {
                if (user) {
                    console.info('👤 Kullanıcı giriş yapmış:', user.uid);
                    if (user.isAnonymous) {
                        console.info('🥸 Misafir kullanıcı');
                    }
                } else {
                    console.info('👤 Kullanıcı giriş yapmamış');
                }
            });
            
            firebaseInitialized = true;
            
            // Global erişim için
            window.database = database;
            window.auth = auth;
            window.firestore = firestore;
            
            console.info('🎉 Netlify Firebase başlatma tamamlandı!');
            resolve({ database, auth, firestore });
            
        } catch (error) {
            console.error('❌ Firebase başlatma hatası:', error);
            reject(error);
        }
    });
}

// DOM yüklendiğinde Firebase'i başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (isNetlify) {
            console.info('🌐 Netlify ortamında Firebase başlatılıyor...');
            
            // Kısa bir gecikme ile başlat (netlify-config.js'nin yüklenmesini bekle)
            setTimeout(() => {
                initializeFirebaseForNetlify()
                    .then(() => {
                        console.info('✅ Netlify Firebase hazır!');
                        
                        // Custom event fire et
                        const firebaseReadyEvent = new CustomEvent('firebaseReady', {
                            detail: { database, auth, firestore }
                        });
                        document.dispatchEvent(firebaseReadyEvent);
                    })
                    .catch(error => {
                        console.error('❌ Firebase başlatma başarısız:', error);
                    });
            }, 500);
        }
    });
} else {
    // DOM zaten yüklü
    if (isNetlify) {
        initializeFirebaseForNetlify()
            .then(() => {
                console.info('✅ Netlify Firebase hazır!');
            })
            .catch(error => {
                console.error('❌ Firebase başlatma başarısız:', error);
            });
    }
}

// Misafir giriş fonksiyonu
window.netlifyAnonymousLogin = function() {
    return new Promise((resolve, reject) => {
        if (!auth) {
            console.error('❌ Firebase Auth başlatılmamış!');
            reject(new Error('Firebase Auth bulunamadı'));
            return;
        }
        
        console.info('🥸 Misafir girişi başlatılıyor...');
        
        auth.signInAnonymously()
            .then((result) => {
                console.info('✅ Misafir girişi başarılı:', result.user.uid);
                resolve(result.user);
            })
            .catch((error) => {
                console.error('❌ Misafir girişi hatası:', error);
                reject(error);
            });
    });
};

// Export için
window.NetlifyFirebase = {
    init: initializeFirebaseForNetlify,
    anonymousLogin: window.netlifyAnonymousLogin,
    isInitialized: () => firebaseInitialized,
    getAuth: () => auth,
    getDatabase: () => database,
    getFirestore: () => firestore
};

console.info('✅ Netlify Firebase Init hazır'); 