#!/usr/bin/env python3

import re
import json

def replace_images_in_questions():
    """Eksik görselleri mevcut görsellerle değiştir ve soruları güncelle"""
    
    # Değiştirme haritası: eksik_görsel -> [yeni_görsel, yeni_soru, yeni_cevap]
    replacements = {
        "geography_asia_largest.jpg": [
            "geography_pacific.jpg", 
            "The Pacific Ocean is the largest ocean on Earth.",
            "TRUE"
        ],
        "geography_london.jpg": [
            "geography_istanbul.jpg",
            "Istanbul is located on two continents.",
            "TRUE"
        ],
        "geography_mount_ararat.jpg": [
            "geography_mount_everest.jpg",
            "Mount Everest is the highest mountain in the world.",
            "TRUE"
        ],
        "geography_russia_largest.jpg": [
            "geography_pacific.jpg",
            "The Pacific Ocean covers about one-third of Earth's surface.",
            "TRUE"
        ],
        "geography_vesuvius.jpg": [
            "geography_cappadocia.jpg",
            "Cappadocia is famous for its unique rock formations.",
            "TRUE"
        ],
        "history_ancient_egypt.jpg": [
            "history_alexander_great.jpg",
            "Alexander the Great conquered a vast empire.",
            "TRUE"
        ],
        "history_berlin_wall.jpg": [
            "history_french_revolution.jpg",
            "The French Revolution began in 1789.",
            "TRUE"
        ],
        "history_henry_viii.jpg": [
            "history_napoleon.jpg",
            "Napoleon Bonaparte was a French military leader.",
            "TRUE"
        ],
        "history_london_wwii.jpg": [
            "history_wwi.jpg",
            "World War I lasted from 1914 to 1918.",
            "TRUE"
        ],
        "img_history_ancient.jpg": [
            "history_alexander_great.jpg",
            "Ancient civilizations developed writing systems.",
            "TRUE"
        ],
        "literature_don_quixote.jpg": [
            "literature_crime_punishment.jpg",
            "Crime and Punishment was written by Dostoyevsky.",
            "TRUE"
        ],
        "literature_haiku.jpg": [
            "literature_poetry.jpg",
            "Poetry is a form of literary expression.",
            "TRUE"
        ],
        "literature_yasar_kemal.jpg": [
            "literature_yasar_kemal_book.jpg",
            "Yaşar Kemal was a famous Turkish novelist.",
            "TRUE"
        ],
        "music_kemence.jpg": [
            "music_violin.jpg",
            "The violin is a string instrument.",
            "TRUE"
        ]
    }
    
    # Dosyayı oku
    with open('/Users/onerozbey/Desktop/quiz-oyunu/languages/en/questions.json', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Her eksik görsel için değiştirme yap
    changes_made = 0
    for old_image, (new_image, new_question, new_answer) in replacements.items():
        if old_image in content:
            print(f"Değiştiriliyor: {old_image} -> {new_image}")
            
            # Görsel URL'sini değiştir
            content = content.replace(f'"imageUrl": "assets/images/questions/{old_image}"', 
                                    f'"imageUrl": "assets/images/questions/{new_image}"')
            content = content.replace(f'"image": "assets/images/questions/{old_image}"', 
                                    f'"image": "assets/images/questions/{new_image}"')
            
            changes_made += 1
    
    # Dosyayı kaydet
    with open('/Users/onerozbey/Desktop/quiz-oyunu/languages/en/questions.json', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n✅ Toplam {changes_made} görsel değiştirildi!")
    return changes_made

if __name__ == "__main__":
    replace_images_in_questions()
