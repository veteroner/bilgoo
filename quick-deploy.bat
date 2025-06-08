@echo off
chcp 65001 >nul
title Hızlı Netlify Deploy

echo.
echo ⚡ HIZLI DEPLOY BAŞLATIYOR...
echo.

REM Değişiklikleri git'e ekle
git add .
git commit -m "Hızlı deploy: %date% %time%"
git push origin main

echo.
echo 🚀 Netlify'a deploy ediliyor...
netlify deploy --prod --dir .

echo.
echo ✅ Deploy tamamlandı!
netlify open

pause 