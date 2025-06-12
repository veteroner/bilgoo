// Capacitor entegrasyonu için başlangıç scripti
document.addEventListener('DOMContentLoaded', function() {
  // Capacitor yüklü mü kontrol et
  if (typeof Capacitor !== 'undefined' && Capacitor.isNative) {
    // Platform class ekle (doküman ve html elementine de ekle)
    document.body.classList.add('platform-capacitor');
    document.documentElement.classList.add('platform-capacitor');
    document.querySelector('html').classList.add('platform-capacitor');
    
    // Durum çubuğunu ayarla
    if (typeof StatusBar !== 'undefined') {
      StatusBar.setBackgroundColor({ color: '#4a148c' });
      StatusBar.setStyle({ style: 'LIGHT' });
    }

    // Splash screen kontrolü
    if (typeof SplashScreen !== 'undefined') {
      setTimeout(() => {
        SplashScreen.hide();
      }, 1000);
    }

    // Platform spesifik ayarlamalar
    if (Capacitor.getPlatform() === 'android') {
      document.body.classList.add('android-device');
      document.body.classList.add('platform-android');
      document.documentElement.classList.add('android-device');
      document.documentElement.classList.add('platform-android');
      
      // Tab menüyü Android nav barın üstüne konumlandır
      function setupTabBar() {
        const tabBar = document.getElementById('mobile-tab-bar');
        
        if (tabBar) {
          tabBar.style.display = 'flex';
          tabBar.style.visibility = 'visible';
          tabBar.style.zIndex = '999999';
          tabBar.style.position = 'fixed';
          tabBar.style.bottom = '55px'; // Android nav barın üzerinde
          tabBar.style.left = '0';
          tabBar.style.right = '0';
          tabBar.style.width = '100%';
          tabBar.style.height = '70px';
          tabBar.style.backgroundColor = '#7b43c9';
        }
        
        // Container için hafif bir boşluk
        document.body.style.paddingBottom = '60px';
        const container = document.querySelector('.container');
        if (container) {
          container.style.paddingBottom = '60px';
        }
      }
      
      // Uygulama başladığında ve tekrar 1 saniye sonra çağır
      setupTabBar();
      setTimeout(setupTabBar, 1000);
    } else if (Capacitor.getPlatform() === 'ios') {
      document.body.classList.add('ios-device');
      document.body.classList.add('platform-ios');
      document.documentElement.classList.add('ios-device');
      document.documentElement.classList.add('platform-ios');
    }

    // Back button işleme
    document.addEventListener('backButton', function() {
      // Geri tuşuna basılınca yapılacak işlemler
      if (document.querySelector('.popup-active')) {
        // Açık popup varsa kapat
        document.querySelector('.popup-active').classList.remove('popup-active');
      } else if (document.querySelector('.back-button')) {
        // Geri butonu varsa tıkla
        document.querySelector('.back-button').click();
      } else {
        // Uygulama ana sayfadaysa çıkış teklif et
        if (confirm('Uygulamadan çıkmak istiyor musunuz?')) {
          App.exitApp();
        }
      }
    });
  }
}); 