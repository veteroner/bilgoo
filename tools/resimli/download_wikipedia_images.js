const https = require('https');
const fs = require('fs');
const path = require('path');

// Wikipedia Commons'dan manuel olarak seçilmiş resim URL'leri
const WIKIPEDIA_MAPPINGS = [
    {
        filename: 'metin_oktay_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Metin_Oktay.jpg/300px-Metin_Oktay.jpg',
        description: 'Metin Oktay - gerçek fotoğraf'
    },
    {
        filename: 'presidential_flag_turkey.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Flag_of_the_President_of_Turkey.svg/320px-Flag_of_the_President_of_Turkey.svg.png',
        description: 'Türkiye Cumhurbaşkanlığı forsu'
    },
    {
        filename: 'michael_jackson_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Michael_Jackson_in_1988.jpg/274px-Michael_Jackson_in_1988.jpg',
        description: 'Michael Jackson - gerçek fotoğraf'
    },
    {
        filename: 'mozart_portrait_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Croce-Mozart-Detail.jpg/274px-Croce-Mozart-Detail.jpg',
        description: 'Wolfgang Amadeus Mozart - gerçek portre'
    },
    {
        filename: 'venus_planet_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/274px-Venus-real_color.jpg',
        description: 'Venüs gezegeni - gerçek görüntü'
    },
    {
        filename: 'last_supper_davinci.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg/640px-%C3%9Altima_Cena_-_Da_Vinci_5.jpg',
        description: 'Son Akşam Yemeği - Leonardo da Vinci'
    }
];

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join('/Users/onerozbey/Desktop/quiz-oyunu/www/assets/images/questions', filename);
        const file = fs.createWriteStream(filePath);
        
        https.get(url, (response) => {
            // Wikipedia redirects'i takip et
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadImage(response.headers.location, filename)
                    .then(resolve)
                    .catch(reject);
            }
            
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ ${filename} indirildi`);
                resolve();
            });
        }).on('error', (error) => {
            console.error(`❌ ${filename} indirilemedi:`, error.message);
            reject(error);
        });
    });
}

async function downloadWikipediaImages() {
    console.log('📚 WIKIPEDIA\'DAN RESİMLER İNDİRİLİYOR...');
    console.log(`📊 Toplam: ${WIKIPEDIA_MAPPINGS.length} dosya`);
    console.log('=' * 50);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const mapping of WIKIPEDIA_MAPPINGS) {
        try {
            console.log(`🔗 ${mapping.filename}: ${mapping.description}`);
            await downloadImage(mapping.url, mapping.filename);
            successCount++;
            
            // Rate limiting için bekle
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`❌ ${mapping.filename} hatası:`, error.message);
            errorCount++;
        }
    }
    
    console.log('\\n📊 ÖZET:');
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
    console.log(`📁 Toplam: ${WIKIPEDIA_MAPPINGS.length}`);
}

downloadWikipediaImages().catch(console.error);
