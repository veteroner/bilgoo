# Next.js Quiz Uygulaması - Tam Migration Planı

## 🚨 MEVCUT DURUM ANALİZİ

### ❌ EKSIK OLAN ÖZELLİKLER

#### 1. **SORULAR YÜKLENMIYOR**
- **Problem**: `/languages/tr/questions.json` dosyası Next.js public klasöründe değil
- **Çözüm**: Questions.json'ı `/public/languages/tr/` klasörüne kopyala
- **Kod Değişikliği**: Fetch URL'i `/languages/tr/questions.json` olarak kalabilir (public klasöründen otomatik serve edilir)

#### 2. **FIREBASE REALTIME DATABASE KULLANIMI YOK**
- **Eski Sistem**: Skorlar Firebase Realtime Database'e kaydediliyor
- **Yeni Sistem**: Sadece Firebase Auth var, skor kaydetme yok
- **Eksik**: 
  - Skor kaydetme fonksiyonu
  - Liderlik tablosu verisi
  - Kullanıcı istatistikleri Firestore/Realtime DB'ye yazma

#### 3. **KULLANICI PROFİLİ YÖNETİMİ YOK**
- Eski sistemde: `users/${userId}` altında profil bilgileri
- Eksik: displayName, photoURL, oluşturma tarihi, son giriş
- Gerekli: User profile oluşturma/güncelleme

#### 4. **LIDERLIK TABLOSU SAYFASI YOK**
- Route: `/leaderboard` veya `/lider-tablosu`
- Özellikler:
  - Tüm zamanların en yüksek skorları
  - Kategoriye göre liderlik
  - Günlük/haftalık/aylık liderler
  - Real-time güncelleme

#### 5. **İSTATİSTİK SAYFASI YOK**
- Route: `/stats` veya `/istatistikler`
- Özellikler:
  - Toplam oyun sayısı
  - Toplam soru sayısı
  - Doğru cevap oranı
  - Kategori bazlı başarı istatistikleri
  - Grafik/chart gösterimleri

#### 6. **OYUN GEÇMİŞİ KAYDETME YOK**
- Eski sistem: `gameHistory` localStorage + Firebase
- Eksik: Her oyunun detaylı kaydı (tarih, skor, kategori, süre)
- Gerekli: Firestore'a oyun geçmişi yazma

#### 7. **ARKADAŞLIK SİSTEMİ YOK**
- Eski sistem: `friends.js` ile arkadaş ekleme/çıkarma
- Özellikler:
  - Arkadaş arama (kullanıcı adı/email)
  - Arkadaş istekleri
  - Arkadaş listesi
  - Arkadaşların skorlarını görme

#### 8. **BAŞARILAR/ROZETLER SİSTEMİ YOK**
- Eski sistem: `achievements.js` ile rozet sistemi
- Özellikler:
  - İlk oyun, 10 oyun, 100 oyun rozetleri
  - Perfect score rozeti
  - Kategori uzmanı rozetleri
  - Rozet bildirimeri

#### 9. **GÜNLÜK GÖREVLER YOK**
- Eski sistem: `daily-tasks.js`
- Özellikler:
  - Günlük soru sayısı hedefi
  - Kategori challenge'ları
  - Streak (art arda gün) sistemi
  - Görev ödülleri

#### 10. **ONLİNE ÇOKLU OYUNCU MOD YOK**
- Eski sistem: `online-game.js`
- Özellikler:
  - Rastgele rakip bulma
  - Arkadaşla oynama
  - Real-time soru-cevap yarışması
  - Canlı skorboard

#### 11. **BİLDİRİM SİSTEMİ YOK**
- Toast/alert mesajları için sistem
- Arkadaş isteği bildirimleri
- Başarı kazanma bildirimleri
- Günlük görev hatırlatmaları

#### 12. **DİL DEĞİŞTİRME YOK**
- Eski sistem: Türkçe, İngilizce, Almanca desteği
- Eksik: Dil seçici dropdown
- Gerekli: i18n sistemi

#### 13. **SORU FİLTRELEME VE KARIŞTIRILMA EKSİK**
- Mevcut: Sadece basit kategori filtresi
- Eksik:
  - Zorluk seviyesi filtresi
  - Görülmemiş sorular önceliği
  - Resimli soru desteği
  - Soru rapor etme

#### 14. **TIMER SİSTEMİ EKSİK**
- Mevcut: Basit useState timer
- Eksik:
  - Görsel progress bar
  - Ses efektleri (son 5 saniye)
  - Pause/resume özelliği
  - Bonus süre power-up'ı

