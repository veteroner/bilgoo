#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Pexels API Key
const PEXELS_API_KEY = 'srkFHqCRnkoXbGcfBi9SDeC4tQMy85pA8ZizZ2rXITwHzwZrKuJCwUUW';

// JSON dosyasını oku
const questionsPath = path.join(__dirname, '../../languages/tr/questions.json');
const data = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// Resim klasörü
const imageDir = path.join(__dirname, '../../www/assets/images/questions');

// Resim klasörünü temizle
function cleanImageDirectory() {
    console.log('🧹 Eski resimler temizleniyor...');
    if (fs.existsSync(imageDir)) {
        const files = fs.readdirSync(imageDir);
        for (const file of files) {
            fs.unlinkSync(path.join(imageDir, file));
        }
    } else {
        fs.mkdirSync(imageDir, { recursive: true });
    }
}

// Soru metninden anahtar kelimeler çıkar ve İngilizce'ye çevir
function extractKeywords(question) {
    // Türkçe kelimelerden İngilizce karşılıkları
    const translations = {
        // Özel yerler ve yapılar
        'ayasofya': 'hagia sophia istanbul',
        'pamukkale': 'pamukkale white terraces turkey',
        'dolmabahçe sarayı': 'dolmabahce palace istanbul',
        'kız kulesi': 'maiden tower istanbul',
        'efes': 'ephesus ancient ruins turkey',
        'celcus kütüphanesi': 'celsus library ephesus',
        'burj khalifa': 'burj khalifa dubai skyscraper',
        'dubai': 'dubai burj khalifa',
        
        // Coğrafya
        'boğaz': 'bosphorus strait',
        'istanbul boğazı': 'bosphorus istanbul',
        'istanbul': 'istanbul turkey city',
        'avrupa': 'europe continent',
        'asya': 'asia continent', 
        'antartika': 'antarctica ice continent',
        'kıta': 'continent map',
        'rusya': 'russia moscow country',
        'ülke': 'country flag',
        'komşu': 'border countries',
        'ankara': 'ankara turkey capital',
        'türkiye': 'turkey flag country',
        'başkent': 'capital city',
        'new york': 'new york city usa',
        'abd': 'usa america flag',
        'kızıldeniz': 'red sea coral',
        'çin': 'china beijing flag',
        'dağ': 'mountain landscape',
        'deniz': 'sea ocean',
        'göl': 'lake water',
        'nehir': 'river flowing',
        'şehir': 'city buildings',
        
        // Tarih ve yapılar
        'savaş': 'war battle historical',
        'osmanlı': 'ottoman empire turkey',
        'roma': 'roman colosseum empire',
        'yunan': 'greek parthenon ancient',
        'mısır': 'egypt pyramid sphinx',
        'piramit': 'pyramid egypt',
        'kale': 'castle fortress',
        'saray': 'palace architecture',
        'anıt': 'monument statue',
        'müze': 'museum art',
        'arkeoloji': 'archaeology excavation',
        'antik': 'ancient ruins',
        'tarihi yapı': 'historical building',
        'yapı': 'architecture building',
        
        // Nobel ve ödüller
        'nobel ödülleri': 'nobel prize medal',
        'nobel': 'nobel prize ceremony',
        'alfred nobel': 'alfred nobel portrait',
        'ödül': 'award prize medal',
        
        // Bilim
        'gezegen': 'planet solar system',
        'mars': 'mars planet red',
        'venüs': 'venus planet',
        'güneş': 'sun solar',
        'ay': 'moon lunar',
        'yıldız': 'stars night sky',
        'galaksi': 'galaxy space',
        'atom': 'atom molecule',
        'molekül': 'molecule chemistry',
        'mikroskop': 'microscope laboratory',
        'teleskop': 'telescope astronomy',
        'laboratuvar': 'laboratory science',
        'deney': 'experiment laboratory',
        
        // Edebiyat
        'şair': 'poet writing',
        'yazar': 'writer author books',
        'kitap': 'books library',
        'roman': 'novel book',
        'şiir': 'poetry manuscript',
        'edebiyat': 'literature books',
        'shakespeare': 'william shakespeare portrait',
        'hamlet': 'hamlet shakespeare theater',
        'orhan pamuk': 'orhan pamuk turkish writer',
        'yaşar kemal': 'yasar kemal turkish author',
        'nazım hikmet': 'nazim hikmet poet',
        
        // Müzik
        'müzik': 'music concert',
        'enstrüman': 'musical instrument',
        'müzik enstrümanı': 'musical instrument',
        'keman': 'violin instrument',
        'piyano': 'piano keyboard',
        'gitar': 'guitar instrument',
        'davul': 'drums percussion',
        'besteci': 'composer classical music',
        'mozart': 'mozart composer portrait',
        'beethoven': 'beethoven composer',
        'bach': 'bach composer',
        'konser': 'concert orchestra',
        'opera': 'opera theater',
        
        // Spor
        'futbol': 'football soccer ball',
        'basketbol': 'basketball ball court',
        'tenis': 'tennis ball racket',
        'voleybol': 'volleyball ball net',
        'olimpiyat': 'olympics rings stadium',
        'stadyum': 'stadium sports',
        'spor': 'sports equipment',
        'top': 'ball sports',
        'basketbol topu': 'basketball orange ball',
        'futbol topu': 'soccer ball',
        'tenis topu': 'tennis ball yellow',
        'voleybol topu': 'volleyball white ball',
        'maç': 'sports match game',
        
        // Teknoloji
        'bilgisayar': 'computer technology',
        'internet': 'internet network',
        'telefon': 'smartphone phone',
        'robot': 'robot technology',
        'yapay zeka': 'artificial intelligence ai',
        'teknoloji': 'technology computer',
        'program': 'software programming',
        'uygulama': 'mobile app',
        'sistem': 'computer system',
        'disk': 'hard drive storage',
        'ssd': 'ssd drive storage',
        'ssd disk': 'solid state drive',
        'ram': 'ram memory computer',
        'ram bellek': 'computer memory ram',
        'işlemci': 'processor cpu chip',
        'anakart': 'motherboard computer',
        'teknolojik cihaz': 'technology device',
        
        // Sanat
        'resim': 'painting artwork',
        'sanat': 'art painting',
        'galeri': 'art gallery',
        'heykel': 'sculpture statue',
        'tablo': 'painting canvas',
        'ressam': 'painter artist studio'
    };
    
    // Soruyu küçük harfe çevir ve temizle
    const lowerQuestion = question.toLowerCase()
        .replace(/[^\wçğıöşüÇĞIİÖŞÜ\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    
    console.log(`   📝 Temizlenmiş soru: ${lowerQuestion}`);
    
    // En iyi eşleşmeyi bul (en uzun eşleşme öncelikli)
    const sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length);
    const foundKeywords = [];
    
    for (const turkish of sortedKeys) {
        if (lowerQuestion.includes(turkish)) {
            foundKeywords.push(translations[turkish]);
            console.log(`   🎯 Eşleşme bulundu: "${turkish}" → "${translations[turkish]}"`);
            break; // İlk (en uzun) eşleşmeyi al
        }
    }
    
    // Eğer spesifik eşleşme bulunamazsa, genel kategorileri kontrol et
    if (foundKeywords.length === 0) {
        if (lowerQuestion.includes('bu') && (lowerQuestion.includes('nedir') || lowerQuestion.includes('kimdir'))) {
            if (lowerQuestion.includes('besteci')) foundKeywords.push('composer classical music');
            else if (lowerQuestion.includes('yazar')) foundKeywords.push('writer author books');
            else if (lowerQuestion.includes('enstrüman')) foundKeywords.push('musical instrument');
            else if (lowerQuestion.includes('yapı')) foundKeywords.push('architecture building');
            else if (lowerQuestion.includes('gezegen')) foundKeywords.push('planet space');
            else foundKeywords.push('object thing general');
        } else if (lowerQuestion.includes('hangi')) {
            foundKeywords.push('which what question');
        } else {
            foundKeywords.push('knowledge education');
        }
        
        console.log(`   💡 Genel kategori: "${foundKeywords[0]}"`);
    }
    
    return foundKeywords[0] || 'general knowledge';
}

// Pexels'dan resim indir
async function downloadFromPexels(query, filename) {
    return new Promise((resolve, reject) => {
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
        
        const options = {
            headers: {
                'Authorization': PEXELS_API_KEY
            }
        };
        
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.photos && result.photos.length > 0) {
                        const imageUrl = result.photos[0].src.medium;
                        downloadImage(imageUrl, filename).then(resolve).catch(reject);
                    } else {
                        console.log(`❌ "${query}" için resim bulunamadı`);
                        resolve(false);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

// Resmi indir ve kaydet
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(imageDir, filename);
        const file = fs.createWriteStream(filePath);
        
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ İndirildi: ${filename}`);
                resolve(true);
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {}); // Hatalı dosyayı sil
            reject(err);
        });
    });
}

// Ana fonksiyon
async function main() {
    console.log('🚀 Resimli sorular için yeni resimler indiriliyor...');
    
    // Eski resimleri temizle
    cleanImageDirectory();
    
    const resimliSorular = data['Resimli Sorular'] || [];
    console.log(`📊 Toplam ${resimliSorular.length} soru bulundu`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < resimliSorular.length; i++) {
        const soru = resimliSorular[i];
        const keywords = extractKeywords(soru.question);
        const filename = `${soru.id.toLowerCase()}.jpg`;
        
        console.log(`\n🔍 ${i + 1}/${resimliSorular.length} - ${soru.id}`);
        console.log(`📝 Soru: ${soru.question.substring(0, 60)}...`);
        console.log(`🔤 Anahtar kelimeler: ${keywords}`);
        
        try {
            const success = await downloadFromPexels(keywords, filename);
            if (success) {
                // JSON'da resim yolunu güncelle
                soru.imageUrl = `assets/images/questions/${filename}`;
                soru.image = `assets/images/questions/${filename}`;
                successCount++;
            } else {
                failCount++;
            }
            
            // API limit için bekleme
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.log(`❌ Hata: ${error.message}`);
            failCount++;
        }
    }
    
    // Güncellenmiş JSON'u kaydet
    fs.writeFileSync(questionsPath, JSON.stringify(data, null, 2), 'utf8');
    
    // Diğer klasörlere de kopyala
    const wwwPath = path.join(__dirname, '../../www/languages/tr/questions.json');
    const netlifyPath = path.join(__dirname, '../../netlify-deploy/languages/tr/questions.json');
    
    fs.writeFileSync(wwwPath, JSON.stringify(data, null, 2), 'utf8');
    fs.writeFileSync(netlifyPath, JSON.stringify(data, null, 2), 'utf8');
    
    console.log('\n🎉 İşlem tamamlandı!');
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Başarısız: ${failCount}`);
    console.log(`📊 Toplam: ${successCount + failCount}`);
}

main().catch(console.error);
