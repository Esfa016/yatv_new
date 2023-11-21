import { Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';
export class CreateIssueDTO {
  @IsMongoId()
  @IsNotEmpty()
  processedProgram: mongoose.Types.ObjectId;
  @IsDate()
  @Type(() => Date)
  beginDate: Date;
  @IsDate()
  @Type(() => Date)
  endDate: Date;
  @IsString()
  @IsOptional()
  challanges: string;
  @IsString()
  @IsOptional()
  remainingWork: string;
  @IsMongoId()
  @IsNotEmpty()
  department: string;
  @IsNotEmpty()
  @IsString()
  type: string;
}
