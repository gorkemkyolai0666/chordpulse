import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateFirmDto } from './dto/update-firm.dto';

@Injectable()
export class FirmService {
  constructor(private prisma: PrismaService) {}

  get(firmId: string) {
    return this.prisma.firm.findUnique({ where: { id: firmId } });
  }

  update(firmId: string, dto: UpdateFirmDto) {
    return this.prisma.firm.update({ where: { id: firmId }, data: dto });
  }
}
