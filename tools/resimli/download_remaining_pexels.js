const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'srkFHqCRnkoXbGcfBi9SDeC4tQMy85pA8ZizZ2rXITwHzwZrKuJCwUUW';

// Kalan 2 resim için Pexels aramaları
const PEXELS_MAPPINGS = [
    { filename: 'metin_oktay_real.jpg', search: 'Turkish football player vintage' },
    { filename: 'presidential_flag_turkey.jpg', search: 'Turkey flag presidential official' }
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

async function downloadRemainingFromPexels() {
    console.log('🎨 KALAN 2 RESİM PEXELS\'TEN İNDİRİLİYOR...');
    console.log('=' * 40);
    
    for (const mapping of PEXELS_MAPPINGS) {
        try {
            console.log(`🔍 ${mapping.filename}: "${mapping.search}" aranıyor...`);
            await searchAndDownload(mapping.search, mapping.filename);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`❌ ${mapping.filename} hatası:`, error.message);
        }
    }
    
    console.log('\\n✅ Pexels arama tamamlandı!');
}

downloadRemainingFromPexels().catch(console.error);
