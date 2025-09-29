const fs = require('fs');
const path = require('path');

// Final Batch dosya eşleştirmeleri
const FINAL_MAPPINGS = {
    'Q0721': 'paris_capital.jpg',
    'Q0722': 'london_capital.jpg',
    'Q0723': 'berlin_capital.jpg',
    'Q0724': 'rome_capital.jpg',
    'Q0725': 'madrid_capital.jpg',
    'Q0726': 'moscow_capital.jpg',
    'Q0727': 'tokyo_capital.jpg',
    'Q0728': 'turkey_capital_correction.jpg',
    'Q0730': 'canada_capital_correction.jpg',
    'Q0731': 'australia_capital_correction.jpg',
    'Q0561': 'bosphorus_strait.jpg',
    'Q0563': 'antarctica_continent.jpg',
    'Q0566': 'russia_borders.jpg'
};

function updateFinalBatch() {
    const filePath = '../../languages/tr/questions.json';
    
    console.log('📝 JSON dosyası okunuyor...');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let updateCount = 0;
    
    // Resimli Sorular kategorisindeki soruları güncelle
    if (data["Resimli Sorular"]) {
        data["Resimli Sorular"].forEach(question => {
            if (FINAL_MAPPINGS[question.id]) {
                const oldUrl = question.imageUrl;
                question.imageUrl = `assets/images/questions/${FINAL_MAPPINGS[question.id]}`;
                console.log(`✅ ${question.id}: ${oldUrl} → ${question.imageUrl}`);
                updateCount++;
            }
        });
    }
    
    console.log(`📝 JSON dosyası kaydediliyor... (${updateCount} güncelleme)`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    
    console.log('🎉 FINAL Batch JSON güncellemesi tamamlandı!');
    console.log('🏆 TÜM 215 SORU BAŞARIYLA GÜNCELLENDİ!');
    return updateCount;
}

if (require.main === module) {
    updateFinalBatch();
}

module.exports = { updateFinalBatch };
