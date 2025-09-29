const fs = require('fs');
const path = require('path');

// Batch 3 dosya eşleştirmeleri
const BATCH3_MAPPINGS = {
    'Q1149': 'saturn_planet.jpg',
    'Q1150': 'vitamin_d_sunlight.jpg',
    'Q0265': 'first_iphone.jpg',
    'Q0266': 'windows_os.jpg',
    'Q0267': 'apple_ii_computer.jpg',
    'Q0268': 'microsoft_computer.jpg',
    'Q0269': 'png_file_format.jpg',
    'Q0270': 'html_code.jpg',
    'Q0271': 'python_programming.jpg',
    'Q0272': 'artificial_intelligence.jpg',
    'Q0273': 'wifi_wireless.jpg',
    'Q0274': 'blockchain_technology.jpg',
    'Q0275': 'ram_memory.jpg',
    'Q0276': 'google_company.jpg',
    'Q0277': 'ssd_drive.jpg',
    'Q0278': 'hard_disk_drive.jpg',
    'Q0279': 'https_security.jpg',
    'Q0280': 'android_os.jpg',
    'Q0281': 'keyboard_function_keys.jpg',
    'Q0282': 'adobe_photoshop.jpg'
};

function updateBatch3() {
    const filePath = '../../languages/tr/questions.json';
    
    console.log('📝 JSON dosyası okunuyor...');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let updateCount = 0;
    
    // Resimli Sorular kategorisindeki soruları güncelle
    if (data["Resimli Sorular"]) {
        data["Resimli Sorular"].forEach(question => {
            if (BATCH3_MAPPINGS[question.id]) {
                const oldUrl = question.imageUrl;
                question.imageUrl = `assets/images/questions/${BATCH3_MAPPINGS[question.id]}`;
                console.log(`✅ ${question.id}: ${oldUrl} → ${question.imageUrl}`);
                updateCount++;
            }
        });
    }
    
    console.log(`📝 JSON dosyası kaydediliyor... (${updateCount} güncelleme)`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    
    console.log('🎉 Batch 3 JSON güncellemesi tamamlandı!');
    return updateCount;
}

if (require.main === module) {
    updateBatch3();
}

module.exports = { updateBatch3 };
