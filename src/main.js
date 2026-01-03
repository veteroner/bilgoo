/**
 * Ana giriş noktası - Vite tarafından yüklenir
 * Platform tespiti ve layout yönetimi
 */

// Stilleri import et
import './styles/desktop-layout.css';

// Core modül testlerini çalıştır
import './core/test-core-modules.js';

// Layout Manager'ı import et
import { LayoutManager } from './ui/layouts/LayoutManager.js';

// Platform tespiti
const isMobile = window.innerWidth < 1024;

// Platform bilgisini global olarak sakla
window.__BILGOO_PLATFORM__ = {
    isMobile,
    isDesktop: !isMobile,
    timestamp: Date.now()
};

console.log('🚀 Bilgoo Web v2.0 başlatılıyor...');
console.log('📱 Platform:', isMobile ? 'Mobile' : 'Desktop');
console.log('⚡ Vite build sistemi aktif');

// Layout Manager'ı başlat
const layoutManager = new LayoutManager({
    breakpoint: 1024,
    onLayoutChange: (platform) => {
        console.log('🔄 Layout değişti:', platform);
        window.__BILGOO_PLATFORM__.isMobile = platform === 'mobile';
        window.__BILGOO_PLATFORM__.isDesktop = platform === 'desktop';
    },
    onNavigate: (route) => {
        console.log('🧭 Navigasyon:', route);
        // Routing mantığı buraya gelecek
    }
});

// Global erişim için
window.__BILGOO_LAYOUT_MANAGER__ = layoutManager;

console.log('✅ Layout Manager başlatıldı');

// Test: Stats güncelleme
setTimeout(() => {
    layoutManager.updateStats({
        score: 1250,
        stars: 45,
        lives: 3,
        displayName: 'Test Kullanıcı'
    });
}, 2000);
