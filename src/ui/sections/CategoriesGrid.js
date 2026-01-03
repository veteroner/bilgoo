/**
 * Categories Grid Section - Desktop Only
 */
import { CategoryCard } from '../components/CategoryCard.js';

export class CategoriesGrid {
  constructor(categories) {
    this.categories = categories || this.getDefaultCategories();
    this.element = null;
    this.cards = [];
  }

  getDefaultCategories() {
    return [
      { 
        id: 'genel-kultur', 
        name: 'Genel Kültür', 
        description: 'Her konudan sorular',
        questionCount: 2500,
        correctAnswers: 0
      },
      { 
        id: 'tarih', 
        name: 'Tarih', 
        description: 'Geçmişten günümüze',
        questionCount: 1800,
        correctAnswers: 0
      },
      { 
        id: 'cografya', 
        name: 'Coğrafya', 
        description: 'Dünya ve Türkiye',
        questionCount: 1500,
        correctAnswers: 0
      },
      { 
        id: 'bilim', 
        name: 'Bilim', 
        description: 'Fen bilimleri',
        questionCount: 1200,
        correctAnswers: 0
      },
      { 
        id: 'edebiyat', 
        name: 'Edebiyat', 
        description: 'Türk ve dünya edebiyatı',
        questionCount: 1000,
        correctAnswers: 0
      },
      { 
        id: 'spor', 
        name: 'Spor', 
        description: 'Futbol, basketbol ve daha fazlası',
        questionCount: 900,
        correctAnswers: 0
      },
      { 
        id: 'muzik', 
        name: 'Müzik', 
        description: 'Türk ve dünya müziği',
        questionCount: 800,
        correctAnswers: 0
      },
      { 
        id: 'teknoloji', 
        name: 'Teknoloji', 
        description: 'Bilişim ve yenilikler',
        questionCount: 700,
        correctAnswers: 0
      }
    ];
  }

  create() {
    const section = document.createElement('section');
    section.className = 'categories-section';
    section.innerHTML = `
      <div class="categories-container">
        <div class="categories-header">
          <h2 class="categories-title">Kategorileri Keşfet</h2>
          <p class="categories-subtitle">
            İstediğin kategoride bilgini test et ve lider tablosunda yerini al
          </p>
        </div>
        
        <div class="categories-grid" id="categories-grid">
          <!-- Category cards will be inserted here -->
        </div>
      </div>
    `;
    
    this.element = section;
    this.renderCategories();
    return section;
  }

  renderCategories() {
    const grid = this.element.querySelector('#categories-grid');
    if (!grid) return;

    // Clear existing cards
    this.cards.forEach(card => card.destroy());
    this.cards = [];
    grid.innerHTML = '';

    // Create new cards
    this.categories.forEach(category => {
      const card = new CategoryCard(category);
      const cardElement = card.create();
      grid.appendChild(cardElement);
      this.cards.push(card);
    });
  }

  updateCategoryStats(categoryId, stats) {
    const category = this.categories.find(c => c.id === categoryId);
    if (category) {
      Object.assign(category, stats);
      this.renderCategories();
    }
  }

  destroy() {
    this.cards.forEach(card => card.destroy());
    this.cards = [];
    
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
