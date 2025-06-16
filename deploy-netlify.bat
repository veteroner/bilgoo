@echo off
echo Netlify dağıtımı hazırlanıyor...

rem Netlify klasörünün olduğundan emin olalım
if not exist "netlify-deploy" mkdir netlify-deploy

rem Web dosyalarını temizleyip yeniden kopyalayalım
del /Q netlify-deploy\*.* 2>nul
xcopy *.html netlify-deploy\ /Y
xcopy *.css netlify-deploy\ /Y
xcopy *.js netlify-deploy\ /Y
xcopy manifest.json netlify-deploy\ /Y
xcopy sw.js netlify-deploy\ /Y
xcopy *.svg netlify-deploy\ /Y
xcopy service-worker.js netlify-deploy\ /Y

rem Diğer gerekli klasörleri kopyalayalım
if not exist "netlify-deploy\icons" mkdir netlify-deploy\icons
xcopy icons\*.* netlify-deploy\icons\ /Y /S

rem Netlify yapılandırma dosyasını ekliyoruz
echo [build] > netlify-deploy\netlify.toml
echo   publish = "." >> netlify-deploy\netlify.toml
echo   command = "echo 'No build required'" >> netlify-deploy\netlify.toml
echo. >> netlify-deploy\netlify.toml
echo [[redirects]] >> netlify-deploy\netlify.toml
echo   from = "/*" >> netlify-deploy\netlify.toml
echo   to = "/index.html" >> netlify-deploy\netlify.toml
echo   status = 200 >> netlify-deploy\netlify.toml

rem Web sürümü için package.json oluşturuyoruz
echo {> netlify-deploy\package.json
echo   "name": "quiz-oyunu-web",>> netlify-deploy\package.json
echo   "version": "1.0.0",>> netlify-deploy\package.json
echo   "description": "Bilgoo uygulamasının web sürümü",>> netlify-deploy\package.json
echo   "main": "index.html",>> netlify-deploy\package.json
echo   "scripts": {>> netlify-deploy\package.json
echo     "start": "serve -s">> netlify-deploy\package.json
echo   },>> netlify-deploy\package.json
echo   "keywords": [],>> netlify-deploy\package.json
echo   "author": "",>> netlify-deploy\package.json
echo   "license": "ISC",>> netlify-deploy\package.json
echo   "dependencies": {>> netlify-deploy\package.json
echo     "serve": "^14.2.1">> netlify-deploy\package.json
echo   }>> netlify-deploy\package.json
echo }>> netlify-deploy\package.json

echo Web dosyaları netlify-deploy klasörüne başarıyla hazırlandı.
echo.
echo Bu klasörü Netlify'a manual olarak deploy edebilir veya Netlify CLI kullanarak deploy edebilirsiniz:
echo npx netlify deploy --dir=netlify-deploy
echo.
echo Dağıtımı onaylamak için:
echo npx netlify deploy --dir=netlify-deploy --prod
echo.

pause 