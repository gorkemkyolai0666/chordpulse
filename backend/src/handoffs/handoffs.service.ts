import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHandoffDto, UpdateHandoffDto } from './dto/handoff.dto';

@Injectable()
export class HandoffsService {
  constructor(private prisma: PrismaService) {}

  async list(firmId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { firmId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.handoffJob.findMany({
        where,
        orderBy: { scheduledAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { order: { select: { orderNumber: true, clientName: true } } },
      }),
      this.prisma.handoffJob.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(firmId: string, id: string) {
    const delivery = await this.prisma.handoffJob.findFirst({
      where: { id, firmId },
      include: { order: true },
    });
    if (!delivery) throw new NotFoundException('Delivery run not found');
    return delivery;
  }

  async create(firmId: string, dto: CreateHandoffDto) {
    return this.prisma.handoffJob.create({
      data: {
        ...dto,
        firmId,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  async update(firmId: string, id: string, dto: UpdateHandoffDto) {
    await this.get(firmId, id);
    const { scheduledAt, ...rest } = dto;
    return this.prisma.handoffJob.update({
      where: { id },
      data: {
        ...rest,
        ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
      },
    });
  }

  async remove(firmId: string, id: string) {
    await this.get(firmId, id);
    return this.prisma.handoffJob.delete({ where: { id } });
  }
}
