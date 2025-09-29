const fs = require('fs');
const path = require('path');
const https = require('https');

// Pexels API Key
const PEXELS_API_KEY = 'srkFHqCRnkoXbGcfBi9SDeC4tQMy85pA8ZizZ2rXITwHzwZrKuJCwUUW';

// Manuel olarak belirlenmiş soru-resim eşleştirmeleri (Batch 7)
const MANUAL_MAPPINGS_7 = {
    'Q0555': { // Amazon Nehri
        search: 'Amazon River Brazil flowing wide',
        filename: 'amazon_river_wide.jpg'
    },
    'Q0556': { // Everest dağı
        search: 'Mount Everest highest mountain peak',
        filename: 'everest_highest.jpg'
    },
    'Q0557': { // Avustralya
        search: 'Australia continent country map',
        filename: 'australia_continent.jpg'
    },
    'Q0558': { // Sahara Çölü
        search: 'Sahara Desert largest sand dunes',
        filename: 'sahara_largest_desert.jpg'
    },
    'Q0559': { // Mariana Çukuru
        search: 'Mariana Trench deepest ocean point',
        filename: 'mariana_trench.jpg'
    },
    'Q0560': { // Türkiye komşuları
        search: 'Turkey neighboring countries map',
        filename: 'turkey_neighbors.jpg'
    },
    'Q0564': { // Tuz Gölü
        search: 'Salt Lake Turkey largest lake',
        filename: 'turkey_salt_lake.jpg'
    },
    'Q0565': { // Pasifik Okyanusu
        search: 'Pacific Ocean largest world blue',
        filename: 'pacific_ocean_largest.jpg'
    },
    'Q0567': { // Türkiye 81 il
        search: 'Turkey provinces administrative map',
        filename: 'turkey_provinces.jpg'
    },
    'Q0708': { // Türkiye bayrağı
        search: 'Turkey flag red crescent star',
        filename: 'turkey_flag.jpg'
    },
    'Q0709': { // Almanya bayrağı
        search: 'Germany flag black red yellow',
        filename: 'germany_flag.jpg'
    },
    'Q0710': { // Fransa bayrağı
        search: 'France flag blue white red',
        filename: 'france_flag.jpg'
    },
    'Q0711': { // İngiltere bayrağı
        search: 'United Kingdom flag Union Jack',
        filename: 'uk_flag.jpg'
    },
    'Q0712': { // İtalya bayrağı
        search: 'Italy flag green white red',
        filename: 'italy_flag.jpg'
    },
    'Q0713': { // İspanya bayrağı
        search: 'Spain flag red yellow coat arms',
        filename: 'spain_flag.jpg'
    },
    'Q0714': { // Rusya bayrağı
        search: 'Russia flag white blue red',
        filename: 'russia_flag.jpg'
    },
    'Q0715': { // Çin bayrağı
        search: 'China flag red five stars',
        filename: 'china_flag.jpg'
    },
    'Q0716': { // Japonya bayrağı
        search: 'Japan flag white red circle',
        filename: 'japan_flag.jpg'
    },
    'Q0717': { // Güney Kore bayrağı
        search: 'South Korea flag Taegukgi symbols',
        filename: 'south_korea_flag.jpg'
    },
    'Q0720': { // Ankara başkent
        search: 'Ankara Turkey capital city buildings',
        filename: 'ankara_capital.jpg'
    }
};

// Pexels API'den resim arama
async function searchPexelsImage(query, questionId) {
    return new Promise((resolve, reject) => {
        console.log(`🔍 Aranıyor: "${query}" (${questionId})`);
        
        const options = {
            hostname: 'api.pexels.com',
            path: `/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
            method: 'GET',
            headers: {
                'Authorization': PEXELS_API_KEY
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.photos && result.photos.length > 0) {
                        const photo = result.photos[0];
                        const imageUrl = photo.src.medium;
                        console.log(`✅ Resim bulundu: ${imageUrl}`);
                        resolve(imageUrl);
                    } else {
                        console.log(`❌ "${query}" için resim bulunamadı`);
                        reject(new Error('Resim bulunamadı'));
                    }
                } catch (error) {
                    console.log(`❌ API hatası: ${error.message}`);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.log(`❌ Ağ hatası: ${error.message}`);
            reject(error);
        });

        req.end();
    });
}

// Resmi indirme
async function downloadImage(imageUrl, outputPath) {
    return new Promise((resolve, reject) => {
        console.log(`📥 İndiriliyor: ${path.basename(outputPath)}`);
        
        const file = fs.createWriteStream(outputPath);
        
        https.get(imageUrl, (response) => {
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`✅ İndirildi: ${outputPath}`);
                resolve();
            });
            
            file.on('error', (error) => {
                fs.unlink(outputPath, () => {});
                reject(error);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

// Ana fonksiyon
async function downloadBatch7() {
    console.log('🎯 7. Batch resim indirme başlıyor...\n');
    
    const outputDir = '../../www/assets/images/questions';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [questionId, mapping] of Object.entries(MANUAL_MAPPINGS_7)) {
        try {
            console.log(`\n📋 İşleniyor: ${questionId}`);
            
            const imageUrl = await searchPexelsImage(mapping.search, questionId);
            const outputPath = path.join(outputDir, mapping.filename);
            await downloadImage(imageUrl, outputPath);
            
            successCount++;
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.log(`❌ ${questionId} için hata: ${error.message}`);
            errorCount++;
        }
    }
    
    console.log(`\n🎉 Batch 7 Tamamlandı!`);
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
}

if (require.main === module) {
    downloadBatch7().catch(console.error);
}

module.exports = { downloadBatch7, MANUAL_MAPPINGS_7 };
