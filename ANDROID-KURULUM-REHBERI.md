# 🔧 Android Studio Kurulum Rehberi

## Gereksinimler
- Windows 10/11
- En az 8GB RAM
- En az 4GB disk alanı
- Java 8+ 

## 1. Java Kurulumu
```bash
# Java 17 (Önerilen)
https://adoptium.net/temurin/releases/
```

## 2. Android Studio Kurulumu
```bash
# Android Studio'yu indirin:
https://developer.android.com/studio

# Kurulum sırasında:
- Android SDK'yı yükleyin
- Android Virtual Device (AVD) kurun
- HAXM (Intel) veya WHPX (AMD) kurulumunu seçin
```

## 3. Environment Variables
```cmd
# System Properties > Advanced > Environment Variables
ANDROID_HOME = C:\Users\%USERNAME%\AppData\Local\Android\Sdk
JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot

# Path'e ekleyin:
%ANDROID_HOME%\tools
%ANDROID_HOME%\platform-tools
%JAVA_HOME%\bin
```

## 4. SDK Manager Kurulumları
Android Studio'da SDK Manager'dan şunları kurun:
- Android SDK Platform 34 (Android 14)
- Android SDK Build-Tools 34.0.0
- Android Emulator
- Google Play services

## 5. Build İşlemi
```powershell
# Kurulum tamamlandığında:
./build-android.ps1
```

## PWA Alternatifi (Önerilen)
Android Studio kurmak istemiyorsanız, PWA kullanın:

1. Sitenizi domaine yükleyin
2. Kullanıcılar tarayıcıdan "Ana ekrana ekle" yapabilir
3. Tam uygulama deneyimi sağlar

## Online APK Oluşturma
PWABuilder ile kolay APK oluşturma:
```bash
https://www.pwabuilder.com/
```

1. Domain adresinizi girin
2. "Download" > "Android" seçin
3. APK'yı indirin
4. Play Store'a yükleyin 