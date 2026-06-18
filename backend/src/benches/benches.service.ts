import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBenchDto, UpdateBenchDto } from './dto/bench.dto';

@Injectable()
export class BenchesService {
  constructor(private prisma: PrismaService) {}

  async list(firmId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { firmId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.serviceBench.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.serviceBench.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(firmId: string, id: string) {
    const serviceBench = await this.prisma.serviceBench.findFirst({
      where: { id, firmId },
    });
    if (!serviceBench) throw new NotFoundException('Arrangement workshop not found');
    return serviceBench;
  }

  async create(firmId: string, dto: CreateBenchDto) {
    return this.prisma.serviceBench.create({
      data: {
        ...dto,
        firmId,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  async update(firmId: string, id: string, dto: UpdateBenchDto) {
    await this.get(firmId, id);
    const { scheduledAt, ...rest } = dto;
    return this.prisma.serviceBench.update({
      where: { id },
      data: {
        ...rest,
        ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
      },
    });
  }

  async remove(firmId: string, id: string) {
    await this.get(firmId, id);
    return this.prisma.serviceBench.delete({ where: { id } });
  }
}
