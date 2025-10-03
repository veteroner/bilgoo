#!/usr/bin/env python3
import requests
import os

# Bilim kategorisi için eksik görseller
science_images = {
    'science_blue_whale.jpg': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'science_light_speed.jpg': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'science_spiders.jpg': 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'photosynthesis.jpg': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'saturn_moons.jpg': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'human_brain.jpg': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
        
        # Dizin yoksa oluştur
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Başarıyla indirildi: {filename}")
        return True
        
    except Exception as e:
        print(f"❌ Hata {filename}: {e}")
        return False

def main():
    """Ana fonksiyon"""
    print("🔬 Bilim kategorisi eksik görselleri indiriliyor...")
    print(f"📝 Toplam {len(science_images)} bilim görseli")
    print()
    
    success_count = 0
    total_count = len(science_images)
    
    for filename, url in science_images.items():
        if download_image(url, filename):
            success_count += 1
    
    print(f"\n📊 Sonuç: {success_count}/{total_count} bilim görseli başarıyla indirildi")
    
    if success_count == total_count:
        print("🎉 Tüm bilim görselleri başarıyla eklendi!")
    else:
        print("⚠️  Bazı bilim görselleri indirilemedi.")

if __name__ == "__main__":
    main()
