import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const FIRM_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.firm.upsert({
    where: { id: FIRM_ID },
    update: {},
    create: {
      id: FIRM_ID,
      name: 'İstanbul Enstrüman Atölyesi',
      phone: '+905551234567',
      address: 'Cihangir İstiklal Caddesi No: 42',
      city: 'İstanbul',
      state: 'Marmara',
      zipCode: '34433',
      totalRepairBenches: 4,
      timezone: 'Europe/Istanbul',
      users: {
        create: {
          email: 'demo@istanbulenstrumanatolyesi.com',
          passwordHash,
          firstName: 'Emre',
          lastName: 'Kaya',
          role: 'owner',
        },
      },
    },
  });

  const orderData = [
    { id: '00000000-0000-0000-0000-000000000101', orderNumber: 'CP-2401', clientName: 'Mimar Sinan Konservatuvarı', orderType: 'corporate' as const, instrumentCount: 12, status: 'arranging' as const, benchName: 'Tezgah-A' },
    { id: '00000000-0000-0000-0000-000000000102', orderNumber: 'CP-2402', clientName: 'Borusan Müzik Evi', orderType: 'retail' as const, instrumentCount: 3, status: 'preparing' as const, benchName: 'Tezgah-B' },
    { id: '00000000-0000-0000-0000-000000000103', orderNumber: 'CP-2403', clientName: 'İstanbul Devlet Senfoni Orkestrası', orderType: 'subscription' as const, instrumentCount: 8, status: 'ready' as const, benchName: 'Tezgah-A' },
    { id: '00000000-0000-0000-0000-000000000104', orderNumber: 'CP-2404', clientName: 'Özel Koleksiyon — Keman Restorasyonu', orderType: 'seasonal' as const, instrumentCount: 1, status: 'delivered' as const, benchName: 'Tezgah-C' },
    { id: '00000000-0000-0000-0000-000000000105', orderNumber: 'CP-2405', clientName: 'Lise Müzik Bölümü Bakım Paketi', orderType: 'corporate' as const, instrumentCount: 24, status: 'quoted' as const },
    { id: '00000000-0000-0000-0000-000000000106', orderNumber: 'CP-2406', clientName: 'Perakende — Akustik Gitar Kurulumu', orderType: 'retail' as const, instrumentCount: 1, status: 'sourcing' as const, benchName: 'Tezgah-B' },
  ];

  const orders = [];
  for (const o of orderData) {
    const order = await prisma.repairOrder.upsert({
      where: { id: o.id },
      update: {},
      create: { ...o, firmId: FIRM_ID, dueDate: new Date() },
    });
    orders.push(order);
  }

  const instrumentData = [
    { id: '00000000-0000-0000-0000-000000000201', instrumentName: 'Stradivarius Kopya Keman', instrumentFamily: 'Keman', condition: 'arranged' as const, status: 'reserved' as const, laborHours: 18, orderId: orders[0].id },
    { id: '00000000-0000-0000-0000-000000000202', instrumentName: 'Fender Stratocaster', instrumentFamily: 'Elektro Gitar', condition: 'conditioning' as const, status: 'in_stock' as const, laborHours: 6, orderId: orders[1].id },
    { id: '00000000-0000-0000-0000-000000000203', instrumentName: 'Yamaha C3 Grand Piano', instrumentFamily: 'Piyano', condition: 'fresh' as const, status: 'in_stock' as const, laborHours: 32, orderId: orders[2].id },
  ];

  for (const instrument of instrumentData) {
    await prisma.instrumentItem.upsert({
      where: { id: instrument.id },
      update: {},
      create: { ...instrument, firmId: FIRM_ID },
    });
  }

  const scheduledAt = new Date();
  scheduledAt.setDate(scheduledAt.getDate() + 2);

  await prisma.handoffJob.upsert({
    where: { id: '00000000-0000-0000-0000-000000000301' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000301',
      firmId: FIRM_ID,
      orderId: orders[0].id,
      handoffName: 'Konservatuvar Teslimatı #7',
      handoffType: 'event',
      benchName: 'Tezgah-A',
      travelKm: 12,
      caseLoad: 8,
      scheduledAt,
      status: 'scheduled',
      notes: 'Sabah 10:00 — hassas taşıma gerekli',
    },
  });

  await prisma.handoffJob.upsert({
    where: { id: '00000000-0000-0000-0000-000000000302' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000302',
      firmId: FIRM_ID,
      orderId: orders[1].id,
      handoffName: 'Müzik Evi Müşteri Teslimi',
      handoffType: 'rush',
      benchName: 'Tezgah-B',
      travelKm: 5,
      caseLoad: 2,
      scheduledAt: new Date(),
      status: 'en_route',
      notes: 'Müşteri mağazada bekliyor — 15:30',
    },
  });

  const benchDate = new Date();
  benchDate.setDate(benchDate.getDate() + 5);

  await prisma.serviceBench.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      firmId: FIRM_ID,
      title: 'Perde Ayarı & Fret İşçiliği',
      description: 'Klasik gitar perde düzeltme ve fret taşlama atölyesi',
      instructor: 'Emre Kaya',
      scheduledAt: benchDate,
      maxStudents: 6,
      enrolled: 4,
      status: 'scheduled',
    },
  });

  const partData = [
    { id: '00000000-0000-0000-0000-000000000501', title: 'D\'Addario EJ16 Tel Seti', partCategory: 'rose' as const, status: 'active' as const, shelfLifeDays: 365, pricePerUnit: 285, leadDays: 2 },
    { id: '00000000-0000-0000-0000-000000000502', title: 'Keman Ebeni Köprü', partCategory: 'seasonal' as const, status: 'active' as const, shelfLifeDays: 730, pricePerUnit: 1200, leadDays: 5 },
    { id: '00000000-0000-0000-0000-000000000503', title: 'Gibson Humbucker Pickup', partCategory: 'tropical' as const, status: 'active' as const, shelfLifeDays: 365, pricePerUnit: 3400, leadDays: 7 },
    { id: '00000000-0000-0000-0000-000000000504', title: 'Piyano Damper Keçesi Seti', partCategory: 'dried' as const, status: 'active' as const, shelfLifeDays: 180, pricePerUnit: 890, leadDays: 3 },
  ];

  for (const part of partData) {
    await prisma.sparePart.upsert({
      where: { id: part.id },
      update: {},
      create: { ...part, firmId: FIRM_ID },
    });
  }

  console.log('ChordPulse seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
