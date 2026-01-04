// Desktop Web Layout - Hero Section ile Ana Sayfa
(function() {
    'use strict';
    
    // Sadece desktop'ta çalış
    if (window.innerWidth < 1024) return;
    
    console.log('🖥️ Desktop layout yükleniyor...');
    
    // Ana sayfa gösterildiğinde hero section ekle
    function addDesktopHeroToHomepage() {
        const homepage = document.getElementById('homepage');
        if (!homepage) return;
        
        // Eğer zaten hero varsa, ekleme
        if (homepage.querySelector('.desktop-hero-wrapper')) return;
        
        // Mevcut içeriği sakla
        const originalContent = homepage.innerHTML;
        
        // Hero section HTML
        const heroHTML = `
            <div class="desktop-hero-wrapper">
                <div class="desktop-hero-left">
                    <h1>
                        Bilgi Yarışmasının<br>
                        <span class="highlight">Yeni Adresi</span>
                    </h1>
                    <p>
                        8 farklı kategoride binlerce soru, arkadaşlarınla yarış, yeteneklerini geliştir ve lider tablosunda yerini al!
                    </p>
                    <div class="desktop-hero-buttons">
                        <button class="btn-primary" onclick="document.getElementById('single-player-btn')?.click()">
                            🚀 Hemen Başla
                        </button>
                        <button class="btn-secondary" onclick="alert('Nasıl Oynanır: Kategori seç, soruları cevapla, puan kazan!')">
                            📖 Nasıl Oynanır?
                        </button>
                    </div>
                    <div class="desktop-hero-stats">
                        <div class="desktop-hero-stat">
                            <h3>10,000+</h3>
                            <p>Soru</p>
                        </div>
                        <div class="desktop-hero-stat">
                            <h3>50,000+</h3>
                            <p>Oyuncu</p>
                        </div>
                        <div class="desktop-hero-stat">
                            <h3>8</h3>
                            <p>Kategori</p>
                        </div>
                    </div>
                </div>
                <div class="desktop-hero-right">
                    <div class="desktop-demo-card">
                        <span class="desktop-demo-badge">Soru #1</span>
                        <div class="desktop-demo-stats">
                            <div>❤️❤️❤️❤️❤️</div>
                            <div style="display: flex; gap: 1rem;">
                                <span>⏱️ 3</span>
                                <span>🎯</span>
                            </div>
                        </div>
                        <div class="desktop-demo-question">
                            Türkiye'nin başkenti neresidir?
                        </div>
                        <div class="desktop-demo-options">
                            <div class="desktop-demo-option">A) İstanbul</div>
                            <div class="desktop-demo-option correct">B) Ankara</div>
                            <div class="desktop-demo-option">C) İzmir</div>
                            <div class="desktop-demo-option">D) Bursa</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="desktop-categories-section">
                <div class="desktop-categories-header">
                    <h2>Kategorileri Keşfet</h2>
                    <p>İstediğin kategoride bilgini test et ve lider tablosunda yerini al</p>
                </div>
                <div class="desktop-categories-grid" id="desktop-categories-grid">
                    ${originalContent}
                </div>
            </div>
        `;
        
        homepage.innerHTML = heroHTML;
    }
    
    // Kategori kartlarına stat ve buton ekle
    function enhanceCategoryCards() {
        const categoryButtons = document.querySelectorAll('.category-btn, .menu-btn[data-category]');
        
        categoryButtons.forEach(btn => {
            // Eğer zaten işlenmişse, atlا
            if (btn.querySelector('.category-start-btn')) return;
            
            const category = btn.dataset.category || btn.textContent.trim();
            const categoryData = getCategoryData(category);
            
            // Kartın HTML'ini yeniden oluştur
            const icon = btn.querySelector('i')?.outerHTML || categoryData.icon;
            const name = btn.textContent.trim();
            
            btn.innerHTML = `
                <div class="category-icon">${icon}</div>
                <h3 class="category-name">${name}</h3>
                <div class="category-stats">
                    <div class="category-stat">
                        <span class="category-stat-label">SORU</span>
                        <span class="category-stat-value purple">${categoryData.questions}</span>
                    </div>
                    <div class="category-stat">
                        <span class="category-stat-label">DOĞRU</span>
                        <span class="category-stat-value green">${categoryData.correct}</span>
                    </div>
                </div>
                <button class="category-start-btn">
                    Başla →
                </button>
            `;
            
            btn.classList.add('category-card');
            btn.dataset.category = getCategoryKey(category);
        });
    }
    
    function getCategoryData(category) {
        const data = {
            'Genel Kültür': { questions: 2500, correct: 0, icon: '🌍' },
            'Tarih': { questions: 1800, correct: 0, icon: '📜' },
            'Coğrafya': { questions: 1500, correct: 0, icon: '🗺️' },
            'Bilim': { questions: 1200, correct: 0, icon: '🔬' },
            'Edebiyat': { questions: 1000, correct: 0, icon: '📚' },
            'Spor': { questions: 900, correct: 0, icon: '⚽' },
            'Müzik': { questions: 800, correct: 0, icon: '🎵' },
            'Teknoloji': { questions: 700, correct: 0, icon: '💻' }
        };
        
        return data[category] || { questions: 1000, correct: 0, icon: '📖' };
    }
    
    function getCategoryKey(name) {
        const keys = {
            'Genel Kültür': 'GenelKültür',
            'Tarih': 'Tarih',
            'Coğrafya': 'Coğrafya',
            'Bilim': 'Bilim',
            'Edebiyat': 'Edebiyat',
            'Spor': 'Spor',
            'Müzik': 'Müzik',
            'Teknoloji': 'Teknoloji'
        };
        return keys[name] || name;
    }
    
    // Sayfa yüklendiğinde
    window.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            addDesktopHeroToHomepage();
        }, 500);
    });
    
    // Ana sayfaya her dönüşte
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                addDesktopHeroToHomepage();
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ Desktop layout hazır');
})();
