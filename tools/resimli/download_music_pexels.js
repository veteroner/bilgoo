const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'srkFHqCRnkoXbGcfBi9SDeC4tQMy85pA8ZizZ2rXITwHzwZrKuJCwUUW';

// Gerçek müzik soruları için manuel mapping
const MUSIC_MAPPINGS = [
    { filename: 'music_kanun.jpg', search: 'kanun turkish music instrument strings', id: 'Q0606' },
    { filename: 'music_kemence.jpg', search: 'kemence pontic lyra turkish instrument', id: 'Q0607' },
    { filename: 'music_pavarotti.jpg', search: 'opera singer male performance', id: 'Q0608' },
    { filename: 'mozart_portrait_real.jpg', search: 'wolfgang amadeus mozart composer portrait', id: 'Q0609' },
    { filename: 'music_baglama.jpg', search: 'baglama saz turkish folk instrument', id: 'Q0610' },
    { filename: 'music_guitar_fixed.jpg', search: 'acoustic guitar classical music', id: 'Q0611' },
    { filename: 'muzik_q0612_fixed.jpg', search: 'beethoven composer classical music', id: 'Q0612' },
    { filename: 'music_piano.jpg', search: 'grand piano classical music instrument', id: 'Q0613' },
    { filename: 'muzik_q0614_fixed.jpg', search: 'bach composer baroque music', id: 'Q0614' },
    { filename: 'michael_jackson_real.jpg', search: 'michael jackson pop music performance', id: 'Q0615' },
    { filename: 'music_turkish_folk.jpg', search: 'turkish folk music traditional instruments', id: 'Q0616' },
    { filename: 'music_soprano.jpg', search: 'soprano female opera singer', id: 'Q0617' },
    { filename: 'music_beatles.jpg', search: 'beatles rock band liverpool', id: 'Q0618' },
    { filename: 'music_kanun_strings.jpg', search: 'kanun strings turkish instrument', id: 'Q0619' },
    { filename: 'music_violin.jpg', search: 'violin classical music instrument', id: 'Q0620' },
    { filename: 'muzik_q0621_fixed.jpg', search: 'moonlight sonata beethoven piano', id: 'Q0621' },
    { filename: 'music_rap_microphone.jpg', search: 'rap music microphone hip hop', id: 'Q0622' },
    { filename: 'classical_orchestra.jpg', search: 'symphony orchestra classical music', id: 'Q0623' },
    { filename: 'music_orchestra.jpg', search: 'flute woodwind orchestra instrument', id: 'Q0624' },
    { filename: 'turkish_ney_instrument.jpg', search: 'ney turkish sufi music reed', id: 'Q0625' },
    { filename: 'music_rock.jpg', search: 'rock music concert electric guitar', id: 'Q1142' },
    { filename: 'music_ney.jpg', search: 'ney reed flute turkish music', id: 'Q1143' },
    { filename: 'music_symphony.jpg', search: 'symphony concert hall classical music', id: 'Q1144' }
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

async function downloadMusicImages() {
    console.log('🎵 MÜZİK RESİMLERİ PEXELS\'TEN İNDİRİLİYOR...');
    console.log(`📊 Toplam: ${MUSIC_MAPPINGS.length} müzik resmi`);
    console.log('=' + '='.repeat(50));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const mapping of MUSIC_MAPPINGS) {
        try {
            console.log(`🔍 ${mapping.filename} (${mapping.id}): "${mapping.search}" aranıyor...`);
            await searchAndDownload(mapping.search, mapping.filename);
            successCount++;
            
            // Rate limiting için bekle
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`❌ ${mapping.filename} hatası:`, error.message);
            errorCount++;
        }
    }
    
    console.log('\\n📊 ÖZET:');
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
    console.log(`📁 Toplam: ${MUSIC_MAPPINGS.length}`);
    
    if (successCount === MUSIC_MAPPINGS.length) {
        console.log('\\n🎉 TÜM MÜZİK RESİMLERİ BAŞARIYLA İNDİRİLDİ!');
    } else {
        console.log('\\n⚠️ Bazı resimler indirilemedi.');
    }
}

downloadMusicImages().catch(console.error);
