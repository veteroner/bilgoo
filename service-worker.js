const CACHE_NAME = 'quiz-app-v3';

// Production mode kontrolü
const isProduction = self.location.hostname !== 'localhost' && 
                    !self.location.hostname.includes('127.0.0.1');

// Güvenli logging
const secureLog = {
    log: (msg) => { if (!isProduction) console.log(msg); },
    error: (msg) => { if (!isProduction) console.error(msg); },
    warn: (msg) => { if (!isProduction) console.warn(msg); }
};

const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './i18n.js',
  './firebase-config.js',
  './online-game.js',
  './daily-tasks.js',
  './achievements.js',
  './progress-chart.js',
  './feedback.js',
  './languages/tr/questions.json',
'./languages/de/questions.json',
'./languages/en/questions.json',
'./pending_questions.json',
'./admin-pending-questions.js',
'./admin-pending-styles.css',
  './manifest.json'
  // Harici kaynakları önbellekleme işlemi sorunlara neden oluyor
  // Dış kaynaklı dosyalar genellikle CORS veya içerik politikası sorunları yaratır
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        secureLog.log('Temel uygulama kabuğu önbelleğe alınıyor');
        return cache.addAll(urlsToCache).catch(error => {
          secureLog.error('Cache addAll hatası:', error);
          // Tek tek önbelleğe alma denemeleri
          const cachePromises = urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              secureLog.error(`${url} önbelleğe alınamadı:`, err);
            });
          });
          return Promise.allSettled(cachePromises);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            secureLog.log('Eski cache siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Service Worker'a mesaj gönderme dinleyicisi
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'clearCache') {
    secureLog.log('Önbellek temizleme isteği alındı');
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            secureLog.log(`Önbellek siliniyor: ${cacheName}`);
            return caches.delete(cacheName);
          })
        ).then(() => {
          secureLog.log('Tüm önbellekler temizlendi');
          // Yeni önbelleği oluştur
          return caches.open(CACHE_NAME).then(cache => {
            secureLog.log('Yeni önbellek oluşturuluyor');
            return cache.addAll(urlsToCache);
          });
        });
      })
    );
  }
});

// Cache ve Network Stratejisi
self.addEventListener('fetch', event => {
  // Firebase ve diğer API isteklerini serbest bırak
  if (event.request.url.includes('firebase') || 
      event.request.url.includes('googleapis.com') ||
      event.request.url.includes('gstatic.com') ||
      event.request.url.includes('cdn')) {
    return;
  }

  // manifest.json için özel işlem
  if (event.request.url.endsWith('manifest.json')) {
    // Artık gerçek manifest.json dosyasını kullanabiliriz
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        let fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            let responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Sadece yerel kaynakları önbelleğe al
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache).catch(error => {
                    secureLog.error('Cache put hatası:', error);
                  });
                }
              });

            return response;
          }
        ).catch(error => {
          // If both cache and network fail, show fallback content
          secureLog.log('Fetch işlemi başarısız; offline sayfa görüntüleniyor.', error);
          return caches.match('./index.html');
        });
      })
  );
}); 