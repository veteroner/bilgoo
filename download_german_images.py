#!/usr/bin/env python3
import requests
import os
from urllib.parse import urlparse

# Almanca sorular için yeni resim URL'leri
image_mappings = {
    # Brandenburg Kapısı (Brandenburger Tor)
    'img_026_de.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Brandenburger_Tor_abends.jpg/800px-Brandenburger_Tor_abends.jpg',
    
    # Pamukkale - daha basit URL deneyelim
    'img_027_de.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Pamukkale.jpg/800px-Pamukkale.jpg',
    
    # Neuschwanstein Şatosu
    'img_028_de.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Schloss_Neuschwanstein_2013.jpg/800px-Schloss_Neuschwanstein_2013.jpg',
    
    # Kölner Dom - daha basit URL
    'img_029_de.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Dom_Cologne_Germany.jpg/600px-Dom_Cologne_Germany.jpg',
    
    # Porta Nigra Trier - daha basit URL
    'img_030_de.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Trier-PortaNigra-01.jpg/800px-Trier-PortaNigra-01.jpg'
}

def download_image(url, filename):
    """Resmi indir ve kaydet"""
    try:
        print(f"İndiriliyor: {filename}")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Assets klasörüne kaydet
        filepath = f'/Users/onerozbey/Desktop/quiz-oyunu/assets/images/questions/{filename}'
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Başarıyla indirildi: {filename}")
        return True
        
    except Exception as e:
        print(f"❌ Hata {filename}: {e}")
        return False

def main():
    """Ana fonksiyon"""
    print("🇩🇪 Almanca sorular için resimler indiriliyor...")
    
    # Assets/images/questions klasörünün var olduğunu kontrol et
    os.makedirs('/Users/onerozbey/Desktop/quiz-oyunu/assets/images/questions', exist_ok=True)
    
    success_count = 0
    total_count = len(image_mappings)
    
    for filename, url in image_mappings.items():
        if download_image(url, filename):
            success_count += 1
    
    print(f"\n📊 Sonuç: {success_count}/{total_count} resim başarıyla indirildi")
    
    if success_count == total_count:
        print("🎉 Tüm resimler başarıyla indirildi!")
    else:
        print("⚠️ Bazı resimler indirilemedi.")

if __name__ == "__main__":
    main()
