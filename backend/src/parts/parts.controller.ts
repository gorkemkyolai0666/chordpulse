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
import { PartsService } from './parts.service';
import { CreatePartDto, UpdatePartDto } from './dto/part.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('parts')
@UseGuards(JwtAuthGuard)
export class PartsController {
  constructor(private mouldingsService: PartsService) {}

  @Get()
  list(
    @Request() req: { user: { firmId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.mouldingsService.list(req.user.firmId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.mouldingsService.get(req.user.firmId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { firmId: string } },
    @Body() dto: CreatePartDto,
  ) {
    return this.mouldingsService.create(req.user.firmId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { firmId: string } },
    @Param('id') id: string,
    @Body() dto: UpdatePartDto,
  ) {
    return this.mouldingsService.update(req.user.firmId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.mouldingsService.remove(req.user.firmId, id);
  }
}
