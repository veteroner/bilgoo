const languages = {
    tr: {
        // Genel
        appName: 'Bilgoo',
        loading: 'Yükleniyor...',
        restart: 'Yeniden Başlat',
        next: 'Sonraki Soru',
        score: 'Puan',
        correct: 'Doğru!',
        wrong: 'Yanlış!',
        timeUp: 'Süre doldu!',
        correctAnswer: 'Doğru cevap',
        
        // Login/Register
        registerButton: 'Kayıt Ol',
        guestLogin: 'Misafir olarak devam et',
        
        // Çevrim içi mod
        online_mode: 'Çevrimiçi Mod',
        create_room: 'Oda Oluştur',
        join_room: 'Odaya Katıl',
        back_to_menu: 'Ana Menüye Dön',
        back: 'Geri',
        create: 'Oluştur',
        join: 'Katıl',
        waiting_players: 'Oyuncular Bekleniyor',
        room_code: 'Oda Kodu',
        start_game: 'Oyunu Başlat',
        leave_room: 'Odadan Ayrıl',
        players: 'Oyuncular',
        chat: 'Sohbet',
        game_chat: 'Oyun Sohbeti',
        send_message: 'Mesaj Gönder',
        chat_rules: 'Sohbet Kuralları',
        accept_rules: 'Kuralları Kabul Et',
        chat_consent: 'Sohbet onayı',
        current_rooms: 'Mevcut Odalar',
        rooms_loading: 'Odalar yükleniyor...',
        refresh_rooms: 'Odaları Yenile',
        no_rooms: 'Şu anda açık oda bulunmuyor. Yeni bir oda oluşturabilirsiniz.',
        global_leaderboard: 'Küresel Lider Tablosu',
        all_categories: 'Tüm Kategoriler',
        
        // Lider tablosu
        leaderboard_title: 'Küresel Lider Tablosu',
        leaderboard_all: 'Tüm Kategoriler',
        leaderboard_daily: 'Günlük',
        leaderboard_weekly: 'Haftalık',
        leaderboard_monthly: 'Aylık',
        leaderboard_alltime: 'Tüm Zamanlar',
        leaderboard_rank: 'Sıra',
        leaderboard_user: 'Oyuncu',
        leaderboard_category: 'Kategori',
        leaderboard_score: 'Puan',
        leaderboard_date: 'Tarih',
        leaderboard_refresh: 'Yenile',
        
        // Çok oyunculu mod mesajları
        room_created: 'Oda "{roomName}" başarıyla oluşturuldu. ({playerCount} kişilik)',
        room_code_share: 'Oda kodunu paylaşarak arkadaşlarınızı davet edebilirsiniz: {roomCode}',
        player_joined: '{username} odaya katıldı.',
        host_left: 'Oda sahibi {username} odadan ayrıldı. Oda kapatılıyor...',
        player_left: '{username} odadan ayrıldı.',
        host_starting: 'Oda sahibi {username} oyunu başlatıyor...',
        game_starts_in: 'Oyun {countdown} saniye içinde başlayacak...',
        game_started: 'Oyun başladı! Seçilen kategori: {category}',
        
        // Kategoriler
        categories: 'Kategoriler',
        categoryGeneral: 'Genel Kültür',
        categoryScience: 'Bilim',
        categoryTechnology: 'Teknoloji',
        categorySports: 'Spor',
        categoryMusic: 'Müzik',
        categoryHistory: 'Tarih',
        categoryGeography: 'Coğrafya',
        categoryArt: 'Sanat',
        categoryLiterature: 'Edebiyat',
        categoryMovies: 'Sinema',
        categoryFood: 'Yemek',
        categoryComputer: 'Bilgisayar',
        categoryMath: 'Matematik',
        categoryBlankFilling: 'Boşluk Doldurma',
        categoryOther: 'Diğer',
        
        // Jokerler
        jokerFifty: '50:50',
        jokerHint: 'İpucu',
        jokerTime: '+Süre',
        jokerSkip: 'Pas',
        jokerStore: 'Joker Mağazası',
        jokerUsed: 'Kullanıldı',
        
        // Joker mağazası
        storeTitle: 'Joker Mağazası',
        storePoints: 'Puanlar',
        storeOwned: 'Sahip oldunan',
        storeBuy: 'Satın Al',
        
        // Toast mesajları
        toast50Used: '50:50 jokeri kullanıldı! İki yanlış şık elendi.',
        toastHintUsed: 'İpucu jokeri kullanıldı! Bir ipucu gösterildi.',
        toastTimeUsed: 'Süre jokeri kullanıldı! 15 saniye eklendi.',
        toastSkipUsed: 'Pas jokeri kullanıldı! Sonraki soruya geçiliyor.',
        toastJokerBought: 'jokeri satın alındı!',
        
        // Seviye ve bölüm
        level: 'Seviye',
        section: 'Bölüm',
        sectionCompleted: 'Bölüm Tamamlandı!',
        levelCompleted: 'Seviye Tamamlandı!',
        currentScore: 'Mevcut Skor',
        remainingLives: 'Kalan Can',
        correctAnswers: 'Doğru Cevaplar',
        avgTime: 'Ortalama Süre',
        nextSection: 'Sonraki Bölüme Geç',
        nextLevel: 'Sonraki Seviyeye Geç',
        goldStar: 'Altın Yıldız',
        silverStar: 'Gümüş Yıldız',
        bronzeStar: 'Bronz Yıldız',
        earnedStars: 'Yıldız Kazandınız!',
        
        // Sonuç ekranı
        gameResult: 'Sonuç',
        categoryResult: 'kategorisinde',
        outOfLives: 'canlarınız bitti',
        answeredQuestions: 'Cevapladığınız',
        ofQuestions: 'sorudan',
        correctlyAnswered: 'tanesini doğru cevapladınız',
        withLives: 'can ile oyunu bitirdiniz',
        totalQuestion: 'Toplam Soru',
        totalCorrect: 'Doğru Cevap',
        totalScore: 'Toplam Puan',
        backToCategories: 'Kategori Seçimine Dön',
        shareScore: 'Skoru Paylaş',
        
        // Oyun tamamlama
        gameCompletion: 'Tebrikler! Oyunu Tamamladınız!',
        completedAllSections: '50 bölümü başarıyla tamamladınız!',
        totalPoints: 'Toplam Puan',
        congratsMessage: 'Bu muhteşem başarınız için kutlarız!',
        playAgain: 'Yeniden Oyna',
        shareResult: 'Sonucu Paylaş',
        
        // Doğru Yanlış soruları
        true: 'DOĞRU',
        false: 'YANLIŞ',
        
        // Boşluk doldurma
        delete: 'Sil',
        clear: 'Temizle',
        check: 'Kontrol Et',
        hint: 'İpucu',
        firstLetter: 'İpucu: Doğru cevabın ilk harfi',
        lastLetter: 've son harfi',
        
        // Uyarılar
        browserWarning: 'Tarayıcınız bu uygulamanın bazı özelliklerini desteklemiyor. Daha iyi bir deneyim için Chrome, Firefox veya Edge tarayıcılarının güncel sürümlerini kullanın.',
        understood: 'Anladım',
        questionLoadError: 'Soru verileri yüklenirken hata oluştu: Lütfen sayfayı yenileyin.',
        imageLoadError: 'Görsel yüklenemedi, başka bir soruya geçiliyor...',
        emptyAnswer: 'Lütfen bir cevap girin!',
        
        // Diğer
        seconds: 'saniye',
        second: 'saniye',
        language: 'Dil',
        
        // Ana menü
        quiz: 'Bilgoo',
        singlePlayer: 'Tekli Oyun',
        multiPlayer: 'Çok Oyunculu',
        leaderboard: 'Küresel Skor Tablosu',
        statistics: 'İstatistikler',
        settings: 'Ayarlar',
        addQuestion: 'Soru Ekle',
        logout: 'Çıkış',
        
        // Ayarlar menüsü
        difficulty: 'Zorluk',
        sound: 'Ses',
        theme: 'Tema',
        darkTheme: 'Karanlık Tema',
        easy: 'Kolay',
        medium: 'Orta',
        hard: 'Zor',
        
        // Dil değişikliği
        languageChanged: 'Dil değiştirildi!',
        
        // Yan menü
        home: 'Ana Sayfa',
        friends: 'Arkadaşlarım',
        leaderboardMenu: 'Lider Tablosu',
        app: 'Uygulama',
        profile: 'Profilim',
        
        // Soru tipleri
        questionImage: 'Soru görseli',
        trueOption: 'DOĞRU',
        falseOption: 'YANLIŞ',
        
        // Sonuç mesajları
        pointsEarned: 'kazanılan puan',
        nextQuestion: 'Sonraki Soru',
        finishQuiz: 'Testi Bitir',
        timeIsUp: 'Süre doldu!',
        remainingTime: 'Kalan süre',
        
        // Boşluk doldurma
        enterAnswer: 'Cevabınızı girin',
        
        // Oyun sonu ekranı
        quizAppName: 'Bilgoo',
        resultTitle: 'Sonuç',
        
        // Soru ekleme modalı
        addQuestionModal: 'Yeni Soru Ekle',
        questionCategory: 'Kategori',
        selectCategory: 'Kategori Seçin',
        questionText: 'Soru',
        questionPlaceholder: 'Sorunuzu buraya yazın...',
        questionOptions: 'Seçenekler',
        optionA: 'A seçeneği',
        optionB: 'B seçeneği', 
        optionC: 'C seçeneği',
        optionD: 'D seçeneği',
        correctAnswerLabel: 'Doğru Cevap',
        selectCorrectAnswer: 'Doğru cevap',
        optionAChoice: 'A Seçeneği',
        optionBChoice: 'B Seçeneği',
        optionCChoice: 'C Seçeneği',
        optionDChoice: 'D Seçeneği',
        difficultyLabel: 'Zorluk',
        selectDifficulty: 'Zorluk seçin',
        cancel: 'İptal',
        addQuestionButton: 'Soru Ekle'
    },
    
    en: {
        // General
        appName: 'Knowledge Quiz',
        loading: 'Loading...',
        restart: 'Restart',
        next: 'Next Question',
        score: 'Score',
        correct: 'Correct!',
        wrong: 'Wrong!',
        timeUp: 'Time\'s up!',
        correctAnswer: 'Correct answer',
        
        // Login/Register
        registerButton: 'Register',
        guestLogin: 'Continue as guest',
        
        // Online mode
        online_mode: 'Online Mode',
        create_room: 'Create Room',
        join_room: 'Join Room',
        back_to_menu: 'Back to Menu',
        back: 'Back',
        create: 'Create',
        join: 'Join',
        waiting_players: 'Waiting for Players',
        room_code: 'Room Code',
        start_game: 'Start Game',
        leave_room: 'Leave Room',
        players: 'Players',
        chat: 'Chat',
        game_chat: 'Game Chat',
        send_message: 'Send Message',
        chat_rules: 'Chat Rules',
        accept_rules: 'Accept Rules',
        chat_consent: 'Chat Consent',
        current_rooms: 'Current Rooms',
        rooms_loading: 'Loading rooms...',
        refresh_rooms: 'Refresh Rooms',
        no_rooms: 'No open rooms currently. You can create a new room.',
        global_leaderboard: 'Global Leaderboard',
        all_categories: 'All Categories',
        
        // Leaderboard
        leaderboard_title: 'Global Leaderboard',
        leaderboard_all: 'All Categories',
        leaderboard_daily: 'Daily',
        leaderboard_weekly: 'Weekly',
        leaderboard_monthly: 'Monthly',
        leaderboard_alltime: 'All Time',
        leaderboard_rank: 'Rank',
        leaderboard_user: 'Player',
        leaderboard_category: 'Category',
        leaderboard_score: 'Score',
        leaderboard_date: 'Date',
        leaderboard_refresh: 'Refresh',
        
        // Multiplayer mode messages
        room_created: 'Room "{roomName}" successfully created. (For {playerCount} players)',
        room_code_share: 'You can invite your friends by sharing the room code: {roomCode}',
        player_joined: '{username} joined the room.',
        host_left: 'Host {username} left the room. Room is closing...',
        player_left: '{username} left the room.',
        host_starting: 'Host {username} is starting the game...',
        game_starts_in: 'Game starts in {countdown} seconds...',
        game_started: 'Game started! Selected category: {category}',
        
        // Categories
        categories: 'Categories',
        categoryGeneral: 'General Knowledge',
        categoryScience: 'Science',
        categoryTechnology: 'Technology',
        categorySports: 'Sports',
        categoryMusic: 'Music',
        categoryHistory: 'History',
        categoryGeography: 'Geography',
        categoryArt: 'Art',
        categoryLiterature: 'Literature',
        categoryMovies: 'Movies',
        categoryFood: 'Food',
        categoryComputer: 'Computer',
        categoryMath: 'Mathematics',
        categoryBlankFilling: 'Fill in the Blank',
        categoryOther: 'Other',
        
        // Jokerler
        jokerFifty: '50:50',
        jokerHint: 'Hint',
        jokerTime: '+Time',
        jokerSkip: 'Skip',
        jokerStore: 'Joker Store',
        jokerUsed: 'Used',
        
        // Joker store
        storeTitle: 'Joker Store',
        storePoints: 'Points',
        storeOwned: 'Owned',
        storeBuy: 'Buy',
        
        // Toast messages
        toast50Used: '50:50 joker used! Two wrong options eliminated.',
        toastHintUsed: 'Hint joker used! A hint was shown.',
        toastTimeUsed: 'Time joker used! 15 seconds added.',
        toastSkipUsed: 'Skip joker used! Moving to the next question.',
        toastJokerBought: 'joker purchased!',
        
        // Level and section
        level: 'Level',
        section: 'Section',
        sectionCompleted: 'Section Completed!',
        levelCompleted: 'Level Completed!',
        currentScore: 'Current Score',
        remainingLives: 'Remaining Lives',
        correctAnswers: 'Correct Answers',
        avgTime: 'Average Time',
        nextSection: 'Go to Next Section',
        nextLevel: 'Go to Next Level',
        goldStar: 'Gold Star',
        silverStar: 'Silver Star',
        bronzeStar: 'Bronze Star',
        earnedStars: 'Stars Earned!',
        
        // Result screen
        gameResult: 'Result',
        categoryResult: 'in the category',
        outOfLives: 'you ran out of lives',
        answeredQuestions: 'You answered',
        ofQuestions: 'out of',
        correctlyAnswered: 'questions correctly',
        withLives: 'lives remaining',
        totalQuestion: 'Total Questions',
        totalCorrect: 'Correct Answers',
        totalScore: 'Total Score',
        backToCategories: 'Back to Categories',
        shareScore: 'Share Score',
        
        // Game completion
        gameCompletion: 'Congratulations! You Completed the Game!',
        completedAllSections: 'You successfully completed all 50 sections!',
        totalPoints: 'Total Points',
        congratsMessage: 'We congratulate you for this amazing achievement!',
        playAgain: 'Play Again',
        shareResult: 'Share Result',
        
        // True False questions
        true: 'TRUE',
        false: 'FALSE',
        
        // Fill in the blank
        delete: 'Delete',
        clear: 'Clear',
        check: 'Check',
        hint: 'Hint',
        firstLetter: 'Hint: The first letter of the correct answer is',
        lastLetter: 'and the last letter is',
        
        // Warnings
        browserWarning: 'Your browser does not support some features of this application. For a better experience, please use the latest versions of Chrome, Firefox, or Edge.',
        understood: 'Understood',
        questionLoadError: 'Error loading question data: Please refresh the page.',
        imageLoadError: 'Image could not be loaded, moving to another question...',
        emptyAnswer: 'Please enter an answer!',
        
        // Other
        seconds: 'seconds',
        second: 'second',
        language: 'Language',
        
        // Main menu
        quiz: 'Quiz Game',
        singlePlayer: 'Single Player',
        multiPlayer: 'Multiplayer',
        leaderboard: 'Global Leaderboard',
        statistics: 'Statistics',
        settings: 'Settings',
        addQuestion: 'Add Question',
        logout: 'Logout',
        
        // Settings menu
        difficulty: 'Difficulty',
        sound: 'Sound',
        theme: 'Theme',
        darkTheme: 'Dark Theme',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        
        // Language change
        languageChanged: 'Language changed!',
        
        // Yan menü
        home: 'Home',
        friends: 'Friends',
        leaderboardMenu: 'Leaderboard',
        app: 'Application',
        profile: 'My Profile',
        
        // Core UI messages
        categoryLoadError: 'Could not find questions in the selected category. Please choose another category.',
        categorySelectionError: 'An error occurred while selecting the category. Please try again.',
        questionLoadError: 'Error loading questions. Please try again.',
        browserWarning: 'Your browser might have limited functionality. Some features may not work properly.',
        understood: 'Understood',
        questionImage: 'Question image',
        
        // Button texts
        next: 'Next',
        restart: 'Restart',
        submit: 'Submit',
        check: 'Check',
        clear: 'Clear',
        delete: 'Delete',
        
        // Results
        gameOver: 'Game Over',
        totalQuestions: 'Total Questions',
        correctAnswers: 'Correct Answers',
        averageTime: 'Average Time',
        totalScore: 'Total Score',
        playAgain: 'Play Again',
        mainMenu: 'Main Menu',
        shareScore: 'Share Score',
        
        // Game completion
        sectionCompleted: 'Section Completed!',
        levelCompleted: 'Level Completed!',
        gameCompleted: 'Congratulations! You have completed the game!',
        earnedStars: 'Stars Earned!',
        nextSection: 'Next Section',
        
        // Alerts and notifications
        imageLoadError: 'Image could not be loaded, moving to next question...',
        
        // Question types
        questionImage: 'Question image',
        trueOption: 'TRUE',
        falseOption: 'FALSE',
        
        // Result messages
        pointsEarned: 'points earned',
        nextQuestion: 'Next Question',
        finishQuiz: 'Finish Quiz',
        timeIsUp: 'Time is up!',
        remainingTime: 'Remaining time',
        
        // Fill in the blank
        enterAnswer: 'Enter your answer',
        emptyAnswer: 'Please enter an answer!',
        
        // Game end screen
        quizAppName: 'Quiz Game',
        resultTitle: 'Result',
        
        // Add question modal
        addQuestionModal: 'Add New Question',
        questionCategory: 'Category',
        selectCategory: 'Select Category',
        questionText: 'Question',
        questionPlaceholder: 'Enter your question here...',
        questionOptions: 'Options',
        optionA: 'Option A',
        optionB: 'Option B',
        optionC: 'Option C',
        optionD: 'Option D',
        correctAnswerLabel: 'Correct Answer',
        selectCorrectAnswer: 'Select correct answer',
        optionAChoice: 'Option A',
        optionBChoice: 'Option B',
        optionCChoice: 'Option C',
        optionDChoice: 'Option D',
        difficultyLabel: 'Difficulty',
        selectDifficulty: 'Select difficulty',
        cancel: 'Cancel',
        addQuestionButton: 'Add Question'
    },
    
    de: {
        // Allgemein
        appName: 'Wissensquiz',
        loading: 'Wird geladen...',
        restart: 'Neustart',
        next: 'Nächste Frage',
        score: 'Punkte',
        correct: 'Richtig!',
        wrong: 'Falsch!',
        timeUp: 'Zeit abgelaufen!',
        correctAnswer: 'Richtige Antwort',
        
        // Login/Register
        registerButton: 'Registrieren',
        guestLogin: 'Als Gast fortfahren',
        
        // Online-Modus
        online_mode: 'Online-Modus',
        create_room: 'Raum erstellen',
        join_room: 'Raum beitreten',
        back_to_menu: 'Zurück zum Menü',
        back: 'Zurück',
        create: 'Erstellen',
        join: 'Beitreten',
        waiting_players: 'Warten auf Spieler',
        room_code: 'Raumcode',
        start_game: 'Spiel starten',
        leave_room: 'Raum verlassen',
        players: 'Spieler',
        chat: 'Chat',
        game_chat: 'Spiel-Chat',
        send_message: 'Nachricht senden',
        chat_rules: 'Chat-Regeln',
        accept_rules: 'Regeln akzeptieren',
        chat_consent: 'Chat-Zustimmung',
        current_rooms: 'Aktuelle Räume',
        rooms_loading: 'Räume werden geladen...',
        refresh_rooms: 'Räume aktualisieren',
        no_rooms: 'Derzeit keine offenen Räume. Sie können einen neuen Raum erstellen.',
        global_leaderboard: 'Globale Bestenliste',
        all_categories: 'Alle Kategorien',
        
        // Bestenliste
        leaderboard_title: 'Globale Bestenliste',
        leaderboard_all: 'Alle Kategorien',
        leaderboard_daily: 'Täglich',
        leaderboard_weekly: 'Wöchentlich',
        leaderboard_monthly: 'Monatlich',
        leaderboard_alltime: 'Alle Zeiten',
        leaderboard_rank: 'Rang',
        leaderboard_user: 'Spieler',
        leaderboard_category: 'Kategorie',
        leaderboard_score: 'Punkte',
        leaderboard_date: 'Datum',
        leaderboard_refresh: 'Aktualisieren',
        
        // Kategorien
        categories: 'Kategorien',
        categoryGeneral: 'Allgemeinwissen',
        categoryScience: 'Wissenschaft',
        categoryTechnology: 'Technologie',
        categorySports: 'Sport',
        categoryMusic: 'Musik',
        categoryHistory: 'Geschichte',
        categoryGeography: 'Geographie',
        categoryArt: 'Kunst',
        categoryLiterature: 'Literatur',
        categoryMovies: 'Filme',
        categoryFood: 'Essen',
        categoryComputer: 'Computer',
        categoryMath: 'Mathematik',
        categoryBlankFilling: 'Lückentext',
        categoryOther: 'Sonstiges',
        
        // Jokers
        jokerFifty: '50:50',
        jokerHint: 'Hinweis',
        jokerTime: '+Zeit',
        jokerSkip: 'Überspringen',
        jokerStore: 'Joker-Shop',
        jokerUsed: 'Benutzt',
        
        // Joker shop
        storeTitle: 'Joker-Shop',
        storePoints: 'Punkte',
        storeOwned: 'Im Besitz',
        storeBuy: 'Kaufen',
        
        // Toast-Nachrichten
        toast50Used: '50:50-Joker verwendet! Zwei falsche Optionen wurden entfernt.',
        toastHintUsed: 'Hinweis-Joker verwendet! Ein Hinweis wurde angezeigt.',
        toastTimeUsed: 'Zeit-Joker verwendet! 15 Sekunden hinzugefügt.',
        toastSkipUsed: 'Überspringen-Joker verwendet! Zur nächsten Frage.',
        toastJokerBought: 'Joker gekauft!',
        
        // Level und Abschnitt
        level: 'Level',
        section: 'Abschnitt',
        sectionCompleted: 'Abschnitt abgeschlossen!',
        levelCompleted: 'Level abgeschlossen!',
        currentScore: 'Aktuelle Punktzahl',
        remainingLives: 'Verbleibende Leben',
        correctAnswers: 'Richtige Antworten',
        avgTime: 'Durchschnittliche Zeit',
        nextSection: 'Zum nächsten Abschnitt',
        nextLevel: 'Zum nächsten Level',
        goldStar: 'Goldstern',
        silverStar: 'Silberstern',
        bronzeStar: 'Bronzestern',
        earnedStars: 'Sterne verdient!',
        
        // Ergebnisbildschirm
        gameResult: 'Ergebnis',
        categoryResult: 'in der Kategorie',
        outOfLives: 'keine Leben mehr',
        answeredQuestions: 'Sie haben',
        ofQuestions: 'von',
        correctlyAnswered: 'Fragen richtig beantwortet',
        withLives: 'verbleibenden Leben',
        totalQuestion: 'Gesamtzahl der Fragen',
        totalCorrect: 'Richtige Antworten',
        totalScore: 'Gesamtpunktzahl',
        backToCategories: 'Zurück zu den Kategorien',
        shareScore: 'Ergebnis teilen',
        
        // Spielabschluss
        gameCompletion: 'Herzlichen Glückwunsch! Sie haben das Spiel abgeschlossen!',
        completedAllSections: 'Sie haben alle 50 Abschnitte erfolgreich abgeschlossen!',
        totalPoints: 'Gesamtpunktzahl',
        congratsMessage: 'Wir gratulieren Ihnen zu dieser herausragenden Leistung!',
        playAgain: 'Erneut spielen',
        shareResult: 'Ergebnis teilen',
        
        // Wahr/Falsch Fragen
        true: 'WAHR',
        false: 'FALSCH',
        
        // Lückentext
        delete: 'Löschen',
        clear: 'Zurücksetzen',
        check: 'Prüfen',
        hint: 'Hinweis',
        firstLetter: 'Hinweis: Der erste Buchstabe der richtigen Antwort ist',
        lastLetter: 'und der letzte Buchstabe ist',
        
        // Warnungen
        browserWarning: 'Ihr Browser unterstützt einige Funktionen dieser Anwendung nicht. Für ein besseres Erlebnis verwenden Sie bitte die neuesten Versionen von Chrome, Firefox oder Edge.',
        understood: 'Verstanden',
        questionLoadError: 'Fehler beim Laden der Fragedaten: Bitte aktualisieren Sie die Seite.',
        imageLoadError: 'Bild konnte nicht geladen werden, wechsle zu einer anderen Frage...',
        emptyAnswer: 'Bitte geben Sie eine Antwort ein!',
        
        // Sonstiges
        seconds: 'Sekunden',
        second: 'Sekunde',
        language: 'Sprache',
        
        // Hauptmenü
        quiz: 'Quiz-Spiel',
        singlePlayer: 'Einzelspieler',
        multiPlayer: 'Mehrspieler',
        leaderboard: 'Globale Rangliste',
        statistics: 'Statistiken',
        settings: 'Einstellungen',
        addQuestion: 'Frage hinzufügen',
        logout: 'Abmelden',
        
        // Einstellungsmenü
        difficulty: 'Schwierigkeit',
        sound: 'Ton',
        theme: 'Thema',
        darkTheme: 'Dunkles Thema',
        easy: 'Leicht',
        medium: 'Mittel',
        hard: 'Schwer',
        
        // Sprachänderung
        languageChanged: 'Sprache geändert!',
        
        // Yan menü
        home: 'Startseite',
        friends: 'Freunde',
        leaderboardMenu: 'Bestenliste',
        app: 'Anwendung',
        profile: 'Mein Profil',
        
        // Soru tipleri
        questionImage: 'Fragebild',
        trueOption: 'WAHR',
        falseOption: 'FALSCH',
        
        // Sonuç mesajları
        pointsEarned: 'Punkte verdient',
        nextQuestion: 'Nächste Frage',
        finishQuiz: 'Quiz beenden',
        timeIsUp: 'Zeit ist abgelaufen!',
        remainingTime: 'Verbleibende Zeit',
        
        // Boşluk doldurma
        enterAnswer: 'Geben Sie Ihre Antwort ein',
        emptyAnswer: 'Bitte geben Sie eine Antwort ein!',
        
        // Spielendbildschirm
        quizAppName: 'Quiz-Spiel',
        resultTitle: 'Ergebnis',
        
        // Frage hinzufügen Modal
        addQuestionModal: 'Neue Frage hinzufügen',
        questionCategory: 'Kategorie',
        selectCategory: 'Kategorie auswählen',
        questionText: 'Frage',
        questionPlaceholder: 'Geben Sie Ihre Frage hier ein...',
        questionOptions: 'Optionen',
        optionA: 'Option A',
        optionB: 'Option B',
        optionC: 'Option C',
        optionD: 'Option D',
        correctAnswerLabel: 'Richtige Antwort',
        selectCorrectAnswer: 'Richtige Antwort auswählen',
        optionAChoice: 'Option A',
        optionBChoice: 'Option B',
        optionCChoice: 'Option C',
        optionDChoice: 'Option D',
        difficultyLabel: 'Schwierigkeit',
        selectDifficulty: 'Schwierigkeit auswählen',
        cancel: 'Abbrechen',
        addQuestionButton: 'Frage hinzufügen'
    }
};

