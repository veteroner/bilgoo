@echo off
REM .gitignore dosyasını oluştur/güncelle
if not exist .gitignore (
    echo node_modules/>>.gitignore
    echo android/.gradle/>>.gitignore
    echo android/build/>>.gitignore
    echo **/build/>>.gitignore
    echo **/.transforms/>>.gitignore
)

echo 🚀 Netlify Otomatik Deployment Setup
echo.

REM Git repository kontrolü
if not exist .git (
    echo 📁 Git repository başlatılıyor...
    git init
    echo ✅ Git başlatıldı
) else (
    echo ✅ Git repository zaten mevcut
)

echo.
echo 📝 Dosyalar git'e ekleniyor...
git add .
git status

echo.
set /p commit_message="📝 Commit mesajı girin (varsayılan: 'Netlify otomatik deployment setup'): "
if "%commit_message%"=="" set commit_message=Netlify otomatik deployment setup

git commit -m "%commit_message%"

echo.
echo 🌐 GitHub repository URL'ini girin (örnek: https://github.com/kullanici/quiz-oyunu.git)
set /p repo_url="Repository URL: "

REM Remote repository ekleme
git remote remove origin 2>nul
git remote add origin %repo_url%
git branch -M main

echo.
echo 🚀 GitHub'a push ediliyor...
git push -u origin main

echo.
echo ✅ BAŞARILI! Şimdi yapılması gerekenler:
echo.
echo 1. Netlify Dashboard'a gidin: https://app.netlify.com
echo 2. "Add new site" → "Import an existing project"
echo 3. GitHub repository'nizi seçin
echo 4. Environment variables'ları ekleyin
echo.
echo 🎉 Artık her 'git push' ile otomatik deploy olacak!
echo.
pause 