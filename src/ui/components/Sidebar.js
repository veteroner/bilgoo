/**
 * Sidebar.js - Desktop yan menü bileşeni
 * Faz 3: Desktop Layout
 */

export class Sidebar {
    constructor(config = {}) {
        this.container = null;
        this.isCollapsed = false;
        this.currentActiveItem = null;
        
        // Callbacks
        this.onNavigate = config.onNavigate || (() => {});
        this.onToggle = config.onToggle || (() => {});
        
        this.init();
    }
    
    init() {
        this.createSidebar();
        this.attachEventListeners();
    }
    
    createSidebar() {
        this.container = document.createElement('aside');
        this.container.className = 'desktop-sidebar';
        this.container.innerHTML = `
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    <img src="/icons/icon-192x192.png" alt="Bilgoo" />
                    <span class="sidebar-brand">Bilgoo</span>
                </div>
                <button class="sidebar-toggle" aria-label="Toggle sidebar">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
            
            <nav class="sidebar-nav">
                <div class="sidebar-section">
                    <div class="sidebar-section-title">Oyun</div>
                    <a href="#" class="sidebar-item active" data-route="home">
                        <i class="fas fa-home"></i>
                        <span class="sidebar-item-text">Ana Sayfa</span>
                    </a>
                    <a href="#" class="sidebar-item" data-route="play">
                        <i class="fas fa-play"></i>
                        <span class="sidebar-item-text">Oyna</span>
                    </a>
                    <a href="#" class="sidebar-item" data-route="categories">
                        <i class="fas fa-th-large"></i>
                        <span class="sidebar-item-text">Kategoriler</span>
                    </a>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-section-title">Sosyal</div>
                    <a href="#" class="sidebar-item" data-route="leaderboard">
                        <i class="fas fa-trophy"></i>
                        <span class="sidebar-item-text">Lider Tablosu</span>
                    </a>
                    <a href="#" class="sidebar-item" data-route="friends">
                        <i class="fas fa-users"></i>
                        <span class="sidebar-item-text">Arkadaşlar</span>
                    </a>
                    <a href="#" class="sidebar-item" data-route="online">
                        <i class="fas fa-wifi"></i>
                        <span class="sidebar-item-text">Online Oyun</span>
                    </a>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-section-title">Profil</div>
                    <a href="#" class="sidebar-item" data-route="profile">
                        <i class="fas fa-user"></i>
                        <span class="sidebar-item-text">Profilim</span>
                    </a>
                    <a href="#" class="sidebar-item" data-route="achievements">
                        <i class="fas fa-medal"></i>
                        <span class="sidebar-item-text">Başarılar</span>
                    </a>
                    <a href="#" class="sidebar-item" data-route="statistics">
                        <i class="fas fa-chart-bar"></i>
                        <span class="sidebar-item-text">İstatistikler</span>
                    </a>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-section-title">Ayarlar</div>
                    <a href="#" class="sidebar-item" data-route="settings">
                        <i class="fas fa-cog"></i>
                        <span class="sidebar-item-text">Ayarlar</span>
                    </a>
                    <a href="#" class="sidebar-item" data-route="about">
                        <i class="fas fa-info-circle"></i>
                        <span class="sidebar-item-text">Hakkında</span>
                    </a>
                </div>
            </nav>
            
            <div class="sidebar-footer">
                <div class="sidebar-user">
                    <div class="sidebar-user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="sidebar-user-info">
                        <div class="sidebar-user-name">Kullanıcı</div>
                        <div class="sidebar-user-stats">
                            <span><i class="fas fa-star"></i> 0</span>
                            <span><i class="fas fa-heart"></i> 3</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    attachEventListeners() {
        // Toggle button
        const toggleBtn = this.container.querySelector('.sidebar-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
        
        // Navigation items
        const navItems = this.container.querySelectorAll('.sidebar-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const route = item.dataset.route;
                this.setActive(route);
                this.onNavigate(route);
            });
        });
    }
    
    toggle() {
        this.isCollapsed = !this.isCollapsed;
        this.container.classList.toggle('collapsed', this.isCollapsed);
        
        this.onToggle(this.isCollapsed);
        
        // LocalStorage'a kaydet
        localStorage.setItem('sidebarCollapsed', this.isCollapsed);
    }
    
    setActive(route) {
        // Remove active from all
        const items = this.container.querySelectorAll('.sidebar-item');
        items.forEach(item => item.classList.remove('active'));
        
        // Add active to current
        const activeItem = this.container.querySelector(`[data-route="${route}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            this.currentActiveItem = route;
        }
    }
    
    updateUserInfo(user) {
        const nameEl = this.container.querySelector('.sidebar-user-name');
        const statsEl = this.container.querySelector('.sidebar-user-stats');
        
        if (nameEl && user.displayName) {
            nameEl.textContent = user.displayName;
        }
        
        if (statsEl && user.stats) {
            statsEl.innerHTML = `
                <span><i class="fas fa-star"></i> ${user.stats.stars || 0}</span>
                <span><i class="fas fa-heart"></i> ${user.stats.lives || 3}</span>
            `;
        }
    }
    
    mount(parentElement) {
        if (parentElement && this.container) {
            parentElement.appendChild(this.container);
            
            // Restore collapsed state
            const savedState = localStorage.getItem('sidebarCollapsed');
            if (savedState === 'true') {
                this.isCollapsed = true;
                this.container.classList.add('collapsed');
            }
        }
    }
    
    destroy() {
        if (this.container && this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
    }
}
