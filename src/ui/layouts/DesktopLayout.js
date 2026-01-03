/**
 * DesktopLayout.js - Modern Web Layout for Desktop
 * Updated with new web design components
 */

import { WebNavbar } from '../components/WebNavbar.js';
import { WebHero } from '../components/WebHero.js';
import { CategoriesGrid } from '../sections/CategoriesGrid.js';

export class DesktopLayout {
    constructor(config = {}) {
        this.container = null;
        this.navbar = null;
        this.hero = null;
        this.categoriesGrid = null;
        this.mainContent = null;
        this.currentView = 'home';
        
        // Callbacks
        this.onNavigate = config.onNavigate || (() => {});
        
        this.init();
    }
    
    init() {
        this.createLayout();
        this.createComponents();
        this.attachEventListeners();
        this.renderHomePage();
    }
    
    createLayout() {
        this.container = document.createElement('div');
        this.container.className = 'web-desktop-layout';
        this.container.innerHTML = `
            <div id="web-navbar-container"></div>
            <main class="web-main-content" id="web-main-content">
                <!-- Dynamic content will be loaded here -->
            </main>
            <footer class="web-footer">
                <div class="web-footer-container">
                    <p>&copy; 2025 Bilgoo - Tüm hakları saklıdır</p>
                </div>
            </footer>
        `;
        
        this.mainContent = this.container.querySelector('#web-main-content');
    }
    
    createComponents() {
        // Create navbar
        this.navbar = new WebNavbar();
        const navbarContainer = this.container.querySelector('#web-navbar-container');
        navbarContainer.appendChild(this.navbar.create());
        
        // Create hero section
        this.hero = new WebHero();
        
        // Create categories grid
        this.categoriesGrid = new CategoriesGrid();
    }
    
    
    renderHomePage() {
        // Clear main content
        this.mainContent.innerHTML = '';
        
        // Add hero section
        this.mainContent.appendChild(this.hero.create());
        
        // Add categories grid
        this.mainContent.appendChild(this.categoriesGrid.create());
    }
    
    renderCategoriesPage() {
        this.mainContent.innerHTML = '';
        this.mainContent.appendChild(this.categoriesGrid.create());
    }
    
    navigate(page) {
        console.log('🧭 Navigation:', page);
        this.currentView = page;
        
        switch(page) {
            case 'home':
                this.renderHomePage();
                break;
            case 'categories':
                this.renderCategoriesPage();
                break;
            case 'leaderboard':
                this.renderLeaderboard();
                break;
            case 'stats':
                this.renderStats();
                break;
            case 'about':
                window.location.href = '/about.html';
                break;
            default:
                this.renderHomePage();
        }
        
        // Callback çağır
        this.onNavigate(page);
    }
    
    renderLeaderboard() {
        this.mainContent.innerHTML = `
            <section class="web-page-section">
                <div class="web-page-container">
                    <h2 class="web-page-title">🏆 Lider Tablosu</h2>
                    <p class="web-page-subtitle">En başarılı oyuncular</p>
                    <div class="leaderboard-placeholder">
                        <p>Lider tablosu yükleniyor...</p>
                    </div>
                </div>
            </section>
        `;
    }
    
    renderStats() {
        this.mainContent.innerHTML = `
            <section class="web-page-section">
                <div class="web-page-container">
                    <h2 class="web-page-title">📊 İstatistikler</h2>
                    <p class="web-page-subtitle">Performans analizin</p>
                    <div class="stats-placeholder">
                        <p>İstatistikler yükleniyor...</p>
                    </div>
                </div>
            </section>
        `;
    }
    
    updateStats(stats) {
        // Stats can be updated via navbar or other components if needed
        console.log('Stats updated:', stats);
    }
    
    setContent(html) {
        if (this.mainContent) {
            this.mainContent.innerHTML = html;
        }
    }
    
    attachEventListeners() {
        // Navigation events
        document.addEventListener('web:navigate', (e) => {
            this.navigate(e.detail.page);
        });
        
        // Show categories event
        document.addEventListener('web:show-categories', () => {
            this.navigate('categories');
        });
        
        // Category selected event
        document.addEventListener('category:selected', (e) => {
            console.log('Category selected:', e.detail.category);
            // Start quiz with selected category
            // This will integrate with existing quiz logic
        });
        
        // Responsive kontrol
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    handleResize() {
        const width = window.innerWidth;
        
        // 1024px altında mobile layout'a geç
        if (width < 1024) {
            console.log('📱 Mobile layout aktif - web bileşenleri gizlendi');
        }
    }
    
    mount(parentElement) {
        if (parentElement && this.container) {
            parentElement.appendChild(this.container);
            console.log('🖥️ Modern web layout monte edildi');
        }
    }
    
    destroy() {
        if (this.navbar) {
            this.navbar.destroy();
        }
        
        if (this.hero) {
            this.hero.destroy();
        }
        
        if (this.categoriesGrid) {
            this.categoriesGrid.destroy();
        }
        
        if (this.container && this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
    }
}
