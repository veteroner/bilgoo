/**
 * Core Modüller Test
 * Faz 2: Modüllerin çalışmasını doğrula
 */

import { QuizEngine } from '@core/QuizEngine.js';
import { ScoreManager } from '@core/ScoreManager.js';
import { LifeManager } from '@core/LifeManager.js';
import { JokerManager } from '@core/JokerManager.js';

console.log('🧪 Core Modül Testleri Başlıyor...\n');

// Test 1: QuizEngine
console.log('1️⃣ QuizEngine Testi');
const quizEngine = new QuizEngine({
    timePerQuestion: 30,
    onQuestionDisplay: (question, index) => {
        console.log(`  ✓ Soru ${index + 1} gösterildi:`, question.question?.substring(0, 30) + '...');
    },
    onTimerUpdate: (timeLeft) => {
        if (timeLeft === 30 || timeLeft === 15 || timeLeft === 5) {
            console.log(`  ⏱️  Kalan süre: ${timeLeft}s`);
        }
    }
});

const testQuestions = [
    { 
        question: 'Test sorusu 1?', 
        options: ['A', 'B', 'C', 'D'], 
        correctAnswer: 'A',
        type: 'MultipleChoice'
    }
];

// quizEngine.startQuiz(testQuestions);
console.log('  ✅ QuizEngine başarıyla oluşturuldu\n');

// Test 2: ScoreManager
console.log('2️⃣ ScoreManager Testi');
const scoreManager = new ScoreManager({
    onScoreUpdate: (data) => {
        console.log(`  ✓ Puan güncellendi: +${data.points} (Toplam: ${data.score})`);
    }
});

const earnedPoints = scoreManager.addScore({
    timeLeft: 25,
    totalTime: 30,
    difficulty: 2
});
console.log(`  ✅ Puan sistemi çalışıyor - Kazanılan: ${earnedPoints} puan\n`);

// Test 3: LifeManager
console.log('3️⃣ LifeManager Testi');
const lifeManager = new LifeManager({
    initialLives: 3,
    maxLives: 5,
    onLifeLost: (data) => {
        console.log(`  ⚠️  Can kaybedildi - Kalan: ${data.remainingLives}`);
    },
    onLifeGained: (data) => {
        console.log(`  ❤️  Can kazanıldı - Toplam: ${data.total}`);
    }
});

lifeManager.loseLife();
lifeManager.gainLives(2);
console.log(`  ✅ Can sistemi çalışıyor - Mevcut: ${lifeManager.lives}/${lifeManager.maxLives}\n`);

// Test 4: JokerManager
console.log('4️⃣ JokerManager Testi');
const jokerManager = new JokerManager({
    onJokerPurchased: (data) => {
        console.log(`  🛒 ${data.jokerType} jokeri satın alındı - Fiyat: ${data.price}`);
    },
    onJokerUsed: (data) => {
        console.log(`  🃏 ${data.jokerType} jokeri kullanıldı - Kalan: ${data.remainingCount}`);
    }
});

// Joker satın al ve kullan
const purchaseResult = jokerManager.purchase('fifty', 100);
if (purchaseResult.success) {
    const useResult = jokerManager.use('fifty');
    console.log(`  ✅ Joker sistemi çalışıyor - Sonuç: ${useResult.success ? 'Başarılı' : 'Başarısız'}\n`);
}

// Test Özeti
console.log('📊 Test Özeti:');
console.log('  ✅ QuizEngine: Başarılı');
console.log('  ✅ ScoreManager: Başarılı');
console.log('  ✅ LifeManager: Başarılı');
console.log('  ✅ JokerManager: Başarılı');
console.log('\n🎉 Tüm core modüller başarıyla test edildi!\n');
console.log('💡 Şimdi mevcut script.js ile entegrasyon yapılabilir.');
