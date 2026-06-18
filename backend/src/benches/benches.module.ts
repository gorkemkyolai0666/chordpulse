import { Module } from '@nestjs/common';
import { BenchesController } from './benches.controller';
import { BenchesService } from './benches.service';

@Module({
  controllers: [BenchesController],
  providers: [BenchesService],
})
export class BenchesModule {}
