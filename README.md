# ChordPulse

Enstrüman tamir atölyesi operasyon SaaS — tamir siparişleri, enstrüman takibi, teslimat planı, tezgah planlaması, yedek parça stoku.

## Quick Start

```bash
# Backend (:4029)
cd backend && cp .env.example .env && npm install --legacy-peer-deps
npx prisma migrate deploy && npx prisma db seed
npm run start:dev

# Frontend (:3029)
cd frontend && cp .env.example .env.local && npm ci
npm run dev
```

## Demo

- **Email:** demo@istanbulenstrumanatolyesi.com
- **Password:** demo123456

## Docs

See `docs/project/` for PRD, ARCHITECTURE, API, DESIGN_SYSTEM, and more.
