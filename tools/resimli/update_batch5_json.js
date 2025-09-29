const fs = require('fs');
const path = require('path');

// Batch 5 dosya eşleştirmeleri
const BATCH5_MAPPINGS = {
    'Q0369': 'water_polo_sport.jpg',
    'Q0370': 'boxing_match.jpg',
    'Q0371': 'weightlifting_sport.jpg',
    'Q1151': 'olympic_games.jpg',
    'Q1152': 'football_penalty.jpg',
    'Q0445': 'ataturk_portrait.jpg',
    'Q0446': 'istanbul_conquest.jpg',
    'Q0447': 'tbmm_building.jpg',
    'Q0448': 'turkish_anthem.jpg',
    'Q0449': 'gallipoli_battle.jpg',
    'Q0450': 'republic_proclamation.jpg',
    'Q0451': 'ephesus_ruins.jpg',
    'Q0452': 'turkish_president.jpg',
    'Q0453': 'world_war_1.jpg',
    'Q0454': 'ottoman_founder.jpg',
    'Q0455': 'fatih_sultan.jpg',
    'Q0456': 'independence_war.jpg',
    'Q0457': 'parliament_opening.jpg',
    'Q0458': 'lausanne_treaty.jpg',
    'Q0459': 'alphabet_reform.jpg'
};

function updateBatch5() {
    const filePath = '../../languages/tr/questions.json';
    
    console.log('📝 JSON dosyası okunuyor...');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let updateCount = 0;
    
    // Resimli Sorular kategorisindeki soruları güncelle
    if (data["Resimli Sorular"]) {
        data["Resimli Sorular"].forEach(question => {
            if (BATCH5_MAPPINGS[question.id]) {
                const oldUrl = question.imageUrl;
                question.imageUrl = `assets/images/questions/${BATCH5_MAPPINGS[question.id]}`;
                console.log(`✅ ${question.id}: ${oldUrl} → ${question.imageUrl}`);
                updateCount++;
            }
        });
    }
    
    console.log(`📝 JSON dosyası kaydediliyor... (${updateCount} güncelleme)`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    
    console.log('🎉 Batch 5 JSON güncellemesi tamamlandı!');
    return updateCount;
}

if (require.main === module) {
    updateBatch5();
}

module.exports = { updateBatch5 };
