/**
 * QuizEngine.js - Quiz mantığı ve soru yönetimi
 * Faz 2: Core Modül Çıkarımı
 */

export class QuizEngine {
    constructor(config = {}) {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = 0;
        this.timerInterval = null;
        this.answerProcessing = false;
        this.jokersUsed = {
            fifty: false,
            hint: false,
            time: false,
            skip: false
        };
        
        // Zamanlama ayarları
        this.TIME_PER_QUESTION = config.timePerQuestion || 30;
        this.TIME_PER_BLANK_FILLING_QUESTION = config.timePerBlankFilling || 45;
        
        // Event callbacks
        this.onQuestionDisplay = config.onQuestionDisplay || (() => {});
        this.onAnswerCheck = config.onAnswerCheck || (() => {});
        this.onTimerUpdate = config.onTimerUpdate || (() => {});
        this.onQuizComplete = config.onQuizComplete || (() => {});
    }
    
    /**
     * Quiz'i başlat
     * @param {Array} questions - Soru listesi
     */
    startQuiz(questions) {
        if (!questions || questions.length === 0) {
            throw new Error('Soru listesi boş olamaz!');
        }
        
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.resetJokers();
        
        console.log('🚀 QuizEngine başlatıldı:', {
            totalQuestions: this.questions.length,
            timePerQuestion: this.TIME_PER_QUESTION
        });
        
        this.displayCurrentQuestion();
    }
    
    /**
     * Mevcut soruyu göster
     */
    displayCurrentQuestion() {
        const question = this.getCurrentQuestion();
        if (!question) {
            console.error('Soru verisi bulunamadı!');
            return;
        }
        
        // Cevap işlemi flag'ini sıfırla
        this.answerProcessing = false;
        
        // Callback çağır
        this.onQuestionDisplay(question, this.currentQuestionIndex);
        
        // Timer'ı başlat
        this.startTimer(question);
    }
    
    /**
     * Mevcut soruyu al
     */
    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }
    
    /**
     * Zamanlayıcıyı başlat
     */
    startTimer(question) {
        // Var olan timer'ı temizle
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Soru tipine göre süre belirle
        const isBlankFilling = question.type === "BlankFilling";
        this.timeLeft = isBlankFilling ? 
            this.TIME_PER_BLANK_FILLING_QUESTION : 
            this.TIME_PER_QUESTION;
        
        this.updateTimeDisplay();
        
        this.timerInterval = setInterval(() => {
            if (this.answerProcessing) {
                clearInterval(this.timerInterval);
                return;
            }
            
            this.timeLeft--;
            this.updateTimeDisplay();
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.handleTimeUp();
            }
        }, 1000);
    }
    
    /**
     * Zaman gösterimini güncelle
     */
    updateTimeDisplay() {
        this.onTimerUpdate(this.timeLeft);
    }
    
    /**
     * Süre dolduğunda
     */
    handleTimeUp() {
        console.log('⏰ Süre doldu!');
        this.checkAnswer(null); // Boş cevap gönder
    }
    
    /**
     * Cevabı kontrol et
     * @param {string} userAnswer - Kullanıcının cevabı
     */
    checkAnswer(userAnswer) {
        if (this.answerProcessing) {
            console.log('⚠️ Cevap zaten işleniyor');
            return;
        }
        
        this.answerProcessing = true;
        clearInterval(this.timerInterval);
        
        const question = this.getCurrentQuestion();
        const isCorrect = this.isAnswerCorrect(userAnswer, question);
        
        // Callback çağır
        this.onAnswerCheck({
            isCorrect,
            userAnswer,
            correctAnswer: question.correctAnswer,
            question,
            questionIndex: this.currentQuestionIndex
        });
        
        return isCorrect;
    }
    
    /**
     * Cevabın doğruluğunu kontrol et
     */
    isAnswerCorrect(userAnswer, question) {
        if (!userAnswer) return false;
        
        const correctAnswer = question.correctAnswer;
        
        // Normalize (büyük/küçük harf, boşluk)
        const normalizeAnswer = (str) => {
            if (!str) return '';
            return str.toString().trim().toLowerCase();
        };
        
        return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
    }
    
    /**
     * Sonraki soruya geç
     */
    showNextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.questions.length) {
            this.completeQuiz();
            return;
        }
        
        this.resetJokers();
        this.displayCurrentQuestion();
    }
    
    /**
     * Quiz'i tamamla
     */
    completeQuiz() {
        clearInterval(this.timerInterval);
        
        const stats = this.getQuizStats();
        this.onQuizComplete(stats);
        
        console.log('✅ Quiz tamamlandı:', stats);
    }
    
    /**
     * Quiz istatistiklerini al
     */
    getQuizStats() {
        return {
            totalQuestions: this.questions.length,
            answeredQuestions: this.currentQuestionIndex,
            score: this.score,
            accuracy: this.currentQuestionIndex > 0 ? 
                (this.score / this.currentQuestionIndex * 100).toFixed(1) : 0
        };
    }
    
    /**
     * Joker kullan
     * @param {string} jokerType - Joker tipi (fifty, hint, time, skip)
     */
    useJoker(jokerType) {
        if (this.jokersUsed[jokerType]) {
            console.warn(`${jokerType} jokeri zaten kullanılmış!`);
            return false;
        }
        
        this.jokersUsed[jokerType] = true;
        
        switch (jokerType) {
            case 'fifty':
                return this.applyFiftyFiftyJoker();
            case 'hint':
                return this.applyHintJoker();
            case 'time':
                return this.applyTimeJoker();
            case 'skip':
                return this.applySkipJoker();
            default:
                console.error('Bilinmeyen joker tipi:', jokerType);
                return false;
        }
    }
    
    /**
     * 50:50 jokerini uygula
     */
    applyFiftyFiftyJoker() {
        const question = this.getCurrentQuestion();
        // İki yanlış şıkkı elemek için mantık
        // Bu kısım UI'da uygulanacak
        return true;
    }
    
    /**
     * İpucu jokerini uygula
     */
    applyHintJoker() {
        const question = this.getCurrentQuestion();
        // İpucu gösterme mantığı
        return true;
    }
    
    /**
     * Süre jokerini uygula
     */
    applyTimeJoker() {
        this.timeLeft += 15; // 15 saniye ekle
        this.updateTimeDisplay();
        return true;
    }
    
    /**
     * Pas jokerini uygula
     */
    applySkipJoker() {
        this.showNextQuestion();
        return true;
    }
    
    /**
     * Jokerleri sıfırla (yeni soru için)
     */
    resetJokers() {
        this.jokersUsed = {
            fifty: false,
            hint: false,
            time: false,
            skip: false
        };
    }
    
    /**
     * Engine'i temizle
     */
    cleanup() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.answerProcessing = false;
    }
}
