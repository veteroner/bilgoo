#!/usr/bin/env python3
import requests
import os

# Yeni coğrafya kategorisi için eksik görseller
new_geography_images = {
    'amazon_river.jpg': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'antarctica_ice.jpg': 'https://images.unsplash.com/photo-1551063130-9e7530d5b8cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'geography_antalya.jpg': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'geography_antarctica.jpg': 'https://images.unsplash.com/photo-1551063130-9e7530d5b8cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'geography_asia_largest.jpg': 'https://images.unsplash.com/photo-1464822759844-d150baec843a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'geography_everest.jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'geography_london.jpg': 'https://images.unsplash.com/photo-1520986606214-8b456906c96c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'geography_mount_ararat.jpg': 'https://images.unsplash.com/photo-1464822759844-d150baec843a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'geography_nile_longest.jpg': 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'geography_nile_river.jpg': 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'geography_pacific.jpg': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'geography_russia_largest.jpg': 'https://images.unsplash.com/photo-1520637836862-4d197d17c13a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'geography_turkey_regions.jpg': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'geography_vesuvius.jpg': 'https://images.unsplash.com/photo-1464822759844-d150baec843a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'geography_yellowstone.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'great_barrier_reef.jpg': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    print("🌍 Yeni coğrafya kategorisi eksik görselleri indiriliyor...")
    print(f"📝 Toplam {len(new_geography_images)} coğrafya görseli")
    print()
    
    success_count = 0
    total_count = len(new_geography_images)
    
    for filename, url in new_geography_images.items():
        if download_image(url, filename):
            success_count += 1
    
    print(f"\n📊 Sonuç: {success_count}/{total_count} coğrafya görseli başarıyla indirildi")
    
    if success_count == total_count:
        print("🎉 Tüm coğrafya görselleri başarıyla eklendi!")
    else:
        print("⚠️  Bazı coğrafya görselleri indirilemedi.")

if __name__ == "__main__":
    main()
