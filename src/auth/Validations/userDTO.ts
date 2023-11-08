import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    fullName: string
    @IsString()
    @IsNotEmpty()
    username: string
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    userPin:string
    

}