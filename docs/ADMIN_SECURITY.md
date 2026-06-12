# 🛑 IMPORTANT - Admin Panel Security

## 🔐 Access Method (روش دسترسی)

### Hiding the Admin Panel URL

**Option 1: Via Environment Variable**
```
NEXT_PUBLIC_ADMIN_URL=http://admin.your-domain.com
```

**Option 2: Via Subdomain (بهتر)**
```
admin.samirshop.com -> localhost:3001
```

**Option 3: Via Random Path (بهترین)**
```
/panel-2024-secret-key/login
/admin-$RANDOM_TOKEN/dashboard
```

---

## 🔑 Security Features

✅ JWT Authentication with Expiration
✅ Admin Secret Header (`x-admin-secret`)
✅ Password Hashing with Bcrypt
✅ Role-based Access Control (RBAC)
✅ Activity Logging
✅ Rate Limiting

---

## 📝 Setup Admin User

### 1. Database Connection
```bash
mongo samirshop
```

### 2. Create Admin User
```javascript
// Create a script: backend/scripts/create-admin.js

const mongoose = require('mongoose');
const Admin = require('../models/Admin');

mongoose.connect(process.env.MONGODB_URI);

const createAdmin = async () => {
  try {
    const admin = new Admin({
      username: 'admin',
      email: 'admin@samirshop.com',
      password: 'your_strong_password_here',
      role: 'super_admin',
      permissions: ['all'],
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit();
  }
};

createAdmin();
```

### Run:
```bash
node backend/scripts/create-admin.js
```

---

## 🚀 Deployment Tips

### 1. Change Default Credentials
```env
ADMIN_USERNAME=your_unique_username
ADMIN_PASSWORD=your_very_strong_password_here
ADMIN_SECRET=your_unique_admin_secret_key
```

### 2. Enable HTTPS Only
```javascript
// backend/middleware/security.js
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
```

### 3. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
});

app.post('/api/auth/admin/login', adminLimiter, ...);
```

### 4. IP Whitelist (Optional)
```javascript
const adminIpList = process.env.ADMIN_IPS?.split(',') || [];

const ipWhitelistMiddleware = (req, res, next) => {
  if (adminIpList.length > 0) {
    const clientIp = req.ip;
    if (!adminIpList.includes(clientIp)) {
      return res.status(403).json({ message: 'Access denied' });
    }
  }
  next();
};
```

---

## 📊 Activity Logging

```javascript
// backend/models/ActivityLog.js
const activitySchema = new mongoose.Schema({
  admin: String,
  action: String,
  resource: String,
  timestamp: { type: Date, default: Date.now },
  ip: String,
});

// Log every admin action
app.use('/api/admin', (req, res, next) => {
  res.on('finish', () => {
    ActivityLog.create({
      admin: req.admin?.username,
      action: req.method,
      resource: req.path,
      ip: req.ip,
    });
  });
  next();
});
```

---

## ✅ Security Checklist

- [ ] Admin credentials are strong
- [ ] HTTPS is enabled
- [ ] Rate limiting is configured
- [ ] Activity logging is enabled
- [ ] Regular backups are taken
- [ ] SSL/TLS certificate is valid
- [ ] Environment variables are secure
- [ ] No sensitive data in logs
- [ ] Regular security audits
- [ ] 2FA (Two-Factor Authentication) implemented

---

## 🔗 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
