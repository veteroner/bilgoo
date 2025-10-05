#!/bin/bash

echo "🔄 Dosyalar www klasörüne kopyalanıyor..."

# Ana dizindeki dosyaları www klasörüne kopyala
cp index.html www/
cp style.css www/
cp script.js www/
cp *.js www/ 2>/dev/null || true
cp *.css www/ 2>/dev/null || true
cp *.html www/ 2>/dev/null || true
cp *.json www/ 2>/dev/null || true

echo "✅ Dosyalar kopyalandı!"

echo "🔄 Capacitor senkronizasyonu başlatılıyor..."

# Android ve iOS için sync işlemi
npx cap sync

echo "✅ Tüm işlemler tamamlandı!"
echo "🚀 Artık her iki platformda da güncel dosyalarınız bulunuyor."
