// 🔑 API Key Manager Middleware
// Secure API key validation and management

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class APIKeyManager {
    constructor() {
        this.validKeys = new Set();
        this.keyUsage = new Map(); // key -> { usage: number, lastUsed: timestamp }
        this.rateLimits = new Map(); // key -> { requests: [], limit: number }
        
        // Load API keys from secure storage
        this.loadAPIKeys();
        
        // Generate master key if not exists
        this.generateMasterKey();
    }
    
    // Load API keys from secure file
    loadAPIKeys() {
        try {
            const keysFile = path.join(__dirname, '../config/api-keys.json');
            if (fs.existsSync(keysFile)) {
                const data = JSON.parse(fs.readFileSync(keysFile, 'utf8'));
                this.validKeys = new Set(data.keys || []);
                
                // Load usage data
                if (data.usage) {
                    this.keyUsage = new Map(Object.entries(data.usage));
                }
            } else {
                // İlk kez çalıştırılıyorsa default key oluştur
                this.generateDefaultKeys();
            }
        } catch (error) {
            console.error('API keys yüklenirken hata:', error);
            this.generateDefaultKeys();
        }
    }
    
    // Save API keys to secure file
    saveAPIKeys() {
        try {
            const configDir = path.join(__dirname, '../config');
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir, { recursive: true });
            }
            
            const keysFile = path.join(configDir, 'api-keys.json');
            
            // Usage verilerini object'e çevir
            const usageObj = {};
            this.keyUsage.forEach((value, key) => {
                usageObj[key] = value;
            });
            
            const data = {
                keys: Array.from(this.validKeys),
                usage: usageObj,
                lastUpdated: new Date().toISOString()
            };
            
            // Dosyayı güvenli izinlerle yaz
            fs.writeFileSync(keysFile, JSON.stringify(data, null, 2), { mode: 0o600 });
        } catch (error) {
            console.error('API keys kaydedilirken hata:', error);
        }
    }
    
    // Generate default API keys
    generateDefaultKeys() {
        // Production ve development için farklı keyler
        const isProduction = process.env.NODE_ENV === 'production';
        
        if (isProduction) {
            // Production'da güvenli keyler oluştur
            for (let i = 0; i < 3; i++) {
                const key = this.generateSecureAPIKey();
                this.validKeys.add(key);
            }
        } else {
            // Development'da test keyleri
            this.validKeys.add('dev-key-12345');
            this.validKeys.add('test-key-67890');
        }
        
        this.saveAPIKeys();
        console.log(`✅ ${this.validKeys.size} API key oluşturuldu`);
    }
    
    // Generate secure API key
    generateSecureAPIKey() {
        const prefix = process.env.NODE_ENV === 'production' ? 'pk_' : 'sk_';
        const randomBytes = crypto.randomBytes(32).toString('hex');
        const timestamp = Date.now().toString(36);
        
        return `${prefix}${timestamp}_${randomBytes}`;
    }
    
    // Generate master key for encryption
    generateMasterKey() {
        const masterKeyFile = path.join(__dirname, '../config/master.key');
        
        if (!fs.existsSync(masterKeyFile)) {
            const masterKey = crypto.randomBytes(64).toString('hex');
            
            try {
                const configDir = path.join(__dirname, '../config');
                if (!fs.existsSync(configDir)) {
                    fs.mkdirSync(configDir, { recursive: true });
                }
                
                fs.writeFileSync(masterKeyFile, masterKey, { mode: 0o600 });
                console.log('🔑 Master key oluşturuldu');
            } catch (error) {
                console.error('Master key oluşturulamadı:', error);
            }
        }
    }
    
    // Validate API key
    validateAPIKey(key) {
        if (!key || typeof key !== 'string') {
            return false;
        }
        
        // Key formatını kontrol et
        if (!this.isValidKeyFormat(key)) {
            return false;
        }
        
        // Key'in geçerli olup olmadığını kontrol et
        return this.validKeys.has(key);
    }
    
    // Check API key format
    isValidKeyFormat(key) {
        // Production key: pk_xxxxx_xxxxx
        // Development key: sk_xxxxx_xxxxx veya dev-key-xxxxx
        const productionPattern = /^pk_[a-zA-Z0-9]+_[a-f0-9]{64}$/;
        const developmentPattern = /^(sk_[a-zA-Z0-9]+_[a-f0-9]{64}|dev-key-\d+|test-key-\d+)$/;
        
        return productionPattern.test(key) || developmentPattern.test(key);
    }
    
    // Check rate limiting for API key
    checkRateLimit(key) {
        const now = Date.now();
        const timeWindow = 60 * 1000; // 1 dakika
        const maxRequests = 100; // Dakikada max 100 request
        
        if (!this.rateLimits.has(key)) {
            this.rateLimits.set(key, { requests: [], limit: maxRequests });
        }
        
        const keyData = this.rateLimits.get(key);
        
        // Eski requestleri temizle
        keyData.requests = keyData.requests.filter(time => now - time < timeWindow);
        
        // Yeni request ekle
        keyData.requests.push(now);
        
        // Rate limit kontrolü
        return keyData.requests.length <= keyData.limit;
    }
    
    // Track API key usage
    trackUsage(key) {
        if (!this.keyUsage.has(key)) {
            this.keyUsage.set(key, { usage: 0, lastUsed: new Date().toISOString() });
        }
        
        const usage = this.keyUsage.get(key);
        usage.usage++;
        usage.lastUsed = new Date().toISOString();
        
        // Her 100 kullanımda bir kaydet
        if (usage.usage % 100 === 0) {
            this.saveAPIKeys();
        }
    }
    
    // Extract API key from request
    extractAPIKey(req) {
        // Authorization header'dan
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        
        // Query parameter'dan
        if (req.query.api_key) {
            return req.query.api_key;
        }
        
        // X-API-Key header'dan
        if (req.headers['x-api-key']) {
            return req.headers['x-api-key'];
        }
        
        return null;
    }
    
    // Get usage statistics
    getUsageStats(key) {
        if (!this.keyUsage.has(key)) {
            return { usage: 0, lastUsed: null };
        }
        
        return this.keyUsage.get(key);
    }
    
    // Revoke API key
    revokeAPIKey(key) {
        if (this.validKeys.has(key)) {
            this.validKeys.delete(key);
            this.keyUsage.delete(key);
            this.rateLimits.delete(key);
            this.saveAPIKeys();
            
            // Güvenlik logu
            this.logSecurityEvent('API_KEY_REVOKED', { key: key.substring(0, 10) + '...' });
            return true;
        }
        return false;
    }
    
    // Create new API key
    createAPIKey() {
        const newKey = this.generateSecureAPIKey();
        this.validKeys.add(newKey);
        this.saveAPIKeys();
        
        // Güvenlik logu
        this.logSecurityEvent('API_KEY_CREATED', { key: newKey.substring(0, 10) + '...' });
        
        return newKey;
    }
    
    // Log security events
    logSecurityEvent(type, data) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type: type,
            data: data
        };
        
        try {
            const logDir = path.join(__dirname, '../logs');
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }
            
            const logFile = path.join(logDir, 'api-keys.log');
            fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
        } catch (error) {
            console.error('API key log yazma hatası:', error);
        }
    }
    
    // Middleware function for validating requests
    validateRequest(req, res, next) {
        const apiKey = this.extractAPIKey(req);
        
        // Development ortamında bazı endpoint'leri atla
        if (process.env.NODE_ENV !== 'production') {
            const skipPaths = ['/api/health', '/api/security/check'];
            if (skipPaths.includes(req.path)) {
                return next();
            }
        }
        
        if (!apiKey) {
            return res.status(401).json({
                error: 'API anahtarı gerekli',
                code: 'API_KEY_REQUIRED',
                details: 'Authorization header, x-api-key header veya api_key query parameter kullanın'
            });
        }
        
        if (!this.validateAPIKey(apiKey)) {
            this.logSecurityEvent('INVALID_API_KEY', { 
                key: apiKey.substring(0, 10) + '...',
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });
            
            return res.status(403).json({
                error: 'Geçersiz API anahtarı',
                code: 'INVALID_API_KEY'
            });
        }
        
        if (!this.checkRateLimit(apiKey)) {
            return res.status(429).json({
                error: 'API rate limit aşıldı',
                code: 'API_RATE_LIMIT_EXCEEDED',
                retryAfter: 60
            });
        }
        
        // Usage'ı track et
        this.trackUsage(apiKey);
        
        // Request'e API key bilgisini ekle
        req.apiKey = apiKey;
        req.apiKeyStats = this.getUsageStats(apiKey);
        
        next();
    }
}

// API Key Manager instance oluştur
const apiKeyManager = new APIKeyManager();

module.exports = {
    validateRequest: (req, res, next) => apiKeyManager.validateRequest(req, res, next),
    createKey: () => apiKeyManager.createAPIKey(),
    revokeKey: (key) => apiKeyManager.revokeAPIKey(key),
    getStats: (key) => apiKeyManager.getUsageStats(key),
    manager: apiKeyManager
}; 