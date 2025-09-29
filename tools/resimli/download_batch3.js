const fs = require('fs');
const path = require('path');
const https = require('https');

// Pexels API Key
const PEXELS_API_KEY = 'srkFHqCRnkoXbGcfBi9SDeC4tQMy85pA8ZizZ2rXITwHzwZrKuJCwUUW';

// Manuel olarak belirlenmiş soru-resim eşleştirmeleri (41-60)
const MANUAL_MAPPINGS_3 = {
    'Q1149': { // Satürn uyduları
        search: 'Saturn planet rings moons space',
        filename: 'saturn_planet.jpg'
    },
    'Q1150': { // Vitamin D güneş ışığı
        search: 'vitamin D sunlight skin health',
        filename: 'vitamin_d_sunlight.jpg'
    },
    'Q0265': { // İlk iPhone
        search: 'first iPhone 2007 Apple smartphone',
        filename: 'first_iphone.jpg'
    },
    'Q0266': { // Windows ilk sürüm
        search: 'Windows operating system computer',
        filename: 'windows_os.jpg'
    },
    'Q0267': { // Apple II
        search: 'Apple II computer vintage personal',
        filename: 'apple_ii_computer.jpg'
    },
    'Q0268': { // Microsoft bilgisayar
        search: 'Microsoft Surface computer device',
        filename: 'microsoft_computer.jpg'
    },
    'Q0269': { // PNG dosya formatı
        search: 'PNG file format computer compression',
        filename: 'png_file_format.jpg'
    },
    'Q0270': { // HTML programlama
        search: 'HTML code programming web development',
        filename: 'html_code.jpg'
    },
    'Q0271': { // Python programlama dili
        search: 'Python programming language code',
        filename: 'python_programming.jpg'
    },
    'Q0272': { // Yapay zeka
        search: 'artificial intelligence AI technology',
        filename: 'artificial_intelligence.jpg'
    },
    'Q0273': { // WiFi wireless
        search: 'WiFi wireless internet connection',
        filename: 'wifi_wireless.jpg'
    },
    'Q0274': { // Blockchain teknolojisi
        search: 'blockchain technology cryptocurrency',
        filename: 'blockchain_technology.jpg'
    },
    'Q0275': { // RAM hafıza
        search: 'RAM memory computer hardware',
        filename: 'ram_memory.jpg'
    },
    'Q0276': { // Google kuruluş
        search: 'Google logo company headquarters',
        filename: 'google_company.jpg'
    },
    'Q0277': { // SSD vs HDD
        search: 'SSD solid state drive computer',
        filename: 'ssd_drive.jpg'
    },
    'Q0278': { // İlk 1GB sabit disk
        search: 'hard disk drive storage computer',
        filename: 'hard_disk_drive.jpg'
    },
    'Q0279': { // HTTPS protokolü
        search: 'HTTPS security web browser lock',
        filename: 'https_security.jpg'
    },
    'Q0280': { // Android işletim sistemi
        search: 'Android operating system smartphone',
        filename: 'android_os.jpg'
    },
    'Q0281': { // F tuşları klavye
        search: 'keyboard function keys F keys',
        filename: 'keyboard_function_keys.jpg'
    },
    'Q0282': { // Adobe Photoshop
        search: 'Adobe Photoshop software design',
        filename: 'adobe_photoshop.jpg'
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
async function downloadBatch3() {
    console.log('🎯 3. Batch resim indirme başlıyor...\n');
    
    const outputDir = '../../www/assets/images/questions';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [questionId, mapping] of Object.entries(MANUAL_MAPPINGS_3)) {
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
    
    console.log(`\n🎉 Batch 3 Tamamlandı!`);
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
}

if (require.main === module) {
    downloadBatch3().catch(console.error);
}

module.exports = { downloadBatch3, MANUAL_MAPPINGS_3 };
