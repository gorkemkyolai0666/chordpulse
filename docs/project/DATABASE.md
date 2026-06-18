# ChordPulse Database Schema

## Tablolar

### print_shops
Tenant — baskı atölyesi profili. `total_stations` makine kapasitesi.

### users
Kullanıcı hesapları. Roller: `owner`, `manager`, `operator`.

### print_jobs
Müşteri baskı işleri. `job_number` + `print_shop_id` unique.

### paper_stock
Kağıt/malzeme envanteri. Opsiyonel `job_id` bağlantısı.

### proof_rounds
Müşteri prova onay turları. `job_id` zorunlu.

### machine_maintenance
Makine bakım planları (kalibrasyon, temizlik, vb.).

### print_finishes
Bitirme hizmetleri kataloğu (laminasyon, ciltleme, UV lak).

## Enum'lar

- `RoofingJobStatus`: quoted → in_progress → printing → finishing → ready → delivered | cancelled
- `MembraneRollStatus`: in_stock, low, reorder, out_of_stock
- `RoofInspectionStatus`: pending, sent, revision, approved, rejected
- `CrewStatus`: scheduled, in_progress, completed, overdue
- `SystemCategory`: lamination, binding, cutting, folding, uv_coating, embossing, other

## Migration

```bash
cd backend && npx prisma migrate deploy
```

## Seed

Idempotent — sabit UUID'ler ile upsert. Demo: `demo@istanbulenstrumanatolyesi.com / demo123456`.
