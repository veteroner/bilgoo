/**
 * Desktop Ana Sayfa İçeriği
 * Modern web sitesi tasarımı için homepage
 */

export class DesktopHomepage {
    constructor() {
        this.categories = [
            { name: 'Genel Kültür', icon: '🌍', description: '500+ soru ile genel kültür bilginizi test edin', color: '#667eea' },
            { name: 'Bilim', icon: '🔬', description: 'Bilim dünyasından ilginç sorular', color: '#f093fb' },
            { name: 'Tarih', icon: '📚', description: 'Tarihi olaylar ve kişiler', color: '#4facfe' },
            { name: 'Coğrafya', icon: '🗺️', description: 'Dünya coğrafyası ve şehirler', color: '#43e97b' },
            { name: 'Spor', icon: '⚽', description: 'Spor haberleri ve tarihi', color: '#fa709a' },
            { name: 'Sanat', icon: '🎨', description: 'Sanat ve edebiyat dünyası', color: '#fee140' },
            { name: 'Müzik', icon: '🎵', description: 'Müzik türleri ve sanatçılar', color: '#30cfd0' },
            { name: 'Teknoloji', icon: '💻', description: 'Teknoloji ve bilişim', color: '#a8edea' }
        ];
        
        this.stats = {
            totalUsers: 15000,
            totalQuestions: 5000,
            totalGames: 50000
        };
        
        this.init();
    }

    init() {
        if (window.innerWidth >= 1024) {
            this.render();
        }
    }

    render() {
        const container = document.querySelector('.desktop-content-wrapper');
        if (!container) return;

        const content = `
            <div class="container">
                <!-- Hero Section -->
                <div class="hero-section">
                    <h1 class="hero-title">🎯 Bilgoo - Bilgi Yarışması</h1>
                    <p class="hero-subtitle">
                        Binlerce soru ile bilgini test et, arkadaşlarınla yarış ve zirvede yerini al!
                    </p>
                    <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                        <button class="btn btn-primary btn-large" onclick="window.location.href='/quiz.html'">
                            <i class="fas fa-play"></i> Hemen Başla
                        </button>
                        <button class="btn btn-outline btn-large" onclick="window.location.href='/leaderboard.html'">
                            <i class="fas fa-trophy"></i> Liderlik Tablosu
                        </button>
                    </div>
                </div>

                <!-- İstatistikler -->
                <div class="stats-section">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">${this.formatNumber(this.stats.totalUsers)}</div>
                            <div class="stat-label">Aktif Kullanıcı</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-question-circle"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">${this.formatNumber(this.stats.totalQuestions)}</div>
                            <div class="stat-label">Soru Havuzu</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-gamepad"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">${this.formatNumber(this.stats.totalGames)}</div>
                            <div class="stat-label">Oynanan Oyun</div>
                        </div>
                    </div>
                </div>

                <!-- Kategoriler -->
                <div style="margin-bottom: 30px;">
                    <h2 style="font-size: 32px; font-weight: 700; color: #2c3e50; margin-bottom: 10px;">
                        📚 Kategoriler
                    </h2>
                    <p style="color: #64748b; font-size: 16px;">
                        İlgi alanına göre kategori seç ve bilgi yarışmasına başla
                    </p>
                </div>

                <div class="category-grid">
                    ${this.categories.map(cat => `
                        <div class="category-card" onclick="window.location.href='/quiz.html?category=${encodeURIComponent(cat.name)}'">
                            <div class="category-icon">${cat.icon}</div>
                            <div class="category-name">${cat.name}</div>
                            <div class="category-description">${cat.description}</div>
                            <div style="margin-top: 15px;">
                                <button class="btn btn-sm" style="background: ${cat.color}; color: white; border: none; width: 100%;">
                                    Başla <i class="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Özellikler -->
                <div style="margin-top: 60px; background: white; border-radius: 20px; padding: 50px; box-shadow: 0 10px 40px rgba(0,0,0,0.08);">
                    <h2 style="font-size: 32px; font-weight: 700; color: #2c3e50; margin-bottom: 40px; text-align: center;">
                        ⭐ Neden Bilgoo?
                    </h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
                        <div style="text-align: center;">
                            <div style="font-size: 48px; margin-bottom: 15px;">🎮</div>
                            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">Eğlenceli Oynanış</h3>
                            <p style="color: #64748b; font-size: 14px;">Sıkılmadan öğren, eğlenerek bilgini geliştir</p>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 48px; margin-bottom: 15px;">🏆</div>
                            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">Yarışma Modu</h3>
                            <p style="color: #64748b; font-size: 14px;">Arkadaşlarınla yarış, liderlik tablosunda yüksel</p>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 48px; margin-bottom: 15px;">📊</div>
                            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">İlerlemeni İzle</h3>
                            <p style="color: #64748b; font-size: 14px;">Detaylı istatistiklerle gelişimini takip et</p>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 48px; margin-bottom: 15px;">🎯</div>
                            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">Çeşitli Kategoriler</h3>
                            <p style="color: #64748b; font-size: 14px;">Her türden konuda binlerce soru</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = content;
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K+';
        }
        return num.toString();
    }
}

// Desktop modda otomatik başlat
if (window.innerWidth >= 1024) {
    document.addEventListener('DOMContentLoaded', () => {
        new DesktopHomepage();
        console.log('✅ Desktop Homepage yüklendi');
    });
}
