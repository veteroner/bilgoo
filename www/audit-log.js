// Audit Log Sistemi
// Kullanıcı aktivitelerini, veri işlemlerini ve güvenlik olaylarını kaydetmek için

const AuditLogger = {
    // Firebase referansları
    db: null,
    
    // Log seviyeleri
    levels: {
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'error',
        SECURITY: 'security',
        PRIVACY: 'privacy',
        DATA_ACCESS: 'data_access',
        USER_ACTION: 'user_action'
    },
    
    // Sistemi başlat
    init() {
        if (firebase && firebase.firestore) {
            this.db = firebase.firestore();
            this.setupUserActivityTracking();
        } else {
            console.error('Firebase Firestore bulunamadı');
        }
    },
    
    // Kullanıcı aktivite takibini kur
    setupUserActivityTracking() {
        // Sayfa yüklenme
        this.logUserAction('page_load', {
            page: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            timestamp: new Date()
        });
        
        // Sayfa kapatma
        window.addEventListener('beforeunload', () => {
            this.logUserAction('page_unload', {
                page: window.location.pathname,
                sessionDuration: Date.now() - this.sessionStart,
                timestamp: new Date()
            });
        });
        
        // Hata yakalama
        window.addEventListener('error', (event) => {
            this.logError('javascript_error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });
        
        this.sessionStart = Date.now();
    },
    
    // Genel log fonksiyonu
    async log(level, category, action, details = {}, userId = null) {
        try {
            const logEntry = {
                level: level,
                category: category,
                action: action,
                details: details,
                userId: userId || this.getCurrentUserId(),
                timestamp: new Date(),
                sessionId: this.getSessionId(),
                ipAddress: await this.getClientIP(),
                userAgent: navigator.userAgent,
                page: window.location.pathname,
                referrer: document.referrer
            };
            
            // Firestore'a kaydet
            await this.db.collection('audit_logs').add(logEntry);
            
            // Konsola da yazdır (development için)
            if (process.env.NODE_ENV === 'development') {
                console.log(`[AUDIT] ${level.toUpperCase()}: ${category} - ${action}`, details);
            }
            
        } catch (error) {
            console.error('Audit log kaydedilemedi:', error);
        }
    },
    
    // Kullanıcı aksiyonu kaydet
    async logUserAction(action, details = {}) {
        return this.log(this.levels.USER_ACTION, 'user_activity', action, details);
    },
    
    // Veri erişimi kaydet
    async logDataAccess(action, dataType, details = {}) {
        return this.log(this.levels.DATA_ACCESS, 'data_access', action, {
            dataType: dataType,
            ...details
        });
    },
    
    // Gizlilik olayı kaydet
    async logPrivacyEvent(action, details = {}) {
        return this.log(this.levels.PRIVACY, 'privacy', action, details);
    },
    
    // Güvenlik olayı kaydet
    async logSecurityEvent(action, details = {}) {
        return this.log(this.levels.SECURITY, 'security', action, details);
    },
    
    // Hata kaydet
    async logError(action, details = {}) {
        return this.log(this.levels.ERROR, 'error', action, details);
    },
    
    // Uyarı kaydet
    async logWarning(action, details = {}) {
        return this.log(this.levels.WARNING, 'warning', action, details);
    },
    
    // Bilgi kaydet
    async logInfo(action, details = {}) {
        return this.log(this.levels.INFO, 'info', action, details);
    },
    
    // Auth olayları
    async logAuthEvent(action, details = {}) {
        return this.log(this.levels.SECURITY, 'authentication', action, details);
    },
    
    // Özel GDPR log fonksiyonları
    async logGDPREvent(action, details = {}) {
        return this.log(this.levels.PRIVACY, 'gdpr_compliance', action, {
            ...details,
            regulation: 'GDPR',
            compliance: true
        });
    },
    
    // Veri işleme olayları
    async logDataProcessing(action, dataType, purpose, details = {}) {
        return this.log(this.levels.DATA_ACCESS, 'data_processing', action, {
            dataType: dataType,
            processingPurpose: purpose,
            legalBasis: details.legalBasis || 'consent',
            ...details
        });
    },
    
    // Çerez olayları
    async logCookieEvent(action, cookieType, details = {}) {
        return this.log(this.levels.PRIVACY, 'cookie_management', action, {
            cookieType: cookieType,
            ...details
        });
    },
    
    // Kullanıcı rızası olayları
    async logConsentEvent(action, consentType, granted, details = {}) {
        return this.log(this.levels.PRIVACY, 'user_consent', action, {
            consentType: consentType,
            granted: granted,
            ...details
        });
    },
    
    // Veri silme olayları
    async logDataDeletion(action, dataType, details = {}) {
        return this.log(this.levels.PRIVACY, 'data_deletion', action, {
            dataType: dataType,
            ...details
        });
    },
    
    // Hesap işlemleri
    async logAccountAction(action, details = {}) {
        return this.log(this.levels.USER_ACTION, 'account_management', action, details);
    },
    
    // Oyun aktiviteleri
    async logGameActivity(action, details = {}) {
        return this.log(this.levels.USER_ACTION, 'game_activity', action, details);
    },
    
    // Yardımcı fonksiyonlar
    getCurrentUserId() {
        if (firebase && firebase.auth && firebase.auth().currentUser) {
            return firebase.auth().currentUser.uid;
        }
        return null;
    },
    
    getSessionId() {
        if (!this.sessionId) {
            this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        return this.sessionId;
    },
    
    async getClientIP() {
        try {
            // Gerçek uygulamada IP adresi backend'den alınmalı
            // Gizlilik için IP adresini hash'leyebiliriz
            return 'hidden_for_privacy';
        } catch (error) {
            return 'unknown';
        }
    },
    
    // Log sorgulama fonksiyonları
    async getUserLogs(userId, limit = 100) {
        try {
            const snapshot = await this.db.collection('audit_logs')
                .where('userId', '==', userId)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Kullanıcı logları alınamadı:', error);
            return [];
        }
    },
    
    async getLogsByCategory(category, limit = 100) {
        try {
            const snapshot = await this.db.collection('audit_logs')
                .where('category', '==', category)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Kategori logları alınamadı:', error);
            return [];
        }
    },
    
    async getLogsByLevel(level, limit = 100) {
        try {
            const snapshot = await this.db.collection('audit_logs')
                .where('level', '==', level)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Seviye logları alınamadı:', error);
            return [];
        }
    },
    
    async getLogsByDateRange(startDate, endDate, limit = 100) {
        try {
            const snapshot = await this.db.collection('audit_logs')
                .where('timestamp', '>=', startDate)
                .where('timestamp', '<=', endDate)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Tarih aralığı logları alınamadı:', error);
            return [];
        }
    },
    
    // Log analizi
    async generateLogReport(filters = {}) {
        try {
            const report = {
                generatedAt: new Date(),
                period: filters.period || 'last_30_days',
                totalLogs: 0,
                logsByLevel: {},
                logsByCategory: {},
                topUsers: [],
                topActions: [],
                securityEvents: 0,
                privacyEvents: 0,
                errors: 0
            };
            
            // Tarih aralığını hesapla
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            
            // Logları al
            const logs = await this.getLogsByDateRange(startDate, endDate, 1000);
            report.totalLogs = logs.length;
            
            // Analiz yap
            const levelCounts = {};
            const categoryCounts = {};
            const userCounts = {};
            const actionCounts = {};
            
            logs.forEach(log => {
                // Seviye analizi
                levelCounts[log.level] = (levelCounts[log.level] || 0) + 1;
                
                // Kategori analizi
                categoryCounts[log.category] = (categoryCounts[log.category] || 0) + 1;
                
                // Kullanıcı analizi
                if (log.userId) {
                    userCounts[log.userId] = (userCounts[log.userId] || 0) + 1;
                }
                
                // Aksiyon analizi
                actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
                
                // Özel sayılar
                if (log.level === this.levels.SECURITY) {
                    report.securityEvents++;
                }
                if (log.level === this.levels.PRIVACY) {
                    report.privacyEvents++;
                }
                if (log.level === this.levels.ERROR) {
                    report.errors++;
                }
            });
            
            report.logsByLevel = levelCounts;
            report.logsByCategory = categoryCounts;
            
            // En aktif kullanıcıları sırala
            report.topUsers = Object.entries(userCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([userId, count]) => ({ userId, count }));
            
            // En çok yapılan aksiyonları sırala
            report.topActions = Object.entries(actionCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([action, count]) => ({ action, count }));
            
            // Raporu kaydet
            await this.db.collection('audit_reports').add(report);
            
            return report;
        } catch (error) {
            console.error('Log raporu oluşturulamadı:', error);
            throw error;
        }
    },
    
    // Güvenlik tehdidi algılama
    async detectSuspiciousActivity(userId) {
        try {
            const last24Hours = new Date();
            last24Hours.setHours(last24Hours.getHours() - 24);
            
            const userLogs = await this.db.collection('audit_logs')
                .where('userId', '==', userId)
                .where('timestamp', '>=', last24Hours)
                .get();
            
            const logs = userLogs.docs.map(doc => doc.data());
            
            // Şüpheli aktivite kontrolü
            const suspiciousPatterns = {
                tooManyFailedLogins: logs.filter(log => log.action === 'login_failed').length > 10,
                tooManyDataAccess: logs.filter(log => log.category === 'data_access').length > 100,
                unusualHours: logs.filter(log => {
                    const hour = new Date(log.timestamp.toDate()).getHours();
                    return hour < 6 || hour > 22;
                }).length > 20,
                multipleIPs: new Set(logs.map(log => log.ipAddress)).size > 5
            };
            
            const isSuspicious = Object.values(suspiciousPatterns).some(pattern => pattern);
            
            if (isSuspicious) {
                await this.logSecurityEvent('suspicious_activity_detected', {
                    userId: userId,
                    patterns: suspiciousPatterns,
                    logCount: logs.length
                });
            }
            
            return { isSuspicious, patterns: suspiciousPatterns };
        } catch (error) {
            console.error('Şüpheli aktivite algılama hatası:', error);
            return { isSuspicious: false, patterns: {}, error: error.message };
        }
    }
};

// Sistem başlatıldığında audit logger'ı başlat
document.addEventListener('DOMContentLoaded', () => {
    if (typeof firebase !== 'undefined') {
        setTimeout(() => {
            AuditLogger.init();
        }, 2000);
    }
});

// Global erişim için
window.AuditLogger = AuditLogger;

// Yaygın olaylar için wrapper fonksiyonlar
window.logUserLogin = (method) => AuditLogger.logAuthEvent('login_success', { method });
window.logUserLogout = () => AuditLogger.logAuthEvent('logout', {});
window.logUserRegistration = (method) => AuditLogger.logAuthEvent('registration_success', { method });
window.logGameStart = (category) => AuditLogger.logGameActivity('game_start', { category });
window.logGameEnd = (category, score) => AuditLogger.logGameActivity('game_end', { category, score });
window.logProfileView = (targetUserId) => AuditLogger.logDataAccess('profile_view', 'user_profile', { targetUserId });
window.logSettingsChange = (settingType, oldValue, newValue) => AuditLogger.logUserAction('settings_change', { settingType, oldValue, newValue });
window.logDataExport = (dataType) => AuditLogger.logGDPREvent('data_export', { dataType });
window.logDataDeletion = (dataType) => AuditLogger.logGDPREvent('data_deletion', { dataType });
window.logConsentGiven = (consentType) => AuditLogger.logConsentEvent('consent_given', consentType, true);
window.logConsentRevoked = (consentType) => AuditLogger.logConsentEvent('consent_revoked', consentType, false); 