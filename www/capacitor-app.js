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
      
      // Tab menünün görünürlüğünü çok daha agresif şekilde güçlendir
      function forceTabBarVisibility() {
        const tabBar = document.getElementById('mobile-tab-bar');
        const fixedTabBar = document.getElementById('mobile-tab-bar-fixed');
        
        // Ana tab bar
        if (tabBar) {
          tabBar.style.display = 'flex';
          tabBar.style.visibility = 'visible';
          tabBar.style.opacity = '1';
          tabBar.style.zIndex = '999999';
          tabBar.style.position = 'fixed';
          tabBar.style.bottom = '0';
          tabBar.style.left = '0';
          tabBar.style.right = '0';
          tabBar.style.width = '100%';
          tabBar.style.height = '80px';
          tabBar.style.backgroundColor = '#7b43c9';
          tabBar.style.borderTop = '3px solid rgba(255,255,255,0.4)';
          tabBar.style.boxShadow = '0 -5px 15px rgba(0,0,0,0.3)';
        }
        
        // Yedek tab bar
        if (fixedTabBar) {
          fixedTabBar.style.display = 'flex';
          fixedTabBar.style.visibility = 'visible';
          fixedTabBar.style.opacity = '1';
        }
        
        // Sayfa boşluğu
        document.body.style.paddingBottom = '90px';
        const container = document.querySelector('.container');
        if (container) {
          container.style.paddingBottom = '90px';
        }
      }
      
      // Hemen ve aralıklarla çağır
      forceTabBarVisibility();
      setTimeout(forceTabBarVisibility, 500);
      setTimeout(forceTabBarVisibility, 1000);
      setTimeout(forceTabBarVisibility, 2000);
      
      // Sayfa scroll olduğunda da tab bar'ı görünür tut
      window.addEventListener('scroll', forceTabBarVisibility);
      window.addEventListener('resize', forceTabBarVisibility);
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