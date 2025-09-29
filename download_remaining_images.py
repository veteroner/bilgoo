#!/usr/bin/env python3
import requests
import os

# Kalan resimler için alternatif URL'ler
image_mappings = {
    # Kölner Dom için daha basit URL
    'img_029_de.jpg': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Cologne_Cathedral_%28evening%29.jpg',
    
    # Porta Nigra için daha basit URL
    'img_030_de.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/89/Porta_Nigra_Trier.jpg'
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
    print("🏰 Kalan Almanca resimler indiriliyor...")
    
    success_count = 0
    total_count = len(image_mappings)
    
    for filename, url in image_mappings.items():
        if download_image(url, filename):
            success_count += 1
    
    print(f"\n📊 Sonuç: {success_count}/{total_count} resim başarıyla indirildi")

if __name__ == "__main__":
    main()
