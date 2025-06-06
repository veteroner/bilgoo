# 🚀 GIT OTOMATIK DEPLOYMENT REHBERİ

Bu rehber, Netlify'da manuel deployment yerine otomatik git-based deployment nasıl kurulacağını açıklar.

## ❌ **Şu Anki Durum (Manuel)**
- Her değişiklikte tüm klasörü drag & drop
- Zaman kaybı
- Hata riski yüksek
- Version control yok

## ✅ **Hedef Durum (Otomatik)**
- Git push → Otomatik deploy
- Sadece değişen dosyalar
- Version history
- Rollback imkanı

## 🔧 **KURULUM ADIMLARı**

### **1. GitHub Repository Oluştur**

#### **Yöntem A: GitHub Web'de**
1. GitHub.com'a git
2. "New repository" tıkla
3. Repository name: `quiz-oyunu`
4. Public/Private seç
5. "Create repository"

#### **Yöntem B: GitHub CLI**
```bash
# GitHub CLI ile
gh repo create quiz-oyunu --public --source=. --remote=origin --push
```

### **2. Local Git Setup**

#### **Otomatik Script İle:**
```bash
# Windows
setup-git-deploy.bat

# Manuel komutlar:
git init
git add .
git commit -m "🚀 İlk deploy"
git remote add origin https://github.com/KULLANICI/quiz-oyunu.git
git branch -M main
git push -u origin main
```

### **3. Netlify'ı Git'e Bağla**

#### **Mevcut Siteyi Sil ve Yenisini Oluştur:**

1. **Netlify Dashboard** → **Sites**
2. **Mevcut site** → **Site settings** → **General** → **Delete site**
3. **"Add new site"** → **"Import an existing project"**
4. **"Deploy with GitHub"**
5. **Repository seç**: `quiz-oyunu`
6. **Build settings:**
   - **Build command**: `echo "Static build completed"`
   - **Publish directory**: `.`
   - **Functions directory**: `netlify/functions`

### **4. Environment Variables**

**Site Settings** → **Environment variables** → **Add variable**:

```bash
FIREBASE_API_KEY=AIzaSyAbI5Swc136jjPCKeH1erjoDuhG2GUPnn0
FIREBASE_AUTH_DOMAIN=bilgisel-3e9a0.firebaseapp.com
FIREBASE_DATABASE_URL=https://bilgisel-3e9a0-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=bilgisel-3e9a0
FIREBASE_STORAGE_BUCKET=bilgisel-3e9a0.appspot.com
FIREBASE_MESSAGING_SENDER_ID=921907280109
FIREBASE_APP_ID=1:921907280109:web:7d9b4844067a7a1ac174e4
FIREBASE_MEASUREMENT_ID=G-XH10LS7DW8
NODE_ENV=production
```

### **5. Domain Ayarları**

**Site settings** → **Domain management**:
- **Force HTTPS**: Aktifleştir
- **Pretty URLs**: Aktifleştir
- **Asset optimization**: Aktifleştir

## 🎯 **KULLANIM**

### **Günlük Workflow:**

```bash
# 1. Dosyalarını düzenle
# 2. Quick deploy script çalıştır:
quick-deploy.bat

# Ya da manuel:
git add .
git commit -m "🔧 Bug fix"
git push
```

### **Deployment Süreci:**
1. ⚡ Git push → **Anında trigger**
2. 🔄 Netlify build → **30-60 saniye**
3. 🌐 Live site → **Otomatik güncelleme**
4. 📧 Email notification (opsiyonel)

## 🔍 **İZLEME VE YÖNETİM**

### **Build Logs:**
- **Netlify Dashboard** → **Deploys**
- Real-time build progress
- Error handling

### **Preview Deployments:**
- Feature branch → Otomatik preview
- Pull request → Preview URL
- Test before merge

### **Rollback:**
```bash
# Önceki versiyona dön
git log --oneline
git revert COMMIT_HASH
git push

# Ya da Netlify dashboard'dan
# Deploys → Önceki deploy → "Publish deploy"
```

## 🚀 **GELİŞMİŞ ÖZELLİKLER**

### **Branch-based Deployments:**
```bash
# Development branch
git checkout -b development
git push origin development

# Netlify otomatik preview oluşturur:
# https://development--bilgoov3.netlify.app
```

### **Build Hooks:**
```bash
# Webhook ile external trigger
curl -X POST -d {} https://api.netlify.com/build_hooks/YOUR_HOOK_ID
```

### **Deploy Notifications:**
- **Slack integration**
- **Email notifications**
- **Discord webhooks**

## 📊 **AVANTAJLAR**

### **Hız:**
- ⚡ Sadece değişen dosyalar
- 🚀 30-60 saniye deploy
- 🔄 Otomatik cache invalidation

### **Güvenlik:**
- 🔒 Version control
- 🛡️ Automated security scanning
- 📝 Change tracking

### **İşbirliği:**
- 👥 Team collaboration
- 🔀 Branch management
- 📋 Pull request reviews

## 🛠️ **TROUBLESHOOTING**

### **Build Fails:**
```bash
# Build logs kontrol et
# Netlify Dashboard → Deploys → Failed deploy → View logs

# Local test:
echo "Static build completed"
```

### **Environment Variables:**
```bash
# Test deployment
# netlify-test.html → Config API Test
```

### **Domain Issues:**
```bash
# DNS check
nslookup bilgoov3.netlify.app

# SSL check
https://www.ssllabs.com/ssltest/analyze.html?d=bilgoov3.netlify.app
```

## 📋 **CHECKLIST**

### **Setup Tamamlandı Mı?**
- [ ] GitHub repository oluşturuldu
- [ ] Local git bağlandı
- [ ] Netlify git'e bağlandı
- [ ] Environment variables eklendi
- [ ] HTTPS zorlandı
- [ ] İlk deploy başarılı

### **Test Edildi Mi?**
- [ ] Git push → Otomatik deploy
- [ ] Firebase config çalışıyor
- [ ] Misafir giriş çalışıyor
- [ ] HTTPS güvenli
- [ ] Performance test

## 🎉 **SONUÇ**

✅ **Artık:**
- 📝 Kod yaz
- 💾 `git push`
- ☕ Kahve iç
- 🌐 Site canlı!

**🚀 Hayat bu kadar basit!**

---

## 🆘 **YARDIM**

### **Git Komutları:**
```bash
# Status kontrol
git status

# Log görüntüle
git log --oneline

# Branch değiştir
git checkout main

# Remote kontrol
git remote -v
```

### **Netlify CLI:**
```bash
# Install
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**📞 Sorun olursa bu rehberi takip edin ya da GitHub Issues'da sorabilirsiniz!** 