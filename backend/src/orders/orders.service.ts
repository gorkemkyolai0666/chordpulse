import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async list(firmId: string, params: { page?: number; status?: string; clientName?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { firmId };
    if (params.status) where.status = params.status;
    if (params.clientName) where.clientName = { contains: params.clientName, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.repairOrder.findMany({
        where,
        orderBy: [{ dueDate: 'asc' }, { orderNumber: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          handoffJobs: {
            orderBy: { scheduledAt: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.repairOrder.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(firmId: string, id: string) {
    const order = await this.prisma.repairOrder.findFirst({
      where: { id, firmId },
      include: {
        handoffJobs: { orderBy: { scheduledAt: 'desc' }, take: 5 },
        instrumentItems: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    if (!order) throw new NotFoundException('Floral order not found');
    return order;
  }

  async create(firmId: string, dto: CreateOrderDto) {
    return this.prisma.repairOrder.create({ data: { ...dto, firmId } });
  }

  async update(firmId: string, id: string, dto: UpdateOrderDto) {
    await this.get(firmId, id);
    return this.prisma.repairOrder.update({ where: { id }, data: dto });
  }

  async remove(firmId: string, id: string) {
    await this.get(firmId, id);
    return this.prisma.repairOrder.delete({ where: { id } });
  }
}
