/**
 * Ana giriş noktası - Vite tarafından yüklenir
 * Platform tespiti ve layout yönetimi
 */

// NOT: Desktop header ve homepage şu an public/script.js'de
// Vite modül sistemi ile çakışma olduğu için geçici olarak devre dışı

console.log('🚀 Bilgoo başlatılıyor...');
console.log('⚡ Vite build sistemi aktif');

// Platform bilgisi
const isMobile = window.innerWidth < 1024;
window.__BILGOO_PLATFORM__ = {
    isMobile,
    isDesktop: !isMobile,
    timestamp: Date.now()
};

console.log('📱 Platform:', isMobile ? 'Mobile' : 'Desktop');
