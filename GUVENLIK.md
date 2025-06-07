# 🔒 Bilgoo Güvenlik Dokümantasyonu

Bu dokümantasyon, Bilgoo Quiz uygulamasında uygulanan güvenlik tedbirlerini açıklar.

## 🛡️ Uygulanan Güvenlik Tedbirleri

### 1. HTTP Güvenlik Başlıkları

#### Content Security Policy (CSP)
```
Content-Security-Policy: default-src 'self' https: data: blob:; 
                        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.gstatic.com https://*.firebaseapp.com https://*.firebaseio.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; 
                        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; 
                        font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; 
                        img-src 'self' data: https: blob:; 
                        media-src 'self' https: data: blob:; 
                        connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com https://*.firebaseio.com wss://*.firebaseio.com https://firestore.googleapis.com wss://firestore.googleapis.com https://firebase.googleapis.com https://securetoken.googleapis.com;
```

#### Diğer Güvenlik Başlıkları
- **X-Frame-Options**: DENY (Clickjacking koruması)
- **X-Content-Type-Options**: nosniff (MIME type sniffing koruması)
- **X-XSS-Protection**: 1; mode=block (XSS koruması)
- **Strict-Transport-Security**: HTTPS zorlaması
- **Referrer-Policy**: strict-origin-when-cross-origin

### 2. Client-Side Güvenlik (security.js)

#### BilgooSecurity Sınıfı
Tüm client-side güvenlik kontrollerini yöneten ana sınıf.

**Temel Özellikler:**
- ✅ Geliştirme/Production ortam algılama
- ✅ Console uyarıları ve koruma
- ✅ DevTools algılama
- ✅ Sağ tık engelleme (sadece production)
- ✅ Klavye kısayolu engelleme (F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S)
- ✅ Güvenli localStorage kullanımı
- ✅ XSS koruması için string temizleme
- ✅ URL validation

#### Güvenli Veri Saklama
```javascript
// Veri kaydetme
window.BilgooSecurity.secureStore('key', data);

// Veri okuma
const data = window.BilgooSecurity.secureRetrieve('key');
```

#### String Temizleme (XSS Protection)
```javascript
const cleanString = window.BilgooSecurity.sanitizeString(userInput);
```

### 3. Server-Side Güvenlik (_headers ve _redirects)

#### Netlify Headers
- Cache kontrolleri
- CORS ayarları
- Güvenlik başlıkları

#### Yönlendirmeler
- HTTP'den HTTPS'e otomatik yönlendirme
- Yasaklı dosya uzantıları için 404 döndürme
- API endpoint'leri için proxy

## 📁 Güvenlik Dosyaları

### `security.js`
Ana güvenlik manager'ı. Tüm client-side güvenlik fonksiyonlarını içerir.

### `_headers`
Netlify platformu için HTTP güvenlik başlıkları.

### `_redirects`
URL yönlendirmeleri ve güvenlik kontrolleri.

### `GUVENLIK.md`
Bu dokümantasyon dosyası.

## 🔄 Güvenlik Seviyelerine Göre Davranış

### Development (localhost)
- ✅ Console uyarıları aktif
- ✅ DevTools algılama aktif
- ❌ Sağ tık engelleme pasif
- ❌ Klavye kısayolları engelleme pasif

### Production (web)
- ✅ Console uyarıları aktif
- ✅ DevTools algılama aktif
- ✅ Sağ tık engelleme aktif
- ✅ Klavye kısayolları engelleme aktif
- ✅ Güvenlik mesajları aktif

## ⚙️ Konfigürasyon

Güvenlik ayarları otomatik olarak algılanır:
- `location.hostname` kontrolü ile geliştirme/production ortamı belirlenir
- Production'da tüm güvenlik önlemleri aktif hale gelir
- Development'ta sadece temel uyarılar gösterilir

## 🚨 Güvenlik İhlali Bildirimi

Güvenlik açığı tespit ederseniz:
1. Derhal sistem yöneticisine bildirin
2. Açığı exploit etmeye çalışmayın
3. Sorumlu açıklama (responsible disclosure) prensibini takip edin

## 📊 Güvenlik Monitoring

Güvenlik olayları browser console'da loglanır:
```javascript
console.info('🔒 Güvenlik kontrolleri aktif:', {
    production: boolean,
    timestamp: string,
    userAgent: string,
    url: string
});
```

## 🔧 Sorun Giderme

### CSP (Content Security Policy) Hataları
Eğer console'da CSP hatası görüyorsanız:

1. **Script yükleme hataları**: `script-src` direktifini kontrol edin
2. **Media yükleme hataları**: `media-src` direktifi eklenmiştir
3. **Firebase bağlantı hataları**: Tüm Firebase domain'leri `connect-src`'ye eklenmiştir

### Firebase Initialization Hataları
```
FirebaseError: Firebase: No Firebase App '[DEFAULT]' has been created
```
Bu hata alıyorsanız:
1. Firebase script'lerinin doğru sırada yüklendiğinden emin olun
2. `firebase-config.js` dosyasının Firebase SDK'lardan sonra yüklendiğini kontrol edin

### X-Frame-Options Uyarısı
```
X-Frame-Options may only be set via an HTTP header sent along with a document
```
Bu uyarı normaldir. X-Frame-Options artık sadece `_headers` dosyasında tanımlanmıştır.

## ⚠️ Önemli Notlar

1. **Bu güvenlik tedbirleri temel koruma sağlar.** Production ortamında ek güvenlik katmanları (WAF, DDoS koruması, vb.) önerilir.

2. **Client-side güvenlik önlemleri tam koruma sağlamaz.** Bu önlemler sadece ortalama kullanıcıları caydırmak içindir.

3. **Güvenlik sürekli gelişen bir alandır.** Düzenli güvenlik auditleri yapılmalıdır.

4. **Performance vs Security dengesi:** Bazı güvenlik önlemleri performansı etkileyebilir. Bu denge göz önünde bulundurarak ayarlanmıştır.

## 🔄 Versiyon Geçmişi

- **v2.0.0** - Yeni güvenlik sistemi (Basit ve etkili)
- **v1.x.x** - Eski karmaşık güvenlik sistemi (Kaldırıldı)

---

**🛡️ Güvenlik her zaman önceliğimizdir. Bu dokümantasyonu güncel tutmak için düzenli olarak gözden geçiriniz.** 