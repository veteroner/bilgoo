const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const { URL } = require('url');

// Paths
const questionsPath = './www/languages/tr/questions.json';
const imageDir = './www/assets/images/questions';

// Questions.json dosyasını oku
const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// İmaj klasörünü oluştur (eğer yoksa)
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Resmi indirme fonksiyonu
function downloadImage(url, localPath) {
  return new Promise((resolve, reject) => {
    console.log(`İndiriliyor: ${url}`);
    
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const file = fs.createWriteStream(localPath);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + (urlObj.search || ''),
      headers: {
        'User-Agent': 'BilgooQuizApp/1.0 (https://bilgoo.com; quiz@bilgoo.com) Node.js/' + process.version
      }
    };
    
    const request = client.get(options, (response) => {
      // Redirect kontrolü
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
        return downloadImage(response.headers.location, localPath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
        return reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✓ İndirildi: ${path.basename(localPath)}`);
        resolve(localPath);
      });
      
      file.on('error', (err) => {
        file.close();
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
        reject(err);
      });
    });
    
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
      reject(err);
    });
    
    request.setTimeout(30000, () => {
      request.destroy();
      file.close();
      if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
      reject(new Error('Download timeout'));
    });
  });
}

// URL'den dosya uzantısını al
function getImageExtension(url) {
  const match = url.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/i);
  return match ? match[1] : 'jpg';
}

// Ana indirme fonksiyonu
async function downloadImages() {
  console.log('Resimli sorular aranıyor...\n');
  
  let imageIndex = 1;
  let downloadCount = 0;
  
  // Tüm kategorileri dolaş
  for (const [category, questions] of Object.entries(questionsData)) {
    console.log(`\n📁 Kategori: ${category}`);
    
    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
      const question = questions[questionIndex];
      
      if (question.imageUrl) {
        try {
          const imageUrl = question.imageUrl;
          const imageExtension = getImageExtension(imageUrl);
          const localFileName = `img_${String(imageIndex).padStart(3, '0')}.${imageExtension}`;
          const localPath = path.join(imageDir, localFileName);
          
          // Eğer dosya zaten varsa atla
          if (fs.existsSync(localPath)) {
            console.log(`⏭️  Zaten var: ${localFileName}`);
            imageIndex++; // Index'i artır ki diğer dosyalar da doğru isimlenssin
            continue;
          }
          
          // Resmi indir
          await downloadImage(imageUrl, localPath);
          downloadCount++;
          
          // Soru bilgisini güvenli şekilde göster
          const questionText = question.text || question.question || 'Soru metni bulunamadı';
          console.log(`   Soru ${questionIndex + 1}: ${questionText.substring(0, 50)}...`);
          console.log(`   → ${localFileName}\n`);
          
          imageIndex++;
          
          // Kısa bir bekleme (server'ı yormamak için)
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`❌ Hata (${category} - Soru ${questionIndex + 1}): ${error.message}`);
          imageIndex++; // Hata olsa bile index'i artır
        }
      }
    }
  }
  
  console.log(`\n✅ Tamamlandı! Toplam ${downloadCount} resim indirildi.`);
  console.log(`📂 Resimler: ${imageDir}`);
}

// Script'i başlat
downloadImages().catch(console.error);
