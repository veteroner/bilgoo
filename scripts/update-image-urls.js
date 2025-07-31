const fs = require('fs');
const path = require('path');

// Dosya yolları
const questionsPath = './www/languages/tr/questions.json';
const backupPath = './www/languages/tr/questions-backup.json';

// Questions.json dosyasını oku
const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// Backup oluştur
fs.writeFileSync(backupPath, JSON.stringify(questionsData, null, 2));
console.log('✅ Backup oluşturuldu: questions-backup.json');

// URL'den yerel dosya yoluna eşleme
const urlToLocalMapping = [
  // Genel Kültür
  { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Hagia_Sophia_Mars_2013.jpg/800px-Hagia_Sophia_Mars_2013.jpg',
    local: 'assets/images/questions/img_001.jpg',
    description: 'Ayasofya'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Pamukkale_travertenleri_%282%29.jpg',
    local: 'assets/images/questions/img_002.jpg',
    description: 'Pamukkale'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Dolmabahce%2C_Istanbul%2C_Turchia.JPG',
    local: 'assets/images/questions/img_003.JPG',
    description: 'Dolmabahçe Sarayı'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/K%C4%B1zKulesi.jpg',
    local: 'assets/images/questions/img_004.jpg',
    description: 'Kız Kulesi'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Celsus_library_in_Ephesus.jpg',
    local: 'assets/images/questions/img_005.jpg',
    description: 'Efes Celsus Kütüphanesi'
  },
  
  // Bilim
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/800px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
    local: 'assets/images/questions/img_006.jpg',
    description: 'Jüpiter'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/800px-OSIRIS_Mars_true_color.jpg',
    local: 'assets/images/questions/img_007.jpg',
    description: 'Mars'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Collage_of_Nine_Dogs.jpg/800px-Collage_of_Nine_Dogs.jpg',
    local: 'assets/images/questions/img_008.jpg',
    description: 'Köpekler'
  },
  
  // Teknoloji
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/IPhone_1st_Gen.svg/800px-IPhone_1st_Gen.svg.png',
    local: 'assets/images/questions/img_009.png',
    description: 'İlk iPhone'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/en/4/4e/Windows1.0.png',
    local: 'assets/images/questions/img_010.png',
    description: 'Windows 1.0'
  },
  
  // Spor
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Camp_Nou.jpg/800px-Camp_Nou.jpg',
    local: 'assets/images/questions/img_011.jpg',
    description: 'Camp Nou'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/800px-Cristiano_Ronaldo_2018.jpg',
    local: 'assets/images/questions/img_012.jpg',
    description: 'Cristiano Ronaldo'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Vodafone_Park.jpg',
    local: 'assets/images/questions/img_013.jpg',
    description: 'Vodafone Park'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Metin_Oktay.jpg',
    local: 'assets/images/questions/img_014.jpg',
    description: 'Metin Oktay'
  },
  {
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    local: 'assets/images/questions/img_015.jpg',
    description: 'Basketbol sahası'
  },
  
  // Tarih
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Ataturk1930s.jpg/800px-Ataturk1930s.jpg',
    local: 'assets/images/questions/img_016.jpg',
    description: 'Atatürk'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Mehmet_%C3%82kif_Ersoy.png',
    local: 'assets/images/questions/img_017.png',
    description: 'Mehmet Akif Ersoy'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Celsus_library_in_Ephesus.jpg',
    local: 'assets/images/questions/img_018.jpg',
    description: 'Efes (Tarih kategorisi)'
  },
  
  // Coğrafya
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Dawn_on_the_S_rim_of_the_Grand_Canyon_%288645178272%29.jpg/400px-Dawn_on_the_S_rim_of_the_Grand_Canyon_%288645178272%29.jpg',
    local: 'assets/images/questions/img_019.jpg',
    description: 'Grand Canyon'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/800px-Flag_of_Japan.svg.png',
    local: 'assets/images/questions/img_020.png',
    description: 'Japonya Bayrağı'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Wonder_Lake_and_Denali.jpg/400px-Wonder_Lake_and_Denali.jpg',
    local: 'assets/images/questions/img_021.jpg',
    description: 'Alaska Denali'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/400px-Flag_of_South_Korea.svg.png',
    local: 'assets/images/questions/img_022.png',
    description: 'Güney Kore Bayrağı'
  },
  
  // Müzik
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Wolfgang-amadeus-mozart_1.jpg/800px-Wolfgang-amadeus-mozart_1.jpg',
    local: 'assets/images/questions/img_023.jpg',
    description: 'Mozart'
  },
  
  // Edebiyat
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shakespeare.jpg/800px-Shakespeare.jpg',
    local: 'assets/images/questions/img_024.jpg',
    description: 'Shakespeare'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg/800px-Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg',
    local: 'assets/images/questions/img_025.jpg',
    description: 'Harry Potter Kitap Kapağı'
  }
];

// URL'leri yerel dosya yollarıyla değiştir
let updateCount = 0;

Object.keys(questionsData).forEach(category => {
  questionsData[category].forEach((question, index) => {
    if (question.imageUrl) {
      const mapping = urlToLocalMapping.find(m => m.url === question.imageUrl);
      if (mapping) {
        question.imageUrl = mapping.local;
        updateCount++;
        console.log(`✅ ${category} - Soru ${index + 1}: ${mapping.description} → ${mapping.local}`);
      } else {
        console.log(`⚠️  ${category} - Soru ${index + 1}: URL eşleşmesi bulunamadı: ${question.imageUrl}`);
      }
    }
  });
});

// Güncellenmiş JSON'u kaydet
fs.writeFileSync(questionsPath, JSON.stringify(questionsData, null, 2));

console.log(`\n✅ Güncelleme tamamlandı!`);
console.log(`📝 Toplam ${updateCount} soru güncellendi`);
console.log(`💾 Güncellenmiş dosya: ${questionsPath}`);
console.log(`🔄 Backup dosya: ${backupPath}`);
