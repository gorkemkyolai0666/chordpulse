import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { InstrumentCondition, InstrumentStatus } from '@prisma/client';

export class CreateInstrumentDto {
  @IsString()
  instrumentName: string;

  @IsOptional()
  @IsUUID()
  orderId?: string;

  @IsOptional()
  @IsString()
  instrumentFamily?: string;

  @IsOptional()
  @IsEnum(InstrumentCondition)
  condition?: InstrumentCondition;

  @IsOptional()
  @IsEnum(InstrumentStatus)
  status?: InstrumentStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  laborHours?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateInstrumentDto {
  @IsOptional()
  @IsString()
  instrumentName?: string;

  @IsOptional()
  @IsUUID()
  orderId?: string;

  @IsOptional()
  @IsString()
  instrumentFamily?: string;

  @IsOptional()
  @IsEnum(InstrumentCondition)
  condition?: InstrumentCondition;

  @IsOptional()
  @IsEnum(InstrumentStatus)
  status?: InstrumentStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  laborHours?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
