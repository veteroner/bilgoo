#!/usr/bin/env python3
import requests
import os

# img_sports_general.jpg kullanan sorular için uygun resimler
image_mappings = {
    # Q0360: Formula 1 races and points system
    'formula1_racing.jpg': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    
    # Q0362: Volleyball in Olympic Games
    'volleyball_olympic.jpg': 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    
    # Q0369: Water polo sport
    'water_polo_sport.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    print("🏈 img_sports_general.jpg kullanan sorular için doğru resimler indiriliyor...")
    print("📝 Sporlar:")
    print("   Q0360: Formula 1 racing points system")  
    print("   Q0362: Volleyball in Olympics")
    print("   Q0369: Water polo pools")
    print()
    
    success_count = 0
    total_count = len(image_mappings)
    
    for filename, url in image_mappings.items():
        if download_image(url, filename):
            success_count += 1
    
    print(f"\n📊 Sonuç: {success_count}/{total_count} resim başarıyla indirildi")
    
    if success_count == total_count:
        print("🎉 Tüm spor resimleri başarıyla güncellendi!")
    else:
        print("⚠️  Bazı resimler indirilemedi. Lütfen kontrol edin.")

if __name__ == "__main__":
    main()
