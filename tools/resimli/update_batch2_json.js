const fs = require('fs');
const path = require('path');

// Batch 2 dosya eşleştirmeleri
const BATCH2_MAPPINGS = {
    'Q0083': 'golf_scotland.jpg',
    'Q0173': 'atom_nucleus.jpg',
    'Q0174': 'jupiter_planet.jpg',
    'Q0175': 'mars_planet.jpg',
    'Q0176': 'mammal_animal.jpg',
    'Q0177': 'human_skin.jpg',
    'Q0178': 'dna_genetics.jpg',
    'Q0179': 'magnetic_north.jpg',
    'Q0180': 'jaw_muscle.jpg',
    'Q0181': 'spider_venomous.jpg',
    'Q0182': 'blue_whale_heart.jpg',
    'Q0183': 'space_fire.jpg',
    'Q0184': 'earth_core.jpg',
    'Q0185': 'shark_immunity.jpg',
    'Q0186': 'light_speed.jpg',
    'Q0187': 'venus_planet.jpg',
    'Q0188': 'bat_echolocation.jpg',
    'Q0189': 'brain_sleep.jpg',
    'Q0190': 'ostrich_myth.jpg',
    'Q1148': 'earth_core_iron.jpg'
};

function updateBatch2() {
    const filePath = '../../languages/tr/questions.json';
    
    console.log('📝 JSON dosyası okunuyor...');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let updateCount = 0;
    
    // Resimli Sorular kategorisindeki soruları güncelle
    if (data["Resimli Sorular"]) {
        data["Resimli Sorular"].forEach(question => {
            if (BATCH2_MAPPINGS[question.id]) {
                const oldUrl = question.imageUrl;
                question.imageUrl = `assets/images/questions/${BATCH2_MAPPINGS[question.id]}`;
                console.log(`✅ ${question.id}: ${oldUrl} → ${question.imageUrl}`);
                updateCount++;
            }
        });
    }
    
    console.log(`📝 JSON dosyası kaydediliyor... (${updateCount} güncelleme)`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    
    console.log('🎉 Batch 2 JSON güncellemesi tamamlandı!');
    return updateCount;
}

if (require.main === module) {
    updateBatch2();
}

module.exports = { updateBatch2 };
