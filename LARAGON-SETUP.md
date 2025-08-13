# Setup Email Collector dengan Laragon

## 1. Persiapan Laragon

### Start Services
1. Buka Laragon
2. Klik **Start All** untuk menjalankan Apache & MySQL
3. Pastikan status MySQL hijau (running)

### Akses Database
- **phpMyAdmin**: http://localhost/phpmyadmin
- **Username**: root
- **Password**: (kosong/blank)
- **Host**: localhost atau 127.0.0.1
- **Port**: 3306

## 2. Setup Database Manual (Recommended)

### Via phpMyAdmin:
1. Buka http://localhost/phpmyadmin
2. Klik **New** di sidebar kiri
3. Nama database: `email_collector`
4. Klik **Create**
5. Pilih database `email_collector`
6. Klik tab **SQL**
7. Copy paste script berikut:

```sql
CREATE TABLE IF NOT EXISTS emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);
```

8. Klik **Go**

### Via MySQL Command Line:
```bash
# Buka terminal di Laragon
# Klik Laragon > Terminal

mysql -u root -p
# (tekan Enter untuk password kosong)

CREATE DATABASE email_collector;
USE email_collector;

CREATE TABLE emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

SHOW TABLES;
DESCRIBE emails;
EXIT;
```

## 3. Konfigurasi Environment

Edit file `.env.local`:
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=email_collector
DB_PORT=3306
```

## 4. Test Koneksi

Jalankan script test:
```bash
npm run setup-db
```

Jika berhasil, Anda akan melihat:
```
✅ Connected to MySQL server
✅ Database 'email_collector' created or already exists
✅ Using database 'email_collector'
✅ Table "emails" created or already exists
🎉 Database setup completed successfully!
```

## 5. Jalankan Aplikasi

```bash
npm run dev
```

Buka: http://localhost:3000

## Troubleshooting Laragon

### MySQL tidak start:
1. Stop semua services di Laragon
2. Klik **Menu > MySQL > Version** - pilih versi MySQL
3. Start All lagi

### Port conflict:
1. Klik **Menu > Preferences > Services & Ports**
2. Ubah MySQL port jika perlu (default 3306)
3. Update `.env.local` sesuai port baru

### Permission denied:
1. Run Laragon as Administrator
2. Atau ubah folder permission

### Database connection error:
1. Pastikan MySQL service hijau di Laragon
2. Test koneksi via phpMyAdmin dulu
3. Periksa kredensial di `.env.local`

## Quick Commands

```bash
# Test database connection
npm run setup-db

# Start development
npm run dev

# Check MySQL status (via Laragon terminal)
mysql -u root -p -e "SHOW DATABASES;"
```
## 🔐 P
IN Authentication

Aplikasi sekarang dilindungi dengan PIN authentication:

### Login
- Buka http://localhost:3000
- Masukkan PIN: **230299**
- Klik "Masuk"

### Session Management
- Session tersimpan di localStorage browser
- Tidak perlu login ulang sampai logout atau clear browser data
- Klik tombol "Logout" di pojok kanan atas untuk keluar

### Keamanan
- PIN: 230299 (dapat diubah di source code)
- Session otomatis tersimpan
- Akses database hanya setelah authentication

## 📱 Akses Lengkap

- **Web App:** http://localhost:3000
- **PIN:** 230299
- **phpMyAdmin:** http://localhost/phpmyadmin
- **Database:** email_collector
- **Tabel:** emails

Aplikasi siap digunakan dengan keamanan PIN! Semua data email akan tersimpan permanen di database MySQL Laragon.