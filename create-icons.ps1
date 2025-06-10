# PWA ikonlari olusturma scripti
Write-Host "PWA ikonlari olusturuluyor..." -ForegroundColor Green

# Gerekli boyutlar
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

# ImageMagick kurulu mu kontrol et
try {
    magick -version | Out-Null
    Write-Host "ImageMagick bulundu." -ForegroundColor Green
} catch {
    Write-Host "ImageMagick bulunamadi. ImageMagick'i yukleyip PATH'e eklemeniz gerekiyor." -ForegroundColor Red
    Write-Host "Indirme linki: https://imagemagick.org/script/download.php#windows" -ForegroundColor Yellow
    exit 1
}

# SVG'den PNG'lere donustur
foreach ($size in $sizes) {
    $outputFile = "icons/icon-${size}x${size}.png"
    Write-Host "Olusturuluyor: $outputFile" -ForegroundColor Yellow
    
    try {
        magick "icons/icon-base.svg" -resize "${size}x${size}" -background transparent "$outputFile"
        Write-Host "OK $outputFile olusturuldu" -ForegroundColor Green
    } catch {
        Write-Host "HATA $outputFile olusturulamadi: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Shortcut ikonlari icin de olustur
Write-Host "`nShortcut ikonlari olusturuluyor..." -ForegroundColor Green
magick "icons/icon-base.svg" -resize "96x96" -background transparent "icons/shortcut-96x96.png"
magick "icons/icon-base.svg" -resize "96x96" -background transparent "icons/online-96x96.png"

Write-Host "`nTum ikonlar basariyla olusturuldu!" -ForegroundColor Green 