const https = require('https');
const fs = require('fs');
const path = require('path');

// Kalan 2 resim için alternatif linkler
const REMAINING_MAPPINGS = [
    {
        filename: 'metin_oktay_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/tr/1/15/Metin_Oktay.jpg',
        description: 'Metin Oktay - Türkçe Wikipedia'
    },
    {
        filename: 'presidential_flag_turkey.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Flag_of_the_President_of_Turkey.svg/512px-Flag_of_the_President_of_Turkey.svg.png',
        description: 'Türkiye Cumhurbaşkanlığı forsu - thumbnail'
    }
];

async function downloadFromWikimedia(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join('/Users/onerozbey/Desktop/quiz-oyunu/www/assets/images/questions', filename);
        const file = fs.createWriteStream(filePath);
        
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
                'Referer': 'https://commons.wikimedia.org/'
            }
        };
        
        const request = https.get(url, options, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                file.close();
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                console.log(`🔄 Redirect: ${response.headers.location}`);
                return downloadFromWikimedia(response.headers.location, filename)
                    .then(resolve)
                    .catch(reject);
            }
            
            if (response.statusCode !== 200) {
                file.close();
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                return;
            }
            
            console.log(`📦 İndiriliyor: ${filename} (${response.headers['content-length']} bytes)`);
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`✅ ${filename} başarıyla indirildi`);
                resolve();
            });
            
            file.on('error', (error) => {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                reject(error);
            });
        });
        
        request.on('error', (error) => {
            file.close();
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            reject(error);
        });
    });
}

async function downloadRemainingImages() {
    console.log('🔄 KALAN 2 RESİM İÇİN ALTERNATİF LİNKLER DENENİYOR...');
    console.log('=' + '='.repeat(50));
    
    for (const mapping of REMAINING_MAPPINGS) {
        try {
            console.log(`\\n🔗 ${mapping.description}`);
            console.log(`📁 Dosya: ${mapping.filename}`);
            console.log(`🌐 URL: ${mapping.url}`);
            
            await downloadFromWikimedia(mapping.url, mapping.filename);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error(`❌ ${mapping.filename} HATASI: ${error.message}`);
        }
    }
    
    console.log('\\n✅ Kalan resimler için deneme tamamlandı!');
}

downloadRemainingImages().catch(console.error);
