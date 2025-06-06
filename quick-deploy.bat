@echo off
echo 🚀 Hızlı Git Deploy
echo.

REM Değişiklikleri kontrol et
echo 📝 Değişiklikler kontrol ediliyor...
git status

echo.
set /p deploy_message="📝 Deploy mesajı girin: "
if "%deploy_message%"=="" (
    echo ❌ Mesaj gerekli!
    pause
    exit /b
)

echo.
echo 📦 Dosyalar ekleniyor...
git add .

echo.
echo 💾 Commit yapılıyor...
git commit -m "%deploy_message%"

echo.
echo 🚀 Deploy ediliyor...
git push

echo.
echo ✅ BAŞARILI! 
echo 🌐 Site 30-60 saniye içinde güncellenecek
echo 🔗 https://bilgoov3.netlify.app
echo.
pause 