const fs = require('fs');
const path = require('path');
const https = require('https');

// Pexels API Key
const PEXELS_API_KEY = 'srkFHqCRnkoXbGcfBi9SDeC4tQMy85pA8ZizZ2rXITwHzwZrKuJCwUUW';

// Manuel olarak belirlenmiş soru-resim eşleştirmeleri (21-40)
const MANUAL_MAPPINGS_2 = {
    'Q0083': { // Golf İskoçya
        search: 'golf course Scotland highlands',
        filename: 'golf_scotland.jpg'
    },
    'Q0173': { // Atom çekirdeği
        search: 'atom nucleus protons neutrons science',
        filename: 'atom_nucleus.jpg'
    },
    'Q0174': { // Jüpiter gezegeni
        search: 'Jupiter planet space solar system',
        filename: 'jupiter_planet.jpg'
    },
    'Q0175': { // Mars gezegeni
        search: 'Mars planet red space',
        filename: 'mars_planet.jpg'
    },
    'Q0176': { // Memeli hayvan
        search: 'mammal animal wildlife',
        filename: 'mammal_animal.jpg'
    },
    'Q0177': { // En büyük organ deri
        search: 'human skin anatomy largest organ',
        filename: 'human_skin.jpg'
    },
    'Q0178': { // DNA şempanze
        search: 'DNA genetics chimpanzee comparison',
        filename: 'dna_genetics.jpg'
    },
    'Q0179': { // Manyetik kuzey kutbu
        search: 'magnetic north pole compass Earth',
        filename: 'magnetic_north.jpg'
    },
    'Q0180': { // Çene kasI
        search: 'jaw muscle anatomy strongest',
        filename: 'jaw_muscle.jpg'
    },
    'Q0181': { // Zehirli örümcek
        search: 'spider venomous dangerous',
        filename: 'spider_venomous.jpg'
    },
    'Q0182': { // Mavi balina kalbi
        search: 'blue whale heart giant size',
        filename: 'blue_whale_heart.jpg'
    },
    'Q0183': { // Uzayda ateş
        search: 'space fire flame zero gravity',
        filename: 'space_fire.jpg'
    },
    'Q0184': { // Dünya çekirdeği
        search: 'Earth core solid liquid geology',
        filename: 'earth_core.jpg'
    },
    'Q0185': { // Köpekbalığı kanser
        search: 'shark cancer immunity medical',
        filename: 'shark_immunity.jpg'
    },
    'Q0186': { // Işık hızı
        search: 'light speed physics faster sound',
        filename: 'light_speed.jpg'
    },
    'Q0187': { // Venüs dönüşü
        search: 'Venus planet rotation retrograde',
        filename: 'venus_planet.jpg'
    },
    'Q0188': { // Yarasa kör
        search: 'bat echolocation blind animals',
        filename: 'bat_echolocation.jpg'
    },
    'Q0189': { // Beyin uyku
        search: 'brain sleep activity neuroscience',
        filename: 'brain_sleep.jpg'
    },
    'Q0190': { // Devekuşu kafa kum
        search: 'ostrich head sand myth behavior',
        filename: 'ostrich_myth.jpg'
    },
    'Q1148': { // Dünya çekirdeği
        search: 'Earth core iron nickel geology',
        filename: 'earth_core_iron.jpg'
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
async function downloadBatch2() {
    console.log('🎯 2. Batch resim indirme başlıyor...\n');
    
    const outputDir = '../../www/assets/images/questions';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [questionId, mapping] of Object.entries(MANUAL_MAPPINGS_2)) {
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
    
    console.log(`\n🎉 Batch 2 Tamamlandı!`);
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
}

if (require.main === module) {
    downloadBatch2().catch(console.error);
}

module.exports = { downloadBatch2, MANUAL_MAPPINGS_2 };
