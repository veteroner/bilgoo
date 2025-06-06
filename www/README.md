# www Klasörü - Mobil Uygulama Web Dizini

Bu klasör, Capacitor framework'ü tarafından mobil uygulama (Android/iOS) oluşturmak için kullanılan web dizinidir.

## Klasör İçeriği

### Mobil-Specific Dosyalar
- `index.html` - Mobil uygulama için optimize edilmiş ana sayfa
- `manifest.json` - PWA manifest dosyası (mobil-specific ayarlar)
- `icons/` - Uygulama ikonları ve avatarlar
- `quizgame.png` - Uygulama görseli
- `style.new.css` - Mobil-specific CSS stilleri
- `tsconfig.json` - TypeScript konfigürasyonu (mobil-optimized)
- `jsconfig.json` - JavaScript IntelliSense konfigürasyonu

### Ana Dizin Referansları
Aşağıdaki dosyalar ana dizindeki dosyalara referans yapar:
- `../style.css` - Ana CSS dosyası
- `../script.js` - Ana JavaScript dosyası
- `../bilgoo-logo.svg` - Logo dosyası
- `../custom-question-styles.css` - Özel soru stilleri
- `../service-worker.js` - Service Worker
- `../questions.json` - Soru veritabanı
- `../firebase-config.js` - Firebase konfigürasyonu
- Diğer tüm JavaScript modülleri

## Optimizasyon Detayları

### Yapılan İyileştirmeler
1. **Duplikasyon Kaldırıldı**: Ana dizinde bulunan dosyaların kopyaları silindi
2. **Referans Güncellemesi**: Dosya yolları ana dizini işaret edecek şekilde güncellendi
3. **Boyut Azaltma**: Klasör boyutu ~300MB'dan ~2MB'a düşürüldü
4. **Bakım Kolaylığı**: Tek kaynak, çoklu hedef prensibi uygulandı

### Kaldırılan Duplike Dosyalar
- `questions.json` (153KB)
- `questions_de.json` (45KB)
- `questions_en.json` (45KB)
- `service-worker.js` (3.5KB)
- `custom-question-styles.css` (7.9KB)
- `bilgoo-logo.svg` (2.4KB)
- `login.html` (45KB)
- `package.json` ve `package-lock.json`
- `style_backup.css` (113KB)

## Capacitor Entegrasyonu

Bu klasör `capacitor.config.ts` dosyasında `webDir: 'www'` olarak tanımlanmıştır.

### Build Süreci
```bash
# Web assets'leri www klasörüne kopyala ve mobil platformları güncelle
npx cap sync

# Android build
npx cap build android

# iOS build
npx cap build ios
```

## Önemli Notlar

1. **Dosya Değişiklikleri**: Ana dizindeki dosyalar değiştirildiğinde `npx cap sync` komutu çalıştırılmalıdır.
2. **Yol Referansları**: www/index.html dosyasındaki `../` referansları korunmalıdır.
3. **Mobil Optimizasyon**: Bu klasördeki index.html mobil cihazlar için optimize edilmiştir.
4. **PWA Desteği**: manifest.json ve service worker entegrasyonu mevcuttur.

## Bakım

- Ana dizindeki dosyalar güncellendiğinde otomatik olarak mobil uygulamaya yansır
- Sadece mobil-specific dosyalar bu klasörde tutulur
- Duplikasyon önlenerek disk alanı tasarrufu sağlanır 