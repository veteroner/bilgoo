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
        aboutMenu: 'Hakkımızda',
        modalLivesEndedTitle: 'Canlarınız Bitti!',
        modalLivesEndedMessage: 'Oyuna devam etmek için can satın alabilirsiniz.',
        modalLivesPackageTitle: '3 Can Paketi',
        modalLivesPackageDescription: 'Oyuna 3 canla devam edin!',
        modalCurrentPoints: 'Mevcut Puanınız',
        modalBuyLivesButton: '3 Can Satın Al ({price} Puan)',
        modalInsufficientPoints: 'Yetersiz Puan ({price} Gerekli)',
        modalFinishGame: 'Oyunu Bitir',
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
        privacySettings: 'Gizlilik Ayarları',
        
        // Ana sayfa hakkında bölümü
        aboutBilgoo: 'Bilgoo Hakkında',
        aboutQuizGame: 'Bilgoo Quiz Oyunu',
        aboutDescription: 'Bilgoo, eğlenceli ve eğitici bir quiz oyunu platformudur. Binlerce soru ile bilginizi test edin, arkadaşlarınızla yarışın ve yeni şeyler öğrenin!',
        features: 'Özellikler',
        singlePlayerMode: 'Tekli oyun modu',
        multiplayerMode: 'Çok oyunculu online yarışmalar',
        globalLeaderboard: 'Küresel skor tablosu',
        detailedStats: 'Detaylı istatistikler',
        addQuestionFeature: 'Soru ekleme özelliği',
        jokerCards: 'Joker kartları',
        questionPool: '50,000+ Soru Havuzu',
        categories: '25+ Kategori',
        multiLanguage: 'Çoklu Dil Desteği',
        offlineSupport: 'Offline Çalışma Desteği',
        socialCompetition: 'Sosyal Yarışma',
        contactInfo: 'İletişim Bilgileri',
        developer: 'Geliştirici',
        quickLinks: 'Hızlı Linkler',
        privacyPolicy: 'Gizlilik Politikası',
        contact: 'İletişim',
        backToMenu: 'Ana Menüye Dön',
        onlineSupport: '7/24 Çevrimiçi Destek',
        allRightsReserved: 'Tüm hakları saklıdır',
        gameFeatures: 'Oyun Özellikleri',
        
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
        
        // Kutlama modalı metinleri
        celebration: {
            perfect: '🎉 MÜKEMMEL! 🎉',
            excellent: '🎊 HARIKA! 🎊', 
            good: '👏 TEBRİKLER! 👏',
            keepGoing: '💪 DEVAM ET! 💪',
            perfectMsg: 'Gerçek bir bilgi şampiyonusun! Bu performans inanılmaz!',
            excellentMsg: 'Çok başarılı bir performans seriledin! Tebrikler!',
            goodMsg: 'Güzel bir oyun oynadın! Devam et, daha da iyisini yapabilirsin!',
            keepGoingMsg: 'Her oyun bir öğrenme deneyimi! Bir sonrakinde daha iyisini yapacaksın!',
            // Rastgele motive edici mesajlar
            motivationalMessages: [
                '🌟 Sen harikasın! Her soru seni daha da güçlü yapıyor!',
                '🔥 Bu enerjin beni çok etkiledi! Hayal gücün sınırsız!',
                '⚡ Zekân gerçekten parıl parıl parlıyor! Muhteşemsin!',
                '🚀 Sadece sen değil, bütün evren senin başarınla gurur duyuyor!',
                '💎 Sen gerçek bir cevher gibisin! Değerin paha biçilemez!',
                '🌈 Her doğru cevabın yeni bir gökkuşağı yaratıyor!',
                '⭐ Yıldızlar bile senin zekânla yarışamaz!',
                '🎯 Hedefine odaklanman beni hayran bırakıyor!',
                '🎨 Düşünce tarzın bir sanat eseri gibi güzel!',
                '🏆 Şampiyonlar senin gibi doğar, seninle büyür!',
                '🌸 Her soruyla birlikte biraz daha çiçek açıyorsun!',
                '🎪 Zekan gerçek bir sirk gösterisi gibi büyüleyici!',
                '🦋 Her cevabınla birlikte metamorfoza uğruyorsun!',
                '💫 Sen bir yıldız kadar parlak, bir komete kadar hızlısın!',
                '🎭 Her hamlen bir başyapıt, her düşüncen bir şiir!',
                '🎼 Beynin en güzel melodi çalıyor şu anda!',
                '🌊 Bilgi okyanusunda yüzme şeklin harika!',
                '🗻 Zor soruları aşma gücün dağları sarsar!',
                '🌺 Çaba gösterme şeklin bir çiçek gibi güzel!',
                '🎨 Hayal gücün Picasso\'yu bile kıskandırır!'
            ],
            youAreAwesome: 'Sen Harikasın!',
            playAgainBtn: '🎮 Tekrar Oyna',
            mainMenuBtn: '🏠 Ana Menü',
            shareBtn: '📤 Paylaş'
        },

        // Can satın alma modalı metinleri
        buyLives: {
            title: 'Canlarınız Bitti!',
            message: 'Oyuna devam etmek için can satın alabilirsiniz.',
            packageTitle: '3 Can Paketi',
            packageDescription: 'Oyuna 3 canla devam edin!',
            currentPoints: 'Mevcut Puanınız',
            buyButton: '3 Can Satın Al ({price} Puan)',
            insufficientPoints: 'Yetersiz Puan ({price} Gerekli)',
            finishGame: 'Oyunu Bitir',
            livesPackage: 'Can Paketi',
            livesPackageStore: '3 adet can satın al',
            buyButtonStore: 'Satın Al',
            currentLives: 'Mevcut canınız',
            lifesPurchased: '3 can satın alındı! ❤️❤️❤️',
            insufficientStars: 'Yeterli yıldızınız yok! (15 yıldız gerekli)',
            purchaseSuccess: '{amount} can satın alındı! Oyun devam ediyor...',
            insufficientPuan: 'Yetersiz puan!',
            priceStars: '15 ⭐'
        },

        // Joker Mağazası çevirileri
        jokerStore: 'Joker Mağazası',
        jokerStoreTitle: 'Joker Mağazası - Puanlarınızla joker satın alın',
        yourPoints: 'Puanınız',
        yourStars: 'Yıldızlarınız',
        joker50Name: '50:50 Joker',
        joker50Desc: 'İki yanlış şıkkı eleme',
        jokerHintName: 'İpucu Joker',
        jokerHintDesc: 'Doğru cevap hakkında ipucu al',
        jokerTimeName: 'Süre Joker',
        jokerTimeDesc: 'Bu soru için 15 saniye ekle',
        jokerSkipName: 'Pas Joker',
        jokerSkipDesc: 'Bu soruyu pas geç ve can kaybetme',
        livesPackageName: 'Can Paketi',
        livesPackageDesc: '3 adet can satın al',
        jokerOwned: 'Sahip olduğunuz',
        currentLives: 'Mevcut canınız',
        buyButton: 'Satın Al',
        
        // Joker kullanım mesajları
        joker50UsedTitle: '50:50 Jokeri Kullanıldı',
        joker50UsedMessage: 'İki yanlış şık elendi!',
        hintJokerUsedTitle: 'İpucu Jokeri Kullanıldı',
        hintJokerUsedMessage: 'Doğru cevap için ipucu verildi!',
        timeJokerUsedTitle: 'Süre Jokeri Kullanıldı',
        timeJokerUsedMessage: '15 saniye eklendi!',
        skipJokerUsedTitle: 'Pas Jokeri Kullanıldı',
        skipJokerUsedMessage: 'Soru pas geçildi!',

        // Gizlilik ayarları metinleri
        privacy: {
            title: 'Gizlilik Ayarları',
            subtitle: 'Kişisel verilerinizi nasıl kullandığımızı kontrol edin',
            backLink: 'Ana Sayfaya Dön',
            cookieSettings: 'Çerez Ayarları',
            essentialCookies: 'Gerekli Çerezler',
            essentialCookiesDesc: 'Sitenin çalışması için gerekli çerezler (her zaman aktif)',
            analyticsCookies: 'Analitik Çerezler',
            analyticsCookiesDesc: 'Site kullanımını analiz etmemize yardımcı olur',
            advertisingCookies: 'Reklam Çerezleri',
            advertisingCookiesDesc: 'Kişiselleştirilmiş reklamlar için kullanılır',
            saveCookieSettings: 'Çerez Ayarlarını Kaydet',
            dataManagement: 'Veri Yönetimi',
            downloadData: 'Verilerinizi İndirin',
            downloadDataDesc: 'Sizin hakkınızdaki tüm verileri JSON formatında indirebilirsiniz',
            downloadMyData: 'Verilerimi İndir',
            dataRetention: 'Veri Saklama Süresi',
            dataRetentionDesc: 'Verileriniz ne kadar süre saklanacak',
            oneYear: '1 Yıl',
            twoYears: '2 Yıl',
            fiveYears: '5 Yıl',
            forever: 'Süresiz',
            saveDataSettings: 'Veri Ayarlarını Kaydet',
            privacyControl: 'Gizlilik Kontrolü',
            profileVisibility: 'Profil Görünürlüğü',
            profileVisibilityDesc: 'Profiliniz diğer kullanıcılara görünsün mü?',
            statsSharing: 'İstatistik Paylaşımı',
            statsSharingDesc: 'İstatistikleriniz leaderboard\'da gösterilsin mi?',
            friendRequests: 'Arkadaş İstekleri',
            friendRequestsDesc: 'Diğer kullanıcılar size arkadaşlık isteği gönderebilsin mi?',
            savePrivacySettings: 'Gizlilik Ayarlarını Kaydet',
            consentHistory: 'Rıza Geçmişi',
            consentHistoryDesc: 'Gizlilik politikası onaylarınızın geçmişi',
            accountOperations: 'Hesap İşlemleri',
            deleteAccount: 'Hesabımı Sil',
            deleteAccountDesc: 'Hesabınızı ve tüm verilerinizi kalıcı olarak silin'
        },

        // Çerez bildirimi metinleri
        cookies: {
            title: 'Çerez Bildirimi',
            message: 'Web sitemiz, size daha iyi hizmet verebilmek ve reklamları kişiselleştirmek için çerezler kullanır. Detaylı bilgi için Gizlilik Politikamızı inceleyebilirsiniz.',
            acceptEssential: 'Sadece Gerekli',
            acceptAll: 'Tümünü Kabul Et',
            settings: 'Ayarlar',
            settingsTitle: 'Çerez Ayarları',
            essentialCookies: 'Zorunlu Çerezler',
            essentialCookiesDesc: 'Sitenin çalışması için gerekli çerezler',
            analyticsCookies: 'Analitik Çerezler',
            analyticsCookiesDesc: 'Site kullanımını analiz etmek için kullanılır',
            advertisingCookies: 'Reklam Çerezleri',
            advertisingCookiesDesc: 'Kişiselleştirilmiş reklamlar göstermek için kullanılır',
            save: 'Kaydet',
            privacyPolicy: 'Gizlilik Politikamızı'
        },
        
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
        addQuestionButton: 'Soru Ekle',
        
        // === Hakkımızda (About) Bölümü ===
        about: {
            title: 'Bilgoo Hakkında',
            subtitle: 'Eğitimi oyunlaştırarak öğrenmeyi eğlenceli hale getiriyoruz',
            missionTitle: 'Misyonumuz',
            missionText: 'Bilgoo olarak, eğitimi herkes için erişilebilir, eğlenceli ve etkileşimli hale getirmeyi hedefliyoruz. Quiz tabanlı öğrenme deneyimi sunarak, kullanıcılarımızın bilgi seviyelerini artırmalarına ve kendilerini geliştirmelerine yardımcı oluyoruz.',
            whatIsTitle: 'Bilgoo Nedir?',
            whatIsText: "Bilgoo, Türkiye'nin önde gelen interaktif bilgi yarışması platformudur. 2023 yılında kurulan platformumuz, eğitim teknolojileri alanında yenilikçi çözümler sunmaktadır. Kullanıcılarımız, geniş soru havuzumuzdan faydalanarak bilgilerini test edebilir, arkadaşlarıyla yarışabilir ve öğrenme süreçlerini gamifikasyon ile destekleyebilirler.",
            statsActiveUsers: 'Aktif Kullanıcı',
            statsQuestionPool: 'Soru Havuzu',
            statsCategories: 'Kategori',
            statsQuizSolved: 'Çözülen Quiz',
            featuresTitle: 'Özelliklerimiz',
            featurePoolTitle: 'Kapsamlı Soru Havuzu',
            featurePoolText: 'Genel kültür, bilim, tarih, coğrafya, spor ve daha birçok kategoride binlerce özgün soru ile bilginizi test edin.',
            featureSocialTitle: 'Sosyal Yarışma',
            featureSocialText: 'Arkadaşlarınızla yarışın, lider tablosunda yerinizi alın ve başarılarınızı paylaşın.',
            featureProgressTitle: 'İlerleme Takibi',
            featureProgressText: 'Detaylı istatistikler ve grafikler ile öğrenme sürecinizi takip edin ve gelişim alanlarınızı belirleyin.',
            featureAchievementsTitle: 'Başarı Sistemi',
            featureAchievementsText: 'Rozetler, başarılar ve seviye sistemi ile motivasyonunuzu yüksek tutun.',
            featureMultiTitle: 'Çoklu Platform',
            featureMultiText: 'Web, mobil ve tablet cihazlarda sorunsuz deneyim yaşayın. PWA teknolojisi ile offline çalışma desteği.',
            featureSecurityTitle: 'Güvenli Platform',
            featureSecurityText: 'Verileriniz şifrelenir ve gizliliğiniz korunur. GDPR uyumlu güvenli altyapı.',
            visionTitle: 'Vizyonumuz',
            visionText: "Eğitim teknolojileri alanında Türkiye'nin lider platformu olmak ve dünya çapında tanınan bir marka haline gelmek. Yapay zeka destekli kişiselleştirilmiş öğrenme deneyimleri sunarak, her yaştan kullanıcının öğrenme potansiyelini maksimize etmek.",
            goalsTitle: 'Hedeflerimiz',
            goal1: '2025 yılı sonuna kadar 100,000 aktif kullanıcıya ulaşmak',
            goal2: 'Yapay zeka destekli adaptif öğrenme sistemi geliştirmek',
            goal3: 'Eğitim kurumları ile iş birlikleri kurmak',
            goal4: 'Uluslararası pazarlara açılmak',
            goal5: "Mobil uygulama indirme sayısını 500,000'e çıkarmak",
            goal6: 'Premium üyelik sistemi ile sürdürülebilir gelir modeli oluşturmak',
            teamTitle: 'Ekibimiz',
            teamText1: 'Bilgoo ekibi, eğitim teknolojileri, yazılım geliştirme ve kullanıcı deneyimi alanlarında uzman profesyonellerden oluşmaktadır. Türkiye\'nin önde gelen üniversitelerinden mezun olan ekibimiz, eğitimi dönüştürme tutkusu ile çalışmaktadır.',
            teamText2: '<strong>Teknova Bilişim</strong> çatısı altında faaliyet gösteren platformumuz, sürekli araştırma ve geliştirme faaliyetleriyle kullanıcı deneyimini iyileştirmeye odaklanmıştır.',
            qualityTitle: 'Kalite ve Güvenilirlik',
            qualityIntro: 'Bilgoo olarak, kullanıcılarımıza en yüksek kalitede hizmet sunmayı taahhüt ediyoruz:',
            quality1: 'Tüm sorularımız uzman eğitmenler tarafından hazırlanır ve kontrol edilir',
            quality2: 'Güncel ve doğru bilgileri sunmak için sürekli içerik güncellemesi yaparız',
            quality3: 'Kullanıcı geri bildirimlerini dikkate alarak platformu sürekli geliştiririz',
            quality4: 'Teknik altyapımız 7/24 izlenir ve optimize edilir',
            quality5: 'Müşteri destek ekibimiz kullanıcı sorularını hızla yanıtlar',
            socialTitle: 'Sosyal Sorumluluk',
            socialIntro: 'Eğitimin toplumsal değişimin motoru olduğuna inanıyoruz. Bu nedenle:',
            social1: 'Dezavantajlı öğrenciler için ücretsiz premium üyelik programı sunuyoruz',
            social2: 'Eğitim kurumlarına özel indirimler ve destek sağlıyoruz',
            social3: 'Açık kaynak eğitim projelerine katkıda bulunuyoruz',
            social4: 'Dijital okuryazarlık kampanyalarını destekliyoruz',
            contactTitle: 'İletişim',
            contactText: 'Sorularınız, önerileriniz veya iş birliği teklifleriniz için bizimle iletişime geçin:',
            contactEmailLabel: 'E-posta',
            contactWebLabel: 'Web',
            contactSupportLabel: 'Destek',
            backLink: 'Ana Sayfaya Dön'
        }
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
        aboutMenu: 'About',
        modalLivesEndedTitle: 'Out of Lives!',
        modalLivesEndedMessage: 'You can buy lives to continue the game.',
        modalLivesPackageTitle: '3 Lives Pack',
        modalLivesPackageDescription: 'Continue the game with 3 extra lives!',
        modalCurrentPoints: 'Your Points',
        modalBuyLivesButton: 'Buy 3 Lives ({price} Points)',
        modalInsufficientPoints: 'Insufficient Points ({price} Needed)',
        modalFinishGame: 'Finish Game',
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
        privacySettings: 'Privacy Settings',
        
        // Ana sayfa hakkında bölümü
        aboutBilgoo: 'About Bilgoo',
        aboutQuizGame: 'Bilgoo Quiz Game',
        aboutDescription: 'Bilgoo is a fun and educational quiz game platform. Test your knowledge with thousands of questions, compete with friends and learn new things!',
        features: 'Features',
        singlePlayerMode: 'Single player mode',
        multiplayerMode: 'Multiplayer online competitions',
        globalLeaderboard: 'Global leaderboard',
        detailedStats: 'Detailed statistics',
        addQuestionFeature: 'Add question feature',
        jokerCards: 'Joker cards',
        questionPool: '50,000+ Question Pool',
        categories: '25+ Categories',
        multiLanguage: 'Multi-Language Support',
        offlineSupport: 'Offline Support',
        socialCompetition: 'Social Competition',
        contactInfo: 'Contact Information',
        developer: 'Developer',
        quickLinks: 'Quick Links',
        privacyPolicy: 'Privacy Policy',
        contact: 'Contact',
        backToMenu: 'Back to Main Menu',
        onlineSupport: '24/7 Online Support',
        allRightsReserved: 'All rights reserved',
        gameFeatures: 'Game Features',
        
        // Ana sayfa hakkında bölümü
        aboutBilgoo: 'About Bilgoo',
        aboutQuizGame: 'Bilgoo Quiz Game',
        aboutDescription: 'Bilgoo is a fun and educational quiz game platform. Test your knowledge with thousands of questions, compete with your friends and learn new things!',
        features: 'Features',
        singlePlayerMode: 'Single player mode',
        multiplayerMode: 'Multiplayer online competitions',
        globalLeaderboard: 'Global leaderboard',
        detailedStats: 'Detailed statistics',
        addQuestionFeature: 'Add question feature',
        jokerCards: 'Joker cards',
        questionPool: '50,000+ Question Pool',
        categories: '25+ Categories',
        multiLanguage: 'Multi-Language Support',
        offlineSupport: 'Offline Support',
        socialCompetition: 'Social Competition',
        contactInfo: 'Contact Information',
        developer: 'Developer',
        quickLinks: 'Quick Links',
        privacyPolicy: 'Privacy Policy',
        contact: 'Contact',
        backToMenu: 'Back to Menu',
        onlineSupport: '24/7 Online Support',
        allRightsReserved: 'All rights reserved',
        gameFeatures: 'Game Features',
        
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
        
        // Celebration modal texts
        celebration: {
            perfect: '🎉 PERFECT! 🎉',
            excellent: '🎊 EXCELLENT! 🎊', 
            good: '👏 CONGRATULATIONS! 👏',
            keepGoing: '💪 KEEP GOING! 💪',
            perfectMsg: 'You are a true knowledge champion! This performance is incredible!',
            excellentMsg: 'You delivered a very successful performance! Congratulations!',
            goodMsg: 'You played a great game! Keep going, you can do even better!',
            keepGoingMsg: 'Every game is a learning experience! You will do better next time!',
            gameSummary: '🎮 Game Summary',
            correctAnswersLabel: 'Correct Answers',
            totalPointsLabel: 'Total Points',
            averageTimeLabel: 'Average Time',
            remainingLivesLabel: 'Remaining Lives',
            successRateLabel: 'Success Rate',
            playAgainBtn: '🎮 Play Again',
            mainMenuBtn: '🏠 Main Menu',
            shareBtn: '📤 Share'
        },

        // Buy lives modal texts
        buyLives: {
            title: 'Out of Lives!',
            message: 'You can purchase lives to continue playing.',
            packageTitle: '3 Lives Package',
            packageDescription: 'Continue playing with 3 lives!',
            currentPoints: 'Your Current Points',
            buyButton: 'Buy 3 Lives ({price} Points)',
            insufficientPoints: 'Insufficient Points ({price} Required)',
            finishGame: 'Finish Game',
            livesPackage: 'Lives Package',
            livesPackageStore: 'Buy 3 lives',
            buyButtonStore: 'Buy',
            currentLives: 'Your current lives',
            lifesPurchased: '3 lives purchased! ❤️❤️❤️',
            insufficientStars: 'Not enough stars! (15 stars required)',
            purchaseSuccess: '{amount} lives purchased! Game continues...',
            insufficientPuan: 'Insufficient points!',
            priceStars: '15 ⭐'
        },

        // Joker Store translations
        jokerStore: 'Joker Store',
        jokerStoreTitle: 'Joker Store - Buy jokers with your points',
        yourPoints: 'Your Points',
        yourStars: 'Your Stars',
        joker50Name: '50:50 Joker',
        joker50Desc: 'Eliminate two wrong options',
        jokerHintName: 'Hint Joker',
        jokerHintDesc: 'Get a hint about the correct answer',
        jokerTimeName: 'Time Joker',
        jokerTimeDesc: 'Add 15 seconds for this question',
        jokerSkipName: 'Skip Joker',
        jokerSkipDesc: 'Skip this question without losing life',
        livesPackageName: 'Lives Package',
        livesPackageDesc: 'Buy 3 lives',
        jokerOwned: 'You own',
        currentLives: 'Current lives',
        buyButton: 'Buy',
        
        // Joker usage messages
        joker50UsedTitle: '50:50 Joker Used',
        joker50UsedMessage: 'Two wrong options eliminated!',
        hintJokerUsedTitle: 'Hint Joker Used',
        hintJokerUsedMessage: 'Hints provided for the correct answer!',
        timeJokerUsedTitle: 'Time Joker Used',
        timeJokerUsedMessage: '15 seconds added!',
        skipJokerUsedTitle: 'Skip Joker Used',
        skipJokerUsedMessage: 'Question skipped!',

        // Privacy settings texts
        privacy: {
            title: 'Privacy Settings',
            subtitle: 'Control how we use your personal data',
            backLink: 'Back to Home',
            cookieSettings: 'Cookie Settings',
            essentialCookies: 'Essential Cookies',
            essentialCookiesDesc: 'Cookies required for site functionality (always active)',
            analyticsCookies: 'Analytics Cookies',
            analyticsCookiesDesc: 'Help us analyze site usage',
            advertisingCookies: 'Advertising Cookies',
            advertisingCookiesDesc: 'Used for personalized advertisements',
            saveCookieSettings: 'Save Cookie Settings',
            dataManagement: 'Data Management',
            downloadData: 'Download Your Data',
            downloadDataDesc: 'You can download all data about you in JSON format',
            downloadMyData: 'Download My Data',
            dataRetention: 'Data Retention Period',
            dataRetentionDesc: 'How long your data will be stored',
            oneYear: '1 Year',
            twoYears: '2 Years',
            fiveYears: '5 Years',
            forever: 'Forever',
            saveDataSettings: 'Save Data Settings',
            privacyControl: 'Privacy Control',
            profileVisibility: 'Profile Visibility',
            profileVisibilityDesc: 'Should your profile be visible to other users?',
            statsSharing: 'Statistics Sharing',
            statsSharingDesc: 'Should your statistics be shown on leaderboard?',
            friendRequests: 'Friend Requests',
            friendRequestsDesc: 'Can other users send you friend requests?',
            savePrivacySettings: 'Save Privacy Settings',
            consentHistory: 'Consent History',
            consentHistoryDesc: 'History of your privacy policy approvals',
            accountOperations: 'Account Operations',
            deleteAccount: 'Delete My Account',
            deleteAccountDesc: 'Permanently delete your account and all your data'
        },

        // Cookie consent texts
        cookies: {
            title: 'Cookie Notice',
            message: 'Our website uses cookies to provide you with better service and personalize advertisements. For detailed information, please review our Privacy Policy.',
            acceptEssential: 'Essential Only',
            acceptAll: 'Accept All',
            settings: 'Settings',
            settingsTitle: 'Cookie Settings',
            essentialCookies: 'Essential Cookies',
            essentialCookiesDesc: 'Cookies required for site functionality',
            analyticsCookies: 'Analytics Cookies',
            analyticsCookiesDesc: 'Used to analyze site usage',
            advertisingCookies: 'Advertising Cookies',
            advertisingCookiesDesc: 'Used to show personalized advertisements',
            save: 'Save',
            privacyPolicy: 'our Privacy Policy'
        },
        
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
        addQuestionButton: 'Add Question',
        
        // === Hakkımızda (About) Bölümü ===
        about: {
            title: 'About Bilgoo',
            subtitle: 'We gamify learning to make it fun and engaging',
            missionTitle: 'Our Mission',
            missionText: 'As Bilgoo, we aim to make education accessible, fun, and interactive for everyone. Through our quiz-based learning experience, we help users improve their knowledge levels and develop themselves.',
            whatIsTitle: 'What is Bilgoo?',
            whatIsText: "Bilgoo is Turkey's leading interactive trivia platform. Launched in 2023, our platform offers innovative solutions in the education technology field. Our users can test their knowledge by utilizing our extensive question pool, compete with their friends, and support their learning process with gamification.",
            statsActiveUsers: 'Active Users',
            statsQuestionPool: 'Question Pool',
            statsCategories: 'Categories',
            statsQuizSolved: 'Quizzes Solved',
            featuresTitle: 'Our Features',
            featurePoolTitle: 'Comprehensive Question Pool',
            featurePoolText: 'Test your knowledge with thousands of original questions across general knowledge, science, history, geography, sports, and many other categories.',
            featureSocialTitle: 'Social Competition',
            featureSocialText: 'Compete with your friends, take your place on the leaderboard, and share your achievements.',
            featureProgressTitle: 'Progress Tracking',
            featureProgressText: 'Track your learning journey with detailed statistics and graphs, and identify your growth areas.',
            featureAchievementsTitle: 'Achievement System',
            featureAchievementsText: 'Motivate yourself with achievements, badges, and a level system.',
            featureMultiTitle: 'Multi-Platform',
            featureMultiText: 'Experience seamless functionality across web, mobile, and tablet devices. Offline support with PWA technology.',
            featureSecurityTitle: 'Secure Platform',
            featureSecurityText: 'Your data is encrypted and your privacy is protected. GDPR-compliant secure infrastructure.',
            visionTitle: 'Our Vision',
            visionText: "To become the leading platform in the education technology field in Turkey and become a recognized brand worldwide. Through AI-powered personalized learning experiences, we maximize the learning potential of users of all ages.",
            goalsTitle: 'Our Goals',
            goal1: 'Reach 100,000 active users by the end of 2025',
            goal2: 'Develop an AI-powered adaptive learning system',
            goal3: 'Establish partnerships with educational institutions',
            goal4: 'Enter international markets',
            goal5: "Increase mobile app downloads to 500,000",
            goal6: 'Create a sustainable revenue model with a premium membership system',
            teamTitle: 'Our Team',
            teamText1: 'Our Bilgoo team consists of experts in education technology, software development, and user experience.',
            teamText2: '<strong>Teknova Bilişim</strong> platform of our company, which operates under the Teknova umbrella, focuses on continuously improving user experience through research and development activities.',
            qualityTitle: 'Quality and Reliability',
            qualityIntro: 'As Bilgoo, we guarantee the highest quality service for our users:',
            quality1: 'All our questions are prepared and reviewed by expert educators',
            quality2: 'We continuously update content to ensure accurate and up-to-date information',
            quality3: 'We continuously improve the platform based on user feedback',
            quality4: 'Our technical infrastructure is monitored 24/7 and optimized',
            quality5: 'Our customer support team quickly responds to user queries',
            socialTitle: 'Social Responsibility',
            socialIntro: 'We believe that education is the motor of social change. Therefore:',
            social1: 'We offer a free premium membership program for disadvantaged students',
            social2: 'We provide special discounts and support to educational institutions',
            social3: 'We contribute to open source education projects',
            social4: 'We support digital literacy campaigns',
            contactTitle: 'Contact',
            contactText: 'For questions, suggestions, or partnership inquiries, please contact us:',
            contactEmailLabel: 'Email',
            contactWebLabel: 'Web',
            contactSupportLabel: 'Support',
            backLink: 'Back to Home'
        }
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
        aboutMenu: 'Über',
        modalLivesEndedTitle: 'Keine Leben mehr!',
        modalLivesEndedMessage: 'Sie können Leben kaufen, um fortzufahren.',
        modalLivesPackageTitle: '3-Leben-Paket',
        modalLivesPackageDescription: 'Spielen Sie mit 3 zusätzlichen Leben weiter!',
        modalCurrentPoints: 'Ihre Punkte',
        modalBuyLivesButton: '3 Leben kaufen ({price} Punkte)',
        modalInsufficientPoints: 'Unzureichende Punkte ({price} benötigt)',
        modalFinishGame: 'Spiel Beenden',
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
        privacySettings: 'Datenschutz-Einstellungen',
        
        // Ana sayfa hakkında bölümü
        aboutBilgoo: 'Über Bilgoo',
        aboutQuizGame: 'Bilgoo Quiz-Spiel',
        aboutDescription: 'Bilgoo ist eine unterhaltsame und lehrreiche Quiz-Spiel-Plattform. Testen Sie Ihr Wissen mit Tausenden von Fragen, treten Sie gegen Freunde an und lernen Sie neue Dinge!',
        features: 'Funktionen',
        singlePlayerMode: 'Einzelspieler-Modus',
        multiplayerMode: 'Mehrspieler-Online-Wettbewerbe',
        globalLeaderboard: 'Globale Bestenliste',
        detailedStats: 'Detaillierte Statistiken',
        addQuestionFeature: 'Fragen hinzufügen',
        jokerCards: 'Joker-Karten',
        questionPool: '50.000+ Fragenpoll',
        categories: '25+ Kategorien',
        multiLanguage: 'Mehrsprachiger Support',
        offlineSupport: 'Offline-Unterstützung',
        socialCompetition: 'Sozialer Wettbewerb',
        contactInfo: 'Kontaktinformationen',
        developer: 'Entwickler',
        quickLinks: 'Schnelllinks',
        privacyPolicy: 'Datenschutzerklärung',
        contact: 'Kontakt',
        backToMenu: 'Zurück zum Hauptmenü',
        onlineSupport: '24/7 Online-Support',
        allRightsReserved: 'Alle Rechte vorbehalten',
        gameFeatures: 'Spiel-Features',
        
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
        
        // Feier-Modal Texte
        celebration: {
            perfect: '🎉 PERFEKT! 🎉',
            excellent: '🎊 AUSGEZEICHNET! 🎊', 
            good: '👏 GLÜCKWUNSCH! 👏',
            keepGoing: '💪 MACH WEITER! 💪',
            perfectMsg: 'Du bist ein wahrer Wissens-Champion! Diese Leistung ist unglaublich!',
            excellentMsg: 'Du hast eine sehr erfolgreiche Leistung erbracht! Glückwunsch!',
            goodMsg: 'Du hast ein tolles Spiel gespielt! Mach weiter, du kannst noch besser werden!',
            keepGoingMsg: 'Jedes Spiel ist eine Lernerfahrung! Du wirst es das nächste Mal besser machen!',
            gameSummary: '🎮 Spiel Zusammenfassung',
            correctAnswersLabel: 'Richtige Antworten',
            totalPointsLabel: 'Gesamtpunkte',
            averageTimeLabel: 'Durchschnittszeit',
            remainingLivesLabel: 'Verbleibende Leben',
            successRateLabel: 'Erfolgsrate',
            playAgainBtn: '🎮 Nochmal Spielen',
            mainMenuBtn: '🏠 Hauptmenü',
            shareBtn: '📤 Teilen'
        },

        // Leben kaufen Modal Texte
        buyLives: {
            title: 'Keine Leben mehr!',
            message: 'Sie können Leben kaufen, um weiterzuspielen.',
            packageTitle: '3 Leben Paket',
            packageDescription: 'Spiel mit 3 Leben fortsetzen!',
            currentPoints: 'Ihre aktuellen Punkte',
            buyButton: '3 Leben kaufen ({price} Punkte)',
            insufficientPoints: 'Unzureichende Punkte ({price} erforderlich)',
            finishGame: 'Spiel beenden',
            livesPackage: 'Leben Paket',
            livesPackageStore: '3 Leben kaufen',
            buyButtonStore: 'Kaufen',
            currentLives: 'Ihre aktuellen Leben',
            lifesPurchased: '3 Leben gekauft! ❤️❤️❤️',
            insufficientStars: 'Nicht genug Sterne! (15 Sterne erforderlich)',
            purchaseSuccess: '{amount} Leben gekauft! Spiel geht weiter...',
            insufficientPuan: 'Unzureichende Punkte!',
            priceStars: '15 ⭐'
        },

        // Joker-Shop Übersetzungen
        jokerStore: 'Joker-Shop',
        jokerStoreTitle: 'Joker-Shop - Kaufen Sie Joker mit Ihren Punkten',
        yourPoints: 'Ihre Punkte',
        yourStars: 'Ihre Sterne',
        joker50Name: '50:50 Joker',
        joker50Desc: 'Zwei falsche Optionen eliminieren',
        jokerHintName: 'Hinweis-Joker',
        jokerHintDesc: 'Einen Hinweis zur richtigen Antwort erhalten',
        jokerTimeName: 'Zeit-Joker',
        jokerTimeDesc: '15 Sekunden für diese Frage hinzufügen',
        jokerSkipName: 'Überspringen-Joker',
        jokerSkipDesc: 'Diese Frage überspringen ohne Leben zu verlieren',
        livesPackageName: 'Leben-Paket',
        livesPackageDesc: '3 Leben kaufen',
        jokerOwned: 'Sie besitzen',
        currentLives: 'Aktuelle Leben',
        buyButton: 'Kaufen',
        
        // Joker-Verwendungsnachrichten
        joker50UsedTitle: '50:50 Joker Verwendet',
        joker50UsedMessage: 'Zwei falsche Optionen entfernt!',
        hintJokerUsedTitle: 'Hinweis-Joker Verwendet',
        hintJokerUsedMessage: 'Hinweise für die richtige Antwort bereitgestellt!',
        timeJokerUsedTitle: 'Zeit-Joker Verwendet',
        timeJokerUsedMessage: '15 Sekunden hinzugefügt!',
        skipJokerUsedTitle: 'Überspringen-Joker Verwendet',
        skipJokerUsedMessage: 'Frage übersprungen!',

        // Datenschutz-Einstellungen Texte
        privacy: {
            title: 'Datenschutz-Einstellungen',
            subtitle: 'Kontrollieren Sie, wie wir Ihre persönlichen Daten verwenden',
            backLink: 'Zurück zur Startseite',
            cookieSettings: 'Cookie-Einstellungen',
            essentialCookies: 'Notwendige Cookies',
            essentialCookiesDesc: 'Cookies, die für die Funktionalität der Website erforderlich sind (immer aktiv)',
            analyticsCookies: 'Analyse-Cookies',
            analyticsCookiesDesc: 'Helfen uns bei der Analyse der Website-Nutzung',
            advertisingCookies: 'Werbe-Cookies',
            advertisingCookiesDesc: 'Werden für personalisierte Werbung verwendet',
            saveCookieSettings: 'Cookie-Einstellungen speichern',
            dataManagement: 'Datenverwaltung',
            downloadData: 'Ihre Daten herunterladen',
            downloadDataDesc: 'Sie können alle Daten über Sie im JSON-Format herunterladen',
            downloadMyData: 'Meine Daten herunterladen',
            dataRetention: 'Datenspeicherdauer',
            dataRetentionDesc: 'Wie lange Ihre Daten gespeichert werden',
            oneYear: '1 Jahr',
            twoYears: '2 Jahre',
            fiveYears: '5 Jahre',
            forever: 'Unbegrenzt',
            saveDataSettings: 'Dateneinstellungen speichern',
            privacyControl: 'Datenschutzkontrolle',
            profileVisibility: 'Profil-Sichtbarkeit',
            profileVisibilityDesc: 'Soll Ihr Profil für andere Benutzer sichtbar sein?',
            statsSharing: 'Statistik-Freigabe',
            statsSharingDesc: 'Sollen Ihre Statistiken in der Bestenliste angezeigt werden?',
            friendRequests: 'Freundschaftsanfragen',
            friendRequestsDesc: 'Können andere Benutzer Ihnen Freundschaftsanfragen senden?',
            savePrivacySettings: 'Datenschutz-Einstellungen speichern',
            consentHistory: 'Einverständnis-Verlauf',
            consentHistoryDesc: 'Verlauf Ihrer Datenschutzrichtlinien-Genehmigungen',
            accountOperations: 'Konto-Operationen',
            deleteAccount: 'Mein Konto löschen',
            deleteAccountDesc: 'Löschen Sie Ihr Konto und alle Ihre Daten dauerhaft'
        },

        // Cookie-Zustimmung Texte
        cookies: {
            title: 'Cookie-Hinweis',
            message: 'Unsere Website verwendet Cookies, um Ihnen einen besseren Service zu bieten und Werbung zu personalisieren. Für detaillierte Informationen lesen Sie bitte unsere Datenschutzrichtlinie.',
            acceptEssential: 'Nur Notwendige',
            acceptAll: 'Alle akzeptieren',
            settings: 'Einstellungen',
            settingsTitle: 'Cookie-Einstellungen',
            essentialCookies: 'Notwendige Cookies',
            essentialCookiesDesc: 'Cookies, die für die Funktionalität der Website erforderlich sind',
            analyticsCookies: 'Analyse-Cookies',
            analyticsCookiesDesc: 'Werden zur Analyse der Website-Nutzung verwendet',
            advertisingCookies: 'Werbe-Cookies',
            advertisingCookiesDesc: 'Werden verwendet, um personalisierte Werbung anzuzeigen',
            save: 'Speichern',
            privacyPolicy: 'unsere Datenschutzrichtlinie'
        },
        
        // Add question modal
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
        addQuestionButton: 'Frage hinzufügen',
        
        // === Hakkımızda (About) Bölümü ===
        about: {
            title: 'Über Bilgoo',
            subtitle: 'Wir machen Lernen spielerisch und spannend',
            missionTitle: 'Unsere Mission',
            missionText: 'Als Bilgoo streben wir nach Zugang, Spaß und Interaktion für alle. Durch unsere Quiz-basierte Lernfähigkeit helfen wir den Benutzern, ihre Wissensstandards zu verbessern und sich zu entwickeln.',
            whatIsTitle: 'Was ist Bilgoo?',
            whatIsText: "Bilgoo ist die führende interaktive Trivia-Plattform in der Türkei. Seit 2023 bietet unsere Plattform innovative Lösungen im Bereich der Bildungstechnologie. Unsere Benutzer können ihre Kenntnisse durch die Nutzung unseres umfangreichen Fragepools testen, mit ihren Freunden konkurrieren und ihren Lernprozess mit Gamifizierung unterstützen.",
            statsActiveUsers: 'Aktive Benutzer',
            statsQuestionPool: 'Fragepool',
            statsCategories: 'Kategorien',
            statsQuizSolved: 'Gelöste Quizze',
            featuresTitle: 'Unsere Funktionen',
            featurePoolTitle: 'Umfangreicher Fragepool',
            featurePoolText: 'Testen Sie Ihr Wissen mit Tausenden von originellen Fragen über Allgemeinwissen, Wissenschaft, Geschichte, Geographie, Sport und viele andere Kategorien.',
            featureSocialTitle: 'Soziale Wettbewerb',
            featureSocialText: 'Konkurrieren Sie mit Ihren Freunden, nehmen Sie Ihren Platz auf der Bestenliste ein und teilen Sie Ihre Erfolge.',
            featureProgressTitle: 'Fortschrittsschau',
            featureProgressText: 'Verfolgen Sie Ihren Lernprozess mit detaillierten Statistiken und Grafiken und identifizieren Sie Ihre Wachstumsbereiche.',
            featureAchievementsTitle: 'Erfolgsystem',
            featureAchievementsText: 'Motivieren Sie sich mit Erfolgen, Abzeichen und einem Stufensystem.',
            featureMultiTitle: 'Mehrplattform',
            featureMultiText: 'Genießen Sie eine reibungslose Funktionalität auf Web, Mobil und Tablet-Geräten. Offline-Unterstützung mit PWA-Technologie.',
            featureSecurityTitle: 'Sichere Plattform',
            featureSecurityText: 'Ihre Daten werden verschlüsselt und Ihre Privatsphäre geschützt. GDPR-konforme sichere Infrastruktur.',
            visionTitle: 'Unsere Vision',
            visionText: "Zu einem führenden Plattform im Bereich der Bildungstechnologie in der Türkei und zu einem anerkannten Markenzeichen weltweit zu werden. Durch künstliche Intelligenz unterstützte persönliche Lernerfahrungen maximieren wir das Lernpotenzial aller Altersgruppen.",
            goalsTitle: 'Unsere Ziele',
            goal1: 'Bis Ende 2025 100.000 aktive Benutzer erreichen',
            goal2: 'Ein künstlich intelligenter adaptiver Lernsystem entwickeln',
            goal3: 'Partner mit Bildungseinrichtungen eingehen',
            goal4: 'Internationale Märkte betreten',
            goal5: "Mobilapp-Downloads auf 500.000 erhöhen",
            goal6: 'Ein dauerhaftes Einkommensmodell mit einem Premium-Mitgliedschaftssystem erstellen',
            teamTitle: 'Unser Team',
            teamText1: 'Unser Bilgoo-Team besteht aus Experten im Bereich Bildungstechnologie, Softwareentwicklung und Benutzererfahrung.',
            teamText2: '<strong>Teknova Bilişim</strong> Plattform unserer Firma, die unter dem Teknova-Dach operiert, konzentriert sich auf die ständige Verbesserung der Benutzererfahrung durch Forschungs- und Entwicklungsaktivitäten.',
            qualityTitle: 'Qualität und Zuverlässigkeit',
            qualityIntro: 'Als Bilgoo garantieren wir die höchste Qualität für unsere Benutzer:',
            quality1: 'Alle unsere Fragen werden von erfahrenen Lehrern vorbereitet und überprüft',
            quality2: 'Wir aktualisieren ständig Inhalt, um sicherzustellen, dass Informationen aktuell und genau sind',
            quality3: 'Wir verbessern die Plattform basierend auf Benutzerfeedback ständig',
            quality4: 'Unsere technische Infrastruktur wird 24/7 überwacht und optimiert',
            quality5: 'Unser Kundensupport-Team antwortet schnell auf Benutzerfragen',
            socialTitle: 'Soziale Verantwortung',
            socialIntro: 'Wir glauben, dass Bildung der Motor sozialer Veränderungen ist. Deshalb:',
            social1: 'Wir bieten ein kostenloses Premium-Mitgliedschaftsprogramm für benachteiligte Schüler an',
            social2: 'Wir gewähren spezielle Rabatte und Unterstützung für Bildungseinrichtungen',
            social3: 'Wir tragen zum Open-Source-Bildungsvorhaben bei',
            social4: 'Wir unterstützen digitale Lesefähigkeitskampagnen',
            contactTitle: 'Kontakt',
            contactText: 'Für Fragen, Vorschläge oder Partnerschaftsanfragen kontaktieren Sie uns bitte:',
            contactEmailLabel: 'E-Mail',
            contactWebLabel: 'Web',
            contactSupportLabel: 'Unterstützung',
            backLink: 'Zurück zur Startseite'
        }
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