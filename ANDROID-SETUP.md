# Quiz Oyunu - Android Uygulama Kurulum Rehberi

Bu rehber Quiz Oyunu'nu Android uygulaması olarak Google Play Store'a yüklemeye hazır hale getirmenizi sağlar.

## 📱 Yaklaşım: PWA + TWA (Trusted Web Activity)

Modern ve hızlı çözüm için PWA (Progressive Web App) + TWA (Trusted Web Activity) yaklaşımını kullanıyoruz.

### ✅ Avantajlar:
- Mevcut web kodunu değiştirmeden kullanım
- Offline çalışma desteği
- Native uygulama deneyimi
- Hızlı güncellemeler
- Küçük dosya boyutu

## 🛠️ Gereksinimler

### 1. Geliştirme Ortamı
- **Java Development Kit (JDK)** 8 veya üstü
- **Android Studio** (en son sürüm)
- **Android SDK** (API Level 24+)
- **Node.js** (opsiyonel, test için)

### 2. Domain ve Hosting
- **SSL sertifikalı domain** (https://)
- **Web hosting** servisi
- **Digital Asset Links** doğrulaması

## 📦 Hazırlanan Dosyalar

### 1. PWA Dosyaları ✅
- `manifest.json` - PWA manifest
- `sw.js` - Service Worker
- `icons/` - Uygulama ikonları
- HTML'de PWA meta tagları

### 2. Android Projesi ✅
- `android-project/` - Tam Android Studio projesi
- TWA konfigürasyonu
- Launcher Activity
- Build scripts

### 3. Mağaza Materyalleri ✅
- `store-listing/` - Play Store açıklamaları
- Screenshots klasörü
- İkon dosyaları

## 🚀 Adım Adım Kurulum

### Adım 1: Ön Hazırlık
```powershell
# Repository'yi klonlayın (varsa)
git clone <your-repo>
cd quiz-oyunu

# Dosyaları kontrol edin
ls manifest.json sw.js android-project/
```

### Adım 2: Domain Ayarları
1. **Web sitenizi SSL ile yayınlayın**
2. **Domain adresini güncelleyin:**
   - `manifest.json` dosyasında start_url
   - `android-project/app/src/main/AndroidManifest.xml` dosyasında host
   - `LauncherActivity.java` dosyasında TWA_URL

### Adım 3: Digital Asset Links
Web sitenizin kök dizinine `.well-known/assetlinks.json` dosyası ekleyin:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.teknova.quizoyunu",
    "sha256_cert_fingerprints": ["YOUR_KEYSTORE_SHA256_FINGERPRINT"]
  }
}]
```

### Adım 4: Android Studio Kurulumu
1. **Android Studio'yu açın**
2. **"Open Existing Project"** ile `android-project/` klasörünü açın
3. **Gradle sync** bekleyin
4. **SDK'ların indirilmesini** bekleyin

### Adım 5: Build İşlemi
PowerShell'de build script'i çalıştırın:

```powershell
# Script'i çalıştırın
.\build-android.ps1

# Domain adresini girin
# Örnek: quizoyunu.com
```

### Adım 6: APK Test
```powershell
# Debug APK'yı telefona yükleyin
adb install quiz-oyunu-debug.apk

# Veya manuel olarak telefona aktarın
```

## 🔑 Keystore ve İmzalama

### Release Keystore Oluşturma
```bash
keytool -genkeypair -v -keystore quiz-release.keystore \
  -alias quiz-key -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass quiz123456 -keypass quiz123456 \
  -dname "CN=Quiz Oyunu, OU=Teknova, O=Teknova, L=Istanbul, S=Istanbul, C=TR"
