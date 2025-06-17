// friends.js - Arkadaş ekleme, listeleme ve davet sistemi

const friendsModule = {
    // DOM elemanları
    friendsContainer: null,
    searchResultsContainer: null,
    friendRequestsContainer: null,
    
    // Değişkenler
    currentUserId: null,
    friendsList: [],
    friendRequests: [],
    
    // Firebase referansları
    db: null,
    
    // Arkadaş sistemi başlangıç fonksiyonu
    init: function() {
        if (!firebase.auth || !firebase.firestore) {
            console.error("Firebase kimlik doğrulama veya firestore yüklenemedi!");
            return;
        }
        
        this.db = firebase.firestore();
        
        // Mevcut kullanıcı kontrolü
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.currentUserId = user.uid;
                // Kullanıcı verilerini kontrol et ve düzelt
                this.checkAndFixUserData();
                // Arkadaş verilerini yükle
                this.loadFriends();
                this.loadFriendRequests();
                // Davet sistemi kurulumu
                this.setupInviteSystem();
            } else {
                console.log("Arkadaş sistemi için oturum açılması gerekiyor.");
            }
        });
    },
    
    // Arkadaş profil sayfasını göster
    showFriendsPage: function() {
        // Kullanıcı bilgilerini al
        const user = firebase.auth().currentUser;
        if (!user || user.isAnonymous) {
            alert('Arkadaşlarınızı görüntülemek için giriş yapmalısınız.');
            return;
        }
        
        // Tüm sayfaları gizle
        const elementsToHide = [
            'main-menu',
            'quiz',
            'category-selection',
            'result',
            'profile-page',
            'online-game-options',
            'global-leaderboard',
            'admin-panel'
        ];
        
        elementsToHide.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.style.display = 'none';
        });
        
        // Arkadaşlar sayfasını göster
        let friendsPage = document.getElementById('friends-page');
        if (!friendsPage) {
            // Arkadaşlar sayfası yoksa oluştur
            friendsPage = document.createElement('div');
            friendsPage.id = 'friends-page';
            friendsPage.className = 'page-content';
            document.body.appendChild(friendsPage);
        }
        
        // Arkadaş sayfası içeriğini oluştur
        friendsPage.innerHTML = `
            <div class="container friends-container">
                <div class="friends-header">
                    <h1>Arkadaşlarım</h1>
                    <button id="back-from-friends" class="btn-secondary" style="background: var(--btn-primary); color: white;"><i class="fas fa-arrow-left"></i> Ana Menüye Dön</button>
                </div>
                
                <div class="search-section">
                    <h2>Arkadaş Ara</h2>
                    <div class="search-box">
                        <input type="text" id="friend-search" placeholder="Kullanıcı adı veya e-posta ile ara">
                        <button id="search-button" class="btn-primary" style="background: var(--primary-color); color: white;"><i class="fas fa-search"></i> Ara</button>
                    </div>
                    <div id="search-results" class="search-results"></div>
                </div>
                
                <div class="friend-requests-section">
                    <h2>Arkadaşlık İstekleri</h2>
                    <div id="friend-requests" class="friend-requests">
                        <p class="empty-message">Henüz arkadaşlık isteği yok.</p>
                    </div>
                </div>
                
                <div class="friends-list-section">
                    <h2>Arkadaş Listem</h2>
                    <div id="friends-list" class="friends-list">
                        <p class="empty-message">Henüz arkadaşınız yok.</p>
                    </div>
                </div>
            </div>
        `;
        
        friendsPage.style.display = 'block';
        
        // DOM referanslarını ayarla
        this.friendsContainer = document.getElementById('friends-list');
        this.searchResultsContainer = document.getElementById('search-results');
        this.friendRequestsContainer = document.getElementById('friend-requests');
        
        // Geri butonu için olay dinleyicisi
        document.getElementById('back-from-friends').addEventListener('click', () => {
            friendsPage.style.display = 'none';
            // Listener'ları temizle
            this.clearListeners();
            const mainMenu = document.getElementById('main-menu');
            if (mainMenu) mainMenu.style.display = 'block';
        });
        
        // Arama butonu için olay dinleyicisi
        document.getElementById('search-button').addEventListener('click', () => {
            const searchQuery = document.getElementById('friend-search').value.trim();
            if (searchQuery.length > 0) {
                this.searchUsers(searchQuery);
            }
        });
        
        // Enter tuşuna basıldığında da arama yap
        document.getElementById('friend-search').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchQuery = document.getElementById('friend-search').value.trim();
                if (searchQuery.length > 0) {
                    this.searchUsers(searchQuery);
                }
            }
        });
        
        // Arkadaşları ve arkadaşlık isteklerini yükle
        this.loadFriends();
        this.loadFriendRequests();
    },
    
    // Kullanıcı araması yap
    searchUsers: function(query) {
        if (!this.currentUserId) {
            this.searchResultsContainer.innerHTML = '<p class="error">Giriş yapmalısınız.</p>';
            return;
        }
        
        // Minimum karakter kontrolü
        if (query.length < 2 && !query.includes('@')) {
            this.searchResultsContainer.innerHTML = '<p class="info">En az 2 karakter girin veya tam email adresini yazın.</p>';
            return;
        }
        
        this.searchResultsContainer.innerHTML = '<p class="loading"><i class="fas fa-spinner fa-spin"></i> Aranıyor...</p>';
        
        // Kullanıcıları ara - displayName veya email ile
        const searchPromises = [];
        
        // displayName ile ara (eğer en az 2 karakter varsa)
        if (query.length >= 2) {
            searchPromises.push(
        this.db.collection('users')
            .where('displayNameLower', '>=', query.toLowerCase())
            .where('displayNameLower', '<=', query.toLowerCase() + '\uf8ff')
                    .limit(10)
                    .get()
            );
        }
        
        // email ile ara (eğer @ işareti varsa tam eşleşme)
        if (query.includes('@')) {
            searchPromises.push(
            this.db.collection('users')
                .where('email', '==', query.toLowerCase())
                .limit(5)
            .get()
            );
        }
        
        Promise.all(searchPromises)
            .then((results) => {
                this.searchResultsContainer.innerHTML = '';
                
                const foundUsers = new Map(); // Tekrar eden kullanıcıları önlemek için
                
                results.forEach(querySnapshot => {
                    querySnapshot.forEach((doc) => {
                        const userData = doc.data();
                        const userId = doc.id;
                        
                        // Kendisi hariç ve daha önce eklenmemiş kullanıcıları göster
                        if (userId !== this.currentUserId && !foundUsers.has(userId)) {
                            foundUsers.set(userId, userData);
                        }
                    });
                });
                
                if (foundUsers.size === 0) {
                    this.searchResultsContainer.innerHTML = '<p class="empty-message">Hiçbir kullanıcı bulunamadı. Farklı bir arama terimi deneyin.</p>';
                    return;
                }
                
                foundUsers.forEach((userData, userId) => {
                        const userElement = document.createElement('div');
                        userElement.className = 'user-item';
                        
                        // Zaten arkadaş mı, arkadaşlık isteği gönderilmiş mi kontrol et
                        const isFriend = this.friendsList.includes(userId);
                    const requestSent = this.checkPendingRequest(userId);
                        
                        let actionButton = '';
                        if (isFriend) {
                            actionButton = `<button class="btn-small btn-success" disabled style="background: var(--btn-success); color: white;"><i class="fas fa-check"></i> Arkadaş</button>`;
                        } else if (requestSent) {
                            actionButton = `<button class="btn-small btn-info" disabled style="background: var(--accent-color); color: white;"><i class="fas fa-clock"></i> İstek Gönderildi</button>`;
                        } else {
                            actionButton = `<button class="btn-small btn-primary add-friend-btn" data-user-id="${userId}" style="background: var(--primary-color); color: white;"><i class="fas fa-user-plus"></i> Ekle</button>`;
                        }
                        
                        userElement.innerHTML = `
                            <div class="user-info">
                                <i class="fas fa-user-circle"></i>
                            <span>${userData.displayName || userData.email || 'Kullanıcı'}</span>
                            </div>
                            <div class="user-actions">
                                ${actionButton}
                            </div>
                        `;
                        
                        this.searchResultsContainer.appendChild(userElement);
                });
                
                // Arkadaş ekle butonlarına olay dinleyicisi ekle
                this.addSearchEventListeners();
            })
            .catch((error) => {
                console.error("Kullanıcı arama hatası:", error);
                let errorMessage = 'Arama sırasında bir hata oluştu.';
                
                // Firestore güvenlik kuralları hatası kontrolü
                if (error.code === 'permission-denied') {
                    errorMessage = 'Kullanıcı arama için yetkiniz yok. Lütfen oturum açtığınızdan emin olun.';
                } else if (error.code === 'unavailable') {
                    errorMessage = 'Veritabanı şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
                }
                
                this.searchResultsContainer.innerHTML = `<p class="error">${errorMessage}</p>`;
            });
    },
    
    // Arama sonuçları için event listener'ları ekle
    addSearchEventListeners: function() {
        const addFriendButtons = document.querySelectorAll('.add-friend-btn');
        addFriendButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.target.closest('.add-friend-btn').getAttribute('data-user-id');
                this.sendFriendRequest(userId);
                
                // Butonu devre dışı bırak ve metnini değiştir
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-clock"></i> İstek Gönderildi';
                button.classList.replace('btn-primary', 'btn-info');
                button.style.background = 'var(--accent-color)';
            });
        });
    },
    
    // Bekleyen istek kontrolü (daha güvenilir)
    checkPendingRequest: function(userId) {
        // Önce local cache'den kontrol et
        const localCheck = this.friendRequests.some(request => 
            (request.senderId === this.currentUserId && request.receiverId === userId) ||
            (request.receiverId === this.currentUserId && request.senderId === userId)
        );
        
        return localCheck;
    },
    
    // Arkadaşlık isteği gönder
    sendFriendRequest: function(receiverId) {
        if (!this.currentUserId) return;
        
        // Doğrudan Firestore'a arkadaşlık isteği ekleme (Cloud Function yerine)
        const requestData = {
            senderId: this.currentUserId,
            receiverId: receiverId,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            senderDisplayName: firebase.auth().currentUser.displayName || firebase.auth().currentUser.email || 'Kullanıcı'
        };
        
        // Önce aynı istek daha önce gönderilmiş mi kontrol et
        this.db.collection('friendRequests')
            .where('senderId', '==', this.currentUserId)
            .where('receiverId', '==', receiverId)
            .where('status', '==', 'pending')
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    // Zaten bekleyen bir istek var
                    alert('Bu kişiye zaten arkadaşlık isteği gönderdiniz.');
                    return;
                }
                
                // Yeni istek ekle
                return this.db.collection('friendRequests').add(requestData);
            })
            .then((docRef) => {
                if (docRef) {
                    console.log('Arkadaşlık isteği gönderildi');
                    // İstek gönderimini hemen göster
                    this.showRequestSentNotification(receiverId);
                }
            })
            .catch(error => {
                console.error('Arkadaşlık isteği gönderirken hata:', error);
                        alert('Arkadaşlık isteği gönderilemedi. Lütfen daha sonra tekrar deneyin.');
            });
    },
    
    // İstek gönderildiğini görsel olarak göster
    showRequestSentNotification: function(userId) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = '<i class="fas fa-check-circle"></i> Arkadaşlık isteği gönderildi';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    },
    
    // Arkadaşlık isteğini kabul et
    acceptFriendRequest: function(requestId) {
        if (!this.currentUserId) return;
        
        this.db.collection('friendRequests').doc(requestId).update({
            status: 'accepted',
            acceptedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            console.log('Arkadaşlık isteği kabul edildi');
            
            // İlgili isteği bul
            this.db.collection('friendRequests').doc(requestId).get()
                .then((doc) => {
                    if (doc.exists) {
                        const requestData = doc.data();
                        const senderId = requestData.senderId;
                        
                        // Her iki kullanıcının arkadaş listelerine ekle
                        const batch = this.db.batch();
                        
                        // Alıcının arkadaşlarına göndereni ekle
                        const receiverRef = this.db.collection('users').doc(this.currentUserId);
                        batch.update(receiverRef, {
                            friends: firebase.firestore.FieldValue.arrayUnion(senderId)
                        });
                        
                        // Gönderenin arkadaşlarına alıcıyı ekle
                        const senderRef = this.db.collection('users').doc(senderId);
                        batch.update(senderRef, {
                            friends: firebase.firestore.FieldValue.arrayUnion(this.currentUserId)
                        });
                        
                        return batch.commit();
                    }
                })
                .then(() => {
                    // Arkadaşları ve istekleri yeniden yükle
                    this.loadFriends();
                    this.loadFriendRequests();
                });
        })
        .catch((error) => {
            console.error('Arkadaşlık isteği kabul edilirken hata:', error);
            alert('Arkadaşlık isteğini kabul ederken bir hata oluştu.');
        });
    },
    
    // Arkadaşlık isteğini reddet
    rejectFriendRequest: function(requestId) {
        if (!this.currentUserId) return;
        
        this.db.collection('friendRequests').doc(requestId).update({
            status: 'rejected',
            rejectedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            console.log('Arkadaşlık isteği reddedildi');
            // İstekleri yeniden yükle
            this.loadFriendRequests();
        })
        .catch((error) => {
            console.error('Arkadaşlık isteği reddedilirken hata:', error);
            alert('Arkadaşlık isteğini reddetme sırasında bir hata oluştu.');
        });
    },
    
    // Arkadaşı sil
    removeFriend: function(friendId) {
        if (!this.currentUserId) return;
        
        if (confirm('Bu arkadaşı listenizden çıkarmak istediğinize emin misiniz?')) {
            const batch = this.db.batch();
            
            // Kullanıcının arkadaş listesinden arkadaşı çıkar
            const userRef = this.db.collection('users').doc(this.currentUserId);
            batch.update(userRef, {
                friends: firebase.firestore.FieldValue.arrayRemove(friendId)
            });
            
            // Arkadaşın listesinden de kullanıcıyı çıkar
            const friendRef = this.db.collection('users').doc(friendId);
            batch.update(friendRef, {
                friends: firebase.firestore.FieldValue.arrayRemove(this.currentUserId)
            });
            
            batch.commit()
                .then(() => {
                    console.log('Arkadaş silindi');
                    this.loadFriends();
                })
                .catch((error) => {
                    console.error('Arkadaş silme hatası:', error);
                    alert('Arkadaş silme sırasında bir hata oluştu.');
                });
        }
    },
    
    // Arkadaş listesini yükle
    loadFriends: function() {
        if (!this.currentUserId || !this.friendsContainer) return;
        
        this.friendsContainer.innerHTML = '<p class="loading"><i class="fas fa-spinner fa-spin"></i> Arkadaş listesi yükleniyor...</p>';
        
        this.db.collection('users').doc(this.currentUserId).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    this.friendsList = userData.friends || [];
                    
                    if (this.friendsList.length === 0) {
                        this.friendsContainer.innerHTML = '<p class="empty-message">Henüz arkadaşınız yok.</p>';
                        return;
                    }
                    
                    this.friendsContainer.innerHTML = '';
                    
                    // Tüm arkadaş bilgilerini paralel olarak çek
                    const friendPromises = this.friendsList.map(friendId => 
                        this.db.collection('users').doc(friendId).get()
                    );
                    
                    Promise.all(friendPromises)
                        .then((friendDocs) => {
                            friendDocs.forEach((friendDoc, index) => {
                                if (friendDoc.exists) {
                                    const friendData = friendDoc.data();
                                    const friendId = this.friendsList[index];
                                    
                                    const friendElement = document.createElement('div');
                                    friendElement.className = 'friend-item';
                                    friendElement.innerHTML = `
                                        <div class="friend-info">
                                            <i class="fas fa-user-circle"></i>
                                            <span>${friendData.displayName || friendData.email || 'Kullanıcı'}</span>
                                        </div>
                                        <div class="friend-actions">
                                            <button class="btn-small btn-primary invite-btn" data-user-id="${friendId}" style="background: var(--primary-color); color: white;">
                                                <i class="fas fa-gamepad"></i> Oyuna Davet Et
                                            </button>
                                            <button class="btn-small btn-danger remove-friend-btn" data-user-id="${friendId}" style="background: var(--wrong-color); color: white;">
                                                <i class="fas fa-user-minus"></i> Çıkar
                                            </button>
                                        </div>
                                    `;
                                    
                                    this.friendsContainer.appendChild(friendElement);
                                }
                            });
                            
                            // Event listener'ları hemen ekle (timeout olmadan)
                            this.addFriendsEventListeners();
                        })
                        .catch((error) => {
                            console.error('Arkadaş bilgileri yüklenirken hata:', error);
                            this.friendsContainer.innerHTML = '<p class="error">Arkadaş bilgileri yüklenemedi.</p>';
                            });
                } else {
                    this.friendsContainer.innerHTML = '<p class="error">Kullanıcı bilgileri alınamadı.</p>';
                }
            })
            .catch((error) => {
                console.error('Arkadaş listesi yüklenirken hata:', error);
                this.friendsContainer.innerHTML = '<p class="error">Arkadaş listesi yüklenirken bir hata oluştu.</p>';
            });
    },
    
    // Arkadaş listesi için event listener'ları ekle
    addFriendsEventListeners: function() {
        // Arkadaş silme butonlarına olay dinleyicisi ekle
        const removeFriendButtons = document.querySelectorAll('.remove-friend-btn');
        removeFriendButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const friendId = e.target.closest('.remove-friend-btn').getAttribute('data-user-id');
                this.removeFriend(friendId);
            });
        });
        
        // Oyuna davet etme butonlarına olay dinleyicisi ekle
        const inviteButtons = document.querySelectorAll('.invite-btn');
        inviteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const friendId = e.target.closest('.invite-btn').getAttribute('data-user-id');
                this.inviteToGame(friendId);
            });
            });
    },
    
    // Arkadaşlık isteklerini yükle
    loadFriendRequests: function() {
        if (!this.currentUserId || !this.friendRequestsContainer) return;
        
        this.friendRequestsContainer.innerHTML = '<p class="loading"><i class="fas fa-spinner fa-spin"></i> İstekler yükleniyor...</p>';
        
        this.db.collection('friendRequests')
            .where('receiverId', '==', this.currentUserId)
            .where('status', '==', 'pending')
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    this.friendRequestsContainer.innerHTML = '<p class="empty-message">Henüz arkadaşlık isteği yok.</p>';
                    return;
                }
                
                this.friendRequestsContainer.innerHTML = '';
                this.friendRequests = [];
                
                // Tüm gönderen bilgilerini paralel olarak çek
                const requestPromises = [];
                querySnapshot.forEach((doc) => {
                    const requestData = doc.data();
                    const requestId = doc.id;
                    this.friendRequests.push({ ...requestData, id: requestId });
                    
                    requestPromises.push(
                    this.db.collection('users').doc(requestData.senderId).get()
                            .then(senderDoc => ({ requestData, requestId, senderDoc }))
                    );
                });
                
                Promise.all(requestPromises)
                    .then((results) => {
                        results.forEach(({ requestData, requestId, senderDoc }) => {
                            if (senderDoc.exists) {
                                const senderData = senderDoc.data();
                                const requestElement = document.createElement('div');
                                requestElement.className = 'request-item';
                                requestElement.innerHTML = `
                                    <div class="sender-info">
                                        <i class="fas fa-user-circle"></i>
                                        <span>${senderData.displayName || senderData.email || 'Kullanıcı'}</span>
                                    </div>
                                    <div class="request-actions">
                                        <button class="btn-small btn-success accept-btn" data-request-id="${requestId}" style="background: var(--btn-success); color: white;">
                                            <i class="fas fa-check"></i> Kabul Et
                                        </button>
                                        <button class="btn-small btn-danger reject-btn" data-request-id="${requestId}" style="background: var(--wrong-color); color: white;">
                                            <i class="fas fa-times"></i> Reddet
                                        </button>
                                    </div>
                                `;
                                
                                this.friendRequestsContainer.appendChild(requestElement);
                            }
                        });
                        
                        // Event listener'ları hemen ekle (timeout olmadan)
                        this.addRequestsEventListeners();
                    })
                    .catch((error) => {
                        console.error('İstek gönderen bilgileri yüklenirken hata:', error);
                        this.friendRequestsContainer.innerHTML = '<p class="error">İstek bilgileri yüklenemedi.</p>';
                        });
            })
            .catch((error) => {
                console.error('Arkadaşlık istekleri yüklenirken hata:', error);
                this.friendRequestsContainer.innerHTML = '<p class="error">Arkadaşlık istekleri yüklenirken bir hata oluştu.</p>';
            });
    },
    
    // Arkadaşlık istekleri için event listener'ları ekle
    addRequestsEventListeners: function() {
        // Kabul etme butonlarına olay dinleyicisi ekle
        const acceptButtons = document.querySelectorAll('.accept-btn');
        acceptButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const requestId = e.target.closest('.accept-btn').getAttribute('data-request-id');
                this.acceptFriendRequest(requestId);
            });
        });
        
        // Reddetme butonlarına olay dinleyicisi ekle
        const rejectButtons = document.querySelectorAll('.reject-btn');
        rejectButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const requestId = e.target.closest('.reject-btn').getAttribute('data-request-id');
                this.rejectFriendRequest(requestId);
            });
        });
    },
    
    // Arkadaşı oyuna davet et
    inviteToGame: function(friendId) {
        if (!this.currentUserId) return;
        
        // Kullanıcı zaten bir odadaysa, o odanın kodunu kullan
        if (onlineGame && onlineGame.currentRoom) {
            this.sendGameInvitation(friendId, onlineGame.roomCode);
            return;
        }
        
        // Kullanıcının odası yoksa, önce yeni bir oda oluştur
        const roomCode = this.generateRoomCode();
        
        // Arkadaşa gösterilecek bildirim için kullanıcı adı
        const currentUser = firebase.auth().currentUser;
        const userName = currentUser.displayName || currentUser.email || 'Bir arkadaşınız';
        
        // Önce odayı oluştur
        this.db.collection('gameRooms').doc(roomCode).set({
            host: this.currentUserId,
            hostName: userName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'waiting',
            players: [
                {
                    id: this.currentUserId,
                    name: userName,
                    isReady: true,
                    isHost: true
                }
            ]
        })
        .then(() => {
            // Odayı oluşturan kullanıcıyı bu odaya gönder
            console.log('Oda oluşturuldu:', roomCode);
            
            if (onlineGame) {
                onlineGame.currentRoom = roomCode;
                onlineGame.isHost = true;
                onlineGame.showWaitingRoom(roomCode);
            }
            
            // Ardından daveti gönder
            this.sendGameInvitation(friendId, roomCode);
        })
        .catch(error => {
            console.error('Oda oluşturulurken hata:', error);
            alert('Oyun odası oluşturulamadı. Lütfen daha sonra tekrar deneyin.');
        });
    },
    
    // Oyun daveti gönder
    sendGameInvitation: function(friendId, roomCode) {
        const currentUser = firebase.auth().currentUser;
        const inviteData = {
            senderId: this.currentUserId,
            senderName: currentUser.displayName || currentUser.email || 'Bir arkadaşınız',
            receiverId: friendId,
            roomCode: roomCode,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        this.db.collection('gameInvites').add(inviteData)
            .then((docRef) => {
                console.log('Oyun daveti gönderildi, ID:', docRef.id);
                
                // Davet durumu dinleyicisini ekle
                this.listenToInviteStatus(docRef.id);
                
                // Başarılı davet gönderimi bildirimi
                const notification = document.createElement('div');
                notification.className = 'notification success';
                notification.innerHTML = '<i class="fas fa-check-circle"></i> Oyun daveti gönderildi';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.opacity = '0';
                    setTimeout(() => {
                        notification.remove();
                    }, 500);
                }, 3000);
            })
            .catch((error) => {
                console.error('Oyun daveti gönderilirken hata:', error);
                alert('Oyun daveti gönderilirken bir hata oluştu.');
            });
    },
    
    // Rastgele oda kodu oluştur (4 karakterli)
    generateRoomCode: function() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },
    
    // Davet durumunu gerçek zamanlı olarak dinle
    listenToInviteStatus: function(inviteId) {
        return this.db.collection('gameInvites').doc(inviteId)
            .onSnapshot((doc) => {
                if (!doc.exists) return;
                
                const data = doc.data();
                if (data.status === 'accepted') {
                    console.log('Davet kabul edildi!');
                    // Davet eden kişi, davet edilen kişinin odaya katıldığını bilsin
                    const notification = document.createElement('div');
                    notification.className = 'notification success';
                    notification.innerHTML = `<i class="fas fa-user-check"></i> ${data.receiverName || 'Arkadaşınız'} daveti kabul etti ve odaya katıldı!`;
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.style.opacity = '0';
                        setTimeout(() => {
                            notification.remove();
                        }, 500);
                    }, 3000);
                } else if (data.status === 'rejected') {
                    console.log('Davet reddedildi.');
                    // Davet eden kişi, davet edilen kişinin reddettiğini bilsin
                    const notification = document.createElement('div');
                    notification.className = 'notification warning';
                    notification.innerHTML = `<i class="fas fa-user-times"></i> ${data.receiverName || 'Arkadaşınız'} daveti reddetti.`;
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.style.opacity = '0';
                        setTimeout(() => {
                            notification.remove();
                        }, 500);
                    }, 3000);
                }
            });
    },

    // Oyun davetlerini kontrol et (ana sayfada düzenli olarak çağrılabilir)
    checkGameInvites: function() {
        if (!this.currentUserId) return;
        
        // Gerçek zamanlı dinleyici ekle
        this.unsubscribeGameInvites = this.db.collection('gameInvites')
            .where('receiverId', '==', this.currentUserId)
            .where('status', '==', 'pending')
            .onSnapshot((querySnapshot) => {
                if (querySnapshot.empty) return;
                
                querySnapshot.forEach((doc) => {
                    const inviteData = doc.data();
                    const inviteId = doc.id;
                    
                    // Aynı daveti tekrar gösterme
                    if (this.shownInvites && this.shownInvites.includes(inviteId)) {
                        return;
                    }
                    
                    // Gösterilen davetleri takip et
                    if (!this.shownInvites) this.shownInvites = [];
                    this.shownInvites.push(inviteId);
                    
                    // Davet bildirimini göster
                    this.showGameInvite(inviteId, inviteData);
                    
                    // Durumu görüldü olarak güncelle
                    this.db.collection('gameInvites').doc(inviteId).update({
                        status: 'seen'
                    });
                });
            }, (error) => {
                console.error('Oyun davetlerini dinlerken hata:', error);
            });
    },
    
    // Oyun davet bildirimini göster
    showGameInvite: function(inviteId, inviteData) {
        const inviteBox = document.createElement('div');
        inviteBox.className = 'game-invite-box';
        inviteBox.innerHTML = `
            <div class="invite-content">
                <h3>Oyun Daveti</h3>
                <p>${inviteData.senderName} sizi bir oyuna davet ediyor!</p>
                <div class="invite-actions">
                    <button id="accept-invite-${inviteId}" class="btn-success" style="background: var(--btn-success); color: white;">Kabul Et</button>
                    <button id="reject-invite-${inviteId}" class="btn-danger" style="background: var(--wrong-color); color: white;">Reddet</button>
                </div>
            </div>
        `;
        
        // Davet kutusuna stil ekle
        inviteBox.style.position = 'fixed';
        inviteBox.style.top = '20px';
        inviteBox.style.right = '20px';
        inviteBox.style.zIndex = '1000';
        inviteBox.style.backgroundColor = 'white';
        inviteBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        inviteBox.style.borderRadius = '8px';
        inviteBox.style.padding = '20px';
        inviteBox.style.maxWidth = '300px';
        
        document.body.appendChild(inviteBox);
        
        // Davet kabul etme butonu
        document.getElementById(`accept-invite-${inviteId}`).addEventListener('click', () => {
            const currentUser = firebase.auth().currentUser;
            const userName = currentUser.displayName || currentUser.email || 'Misafir';
            
            // Daveti kabul et
            this.db.collection('gameInvites').doc(inviteId).update({
                status: 'accepted',
                acceptedAt: firebase.firestore.FieldValue.serverTimestamp(),
                receiverName: userName
            })
            .then(() => {
                console.log('Oyun daveti kabul edildi');
                
                // Tüm sayfaları gizle
                const elementsToHide = [
                    'main-menu',
                    'quiz',
                    'category-selection',
                    'result',
                    'profile-page',
                    'friends-page',
                    'global-leaderboard',
                    'admin-panel'
                ];
                
                elementsToHide.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) element.style.display = 'none';
                });
                
                // Oyun odasına katıl
                if (onlineGame) {
                    onlineGame.joinRoom(inviteData.roomCode);
                }
                
                inviteBox.remove();
            })
            .catch(error => {
                console.error('Davet kabul edilirken hata:', error);
                alert('Daveti kabul ederken bir hata oluştu.');
            });
        });
        
        // Davet reddetme butonu
        document.getElementById(`reject-invite-${inviteId}`).addEventListener('click', () => {
            const currentUser = firebase.auth().currentUser;
            const userName = currentUser.displayName || currentUser.email || 'Misafir';
            
            // Daveti reddet
            this.db.collection('gameInvites').doc(inviteId).update({
                status: 'rejected',
                rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
                receiverName: userName
            })
            .then(() => {
                console.log('Oyun daveti reddedildi');
                inviteBox.remove();
            })
            .catch(error => {
                console.error('Davet reddedilirken hata:', error);
                alert('Daveti reddederken bir hata oluştu.');
            });
        });
        
        // 30 saniye sonra otomatik olarak kapat
        setTimeout(() => {
            if (document.body.contains(inviteBox)) {
                inviteBox.remove();
            }
        }, 30000);
    },
    
    // Firebase listener'ları temizle (sayfa değişirken)
    clearListeners: function() {
        if (this.unsubscribeGameInvites) {
            this.unsubscribeGameInvites();
        }
    },

    // Sayfa başlatma işlemi sırasında init() fonksiyonunda çağrılacak
    setupInviteSystem: function() {
        // Gösterilen davetlerin listesi
        this.shownInvites = [];
        
        // Gerçek zamanlı davet dinleyicisi
        this.checkGameInvites();
    },
    
    // Firebase koleksiyon alanlarını kontrol et ve düzelt
    checkAndFixUserData: function() {
        if (!this.currentUserId) return;
        
        const currentUser = firebase.auth().currentUser;
        if (!currentUser) return;
        
        // Mevcut kullanıcının displayNameLower alanını kontrol et ve gerekirse ekle
        this.db.collection('users').doc(this.currentUserId).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    const updates = {};
                    
                    // displayNameLower alanı eksikse ekle
                    if (!userData.displayNameLower && userData.displayName) {
                        updates.displayNameLower = userData.displayName.toLowerCase();
                    }
                    
                    // friends alanı eksikse boş array ekle
                    if (!userData.friends) {
                        updates.friends = [];
                    }
                    
                    // Güncelleme gerekiyorsa yap
                    if (Object.keys(updates).length > 0) {
                        return this.db.collection('users').doc(this.currentUserId).update(updates);
                    }
                } else {
                    // Kullanıcı yoksa oluştur
                    const newUserData = {
                        displayName: currentUser.displayName || '',
                        displayNameLower: (currentUser.displayName || '').toLowerCase(),
                        email: currentUser.email || '',
                        friends: [],
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    
                    return this.db.collection('users').doc(this.currentUserId).set(newUserData);
                }
            })
            .then(() => {
                console.log('Kullanıcı verileri kontrol edildi ve güncellendi');
            })
            .catch((error) => {
                console.error('Kullanıcı verileri kontrol edilirken hata:', error);
            });
    }
};

// Sayfanın yüklenmesi tamamlandığında arkadaş sistemini başlat
document.addEventListener('DOMContentLoaded', () => {
    friendsModule.init();
    
    // Her 30 saniyede bir oyun davetlerini kontrol et
    setInterval(() => {
        friendsModule.checkGameInvites();
    }, 30000);
});

// Diğer JS dosyalarından erişim için global scope'a ekle
window.friendsModule = friendsModule; 