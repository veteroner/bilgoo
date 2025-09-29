#!/usr/bin/env python3
import requests
import os

# Doğru resimler için URL mappings
image_mappings = {
    # Q0055: Yellowstone National Park's hot springs - Grand Prismatic Spring
    'img_027.jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    
    # Q0056: Buckingham Palace
    'img_028.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Buckingham_Palace%2C_London_-_April_2009.jpg/800px-Buckingham_Palace%2C_London_-_April_2009.jpg',
    
    # Q0057: Tower of London
    'img_029.jpg': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    print("🖼️  Q0055, Q0056, Q0057 soruları için doğru resimler indiriliyor...")
    print("📝 Sorular:")
    print("   Q0055: Yellowstone National Park's hot springs")
    print("   Q0056: Buckingham Palace")
    print("   Q0057: Tower of London")
    print()
    
    success_count = 0
    total_count = len(image_mappings)
    
    for filename, url in image_mappings.items():
        if download_image(url, filename):
            success_count += 1
    
    print(f"\n📊 Sonuç: {success_count}/{total_count} resim başarıyla indirildi")
    
    if success_count == total_count:
        print("🎉 Tüm resimler başarıyla güncellendi!")
    else:
        print("⚠️  Bazı resimler indirilemedi. Lütfen kontrol edin.")

if __name__ == "__main__":
    main()
