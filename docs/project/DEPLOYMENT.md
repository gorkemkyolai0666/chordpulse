# ChordPulse Dağıtım Kılavuzu

## Demo Hesabı

- **E-posta:** demo@istanbulenstrumanatolyesi.com
- **Şifre:** demo123456

## Yerel Geliştirme

```bash
# Backend (port 4029)
cd backend && npm install --legacy-peer-deps
npx prisma migrate deploy && npx prisma db seed
PORT=4029 npm run start:prod

# Frontend (port 3029)
cd frontend && npm ci
NEXT_PUBLIC_API_URL=http://localhost:4029/api npm run dev
```

## Ortam Değişkenleri

### Backend
- `DATABASE_URL` — PostgreSQL bağlantı dizesi
- `JWT_SECRET` — JWT imzalama anahtarı
- `FRONTEND_URL` — CORS için frontend URL (virgülle ayrılmış çoklu origin desteklenir)
- `PORT` — API portu (4029)

### Frontend
- `NEXT_PUBLIC_API_URL` — Backend API URL

## CI/CD

`main` branch push sonrası backend + frontend CI geçerse `provision` job çalışır ve Railway + Vercel altyapısı otomatik sağlanır.

## Portlar

- Backend: **4029**
- Frontend: **3029**

## Doğrulama

Dağıtım sonrası:
1. `GET /api/health` → 200
2. Demo hesabıyla giriş
3. Dashboard erişimi
4. Kimlik doğrulamalı API isteği
