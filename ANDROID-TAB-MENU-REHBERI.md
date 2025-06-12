# Android Uygulamasında Tab Menü Kullanımı

Bu belge, Android uygulamasında hamburger menü yerine tab menü kullanımı için yapılan değişiklikleri ve işleyişini açıklar.

## Yapılan Değişiklikler

1. **CSS Değişiklikleri:**
   - Android uygulamasında (platform-capacitor ve platform-cordova sınıflarında) hamburger menü tamamen gizlendi
   - Tab bar görünürlüğü artırıldı ve her platformda görünmesi sağlandı
   - Tab butonlarının boyutları ve özellikleri Android'e uygun şekilde ayarlandı
   - Uygulamanın alt kısmında tab bar için yeterli boşluk sağlandı

2. **JavaScript Değişiklikleri:**
   - Ayarlar tab'ına tıklandığında hamburger menü yerine doğrudan ayarlar modalının açılması sağlandı
   - Tüm tab butonları için platformlara özel davranışlar tanımlandı

## Tab Bar Özellikleri

- **Ana Sayfa:** Uygulamanın ana sayfasına döner
- **Profil:** Kullanıcı profil sayfasını gösterir
- **Arkadaşlar:** Arkadaşlar sayfasını gösterir
- **Ayarlar:** Ayarlar modalını açar

## Teknik Detaylar

Tab bar, aşağıdaki HTML yapısı ile oluşturulmuştur:

```html
<div class="mobile-tab-bar" id="mobile-tab-bar">
    <div class="tab-item" id="tab-home">
        <i class="fas fa-home"></i>
        <span>Ana Sayfa</span>
    </div>
    <div class="tab-item" id="tab-profile">
        <i class="fas fa-user"></i>
        <span>Profil</span>
    </div>
    <div class="tab-item" id="tab-friends">
        <i class="fas fa-user-friends"></i>
        <span>Arkadaş</span>
    </div>
    <div class="tab-item" id="tab-settings">
        <i class="fas fa-cog"></i>
        <span>Ayarlar</span>
    </div>
</div>
```

Her tab-item, ilgili sayfalara yönlendirme için JavaScript ile yapılandırılmıştır. Platformu algılamak için capacitor-app.js dosyasında eklenen platform-capacitor sınıfı kullanılarak stil uygulanmaktadır.

## CSS Yapılandırması

Android uygulaması için tab bar'ın görünümü aşağıdaki CSS kurallarıyla sağlanmıştır:

```css
.platform-capacitor .mobile-tab-bar,
.platform-cordova .mobile-tab-bar {
    display: flex !important;
    visibility: visible !important;
    position: fixed !important;
    bottom: 0 !important;
    height: 70px !important;
    /* diğer özellikler */
}

.platform-capacitor .hamburger-toggle,
.platform-cordova .hamburger-toggle,
.platform-cordova .hamburger-menu,
.platform-capacitor .hamburger-menu {
    display: none !important;
    visibility: hidden !important;
    /* diğer özellikler */
}
```

## Platform Algılama

Android uygulamasının algılanması ve uygun CSS sınıflarının eklenmesi, capacitor-app.js dosyasında aşağıdaki kod ile sağlanır:

```javascript
if (typeof Capacitor !== 'undefined' && Capacitor.isNative) {
    // Platform class ekle
    document.body.classList.add('platform-capacitor');
    
    // Platform spesifik ayarlamalar
    if (Capacitor.getPlatform() === 'android') {
        document.body.classList.add('android-device');
        document.body.classList.add('platform-android');
    }
}
```

## Dikkat Edilmesi Gerekenler

- Tab bar'ın yüksekliği ve içindeki butonların boyutu, farklı ekran boyutlarında doğru görünecek şekilde ayarlanmıştır
- Sayfa içeriğinin tab bar'ın altında kalmaması için container'a yeterli alt boşluk eklenmiştir (90px)
- Ayarlar tab'ı, hamburger menü yerine doğrudan ayarlar modalını açacak şekilde düzenlenmiştir

Bu değişiklikler sayesinde Android uygulamasında modern ve kullanıcı dostu bir tab menü deneyimi sağlanmıştır. 