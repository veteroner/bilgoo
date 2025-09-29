#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os

def compare_multilang_questions():
    """Türkçe ile diğer dillerdeki soru sayılarını karşılaştır"""
    
    print("🔍 ÇOKLU DİL SORU KARŞILAŞTIRMA ANALİZİ")
    print("=" * 60)
    
    # Türkçe dosyayı referans al
    tr_file = "languages/tr/questions.json"
    
    with open(tr_file, 'r', encoding='utf-8') as f:
        tr_data = json.load(f)
    
    # Türkçe kategorileri ve soru sayılarını analiz et
    tr_stats = {}
    tr_total = 0
    
    print("📊 TÜRKÇE (Referans) Kategori Analizi:")
    print("-" * 40)
    
    for category, questions in tr_data.items():
        if isinstance(questions, list):
            total_count = len(questions)
            true_false_count = len([q for q in questions if q.get('type') == 'DoğruYanlış'])
            multiple_choice_count = total_count - true_false_count
            
            tr_stats[category] = {
                'total': total_count,
                'true_false': true_false_count,
                'multiple_choice': multiple_choice_count
            }
            tr_total += total_count
            
            print(f"   📚 {category}: {total_count} soru")
            print(f"      ├─ ✅❌ Doğru/Yanlış: {true_false_count}")
            print(f"      └─ 🔤 Çoktan Seçmeli: {multiple_choice_count}")
    
    print(f"\n🇹🇷 TÜRKÇE TOPLAM: {tr_total} soru")
    
    # Diğer dilleri kontrol et
    other_languages = {
        'en': '🇬🇧 İngilizce',
        'de': '🇩🇪 Almanca'
    }
    
    comparison_results = {}
    
    for lang_code, lang_name in other_languages.items():
        print(f"\n{'-' * 60}")
        print(f"📋 {lang_name} Analizi:")
        print("-" * 40)
        
        lang_file = f"languages/{lang_code}/questions.json"
        
        if os.path.exists(lang_file):
            with open(lang_file, 'r', encoding='utf-8') as f:
                lang_data = json.load(f)
            
            lang_stats = {}
            lang_total = 0
            
            # Dosya yapısını kontrol et
            if 'questions' in lang_data:
                # Array yapısı
                all_questions = lang_data['questions']
                
                # Kategorileri tahmin et (örnek sorulardan)
                categories = set()
                for q in all_questions:
                    cat = q.get('category', 'Unknown')
                    categories.add(cat)
                
                for category in categories:
                    cat_questions = [q for q in all_questions if q.get('category') == category]
                    total_count = len(cat_questions)
                    true_false_count = len([q for q in cat_questions if q.get('type') == 'DoğruYanlış'])
                    multiple_choice_count = total_count - true_false_count
                    
                    lang_stats[category] = {
                        'total': total_count,
                        'true_false': true_false_count,
                        'multiple_choice': multiple_choice_count
                    }
                    lang_total += total_count
                    
                    print(f"   📚 {category}: {total_count} soru")
                    print(f"      ├─ ✅❌ Doğru/Yanlış: {true_false_count}")
                    print(f"      └─ 🔤 Çoktan Seçmeli: {multiple_choice_count}")
            
            else:
                # Kategori yapısı
                for category, questions in lang_data.items():
                    if isinstance(questions, list):
                        total_count = len(questions)
                        true_false_count = len([q for q in questions if q.get('type') == 'DoğruYanlış'])
                        multiple_choice_count = total_count - true_false_count
                        
                        lang_stats[category] = {
                            'total': total_count,
                            'true_false': true_false_count,
                            'multiple_choice': multiple_choice_count
                        }
                        lang_total += total_count
                        
                        print(f"   📚 {category}: {total_count} soru")
                        print(f"      ├─ ✅❌ Doğru/Yanlış: {true_false_count}")
                        print(f"      └─ 🔤 Çoktan Seçmeli: {multiple_choice_count}")
            
            print(f"\n   {lang_name} TOPLAM: {lang_total} soru")
            
            # Türkçe ile karşılaştır
            missing_percentage = ((tr_total - lang_total) / tr_total) * 100 if tr_total > 0 else 0
            comparison_results[lang_code] = {
                'name': lang_name,
                'total': lang_total,
                'missing': tr_total - lang_total,
                'missing_percentage': missing_percentage,
                'stats': lang_stats
            }
            
            if lang_total < tr_total:
                print(f"   ⚠️ EKSİK: {tr_total - lang_total} soru ({missing_percentage:.1f}%)")
            elif lang_total == tr_total:
                print(f"   ✅ TAMAM: Türkçe ile aynı sayıda")
            else:
                print(f"   📈 FAZLA: {lang_total - tr_total} soru")
        
        else:
            print(f"   ❌ Dosya bulunamadı: {lang_file}")
            comparison_results[lang_code] = {
                'name': lang_name,
                'total': 0,
                'missing': tr_total,
                'missing_percentage': 100.0,
                'stats': {}
            }
    
    # Kategori bazında detay karşılaştırma
    print(f"\n{'=' * 60}")
    print("📊 KATEGORİ BAZINDA DETAY KARŞILAŞTIRMA")
    print("=" * 60)
    
    # Tüm kategorileri topla
    all_categories = set(tr_stats.keys())
    for lang_code, result in comparison_results.items():
        all_categories.update(result['stats'].keys())
    
    # Her kategori için karşılaştır
    for category in sorted(all_categories):
        print(f"\n📚 {category}:")
        print("-" * 30)
        
        # Türkçe baseline
        tr_count = tr_stats.get(category, {}).get('total', 0)
        print(f"   🇹🇷 Türkçe: {tr_count} soru")
        
        for lang_code, result in comparison_results.items():
            lang_count = result['stats'].get(category, {}).get('total', 0)
            
            # Kategori adı çevirisi kontrolü
            translated_categories = {
                'en': {
                    'Coğrafya': 'Geography',
                    'Genel Kültür': 'General Knowledge',
                    'Tarih': 'History',
                    'Bilim': 'Science',
                    'Teknoloji': 'Technology',
                    'Spor': 'Sports',
                    'Müzik': 'Music',
                    'Edebiyat': 'Literature'
                },
                'de': {
                    'Coğrafya': 'Geographie',
                    'Genel Kültür': 'Allgemeinwissen',
                    'Tarih': 'Geschichte',
                    'Bilim': 'Wissenschaft',
                    'Teknoloji': 'Technologie',
                    'Spor': 'Sport',
                    'Müzik': 'Musik',
                    'Edebiyat': 'Literatur'
                }
            }
            
            # Çevrilmiş kategori adını da kontrol et
            translated_cat = translated_categories.get(lang_code, {}).get(category)
            if translated_cat and translated_cat in result['stats']:
                lang_count = result['stats'][translated_cat]['total']
            
            if lang_count < tr_count:
                print(f"   {result['name']}: {lang_count} soru ⚠️ ({tr_count - lang_count} eksik)")
            elif lang_count == tr_count:
                print(f"   {result['name']}: {lang_count} soru ✅")
            else:
                print(f"   {result['name']}: {lang_count} soru 📈 ({lang_count - tr_count} fazla)")
    
    # Öneri raporu
    print(f"\n{'=' * 60}")
    print("💡 ÖNERİ VE EYLEM PLANI")
    print("=" * 60)
    
    for lang_code, result in comparison_results.items():
        if result['missing'] > 0:
            print(f"\n🔧 {result['name']} için öneriler:")
            print(f"   📊 Toplam eksik: {result['missing']} soru (%{result['missing_percentage']:.1f})")
            
            if result['missing_percentage'] > 50:
                print(f"   🚨 KRİTİK: Yarıdan fazla soru eksik!")
                print(f"   💡 Öneri: Otomatik çeviri araçları kullanın")
            elif result['missing_percentage'] > 20:
                print(f"   ⚠️ ÖNEM: Önemli miktarda soru eksik")
                print(f"   💡 Öneri: Öncelikli kategorileri çevirin")
            else:
                print(f"   ℹ️ BİLGİ: Küçük eksiklikler var")
                print(f"   💡 Öneri: Manuel çeviri yeterli")
            
            # En eksik kategorileri bul
            missing_categories = []
            for category in tr_stats.keys():
                tr_count = tr_stats[category]['total']
                
                # Çevrilmiş kategori adını kontrol et
                translated_categories = {
                    'en': {
                        'Coğrafya': 'Geography',
                        'Genel Kültür': 'General Knowledge',
                        'Tarih': 'History',
                        'Bilim': 'Science',
                        'Teknoloji': 'Technology',
                        'Spor': 'Sports',
                        'Müzik': 'Music',
                        'Edebiyat': 'Literature'
                    },
                    'de': {
                        'Coğrafya': 'Geographie',
                        'Genel Kültür': 'Allgemeinwissen',
                        'Tarih': 'Geschichte',
                        'Bilim': 'Wissenschaft',
                        'Teknoloji': 'Technologie',
                        'Spor': 'Sport',
                        'Müzik': 'Musik',
                        'Edebiyat': 'Literatur'
                    }
                }
                
                lang_count = result['stats'].get(category, {}).get('total', 0)
                translated_cat = translated_categories.get(lang_code, {}).get(category)
                if translated_cat and translated_cat in result['stats']:
                    lang_count = result['stats'][translated_cat]['total']
                
                if tr_count > lang_count:
                    missing_categories.append({
                        'category': category,
                        'missing': tr_count - lang_count,
                        'percentage': ((tr_count - lang_count) / tr_count) * 100
                    })
            
            missing_categories.sort(key=lambda x: x['missing'], reverse=True)
            
            print(f"   🎯 Öncelikli kategoriler:")
            for cat_info in missing_categories[:3]:
                print(f"      • {cat_info['category']}: {cat_info['missing']} eksik (%{cat_info['percentage']:.1f})")

def main():
    compare_multilang_questions()

if __name__ == "__main__":
    main()
