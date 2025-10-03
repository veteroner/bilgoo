#!/usr/bin/env python3
import requests
import os

# Numaralı img dosyaları için eksik görseller
numbered_images = {
    'img_051.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_052.jpg': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_053.jpg': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_054.jpg': 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_055.jpg': 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_056.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_057.jpg': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_058.jpg': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_059.jpg': 'https://images.unsplash.com/photo-1464822759844-d150baec843a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_060.jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_061.jpg': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_062.jpg': 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_063.jpg': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_064.jpg': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_065.jpg': 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_066.jpg': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_067.jpg': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_068.jpg': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_069.jpg': 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_070.jpg': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_071.jpg': 'https://images.unsplash.com/photo-1463736932348-4915582d5149?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_072.jpg': 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_073.jpg': 'https://images.unsplash.com/photo-1516627145497-ae511f4f7d9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_074.jpg': 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_075.jpg': 'https://images.unsplash.com/photo-1508020963102-c6c723be5764?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_076.jpg': 'https://images.unsplash.com/photo-1590587447962-5cf0bd30f77e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_077.jpg': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_078.jpg': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_079.jpg': 'https://images.unsplash.com/photo-1483048014148-56d50de4df8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_116.jpg': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_117.jpg': 'https://images.unsplash.com/photo-1509909756405-be0199881695?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_121.jpg': 'https://images.unsplash.com/photo-1552059834-3f8d64c7ad68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    print("🔢 Numaralı img dosyaları indiriliyor...")
    print(f"📝 Toplam {len(numbered_images)} numaralı görsel")
    print()
    
    success_count = 0
    total_count = len(numbered_images)
    
    for filename, url in numbered_images.items():
        if download_image(url, filename):
            success_count += 1
    
    print(f"\n📊 Sonuç: {success_count}/{total_count} numaralı görsel başarıyla indirildi")
    
    if success_count == total_count:
        print("🎉 Tüm numaralı görseller başarıyla eklendi!")
    else:
        print("⚠️  Bazı numaralı görseller indirilemedi.")

if __name__ == "__main__":
    main()
