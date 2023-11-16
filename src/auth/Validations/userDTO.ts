import { IsEnum, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";
import { AllowedUserRoles, UserRoles } from "../Types/roles";

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

export class LoginUserDto{
    @IsString()
    @IsNotEmpty()
    username: string
    @IsString()
    @IsNotEmpty()
    userPin:string
}