```

### SHA256 Fingerprint Alma
```bash
keytool -list -v -keystore quiz-release.keystore -alias quiz-key -storepass quiz123456
```

## 📱 Google Play Store Yükleme

### 1. Play Console'da Uygulama Oluşturma
1. [Google Play Console](https://play.google.com/console)'a girin
2. **"Create app"** tıklayın
3. Uygulama detaylarını doldurun:
   - **App name:** Quiz Oyunu
   - **Default language:** Turkish
   - **App category:** Education / Games
   - **Content rating:** Everyone 3+

### 2. APK Yükleme
1. **"Release"** > **"Production"** sekmesine gidin
2. **"Create new release"** tıklayın
3. `quiz-oyunu-release.apk` dosyasını yükleyin
4. Release notes ekleyin

### 3. Store Listing
1. **"Store listing"** sekmesine gidin
2. `store-listing/play-store-description.md` dosyasındaki bilgileri kullanın:
   - **Short description:** Kısa açıklama
   - **Full description:** Uzun açıklama
   - **Screenshots:** screenshots/ klasöründeki görüntüler
   - **App icon:** icons/ klasöründeki ikon

### 4. Content Rating
1. **"Content rating"** sekmesine gidin
2. Questionnaire'i doldurun (Educational/Quiz app)
3. **Everyone 3+** rating alın

### 5. Pricing & Distribution
1. **"Pricing & distribution"** sekmesine gidin
2. **Free** olarak işaretleyin
3. Ülke seçimlerini yapın
4. Content guidelines'ı kabul edin

## 🧪 Test Süreci

### 1. Lokal Test
```powershell
# Web server başlatın
python -m http.server 8000
# Veya
npx serve .

# Tarayıcıda test edin:
# http://localhost:8000
```

### 2. PWA Test
1. Chrome DevTools açın
2. **Application** sekmesine gidin
3. **Service Workers** kontrol edin
4. **Manifest** kontrol edin
5. **"Add to Home Screen"** test edin

### 3. Android Test
```powershell
# APK yükleyin
adb install quiz-oyunu-debug.apk

# Logları izleyin
adb logcat | findstr "QuizOyunu"
```

## 🔧 Sorun Giderme

### PWA Çalışmıyor
- Service Worker doğru kayıtlı mı kontrol edin
- HTTPS zorunluluğunu kontrol edin
- Manifest dosyası geçerli mi kontrol edin

### TWA Açılmıyor
- Digital Asset Links doğru mu kontrol edin
- Domain erişilebilir mi kontrol edin
- SSL sertifikası geçerli mi kontrol edin

### Build Hatası
- Java ve Android SDK yolları doğru mu kontrol edin
- Gradle sync yapıldı mı kontrol edin
- Internet bağlantısı var mı kontrol edin

## 📞 Destek

### Kaynaklar
- [PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [TWA Guide](https://developers.google.com/web/android/trusted-web-activity)
- [Play Console Help](https://support.google.com/googleplay/android-developer)

### İletişim
- **Email:** support@teknova.com.tr
- **Website:** https://teknova.com.tr

## 📋 Checklist

### Yayına Hazırlık ✅
- [ ] PWA çalışıyor
- [ ] Service Worker aktif
- [ ] Domain'de SSL var
- [ ] Digital Asset Links ayarlandı
- [ ] Android APK oluşturuldu
- [ ] Release APK imzalandı
- [ ] Store listing hazırlandı
- [ ] Screenshots alındı
- [ ] İkonlar hazırlandı

### Test ✅
- [ ] Web'de PWA install test edildi
- [ ] Android APK telefonda test edildi
- [ ] Online/Offline çalışma test edildi
- [ ] Push notification test edildi (varsa)
- [ ] Farklı ekran boyutları test edildi

### Play Store ✅
- [ ] Play Console hesabı açıldı ($25 developer fee)
- [ ] Uygulama oluşturuldu
- [ ] APK yüklendi
- [ ] Store listing tamamlandı
- [ ] Content rating alındı
- [ ] Review için gönderildi

## 🎉 Sonuç

Bu rehber ile Quiz Oyunu'nuzu başarıyla Android uygulaması haline getirip Google Play Store'da yayınlayabilirsiniz. 

**Önemli:** İlk defa uygulama yayınlıyorsanız, Google'ın inceleme süreci 1-3 gün sürebilir.

**İyi şanslar! 🚀** 