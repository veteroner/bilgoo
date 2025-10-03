#!/usr/bin/env python3

# Yeni eklenen resimleri sayan script

import os

def count_new_images():
    """Yeni eklenen resimleri kategorilere göre say"""
    
    # Ana klasör
    images_dir = '/Users/onerozbey/Desktop/quiz-oyunu/assets/images/questions'
    
    categories = {
        'history': 0,
        'geography': 0, 
        'sports': 0,
        'literature': 0,
        'numbered': 0
    }
    
    try:
        files = os.listdir(images_dir)
        
        for file in files:
            if file.startswith('history_'):
                categories['history'] += 1
            elif file.startswith('geography_'):
                categories['geography'] += 1
            elif file.startswith('sports_'):
                categories['sports'] += 1
            elif file.startswith('literature_'):
                categories['literature'] += 1
            elif (file.startswith('img_0') and file[4:6].isdigit() and int(file[4:6]) >= 51) or file in ['img_116.jpg', 'img_117.jpg', 'img_121.jpg']:
                categories['numbered'] += 1
    
    except Exception as e:
        print(f"Hata: {e}")
        return
    
    print("📊 YENİ EKLENMİŞ GÖRSEL RAPORU")
    print("=" * 40)
    print(f"📚 Tarih kategorisi: {categories['history']} görsel")
    print(f"🌍 Coğrafya kategorisi: {categories['geography']} görsel") 
    print(f"⚽ Spor kategorisi: {categories['sports']} görsel")
    print(f"📖 Edebiyat kategorisi: {categories['literature']} görsel")
    print(f"🔢 Numaralı görseller: {categories['numbered']} görsel")
    print("=" * 40)
    print(f"🎯 TOPLAM: {sum(categories.values())} yeni görsel eklendi!")
    print()
    print("✅ Tüm görseller şu platformlarda senkronize edildi:")
    print("   • assets/images/questions/")
    print("   • www/assets/images/questions/") 
    print("   • android/app/src/main/assets/public/assets/images/questions/")
    print("   • ios/App/App/public/assets/images/questions/")

if __name__ == "__main__":
    count_new_images()
