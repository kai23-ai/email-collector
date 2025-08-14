# External Monitoring Setup untuk Railway Keep-Alive

## URL Aplikasi
**Railway URL**: https://email-collector-production.up.railway.app

## 1. UptimeRobot (GRATIS - RECOMMENDED)

### Setup:
1. Daftar di: https://uptimerobot.com
2. Klik "Add New Monitor"
3. **Monitor Type**: HTTP(s)
4. **Friendly Name**: Email Collector Railway
5. **URL**: `https://email-collector-production.up.railway.app/api/health`
6. **Monitoring Interval**: 30 minutes (gratis)
7. **Alert Contacts**: Email Anda

### Advanced Settings:
- **HTTP Method**: GET
- **Timeout**: 30 seconds
- **Expected Status Code**: 200
- **Keyword Monitoring**: "success" (optional)

---

## 2. Cron-job.org (GRATIS - RECOMMENDED)

### Setup:
1. Daftar di: https://cron-job.org
2. Klik "Create cronjob"
3. **Title**: Railway Keep-Alive
4. **URL**: `https://email-collector-production.up.railway.app/api/keep-alive`
5. **Schedule**: 
   - **Minutes**: */25 (setiap 25 menit)
   - **Hours**: 0-16 (UTC) = 7-23 WIB
   - **Days**: * (setiap hari)
6. **HTTP Method**: GET
7. **Enabled**: Yes

### Cron Expression:
```
*/25 0-16 * * *
```

---

## 3. Pingdom (GRATIS dengan batasan)

### Setup:
1. Daftar di: https://www.pingdom.com
2. **Check Name**: Email Collector
3. **URL**: `https://email-collector-production.up.railway.app/api/health`
4. **Check Interval**: 60 minutes (gratis)
5. **Alert Policy**: Email notification

---

## 4. StatusCake (GRATIS dengan batasan)

### Setup:
1. Daftar di: https://www.statuscake.com
2. **Test Name**: Railway Email Collector
3. **Website URL**: `https://email-collector-production.up.railway.app/api/health`
4. **Check Rate**: 30 minutes
5. **Test Type**: HTTP
6. **Contact Groups**: Email Anda

---

## 5. Freshping (GRATIS)

### Setup:
1. Daftar di: https://www.freshworks.com/website-monitoring/
2. **Check Name**: Email Collector Railway
3. **URL**: `https://email-collector-production.up.railway.app/api/health`
4. **Check Interval**: 1 minute (50 checks gratis)
5. **Locations**: Pilih 1-2 lokasi

---

## Rekomendasi Setup (Credit-Optimized)

### Primary (Pilih 1):
- **UptimeRobot**: 30 menit interval, 24/7
- **Cron-job.org**: 25 menit interval, jam aktif saja (7-23 WIB)

### Backup (Optional):
- **GitHub Actions**: Sudah aktif, smart timing
- **Pingdom**: 60 menit interval sebagai backup

### Jadwal Optimal:
- **Jam Aktif**: 07:00-23:00 WIB (16 jam)
- **Jam Tidur**: 23:00-07:00 WIB (8 jam) - biarkan sleep untuk hemat credit
- **Interval**: 25-30 menit (sebelum Railway timeout 30 menit)

---

## Testing Setup

### Manual Test:
```bash
# Test health endpoint
curl https://email-collector-production.up.railway.app/api/health

# Test keep-alive endpoint  
curl https://email-collector-production.up.railway.app/api/keep-alive
```

### Expected Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

---

## Credit Monitoring

### Railway Dashboard:
- Login ke Railway
- Pilih project "email-collector-production"
- Tab "Usage" untuk monitor credit
- Target: < $4/bulan (buffer $1)

### Estimasi Cost dengan External Monitoring:
- **Tanpa external**: ~$3.50/bulan
- **Dengan UptimeRobot (30min)**: ~$4.20/bulan
- **Dengan Cron-job (25min, jam aktif)**: ~$3.80/bulan

---

## Troubleshooting

### Jika App Masih Sleep:
1. Cek monitoring service berjalan
2. Verifikasi URL endpoint
3. Cek Railway logs
4. Pastikan interval < 30 menit

### Jika Credit Habis:
1. Kurangi frequency monitoring
2. Gunakan jam aktif saja (7-23 WIB)
3. Hapus monitoring yang tidak perlu
4. Upgrade Railway plan jika perlu