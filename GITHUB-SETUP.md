# Setup GitHub Repository

## 1. Buat Repository Baru di GitHub

1. Buka https://github.com
2. Klik tombol **"New"** atau **"+"** > **"New repository"**
3. Isi form:
   - **Repository name**: `email-collector`
   - **Description**: `Email Collector with MySQL database and search functionality`
   - **Visibility**: Public (atau Private sesuai kebutuhan)
   - **JANGAN** centang "Add a README file" (karena sudah ada)
4. Klik **"Create repository"**

## 2. Connect Local Repository ke GitHub

Setelah repository dibuat, GitHub akan menampilkan instruksi. Jalankan command berikut:

```bash
# Tambahkan remote origin (ganti USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/USERNAME/email-collector.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

## 3. Verifikasi

Setelah push berhasil, buka repository di GitHub dan pastikan semua file sudah terupload.

## Next Steps

Setelah code di GitHub, Anda bisa deploy ke:
- **Vercel** (Recommended untuk Next.js)
- **Railway** (Mudah untuk fullstack dengan database)
- **Netlify** (Frontend only)
- **Heroku** (Fullstack)

Pilih platform deployment yang Anda inginkan!