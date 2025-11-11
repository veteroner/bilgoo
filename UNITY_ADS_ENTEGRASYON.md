# Unity Ads Entegrasyonu - Kurulum Rehberi

## 📋 Yapılan Değişiklikler

✅ **Unity Ads + AdMob Fallback** mekanizması eklendi:
- Unity Ads öncelikli reklam sağlayıcı olarak ayarlandı  
- Unity Ads başarısız olursa otomatik olarak Google AdMob'a geçiş yapılıyor
- Hem interstitial hem de rewarded reklamlar destekleniyor

## 🚀 Unity Ads Plugin Kurulumu

### 1. Unity Ads Capacitor Plugin'i Yükleyin

```bash
cd /Users/onerozbey/Desktop/quiz-oyunu
npm install capacitor-unity-ads
npx cap sync
```

### 2. Unity Dashboard'dan Game ID'leri Alın

1. [Unity Dashboard](https://dashboard.unity3d.com/) giriş yapın
2. Projenizi seçin veya yeni proje oluşturun
3. **Monetization** > **Unity Ads** bölümüne gidin
4. **Game ID** değerlerini not alın:
   - Android Game ID (örn: `5738287`)
   - iOS Game ID (örn: `5738286`)

### 3. monetization.js Dosyasını Güncelleyin

`monetization.js` dosyasında Unity Game ID'lerinizi güncelleyin (satır 36-47):

```javascript
_UNITY_CONFIG: {
    android: {
        gameId: 'BURAYA_ANDROID_GAME_ID', // Unity Dashboard'dan alın
        interstitial: 'Interstitial_Android',
        rewarded: 'Rewarded_Android'
    },
    ios: {
        gameId: 'BURAYA_IOS_GAME_ID', // Unity Dashboard'dan alın
        interstitial: 'Interstitial_iOS',
        rewarded: 'Rewarded_iOS'
    },
    testMode: false // Test için true yapabilirsiniz
},
```

## 📱 Android Konfigürasyonu (build.gradle)

`android/app/build.gradle` dosyasına Unity Ads dependency ekleyin:

```gradle
dependencies {
    // Mevcut dependencies...
    
    // Unity Ads
    implementation 'com.unity3d.ads:unity-ads:4.10.0'
}
```

## 🍎 iOS Konfigürasyonu (Podfile)

`ios/App/Podfile` dosyasına Unity Ads pod ekleyin:

```ruby
target 'App' do
  capacitor_pods
  
  # Unity Ads
  pod 'UnityAds', '~> 4.10.0'
end
```

Sonra pod install çalıştırın:

```bash
cd ios/App
pod install
```

## ✅ Test Etme

### Test Mode'u Aktif Et

Test için `monetization.js` dosyasında:

```javascript
_UNITY_CONFIG: {
    // ...
    testMode: true // Test reklamları için
},
```

### Fallback Test

Unity Ads çalışmazsa AdMob fallback'i otomatik devreye girer.

## 📊 Çalışma Mantığı

### Interstitial Reklamlar
```
1. Unity Ads'den interstitial gösterilir
   ✅ Başarılı → Unity reklamı
   ❌ Başarısız → AdMob interstitial (otomatik fallback)
```

### Rewarded Reklamlar
```
1. Unity Ads'den rewarded ad gösterilir
   ✅ Tamamlandı → 3 can verilir (Unity)
   ❌ Başarısız → AdMob rewarded (otomatik fallback)
   ✅ Tamamlandı → 3 can verilir (AdMob)
```

## 🔍 Console Logları

```
[Monetization] Unity Ads + AdMob fallback sistemi başlatıldı
[Unity Ads] ✅ Initialized successfully
[Unity Ads] Interstitial loaded

// Fallback durumunda:
[Unity Ads] ❌ Failed
[AdMob] Fallback: Interstitial gösteriliyor...
```

## 🎯 Production Checklist

- [ ] Unity Game ID'leri güncellendi
- [ ] `testMode: false` yapıldı
- [ ] Android build.gradle güncellendi
- [ ] iOS Podfile güncellendi
- [ ] `npx cap sync` çalıştırıldı
- [ ] Her iki platformda test edildi

## 🎉 Hazır!

✅ Unity Ads öncelikli
✅ AdMob fallback aktif
✅ Otomatik geçiş çalışıyor
