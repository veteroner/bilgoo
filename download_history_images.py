#!/usr/bin/env python3
import requests
import os

# Tarih kategorisi için eksik görseller
history_images = {
    # Turkish History
    'history_ataturk_president.jpg': 'https://images.unsplash.com/photo-1509909756405-be0199881695?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_independence_war.jpg': 'https://images.unsplash.com/photo-1552059834-3f8d64c7ad68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_republic_proclamation.jpg': 'https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_tbmm_opening.jpg': 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_tbmm_first.jpg': 'https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_lausanne_treaty.jpg': 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_osman_bey.jpg': 'https://images.unsplash.com/photo-1568375173203-67c4c1c71569?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    
    # World History
    'history_napoleon.jpg': 'https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_alexander_great.jpg': 'https://images.unsplash.com/photo-1568375173203-67c4c1c71569?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_french_revolution.jpg': 'https://images.unsplash.com/photo-1508020963102-c6c723be5764?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_berlin_wall.jpg': 'https://images.unsplash.com/photo-1590587447962-5cf0bd30f77e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_wwi.jpg': 'https://images.unsplash.com/photo-1516627145497-ae511f4f7d9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_columbus.jpg': 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_renaissance.jpg': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_ancient_egypt.jpg': 'https://images.unsplash.com/photo-1463736932348-4915582d5149?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'history_crusades.jpg': 'https://images.unsplash.com/photo-1568375173203-67c4c1c71569?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    print("📚 Tarih kategorisi eksik görselleri indiriliyor...")
    print(f"📝 Toplam {len(history_images)} tarih görseli")
    print()
    
    success_count = 0
    total_count = len(history_images)
    
    for filename, url in history_images.items():
        if download_image(url, filename):
            success_count += 1
    
    print(f"\n📊 Sonuç: {success_count}/{total_count} tarih görseli başarıyla indirildi")
    
    if success_count == total_count:
        print("🎉 Tüm tarih görselleri başarıyla eklendi!")
    else:
        print("⚠️  Bazı tarih görselleri indirilemedi.")

if __name__ == "__main__":
    main()
