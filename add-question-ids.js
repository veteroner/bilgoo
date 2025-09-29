#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Tüm soru dosyalarına benzersiz ID ekleyen script
function addIdsToQuestions() {
    const languageDir = path.join(__dirname, 'languages');
    const languages = ['tr', 'en', 'de'];
    
    let globalIdCounter = 1;
    
    languages.forEach(lang => {
        const filePath = path.join(languageDir, lang, 'questions.json');
        
        if (!fs.existsSync(filePath)) {
            console.log(`❌ ${filePath} bulunamadı, atlanıyor...`);
            return;
        }
        
        console.log(`🔄 ${lang} dili işleniyor...`);
        
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            let questionsAdded = 0;
            
            // Her kategori için
            Object.keys(data).forEach(category => {
                if (Array.isArray(data[category])) {
                    data[category].forEach(question => {
                        // Eğer ID yoksa ekle
                        if (!question.id) {
                            question.id = `Q${String(globalIdCounter).padStart(4, '0')}`;
                            globalIdCounter++;
                            questionsAdded++;
                        }
                    });
                }
            });
            
            // Dosyayı güncelle
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`✅ ${lang}: ${questionsAdded} soruya ID eklendi`);
            
        } catch (error) {
            console.error(`❌ ${lang} dosyası işlenirken hata:`, error.message);
        }
    });
    
    console.log(`\n🎉 Tamamlandı! Toplam ${globalIdCounter - 1} benzersiz ID oluşturuldu.`);
}

// Script'i çalıştır
if (require.main === module) {
    addIdsToQuestions();
}

module.exports = { addIdsToQuestions };
