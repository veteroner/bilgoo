// 🔒 GÜVENLİ SERVER KONFİGÜRASYONU
// Express.js server with security features

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

// Security modules
const waf = require('./middleware/waf');
const securityHeaders = require('./middleware/security-headers');
const apiKeyManager = require('./middleware/api-key-manager');

const app = express();
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

// 🛡️ WAF (Web Application Firewall) - En önce yükle
app.use(waf);

// 🔒 Security Headers with Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'", // Geçici - sonradan nonce kullanılacak
                "https://www.googleapis.com",
                "https://apis.google.com", 
                "https://www.gstatic.com",
                "https://cdnjs.cloudflare.com",
                "https://*.firebaseapp.com",
                "https://*.firebaseio.com"
            ],
            styleSrc: [
                "'self'", 
                "'unsafe-inline'",
                "https://fonts.googleapis.com",
                "https://cdnjs.cloudflare.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com"
            ],
            imgSrc: [
                "'self'", 
                "data:", 
                "https:"
            ],
            connectSrc: [
                "'self'",
                "https://*.firebaseapp.com",
                "https://*.firebaseio.com", 
                "https://firestore.googleapis.com"
            ]
        }
    },
    hsts: {
        maxAge: 31536000, // 1 yıl
        includeSubDomains: true,
        preload: true
    }
}));

// 🔒 Additional Security Headers
app.use(securityHeaders);

// 📊 Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // Her IP için max 100 request
    message: {
        error: 'Çok fazla istek gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin.',
        code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika  
    max: 50, // API için daha sıkı limit
    message: {
        error: 'API rate limit aşıldı. Lütfen daha sonra tekrar deneyin.',
        code: 'API_RATE_LIMIT_EXCEEDED'
    }
});

app.use(limiter);
app.use('/api/', apiLimiter);

// 🗜️ Compression
app.use(compression());

// 🌐 CORS Configuration
app.use(cors({
    origin: function (origin, callback) {
        // Production'da sadece belirli domainlere izin ver
        const allowedOrigins = [
            'https://bilgoo.com',
            'https://www.bilgoo.com',
            'https://quiz.bilgoo.com'
        ];
        
        // Development ortamında localhost'a izin ver
        if (process.env.NODE_ENV !== 'production') {
            allowedOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000');
        }
        
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy tarafından engellendi'));
        }
    },
    credentials: true
}));

// 📝 Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🔒 HTTPS Redirect Middleware
app.use((req, res, next) => {
    // Production'da HTTPS zorunlu
    if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
        return res.redirect(301, `https://${req.get('Host')}${req.url}`);
    }
    next();
});

// 📁 Static Files (güvenli şekilde)
app.use(express.static(path.join(__dirname), {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : '1s',
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
        // Security headers for static files
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }
}));

