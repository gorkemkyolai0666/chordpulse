import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PartCategory, PartStatus } from '@prisma/client';

export class CreatePartDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(PartCategory)
  partCategory?: PartCategory;

  @IsOptional()
  @IsEnum(PartStatus)
  status?: PartStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  shelfLifeDays?: number;

  @IsNumber()
  @Min(0)
  pricePerUnit: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  leadDays?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePartDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(PartCategory)
  partCategory?: PartCategory;

  @IsOptional()
  @IsEnum(PartStatus)
  status?: PartStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  shelfLifeDays?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerUnit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  leadDays?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
