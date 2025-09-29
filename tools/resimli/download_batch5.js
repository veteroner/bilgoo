const fs = require('fs');
const path = require('path');
const https = require('https');

// Pexels API Key
const PEXELS_API_KEY = 'srkFHqCRnkoXbGcfBi9SDeC4tQMy85pA8ZizZ2rXITwHzwZrKuJCwUUW';

// Manuel olarak belirlenmiş soru-resim eşleştirmeleri (Batch 5)
const MANUAL_MAPPINGS_5 = {
    'Q0369': { // Su topu
        search: 'water polo swimming pool sport',
        filename: 'water_polo_sport.jpg'
    },
    'Q0370': { // Boks maçı
        search: 'boxing match ring gloves',
        filename: 'boxing_match.jpg'
    },
    'Q0371': { // Halter sporu
        search: 'weightlifting Olympic sport barbell',
        filename: 'weightlifting_sport.jpg'
    },
    'Q1151': { // Olimpiyat Oyunları
        search: 'Olympic Games ceremony torch',
        filename: 'olympic_games.jpg'
    },
    'Q1152': { // Futbol penaltı
        search: 'football penalty kick goal',
        filename: 'football_penalty.jpg'
    },
    'Q0445': { // Mustafa Kemal Atatürk
        search: 'Mustafa Kemal Atatürk Turkish leader',
        filename: 'ataturk_portrait.jpg'
    },
    'Q0446': { // İstanbul fethi
        search: 'Istanbul conquest Ottoman cannons',
        filename: 'istanbul_conquest.jpg'
    },
    'Q0447': { // TBMM binası
        search: 'Turkish parliament building Ankara',
        filename: 'tbmm_building.jpg'
    },
    'Q0448': { // İstiklal Marşı
        search: 'Turkish national anthem independence',
        filename: 'turkish_anthem.jpg'
    },
    'Q0449': { // Çanakkale Cephesi
        search: 'Gallipoli battle Turkish war memorial',
        filename: 'gallipoli_battle.jpg'
    },
    'Q0450': { // Cumhuriyet ilanı
        search: 'Turkish Republic proclamation flag',
        filename: 'republic_proclamation.jpg'
    },
    'Q0451': { // Efes antik kenti
        search: 'Ephesus ancient ruins Turkey',
        filename: 'ephesus_ruins.jpg'
    },
    'Q0452': { // İlk cumhurbaşkanı
        search: 'Turkish president office flag',
        filename: 'turkish_president.jpg'
    },
    'Q0453': { // I. Dünya Savaşı
        search: 'World War 1 soldiers battlefield',
        filename: 'world_war_1.jpg'
    },
    'Q0454': { // Osman Bey
        search: 'Ottoman Empire founder historical',
        filename: 'ottoman_founder.jpg'
    },
    'Q0455': { // Fatih Sultan Mehmet
        search: 'Fatih Sultan Mehmet Ottoman sultan',
        filename: 'fatih_sultan.jpg'
    },
    'Q0456': { // Kurtuluş Savaşı
        search: 'Turkish War of Independence soldiers',
        filename: 'independence_war.jpg'
    },
    'Q0457': { // TBMM açılışı
        search: 'Turkish parliament opening ceremony',
        filename: 'parliament_opening.jpg'
    },
    'Q0458': { // Lozan Antlaşması
        search: 'Lausanne Treaty Turkey peace',
        filename: 'lausanne_treaty.jpg'
    },
    'Q0459': { // Latin alfabesi
        search: 'Turkish alphabet reform letters',
        filename: 'alphabet_reform.jpg'
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
async function downloadBatch5() {
    console.log('🎯 5. Batch resim indirme başlıyor...\n');
    
    const outputDir = '../../www/assets/images/questions';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [questionId, mapping] of Object.entries(MANUAL_MAPPINGS_5)) {
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
    
    console.log(`\n🎉 Batch 5 Tamamlandı!`);
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
}

if (require.main === module) {
    downloadBatch5().catch(console.error);
}

module.exports = { downloadBatch5, MANUAL_MAPPINGS_5 };