// Global olarak languages objesini ata
window.languages = languages;

// Dil destekli kategori eşleştirmeleri
const categoryMappings = {
    // Türkçe kategorilerin diğer dillerdeki karşılıkları
    "Genel Kültür": {
        en: "General Knowledge",
        de: "Allgemeinwissen"
    },
    "Bilim": {
        en: "Science",
        de: "Wissenschaft"
    },
    "Teknoloji": {
        en: "Technology",
        de: "Technologie"
    },
    "Spor": {
        en: "Sports",
        de: "Sport"
    },
    "Müzik": {
        en: "Music",
        de: "Musik"
    },
    "Tarih": {
        en: "History",
        de: "Geschichte"
    },
    "Coğrafya": {
        en: "Geography",
        de: "Geographie"
    },
    "Sanat": {
        en: "Art",
        de: "Kunst"
    },
    "Edebiyat": {
        en: "Literature",
        de: "Literatur"
    },
    "Sinema": {
        en: "Movies",
        de: "Filme"
    },
    "Yemek": {
        en: "Food",
        de: "Essen"
    },
    "Bilgisayar": {
        en: "Computer",
        de: "Computer"
    },
    "Matematik": {
        en: "Mathematics",
        de: "Mathematik"
    },
    "Boşluk Doldurma": {
        en: "Fill in the Blank",
        de: "Lückentext"
    },
    "Diğer": {
        en: "Other",
        de: "Sonstiges"
    }
};

