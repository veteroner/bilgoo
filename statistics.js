// İstatistikler sayfası için JavaScript kodları
// Firebase'den gerçek veriler alınarak basit istatistikler gösterilir

class StatisticsManager {
    constructor() {
        this.currentUser = null;
        this.stats = {
            totalGames: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            highestScore: 0,
            averageScore: 0,
            accuracy: 0,
            categoryStats: {}
        };
        this.recentGames = [];
        this.userBadges = {};
        
        this.init();
    }
    
    init() {
        // Firebase kimlik doğrulama durumunu kontrol et
        if (firebase.auth) {
            firebase.auth().onAuthStateChanged((user) => {
                this.currentUser = user;
                if (user) {
                    console.log('Kullanıcı oturumu açtı:', user.uid);
                } else {
                    console.log('Kullanıcı oturumu kapatıldı');
                }
            });
        }
    }
    
    // İstatistikler sayfasını göster
    showStatistics() {
        // Diğer sayfaları gizle
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.style.display = 'none';
        
        const profilePage = document.getElementById('profile-page');
        if (profilePage) profilePage.style.display = 'none';
        
        const quizElement = document.getElementById('quiz');
        if (quizElement) quizElement.style.display = 'none';
        
        const categorySelection = document.getElementById('category-selection');
        if (categorySelection) categorySelection.style.display = 'none';
        
        const resultElement = document.getElementById('result');
        if (resultElement) resultElement.style.display = 'none';
        
        const onlineGameOptions = document.getElementById('online-game-options');
        if (onlineGameOptions) onlineGameOptions.style.display = 'none';
        
        const globalLeaderboard = document.getElementById('global-leaderboard');
        if (globalLeaderboard) globalLeaderboard.style.display = 'none';
        
        const friendsPage = document.getElementById('friends-page');
        if (friendsPage) friendsPage.style.display = 'none';
        
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) adminPanel.style.display = 'none';
        
