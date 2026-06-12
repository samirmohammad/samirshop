# 🌍 راهنمای Deployment

## Deployment گزینه‌ها

### 1️⃣ Backend Deployment

#### بر روی Heroku

```bash
# نصب Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# ورود
heroku login

# ایجاد اپلیکیشن
cd backend
heroku create samirshop-api

# تنظیم متغیرهای محیطی
heroku config:set PORT=5000
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

#### بر روی Railway

```bash
# نصب Railway CLI
npm i -g @railway/cli

# ورود
railway login

# راه‌اندازی
railway init
railway add postgresql # یا mongodb

# Deploy
railway deploy
```

#### بر روی AWS EC2

```bash
# اتصال
ssh -i key.pem ec2-user@your-instance-ip

# نصب Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone Repository
git clone https://github.com/samirmohammad/samirshop.git
cd samirshop/backend

# نصب و اجرا
npm install
npm run build
pm2 start server.js --name "samirshop-api"
```

---

### 2️⃣ Frontend Deployment

#### بر روی Vercel (سهل‌ترین)

```bash
# نصب Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# یا اتصال GitHub و خودکار Deploy
```

**تنظیمات Vercel:**
- Framework: Next.js
- Root Directory: `frontend`
- Environment Variables:
  - `NEXT_PUBLIC_API_URL`: https://your-api.com/api

#### بر روی Netlify

```bash
# Build
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

#### بر روی AWS S3 + CloudFront

```bash
# Build
npm run build
npm run export

# Upload to S3
aws s3 sync out/ s3://your-bucket-name/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

### 3️⃣ Admin Panel Deployment

مشابه Frontend:

```bash
vercel --name samirshop-admin
```

---

## 🗄️ Database Deployment

### MongoDB Atlas (پیشنهادی)

1. ثبت‌نام: https://www.mongodb.com/cloud/atlas
2. Cluster ایجاد کنید
3. User ایجاد کنید
4. Connection String کپی کنید

```
mongodb+srv://username:password@cluster.mongodb.net/samirshop
```

### PostgreSQL بر روی RDS

```bash
# AWS RDS Console
# Create Database > PostgreSQL
# Copy Endpoint

# Connection String
postgresql://user:password@your-endpoint:5432/samirshop
```

---

## 🔐 متغیرهای محیطی Production

### Backend

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/samirshop
JWT_SECRET=very_strong_secret_key_here_change_me
ADMIN_USERNAME=admin
ADMIN_PASSWORD=very_strong_password_here
ADMIN_SECRET=very_strong_admin_secret
BANK_MELLI_MERCHANT_ID=your_real_merchant_id
BANK_MELLI_API_KEY=your_real_api_key
BANK_MELLI_TERMINAL_ID=your_real_terminal_id
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com
```

### Frontend

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
NEXT_PUBLIC_SITE_NAME=SamirShop
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## 🔐 SSL/HTTPS

### Let's Encrypt (رایگان)

```bash
# نصب Certbot
sudo apt-get install certbot python3-certbot-nginx

# دریافت گواهی
sudo certbot certonly --nginx -d your-domain.com

# تجدید خودکار
sudo certbot renew --dry-run
```

---

## 📊 Monitoring

### PM2 (بر روی Server)

```bash
# نصب
npm i -g pm2

# اجرا
pm2 start backend/server.js --name "samirshop-api"
pm2 save

# مانیتورینگ
pm2 monit
pm2 logs
```

### Sentry (Error Tracking)

```bash
npm install @sentry/node

# در server.js
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'your_sentry_dsn' });
```

---

## 📈 Performance Optimization

### Backend

```javascript
// Redis Caching
const redis = require('redis');
const client = redis.createClient();

// استفاده برای محصولات
app.get('/api/products', async (req, res) => {
  const cached = await client.get('products');
  if (cached) return res.json(JSON.parse(cached));
  
  // اگر کش نبود، از DB بگیر و کش کن
});
```

### Frontend

```javascript
// Image Optimization
import Image from 'next/image';

<Image 
  src="/product.jpg" 
  alt="Product"
  width={300}
  height={300}
  priority
/>
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Install Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install & Build Backend
      run: |
        cd backend
        npm install
        npm run build
    
    - name: Deploy to Heroku
      env:
        HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
      run: |
        git push https://git.heroku.com/samirshop-api.git main
```

---

## ✅ Pre-Deployment Checklist

- [ ] تمام Environment Variables تنظیم شده‌اند
- [ ] Database Production آماده است
- [ ] SSL/HTTPS فعال است
- [ ] Backup روزانه تنظیم شده است
- [ ] Monitoring و Logging فعال است
- [ ] Error handling در جای خود است
- [ ] Tests پاس می‌کنند
- [ ] Performance بهینه است
- [ ] Security headers تنظیم شده‌اند
- [ ] API Documentation آپدیت شده است

---

## 🚀 نکات نهایی

1. **همیشه HTTPS استفاده کنید**
2. **رمزهای عبور قوی و منحصربه‌فرد استفاده کنید**
3. **Backup منظم تهیه کنید**
4. **Logs مانیتور کنید**
5. **Security updates را دنبال کنید**

---

## 📞 پشتیبانی

برای مساعدت بیشتر:
- Vercel Docs: https://vercel.com/docs
- Heroku Docs: https://devcenter.heroku.com
- MongoDB Atlas: https://docs.atlas.mongodb.com
