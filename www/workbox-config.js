module.exports = {
  globDirectory: './',
  globPatterns: [
    'index.html',
    'style.css',
    'script.js',
    'firebase-config.js',
    'online-game.js',
    'daily-tasks.js',
    'achievements.js',
    'progress-chart.js',
    'languages/**/*.json',
    'icons/**/*.{png,svg}',
    'manifest.json'
  ],
  swDest: 'service-worker.js',
  clientsClaim: true,
  skipWaiting: true,
  navigateFallbackDenylist: [
    /^.*googlesyndication\.com.*$/,
    /^.*googleadservices\.com.*$/,
    /^.*doubleclick\.net.*$/,
    /^.*google-analytics\.com.*$/,
    /^.*googletagmanager\.com.*$/,
    /^.*google\.com\/adsense.*$/,
    /^.*googletagservices\.com.*$/,
    /^.*adservice\.google\..*$/,
    /^.*pagead2\..*$/,
    /^.*facebook\.com\/tr.*$/,
    /^.*fbcdn\..*$/,
    /^.*ads\..*$/
  ],
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 gün
        }
      }
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 24 * 60 * 60 // 1 gün
        }
      }
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets'
      }
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365 // 1 yıl
        }
      }
    }
  ]
}; 