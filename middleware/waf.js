// 🛡️ WAF (Web Application Firewall) Middleware
// Advanced security filtering for incoming requests

const fs = require('fs');
const path = require('path');

class WAF {
    constructor() {
        this.blockedIPs = new Set();
        this.suspiciousIPs = new Map(); // IP -> { count, lastAttempt }
        this.rateLimitByIP = new Map(); // IP -> { requests: [], blocked: false }
        
        // WAF Rules
        this.rules = {
            // SQL Injection patterns
            sqlInjection: [
                /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
                /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
                /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
                /(((\%27)|(\'))union)/i,
                /exec(\s|\+)+(s|x)p\w+/i,
                /UNION[^a-zA-Z0-9]/i,
                /SELECT[^a-zA-Z0-9]/i,
                /INSERT[^a-zA-Z0-9]/i,
                /DELETE[^a-zA-Z0-9]/i,
                /UPDATE[^a-zA-Z0-9]/i,
                /DROP[^a-zA-Z0-9]/i,
                /CREATE[^a-zA-Z0-9]/i,
                /ALTER[^a-zA-Z0-9]/i
            ],
            
            // XSS patterns
            xss: [
                /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
                /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
                /<object[\s\S]*?>[\s\S]*?<\/object>/gi,
                /<embed[\s\S]*?>[\s\S]*?<\/embed>/gi,
                /<applet[\s\S]*?>[\s\S]*?<\/applet>/gi,
                /javascript:/gi,
                /vbscript:/gi,
                /onload=/gi,
                /onerror=/gi,
                /onclick=/gi,
                /onmouseover=/gi,
                /alert\(/gi,
                /confirm\(/gi,
                /prompt\(/gi,
                /document\.cookie/gi,
                /document\.write/gi,
                /eval\(/gi,
                /setTimeout\(/gi,
                /setInterval\(/gi
            ],
            
            // Command Injection patterns
            commandInjection: [
                /[;&|`]|\$\(|\${/g,
                /\.\.\//g,
                /\/etc\/passwd/gi,
                /\/bin\/(sh|bash|csh|ksh|zsh)/gi,
                /cmd\.exe/gi,
                /powershell/gi,
                /wget|curl/gi,
                /nc\s+/gi,
                /netcat/gi
            ],
            
            // Path Traversal patterns
            pathTraversal: [
                /\.\.\//g,
                /\.\.\\/g,
                /%2e%2e%2f/gi,
                /%2e%2e/gi,
                /\.\.%2f/gi,
                /%c0%ae%c0%ae/gi,
                /%252e%252e%252f/gi
            ],
            
            // LDAP Injection patterns
            ldapInjection: [
                /\(\|/g,
                /\(\&/g,
                /\(\!/g,
                /\*\)/g,
                /\(\*\)/g
            ],
            
            // Suspicious User Agents
            suspiciousUserAgents: [
                /sqlmap/gi,
                /nmap/gi,
                /nikto/gi,
                /acunetix/gi,
                /nessus/gi,
                /openvas/gi,
                /w3af/gi,
                /burp/gi,
                /metasploit/gi,
                /hydra/gi,
                /gobuster/gi,
                /dirb/gi,
                /dirbuster/gi,
                /wpscan/gi,
                /skipfish/gi,
                /havij/gi,
                /pangolin/gi,
                /absinthe/gi
            ]
        };
        
        // Load blocked IPs from file
        this.loadBlockedIPs();
        
        // Clean up old entries every 30 minutes
        setInterval(() => this.cleanup(), 30 * 60 * 1000);
    }
    
    // Load blocked IPs from file
    loadBlockedIPs() {
        try {
            const blockedIPsFile = path.join(__dirname, '../config/blocked-ips.json');
            if (fs.existsSync(blockedIPsFile)) {
                const data = JSON.parse(fs.readFileSync(blockedIPsFile, 'utf8'));
                this.blockedIPs = new Set(data.ips || []);
            }
        } catch (error) {
            console.error('Blocked IPs yüklenirken hata:', error);
        }
    }
    
    // Save blocked IPs to file
    saveBlockedIPs() {
        try {
            const configDir = path.join(__dirname, '../config');
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir, { recursive: true });
            }
            
            const blockedIPsFile = path.join(configDir, 'blocked-ips.json');
            const data = {
                ips: Array.from(this.blockedIPs),
                lastUpdated: new Date().toISOString()
            };
            fs.writeFileSync(blockedIPsFile, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Blocked IPs kaydedilirken hata:', error);
        }
    }
    
    // Get client IP
    getClientIP(req) {
        return req.ip || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress ||
               (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
               req.headers['x-forwarded-for']?.split(',')[0] ||
               req.headers['x-real-ip'] ||
               '0.0.0.0';
    }
    
    // Check if IP is blocked
    isIPBlocked(ip) {
        return this.blockedIPs.has(ip);
    }
    
    // Block IP
    blockIP(ip, reason = 'Security violation') {
        this.blockedIPs.add(ip);
        this.saveBlockedIPs();
        this.logSecurityEvent('IP_BLOCKED', { ip, reason });
    }
    
    // Check rate limiting per IP
    checkRateLimit(ip) {
        const now = Date.now();
        const timeWindow = 60 * 1000; // 1 dakika
        const maxRequests = 120; // Dakikada max 120 request
        
        if (!this.rateLimitByIP.has(ip)) {
            this.rateLimitByIP.set(ip, { requests: [], blocked: false });
        }
        
        const ipData = this.rateLimitByIP.get(ip);
        
        // Eski requestleri temizle
        ipData.requests = ipData.requests.filter(time => now - time < timeWindow);
        
        // Yeni request ekle
        ipData.requests.push(now);
        
        // Rate limit kontrolü
        if (ipData.requests.length > maxRequests) {
            if (!ipData.blocked) {
                ipData.blocked = true;
                this.logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip, requests: ipData.requests.length });
                
                // Suspicious IP olarak işaretle
                this.markSuspiciousIP(ip, 'Rate limit exceeded');
            }
            return false;
        }
        
        return true;
    }
    
    // Mark IP as suspicious
    markSuspiciousIP(ip, reason) {
        if (!this.suspiciousIPs.has(ip)) {
            this.suspiciousIPs.set(ip, { count: 0, lastAttempt: Date.now(), reasons: [] });
        }
        
        const data = this.suspiciousIPs.get(ip);
        data.count++;
        data.lastAttempt = Date.now();
        data.reasons.push({ reason, timestamp: new Date().toISOString() });
        
        // 5 suspicious activity sonrası IP'yi engelle
        if (data.count >= 5) {
            this.blockIP(ip, `Multiple security violations: ${data.reasons.map(r => r.reason).join(', ')}`);
        }
    }
    
    // Check malicious patterns
    checkMaliciousPatterns(input, type) {
        if (!input || typeof input !== 'string') return false;
        
        const patterns = this.rules[type] || [];
        return patterns.some(pattern => pattern.test(input));
    }
    
    // Validate request
    validateRequest(req) {
        const violations = [];
        
        // URL kontrolü
        if (this.checkMaliciousPatterns(req.url, 'sqlInjection')) {
            violations.push('SQL Injection in URL');
        }
        if (this.checkMaliciousPatterns(req.url, 'xss')) {
            violations.push('XSS in URL');
        }
        if (this.checkMaliciousPatterns(req.url, 'pathTraversal')) {
            violations.push('Path Traversal in URL');
        }
        if (this.checkMaliciousPatterns(req.url, 'commandInjection')) {
            violations.push('Command Injection in URL');
        }
        
        // Headers kontrolü
        Object.keys(req.headers).forEach(header => {
            const value = req.headers[header];
            if (this.checkMaliciousPatterns(value, 'xss')) {
                violations.push(`XSS in header: ${header}`);
            }
            if (this.checkMaliciousPatterns(value, 'sqlInjection')) {
                violations.push(`SQL Injection in header: ${header}`);
            }
        });
        
        // User Agent kontrolü
        if (req.headers['user-agent'] && 
            this.checkMaliciousPatterns(req.headers['user-agent'], 'suspiciousUserAgents')) {
            violations.push('Suspicious User Agent');
        }
        
        // Body kontrolü (POST, PUT vb.)
        if (req.body) {
            const bodyStr = JSON.stringify(req.body);
            if (this.checkMaliciousPatterns(bodyStr, 'sqlInjection')) {
                violations.push('SQL Injection in body');
            }
            if (this.checkMaliciousPatterns(bodyStr, 'xss')) {
                violations.push('XSS in body');
            }
            if (this.checkMaliciousPatterns(bodyStr, 'commandInjection')) {
                violations.push('Command Injection in body');
            }
        }
        
        // Query parameters kontrolü
        if (req.query) {
            const queryStr = JSON.stringify(req.query);
            if (this.checkMaliciousPatterns(queryStr, 'sqlInjection')) {
                violations.push('SQL Injection in query');
            }
            if (this.checkMaliciousPatterns(queryStr, 'xss')) {
                violations.push('XSS in query');
            }
            if (this.checkMaliciousPatterns(queryStr, 'ldapInjection')) {
                violations.push('LDAP Injection in query');
            }
        }
        
        return violations;
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
            
            const logFile = path.join(logDir, 'waf.log');
            fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
        } catch (error) {
            console.error('WAF log yazma hatası:', error);
        }
    }
    
    // Clean up old entries
    cleanup() {
        const now = Date.now();
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        
        // Eski suspicious IP entries'i temizle
        for (const [ip, data] of this.suspiciousIPs.entries()) {
            if (data.lastAttempt < oneDayAgo) {
                this.suspiciousIPs.delete(ip);
            }
        }
        
        // Eski rate limit entries'i temizle
        for (const [ip, data] of this.rateLimitByIP.entries()) {
            data.requests = data.requests.filter(time => now - time < 60 * 1000);
            if (data.requests.length === 0) {
                this.rateLimitByIP.delete(ip);
            }
        }
    }
    
    // Main middleware function
    middleware() {
        return (req, res, next) => {
            const clientIP = this.getClientIP(req);
            
            // Blocked IP kontrolü
            if (this.isIPBlocked(clientIP)) {
                this.logSecurityEvent('BLOCKED_IP_ACCESS', { ip: clientIP, url: req.url });
                return res.status(403).json({
                    error: 'Access denied',
                    code: 'IP_BLOCKED',
                    reference: Date.now()
                });
            }
            
            // Rate limiting kontrolü
            if (!this.checkRateLimit(clientIP)) {
                return res.status(429).json({
                    error: 'Too many requests',
                    code: 'RATE_LIMIT_EXCEEDED',
                    retryAfter: 60
                });
            }
            
            // Malicious pattern kontrolü
            const violations = this.validateRequest(req);
            if (violations.length > 0) {
                this.markSuspiciousIP(clientIP, violations.join(', '));
                this.logSecurityEvent('SECURITY_VIOLATION', {
                    ip: clientIP,
                    url: req.url,
                    method: req.method,
                    violations: violations,
                    userAgent: req.headers['user-agent']
                });
                
                return res.status(403).json({
                    error: 'Security violation detected',
                    code: 'SECURITY_VIOLATION',
                    reference: Date.now()
                });
            }
            
            next();
        };
    }
}

// WAF instance oluştur ve export et
const waf = new WAF();
module.exports = waf.middleware(); 