#### 15. **JOKER/POWER-UP SİSTEMİ YOK**
- 50:50 jokeri (2 yanlış şıkkı kaldır)
- Ekstra süre
- Soru atlama
- Joker satın alma (coin sistemi)

#### 16. **COIN/PARA SİSTEMİ YOK**
- Oyun bitince coin kazanma
- Günlük bonus
- Coin ile joker satın alma
- Coin ile tema/avatar satın alma

#### 17. **TEMA/GÖRSEL ÖZELLEŞTİRME YOK**
- Koyu/Aydınlık mod
- Renk temaları
- Avatar seçimi
- Profil çerçeveleri

#### 18. **SES EFEKTLERİ YOK**
- Doğru cevap sesi
- Yanlış cevap sesi
- Oyun bitişi sesi
- Buton tıklama sesleri
- Ses açma/kapama toggle

#### 19. **FEEDBACK/GERİ BİLDİRİM SİSTEMİ YOK**
- Eski sistem: `feedback.js`
- Özellikler:
  - Hata raporlama
  - Önerilerde bulunma
  - Soru hatası bildirme

#### 20. **HESAP AYARLARI SAYFASI YOK**
- Profil düzenleme
- Şifre değiştirme
- Email değiştirme
- Hesap silme
- Gizlilik ayarları

---

## 📋 YAPMAMIZ GEREKENLER - ÖNCELIK SIRASINA GÖRE

### 🔴 **PHASE 1: KRİTİK FIX'LER (Şimdi)**

#### 1.1. Questions.json'ı Public'e Taşı
```bash
mkdir -p public/languages/tr
cp languages/tr/questions.json public/languages/tr/
```

#### 1.2. Quiz Page'i Düzelt
- [ ] Questions yükleme URL'ini kontrol et
- [ ] Category filter düzeltmesi (türkçe karakter mapping)
- [ ] Console log ekle (debug için)
- [ ] Error handling iyileştir

#### 1.3. Firebase Skor Kaydetme Ekle
- [ ] `saveScore()` fonksiyonu yaz
- [ ] Realtime Database'e skor kaydet
- [ ] Firestore'a oyun geçmişi kaydet
- [ ] LocalStorage'a da backup kaydet

---

### 🟡 **PHASE 2: CORE FEATURES (Sonraki Adım)**

#### 2.1. İstatistik Sayfası
- [ ] `/app/stats/page.tsx` oluştur
- [ ] Firestore'dan kullanıcı istatistiklerini çek
- [ ] Chart.js veya Recharts ile grafikler ekle
- [ ] Kategori bazlı başarı oranları göster

#### 2.2. Liderlik Tablosu
- [ ] `/app/leaderboard/page.tsx` oluştur
- [ ] Realtime Database'den top 100 skoru çek
- [ ] Kategoriye göre filtreleme
- [ ] Günlük/haftalık/aylık sekmeler
- [ ] Kullanıcının sıralamasını vurgula

#### 2.3. Kullanıcı Profil Sayfası
- [ ] `/app/profile/page.tsx` oluştur
- [ ] Profil bilgilerini göster
- [ ] Avatar yükleme
- [ ] İstatistikler özeti
- [ ] Rozetler/Başarılar listesi

---

### 🟢 **PHASE 3: SOSYAL ÖZELLIKLER**

#### 3.1. Arkadaşlık Sistemi
- [ ] `/app/friends/page.tsx` oluştur
- [ ] Arkadaş arama komponenti
- [ ] Arkadaş istekleri listesi
- [ ] Mevcut arkadaşlar listesi
- [ ] Firestore arkadaşlık veri modeli

#### 3.2. Online Multiplayer
- [ ] `/app/multiplayer/page.tsx` oluştur
- [ ] Oda oluşturma/katılma
- [ ] Real-time soru senkronizasyonu
- [ ] Canlı skorboard
- [ ] WebSocket veya Firebase Realtime DB kullan

---

### 🔵 **PHASE 4: GAMIFICATION**

#### 4.1. Başarılar/Rozetler
- [ ] `/components/Achievement.tsx` komponenti
- [ ] Rozet kazanma logic'i
- [ ] Bildirim sistemi
- [ ] Rozet vitrin sayfası

#### 4.2. Günlük Görevler
- [ ] `/app/daily-tasks/page.tsx`
- [ ] Görev progress tracking
- [ ] Streak sistemi
- [ ] Ödül dağıtımı

