# 🚀 PRODUCTION DEPLOYMENT REHBERİ

Bu rehber, güvenli Quiz uygulamasının production ortamına nasıl deploy edileceğini açıklar.

## 📋 Ön Gereksinimler

### Sistem Gereksinimleri
- **Node.js**: v16.0.0 veya üzeri
- **NPM**: v8.0.0 veya üzeri
- **SSL Sertifikası**: Let's Encrypt veya ticari SSL
- **Domain**: Geçerli domain adı
- **Server**: Ubuntu 20.04+ / CentOS 8+ / RHEL 8+

### Güvenlik Gereksinimleri
- **Firewall**: UFW veya iptables aktif
- **SSH**: Key-based authentication
- **Sudo**: Non-root user with sudo privileges

## 🔧 1. Server Hazırlığı

### Ubuntu/Debian için:
```bash
# Sistem güncelleme
sudo apt update && sudo apt upgrade -y

# Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 kurulumu (process manager)
sudo npm install -g pm2

# Nginx kurulumu (reverse proxy)
sudo apt install nginx -y

# Certbot kurulumu (SSL)
sudo apt install certbot python3-certbot-nginx -y

# Firewall kurulumu
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
```

## 🔑 2. SSL Sertifikası Kurulumu

### Let's Encrypt ile ücretsiz SSL:
```bash
# SSL sertifikası oluştur
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Otomatik yenileme test et
sudo certbot renew --dry-run
```

### Manuel SSL sertifikası:
```bash
# SSL klasörü oluştur
mkdir -p ssl

# Self-signed sertifika (test için)
npm run ssl-setup

# Production için ticari sertifikayı kopyala
cp /path/to/your/certificate.crt ssl/
cp /path/to/your/private.key ssl/
```

## 📦 3. Uygulama Kurulumu

```bash
# Uygulama dizini oluştur
sudo mkdir -p /var/www/quiz-app
sudo chown $USER:$USER /var/www/quiz-app

# Repository'yi klonla
cd /var/www/quiz-app
git clone https://github.com/your-username/quiz-oyunu.git .

# Dependencies kur
npm ci --production

# SSL sertifikalarını kopyala
cp /path/to/ssl/* ssl/
```

## 🔐 4. Environment Variables Kurulumu

```bash
# .env dosyası oluştur
cp env.example .env

# Güvenli editör ile düzenle
sudo nano .env
```

### Kritik Environment Variables:
```bash
NODE_ENV=production
PORT=3000
HTTPS_PORT=443

# Firebase - Gerçek değerlerle değiştirin
FIREBASE_API_KEY=your_real_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
# ... diğer Firebase ayarları

# Güvenlik - Güçlü şifreler oluşturun
SECURITY_SECRET=$(openssl rand -hex 32)
MASTER_KEY=$(openssl rand -hex 64)

# SSL
SSL_KEY_PATH=/var/www/quiz-app/ssl/private.key
SSL_CERT_PATH=/var/www/quiz-app/ssl/certificate.crt
```

## 🛡️ 5. Güvenlik Konfigürasyonu

### Dosya İzinleri:
```bash
# Uygulama dosyaları
chmod -R 755 /var/www/quiz-app
chmod 600 /var/www/quiz-app/.env
chmod 600 /var/www/quiz-app/ssl/*

# Log dizini
mkdir -p logs
chmod 755 logs

# Config dizini güvenli izinler
mkdir -p config
chmod 700 config
```

### Firewall Kuralları:
```bash
# Sadece gerekli portları aç
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP (HTTPS'e redirect için)
sudo ufw allow 443   # HTTPS
sudo ufw deny 3000   # Node.js port (Nginx üzerinden erişim)

# Status kontrol
sudo ufw status verbose
```

## 🌐 6. Nginx Reverse Proxy Kurulumu

```bash
# Nginx konfigürasyon dosyası oluştur
sudo nano /etc/nginx/sites-available/quiz-app
```

### Nginx Konfigürasyonu:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Konfigürasyonu
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL Güvenlik Ayarları
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Reverse Proxy
    location / {
        proxy_pass https://localhost:443;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
    }

    # Static files
    location /static/ {
        alias /var/www/quiz-app/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security
    location ~ /\. {
        deny all;
    }

    location ~ /config/ {
        deny all;
    }

    location ~ /logs/ {
        deny all;
    }
}
```

```bash
# Site'ı aktifleştir
sudo ln -s /etc/nginx/sites-available/quiz-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔄 7. PM2 ile Process Management

```bash
# PM2 ecosystem dosyası oluştur
nano ecosystem.config.js
```

