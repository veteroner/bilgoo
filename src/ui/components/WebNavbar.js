/**
 * Modern Web Navigation Bar - Desktop Only
 */
export class WebNavbar {
  constructor() {
    this.element = null;
  }

  create() {
    const navbar = document.createElement('nav');
    navbar.className = 'web-navbar';
    navbar.innerHTML = `
      <div class="web-navbar-container">
        <div class="web-navbar-brand">
          <div class="web-logo">
            <span class="web-logo-icon">🧠</span>
            <span class="web-logo-text">Bilgoo</span>
          </div>
          <span class="web-tagline">Türkiye'nin En Eğlenceli Bilgi Yarışması</span>
        </div>
        
        <div class="web-navbar-menu">
          <a href="#" class="web-navbar-link active" data-page="home">
            <span class="navbar-link-icon">🏠</span>
            Ana Sayfa
          </a>
          <a href="#" class="web-navbar-link" data-page="categories">
            <span class="navbar-link-icon">📚</span>
            Kategoriler
          </a>
          <a href="#" class="web-navbar-link" data-page="leaderboard">
            <span class="navbar-link-icon">🏆</span>
            Lider Tablosu
          </a>
          <a href="#" class="web-navbar-link" data-page="stats">
            <span class="navbar-link-icon">📊</span>
            İstatistikler
          </a>
          <a href="#" class="web-navbar-link" data-page="about">
            <span class="navbar-link-icon">ℹ️</span>
            Hakkımızda
          </a>
        </div>
        
        <div class="web-navbar-actions">
          <button class="web-btn-secondary" id="web-login-btn">
            <span>👤</span>
            Giriş Yap
          </button>
          <button class="web-btn-primary" id="web-start-game-btn">
            <span>🎮</span>
            Oyuna Başla
          </button>
        </div>
      </div>
    `;
    
    this.element = navbar;
    this.attachEventListeners();
    return navbar;
  }

  attachEventListeners() {
    // Navigation links
    const links = this.element.querySelectorAll('.web-navbar-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        this.navigateTo(page);
        
        // Update active state
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    // Login button
    const loginBtn = this.element.querySelector('#web-login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        window.location.href = '/login.html';
      });
    }

    // Start game button
    const startBtn = this.element.querySelector('#web-start-game-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        // Show category selection
        const event = new CustomEvent('web:show-categories');
        document.dispatchEvent(event);
      });
    }
  }

  navigateTo(page) {
    const event = new CustomEvent('web:navigate', { detail: { page } });
    document.dispatchEvent(event);
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
