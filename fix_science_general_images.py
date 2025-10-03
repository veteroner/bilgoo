#!/usr/bin/env python3
import requests
import os

# img_science_general.jpg kullanan sorular için uygun resimler
image_mappings = {
    # Q0177: The skin is the largest organ in the human body
    'skin_organ.jpg': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    
    # Q0178: Human DNA is approximately 99% identical to that of chimpanzees
    'dna_structure.jpg': 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    
    # Q0189: The human brain is more active while sleeping
    'brain_activity.jpg': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    
    # Q0190: Ostriches bury their heads in sand when in danger
    'ostrich_animal.jpg': 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    print("🖼️  img_science_general.jpg kullanan sorular için doğru resimler indiriliyor...")
    print("📝 Sorular:")
    print("   Q0177: The skin is the largest organ")  
    print("   Q0178: Human DNA vs chimpanzees")
    print("   Q0189: Brain activity while sleeping")
    print("   Q0190: Ostriches bury heads in sand")
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