#### 4.3. Coin/Para Sistemi
- [ ] Coin kazanma mekanikleri
- [ ] Mağaza sayfası (`/shop`)
- [ ] Joker satın alma
- [ ] Tema satın alma

#### 4.4. Joker/Power-ups
- [ ] 50:50 joker komponenti
- [ ] Ekstra süre power-up
- [ ] Soru atlama
- [ ] Joker kullanım UI'ı

---

### 🟣 **PHASE 5: UX İYİLEŞTİRMELERİ**

#### 5.1. Ses Sistemi
- [ ] Audio context oluştur
- [ ] Ses dosyaları ekle (public/sounds/)
- [ ] Ses toggle butonu
- [ ] Ses seviyesi kontrolü

#### 5.2. Tema Sistemi
- [ ] Dark/Light mode toggle
- [ ] Renk temaları (mavi, yeşil, mor, etc.)
- [ ] LocalStorage'da tema saklama
- [ ] Tailwind dark mode kullan

#### 5.3. Animasyonlar
- [ ] Framer Motion ekle
- [ ] Sayfa geçiş animasyonları
- [ ] Skor kazanma animasyonu
- [ ] Rozet kazanma pop-up

#### 5.4. Dil Desteği
- [ ] i18next kurulumu
- [ ] Dil dosyaları (tr.json, en.json, de.json)
- [ ] Navbar'a dil seçici
- [ ] Questions.json dil bazlı yükleme

---

### ⚪ **PHASE 6: EK SAYFALAR**

#### 6.1. Hakkında Sayfası
- [ ] `/app/about/page.tsx`
- [ ] Uygulama açıklaması
- [ ] Nasıl oynanır kılavuzu
- [ ] SSS (FAQ)

#### 6.2. Ayarlar Sayfası
- [ ] `/app/settings/page.tsx`
- [ ] Profil düzenleme
- [ ] Şifre değiştirme
- [ ] Bildirim ayarları
- [ ] Gizlilik ayarları
- [ ] Hesap silme

#### 6.3. Feedback Sayfası
- [ ] `/app/feedback/page.tsx`
- [ ] Hata bildirimi formu
- [ ] Öneri formu
- [ ] Soru hatası bildirimi

---

## 🛠️ TEKNİK GEREKSINIMLER

### Yeni Paketler
```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",        // Animasyonlar
    "recharts": "^2.10.0",             // Grafikler
    "i18next": "^23.7.0",              // Dil desteği
    "react-i18next": "^14.0.0",
    "howler": "^2.2.4",                // Ses yönetimi
    "zustand": "^4.4.7",               // State yönetimi
    "react-hot-toast": "^2.4.1"        // Bildirimler
  }
}
```

### Firebase Veri Yapısı

#### Realtime Database
```
/scores
  /{category}
    /{userId}
      score: number
      username: string
      timestamp: number
      
/leaderboard
  /global
    /top100: [{userId, score, username}]
  /{category}
    /daily: []
    /weekly: []
    /monthly: []
    /alltime: []
```

#### Firestore
```
/users/{userId}
  - displayName: string
  - email: string
  - photoURL: string
  - coins: number
  - stats: {
      totalGames: number
      totalQuestions: number
      correctAnswers: number
      accuracy: number
    }
  - createdAt: timestamp
  - lastLogin: timestamp

/gameHistory/{gameId}
  - userId: string
  - category: string
  - score: number
  - totalQuestions: number
  - correctAnswers: number
  - timestamp: timestamp
  - questions: array

/achievements/{userId}
  - earnedBadges: array
  - progress: object

/friends/{userId}
  - friends: array
  - pendingRequests: array
  - sentRequests: array
```

---

## 📊 İLERLEME TAKIBI

- [ ] Phase 1: Kritik Fix'ler (0/3)
- [ ] Phase 2: Core Features (0/3)
- [ ] Phase 3: Sosyal Özellikler (0/2)
- [ ] Phase 4: Gamification (0/4)
- [ ] Phase 5: UX İyileştirmeleri (0/4)
- [ ] Phase 6: Ek Sayfalar (0/3)

**TOPLAM**: 0/19 major feature tamamlandı

---

## 🚀 BİR SONRAKİ ADIM

**ŞİMDİ YAPILACAK:**

1. **Questions.json'ı public'e kopyala**
2. **Play page'deki fetch URL'ini test et**  
3. **Firebase'e skor kaydetme fonksiyonu ekle**
4. **Console'da hata kontrolü yap**

**Hazır mısın? Başlayalım! 🔥**
