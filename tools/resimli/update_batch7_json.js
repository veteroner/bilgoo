const fs = require('fs');
const path = require('path');

// Batch 7 dosya eşleştirmeleri
const BATCH7_MAPPINGS = {
    'Q0555': 'amazon_river_wide.jpg',
    'Q0556': 'everest_highest.jpg',
    'Q0557': 'australia_continent.jpg',
    'Q0558': 'sahara_largest_desert.jpg',
    'Q0559': 'mariana_trench.jpg',
    'Q0560': 'turkey_neighbors.jpg',
    'Q0564': 'turkey_salt_lake.jpg',
    'Q0565': 'pacific_ocean_largest.jpg',
    'Q0567': 'turkey_provinces.jpg',
    'Q0708': 'turkey_flag.jpg',
    'Q0709': 'germany_flag.jpg',
    'Q0710': 'france_flag.jpg',
    'Q0711': 'uk_flag.jpg',
    'Q0712': 'italy_flag.jpg',
    'Q0713': 'spain_flag.jpg',
    'Q0714': 'russia_flag.jpg',
    'Q0715': 'china_flag.jpg',
    'Q0716': 'japan_flag.jpg',
    'Q0717': 'south_korea_flag.jpg',
    'Q0720': 'ankara_capital.jpg'
};

function updateBatch7() {
    const filePath = '../../languages/tr/questions.json';
    
    console.log('📝 JSON dosyası okunuyor...');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let updateCount = 0;
    
    // Resimli Sorular kategorisindeki soruları güncelle
    if (data["Resimli Sorular"]) {
        data["Resimli Sorular"].forEach(question => {
            if (BATCH7_MAPPINGS[question.id]) {
                const oldUrl = question.imageUrl;
                question.imageUrl = `assets/images/questions/${BATCH7_MAPPINGS[question.id]}`;
                console.log(`✅ ${question.id}: ${oldUrl} → ${question.imageUrl}`);
                updateCount++;
            }
        });
    }
    
    console.log(`📝 JSON dosyası kaydediliyor... (${updateCount} güncelleme)`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    
    console.log('🎉 Batch 7 JSON güncellemesi tamamlandı!');
    return updateCount;
}

if (require.main === module) {
    updateBatch7();
}

module.exports = { updateBatch7 };
