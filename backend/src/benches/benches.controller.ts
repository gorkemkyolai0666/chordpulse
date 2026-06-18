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
import { BenchesService } from './benches.service';
import { CreateBenchDto, UpdateBenchDto } from './dto/bench.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('benches')
@UseGuards(JwtAuthGuard)
export class BenchesController {
  constructor(private assembliesService: BenchesService) {}

  @Get()
  list(
    @Request() req: { user: { firmId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.assembliesService.list(req.user.firmId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.assembliesService.get(req.user.firmId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { firmId: string } },
    @Body() dto: CreateBenchDto,
  ) {
    return this.assembliesService.create(req.user.firmId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { firmId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateBenchDto,
  ) {
    return this.assembliesService.update(req.user.firmId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.assembliesService.remove(req.user.firmId, id);
  }
}
