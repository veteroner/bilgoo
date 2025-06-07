// 🏗️ BUILD TIME ENVIRONMENT INJECTION
// Netlify build process sırasında çalışır

const fs = require('fs');

console.log('🔧 Environment variables build script başladı...');

// Environment variables'ları al
const envVars = {
    FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAbI5Swc136jjPCKeH1erjoDuhG2GUPnn0",
    FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "bilgisel-3e9a0.firebaseapp.com",
    FIREBASE_DATABASE_URL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://bilgisel-3e9a0-default-rtdb.firebaseio.com",
    FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID || "bilgisel-3e9a0",
    FIREBASE_STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "bilgisel-3e9a0.appspot.com",
    FIREBASE_MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "921907280109",
    FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID || "1:921907280109:web:7d9b4844067a7a1ac174e4",
    FIREBASE_MEASUREMENT_ID: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-XH10LS7DW8"
};

// Runtime config oluştur
const runtimeConfig = `
// 🌍 RUNTIME ENVIRONMENT CONFIG
// Build time'da otomatik oluşturuldu
// Güvenlik: API anahtarları environment variables'tan gelir

window.BUILD_ENV = ${JSON.stringify(envVars, null, 2)};

console.info('✅ Build environment config yüklendi:', Object.keys(window.BUILD_ENV));
`;

// Dosyayı yaz
try {
    fs.writeFileSync('runtime-env.js', runtimeConfig);
    console.log('✅ runtime-env.js dosyası oluşturuldu');
    console.log('📋 Environment variables:', Object.keys(envVars));
} catch (error) {
    console.error('❌ runtime-env.js oluşturulamadı:', error);
    process.exit(1);
}

console.log('🎉 Build environment injection tamamlandı'); 