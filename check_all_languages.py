#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
from collections import defaultdict, Counter

def check_duplicates_for_language(lang_code, lang_name):
    """Belirtilen dil için duplicate kontrol"""
    
    file_path = f'languages/{lang_code}/questions.json'
    
    if not os.path.exists(file_path):
        print(f"❌ {lang_name} dosyası bulunamadı: {file_path}")
        return
    
    print(f"\n🔍 {lang_name} duplicate kontrol ediliyor: {file_path}")
    print("=" * 60)
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if not isinstance(data, dict):
        print(f"❌ {lang_name} - Beklenmeyen JSON yapısı")
        return
    
    # ID ve soru metni tracking
    all_ids = []
    all_questions = []
    total_questions = 0
    
    for category, questions in data.items():
        if not isinstance(questions, list):
            continue
        
        total_questions += len(questions)
        
        for question in questions:
            if isinstance(question, dict):
                question_id = question.get('id', '')
                question_text = question.get('question', '').strip()
                
                if question_id:
                    all_ids.append(question_id)
                if question_text:
                    all_questions.append(question_text)
    
    # Duplicate ID analizi
    id_counter = Counter(all_ids)
    duplicate_ids = {id_: count for id_, count in id_counter.items() if count > 1}
    
    # Duplicate soru metni analizi
    question_counter = Counter(all_questions)
    duplicate_questions = {q: count for q, count in question_counter.items() if count > 1}
    
    # Sonuçları göster
    if duplicate_ids:
        print(f"🚨 {lang_name} - DUPLICATE ID'LER BULUNDU:")
        print("-" * 50)
        for id_, count in sorted(duplicate_ids.items()):
            print(f"ID: {id_} - {count} kez tekrarlanıyor")
        print(f"\nToplam duplicate ID: {len(duplicate_ids)}")
    else:
        print(f"✅ {lang_name} - Duplicate ID bulunamadı.")
    
    if duplicate_questions:
        print(f"\n📝 {lang_name} - DUPLICATE SORU METİNLERİ:")
        print("-" * 50)
        for i, (question, count) in enumerate(sorted(duplicate_questions.items())[:5], 1):
            print(f"{i}. Soru: {question[:60]}..." if len(question) > 60 else f"{i}. Soru: {question}")
            print(f"   Toplam tekrar: {count}")
        
        if len(duplicate_questions) > 5:
            print(f"... ve {len(duplicate_questions) - 5} tane daha duplicate soru metni var.")
        
        print(f"\nToplam duplicate soru metni: {len(duplicate_questions)}")
    else:
        print(f"✅ {lang_name} - Duplicate soru metni bulunamadı.")
    
    # Özet istatistikler
    print(f"\n📊 {lang_name} ÖZET İSTATİSTİKLER:")
    print("=" * 40)
    print(f"Toplam soru sayısı: {total_questions}")
    print(f"Duplicate ID'li sorular: {len(duplicate_ids)}")
    print(f"Duplicate metinli sorular: {len(duplicate_questions)}")
    
    return {
        'total_questions': total_questions,
        'duplicate_ids': len(duplicate_ids),
        'duplicate_texts': len(duplicate_questions)
    }

def main():
    print("🌍 TÜM DİLLER İÇİN DUPLICATE KONTROL")
    print("=" * 60)
    
    languages = [
        ('tr', 'Türkçe'),
        ('en', 'English'),
        ('de', 'Deutsch')
    ]
    
    summary = {}
    
    for lang_code, lang_name in languages:
        result = check_duplicates_for_language(lang_code, lang_name)
        if result:
            summary[lang_name] = result
    
    # Genel özet
    print("\n" + "=" * 60)
    print("🌍 GENEL ÖZET - TÜM DİLLER")
    print("=" * 60)
    
    for lang_name, stats in summary.items():
        print(f"\n{lang_name}:")
        print(f"  📊 Toplam soru: {stats['total_questions']}")
        print(f"  🔴 Duplicate ID: {stats['duplicate_ids']}")
        print(f"  🔴 Duplicate metin: {stats['duplicate_texts']}")
        
        if stats['duplicate_ids'] == 0 and stats['duplicate_texts'] == 0:
            print(f"  ✅ Temiz!")
        else:
            print(f"  ⚠️  Temizlik gerekli!")

if __name__ == "__main__":
    main()
