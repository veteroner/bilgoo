/**
 * LifeManager.js - Can sistemi yönetimi
 * Faz 2: Core Modül Çıkarımı
 */

export class LifeManager {
    constructor(config = {}) {
        this.lives = config.initialLives || 3;
        this.maxLives = config.maxLives || 5;
        this.lifeRegenEnabled = config.lifeRegenEnabled !== false;
        this.regenIntervalMs = config.regenIntervalMs || 30 * 60 * 1000; // 30 dakika
        
        // Son can yenileme zamanı
        this.lastLifeTime = Date.now();
        this.regenTimer = null;
        
        // Ödül kalkanı (reklam sonrası ani can kaybını önlemek için)
        this.rewardShieldUntil = 0;
        
        // Callbacks
        this.onLivesUpdate = config.onLivesUpdate || (() => {});
        this.onLifeLost = config.onLifeLost || (() => {});
        this.onLifeGained = config.onLifeGained || (() => {});
        this.onGameOver = config.onGameOver || (() => {});
    }
    
    /**
     * Can kaybı
     */
    loseLife() {
        // Ödül kalkanı kontrolü
        if (Date.now() < this.rewardShieldUntil) {
            console.log('🛡️ Ödül kalkanı aktif - Can kaybı engellendi');
            return false;
        }
        
        if (this.lives <= 0) {
            console.warn('⚠️ Can zaten 0');
            this.handleGameOver();
            return false;
        }
        
        this.lives--;
        
        // Son can kaybı zamanını kaydet
        this.lastLifeTime = Date.now();
        
        // Callback çağır
        this.onLifeLost({
            remainingLives: this.lives,
            isGameOver: this.lives <= 0
        });
        
        // Can gösterimini güncelle
        this.onLivesUpdate(this.lives);
        
        console.log('💔 Can kaybı:', {
            remaining: this.lives,
            max: this.maxLives
        });
        
        // Can 0 olduysa
        if (this.lives <= 0) {
            this.handleGameOver();
        } else {
            // Can yenileme timer'ını başlat
            this.startLifeRegeneration();
        }
        
        return true;
    }
    
    /**
     * Can kazanımı
     * @param {number} amount - Kazanılacak can miktarı
     */
    gainLives(amount = 1) {
        const oldLives = this.lives;
        this.lives = Math.min(this.lives + amount, this.maxLives);
        const actualGain = this.lives - oldLives;
        
        if (actualGain > 0) {
            this.onLifeGained({
                gained: actualGain,
                total: this.lives
            });
            
            this.onLivesUpdate(this.lives);
            
            console.log('❤️ Can kazanıldı:', {
                gained: actualGain,
                total: this.lives,
                max: this.maxLives
            });
        }
        
        return actualGain;
    }
    
    /**
     * Canları belirli bir değere ayarla
     */
    setLives(amount) {
        this.lives = Math.max(0, Math.min(amount, this.maxLives));
        this.onLivesUpdate(this.lives);
        
        console.log('🔧 Can ayarlandı:', this.lives);
    }
    
    /**
     * Can yenileme sistemini başlat
     */
    startLifeRegeneration() {
        if (!this.lifeRegenEnabled) return;
        if (this.lives >= this.maxLives) return;
        
        // Var olan timer'ı temizle
        if (this.regenTimer) {
            clearInterval(this.regenTimer);
        }
        
        this.regenTimer = setInterval(() => {
            const timeSinceLastLife = Date.now() - this.lastLifeTime;
            
            // 30 dakikada 1 can
            if (timeSinceLastLife >= this.regenIntervalMs) {
                if (this.lives < this.maxLives) {
                    this.gainLives(1);
                    this.lastLifeTime = Date.now();
                    
                    console.log('⏰ Otomatik can yenilendi');
                }
                
                // Maksimum cana ulaşıldıysa timer'ı durdur
                if (this.lives >= this.maxLives) {
                    clearInterval(this.regenTimer);
                    this.regenTimer = null;
                }
            }
        }, 60000); // Her dakika kontrol et
    }
    
    /**
     * Ödül kalkanını aktifleştir (reklam sonrası)
     */
    activateRewardShield(durationMs = 4000) {
        this.rewardShieldUntil = Date.now() + durationMs;
        console.log('🛡️ Ödül kalkanı aktif:', new Date(this.rewardShieldUntil).toISOString());
    }
    
    /**
     * Oyun sonu yönetimi
     */
    handleGameOver() {
        console.log('💀 GAME OVER - Can bitti!');
        
        // Callback çağır
        this.onGameOver({
            lives: this.lives
        });
        
        // Timer'ı durdur
        if (this.regenTimer) {
            clearInterval(this.regenTimer);
            this.regenTimer = null;
        }
    }
    
    /**
     * Canları LocalStorage'a kaydet
     */
    saveLives() {
        try {
            localStorage.setItem('lives', this.lives.toString());
            localStorage.setItem('lastLifeTime', this.lastLifeTime.toString());
            console.log('💾 Canlar kaydedildi:', this.lives);
        } catch (e) {
            console.error('❌ Can kaydetme hatası:', e);
        }
    }
    
    /**
     * Canları LocalStorage'dan yükle
     */
    loadLives() {
        try {
            const savedLives = localStorage.getItem('lives');
            const savedLastLifeTime = localStorage.getItem('lastLifeTime');
            
            if (savedLives) {
                this.lives = parseInt(savedLives);
            }
            
            if (savedLastLifeTime) {
                this.lastLifeTime = parseInt(savedLastLifeTime);
                
                // Geçen süreye göre can yenile
                this.checkAndRegenerateLives();
            }
            
            console.log('📥 Canlar yüklendi:', this.lives);
            
            // Can yenileme sistemini başlat
            if (this.lives < this.maxLives) {
                this.startLifeRegeneration();
            }
        } catch (e) {
            console.error('❌ Can yükleme hatası:', e);
        }
    }
    
    /**
     * Geçen süreye göre can yenile
     */
    checkAndRegenerateLives() {
        if (this.lives >= this.maxLives) return;
        
        const timeSinceLastLife = Date.now() - this.lastLifeTime;
        const livesToRegen = Math.floor(timeSinceLastLife / this.regenIntervalMs);
        
        if (livesToRegen > 0) {
            const actualRegen = Math.min(livesToRegen, this.maxLives - this.lives);
            this.gainLives(actualRegen);
            
            console.log('⏰ Otomatik yenileme:', {
                regenerated: actualRegen,
                total: this.lives
            });
        }
    }
    
    /**
     * Kalan can yenileme süresini al (ms)
     */
    getTimeUntilNextLife() {
        if (this.lives >= this.maxLives) return 0;
        
        const timeSinceLastLife = Date.now() - this.lastLifeTime;
        const timeRemaining = this.regenIntervalMs - (timeSinceLastLife % this.regenIntervalMs);
        
        return Math.max(0, timeRemaining);
    }
    
    /**
     * Kalan süreyi formatla (MM:SS)
     */
    getFormattedTimeUntilNextLife() {
        const ms = this.getTimeUntilNextLife();
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * Can durumunu al
     */
    getStatus() {
        return {
            lives: this.lives,
            maxLives: this.maxLives,
            percentage: (this.lives / this.maxLives * 100).toFixed(0),
            timeUntilNextLife: this.getFormattedTimeUntilNextLife(),
            isGameOver: this.lives <= 0
        };
    }
    
    /**
     * Manager'ı temizle
     */
    cleanup() {
        if (this.regenTimer) {
            clearInterval(this.regenTimer);
            this.regenTimer = null;
        }
        this.saveLives();
    }
}
