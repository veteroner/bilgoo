#!/usr/bin/env python3
import json
import os

def analyze_questions():
    questions_file = "languages/en/questions.json"
    
    if not os.path.exists(questions_file):
        print(f"❌ {questions_file} dosyası bulunamadı")
        return
    
    with open(questions_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print("📊 Kategori Analizi:")
    print("=" * 50)
    
    # Kategori bilgileri
    categories = list(data.keys())
    print(f"Toplam kategori sayısı: {len(categories)}")
    print(f"Kategoriler: {', '.join(categories)}")
    print()
    
    # Her kategorideki soru sayısı ve resimli soru kontrolleri
    total_questions = 0
    total_image_questions = 0
    image_questions_by_category = {}
    question_texts = {}  # Soru metinlerini saklamak için
    duplicate_questions = []
    
    for category in categories:
        questions = data[category]
        category_total = len(questions)
        total_questions += category_total
        
        # Resimli soruları say
        image_count = 0
        for q in questions:
            if 'image' in q or 'imageUrl' in q:
                image_count += 1
                total_image_questions += 1
        
        image_questions_by_category[category] = image_count
        
        print(f"📂 {category}:")
        print(f"  - Toplam soru: {category_total}")
        print(f"  - Resimli soru: {image_count}")
        
        # Soru metinlerini kontrol et (duplicate tespiti için)
        for q in questions:
            question_text = q.get('question', '').strip().lower()
            question_id = q.get('id', 'NO_ID')
            
            if question_text:
                if question_text in question_texts:
                    # Duplicate bulundu
                    original = question_texts[question_text]
                    duplicate_questions.append({
                        'text': q.get('question', ''),
                        'original_category': original['category'],
                        'original_id': original['id'],
                        'original_has_image': original['has_image'],
                        'duplicate_category': category,
                        'duplicate_id': question_id,
                        'duplicate_has_image': 'image' in q or 'imageUrl' in q
                    })
                else:
                    question_texts[question_text] = {
                        'category': category,
                        'id': question_id,
                        'has_image': 'image' in q or 'imageUrl' in q
                    }
        
        if image_count > 0:
            print(f"  ⚠️  Bu kategoride resimli sorular var!")
        print()
    
    print("📈 Genel İstatistikler:")
    print("=" * 50)
    print(f"Toplam soru sayısı: {total_questions}")
    print(f"Toplam resimli soru sayısı: {total_image_questions}")
    print()
    
    # Duplicate soruları göster
    if duplicate_questions:
        print("🔍 DUPLICATE SORULAR TESPİT EDİLDİ:")
        print("=" * 50)
        
        for i, dup in enumerate(duplicate_questions, 1):
            print(f"{i}. Duplicate Soru:")
            print(f"   Soru: \"{dup['text'][:100]}...\"")
            print(f"   Orijinal: {dup['original_category']} - {dup['original_id']} (Resim: {'Var' if dup['original_has_image'] else 'Yok'})")
            print(f"   Duplicate: {dup['duplicate_category']} - {dup['duplicate_id']} (Resim: {'Var' if dup['duplicate_has_image'] else 'Yok'})")
            print()
    else:
        print("✅ Duplicate soru bulunamadı")
    
    # Normal kategorilerde resimli sorular varsa uyarı ver
    normal_categories_with_images = {k: v for k, v in image_questions_by_category.items() 
                                   if k != "Image Questions" and v > 0}
    
    if normal_categories_with_images:
        print("\n⚠️  UYARI: Normal kategorilerde resimli sorular bulundu:")
        print("=" * 50)
        for cat, count in normal_categories_with_images.items():
            print(f"- {cat}: {count} resimli soru")
        print("\nBu durum duplicate sorulara neden olabilir!")
    else:
        print("\n✅ Normal kategorilerde resimli soru yok - sadece 'Image Questions' kategorisinde")

if __name__ == "__main__":
    analyze_questions()
