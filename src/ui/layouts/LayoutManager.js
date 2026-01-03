/**
 * LayoutManager.js - Platform tespiti ve layout yönetimi
 * Faz 3: Desktop Layout
 */

import { DesktopLayout } from './DesktopLayout.js';

export class LayoutManager {
    constructor(config = {}) {
        this.currentLayout = null;
        this.currentPlatform = null;
        this.breakpoint = config.breakpoint || 1024;
        
        // Callbacks
        this.onLayoutChange = config.onLayoutChange || (() => {});
        this.onNavigate = config.onNavigate || (() => {});
        
        this.init();
    }
    
    init() {
        this.detectPlatform();
        this.attachEventListeners();
        this.loadAppropriateLayout();
    }
    
    detectPlatform() {
        const width = window.innerWidth;
        this.currentPlatform = width >= this.breakpoint ? 'desktop' : 'mobile';
        
        console.log('📱 Platform tespit edildi:', {
            platform: this.currentPlatform,
            width: width,
            breakpoint: this.breakpoint
        });
        
        return this.currentPlatform;
    }
    
    loadAppropriateLayout() {
        // Mevcut layout'u temizle
        if (this.currentLayout) {
            this.currentLayout.destroy();
        }
        
        const platform = this.detectPlatform();
        
        if (platform === 'desktop') {
            this.loadDesktopLayout();
        } else {
            this.loadMobileLayout();
        }
    }
    
    loadDesktopLayout() {
        console.log('🖥️ Desktop layout yükleniyor...');
        
        // Önce tüm mobil elementleri gizle
        const mobileElements = document.querySelectorAll(
            '#main-menu, .main-menu, .bottom-nav, .mobile-header, #category-selection'
        );
        mobileElements.forEach(el => {
            if (el) el.style.display = 'none';
        });
        
        // Desktop layout oluştur
        this.currentLayout = new DesktopLayout({
            onNavigate: (route) => this.onNavigate(route)
        });
        
        // Body'ye desktop class ekle
        document.body.classList.add('desktop-mode');
        document.body.classList.remove('mobile-mode');
        
        // Mount et
        const appContainer = document.getElementById('app') || document.body;
        this.currentLayout.mount(appContainer);
        
        // Callback çağır
        this.onLayoutChange('desktop');
        
        console.log('✅ Desktop layout yüklendi');
    }
    
    loadMobileLayout() {
        console.log('📱 Mobile layout yükleniyor...');
        
        // Desktop layout varsa temizle
        if (this.currentLayout) {
            this.currentLayout.destroy();
            this.currentLayout = null;
        }
        
        // Web elementlerini gizle
        const webElements = document.querySelectorAll(
            '.web-desktop-layout, .web-navbar, .web-hero, .categories-section'
        );
        webElements.forEach(el => {
            if (el) el.style.display = 'none';
        });
        
        // Mobil elementleri göster
        const mobileElements = document.querySelectorAll(
            '#main-menu, .main-menu'
        );
        mobileElements.forEach(el => {
            if (el) el.style.display = '';
        });
        
        // Mevcut HTML yapısını kullan (index.html'deki mobile-friendly yapı)
        document.body.classList.add('mobile-mode');
        document.body.classList.remove('desktop-mode');
        
        // Callback çağır
        this.onLayoutChange('mobile');
        
        console.log('✅ Mobile layout aktif');
    }
    
    attachEventListeners() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            
            resizeTimeout = setTimeout(() => {
                const newPlatform = this.detectPlatform();
                
                // Platform değiştiyse layout'u yeniden yükle
                if (newPlatform !== this.currentPlatform) {
                    console.log(`🔄 Platform değişti: ${this.currentPlatform} → ${newPlatform}`);
                    this.currentPlatform = newPlatform;
                    this.loadAppropriateLayout();
                }
            }, 250); // Debounce: 250ms
        });
    }
    
    updateStats(stats) {
        if (this.currentLayout && this.currentLayout.updateStats) {
            this.currentLayout.updateStats(stats);
        }
    }
    
    navigate(route) {
        if (this.currentLayout && this.currentLayout.navigate) {
            this.currentLayout.navigate(route);
        }
    }
    
    getCurrentPlatform() {
        return this.currentPlatform;
    }
    
    isDesktop() {
        return this.currentPlatform === 'desktop';
    }
    
    isMobile() {
        return this.currentPlatform === 'mobile';
    }
}
