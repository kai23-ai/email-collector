# 🚀 Panduan Deployment Email Collector

## Platform Deployment yang Direkomendasikan

### 1. 🌟 **Railway** (RECOMMENDED - Paling Mudah)
**Cocok untuk**: Fullstack app dengan database MySQL
**Gratis**: Ya (dengan limit)

#### Langkah-langkah:
1. **Daftar di Railway**: https://railway.app
2. **Connect GitHub**: Login dengan akun GitHub
3. **Deploy Project**:
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository `email-collector`
4. **Add MySQL Database**:
   - Klik "New" > "Database" > "Add MySQL"
   - Railway akan otomatis create database
5. **Set Environment Variables**:
   - Klik project > "Variables"
   - Tambahkan:
     ```
     DB_HOST=mysql.railway.internal
     DB_USER=root
     DB_PASSWORD=[auto-generated]
     DB_NAME=railway
     DB_PORT=3306
     NODE_ENV=production
     ```
   - Railway akan auto-fill DB credentials
6. **Deploy**: Railway akan otomatis build dan deploy

**URL**: Railway akan berikan URL seperti `https://your-app.railway.app`

---

### 2. 🔷 **Vercel + PlanetScale**
**Cocok untuk**: Next.js apps (tapi perlu database eksternal)

#### Setup Database (PlanetScale):
1. **Daftar PlanetScale**: https://planetscale.com
2. **Create Database**: Buat database baru
3. **Get Connection String**: Copy connection URL

#### Deploy ke Vercel:
1. **Daftar Vercel**: https://vercel.com
2. **Import Project**: Connect GitHub repo
3. **Set Environment Variables**:
   ```
   DATABASE_URL=mysql://username:password@host/database?sslaccept=strict
   ```
4. **Deploy**: Vercel akan otomatis deploy

---

### 3. 🟢 **Render**
**Cocok untuk**: Fullstack apps dengan database

#### Langkah-langkah:
1. **Daftar Render**: https://render.com
2. **Create Web Service**:
   - Connect GitHub repo
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. **Create PostgreSQL Database** (atau gunakan MySQL eksternal)
4. **Set Environment Variables**
5. **Deploy**

---

### 4. 🔴 **Heroku** (Berbayar)
**Cocok untuk**: Production apps

#### Langkah-langkah:
1. **Install Heroku CLI**
2. **Login**: `heroku login`
3. **Create App**: `heroku create email-collector-app`
4. **Add MySQL**: `heroku addons:create cleardb:ignite`
5. **Set Config**: `heroku config:set NODE_ENV=production`
6. **Deploy**: `git push heroku main`

---

## 🎯 Rekomendasi Berdasarkan Kebutuhan

### Untuk Pemula (Gratis & Mudah):
**Railway** - Setup paling mudah, database included

### Untuk Production (Performa Terbaik):
**Vercel + PlanetScale** - Sangat cepat untuk Next.js

### Untuk Budget Terbatas:
**Railway** atau **Render** - Tier gratis yang bagus

---

## 📋 Checklist Sebelum Deploy

- [ ] Code sudah di GitHub
- [ ] Environment variables sudah disiapkan
- [ ] Database schema sudah siap
- [ ] Build command berjalan lokal: `npm run build`
- [ ] Start command berjalan: `npm start`

---

## 🔧 Environment Variables yang Dibutuhkan

```env
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306
NODE_ENV=production
```

---

## 🚨 Troubleshooting

### Build Error:
- Pastikan semua dependencies ada di `package.json`
- Cek TypeScript errors: `npm run build`

### Database Connection Error:
- Periksa environment variables
- Pastikan database server berjalan
- Cek firewall/network settings

### 404 Error:
- Pastikan build berhasil
- Cek routing di Next.js

---

## 📞 Bantuan

Jika ada masalah deployment, beri tahu platform mana yang Anda pilih dan error message yang muncul!