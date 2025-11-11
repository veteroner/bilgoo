# Unity Ads + AdMob Mediation Test Rehberi

## ✅ Kurulum Tamamlandı
- iOS: GoogleMobileAdsMediationUnity (4.13.1.0) + UnityAds (4.13.1) ✓
- Android: com.google.ads.mediation:unity:4.13.1.0 ✓
- Capacitor sync tamamlandı ✓

---

## 1. AdMob Panelinde Mediation Kurulumu

### A) Mediation Group Oluştur (Her format için)

#### Banner için:
1. AdMob → Mediation → "Create mediation group"
2. Ad format: **Banner**
3. Platform: **iOS** (sonra Android için tekrarla)
4. Ad units: Mevcut banner ad unit'inizi seçin
5. "Add ad source" → **Unity Ads** seç
6. Bilgileri gir:
   - Game ID (iOS): `5968312`
   - Organization Core ID: `18968331722098`
   - Placement ID: `banner` (Unity Dashboard'da oluşturacaksınız)
7. eCPM: **Auto** veya manuel değer (örn: $5 - Unity'yi öncelikli yapmak için)
8. Save

#### Interstitial için:
- Yukarıdaki adımları tekrarla
- Game ID aynı: `5968312` (iOS) / `5968313` (Android)
- Placement ID: `video` veya `interstitial`

#### Rewarded için:
- Yukarıdaki adımları tekrarla
- Placement ID: `rewardedVideo` veya `rewarded`

### B) Android için Tekrarla
- Aynı adımlar, sadece Game ID: `5968313`

---

## 2. Unity Dashboard'da Placement Oluştur

1. Unity Dashboard → **Placements** → "Add placement"
2. Aşağıdaki placement'ları oluşturun:
   - **banner** (Type: Banner)
   - **video** veya **interstitial** (Type: Interstitial)
   - **rewardedVideo** veya **rewarded** (Type: Rewarded)
3. Her placement için "Default" bırakabilirsiniz

---

## 3. Test Cihazı Tanımlama

### iOS Test Cihazı (IDFA)
1. Xcode'da projeyi aç: `/Users/onerozbey/Desktop/quiz-oyunu/ios/App/App.xcworkspace`
2. Gerçek iPhone'u bağla
3. Uygulamayı çalıştır
4. Console loglarında şu satırı ara:
   ```
   <Google> To get test ads on this device, set: GADMobileAds.sharedInstance.requestConfiguration.testDeviceIdentifiers = @[ @"YOUR_DEVICE_ID" ];
   ```
5. Device ID'yi kopyala
6. AdMob → Settings → Test devices → "Add test device" → ID'yi yapıştır

### Android Test Cihazı (GAID)
1. Android Studio'da projeyi aç: `/Users/onerozbey/Desktop/quiz-oyunu/android`
2. Gerçek Android cihazı bağla
3. Uygulamayı çalıştır
4. Logcat'te şu satırı ara:
   ```
   Use RequestConfiguration.Builder().setTestDeviceIds(Arrays.asList("YOUR_DEVICE_ID"))
   ```
5. Device ID'yi kopyala
6. AdMob → Settings → Test devices → "Add test device" → ID'yi yapıştır

### Unity Test Cihazı (Opsiyonel)
- Unity Dashboard → Testing → "Add Test Device"
- Cihaz ID'sini ekle (aynı IDFA/GAID)

---

## 4. Test Senaryoları

### Senaryo 1: Simülatör/Emulator (Temel Doğrulama)
**Amaç:** SDK conflict olmadığını doğrula

```bash
# iOS
cd /Users/onerozbey/Desktop/quiz-oyunu
npx cap open ios
# Xcode'da Simulator seç → Run

# Android
npx cap open android
# Android Studio'da Emulator seç → Run
```

**Beklenen:**
- ✅ Uygulama açılır
- ✅ AdMob test reklamları görünür
- ✅ Console'da Unity adapter hatası yok

---

### Senaryo 2: Gerçek Cihaz (Mediation Doğrulama)
**Amaç:** Unity Ads'in mediation'da çalıştığını doğrula

#### iOS (Gerçek iPhone)
1. Xcode'da projeyi aç
2. Signing & Capabilities → Team seç
3. Gerçek iPhone'u bağla
4. Run
5. Console'da şu logları ara:
   ```
   [Unity Ads] Initializing Unity Ads
   [Unity Ads] Unity Ads initialized successfully
   [GADMobileAds] Mediation adapter: Unity Ads
   ```

#### Android (Gerçek telefon)
1. Android Studio'da projeyi aç
2. USB Debugging açık gerçek cihazı bağla
3. Run
4. Logcat'te şu logları ara:
   ```
   UnityAds: Unity Ads initializing
   UnityAds: Unity Ads initialized
   GADMobileAds: Adapter Unity Ads
   ```

**Beklenen:**
- ✅ Banner görünür (AdMob veya Unity'den)
- ✅ Interstitial gösterilir
- ✅ Rewarded video oynatılır
- ✅ Console'da "Unity Ads" adapter çağrısı görünür

---

## 5. Waterfall Doğrulama (Hangisi Doldurdu?)

### AdMob Panelinde Kontrol
1. AdMob → Mediation → İlgili grup → "View reports"
2. Son 24 saat içinde:
   - Unity Ads'ten kaç impression geldi?
   - AdMob'dan kaç impression geldi?
3. Unity öncelikliyse → Unity satırı daha çok impression gösterir

### Console Loglarında Kontrol

#### iOS
```bash
# Xcode Console'da filtrele:
Unity Ads
GADMobileAds
```

#### Android
```bash
# Logcat'te filtrele:
adb logcat | grep -E "UnityAds|GADMobileAds"
```

**Log örnekleri:**
```
✅ Unity doldurdu:
[GADMobileAds] Mediation adapter Unity Ads loaded ad
[Unity Ads] Showing ad for placement: banner

✅ AdMob doldurdu (Unity boş döndü):
[Unity Ads] No fill for placement: banner
[GADMobileAds] Using AdMob network
```

---

## 6. Sorun Giderme

### Unity Ads Görünmüyorsa
1. ✅ Mediation group'ta Unity Ads eCPM değeri AdMob'dan yüksek mi?
2. ✅ Unity Dashboard → Placements'ta placement ID'ler doğru mu?
3. ✅ Game ID'ler doğru girilmiş mi? (iOS: 5968312, Android: 5968313)
4. ✅ Unity Dashboard → Testing → Test mode açık mı?
5. ✅ AdMob panelinde mediation group "Active" mi?

### Build Hataları
```bash
# iOS
cd /Users/onerozbey/Desktop/quiz-oyunu/ios/App
pod deintegrate && pod install

# Android
cd /Users/onerozbey/Desktop/quiz-oyunu/android
./gradlew clean build
```

---

## 7. Production'a Geçiş (Test Başarılı Olduktan Sonra)

### A) app-ads.txt Güncelle
1. Unity Dashboard → Organization settings → Developer website ekle
2. "App-ads.txt" bölümünden satırları kopyala
3. `/Users/onerozbey/Desktop/quiz-oyunu/app-ads.txt` dosyasına ekle
4. Geliştirici web sitenizin köküne yükle (örn: https://bilgoo.com/app-ads.txt)

### B) Test Mode Kapat
- Unity Dashboard → Testing → "Client test mode not overridden" bırak
- AdMob test cihazlarını production build'de kaldırın

### C) Waterfall Optimizasyonu
- İlk 1 hafta: Unity'yi üstte bırak (AdMob limit varken)
- Limit kalktıktan sonra: eCPM'lere göre otomatik sırala veya manuel ayarla

---

## 8. Hızlı Komutlar

```bash
# iOS build + gerçek cihazda test
cd /Users/onerozbey/Desktop/quiz-oyunu
npx cap sync ios
npx cap open ios
# Xcode'da: Select your iPhone → Run

# Android build + gerçek cihazda test
npx cap sync android
npx cap open android
# Android Studio'da: Select your device → Run

# Logları izle (Android)
adb logcat | grep -E "UnityAds|AdMob|GAD"

# Logları izle (iOS - Xcode Console'da filtre)
# Filter: Unity OR AdMob OR GAD
```

---

## Özet Checklist

### Kurulum
- [x] iOS SDK kuruldu (4.13.1)
- [x] Android SDK kuruldu (4.13.1.0)
- [x] Capacitor sync yapıldı

### AdMob Panel
- [ ] Banner mediation group (iOS + Android)
- [ ] Interstitial mediation group (iOS + Android)
- [ ] Rewarded mediation group (iOS + Android)
- [ ] Unity Ads eCPM ayarlandı (üstte)

### Unity Panel
- [ ] Placement'lar oluşturuldu (banner, video, rewarded)
- [ ] Test cihazları eklendi

### Test
- [ ] Simülatör/Emulator'da çalıştı
- [ ] Gerçek cihazda banner göründü
- [ ] Gerçek cihazda interstitial gösterildi
- [ ] Gerçek cihazda rewarded video çalıştı
- [ ] Console'da Unity Ads adapter çağrısı görüldü

### Production
- [ ] app-ads.txt güncellendi
- [ ] Test mode kapatıldı
- [ ] İlk impression'lar geldi

---

**Önemli:** AdMob Mediation kullandığınız için, mevcut `monetization.js` kodunuzda **hiçbir değişiklik gerekmez**. AdMob SDK otomatik olarak Unity Ads adapter'ı çağırır.

**Referanslar:**
- [Unity Ads Get Started](https://docs.unity.com/en-us/grow/ads/get-started)
- [AdMob iOS Unity Mediation](https://developers.google.com/admob/ios/mediation/unity)
- [AdMob Android Unity Mediation](https://developers.google.com/admob/android/mediation/unity)
- [Unity iOS SDK Releases](https://github.com/Unity-Technologies/unity-ads-ios/releases)
- [Unity Android SDK Releases](https://github.com/Unity-Technologies/unity-ads-android/releases)

