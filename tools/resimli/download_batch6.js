const fs = require('fs');
const path = require('path');
const https = require('https');

// Pexels API Key
const PEXELS_API_KEY = 'srkFHqCRnkoXbGcfBi9SDeC4tQMy85pA8ZizZ2rXITwHzwZrKuJCwUUW';

// Manuel olarak belirlenmiş soru-resim eşleştirmeleri (Batch 6)
const MANUAL_MAPPINGS_6 = {
    'Q0460': { // Soğuk Savaş
        search: 'Cold War Berlin Wall Soviet',
        filename: 'cold_war_period.jpg'
    },
    'Q0461': { // Kanuni Sultan Süleyman
        search: 'Suleiman Magnificent Ottoman sultan',
        filename: 'suleiman_magnificent.jpg'
    },
    'Q0462': { // Kadın hakları Türkiye
        search: 'Turkish women voting rights 1934',
        filename: 'women_voting_rights.jpg'
    },
    'Q0463': { // II. Dünya Savaşı
        search: 'World War 2 soldiers battle',
        filename: 'world_war_2.jpg'
    },
    'Q0464': { // Malazgirt Savaşı
        search: 'Manzikert battle medieval warfare',
        filename: 'manzikert_battle.jpg'
    },
    'Q0465': { // Çanakkale Savaşı
        search: 'Gallipoli campaign Turkish soldiers',
        filename: 'gallipoli_campaign.jpg'
    },
    'Q0466': { // Atatürk Samsun
        search: 'Samsun Turkey independence movement',
        filename: 'samsun_independence.jpg'
    },
    'Q0467': { // Sevr Antlaşması
        search: 'Treaty of Sevres Ottoman Empire',
        filename: 'sevres_treaty.jpg'
    },
    'Q0468': { // Berlin Duvarı
        search: 'Berlin Wall fall 1989 Germany',
        filename: 'berlin_wall_fall.jpg'
    },
    'Q0541': { // Nil Nehri
        search: 'Nile River Egypt flowing water',
        filename: 'nile_river_egypt.jpg'
    },
    'Q0545': { // Alaska
        search: 'Alaska landscape mountains snow',
        filename: 'alaska_landscape.jpg'
    },
    'Q0546': { // Vezüv Yanardağı
        search: 'Mount Vesuvius volcano Italy',
        filename: 'vesuvius_volcano.jpg'
    },
    'Q0547': { // İstanbul şehri
        search: 'Istanbul city Bosphorus Turkey',
        filename: 'istanbul_city.jpg'
    },
    'Q0548': { // Peri Bacaları
        search: 'Cappadocia fairy chimneys Turkey',
        filename: 'cappadocia_chimneys.jpg'
    },
    'Q0549': { // Japonya
        search: 'Japan country flag mountain',
        filename: 'japan_country.jpg'
    },
    'Q0550': { // Türkiye coğrafi bölgeler
        search: 'Turkey geographical regions map',
        filename: 'turkey_regions.jpg'
    },
    'Q0551': { // Ağrı Dağı
        search: 'Mount Ararat Turkey highest mountain',
        filename: 'mount_ararat.jpg'
    },
    'Q0552': { // Akdeniz
        search: 'Mediterranean Sea Turkey coast',
        filename: 'mediterranean_sea.jpg'
    },
    'Q0553': { // Karadeniz
        search: 'Black Sea Turkey northern coast',
        filename: 'black_sea_coast.jpg'
    },
    'Q0554': { // Nil Nehri en uzun
        search: 'Nile River longest world geography',
        filename: 'nile_longest_river.jpg'
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
async function downloadBatch6() {
    console.log('🎯 6. Batch resim indirme başlıyor...\n');
    
    const outputDir = '../../www/assets/images/questions';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [questionId, mapping] of Object.entries(MANUAL_MAPPINGS_6)) {
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
    
    console.log(`\n🎉 Batch 6 Tamamlandı!`);
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
}

if (require.main === module) {
    downloadBatch6().catch(console.error);
}

module.exports = { downloadBatch6, MANUAL_MAPPINGS_6 };
