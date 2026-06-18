# ChordPulse — Final Documentation

## Özet

ChordPulse, Türkiye'deki enstrüman tamir atölyeleri için üretim hazır MVP SaaS uygulamasıdır.

## Teknik Yığın

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** NestJS, Prisma, PostgreSQL
- **Dağıtım:** Railway (backend) + Vercel (frontend) via CI provision

## Portlar

- Backend: 4029
- Frontend: 3029

## API Route'ları

| Segment | Açıklama |
|---------|----------|
| `/api/orders` | Tamir siparişleri |
| `/api/instruments` | Enstrüman envanteri |
| `/api/handoffs` | Teslimat planı |
| `/api/benches` | Tamir tezgahları |
| `/api/parts` | Yedek parça kataloğu |

## Demo

- E-posta: demo@istanbulenstrumanatolyesi.com
- Şifre: demo123456

## Tasarım

Technical Artisan — sol sidebar, walnut/copper/ivory palet, JetBrains Mono + Nunito Sans.

## Doğrulama Durumu

- Backend build: ✅
- Unit testler: ✅
- Frontend build: ✅
- Integration testler: CI'da (PostgreSQL servisi ile)

## Teslimat

- Artefakt: `project-artifacts/chordpulse/`
- Kuyruk: `projects/project-queue/chordpulse.json`
- Repo oluşturma: `provision-new-project` workflow (main merge sonrası)
