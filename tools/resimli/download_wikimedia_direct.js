const https = require('https');
const fs = require('fs');
const path = require('path');

// Wikimedia Commons direkt resim URL'leri
const WIKIMEDIA_DIRECT_MAPPINGS = [
    {
        filename: 'metin_oktay_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Metin_Oktay.jpg',
        description: 'Metin Oktay - gerçek fotoğraf'
    },
    {
        filename: 'presidential_flag_turkey.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Flag_of_the_President_of_Turkey.svg',
        description: 'Türkiye Cumhurbaşkanlığı forsu (SVG)'
    },
    {
        filename: 'michael_jackson_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/George_H._W._Bush_with_Michael_Jackson_%28cropped_2%29.png',
        description: 'Michael Jackson - gerçek fotoğraf'
    },
    {
        filename: 'mozart_portrait_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Wolfgang-amadeus-mozart_1.jpg',
        description: 'Wolfgang Amadeus Mozart - gerçek portre'
    },
    {
        filename: 'venus_planet_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Venus_globe.jpg',
        description: 'Venüs gezegeni - gerçek görüntü'
    },
    {
        filename: 'last_supper_davinci.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/The_Last_Supper%2C_after_Leonardo_da_Vinci_MET_DT2768.jpg/640px-The_Last_Supper%2C_after_Leonardo_da_Vinci_MET_DT2768.jpg',
        description: 'Son Akşam Yemeği - Leonardo da Vinci'
    }
];

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join('/Users/onerozbey/Desktop/quiz-oyunu/www/assets/images/questions', filename);
        const file = fs.createWriteStream(filePath);
        
        console.log(`🔗 İndiriliyor: ${url}`);
        
        https.get(url, (response) => {
            // Redirect kontrolü
            if (response.statusCode === 301 || response.statusCode === 302) {
                console.log(`🔄 Yönlendiriliyor: ${response.headers.location}`);
                return downloadImage(response.headers.location, filename)
                    .then(resolve)
                    .catch(reject);
            }
            
            if (response.statusCode !== 200) {
                console.error(`❌ HTTP ${response.statusCode}: ${filename}`);
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ ${filename} başarıyla indirildi`);
                resolve();
            });
            
            file.on('error', (error) => {
                console.error(`❌ Dosya yazma hatası ${filename}:`, error.message);
                reject(error);
            });
            
        }).on('error', (error) => {
            console.error(`❌ İstek hatası ${filename}:`, error.message);
            reject(error);
        });
    });
}

async function downloadWikimediaImages() {
    console.log('📚 WIKIMEDIA COMMONS\'DAN RESİMLER İNDİRİLİYOR...');
    console.log(`📊 Toplam: ${WIKIMEDIA_DIRECT_MAPPINGS.length} dosya`);
    console.log('=' * 50);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const mapping of WIKIMEDIA_DIRECT_MAPPINGS) {
        try {
            console.log(`\\n🎯 ${mapping.filename}: ${mapping.description}`);
            await downloadImage(mapping.url, mapping.filename);
            successCount++;
            
            // Rate limiting için bekle
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`❌ ${mapping.filename} hatası:`, error.message);
            errorCount++;
        }
    }
    
    console.log('\\n📊 ÖZET:');
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
    console.log(`📁 Toplam: ${WIKIMEDIA_DIRECT_MAPPINGS.length}`);
    
    if (successCount > 0) {
        console.log('\\n🚀 İndirilen dosyalar www/assets/images/questions/ klasöründe!');
    }
}

downloadWikimediaImages().catch(console.error);
