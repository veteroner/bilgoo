const fs = require('fs');
const path = require('path');

// Batch 6 dosya eşleştirmeleri
const BATCH6_MAPPINGS = {
    'Q0460': 'cold_war_period.jpg',
    'Q0461': 'suleiman_magnificent.jpg',
    'Q0462': 'women_voting_rights.jpg',
    'Q0463': 'world_war_2.jpg',
    'Q0464': 'manzikert_battle.jpg',
    'Q0465': 'gallipoli_campaign.jpg',
    'Q0466': 'samsun_independence.jpg',
    'Q0467': 'sevres_treaty.jpg',
    'Q0468': 'berlin_wall_fall.jpg',
    'Q0541': 'nile_river_egypt.jpg',
    'Q0545': 'alaska_landscape.jpg',
    'Q0546': 'vesuvius_volcano.jpg',
    'Q0547': 'istanbul_city.jpg',
    'Q0548': 'cappadocia_chimneys.jpg',
    'Q0549': 'japan_country.jpg',
    'Q0550': 'turkey_regions.jpg',
    'Q0551': 'mount_ararat.jpg',
    'Q0552': 'mediterranean_sea.jpg',
    'Q0553': 'black_sea_coast.jpg',
    'Q0554': 'nile_longest_river.jpg'
};

function updateBatch6() {
    const filePath = '../../languages/tr/questions.json';
    
    console.log('📝 JSON dosyası okunuyor...');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let updateCount = 0;
    
    // Resimli Sorular kategorisindeki soruları güncelle
    if (data["Resimli Sorular"]) {
        data["Resimli Sorular"].forEach(question => {
            if (BATCH6_MAPPINGS[question.id]) {
                const oldUrl = question.imageUrl;
                question.imageUrl = `assets/images/questions/${BATCH6_MAPPINGS[question.id]}`;
                console.log(`✅ ${question.id}: ${oldUrl} → ${question.imageUrl}`);
                updateCount++;
            }
        });
    }
    
    console.log(`📝 JSON dosyası kaydediliyor... (${updateCount} güncelleme)`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    
    console.log('🎉 Batch 6 JSON güncellemesi tamamlandı!');
    return updateCount;
}

if (require.main === module) {
    updateBatch6();
}

module.exports = { updateBatch6 };
