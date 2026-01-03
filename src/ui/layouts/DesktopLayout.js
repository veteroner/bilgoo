/**
 * DesktopLayout.js - Desktop grid layout yönetimi
 * Faz 3: Desktop Layout
 */

import { Sidebar } from '../components/Sidebar.js';

export class DesktopLayout {
    constructor(config = {}) {
        this.container = null;
        this.sidebar = null;
        this.mainContent = null;
        this.currentView = 'home';
        
        // Callbacks
        this.onNavigate = config.onNavigate || (() => {});
        
        this.init();
    }
    
    init() {
        this.createLayout();
        this.createSidebar();
        this.attachEventListeners();
    }
    
    createLayout() {
        this.container = document.createElement('div');
        this.container.className = 'desktop-layout';
        this.container.innerHTML = `
            <div class="desktop-sidebar-wrapper"></div>
            <main class="desktop-main">
                <div class="desktop-header">
                    <div class="desktop-header-left">
                        <h1 class="desktop-page-title">Ana Sayfa</h1>
                    </div>
                    <div class="desktop-header-right">
                        <div class="desktop-user-stats">
                            <div class="stat-item">
                                <i class="fas fa-coins"></i>
                                <span id="desktop-score">0</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-star"></i>
                                <span id="desktop-stars">0</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-heart"></i>
                                <span id="desktop-lives">3</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="desktop-content" id="desktop-content">
                    <!-- İçerik buraya yüklenecek -->
                </div>
            </main>
        `;
        
        this.mainContent = this.container.querySelector('#desktop-content');
    }
    
    createSidebar() {
        this.sidebar = new Sidebar({
            onNavigate: (route) => this.navigate(route),
            onToggle: (isCollapsed) => {
                this.container.classList.toggle('sidebar-collapsed', isCollapsed);
            }
        });
        
        const sidebarWrapper = this.container.querySelector('.desktop-sidebar-wrapper');
        this.sidebar.mount(sidebarWrapper);
    }
    
    navigate(route) {
        console.log('🧭 Desktop navigasyon:', route);
        this.currentView = route;
        
        // Sayfa başlığını güncelle
        const pageTitle = this.container.querySelector('.desktop-page-title');
        if (pageTitle) {
            pageTitle.textContent = this.getPageTitle(route);
        }
        
        // Callback çağır
        this.onNavigate(route);
    }
    
    getPageTitle(route) {
        const titles = {
            home: 'Ana Sayfa',
            play: 'Oyna',
            categories: 'Kategoriler',
            leaderboard: 'Lider Tablosu',
            friends: 'Arkadaşlar',
            online: 'Online Oyun',
            profile: 'Profilim',
            achievements: 'Başarılar',
            statistics: 'İstatistikler',
            settings: 'Ayarlar',
            about: 'Hakkında'
        };
        return titles[route] || 'Bilgoo';
    }
    
    updateStats(stats) {
        const scoreEl = this.container.querySelector('#desktop-score');
        const starsEl = this.container.querySelector('#desktop-stars');
        const livesEl = this.container.querySelector('#desktop-lives');
        
        if (scoreEl) scoreEl.textContent = this.formatNumber(stats.score || 0);
        if (starsEl) starsEl.textContent = this.formatNumber(stats.stars || 0);
        if (livesEl) livesEl.textContent = stats.lives || 3;
        
        // Sidebar'daki kullanıcı bilgisini de güncelle
        if (this.sidebar) {
            this.sidebar.updateUserInfo({
                displayName: stats.displayName,
                stats: {
                    stars: stats.stars,
                    lives: stats.lives
                }
            });
        }
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    setContent(html) {
        if (this.mainContent) {
            this.mainContent.innerHTML = html;
        }
    }
    
    attachEventListeners() {
        // Responsive kontrol
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    handleResize() {
        const width = window.innerWidth;
        
        // 1024px altında mobile layout'a geç
        if (width < 1024) {
            console.log('📱 Mobile layout\'a geçiliyor...');
            // Layout değiştirme mantığı buraya gelecek
        }
    }
    
    mount(parentElement) {
        if (parentElement && this.container) {
            parentElement.appendChild(this.container);
            console.log('🖥️ Desktop layout monte edildi');
        }
    }
    
    destroy() {
        if (this.sidebar) {
            this.sidebar.destroy();
        }
        
        if (this.container && this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
    }
    
    attachEventListeners() {
        window.addEventListener('resize', () => this.handleResize());
    }
}
