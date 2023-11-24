import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { AllowedUserRoles, UserRoles } from '../Types/roles';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;
  @IsEnum(AllowedUserRoles)
  @IsNotEmpty()
  role: string;

}
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName: string;
  @IsString()
  @IsOptional()
  lastName: string;
  @IsString()
  @IsOptional()
  phoneNumber: string;
  @IsEnum(AllowedUserRoles)
  @IsOptional()
  role: string;
  @IsOptional()
  @IsString()
  userPin: string;
  @IsOptional()
  @IsString()
  username: string;
}


export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  userPin: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  userPin: string;
}
