# Android APK Build Script - Eksik dosyalari ekleyip build yapar

Write-Host "Android dosyalari senkronize ediliyor..." -ForegroundColor Cyan

# 1. Languages klasorunu kopyala
Write-Host "Languages klasoru kopyalaniyor..." -ForegroundColor Yellow
Copy-Item "languages" "android\app\src\main\assets\public\" -Recurse -Force

# 2. Guncel web dosyalarini kopyala
Write-Host "Web dosyalari guncelleniyor..." -ForegroundColor Yellow
$webFiles = @("style.css", "script.js", "languages.js", "index.html", "manifest.json")

foreach ($file in $webFiles) {
    Copy-Item $file "android\app\src\main\assets\public\$file" -Force
    Write-Host "  $file kopyalandi"
}

# 3. Capacitor sync
Write-Host "Capacitor sync calistiriliyor..." -ForegroundColor Yellow
npx cap sync android

Write-Host "Android uygulamasinda hamburger menu kaldiriliyor, tab menu aktif ediliyor..." -ForegroundColor Yellow

# 4. Environment variables ayarla ve APK olustur
Write-Host "Java ve Android SDK path'leri ayarlaniyor..." -ForegroundColor Yellow
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.7.6-hotspot"
$env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"

Write-Host "Android APK olusturuluyor..." -ForegroundColor Yellow
cd android
.\gradlew assembleDebug

if ($LASTEXITCODE -eq 0) {
    Copy-Item "app\build\outputs\apk\debug\app-debug.apk" "..\quiz-oyunu-android.apk" -Force
    cd ..
    
    Write-Host ""
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "APK basariyla olusturuldu!" -ForegroundColor Green
    Write-Host "Dosya konumu: quiz-oyunu-android.apk" -ForegroundColor Green
    
    $apkSize = (Get-Item "quiz-oyunu-android.apk").Length / 1MB
    Write-Host "APK boyutu: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "Android cihaziniza yukleyebilirsiniz!" -ForegroundColor Green
} else {
    cd ..
    Write-Host ""
    Write-Host "APK olusturma basarisiz!" -ForegroundColor Red
    Write-Host "Hata kodu: $LASTEXITCODE" -ForegroundColor Red
} 