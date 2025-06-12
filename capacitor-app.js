// Capacitor entegrasyonu için başlangıç scripti
document.addEventListener('DOMContentLoaded', function() {
  // Capacitor yüklü mü kontrol et
  if (typeof Capacitor !== 'undefined' && Capacitor.isNative) {
    // Platform class ekle
    document.body.classList.add('platform-capacitor');
    
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
    } else if (Capacitor.getPlatform() === 'ios') {
      document.body.classList.add('ios-device');
      document.body.classList.add('platform-ios');
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