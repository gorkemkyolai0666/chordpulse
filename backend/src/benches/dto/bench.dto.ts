import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { BenchStatus } from '@prisma/client';

export class CreateBenchDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instructor?: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxStudents?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  enrolled?: number;

  @IsOptional()
  @IsEnum(BenchStatus)
  status?: BenchStatus;
}

export class UpdateBenchDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instructor?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxStudents?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  enrolled?: number;

  @IsOptional()
  @IsEnum(BenchStatus)
  status?: BenchStatus;
}
