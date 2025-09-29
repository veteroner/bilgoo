const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'srkFHqCRnkoXbGcfBi9SDeC4tQMy85pA8ZizZ2rXITwHzwZrKuJCwUUW';

// Eksik dosyalar ve uygun arama terimleri
const MISSING_MAPPINGS = [
    { filename: 'chinese_flag.jpg', search: 'china flag' },
    { filename: 'istanbul_bosphorus.jpg', search: 'istanbul bosphorus bridge' },
    { filename: 'great_wall_china.jpg', search: 'great wall china' },
    { filename: 'ocean_pacific.jpg', search: 'pacific ocean' },
    { filename: 'nile_river.jpg', search: 'nile river egypt' },
    { filename: 'amazon_rainforest.jpg', search: 'amazon rainforest' },
    { filename: 'sahara_desert.jpg', search: 'sahara desert' },
    { filename: 'mount_everest.jpg', search: 'mount everest' },
    { filename: 'antarctica_landscape.jpg', search: 'antarctica landscape' },
    { filename: 'arctic_ocean.jpg', search: 'arctic ocean ice' },
    { filename: 'africa_continent.jpg', search: 'africa continent map' },
    { filename: 'russia_landscape.jpg', search: 'russia landscape' },
    { filename: 'whale_blue.jpg', search: 'blue whale ocean' },
    { filename: 'cheetah_running.jpg', search: 'cheetah running' },
    { filename: 'tokyo_cityscape.jpg', search: 'tokyo cityscape' },
    { filename: 'mongolia_landscape.jpg', search: 'mongolia landscape' },
    { filename: 'south_america.jpg', search: 'south america continent' },
    { filename: 'north_america.jpg', search: 'north america continent' },
    { filename: 'europe_continent.jpg', search: 'europe continent map' },
    { filename: 'asia_continent.jpg', search: 'asia continent map' },
    { filename: 'golf_scotland.jpg', search: 'golf course scotland' },
    { filename: 'music_rap_microphone.jpg', search: 'rap music microphone' },
    { filename: 'classical_orchestra.jpg', search: 'classical orchestra symphony' },
    { filename: 'turkish_ney_instrument.jpg', search: 'turkish ney instrument' }
];

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join('/Users/onerozbey/Desktop/quiz-oyunu/www/assets/images/questions', filename);
        const file = fs.createWriteStream(filePath);
        
        https.get(url, (response) => {
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

async function searchAndDownload(searchTerm, filename) {
    return new Promise((resolve, reject) => {
        const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchTerm)}&per_page=1&orientation=landscape`;
        
        const options = {
            headers: {
                'Authorization': API_KEY
            }
        };
        
        https.get(searchUrl, options, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', async () => {
                try {
                    const result = JSON.parse(data);
                    if (result.photos && result.photos.length > 0) {
                        const imageUrl = result.photos[0].src.large;
                        await downloadImage(imageUrl, filename);
                        resolve();
                    } else {
                        console.log(`❌ ${filename}: Resim bulunamadı`);
                        reject(new Error('No image found'));
                    }
                } catch (error) {
                    console.error(`❌ ${filename}: API hatası`, error);
                    reject(error);
                }
            });
        }).on('error', (error) => {
            console.error(`❌ ${filename}: İstek hatası`, error);
            reject(error);
        });
    });
}

async function downloadMissingBatch() {
    console.log('🚀 EKSİK DOSYALAR İNDİRİLİYOR...');
    console.log(`📊 Toplam: ${MISSING_MAPPINGS.length} dosya`);
    console.log('=' * 40);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const mapping of MISSING_MAPPINGS) {
        try {
            console.log(`🔍 ${mapping.filename}: "${mapping.search}" aranıyor...`);
            await searchAndDownload(mapping.search, mapping.filename);
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
    console.log(`📁 Toplam: ${MISSING_MAPPINGS.length}`);
}

downloadMissingBatch().catch(console.error);
