import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose, { isValidObjectId } from 'mongoose';
import { Users } from 'src/auth/Models/userSchema';

enum jobType {
  NEWS = 'news',
  STUDIO = 'studio',
  FIELD = 'field',
  PROGRAM = 'program',
  DOCUMENTARY = 'doucmentary',
  ASSOCIATIVE = 'associative',
  ADVERTIZEMENT = 'advertizment',
  SPORT = 'sport',
  PROMO = 'promo',
  TRANSITION = 'transition',
  OTHER = 'other',
}
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { Types } from 'mongoose';

 function IsArrayOfObjectIds(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isArrayOfObjectIds',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false;
          }

          const isValid = value.every((item) => Types.ObjectId.isValid(item));
          return isValid;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid array of ObjectIds`;
        },
      },
    });
  };
}


export class RequestCreateDTO {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  recordingDate: Date;
  @IsString()
  @IsNotEmpty()
  startTime: string;
  @IsString()
  @IsNotEmpty()
  endTime: string;
  @IsArray()
  @IsNotEmpty()
  @IsArrayOfObjectIds()
  assignedCameraMen: mongoose.Schema.Types.ObjectId[];
  @IsEnum(jobType)
  @IsNotEmpty()
  type: jobType;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsArray()
  @IsNotEmpty()
  @IsArrayOfObjectIds()
  equipments: mongoose.Schema.Types.ObjectId[];
  @IsMongoId()
  @IsOptional()
  producerDetails: mongoose.Schema.Types.ObjectId;
  @IsString()
  @IsOptional()
  challengesFaced: string;
}
