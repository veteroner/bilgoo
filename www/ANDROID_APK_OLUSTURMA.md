# Android APK Oluşturma Kılavuzu

Bu belge, Quiz Oyunu - Bilgoo uygulamanızın Android APK dosyasını nasıl oluşturacağınızı açıklamaktadır.

## Ön Koşullar

- [Android Studio](https://developer.android.com/studio) yüklü olmalıdır
- Java Development Kit (JDK) yüklü olmalıdır (Android Studio ile birlikte gelir)
- Android SDK yüklü olmalıdır (Android Studio ile birlikte gelir)

## APK Oluşturma Adımları

1. Android Studio'yu açın. Bu işlemi şu komutla yapabilirsiniz:
   ```
   npx cap open android
   ```

2. Android Studio açıldıktan sonra projenin yüklenmesini bekleyin.

3. APK oluşturmak için:
   - Üst menüden "Build" seçeneğine tıklayın
   - "Build Bundle(s) / APK(s)" seçeneğini seçin
   - "Build APK(s)" seçeneğini seçin

4. İşlem tamamlandığında, Android Studio size APK'nın nerede oluşturulduğunu gösterecektir. Genellikle şu dizinde olacaktır:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

5. Bu APK dosyasını Android cihazınıza yükleyebilir ve uygulamayı test edebilirsiniz.

## İmzalı APK Oluşturma (Release Versiyonu)

Uygulamanızı Google Play Store'da yayınlamak için imzalı bir APK oluşturmanız gerekir:

1. Android Studio'da, üst menüden "Build" > "Generate Signed Bundle / APK" seçeneğini seçin.

2. "APK" seçeneğini seçin ve "Next" düğmesine tıklayın.

3. Bir anahtar deposu (keystore) oluşturun veya mevcut bir anahtar deposunu kullanın:
   - Yeni bir anahtar deposu oluşturmak için "Create new..." düğmesine tıklayın
   - Gerekli bilgileri doldurun (anahtar deposu yolu, şifre, anahtar adı, vb.)
   - "OK" düğmesine tıklayın

4. "Next" düğmesine tıklayın.

5. "Release" yapılandırmasını seçin ve "Finish" düğmesine tıklayın.

6. İşlem tamamlandığında, imzalı APK şu dizinde olacaktır:
   ```
   android/app/release/app-release.apk
   ```

## Sorun Giderme

- Java yolu (JAVA_HOME) doğru ayarlanmamışsa, Android Studio veya Gradle hata verebilir. Bu durumda, sisteminizde JDK'nın doğru şekilde kurulu olduğundan emin olun.
- Gradle senkronizasyon sorunları yaşarsanız, Android Studio'da "File" > "Sync Project with Gradle Files" seçeneğini kullanın.
- Uygulamanın derlenmesi sırasında hata alırsanız, Android Studio'nun hata mesajlarını kontrol edin ve gerekirse bağımlılıkları güncelleyin.

## Ek Kaynaklar

- [Capacitor Belgeleri](https://capacitorjs.com/docs)
- [Android Studio Kullanım Kılavuzu](https://developer.android.com/studio/intro)
- [Android APK İmzalama](https://developer.android.com/studio/publish/app-signing) 