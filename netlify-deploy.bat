@echo off
chcp 65001 >nul
title Bilgoo - Netlify Otomatik Deploy

echo.
echo ========================================
echo     🚀 BILGOO NETLIFY DEPLOY 🚀
echo ========================================
echo.

REM Renkli yazı için ANSI kod desteği
for /f "tokens=2 delims=." %%i in ('ver') do set winver=%%i
if %winver% geq 10 (
    echo [32m✅ Windows 10+ algılandı, renkli çıktı destekleniyor[0m
) else (
    echo ✅ Windows algılandı
)

echo.
echo [36m📋 Deploy işlemi başlatılıyor...[0m
echo.

REM Netlify CLI kurulu mu kontrol et
where netlify >nul 2>nul
if %errorlevel% neq 0 (
    echo [31m❌ Netlify CLI bulunamadı! Kuruluyor...[0m
    echo.
    npm install -g netlify-cli
    if %errorlevel% neq 0 (
        echo [31m❌ Netlify CLI kurulumu başarısız! Node.js kurulu mu kontrol edin.[0m
        echo [33m💡 Node.js indirmek için: https://nodejs.org[0m
        pause
        exit /b 1
    )
    echo [32m✅ Netlify CLI başarıyla kuruldu![0m
    echo.
) else (
    echo [32m✅ Netlify CLI mevcut![0m
    echo.
)

REM Netlify CLI versiyonunu göster
echo [36m📦 Netlify CLI Versiyonu:[0m
netlify --version
echo.

REM Git durumunu kontrol et
if not exist ".git" (
    echo [33m⚠️  Git repository bulunamadı! GitHub ile bağlantı kuruluyor...[0m
    echo.
    git init
    git remote add origin https://github.com/veteroner/bilgoo.git
    echo [32m✅ Git repository bağlantısı kuruldu![0m
    echo.
)

REM Değişiklikleri commit et (eğer varsa)
git status --porcelain >nul 2>nul
if %errorlevel% equ 0 (
    for /f %%i in ('git status --porcelain ^| find /c /v ""') do set changes=%%i
    if !changes! gtr 0 (
        echo [33m📝 %changes% adet değişiklik bulundu, commit ediliyor...[0m
        git add .
        git commit -m "Auto-deploy: %date% %time%"
        git push origin main
        echo [32m✅ Değişiklikler GitHub'a yüklendi![0m
        echo.
    ) else (
        echo [32m✅ Tüm değişiklikler zaten commit edilmiş![0m
        echo.
    )
)

REM Netlify login durumunu kontrol et
netlify status >nul 2>nul
if %errorlevel% neq 0 (
    echo [33m🔐 Netlify hesabınıza giriş yapmanız gerekiyor...[0m
    echo [36m🌐 Tarayıcınızda açılacak sayfada yetkilendirme yapın.[0m
    echo.
    netlify login
    if %errorlevel% neq 0 (
        echo [31m❌ Netlify girişi başarısız![0m
        pause
        exit /b 1
    )
    echo [32m✅ Netlify girişi başarılı![0m
    echo.
) else (
    echo [32m✅ Netlify hesabınız aktif![0m
    echo.
)

REM Site mevcut mu kontrol et
if not exist ".netlify\state.json" (
    echo [33m🆕 Yeni Netlify sitesi oluşturuluyor...[0m
    echo.
    netlify init
    if %errorlevel% neq 0 (
        echo [31m❌ Site oluşturma başarısız![0m
        pause
        exit /b 1
    )
    echo [32m✅ Netlify sitesi başarıyla oluşturuldu![0m
    echo.
) else (
    echo [32m✅ Netlify sitesi mevcut![0m
    echo.
)

REM Build klasörünü hazırla (gerekirse)
if not exist "dist" (
    mkdir dist >nul 2>nul
)

echo [36m🔄 Deploy işlemi başlatılıyor...[0m
echo [33m⏳ Bu işlem birkaç dakika sürebilir...[0m
echo.

REM Production deploy
netlify deploy --prod --dir .
if %errorlevel% equ 0 (
    echo.
    echo [32m========================================[0m
    echo [32m🎉 DEPLOY BAŞARILI! 🎉[0m
    echo [32m========================================[0m
    echo.
    echo [36m🌐 Siteniz yayında![0m
    echo [33m🔗 Site URL'nizi görmek için: netlify open[0m
    echo [33m📊 Site durumunu görmek için: netlify status[0m
    echo.
    
    REM Site URL'sini al ve göster
    for /f "delims=" %%i in ('netlify status --json ^| findstr "url"') do (
        echo [36m%%i[0m
    )
    
    echo.
    echo [36m✨ Bilgoo oyununuz başarıyla Netlify'da yayında![0m
    echo [33m💡 İpucu: Değişiklik yaptığınızda bu dosyayı tekrar çalıştırın.[0m
    
) else (
    echo.
    echo [31m❌ Deploy başarısız![0m
    echo [33m🔧 Hata giderme önerileri:[0m
    echo [33m   1. İnternet bağlantınızı kontrol edin[0m
    echo [33m   2. Netlify hesap limitlerini kontrol edin[0m
    echo [33m   3. Dosya yetkilendirmelerini kontrol edin[0m
    echo.
)

echo.
echo [36m📝 Log dosyası: netlify-deploy.log[0m
echo [33m❓ Yardım için: netlify help[0m
echo.

pause 