@echo off
echo 🔄 Netlify dağıtımı için hazırlık yapılıyor...

REM package.json dosyasını yedekle
if exist package.json (
  echo 📦 package.json yedeği oluşturuluyor...
  copy package.json package.json.bak
  
  REM Web sürümünü kopyala
  if exist package.web.json (
    echo 📦 Web package.json dosyası kopyalanıyor...
    copy package.web.json package.json
    echo ✅ package.json web sürümüyle değiştirildi
  )
) else (
  echo ⚠️ package.json bulunamadı
)

echo.
echo 🟢 Netlify dağıtımı için hazırlık tamamlandı.
echo 🔔 Şimdi 'setup-git-deploy.bat' dosyasını çalıştırabilirsiniz.
echo.
pause 