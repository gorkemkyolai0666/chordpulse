import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartDto, UpdatePartDto } from './dto/part.dto';

@Injectable()
export class PartsService {
  constructor(private prisma: PrismaService) {}

  async list(firmId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { firmId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.sparePart.findMany({
        where,
        orderBy: { title: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.sparePart.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(firmId: string, id: string) {
    const glaze = await this.prisma.sparePart.findFirst({
      where: { id, firmId },
    });
    if (!glaze) throw new NotFoundException('Flower variety not found');
    return glaze;
  }

  async create(firmId: string, dto: CreatePartDto) {
    return this.prisma.sparePart.create({ data: { ...dto, firmId } });
  }

  async update(firmId: string, id: string, dto: UpdatePartDto) {
    await this.get(firmId, id);
    return this.prisma.sparePart.update({ where: { id }, data: dto });
  }

  async remove(firmId: string, id: string) {
    await this.get(firmId, id);
    return this.prisma.sparePart.delete({ where: { id } });
  }
}
