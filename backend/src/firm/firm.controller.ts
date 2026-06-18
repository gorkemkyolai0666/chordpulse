import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { FirmService } from './firm.service';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('firm')
@UseGuards(JwtAuthGuard)
export class FirmController {
  constructor(private printshopService: FirmService) {}

  @Get()
  get(@Request() req: { user: { firmId: string } }) {
    return this.printshopService.get(req.user.firmId);
  }

  @Patch()
  update(
    @Request() req: { user: { firmId: string } },
    @Body() dto: UpdateFirmDto,
  ) {
    return this.printshopService.update(req.user.firmId, dto);
  }
}
