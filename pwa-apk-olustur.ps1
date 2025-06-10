#!/usr/bin/env pwsh
# PWA'dan APK Oluşturma Script'i

Write-Host "🚀 PWA APK Oluşturma İşlemi Başlatılıyor..." -ForegroundColor Green

# Domain adresi al
$domain = Read-Host "Domain adresinizi girin (örn: quizoyunu.com)"
if ([string]::IsNullOrWhiteSpace($domain)) {
    Write-Host "❌ Domain adresi gerekli!" -ForegroundColor Red
    exit 1
}

# HTTPS kontrolü
if (!$domain.StartsWith("https://")) {
    $domain = "https://$domain"
}

Write-Host "🌐 Kullanılacak domain: $domain" -ForegroundColor Cyan

# PWA dosyalarını kontrol et
Write-Host "📋 PWA dosyaları kontrol ediliyor..." -ForegroundColor Yellow

$requiredFiles = @(
    "manifest.json",
    "sw.js", 
    "index.html",
    "style.css",
    "script.js"
)

foreach ($file in $requiredFiles) {
    if (!(Test-Path $file)) {
        Write-Host "❌ $file bulunamadı!" -ForegroundColor Red
        exit 1
    } else {
        Write-Host "✅ $file mevcut" -ForegroundColor Green
    }
}

# İkon kontrolü
Write-Host "🎨 İkonlar kontrol ediliyor..." -ForegroundColor Yellow
if (!(Test-Path "icons")) {
    Write-Host "⚠️ icons klasörü bulunamadı. Oluşturuluyor..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "icons" -Force | Out-Null
}

# Basit PNG ikonları oluştur (gerçek projede farklı boyutlarda PNG kullanın)
$iconSizes = @(72, 96, 128, 144, 152, 192, 384, 512)
foreach ($size in $iconSizes) {
    $iconPath = "icons/icon-${size}x${size}.png"
    if (!(Test-Path $iconPath)) {
        Write-Host "⚠️ $iconPath bulunamadı" -ForegroundColor Yellow
    } else {
        Write-Host "✅ $iconPath mevcut" -ForegroundColor Green
    }
}

Write-Host "`n🔧 PWABuilder ile APK Oluşturmak için:" -ForegroundColor Cyan
Write-Host "1. https://www.pwabuilder.com/ adresine gidin" -ForegroundColor White
Write-Host "2. Site URL'sine '$domain' yazın" -ForegroundColor White
Write-Host "3. 'Start' butonuna tıklayın" -ForegroundColor White
Write-Host "4. 'Package For Stores' sekmesine geçin" -ForegroundColor White
Write-Host "5. 'Android' seçeneğini seçin" -ForegroundColor White
Write-Host "6. Ayarları yapılandırın:" -ForegroundColor White

Write-Host "`n📱 Önerilen APK Ayarları:" -ForegroundColor Cyan
Write-Host "   Package ID: com.teknova.quizoyunu" -ForegroundColor White
Write-Host "   App Name: Quiz Oyunu" -ForegroundColor White
Write-Host "   Theme Color: #3b82f6" -ForegroundColor White
Write-Host "   Background Color: #1e40af" -ForegroundColor White
Write-Host "   Start URL: /" -ForegroundColor White

Write-Host "`n🌟 APK Özellikleri:" -ForegroundColor Cyan
Write-Host "   ✅ Offline çalışma" -ForegroundColor Green
Write-Host "   ✅ Push bildirimleri" -ForegroundColor Green
Write-Host "   ✅ Ana ekrana ekleme" -ForegroundColor Green
Write-Host "   ✅ Tam ekran deneyim" -ForegroundColor Green
Write-Host "   ✅ Trusted Web Activity (TWA)" -ForegroundColor Green

Write-Host "`n🚀 Alternatif: Bubblewrap CLI" -ForegroundColor Cyan
Write-Host "Komut satırından APK oluşturmak isterseniz:" -ForegroundColor White
Write-Host "npm i -g @bubblewrap/cli" -ForegroundColor Gray
Write-Host "bubblewrap init --manifest=$domain/manifest.json" -ForegroundColor Gray
Write-Host "bubblewrap build" -ForegroundColor Gray

Write-Host "`n📋 Domain Yükleme Listesi:" -ForegroundColor Cyan
Write-Host "APK oluşturmadan önce şu dosyaları domaine yükleyin:" -ForegroundColor White

$uploadFiles = @(
    "index.html",
    "manifest.json", 
    "sw.js",
    "style.css",
    "script.js",
    "auth.js",
    "firebase-config.js",
    "languages.js",
    "online-game.js",
    "icons/ (klasörü)",
    "screenshots/ (klasörü)",
    "languages/ (klasörü)"
)

foreach ($file in $uploadFiles) {
    if ($file.EndsWith("(klasörü)")) {
        $folderName = $file.Replace(" (klasörü)", "")
        if (Test-Path $folderName) {
            Write-Host "   ✅ $file" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ $file - bulunamadı" -ForegroundColor Yellow
        }
    } else {
        if (Test-Path $file) {
            Write-Host "   ✅ $file" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $file - eksik!" -ForegroundColor Red
        }
    }
}

# PWA test komutu
Write-Host "`n🧪 Local PWA Test:" -ForegroundColor Cyan
Write-Host "Test etmek için aşağıdaki komutlardan birini çalıştırın:" -ForegroundColor White
Write-Host "python -m http.server 8000" -ForegroundColor Gray
Write-Host "npx serve" -ForegroundColor Gray
Write-Host "Sonra http://localhost:8000 adresine gidin" -ForegroundColor Gray

Write-Host "`n🎯 Son Adımlar:" -ForegroundColor Cyan
Write-Host "1. ✅ PWA dosyalarınız hazır" -ForegroundColor Green
Write-Host "2. 🌐 Domaine yükleyin" -ForegroundColor Blue
Write-Host "3. 📱 PWABuilder'da APK oluşturun" -ForegroundColor Blue
Write-Host "4. 🏪 Play Store'a yükleyin" -ForegroundColor Blue

Write-Host "`n✨ Başarılar!" -ForegroundColor Green 