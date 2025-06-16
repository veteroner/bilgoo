@echo off
echo 🔄 Netlify dağıtımı sonrası dosyalar geri yükleniyor...

REM package.json geri yükle
if exist package.json.bak (
  echo 📦 Orjinal package.json geri yükleniyor...
  copy package.json.bak package.json
  del package.json.bak
  echo ✅ package.json geri yüklendi
) else (
  echo ⚠️ package.json.bak bulunamadı
)

echo.
echo 🟢 Dosyalar başarıyla geri yüklendi.
echo.
pause 