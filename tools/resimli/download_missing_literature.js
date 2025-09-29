const https = require('https');
const fs = require('fs');
const path = require('path');

// Pexels API anahtarı
const PEXELS_API_KEY = 'srkFHqCRnkoXbGcfBi9SDeC4tQMy85pA8ZizZ2rXITwHzwZrKuJCwUUW';

// Eksik edebiyat resimlerinin mapping'i
const LITERATURE_MAPPINGS = [
    { filename: 'literature_calikusu.jpg', search: 'bird nature turkish literature book', pexels_id: '433208' },
    { filename: 'literature_nazim_hikmet.jpg', search: 'turkish poet writer portrait man', pexels_id: '697509' },
    { filename: 'literature_don_quixote.jpg', search: 'don quixote cervantes spanish knight', pexels_id: '159751' },
    { filename: 'literature_nobel_prize.jpg', search: 'nobel prize medal literature award', pexels_id: '6963944' },
    { filename: 'literature_mevlana.jpg', search: 'mevlana sufi islamic poetry mystic', pexels_id: '8728380' },
    { filename: 'literature_yasar_kemal.jpg', search: 'turkish writer author kurdish literature', pexels_id: '926390' },
    { filename: 'literature_kafka.jpg', search: 'kafka writer author portrait czech', pexels_id: '762080' },
    { filename: 'literature_haiku.jpg', search: 'japanese poetry haiku zen bamboo', pexels_id: '235985' },
    { filename: 'literature_garip_movement.jpg', search: 'modern turkish poetry movement writers', pexels_id: '159581' },
    { filename: 'literature_victor_hugo.jpg', search: 'victor hugo french writer notre dame', pexels_id: '159751' },
    { filename: 'literature_oguz_atay.jpg', search: 'turkish novelist modern literature writer', pexels_id: '762080' },
    { filename: 'literature_halit_ziya.jpg', search: 'ottoman turkish literature writer portrait', pexels_id: '926390' },
    { filename: 'literature_tanpinar.jpg', search: 'turkish poet writer modern literature', pexels_id: '697509' },
    { filename: 'literature_yahya_kemal.jpg', search: 'turkish poet istanbul literature classical', pexels_id: '159581' },
    { filename: 'literature_mehmet_akif.jpg', search: 'turkish poet national anthem writer', pexels_id: '762080' },
    { filename: 'literature_yaban.jpg', search: 'turkish village novel anatolian rural', pexels_id: '247599' },
    { filename: 'literature_fuzuli_divan.jpg', search: 'classical ottoman poetry divan literature', pexels_id: '159751' },
    { filename: 'literature_orhan_veli.jpg', search: 'modern turkish poet garip movement', pexels_id: '697509' },
    { filename: 'literature_sait_faik.jpg', search: 'turkish short story writer modern', pexels_id: '926390' },
    { filename: 'literature_necip_fazil.jpg', search: 'turkish poet islamic literature writer', pexels_id: '762080' },
    { filename: 'literature_peyami_safa.jpg', search: 'turkish novelist psychological novel', pexels_id: '159581' },
    { filename: 'literature_halide_edip.jpg', search: 'turkish woman writer feminist literature', pexels_id: '415829' },
    { filename: 'literature_cahit_sitki.jpg', search: 'turkish poet thirty five years poetry', pexels_id: '697509' },
    { filename: 'literature_yasar_kemal_book.jpg', search: 'ince memed book kurdish turkish literature', pexels_id: '159751' }
];

// Diğer eksik resimler
const OTHER_MAPPINGS = [
    { filename: 'presidential_flag_turkey.jpg', search: 'turkish presidential flag official ceremony', pexels_id: '3586966' },
    { filename: 'metin_oktay_real.jpg', search: 'turkish football player galatasaray vintage', pexels_id: '274506' }
];

// Tüm mapping'leri birleştir
const ALL_MAPPINGS = [...LITERATURE_MAPPINGS, ...OTHER_MAPPINGS];

async function downloadFromPexels(mapping) {
    return new Promise((resolve, reject) => {
        console.log(`📥 İndiriliyor: ${mapping.filename} (ID: ${mapping.pexels_id})`);
        
        const options = {
            hostname: 'api.pexels.com',
            path: `/v1/photos/${mapping.pexels_id}`,
            method: 'GET',
            headers: {
                'Authorization': PEXELS_API_KEY
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.src && result.src.medium) {
                        downloadImage(result.src.medium, mapping.filename)
                            .then(() => resolve(mapping))
                            .catch(reject);
                    } else {
                        reject(new Error(`Resim URL bulunamadı: ${mapping.filename}`));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(`www/assets/images/questions/${filename}`);
        
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ İndirildi: ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(`www/assets/images/questions/${filename}`, () => {}); // Hatalı dosyayı sil
            reject(err);
        });
    });
}

async function downloadAllMissing() {
    console.log('🚀 EKSİK RESİMLER İNDİRİLİYOR...');
    console.log(`📊 Toplam eksik resim: ${ALL_MAPPINGS.length}`);
    console.log('=' * 50);

    let success = 0;
    let failed = 0;

    for (const mapping of ALL_MAPPINGS) {
        try {
            await downloadFromPexels(mapping);
            success++;
            console.log(`✅ Başarılı: ${mapping.filename} (${success}/${ALL_MAPPINGS.length})`);
        } catch (error) {
            failed++;
            console.log(`❌ Hata: ${mapping.filename} - ${error.message}`);
        }
        
        // API limiti için kısa bekleme
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n' + '=' * 50);
    console.log('📊 SONUÇ:');
    console.log(`✅ Başarılı: ${success}`);
    console.log(`❌ Başarısız: ${failed}`);
    console.log(`📈 Başarı oranı: %${((success / ALL_MAPPINGS.length) * 100).toFixed(1)}`);
}

downloadAllMissing();
