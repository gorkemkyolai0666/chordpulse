# ChordPulse QA Raporu

**Tarih:** 2026-06-18  
**Durum:** MVP hazır — CI doğrulaması bekleniyor

## Yerel Doğrulama

| Test | Sonuç |
|------|-------|
| Backend `npm run build` | ✅ Geçti |
| Backend `npm test` | ✅ 1/1 geçti |
| Frontend `npm run build` | ✅ Geçti |
| Port tutarlılığı (4029) | ✅ Doğrulandı |
| @Controller route hizalama | ✅ instruments/handoffs/benches/parts |
| Integration test (yerel) | ⏭ PostgreSQL yok — CI'da çalışacak |

## API Sözleşmesi

- POST `/auth/login` → 200
- POST `/orders` → 201
- PATCH `/orders/:id` → 200
- DELETE `/orders/:id` → 200
- GET korumalı endpoint (token yok) → 401

## Demo Hesabı

- demo@istanbulenstrumanatolyesi.com / demo123456
