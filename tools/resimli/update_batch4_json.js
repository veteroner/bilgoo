const fs = require('fs');
const path = require('path');

// Batch 4 dosya eşleştirmeleri
const BATCH4_MAPPINGS = {
    'Q0283': 'www_web.jpg',
    'Q0284': 'first_mobile_phone.jpg',
    'Q1153': 'internet_history.jpg',
    'Q1154': 'computer_virus.jpg',
    'Q0352': 'camp_nou_stadium.jpg',
    'Q0353': 'cristiano_ronaldo.jpg',
    'Q0354': 'vodafone_park.jpg',
    'Q0355': 'galatasaray_legend.jpg',
    'Q0356': 'basketball_court.jpg',
    'Q0357': 'marathon_race.jpg',
    'Q0358': 'nba_basketball.jpg',
    'Q0359': 'football_goalkeeper.jpg',
    'Q0360': 'formula1_racing.jpg',
    'Q0361': 'tennis_sport.jpg',
    'Q0362': 'volleyball_olympic.jpg',
    'Q0363': 'basketball_hoop.jpg',
    'Q0364': 'fifa_football.jpg',
    'Q0365': 'football_substitution.jpg',
    'Q0366': 'oil_wrestling.jpg',
    'Q0367': 'women_tennis.jpg'
};

function updateBatch4() {
    const filePath = '../../languages/tr/questions.json';
    
    console.log('📝 JSON dosyası okunuyor...');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let updateCount = 0;
    
    // Resimli Sorular kategorisindeki soruları güncelle
    if (data["Resimli Sorular"]) {
        data["Resimli Sorular"].forEach(question => {
            if (BATCH4_MAPPINGS[question.id]) {
                const oldUrl = question.imageUrl;
                question.imageUrl = `assets/images/questions/${BATCH4_MAPPINGS[question.id]}`;
                console.log(`✅ ${question.id}: ${oldUrl} → ${question.imageUrl}`);
                updateCount++;
            }
        });
    }
    
    console.log(`📝 JSON dosyası kaydediliyor... (${updateCount} güncelleme)`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    
    console.log('🎉 Batch 4 JSON güncellemesi tamamlandı!');
    return updateCount;
}

if (require.main === module) {
    updateBatch4();
}

module.exports = { updateBatch4 };
