# Apple App Store Privacy Labels Rehberi - Bilgoo (Güncellenmiş)

Apple App Store Connect'te Privacy section'ı aşağıdaki gibi doldurmanız gerekiyor:

## 1. Data Collection Summary
**Does this app collect data?** - YES

## 2. Data Types We Collect

### Contact Info
- **Email Address** 
  - Used for: App functionality, Developer's advertising or marketing
  - Linked to user: YES
  - Used to track user: NO
  - Data retention: Until account deletion or user request

### Identifiers
- **User ID**
  - Used for: App functionality
  - Linked to user: YES
  - Used to track user: NO
  - Data retention: Until account deletion

### Usage Data
- **Game Progress and Statistics**
  - Used for: App functionality, Analytics
  - Linked to user: YES
  - Used to track user: NO
  - Data retention: Until account deletion

- **Performance Data**
  - Used for: Analytics, App functionality
  - Linked to user: NO
  - Used to track user: NO
  - Data retention: 26 months (Firebase default)

### User Content
- **Game Scores and Achievements**
  - Used for: App functionality
  - Linked to user: YES
  - Used to track user: NO
  - Data retention: Until account deletion

- **Username**
  - Used for: App functionality
  - Linked to user: YES
  - Used to track user: NO
  - Data retention: Until account deletion

### Diagnostics
- **Crash Data**
  - Used for: App functionality
  - Linked to user: NO
  - Used to track user: NO
  - Data retention: 6 months

- **Performance Data**
  - Used for: App functionality
  - Linked to user: NO
  - Used to track user: NO
  - Data retention: 6 months

## 3. Data NOT Collected

Aşağıdaki kategorilerde veri toplamıyoruz:
- **Location** - Hiçbir konum verisi toplamıyoruz
- **Health & Fitness** - Sağlık verisi toplamıyoruz
- **Financial Info** - Mali bilgi toplamıyoruz
- **Contacts** - Rehber bilgisi toplamıyoruz
- **Sensitive Info** - Hassas kişisel bilgi toplamıyoruz
- **Photos or Videos** - Fotoğraf/video erişimi yok
- **Audio Data** - Ses verisi toplamıyoruz
- **Browsing History** - Tarama geçmişi toplamıyoruz
- **Search History** - Arama geçmişi toplamıyoruz
- **Device ID** - Cihaz kimliği toplamıyoruz
- **Advertising Data** - Reklam kimliği toplamıyoruz (kullanıcı izni olmadan)

## 4. Üçüncü Taraf SDK'lar

### Google AdMob/AdSense
- **Advertising Data**: Anonymous advertising identifiers (YALNIZCA kullanıcı izni ile)
- **Usage Data**: Ad interaction data (YALNIZCA kullanıcı izni ile)
- Used for: Third-party advertising
- Linked to user: NO
- Used to track user: YES (YALNIZCA advertising consent verirse)
- Data retention: Google'ın politikalarına göre

### Firebase
- **Usage Data**: App performance and crash data
- **Identifiers**: Installation ID (kişisel değil)
- Used for: App functionality, Analytics
- Linked to user: NO
- Used to track user: NO
- Data retention: 26 months (Google Analytics default)

## 5. Privacy Practices

### Data Security
- Veriler transit sırasında HTTPS ile şifrelenir
- Veriler Firebase şifreleme ile depolanır
- Kullanıcı şifreleri hash ve salt ile korunur
- End-to-end şifreleme Firebase tarafından sağlanır

### Data Retention
- **Kullanıcı hesap verileri**: Hesap silinene kadar
- **Oyun istatistikleri**: Hesap silinene kadar
- **Analitik veriler**: 26 ay (Google Analytics varsayılan)
- **Reklam verileri**: Google'ın politikasına göre
- **Çökme raporları**: 6 ay
- **Log dosyaları**: 6 ay

### User Control
- Kullanıcılar e-posta ile veri silme talep edebilir
- Kullanıcılar kişiselleştirilmiş reklamları devre dışı bırakabilir
- Kullanıcılar verilerini dışa aktarabilir
- Uygulama içinde "Hesap Sil" özelliği mevcut

## 6. GDPR/CCPA Compliance
- Kişisel verilere erişim hakkı
- Kişisel verileri silme hakkı
- Veri taşınabilirliği hakkı
- İşleme itiraz etme hakkı
- Otomatik karar almaya karşı koruma

## 7. Children's Privacy
- Uygulama 13 yaş altı çocuklara yönelik değildir
- 13 yaş altından bilerek veri toplama yok
- 13 yaş altı kullanıcılar için ebeveyn izni gerekli

## 8. iOS Specific Privacy Features

### App Tracking Transparency (ATT)
- IDFA kullanımı için kullanıcı izni istenir
- İzleme yalnızca kullanıcı izni verirse yapılır
- Reklam kişiselleştirmesi isteğe bağlıdır

### Sign in with Apple (Gelecek Sürümde)
- Apple ID ile giriş seçeneği eklenecek
- E-posta gizleme desteği

### Privacy Labels
Tüm veri toplama kategorileri App Store'da açıkça listelenir

---

## ÖNEMLİ RESUBMISSION NOTLARI:

### 1. App Review Notes İçin:
```
"Bu sürümde aşağıdaki gizlilik iyileştirmeleri yapılmıştır:

1. GDPR/CCPA uyumluluğu tam olarak sağlandı
2. Çerez onay sistemi geliştirildi ve kullanıcıya açık seçenekler sunuldu
3. Veri toplama şeffaflığı artırıldı
4. Veri saklama süreleri netleştirildi
5. Kullanıcı kontrol seçenekleri geliştirildi
6. Üçüncü taraf SDK kullanımı sadece kullanıcı izni ile aktif hale gelir
7. Privacy Policy'de Apple standartlarına uygun detaylar eklendi

Hiçbir hassas kişisel veri toplamıyoruz ve tüm veriler kullanıcı kontrolündedir."
```

### 2. Privacy Policy Doğrulaması:
- Privacy Policy linki: https://yourdomain.com/privacy-policy.html
- İletişim: bilgoo.quiz@gmail.com
- Güncel tarih: 19 Ağustos 2025

### 3. Kritik Noktalar:
1. **ASLA** konum verisi toplamayın
2. **ASLA** kamera/mikrofon iznini istemeyin
3. AdSense yalnızca kullanıcı onayı ile yüklensin
4. Firebase Analytics minimal kullanım
5. Crash raporları anonim olsun

### 4. Test Protokolü:
1. Uygulamayı ilk açışta cookie banner gösterilsin
2. "Sadece Gerekli" seçilirse reklamlar görünmesin
3. "Tümünü Kabul Et" seçilirse AdSense yüklensin
4. Gizlilik Politikası linkinin çalıştığını doğrulayın
5. Hesap silme özelliğinin çalıştığını test edin

Bu güncellemelerle Apple'ın privacy gereksinimlerini tam olarak karşılıyoruz.
```
