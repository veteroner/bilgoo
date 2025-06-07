// Kullanıcı oturumu ile ilgili işlemleri yöneten script

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Netlify ortamı kontrolü
        const isNetlify = window.location.hostname.includes('netlify.app') || 
                         window.location.hostname.includes('netlify.com');
        
        let auth = null;
        
        if (isNetlify) {
            // Netlify'da Firebase'in yüklenmesini bekle
            const waitForFirebase = () => {
                return new Promise((resolve) => {
                    if (window.NetlifyFirebase && window.NetlifyFirebase.getAuth()) {
                        auth = window.NetlifyFirebase.getAuth();
                        resolve(auth);
                    } else if (typeof firebase !== 'undefined' && firebase.auth) {
                        auth = firebase.auth();
                        resolve(auth);
                    } else {
                        // Firebase hazır olana kadar bekle
                        setTimeout(() => {
                            waitForFirebase().then(resolve);
                        }, 100);
                    }
                });
            };
            
            waitForFirebase().then((firebaseAuth) => {
                auth = firebaseAuth;
                initializeAuthFunctions();
            });
        } else {
            // Normal ortam
            auth = firebase.auth();
            initializeAuthFunctions();
        }
        
        function initializeAuthFunctions() {
        
        // Form referansları
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const loginBox = document.getElementById('login-box');
        const registerBox = document.getElementById('register-box');
        const showRegisterBtn = document.getElementById('show-register');
        const showLoginBtn = document.getElementById('show-login');
        const anonymousLoginBtn = document.getElementById('anonymous-login');
        const loginError = document.getElementById('login-error');
        const registerError = document.getElementById('register-error');

        // Mevcut kullanıcı oturumunu kontrol et
        auth.onAuthStateChanged((user) => {
            if (user) {
                // Kullanıcı giriş yapmış, ana sayfaya yönlendir
                window.location.href = 'index.html';
            }
        });

        // Giriş ve kayıt formları arasında geçiş
        showRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginBox.style.display = 'none';
            registerBox.style.display = 'block';
        });

        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            registerBox.style.display = 'none';
            loginBox.style.display = 'block';
        });

        // Giriş formu gönderildiğinde
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                
                loginError.textContent = '';
                
                auth.signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        // Başarılı giriş
                        window.location.href = 'index.html';
                    })
                    .catch((error) => {
                        // Hata durumu
                        let errorMessage = 'Giriş başarısız: ';
                        
                        if (error.code === 'auth/wrong-password') {
                            errorMessage += 'Yanlış şifre girdiniz.';
                        } else if (error.code === 'auth/user-not-found') {
                            errorMessage += 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.';
                        } else {
                            errorMessage += error.message;
                        }
                        
                        loginError.textContent = errorMessage;
                        console.error('Giriş hatası:', error);
                    });
            });
        }

        // Kayıt formu gönderildiğinde
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('register-username').value;
                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                const confirmPassword = document.getElementById('register-password-confirm').value;
                
                registerError.textContent = '';
                
                // Şifre kontrolü
                if (password !== confirmPassword) {
                    registerError.textContent = 'Şifreler eşleşmiyor!';
                    return;
                }
                
                // Firebase ile kayıt
                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        // Kullanıcı adını ayarla
                        return userCredential.user.updateProfile({
                            displayName: username
                        }).then(() => {
                            // Firestore'a kullanıcı bilgilerini kaydet
                            return firebase.firestore().collection('users').doc(userCredential.user.uid).set({
                                username: username,
                                email: email,
                                createdAt: new Date(),
                                stats: {
                                    gamesPlayed: 0,
                                    totalQuestions: 0,
                                    totalCorrect: 0,
                                    averageTime: 0,
                                    perfectRounds: 0,
                                    categoryStats: {}
                                }
                            });
                        }).then(() => {
                            // Ana sayfaya yönlendir
                            window.location.href = 'index.html';
                        });
                    })
                    .catch((error) => {
                        // Hata durumu
                        let errorMessage = 'Kayıt başarısız: ';
                        
                        if (error.code === 'auth/email-already-in-use') {
                            errorMessage += 'Bu e-posta adresi zaten kullanılıyor.';
                        } else if (error.code === 'auth/weak-password') {
                            errorMessage += 'Şifre en az 6 karakter olmalıdır.';
                        } else {
                            errorMessage += error.message;
                        }
                        
                        registerError.textContent = errorMessage;
                        console.error('Kayıt hatası:', error);
                    });
            });
        }

        // Misafir giriş - Gelişmiş hata yönetimi ile
        if (anonymousLoginBtn) {
            anonymousLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                console.info('🥸 Misafir girişi başlatılıyor...');
                loginError.textContent = 'Bağlantı kuruluyor, lütfen bekleyin...';
                anonymousLoginBtn.disabled = true;
                
                // Retry mekanizması
                async function attemptAnonymousLogin(retryCount = 0, maxRetries = 3) {
                    try {
                        // Netlify özel fonksiyonu var mı kontrol et
                        if (isNetlify && window.netlifyAnonymousLogin) {
                            await window.netlifyAnonymousLogin();
                            console.info('✅ Netlify misafir girişi başarılı');
                            window.location.href = 'index.html';
                        } else if (auth) {
                            // Firebase bağlantı durumunu kontrol et
                            const user = await new Promise((resolve, reject) => {
                                const timeout = setTimeout(() => {
                                    reject(new Error('Bağlantı zaman aşımına uğradı. İnternet bağlantınızı kontrol edin.'));
                                }, 15000); // 15 saniye timeout
                                
                                auth.signInAnonymously()
                                    .then((userCredential) => {
                                        clearTimeout(timeout);
                                        resolve(userCredential.user);
                                    })
                                    .catch((error) => {
                                        clearTimeout(timeout);
                                        reject(error);
                                    });
                            });
                            
                            console.info('✅ Misafir girişi başarılı');
                            window.location.href = 'index.html';
                        } else {
                            throw new Error('Firebase bağlantısı kurulamadı');
                        }
                    } catch (error) {
                        console.error(`❌ Misafir girişi denemesi ${retryCount + 1} başarısız:`, error);
                        
                        if (retryCount < maxRetries) {
                            console.info(`🔄 ${retryCount + 1}. deneme başarısız, ${maxRetries - retryCount} deneme kaldı...`);
                            loginError.textContent = `Bağlantı hatası! ${maxRetries - retryCount} deneme kaldı... (${error.message})`;
                            
                            // 2 saniye bekle ve tekrar dene
                            setTimeout(() => {
                                attemptAnonymousLogin(retryCount + 1, maxRetries);
                            }, 2000);
                        } else {
                            // Tüm denemeler başarısız
                            let errorMessage = 'Misafir girişi başarısız: ';
                            
                            if (error.message.includes('network')) {
                                errorMessage += 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.';
                            } else if (error.message.includes('timeout')) {
                                errorMessage += 'Bağlantı zaman aşımına uğradı. Sayfayı yenileyin ve tekrar deneyin.';
                            } else if (error.code === 'auth/network-request-failed') {
                                errorMessage += 'Ağ isteği başarısız. İnternet bağlantınızı kontrol edin.';
                            } else {
                                errorMessage += error.message;
                            }
                            
                            loginError.textContent = errorMessage;
                            anonymousLoginBtn.disabled = false;
                        }
                    }
                }
                
                // Giriş denemesini başlat
                attemptAnonymousLogin();
            });
        }
        
        } // initializeAuthFunctions fonksiyonu sonu
        
    } catch (error) {
        console.error('Firebase kimlik doğrulama hatası:', error);
    }
}); 