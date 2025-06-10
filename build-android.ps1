# Quiz Oyunu Android Build Script
# PowerShell için

Write-Host "🚀 Quiz Oyunu Android Uygulaması Build İşlemi Başlatılıyor..." -ForegroundColor Green

# Gerekli araçların kontrolü
Write-Host "⚙️ Araç kontrolü yapılıyor..." -ForegroundColor Yellow

if (!(Get-Command "java" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Java bulunamadı. Lütfen Java 8+ yükleyin." -ForegroundColor Red
    exit 1
}

if (!(Test-Path "$env:ANDROID_HOME")) {
    Write-Host "❌ Android SDK bulunamadı. ANDROID_HOME environment variable'ını ayarlayın." -ForegroundColor Red
    exit 1
}

# Node.js ve PWA Build
Write-Host "📦 PWA dosyaları kontrol ediliyor..." -ForegroundColor Yellow

if (!(Test-Path "manifest.json")) {
    Write-Host "❌ manifest.json bulunamadı!" -ForegroundColor Red
    exit 1
}

if (!(Test-Path "sw.js")) {
    Write-Host "❌ sw.js bulunamadı!" -ForegroundColor Red
    exit 1
}

# İkonları kontrol et
Write-Host "🎨 İkonlar kontrol ediliyor..." -ForegroundColor Yellow

if (!(Test-Path "icons")) {
    Write-Host "⚠️ İkonlar bulunamadı. Varsayılan ikonlar oluşturuluyor..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "icons" -Force
    
    # Basit SVG ikon oluştur (gerçek projede PNG ikonları kullanın)
    $iconSvg = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="230" fill="#3b82f6"/>
  <text x="256" y="320" text-anchor="middle" font-size="200" fill="white" font-family="Arial">Q</text>
</svg>
'@
    $iconSvg | Out-File "icons/icon.svg" -Encoding UTF8
    
    Write-Host "✅ Varsayılan ikon oluşturuldu" -ForegroundColor Green
}

# Android Studio projesi kontrolü
Write-Host "📱 Android projesi kontrol ediliyor..." -ForegroundColor Yellow

if (!(Test-Path "android-project/app/build.gradle")) {
    Write-Host "❌ Android projesi bulunamadı!" -ForegroundColor Red
    exit 1
}

# Domain adresini güncelle
Write-Host "🌐 Domain adresi güncelleniyor..." -ForegroundColor Yellow

$domain = Read-Host "Web sitenizin domain adresini girin (örn: quizoyunu.com)"
if ([string]::IsNullOrWhiteSpace($domain)) {
    $domain = "localhost:8000"
    Write-Host "⚠️ Varsayılan domain kullanılıyor: $domain" -ForegroundColor Yellow
}

# Manifest ve Android dosyalarında domain güncelle
(Get-Content "android-project/app/src/main/AndroidManifest.xml") -replace "your-domain.com", $domain | Set-Content "android-project/app/src/main/AndroidManifest.xml"
(Get-Content "android-project/app/src/main/java/com/teknova/quizoyunu/LauncherActivity.java") -replace "your-domain.com", $domain | Set-Content "android-project/app/src/main/java/com/teknova/quizoyunu/LauncherActivity.java"

Write-Host "✅ Domain adresi güncellendi: $domain" -ForegroundColor Green

# Keystore oluştur (release build için)
Write-Host "🔑 Keystore kontrol ediliyor..." -ForegroundColor Yellow

if (!(Test-Path "android-project/app/quiz-release.keystore")) {
    Write-Host "🔑 Release keystore oluşturuluyor..." -ForegroundColor Yellow
    
    $keystorePassword = "quiz123456"
    $aliasName = "quiz-key"
    
    & "$env:JAVA_HOME/bin/keytool" -genkeypair -v -keystore "android-project/app/quiz-release.keystore" -alias $aliasName -keyalg RSA -keysize 2048 -validity 10000 -storepass $keystorePassword -keypass $keystorePassword -dname "CN=Quiz Oyunu, OU=Teknova, O=Teknova, L=Istanbul, S=Istanbul, C=TR"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Keystore oluşturuldu" -ForegroundColor Green
        Write-Host "🔑 Keystore Password: $keystorePassword" -ForegroundColor Cyan
        Write-Host "🔑 Alias: $aliasName" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Keystore oluşturulamadı!" -ForegroundColor Red
    }
}

