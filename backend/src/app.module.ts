import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { FirmModule } from './firm/firm.module';
import { OrdersModule } from './orders/orders.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { HandoffsModule } from './handoffs/handoffs.module';
import { BenchesModule } from './benches/benches.module';
import { PartsModule } from './parts/parts.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    FirmModule,
    OrdersModule,
    InstrumentsModule,
    HandoffsModule,
    BenchesModule,
    PartsModule,
    DashboardModule,
  ],
})
export class AppModule {}
