@echo off
echo Bilgoo - Netlify Deploy Aracı
echo ==============================
echo.

REM Netlify CLI kurulu mu kontrol et
call netlify --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Netlify CLI kurulu değil. Kuruluyor...
    call npm install -g netlify-cli
    if %ERRORLEVEL% NEQ 0 (
        echo Netlify CLI kurulumu başarısız oldu. Lütfen Node.js'in kurulu olduğundan emin olun.
        pause
        exit /b 1
    )
)

echo Netlify CLI kurulu. İşleme devam ediliyor...
echo.

REM Netlify giriş kontrolü
call netlify status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Netlify hesabınızla giriş yapmanız gerekiyor.
    call netlify login
    if %ERRORLEVEL% NEQ 0 (
        echo Netlify girişi başarısız oldu.
        pause
        exit /b 1
    )
)

echo.
echo Projeyi Netlify'a deploy etmeye hazırlanıyor...

REM Kullanıcıya site adı sorma
set /p site_name=Netlify site adınızı girin (boş bırakırsanız rastgele ad atanacak): 

if "%site_name%"=="" (
    echo Site adı belirtilmedi, rastgele bir ad atanacak.
    call netlify deploy --prod
) else (
    echo %site_name% site adıyla deploy ediliyor...
    call netlify deploy --prod --site %site_name%
)

if %ERRORLEVEL% NEQ 0 (
    echo Deploy işlemi başarısız oldu.
    pause
    exit /b 1
)

echo.
echo Deploy işlemi tamamlandı!
echo Netlify kontrol panelinden sitenizi yönetebilirsiniz: https://app.netlify.com
echo.

pause 