import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(firmId: string) {
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      firm,
      totalOrders,
      activeOrders,
      cancelledOrders,
      totalInstruments,
      completedHandoffs,
      pendingHandoffs,
      upcomingBenches,
      seasonalParts,
      totalLaborHours,
      recentHandoffs,
      repairBenches,
    ] = await Promise.all([
      this.prisma.firm.findUnique({ where: { id: firmId } }),
      this.prisma.repairOrder.count({ where: { firmId } }),
      this.prisma.repairOrder.count({
        where: {
          firmId,
          status: { in: ['sourcing', 'preparing', 'arranging', 'ready'] },
        },
      }),
      this.prisma.repairOrder.count({ where: { firmId, status: 'cancelled' } }),
      this.prisma.instrumentItem.count({
        where: { firmId, condition: { in: ['fresh', 'conditioning', 'arranged'] } },
      }),
      this.prisma.handoffJob.count({ where: { firmId, status: 'delivered' } }),
      this.prisma.handoffJob.count({
        where: {
          firmId,
          status: { in: ['scheduled', 'loading', 'en_route'] },
          scheduledAt: { lte: sevenDaysLater },
        },
      }),
      this.prisma.serviceBench.count({
        where: {
          firmId,
          status: { in: ['scheduled', 'in_progress'] },
          scheduledAt: { lte: thirtyDaysLater },
        },
      }),
      this.prisma.sparePart.count({
        where: {
          firmId,
          status: { in: ['seasonal', 'discontinued'] },
        },
      }),
      this.prisma.instrumentItem.aggregate({
        where: { firmId },
        _sum: { laborHours: true },
      }),
      this.prisma.handoffJob.findMany({
        where: { firmId },
        include: {
          order: { select: { orderNumber: true, clientName: true } },
        },
        orderBy: { scheduledAt: 'desc' },
        take: 5,
      }),
      this.prisma.repairOrder.groupBy({
        by: ['benchName'],
        where: { firmId, benchName: { not: null } },
        _count: { id: true },
      }),
    ]);

    const totalCapacity = firm?.totalRepairBenches || totalOrders || 1;
    const orderFulfillmentRate =
      totalOrders > 0 ? Math.round((activeOrders / totalOrders) * 1000) / 10 : 0;

    const monthlyTrend = await this.getMonthlyTrend(firmId, sixMonthsAgo);

    return {
      totalOrders,
      activeOrders,
      cancelledOrders,
      totalCapacity,
      orderFulfillmentRate,
      totalInstruments,
      completedHandoffs,
      pendingHandoffs,
      upcomingBenches,
      seasonalParts,
      totalLaborHours: totalLaborHours._sum.laborHours || 0,
      recentHandoffs,
      repairBenches: repairBenches.map((room) => ({
        benchName: room.benchName,
        orderCount: room._count.id,
      })),
      monthlyTrend,
    };
  }

  private async getMonthlyTrend(firmId: string, since: Date) {
    const deliveries = await this.prisma.handoffJob.findMany({
      where: { firmId, scheduledAt: { gte: since } },
      select: { scheduledAt: true, status: true },
    });

    const months: Record<string, { handoffJobs: number; completed: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { handoffJobs: 0, completed: 0 };
    }

    deliveries.forEach((delivery) => {
      const key = `${delivery.scheduledAt.getFullYear()}-${String(delivery.scheduledAt.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        months[key].handoffJobs++;
        if (delivery.status === 'delivered') months[key].completed++;
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  }
}
