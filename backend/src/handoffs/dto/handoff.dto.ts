import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { HandoffStatus, HandoffType } from '@prisma/client';

export class CreateHandoffDto {
  @IsUUID()
  orderId: string;

  @IsString()
  handoffName: string;

  @IsOptional()
  @IsEnum(HandoffType)
  handoffType?: HandoffType;

  @IsOptional()
  @IsString()
  benchName?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  travelKm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  caseLoad?: number;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(HandoffStatus)
  status?: HandoffStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateHandoffDto {
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @IsOptional()
  @IsString()
  handoffName?: string;

  @IsOptional()
  @IsEnum(HandoffType)
  handoffType?: HandoffType;

  @IsOptional()
  @IsString()
  benchName?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  travelKm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  caseLoad?: number;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(HandoffStatus)
  status?: HandoffStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
