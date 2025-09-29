#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
from collections import defaultdict

def find_duplicate_questions():
    """Aynı içeriğe sahip ama farklı ID'li soruları bulur"""
    
    file_path = "languages/en/questions.json"
    
    if not os.path.exists(file_path):
        print(f"Dosya bulunamadı: {file_path}")
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Soru içeriği -> ID'ler mapping
    content_to_ids = defaultdict(list)
    
    # Tüm kategorileri gez
    for category, questions in data.items():
        if isinstance(questions, list):
            for i, question in enumerate(questions):
                if isinstance(question, dict) and 'question' in question:
                    # Soru içeriğini normalize et
                    question_text = question.get('question', '').strip().lower()
                    correct_answer = question.get('correctAnswer', '').strip().lower()
                    question_type = question.get('type', '').strip()
                    
                    # Benzersiz içerik anahtarı oluştur
                    content_key = f"{question_text}|{correct_answer}|{question_type}"
                    
                    # ID ve konum bilgisi
                    question_id = question.get('id', f'NO_ID_{i}')
                    location_info = {
                        'id': question_id,
                        'category': category,
                        'index': i,
                        'question_text': question.get('question', '')[:100] + "..."
                    }
                    
                    content_to_ids[content_key].append(location_info)
    
    # Duplicate içerikleri bul (aynı içeriğe sahip 2+ soru)
    duplicates_found = False
    
    print("🔍 AYNI İÇERİKTEKİ SORULAR AMA FARKLI ID'LER:")
    print("=" * 60)
    
    for content_key, locations in content_to_ids.items():
        if len(locations) > 1:
            duplicates_found = True
            print(f"\n📋 Aynı içerikli {len(locations)} soru bulundu:")
            
            # İlk sorunun metnini göster
            print(f"   📝 Soru: {locations[0]['question_text']}")
            
            print("   🆔 ID'ler ve konumlar:")
            for loc in locations:
                print(f"      - ID: {loc['id']:8} | Kategori: {loc['category']:20} | Index: {loc['index']}")
            
            # Farklı ID'ler var mı kontrol et
            unique_ids = set(loc['id'] for loc in locations)
            if len(unique_ids) > 1:
                print(f"   ⚠️  FARKLI ID'LER: {', '.join(unique_ids)}")
            else:
                print(f"   ✅ Aynı ID kullanılmış: {unique_ids.pop()}")
            
            print("-" * 60)
    
    if not duplicates_found:
        print("✅ Aynı içerikte farklı ID'li soru bulunamadı!")
    
    # İstatistik
    total_questions = sum(len(questions) if isinstance(questions, list) else 0 
                         for questions in data.values())
    total_categories = len([k for k, v in data.items() if isinstance(v, list)])
    
    print(f"\n📊 İSTATİSTİK:")
    print(f"   Toplam kategori: {total_categories}")
    print(f"   Toplam soru: {total_questions}")
    print(f"   Benzersiz içerik: {len(content_to_ids)}")
    print(f"   Duplicate içerik grubu: {len([k for k, v in content_to_ids.items() if len(v) > 1])}")

if __name__ == "__main__":
    find_duplicate_questions()
