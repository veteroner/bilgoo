# Bilgi Yarışması Uygulaması

Bu bilgi yarışması uygulaması, kullanıcıların bilgilerini çeşitli kategorilerde test edebilecekleri interaktif bir web uygulamasıdır.

## Özellikler

- Çeşitli kategorilerde sorular (Genel Kültür, Bilim, Teknoloji, Spor, Müzik, Edebiyat, Tarih)
- Can sistemi: 5 canınız var ve yanlış cevap verdiğinizde canınız azalır
- Sesli geri bildirimler
- Joker kullanımı (50:50 ve ipucu)
- Çoklu dil desteği (Türkçe, İngilizce, Almanca)
- Çevrimiçi çok oyunculu mod (Firebase gerektirir)
- PWA desteği ve çevrimdışı mod

## Uygulamayı Çalıştırma

Uygulamayı çalıştırmak için birkaç yöntem vardır:

1. **start-app.bat dosyasını çalıştırma (Windows):**
   - Dosyaya çift tıklayın ve uygulama otomatik olarak bir web sunucusu başlatacaktır
   - Tarayıcınızda otomatik olarak açılacaktır

2. **Python kullanarak:**
   ```
   cd "[proje klasörünüz]"
   python -m http.server
   ```
   - Tarayıcınızda http://localhost:8000 adresine gidin

3. **Node.js kullanarak:**
   ```
   cd "[proje klasörünüz]"
   npx serve
   ```
   - Tarayıcınızda http://localhost:3000 adresine gidin

4. **VS Code Live Server eklentisini kullanarak:**
   - VS Code'da Live Server eklentisini yükleyin
   - index.html dosyasına sağ tıklayın ve "Live Server ile Aç" seçeneğini seçin

## Hatalar ve Çözümleri

1. **"Access to internal resource at 'file:///path/to/manifest.json' has been blocked by CORS policy" Hatası:**
   - Bu hata, uygulamayı doğrudan dosya sisteminden açtığınızda oluşur
   - **Çözüm:** Uygulamayı bir web sunucusu üzerinden (http:// protokolü ile) çalıştırın
   - En kolay yöntem, start-app.bat dosyasını çalıştırmaktır

2. **Firebase Hataları:**
   - Uygulama çevrimdışı modda çalışması için optimize edilmiştir
   - Çevrimiçi özellikleri kullanmak istiyorsanız, firebase-config.js dosyasında kendi Firebase bilgilerinizi eklemelisiniz

3. **Service Worker Hataları:**
   - Uygulamayı bir web sunucusu üzerinden çalıştırmanız gerekiyor (file:// protokolü yerine http:// veya https://)

4. **Tracking Prevention Hataları:**
   - Edge tarayıcısının izleme önleme özelliği Firebase ve Google Fonts'u engelleyebilir
   - Tarayıcı ayarlarından izleme önlemeyi geçici olarak devre dışı bırakabilirsiniz
   - Veya Firefox/Chrome gibi başka bir tarayıcı kullanabilirsiniz

## Başkalarıyla Paylaşma

Uygulamayı başkalarıyla paylaşmak için:

1. Tüm dosyaları bir ZIP olarak sıkıştırın
2. Paylaştığınız kişiye yukarıdaki çalıştırma talimatlarını verin
3. start-app.bat dosyasını dahil etmeyi unutmayın

## Lisans

Bu uygulama açık kaynaklıdır ve kişisel veya eğitim amaçlı olarak özgürce kullanılabilir. 