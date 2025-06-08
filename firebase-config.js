// Firebase yapılandırma
const firebaseConfig = {
  apiKey: "AIzaSyAbI5Swc136jjPCKeH1erjoDuhG2GUPnn0",
  authDomain: "bilgisel-3e9a0.firebaseapp.com",
  databaseURL: "https://bilgisel-3e9a0-default-rtdb.firebaseio.com",
  projectId: "bilgisel-3e9a0",
  storageBucket: "bilgisel-3e9a0.appspot.com",
  messagingSenderId: "921907280109",
  appId: "1:921907280109:web:7d9b4844067a7a1ac174e4",
  measurementId: "G-XH10LS7DW8"
};

// Firebase bağlantı değişkenleri
let database = null;
let auth = null;
let firestore = null;

// Çevrimdışı mod kapalı - Firebase bağlantısını etkinleştir
const offlineMode = false;

// Tarayıcı izleme önleme algılama
const detectTrackingPrevention = function() {
  return new Promise((resolve, reject) => {
    const isEdgeBrowser = navigator.userAgent.indexOf("Edg") !== -1;
    let trackingPreventionActive = false;
    
    // Eğer Edge tarayıcısı değilse ve Firebase hazırsa, izleme önleme kontrolünü atla
    if (!isEdgeBrowser && typeof firebase !== 'undefined' && firebase.auth) {
      resolve({
        isTrackingPreventionActive: false,
        browser: navigator.userAgent
      });
      return;
    }
    
    // Edge tarayıcıda test işlemini gerçekleştir
    try {
      // Depolama erişimini test et
      let storageAccessBlocked = false;
      try {
        localStorage.setItem('firebase_test', 'test');
        localStorage.removeItem('firebase_test');
      } catch (e) {
        storageAccessBlocked = true;
      }
      
      // Firebase test işlemi
      if (typeof firebase !== 'undefined' && firebase.auth) {
        const testUser = firebase.auth().currentUser;
        
        // Kullanıcı oturum açmış ama kimlik doğrulama bilgileri eksikse
        if (testUser) {
          const userEmail = testUser.email;
          const isAnonymous = testUser.isAnonymous;
          
          // Kullanıcının e-posta adresi var ama anonim olarak işaretlenmişse izleme önleme olabilir
          if (userEmail && isAnonymous) {
            trackingPreventionActive = true;
          }
        }
      }

      // Firestore hata mesajlarını kontrol et
      if (window.console && console.error) {
        const originalConsoleError = console.error;
        let firestoreErrors = false;
        
        // Geçici olarak console.error'u değiştir ve Firestore hatalarını yakala
        console.error = function(msg) {
          if (typeof msg === 'string' && 
              (msg.includes('Firestore') || 
               msg.includes('Could not reach Cloud Firestore backend') ||
               msg.includes('Failed to get document because the client is offline'))) {
            firestoreErrors = true;
          }
          originalConsoleError.apply(console, arguments);
        };
        
        // Kısa bir süre sonra orijinal console.error'u geri yükle
        setTimeout(() => {
          console.error = originalConsoleError;
          if (firestoreErrors) {
            trackingPreventionActive = true;
          }
          
          resolve({
            isTrackingPreventionActive: trackingPreventionActive || storageAccessBlocked,
            browser: navigator.userAgent,
            storageAccessBlocked: storageAccessBlocked,
            firestoreErrors: firestoreErrors
          });
        }, 1000);
      } else {
        resolve({
          isTrackingPreventionActive: trackingPreventionActive || storageAccessBlocked,
          browser: navigator.userAgent,
          storageAccessBlocked: storageAccessBlocked
        });
      }
    } catch (error) {
      console.error("Tarayıcı izleme önleme testi sırasında hata:", error);
      reject(error);
    }
  });
};

