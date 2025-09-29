const https = require('https');
const fs = require('fs');
const path = require('path');

// Wikimedia Commons'dan JPG formatında doğru URL'ler
const WIKIMEDIA_MAPPINGS = [
    {
        filename: 'metin_oktay_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Metin_Oktay.jpg',
        description: 'Metin Oktay - gerçek fotoğraf'
    },
    {
        filename: 'presidential_flag_turkey.jpg', 
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Flag_of_the_President_of_Turkey.svg/512px-Flag_of_the_President_of_Turkey.svg.png',
        description: 'Türkiye Cumhurbaşkanlığı forsu'
    },
    {
        filename: 'michael_jackson_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Michael_Jackson_in_1988.jpg',
        description: 'Michael Jackson - 1988 fotoğraf'
    },
    {
        filename: 'mozart_portrait_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Croce-Mozart-Detail.jpg',
        description: 'Wolfgang Amadeus Mozart - portre'
    },
    {
        filename: 'venus_planet_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg',
        description: 'Venüs gezegeni - NASA görüntüsü'
    },
    {
        filename: 'last_supper_davinci.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg',
        description: 'Son Akşam Yemeği - Leonardo da Vinci'
    }
];

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join('/Users/onerozbey/Desktop/quiz-oyunu/www/assets/images/questions', filename);
        
        // Eski dosyayı sil
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        const file = fs.createWriteStream(filePath);
        
        const request = https.get(url, (response) => {
            // Redirect kontrolü
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadImage(response.headers.location, filename)
                    .then(resolve)
                    .catch(reject);
            }
            
            if (response.statusCode !== 200) {
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
                fs.unlink(filePath, () => {}); // Hatalı dosyayı sil
                reject(error);
            });
            
        }).on('error', (error) => {
            console.error(`❌ ${filename} indirme hatası:`, error.message);
            reject(error);
        });
        
        request.setTimeout(30000, () => {
            request.abort();
            reject(new Error('Timeout'));
        });
    });
}

async function downloadWikimediaImages() {
    console.log('📚 WİKİMEDİA COMMONS\'DAN YENİDEN İNDİRİLİYOR...');
    console.log(`📊 Toplam: ${WIKIMEDIA_MAPPINGS.length} dosya`);
    console.log('=' * 50);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const mapping of WIKIMEDIA_MAPPINGS) {
        try {
            console.log(`🔗 ${mapping.description}...`);
            await downloadImage(mapping.url, mapping.filename);
            successCount++;
            
            // Rate limiting için bekle
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`❌ ${mapping.filename} hatası:`, error.message);
            errorCount++;
            
            // Hata durumunda biraz daha bekle
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    console.log('\\n📊 ÖZET:');
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
    console.log(`📁 Toplam: ${WIKIMEDIA_MAPPINGS.length}`);
    
    if (successCount === WIKIMEDIA_MAPPINGS.length) {
        console.log('\\n🎉 Tüm dosyalar başarıyla indirildi!');
    }
}

downloadWikimediaImages().catch(console.error);
