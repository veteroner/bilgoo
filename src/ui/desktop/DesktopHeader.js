/**
 * Desktop Modern Header Component
 * Masaüstü için modern web sitesi header'ı
 */

export class DesktopHeader {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Kullanıcı bilgilerini yükle
        this.loadUserData();
        // Header'ı oluştur
        this.render();
        // Event listener'ları ekle
        this.attachEventListeners();
    }

    loadUserData() {
        // Firebase'den kullanıcı bilgilerini al
        const user = firebase.auth().currentUser;
        if (user) {
            this.currentUser = {
                name: user.displayName || 'Kullanıcı',
                email: user.email,
                photoURL: user.photoURL,
                score: localStorage.getItem('totalScore') || 0
            };
        }
    }

    render() {
        // Mevcut header'ı kaldır
        const existingHeader = document.querySelector('.desktop-header');
        if (existingHeader) {
            existingHeader.remove();
        }

        // Desktop header HTML
        const headerHTML = `
            <header class="desktop-header">
                <a href="/" class="desktop-logo">
                    <img src="/icon-192.png" alt="Bilgoo">
                    <span>Bilgoo</span>
                </a>
                
                <nav class="desktop-nav">
                    <a href="/" class="active">
                        <i class="fas fa-home"></i> Ana Sayfa
                    </a>
                    <a href="/categories.html">
                        <i class="fas fa-th"></i> Kategoriler
                    </a>
                    <a href="/leaderboard.html">
                        <i class="fas fa-trophy"></i> Liderlik Tablosu
                    </a>
                    <a href="/achievements.html">
                        <i class="fas fa-medal"></i> Başarılar
                    </a>
                    <a href="/about.html">
                        <i class="fas fa-info-circle"></i> Hakkında
                    </a>
                </nav>
                
                <div class="desktop-user-section">
                    ${this.currentUser ? `
                        <div class="desktop-user-info">
                            <i class="fas fa-user-circle"></i>
                            <span class="desktop-user-name">${this.currentUser.name}</span>
                        </div>
                        <div class="desktop-user-score">
                            <i class="fas fa-star"></i>
                            <span>${this.currentUser.score} Puan</span>
                        </div>
                    ` : `
                        <a href="/login.html" class="btn-login">
                            <i class="fas fa-sign-in-alt"></i> Giriş Yap
                        </a>
                    `}
                </div>
            </header>
            
            <div class="desktop-content-wrapper">
                <!-- Ana içerik buraya gelecek -->
            </div>
        `;

        // Header'ı body'nin başına ekle
        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        // Mevcut içeriği wrapper'a taşı
        const wrapper = document.querySelector('.desktop-content-wrapper');
        const mainContent = document.querySelector('#app, main, .main-content');
        
        if (mainContent && wrapper) {
            wrapper.appendChild(mainContent);
        } else if (wrapper) {
            // Eğer ana içerik yoksa, body'deki diğer elementleri taşı
            const bodyChildren = Array.from(document.body.children);
            bodyChildren.forEach(child => {
                if (!child.classList.contains('desktop-header') && 
                    !child.classList.contains('desktop-content-wrapper') &&
                    child.tagName !== 'SCRIPT') {
                    wrapper.appendChild(child);
                }
            });
        }
    }

    attachEventListeners() {
        // Aktif sayfa işaretleme
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.desktop-nav a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '/' && href === '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Logout butonu varsa
        const logoutBtn = document.querySelector('.btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                firebase.auth().signOut();
                window.location.href = '/login.html';
            });
        }
    }

    update(userData) {
        this.currentUser = userData;
        this.render();
    }
}

// Desktop modda otomatik başlat
if (window.innerWidth >= 1024) {
    document.addEventListener('DOMContentLoaded', () => {
        new DesktopHeader();
    });
}
