import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstrumentDto, UpdateInstrumentDto } from './dto/instrument.dto';

@Injectable()
export class InstrumentsService {
  constructor(private prisma: PrismaService) {}

  async list(firmId: string, params: { page?: number; condition?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { firmId };
    if (params.condition) where.condition = params.condition;

    const [data, total] = await Promise.all([
      this.prisma.instrumentItem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { order: { select: { orderNumber: true, clientName: true } } },
      }),
      this.prisma.instrumentItem.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(firmId: string, id: string) {
    const item = await this.prisma.instrumentItem.findFirst({
      where: { id, firmId },
      include: { order: true },
    });
    if (!item) throw new NotFoundException('Stem lot not found');
    return item;
  }

  async create(firmId: string, dto: CreateInstrumentDto) {
    return this.prisma.instrumentItem.create({ data: { ...dto, firmId } });
  }

  async update(firmId: string, id: string, dto: UpdateInstrumentDto) {
    await this.get(firmId, id);
    return this.prisma.instrumentItem.update({ where: { id }, data: dto });
  }

  async remove(firmId: string, id: string) {
    await this.get(firmId, id);
    return this.prisma.instrumentItem.delete({ where: { id } });
  }
}
