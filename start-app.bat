@echo off
echo =====================================================
echo           QUIZ OYUNU UYGULAMASI BASLATILIYOR
echo =====================================================
echo.
echo Lütfen bekleyin, uygulama baslatiliyor...
echo.

:: Komut satırı konumunu dosyanın bulunduğu dizin olarak ayarla
cd /d %~dp0

:: Gerekli dosyaların varlığını kontrol et
echo Dosyalar kontrol ediliyor...
if not exist "index.html" (
    echo HATA: index.html dosyasi bulunamadi!
    echo Lutfen uygulamanin dogru klasorde oldugunden emin olun.
    pause
    exit /b 1
)

if not exist "script.js" (
    echo HATA: script.js dosyasi bulunamadi!
    echo Lutfen uygulamanin dogru klasorde oldugunden emin olun.
    pause
    exit /b 1
)

echo ✓ Gerekli dosyalar bulundu.
echo.

:: Port kontrolü ve web sunucusu başlatma
echo Web sunucusu baslatiliyor...
echo.

:: Python varsa HTTP sunucusu başlat
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python ile web sunucusu baslatiliyor...
    echo Uygulama: http://localhost:8000
    echo.
    echo Uygulamayi kapatmak icin CTRL+C tuslayiniz.
    echo.
    start http://localhost:8000
    python -m http.server 8000
    goto :end
)

:: Node.js varsa HTTP sunucusu başlat
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Node.js ile web sunucusu baslatiliyor...
    echo Uygulama: http://localhost:3000
    echo.
    echo Uygulamayi kapatmak icin CTRL+C tuslayiniz.
    echo.
    start http://localhost:3000
    npx http-server -p 3000
    goto :end
)

:: Hiçbiri yoksa dosyayı doğrudan aç
echo Web sunucusu bulunamadi. Dosya dogrudan aciliyor...
echo.
echo NOT: En iyi deneyim icin bir web sunucusu kullanmaniz önerilir.
echo.
start index.html

:end
echo.
echo Uygulama kapatiliyor...
pause 