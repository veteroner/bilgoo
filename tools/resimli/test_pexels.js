#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Pexels API Key
const PEXELS_API_KEY = 'srkFHqCRnkoXbGcfBi9SDeC4tQMy85pA8ZizZ2rXITwHzwZrKuJCwUUW';

// JSON dosyasını oku
const questionsPath = path.join(__dirname, '../../languages/tr/questions.json');
const data = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// Test klasörü oluştur
const testDir = path.join(__dirname, 'test_images');
if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
}

// Soru metninden anahtar kelimeler çıkar ve İngilizce'ye çevir
function extractKeywords(question) {
    const translations = {
        'boğaz': 'bosphorus strait',
        'istanbul': 'istanbul turkey',
        'avrupa': 'europe',
        'asya': 'asia',
        'antartika': 'antarctica continent',
        'kıta': 'continent',
        'rusya': 'russia country',
        'ülke': 'country',
        'komşu': 'neighbor countries',
        'besteci': 'composer classical music',
        'mozart': 'mozart composer',
        'beethoven': 'beethoven composer',
        'müzik enstrüman': 'musical instrument',
        'keman': 'violin instrument',
        'spor': 'sports',
        'basketbol': 'basketball ball',
        'futbol': 'football soccer ball',
        'top': 'ball sport',
        'teknoloji': 'technology computer',
        'disk': 'computer storage',
        'ssd': 'ssd hard drive',
        'tarihi yapı': 'historical building',
        'yapı': 'architecture building',
        'gezegen': 'planet space',
        'mars': 'mars planet red',
        'yazar': 'writer author books',
        'kitap': 'books literature'
    };
    
    const lowerQuestion = question.toLowerCase();
    const keywords = [];
    
    for (const [turkish, english] of Object.entries(translations)) {
        if (lowerQuestion.includes(turkish)) {
            keywords.push(english);
        }
    }
    
    if (keywords.length === 0) {
        keywords.push('general knowledge');
    }
    
    return keywords.join(' ');
}

// Pexels'dan resim test et
async function testPexelsSearch(query) {
    return new Promise((resolve, reject) => {
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`;
        
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
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

// Test et
async function testQuestions() {
    const resimliSorular = data['Resimli Sorular'] || [];
    
    console.log('🔍 İlk 10 soru için Pexels arama testi...\n');
    
    for (let i = 0; i < Math.min(10, resimliSorular.length); i++) {
        const soru = resimliSorular[i];
        const keywords = extractKeywords(soru.question);
        
        console.log(`${i + 1}. Soru: ${soru.question.substring(0, 80)}...`);
        console.log(`   Anahtar kelimeler: "${keywords}"`);
        
        try {
            const result = await testPexelsSearch(keywords);
            if (result.photos && result.photos.length > 0) {
                console.log(`   ✅ ${result.photos.length} resim bulundu`);
                console.log(`   📸 İlk resim: ${result.photos[0].alt || 'Açıklama yok'}`);
            } else {
                console.log(`   ❌ Resim bulunamadı`);
            }
        } catch (error) {
            console.log(`   ❌ Hata: ${error.message}`);
        }
        
        console.log('');
        
        // API limit için bekleme
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

testQuestions().catch(console.error);
