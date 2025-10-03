#!/usr/bin/env python3
import requests
import os

# Eksik kalan tarih görselleri için alternatif URL'ler
remaining_history_images = {
    'history_independence_war.jpg': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_osman_bey.jpg': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_alexander_great.jpg': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_berlin_wall.jpg': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_wwi.jpg': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_ancient_egypt.jpg': 'https://images.unsplash.com/photo-1483048014148-56d50de4df8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_crusades.jpg': 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    print("📚 Eksik kalan tarih görselleri indiriliyor...")
    print(f"📝 Toplam {len(remaining_history_images)} eksik tarih görseli")
    print()
    
    success_count = 0
    total_count = len(remaining_history_images)
    
    for filename, url in remaining_history_images.items():
        if download_image(url, filename):
            success_count += 1
    
    print(f"\n📊 Sonuç: {success_count}/{total_count} eksik tarih görseli tamamlandı")
    
    if success_count == total_count:
        print("🎉 Tüm eksik tarih görselleri başarıyla eklendi!")
    else:
        print("⚠️  Bazı tarih görselleri hala eksik.")

if __name__ == "__main__":
    main()
