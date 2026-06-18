import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { CreateInstrumentDto, UpdateInstrumentDto } from './dto/instrument.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('instruments')
@UseGuards(JwtAuthGuard)
export class InstrumentsController {
  constructor(private artworksService: InstrumentsService) {}

  @Get()
  list(
    @Request() req: { user: { firmId: string } },
    @Query('page') page?: string,
    @Query('condition') condition?: string,
  ) {
    return this.artworksService.list(req.user.firmId, {
      page: page ? parseInt(page, 10) : undefined,
      condition,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.artworksService.get(req.user.firmId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { firmId: string } },
    @Body() dto: CreateInstrumentDto,
  ) {
    return this.artworksService.create(req.user.firmId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { firmId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateInstrumentDto,
  ) {
    return this.artworksService.update(req.user.firmId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.artworksService.remove(req.user.firmId, id);
  }
}
