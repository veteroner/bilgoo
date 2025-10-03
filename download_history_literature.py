#!/usr/bin/env python3
import requests
import os

# Tarih ve edebiyat kategorisi için eksik görseller
history_literature_images = {
    'berlin_wall.jpg': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_ancient_egypt.jpg': 'https://images.unsplash.com/photo-1463736932348-4915582d5149?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_berlin_wall.jpg': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_henry_viii.jpg': 'https://images.unsplash.com/photo-1568375173203-67c4c1c71569?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_london_wwii.jpg': 'https://images.unsplash.com/photo-1520986606214-8b456906c96c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'img_history_ancient.jpg': 'https://images.unsplash.com/photo-1463736932348-4915582d5149?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'literature_don_quixote.jpg': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'literature_haiku.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'literature_kurk_mantolu.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'literature_sonnet.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'literature_yasar_kemal.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'marie_curie.jpg': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'sistine_chapel.jpg': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    print("📚 Tarih ve edebiyat kategorisi eksik görselleri indiriliyor...")
    print(f"📝 Toplam {len(history_literature_images)} görsel")
    print()
    
    success_count = 0
    total_count = len(history_literature_images)
    
    for filename, url in history_literature_images.items():
        if download_image(url, filename):
            success_count += 1
    
    print(f"\n📊 Sonuç: {success_count}/{total_count} görsel başarıyla indirildi")
    
    if success_count == total_count:
        print("🎉 Tüm görseller başarıyla eklendi!")
    else:
        print("⚠️  Bazı görseller indirilemedi.")

if __name__ == "__main__":
    main()
