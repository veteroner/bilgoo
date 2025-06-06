// 🔒 Security Headers Middleware
// Advanced security headers for enhanced protection

module.exports = (req, res, next) => {
    // 🛡️ X-Frame-Options - Clickjacking koruması
    res.setHeader('X-Frame-Options', 'DENY');
    
    // 🔒 X-Content-Type-Options - MIME sniffing koruması
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // 🚫 X-XSS-Protection - XSS koruması (eski tarayıcılar için)
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // 🔐 Referrer-Policy - Referrer bilgisi koruması
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // 🛡️ Permissions-Policy - Tarayıcı özelliklerini kısıtla
    res.setHeader('Permissions-Policy', [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'fullscreen=(self)',
        'payment=()',
        'usb=()',
        'accelerometer=()',
        'gyroscope=()',
        'magnetometer=()',
        'clipboard-read=()',
        'clipboard-write=(self)'
    ].join(', '));
    
    // 🔒 X-DNS-Prefetch-Control - DNS prefetch kontrolü
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    
    // 🚫 X-Download-Options - IE download koruması
    res.setHeader('X-Download-Options', 'noopen');
    
    // 🔐 X-Permitted-Cross-Domain-Policies - Adobe Flash koruması
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    
    // 🛡️ Cross-Origin-Embedder-Policy - Cross-origin embedding koruması
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    
    // 🔒 Cross-Origin-Opener-Policy - Cross-origin popup koruması
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    
    // 🚫 Cross-Origin-Resource-Policy - Cross-origin resource koruması
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    
    // 🔐 Cache-Control - Cache koruması
    if (req.url.includes('/api/')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    
    // 🛡️ Server bilgisini gizle
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');
    
    // 🔒 Custom security headers
    res.setHeader('X-Security-Policy', 'WAF-Protected');
    res.setHeader('X-Content-Security', 'Enhanced');
    
    next();
}; 