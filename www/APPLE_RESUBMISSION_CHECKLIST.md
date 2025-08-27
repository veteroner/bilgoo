# Apple App Store Resubmission Checklist - Bilgoo

## Yapılan Düzeltmeler

### 1. ✅ Data Collection Transparency
- **Cookie consent banner'ı iyileştirildi** - kullanıcıya net bilgi verildi
- **Veri toplama kategorileri açıkça listelendi**
- **Toplanan/toplamayan veriler belirtildi**
- **Privacy summary eklendi** (✅/❌ işaretlerle)

### 2. ✅ Data Use and Sharing Policies
- **AdSense yalnızca kullanıcı izni ile yükleniyor**
- **Firebase Analytics yalnızca izin verildiyse aktif**
- **Kişisel bilgilerin paylaşılmadığı vurgulandı**
- **Üçüncü taraf SDK'lar için açık bilgilendirme**

### 3. ✅ User Control and Data Rights
- **"Sadece Gerekli" ve "Tümünü Kabul Et" seçenekleri**
- **Kullanıcı istediğinde veri silme imkanı**
- **Cookie tercihleri localStorage'da saklanıyor**
- **İzin vermeden tracking yok**

### 4. ✅ Privacy Policy Updates
- **Güncel privacy policy (19 Ağustos 2025)**
- **GDPR/CCPA uyumluluğu**
- **Apple iOS özel bilgileri eklendi**
- **Veri saklama süreleri belirtildi**
- **İletişim bilgileri eklendi**

### 5. ✅ Technical Implementation
- **Conditional AdSense loading**
- **Privacy-compliant Firebase initialization**
- **No automatic tracking without consent**
- **Enhanced cookie management**

## App Store Connect'te Yapılması Gerekenler

### Privacy Section
1. **Data Collection**: YES
2. **Contact Info**: Email Address
   - Purpose: App Functionality, Developer's Advertising or Marketing
   - Linked to user: YES
   - Used to track: NO

3. **Identifiers**: User ID
   - Purpose: App Functionality
   - Linked to user: YES
   - Used to track: NO

4. **Usage Data**: 
   - Game Progress: App Functionality, Analytics
   - Performance Data: App Functionality
   - Linked to user: Varies (Game Progress: YES, Performance: NO)
   - Used to track: NO

5. **User Content**:
   - Game Scores: App Functionality
   - Username: App Functionality
   - Linked to user: YES
   - Used to track: NO

6. **Diagnostics**:
   - Crash Data: App Functionality
   - Linked to user: NO
   - Used to track: NO

### Third-Party SDKs
- **Firebase**: Analytics, App Functionality (NO tracking)
- **AdMob**: Third-party Advertising (YES tracking, only with consent)

## App Review Notes
```
Privacy and Data Collection Updates:

1. ENHANCED COOKIE CONSENT: Users now see detailed information about data collection with clear opt-in/opt-out choices.

2. CONDITIONAL TRACKING: AdSense and Firebase Analytics only load with explicit user consent. No tracking occurs without permission.

3. TRANSPARENT DATA HANDLING: Clear disclosure of what data is collected vs. what is NOT collected (location, contacts, sensitive info).

4. GDPR/CCPA COMPLIANCE: Full compliance with data protection regulations including user rights for data access, deletion, and portability.

5. PRIVACY-FIRST DESIGN: Essential app functionality works without any tracking. Advertising and analytics are purely optional.

6. UPDATED PRIVACY POLICY: Comprehensive privacy policy updated for iOS requirements with specific Apple privacy labels information.

Key Technical Changes:
- AdSense scripts load conditionally based on user consent
- Firebase Analytics requires explicit user permission
- Enhanced cookie management with localStorage persistence
- No automatic data collection without user approval

All data collection is now fully transparent and user-controlled, meeting Apple's latest privacy requirements.
```

## Kritik Test Senaryoları

### ✅ Scenario 1: First Launch
1. Uygulama açılır
2. Cookie banner gösterilir
3. Kullanıcı "Sadece Gerekli" seçer
4. AdSense yüklenmez, Firebase Analytics aktif olmaz
5. Temel uygulama fonksiyonları çalışır

### ✅ Scenario 2: Full Consent
1. Kullanıcı "Tümünü Kabul Et" seçer
2. AdSense yüklenir
3. Firebase Analytics aktifleşir
4. Tercih localStorage'a kaydedilir
5. Reklamlar gösterilir

### ✅ Scenario 3: Privacy Policy Access
1. Cookie banner'da "Gizlilik Politikamız" linki tıklanır
2. Privacy policy sayfası açılır
3. Güncel bilgiler görüntülenir
4. Apple iOS özel bilgileri mevcut

### ✅ Scenario 4: Data Deletion
1. Kullanıcı hesap silme talep eder
2. Tüm kişisel veriler silinir
3. Anonim performans verileri kalabilir (6 ay)

## Son Kontrol Listesi

- [ ] **App Store Connect privacy labels güncellendi**
- [ ] **Privacy policy linki çalışıyor**
- [ ] **Cookie consent banner test edildi**
- [ ] **AdSense conditional loading test edildi**
- [ ] **Firebase Analytics conditional loading test edildi**
- [ ] **App review notes hazırlandı**
- [ ] **Test Flight'ta son test yapıldı**

## Önemli Notlar

⚠️ **Kesinlikle yapılmaması gerekenler:**
- Konum verisi toplama
- Otomatik tracking (consent olmadan)
- Kamera/mikrofon izni isteme
- Diğer uygulamalara erişim

✅ **Apple'ın beğeneceği özellikler:**
- Şeffaf veri toplama
- Kullanıcı kontrolü
- Minimal data collection
- Clear privacy disclosures
- GDPR/CCPA compliance

Bu güncellemelerle Apple'ın privacy gereksinimlerini tam olarak karşılıyoruz.