// Edge tarayıcısında izleme önleme özelliğini devre dışı bırakma talimatlarını göster
const showTrackingPreventionHelp = function() {
  const isEdgeBrowser = navigator.userAgent.indexOf("Edg") !== -1;
  
  if (isEdgeBrowser) {
    const helpDiv = document.createElement('div');
    helpDiv.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; background-color: #ffb74d; color: #333; padding: 15px; z-index: 9999; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
        <h3 style="margin: 0 0 10px 0;">Microsoft Edge İzleme Önleme Sorunu Tespit Edildi</h3>
        <p>Edge tarayıcınızın "Tracking Prevention" özelliği Firebase kimlik doğrulama ve Firestore erişimini engelliyor olabilir.</p>
        <p><strong>Çözüm için izleme önlemeyi şu şekilde devre dışı bırakın:</strong></p>
        <ol style="text-align: left; max-width: 600px; margin: 0 auto; padding-left: 30px;">
          <li>Tarayıcının sağ üst köşesindeki "Ayarlar ve daha fazlası" (üç nokta) simgesine tıklayın</li>
          <li>"Ayarlar"ı seçin</li>
          <li>Sol menüden "Gizlilik, arama ve hizmetler"i seçin</li>
          <li>"İzleme önleme" ayarını "Kapalı" konumuna getirin</li>
          <li>Sayfayı yenileyin</li>
        </ol>
        <button id="close-tracking-help" style="background: #e65100; color: white; border: none; padding: 8px 15px; margin-top: 10px; border-radius: 4px; cursor: pointer;">Bu uyarıyı kapat</button>
      </div>
    `;
    
    document.body.appendChild(helpDiv);
    
    // Kapatma butonu işlevi
    document.getElementById('close-tracking-help').addEventListener('click', function() {
      helpDiv.remove();
    });
  }
};

// Firebase'i başlat
try {
  if (!offlineMode) {
    // Eğer firebase nesnesi varsa, zaten başlatılmamışsa başlat
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else if (typeof firebase !== 'undefined' && firebase.apps.length) {
      // Zaten başlatılmış - mevcut uygulamayı kullan
      firebase.app();
    }
    
    // Firebase veritabanı ve kimlik doğrulama referansları
    if (typeof firebase !== 'undefined') {
      database = firebase.database();
      auth = firebase.auth();
      
      // Firestore için "experimentalForceLongPolling" seçeneğini etkinleştir - bağlantı sorunlarını çözer
      if (firebase.firestore) {
        firestore = firebase.firestore();
        
        // Firestore ayarlarını güncelle - tarayıcının izleme önleme sorunlarını atlatmak için
        const firestoreSettings = {
          experimentalForceLongPolling: true, // Uzun süreli bağlantı sorunlarını çözmek için
          cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED, // Çevrimdışı çalışmayı iyileştir
          merge: true // Host üzerine yazma ayarlarını birleştir
        };
        
        firestore.settings(firestoreSettings);
        console.log("Firestore gelişmiş bağlantı ayarları aktifleştirildi");
      }
      
      console.log("Firebase başarıyla başlatıldı");
      
      // Tarayıcı izleme önleme testi
      setTimeout(() => {
        detectTrackingPrevention().then(result => {
          if (result.isTrackingPreventionActive) {
            console.warn("Tarayıcı izleme önleme özelliği aktif olabilir! Firebase kimlik doğrulama sorunları yaşanabilir.");
            console.warn("Tarayıcı: " + result.browser);
            console.warn("Depolama erişimi engellendi: " + result.storageAccessBlocked);
            
            // Edge tarayıcısı ve izleme önleme aktif ise yardım göster
            if (navigator.userAgent.indexOf("Edg") !== -1) {
              // Dökümanın yüklenmesini bekle
              if (document.readyState === 'complete') {
                showTrackingPreventionHelp();
              } else {
                window.addEventListener('load', showTrackingPreventionHelp);
              }
            }
          }
        }).catch(error => {
          console.error("İzleme önleme testi çalıştırılamadı:", error);
        });
      }, 2000); // 2 saniye gecikmeyle kontrol et - sayfanın yüklenmesini bekle
    } else {
      console.error("Firebase nesnesi bulunamadı. Firebase SDK'larının doğru sırayla yüklendiğinden emin olun.");
      throw new Error("Firebase nesnesi bulunamadı");
    }
  } else {
    throw new Error("Çevrimdışı mod aktif");
  }
} catch (error) {
  console.log("Çevrimdışı mod aktif: Çevrimiçi özellikler devre dışı", error);
  
  // Sahte Firebase nesnesi oluştur (hata almaması için)
  if (!window.firebase) {
    window.firebase = {
      database: () => ({
        ref: () => ({
          set: () => Promise.resolve(),
          once: () => Promise.resolve({ val: () => null }),
          on: () => {}
        })
      }),
      auth: () => ({
        signInAnonymously: () => Promise.resolve({ user: { uid: "test-user" } }),
        onAuthStateChanged: (callback) => callback({ uid: "test-user" })
      }),
      firestore: () => ({
        collection: () => ({
          doc: () => ({
            get: () => Promise.resolve({ exists: false, data: () => null }),
            set: () => Promise.resolve()
          }),
          add: () => Promise.resolve({ id: "test-doc" }),
          where: () => ({
            get: () => Promise.resolve({ empty: true, docs: [] })
          })
        }),
        settings: () => {}
      })
    };
  }
  
  // Sahte database ve auth nesneleri
  database = {
    ref: (path) => ({
      set: () => Promise.resolve(),
      once: () => Promise.resolve({ val: () => null }),
      on: () => {},
      child: () => database.ref(),
      orderByChild: () => ({
        once: () => Promise.resolve({
          forEach: (callback) => {},
          val: () => []
        })
      }),
      push: () => Promise.resolve()
    })
  };
  
  auth = {
    signInAnonymously: () => Promise.resolve({ user: { uid: "test-user" } }),
    onAuthStateChanged: (callback) => callback({ uid: "test-user" })
  };
  
  firestore = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: () => Promise.resolve()
      }),
      add: () => Promise.resolve({ id: "test-doc" }),
      where: () => ({
        get: () => Promise.resolve({ empty: true, docs: [] })
      })
    }),
    settings: () => {}
  };
}

// İzleme önleme testi için global erişim sağla
window.testTrackingPrevention = detectTrackingPrevention;
window.showTrackingPreventionHelp = showTrackingPreventionHelp;

// Global olarak dışa aktar
window.firestore = firestore; 