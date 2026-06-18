import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockPrisma = {
    firm: { findUnique: jest.fn() },
    repairOrder: { count: jest.fn(), groupBy: jest.fn() },
    instrumentItem: { count: jest.fn(), aggregate: jest.fn() },
    handoffJob: {
      count: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    serviceBench: { count: jest.fn() },
    sparePart: { count: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should return dashboard stats', async () => {
    mockPrisma.firm.findUnique.mockResolvedValue({ totalRepairBenches: 3 });
    mockPrisma.repairOrder.count.mockResolvedValue(10);
    mockPrisma.instrumentItem.count.mockResolvedValue(24);
    mockPrisma.handoffJob.count.mockResolvedValue(5);
    mockPrisma.instrumentItem.aggregate.mockResolvedValue({ _sum: { laborHours: 48.5 } });
    mockPrisma.handoffJob.findMany.mockResolvedValue([]);
    mockPrisma.serviceBench.count.mockResolvedValue(2);
    mockPrisma.sparePart.count.mockResolvedValue(1);
    mockPrisma.repairOrder.groupBy.mockResolvedValue([
      { benchName: 'Soğuk-Oda-A', _count: { id: 5 } },
    ]);

    const stats = await service.getStats('firm-1');

    expect(stats).toHaveProperty('orderFulfillmentRate');
    expect(stats).toHaveProperty('totalLaborHours', 48.5);
    expect(stats).toHaveProperty('repairBenches');
    expect(stats).toHaveProperty('pendingHandoffs');
    expect(stats).toHaveProperty('upcomingBenches');
    expect(stats).toHaveProperty('seasonalParts');
  });
});