// 🔑 API Routes - Environment Variables Endpoint
app.get('/api/config', apiKeyManager.validateRequest, (req, res) => {
    try {
        // Sadece production'da server-side'dan API anahtarları ver
        const config = {
            firebase: {
                apiKey: process.env.FIREBASE_API_KEY,
                authDomain: process.env.FIREBASE_AUTH_DOMAIN,
                databaseURL: process.env.FIREBASE_DATABASE_URL,
                projectId: process.env.FIREBASE_PROJECT_ID,
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.FIREBASE_APP_ID,
                measurementId: process.env.FIREBASE_MEASUREMENT_ID
            },
            security: {
                environment: process.env.NODE_ENV || 'development',
                rateLimit: {
                    windowMs: 15 * 60 * 1000,
                    max: 100
                }
            }
        };
        
        // Development'da placeholder değerler dön
        if (process.env.NODE_ENV !== 'production') {
            Object.keys(config.firebase).forEach(key => {
                if (!config.firebase[key]) {
                    config.firebase[key] = `DEV_${key.toUpperCase()}`;
                }
            });
        }
        
        res.json({
            success: true,
            config: config,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Config endpoint error:', error);
        res.status(500).json({
            success: false,
            error: 'Konfigürasyon alınamadı',
            code: 'CONFIG_ERROR'
        });
    }
});

// 🔒 Security Check Endpoint
app.get('/api/security/check', (req, res) => {
    const securityChecks = {
        https: req.secure || req.get('x-forwarded-proto') === 'https',
        headers: {
            xFrameOptions: !!req.get('x-frame-options'),
            contentSecurityPolicy: !!req.get('content-security-policy'),
            strictTransportSecurity: !!req.get('strict-transport-security')
        },
        clientIP: req.ip,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString()
    };
    
    res.json({
        success: true,
        security: securityChecks,
        score: Object.values(securityChecks.headers).filter(Boolean).length + (securityChecks.https ? 1 : 0)
    });
});

// 📊 Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 🔒 Security Log Endpoint
app.post('/api/security/log', apiKeyManager.validateRequest, (req, res) => {
    try {
        const { type, message, data } = req.body;
        
        // Security log'u dosyaya veya veritabanına kaydet
        const logEntry = {
            timestamp: new Date().toISOString(),
            type: type,
            message: message,
            data: data,
            ip: req.ip,
            userAgent: req.get('user-agent')
        };
        
        // Log dosyasına yaz (production'da database kullanın)
        const logPath = path.join(__dirname, 'logs', 'security.log');
        fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
        
        res.json({
            success: true,
            message: 'Güvenlik logu kaydedildi'
        });
        
    } catch (error) {
        console.error('Security log error:', error);
        res.status(500).json({
            success: false,
            error: 'Log kaydedilemedi'
        });
    }
});

// 🔄 Catch all - SPA routing için
app.get('*', (req, res) => {
    // Güvenlik kontrolü - sadece HTML dosyalarına izin ver
    if (req.path.includes('..') || req.path.includes('<') || req.path.includes('>')) {
        return res.status(400).json({
            error: 'Geçersiz dosya yolu',
            code: 'INVALID_PATH'
        });
    }
    
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 🚨 Error Handler
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    
    // Security log için kritik hataları kaydet
    if (error.type === 'security' || error.status === 403) {
        const securityLog = {
            timestamp: new Date().toISOString(),
            type: 'security_error',
            error: error.message,
            ip: req.ip,
            path: req.path,
            userAgent: req.get('user-agent')
        };
        
        try {
            const logPath = path.join(__dirname, 'logs', 'security.log');
            fs.appendFileSync(logPath, JSON.stringify(securityLog) + '\n');
        } catch (logError) {
            console.error('Log yazma hatası:', logError);
        }
    }
    
    res.status(error.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Sunucu hatası' : error.message,
        code: error.code || 'SERVER_ERROR'
    });
});

// 🚀 Server Start
function startServer() {
    // Logs klasörünü oluştur
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
    
    if (process.env.NODE_ENV === 'production') {
        // Production: HTTPS Server
        const credentials = {
            key: fs.readFileSync(process.env.SSL_KEY_PATH || './ssl/private.key'),
            cert: fs.readFileSync(process.env.SSL_CERT_PATH || './ssl/certificate.crt')
        };
        
        const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(HTTPS_PORT, () => {
            console.log(`🔒 HTTPS Server running on port ${HTTPS_PORT}`);
        });
        
        // HTTP'den HTTPS'e redirect
        const httpApp = express();
        httpApp.use((req, res) => {
            res.redirect(301, `https://${req.get('Host')}${req.url}`);
        });
        
        const httpServer = http.createServer(httpApp);
        httpServer.listen(80, () => {
            console.log('📄 HTTP Redirect Server running on port 80');
        });
        
    } else {
        // Development: HTTP Server
        const httpServer = http.createServer(app);
        httpServer.listen(PORT, () => {
            console.log(`🔧 Development Server running on port ${PORT}`);
            console.log(`📱 Access: http://localhost:${PORT}`);
        });
    }
}

// 🔥 Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM alındı, sunucu kapatılıyor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT alındı, sunucu kapatılıyor...');
    process.exit(0);
});

// Server'ı başlat
startServer();

module.exports = app; 