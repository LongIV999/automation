# 🌐 Deployment Guide

Hướng dẫn deploy Content Automation System lên các nền tảng hosting.

## 📋 Mục Lục

- [Option 1: Railway.app (Easiest)](#option-1-railwayapp)
- [Option 2: Render.com](#option-2-rendercom)
- [Option 3: VPS (DigitalOcean, Linode)](#option-3-vps)
- [Option 4: Vercel (Frontend Only)](#option-4-vercel)
- [Option 5: Heroku](#option-5-heroku)

---

## Option 1: Railway.app (Easiest) ⭐ RECOMMENDED

Railway cung cấp free tier và rất dễ setup.

### Steps:

1. **Fork repo này** trên GitHub

2. **Đăng nhập Railway.app**:
   - Vào https://railway.app
   - Sign up với GitHub

3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Chọn repo bạn vừa fork

4. **Add Environment Variables**:
   ```
   ANTHROPIC_API_KEY=your_key
   LONGBEST_ACCESS_TOKEN=your_token
   QUEENNAIL_ACCESS_TOKEN=your_token
   THACHVULAND_ACCESS_TOKEN=your_token
   NODE_ENV=production
   ```

5. **Configure Start Command**:
   - Settings → Start Command:
   ```bash
   node scripts/workflow-monitor/monitor.js & node scripts/workflow-monitor/server.js
   ```

6. **Deploy**:
   - Railway sẽ tự động build và deploy
   - Lấy URL từ Settings → Domains

7. **Setup Google Credentials**:
   - Vì Railway không hỗ trợ file upload, dùng environment variables:
   ```
   GOOGLE_CREDENTIALS={"type":"service_account","project_id":"..."}
   ```

### Cost:
- Free tier: $5 credit/month
- Paid: $0.000463/GB-s

---

## Option 2: Render.com

### Steps:

1. **Fork repo** trên GitHub

2. **Create New Web Service**:
   - Vào https://render.com
   - Dashboard → New → Web Service
   - Connect GitHub repo

3. **Configure Service**:
   - Name: `automation-dashboard`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command:
   ```bash
   node scripts/workflow-monitor/monitor.js & node scripts/workflow-monitor/server.js
   ```

4. **Environment Variables**:
   - Add all variables từ `.env.example`

5. **Deploy**:
   - Click "Create Web Service"
   - Render sẽ auto-deploy

6. **Get URL**:
   - `https://automation-dashboard.onrender.com`

### Cost:
- Free tier: Available (with limitations)
- Paid: $7/month

---

## Option 3: VPS (DigitalOcean, Linode, Vultr)

Cho production environment với full control.

### Setup trên DigitalOcean:

#### 1. Create Droplet

```bash
# Chọn:
- Ubuntu 22.04 LTS
- Basic Plan ($6/month)
- Data center: Singapore/US
```

#### 2. SSH vào server

```bash
ssh root@your_server_ip
```

#### 3. Install Node.js

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify
node --version
npm --version
```

#### 4. Install Git

```bash
apt install -y git
```

#### 5. Clone repo

```bash
cd /var/www
git clone https://github.com/yourusername/automation.git
cd automation
```

#### 6. Install dependencies

```bash
npm install
```

#### 7. Setup environment

```bash
# Copy và edit .env
cp .env.example .env
nano .env
# Paste your credentials và save (Ctrl+X, Y, Enter)
```

#### 8. Upload Google credentials

```bash
# Trên máy local:
scp credentials.json root@your_server_ip:/var/www/automation/

# Hoặc dùng nano:
nano credentials.json
# Paste nội dung và save
```

#### 9. Install PM2 (Process Manager)

```bash
npm install -g pm2
```

#### 10. Start với PM2

```bash
# Start monitor
pm2 start scripts/workflow-monitor/monitor.js --name monitor

# Start server
pm2 start scripts/workflow-monitor/server.js --name dashboard

# Save PM2 config
pm2 save

# Auto-start on reboot
pm2 startup
# Copy và chạy command PM2 hiển thị
```

#### 11. Setup Nginx (Reverse Proxy)

```bash
# Install Nginx
apt install -y nginx

# Configure
nano /etc/nginx/sites-available/automation
```

Paste config:

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

Enable site:

```bash
ln -s /etc/nginx/sites-available/automation /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 12. Setup SSL (Optional but Recommended)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your_domain.com

# Auto-renew
certbot renew --dry-run
```

#### 13. Setup Firewall

```bash
# Enable UFW
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

#### 14. Monitor logs

```bash
# PM2 logs
pm2 logs

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Cost:
- DigitalOcean: $6/month (Basic Droplet)
- Domain: ~$12/year

---

## Option 4: Vercel (Frontend Only)

⚠️ **Lưu ý**: Vercel chỉ phù hợp cho dashboard frontend. Backend cần deploy riêng.

### Deploy Dashboard:

1. **Create `vercel.json`**:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "scripts/workflow-monitor/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "scripts/workflow-monitor/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "scripts/workflow-monitor/dashboard.html"
    }
  ]
}
```

2. **Deploy**:

```bash
npm install -g vercel
vercel
```

### Limitations:
- Serverless functions có timeout (10s free, 60s paid)
- Không persistent processes
- Không WebSocket support tốt

---

## Option 5: Heroku

### Steps:

1. **Install Heroku CLI**:

```bash
npm install -g heroku
```

2. **Login**:

```bash
heroku login
```

3. **Create app**:

```bash
heroku create automation-dashboard
```

4. **Add buildpack**:

```bash
heroku buildpacks:add heroku/nodejs
```

5. **Create `Procfile`**:

```
web: node scripts/workflow-monitor/monitor.js & node scripts/workflow-monitor/server.js
```

6. **Set environment variables**:

```bash
heroku config:set ANTHROPIC_API_KEY=your_key
heroku config:set NODE_ENV=production
# ... set all other env vars
```

7. **Deploy**:

```bash
git push heroku main
```

8. **Open app**:

```bash
heroku open
```

### Cost:
- Eco Dynos: $5/month
- Basic: $7/month

---

## 🔧 Post-Deployment Checklist

### ✅ Verify Everything Works:

1. **Dashboard accessible**:
   ```bash
   curl https://your-domain.com
   ```

2. **API working**:
   ```bash
   curl -X POST https://your-domain.com/api/create-content \
     -H "Content-Type: application/json" \
     -d '{"brand":"longbest-ai","topic":"Test","format":"auto"}'
   ```

3. **WebSocket connection**:
   - Open dashboard in browser
   - Check "Connected" status in top-right

4. **Google APIs authenticated**:
   ```bash
   # Test Drive upload
   node scripts/drive-uploader/upload.js test-folder --brand longbest-ai
   ```

5. **Database created**:
   ```bash
   ls -la data/analytics.db
   ```

### 🔐 Security Hardening:

1. **Change default ports** (production):
   ```env
   DASHBOARD_PORT=8080
   MONITOR_PORT=8081
   ```

2. **Add rate limiting**:
   ```bash
   npm install express-rate-limit
   ```

3. **Setup HTTPS** (always!)

4. **Use environment variables** (never hardcode)

5. **Regular backups**:
   ```bash
   # Backup database
   cp data/analytics.db backups/analytics-$(date +%Y%m%d).db
   ```

---

## 📊 Monitoring Production

### PM2 Monitoring:

```bash
# Status
pm2 status

# Logs
pm2 logs

# Restart
pm2 restart all

# Stop
pm2 stop all
```

### Health Checks:

```bash
# Create healthcheck endpoint
curl https://your-domain.com/health
```

### Alerts:

Setup Telegram/Email alerts khi server down.

---

## 🚀 CI/CD (Optional)

### GitHub Actions:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/automation
            git pull
            npm install
            pm2 restart all
```

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid | Best For |
|----------|-----------|------|----------|
| Railway | $5 credit/month | ~$10/month | Easy setup |
| Render | Yes (limited) | $7/month | Quick deploy |
| VPS (DO) | No | $6/month | Full control |
| Vercel | Yes | $20/month | Frontend only |
| Heroku | No | $7/month | Simple apps |

---

## 🎯 Recommendations

- **Development**: Local (free)
- **Testing**: Railway free tier
- **Production**: VPS (DigitalOcean $6/month)
- **Enterprise**: Multiple VPS with load balancer

---

**Questions?** Check [PROJECT.md](./PROJECT.md) or open an issue!
