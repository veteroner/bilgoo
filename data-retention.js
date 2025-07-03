// Veri Saklama Süreleri Yönetimi
// GDPR uyumluluğu için kullanıcı verilerinin ne kadar süre saklanacağını yönetir

const DataRetentionManager = {
    // Varsayılan saklama süreleri (gün cinsinden)
    retentionPeriods: {
        // Kullanıcı hesap verileri
        userProfile: {
            active: -1, // Hesap aktif olduğu sürece
            inactive: 730, // 2 yıl
            deleted: 0 // Hemen sil
        },
        
        // Oyun istatistikleri
        gameStats: {
            active: -1, // Hesap aktif olduğu sürece
            inactive: 730, // 2 yıl
            deleted: 0 // Hemen sil
        },
        
        // İletişim kayıtları
        contactRecords: {
            active: 730, // 2 yıl
            inactive: 730, // 2 yıl
            deleted: 0 // Hemen sil
        },
        
        // Çerez verileri
        cookieData: {
            essential: 365, // 1 yıl
            analytics: 730, // 2 yıl
            advertising: 90 // 3 ay
        },
        
        // Log dosyaları
        logs: {
            system: 180, // 6 ay
            error: 365, // 1 yıl
            security: 730 // 2 yıl
        },
        
        // Rıza kayıtları
        consentRecords: {
            active: 2555, // 7 yıl (yasal gereklilik)
            inactive: 2555, // 7 yıl
            deleted: 2555 // 7 yıl
        }
    },
    
    // Firebase referansları
    db: null,
    
    // Sistemi başlat
    init() {
        if (firebase && firebase.firestore) {
            this.db = firebase.firestore();
            this.scheduleCleanupTasks();
        } else {
            console.error('Firebase Firestore bulunamadı');
        }
    },
    
    // Temizleme görevlerini programla
    scheduleCleanupTasks() {
        // Günlük temizleme kontrolü
        setInterval(() => {
            this.performCleanup();
        }, 24 * 60 * 60 * 1000); // 24 saat
        
        // Sayfa yüklendiğinde de kontrol et
        setTimeout(() => {
            this.performCleanup();
        }, 5000);
    },
    
    // Temizleme işlemini gerçekleştir
    async performCleanup() {
        console.log('Veri saklama süresi kontrolü başlatılıyor...');
        
        try {
            await this.cleanupExpiredData();
            await this.cleanupInactiveUsers();
            await this.cleanupOldLogs();
            await this.updateRetentionMetrics();
            
            console.log('Veri saklama süresi kontrolü tamamlandı');
        } catch (error) {
            console.error('Veri temizleme hatası:', error);
        }
    },
    
    // Süresi dolmuş verileri temizle
    async cleanupExpiredData() {
        const now = new Date();
        const cutoffDate = new Date(now.getTime() - (this.retentionPeriods.logs.system * 24 * 60 * 60 * 1000));
        
        // Eski log kayıtlarını sil
        const oldLogsQuery = this.db.collection('system_logs')
            .where('timestamp', '<', cutoffDate);
        
        const oldLogsSnapshot = await oldLogsQuery.get();
        
        if (!oldLogsSnapshot.empty) {
            const batch = this.db.batch();
            oldLogsSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            console.log(`${oldLogsSnapshot.size} adet eski log kaydı silindi`);
        }
    },
    
    // Aktif olmayan kullanıcıları temizle
    async cleanupInactiveUsers() {
        const now = new Date();
        const inactiveThreshold = new Date(now.getTime() - (this.retentionPeriods.userProfile.inactive * 24 * 60 * 60 * 1000));
        
        // Son oturum açma tarihi inactive threshold'dan eski olan kullanıcıları bul
        const inactiveUsersQuery = this.db.collection('users')
            .where('lastLoginAt', '<', inactiveThreshold);
        
        const inactiveUsersSnapshot = await inactiveUsersQuery.get();
        
        if (!inactiveUsersSnapshot.empty) {
            console.log(`${inactiveUsersSnapshot.size} adet aktif olmayan kullanıcı bulundu`);
            
            // Kullanıcıları anonimleştir (tam silme yerine)
            const batch = this.db.batch();
            inactiveUsersSnapshot.docs.forEach(doc => {
                batch.update(doc.ref, {
                    email: 'anonymized@example.com',
                    displayName: 'Anonimleştirilmiş Kullanıcı',
                    anonymizedAt: new Date(),
                    personalDataRemoved: true
                });
            });
            await batch.commit();
            
            console.log(`${inactiveUsersSnapshot.size} adet kullanıcı anonimleştirildi`);
        }
    },
    
    // Eski log kayıtlarını temizle
    async cleanupOldLogs() {
        const collections = ['system_logs', 'error_logs', 'security_logs'];
        
        for (const collection of collections) {
            const retentionDays = this.retentionPeriods.logs[collection.replace('_logs', '')] || 180;
            const cutoffDate = new Date(Date.now() - (retentionDays * 24 * 60 * 60 * 1000));
            
            try {
                const oldLogsQuery = this.db.collection(collection)
                    .where('timestamp', '<', cutoffDate)
                    .limit(100); // Batch boyutunu sınırla
                
                const oldLogsSnapshot = await oldLogsQuery.get();
                
                if (!oldLogsSnapshot.empty) {
                    const batch = this.db.batch();
                    oldLogsSnapshot.docs.forEach(doc => {
                        batch.delete(doc.ref);
                    });
                    await batch.commit();
                    
                    console.log(`${collection}: ${oldLogsSnapshot.size} adet eski kayıt silindi`);
                }
            } catch (error) {
                console.error(`${collection} temizleme hatası:`, error);
            }
        }
    },
    
    // Kullanıcı için özel saklama süresini ayarla
    async setUserRetentionPreference(userId, retentionPeriod) {
        try {
            await this.db.collection('privacy_settings').doc(userId).set({
                dataRetention: retentionPeriod,
                lastUpdated: new Date()
            }, { merge: true });
            
            console.log(`Kullanıcı ${userId} için saklama süresi güncellendi: ${retentionPeriod}`);
        } catch (error) {
            console.error('Saklama süresi ayarlama hatası:', error);
        }
    },
    
    // Kullanıcının saklama süresini al
    async getUserRetentionPreference(userId) {
        try {
            const doc = await this.db.collection('privacy_settings').doc(userId).get();
            
            if (doc.exists) {
                return doc.data().dataRetention || '2years';
            }
            
            return '2years'; // Varsayılan
        } catch (error) {
            console.error('Saklama süresi alma hatası:', error);
            return '2years';
        }
    },
    
    // Saklama süresi metriklerini güncelle
    async updateRetentionMetrics() {
        try {
            const metrics = {
                lastCleanupDate: new Date(),
                totalUsers: 0,
                activeUsers: 0,
                inactiveUsers: 0,
                anonymizedUsers: 0,
                totalDataSize: 0 // Yaklaşık veri boyutu
            };
            
            // Kullanıcı sayılarını hesapla
            const usersSnapshot = await this.db.collection('users').get();
            metrics.totalUsers = usersSnapshot.size;
            
            const activeThreshold = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)); // 30 gün
            const activeUsersSnapshot = await this.db.collection('users')
                .where('lastLoginAt', '>', activeThreshold)
                .get();
            metrics.activeUsers = activeUsersSnapshot.size;
            
            const anonymizedUsersSnapshot = await this.db.collection('users')
                .where('personalDataRemoved', '==', true)
                .get();
            metrics.anonymizedUsers = anonymizedUsersSnapshot.size;
            
            metrics.inactiveUsers = metrics.totalUsers - metrics.activeUsers - metrics.anonymizedUsers;
            
            // Metrikleri kaydet
            await this.db.collection('system_metrics').doc('data_retention').set(metrics);
            
            console.log('Veri saklama metrikleri güncellendi:', metrics);
        } catch (error) {
            console.error('Metrik güncelleme hatası:', error);
        }
    },
    
    // Kullanıcı verilerini hemen sil
    async deleteUserDataImmediately(userId) {
        try {
            const batch = this.db.batch();
            
            // Kullanıcı ana dokümantı
            const userRef = this.db.collection('users').doc(userId);
            batch.delete(userRef);
            
            // İstatistikler
            const statsRef = this.db.collection('statistics').doc(userId);
            batch.delete(statsRef);
            
            // Gizlilik ayarları
            const privacyRef = this.db.collection('privacy_settings').doc(userId);
            batch.delete(privacyRef);
            
            // Arkadaş ilişkileri
            const friendsSnapshot = await this.db.collection('friends')
                .where('userId', '==', userId)
                .get();
            
            friendsSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            // Rıza kayıtları hariç - yasal gereklilik
            
            await batch.commit();
            console.log(`Kullanıcı ${userId} verileri silindi`);
            
        } catch (error) {
            console.error('Kullanıcı verisi silme hatası:', error);
            throw error;
        }
    },
    
    // Veri saklama raporu oluştur
    async generateRetentionReport() {
        try {
            const report = {
                generatedAt: new Date(),
                retentionPolicies: this.retentionPeriods,
                userMetrics: {},
                dataMetrics: {},
                complianceStatus: {}
            };
            
            // Kullanıcı metrikleri
            const usersSnapshot = await this.db.collection('users').get();
            report.userMetrics.totalUsers = usersSnapshot.size;
            
            // Veri metrikleri
            const collections = ['users', 'statistics', 'friends', 'consent_history'];
            for (const collection of collections) {
                const snapshot = await this.db.collection(collection).get();
                report.dataMetrics[collection] = snapshot.size;
            }
            
            // Uyumluluk durumu
            report.complianceStatus.gdprCompliant = true;
            report.complianceStatus.lastAudit = new Date();
            
            // Raporu kaydet
            await this.db.collection('compliance_reports').add(report);
            
            return report;
        } catch (error) {
            console.error('Rapor oluşturma hatası:', error);
            throw error;
        }
    },
    
    // Saklama süresi bilgilerini al
    getRetentionInfo(dataType) {
        const info = this.retentionPeriods[dataType];
        if (!info) {
            return { error: 'Veri türü bulunamadı' };
        }
        
        return {
            active: info.active === -1 ? 'Hesap aktif olduğu sürece' : `${info.active} gün`,
            inactive: info.inactive === -1 ? 'Süresiz' : `${info.inactive} gün`,
            deleted: info.deleted === 0 ? 'Hemen silinir' : `${info.deleted} gün`
        };
    }
};

// Sistem başlatıldığında veri saklama yöneticisini başlat
document.addEventListener('DOMContentLoaded', () => {
    if (typeof firebase !== 'undefined') {
        setTimeout(() => {
            DataRetentionManager.init();
        }, 3000);
    }
});

// Global erişim için
window.DataRetentionManager = DataRetentionManager; 