// İngilizce kategorilerin diğer dillerdeki karşılıkları
const reverseCategoryMappings = {
    "General Knowledge": {
        tr: "Genel Kültür",
        de: "Allgemeinwissen"
    },
    "Science": {
        tr: "Bilim",
        de: "Wissenschaft"
    },
    "Technology": {
        tr: "Teknoloji",
        de: "Technologie"
    },
    "Sports": {
        tr: "Spor",
        de: "Sport"
    },
    "Music": {
        tr: "Müzik",
        de: "Musik"
    },
    "History": {
        tr: "Tarih",
        de: "Geschichte"
    },
    "Geography": {
        tr: "Coğrafya",
        de: "Geographie"
    },
    "Art": {
        tr: "Sanat",
        de: "Kunst"
    },
    "Literature": {
        tr: "Edebiyat",
        de: "Literatur"
    },
    "Movies": {
        tr: "Sinema",
        de: "Filme"
    },
    "Food": {
        tr: "Yemek",
        de: "Essen"
    },
    "Computer": {
        tr: "Bilgisayar",
        de: "Computer"
    },
    "Mathematics": {
        tr: "Matematik",
        de: "Mathematik"
    },
    "Fill in the Blank": {
        tr: "Boşluk Doldurma",
        en: "Fill in the Blank"
    },
    "Other": {
        tr: "Diğer",
        en: "Other"
    },
    // Alman kategorilerinden türkçe ve ingilizceye çevrimler
    "Allgemeinwissen": {
        tr: "Genel Kültür",
        en: "General Knowledge"
    },
    "Wissenschaft": {
        tr: "Bilim",
        en: "Science"
    },
    "Technologie": {
        tr: "Teknoloji",
        en: "Technology"
    },
    "Sport": {
        tr: "Spor",
        en: "Sports"
    },
    "Musik": {
        tr: "Müzik",
        en: "Music"
    },
    "Geschichte": {
        tr: "Tarih",
        en: "History"
    },
    "Geographie": {
        tr: "Coğrafya",
        en: "Geography"
    },
    "Kunst": {
        tr: "Sanat",
        en: "Art"
    },
    "Literatur": {
        tr: "Edebiyat",
        en: "Literature"
    },
    "Filme": {
        tr: "Sinema",
        en: "Movies"
    },
    "Essen": {
        tr: "Yemek",
        en: "Food"
    },
    "Mathematik": {
        tr: "Matematik",
        en: "Mathematics"
    },
    "Lückentext": {
        tr: "Boşluk Doldurma",
        en: "Fill in the Blank"
    },
    "Sonstiges": {
        tr: "Diğer",
        en: "Other"
    }
};

