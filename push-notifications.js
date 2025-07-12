// Push Notification Sistemi
const PushNotificationManager = {
    isInitialized: false,
    currentToken: null,
    
    // Sistemi başlat
    init: async function() {
        if (this.isInitialized) return;
        
        try {
            console.log('🔔 Push Notification sistemi başlatılıyor...');
            
            // Capacitor kontrolü
            if (!window.Capacitor) {
                console.log('Web ortamında PWA bildirimleri kullanılacak');
                await this.initWebNotifications();
                return;
            }
            
            // Mobil ortamda Capacitor push notifications
            const { PushNotifications } = await import('@capacitor/push-notifications');
            await this.initMobileNotifications(PushNotifications);
            
            this.isInitialized = true;
            console.log('✅ Push Notification sistemi başarıyla başlatıldı');
            
        } catch (error) {
            console.error('❌ Push Notification sistemi başlatılamadı:', error);
        }
    },
    
    // Mobil bildirimler başlat
    initMobileNotifications: async function(PushNotifications) {
        try {
            // Dinleyiciler ekle
            await this.addMobileListeners(PushNotifications);
            
            // İzinleri kontrol et ve al
            await this.requestPermissions(PushNotifications);
            
            // Kayıt ol
            await PushNotifications.register();
            
        } catch (error) {
            console.error('Mobil bildirim kurulumu hatası:', error);
        }
    },
    
    // Mobil dinleyiciler ekle
    addMobileListeners: async function(PushNotifications) {
        // Token alma
        await PushNotifications.addListener('registration', (token) => {
            console.log('📱 FCM Token alındı:', token.value);
            this.currentToken = token.value;
            this.saveTokenToFirebase(token.value);
        });
        
        // Kayıt hatası
        await PushNotifications.addListener('registrationError', (error) => {
            console.error('📱 FCM Token alma hatası:', error);
        });
        
        // Bildirim alındı (uygulama açık)
        await PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('📨 Bildirim alındı:', notification);
            this.handleNotificationReceived(notification);
        });
        
        // Bildirim tıklandı
        await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('👆 Bildirim tıklandı:', notification);
            this.handleNotificationAction(notification);
        });
    },
    
    // İzinleri kontrol et ve al
    requestPermissions: async function(PushNotifications) {
        try {
            let permStatus = await PushNotifications.checkPermissions();
            console.log('📋 Mevcut izinler:', permStatus);
            
            if (permStatus.receive === 'prompt') {
                console.log('🤔 Bildirim izni isteniyor...');
                permStatus = await PushNotifications.requestPermissions();
            }
            
            if (permStatus.receive !== 'granted') {
                throw new Error('Kullanıcı bildirim izni vermedi!');
            }
            
            console.log('✅ Bildirim izni verildi');
            return true;
            
        } catch (error) {
            console.error('İzin alma hatası:', error);
            this.showPermissionErrorMessage();
            return false;
        }
    },
    
    // Web bildirimleri başlat (PWA için)
    initWebNotifications: async function() {
        try {
            if (!('Notification' in window)) {
                console.log('Bu tarayıcı bildirimleri desteklemiyor');
                return;
            }
            
            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                console.log('🌐 Web bildirim izni:', permission);
            }
            
            // Service Worker ile Firebase Messaging
            if ('serviceWorker' in navigator && 'firebase' in window) {
                await this.initFirebaseMessaging();
            }
            
        } catch (error) {
            console.error('Web bildirim kurulumu hatası:', error);
        }
    },
    
    // Firebase Messaging başlat
    initFirebaseMessaging: async function() {
        try {
            if (!firebase.messaging) {
                console.log('Firebase Messaging mevcut değil');
                return;
            }
            
            const messaging = firebase.messaging();
            
            // Token al
            const token = await messaging.getToken({
                vapidKey: 'YOUR_VAPID_KEY' // Firebase konsolundan alınmalı
            });
            
            if (token) {
                console.log('🔑 FCM Web Token:', token);
                this.currentToken = token;
                await this.saveTokenToFirebase(token);
            }
            
            // Foreground mesajları dinle
            messaging.onMessage((payload) => {
                console.log('📨 Foreground mesaj alındı:', payload);
                this.handleNotificationReceived(payload);
            });
            
        } catch (error) {
            console.error('Firebase Messaging hatası:', error);
        }
    },
    
    // Token'i Firebase'e kaydet
    saveTokenToFirebase: async function(token) {
        try {
            if (!firebase.auth().currentUser) {
                console.log('Kullanıcı oturum açmamış, token kaydedilmedi');
                return;
            }
            
            const userId = firebase.auth().currentUser.uid;
            const tokenData = {
                token: token,
                platform: window.Capacitor ? 'mobile' : 'web',
                lastUpdated: firebase.database.ServerValue.TIMESTAMP,
                active: true
            };
            
            await firebase.database().ref(`users/${userId}/fcmTokens`).push(tokenData);
            console.log('💾 FCM Token Firebase\'e kaydedildi');
            
        } catch (error) {
            console.error('Token kaydetme hatası:', error);
        }
    },
    
    // Bildirim alındığında çalışır
    handleNotificationReceived: function(notification) {
        try {
            // Ses çal
            this.playNotificationSound();
            
            // Uygulama içi bildirim göster
            this.showInAppNotification(notification);
            
            // Badge sayısını güncelle
            this.updateBadgeCount();
            
        } catch (error) {
            console.error('Bildirim işleme hatası:', error);
        }
    },
    
    // Bildirim tıklandığında çalışır
    handleNotificationAction: function(notification) {
        try {
            console.log('Bildirim aksiyonu:', notification.actionId);
            
            // Bildirim türüne göre işlem yap
            if (notification.notification?.data?.type === 'game_invite') {
                this.handleGameInvite(notification.notification.data);
            } else if (notification.notification?.data?.type === 'admin_message') {
                this.handleAdminMessage(notification.notification.data);
            }
            
        } catch (error) {
            console.error('Bildirim aksiyon hatası:', error);
        }
    },
    
    // Bildirim sesi çal
    playNotificationSound: function() {
        try {
            const audio = new Audio('/sounds/notification.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Ses çalma hatası:', e));
        } catch (error) {
            console.error('Ses çalma hatası:', error);
        }
    },
    
    // Uygulama içi bildirim göster
    showInAppNotification: function(notification) {
        try {
            const title = notification.title || notification.notification?.title || 'Yeni Bildirim';
            const body = notification.body || notification.notification?.body || 'Bir bildirim aldınız';
            
            // Toast bildirim göster
            if (window.quizApp && window.quizApp.showToast) {
                window.quizApp.showToast(`${title}: ${body}`, 'toast-info');
            }
            
            // Badge güncellemesi
            this.updateBadgeCount();
            
        } catch (error) {
            console.error('Uygulama içi bildirim hatası:', error);
        }
    },
    
    // Badge sayısını güncelle
    updateBadgeCount: function() {
        try {
            if ('navigator' in window && 'setAppBadge' in navigator) {
                navigator.setAppBadge(1);
            }
        } catch (error) {
            console.error('Badge güncelleme hatası:', error);
        }
    },
    
    // İzin hata mesajı göster
    showPermissionErrorMessage: function() {
        if (window.quizApp && window.quizApp.showToast) {
            window.quizApp.showToast(
                'Bildirim almak için izin verin. Ayarlardan bildirimleri açabilirsiniz.',
                'toast-warning'
            );
        }
    },
    
    // Oyun davet bildirimi işle
    handleGameInvite: function(data) {
        try {
            if (window.friendsModule && window.friendsModule.showGameInviteModal) {
                window.friendsModule.showGameInviteModal(data.inviteId, data);
            }
        } catch (error) {
            console.error('Oyun davet işleme hatası:', error);
        }
    },
    
    // Admin mesaj bildirimi işle
    handleAdminMessage: function(data) {
        try {
            // Admin mesaj modalını göster
            if (window.quizApp && window.quizApp.showModal) {
                window.quizApp.showModal(data.title, data.message);
            }
        } catch (error) {
            console.error('Admin mesaj işleme hatası:', error);
        }
    },
    
    // Test bildirimi gönder
    sendTestNotification: async function() {
        try {
            if (!this.currentToken) {
                console.log('Token yok, test bildirimi gönderilemez');
                return;
            }
            
            const testData = {
                title: 'Test Bildirimi',
                body: 'Quiz Oyunu bildirim sistemi çalışıyor! 🎉',
                token: this.currentToken,
                data: {
                    type: 'test',
                    timestamp: Date.now()
                }
            };
            
            // Firebase Function ile gönder (backend gerekli)
            console.log('Test bildirimi gönderildi:', testData);
            
        } catch (error) {
            console.error('Test bildirimi hatası:', error);
        }
    }
};

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    // Firebase yüklendiğinde başlat
    if (window.firebase) {
        PushNotificationManager.init();
    } else {
        // Firebase yüklenmesini bekle
        window.addEventListener('firebase-loaded', function() {
            PushNotificationManager.init();
        });
    }
});

// Global erişim
window.PushNotificationManager = PushNotificationManager; 