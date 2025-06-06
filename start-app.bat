@echo off
echo Quiz Oyunu başlatılıyor...
echo.
echo Lütfen bekleyin, web sunucusu başlatılıyor...
echo.

:: Komut satırı konumunu dosyanın bulunduğu dizin olarak ayarla
cd /d %~dp0

:: Dosyaların varlığını kontrol et
if not exist "index.html" (
    echo Hata: index.html dosyası bulunamadı!
    echo Lütfen uygulamanın doğru klasörde olduğundan emin olun.
    pause
    exit /b 1
)

if not exist "questions.json" (
    echo Uyarı: questions.json dosyası bulunamadı!
    echo Uygulama varsayılan sorular ile çalışacak.
    echo.
)

:: Python yüklü mü kontrol et
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo Python bulundu, HTTP sunucusu başlatılıyor...
    echo.
    echo Tarayıcıda http://localhost:8000 adresine gidin
    echo.
    echo Uyarı: Eğer kategoriler veya sorular görünmüyorsa:
    echo 1. Tarayıcıda F12'ye basarak konsolu açın
    echo 2. Hata mesajlarını kontrol edin
    echo 3. Sayfayı yenileyin (F5)
    echo.
    echo Sunucuyu durdurmak için bu pencereyi kapatın.
    echo.
    
    :: Tarayıcıyı aç
    start "" "http://localhost:8000"
    
    :: HTTP sunucusunu başlat
    python -m http.server 8000
) else (
    :: Python yoksa alternatif olarak Node.js kontrol et
    where node >nul 2>nul
    if %errorlevel% equ 0 (
        echo Node.js bulundu, HTTP sunucusu başlatılıyor...
        echo.
        echo Tarayıcıda http://localhost:3000 adresine gidin
        echo.
        echo Uyarı: Eğer kategoriler veya sorular görünmüyorsa:
        echo 1. Tarayıcıda F12'ye basarak konsolu açın
        echo 2. Hata mesajlarını kontrol edin
        echo 3. Sayfayı yenileyin (F5)
        echo.
        echo Sunucuyu durdurmak için bu pencereyi kapatın.
        echo.
        
        :: Tarayıcıyı aç
        start "" "http://localhost:3000"
        
        :: HTTP sunucusunu başlat (npx kullanarak)
        npx serve -l 3000
    ) else (
        echo Hata: Lütfen Python veya Node.js yükleyin!
        echo.
        echo Uygulamayı çalıştırmak için şunlardan birini yükleyin:
        echo  - Python (https://www.python.org/downloads/)
        echo  - Node.js (https://nodejs.org/en/download/)
        echo.
        echo Yükledikten sonra bu dosyayı tekrar çalıştırın.
        pause
    )
) 