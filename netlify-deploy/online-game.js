const onlineGame = {
    // DOM Elementleri
    singlePlayerBtn: document.getElementById('single-player-btn'),
    multiPlayerBtn: document.getElementById('online-game-button'),
    leaderboardBtn: document.getElementById('view-global-leaderboard'),
    mainMenu: document.getElementById('main-menu'),
    onlineOptions: document.getElementById('online-game-options'),
    createRoomBtn: document.getElementById('create-room'),
    joinRoomBtn: document.getElementById('join-room'),
    backToMainBtn: document.getElementById('back-to-main'),
    roomCreation: document.getElementById('room-creation'),
    roomJoin: document.getElementById('room-join'),
    roomNameInput: document.getElementById('room-name'),
    roomCodeInput: document.getElementById('room-code'),
    createRoomSubmit: document.getElementById('create-room-submit'),
    joinRoomSubmit: document.getElementById('join-room-submit'),
    waitingRoom: document.getElementById('waiting-room'),
    displayRoomCode: document.getElementById('display-room-code'),
    playerList: document.getElementById('player-list'),
    chatMessages: document.getElementById('chat-messages'),
    chatInput: document.getElementById('chat-input'),
    sendMessageBtn: document.getElementById('send-message-btn'),
    startGameBtn: document.getElementById('start-game'),
    leaveRoomBtn: document.getElementById('leave-room'),
    globalLeaderboard: document.getElementById('global-leaderboard'),
    leaderboardList: document.getElementById('leaderboard-list'),
    leaderboardCategory: document.getElementById('leaderboard-category'),
    leaderboardTime: document.getElementById('leaderboard-time'),
    backFromLeaderboardBtn: document.getElementById('back-from-leaderboard'),
    onlineIndicators: document.getElementById('online-indicators'),
    playerScores: document.getElementById('player-scores'),
    // Oyun içi chat elementleri
    gameChatMessages: document.getElementById('game-chat-messages'),
    gameChatInput: document.getElementById('game-chat-input'),
    gameSendMessageBtn: document.getElementById('game-send-message-btn'),
    // Kazanan ekranı elementleri
    winnerScreen: document.getElementById('winner-screen'),
    winnerName: document.getElementById('winner-name'),
    winnerScore: document.getElementById('winner-score'),
    allPlayerResults: document.getElementById('all-player-results'),
    playAgainBtn: document.getElementById('play-again-btn'),
    backToMenuBtn: document.getElementById('back-to-menu-btn'),

    // Durum değişkenleri
    currentRoom: null,
    isHost: false,
    players: [],
    username: '',
    userId: '',
    roomRef: null,
    gameStarted: false,
    currentGameData: null,
    localAnswers: [],
    
    // Constants
    CHARACTERS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    
    // Başlat
    init: function() {
        // Anonim giriş özelliği (gerçek uygulama için daha güçlü kimlik doğrulama ekleyebilirsiniz)
        this.anonymousLogin();
        
        // Buton event listenerları
        this.addEventListeners();
        
        // Kategori seçeneklerini doldur
        this.populateCategoryOptions();
        
        // Chat kuralları ve moderasyon ayarlarını yükle
        this.initChatModeration();
        
        // Arayüz metinlerini çevir
        this.updateUITexts();
        
        // Dil değişikliği olayını dinle
        document.addEventListener('languageChanged', () => {
            this.updateUITexts();
            if (this.onlineOptions && this.onlineOptions.style.display !== 'none') {
                this.listRooms();
            }
        });
    },
    
    // Arayüz metinlerini güncelle
    updateUITexts: function() {
        // Mevcut dili sorgula
        let currentLang = window.quizApp && window.quizApp.currentLanguage ? window.quizApp.currentLanguage : 'tr';
        
        console.log("Online Game: Updating UI texts for language:", currentLang);
        
        // Sayfadaki data-i18n özniteliğine sahip tüm elementleri güncelle
        const translateElements = document.querySelectorAll('[data-i18n]');
        translateElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key) {
                // languages sisteminden çeviriyi al
                let translatedText = '';
                if (window.languages && window.languages[currentLang] && window.languages[currentLang][key]) {
                    translatedText = window.languages[currentLang][key];
                }
                
                if (translatedText) {
                    element.textContent = translatedText;
                }
            }
        });
        
        // Spesifik online-game elementlerini güncelle
        // Buton metinlerini güncelle
        const updateText = (element, key) => {
            if (!element) return;
            let text = '';
            if (window.languages && window.languages[currentLang] && window.languages[currentLang][key]) {
                text = window.languages[currentLang][key];
            }
            if (text) element.textContent = text;
        };
        
        updateText(this.createRoomBtn, 'create_room');
        updateText(this.joinRoomBtn, 'join_room');
        updateText(this.backToMainBtn, 'back_to_menu');
        updateText(this.createRoomSubmit, 'create');
        updateText(this.joinRoomSubmit, 'join');
        updateText(this.startGameBtn, 'start_game');
        updateText(this.leaveRoomBtn, 'leave_room');
        updateText(this.backFromLeaderboardBtn, 'back');
        updateText(this.playAgainBtn, 'playAgain');
        updateText(this.backToMenuBtn, 'back_to_menu');
        // Mesaj gönderme butonlarında sadece ikon kullanılacağı için metin eklemeyi kaldırdık
        // updateText(this.sendMessageBtn, 'send_message');
        // updateText(this.gameSendMessageBtn, 'send_message');
        updateText(this.chatRulesBtn, 'chat_rules');
        updateText(this.gameChatRulesBtn, 'chat_rules');
        updateText(this.acceptRulesBtn, 'accept_rules');
        updateText(this.acceptChatTermsBtn, 'chat_consent');
        updateText(this.gameAcceptChatTermsBtn, 'chat_consent');
        
        // Label ve başlıkları güncelle
        const updateElementBySelector = (selector, key) => {
            const element = document.querySelector(selector);
            if (element) updateText(element, key);
        };
        
        updateElementBySelector('label[for="room-name"]', 'room_name');
        updateElementBySelector('label[for="room-code"]', 'room_code');
        updateElementBySelector('#waiting-room h2', 'waiting_players');
        updateElementBySelector('#display-room-code-title', 'room_code');
        updateElementBySelector('#player-list-title', 'players');
        updateElementBySelector('#chat-title', 'chat');
        updateElementBySelector('#game-chat-title', 'game_chat');
        updateElementBySelector('#online-game-options h2', 'online_mode');
        updateElementBySelector('#room-creation h3', 'create_room');
        updateElementBySelector('#room-join h3', 'join_room');
        updateElementBySelector('#global-leaderboard h2', 'global_leaderboard');
        
        // Lider tablosu filtreleme seçeneklerini güncelle
        if (this.leaderboardCategory) {
            const options = this.leaderboardCategory.options;
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                if (option.hasAttribute('data-i18n')) {
                    const key = option.getAttribute('data-i18n');
                    updateText(option, key);
                }
            }
        }
        
        if (this.leaderboardTime) {
            const options = this.leaderboardTime.options;
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                if (option.hasAttribute('data-i18n')) {
                    const key = option.getAttribute('data-i18n');
                    updateText(option, key);
                }
            }
        }
        
        // Bu metot her dil değişikliğinde çağrılmalı
        // Dil değiştiğinde oda listesi ekranı açıksa tekrar yükle
        if (this.onlineOptions && this.onlineOptions.style.display !== 'none') {
            this.listRooms();
        }
    },
    
    // Chat kuralları ve KVKK/GDPR ayarları
    initChatModeration: function() {
        // Chat kuralları ve KVKK özellikleri için elementleri tanımla
        this.chatRulesBtn = document.getElementById('chat-rules-btn');
        this.gameChatRulesBtn = document.getElementById('game-chat-rules-btn');
        this.closeChatRulesBtn = document.getElementById('close-chat-rules');
        this.acceptRulesBtn = document.getElementById('accept-rules-btn');
        this.acceptChatTermsBtn = document.getElementById('accept-chat-terms');
        this.gameAcceptChatTermsBtn = document.getElementById('game-accept-chat-terms');
        this.chatPolicyLink = document.getElementById('chat-policy-link');
        this.gameChatPolicyLink = document.getElementById('game-chat-policy-link');
        this.chatConsentNotice = document.getElementById('chat-consent-notice');
        this.gameChatConsentNotice = document.getElementById('game-chat-consent-notice');
        this.chatRulesModal = document.getElementById('chat-rules-modal');
        this.reportMessageBtn = document.getElementById('report-message-btn');
        this.blockUserBtn = document.getElementById('block-user-btn');
        this.gameReportMessageBtn = document.getElementById('game-report-message-btn');
        this.gameBlockUserBtn = document.getElementById('game-block-user-btn');
        
        // Kullanıcının chat onayı verip vermediğini kontrol et
        this.chatConsented = localStorage.getItem('chatConsented') === 'true';
        
        // Küfür filtresi için yasaklı kelimeler
        this.blockedWords = [
            // Türkçe küfür ve argo kelimeler
            'amk', 'aq', 'sik', 'sikerim', 'sikeyim', 'götünü', 'göt', 'götveren', 'oç', 'orospu', 'piç', 
            'pezevenk', 'mal', 'gerizekalı', 'salak', 'yavşak', 'ibne', 'ananı', 'bacını', 'kaltak', 
            'yarrak', 'taşak', 'amcık', 'puşt', 'bok', 'boktan', 'hassiktir', 'siktir', 'dalyarak',
            // Genişletilmiş Türkçe listesi
            'amına', 'amını', 'amcığı', 'mk', 'sg', 'sktir', 'sktr', 'sktrgit', 'sikik', 'siksok', 'sikiş',
            'sikti', 'sikmiş', 'sikiyim', 'sikicem', 'skcem', 'sikim', 'götlek', 'götü', 'götüne', 'göte',
            'amkik', 'amkoduğum', 'amkodumun', 'aminakoyim', 'aminakoyayim', 'amnskm', 'anasını', 'ananıskm',
            'ananısikim', 'ananısikeyim', 'orosbu', 'orospuçocuğu', 'orospucocugu', 'orospucocu', 'orosbucocu',
            'orospunun', 'orospunun', 'oçu', 'ocun', 'piçin', 'picin', 'pici', 'piçi', 'pıç', 'yarrağı', 'yarrağım',
            'taşağım', 'dallama', 'gavat', 'kaşar', 'kancık', 'sürtük', 'sülük', 'avradını', 'avradini', 'avradini',
            'yarak', 'yrrk', 'amq', 'awk', 'got', 'ak', 'pic', 'oc', 'yarak', 'gerizeka', 'salakça', 'salağı',
            'beyinsiz', 'angut', 'andaval', 'aptal', 'dangalak', 'gerzek', 'hıyar', 'hıyarto', 'süt', 'sikik',
            'sikiş', 'skş', 'embesil', 'ahlaksız', 'götlek', 'haysiyetsiz', 'namussuz', 'serefsiz', 'şerefsiz',
            'ırzını', 'ırzına', 'fahişe', 'fahise', 'orrrospu', 'kahbe', 'kahpe', 'kerhaneci', 'gavur', 'gâvur',
            'eşoğlueşek', 'eşşoğlueşek', 'eshek', 'eşek', 'essek', 'zıkkım', 'zikkimlanmak', 'zıkkımlanmak',
            'manyak', 'sokuk', 'gebermek', 'geber', 'gebertmek', 'geberesi', 'it', 'godoş', 'godoz', 'sülük',
            'sürtükler', 'moruk', 'am', 'a.m', 'a m', 'a-m', 'g.t', 'g t', 'g-t', 's.k', 's k', 's-k',
            'osbir', 'osbirci', '31ci', 'orrrospu', 'sürtük', 'surtuk', 'surt', 'attırmak', 'bosalmak', 'boşalmak',
            'cibiliyetsiz', 'çükümün', 'domalık', 'dondan', 'düdük', 'qahpe', 'qahbe', 'sakso', 'saxo', 'sekso',
            's1ker1m', 's1km', 's1kmek', 's1kt1r', 's1ktr', 'skrm', 'orsvbu', 'oruspu', 'kemik', 'kerhane',
            

            // İngilizce küfür ve argo kelimeler
            'fuck', 'fucking', 'shit', 'ass', 'asshole', 'bitch', 'bastard', 'dick', 'motherfucker',
            'cunt', 'pussy', 'cock', 'bullshit', 'wtf', 'stfu', 'slut', 'whore',
            // Genişletilmiş İngilizce listesi
            'fck', 'fuk', 'fuking', 'fking', 'fcking', 'fuckng', 'sht', 'sh1t',
            'azz', 'azzhole', 'bich', 'biatch',
            'bytch', 'b1tch', 'dck', 'dik', 'dic',
            'mofo', 'mf', 'mothafucka', 'muthafucker', 'kunt', 
            'pussi', 'pusi', 'pusy', 'puss', 'cok',
            'bs', 'bull', 'b.s.', 'b.s', 'bullsh', 'bullsht', 'boolshit',
            'shutup', 'shut up', 'shut it', 'shut the f up', 'shut tf up', 
            'sloot', 'slt', 'hoe', 'ho', 'hoes', 'hoez',
            'negro', 'nigga', 'nigger', 'n1gga', 'n1gg3r', 'n1gger',
            'bimbo', 'bimb0', 'homo', 'fag', 'fagg', 'faggot', 'f4ggot',
            'retard', 'retarded', 'r3tard', 'dumbass',
            'jerk', 'jerkoff', 'jackoff', 'jackass', 'jerkwad', 'idiot', 'douchebag',
            'douche', 'dumbfuck', 'dumb fuck', 'bitchass', 'bitch ass',
            'stupid', 'stpd', 'moron', 'imbecile', 'dafuq', 'da fuq',
            'turd', 'twat', 'thot', 'fudge', 'frick', 'freak', 'poop', 'piss', 'pee',
            'damn', 'hell', 'omfg', 'ffs', 'fml', 'fmylife', 'gtfo', 'lmfao', 'lmao', 'ctfu', 'sob', 'pos',
            'pita', 'pita', 'gtfoh', 'btch', 'biatch', 'bytch', 'smdh', 'af', 'a f', 'a-f', 'aaf',
            'prick', 'pr1ck', 'arse', 'spastic', 'queer', 'qu33r', 'suicide',
            'sui', 'kys', 'k y s', 'k.y.s', 'kill yourself', 'cum', 'jizz',
            'boob', 'boobs', 'b00b', 'b00bs', 'tit', 'tits',
            // Yıldız içeren maskelenmiş versiyonlar - bunlar ayrı işlenecek
            'f***', 'f**k', 's***', 'sh**', 'a**', 'a**hole', 'b***h', 'b**ch', 'd**k', 'd*ck',
            'p***y', 'p**sy', 'c**k', 'c*ck', 'c**t', 'c*nt', 'bullsh**', 'wh**e', 'wh*re', 
            'n***a', 'n**ga', 'n***er', 'n**ger', 'f***ot', 'f**got', 'r**ard', 'r*tard',
            'dumba**', 'dumbf**k', 'dumba*s', 'b**ch', 'st**id', 'm**on', 'mor*n', 'imb**ile',
            't**d', 'tw*t', 'th*t', 'pr**k', 'pr*ck', 'sp**tic', 'sp*stic', 'qu**r',
            'suic**e', 'k*** yourself', 'c*m', 'j**z', 'j*zz', 'b**b', 'b**bs', 't*t', 't*ts'
        ];
        
        // Engellenmiş kullanıcılar listesi
        this.blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
        
        // Bildirilmiş mesajlar listesi
        this.reportedMessages = JSON.parse(localStorage.getItem('reportedMessages') || '[]');
        
        // Seçilmiş mesaj ve kullanıcı
        this.selectedMessage = null;
        this.selectedUser = null;
        
        // Event dinleyiciler
        this.addChatModerationEventListeners();
        
        // Chat kutularının başlangıç durumunu ayarla
        this.updateChatInputStates();
    },
    
    // Chat moderasyonu için event dinleyiciler ekle
    addChatModerationEventListeners: function() {
        // Kurallar butonları
        if (this.chatRulesBtn) {
            this.chatRulesBtn.addEventListener('click', () => this.showChatRules());
        }
        
        if (this.gameChatRulesBtn) {
            this.gameChatRulesBtn.addEventListener('click', () => this.showChatRules());
        }
        
        // Kapat butonu
        if (this.closeChatRulesBtn) {
            this.closeChatRulesBtn.addEventListener('click', () => this.hideChatRules());
        }
        
        // Kuralları kabul et butonu
        if (this.acceptRulesBtn) {
            this.acceptRulesBtn.addEventListener('click', () => {
                this.hideChatRules();
                this.acceptChatConsent();
            });
        }
        
        // Chat onay butonları
        if (this.acceptChatTermsBtn) {
            this.acceptChatTermsBtn.addEventListener('click', () => this.acceptChatConsent());
        }
        
        if (this.gameAcceptChatTermsBtn) {
            this.gameAcceptChatTermsBtn.addEventListener('click', () => this.acceptChatConsent());
        }
        
        // Gizlilik politikası linkleri
        if (this.chatPolicyLink) {
            this.chatPolicyLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showChatRules();
            });
        }
        
        if (this.gameChatPolicyLink) {
            this.gameChatPolicyLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showChatRules();
            });
        }
        
        // Rapor ve engelleme butonları
        if (this.reportMessageBtn) {
            this.reportMessageBtn.addEventListener('click', () => this.showReportDialog());
        }
        
        if (this.blockUserBtn) {
            this.blockUserBtn.addEventListener('click', () => this.showBlockDialog());
        }
        
        if (this.gameReportMessageBtn) {
            this.gameReportMessageBtn.addEventListener('click', () => this.showReportDialog());
        }
        
        if (this.gameBlockUserBtn) {
            this.gameBlockUserBtn.addEventListener('click', () => this.showBlockDialog());
        }
        
        // Chat mesajları tıklama işlemleri
        if (this.chatMessages) {
            this.chatMessages.addEventListener('click', (e) => {
                if (e.target.closest('.chat-message')) {
                    this.selectMessage(e.target.closest('.chat-message'));
                }
            });
        }
        
        if (this.gameChatMessages) {
            this.gameChatMessages.addEventListener('click', (e) => {
                if (e.target.closest('.chat-message')) {
                    this.selectMessage(e.target.closest('.chat-message'));
                }
            });
        }
    },
    
    // Chat kutusunun durumunu güncelle (onay verilmişse etkinleştir)
    updateChatInputStates: function() {
        if (this.chatConsented) {
            // Onay verilmişse chat kutusu ve gönderme butonu etkinleştirilir
            if (this.chatInput) {
                this.chatInput.disabled = false;
                this.sendMessageBtn.disabled = false;
            }
            
            if (this.gameChatInput) {
                this.gameChatInput.disabled = false;
                this.gameSendMessageBtn.disabled = false;
            }
            
            // Onay bilgilendirmeleri gizlenir
            if (this.chatConsentNotice) {
                this.chatConsentNotice.style.display = 'none';
            }
            
            if (this.gameChatConsentNotice) {
                this.gameChatConsentNotice.style.display = 'none';
            }
        } else {
            // Onay verilmemişse chat kutusu ve gönderme butonu devre dışı bırakılır
            if (this.chatInput) {
                this.chatInput.disabled = true;
                this.sendMessageBtn.disabled = true;
            }
            
            if (this.gameChatInput) {
                this.gameChatInput.disabled = true;
                this.gameSendMessageBtn.disabled = true;
            }
            
            // Onay bilgilendirmeleri gösterilir
            if (this.chatConsentNotice) {
                this.chatConsentNotice.style.display = 'block';
            }
            
            if (this.gameChatConsentNotice) {
                this.gameChatConsentNotice.style.display = 'block';
            }
        }
    },
    
    // Chat onayını ver
    acceptChatConsent: function() {
        this.chatConsented = true;
        localStorage.setItem('chatConsented', 'true');
        this.updateChatInputStates();
        this.showToast('Sohbet kurallarını kabul ettiniz. Artık mesaj gönderebilirsiniz.', 'success');
    },
    
    // Chat kuralları modalını göster
    showChatRules: function() {
        if (this.chatRulesModal) {
            this.chatRulesModal.classList.add('show');
        }
    },
    
    // Chat kuralları modalını gizle
    hideChatRules: function() {
        if (this.chatRulesModal) {
            this.chatRulesModal.classList.remove('show');
        }
    },
    
    // Bir mesajı seç (bildir veya engelle için)
    selectMessage: function(messageElement) {
        // Daha önce seçili olan mesajın vurgulaması kaldırılır
        const previousSelected = document.querySelector('.chat-message.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        
        // Yeni mesaj seçilir ve vurgulanır
        messageElement.classList.add('selected');
        
        // Mesaj bilgilerini sakla
        this.selectedMessage = {
            id: messageElement.dataset.messageId,
            text: messageElement.querySelector('.message-text')?.textContent || '',
            senderId: messageElement.dataset.senderId,
            senderName: messageElement.dataset.senderName
        };
        
        this.selectedUser = {
            id: messageElement.dataset.senderId,
            name: messageElement.dataset.senderName
        };
        
        // Bildir ve engelle butonlarının görünürlüğü güncellenir
        if (this.reportMessageBtn) {
            this.reportMessageBtn.disabled = false;
        }
        
        if (this.blockUserBtn) {
            this.blockUserBtn.disabled = this.selectedUser.id === this.userId;
        }
        
        if (this.gameReportMessageBtn) {
            this.gameReportMessageBtn.disabled = false;
        }
        
        if (this.gameBlockUserBtn) {
            this.gameBlockUserBtn.disabled = this.selectedUser.id === this.userId;
        }
    },
    
    // Mesaj bildirme dialog'unu göster
    showReportDialog: function() {
        if (!this.selectedMessage) return;
        
        const confirm = window.confirm(`"${this.selectedMessage.text}" mesajını ${this.selectedMessage.senderName} kullanıcısından bildirmek istediğinizden emin misiniz? Kurallara aykırı mesajlar moderatörler tarafından değerlendirilecektir.`);
        
        if (confirm) {
            this.reportMessage(this.selectedMessage.id, this.selectedMessage.senderId);
        }
    },
    
    // Kullanıcı engelleme dialog'unu göster
    showBlockDialog: function() {
        if (!this.selectedUser || this.selectedUser.id === this.userId) return;
        
        const confirm = window.confirm(`${this.selectedUser.name} kullanıcısını engellemek istediğinizden emin misiniz? Engellenen kullanıcının mesajları sizin için görünmeyecektir.`);
        
        if (confirm) {
            this.blockUser(this.selectedUser.id, this.selectedUser.name);
        }
    },
    
    // Mesajı bildir
    reportMessage: function(messageId, senderId) {
        if (!messageId || !senderId) return;
        
        // Bildirilen mesajı veritabanına ekle
        if (this.roomRef) {
            this.roomRef.child('reportedMessages').push({
                messageId: messageId,
                reporterId: this.userId,
                reporterName: this.username,
                reportedUserId: senderId,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                reason: 'inappropriate_content'
            });
        }
        
        // Yerel olarak da bildirilen mesajlar listesine ekle
        this.reportedMessages.push({
            messageId: messageId,
            timestamp: Date.now()
        });
        
        localStorage.setItem('reportedMessages', JSON.stringify(this.reportedMessages));
        
        // Mesaj elementini güncelle
        const messageElements = document.querySelectorAll(`[data-message-id="${messageId}"]`);
        messageElements.forEach(element => {
            element.classList.add('message-reported');
        });
        
        this.showToast('Mesaj bildirildi. Teşekkür ederiz.', 'info');
    },
    
    // Kullanıcıyı engelle
    blockUser: function(userId, userName) {
        if (!userId || userId === this.userId) return;
        
        // Engellenmiş kullanıcılar listesine ekle
        this.blockedUsers.push({
            id: userId,
            name: userName,
            timestamp: Date.now()
        });
        
        localStorage.setItem('blockedUsers', JSON.stringify(this.blockedUsers));
        
        // Kullanıcının mevcut mesajlarını gizle
        const userMessages = document.querySelectorAll(`[data-sender-id="${userId}"]`);
        userMessages.forEach(element => {
            element.classList.add('message-blocked');
        });
        
        this.showToast(`${userName} kullanıcısı engellendi.`, 'info');
    },
    
    // Mesajı küfür/hakaret içeriğine karşı kontrol et
    checkMessageContent: function(text) {
        if (!text) return { isClean: true, text: text };
        
        // Temiz mesajlar listesi - bu kelimeler filtrelenmeyecek
        const safeWords = ['merhaba', 'selam', 'hello', 'hi', 'good', 'morning', 'evening', 'night', 'day'];
        
        // Eğer mesaj sadece temiz bir kelimeden oluşuyorsa, hiç işleme sokmadan geçelim
        const trimmedText = text.trim().toLowerCase();
        if (safeWords.includes(trimmedText)) {
            return { isClean: true, text: text };
        }
        
        let isClean = true;
        let filteredText = text;
        let lowerText = text.toLowerCase();
        
        // E-posta adreslerini filtrele
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
        if (emailRegex.test(text)) {
            isClean = false;
            filteredText = filteredText.replace(emailRegex, match => '***@***.***');
        }
        
        // Telefon numaralarını filtrele (Farklı formatlar için)
        // 1. Format: 05XX XXX XX XX veya 05XXXXXXXX
        const turkishMobileRegex = /(\b05[0-9]{2}[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}\b)/g;
        if (turkishMobileRegex.test(text)) {
            isClean = false;
            filteredText = filteredText.replace(turkishMobileRegex, '*** *** ** **');
        }
        
        // 2. Format: +90 5XX XXX XX XX veya +905XXXXXXXX
        const turkishFullMobileRegex = /(\+90[\s-]?5[0-9]{2}[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2})/g;
        if (turkishFullMobileRegex.test(text)) {
            isClean = false;
            filteredText = filteredText.replace(turkishFullMobileRegex, '+90 *** *** ** **');
        }
        
        // 3. Format: 0(XXX) XXX XX XX veya (XXX) XXX XX XX (Sabit hatlar dahil)
        const parenthesesPhoneRegex = /(\b0?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}\b)/g;
        if (parenthesesPhoneRegex.test(text)) {
            isClean = false;
            filteredText = filteredText.replace(parenthesesPhoneRegex, '(***) *** ** **');
        }
        
        // 4. Genel numara formatı: herhangi bir 8-15 basamaklı sayı dizisi
        const generalNumberRegex = /\b\d{8,15}\b/g;
        if (generalNumberRegex.test(text)) {
            isClean = false;
            filteredText = filteredText.replace(generalNumberRegex, match => '*'.repeat(match.length));
        }
        
        // Unicode karakterlerin ve rakamların harf olarak kullanıldığı durumlar için normalizasyon
        const normalizeText = (txt) => {
            return txt.replace(/1|ı/g, 'i')
                      .replace(/3|ε|è|é|ê|ë|ē|ė|ę/g, 'e')
                      .replace(/4|@|ä|à|á|â|ã|å|ā/g, 'a')
                      .replace(/5|\$/g, 's')
                      .replace(/0|ö|ò|ó|ô|õ|ø|ō|ő/g, 'o')
                      .replace(/ü|ù|ú|û|ū|ű/g, 'u')
                      .replace(/¢|©|ç|ć|č/g, 'c')
                      .replace(/\$/g, 's')
                      .replace(/!/g, 'i')
                      .replace(/\*/g, '')
                      .replace(/\+/g, 't');
        };
        
        // Normalize metin üzerinde çalışalım
        const normalizedText = normalizeText(lowerText);
        
        // Gelişmiş küfür/hakaret kontrolü
        this.blockedWords.forEach(word => {
            // Kelime 2 harften kısaysa atla (çok fazla yanlış pozitif olabilir)
            if (word.length <= 2) return;
            
            const lowerWord = word.toLowerCase();
            const normalizedWord = normalizeText(lowerWord);
            
            // Güvenli kelime kontrolü - bloklanan kelime güvenli bir kelimenin parçasıysa atla
            let isSafeWordPart = false;
            for (const safeWord of safeWords) {
                if (safeWord.includes(lowerWord) || normalizeText(safeWord).includes(normalizedWord)) {
                    isSafeWordPart = true;
                    break;
                }
            }
            if (isSafeWordPart) return;
            
            // Yıldız (*) karakteri içeren kelimeler için özel işlem yapalım
            const hasAsterisk = lowerWord.includes('*');
            
            // Tam kelime kontrolü - yıldız içeren kelimeler için RegExp kullanmayalım
            let wordRegex;
            try {
                // Yıldız içeren kelimeler için düzenli ifade oluşturmadan kaçınalım
                if (hasAsterisk) {
                    // Yıldız içeren kelimeyi doğrudan içerip içermediğini kontrol edelim
                    if (lowerText.includes(lowerWord)) {
                        isClean = false;
                        // Kelimeyi yıldızla değiştirelim
                        filteredText = filteredText.replace(new RegExp(lowerWord.replace(/\*/g, '\\*'), 'gi'), 
                            match => '*'.repeat(match.length));
                    }
                } else {
                    // Normal kelimeler için düzenli ifade kullanabiliriz
                    wordRegex = new RegExp('\\b' + lowerWord + '\\b', 'gi');
                    
                    // Kelime içinde kontrolü 
                    const partialRegex = new RegExp('\\b' + lowerWord + '\\b', 'gi');
                    
                    // Normalize edilmiş kelime kontrolü
                    const normalizedRegex = new RegExp('\\b' + normalizedWord + '\\b', 'gi');
                    
                    // Boşluksuz yazılmış küfürler için kontrol - tam kelime eşleşmesi arayalım
                    if (
                        wordRegex.test(text) || 
                        (normalizedText.match(new RegExp('\\b' + normalizedWord + '\\b', 'gi')))
                    ) {
                        isClean = false;
                        
                        // Küfür içeren metni yıldızlarla değiştir
                        filteredText = filteredText.replace(partialRegex, match => '*'.repeat(match.length));
                        
                        // Normalize edilmiş metni de kontrol et
                        const matches = normalizedText.match(normalizedRegex);
                        if (matches) {
                            matches.forEach(match => {
                                // Orijinal metinde bu eşleşmeye karşılık gelen yeri bul
                                const matchIndex = normalizedText.indexOf(match);
                                if (matchIndex !== -1) {
                                    // Orijinal metinde aynı konumda ve uzunlukta olan metni maskele
                                    filteredText = filteredText.substring(0, matchIndex) + 
                                                  '*'.repeat(match.length) + 
                                                  filteredText.substring(matchIndex + match.length);
                                }
                            });
                        }
                    }
                }
            } catch (error) {
                console.warn("Küfür filtreleme regex hatası:", error, "Kelime:", word);
                // Hata durumunda basit bir içerik kontrolü yapalım
                if (lowerText.includes(lowerWord)) {
                    isClean = false;
                    // Basit string değiştirme yöntemiyle maskeleme yapalım
                    let index = lowerText.indexOf(lowerWord);
                    while (index !== -1) {
                        filteredText = filteredText.substring(0, index) + 
                                       '*'.repeat(lowerWord.length) + 
                                       filteredText.substring(index + lowerWord.length);
                        // Bir sonraki eşleşmeyi bul
                        lowerText = filteredText.toLowerCase();
                        index = lowerText.indexOf(lowerWord, index + 1);
                    }
                }
            }
        });
        
        // Özel karakterlerle yazılmış küfürler için ek kontrol (örn: s!ker!m, f*ck, vb.)
        const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g;
        const textWithoutSpecialChars = lowerText.replace(specialCharsRegex, '');
        
        this.blockedWords.forEach(word => {
            if (word.length <= 2) return; // Çok kısa kelimeleri atla
            
            const lowerWord = word.toLowerCase();
            const normalizedBadWord = normalizeText(lowerWord);
            
            // Güvenli kelime kontrolü - bloklanan kelime güvenli bir kelimenin parçasıysa atla
            let isSafeWordPart = false;
            for (const safeWord of safeWords) {
                if (safeWord.includes(lowerWord) || normalizeText(safeWord).includes(normalizedBadWord)) {
                    isSafeWordPart = true;
                    break;
                }
            }
            if (isSafeWordPart) return;
            
            // Kelimeyi düzenli ifadelerle kontrol etmek yerine, kelimeler arasında kontrol edelim
            const wordsWithoutSpecialChars = textWithoutSpecialChars.split(/\s+/);
            let foundBadWord = false;
            
            for (const wordWithoutSpecialChars of wordsWithoutSpecialChars) {
                if (wordWithoutSpecialChars === lowerWord || 
                    normalizeText(wordWithoutSpecialChars) === normalizedBadWord) {
                    foundBadWord = true;
                    break;
                }
            }
            
            if (foundBadWord) {
                isClean = false;
                
                // Özel karakterlerle maskelenmiş küfürleri bul ve yıldızla
                const chars = [...text];
                let potentialMatch = '';
                let startIndex = -1;
                
                for (let i = 0; i < chars.length; i++) {
                    const char = chars[i].toLowerCase();
                    if (char.match(/[a-zğüşıöçâêîôûéèà0-9]/) || char.match(specialCharsRegex)) {
                        if (startIndex === -1) startIndex = i;
                        potentialMatch += normalizeText(char).replace(specialCharsRegex, '');
                        
                        if (
                            potentialMatch === lowerWord || 
                            potentialMatch === normalizedBadWord
                        ) {
                            const endIndex = i + 1;
                            const length = endIndex - startIndex;
                            filteredText = filteredText.substring(0, startIndex) + 
                                          '*'.repeat(length) + 
                                          filteredText.substring(endIndex);
                            potentialMatch = '';
                            startIndex = -1;
                        }
                    } else {
                        potentialMatch = '';
                        startIndex = -1;
                    }
                }
            }
        });
        
        // Ters yazılmış küfürleri kontrol et
        const reversedText = lowerText.split('').reverse().join('');
        const reversedNormalizedText = normalizeText(reversedText);
        
        this.blockedWords.forEach(word => {
            if (word.length <= 2) return; // Çok kısa kelimeleri atla
            
            const lowerWord = word.toLowerCase();
            const reversedWord = lowerWord.split('').reverse().join('');
            const normalizedReversedWord = normalizeText(reversedWord);
            
            // Güvenli kelime kontrolü - bloklanan kelime güvenli bir kelimenin parçasıysa atla
            let isSafeWordPart = false;
            for (const safeWord of safeWords) {
                const reversedSafeWord = safeWord.split('').reverse().join('');
                if (reversedSafeWord.includes(reversedWord) || 
                    normalizeText(reversedSafeWord).includes(normalizedReversedWord)) {
                    isSafeWordPart = true;
                    break;
                }
            }
            if (isSafeWordPart) return;
            
            // Tam kelime olarak ters yazılmış küfürü kontrol et
            const reversedWords = reversedText.split(/\s+/);
            let foundBadWord = false;
            
            for (const revWord of reversedWords) {
                if (revWord === reversedWord || normalizeText(revWord) === normalizedReversedWord) {
                    foundBadWord = true;
                    break;
                }
            }
            
            if (foundBadWord) {
                isClean = false;
                
                // Ters yazılmış küfürü bul
                const index = reversedText.indexOf(reversedWord);
                if (index !== -1) {
                    // Orijinal metinde aynı konumu bul (sondan başa doğru)
                    const originalIndex = text.length - index - reversedWord.length;
                    filteredText = filteredText.substring(0, originalIndex) + 
                                  '*'.repeat(reversedWord.length) + 
                                  filteredText.substring(originalIndex + reversedWord.length);
                }
            }
        });
        
        // Tekrar edilen harfli küfürleri kontrol et (örn: siiiiiktir, f*******ck)
        const compressRepeats = (str) => {
            return str.replace(/(.)\1+/g, '$1');
        };
        
        const compressedText = compressRepeats(lowerText);
        const normalizedCompressedText = normalizeText(compressedText);
        
        this.blockedWords.forEach(word => {
            if (word.length <= 2) return;
            
            const lowerWord = word.toLowerCase();
            const compressedWord = compressRepeats(lowerWord);
            const normalizedCompressedWord = normalizeText(compressedWord);
            
            // Güvenli kelime kontrolü - bloklanan kelime güvenli bir kelimenin parçasıysa atla
            let isSafeWordPart = false;
            for (const safeWord of safeWords) {
                const compressedSafeWord = compressRepeats(safeWord);
                if (compressedSafeWord.includes(compressedWord) || 
                    normalizeText(compressedSafeWord).includes(normalizedCompressedWord)) {
                    isSafeWordPart = true;
                    break;
                }
            }
            if (isSafeWordPart) return;
            
            // Tam kelime olarak eşleşmeyi kontrol et
            const compressedWords = compressedText.split(/\s+/);
            let foundBadWord = false;
            
            for (const cmpWord of compressedWords) {
                if (cmpWord === compressedWord || normalizeText(cmpWord) === normalizedCompressedWord) {
                    foundBadWord = true;
                    break;
                }
            }
            
            if (foundBadWord) {
                isClean = false;
                
                // Tekrar eden harflerle yazılmış küfürü bul
                let currentText = lowerText;
                let currentIndex = 0;
                
                while (currentIndex < currentText.length) {
                    let foundMatch = false;
                    let matchStart = -1;
                    let matchEnd = -1;
                    
                    // İleri doğru kontrol et
                    for (let i = currentIndex; i < currentText.length; i++) {
                        const subText = compressRepeats(currentText.substring(currentIndex, i + 1));
                        const normalizedSubText = normalizeText(subText);
                        
                        if (
                            subText === compressedWord || 
                            normalizedSubText === normalizedCompressedWord
                        ) {
                            foundMatch = true;
                            matchStart = currentIndex;
                            matchEnd = i + 1;
                            break;
                        }
                    }
                    
                    if (foundMatch) {
                        const matchLength = matchEnd - matchStart;
                        filteredText = filteredText.substring(0, matchStart) + 
                                      '*'.repeat(matchLength) + 
                                      filteredText.substring(matchEnd);
                        currentIndex = matchEnd;
                    } else {
                        currentIndex++;
                    }
                }
            }
        });
        
        return { isClean, text: filteredText };
    },
    
    // Anonim giriş
    anonymousLogin: function() {
        // Önce oturum durumunu kontrol et
        firebase.auth().onAuthStateChanged(user => {
            // Eğer kullanıcı zaten giriş yapmış ve anonim değilse, anonim giriş yapmayı atla
            if (user && !user.isAnonymous) {
                console.log('Kullanıcı zaten normal hesapla giriş yapmış, anonim giriş atlanıyor.');
                this.userId = user.uid;
                this.username = user.displayName || user.email || 'Kullanıcı';
                console.log('Kullanıcı ID:', this.userId, 'Kullanıcı adı:', this.username);
                return;
            }
            
            // Kullanıcı giriş yapmamış veya anonim ise, anonim giriş yap
            if (!user) {
                auth.signInAnonymously()
                    .then(() => {
                        console.log('Anonim giriş başarılı');
                        
                        // Kullanıcı oturumunu dinle
                        auth.onAuthStateChanged(anonUser => {
                            if (anonUser) {
                                this.userId = anonUser.uid;
                                // Kullanıcı adını local storage'dan al veya yeni oluştur
                                const savedUsername = localStorage.getItem('quizUsername');
                                if (savedUsername) {
                                    this.username = savedUsername;
                                } else {
                                    this.username = 'Oyuncu_' + Math.floor(Math.random() * 1000);
                                    localStorage.setItem('quizUsername', this.username);
                                }
                                console.log('Kullanıcı ID:', this.userId, 'Kullanıcı adı:', this.username);
                            }
                        });
                    })
                    .catch(error => {
                        console.error('Anonim giriş hatası:', error);
                    });
            } else if (user.isAnonymous) {
                // Zaten anonim giriş yapmışsa, kullanıcı bilgilerini ayarla
                this.userId = user.uid;
                const savedUsername = localStorage.getItem('quizUsername');
                if (savedUsername) {
                    this.username = savedUsername;
                } else {
                    this.username = 'Oyuncu_' + Math.floor(Math.random() * 1000);
                    localStorage.setItem('quizUsername', this.username);
                }
                console.log('Mevcut anonim kullanıcı:', this.userId, 'Kullanıcı adı:', this.username);
            }
        });
    },
    
    // Event listener'ları ekle
    addEventListeners: function() {
        // Ana menü butonları
        this.singlePlayerBtn.addEventListener('click', () => {
            this.mainMenu.style.display = 'none';
            window.quizApp.categorySelectionElement.style.display = 'block';
        });
        
        this.multiPlayerBtn.addEventListener('click', () => {
            this.mainMenu.style.display = 'none';
            this.onlineOptions.style.display = 'block';
            // Mevcut odaları listele
            this.listRooms();
        });
        
        this.leaderboardBtn.addEventListener('click', () => {
            this.mainMenu.style.display = 'none';
            this.globalLeaderboard.style.display = 'block';
            this.loadLeaderboard();
        });
        
        // Çevrimiçi oyun butonları
        this.createRoomBtn.addEventListener('click', () => {
            this.roomCreation.style.display = 'block';
            this.roomJoin.style.display = 'none';
            // Kategori select'ini doldur
            const categorySelect = document.getElementById('room-category');
            if (categorySelect) {
                categorySelect.innerHTML = '<option value="">Kategori Seçin</option>';
                const categories = Object.keys(window.quizApp.allQuestionsData || {});
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = window.languages && window.languages[window.quizApp.currentLanguage] && window.languages[window.quizApp.currentLanguage][category] ? window.languages[window.quizApp.currentLanguage][category] : category;
                    categorySelect.appendChild(option);
                });
            }
        });
        
        this.joinRoomBtn.addEventListener('click', () => {
            this.roomCreation.style.display = 'none';
            this.roomJoin.style.display = 'block';
        });
        
        this.backToMainBtn.addEventListener('click', () => {
            this.onlineOptions.style.display = 'none';
            this.mainMenu.style.display = 'block';
            this.roomCreation.style.display = 'none';
            this.roomJoin.style.display = 'none';
        });
        
        // Oda oluşturma ve katılma
        this.createRoomSubmit.addEventListener('click', () => this.createRoom());
        this.joinRoomSubmit.addEventListener('click', () => this.joinRoom());
        
        // Bekleme odası butonları
        this.startGameBtn.addEventListener('click', () => this.startGame());
        this.leaveRoomBtn.addEventListener('click', () => this.leaveRoom());
        
        // Chat fonksiyonları - Bekleme odası
        this.sendMessageBtn.addEventListener('click', () => this.sendChatMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });
        
        // Oyun içi chat fonksiyonları
        this.gameSendMessageBtn.addEventListener('click', () => this.sendGameChatMessage());
        this.gameChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendGameChatMessage();
            }
        });
        
        // Lider tablosu filtreleri
        this.leaderboardCategory.addEventListener('change', () => this.loadLeaderboard());
        this.leaderboardTime.addEventListener('change', () => this.loadLeaderboard());
        
        // Lider tablosundan ana menüye dön
        this.backFromLeaderboardBtn.addEventListener('click', () => {
            this.globalLeaderboard.style.display = 'none';
            this.mainMenu.style.display = 'block';
        });
        
        // Kazanan ekranı butonları
        this.playAgainBtn.addEventListener('click', () => {
            this.winnerScreen.style.display = 'none';
            this.resetRoomState();
            // Yeni oda oluştur
            this.roomNameInput.value = 'Yeni Oyun';
            this.createRoom();
        });
        
        this.backToMenuBtn.addEventListener('click', () => {
            this.winnerScreen.style.display = 'none';
            this.resetRoomState();
            this.mainMenu.style.display = 'block';
        });
    },
    
    // Kategori seçeneklerini doldur
    populateCategoryOptions: function() {
        // Lider tablosu kategori filtresine tüm kategorileri ekle
        if (this.leaderboardCategory) {
            for (const category in window.quizApp.allQuestionsData) {
                const option = document.createElement('option');
                option.value = category;
                option.setAttribute('data-i18n', category);
                
                // Kategori çevirisini languages objesinden al
                const currentLang = window.quizApp && window.quizApp.currentLanguage ? window.quizApp.currentLanguage : 'tr';
                let translatedCategory = category;
                if (window.languages && window.languages[currentLang] && window.languages[currentLang][category]) {
                    translatedCategory = window.languages[currentLang][category];
                }
                option.textContent = translatedCategory;
                this.leaderboardCategory.appendChild(option);
            }
        }
        
        // Oda oluşturma kategori seçimini doldur
        const roomCategorySelect = document.getElementById('room-category');
        if (roomCategorySelect && window.quizApp && window.quizApp.allQuestionsData) {
            // Önce mevcut seçenekleri temizle (sadece ilk "Kategori Seçin" seçeneğini bırak)
            while (roomCategorySelect.children.length > 1) {
                roomCategorySelect.removeChild(roomCategorySelect.lastChild);
            }
            
            // Kategorileri ekle
            for (const category in window.quizApp.allQuestionsData) {
                const option = document.createElement('option');
                option.value = category;
                
                // Kategori çevirisini languages objesinden al
                const currentLang = window.quizApp && window.quizApp.currentLanguage ? window.quizApp.currentLanguage : 'tr';
                let translatedCategory = category;
                if (window.languages && window.languages[currentLang] && window.languages[currentLang][category]) {
                    translatedCategory = window.languages[currentLang][category];
                }
                option.textContent = translatedCategory;
                roomCategorySelect.appendChild(option);
            }
        }
    },
    
    // Rastgele oda kodu oluştur
    generateRoomCode: function(length = 6) {
        let result = '';
        const charactersLength = this.CHARACTERS.length;
        for (let i = 0; i < length; i++) {
            result += this.CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    
    // Oda oluştur
    createRoom: function() {
        const roomName = this.roomNameInput.value.trim() || 'Quiz Odası';
        if (roomName.length < 3) {
            alert('Oda adı en az 3 karakter olmalıdır.');
            return;
        }
        // Kategori seçimini al
        const categorySelect = document.getElementById('room-category');
        const selectedCategory = categorySelect ? categorySelect.value : '';
        if (!selectedCategory) {
            alert('Lütfen bir kategori seçin!');
            return;
        }
        // 6 karakter uzunluğunda rastgele bir kod oluştur
        let roomCode = '';
        for (let i = 0; i < 6; i++) {
            roomCode += this.CHARACTERS.charAt(Math.floor(Math.random() * this.CHARACTERS.length));
        }
        // Oyuncu kapasitesini form'dan al, yoksa varsayılan 4 kullan
        const playerCapacityElement = document.getElementById('room-capacity');
        const playerCount = playerCapacityElement ? parseInt(playerCapacityElement.value) : 4;
        // Oda verilerini oluştur
        const roomData = {
            name: roomName,
            hostId: this.userId,
            hostName: this.username,
            status: 'waiting',
            maxPlayers: playerCount,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            category: selectedCategory,
            players: {
                [this.userId]: {
                    name: this.username,
                    isHost: true,
                    score: 0,
                    ready: false,
                    lastActive: firebase.database.ServerValue.TIMESTAMP
                }
            }
        };
        this.roomRef = database.ref('rooms/' + roomCode);
        this.roomRef.set(roomData)
            .then(() => {
                console.log('Oda oluşturuldu:', roomCode);
                this.currentRoom = roomCode;
                this.isHost = true;
                this.displayRoomCode.textContent = roomCode;
                
                // Tüm oyun ekranlarını gizle ve sadece bekleme odasını göster
                this.roomCreation.style.display = 'none';
                this.onlineOptions.style.display = 'none';
                const mainMenu = document.getElementById('main-menu');
                if (mainMenu) mainMenu.style.display = 'none';
                this.waitingRoom.style.display = 'block';
                
                // Önce bekleme odasını göster ve oda bilgilerini ayarla
                // Bekleme animasyonu için küçük bir gecikme ekleyelim (DOM yüklenmesi için)
                setTimeout(() => {
                    // Bekleme animasyonunu göster
                    this.showWaitingAnimation();
                    
                    // Bekleme mesajını güncelle
                    this.updateWaitingMessage(playerCount > 1 ? 
                        "Diğer oyuncular bekleniyor..." : 
                        "Oyunu başlatmak için en az bir oyuncu daha gerekli", "waiting");
                }, 100);
                
                // Odayı dinlemeye başla
                this.startListeningToRoom();
                
                // Sistem mesajı gönder
                this.sendLocalizedSystemMessage('room_created', { roomName: roomName, playerCount: playerCount });
                this.sendLocalizedSystemMessage('room_code_share', { roomCode: roomCode });
                
                // Kullanıcı çıkış yaparsa odayı temizle
                window.addEventListener('beforeunload', () => {
                    if (this.isHost && this.currentRoom) {
                        this.roomRef.remove();
                    }
                });
            })
            .catch(error => {
                console.error('Oda oluşturma hatası:', error);
                alert(`Oda oluşturulamadı: ${error.message}`);
            });
    },
    
    // Mevcut odaları listele
    listRooms: function() {
        // Oda listesi konteynerini her seferinde güncelle
        let roomListContainer = document.getElementById('room-list-container');
        if (!roomListContainer) {
            roomListContainer = document.createElement('div');
            roomListContainer.id = 'room-list-container';
            roomListContainer.className = 'room-list-container';
            this.onlineOptions.appendChild(roomListContainer);
        }
        // Her çağrıda içeriği güncelle
        roomListContainer.innerHTML = `
            <h3><i class="fas fa-list"></i> ${this.translateText('current_rooms', 'Mevcut Odalar')}</h3>
            <div id="room-list" class="room-list">
                <div class="loading-rooms"><i class="fas fa-spinner fa-spin"></i> ${this.translateText('rooms_loading', 'Odalar yükleniyor...')}</div>
            </div>
            <button id="refresh-rooms" class="btn-primary"><i class="fas fa-sync-alt"></i> ${this.translateText('refresh_rooms', 'Odaları Yenile')}</button>
        `;
        // Yenile butonu event listener
        document.getElementById('refresh-rooms').onclick = () => this.listRooms();
        
        const roomList = document.getElementById('room-list');
        roomList.innerHTML = `<div class="loading-rooms"><i class="fas fa-spinner fa-spin"></i> ${this.translateText('rooms_loading', 'Odalar yükleniyor...')}</div>`;
        
        // Firebase'den mevcut odaları çek
        database.ref('rooms').orderByChild('createdAt').limitToLast(10).once('value')
            .then(snapshot => {
                roomList.innerHTML = '';
                let roomCount = 0;
                
                snapshot.forEach(roomSnapshot => {
                    const roomData = roomSnapshot.val();
                    const roomCode = roomSnapshot.key;
                    
                    // Sadece bekleyen odaları göster
                    if (roomData.status === 'waiting') {
                        roomCount++;
                        const playerCount = roomData.players ? Object.keys(roomData.players).length : 0;
                        const roomItem = document.createElement('div');
                        roomItem.className = 'room-item';
                        roomItem.innerHTML = `
                            <div class="room-info">
                                <div class="room-name">${roomData.name}</div>
                                <div class="room-details">
                                    <span class="room-host"><i class="fas fa-user"></i> ${roomData.hostName}</span>
                                    <span class="room-players"><i class="fas fa-users"></i> ${playerCount} ${this.translateText('players', 'Oyuncular')}</span>
                                </div>
                            </div>
                            <button class="join-room-btn" data-code="${roomCode}">${this.translateText('join', 'Katıl')}</button>
                        `;
                        roomList.appendChild(roomItem);
                        
                        // Katıl butonuna tıklama olayı
                        roomItem.querySelector('.join-room-btn').addEventListener('click', () => {
                            this.roomCodeInput.value = roomCode;
                            this.joinRoom();
                        });
                    }
                });
                
                // Hiç oda yoksa mesaj göster
                if (roomCount === 0) {
                    roomList.innerHTML = `<div class="no-rooms">${this.translateText('no_rooms', 'Şu anda açık oda bulunmuyor. Yeni bir oda oluşturabilirsiniz.')}</div>`;
                }
            })
            .catch(error => {
                console.error('Oda listesi yükleme hatası:', error);
                roomList.innerHTML = '<div class="error-message">Odalar yüklenemedi. Lütfen tekrar deneyin.</div>';
            });
    },
    
    // Odaya katıl
    joinRoom: function() {
        const roomCode = this.roomCodeInput.value.trim().toUpperCase();
        if (roomCode.length !== 6) {
            alert('Geçerli bir oda kodu girin (6 karakter).');
            return;
        }
        
        this.roomRef = database.ref('rooms/' + roomCode);
        this.roomRef.once('value')
            .then(snapshot => {
                const roomData = snapshot.val();
                if (!roomData) {
                    alert('Oda bulunamadı.');
                    return;
                }
                
                if (roomData.status !== 'waiting') {
                    alert('Bu oda şu anda katılıma açık değil.');
                    return;
                }
                
                // Odadaki oyuncu sayısını kontrol et
                const currentPlayers = Object.keys(roomData.players || {}).length;
                if (currentPlayers >= roomData.maxPlayers) {
                    alert(`Bu oda dolu. Maksimum oyuncu sayısı: ${roomData.maxPlayers}`);
                    return;
                }
                
                // Odaya katıl
                this.roomRef.child('players/' + this.userId).set({
                    name: this.username,
                    isHost: false,
                    score: 0,
                    ready: false,
                    lastActive: firebase.database.ServerValue.TIMESTAMP
                })
                .then(() => {
                    console.log('Odaya katıldı:', roomCode);
                    this.currentRoom = roomCode;
                    this.isHost = false;
                    this.displayRoomCode.textContent = roomCode;
                    
                    // Tüm oyun ekranlarını gizle ve sadece bekleme odasını göster
                    this.roomJoin.style.display = 'none';
                    this.onlineOptions.style.display = 'none';
                    const mainMenu = document.getElementById('main-menu');
                    if (mainMenu) mainMenu.style.display = 'none';
                    this.waitingRoom.style.display = 'block';
                    
                    // Önce bekleme odasını göster
                    // Bekleme animasyonu için küçük bir gecikme ekleyelim (DOM yüklenmesi için)
                    setTimeout(() => {
                        // Bekleme animasyonunu göster
                        this.showWaitingAnimation();
                        
                        // Bekleme mesajını güncelle
                        this.updateWaitingMessage("Oyunun başlaması için oda sahibini bekleniyor...", "waiting-host");
                    }, 100);
                    
                    // Bu satır kritik - odayı dinlemeye başla
                    this.startListeningToRoom();
                    
                    // Sistem mesajı gönder
                    this.sendLocalizedSystemMessage('player_joined', { username: this.username });
                    
                    // Katılım olduğunu ev sahibine bildir
                    const notification = {
                        type: 'playerJoined',
                        playerId: this.userId,
                        playerName: this.username,
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    };
                    
                    this.roomRef.child('notifications').push(notification)
                        .catch(error => console.error('Bildirim gönderme hatası:', error));
                })
                .catch(error => {
                    console.error('Odaya katılma hatası:', error);
                    alert(`Odaya katılınamadı: ${error.message}`);
                });
            })
            .catch(error => {
                console.error('Oda sorgu hatası:', error);
                alert(`Oda sorgulanırken hata: ${error.message}`);
            });
    },
    
    // Odayı dinlemeye başla
    startListeningToRoom: function() {
        if (!this.roomRef) return;
        
        // Log ekle
        console.log('Oda dinlemeye başlanıyor:', this.currentRoom);
        
        // Bekleme animasyonu başka yerde çağrıldığı için burada gerek yok
        
        // Oyuncu listesini dinle
        this.roomRef.child('players').on('value', snapshot => {
            console.log('Oyuncu listesi güncellendi');
            const players = snapshot.val() || {};
            this.updatePlayerList(players);
            
            // Host ise, en az 2 oyuncu varsa başlatma düğmesini etkinleştir
            if (this.isHost) {
                const playerCount = Object.keys(players).length;
                this.startGameBtn.disabled = playerCount < 2;
                
                // Yeterli oyuncu varsa bekleme animasyonunu güncelle
                if (playerCount >= 2) {
                    this.updateWaitingMessage("Yeterli oyuncu hazır! Oyunu başlatabilirsiniz.", "ready");
                } else {
                    this.updateWaitingMessage("Diğer oyuncular bekleniyor...", "waiting");
                }
            } else {
                // Host değilse, oyunu başlatmak için oda sahibini bekle mesajı göster
                this.updateWaitingMessage("Oyunun başlaması için oda sahibini bekleniyor...", "waiting-host");
                
                // Host değilse başlatma düğmesini devre dışı bırak
                this.startGameBtn.style.display = 'none';
            }
        });
        
        // Bildirimleri dinle
        this.roomRef.child('notifications').on('child_added', snapshot => {
            const notification = snapshot.val();
            if (!notification) return;
            
            console.log('Bildirim alındı:', notification);
            
            // Bildirim işleme
            if (notification.type === 'playerJoined') {
                // Yeni oyuncu katıldı bildirimi
                if (this.isHost && notification.playerId !== this.userId) {
                    this.showToast(`${notification.playerName} odaya katıldı`);
                    // Oyuncu katıldı ses efekti
                    const joinSound = new Audio('https://assets.mixkit.co/active_storage/sfx/254/254.wav');
                    joinSound.volume = 0.5;
                    joinSound.play().catch(e => console.log('Ses çalma hatası:', e));
                }
            }
        });
        
        // Önce mevcut chat dinleyicilerini temizle
        this.roomRef.child('chat').off();
        this.roomRef.child('gameChat').off();
        
        // Chat mesajlarını temizle
        if (this.chatMessages) {
            this.chatMessages.innerHTML = '<div class="system-message">Oda oluşturuldu. Oyuncular bekleniyor...</div>';
        }
        
        // Chat mesajlarını dinle
        this.roomRef.child('chat').on('child_added', snapshot => {
            const message = snapshot.val();
            if (!message) return;
            
            this.displayChatMessage(message);
        });
        
        // Oda durumunu dinle
        this.roomRef.child('status').on('value', snapshot => {
            const status = snapshot.val();
            console.log('Oda durumu değişti:', status);
            
            if (status === 'playing') {
                // Bekleme animasyonunu kaldır
                this.hideWaitingAnimation();
                
                // Eğer host değilsek, oyun başlama animasyonunu göster
                if (!this.isHost) {
                    this.showGameStartingOverlay();
                    
                    // 3 saniye geri sayım
                    let countdown = 3;
                    const countdownInterval = setInterval(() => {
                        this.updateGameStartCountdown(countdown);
                        countdown--;
                        
                        if (countdown < 0) {
                            clearInterval(countdownInterval);
                            // Son olarak oyun başladı gösterilir
                            this.updateGameStartCountdown(0);
                            
                            // Oyun başlatma ekranını bir süre sonra kaldır
                            setTimeout(() => {
                                this.hideGameStartingOverlay();
                            }, 1000);
                        }
                    }, 1000);
                }
                
                this.gameStarted = true;
                // Oyun verilerini al
                this.roomRef.child('gameData').once('value')
                    .then(gameSnapshot => {
                        const gameData = gameSnapshot.val();
                        if (gameData) {
                            this.currentGameData = gameData;
                            
                            // Tüm çoklu oyun ekranlarını gizle
                            this.waitingRoom.style.display = 'none';
                            const onlineOptions = document.getElementById('online-game-options');
                            if (onlineOptions) onlineOptions.style.display = 'none';
                            
                            const roomCreation = document.getElementById('room-creation');
                            if (roomCreation) roomCreation.style.display = 'none';
                            
                            const roomJoin = document.getElementById('room-join');
                            if (roomJoin) roomJoin.style.display = 'none';
                            
                            const roomListContainer = document.getElementById('room-list-container');
                            if (roomListContainer) roomListContainer.style.display = 'none';
                            
                            const mainMenu = document.getElementById('main-menu');
                            if (mainMenu) mainMenu.style.display = 'none';
                            
                            // Quiz elementlerini hazırla
                            this.prepareQuizElements();
                            
                            // loadGame fonksiyonunu kullan (startGame yerine)
                            this.loadGame(gameData);
                            
                                            // Çevrimiçi göstergeleri görünür yap
                this.onlineIndicators.style.display = 'block';
                this.updatePlayerScores();
                
                // Z-index'i yükselt ki diğer elementlerin üstünde görünsün
                const quizContainer = document.getElementById('quiz-container');
                if (quizContainer) {
                    quizContainer.style.zIndex = '1000';
                }
                
                // Oyun başladığını işaretle
                this.gameStarted = true;
                            
                            // Odadaki skor değişikliklerini dinle
                            this.listenToScoreChanges();
                            
                            console.log('Misafir için oyun başlatıldı, tüm çoklu oyun ekranları gizlendi');
                        } else {
                            console.error("Oyun verisi alınamadı: gameData undefined");
                            this.showToast("Oyun verisi alınamadı! Lütfen odadan çıkıp tekrar katılın.", "error");
                        }
                    })
                    .catch(error => {
                        console.error("Oyun verisi alınırken hata:", error);
                        this.showToast("Oyun verisi alınırken hata oluştu! Lütfen odadan çıkıp tekrar katılın.", "error");
                    });
            }
        });
    },
    
    // Quiz elementlerini hazırla
    prepareQuizElements: function() {
        console.log('Quiz elementleri hazırlanıyor...');
        
        // Timer elementini kontrol et, yoksa oluştur
        let timerElement = document.getElementById('timer');
        if (!timerElement) {
            console.log('Timer elementi bulunamadı, oluşturuluyor...');
            timerElement = document.createElement('div');
            timerElement.id = 'timer';
            timerElement.className = 'timer';
            timerElement.innerHTML = `
                <div class="timer-bar">
                    <div class="timer-progress"></div>
                </div>
                <div class="timer-text">20</div>
            `;
            
            // Quiz container'a ekle
            const quizContainer = document.getElementById('quiz-container');
            if (quizContainer) {
                // Eğer question-container varsa onun üstüne ekle
                const questionContainer = quizContainer.querySelector('.question-container');
                if (questionContainer) {
                    quizContainer.insertBefore(timerElement, questionContainer);
                } else {
                    quizContainer.appendChild(timerElement);
                }
            }
        }
        
        // Result elementini kontrol et, yoksa oluştur
        let resultElement = document.getElementById('result');
        if (!resultElement) {
            console.log('Result elementi bulunamadı, oluşturuluyor...');
            resultElement = document.createElement('div');
            resultElement.id = 'result';
            resultElement.className = 'result';
            resultElement.style.display = 'none';
            
            // Quiz container'a ekle
            const optionsContainer = document.querySelector('.options-container');
            if (optionsContainer) {
                optionsContainer.parentNode.insertBefore(resultElement, optionsContainer.nextSibling);
            } else {
                const quizContainer = document.getElementById('quiz-container');
                if (quizContainer) {
                    quizContainer.appendChild(resultElement);
                }
            }
        }
        
        console.log('Quiz elementleri hazırlandı');
    },
    
    // Bekleme animasyonu göster
    showWaitingAnimation: function() {
        // Bekleme animasyonu konteynerı oluştur (eğer yoksa)
        if (!document.getElementById('waiting-animation-container')) {
            const waitingContainer = document.createElement('div');
            waitingContainer.id = 'waiting-animation-container';
            waitingContainer.className = 'waiting-animation-container';
            waitingContainer.innerHTML = `
                <div class="waiting-animation">
                    <div class="waiting-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                    <div class="waiting-message" id="waiting-message">
                        Diğer oyuncular bekleniyor...
                    </div>
                    <div class="waiting-icon-container">
                        <i class="fas fa-user user-icon user-joined"></i>
                        <i class="fas fa-user user-icon user-waiting pulse"></i>
                        <i class="fas fa-user user-icon user-waiting pulse"></i>
                    </div>
                </div>
            `;
            
            // Bekleme animasyonu için özel stil ekle
            const waitingStyle = document.createElement('style');
            waitingStyle.id = 'waiting-animation-style';
            waitingStyle.innerHTML = `
                .waiting-animation-container {
                    margin: 20px auto;
                    text-align: center;
                    padding: 20px;
                    background-color: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                
                .waiting-animation {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                }
                
                .waiting-spinner {
                    font-size: 36px;
                    color: var(--primary-color);
                    margin-bottom: 10px;
                }
                
                .waiting-message {
                    font-size: 18px;
                    font-weight: bold;
                    color: #555;
                    min-height: 30px;
                    transition: color 0.3s ease;
                }
                
                .waiting-message.ready {
                    color: #28a745;
                }
                
                .waiting-message.waiting {
                    color: #ffc107;
                }
                
                .waiting-message.waiting-host {
                    color: #17a2b8;
                }
                
                .waiting-icon-container {
                    display: flex;
                    gap: 20px;
                    margin-top: 10px;
                }
                
                .user-icon {
                    font-size: 24px;
                    background-color: #e9ecef;
                    color: #6c757d;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                
                .user-joined {
                    background-color: var(--primary-color);
                    color: white;
                    box-shadow: 0 0 10px var(--primary-color);
                }
                
                .user-waiting {
                    opacity: 0.5;
                }
                
                .pulse {
                    animation: pulse-animation 2s infinite;
                }
                
                @keyframes pulse-animation {
                    0% {
                        transform: scale(0.95);
                        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);
                    }
                    
                    70% {
                        transform: scale(1);
                        box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
                    }
                    
                    100% {
                        transform: scale(0.95);
                        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
                    }
                }
            `;
            document.head.appendChild(waitingStyle);
            
            // Bekleme ekranını doğrudan bekleme odasına ekle
            // Önceden chat-container veya player-list-container arasına eklemeye çalışıyorduk
            // bu durum DOM yapısı nedeniyle hata veriyordu
            if (this.waitingRoom) {
                // Oyuncu listesinin hemen altına ekle 
                const playerList = this.playerList;
                if (playerList && playerList.parentNode) {
                    playerList.parentNode.insertBefore(waitingContainer, playerList.nextSibling);
                } else {
                    // playerList bulunamazsa, basitçe waitingRoom'un başına ekle
                    this.waitingRoom.insertBefore(waitingContainer, this.waitingRoom.firstChild);
                }
            } else {
                console.error("waitingRoom elementi bulunamadı");
            }
        }
    },
    
    // Bekleme mesajını güncelle
    updateWaitingMessage: function(message, status) {
        try {
            const waitingMessage = document.getElementById('waiting-message');
            if (!waitingMessage) {
                console.warn('Bekleme mesajı elementi bulunamadı');
                // Eğer bekleme odası görünür durumdaysa, bekleme mesajını oluşturmayı dene
                if (this.waitingRoom && this.waitingRoom.style.display !== 'none') {
                    this.showWaitingAnimation(); // Bekleme animasyonunu yeniden oluştur
                }
                return;
            }
            
            // Mesajı güncelle
            waitingMessage.textContent = message;
            
            // Tüm durum sınıflarını kaldır
            waitingMessage.classList.remove('ready', 'waiting', 'waiting-host');
            
            // Yeni durum sınıfını ekle
            if (status) {
                waitingMessage.classList.add(status);
            }
            
            // Kullanıcı ikonlarını güncelle
            const iconContainer = document.querySelector('.waiting-icon-container');
            if (!iconContainer) {
                console.warn('İkon container elementi bulunamadı');
                return;
            }
            
            const players = this.players || {};
            const playerCount = Object.keys(players).length;
            
            // Kullanıcı ikonlarını temizle
            iconContainer.innerHTML = '';
            
            // Tüm oyuncular için ikon ekle
            for (let i = 0; i < Math.min(playerCount, 4); i++) {
                const userIcon = document.createElement('i');
                userIcon.className = 'fas fa-user user-icon user-joined';
                iconContainer.appendChild(userIcon);
            }
            
            // Eksik oyuncular için bekleyen ikon ekle
            for (let i = playerCount; i < 4; i++) {
                const userIcon = document.createElement('i');
                userIcon.className = 'fas fa-user user-icon user-waiting pulse';
                iconContainer.appendChild(userIcon);
            }
        } catch (error) {
            console.error('Bekleme mesajı güncellenirken hata oluştu:', error);
        }
    },
    
    // Bekleme animasyonunu gizle
    hideWaitingAnimation: function() {
        const waitingContainer = document.getElementById('waiting-animation-container');
        if (waitingContainer) {
            waitingContainer.remove();
        }
    },
    
    // Oyuncu listesini güncelle
    updatePlayerList: function(players) {
        console.log('Oyuncu listesi güncellenecek', players);
        this.players = players;
        this.playerList.innerHTML = '';
        
        // Oda bilgilerini al
        this.roomRef.once('value').then(snapshot => {
            const roomData = snapshot.val();
            const maxPlayers = roomData.maxPlayers || 2;
            const playerCount = Object.keys(players).length;
            
            // Başlat butonunu yönet - sadece ev sahibi için görünür olsun
            if (this.isHost) {
                this.startGameBtn.style.display = 'block';
                this.startGameBtn.disabled = playerCount < 2;
            } else {
                this.startGameBtn.style.display = 'none';
            }
            
            // Oyuncuların listesini oluştur
            const playerList = document.createElement('div');
            playerList.className = 'players-list';
            
            // Oyuncuları listeye ekle
            Object.keys(players).forEach(playerId => {
                const player = players[playerId];
                const playerItem = document.createElement('div');
                playerItem.className = 'player-item';
                
                // Oyuncu kendisi mi kontrol et
                const isCurrentUser = playerId === this.userId;
                if (isCurrentUser) {
                    playerItem.classList.add('current-player');
                }
                
                // Host ise özel simge göster
                const hostBadge = player.isHost ? '<span class="host-badge"><i class="fas fa-crown" title="Oda Sahibi"></i></span>' : '';
                
                // Oyuncu durum simgesi
                const statusIcon = '<i class="fas fa-circle player-status-icon"></i>';
                
                playerItem.innerHTML = `
                    <div class="player-info">
                        ${statusIcon}
                        <span class="player-name">${player.name} ${isCurrentUser ? ' (Sen)' : ''}</span>
                        ${hostBadge}
                    </div>
                    <div class="player-score">${player.score || 0} puan</div>
                `;
                
                playerList.appendChild(playerItem);
            });
            
            this.playerList.appendChild(playerList);
            
            // Oyuncu sayısı ve kapasite bilgisini ekle
            const capacityInfo = document.createElement('div');
            capacityInfo.className = 'capacity-info';
            capacityInfo.innerHTML = `
                <div class="capacity-text">
                    <i class="fas fa-users"></i> Oyuncular: ${playerCount}/${maxPlayers}
                </div>
                <div class="capacity-bar">
                    <div class="capacity-fill" style="width: ${(playerCount / maxPlayers) * 100}%"></div>
                </div>
            `;
            
            this.playerList.appendChild(capacityInfo);
        });
    },
    
    // Oyuncu skorlarını güncelle
    updatePlayerScores: function() {
        if (!this.players) return;
        
        this.playerScores.innerHTML = '';
        
        Object.keys(this.players).forEach(playerId => {
            const player = this.players[playerId];
            const scoreItem = document.createElement('div');
            scoreItem.className = 'player-score-item';
            
            // Mevcut oyuncu için farklı stil
            if (playerId === this.userId) {
                scoreItem.classList.add('current');
            }
            
            scoreItem.innerHTML = `
                <i class="fas fa-user"></i>
                ${player.name}: ${player.score || 0}
            `;
            
            this.playerScores.appendChild(scoreItem);
        });
    },
    
    // Skor değişikliklerini dinle
    listenToScoreChanges: function() {
        this.roomRef.child('players').on('value', snapshot => {
            const players = snapshot.val() || {};
            this.players = players;
            this.updatePlayerScores();
        });
    },
    
    // Odadan ayrıl
    leaveRoom: function() {
        if (this.currentRoom && this.roomRef) {
            if (this.isHost) {
                // Sistem mesajı gönder (oda kapanmadan önce)
                this.sendLocalizedSystemMessage('host_left', { username: this.username });
                
                // 1.5 saniye sonra odayı kaldır (mesajın görüntülenmesi için)
                setTimeout(() => {
                    // Ev sahibi ayrılırsa, odayı kaldır
                    this.roomRef.remove()
                        .then(() => {
                            console.log('Oda silindi.');
                            this.resetRoomState();
                            this.showToast('Oda kapatıldı', 'info');
                        })
                        .catch(error => {
                            console.error('Oda silme hatası:', error);
                        });
                }, 1500);
            } else {
                // Sistem mesajı gönder
                this.sendLocalizedSystemMessage('player_left', { username: this.username });
                
                // Normal oyuncu ayrılırsa, sadece kendisini kaldır
                this.roomRef.child('players/' + this.userId).remove()
                    .then(() => {
                        console.log('Odadan ayrıldı.');
                        this.resetRoomState();
                        this.showToast('Odadan ayrıldınız', 'info');
                    })
                    .catch(error => {
                        console.error('Odadan ayrılma hatası:', error);
                    });
            }
        }
    },
    
    // Oda durumunu su0131fu0131rla
    resetRoomState: function() {
        this.waitingRoom.style.display = 'none';
        this.mainMenu.style.display = 'block';
        
        // Chat dinleyicilerini temizle
        if (this.roomRef) {
            this.roomRef.child('chat').off(); // Bekleme odasu0131 chat dinleyicisini kapat
            this.roomRef.child('gameChat').off(); // Oyun iu00e7i chat dinleyicisini kapat
        }
        
        // Chat mesajlaru0131nu0131 temizle
        if (this.chatMessages) {
            this.chatMessages.innerHTML = '';
        }
        
        // Oyun iu00e7i chat mesajlaru0131nu0131 temizle
        if (this.gameChatMessages) {
            this.gameChatMessages.innerHTML = '';
        }
        
        this.currentRoom = null;
        this.isHost = false;
        this.players = [];
        this.roomRef = null;
        this.gameStarted = false;
    },
    
    // Oyunu başlat (sadece ev sahibi)
    startGame: function() {
        if (!this.isHost || !this.currentRoom) return;
        
        // Sistem mesajı gönder
        this.sendLocalizedSystemMessage('host_starting', { username: this.username });
        
        // Oda ayarları
        const gameSettings = {
            category: 'random',
            questionCount: 10,
            timePerQuestion: 45,
            difficulty: 'medium'
        };
        
        // Kategori seçimi
        // DİNAMİK KATEGORİ SEÇİMİ (dil desteği için)
        let selectedCategory;
        const categories = Object.keys(quizApp.allQuestionsData || {});
        if (categories.length === 0) {
            console.error("Hiç kategori bulunamadı. Varsayılan sorular yükleniyor.");
            quizApp.loadDefaultQuestions();
            quizApp.allQuestionsData = quizApp.questionsData;
        }
        
        // Mevcut dilde kategori bul, yoksa ilkini al
        let categoryGeneral = 'Genel Kültür';
        // Dil çevirisini languages objesinden al
        const currentLang = window.quizApp && window.quizApp.currentLanguage ? window.quizApp.currentLanguage : 'tr';
        if (window.languages && window.languages[currentLang] && window.languages[currentLang].categoryGeneral) {
            categoryGeneral = window.languages[currentLang].categoryGeneral;
        }
        console.log("Aranan kategori adı:", categoryGeneral);
        selectedCategory = categories.find(cat => cat.toLowerCase() === categoryGeneral.toLowerCase()) || categories[0];
        console.log("Seçilen kategori:", selectedCategory);
        
        try {
            // allQuestionsData kontrolü
            if (!quizApp.allQuestionsData) {
                console.error("quizApp.allQuestionsData tanımlı değil. Varsayılan soru verileri kullanılacak.");
                quizApp.loadDefaultQuestions();
                quizApp.allQuestionsData = quizApp.questionsData;
            }
            
            const allCategories = Object.keys(quizApp.allQuestionsData || {});
            console.log("Mevcut kategoriler:", allCategories);
            
            if (allCategories.length === 0) {
                console.error("Hiç kategori bulunamadı. Varsayılan sorular yükleniyor.");
                quizApp.loadDefaultQuestions();
                quizApp.allQuestionsData = quizApp.questionsData;
            }
            
            // Seçilen kategorinin varlığını kontrol et
            if (!allCategories.includes(selectedCategory)) {
                console.warn(`'${selectedCategory}' kategorisi bulunamadı. İlk mevcut kategori seçiliyor.`);
                selectedCategory = allCategories[0] || 'Genel Kültür';
            }
            
            // Seçilen kategoriden soru al
            const allCategoryQuestions = quizApp.allQuestionsData[selectedCategory];
            
            // Kategori bilgisini veya veri yoklama offline mod kontrolü
            if (!Array.isArray(allCategoryQuestions) || allCategoryQuestions.length === 0) {
                console.error("Kategori seçimi hatası: Seçilen kategoride yeterli soru yok veya sorular yüklenemedi.");
                this.showToast("Seçilen kategoride yeterli soru yok veya sorular yüklenemedi. Lütfen başka bir kategori seçin veya yöneticinize başvurun.", "error");
                return;
            }
            
            console.log(`'${selectedCategory}' kategorisinde ${allCategoryQuestions.length} soru bulundu.`);
            
            // Kategorinin sorularını karıştır
            const shuffledQuestions = [...allCategoryQuestions].sort(() => Math.random() - 0.5);
            
            // Oyun verisini hazırla
            const gameData = {
                category: selectedCategory,
                questions: shuffledQuestions.slice(0, gameSettings.questionCount), // Soru sayısını sınırla
                startTime: firebase.database.ServerValue.TIMESTAMP,
                settings: {
                    timePerQuestion: gameSettings.timePerQuestion,
                    difficulty: gameSettings.difficulty
                }
            };
            
            // Oyun başlatma ekranını göster
            this.showGameStartingOverlay();
            
            // Oyun başlatmadan önce geri sayım yapma
            let countdown = 3;
            const countdownInterval = setInterval(() => {
                this.updateGameStartCountdown(countdown);
                this.sendLocalizedSystemMessage('game_starts_in', { countdown: countdown });
                countdown--;
                
                if (countdown < 0) {
                    clearInterval(countdownInterval);
                    
                    // Firestore/Firebase bağlantı hatası durumunda offline modda devam etmek için try-catch bloğu
                    try {
                        // Mevcut oyuncu puanlarını koru
                        this.roomRef.child('players').once('value')
                            .then(snapshot => {
                                try {
                                    const currentPlayers = snapshot.val() || {};
                                    const players = {...this.players};
                                    
                                    // Tüm kullanıcıları hazır olmayan duruma getir ama puanlarını koru
                                    Object.keys(players).forEach(playerId => {
                                        players[playerId].ready = false;
                                        // Eğer oyuncu zaten mevcutsa puanını koru, değilse 0 olarak başlat
                                        if (currentPlayers[playerId] && currentPlayers[playerId].score !== undefined) {
                                            players[playerId].score = currentPlayers[playerId].score;
                                        } else {
                                            players[playerId].score = 0;
                                        }
                                    });
                                    
                                    // Oyun verisini veritabanına kaydet
                                    return this.roomRef.child('players').set(players)
                                        .then(() => this.roomRef.child('gameData').set(gameData))
                                        .then(() => {
                                            // Oda durumunu "oynanıyor" olarak güncelle
                                            return this.roomRef.child('status').set('playing');
                                        })
                                        .then(() => {
                                            console.log('Oyun başlatıldı, kategori:', selectedCategory);
                                            
                                            // Kategori adının çevirisini al
                                            let translatedCategory = selectedCategory;
                                            const currentLang = window.quizApp && window.quizApp.currentLanguage ? window.quizApp.currentLanguage : 'tr';
                                            if (window.languages && window.languages[currentLang] && window.languages[currentLang][selectedCategory]) {
                                                translatedCategory = window.languages[currentLang][selectedCategory];
                                            }
                                            
                                            // Son bir sistem mesajı göster
                                            this.sendLocalizedSystemMessage('game_started', { category: translatedCategory });
                                            
                                            // Önce mevcut dinleyicileri temizle
                                            this.roomRef.child('gameChat').off();
                                            
                                            // Oyun içi chat için sistem mesajı gönder
                                            this.roomRef.child('gameChat').push({
                                                text: `Oyun başladı! Seçilen kategori: ${translatedCategory}`,
                                                timestamp: firebase.database.ServerValue.TIMESTAMP,
                                                isSystemMessage: true
                                            });
                                            
                                            // Firebase'e gönderme başarılı veya başarısız olsa da oyunu offline olarak başlat
                                            this.startOfflineGameIfNeeded(gameData);
                                        })
                                        .catch(error => {
                                            console.error('Firebase veri güncelleme hatası, offline olarak devam ediliyor:', error);
                                            // Firebase'e yazma hatası durumunda offline olarak devam et
                                            this.startOfflineGameIfNeeded(gameData);
                                        });
                                } catch (error) {
                                    console.error('Snapshot işleme hatası, offline olarak devam ediliyor:', error);
                                    // Firebase'den okuma hatası durumunda offline olarak başlat
                                    this.startOfflineGameIfNeeded(gameData);
                                    return Promise.reject(error);
                                }
                            })
                            .catch(error => {
                                console.error('Oyuncu bilgisi alınamadı, offline olarak devam ediliyor:', error);
                                // Firebase'den okuma hatası durumunda offline olarak başlat
                                this.startOfflineGameIfNeeded(gameData);
                            });
                    } catch (error) {
                        console.error('Firebase erişim hatası, offline olarak devam ediliyor:', error);
                        // Firebase erişim hatası durumunda offline olarak başlat
                        this.startOfflineGameIfNeeded(gameData);
                    }
                }
            }, 1000);
        } catch (error) {
            console.error('Oyun başlatma hatası:', error);
            this.showToast(`Oyun başlatılamadı: ${error.message}`, "error");
            this.hideGameStartingOverlay();
        }
    },
    
    // Oyun yükleme (oyuncular için)
    loadGame: function(gameData) {
        // gameData parametresi kontrolü
        if (!gameData || !gameData.questions) {
            console.error("loadGame: gameData or gameData.questions is undefined!", gameData);
            // Kullanıcı ara yüzüne hata mesajı göster
            this.showToast("Oyun yüklenemedi! Soru verisi alınamadı.", "error");
            return; // Fonksiyondan çık
        }
        
        // Oyun içi chat dinleyicisini ekle
        if (this.roomRef) {
            // Önce mevcut dinleyicileri temizle
            this.roomRef.child('gameChat').off();
            
            // Oyun içi chat mesajlarını temizle
            if (this.gameChatMessages) {
                this.gameChatMessages.innerHTML = '<div class="system-message">Oyun başladı. İyi şanslar!</div>';
            }
            
            // Chat mesajlarını dinle - sadece tek bir dinleyici ekle
            this.roomRef.child('gameChat').on('child_added', snapshot => {
                const message = snapshot.val();
                if (message) {
                    this.displayGameChatMessage(message);
                }
            });
        }
        
        // Sadece quizApp'ı göster
        window.quizApp.questions = gameData.questions;
        window.quizApp.selectedCategory = gameData.category;
        window.quizApp.quizElement.style.display = 'block';
        window.quizApp.currentQuestionIndex = 0;
        window.quizApp.score = 0;
        window.quizApp.answerTimes = [];
        window.quizApp.answeredQuestions = 0;
        window.quizApp.resetJokerUsage(); // Online oyunda sadece kullanım durumları sıfırlansın
        
        // Oyun için game settings'teki zaman ayarlarını kullan
        if (gameData.settings && gameData.settings.timePerQuestion) {
            window.quizApp.TIME_PER_QUESTION = gameData.settings.timePerQuestion;
            console.log('Soru süresi ayarlandı: ' + gameData.settings.timePerQuestion + ' saniye');
        }
        
        // Oyun başladığını işaretle
        this.gameStarted = true;
        
        // QuizApp'ın başlangıç fonksiyonunu çağır
        window.quizApp.startQuiz();
        
        // İlk soruyu yükle
        window.quizApp.loadQuestion();
    },
    
    // Offline oyun başlatma yardımcı fonksiyonu
    startOfflineGameIfNeeded: function(gameData) {
        try {
            console.log('Offline oyun başlatma işlemi başlatılıyor...');
            
            // Quiz başlat
            if (!gameData || !gameData.questions) {
                console.error("startOfflineGameIfNeeded: gameData veya questions tanımlı değil", gameData);
                this.showToast("Offline modda oyun başlatılamadı! Soru verisi eksik.", "error");
                return;
            }
            
            // Başlatma animasyonunu hemen kaldır
            this.hideGameStartingOverlay();
            
            // Tüm çoklu oyun ekranlarını güvenli şekilde gizle
            if (this.waitingRoom) {
                this.waitingRoom.style.display = 'none';
            } else {
                console.warn('waitingRoom elementi bulunamadı');
            }
            
            // Diğer elementleri güvenli şekilde gizle
            this.safeHideElement('online-game-options');
            this.safeHideElement('room-creation');
            this.safeHideElement('room-join');
            this.safeHideElement('room-list-container');
            this.safeHideElement('main-menu');
            
            // Quiz elementlerini hazırla
            this.prepareQuizElements();
            
            // Z-index'i yükselt ki diğer elementlerin üstünde görünsün
            const quizContainer = document.getElementById('quiz-container');
            if (quizContainer) {
                quizContainer.style.zIndex = '1000';
            } else {
                console.warn('quiz-container elementi bulunamadı');
            }
            
            // Çevrimiçi göstergeleri görünür yap
            if (this.onlineIndicators) {
                this.onlineIndicators.style.display = 'block';
                this.updatePlayerScores();
            } else {
                console.warn('onlineIndicators elementi bulunamadı');
            }
            
            // loadGame ile oyunu başlat
            this.loadGame(gameData);
            
            // Odadaki skor değişikliklerini dinlemeyi dene (offline modda başarısız olabilir)
            try {
                this.listenToScoreChanges();
            } catch (error) {
                console.warn('Skor değişikliklerini dinleme özelliği offline modda devre dışı:', error);
            }
            
            // Oyun durumunu güncelle
            this.gameStarted = true;
            this.currentGameData = gameData;
            
            // Oyun başlatıldığını bildir
            console.log('Oyun offline modda başlatıldı');
        } catch (error) {
            console.error('Offline oyun başlatma hatası:', error);
            this.showToast("Offline oyun başlatma hatası: " + error.message, "error");
        }
    },
    
    // Element güvenli gizleme yardımcı fonksiyonu
    safeHideElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        } else {
            console.warn(`${elementId} elementi bulunamadı`);
        }
    },
    
    // Oyun başlıyor ekranını göster
    showGameStartingOverlay: function() {
        try {
            // Overlay daha önce oluşturulduysa kaldır
            this.hideGameStartingOverlay();
            
            // Overlay elementini oluştur
            const overlay = document.createElement('div');
            overlay.id = 'game-starting-overlay';
            overlay.className = 'game-starting-overlay';
            
            overlay.innerHTML = `
                <div class="game-starting-content">
                    <div class="game-starting-header">
                        <i class="fas fa-gamepad"></i> OYUN BAŞLIYOR
                    </div>
                    <div class="countdown-container">
                        <div class="countdown-number">3</div>
                        <div class="countdown-text">Hazırlanın!</div>
                    </div>
                    <div class="loading-bar">
                        <div class="loading-progress"></div>
                    </div>
                </div>
            `;
            
            // Overlay stilini oluştur
            const style = document.createElement('style');
            style.id = 'game-starting-style';
            style.innerHTML = `
                .game-starting-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    z-index: 9999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    animation: fade-in 0.5s ease-out;
                }
                
                .game-starting-content {
                    background-color: var(--primary-color);
                    border-radius: 10px;
                    padding: 40px;
                    text-align: center;
                    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
                    color: white;
                    max-width: 90%;
                    width: 400px;
                }
                
                .game-starting-header {
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 30px;
                    letter-spacing: 2px;
                    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                }
                
                .countdown-container {
                    margin: 20px 0;
                }
                
                .countdown-number {
                    font-size: 72px;
                    font-weight: bold;
                    background-color: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    width: 120px;
                    height: 120px;
                    line-height: 120px;
                    margin: 0 auto;
                    animation: pulse 1s infinite;
                }
                
                .countdown-text {
                    margin-top: 15px;
                    font-size: 20px;
                    opacity: 0.9;
                }
                
                .loading-bar {
                    height: 10px;
                    background-color: rgba(255, 255, 255, 0.2);
                    border-radius: 5px;
                    margin-top: 30px;
                    overflow: hidden;
                }
                
                .loading-progress {
                    height: 100%;
                    width: 0;
                    background-color: white;
                    border-radius: 5px;
                    transition: width 1s linear;
                }
                
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.05);
                        opacity: 0.8;
                    }
                }
                
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes fade-out {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
            `;
            
            document.head.appendChild(style);
            document.body.appendChild(overlay);
            
            // İlerleme çubuğunu animasyonlu hale getir
            setTimeout(() => {
                const progressBar = document.querySelector('.loading-progress');
                if (progressBar) {
                    progressBar.style.width = '100%';
                }
            }, 100);
            
            // Ses efekti çal
            try {
                const startSound = new Audio('https://assets.mixkit.co/active_storage/sfx/250/250.wav');
                startSound.volume = 0.7;
                startSound.play().catch(e => console.log('Ses çalma hatası:', e));
            } catch (soundError) {
                console.warn('Ses efekti çalınamadı:', soundError);
            }
        } catch (error) {
            console.error('Oyun başlatma ekranı gösterilirken hata oluştu:', error);
        }
    },
    
    // Geri sayım değerini güncelle
    updateGameStartCountdown: function(count) {
        try {
            const countdownNumber = document.querySelector('.countdown-number');
            if (!countdownNumber) {
                console.warn('Geri sayım elementi bulunamadı');
                return;
            }
            
            countdownNumber.textContent = count;
            
            // Geçiş efekti için sınıfları değiştir
            countdownNumber.classList.remove('countdown-3', 'countdown-2', 'countdown-1', 'countdown-0');
            countdownNumber.classList.add(`countdown-${count}`);
            
            // Sayıya göre renkleri değiştir
            if (count === 3) {
                countdownNumber.style.backgroundColor = 'rgba(255, 193, 7, 0.3)';
            } else if (count === 2) {
                countdownNumber.style.backgroundColor = 'rgba(255, 152, 0, 0.3)';
            } else if (count === 1) {
                countdownNumber.style.backgroundColor = 'rgba(244, 67, 54, 0.3)';
            } else if (count === 0) {
                countdownNumber.textContent = 'BAŞLA!';
                countdownNumber.style.backgroundColor = 'rgba(76, 175, 80, 0.3)';
            }
            
            // Ses efekti çal
            try {
                if (count > 0) {
                    const beepSound = new Audio('https://assets.mixkit.co/active_storage/sfx/270/270.wav');
                    beepSound.volume = 0.5;
                    beepSound.play().catch(e => console.log('Ses çalma hatası:', e));
                } else {
                    const goSound = new Audio('https://assets.mixkit.co/active_storage/sfx/221/221.wav');
                    goSound.volume = 0.6;
                    goSound.play().catch(e => console.log('Ses çalma hatası:', e));
                }
            } catch (soundError) {
                console.warn('Ses efekti çalınamadı:', soundError);
            }
        } catch (error) {
            console.error('Geri sayım güncellenirken hata oluştu:', error);
        }
    },
    
    // Oyun başlıyor ekranını gizle
    hideGameStartingOverlay: function() {
        const overlay = document.getElementById('game-starting-overlay');
        if (overlay) {
            // Direkt olarak elementi kaldır, animasyon kullanma
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            
            // Stili de kaldır
            const style = document.getElementById('game-starting-style');
            if (style && style.parentNode) {
                style.parentNode.removeChild(style);
            }
            
            // Eğer başka game-starting-overlay varsa hepsini temizle
            const allOverlays = document.querySelectorAll('.game-starting-overlay');
            allOverlays.forEach(el => {
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
            
            console.log('Oyun başlatma animasyonu temizlendi');
        }
    },
    
    // Oyuncu cevabını kaydet
    submitAnswer: function(isCorrect) {
        if (!this.gameStarted || !this.currentRoom) return;
        
        // Mevcut skoru al
        this.roomRef.child(`players/${this.userId}`).once('value')
            .then(snapshot => {
                const playerData = snapshot.val() || {};
                // Mevcut puanı al veya 0 olarak başlat
                let currentScore = playerData.score || 0;
                
                // Doğru cevap ise skoru artır
                if (isCorrect) {
                    currentScore += 1;
                }
                
                // Güncellenmiş skoru veritabanına kaydet
                return this.roomRef.child(`players/${this.userId}/score`).set(currentScore);
            })
            .catch(error => {
                console.error('Skor kaydetme hatası:', error);
            });
            
        // Cevabı yerel olarak sakla (oyun sonu istatistikleri için)
        this.localAnswers.push({
            questionIndex: quizApp.currentQuestionIndex,
            isCorrect: isCorrect,
            time: quizApp.TIME_PER_QUESTION - quizApp.timeLeft
        });
        
        // Son soru ise sonuçları veritabanına gönder
        if (quizApp.currentQuestionIndex + 1 >= quizApp.questions.length) {
            this.submitGameResults();
        }
    },
    
    // Oyun sonuçlarını gönder
    submitGameResults: function() {
        if (!this.gameStarted || !this.currentRoom) return;
        
        // Toplam soru sayısını belirle
        const totalQuestions = this.currentGameData && this.currentGameData.questions ? 
            this.currentGameData.questions.length : 
            (quizApp.questions ? quizApp.questions.length : 10);
        
        // Oyun istatistikleri
        const gameStats = {
            score: quizApp.score,
            total: totalQuestions,
            category: quizApp.selectedCategory,
            timeSpent: this.localAnswers.reduce((total, answer) => total + answer.time, 0),
            correctAnswers: this.localAnswers.filter(answer => answer.isCorrect).length,
            userId: this.userId,
            username: this.username,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        
        console.log('Oyun sonuçları gönderiliyor:', gameStats);
        
        // Sonuçları veritabanına kaydet
        const promises = [];
        
        // Realtime Database'e kaydet
        // Lider tablosuna ekle
        promises.push(
            firebase.database().ref('leaderboard').push(gameStats)
        );
        
        // Kategori lider tablosuna ekle
        promises.push(
            firebase.database().ref(`categoryLeaderboard/${quizApp.selectedCategory}`).push(gameStats)
        );
        
        // Firestore'a da kaydet (hem anonim hem de oturum açmış kullanıcılar için)
        try {
            if (firebase.firestore) {
                const firestoreGameStats = {
                    score: quizApp.score,
                    totalQuestions: totalQuestions,
                    category: quizApp.selectedCategory,
                    timeSpent: this.localAnswers.reduce((total, answer) => total + answer.time, 0),
                    correctAnswers: this.localAnswers.filter(answer => answer.isCorrect).length,
                    userId: this.userId,
                    username: this.username,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    device: navigator.userAgent,
                    isOnlineGame: true,
                    roomId: this.currentRoom
                };
                
                console.log('Firestore\'a kaydetmek için oyun sonuçları:', firestoreGameStats);
                
                // Firestore'a kaydet
                promises.push(
                    firebase.firestore().collection('highScores')
                        .add(firestoreGameStats)
                        .then(docRef => {
                            console.log('Firestore\'a skor başarıyla kaydedildi, ID:', docRef.id);
                        })
                        .catch(error => {
                            console.error('Firestore\'a skor kaydedilirken hata:', error);
                        })
                );
            }
        } catch (error) {
            console.error('Firestore kayıt denemesi sırasında hata:', error);
        }
        
        // Mevcut oyuncu puanını al ve puan olduğundan emin ol
        this.roomRef.child(`players/${this.userId}`).once('value')
            .then(snapshot => {
                const playerData = snapshot.val() || {};
                // Puanı güncelle (score veya 0)
                const currentScore = playerData.score || 0;
                
                // Puanı kaybetmemek için, sadece skoru güncelle ve diğer verileri koru
                return this.roomRef.child(`players/${this.userId}`).update({
                    score: currentScore, // Mevcut puanı koru
                    gameStats: gameStats  // Oyun istatistiklerini ekle
                });
            })
            .catch(error => {
                console.error('Oyuncu verileri alınırken hata:', error);
            });
        
        // Tüm kaydetme işlemleri tamamlandığında
        Promise.all(promises)
            .then(() => {
                console.log('Tüm lider tablosu kayıtları tamamlandı');
                
                // QuizApp'e yüksek skor ekleme
                if (quizApp && typeof quizApp.addNewHighScore === 'function') {
                    quizApp.addNewHighScore(quizApp.selectedCategory, quizApp.score, quizApp.questions.length);
                }
                
                // Oda durumunu güncelle
                if (this.isHost) {
                    this.roomRef.child('status').set('finished')
                        .then(() => {
                            // Kazananı belirle ve ekranı göster
                            this.determineWinnerAndShowScreen();
                        })
                        .catch(error => {
                            console.error('Oda durum güncelleme hatası:', error);
                        });
                } else {
                    // Host olmayan oyuncular da sonuçları dinlemeli
                    this.roomRef.child('status').on('value', snapshot => {
                        const status = snapshot.val();
                        if (status === 'finished') {
                            this.determineWinnerAndShowScreen();
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Lider tablosu kaydetme işlemi sırasında hata oluştu:', error);
            });
    },
    
    // Kazananı belirle ve kazanan ekranını göster
    determineWinnerAndShowScreen: function() {
        // Önce quiz ekranını gizle
        quizApp.quizElement.style.display = 'none';
        // Tüm oyuncuların puanlarını al
        this.roomRef.child('players').once('value')
            .then(snapshot => {
                const players = snapshot.val() || {};
                // Oyuncuları puana göre sırala
                const sortedPlayers = Object.entries(players)
                    .map(([playerId, playerData]) => ({
                        id: playerId,
                        ...playerData
                    }))
                    .sort((a, b) => b.score - a.score);
                // En yüksek puana sahip oyuncu (kazanan)
                const winner = sortedPlayers[0];
                // Toplam soru sayısını belirle
                const totalQuestions = this.currentGameData && this.currentGameData.questions ? 
                    this.currentGameData.questions.length : 
                    (quizApp.questions ? quizApp.questions.length : 10);
                // Eğer kazanan bizsek winner-screen, değilsek loser modalı göster
                if (winner.id === this.userId) {
                    // Kazanan ekranını güncelle
                    this.winnerName.textContent = winner.name;
                    this.winnerScore.textContent = `Skor: ${winner.score}/${totalQuestions}`;
                    const trophyElement = document.querySelector('.winner-medal');
                    trophyElement.innerHTML = `
                        <div class="trophy-animation">
                            <i class="fas fa-trophy fa-4x gold-trophy"></i>
                            <div class="trophy-shine"></div>
                        </div>
                    `;
                    this.allPlayerResults.innerHTML = '';
                    sortedPlayers.forEach(player => {
                        const playerItem = document.createElement('div');
                        playerItem.className = 'player-result-item';
                        const playerName = document.createElement('div');
                        playerName.className = 'player-result-name';
                        playerName.textContent = player.name;
                        const playerScore = document.createElement('div');
                        playerScore.className = 'player-result-score';
                        playerScore.textContent = `${player.score}/${totalQuestions}`;
                        playerItem.appendChild(playerName);
                        playerItem.appendChild(playerScore);
                        this.allPlayerResults.appendChild(playerItem);
                    });
                    if (winner.id === this.userId) {
                        this.showConfetti();
                    }
                    this.winnerScreen.style.display = 'flex';
                    const victorySound = document.getElementById('sound-victory');
                    if (victorySound) {
                        victorySound.play().catch(e => console.log('Ses çalma hatası:', e));
                    }
                } else {
                    // Kaybeden modalı oluştur
                    let loserModal = document.getElementById('loser-modal');
                    if (!loserModal) {
                        loserModal = document.createElement('div');
                        loserModal.id = 'loser-modal';
                        loserModal.className = 'loser-container';
                        loserModal.innerHTML = `
                            <div class="loser-content">
                                <h2>Kaybettin!</h2>
                                <div class="loser-icon"><i class="fas fa-sad-tear"></i></div>
                                <div class="loser-message">Daha iyisini yapabilirsin!<br>Yeniden denemek ister misin?</div>
                                <div class="loser-actions">
                                    <button id="loser-play-again" class="btn-primary"><i class="fas fa-redo"></i> Tekrar Oyna</button>
                                    <button id="loser-back-menu" class="btn-secondary"><i class="fas fa-home"></i> Ana Menü</button>
                                </div>
                            </div>
                        `;
                        document.body.appendChild(loserModal);
                    } else {
                        loserModal.style.display = 'flex';
                    }
                    // Butonlara event ekle
                    document.getElementById('loser-play-again').onclick = () => {
                        loserModal.style.display = 'none';
                        this.resetRoomState();
                        this.roomNameInput.value = 'Yeni Oyun';
                        this.createRoom();
                    };
                    document.getElementById('loser-back-menu').onclick = () => {
                        loserModal.style.display = 'none';
                        this.resetRoomState();
                        this.mainMenu.style.display = 'block';
                    };
                }
            })
            .catch(error => {
                console.error('Oyuncu verilerini alma hatası:', error);
            });
    },
    
    // Konfeti efekti göster
    showConfetti: function() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const confettiCount = 200;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 5 + 's';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            document.body.appendChild(confetti);
            
            // 5 saniye sonra konfeti elementini kaldır
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
        
        // Konfeti animasyonunu CSS olarak ekle
        const style = document.createElement('style');
        style.innerHTML = `
            .confetti {
                animation: confetti-fall 5s linear forwards;
                position: fixed;
                top: -10px;
                width: 10px;
                height: 10px;
                opacity: 1;
                z-index: 1001;
                transform: rotate(0deg);
            }
            
            @keyframes confetti-fall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    },
    
    // Lider tablosunu yükle
    loadLeaderboard: function() {
        const category = this.leaderboardCategory.value;
        const timeFilter = this.leaderboardTime.value;
        
        console.log(`Lider tablosu yükleniyor: Kategori=${category}, Zaman=${timeFilter}`);
        
        // Yükleme göstergesi ekle
        this.leaderboardList.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Yükleniyor...</div>';
        
        // Zaman filtresini uygula
        let timeLimit = 0; // Tüm zamanlar için
        const now = new Date();
        switch (timeFilter) {
            case 'daily':
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                timeLimit = yesterday.getTime();
                break;
            case 'weekly':
                const lastWeek = new Date(now);
                lastWeek.setDate(lastWeek.getDate() - 7);
                timeLimit = lastWeek.getTime();
                break;
            case 'monthly':
                const lastMonth = new Date(now);
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                timeLimit = lastMonth.getTime();
                break;
        }
        
        // Firebase Realtime Database ve Firestore'dan verileri yükle
        const promises = [];
        
        // 1. Realtime Database'den yükle
        let realtimeDbEntries = [];
        let leaderboardRef;
        
        // Kategori filtresini uygula
        if (category === 'all') {
            leaderboardRef = firebase.database().ref('leaderboard');
        } else {
            leaderboardRef = firebase.database().ref(`categoryLeaderboard/${category}`);
        }
        
        // Son 100 kaydı yükle
        let query = leaderboardRef.orderByChild('timestamp').limitToLast(100);
        
        promises.push(
            query.once('value')
                .then(snapshot => {
                    snapshot.forEach(childSnapshot => {
                        const entry = childSnapshot.val();
                        entry.id = childSnapshot.key; // Benzersiz kimlik ekle
                        
                        // Zaman filtresi uygula
                        if (timeLimit === 0 || entry.timestamp >= timeLimit) {
                            realtimeDbEntries.push(entry);
                        }
                    });
                    console.log(`Realtime Database'den ${realtimeDbEntries.length} kayıt yüklendi`);
                })
                .catch(error => {
                    console.error('Realtime Database lider tablosu yükleme hatası:', error);
                })
        );
        
        // 2. Firestore'dan yükle (her zaman kontrol et)
        let firestoreEntries = [];
        if (typeof firebase.firestore === 'function') {
            try {
                // Ana koleksiyon referansı
                let firestoreQuery = firebase.firestore().collection('highScores');
                
                // Filtreleri uygula
                if (category !== 'all') {
                    firestoreQuery = firestoreQuery.where('category', '==', category);
                }
                
                if (timeLimit > 0) {
                    // Firestore'da timestamp formatına dönüştürülmüş bir tarih gerekiyor
                    const limitDate = new Date(timeLimit);
                    firestoreQuery = firestoreQuery.where('timestamp', '>=', limitDate);
                }
                
                // Son 100 kaydı yükle
                firestoreQuery = firestoreQuery.orderBy('timestamp', 'desc').limit(100);
                
                promises.push(
                    firestoreQuery.get()
                        .then(querySnapshot => {
                            querySnapshot.forEach(doc => {
                                const entry = doc.data();
                                entry.id = doc.id; // Benzersiz kimlik ekle
                                
                                // Puanlar doğru anahtar isimleriyle mevcut değilse dönüştür
                                if (entry.score !== undefined && entry.totalQuestions !== undefined) {
                                    // Verileri standartlaştırılmış formata dönüştür
                                    firestoreEntries.push({
                                        id: entry.id,
                                        score: entry.score,
                                        totalQuestions: entry.totalQuestions,
                                        category: entry.category,
                                        username: entry.username,
                                        userId: entry.userId,
                                        timestamp: entry.timestamp ? entry.timestamp.toDate().getTime() : Date.now(),
                                        isFirestore: true
                                    });
                                }
                            });
                            console.log(`Firestore'dan ${firestoreEntries.length} kayıt yüklendi`);
                        })
                        .catch(error => {
                            console.error('Firestore lider tablosu yükleme hatası:', error);
                        })
                );
            } catch (error) {
                console.error('Firestore sorgu oluşturma hatası:', error);
            }
        }
        
        Promise.all(promises)
            .then(() => {
                // Tüm kayıtları birleştir
                let allEntries = [];
                
                // Realtime Database kayıtlarını standart formata dönüştür
                realtimeDbEntries.forEach(entry => {
                    allEntries.push({
                        id: entry.id,
                        score: entry.score,
                        totalQuestions: entry.total || entry.questions?.length || 10,
                        category: entry.category,
                        username: entry.username,
                        userId: entry.userId,
                        timestamp: entry.timestamp || Date.now(),
                        isRealtime: true
                    });
                });
                
                // Firestore kayıtlarını ekle (zaten standart formatta)
                allEntries = [...allEntries, ...firestoreEntries];
                
                console.log(`Toplam ${allEntries.length} kayıt birleştirildi`);
                
                // Aynı kullanıcının çoklu girişlerini işle: her kullanıcı için en yüksek skoru tut
                const userBestScores = {};
                
                allEntries.forEach(entry => {
                    const userId = entry.userId || 'anonymous';
                    const userKey = `${userId}_${entry.category}`; // Her kategori için ayrı kayıt tut
                    
                    if (!userBestScores[userKey] || 
                        (entry.score / entry.totalQuestions) > (userBestScores[userKey].score / userBestScores[userKey].totalQuestions)) {
                        userBestScores[userKey] = entry;
                    }
                });
                
                // Tekrarları çıkarılmış listeyi oluştur
                const uniqueEntries = Object.values(userBestScores);
                
                // Skora göre sırala (büyükten küçüğe)
                uniqueEntries.sort((a, b) => {
                    // Önce doğru/toplam oranına göre sırala
                    const aRatio = a.score / a.totalQuestions;
                    const bRatio = b.score / b.totalQuestions;
                    
                    if (bRatio !== aRatio) {
                        return bRatio - aRatio;
                    }
                    
                    // Oranlar eşitse, toplam skora göre sırala
                    return b.score - a.score;
                });
                
                // En fazla 20 sonuç göster
                const topEntries = uniqueEntries.slice(0, 20);
                console.log(`Filtrelerden sonra gösterilen kayıt sayısı: ${topEntries.length}`);
                
                // Lider tablosunu güncelle
                this.updateLeaderboardUI(topEntries);
            })
            .catch(error => {
                console.error('Lider tablosu yükleme işlemi sırasında hata oluştu:', error);
                this.leaderboardList.innerHTML = '<div class="error-message">Lider tablosu yüklenirken hata oluştu.</div>';
            });
    },
    
    // Lider tablosu UI'ını güncelle
    updateLeaderboardUI: function(entries) {
        this.leaderboardList.innerHTML = '';
        
        if (entries.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'leaderboard-empty';
            emptyMessage.innerHTML = '<i class="fas fa-trophy"></i> Bu kategoride henüz bir skor kaydedilmemiş. İlk siz olun!';
            this.leaderboardList.appendChild(emptyMessage);
            return;
        }
        
        // Başlık satırı ekle
        const headerRow = document.createElement('div');
        headerRow.className = 'leaderboard-header';
        headerRow.innerHTML = `
            <div class="leaderboard-rank">${this.translateText('leaderboard_rank', 'Sıra')}</div>
            <div class="leaderboard-user">${this.translateText('leaderboard_user', 'Oyuncu')}</div>
            <div class="leaderboard-category">${this.translateText('leaderboard_category', 'Kategori')}</div>
            <div class="leaderboard-score">${this.translateText('leaderboard_score', 'Puan')}</div>
            <div class="leaderboard-date">${this.translateText('leaderboard_date', 'Tarih')}</div>
        `;
        this.leaderboardList.appendChild(headerRow);
        
        // Şu anki kullanıcının ID'sini al
        const currentUser = firebase.auth && firebase.auth().currentUser;
        const currentUserId = currentUser ? currentUser.uid : null;
        
        // Skorları listele
        entries.forEach((entry, index) => {
            const listItem = document.createElement('div');
            listItem.className = 'leaderboard-item';
            
            // Eğer bu kayıt şu anki kullanıcıya aitse özellikle vurgula
            if (currentUserId && entry.userId === currentUserId) {
                listItem.classList.add('current-user');
            }
            
            // Sıra
            const rank = document.createElement('div');
            rank.className = 'leaderboard-rank';
            
            // İlk 3 için özel simgeler
            if (index === 0) {
                rank.innerHTML = '<i class="fas fa-medal gold"></i>'; // Altın madalya
            } else if (index === 1) {
                rank.innerHTML = '<i class="fas fa-medal silver"></i>'; // Gümüş madalya
            } else if (index === 2) {
                rank.innerHTML = '<i class="fas fa-medal bronze"></i>'; // Bronz madalya
            } else {
                rank.textContent = index + 1;
            }
            
            // Kullanıcı bilgileri
            const userInfo = document.createElement('div');
            userInfo.className = 'leaderboard-user';
            
            // Kullanıcı adı
            const username = document.createElement('div');
            username.className = 'leaderboard-username';
            let displayName = entry.username || 'Anonim';
            
            // Mevcut kullanıcıyı özel işaretle
            if (currentUserId && entry.userId === currentUserId) {
                displayName += ' (Siz)';
                username.classList.add('current-user-name');
            }
            username.textContent = displayName;
            
            userInfo.appendChild(username);
            
            // Kategori
            const category = document.createElement('div');
            category.className = 'leaderboard-category';
            category.textContent = entry.category || 'Genel';
            
            // Puan
            const score = document.createElement('div');
            score.className = 'leaderboard-score';
            
            // Puan yüzdesi hesapla
            const scorePercent = Math.round((entry.score / entry.totalQuestions) * 100);
            
            // Puanı göster
            score.innerHTML = `
                <span class="score-value">${entry.score}/${entry.totalQuestions}</span>
                <span class="score-percent">(${scorePercent}%)</span>
            `;
            
            // Başarı yüzdesine göre renk
            if (scorePercent >= 90) {
                score.classList.add('excellent-score');
            } else if (scorePercent >= 75) {
                score.classList.add('good-score');
            } else if (scorePercent >= 50) {
                score.classList.add('average-score');
            }
            
            // Tarih
            const date = document.createElement('div');
            date.className = 'leaderboard-date';
            
            // Timestamp'i düzgün formatlı tarihe dönüştür
            let formattedDate = 'Bilinmiyor';
            try {
                if (entry.timestamp) {
                    // Timestamp milisaniye cinsinden olabilir veya Firestore timestamp nesnesi olabilir
                    const dateObj = typeof entry.timestamp === 'number' 
                        ? new Date(entry.timestamp)
                        : (typeof entry.timestamp.toDate === 'function' 
                            ? entry.timestamp.toDate() 
                            : new Date(entry.timestamp));
                    
                    // Tarih formatla - DD.MM.YYYY formatı
                    formattedDate = dateObj.toLocaleDateString('tr-TR');
                }
            } catch (e) {
                console.error('Tarih dönüştürme hatası:', e, entry.timestamp);
            }
            
            date.textContent = formattedDate;
            
            // Tüm bileşenleri satıra ekle
            listItem.appendChild(rank);
            listItem.appendChild(userInfo);
            listItem.appendChild(category);
            listItem.appendChild(score);
            listItem.appendChild(date);
            
            // Satırı listeye ekle
            this.leaderboardList.appendChild(listItem);
        });
        
        // Lider tablosunu yenileme butonu
        const refreshButton = document.createElement('button');
        refreshButton.className = 'leaderboard-refresh-btn';
        refreshButton.innerHTML = `<i class="fas fa-sync-alt"></i> ${this.translateText('leaderboard_refresh', 'Yenile')}`;
        refreshButton.setAttribute('data-i18n-button', 'leaderboard_refresh');
        refreshButton.addEventListener('click', () => this.loadLeaderboard());
        
        this.leaderboardList.appendChild(refreshButton);
    },
    
    // Bildirim toast mesajı göster
    showToast: function(message, type = 'info') {
        // Toast div'i var mı kontrol et, yoksa oluştur
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Toast elementi oluştur
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Toast'u container'a ekle
        toastContainer.appendChild(toast);
        
        // Toast'u göster
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Toast'u kaldır
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    },
    
    // Chat mesajı gönder
    sendChatMessage: function() {
        if (!this.roomRef || !this.currentRoom) return;
        
        // Kullanıcı chat kurallarını kabul etmiş mi kontrolü
        if (!this.chatConsented) {
            this.showToast('Mesaj göndermek için önce sohbet kurallarını kabul etmelisiniz.', 'warning');
            return;
        }
        
        const messageText = this.chatInput.value.trim();
        if (!messageText) return;
        
        // Mesajı küfür/uygunsuz içerik kontrolünden geçir
        const { isClean, text: filteredText } = this.checkMessageContent(messageText);
        
        // Mesaj temiz değilse uyar ve kullanıcıya bilgi ver
        if (!isClean) {
            this.showToast('Uygunsuz içerik tespit edildi! Mesajınız filtrelendi ve yöneticiye bildirildi.', 'error');
        }
        
        // Benzersiz mesaj ID'si oluştur
        const messageId = this.generateUniqueId();
        
        // Mesaj verisini oluştur
        const chatMessage = {
            messageId: messageId,
            senderId: this.userId,
            senderName: this.username,
            text: filteredText, // Filtrelenmiş metni kullan
            originalText: messageText, // Orijinal metni de sakla (moderasyon için)
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            isSystemMessage: false,
            isFiltered: !isClean
        };
        
        // Mesajı veritabanına kaydet - Firebase dinleyiciler mesajı gösterecek
        this.roomRef.child('chat').push(chatMessage)
            .then(() => {
                // Sadece input alanını temizle, mesajı eklemiyoruz çünkü Firebase dinleyicisi ekleyecek
                this.chatInput.value = ''; 
                
                // Mesaj gönderildiğinde ses efekti
                const chatSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354.wav');
                chatSound.volume = 0.3;
                chatSound.play().catch(e => console.log('Ses çalma hatası:', e));
            })
            .catch(error => {
                console.error('Mesaj gönderme hatası:', error);
                this.showToast('Mesaj gönderilemedi: ' + error.message, 'error');
            });
    },
    
    // Chat mesajını görüntüle
    displayChatMessage: function(message) {
        const isCurrentUser = message.senderId === this.userId;
        const isSystemMessage = message.isSystemMessage;
        
        // Engellenmiş kullanıcı kontrolü
        if (!isSystemMessage && !isCurrentUser) {
            const isBlocked = this.blockedUsers.some(user => user.id === message.senderId);
            if (isBlocked) return; // Engellenen kullanıcının mesajını gösterme
        }
        
        const messageElement = document.createElement('div');
        
        // Mesaj ID ve kullanıcı bilgilerini veri öznitelikleri olarak ekle
        if (message.messageId) {
            messageElement.dataset.messageId = message.messageId;
        } else {
            messageElement.dataset.messageId = this.generateUniqueId(); // ID yoksa yeni oluştur
        }
        
        if (message.senderId) {
            messageElement.dataset.senderId = message.senderId;
            messageElement.dataset.senderName = message.senderName;
        }
        
        // Sistem mesajı ise farklı stil uygula
        if (isSystemMessage) {
            messageElement.className = 'system-message';
            messageElement.textContent = message.text;
        } else {
            // Bildirilmiş mesaj kontrolü
            const isReported = this.reportedMessages.some(reportedMsg => reportedMsg.messageId === message.messageId);
            
            // Temel mesaj sınıfları
            messageElement.className = `chat-message ${isCurrentUser ? 'message-outgoing' : 'message-incoming'}`;
            
            // Ek durum sınıfları
            if (isReported) messageElement.classList.add('message-reported');
            if (message.isFiltered) messageElement.classList.add('message-filtered');
            
            // Gönderen ismini sadece başkaları için göster
            if (!isCurrentUser) {
                const senderElement = document.createElement('div');
                senderElement.className = 'message-sender';
                senderElement.textContent = message.senderName;
                messageElement.appendChild(senderElement);
            }
            
            const textElement = document.createElement('div');
            textElement.className = 'message-text';
            textElement.textContent = message.text;
            messageElement.appendChild(textElement);
            
            // Zaman bilgisi ekle
            if (message.timestamp) {
                const timeElement = document.createElement('div');
                timeElement.className = 'message-time';
                
                // Unix timestamp'i saat ve dakika olarak formatla
                const date = new Date(message.timestamp);
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                timeElement.textContent = `${hours}:${minutes}`;
                
                messageElement.appendChild(timeElement);
            }
        }
        
        this.chatMessages.appendChild(messageElement);
        
        // Otomatik olarak en alta kaydır
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    },
    
    // Sistem mesajı gönder (oyun durumu bildirimleri)
    sendSystemMessage: function(message) {
        if (!this.chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('system-message');
        messageElement.innerHTML = '<i class="fas fa-info-circle"></i> ' + message;
        this.chatMessages.appendChild(messageElement);
        
        // Mesaj gönderildikten sonra otomatik olarak en aşağı kaydır
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        // Ayrıca oyun içi sohbete de gönder (oyun başladıysa)
        if (this.gameStarted && this.gameChatMessages) {
            const gameMessageElement = document.createElement('div');
            gameMessageElement.classList.add('system-message');
            gameMessageElement.innerHTML = '<i class="fas fa-info-circle"></i> ' + message;
            this.gameChatMessages.appendChild(gameMessageElement);
            this.gameChatMessages.scrollTop = this.gameChatMessages.scrollHeight;
        }
    },
    
    // Çeviri ile sistem mesajını göster
    sendLocalizedSystemMessage: function(messageKey, replacements = {}) {
        // Mesajı i18n sisteminden al
        let message = '';
        const currentLang = window.quizApp && window.quizApp.currentLanguage ? window.quizApp.currentLanguage : 'tr';
        
        // Önce languages nesnesinden çeviriyi almaya çalış
        if (window.languages && window.languages[currentLang] && window.languages[currentLang][messageKey]) {
            message = window.languages[currentLang][messageKey];
        } else {
            // Eğer bulunamazsa, anahtar değerini kullan
            message = messageKey;
        }
        
        // Değişkenleri yerleştir
        for (const [key, value] of Object.entries(replacements)) {
            message = message.replace(`{${key}}`, value);
        }
        
        // Mesajı gönder
        this.sendSystemMessage(message);
    },
    
    // Kategori seçim sayfasını göster
    showCategorySelector: function() {
        // Online oyun sayfasını gizle
        this.onlineGameContainer.style.display = 'none';
        // Kategori sayfasını göster
        window.quizApp.categorySelectionElement.style.display = 'block';
    },
    
    // Kategori soruları oluştur (Var olan alternatif fonksiyon)
    generateCategoryQuestions: function(selectedCategory) {
        if (!window.quizApp.allQuestionsData) {
            console.error("quizApp.allQuestionsData tanımlı değil. Varsayılan soru verileri kullanılacak.");
            window.quizApp.loadDefaultQuestions();
            window.quizApp.allQuestionsData = window.quizApp.questionsData;
        }
        
        const categories = Object.keys(window.quizApp.allQuestionsData || {});
        if (!categories.includes(selectedCategory)) {
            window.quizApp.loadDefaultQuestions();
            window.quizApp.allQuestionsData = window.quizApp.questionsData;
        }
        
        // Seçilen kategorideki tüm soruları al
        const allCategoryQuestions = window.quizApp.allQuestionsData[selectedCategory];
    },
    
    // Oyun içi chat mesajı gönder
    sendGameChatMessage: function() {
        if (!this.roomRef || !this.gameStarted) return;
        
        // Kullanıcı chat kurallarını kabul etmiş mi kontrolü
        if (!this.chatConsented) {
            this.showToast('Lütfen sohbet kurallarını okuyup kabul edin. Uygunsuz içerik yasaktır.', 'warning');
            this.showChatRules(); // Kuralları otomatik göster
            return;
        }
        
        const messageText = this.gameChatInput.value.trim();
        if (!messageText) return;
        
        // Mesajı küfür/uygunsuz içerik kontrolünden geçir
        const { isClean, text: filteredText } = this.checkMessageContent(messageText);
        
        // Mesaj temiz değilse uyar ve kullanıcıya bilgi ver
        if (!isClean) {
            this.showToast('Uygunsuz içerik tespit edildi! Mesajınız filtrelendi ve yöneticiye bildirildi.', 'error');
        }
        
        // Benzersiz mesaj ID'si oluştur
        const messageId = this.generateUniqueId();
        
        // Mesaj verisini oluştur
        const chatMessage = {
            messageId: messageId,
            senderId: this.userId,
            senderName: this.username,
            text: filteredText, // Filtrelenmiş metni kullan
            originalText: messageText, // Orijinal metni de sakla (moderasyon için)
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            isSystemMessage: false,
            isFiltered: !isClean,
            isGameMessage: true // Oyun içi mesaj olduğunu belirt
        };
        
        // Mesajı veritabanına kaydet - Firebase dinleyiciler mesajı gösterecek
        this.roomRef.child('gameChat').push(chatMessage)
            .then(() => {
                // Sadece input alanını temizle, mesajı eklemiyoruz çünkü Firebase dinleyicisi ekleyecek
                this.gameChatInput.value = ''; 
                
                // Mesaj gönderildiğinde ses efekti
                const chatSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354.wav');
                chatSound.volume = 0.3;
                chatSound.play().catch(e => console.log('Ses çalma hatası:', e));
            })
            .catch(error => {
                console.error('Oyun içi mesaj gönderme hatası:', error);
                this.showToast('Mesaj gönderilemedi: ' + error.message, 'error');
            });
    },
    
    // Oyun içi chat mesajını görüntüle
    displayGameChatMessage: function(message) {
        const isCurrentUser = message.senderId === this.userId;
        const isSystemMessage = message.isSystemMessage;
        
        // Engellenmiş kullanıcı kontrolü
        if (!isSystemMessage && !isCurrentUser) {
            const isBlocked = this.blockedUsers.some(user => user.id === message.senderId);
            if (isBlocked) return; // Engellenen kullanıcının mesajını gösterme
        }
        
        const messageElement = document.createElement('div');
        
        // Mesaj ID ve kullanıcı bilgilerini veri öznitelikleri olarak ekle
        if (message.messageId) {
            messageElement.dataset.messageId = message.messageId;
        } else {
            messageElement.dataset.messageId = this.generateUniqueId(); // ID yoksa yeni oluştur
        }
        
        if (message.senderId) {
            messageElement.dataset.senderId = message.senderId;
            messageElement.dataset.senderName = message.senderName;
        }
        
        // Sistem mesajı ise farklı stil uygula
        if (isSystemMessage) {
            messageElement.className = 'system-message';
            messageElement.textContent = message.text;
        } else {
            // Bildirilmiş mesaj kontrolü
            const isReported = this.reportedMessages.some(reportedMsg => reportedMsg.messageId === message.messageId);
            
            // Temel mesaj sınıfları
            messageElement.className = `chat-message ${isCurrentUser ? 'message-outgoing' : 'message-incoming'}`;
            
            // Gönderen ismini sadece başkaları için göster
            if (!isCurrentUser) {
                const senderElement = document.createElement('div');
                senderElement.className = 'message-sender';
                senderElement.textContent = message.senderName;
                messageElement.appendChild(senderElement);
            }
            
            const textElement = document.createElement('div');
            textElement.className = 'message-text';
            textElement.textContent = message.text;
            messageElement.appendChild(textElement);
            
            // Zaman bilgisi ekle
            if (message.timestamp) {
                const timeElement = document.createElement('div');
                timeElement.className = 'message-time';
                
                // Unix timestamp'i saat ve dakika olarak formatla
                const date = new Date(message.timestamp);
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                timeElement.textContent = `${hours}:${minutes}`;
                
                messageElement.appendChild(timeElement);
            }
        }
        
        this.gameChatMessages.appendChild(messageElement);
        
        // Otomatik olarak en alta kaydır
        this.gameChatMessages.scrollTop = this.gameChatMessages.scrollHeight;
    },
    
    // Benzersiz ID oluştur
    generateUniqueId: function() {
        // RFC4122 sürüm 4 UUID oluştur (Basitleştirilmiş)
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    },
    
    // Yardımcı çeviri fonksiyonu (i18n.translate yerine)
    translateText: function(key, defaultText = '') {
        const currentLang = window.quizApp && window.quizApp.currentLanguage ? window.quizApp.currentLanguage : 'tr';
        
        // Önce languages objesinden çeviriyi al
        if (window.languages && window.languages[currentLang] && window.languages[currentLang][key]) {
            return window.languages[currentLang][key];
        }
        
        // Bulunamazsa varsayılan metni döndür
        return defaultText || key;
    }
};

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    onlineGame.init();
    
    // Yenileme butonu için dinleyici
    const refreshBtn = document.getElementById('refresh-leaderboard');
    if (refreshBtn) {
        console.log("Yenileme butonu bulundu, dinleyici ekleniyor");
        refreshBtn.addEventListener('click', () => {
            console.log("Yenileme butonu tıklandı");
            // Yenileme animasyonu
            refreshBtn.classList.add('rotating');
            // Lider tablosunu yenile
            onlineGame.loadLeaderboard();
            // 1 saniye sonra animasyonu kaldır
            setTimeout(() => {
                refreshBtn.classList.remove('rotating');
            }, 1000);
        });
    } else {
        console.warn("Yenileme butonu bulunamadı! ID kontrol edin: refresh-leaderboard");
    }
}); 

// Not: Dil değişikliği için event listener artık init fonksiyonu içerisinde tanımlanmaktadır. 