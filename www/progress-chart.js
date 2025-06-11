// İlerleme Grafiği Sistemi
const progressChart = {
    // Grafik nesneleri
    categoryChart: null,
    timeChart: null,
    
    // Sistemi başlat
    init: function() {
        // Chart.js kütüphanesinin yüklendiğinden emin ol
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js yüklenmemiş. Grafik özellikleri devre dışı.');
            return;
        }
        
        // İlgili HTML elementlerini kontrol et
        this.updateButton = document.getElementById('update-charts');
        this.categoryChartCanvas = document.getElementById('category-chart');
        this.timeChartCanvas = document.getElementById('time-chart');
        
        if (this.updateButton) {
            this.updateButton.addEventListener('click', () => this.updateCharts());
        }
        
        // İlk yükleme
        this.updateCharts();
    },
    
    // Grafikleri güncelle
    updateCharts: function() {
        const stats = window.quizApp.getStats();
        
        if (this.categoryChartCanvas) {
            this.updateCategoryChart(stats);
        }
        
        if (this.timeChartCanvas) {
            this.updateTimeChart(stats);
        }
    },
    
    // Kategori başarı grafiğini güncelle
    updateCategoryChart: function(stats) {
        // Mevcut grafik varsa yok et
        if (this.categoryChart) {
            this.categoryChart.destroy();
        }
        
        const categoryData = {
            labels: [],
            datasets: [{
                label: 'Doğru Cevap Yüzdesi',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1
            }]
        };
        
        // Kategori verilerini hazırla
        const categories = Object.keys(stats.categoryStats || {});
        
        if (categories.length === 0) {
            // Veri yoksa varsayılan mesaj
            this.categoryChartCanvas.parentElement.innerHTML = '<div class="no-data-message">Henüz kategori verisi yok</div>';
            return;
        }
        
        for (const category of categories) {
            const catStat = stats.categoryStats[category];
            if (catStat.total > 0) {
                const percentage = (catStat.correct / catStat.total) * 100;
                categoryData.labels.push(category);
                categoryData.datasets[0].data.push(percentage.toFixed(1));
                
                // Renk ata
                const hue = (categoryData.labels.length * 40) % 360;
                categoryData.datasets[0].backgroundColor.push(`hsla(${hue}, 70%, 60%, 0.7)`);
                categoryData.datasets[0].borderColor.push(`hsla(${hue}, 70%, 50%, 1)`);
            }
        }
        
        // Grafik seçenekleri
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Doğru Cevap Yüzdesi (%)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const categoryIndex = context.dataIndex;
                            const category = categories[categoryIndex];
                            const catStat = stats.categoryStats[category];
                            return [
                                `Doğru: ${catStat.correct}/${catStat.total} (${context.formattedValue}%)`,
                                `Toplam Soru: ${catStat.total}`
                            ];
                        }
                    }
                }
            }
        };
        
        // Yeni grafiği oluştur
        this.categoryChart = new Chart(this.categoryChartCanvas, {
            type: 'bar',
            data: categoryData,
            options: options
        });
    },
    
    // Zaman grafiğini güncelle (son 20 oyun)
    updateTimeChart: function(stats) {
        // Zaman verileri localStorage'da saklanmalı
        const timeData = this.getTimeData();
        
        // Mevcut grafik varsa yok et
        if (this.timeChart) {
            this.timeChart.destroy();
        }
        
        // Canvas elementi bulunamadıysa işlemi sonlandır
        if (!this.timeChartCanvas) {
            console.warn('Zaman grafiği için canvas elementi bulunamadı');
            return;
        }
        
        if (!timeData || timeData.length === 0) {
            // Veri yoksa varsayılan mesaj
            this.timeChartCanvas.parentElement.innerHTML = '<div class="no-data-message">Henüz zaman verisi yok</div>';
            return;
        }
        
        // Son 20 oyunu al
        const recentGames = timeData.slice(-20);
        
        const chartData = {
            labels: recentGames.map((_, index) => `Oyun ${index + 1}`),
            datasets: [
                {
                    label: 'Doğru Cevap Sayısı',
                    data: recentGames.map(game => game.correct),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    yAxisID: 'y',
                    type: 'bar'
                },
                {
                    label: 'Ortalama Yanıt Süresi (sn)',
                    data: recentGames.map(game => game.avgTime),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    yAxisID: 'y1',
                    type: 'line'
                }
            ]
        };
        
        // Grafik seçenekleri
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Doğru Sayısı'
                    },
                    beginAtZero: true,
                    max: Math.max(...recentGames.map(game => game.total)) || 10
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Süre (sn)'
                    },
                    beginAtZero: true,
                    max: Math.max(...recentGames.map(game => game.avgTime)) * 1.2 || 15,
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            const gameIndex = tooltipItems[0].dataIndex;
                            const game = recentGames[gameIndex];
                            return `${game.category} - ${game.date}`;
                        }
                    }
                }
            }
        };
        
        // Yeni grafiği oluştur
        this.timeChart = new Chart(this.timeChartCanvas, {
            type: 'bar',
            data: chartData,
            options: options
        });
    },
    
    // Zaman verilerini localStorage'dan al
    getTimeData: function() {
        const timeDataJSON = localStorage.getItem('quizTimeData');
        return timeDataJSON ? JSON.parse(timeDataJSON) : [];
    },
    
    // Yeni oyun verisi ekle
    addGameData: function(gameData) {
        let timeData = this.getTimeData();
        
        // Maksimum 100 oyun tut
        if (timeData.length >= 100) {
            timeData = timeData.slice(-99);
        }
        
        // Yeni oyun verisini ekle
        timeData.push({
            date: new Date().toLocaleDateString('tr-TR'),
            category: gameData.category,
            correct: gameData.score,
            total: gameData.total,
            avgTime: gameData.avgTime
        });
        
        // Güncellenen veriyi kaydet
        localStorage.setItem('quizTimeData', JSON.stringify(timeData));
    },
    
    // Olay dinleyicilerini ekle
    addListeners: function() {
        // Quiz sonuçlarını dinle
        document.addEventListener('quizCompleted', (e) => {
            this.addGameData({
                score: e.detail.score,
                total: e.detail.total,
                category: e.detail.category,
                avgTime: e.detail.avgTime || 0
            });
            
            // Grafikler açıksa güncelle
            if (document.getElementById('progress-tab').classList.contains('active')) {
                this.updateCharts();
            }
        });
        
        // Sekme değişikliğini dinle
        const progressTab = document.querySelector('[data-tab="progress"]');
        if (progressTab) {
            progressTab.addEventListener('click', () => {
                setTimeout(() => this.updateCharts(), 100);
            });
        }
    }
};

// Quiz tamamlandığında sonuçları yayımla
function emitQuizResults(score, total, category, avgTime) {
    const event = new CustomEvent('quizCompleted', {
        detail: {
            score: score,
            total: total,
            category: category,
            avgTime: avgTime
        }
    });
    document.dispatchEvent(event);
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    progressChart.init();
    progressChart.addListeners();
}); 