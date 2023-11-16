import { IsInt, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit: number = 10;
}
import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';
export class MongooseIdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: mongoose.Schema.Types.ObjectId;
}
export class PaginationHelper {
  static paginateQuery(paginationDto: PaginationDto): number {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    return skip;
  }
}
