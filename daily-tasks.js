// Günlük Görevler Sistemi
const dailyTasks = {
    // Görevler ve ilgili fonksiyonlar
    tasks: [
        {
            id: 'daily_correct_3',
            name: '3 Doğru Cevap',
            description: 'Bugün 3 soruyu doğru cevaplayın',
            reward: 5, // Puan ödülü
            required: 3,
            current: 0,
            icon: 'fas fa-check-circle',
            check: function(stats) {
                return stats.dailyCorrect >= this.required;
            },
            update: function(stats) {
                this.current = stats.dailyCorrect;
                return this.current >= this.required;
            }
        },
        {
            id: 'daily_categories_2',
            name: 'Kategori Kaşifi',
            description: 'Bugün 2 farklı kategoride yarışın',
            reward: 10,
            required: 2,
            current: 0,
            icon: 'fas fa-compass',
            check: function(stats) {
                return (stats.dailyCategories && Object.keys(stats.dailyCategories).length >= this.required);
            },
            update: function(stats) {
                this.current = stats.dailyCategories ? Object.keys(stats.dailyCategories).length : 0;
                return this.current >= this.required;
            }
        },
        {
            id: 'daily_perfect_1',
            name: 'Mükemmeliyetçi',
            description: 'Bugün bir kategoride tüm soruları doğru cevaplayın',
            reward: 15,
            required: 1,
            current: 0,
            icon: 'fas fa-star',
            check: function(stats) {
                return stats.dailyPerfectRounds >= this.required;
            },
            update: function(stats) {
                this.current = stats.dailyPerfectRounds;
                return this.current >= this.required;
            }
        }
    ],

    // Sabitler ve durum
    DAILY_TASKS_KEY: 'quizDailyTasks',
    DAILY_STATS_KEY: 'quizDailyStats',
    POINTS_KEY: 'quizTaskPoints',
    lastResetDate: null,
    taskElements: [],
    points: 0,

    // Sistemi başlat
    init: function() {
        this.loadTaskState();
        this.checkDateReset();
        this.loadPoints();
        
        // Görev arayüzünü oluşturmak için gerekli HTML elementleri
        const tasksContainer = document.getElementById('daily-tasks-container');
        if (tasksContainer) {
            this.renderTasks(tasksContainer);
        }
        
        // Diğer sisteme olay dinleyicilerini ekle
        this.addListeners();
    },
    
    // Tarihe göre günlük görevleri sıfırla
    checkDateReset: function() {
        const today = new Date().toDateString();
        if (this.lastResetDate !== today) {
            this.resetDailyStats();
            this.resetTaskProgress();
            this.lastResetDate = today;
            this.saveTaskState();
        }
    },
    
    // Görev durumunu localStorage'dan yükle
    loadTaskState: function() {
        const taskState = localStorage.getItem(this.DAILY_TASKS_KEY);
        if (taskState) {
            const state = JSON.parse(taskState);
            this.lastResetDate = state.lastResetDate;
            
            // Görev durumlarını yükle
            for (let i = 0; i < this.tasks.length; i++) {
                if (state.tasks && state.tasks[i]) {
                    this.tasks[i].current = state.tasks[i].current;
                }
            }
        }
    },
    
    // Görev durumunu localStorage'a kaydet
    saveTaskState: function() {
        const state = {
            lastResetDate: this.lastResetDate,
            tasks: this.tasks.map(task => ({ 
                id: task.id, 
                current: task.current 
            }))
        };
        localStorage.setItem(this.DAILY_TASKS_KEY, JSON.stringify(state));
    },
    
    // Günlük istatistikleri sıfırla
    resetDailyStats: function() {
        const stats = {
            dailyCorrect: 0,
            dailyCategories: {},
            dailyPerfectRounds: 0,
            dailyGamesPlayed: 0
        };
        localStorage.setItem(this.DAILY_STATS_KEY, JSON.stringify(stats));
    },
    
    // Görev ilerlemesini sıfırla
    resetTaskProgress: function() {
        this.tasks.forEach(task => {
            task.current = 0;
        });
    },
    
    // Günlük istatistikleri getir
    getDailyStats: function() {
        const statsJSON = localStorage.getItem(this.DAILY_STATS_KEY);
        if (statsJSON) {
            return JSON.parse(statsJSON);
        }
        return {
            dailyCorrect: 0,
            dailyCategories: {},
            dailyPerfectRounds: 0,
            dailyGamesPlayed: 0
        };
    },
    
    // Günlük istatistikleri güncelle
    updateDailyStats: function(gameResults) {
        const stats = this.getDailyStats();
        
        // Doğru cevapları güncelle
        stats.dailyCorrect += gameResults.score;
        
        // Kategorileri güncelle
        if (!stats.dailyCategories) stats.dailyCategories = {};
        stats.dailyCategories[gameResults.category] = true;
        
        // Mükemmel turu kontrol et
        if (gameResults.score === gameResults.total) {
            stats.dailyPerfectRounds++;
        }
        
        // Oynanan oyun sayısını artır
        stats.dailyGamesPlayed++;
        
        // Güncellenmiş istatistikleri kaydet
        localStorage.setItem(this.DAILY_STATS_KEY, JSON.stringify(stats));
        
        // Görevleri güncelle
        this.updateTasks(stats);
    },
    
    // Puan sistemini yükle
    loadPoints: function() {
        const pointsString = localStorage.getItem(this.POINTS_KEY);
        this.points = pointsString ? parseInt(pointsString) : 0;
    },
    
    // Puanları güncelle
    updatePoints: function(amount) {
        this.points += amount;
        localStorage.setItem(this.POINTS_KEY, this.points.toString());
        this.updatePointsDisplay();
    },
    
    // Puan gösterimini güncelle
    updatePointsDisplay: function() {
        const pointsDisplay = document.getElementById('task-points');
        if (pointsDisplay) {
            pointsDisplay.textContent = this.points;
        }
    },
    
    // Görevleri güncelle ve tamamlananları işaretle
    updateTasks: function(stats) {
        let tasksCompleted = 0;
        
        for (let task of this.tasks) {
            const wasCompleted = task.check(stats);
            const isNowCompleted = task.update(stats);
            
            // Yeni tamamlanmış görev
            if (!wasCompleted && isNowCompleted) {
                this.updatePoints(task.reward);
                tasksCompleted++;
                
                // Bildirim göster
                this.showTaskCompletionNotification(task);
            }
        }
        
        this.saveTaskState();
        this.updateTasksUI();
        
        return tasksCompleted;
    },
    
    // Görev arayüzünü güncelle
    updateTasksUI: function() {
        this.tasks.forEach((task, index) => {
            if (this.taskElements[index]) {
                const progressEl = this.taskElements[index].querySelector('.task-progress');
                const statusEl = this.taskElements[index].querySelector('.task-status');
                
                if (progressEl) {
                    progressEl.textContent = `${task.current}/${task.required}`;
                }
                
                if (statusEl) {
                    if (task.current >= task.required) {
                        statusEl.innerHTML = '<i class="fas fa-check-circle" style="color: green;"></i>';
                        this.taskElements[index].classList.add('completed');
                    } else {
                        statusEl.innerHTML = '<i class="fas fa-hourglass-half"></i>';
                        this.taskElements[index].classList.remove('completed');
                    }
                }
            }
        });
    },
    
    // Görevleri arayüzde listele
    renderTasks: function(container) {
        container.innerHTML = '';
        this.taskElements = [];
        
        // Puan başlığı
        const pointsHeader = document.createElement('div');
        pointsHeader.className = 'points-header';
        pointsHeader.innerHTML = `
            <h3><i class="fas fa-coins"></i> Görev Puanları</h3>
            <div class="points-display"><span id="task-points">${this.points}</span> puan</div>
        `;
        container.appendChild(pointsHeader);
        
        // Görevler listesi
        const tasksList = document.createElement('div');
        tasksList.className = 'tasks-list';
        
        this.tasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = 'task-item';
            if (task.current >= task.required) {
                taskEl.classList.add('completed');
            }
            
            taskEl.innerHTML = `
                <div class="task-icon"><i class="${task.icon}"></i></div>
                <div class="task-info">
                    <div class="task-name">${task.name}</div>
                    <div class="task-description">${task.description}</div>
                    <div class="task-progress-container">
                        <div class="task-progress">${task.current}/${task.required}</div>
                        <div class="task-reward">+${task.reward} <i class="fas fa-coins"></i></div>
                    </div>
                </div>
                <div class="task-status">
                    ${task.current >= task.required ? 
                    '<i class="fas fa-check-circle" style="color: green;"></i>' : 
                    '<i class="fas fa-hourglass-half"></i>'}
                </div>
            `;
            
            tasksList.appendChild(taskEl);
            this.taskElements.push(taskEl);
        });
        
        container.appendChild(tasksList);
    },
    
    // Görev tamamlama bildirimi göster
    showTaskCompletionNotification: function(task) {
        const notification = document.createElement('div');
        notification.className = 'task-notification';
        notification.innerHTML = `
            <div class="notification-icon"><i class="${task.icon}"></i></div>
            <div class="notification-content">
                <div class="notification-title">Görev Tamamlandı!</div>
                <div class="notification-task">${task.name}</div>
                <div class="notification-reward">+${task.reward} puan kazandınız</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animasyon ekle
        setTimeout(() => {
            notification.classList.add('show');
            
            // 5 saniye sonra kaldır
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 5000);
        }, 100);
    },
    
    // Olay dinleyicilerini ekle
    addListeners: function() {
        // Quiz sonuçlarını dinle
        document.addEventListener('quizCompleted', (e) => {
            this.updateDailyStats({
                score: e.detail.score,
                total: e.detail.total,
                category: e.detail.category
            });
        });
    }
};

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    dailyTasks.init();
}); 