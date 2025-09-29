// Başarım Sistemi
const achievements = {
    // Başarım tanımları
    achievementsList: [
        // Süreklilik başarımları
        {
            id: 'streak_3',
            name: '3 Gün Üst Üste',
            description: '3 gün üst üste quiz oynadınız',
            icon: 'fas fa-calendar-check',
            type: 'streak',
            requirement: 3,
            difficulty: 'kolay',
            unlocked: false
        },
        {
            id: 'streak_7',
            name: 'Haftalık Süreklilik',
            description: '7 gün üst üste quiz oynadınız',
            icon: 'fas fa-calendar-week',
            type: 'streak',
            requirement: 7,
            difficulty: 'orta',
            unlocked: false
        },
        {
            id: 'streak_30',
            name: 'Aylık Süreklilik',
            description: '30 gün üst üste quiz oynadınız',
            icon: 'fas fa-calendar-alt',
            type: 'streak',
            requirement: 30,
            difficulty: 'zor',
            unlocked: false
        },
        
        // Kategori başarımları
        {
            id: 'all_categories',
            name: 'Çok Yönlü',
            description: 'Tüm kategorilerde en az 1 quiz bitirdiniz',
            icon: 'fas fa-layer-group',
            type: 'categories',
            requirement: 'all',
            difficulty: 'orta',
            unlocked: false
        },
        {
            id: 'perfect_3_categories',
            name: 'Kategori Uzmanı',
            description: '3 farklı kategoride tam puan aldınız',
            icon: 'fas fa-award',
            type: 'categories',
            requirement: 3,
            difficulty: 'orta',
            unlocked: false
        },
        {
            id: 'perfect_all_categories',
            name: 'Quiz Ustası',
            description: 'Tüm kategorilerde tam puan aldınız',
            icon: 'fas fa-crown',
            type: 'categories',
            requirement: 'all',
            difficulty: 'zor',
            unlocked: false
        },
        
        // Toplam başarımlar
        {
            id: 'total_games_10',
            name: 'Quiz Sever',
            description: 'Toplam 10 quiz oynadınız',
            icon: 'fas fa-gamepad',
            type: 'total',
            requirement: 10,
            difficulty: 'kolay',
            unlocked: false
        },
        {
            id: 'total_games_50',
            name: 'Quiz Bağımlısı',
            description: 'Toplam 50 quiz oynadınız',
            icon: 'fas fa-dice',
            type: 'total',
            requirement: 50,
            difficulty: 'orta',
            unlocked: false
        },
        {
            id: 'total_games_100',
            name: 'Quiz Efsanesi',
            description: 'Toplam 100 quiz oynadınız',
            icon: 'fas fa-trophy',
            type: 'total',
            requirement: 100,
            difficulty: 'zor',
            unlocked: false
        },
        
        // Doğruluk başarımları
        {
            id: 'correct_50',
            name: 'Bilgi Hazinesi',
            description: 'Toplam 50 soruyu doğru cevapladınız',
            icon: 'fas fa-check-double',
            type: 'correct',
            requirement: 50,
            difficulty: 'kolay',
            unlocked: false
        },
        {
            id: 'correct_200',
            name: 'Bilgi Kütüphanesi',
            description: 'Toplam 200 soruyu doğru cevapladınız',
            icon: 'fas fa-book',
            type: 'correct',
            requirement: 200,
            difficulty: 'orta',
            unlocked: false
        },
        {
            id: 'correct_500',
            name: 'Bilgi Dağarcığı',
            description: 'Toplam 500 soruyu doğru cevapladınız',
            icon: 'fas fa-brain',
            type: 'correct',
            requirement: 500,
            difficulty: 'zor',
            unlocked: false
        },
        
        // Hız başarımları
        {
            id: 'speed_3s',
            name: 'Hızlı Düşünce',
            description: 'Ortalama cevap süreniz 3 saniyenin altında',
            icon: 'fas fa-bolt',
            type: 'speed',
            requirement: 3,
            difficulty: 'orta',
            unlocked: false
        },
        {
            id: 'perfect_speed',
            name: 'Anında Tepki',
            description: 'Tüm soruları ortalama 2 saniyenin altında cevaplayarak tam puan alın',
            icon: 'fas fa-tachometer-alt',
            type: 'speed',
            requirement: 2,
            difficulty: 'zor',
            unlocked: false
        }
    ],
    
    // Sabitler ve durum değişkenleri
    ACHIEVEMENTS_KEY: 'quizAchievements',
    STREAK_KEY: 'quizStreak',
    lastLoginDate: null,
    currentStreak: 0,
    
    // Sistemi başlat
    init: function() {
        this.loadAchievements();
        this.loadStreakData();
        this.updateStreak();
        
        // Başarım arayüzünü oluştur
        const achievementsContainer = document.getElementById('achievements-container');
        if (achievementsContainer) {
            this.renderAchievements(achievementsContainer);
        }
        
        this.addListeners();
    },
    
    // Başarım durumunu localStorage'dan yükle
    loadAchievements: function() {
        const achievementsJSON = localStorage.getItem(this.ACHIEVEMENTS_KEY);
        if (achievementsJSON) {
            const savedAchievements = JSON.parse(achievementsJSON);
            
            // Yüklenen başarımları mevcut listeye aktar
            this.achievementsList.forEach(achievement => {
                const savedAchievement = savedAchievements.find(a => a.id === achievement.id);
                if (savedAchievement) {
                    achievement.unlocked = savedAchievement.unlocked;
                }
            });
        }
    },
    
    // Başarım durumunu localStorage'a kaydet
    saveAchievements: function() {
        const simplifiedAchievements = this.achievementsList.map(a => ({
            id: a.id,
            unlocked: a.unlocked
        }));
        localStorage.setItem(this.ACHIEVEMENTS_KEY, JSON.stringify(simplifiedAchievements));
    },
    
    // Giriş yapılan tarih bilgisini yükle
    loadStreakData: function() {
        const streakData = localStorage.getItem(this.STREAK_KEY);
        if (streakData) {
            const data = JSON.parse(streakData);
            this.lastLoginDate = data.lastLoginDate;
            this.currentStreak = data.currentStreak || 0;
        }
    },
    
    // Giriş bilgisi ve süreklilik durumunu güncelle
    updateStreak: function() {
        const today = new Date().toDateString();
        
        // İlk giriş ise
        if (!this.lastLoginDate) {
            this.lastLoginDate = today;
            this.currentStreak = 1;
        } 
        // Bugün giriş yapıldıysa tekrar sayma
        else if (this.lastLoginDate === today) {
            // Zaten güncellenmiş, bir şey yapma
        } 
        // Dün giriş yapıldıysa sürekliliği artır
        else {
            const lastDate = new Date(this.lastLoginDate);
            const todayDate = new Date(today);
            
            const timeDiff = todayDate.getTime() - lastDate.getTime();
            const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            
            if (dayDiff === 1) {
                // Süreklilik devam ediyor
                this.currentStreak++;
                this.lastLoginDate = today;
            } else {
                // Süreklilik bozuldu
                this.currentStreak = 1;
                this.lastLoginDate = today;
            }
        }
        
        // Süreklilik verilerini kaydet
        localStorage.setItem(this.STREAK_KEY, JSON.stringify({
            lastLoginDate: this.lastLoginDate,
            currentStreak: this.currentStreak
        }));
        
        // Süreklilik başarımlarını kontrol et
        this.checkStreakAchievements();
    },
    
    // Süreklilik başarımlarını kontrol et
    checkStreakAchievements: function() {
        this.achievementsList.forEach(achievement => {
            if (achievement.type === 'streak' && !achievement.unlocked) {
                if (this.currentStreak >= achievement.requirement) {
                    this.unlockAchievement(achievement);
                }
            }
        });
    },
    
    // Quiz sonuçlarını işle ve başarımları kontrol et
    processGameResults: function(results, stats) {
        // Her oyun sonunda başarımları kontrol et
        this.checkAllAchievements(stats);
    },
    
    // Tüm başarımları kontrol et
    checkAllAchievements: function(stats) {
        if (!stats) return;
        
        // Kategori başarımları
        const categoriesPlayed = Object.keys(stats.categoryStats || {}).length;
        const totalCategories = window.quizApp && window.quizApp.allQuestionsData ? Object.keys(window.quizApp.allQuestionsData).length : 0;
        
        let perfectCategories = 0;
        for (const category in stats.categoryStats) {
            const catStat = stats.categoryStats[category];
            if (catStat.correct === catStat.total) {
                perfectCategories++;
            }
        }
        
        // Toplam oyun & doğru cevap başarımları
        this.achievementsList.forEach(achievement => {
            if (achievement.unlocked) return;
            
            switch (achievement.type) {
                case 'categories':
                    if (achievement.id === 'all_categories' && categoriesPlayed >= totalCategories) {
                        this.unlockAchievement(achievement);
                    } else if (achievement.id === 'perfect_3_categories' && perfectCategories >= 3) {
                        this.unlockAchievement(achievement);
                    } else if (achievement.id === 'perfect_all_categories' && perfectCategories >= totalCategories) {
                        this.unlockAchievement(achievement);
                    }
                    break;
                
                case 'total':
                    if (stats.gamesPlayed >= achievement.requirement) {
                        this.unlockAchievement(achievement);
                    }
                    break;
                
                case 'correct':
                    if (stats.totalCorrect >= achievement.requirement) {
                        this.unlockAchievement(achievement);
                    }
                    break;
                
                case 'speed':
                    if (achievement.id === 'speed_3s' && stats.averageTime <= achievement.requirement) {
                        this.unlockAchievement(achievement);
                    }
                    break;
            }
        });
    },
    
    // Başarımı aç ve bildirim göster
    unlockAchievement: function(achievement) {
        if (achievement.unlocked) return;
        
        achievement.unlocked = true;
        this.saveAchievements();
        
        // Başarım bildirimini göster
        this.showAchievementNotification(achievement);
        
        // Başarım arayüzünü güncelle
        this.updateAchievementsUI();
    },
    
    // Başarım açma bildirimi göster
    showAchievementNotification: function(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        
        notification.innerHTML = `
            <div class="achievement-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <div class="achievement-content">
                <div class="achievement-title">Başarım Açıldı!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animasyon ekle
        setTimeout(() => {
            notification.classList.add('show');
            
            // Ses çal
            if (window.quizApp && window.quizApp.soundEnabled) {
                window.quizApp.playSound(window.quizApp.soundVictory);
            }
            
            // 6 saniye sonra kaldır
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 6000);
        }, 100);
    },
    
    // Başarımları arayüzde listele
    renderAchievements: function(container) {
        container.innerHTML = '';
        
        // Süreklilik bilgisi
        const streakInfo = document.createElement('div');
        streakInfo.className = 'streak-info';
        streakInfo.innerHTML = `
            <div class="streak-icon"><i class="fas fa-fire"></i></div>
            <div class="streak-count">${this.currentStreak}</div>
            <div class="streak-label">Günlük Süreklilik</div>
        `;
        container.appendChild(streakInfo);
        
        // Zorluk seviyelerine göre gruplama
        const difficulties = ['kolay', 'orta', 'zor'];
        
        // Her zorluk seviyesi için başarımları grupla
        difficulties.forEach(difficulty => {
            const difficultyGroup = document.createElement('div');
            difficultyGroup.className = 'achievement-group';
            
            const groupTitle = document.createElement('h3');
            groupTitle.className = 'achievement-group-title';
            groupTitle.innerHTML = `<i class="fas fa-${
                difficulty === 'kolay' ? 'star-half-alt' : 
                difficulty === 'orta' ? 'star' : 'medal'
            }"></i> ${
                difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
            } Başarımlar`;
            
            difficultyGroup.appendChild(groupTitle);
            
            // Bu zorluktaki başarımları filtrele
            const filteredAchievements = this.achievementsList.filter(
                a => a.difficulty === difficulty
            );
            
            // Başarımlar grup listesi
            const achievementsList = document.createElement('div');
            achievementsList.className = 'achievements-list';
            
            filteredAchievements.forEach(achievement => {
                const achievementEl = document.createElement('div');
                achievementEl.className = 'achievement-item';
                if (achievement.unlocked) {
                    achievementEl.classList.add('unlocked');
                } else {
                    achievementEl.classList.add('locked');
                }
                
                achievementEl.innerHTML = `
                    <div class="achievement-item-icon"><i class="${achievement.icon}"></i></div>
                    <div class="achievement-item-info">
                        <div class="achievement-item-name">${achievement.unlocked ? achievement.name : '???'}</div>
                        <div class="achievement-item-description">${achievement.unlocked ? achievement.description : 'Bu başarım henüz kilitli'}</div>
                    </div>
                `;
                
                achievementsList.appendChild(achievementEl);
            });
            
            difficultyGroup.appendChild(achievementsList);
            container.appendChild(difficultyGroup);
        });
    },
    
    // Başarım arayüzünü güncelle
    updateAchievementsUI: function() {
        const achievementsContainer = document.getElementById('achievements-container');
        if (achievementsContainer) {
            this.renderAchievements(achievementsContainer);
        }
    },
    
    // Olay dinleyicilerini ekle
    addListeners: function() {
        // Quiz sonuçlarını dinle
        document.addEventListener('quizCompleted', (e) => {
            // quizApp'ten istatistikleri al
            const stats = window.quizApp ? window.quizApp.getStats() : {};
            
            this.processGameResults({
                score: e.detail.score,
                total: e.detail.total,
                category: e.detail.category
            }, stats);
        });
    }
};

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    achievements.init();
}); 