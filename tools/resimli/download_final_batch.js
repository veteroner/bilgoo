const fs = require('fs');
const path = require('path');
const https = require('https');

// Pexels API Key
const PEXELS_API_KEY = 'srkFHqCRnkoXbGcfBi9SDeC4tQMy85pA8ZizZ2rXITwHzwZrKuJCwUUW';

// Manuel olarak belirlenmiş soru-resim eşleştirmeleri (Final Batch)
const MANUAL_MAPPINGS_FINAL = {
    'Q0721': { // Paris başkent
        search: 'Paris France capital Eiffel Tower',
        filename: 'paris_capital.jpg'
    },
    'Q0722': { // Londra başkent
        search: 'London England capital Big Ben',
        filename: 'london_capital.jpg'
    },
    'Q0723': { // Berlin başkent
        search: 'Berlin Germany capital Brandenburg Gate',
        filename: 'berlin_capital.jpg'
    },
    'Q0724': { // Roma başkent
        search: 'Rome Italy capital Colosseum ancient',
        filename: 'rome_capital.jpg'
    },
    'Q0725': { // Madrid başkent
        search: 'Madrid Spain capital royal palace',
        filename: 'madrid_capital.jpg'
    },
    'Q0726': { // Moskova başkent
        search: 'Moscow Russia capital Red Square',
        filename: 'moscow_capital.jpg'
    },
    'Q0727': { // Tokyo başkent
        search: 'Tokyo Japan capital skyscrapers city',
        filename: 'tokyo_capital.jpg'
    },
    'Q0728': { // Yanlış soru: Türkiye başkenti İstanbul
        search: 'Turkey capital Ankara not Istanbul',
        filename: 'turkey_capital_correction.jpg'
    },
    'Q0730': { // Yanlış soru: Kanada başkenti Toronto
        search: 'Canada capital Ottawa not Toronto',
        filename: 'canada_capital_correction.jpg'
    },
    'Q0731': { // Yanlış soru: Avustralya başkenti Sidney
        search: 'Australia capital Canberra not Sydney',
        filename: 'australia_capital_correction.jpg'
    },
    'Q0561': { // İstanbul Boğazı
        search: 'Bosphorus strait Istanbul Asia Europe',
        filename: 'bosphorus_strait.jpg'
    },
    'Q0563': { // Antartika
        search: 'Antarctica continent ice no countries',
        filename: 'antarctica_continent.jpg'
    },
    'Q0566': { // Rusya komşuları
        search: 'Russia largest country many borders',
        filename: 'russia_borders.jpg'
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
async function downloadFinalBatch() {
    console.log('🎯 FINAL Batch resim indirme başlıyor...\n');
    
    const outputDir = '../../www/assets/images/questions';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [questionId, mapping] of Object.entries(MANUAL_MAPPINGS_FINAL)) {
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
    
    console.log(`\n🎉 FINAL Batch Tamamlandı!`);
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
    console.log(`🏆 TÜM BATCH'LER TAMAMLANDI!`);
}

if (require.main === module) {
    downloadFinalBatch().catch(console.error);
}

module.exports = { downloadFinalBatch, MANUAL_MAPPINGS_FINAL };
