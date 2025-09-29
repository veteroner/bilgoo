const https = require('https');
const fs = require('fs');
const path = require('path');

// Literature konuları için Wikimedia Commons linkleri
const LITERATURE_WIKIMEDIA_MAPPINGS = [
    {
        filename: 'literature_dostoyevski.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Vasily_Perov_-_%D0%9F%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_%D0%A4.%D0%9C.%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_-_Google_Art_Project.jpg/256px-Vasily_Perov_-_%D0%9F%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_%D0%A4.%D0%9C.%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_-_Google_Art_Project.jpg',
        description: 'Fyodor Dostoyevski portrait'
    },
    {
        filename: 'literature_don_quixote.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/El_ingenioso_hidalgo_don_Quijote_de_la_Mancha.jpg/256px-El_ingenioso_hidalgo_don_Quijote_de_la_Mancha.jpg',
        description: 'Don Quixote book cover'
    },
    {
        filename: 'literature_halide_edip.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Halide_Edib_Adivar.jpg/256px-Halide_Edib_Adivar.jpg',
        description: 'Halide Edib Adıvar'
    },
    {
        filename: 'literature_mevlana.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Mevlana_statue_Buca.jpg/256px-Mevlana_statue_Buca.jpg',
        description: 'Mevlana Celaleddin Rumi'
    },
    {
        filename: 'literature_haiku.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/ShomonBasho.jpg/256px-ShomonBasho.jpg',
        description: 'Matsuo Basho - Haiku master'
    },
    {
        filename: 'literature_sait_faik.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Sait_Faik_Abasıyanık.jpg/256px-Sait_Faik_Abasıyanık.jpg',
        description: 'Sait Faik Abasıyanık'
    },
    {
        filename: 'literature_yahya_kemal.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Yahya_Kemal_Beyatlı.jpg/256px-Yahya_Kemal_Beyatlı.jpg',
        description: 'Yahya Kemal Beyatlı'
    },
    {
        filename: 'literature_yasar_kemal.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Yaşar_Kemal_2.jpg/256px-Yaşar_Kemal_2.jpg',
        description: 'Yaşar Kemal'
    },
    {
        filename: 'literature_victor_hugo.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Victor_Hugo_001.jpg/256px-Victor_Hugo_001.jpg',
        description: 'Victor Hugo'
    },
    {
        filename: 'literature_mehmet_akif.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Mehmet_Akif_Ersoy.jpg/256px-Mehmet_Akif_Ersoy.jpg',
        description: 'Mehmet Akif Ersoy'
    },
    {
        filename: 'literature_halit_ziya.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Halit_Ziya_Uşaklıgil.jpg/256px-Halit_Ziya_Uşaklıgil.jpg',
        description: 'Halit Ziya Uşaklıgil'
    },
    {
        filename: 'literature_oguz_atay.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Oğuz_Atay.jpg/256px-Oğuz_Atay.jpg',
        description: 'Oğuz Atay'
    },
    {
        filename: 'literature_necip_fazil.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Necip_Fazıl_Kısakürek.jpg/256px-Necip_Fazıl_Kısakürek.jpg',
        description: 'Necip Fazıl Kısakürek'
    },
    {
        filename: 'literature_nobel_prize.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Nobel_Prize_medal.svg/256px-Nobel_Prize_medal.svg.png',
        description: 'Nobel Prize medal'
    },
    {
        filename: 'literature_calikusu.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Reşat_Nuri_Güntekin.jpg/256px-Reşat_Nuri_Güntekin.jpg',
        description: 'Reşat Nuri Güntekin - Çalıkuşu author'
    },
    {
        filename: 'literature_crime_punishment.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Vasily_Perov_-_%D0%9F%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_%D0%A4.%D0%9C.%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_-_Google_Art_Project.jpg/256px-Vasily_Perov_-_%D0%9F%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_%D0%A4.%D0%9C.%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_-_Google_Art_Project.jpg',
        description: 'Crime and Punishment - Dostoyevski'
    },
    {
        filename: 'literature_peyami_safa.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Peyami_Safa.jpg/256px-Peyami_Safa.jpg',
        description: 'Peyami Safa'
    },
    {
        filename: 'literature_fuzuli_divan.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Fuzuli_portrait.jpg/256px-Fuzuli_portrait.jpg',
        description: 'Fuzuli - Divan poet'
    },
    {
        filename: 'literature_yasar_kemal_book.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Yaşar_Kemal_2.jpg/256px-Yaşar_Kemal_2.jpg',
        description: 'Yaşar Kemal books'
    },
    {
        filename: 'literature_orhan_veli.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Orhan_Veli_Kanık.jpg/256px-Orhan_Veli_Kanık.jpg',
        description: 'Orhan Veli Kanık'
    },
    {
        filename: 'literature_tanpinar.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Ahmet_Hamdi_Tanpınar.jpg/256px-Ahmet_Hamdi_Tanpınar.jpg',
        description: 'Ahmet Hamdi Tanpınar'
    },
    {
        filename: 'literature_kafka.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Kafka_portrait.jpg/256px-Kafka_portrait.jpg',
        description: 'Franz Kafka'
    },
    {
        filename: 'literature_yaban.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Yakup_Kadri_Karaosmanoğlu.jpg/256px-Yakup_Kadri_Karaosmanoğlu.jpg',
        description: 'Yakup Kadri Karaosmanoğlu - Yaban author'
    },
    {
        filename: 'literature_nazim_hikmet.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Nazım_Hikmet.jpg/256px-Nazım_Hikmet.jpg',
        description: 'Nazım Hikmet'
    },
    {
        filename: 'literature_cahit_sitki.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Cahit_Sıtkı_Tarancı.jpg/256px-Cahit_Sıtkı_Tarancı.jpg',
        description: 'Cahit Sıtkı Tarancı'
    },
    {
        filename: 'literature_garip_movement.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Orhan_Veli_Kanık.jpg/256px-Orhan_Veli_Kanık.jpg',
        description: 'Garip Movement - Orhan Veli'
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
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Referer': 'https://commons.wikimedia.org/',
                    'Sec-Fetch-Dest': 'image',
                    'Sec-Fetch-Mode': 'no-cors',
                    'Sec-Fetch-Site': 'same-site'
                }
            };
            
            https.get(currentUrl, options, (response) => {
                // Handle redirects
                if (response.statusCode === 301 || response.statusCode === 302) {
                    file.close();
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                    console.log(`🔄 Redirect ${redirectCount + 1}: ${response.headers.location}`);
                    return makeRequest(response.headers.location, redirectCount + 1);
                }
                
                if (response.statusCode !== 200) {
                    file.close();
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
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
                        fs.unlinkSync(filePath);
                    }
                    reject(error);
                });
                
            }).on('error', (error) => {
                file.close();
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                reject(error);
            });
        }
        
        makeRequest(url, 0);
    });
}

