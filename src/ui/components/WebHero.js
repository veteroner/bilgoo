/**
 * Web Hero Section - Desktop Only
 */
export class WebHero {
  constructor() {
    this.element = null;
  }

  create() {
    const hero = document.createElement('section');
    hero.className = 'web-hero';
    hero.innerHTML = `
      <div class="web-hero-background">
        <div class="hero-gradient"></div>
        <div class="hero-pattern"></div>
      </div>
      
      <div class="web-hero-content">
        <div class="web-hero-text">
          <h1 class="web-hero-title">
            Bilgi Yarışmasının
            <span class="hero-title-highlight">Yeni Adresi</span>
          </h1>
          <p class="web-hero-subtitle">
            8 farklı kategoride binlerce soru, arkadaşlarınla yarış, 
            yeteneklerini geliştir ve lider tablosunda yerini al!
          </p>
          <div class="web-hero-actions">
            <button class="web-hero-btn-primary" id="hero-start-btn">
              <span class="btn-icon">🚀</span>
              <span class="btn-text">Hemen Başla</span>
            </button>
            <button class="web-hero-btn-secondary" id="hero-learn-more">
              <span class="btn-icon">📖</span>
              <span class="btn-text">Nasıl Oynanır?</span>
            </button>
          </div>
          
          <div class="web-hero-stats">
            <div class="hero-stat-item">
              <div class="hero-stat-value">10,000+</div>
              <div class="hero-stat-label">Soru</div>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat-item">
              <div class="hero-stat-value">50,000+</div>
              <div class="hero-stat-label">Oyuncu</div>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat-item">
              <div class="hero-stat-value">8</div>
              <div class="hero-stat-label">Kategori</div>
            </div>
          </div>
        </div>
        
        <div class="web-hero-visual">
          <div class="hero-visual-card">
            <div class="visual-card-header">
              <span class="visual-badge">Soru #1</span>
              <span class="visual-timer">⏱️ 30s</span>
            </div>
            <div class="visual-card-question">
              <p>Türkiye'nin başkenti neresidir?</p>
            </div>
            <div class="visual-card-options">
              <div class="visual-option">A) İstanbul</div>
              <div class="visual-option visual-option-correct">B) Ankara</div>
              <div class="visual-option">C) İzmir</div>
              <div class="visual-option">D) Bursa</div>
            </div>
          </div>
          <div class="hero-visual-floating hero-floating-1">
            <span class="floating-icon">🎯</span>
          </div>
          <div class="hero-visual-floating hero-floating-2">
            <span class="floating-icon">⭐</span>
          </div>
          <div class="hero-visual-floating hero-floating-3">
            <span class="floating-icon">🏆</span>
          </div>
        </div>
      </div>
    `;
    
    this.element = hero;
    this.attachEventListeners();
    return hero;
  }

  attachEventListeners() {
    const startBtn = this.element.querySelector('#hero-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        const event = new CustomEvent('web:show-categories');
        document.dispatchEvent(event);
      });
    }

    const learnMoreBtn = this.element.querySelector('#hero-learn-more');
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', () => {
        window.location.href = '/about.html';
      });
    }
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
