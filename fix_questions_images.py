#!/usr/bin/env python3
import requests
import os

# Doğru resimler için URL mappings
image_mappings = {
    # Q0058: Parthenon in Athens
    'img_030.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/The_Parthenon_in_Athens.jpg/1024px-The_Parthenon_in_Athens.jpg',
    
    # Q0064: American flag (instead of Turkish flag)
    'img_031.png': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    
    # Q0067: Eiffel Tower
    'img_032.jpg': 'https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    print("🖼️  Q0058, Q0064, Q0067 soruları için doğru resimler indiriliyor...")
    print("📝 Sorular:")
    print("   Q0058: Parthenon (img_030.jpg)")
    print("   Q0064: American Flag (img_031.png) - Turkish flag yerine")
    print("   Q0067: Eiffel Tower (img_032.jpg)")
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
