const fs = require('fs');
const path = require('path');
const https = require('https');

// Pexels API Key
const PEXELS_API_KEY = 'srkFHqCRnkoXbGcfBi9SDeC4tQMy85pA8ZizZ2rXITwHzwZrKuJCwUUW';

// Manuel olarak belirlenmiş soru-resim eşleştirmeleri
const MANUAL_MAPPINGS = {
    'Q0054': { // Ayasofya
        search: 'Hagia Sophia Istanbul',
        filename: 'hagia_sophia_istanbul.jpg'
    },
    'Q0055': { // Pamukkale
        search: 'Pamukkale travertines Turkey',
        filename: 'pamukkale_travertines.jpg'
    },
    'Q0056': { // Dolmabahçe Sarayı
        search: 'Dolmabahce Palace Istanbul',
        filename: 'dolmabahce_palace.jpg'
    },
    'Q0057': { // Kız Kulesi
        search: 'Maiden Tower Istanbul',
        filename: 'maiden_tower_istanbul.jpg'
    },
    'Q0058': { // Efes Celcus Kütüphanesi
        search: 'Ephesus Celsus Library Turkey',
        filename: 'ephesus_celsus_library.jpg'
    },
    'Q0059': { // Burj Khalifa
        search: 'Burj Khalifa Dubai skyline',
        filename: 'burj_khalifa_dubai.jpg'
    },
    'Q0060': { // Nobel Ödülleri
        search: 'Nobel Prize medal award',
        filename: 'nobel_prize_medal.jpg'
    },
    'Q0061': { // ABD başkenti (Washington)
        search: 'Washington DC Capitol building',
        filename: 'washington_dc_capitol.jpg'
    },
    'Q0062': { // Kızıldeniz
        search: 'Red Sea coral reef',
        filename: 'red_sea_coral.jpg'
    },
    'Q0063': { // Çin nüfus
        search: 'China flag Chinese population',
        filename: 'china_flag_population.jpg'
    },
    'Q0064': { // Cumhurbaşkanlığı forsu
        search: 'Turkey presidential flag symbol',
        filename: 'turkey_presidential_flag.jpg'
    },
    'Q0065': { // Son Akşam Yemeği
        search: 'Last Supper Leonardo da Vinci painting',
        filename: 'last_supper_davinci.jpg'
    },
    'Q0066': { // E. coli bakterisi
        search: 'E coli bacteria microscope',
        filename: 'ecoli_bacteria.jpg'
    },
    'Q0067': { // Eyfel Kulesi
        search: 'Eiffel Tower Paris 1889',
        filename: 'eiffel_tower_paris.jpg'
    },
    'Q0068': { // En uzun kemik (femur)
        search: 'human femur bone anatomy',
        filename: 'human_femur_bone.jpg'
    },
    'Q0069': { // Londra
        search: 'London Big Ben UK city',
        filename: 'london_big_ben.jpg'
    },
    'Q0070': { // Mehter Marşı
        search: 'Ottoman Janissary band mehter',
        filename: 'ottoman_mehter_band.jpg'
    },
    'Q0071': { // Peri bacaları
        search: 'Cappadocia fairy chimneys Turkey',
        filename: 'cappadocia_fairy_chimneys.jpg'
    },
    'Q0072': { // 23 çift kromozom
        search: 'human chromosomes DNA genetics',
        filename: 'human_chromosomes.jpg'
    },
    'Q0073': { // Euro para birimi
        search: 'Euro currency European Union',
        filename: 'euro_currency.jpg'
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
                        // En iyi kaliteli resmi seç
                        const photo = result.photos[0];
                        const imageUrl = photo.src.medium; // 350x233 boyut
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
                fs.unlink(outputPath, () => {}); // Hatalı dosyayı sil
                reject(error);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

// Ana fonksiyon
async function downloadAllImages() {
    console.log('🎯 Manuel resim indirme başlıyor...\n');
    
    // Çıktı klasörünü oluştur
    const outputDir = '../../www/assets/images/questions';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [questionId, mapping] of Object.entries(MANUAL_MAPPINGS)) {
        try {
            console.log(`\n📋 İşleniyor: ${questionId}`);
            
            // Resim ara
            const imageUrl = await searchPexelsImage(mapping.search, questionId);
            
            // İndir
            const outputPath = path.join(outputDir, mapping.filename);
            await downloadImage(imageUrl, outputPath);
            
            successCount++;
            
            // API rate limiting için bekle
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.log(`❌ ${questionId} için hata: ${error.message}`);
            errorCount++;
        }
    }
    
    console.log(`\n🎉 Tamamlandı!`);
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
}

// Script'i çalıştır
if (require.main === module) {
    downloadAllImages().catch(console.error);
}

module.exports = { downloadAllImages, MANUAL_MAPPINGS };
