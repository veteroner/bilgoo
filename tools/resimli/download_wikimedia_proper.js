const https = require('https');
const fs = require('fs');
const path = require('path');

// Wikimedia Commons direkt indirme linkleri (güncellenmiş)
const WIKIMEDIA_MAPPINGS = [
    {
        filename: 'metin_oktay_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Metin_Oktay.jpg',
        description: 'Metin Oktay - gerçek fotoğraf'
    },
    {
        filename: 'presidential_flag_turkey.png',
        url: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Flag_of_the_President_of_Turkey.svg',
        description: 'Türkiye Cumhurbaşkanlığı forsu'
    },
    {
        filename: 'michael_jackson_real.png',
        url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Michael_Jackson_in_1988.jpg',
        description: 'Michael Jackson - gerçek fotoğraf'
    },
    {
        filename: 'mozart_portrait_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Croce-Mozart-Detail.jpg',
        description: 'Wolfgang Amadeus Mozart - gerçek portre'
    },
    {
        filename: 'venus_planet_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg',
        description: 'Venüs gezegeni - gerçek görüntü'
    },
    {
        filename: 'last_supper_davinci.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/1/11/The_Last_Supper%2C_after_Leonardo_da_Vinci_MET_DT2768.jpg',
        description: 'Son Akşam Yemeği - Leonardo da Vinci'
    }
];

async function downloadFromWikimedia(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join('/Users/onerozbey/Desktop/quiz-oyunu/www/assets/images/questions', filename);
        const file = fs.createWriteStream(filePath);
        
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        };
        
        const request = https.get(url, options, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
                file.close();
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                console.log(`🔄 Redirect: ${response.headers.location}`);
                return downloadFromWikimedia(response.headers.location, filename)
                    .then(resolve)
                    .catch(reject);
            }
            
            if (response.statusCode !== 200) {
                file.close();
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                return;
            }
            
            console.log(`📦 İndiriliyor: ${filename} (${response.headers['content-length']} bytes)`);
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`✅ ${filename} başarıyla indirildi`);
                resolve();
            });
            
            file.on('error', (error) => {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                reject(error);
            });
            
        });
        
        request.on('error', (error) => {
            file.close();
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            reject(error);
        });
        
        request.setTimeout(30000, () => {
            request.destroy();
            file.close();
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            reject(new Error('Request timeout'));
        });
    });
}

async function downloadAllWikimediaImages() {
    console.log('🏛️ WIKIMEDIA COMMONS\'DAN RESİMLER İNDİRİLİYOR...');
    console.log(`📊 Toplam: ${WIKIMEDIA_MAPPINGS.length} dosya`);
    console.log('=' + '='.repeat(50));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [index, mapping] of WIKIMEDIA_MAPPINGS.entries()) {
        try {
            console.log(`\\n[${index + 1}/${WIKIMEDIA_MAPPINGS.length}] 🔗 ${mapping.description}`);
            console.log(`📁 Dosya: ${mapping.filename}`);
            console.log(`🌐 URL: ${mapping.url}`);
            
            await downloadFromWikimedia(mapping.url, mapping.filename);
            successCount++;
            
            // Rate limiting
            if (index < WIKIMEDIA_MAPPINGS.length - 1) {
                console.log('⏳ 2 saniye bekleniyor...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
        } catch (error) {
            console.error(`❌ ${mapping.filename} HATASI: ${error.message}`);
            errorCount++;
        }
    }
    
    console.log('\\n' + '='.repeat(50));
    console.log('📊 İNDİRME ÖZETİ:');
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
    console.log(`📁 Toplam: ${WIKIMEDIA_MAPPINGS.length}`);
    
    if (successCount === WIKIMEDIA_MAPPINGS.length) {
        console.log('\\n🎉 TÜM WIKIMEDIA RESİMLERİ BAŞARIYLA İNDİRİLDİ!');
    } else if (successCount > 0) {
        console.log(`\\n🔄 ${successCount} resim indirildi, ${errorCount} resim başarısız.`);
    } else {
        console.log('\\n💡 Alternatif çözüm: Resimleri manuel olarak indirip klasöre koyabiliriz.');
    }
}

downloadAllWikimediaImages().catch(console.error);
