const https = require('https');
const fs = require('fs');
const path = require('path');

// Wikimedia Commons direkt indirme linkleri
const WIKIMEDIA_DIRECT_MAPPINGS = [
    {
        filename: 'metin_oktay_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Metin_Oktay.jpg',
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
        url: 'https://upload.wikimedia.org/wikipedia/commons/1/11/The_Last_Supper%2C_after_Leonardo_da_Vinci_MET_DT2768.jpg',
        description: 'Son Akşam Yemeği - Leonardo da Vinci'
    }
];

async function downloadImageWithRedirects(url, filename, maxRedirects = 5) {
    return new Promise((resolve, reject) => {
        const filePath = path.join('/Users/onerozbey/Desktop/quiz-oyunu/www/assets/images/questions', filename);
        
        function makeRequest(currentUrl, redirectCount) {
            if (redirectCount > maxRedirects) {
                reject(new Error('Too many redirects'));
                return;
            }
            
            const file = fs.createWriteStream(filePath);
            
            https.get(currentUrl, (response) => {
                // Handle redirects
                if (response.statusCode === 301 || response.statusCode === 302) {
                    file.close();
                    fs.unlinkSync(filePath); // Clean up empty file
                    console.log(`🔄 Redirect ${redirectCount + 1}: ${response.headers.location}`);
                    return makeRequest(response.headers.location, redirectCount + 1);
                }
                
                if (response.statusCode !== 200) {
                    file.close();
                    fs.unlinkSync(filePath); // Clean up empty file
                    reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                    return;
                }
                
                response.pipe(file);
                
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ ${filename} başarıyla indirildi`);
                    resolve();
                });
                
                file.on('error', (error) => {
                    fs.unlinkSync(filePath); // Clean up on error
                    reject(error);
                });
                
            }).on('error', (error) => {
                file.close();
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // Clean up on error
                }
                reject(error);
            });
        }
        
        makeRequest(url, 0);
    });
}

async function downloadWikimediaImages() {
    console.log('📚 WIKIMEDIA COMMONS\'DAN RESİMLER İNDİRİLİYOR...');
    console.log(`📊 Toplam: ${WIKIMEDIA_DIRECT_MAPPINGS.length} dosya`);
    console.log('=' + '='.repeat(50));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const mapping of WIKIMEDIA_DIRECT_MAPPINGS) {
        try {
            console.log(`🔗 ${mapping.filename}: ${mapping.description}`);
            console.log(`   URL: ${mapping.url}`);
            await downloadImageWithRedirects(mapping.url, mapping.filename);
            successCount++;
            
            // Rate limiting için bekle
            await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
            console.error(`❌ ${mapping.filename} hatası:`, error.message);
            errorCount++;
        }
    }
    
    console.log('\\n📊 ÖZET:');
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
    console.log(`📁 Toplam: ${WIKIMEDIA_DIRECT_MAPPINGS.length}`);
    
    if (successCount === WIKIMEDIA_DIRECT_MAPPINGS.length) {
        console.log('\\n🎉 TÜM RESİMLER BAŞARIYLA İNDİRİLDİ!');
    } else {
        console.log('\\n⚠️ Bazı resimler indirilemedi.');
    }
}

downloadWikimediaImages().catch(console.error);
