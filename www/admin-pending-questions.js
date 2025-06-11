// Yönetici Panel - Bekleyen Sorular Yönetimi

class PendingQuestionsManager {
    constructor() {
        this.pendingQuestions = [];
        this.currentPage = 1;
        this.questionsPerPage = 10;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPendingQuestions();
    }

    bindEvents() {
        // Yenile butonu
        const refreshBtn = document.getElementById('admin-refresh-pending');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadPendingQuestions();
            });
        }

        // Tab değiştiğinde
        const pendingTab = document.querySelector('[data-tab="pending-questions"]');
        if (pendingTab) {
            pendingTab.addEventListener('click', () => {
                this.loadPendingQuestions();
            });
        }
    }

    // Bekleyen soruları yükle
    async loadPendingQuestions() {
        let pendingQuestions = [];

        try {
            // JSON dosyasından yükle
            const response = await fetch('./pending_questions.json');
            if (response.ok) {
                const data = await response.json();
                pendingQuestions = data.pending || [];
            }
        } catch (error) {
            console.log('JSON dosyası yüklenemedi, localStorage kontrol ediliyor...');
        }

        try {
            // LocalStorage'dan yükle
            const localPending = JSON.parse(localStorage.getItem('pendingQuestions') || '[]');
            pendingQuestions = [...pendingQuestions, ...localPending];
        } catch (error) {
            console.error('LocalStorage yüklenirken hata:', error);
        }

        try {
            // Firebase'den yükle (varsa)
            if (firebase.firestore) {
                const querySnapshot = await firebase.firestore().collection('pendingQuestions').get();
                querySnapshot.forEach((doc) => {
                    const questionData = doc.data();
                    // Aynı ID'li soru yoksa ekle
                    if (!pendingQuestions.find(q => q.id === questionData.id)) {
                        pendingQuestions.push(questionData);
                    }
                });
            }
        } catch (error) {
            console.log('Firebase yüklenirken hata:', error);
        }

        // Tarih sırasına göre sırala (en yeni en üstte)
        pendingQuestions.sort((a, b) => {
            const dateA = new Date(a.submittedAt || a.addedAt || 0);
            const dateB = new Date(b.submittedAt || b.addedAt || 0);
            return dateB - dateA;
        });

        this.pendingQuestions = pendingQuestions;
        this.renderPendingQuestions();
        this.updatePendingCount();
    }

    // Bekleyen soruları görüntüle
    renderPendingQuestions() {
        const container = document.getElementById('admin-pending-questions-list');
        if (!container) return;

        if (this.pendingQuestions.length === 0) {
            container.innerHTML = `
                <div class="admin-empty-state">
                    <i class="fas fa-check-circle"></i>
                    <h3>Bekleyen Soru Yok</h3>
                    <p>Şu anda onay bekleyen herhangi bir soru bulunmuyor.</p>
                </div>
            `;
            return;
        }

        // Sayfalama hesaplama
        const startIndex = (this.currentPage - 1) * this.questionsPerPage;
        const endIndex = startIndex + this.questionsPerPage;
        const currentQuestions = this.pendingQuestions.slice(startIndex, endIndex);

        const questionsHTML = currentQuestions.map((question, index) => {
            const actualIndex = startIndex + index;
            return this.createQuestionCard(question, actualIndex);
        }).join('');

        container.innerHTML = `
            <div class="admin-pending-questions-container">
                ${questionsHTML}
                ${this.createPagination()}
            </div>
        `;

        // Buton olaylarını bağla
        this.bindQuestionEvents();
    }

    // Soru kartı oluştur
    createQuestionCard(question, index) {
        const submittedDate = question.submittedAt ? 
            new Date(question.submittedAt).toLocaleDateString('tr-TR') : 
            'Bilinmiyor';

        const difficultyBadge = this.getDifficultyBadge(question.difficulty);
        const typeBadge = this.getTypeBadge(question.type);

        return `
            <div class="admin-pending-question-card" data-index="${index}">
                <div class="question-card-header">
                    <div class="question-badges">
                        <span class="category-badge">${question.category}</span>
                        ${difficultyBadge}
                        ${typeBadge}
                    </div>
                    <div class="question-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${submittedDate}
                    </div>
                </div>

                <div class="question-content">
                    <h4 class="question-text">${question.question}</h4>
                    
                    ${this.renderQuestionDetails(question)}
                </div>

                <div class="question-meta">
                    <div class="submitter-info">
                        <i class="fas fa-user"></i>
                        <span>Gönderen: ${question.submittedBy || 'Anonim'}</span>
                    </div>
                    ${question.note ? `<div class="question-note"><i class="fas fa-sticky-note"></i> ${question.note}</div>` : ''}
                </div>

                <div class="question-actions">
                    <button class="admin-btn approve-question" data-index="${index}">
                        <i class="fas fa-check"></i> Onayla
                    </button>
                    <button class="admin-btn-secondary edit-question" data-index="${index}">
                        <i class="fas fa-edit"></i> Düzenle
                    </button>
                    <button class="admin-btn-danger reject-question" data-index="${index}">
                        <i class="fas fa-times"></i> Reddet
                    </button>
                </div>
            </div>
        `;
    }

    // Soru tipine göre detayları render et
    renderQuestionDetails(question) {
        switch (question.type) {
            case 'BlankFilling':
                return `
                    <div class="question-details">
                        <p><strong>Doğru Cevap:</strong> ${question.correctAnswer}</p>
                        <p><strong>Mevcut Harfler:</strong> ${question.choices ? question.choices.join(', ') : 'Belirtilmemiş'}</p>
                    </div>
                `;

            case 'TrueFalse':
                return `
                    <div class="question-details">
                        <div class="true-false-options">
                            <span class="option ${question.correctAnswer === 'DOĞRU' ? 'correct' : ''}">DOĞRU</span>
                            <span class="option ${question.correctAnswer === 'YANLIŞ' ? 'correct' : ''}">YANLIŞ</span>
                        </div>
                    </div>
                `;

            default: // MultipleChoice
                return `
                    <div class="question-details">
                        <div class="multiple-choice-options">
                            ${question.options ? question.options.map(option => `
                                <div class="option ${option === question.correctAnswer ? 'correct' : ''}">
                                    ${option}
                                </div>
                            `).join('') : 'Seçenekler belirtilmemiş'}
                        </div>
                    </div>
                `;
        }
    }

    // Zorluk seviyesi badge'i
    getDifficultyBadge(difficulty) {
        const badges = {
            'easy': '<span class="difficulty-badge easy">Kolay</span>',
            'medium': '<span class="difficulty-badge medium">Orta</span>',
            'hard': '<span class="difficulty-badge hard">Zor</span>'
        };
        return badges[difficulty] || '<span class="difficulty-badge">Belirsiz</span>';
    }

    // Soru tipi badge'i
    getTypeBadge(type) {
        const badges = {
            'MultipleChoice': '<span class="type-badge multiple">Çoktan Seçmeli</span>',
            'TrueFalse': '<span class="type-badge truefalse">Doğru/Yanlış</span>',
            'BlankFilling': '<span class="type-badge blank">Boşluk Doldurma</span>'
        };
        return badges[type] || '<span class="type-badge">Standart</span>';
    }

    // Sayfalama oluştur
    createPagination() {
        const totalPages = Math.ceil(this.pendingQuestions.length / this.questionsPerPage);
        
        if (totalPages <= 1) return '';

        return `
            <div class="admin-pagination">
                <button class="admin-btn-secondary" id="prev-pending-page" ${this.currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>
                <span class="pagination-info">
                    Sayfa ${this.currentPage} / ${totalPages}
                    (${this.pendingQuestions.length} soru)
                </span>
                <button class="admin-btn-secondary" id="next-pending-page" ${this.currentPage === totalPages ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
    }

    // Soru olaylarını bağla
    bindQuestionEvents() {
        // Onaylama butonları
        document.querySelectorAll('.approve-question').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('[data-index]').dataset.index);
                this.approveQuestion(index);
            });
        });

        // Reddetme butonları
        document.querySelectorAll('.reject-question').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('[data-index]').dataset.index);
                this.rejectQuestion(index);
            });
        });

        // Düzenleme butonları
        document.querySelectorAll('.edit-question').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('[data-index]').dataset.index);
                this.editQuestion(index);
            });
        });

        // Sayfalama butonları
        const prevBtn = document.getElementById('prev-pending-page');
        const nextBtn = document.getElementById('next-pending-page');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderPendingQuestions();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.pendingQuestions.length / this.questionsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderPendingQuestions();
                }
            });
        }
    }

    // Soruyu onayla
    async approveQuestion(index) {
        const question = this.pendingQuestions[index];
        if (!question) return;

        if (!confirm(`"${question.question.substring(0, 50)}..." sorusunu onaylamak istediğinizden emin misiniz?`)) {
            return;
        }

        try {
            // Ana soru bankasına ekle
            await this.addToMainQuestionBank(question);
            
            // Bekleyen sorular listesinden kaldır
            await this.removeFromPending(index);
            
            // Başarı mesajı
            this.showMessage('Soru başarıyla onaylandı ve soru bankasına eklendi!', 'success');
            
            // Listeyi yenile
            this.loadPendingQuestions();
            
        } catch (error) {
            console.error('Soru onaylanırken hata:', error);
            this.showMessage('Soru onaylanırken bir hata oluştu.', 'error');
        }
    }

    // Soruyu reddet
    async rejectQuestion(index) {
        const question = this.pendingQuestions[index];
        if (!question) return;

        const reason = prompt('Reddetme nedeni (isteğe bağlı):');
        
        if (!confirm(`"${question.question.substring(0, 50)}..." sorusunu reddetmek istediğinizden emin misiniz?`)) {
            return;
        }

        try {
            // Bekleyen sorular listesinden kaldır
            await this.removeFromPending(index, reason);
            
            // Başarı mesajı
            this.showMessage('Soru reddedildi.', 'info');
            
            // Listeyi yenile
            this.loadPendingQuestions();
            
        } catch (error) {
            console.error('Soru reddedilirken hata:', error);
            this.showMessage('Soru reddedilirken bir hata oluştu.', 'error');
        }
    }

    // Soruyu düzenle
    editQuestion(index) {
        const question = this.pendingQuestions[index];
        if (!question) return;

        // Soru düzenleme modalını aç
        this.openEditModal(question, index);
    }

    // Ana soru bankasına ekle
    async addToMainQuestionBank(question) {
        try {
            // Mevcut soru verilerini yükle
            const currentLang = (window.quizApp && window.quizApp.currentLanguage) || 'tr';
            let questionsFile = `languages/${currentLang}/questions.json`;

            // Soruyu doğru formata dönüştür
            const newQuestion = {
                question: question.question,
                correctAnswer: question.options ? question.options[question.correctAnswer] : question.correctAnswer,
                difficulty: this.mapDifficultyToString(question.difficulty),
                addedBy: question.addedBy || question.submittedBy,
                addedAt: new Date().toISOString()
            };

            // Soru tipine göre ek alanları ekle
            if (question.options && Array.isArray(question.options)) {
                newQuestion.options = question.options;
            }

            if (question.type) {
                newQuestion.type = question.type;
            }

            if (question.choices) {
                newQuestion.choices = question.choices;
            }

            // Simülasyon - LocalStorage'da approved questions listesine ekle
            const approvedQuestions = JSON.parse(localStorage.getItem('approvedQuestions') || '{}');
            
            if (!approvedQuestions[question.category]) {
                approvedQuestions[question.category] = [];
            }
            
            approvedQuestions[question.category].push(newQuestion);
            localStorage.setItem('approvedQuestions', JSON.stringify(approvedQuestions));

            console.log('Soru ana bankaya eklendi:', newQuestion);
            this.logQuestionApproval(question);

        } catch (error) {
            console.error('Ana soru bankasına eklenirken hata:', error);
            throw error;
        }
    }

    // Zorluk seviyesini string'e dönüştür
    mapDifficultyToString(difficulty) {
        if (typeof difficulty === 'string') return difficulty;
        
        const difficultyMap = {
            1: 'easy',
            2: 'medium', 
            3: 'hard'
        };
        
        return difficultyMap[difficulty] || 'easy';
    }

    // Bekleyen listesinden kaldır
    async removeFromPending(index, reason = null) {
        const question = this.pendingQuestions[index];
        
        if (reason) {
            this.logQuestionRejection(question, reason);
        }

        // LocalStorage'dan kaldır
        try {
            const localPending = JSON.parse(localStorage.getItem('pendingQuestions') || '[]');
            const updatedLocal = localPending.filter(q => q.id !== question.id);
            localStorage.setItem('pendingQuestions', JSON.stringify(updatedLocal));
        } catch (error) {
            console.error('LocalStorage güncellenirken hata:', error);
        }

        // Firebase'den kaldır (varsa)
        try {
            if (firebase.firestore && question.id) {
                await firebase.firestore().collection('pendingQuestions').doc(question.id).delete();
            }
        } catch (error) {
            console.log('Firebase silinirken hata:', error);
        }

        this.pendingQuestions.splice(index, 1);
        console.log('Soru bekleyen listesinden kaldırıldı');
    }

    // Soru onaylama logla
    logQuestionApproval(question) {
        const log = {
            action: 'question_approved',
            question: question.question.substring(0, 100),
            category: question.category,
            submittedBy: question.submittedBy,
            approvedBy: 'admin',
            timestamp: new Date().toISOString()
        };

        const adminLogs = JSON.parse(localStorage.getItem('adminLogs') || '[]');
        adminLogs.unshift(log);
        adminLogs.splice(100);
        localStorage.setItem('adminLogs', JSON.stringify(adminLogs));
    }

    // Soru reddetme logla
    logQuestionRejection(question, reason) {
        const log = {
            action: 'question_rejected',
            question: question.question.substring(0, 100),
            category: question.category,
            submittedBy: question.submittedBy,
            rejectedBy: 'admin',
            reason: reason,
            timestamp: new Date().toISOString()
        };

        const adminLogs = JSON.parse(localStorage.getItem('adminLogs') || '[]');
        adminLogs.unshift(log);
        adminLogs.splice(100);
        localStorage.setItem('adminLogs', JSON.stringify(adminLogs));
    }

    // Bekleyen soru sayısını güncelle
    updatePendingCount() {
        const countElement = document.getElementById('admin-pending-reports');
        if (countElement) {
            countElement.textContent = this.pendingQuestions.length;
        }
    }

    // Mesaj göster
    showMessage(message, type = 'info') {
        const existingMessage = document.querySelector('.admin-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `admin-message admin-message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="admin-message-close"><i class="fas fa-times"></i></button>
        `;

        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) {
            adminPanel.insertBefore(messageDiv, adminPanel.firstChild);
        }

        messageDiv.querySelector('.admin-message-close').addEventListener('click', () => {
            messageDiv.remove();
        });

        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Düzenleme modalını aç
    openEditModal(question, index) {
        // Modal HTML'ini oluştur
        const modalHTML = `
            <div id="edit-question-modal" class="admin-modal">
                <div class="admin-modal-content">
                    <div class="admin-modal-header">
                        <h3>Soruyu Düzenle</h3>
                        <button class="admin-modal-close"><i class="fas fa-times"></i></button>
                    </div>
                    
                    <div class="admin-modal-body">
                        <form id="edit-question-form">
                            <div class="form-group">
                                <label for="edit-question-text">Soru:</label>
                                <textarea id="edit-question-text" required>${question.question}</textarea>
                            </div>
                            
                            <div class="form-group">
                                <label for="edit-question-category">Kategori:</label>
                                <select id="edit-question-category" required>
                                    <option value="Genel Kültür" ${question.category === 'Genel Kültür' ? 'selected' : ''}>Genel Kültür</option>
                                    <option value="Bilim" ${question.category === 'Bilim' ? 'selected' : ''}>Bilim</option>
                                    <option value="Teknoloji" ${question.category === 'Teknoloji' ? 'selected' : ''}>Teknoloji</option>
                                    <option value="Spor" ${question.category === 'Spor' ? 'selected' : ''}>Spor</option>
                                    <option value="Tarih" ${question.category === 'Tarih' ? 'selected' : ''}>Tarih</option>
                                    <option value="Coğrafya" ${question.category === 'Coğrafya' ? 'selected' : ''}>Coğrafya</option>
                                    <option value="Müzik" ${question.category === 'Müzik' ? 'selected' : ''}>Müzik</option>
                                    <option value="Edebiyat" ${question.category === 'Edebiyat' ? 'selected' : ''}>Edebiyat</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="edit-question-difficulty">Zorluk:</label>
                                <select id="edit-question-difficulty" required>
                                    <option value="easy" ${question.difficulty === 'easy' ? 'selected' : ''}>Kolay</option>
                                    <option value="medium" ${question.difficulty === 'medium' ? 'selected' : ''}>Orta</option>
                                    <option value="hard" ${question.difficulty === 'hard' ? 'selected' : ''}>Zor</option>
                                </select>
                            </div>
                            
                            ${this.createEditFormForType(question)}
                            
                            <div class="form-actions">
                                <button type="submit" class="admin-btn">Güncelle ve Onayla</button>
                                <button type="button" class="admin-btn-secondary" id="save-changes-only">Sadece Güncelle</button>
                                <button type="button" class="admin-btn-danger" id="cancel-edit">İptal</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Modal'ı sayfaya ekle
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Event listener'ları ekle
        this.bindEditModalEvents(index);
    }

    // Soru tipine göre düzenleme formu oluştur
    createEditFormForType(question) {
        switch (question.type) {
            case 'TrueFalse':
                return `
                    <div class="form-group">
                        <label>Doğru Cevap:</label>
                        <div class="radio-group">
                            <label>
                                <input type="radio" name="edit-correct-answer" value="DOĞRU" ${question.correctAnswer === 'DOĞRU' ? 'checked' : ''}>
                                Doğru
                            </label>
                            <label>
                                <input type="radio" name="edit-correct-answer" value="YANLIŞ" ${question.correctAnswer === 'YANLIŞ' ? 'checked' : ''}>
                                Yanlış
                            </label>
                        </div>
                    </div>
                `;

            case 'BlankFilling':
                return `
                    <div class="form-group">
                        <label for="edit-correct-answer">Doğru Cevap:</label>
                        <input type="text" id="edit-correct-answer" value="${question.correctAnswer}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-choices">Mevcut Harfler (virgülle ayırın):</label>
                        <input type="text" id="edit-choices" value="${question.choices ? question.choices.join(', ') : ''}" placeholder="A, B, C, D, ...">
                    </div>
                `;

            default: // MultipleChoice
                return `
                    <div class="form-group">
                        <label>Seçenekler:</label>
                        <div id="edit-options-container">
                            ${question.options ? question.options.map((option, i) => `
                                <div class="option-input-group">
                                    <input type="text" class="edit-option" value="${option}" required>
                                    <label>
                                        <input type="radio" name="edit-correct-answer" value="${option}" ${option === question.correctAnswer ? 'checked' : ''}>
                                        Doğru
                                    </label>
                                </div>
                            `).join('') : ''}
                        </div>
                    </div>
                `;
        }
    }

    // Düzenleme modal olaylarını bağla
    bindEditModalEvents(index) {
        const modal = document.getElementById('edit-question-modal');
        const closeBtn = modal.querySelector('.admin-modal-close');
        const cancelBtn = modal.querySelector('#cancel-edit');
        const form = modal.querySelector('#edit-question-form');
        const saveOnlyBtn = modal.querySelector('#save-changes-only');

        // Modal'ı kapat
        const closeModal = () => modal.remove();

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // Modal dışına tıklayınca kapat
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Form gönderimi - güncelle ve onayla
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateAndApproveQuestion(index);
            closeModal();
        });

        // Sadece güncelle
        saveOnlyBtn.addEventListener('click', () => {
            this.updateQuestionOnly(index);
            closeModal();
        });
    }

    // Soruyu güncelle ve onayla
    async updateAndApproveQuestion(index) {
        const updatedQuestion = this.getUpdatedQuestionFromForm();
        if (updatedQuestion) {
            this.pendingQuestions[index] = { ...this.pendingQuestions[index], ...updatedQuestion };
            await this.approveQuestion(index);
        }
    }

    // Sadece soruyu güncelle
    updateQuestionOnly(index) {
        const updatedQuestion = this.getUpdatedQuestionFromForm();
        if (updatedQuestion) {
            this.pendingQuestions[index] = { ...this.pendingQuestions[index], ...updatedQuestion };
            this.showMessage('Soru güncellendi.', 'success');
            this.renderPendingQuestions();
        }
    }

    // Formdan güncellenmiş soru verilerini al
    getUpdatedQuestionFromForm() {
        const modal = document.getElementById('edit-question-modal');
        if (!modal) return null;

        const question = modal.querySelector('#edit-question-text').value.trim();
        const category = modal.querySelector('#edit-question-category').value;
        const difficulty = modal.querySelector('#edit-question-difficulty').value;

        if (!question) {
            alert('Soru metni boş olamaz!');
            return null;
        }

        const updatedQuestion = {
            question,
            category,
            difficulty
        };

        // Doğru cevapı al
        const correctAnswerRadio = modal.querySelector('input[name="edit-correct-answer"]:checked');
        const correctAnswerInput = modal.querySelector('#edit-correct-answer');

        if (correctAnswerRadio) {
            updatedQuestion.correctAnswer = correctAnswerRadio.value;
        } else if (correctAnswerInput) {
            updatedQuestion.correctAnswer = correctAnswerInput.value.trim();
        }

        // Seçenekleri al (çoktan seçmeli için)
        const optionInputs = modal.querySelectorAll('.edit-option');
        if (optionInputs.length > 0) {
            updatedQuestion.options = Array.from(optionInputs).map(input => input.value.trim()).filter(option => option);
        }

        // Harfleri al (boşluk doldurma için)
        const choicesInput = modal.querySelector('#edit-choices');
        if (choicesInput) {
            const choices = choicesInput.value.split(',').map(choice => choice.trim()).filter(choice => choice);
            if (choices.length > 0) {
                updatedQuestion.choices = choices;
            }
        }

        return updatedQuestion;
    }

    // Yeni bekleyen soru ekle
    addPendingQuestion(questionData) {
        const pendingQuestion = {
            ...questionData,
            id: Date.now() + Math.random(),
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };

        this.pendingQuestions.unshift(pendingQuestion);
        this.updatePendingCount();
        
        const pendingTab = document.getElementById('admin-pending-questions');
        if (pendingTab && !pendingTab.classList.contains('admin-tab-content') || 
            pendingTab.style.display !== 'none') {
            this.renderPendingQuestions();
        }

        console.log('Yeni soru onay için eklendi:', pendingQuestion);
        return pendingQuestion.id;
    }
}

// Global instance
let pendingQuestionsManager;

// DOM yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('admin-panel')) {
        pendingQuestionsManager = new PendingQuestionsManager();
    }
});

window.pendingQuestionsManager = pendingQuestionsManager; 