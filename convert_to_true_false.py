#!/usr/bin/env python3
import json
import re

# Çalışmayan resim linkleri
broken_image_urls = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Bohr-atom-PAR.svg/800px-Bohr-atom-PAR.svg.png",
    "https://upload.wikimedia.org/wikipedia/en/5/55/Windows_1.0_screenshot.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Apple_II_IMG_4212.jpg/800px-Apple_II_IMG_4212.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Surface_Pro_4.png/800px-Surface_Pro_4.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/The_Dardanelles_Gun_Turkish_Bronze_15c.jpg/800px-The_Dardanelles_Gun_Turkish_Bronze_15c.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/The_First_Building_of_Turkish_Grand_National_Assembly.jpg/800px-The_First_Building_of_Turkish_Grand_National_Assembly.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Trenches_at_Lone_Pine_after_the_battle_August_1915_%28AWM_G00587%29.jpg/800px-Trenches_at_Lone_Pine_after_the_battle_August_1915_%28AWM_G00587%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Atat%C3%BCrk-October_29%2C_1923.jpg/800px-Atat%C3%BCrk-October_29%2C_1923.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Nile_River_and_delta_from_orbit.jpg/800px-Nile_River_and_delta_from_orbit.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Grand_Canyon_view_from_Pima_Point_2010.jpg/800px-Grand_Canyon_view_from_Pima_Point_2010.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Denali_Mt_McKinley.jpg/800px-Denali_Mt_McKinley.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Italy_-_Vesuvio_01.jpg/800px-Italy_-_Vesuvio_01.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Istanbul_panorama_and_skyline.jpg/800px-Istanbul_panorama_and_skyline.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Cappadocia_Ballon.jpg/800px-Cappadocia_Ballon.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_map_of_South_Korea.svg/800px-Flag_map_of_South_Korea.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Istanbul_-_Kanun.jpg/800px-Istanbul_-_Kanun.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Kemen%C3%A7e_%28Turkish_Instrument%29.jpg/800px-Kemen%C3%A7e_%28Turkish_Instrument%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Luciano_Pavarotti_%281984%29.jpg/800px-Luciano_Pavarotti_%281984%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Saz_bosnian_instrument.jpg/800px-Saz_bosnian_instrument.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dostoevsky_1872.jpg/800px-Dostoevsky_1872.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Portrait_of_Yunus_Emre_%281838%29.jpg/800px-Portrait_of_Yunus_Emre_%281838%29.jpg"
]

def convert_multiple_choice_to_true_false(question, correct_answer, choices):
    """Çoktan seçmeli soruyu doğru/yanlış formatına çevir"""
    
    # Doğru cevabı al
    correct_choice = choices[correct_answer]
    
    # Soru türüne göre doğru/yanlış ifadesi oluştur
    true_false_statements = []
    
    # Ana sorudan yola çıkarak doğru ifade oluştur
    if "hangi" in question.lower() or "hangisi" in question.lower():
        true_statement = f"{question.split('?')[0].replace('Hangi', '').replace('hangisi', '').replace('Aşağıdakilerden', '').strip()}: {correct_choice}"
    elif "kim" in question.lower():
        true_statement = f"{question.split('?')[0].replace('Kim', '').replace('kim', '').strip()}: {correct_choice}"
    elif "ne" in question.lower() and "zaman" in question.lower():
        true_statement = f"{question.split('?')[0].replace('Ne zaman', '').replace('ne zaman', '').strip()}: {correct_choice}"
    elif "kaç" in question.lower():
        true_statement = f"{question.split('?')[0].replace('Kaç', '').replace('kaç', '').strip()}: {correct_choice}"
    elif "nedir" in question.lower():
        true_statement = f"{question.split('?')[0].replace(' nedir', '').replace(' Nedir', '').strip()}: {correct_choice}"
    else:
        # Genel format
        true_statement = f"{question.split('?')[0].strip()}: {correct_choice}"
    
    # İfadeyi düzenle
    true_statement = true_statement.replace(': ', ' ').replace('  ', ' ').strip()
    if not true_statement.endswith('.'):
        true_statement += '.'
    
    return true_statement

def process_questions_file(file_path):
    """Sorular dosyasını işle ve kırık resimli soruları doğru/yanlış formatına çevir"""
    print(f"🔧 {file_path} dosyasını işliyorum...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
    except FileNotFoundError:
        print(f"❌ Dosya bulunamadı: {file_path}")
        return 0
    except json.JSONDecodeError:
        print(f"❌ JSON formatı hatalı: {file_path}")
        return 0
    
    converted_count = 0
    
    for category in data.get('categories', []):
        category_name = category.get('name', 'Bilinmeyen')
        questions = category.get('questions', [])
        
        for i, question_obj in enumerate(questions):
            image_url = question_obj.get('imageUrl', '')
            
            # Eğer bu soru kırık resim linkine sahipse
            if image_url in broken_image_urls:
                original_question = question_obj.get('question', '')
                choices = question_obj.get('choices', [])
                correct_answer = question_obj.get('correctAnswer', 0)
                
                print(f"   🔄 Dönüştürülüyor: {original_question[:50]}...")
                
                # Doğru/yanlış ifadesi oluştur
                true_statement = convert_multiple_choice_to_true_false(original_question, correct_answer, choices)
                
                # Soruyu güncelle
                question_obj['question'] = true_statement
                question_obj['type'] = 'truefalse'
                question_obj['correctAnswer'] = True  # Doğru ifade olduğu için True
                question_obj['choices'] = ['Doğru', 'Yanlış']
                
                # Resim linkini kaldır
                if 'imageUrl' in question_obj:
                    del question_obj['imageUrl']
                
                converted_count += 1
                print(f"      ✅ Yeni soru: {true_statement[:50]}...")
    
    # Dosyayı kaydet
    if converted_count > 0:
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=2)
        print(f"   🎉 {converted_count} soru dönüştürüldü!")
    else:
        print(f"   ℹ️  Dönüştürülecek soru bulunamadı.")
    
    return converted_count

# Ana işlem
print("🔄 Kırık resimli soruları doğru/yanlış formatına çeviriyorum...")
print("=" * 60)

total_converted = 0
total_converted += process_questions_file('languages/tr/questions.json')
total_converted += process_questions_file('www/languages/tr/questions.json')

print("\n" + "=" * 60)
print(f"🎉 Toplam {total_converted} soru doğru/yanlış formatına çevrildi!")
print("✅ İşlem tamamlandı!")

if total_converted > 0:
    print("\nℹ️  Çevrilen sorular artık:")
    print("  • Resim gerektirmiyor")
    print("  • Doğru/Yanlış formatında")
    print("  • 'Doğru' seçeneği doğru cevap") 