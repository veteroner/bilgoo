/**
 * Modern Category Card Component - Desktop Only
 */
export class CategoryCard {
  constructor(category) {
    this.category = category;
    this.element = null;
  }

  create() {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.dataset.category = this.category.id;
    
    const iconMap = {
      'genel-kultur': '🌍',
      'tarih': '📜',
      'cografya': '🗺️',
      'bilim': '🔬',
      'edebiyat': '📖',
      'spor': '⚽',
      'muzik': '🎵',
      'teknoloji': '💻'
    };
    
    const icon = iconMap[this.category.id] || '📚';
    
    card.innerHTML = `
      <div class="category-card-inner">
        <div class="category-card-icon">
          ${icon}
        </div>
        <h3 class="category-card-title">${this.category.name}</h3>
        <p class="category-card-description">${this.category.description || ''}</p>
        <div class="category-card-stats">
          <div class="category-stat">
            <span class="stat-label">Soru</span>
            <span class="stat-value">${this.category.questionCount || 0}</span>
          </div>
          <div class="category-stat">
            <span class="stat-label">Doğru</span>
            <span class="stat-value">${this.category.correctAnswers || 0}</span>
          </div>
        </div>
        <button class="category-card-button">
          <span>Başla</span>
          <span class="button-arrow">→</span>
        </button>
      </div>
      <div class="category-card-glow"></div>
    `;
    
    this.element = card;
    this.attachEventListeners();
    return card;
  }

  attachEventListeners() {
    const button = this.element.querySelector('.category-card-button');
    if (button) {
      button.addEventListener('click', () => {
        const event = new CustomEvent('category:selected', {
          detail: { category: this.category }
        });
        document.dispatchEvent(event);
      });
    }

    // Hover effects
    this.element.addEventListener('mouseenter', () => {
      this.element.classList.add('category-card-hover');
    });

    this.element.addEventListener('mouseleave', () => {
      this.element.classList.remove('category-card-hover');
    });
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
