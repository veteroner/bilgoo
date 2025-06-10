# PWA Kontrol Script
Write-Host "PWA Dosya Kontrolu" -ForegroundColor Green

# Ana dosyalar
$files = @("manifest.json", "sw.js", "index.html", "style.css", "script.js")

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "OK: $file" -ForegroundColor Green
    } else {
        Write-Host "EKSIK: $file" -ForegroundColor Red
    }
}

# Domain bilgisi
Write-Host "`nDomain: https://www.bilgoo.com" -ForegroundColor Cyan

Write-Host "`nPWABuilder Adimlari:" -ForegroundColor Yellow
Write-Host "1. https://www.pwabuilder.com adresine git"
Write-Host "2. Domain: https://www.bilgoo.com"
Write-Host "3. Start -> Package For Stores -> Android"
Write-Host "4. Download APK"

Write-Host "`nAPK Ayarlari:" -ForegroundColor Cyan
Write-Host "Package ID: com.teknova.quizoyunu"
Write-Host "App Name: Quiz Oyunu"
Write-Host "Theme: #3b82f6" 