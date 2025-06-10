# Bubblewrap ile APK Olusturma
Write-Host "Bubblewrap APK Olusturma" -ForegroundColor Green

Write-Host "1. Node.js kontrol ediliyor..." -ForegroundColor Yellow
if (Get-Command "node" -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "OK: Node.js $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "HATA: Node.js yok - https://nodejs.org'dan indirin" -ForegroundColor Red
    exit 1
}

Write-Host "2. Bubblewrap kurulumu:" -ForegroundColor Yellow
Write-Host "npm install -g @bubblewrap/cli" -ForegroundColor Gray

Write-Host "3. APK olusturma komutlari:" -ForegroundColor Yellow  
Write-Host "bubblewrap init --manifest=https://www.bilgoo.com/manifest.json" -ForegroundColor Gray
Write-Host "bubblewrap build" -ForegroundColor Gray

Write-Host "4. Paket ID: com.teknova.quizoyunu" -ForegroundColor Cyan
Write-Host "5. App Name: Quiz Oyunu" -ForegroundColor Cyan

Write-Host "`nNot: Bu yontem Android SDK gerektirir" -ForegroundColor Yellow 