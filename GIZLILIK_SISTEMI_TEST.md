# 🔒 Gizlilik Sistemi Test Rehberi

## ✅ Test Checklist

### 1. Temel Sistemler
- [ ] `privacy-settings.html` sayfası açılıyor
- [ ] Firebase bağlantısı çalışıyor
- [ ] Çerez ayarları değiştiriliyor
- [ ] Veri indirme butonu çalışıyor

### 2. Audit Log Sistemi
```javascript
// Browser konsolunda test edin:
window.AuditLogger.logUserAction('test', {test: true});
```
- [ ] Konsol hatası yok
- [ ] Firebase'de `audit_logs` koleksiyonunda kayıt var

### 3. Data Retention Sistemi
```javascript
// Browser konsolunda test edin:
window.DataRetentionManager.getRetentionInfo('userProfile');
```
- [ ] Konsol hatası yok
- [ ] Veri saklama bilgileri döndü

### 4. Menü Entegrasyonu
- [ ] Ana sayfada hamburger menüde "Gizlilik Ayarları" var
- [ ] Link tıklandığında `privacy-settings.html` açılıyor

## 🔍 Veri Erişim Noktaları

### Kullanıcı Arayüzü
1. **Ana Uygulama:** `index.html` → ☰ → Gizlilik Ayarları
2. **Login Sayfası:** `login.html` → Alt kısımda linkler
3. **Direkt Erişim:** `privacy-settings.html`

### Firebase Database
```
Koleksiyonlar:
├── audit_logs/          # Tüm kullanıcı aktiviteleri
├── privacy_settings/    # Kullanıcı gizlilik tercihleri
├── consent_history/     # Rıza onay geçmişi
├── system_metrics/      # Sistem kullanım metrikleri
└── compliance_reports/  # GDPR uyumluluk raporları
```

### Browser Storage
```
localStorage:
├── cookieConsent        # Çerez tercihleri
├── user_language        # Dil ayarları
├── gameHistory         # Oyun geçmişi
└── userStats           # Kullanıcı istatistikleri
```

## ⚠️ Olası Sorunlar ve Çözümler

### Sorun 1: Firebase Bağlantı Hatası
**Belirti:** Konsol'da Firebase hatası
**Çözüm:** 
```javascript
// firebase-config.js dosyasını kontrol edin
// İnternet bağlantısını kontrol edin
```

### Sorun 2: privacy-settings.html Açılmıyor
**Belirti:** 404 veya sayfa yüklenmiyor
**Çözüm:**
```bash
# Dosya var mı kontrol edin:
ls privacy-settings.html

# Eğer yoksa yeniden oluşturun
```

### Sorun 3: Audit Logger Çalışmıyor
**Belirti:** `window.AuditLogger undefined`
**Çözüm:**
```html
<!-- index.html dosyasında bu satır var mı kontrol edin: -->
<script src="audit-log.js"></script>
```

### Sorun 4: Data Retention Çalışmıyor
**Belirti:** `window.DataRetentionManager undefined`
**Çözüm:**
```html
<!-- index.html dosyasında bu satır var mı kontrol edin: -->
<script src="data-retention.js"></script>
```

### Sorun 5: Menü Linki Yok
**Belirti:** Hamburger menüde "Gizlilik Ayarları" görünmüyor
**Çözüm:**
```html
<!-- index.html dosyasında bu kod var mı kontrol edin: -->
<div class="menu-item" id="menu-privacy-settings">
    <i class="fas fa-shield-alt"></i> 
    <span id="menu-privacy-text">Gizlilik Ayarları</span>
</div>
```

## 🧪 Test Komutları

### Browser Konsolunda
```javascript
// Sistem durumu
console.log('Firebase:', typeof firebase);
console.log('AuditLogger:', typeof window.AuditLogger);
console.log('DataRetentionManager:', typeof window.DataRetentionManager);

// Test log gönder
window.AuditLogger.logUserAction('manual_test', {timestamp: new Date()});

// Veri indirme test
document.getElementById('export-data').click();

// Çerez ayarları test
document.getElementById('analytics-cookies').checked = true;
```

### Dosya Kontrolleri
```bash
# Tüm dosyalar var mı?
ls privacy-settings.html
ls data-retention.js
ls audit-log.js

# index.html'de script tagları var mı?
grep -n "data-retention.js" index.html
grep -n "audit-log.js" index.html
```

## 📈 Başarı Kriterleri

### ✅ Sistem Başarılı Sayılır Eğer:
1. Privacy settings sayfası açılıyor
2. Çerez ayarları kaydediliyor
3. Veri indirme çalışıyor
4. Audit loglar Firebase'e kaydediliyor
5. Menü linki çalışıyor
6. Konsol'da hata yok

### ❌ Sistem Başarısız Sayılır Eğer:
1. Privacy settings sayfası 404 veriyor
2. Firebase bağlantı hatası var
3. Audit Logger undefined
4. Data Retention Manager undefined
5. Veri indirme çalışmıyor

## 🔧 Hızlı Tamir

### Problem varsa bu dosyaları kontrol edin:
1. `index.html` - Script tagları ve menü linki
2. `privacy-settings.html` - Ana gizlilik sayfası
3. `firebase-config.js` - Firebase bağlantısı
4. `audit-log.js` - Log sistemi
5. `data-retention.js` - Veri saklama sistemi

### Acil Çözüm:
```bash
# Tüm dosyaları yeniden yükleyin
# Firebase konsolunda projeyi kontrol edin
# Browser cache'ini temizleyin (Ctrl+Shift+R)
```

## 📞 Destek

Sorun yaşıyorsanız şu bilgileri verin:
1. Hangi tarayıcı? (Chrome, Firefox, vs.)
2. Konsol hatası var mı?
3. Hangi adımda takıldınız?
4. Firebase projeniz aktif mi? 