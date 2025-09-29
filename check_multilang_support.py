#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os

def check_question_ids_and_languages():
    """Yeni soruların ID'lerini ve dil desteğini kontrol et"""
    
    print("🔍 Yeni Soruların ID ve Çok Dil Durumu Kontrolü")
    print("=" * 60)
    
    # Türkçe sorulardan yeni ID'leri bul
    tr_file = "languages/tr/questions.json"
    
    with open(tr_file, 'r', encoding='utf-8') as f:
        tr_data = json.load(f)
    
    # Coğrafya kategorisindeki yeni soruları bul (Q0708'den itibaren)
    geography_questions = tr_data.get('Coğrafya', [])
    new_questions = [q for q in geography_questions if q.get('id', '') >= 'Q0708']
    
    print(f"📝 Türkçe'de bulunan yeni sorular ({len(new_questions)} adet):")
    for q in new_questions:
        qid = q.get('id', 'No ID')
        question = q.get('question', '')[:50] + "..." if len(q.get('question', '')) > 50 else q.get('question', '')
        print(f"   • {qid}: {question}")
    
    # Diğer dilleri kontrol et
    languages = {
        'en': 'İngilizce',
        'de': 'Almanca',
        'fr': 'Fransızca',
        'es': 'İspanyolca'
    }
    
    print(f"\n🌍 Diğer Dillerde Karşılık Kontrolü:")
    
    for lang_code, lang_name in languages.items():
        lang_file = f"languages/{lang_code}/questions.json"
        
        if os.path.exists(lang_file):
            print(f"\n📋 {lang_name} ({lang_code}):")
            
            with open(lang_file, 'r', encoding='utf-8') as f:
                lang_data = json.load(f)
            
            # Dosya yapısını kontrol et
            if isinstance(lang_data, dict):
                # Kategori yapısı
                all_questions = []
                for category, questions in lang_data.items():
                    if isinstance(questions, list):
                        all_questions.extend(questions)
            else:
                # Array yapısı
                all_questions = lang_data.get('questions', [])
            
            # Yeni ID'leri ara
            found_new_ids = []
            for q in all_questions:
                qid = q.get('id', '')
                if qid >= 'Q0708':
                    found_new_ids.append(qid)
            
            if found_new_ids:
                print(f"   ✅ {len(found_new_ids)} yeni soru bulundu:")
                for qid in sorted(found_new_ids)[:5]:  # İlk 5'ini göster
                    question = next((q for q in all_questions if q.get('id') == qid), {})
                    q_text = question.get('question', '')[:40] + "..." if len(question.get('question', '')) > 40 else question.get('question', '')
                    print(f"      • {qid}: {q_text}")
                if len(found_new_ids) > 5:
                    print(f"      ... ve {len(found_new_ids) - 5} tane daha")
            else:
                print(f"   ❌ Yeni sorular bulunamadı")
                
        else:
            print(f"\n📋 {lang_name} ({lang_code}):")
            print(f"   ⚠️ Dosya bulunamadı: {lang_file}")
    
    # Özet rapor
    print(f"\n" + "=" * 60)
    print(f"📊 SONUÇ RAPORU:")
    print(f"   🇹🇷 Türkçe: {len(new_questions)} yeni soru ✅")
    
    for lang_code, lang_name in languages.items():
        lang_file = f"languages/{lang_code}/questions.json"
        if os.path.exists(lang_file):
            with open(lang_file, 'r', encoding='utf-8') as f:
                lang_data = json.load(f)
            
            if isinstance(lang_data, dict):
                all_questions = []
                for category, questions in lang_data.items():
                    if isinstance(questions, list):
                        all_questions.extend(questions)
            else:
                all_questions = lang_data.get('questions', [])
            
            found_count = len([q for q in all_questions if q.get('id', '') >= 'Q0708'])
            status = "✅" if found_count > 0 else "❌"
            print(f"   🌍 {lang_name}: {found_count} soru {status}")
        else:
            print(f"   🌍 {lang_name}: Dosya yok ❌")

def main():
    check_question_ids_and_languages()

if __name__ == "__main__":
    main()
