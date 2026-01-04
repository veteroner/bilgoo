import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, cpSync, existsSync } from 'fs';

export default defineConfig({
  root: process.cwd(),
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Cache busting için otomatik hash ekle
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        login: resolve(__dirname, 'public/login.html'),
        settings: resolve(__dirname, 'public/settings.html'),
        about: resolve(__dirname, 'public/about.html'),
        contact: resolve(__dirname, 'public/contact.html')
      },
      output: {
        // Her build'de benzersiz dosya adları (cache busting)
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@config': resolve(__dirname, './src/config'),
      '@core': resolve(__dirname, './src/core'),
      '@features': resolve(__dirname, './src/features'),
      '@ui': resolve(__dirname, './src/ui'),
      '@utils': resolve(__dirname, './src/utils'),
      '@services': resolve(__dirname, './src/services'),
      '@styles': resolve(__dirname, './src/styles')
    }
  },
  // Build sonrası hook - gerekli dosyaları kopyala
  plugins: [{
    name: 'copy-assets-after-build',
    closeBundle() {
      const filesToCopy = [
        { src: 'public/style.css', dest: 'dist/style.css' },
        { src: 'public/script.js', dest: 'dist/script.js' },
        { src: 'statistics.css', dest: 'dist/statistics.css' },
        { src: 'custom-question-styles.css', dest: 'dist/custom-question-styles.css' },
        { src: 'admin-pending-styles.css', dest: 'dist/admin-pending-styles.css' },
        { src: 'firebase-config.js', dest: 'dist/firebase-config.js' },
        { src: 'languages.js', dest: 'dist/languages.js' },
        { src: 'online-game.js', dest: 'dist/online-game.js' },
        { src: 'friends.js', dest: 'dist/friends.js' },
        { src: 'daily-tasks.js', dest: 'dist/daily-tasks.js' },
        { src: 'achievements.js', dest: 'dist/achievements.js' },
        { src: 'progress-chart.js', dest: 'dist/progress-chart.js' },
        { src: 'feedback.js', dest: 'dist/feedback.js' },
        { src: 'admin-pending-questions.js', dest: 'dist/admin-pending-questions.js' },
        { src: 'att-manager.js', dest: 'dist/att-manager.js' },
        { src: 'monetization.js', dest: 'dist/monetization.js' },
        { src: 'push-notifications.js', dest: 'dist/push-notifications.js' },
        { src: 'data-retention.js', dest: 'dist/data-retention.js' },
        { src: 'audit-log.js', dest: 'dist/audit-log.js' },
        { src: 'auth.js', dest: 'dist/auth.js' }
      ];
      
      const dirsToCopy = [
        { src: 'icons', dest: 'dist/icons' },
        { src: 'languages', dest: 'dist/languages' }
      ];
      
      // Dosyaları kopyala
      filesToCopy.forEach(({ src, dest }) => {
        if (existsSync(src)) {
          copyFileSync(src, dest);
          console.log(`✓ Copied: ${src} → ${dest}`);
        }
      });
      
      // Klasörleri kopyala
      dirsToCopy.forEach(({ src, dest }) => {
        if (existsSync(src)) {
          cpSync(src, dest, { recursive: true });
          console.log(`✓ Copied: ${src}/ → ${dest}/`);
        }
      });
    }
  }]
});
