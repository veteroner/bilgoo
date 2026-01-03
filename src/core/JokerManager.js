/**
 * JokerManager.js - Joker sistemi yönetimi
 * Faz 2: Core Modül Çıkarımı
 */

export class JokerManager {
    constructor(config = {}) {
        // Joker envanteri
        this.inventory = {
            fifty: 0,    // 50:50
            hint: 0,     // İpucu
            time: 0,     // Süre
            skip: 0      // Pas
        };
        
        // Joker kullanım durumları (mevcut soru için)
        this.used = {
            fifty: false,
            hint: false,
            time: false,
            skip: false
        };
        
        // Joker fiyatları (puan)
        this.prices = config.prices || {
            fifty: 50,
            hint: 30,
            time: 40,
            skip: 20
        };
        
        // Callbacks
        this.onInventoryUpdate = config.onInventoryUpdate || (() => {});
        this.onJokerUsed = config.onJokerUsed || (() => {});
        this.onJokerPurchased = config.onJokerPurchased || (() => {});
    }
    
    /**
     * Joker satın al
     * @param {string} jokerType - Joker tipi
     * @param {number} availablePoints - Mevcut puan
     */
    purchase(jokerType, availablePoints) {
        const price = this.prices[jokerType];
        
        if (!price) {
            console.error('❌ Geçersiz joker tipi:', jokerType);
            return { success: false, reason: 'invalid_type' };
        }
        
        if (availablePoints < price) {
            console.warn('⚠️ Yeterli puan yok!');
            return { success: false, reason: 'insufficient_points' };
        }
        
        // Envantere ekle
        const previousCount = this.inventory[jokerType] || 0;
        this.inventory[jokerType]++;
        
        // Callback çağır
        this.onJokerPurchased({
            jokerType,
            price,
            newCount: this.inventory[jokerType],
            previousCount
        });
        
        this.onInventoryUpdate(this.inventory);
        
        // LocalStorage'a kaydet
        this.saveInventory();
        
        console.log('🛒 Joker satın alındı:', {
            type: jokerType,
            price,
            count: `${previousCount} → ${this.inventory[jokerType]}`
        });
        
        return {
            success: true,
            price,
            newCount: this.inventory[jokerType]
        };
    }
    
    /**
     * Joker kullan
     * @param {string} jokerType - Joker tipi
     */
    use(jokerType) {
        // Envanter kontrolü
        if (!this.inventory[jokerType] || this.inventory[jokerType] <= 0) {
            console.warn('⚠️ Jokerin envanteri yok:', jokerType);
            return { success: false, reason: 'not_in_inventory' };
        }
        
        // Kullanım kontrolü
        if (this.used[jokerType]) {
            console.warn('⚠️ Joker bu soruda zaten kullanılmış:', jokerType);
            return { success: false, reason: 'already_used' };
        }
        
        // Envanterde azalt
        this.inventory[jokerType]--;
        
        // Kullanıldı olarak işaretle
        this.used[jokerType] = true;
        
        // Callback çağır
        this.onJokerUsed({
            jokerType,
            remainingCount: this.inventory[jokerType]
        });
        
        this.onInventoryUpdate(this.inventory);
        
        // LocalStorage'a kaydet
        this.saveInventory();
        
        console.log('🃏 Joker kullanıldı:', {
            type: jokerType,
            remaining: this.inventory[jokerType]
        });
        
        return { success: true };
    }
    
    /**
     * Reklam izleyerek joker kazan
     * @param {string} jokerType - Joker tipi
     */
    earnFromAd(jokerType) {
        this.inventory[jokerType] = (this.inventory[jokerType] || 0) + 1;
        
        this.onInventoryUpdate(this.inventory);
        this.saveInventory();
        
        console.log('🎬 Reklamdan joker kazanıldı:', {
            type: jokerType,
            count: this.inventory[jokerType]
        });
        
        return this.inventory[jokerType];
    }
    
    /**
     * Joker kullanımlarını sıfırla (yeni soru için)
     */
    resetUsage() {
        this.used = {
            fifty: false,
            hint: false,
            time: false,
            skip: false
        };
        
        console.log('🔄 Joker kullanımları sıfırlandı');
    }
    
    /**
     * Belirli bir jokerin kullanılabilir olup olmadığını kontrol et
     */
    isAvailable(jokerType) {
        return (
            this.inventory[jokerType] > 0 && 
            !this.used[jokerType]
        );
    }
    
    /**
     * Joker durumunu al
     */
    getStatus(jokerType) {
        return {
            count: this.inventory[jokerType] || 0,
            used: this.used[jokerType] || false,
            available: this.isAvailable(jokerType),
            price: this.prices[jokerType]
        };
    }
    
    /**
     * Tüm joker durumlarını al
     */
    getAllStatus() {
        return {
            fifty: this.getStatus('fifty'),
            hint: this.getStatus('hint'),
            time: this.getStatus('time'),
            skip: this.getStatus('skip')
        };
    }
    
    /**
     * Envanterin tamamını al
     */
    getInventory() {
        return { ...this.inventory };
    }
    
    /**
     * Envanteri ayarla (Firebase'den yükleme için)
     */
    setInventory(inventory) {
        this.inventory = {
            fifty: inventory.fifty || 0,
            hint: inventory.hint || 0,
            time: inventory.time || 0,
            skip: inventory.skip || 0
        };
        
        this.onInventoryUpdate(this.inventory);
        
        console.log('📥 Joker envanteri yüklendi:', this.inventory);
    }
    
    /**
     * LocalStorage'a kaydet
     */
    saveInventory() {
        try {
            localStorage.setItem('jokerInventory', JSON.stringify(this.inventory));
            console.log('💾 Joker envanteri kaydedildi');
        } catch (e) {
            console.error('❌ Joker kaydetme hatası:', e);
        }
    }
    
    /**
     * LocalStorage'dan yükle
     */
    loadInventory() {
        try {
            const saved = localStorage.getItem('jokerInventory');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.setInventory(parsed);
            }
        } catch (e) {
            console.error('❌ Joker yükleme hatası:', e);
        }
    }
    
    /**
     * Joker adını al (çeviri için)
     */
    getJokerName(jokerType, language = 'tr') {
        const names = {
            tr: {
                fifty: '50:50',
                hint: 'İpucu',
                time: 'Süre',
                skip: 'Pas'
            },
            en: {
                fifty: '50:50',
                hint: 'Hint',
                time: 'Time',
                skip: 'Skip'
            },
            de: {
                fifty: '50:50',
                hint: 'Hinweis',
                time: 'Zeit',
                skip: 'Überspringen'
            }
        };
        
        return names[language]?.[jokerType] || jokerType;
    }
}
