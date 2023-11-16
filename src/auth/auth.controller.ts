import { Controller, Body, Post, Put, Delete, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthGuard } from './Jwt/authGuard';
import { RbacGuard } from './Guards/roleGuard';
import { UserRoles } from './Types/roles';
import { CreateUserDto, LoginUserDto } from './Validations/userDTO';

@Controller('auth')
export class AuthController {
    constructor(private userService: AuthService) { }
    @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.ADMIN, UserRoles.PRODUCTION_MANAGER]))
    @Post()
    async createUser(@Res() response, @Body() body: CreateUserDto) {
        return this.userService.createUser(response,body)
    }
    @Post('/login')
    async loginUser(@Res() response, @Body() body: LoginUserDto) {
        return this.userService.loginUser(response,body)
    }
}