# Gradle build
Write-Host "🔨 Android uygulaması build ediliyor..." -ForegroundColor Yellow

Set-Location "android-project"

# Debug build
Write-Host "📱 Debug APK oluşturuluyor..." -ForegroundColor Yellow
if (Test-Path "gradlew.bat") {
    & "./gradlew.bat" assembleDebug
} else {
    Write-Host "❌ gradlew.bat bulunamadı!" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Debug APK oluşturuldu!" -ForegroundColor Green
    $debugApk = "app/build/outputs/apk/debug/app-debug.apk"
    if (Test-Path $debugApk) {
        Write-Host "📱 Debug APK: $debugApk" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ Debug build başarısız!" -ForegroundColor Red
}

# Release build (keystore varsa)
if (Test-Path "app/quiz-release.keystore") {
    Write-Host "📱 Release APK oluşturuluyor..." -ForegroundColor Yellow
    
    if (Test-Path "gradlew.bat") {
        & "./gradlew.bat" assembleRelease
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Release APK oluşturuldu!" -ForegroundColor Green
        $releaseApk = "app/build/outputs/apk/release/app-release.apk"
        if (Test-Path $releaseApk) {
            Write-Host "📱 Release APK: $releaseApk" -ForegroundColor Cyan
        }
    } else {
        Write-Host "❌ Release build başarısız!" -ForegroundColor Red
    }
}

Set-Location ".."

# APK dosyalarını ana dizine kopyala
Write-Host "📁 APK dosyaları kopyalanıyor..." -ForegroundColor Yellow

if (Test-Path "android-project/app/build/outputs/apk/debug/app-debug.apk") {
    Copy-Item "android-project/app/build/outputs/apk/debug/app-debug.apk" "quiz-oyunu-debug.apk"
    Write-Host "✅ Debug APK kopyalandı: quiz-oyunu-debug.apk" -ForegroundColor Green
}

if (Test-Path "android-project/app/build/outputs/apk/release/app-release.apk") {
    Copy-Item "android-project/app/build/outputs/apk/release/app-release.apk" "quiz-oyunu-release.apk"
    Write-Host "✅ Release APK kopyalandı: quiz-oyunu-release.apk" -ForegroundColor Green
}

# Build bilgileri
Write-Host "`n🎉 Build İşlemi Tamamlandı!" -ForegroundColor Green
Write-Host "📱 Oluşturulan dosyalar:" -ForegroundColor Cyan

if (Test-Path "quiz-oyunu-debug.apk") {
    $debugSize = (Get-Item "quiz-oyunu-debug.apk").Length / 1MB
    Write-Host "   • quiz-oyunu-debug.apk ($([math]::Round($debugSize, 2)) MB)" -ForegroundColor White
}

if (Test-Path "quiz-oyunu-release.apk") {
    $releaseSize = (Get-Item "quiz-oyunu-release.apk").Length / 1MB
    Write-Host "   • quiz-oyunu-release.apk ($([math]::Round($releaseSize, 2)) MB)" -ForegroundColor White
}

Write-Host "`n📋 Google Play Store için:" -ForegroundColor Cyan
Write-Host "   1. quiz-oyunu-release.apk dosyasını kullanın" -ForegroundColor White
Write-Host "   2. store-listing/ klasöründeki açıklamaları kullanın" -ForegroundColor White
Write-Host "   3. icons/ klasöründeki ikonları kullanın" -ForegroundColor White
Write-Host "   4. screenshots/ klasöründeki ekran görüntülerini ekleyin" -ForegroundColor White

Write-Host "`n🔧 Test için:" -ForegroundColor Cyan
Write-Host "   • Debug APK'yı telefona yükleyip test edin" -ForegroundColor White
Write-Host "   • PWA özelliklerini web tarayıcısında test edin" -ForegroundColor White

Write-Host "`n✨ Başarıyla tamamlandı!" -ForegroundColor Green 