import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateFirmDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsInt()
  totalRepairBenches?: number;

  @IsOptional()
  @IsString()
  timezone?: string;
}