// Doğru/Yanlış çevirileri
const trueFalseMapping = {
    "DOĞRU": {
        en: "TRUE",
        de: "WAHR"
    },
    "YANLIŞ": {
        en: "FALSE",
        de: "FALSCH"
    },
    "TRUE": {
        tr: "DOĞRU",
        de: "WAHR"
    },
    "FALSE": {
        tr: "YANLIŞ",
        de: "FALSCH"
    },
    "WAHR": {
        tr: "DOĞRU",
        en: "TRUE"
    },
    "FALSCH": {
        tr: "YANLIŞ",
        en: "FALSE"
    }
};

// Örnek soru çevirisi formatı (API'dan veya veritabanından gelmesi durumunda)
/*
const questionWithTranslations = {
    "id": "q1",
    "question": "Türkiye'nin başkenti neresidir?",
    "options": ["İstanbul", "Ankara", "İzmir", "Bursa"],
    "correctAnswer": "Ankara",
    "translations": {
        "en": {
            "question": "What is the capital of Turkey?",
            "options": ["Istanbul", "Ankara", "Izmir", "Bursa"],
            "correctAnswer": "Ankara"
        },
        "de": {
            "question": "Was ist die Hauptstadt der Türkei?",
            "options": ["Istanbul", "Ankara", "Izmir", "Bursa"],
            "correctAnswer": "Ankara"
        }
    }
}
*/ 