async function downloadLiteratureImages() {
    console.log('📚 LİTERATÜR RESİMLERİ WIKIMEDIA\'DAN İNDİRİLİYOR...');
    console.log(`📊 Toplam: ${LITERATURE_WIKIMEDIA_MAPPINGS.length} dosya`);
    console.log('=' + '='.repeat(60));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < LITERATURE_WIKIMEDIA_MAPPINGS.length; i++) {
        const mapping = LITERATURE_WIKIMEDIA_MAPPINGS[i];
        try {
            console.log(`\\n📖 ${i + 1}/${LITERATURE_WIKIMEDIA_MAPPINGS.length}: ${mapping.filename}`);
            console.log(`   ${mapping.description}`);
            await downloadImageWithUserAgent(mapping.url, mapping.filename);
            successCount++;
            
            // Rate limiting için bekle
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`❌ ${mapping.filename} hatası:`, error.message);
            errorCount++;
        }
    }
    
    console.log('\\n📊 FINAL ÖZET:');
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
    console.log(`📁 Toplam: ${LITERATURE_WIKIMEDIA_MAPPINGS.length}`);
    
    if (successCount === LITERATURE_WIKIMEDIA_MAPPINGS.length) {
        console.log('\\n🎉 TÜM LİTERATÜR RESİMLERİ BAŞARIYLA İNDİRİLDİ!');
        console.log('✅ Artık logolu resimler temizlendi');
    } else {
        console.log(`\\n⚠️ ${errorCount} resim indirilemedi.`);
    }
}

downloadLiteratureImages().catch(console.error);
