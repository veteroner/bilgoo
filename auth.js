// Kullanıcı oturumu ile ilgili işlemleri yöneten script

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Firebase auth referansı
        const auth = firebase.auth();
        
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

        // Misafir giriş
        if (anonymousLoginBtn) {
            anonymousLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                auth.signInAnonymously()
                    .then(() => {
                        // Başarılı misafir girişi
                        window.location.href = 'index.html';
                    })
                    .catch((error) => {
                        // Hata durumu
                        loginError.textContent = 'Misafir girişi başarısız: ' + error.message;
                        console.error('Misafir girişi hatası:', error);
                    });
            });
        }
    } catch (error) {
        console.error('Firebase kimlik doğrulama hatası:', error);
    }
}); 