const CACHE_NAME = 'quiz-oyunu-v1.5.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/sw.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-144x144.png',
  '/icons/icon-384x384.png',
  '/icons/shortcut-96x96.png',
  '/icons/online-96x96.png',
  // Font awesome ikonları
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css'
];

// Service Worker yükleme
self.addEventListener('install', event => {
  console.log('Service Worker: Yükleniyor...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache açılıyor');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Tüm dosyalar cache\'lendi');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Cache hatası:', error);
      })
  );
});

// Service Worker aktif hale gelme
self.addEventListener('activate', event => {
  console.log('Service Worker: Aktif hale geliyor...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eski cache siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Aktif hale geldi');
      return self.clients.claim();
    })
  );
});

// Reklam servislerini kontrol eden fonksiyon
function isAdService(url) {
  const adDomains = [
    'googlesyndication.com',
    'googleadservices.com', 
    'doubleclick.net',
    'google-analytics.com',
    'googletagmanager.com',
    'google.com/adsense',
    'googletagservices.com',
    'adservice.google.',
    'pagead2.',
    'securepubads.g.doubleclick.net',
    'facebook.com/tr',
    'facebook.net',
    'fbcdn.',
    'analytics',
    'ads.',
    'advert'
  ];
  
  return adDomains.some(domain => url.includes(domain));
}

// Network istekleri yakalama
self.addEventListener('fetch', event => {
  // Sadece GET isteklerini yakala
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Google AdSense ve reklam istekleri için Service Worker'ı araya sokma
  const adDomains = [
    'googlesyndication.com',
    'googleadservices.com', 
    'doubleclick.net',
    'google-analytics.com',
    'googletagmanager.com',
    'google.com/adsense',
    'googletagservices.com',
    'adservice.google.',
    'pagead2.',
    'facebook.com/tr',
    'facebook.net'
  ];
  
  // Reklam servislerini kontrol et ve service worker'ı araya sokma
  if (adDomains.some(domain => event.request.url.includes(domain))) {
    return;
  }

  try {
    const requestURL = new URL(event.request.url);
    
    // Chrome uzantısı, Firebase, Google API ve reklam isteklerini atlama
    if (requestURL.protocol === 'chrome-extension:' || 
        event.request.url.includes('firebaseapp.com') || 
        event.request.url.includes('googleapis.com') ||
        event.request.url.includes('identitytoolkit.googleapis.com') ||
        isAdService(event.request.url)) {
      return; // Bu isteklerde Service Worker araya girme
    }
    
    // HTTPS olmayan istekleri de atla
    if (requestURL.protocol !== 'https:' && requestURL.hostname !== 'localhost' && !requestURL.hostname.includes('127.0.0.1')) {
      return;
    }
  } catch (error) {
    console.log('URL analiz hatası:', error);
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache'den dön varsa
        if (response) {
          return response;
        }

        // Network'den fetch et
        return fetch(event.request).then(response => {
          // Geçerli bir response değilse
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Response'u klonla ve cache'e ekle
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              try {
                // URL şemasını kontrol et (ek güvenlik önlemi)
                const requestURL = new URL(event.request.url);
                if (requestURL.protocol !== 'chrome-extension:' && !isAdService(event.request.url)) {
                  cache.put(event.request, responseToCache);
                }
              } catch (error) {
                console.log('Cache put hatası:', error);
              }
            });

          return response;
        }).catch(() => {
          // Network hatası durumunda offline sayfası
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Background sync
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync çalışıyor, tag:', event.tag);
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Periodic background sync
self.addEventListener('periodicsync', event => {
  console.log('Service Worker: Periodic sync çalışıyor, tag:', event.tag);
  if (event.tag === 'content-sync') {
    event.waitUntil(doPeriodicSync());
  }
});

function doBackgroundSync() {
  console.log('Background sync işlemi başlatılıyor...');
  return new Promise((resolve) => {
    // Offline sırasında biriken verileri senkronize et
    // Puanları, oynanan oyunları vs. senkronize edebiliriz
    resolve();
  });
}

function doPeriodicSync() {
  console.log('Periodic sync işlemi başlatılıyor...');
  return fetch('/api/sync-data', {
    method: 'POST',
    body: JSON.stringify({ lastSync: Date.now() })
  }).catch(err => {
    console.log('Periodic sync hatası (normal):', err);
  });
}

// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAbI5Swc136jjPCKeH1erjoDuhG2GUPnn0",
  authDomain: "bilgisel-3e9a0.firebaseapp.com",
  databaseURL: "https://bilgisel-3e9a0-default-rtdb.firebaseio.com",
  projectId: "bilgisel-3e9a0",
  storageBucket: "bilgisel-3e9a0.appspot.com",
  messagingSenderId: "921907280109",
  appId: "1:921907280109:web:7d9b4844067a7a1ac174e4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification.title || 'Quiz Oyunu';
  const notificationOptions = {
    body: payload.notification.body || 'Yeni bir bildirim var!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: payload.data || {},
    actions: [
      {
        action: 'explore',
        title: 'Oyuna Git',
        icon: '/icons/action-play-128x128.png'
      },
      {
        action: 'close',
        title: 'Kapat',
        icon: '/icons/action-close-128x128.png'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Push notification (fallback)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Yeni bir bildirim var!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Oyuna Git',
        icon: '/icons/action-play-128x128.png'
      },
      {
        action: 'close',
        title: 'Kapat',
        icon: '/icons/action-close-128x128.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Quiz Oyunu', options)
  );
});

// Notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Network durumu izleme
self.addEventListener('online', () => {
  console.log('Service Worker: Online duruma geçildi');
});

self.addEventListener('offline', () => {
  console.log('Service Worker: Offline duruma geçildi');
});

// Hata yakalama
self.addEventListener('error', event => {
  console.error('Service Worker: Hata:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker: İşlenmemiş Promise hatası:', event.reason);
}); 