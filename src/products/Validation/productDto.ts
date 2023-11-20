
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class ProductCreateDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
  @IsOptional()
  @IsString()
  description: string;
}

export class ProductUpdateDTO {
  @IsOptional()
  @IsString()
  title: string;
  @IsOptional()
  @IsNumber()
  quantity: number;
  @IsOptional()
  @IsString()
  description: string;
}
