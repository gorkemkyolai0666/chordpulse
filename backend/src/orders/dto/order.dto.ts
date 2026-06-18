import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { OrderStatus, OrderType } from '@prisma/client';

export class CreateOrderDto {
  @IsString()
  orderNumber: string;

  @IsString()
  clientName: string;

  @IsOptional()
  @IsEnum(OrderType)
  orderType?: OrderType;

  @IsOptional()
  @IsInt()
  @Min(1)
  instrumentCount?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  benchName?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  orderNumber?: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsEnum(OrderType)
  orderType?: OrderType;

  @IsOptional()
  @IsInt()
  @Min(1)
  instrumentCount?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  benchName?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
