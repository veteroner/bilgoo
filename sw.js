const CACHE_NAME = 'quiz-oyunu-v1.3.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Font awesome ikonları
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  // Firebase SDK
  'https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.1/firebase-storage-compat.js'
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

// Network istekleri yakalama
self.addEventListener('fetch', event => {
  // Sadece GET isteklerini yakala
  if (event.request.method !== 'GET') {
    return;
  }

  // Firebase Auth ve Firestore isteklerini cache'leme
  if (event.request.url.includes('firebaseapp.com') || 
      event.request.url.includes('googleapis.com') ||
      event.request.url.includes('identitytoolkit.googleapis.com')) {
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
              cache.put(event.request, responseToCache);
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
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync çalışıyor');
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Offline sırasında biriken verileri senkronize et
  return new Promise((resolve) => {
    // Bu kısımda offline sırasında kaydedilen puanları, 
    // oynanan oyunları vs. senkronize edebiliriz
    resolve();
  });
}

// Push notification
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