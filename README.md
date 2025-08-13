# Email Collector

Aplikasi web untuk mengumpulkan dan mengelola daftar email dengan database MySQL menggunakan React, Next.js, dan Tailwind CSS.

## Fitur

- 🔐 **PIN Authentication** - Keamanan akses dengan PIN 230299
- ✅ Input email dengan validasi
- ✅ Simpan email ke database MySQL
- ✅ Tampilkan daftar email dari database
- ✅ **Pencarian email real-time**
- ✅ Hapus email individual
- ✅ Hapus semua email sekaligus
- ✅ Export daftar email ke file .txt (termasuk hasil pencarian)
- ✅ Validasi format email
- ✅ Cek duplikasi email
- ✅ Responsive design
- ✅ Loading states
- ✅ Auto database initialization
- ✅ Session management dengan localStorage

## Prerequisites

1. **MySQL Server** - Pastikan MySQL server sudah terinstall dan berjalan
2. **Node.js** - Version 18 atau lebih baru

## Setup Database

### Opsi 1: Auto Setup (Recommended)
Aplikasi akan otomatis membuat database dan tabel saat pertama kali dijalankan.

### Opsi 2: Manual Setup
Jika ingin setup manual, jalankan script SQL:
```sql
-- Buka MySQL client dan jalankan:
source database/setup.sql
```

## Cara Menjalankan

1. **Clone dan Install Dependencies:**
```bash
npm install
```

2. **Setup Environment Variables:**
Buat file `.env.local` atau edit yang sudah ada:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=email_collector
DB_PORT=3306
```

3. **Jalankan Development Server:**
```bash
npm run dev
```

4. **Buka Browser:**
Akses `http://localhost:3000`

5. **Login dengan PIN:**
Masukkan PIN: **230299** untuk mengakses aplikasi

## Teknologi yang Digunakan

- **Next.js 15** - React framework dengan App Router
- **React 18** - UI library dengan hooks
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **MySQL2** - MySQL database driver
- **ESLint** - Code linting

## Struktur Project

```
email-collector/
├── src/
│   └── app/
│       ├── layout.tsx      # Layout utama
│       ├── page.tsx        # Halaman utama
│       └── globals.css     # Global styles
├── public/                 # Static assets
└── package.json           # Dependencies
```

## Cara Menggunakan

1. Masukkan email di form input
2. Klik "Tambah Email" untuk menambahkan ke daftar
3. Lihat daftar email yang sudah terdaftar di bawah form
4. **Gunakan kotak pencarian untuk mencari email tertentu**
5. Klik "Hapus" untuk menghapus email individual
6. Klik "Export" untuk download daftar email sebagai file .txt (termasuk hasil pencarian)
7. Klik "Hapus Semua" untuk menghapus seluruh daftar
8. Klik "X" di kotak pencarian untuk menghapus filter pencarian

## Build untuk Production

```bash
npm run build
npm start
```
## 
API Endpoints

### GET /api/emails
Mengambil semua email dari database
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /api/emails/search?q=query
Mencari email berdasarkan query
```json
// Request: /api/emails/search?q=gmail
// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user@gmail.com",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /api/emails
Menambah email baru
```json
// Request
{
  "email": "user@example.com"
}

// Response
{
  "success": true,
  "message": "Email added successfully"
}
```

### DELETE /api/emails/[id]
Menghapus email berdasarkan ID
```json
{
  "success": true,
  "message": "Email deleted successfully"
}
```

### DELETE /api/emails
Menghapus semua email
```json
{
  "success": true,
  "message": "All emails deleted successfully"
}
```

### POST /api/init-db
Inisialisasi database dan tabel
```json
{
  "success": true,
  "message": "Database initialized successfully"
}
```

## Database Schema

```sql
CREATE TABLE emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Error Koneksi Database
1. Pastikan MySQL server berjalan
2. Periksa kredensial di `.env.local`
3. Pastikan database user memiliki permission yang cukup

### Error "Database not found"
Aplikasi akan otomatis membuat database, tapi pastikan user MySQL memiliki permission `CREATE` database.

### Error Port 3000 sudah digunakan
```bash
npm run dev -- -p 3001
```

## Development

### Struktur Project
```
email-collector/
├── src/
│   └── app/
│       ├── api/
│       │   ├── emails/
│       │   │   ├── route.ts          # CRUD emails
│       │   │   └── [id]/route.ts     # Delete by ID
│       │   └── init-db/route.ts      # Database init
│       ├── layout.tsx                # Layout utama
│       └── page.tsx                  # Halaman utama
├── lib/
│   └── db.ts                         # Database connection
├── database/
│   └── setup.sql                     # Manual setup script
└── .env.local                        # Environment variables
```

### Build untuk Production
```bash
npm run build
npm start
```