# Firebase Setup Kontrol Listesi

## 🔴 HATA: `auth/invalid-credential`

Bu hata şu sebeplerden olabilir:
1. ❌ Firebase Authentication henüz enable edilmemiş
2. ❌ Email/Password authentication method aktif değil
3. ❌ Firebase Web App kaydı eksik veya yanlış config
4. ❌ Firebase Realtime Database/Firestore rules yanlış

---

## ✅ FIREBASE CONSOLE AYARLARI

### 1. Firebase Console'a Git
👉 https://console.firebase.google.com/project/bilgisel-3e9a0

### 2. Authentication Kontrolü

**Sol menüden: Build → Authentication**

#### ✅ Get Started butonu varsa:
- "Get Started" butonuna tıkla
- Authentication'ı aktifleştir

#### ✅ Sign-in method tab:
- **Email/Password** provider'ı kontrol et
- Eğer "Disabled" yazıyorsa:
  1. Email/Password satırına tıkla
  2. "Enable" toggle'ını aç
  3. Save tıkla

#### ✅ Anonymous Authentication:
- **Anonymous** provider'ı kontrol et
- Enable olmalı (Misafir girişi için)

---

### 3. Realtime Database Kontrolü

**Sol menüden: Build → Realtime Database**

#### ✅ Create Database:
- Eğer database yoksa "Create Database" tıkla
- Location: `us-central1` seç
- Security rules: "Start in test mode" seç (şimdilik)
- Enable tıkla

#### ✅ Rules Tab:
```json
{
  "rules": {
    "scores": {
      "$category": {
        "$uid": {
          ".read": true,
          ".write": "$uid === auth.uid"
        }
      }
    },
    "leaderboard": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

**Publish butonu**na bas!

---

### 4. Firestore Kontrolü

**Sol menüden: Build → Firestore Database**

#### ✅ Create Database:
- Eğer database yoksa "Create database" tıkla
- Location: `us-central` (veya Europe) seç
- Security rules: "Start in test mode" seç
- Enable tıkla

#### ✅ Rules Tab:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Game history
    match /gameHistory/{gameId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Achievements
    match /achievements/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Friends
    match /friends/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Publish butonu**na bas!

---

### 5. Firebase Config Kontrolü

**Sol menüden: Project Settings (⚙️ icon)**

#### ✅ General Tab:
- "Your apps" bölümünde **Web app** var mı?
- Yoksa:
  1. "Add app" tıkla
  2. Web `</>` iconuna tıkla
  3. App nickname: `bilgoo-web`
  4. Firebase Hosting: **ENABLE** (check işareti koy)
  5. Register app
  6. Config kodunu kopyala (lib/firebase.ts'deki ile karşılaştır)

#### ✅ Mevcut Config:
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyAbI5Swc136jjPCKeH1erjoDuhG2GUPnn0",
  authDomain: "bilgisel-3e9a0.firebaseapp.com",
  databaseURL: "https://bilgisel-3e9a0-default-rtdb.firebaseio.com",
  projectId: "bilgisel-3e9a0",
  storageBucket: "bilgisel-3e9a0.appspot.com",
  messagingSenderId: "921907280109",
  appId: "1:921907280109:web:7d9b4844067a7a1ac174e4",
  measurementId: "G-XH10LS7DW8"
};
```

Bu bilgiler **Firebase Console → Project Settings → SDK setup and configuration** ile aynı mı kontrol et!

---

## 🧪 TEST ADIMLARI

### Adım 1: Firebase Console Kontrolü
```
1. console.firebase.google.com/project/bilgisel-3e9a0 aç
2. Authentication → Sign-in method → Email/Password: ENABLED
3. Realtime Database → Database oluşturulmuş, rules publish edilmiş
4. Firestore Database → Database oluşturulmuş, rules publish edilmiş
```

### Adım 2: Yeni Kayıt Dene
```
1. bilgoo.com → Kayıt Ol
2. Email: test@test.com
3. Şifre: test123
4. Kayıt Ol butonuna tıkla
```

**Beklenen:**
- ✅ Başarılı kayıt
- ✅ Ana sayfaya yönlendirilme
- ✅ Firebase Console → Authentication → Users: yeni kullanıcı görünüyor

**Hata alırsan:**
- ❌ `auth/invalid-credential` → Email/Password provider disabled
- ❌ `auth/email-already-in-use` → Bu normal, farklı email dene
- ❌ `auth/weak-password` → Şifre 6+ karakter olmalı

### Adım 3: Oyun Oyna
```
1. Kategori seç (Genel Kültür)
2. Oyunu bitir
3. Browser Console'u aç (F12)
4. "Game saved to Firebase" mesajını gör
```

### Adım 4: Firebase Console'da Veriyi Gör
```
1. Realtime Database → scores → [kategori] → [userId] = skor görünmeli
2. Firestore → users → [userId] = profil bilgileri
3. Firestore → gameHistory → oyun kayıtları
```

---

## 🚨 HATA MESAJLARI ve ÇÖZÜMLERI

### ❌ `auth/invalid-credential`
**Sebep:** Yanlış email/şifre VEYA Email authentication disabled
**Çözüm:** 
1. Firebase Console → Authentication → Sign-in method
2. Email/Password → Enable

### ❌ `auth/user-not-found`
**Sebep:** Kullanıcı kayıtlı değil
**Çözüm:** Önce "Kayıt Ol" yapmalısın

### ❌ `auth/wrong-password`
**Sebep:** Şifre yanlış
**Çözüm:** Doğru şifreyi gir veya yeni hesap aç

### ❌ `permission-denied` (Firestore/Realtime DB)
**Sebep:** Database rules yanlış veya database oluşturulmamış
**Çözüm:**
1. Yukarıdaki rules'ları kopyala
2. Firebase Console'da publish et

### ❌ CORS hatası
**Sebep:** Domain whitelist'e eklenmemiş
**Çözüm:**
1. Firebase Console → Authentication → Settings
2. Authorized domains → bilgoo.netlify.app ekle

---

## 📞 YARDIM

Eğer hala çalışmıyorsa:

1. **Browser Console Log'u Paylaş:**
   - F12 tuşuna bas
   - Console tab
   - Hata mesajının ekran görüntüsü

2. **Firebase Console Screenshot:**
   - Authentication sayfası
   - Database rules sayfası

3. **Network Tab:**
   - F12 → Network tab
   - Login butonuna tıkla
   - Başarısız request'i bul
   - Response'u paylaş

---

## ✅ İŞLEM TAMAMLANDI MI?

- [ ] Firebase Authentication enabled
- [ ] Email/Password provider enabled
- [ ] Anonymous provider enabled
- [ ] Realtime Database created
- [ ] Realtime Database rules published
- [ ] Firestore created
- [ ] Firestore rules published
- [ ] Web app registered in Firebase
- [ ] Config matches lib/firebase.ts
- [ ] Test kayıt başarılı
- [ ] Oyun skorları Firebase'e kaydediliyor

Hepsi ✅ olunca sistem tam çalışacak! 🎉
