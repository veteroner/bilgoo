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

# Olası Java yollarını kontrol et
$javaPaths = @(
    "C:\Program Files\Microsoft\jdk-21.0.7.6-hotspot",
    "C:\Program Files\Microsoft\jdk-11.0.18.10-hotspot",
    "C:\Program Files\Java\jdk-21",
    "C:\Program Files\Java\jdk-17",
    "C:\Program Files\Java\jdk-11",
    "C:\Program Files\Java\jdk1.8.0_351",
    "C:\Program Files\Android\Android Studio\jbr"
)

$javaFound = $false
foreach ($path in $javaPaths) {
    if (Test-Path "$path\bin\java.exe") {
        $env:JAVA_HOME = $path
        Write-Host "  JAVA_HOME ayarlandi: $path" -ForegroundColor Green
        $javaFound = $true
        break
    }
}

if (-not $javaFound) {
    Write-Host "Java bulunamadi! Java kurulumu gerekiyor." -ForegroundColor Red
    Write-Host "https://adoptium.net/temurin/releases/ adresinden JDK 17 veya 21 indirip kurmaniz gerekiyor." -ForegroundColor Yellow
    Write-Host "Kurulumu tamamladiktan sonra bu scripti tekrar calistirin." -ForegroundColor Yellow
    exit 1
}

# Android SDK yolunu ayarla
$env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
Write-Host "  ANDROID_HOME ayarlandi: $env:ANDROID_HOME" -ForegroundColor Green

# Path'e Java bin klasorunu ekle
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
Write-Host "  Java PATH'e eklendi" -ForegroundColor Green

Write-Host "Gradle daemon durduruluyor (Java ayarlarinin etkili olmasi icin)..." -ForegroundColor Yellow
Set-Location android
.\gradlew --stop

# Önce gradle clean yaparak önbelleği temizle
Write-Host "Gradle cache temizleniyor..." -ForegroundColor Yellow
.\gradlew clean

Write-Host "Android APK olusturuluyor..." -ForegroundColor Yellow
.\gradlew assembleDebug --no-build-cache

if ($LASTEXITCODE -eq 0) {
    # Zaman damgası ile benzersiz isim oluştur
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $apkName = "quiz-oyunu-android-$timestamp.apk"
    
    Copy-Item "app\build\outputs\apk\debug\app-debug.apk" "..\$apkName" -Force
    Set-Location ..
    
    # Eski APK'yı da güncelle
    Copy-Item "$apkName" "quiz-oyunu-android.apk" -Force
    
    Write-Host ""
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "APK basariyla olusturuldu!" -ForegroundColor Green
    Write-Host "Dosya konumu: $apkName" -ForegroundColor Green
    Write-Host "Ayrıca quiz-oyunu-android.apk olarak da kopyalandı" -ForegroundColor Green
    
    $apkSize = (Get-Item "$apkName").Length / 1MB
    Write-Host "APK boyutu: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "Android cihaziniza yukleyebilirsiniz!" -ForegroundColor Green
} else {
    Set-Location ..
    Write-Host ""
    Write-Host "APK olusturma basarisiz!" -ForegroundColor Red
    Write-Host "Hata kodu: $LASTEXITCODE" -ForegroundColor Red
} 