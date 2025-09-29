const https = require('https');
const fs = require('fs');
const path = require('path');

// Kalan 2 resim için Wikimedia Commons linkleri
const REMAINING_WIKIMEDIA_MAPPINGS = [
    {
        filename: 'metin_oktay_real.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Metin_Oktay.jpg',
        description: 'Metin Oktay - gerçek fotoğraf'
    },
    {
        filename: 'presidential_flag_turkey.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Flag_of_the_President_of_Turkey.svg/320px-Flag_of_the_President_of_Turkey.svg.png',
        description: 'Türkiye Cumhurbaşkanlığı forsu'
    }
];

async function downloadImageWithUserAgent(url, filename, maxRedirects = 5) {
    return new Promise((resolve, reject) => {
        const filePath = path.join('/Users/onerozbey/Desktop/quiz-oyunu/www/assets/images/questions', filename);
        
        function makeRequest(currentUrl, redirectCount) {
            if (redirectCount > maxRedirects) {
                reject(new Error('Too many redirects'));
                return;
            }
            
            const file = fs.createWriteStream(filePath);
            
            const options = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive',
                    'Referer': 'https://commons.wikimedia.org/',
                    'Upgrade-Insecure-Requests': '1'
                }
            };
            
            https.get(currentUrl, options, (response) => {
                // Handle redirects
                if (response.statusCode === 301 || response.statusCode === 302) {
                    file.close();
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath); // Clean up empty file
                    }
                    console.log(`🔄 Redirect ${redirectCount + 1}: ${response.headers.location}`);
                    return makeRequest(response.headers.location, redirectCount + 1);
                }
                
                if (response.statusCode !== 200) {
                    file.close();
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath); // Clean up empty file
                    }
                    reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                    return;
                }
                
                console.log(`📥 İndiriliyor: ${filename} (${response.headers['content-length']} bytes)`);
                
                response.pipe(file);
                
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ ${filename} başarıyla indirildi`);
                    resolve();
                });
                
                file.on('error', (error) => {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath); // Clean up on error
                    }
                    reject(error);
                });
                
            }).on('error', (error) => {
                file.close();
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // Clean up on error
                }
                reject(error);
            });
        }
        
        makeRequest(url, 0);
    });
}

async function downloadRemainingImages() {
    console.log('📚 KALAN 2 RESİM WIKIMEDIA\'DAN İNDİRİLİYOR...');
    console.log(`📊 Toplam: ${REMAINING_WIKIMEDIA_MAPPINGS.length} dosya`);
    console.log('=' + '='.repeat(50));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const mapping of REMAINING_WIKIMEDIA_MAPPINGS) {
        try {
            console.log(`🔗 ${mapping.filename}: ${mapping.description}`);
            console.log(`   URL: ${mapping.url}`);
            await downloadImageWithUserAgent(mapping.url, mapping.filename);
            successCount++;
            
            // Rate limiting için bekle
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`❌ ${mapping.filename} hatası:`, error.message);
            errorCount++;
        }
    }
    
    console.log('\\n📊 ÖZET:');
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
    console.log(`📁 Toplam: ${REMAINING_WIKIMEDIA_MAPPINGS.length}`);
    
    if (successCount === REMAINING_WIKIMEDIA_MAPPINGS.length) {
        console.log('\\n🎉 KALAN TÜM RESİMLER BAŞARIYLA İNDİRİLDİ!');
    } else {
        console.log('\\n⚠️ Bazı resimler indirilemedi.');
    }
}

downloadRemainingImages().catch(console.error);
