// Soru Bildirimi Sistemi
const feedbackSystem = {
    // Sistemin durumu ve sabitleri
    FEEDBACKS_KEY: 'quizFeedbacks',
    feedbacks: [],
    
    // Sistemi başlat
    init: function() {
        this.loadFeedbacks();
        this.addListeners();
    },
    
    // Mevcut bildirimleri yükle
    loadFeedbacks: function() {
        const feedbacksJSON = localStorage.getItem(this.FEEDBACKS_KEY);
        this.feedbacks = feedbacksJSON ? JSON.parse(feedbacksJSON) : [];
    },
    
    // Bildirimleri kaydet
    saveFeedbacks: function() {
        localStorage.setItem(this.FEEDBACKS_KEY, JSON.stringify(this.feedbacks));
    },
    
    // Yeni bildirim ekle
    addFeedback: function(feedback) {
        // Benzersiz ID oluştur
        feedback.id = 'fb_' + Date.now();
        feedback.date = new Date().toISOString();
        feedback.status = 'inceleniyor';
        
        this.feedbacks.push(feedback);
        this.saveFeedbacks();
        
        // Bildirim ekranını güncelle
        this.updateFeedbacksList();
        
        return feedback.id;
    },
    
    // Bildirim durumunu güncelle
    updateFeedbackStatus: function(id, status) {
        const feedback = this.feedbacks.find(f => f.id === id);
        if (feedback) {
            feedback.status = status;
            this.saveFeedbacks();
            this.updateFeedbacksList();
        }
    },
    
    // Bildirim arayüzünü güncelle
    updateFeedbacksList: function() {
        const feedbackList = document.getElementById('feedback-list');
        if (!feedbackList) return;
        
        feedbackList.innerHTML = '';
        
        if (this.feedbacks.length === 0) {
            feedbackList.innerHTML = '<div class="no-feedbacks">Henüz bildirim yok</div>';
            return;
        }
        
        // Bildirimleri tarih sırasına göre sırala (en yeniden en eskiye)
        const sortedFeedbacks = [...this.feedbacks].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        sortedFeedbacks.forEach(feedback => {
            const feedbackItem = document.createElement('div');
            feedbackItem.className = 'feedback-item';
            feedbackItem.dataset.id = feedback.id;
            
            // Durum sınıfını ekle
            feedbackItem.classList.add(feedback.status.replace(/\s/g, '-'));
            
            const dateObj = new Date(feedback.date);
            const formattedDate = dateObj.toLocaleDateString('tr-TR') + ' ' + 
                                dateObj.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'});
            
            // Durum rengini ve ikonunu belirle
            let statusIcon, statusColor;
            switch (feedback.status) {
                case 'inceleniyor':
                    statusIcon = 'clock';
                    statusColor = 'orange';
                    break;
                case 'onaylandı':
                    statusIcon = 'check-circle';
                    statusColor = 'green';
                    break;
                case 'reddedildi':
                    statusIcon = 'times-circle';
                    statusColor = 'red';
                    break;
                default:
                    statusIcon = 'question-circle';
                    statusColor = 'gray';
            }
            
            feedbackItem.innerHTML = `
                <div class="feedback-header">
                    <div class="feedback-category">${feedback.category}</div>
                    <div class="feedback-date">${formattedDate}</div>
                </div>
                <div class="feedback-content">
                    <div class="feedback-question">
                        <strong>Soru:</strong> ${feedback.question}
                    </div>
                    <div class="feedback-issue">
                        <strong>Sorun:</strong> ${feedback.issueType}
                    </div>
                    <div class="feedback-description">
                        <strong>Açıklama:</strong> ${feedback.description}
                    </div>
                    ${feedback.suggestion ? `
                    <div class="feedback-suggestion">
                        <strong>Öneri:</strong> ${feedback.suggestion}
                    </div>` : ''}
                </div>
                <div class="feedback-status" style="color: ${statusColor}">
                    <i class="fas fa-${statusIcon}"></i> ${feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                </div>
            `;
            
            feedbackList.appendChild(feedbackItem);
        });
    },
    
    // Bildirim formunu göster
    showFeedbackForm: function(questionData) {
        // Mevcut form varsa kaldır
        const existingForm = document.querySelector('.feedback-form-container');
        if (existingForm) {
            existingForm.remove();
        }
        
        // Yeni form oluştur
        const formContainer = document.createElement('div');
        formContainer.className = 'feedback-form-container';
        
        formContainer.innerHTML = `
            <div class="feedback-form">
                <div class="feedback-form-header">
                    <h3>Soru Bildirimi</h3>
                    <button class="close-form"><i class="fas fa-times"></i></button>
                </div>
                <div class="feedback-form-content">
                    <div class="feedback-question-info">
                        <div><strong>Kategori:</strong> ${questionData.category}</div>
                        <div><strong>Soru:</strong> ${questionData.question}</div>
                        <div><strong>Doğru Cevap:</strong> ${questionData.correctAnswer}</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="issue-type">Sorun Türü:</label>
                        <select id="issue-type" required>
                            <option value="">Seçiniz...</option>
                            <option value="Hatalı soru">Hatalı soru</option>
                            <option value="Yanlış cevap">Yanlış cevap</option>
                            <option value="Yazım hatası">Yazım hatası</option>
                            <option value="Anlaşılmayan soru">Anlaşılmayan soru</option>
                            <option value="Diğer">Diğer</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Açıklama:</label>
                        <textarea id="description" rows="3" placeholder="Lütfen sorunu detaylı açıklayın" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="suggestion">Düzeltme Önerisi (İsteğe Bağlı):</label>
                        <textarea id="suggestion" rows="2" placeholder="Sorunun nasıl düzeltilmesi gerektiğini belirtebilirsiniz"></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button id="cancel-feedback" class="secondary-btn">İptal</button>
                        <button id="submit-feedback" class="primary-btn">Gönder</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(formContainer);
        
        // Kapatma düğmesi
        formContainer.querySelector('.close-form').addEventListener('click', () => {
            formContainer.remove();
        });
        
        // İptal düğmesi
        formContainer.querySelector('#cancel-feedback').addEventListener('click', () => {
            formContainer.remove();
        });
        
        // Gönderme düğmesi
        formContainer.querySelector('#submit-feedback').addEventListener('click', () => {
            const issueType = formContainer.querySelector('#issue-type').value;
            const description = formContainer.querySelector('#description').value;
            const suggestion = formContainer.querySelector('#suggestion').value;
            
            // Doğrulama
            if (!issueType || !description) {
                alert('Lütfen sorun türünü seçin ve açıklama yazın.');
                return;
            }
            
            // Bildirim oluştur
            const feedback = {
                category: questionData.category,
                question: questionData.question,
                correctAnswer: questionData.correctAnswer,
                issueType: issueType,
                description: description,
                suggestion: suggestion
            };
            
            // Bildirim ekle
            const feedbackId = this.addFeedback(feedback);
            
            // Formu kapat
            formContainer.remove();
            
            // Bildirim başarılı mesajı
            this.showSuccessMessage();
        });
    },
    
    // Başarılı bildirim mesajı göster
    showSuccessMessage: function() {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'feedback-success-message';
        messageContainer.innerHTML = `
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <div class="success-text">Bildiriminiz başarıyla gönderildi.</div>
        `;
        
        document.body.appendChild(messageContainer);
        
        // 3 saniye sonra mesajı kaldır
        setTimeout(() => {
            messageContainer.classList.add('fade-out');
            setTimeout(() => {
                messageContainer.remove();
            }, 500);
        }, 3000);
    },
    
    // Olay dinleyicilerini ekle
    addListeners: function() {
        // Sonuç ekranında bildirimlere tıklama
        document.addEventListener('click', (e) => {
            const reportButton = e.target.closest('.report-question');
            if (reportButton) {
                const questionData = {
                    category: reportButton.dataset.category,
                    question: reportButton.dataset.question,
                    correctAnswer: reportButton.dataset.answer
                };
                
                this.showFeedbackForm(questionData);
            }
        });
        
        // Bildirimler sekmesi tıklandığında bildirimleri güncelle
        const feedbackTab = document.querySelector('[data-tab="feedbacks"]');
        if (feedbackTab) {
            feedbackTab.addEventListener('click', () => {
                this.updateFeedbacksList();
            });
        }
    }
};

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    feedbackSystem.init();
}); 