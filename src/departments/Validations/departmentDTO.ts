import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepatmentDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  responsibilities: string;
}
