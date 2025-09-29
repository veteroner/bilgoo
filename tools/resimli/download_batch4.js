const fs = require('fs');
const path = require('path');
const https = require('https');

// Pexels API Key
const PEXELS_API_KEY = 'srkFHqCRnkoXbGcfBi9SDeC4tQMy85pA8ZizZ2rXITwHzwZrKuJCwUUW';

// Manuel olarak belirlenmiş soru-resim eşleştirmeleri (Batch 4)
const MANUAL_MAPPINGS_4 = {
    'Q0283': { // WWW web sitesi
        search: 'WWW world wide web internet',
        filename: 'www_web.jpg'
    },
    'Q0284': { // İlk cep telefonu
        search: 'first mobile phone 1980s vintage',
        filename: 'first_mobile_phone.jpg'
    },
    'Q1153': { // İnternet 1991
        search: 'internet history computer network',
        filename: 'internet_history.jpg'
    },
    'Q1154': { // İlk bilgisayar virüsü
        search: 'computer virus malware security',
        filename: 'computer_virus.jpg'
    },
    'Q0352': { // Camp Nou stadyumu
        search: 'Camp Nou stadium FC Barcelona',
        filename: 'camp_nou_stadium.jpg'
    },
    'Q0353': { // Cristiano Ronaldo
        search: 'Cristiano Ronaldo football soccer',
        filename: 'cristiano_ronaldo.jpg'
    },
    'Q0354': { // Vodafone Park
        search: 'Vodafone Park stadium Beşiktaş',
        filename: 'vodafone_park.jpg'
    },
    'Q0355': { // Metin Oktay
        search: 'Galatasaray football legendary player',
        filename: 'galatasaray_legend.jpg'
    },
    'Q0356': { // Basketbol sahası
        search: 'basketball court indoor sports',
        filename: 'basketball_court.jpg'
    },
    'Q0357': { // Maraton koşusu
        search: 'marathon running race athletes',
        filename: 'marathon_race.jpg'
    },
    'Q0358': { // NBA basketbol
        search: 'NBA basketball American league',
        filename: 'nba_basketball.jpg'
    },
    'Q0359': { // Futbol kaleci
        search: 'football goalkeeper penalty area',
        filename: 'football_goalkeeper.jpg'
    },
    'Q0360': { // Formula 1
        search: 'Formula 1 racing car championship',
        filename: 'formula1_racing.jpg'
    },
    'Q0361': { // Tenis tarihi
        search: 'tennis sport England history',
        filename: 'tennis_sport.jpg'
    },
    'Q0362': { // Voleybol olimpiyat
        search: 'volleyball Olympic Games sport',
        filename: 'volleyball_olympic.jpg'
    },
    'Q0363': { // Basketbol potası
        search: 'basketball hoop height court',
        filename: 'basketball_hoop.jpg'
    },
    'Q0364': { // FIFA
        search: 'FIFA football federation international',
        filename: 'fifa_football.jpg'
    },
    'Q0365': { // Futbol oyuncu değişikliği
        search: 'football substitution players match',
        filename: 'football_substitution.jpg'
    },
    'Q0366': { // Yağlı güreş
        search: 'Turkish oil wrestling traditional sport',
        filename: 'oil_wrestling.jpg'
    },
    'Q0367': { // Bayanlar tenisi
        search: 'women tennis Grand Slam tournament',
        filename: 'women_tennis.jpg'
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
async function downloadBatch4() {
    console.log('🎯 4. Batch resim indirme başlıyor...\n');
    
    const outputDir = '../../www/assets/images/questions';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [questionId, mapping] of Object.entries(MANUAL_MAPPINGS_4)) {
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
    
    console.log(`\n🎉 Batch 4 Tamamlandı!`);
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
}

if (require.main === module) {
    downloadBatch4().catch(console.error);
}

module.exports = { downloadBatch4, MANUAL_MAPPINGS_4 };
