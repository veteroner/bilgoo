# Apple App Review - Demo Account ve Test Bilgileri

## Demo Hesap Bilgileri (Apple Reviewer'lar İçin)

**Test Hesabı:**
- E-posta: demo@bilgoo.com
- Şifre: DemoTest123!

**Test Senaryoları:**
1. Ana sayfada "Single Player" butonuna tıklayın
2. Kategori seçin (örn: Genel Kültür)
3. Quiz'i tamamlayın
4. İstatistikler sayfasını kontrol edin
5. Arkadaş ekleme özelliğini test edin
6. Ayarlar menüsünden tema değiştirmeyi deneyin

## App Functionality Test

### Ana Özellikler:
1. ✅ Single Player Quiz Modu
2. ✅ Multiplayer Online Modu
3. ✅ Leaderboard/Sıralama Sistemi
4. ✅ Kullanıcı Profili ve İstatistikler
5. ✅ Arkadaş Sistemi
6. ✅ Başarı/Achievement Sistemi
7. ✅ Çoklu Dil Desteği (TR, EN, DE)
8. ✅ Tema Değiştirme (Açık/Koyu)
9. ✅ PWA Özellikleri (Offline çalışma)
10. ✅ Push Notification Desteği

### Test Edilmesi Gereken Temel Fonksiyonlar:

#### 1. Oyun Mekanikleri
- Soru gösterimi ve çoktan seçmeli cevaplar
- Joker sistemi (50:50, Hint, Time, Skip)
- Skor hesaplama ve zaman sistemi
- Zorluk seviyesi sistemi

#### 2. Sosyal Özellikler
- Arkadaş ekleme/çıkarma
- Lider tablosu görüntüleme
- Online yarışma modu
- Başarı paylaşımı

#### 3. Kullanıcı Deneyimi
- Dil değiştirme işlevselliği
- Tema değiştirme (koyu/açık mod)
- Kullanıcı ayarları kaydetme
- İstatistik görüntüleme

#### 4. Teknik Özellikler
- Çevrimdışı çalışabilme
- Veri senkronizasyonu
- Responsive tasarım (tablet/telefon)
- Performans optimizasyonu

## App Store Review Notes

**Reviewer'lar için önemli bilgiler:**

1. **Gizlilik Politikası:** privacy-policy.html dosyasında tam GDPR uyumlu politika mevcuttur
2. **İletişim Bilgileri:** contact.html sayfasında geliştirici iletişim bilgileri mevcuttur
3. **Şirket Bilgileri:** about.html sayfasında Teknova Bilişim şirket bilgileri mevcuttur
4. **Reklam Politikası:** Google AdSense reklamları yaş uygunluğu kontrollü olarak gösterilmektedir
5. **Veri Güvenliği:** Firebase ile end-to-end şifreleme kullanılmaktadır

## Eksik Olabilecek Noktalar ve Çözümler

### 1. Test Verisi Yetersizliği
- Demo hesabının tüm özellikleri test edebilecek şekilde veri ile doldurulması
- Örnek arkadaş bağlantıları
- Tamamlanmış quiz geçmişi

### 2. Offline Functionality
- PWA teknolojisi ile temel offline çalışma
- Oyun verilerinin local storage'da saklanması

### 3. Error Handling
- Network bağlantı hataları için kullanıcı dostu mesajlar
- Timeout durumları için retry mekanizması

### 4. Performance
- Optimized loading times
- Image compression
- Efficient JavaScript code

## Resubmission Checklist

☐ Privacy Policy linkini App Store Connect'e ekledin
☐ Demo hesap bilgilerini Review Notes'a ekledin  
☐ Veri toplama kategorilerini doğru şekilde işaretledin
☐ Screenshot'ları güncelledin (güncel UI'ı göstermeli)
☐ App description'ını güncelledin
☐ Tüm functionality'nin çalıştığını test ettin
☐ Privacy labels'ları doğru şekilde doldurdun
