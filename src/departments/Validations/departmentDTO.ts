import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDepatmentDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsNotEmpty()
  responsibilities: string;
}


export class UpdateDepatmentDTO {
  @IsString()
  @IsOptional()
  title: string;
  @IsString()
  @IsOptional()
  responsibilities: string;
}
