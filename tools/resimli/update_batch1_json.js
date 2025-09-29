const fs = require('fs');
const path = require('path');

// Batch 1 dosya eşleştirmeleri
const BATCH1_MAPPINGS = {
    'Q0054': 'chinese_flag.jpg',
    'Q0055': 'istanbul_bosphorus.jpg', 
    'Q0056': 'great_wall_china.jpg',
    'Q0057': 'ocean_pacific.jpg',
    'Q0058': 'nile_river.jpg',
    'Q0059': 'amazon_rainforest.jpg',
    'Q0060': 'sahara_desert.jpg',
    'Q0061': 'mount_everest.jpg',
    'Q0062': 'antarctica_landscape.jpg',
    'Q0063': 'arctic_ocean.jpg',
    'Q0064': 'africa_continent.jpg',
    'Q0065': 'russia_landscape.jpg',
    'Q0066': 'whale_blue.jpg',
    'Q0067': 'cheetah_running.jpg',
    'Q0068': 'tokyo_cityscape.jpg',
    'Q0069': 'mongolia_landscape.jpg',
    'Q0070': 'south_america.jpg',
    'Q0071': 'north_america.jpg',
    'Q0072': 'europe_continent.jpg',
    'Q0073': 'asia_continent.jpg'
};

function updateBatch1() {
    const filePath = '../../languages/tr/questions.json';
    
    console.log('📝 JSON dosyası okunuyor...');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let updateCount = 0;
    
    // Resimli Sorular kategorisindeki soruları güncelle
    if (data["Resimli Sorular"]) {
        data["Resimli Sorular"].forEach(question => {
            if (BATCH1_MAPPINGS[question.id]) {
                const oldUrl = question.imageUrl;
                question.imageUrl = `assets/images/questions/${BATCH1_MAPPINGS[question.id]}`;
                console.log(`✅ ${question.id}: ${oldUrl} → ${question.imageUrl}`);
                updateCount++;
            }
        });
    }
    
    console.log(`📝 JSON dosyası kaydediliyor... (${updateCount} güncelleme)`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    
    console.log('🎉 Batch 1 JSON güncellemesi tamamlandı!');
    return updateCount;
}

if (require.main === module) {
    updateBatch1();
}

module.exports = { updateBatch1 };