        // İstatistikler sayfasını göster
        const statsPage = document.getElementById('statistics-page');
        if (statsPage) {
            statsPage.style.display = 'block';
            this.loadStatisticsData();
        }
    }
    
    // İstatistikler sayfasını gizle
    hideStatistics() {
        const statsPage = document.getElementById('statistics-page');
        if (statsPage) {
            statsPage.style.display = 'none';
        }
        
        // Ana menüyü göster
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.style.display = 'block';
        }
    }
    
    // İstatistik verilerini yükle
    loadStatisticsData() {
        console.log('İstatistik verileri yükleniyor...');
        
        // Yükleme göstergesi
        this.showLoading(true);
        
        try {
            if (this.currentUser) {
                console.log('Firebase\'den kullanıcı istatistikleri yükleniyor:', this.currentUser.uid);
                this.loadFirebaseStatistics(this.currentUser.uid);
            } else {
                console.log('Kullanıcı oturumu açmamış, localStorage\'dan veriler yükleniyor...');
                this.loadLocalStatistics();
            }
        } catch (error) {
            console.error('İstatistikler yüklenirken hata:', error);
            this.loadLocalStatistics();
        }
    }
    
    // Yükleme göstergesi
    showLoading(show) {
        const loadingElement = document.getElementById('stats-loading');
        if (loadingElement) {
            loadingElement.style.display = show ? 'flex' : 'none';
        }
    }
    
    // Firebase'den istatistikleri yükle
    loadFirebaseStatistics(userId) {
        const promises = [];
        
        // 1. Kullanıcının oyun geçmişini al
        promises.push(
            firebase.database().ref(`gameStats`).orderByChild('userId').equalTo(userId).once('value')
                .then(snapshot => {
                    const games = [];
                    snapshot.forEach(child => {
                        games.push({
                            id: child.key,
                            ...child.val()
                        });
                    });
                    return games;
                })
                .catch(error => {
                    console.error('Game stats yükleme hatası:', error);
                    return [];
                })
        );
        
        // 2. Kullanıcının high score'larını al
        promises.push(
            firebase.database().ref(`highScores`).orderByChild('userId').equalTo(userId).once('value')
                .then(snapshot => {
                    const scores = [];
                    snapshot.forEach(child => {
                        scores.push({
                            id: child.key,
                            ...child.val()
                        });
                    });
                    return scores;
                })
                .catch(error => {
                    console.error('High scores yükleme hatası:', error);
                    return [];
                })
        );
        
        // 3. Kullanıcının rozetlerini al
        promises.push(
            firebase.database().ref(`userBadges/${userId}`).once('value')
                .then(snapshot => snapshot.val() || {})
                .catch(error => {
                    console.error('User badges yükleme hatası:', error);
                    return {};
                })
        );
        
        Promise.all(promises)
            .then(([gameStats, highScores, badges]) => {
                console.log('Firebase veriler yüklendi:', {
                    gameStats: gameStats.length,
                    highScores: highScores.length,
                    badges: Object.keys(badges).length
                });
                
                // İstatistikleri hesapla ve göster
                this.stats = this.calculateStatsFromFirebaseData(gameStats, highScores);
                this.userBadges = badges;
                this.recentGames = gameStats.slice(-5).reverse();
                
                this.updateUI();
            })
            .catch(error => {
                console.error('Firebase istatistikler yükleme hatası:', error);
                this.loadLocalStatistics();
            })
            .finally(() => {
                this.showLoading(false);
            });
    }
    
    // Firebase verilerinden istatistikleri hesapla
    calculateStatsFromFirebaseData(gameStats, highScores) {
        let totalGames = 0;
        let totalQuestions = 0;
        let correctAnswers = 0;
        let totalScore = 0;
        let highestScore = 0;
        let categoryStats = {};
        
        // Game stats'dan hesapla
        gameStats.forEach(game => {
            totalGames++;
            totalQuestions += game.totalQuestions || 0;
            correctAnswers += game.score || 0;
            totalScore += game.score || 0;
            
            if ((game.score || 0) > highestScore) {
                highestScore = game.score || 0;
            }
            
            if (game.category) {
                if (!categoryStats[game.category]) {
                    categoryStats[game.category] = { 
                        total: 0, 
                        correct: 0, 
                        games: 0,
                        accuracy: 0 
                    };
                }
                categoryStats[game.category].total += game.totalQuestions || 0;
                categoryStats[game.category].correct += game.score || 0;
                categoryStats[game.category].games++;
            }
        });
        
        // High scores'dan ek veriler
        highScores.forEach(score => {
            if (score.score > highestScore) {
                highestScore = score.score;
            }
        });
        
        // Kategori başarı oranlarını hesapla
        Object.keys(categoryStats).forEach(category => {
            const cat = categoryStats[category];
            if (cat.total > 0) {
                cat.accuracy = Math.round((cat.correct / cat.total) * 100);
            }
        });
        
        return {
            totalGames,
            totalQuestions,
            correctAnswers,
            totalScore,
            highestScore,
            averageScore: totalGames > 0 ? Math.round(totalScore / totalGames) : 0,
            accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
            categoryStats
        };
    }
    
    // Local istatistikleri yükle (fallback)
    loadLocalStatistics() {
        console.log('Local istatistikler yükleniyor...');
        
        try {
            this.stats = this.calculateStatsFromGameHistory();
            this.loadLocalRecentGames();
            this.updateUI();
        } catch (error) {
            console.error('Local istatistikler yükleme hatası:', error);
            this.stats = {
                totalGames: 0,
                totalQuestions: 0,
                correctAnswers: 0,
                highestScore: 0,
                averageScore: 0,
                accuracy: 0,
                categoryStats: {}
            };
            this.updateUI();
        } finally {
            this.showLoading(false);
        }
    }
    
    // GameHistory'den istatistik hesaplama
    calculateStatsFromGameHistory() {
        const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
        console.log('GameHistory bulundu:', gameHistory.length, 'oyun');
        
        let totalGames = gameHistory.length;
        let totalQuestions = 0;
        let correctAnswers = 0;
        let totalScore = 0;
        let highestScore = 0;
        let categoryStats = {};

        gameHistory.forEach(game => {
            totalQuestions += game.totalQuestions || 0;
            correctAnswers += game.correctAnswers || 0;
            totalScore += game.score || 0;
            
            if ((game.score || 0) > highestScore) {
                highestScore = game.score || 0;
            }
            
            if (game.category) {
                if (!categoryStats[game.category]) {
                    categoryStats[game.category] = { 
                        total: 0, 
                        correct: 0, 
                        games: 0, 
                        accuracy: 0 
                    };
                }
                categoryStats[game.category].total += game.totalQuestions || 0;
                categoryStats[game.category].correct += game.correctAnswers || 0;
                categoryStats[game.category].games++;
            }
        });

        // Kategori başarı oranlarını hesapla
        Object.keys(categoryStats).forEach(category => {
            const cat = categoryStats[category];
            if (cat.total > 0) {
                cat.accuracy = Math.round((cat.correct / cat.total) * 100);
            }
        });

        return {
            totalGames,
            totalQuestions,
            correctAnswers,
            totalScore,
            highestScore,
            averageScore: totalGames > 0 ? Math.round(totalScore / totalGames) : 0,
            accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
            categoryStats
        };
    }
    
    // Local'den son oyunları yükle
    loadLocalRecentGames() {
        const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
        this.recentGames = gameHistory.slice(-5).reverse();
    }
    
    // UI'ı güncelle
    updateUI() {
        this.updateGeneralStats();
        this.updateCategoryStats();
        this.updateRecentGames();
        this.updateUserBadges();
    }
    
    // Genel istatistikleri güncelle
    updateGeneralStats() {
        const elements = {
            'total-games-stat': this.stats.totalGames,
            'total-questions-stat': this.stats.totalQuestions,
            'correct-answers-stat': this.stats.correctAnswers,
            'accuracy-stat': '%' + this.stats.accuracy,
            'highest-score-stat': this.stats.highestScore,
            'average-score-stat': this.stats.averageScore
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });
        
        console.log('Genel istatistikler güncellendi:', elements);
    }
    
    // Kategori istatistiklerini güncelle
    updateCategoryStats() {
        const categoryContainer = document.getElementById('category-stats');
        if (!categoryContainer) return;
        
        categoryContainer.innerHTML = '';
        
        if (Object.keys(this.stats.categoryStats).length === 0) {
            categoryContainer.innerHTML = '<p class="empty-message">Henüz kategori istatistiği bulunmuyor.</p>';
            return;
        }
        
        Object.entries(this.stats.categoryStats).forEach(([category, data]) => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-stat-item';
            categoryItem.innerHTML = `
                <div class="category-info">
                    <h4>${category}</h4>
                    <div class="category-details">
                        <span><i class="fas fa-gamepad"></i> ${data.games || 0} oyun</span>
                        <span><i class="fas fa-question"></i> ${data.total || 0} soru</span>
                        <span><i class="fas fa-check"></i> ${data.correct || 0} doğru</span>
                    </div>
                </div>
                <div class="category-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${data.accuracy || 0}%"></div>
                    </div>
                    <span class="progress-text">%${data.accuracy || 0}</span>
                </div>
            `;
            
            categoryContainer.appendChild(categoryItem);
        });
    }
    
    // Son oyunları güncelle
    updateRecentGames() {
        const recentGamesContainer = document.getElementById('recent-games');
        if (!recentGamesContainer) return;
        
        if (this.recentGames.length === 0) {
            recentGamesContainer.innerHTML = '<p class="empty-message">Henüz oyun geçmişi bulunmuyor.</p>';
            return;
        }
        
        recentGamesContainer.innerHTML = '';
        
        this.recentGames.forEach((game, index) => {
            const gameDate = new Date(game.timestamp || game.date || Date.now()).toLocaleDateString('tr-TR');
            const accuracy = game.totalQuestions > 0 ? Math.round((game.score / game.totalQuestions) * 100) : 0;
            
            const gameItem = document.createElement('div');
            gameItem.className = 'recent-game-item';
            gameItem.innerHTML = `
                <div class="game-info">
                    <h4><i class="fas fa-folder"></i> ${game.category || 'Bilinmeyen Kategori'}</h4>
                    <span class="game-date"><i class="fas fa-calendar"></i> ${gameDate}</span>
                </div>
                <div class="game-results">
                    <span class="score"><i class="fas fa-star"></i> ${game.score || 0}</span>
                    <span class="questions"><i class="fas fa-question"></i> ${game.score || 0}/${game.totalQuestions || 0}</span>
                    <span class="accuracy ${accuracy >= 70 ? 'good' : accuracy >= 50 ? 'average' : 'poor'}">
                        <i class="fas fa-percentage"></i> %${accuracy}
                    </span>
                </div>
            `;
            
            recentGamesContainer.appendChild(gameItem);
        });
    }
    
    // Kullanıcı rozetlerini güncelle
    updateUserBadges() {
        const badgesContainer = document.getElementById('user-badges');
        if (!badgesContainer) return;
        
        badgesContainer.innerHTML = '';
        
        if (Object.keys(this.userBadges).length === 0) {
            badgesContainer.innerHTML = '<p class="empty-message">Henüz rozet kazanmadınız. Oyun oynayarak rozet kazanabilirsiniz!</p>';
            return;
        }
        
        Object.entries(this.userBadges).forEach(([badgeId, badgeData]) => {
            const badgeItem = document.createElement('div');
            badgeItem.className = 'badge-item';
            badgeItem.innerHTML = `
                <div class="badge-icon">
                    <i class="fas fa-award"></i>
                </div>
                <div class="badge-info">
                    <h4>${badgeData.name || badgeId}</h4>
                    <p>${badgeData.description || 'Rozet açıklaması'}</p>
                    <span class="badge-date">${new Date(badgeData.earnedAt || Date.now()).toLocaleDateString('tr-TR')}</span>
                </div>
            `;
            
            badgesContainer.appendChild(badgeItem);
        });
    }
}

// Global instance oluştur
const statisticsManager = new StatisticsManager();

// Global fonksiyonlar (geriye uyumluluk için)
function showStatistics() {
    statisticsManager.showStatistics();
}

function hideStatistics() {
    statisticsManager.hideStatistics();
}

function loadStatisticsData() {
    statisticsManager.loadStatisticsData();
}

// Sayfa yüklendiğinde çalışacak
document.addEventListener('DOMContentLoaded', function() {
    console.log('İstatistikler modülü hazır');
    
    // Geri dönüş butonu
    const backButton = document.getElementById('back-from-stats');
    if (backButton) {
        backButton.addEventListener('click', hideStatistics);
    }
}); 