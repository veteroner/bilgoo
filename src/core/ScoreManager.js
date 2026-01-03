/**
 * ScoreManager.js - Puan yönetimi ve hesaplama
 * Faz 2: Core Modül Çıkarımı
 */

export class ScoreManager {
    constructor(config = {}) {
        this.score = 0;
        this.totalScore = 0;
        this.sessionScore = 0;
        this.totalStars = 0;
        this.isLoggedIn = false;
        
        // Puan çarpanları
        this.BASE_POINTS = config.basePoints || 10;
        this.TIME_BONUS_MULTIPLIER = config.timeBonusMultiplier || 0.5;
        this.STREAK_BONUS_MULTIPLIER = config.streakBonusMultiplier || 2;
        this.DIFFICULTY_MULTIPLIERS = config.difficultyMultipliers || {
            1: 1.0,   // Kolay
            2: 1.5,   // Orta
            3: 2.0    // Zor
        };
        
        // İstatistikler
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        
        // Callbacks
        this.onScoreUpdate = config.onScoreUpdate || (() => {});
        this.onStarsUpdate = config.onStarsUpdate || (() => {});
    }
    
    /**
     * Doğru cevap için puan hesapla ve ekle
     * @param {Object} params - Puan hesaplama parametreleri
     */
    addScore(params = {}) {
        const {
            timeLeft = 0,
            totalTime = 30,
            difficulty = 1,
            isStreak = false
        } = params;
        
        // Temel puan
        let points = this.BASE_POINTS;
        
        // Zorluk çarpanı
        const difficultyMultiplier = this.DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;
        points *= difficultyMultiplier;
        
        // Süre bonusu (kalan süre oranına göre)
        if (timeLeft > 0) {
            const timeRatio = timeLeft / totalTime;
            const timeBonus = points * this.TIME_BONUS_MULTIPLIER * timeRatio;
            points += timeBonus;
        }
        
        // Seri bonus (3+ doğru cevap)
        if (this.currentStreak >= 3) {
            const streakBonus = points * this.STREAK_BONUS_MULTIPLIER;
            points += streakBonus;
        }
        
        // Puanı yuvarla
        points = Math.round(points);
        
        // Skorları güncelle
        this.score += points;
        this.sessionScore += points;
        
        if (this.isLoggedIn) {
            this.totalScore += points;
        }
        
        // Doğru cevap sayısını artır
        this.correctAnswers++;
        this.currentStreak++;
        
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
        }
        
        // Callback çağır
        this.onScoreUpdate({
            points,
            score: this.score,
            totalScore: this.totalScore,
            sessionScore: this.sessionScore,
            streak: this.currentStreak,
            difficulty,
            timeBonus: timeLeft > 0
        });
        
        console.log('📊 Puan eklendi:', {
            earnedPoints: points,
            currentScore: this.score,
            difficulty: difficulty === 1 ? 'Kolay' : difficulty === 2 ? 'Orta' : 'Zor',
            streak: this.currentStreak,
            timeBonus: timeLeft > 0
        });
        
        return points;
    }
    
    /**
     * Yanlış cevap - seriyi sıfırla
     */
    recordWrongAnswer() {
        this.wrongAnswers++;
        this.currentStreak = 0;
        
        console.log('❌ Yanlış cevap - Seri sıfırlandı');
    }
    
    /**
     * Yıldız ekle
     * @param {number} amount - Eklenecek yıldız miktarı
     */
    addStars(amount) {
        this.totalStars += amount;
        
        this.onStarsUpdate({
            stars: this.totalStars,
            addedAmount: amount
        });
        
        console.log('⭐ Yıldız eklendi:', {
            added: amount,
            total: this.totalStars
        });
        
        return this.totalStars;
    }
    
    /**
     * Yıldız harca
     * @param {number} amount - Harcanacak yıldız miktarı
     */
    spendStars(amount) {
        if (this.totalStars < amount) {
            console.warn('⚠️ Yeterli yıldız yok!');
            return false;
        }
        
        this.totalStars -= amount;
        
        this.onStarsUpdate({
            stars: this.totalStars,
            spentAmount: amount
        });
        
        console.log('💸 Yıldız harcandı:', {
            spent: amount,
            remaining: this.totalStars
        });
        
        return true;
    }
    
    /**
     * İstatistikleri al
     */
    getStats() {
        const totalQuestions = this.correctAnswers + this.wrongAnswers;
        const accuracy = totalQuestions > 0 ? 
            (this.correctAnswers / totalQuestions * 100).toFixed(1) : 0;
        
        return {
            score: this.score,
            totalScore: this.totalScore,
            sessionScore: this.sessionScore,
            stars: this.totalStars,
            correctAnswers: this.correctAnswers,
            wrongAnswers: this.wrongAnswers,
            totalQuestions,
            accuracy: parseFloat(accuracy),
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak
        };
    }
    
    /**
     * Oturumu sıfırla (yeni oyun için)
     */
    resetSession() {
        this.score = 0;
        this.currentStreak = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        
        console.log('🔄 Oturum sıfırlandı');
    }
    
    /**
     * Giriş durumunu ayarla
     */
    setLoginStatus(isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
    }
    
    /**
     * Toplam puanı yükle (Firebase'den)
     */
    loadTotalScore(totalScore) {
        this.totalScore = totalScore || 0;
        console.log('📥 Toplam puan yüklendi:', this.totalScore);
    }
    
    /**
     * Yıldızları yükle (Firebase'den)
     */
    loadStars(stars) {
        this.totalStars = stars || 0;
        console.log('📥 Yıldızlar yüklendi:', this.totalStars);
    }
    
    /**
     * Sayıyı formatla (1000 -> 1K, 1000000 -> 1M)
     */
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}