### ecosystem.config.js:
```javascript
module.exports = {
  apps: [{
    name: 'quiz-app',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      HTTPS_PORT: 443
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
}
```

```bash
# Uygulamayı başlat
pm2 start ecosystem.config.js --env production

# PM2'yi sistem başlatırken otomatik başlat
pm2 startup
pm2 save

# Status kontrol
pm2 status
pm2 logs quiz-app
```

## 📊 8. Monitoring ve Logging

### Log Rotation:
```bash
# Logrotate konfigürasyonu
sudo nano /etc/logrotate.d/quiz-app
```

```
/var/www/quiz-app/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 0644 www-data www-data
    postrotate
        /bin/kill -USR1 `cat /var/www/quiz-app/logs/pm2.pid 2> /dev/null` 2> /dev/null || true
    endscript
}
```

### Monitoring Script:
```bash
# Health check script
nano health-check.sh
```

```bash
#!/bin/bash
URL="https://yourdomain.com/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $RESPONSE -eq 200 ]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed: $RESPONSE"
    # PM2 restart
    pm2 restart quiz-app
    # E-posta bildirim gönder
    echo "Quiz app restarted due to health check failure" | mail -s "Quiz App Alert" admin@yourdomain.com
fi
```

```bash
chmod +x health-check.sh

# Crontab'a ekle (her 5 dakikada bir)
crontab -e
# Ekle: */5 * * * * /var/www/quiz-app/health-check.sh
```

## 🔍 9. Performance Optimizasyonu

### Node.js Optimizasyonu:
```bash
# Node.js memory ayarları
export NODE_OPTIONS="--max-old-space-size=2048"

# CPU optimization
export UV_THREADPOOL_SIZE=16
```

### Database Optimizasyonu:
- Firebase index'leri oluştur
- Cache stratejisi uygula
- Connection pooling

## 🔐 10. Güvenlik Kontrolü

### Güvenlik Testi:
```bash
# Port tarama
nmap -sS localhost

# SSL test
testssl.sh yourdomain.com

# Security headers test
curl -I https://yourdomain.com

# Vulnerability scan
npm audit
```

### Backup Strategy:
```bash
# Backup script
nano backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/quiz-app-$DATE"

# Uygulama backup
mkdir -p $BACKUP_DIR
cp -r /var/www/quiz-app $BACKUP_DIR/
tar -czf "/backup/quiz-app-$DATE.tar.gz" $BACKUP_DIR/

# Firebase backup (Firestore)
# Firebase CLI ile export

# Log cleanup (30 günden eski)
find /var/www/quiz-app/logs -name "*.log" -mtime +30 -delete

echo "✅ Backup completed: quiz-app-$DATE.tar.gz"
```

## 🚨 11. Troubleshooting

### Yaygın Sorunlar:

#### SSL Sertifika Hataları:
```bash
# Sertifika kontrolü
openssl x509 -in ssl/certificate.crt -text -noout

# Nginx SSL test
nginx -t
systemctl reload nginx
```

#### Performance Sorunları:
```bash
# Memory kullanımı
pm2 monit

# CPU kullanımı
htop

# Disk kullanımı
df -h
```

#### Log Analizi:
```bash
# Error logs
tail -f logs/pm2-error.log

# WAF logs
tail -f logs/waf.log

# Security logs
tail -f logs/security.log
```

## 📞 12. Destek ve Bakım

### Düzenli Bakım:
- **Günlük**: Log kontrolü, health check
- **Haftalık**: Security audit, performance analizi
- **Aylık**: SSL sertifika yenileme, dependency update
- **Çeyreklik**: Full security audit, penetration test

### Acil Durum:
- **DDoS Attack**: Cloudflare enable
- **Security Breach**: Immediate IP blocking
- **Performance Issue**: Auto-scaling with PM2

---

## ✅ Production Checklist

- [ ] SSL sertifikası kuruldu ve test edildi
- [ ] Environment variables production değerleriyle ayarlandı
- [ ] Firewall kuralları uygulandı
- [ ] Nginx reverse proxy konfigüre edildi
- [ ] PM2 cluster mode aktif
- [ ] Log rotation aktif
- [ ] Health check monitoring aktif
- [ ] Backup sistemi kuruldu
- [ ] Security headers aktif
- [ ] WAF aktif ve test edildi
- [ ] Performance optimizasyonu yapıldı
- [ ] Vulnerability scan temiz
- [ ] Documentation güncel

**🎉 Deployment Tamamlandı! Uygulamanız artık production'da güvenli şekilde çalışıyor.** 