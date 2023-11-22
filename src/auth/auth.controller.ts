import { Controller, Body, Post, Put, Delete, UseGuards, Res, Get, Query, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthGuard } from './Jwt/authGuard';
import { RbacGuard } from './Guards/roleGuard';
import { UserRoles } from './Types/roles';
import { ChangePasswordDto, CreateUserDto, LoginUserDto } from './Validations/userDTO';
import { MongooseIdDto, PaginationDto } from 'src/Global/helpers';

@Controller('auth')
export class AuthController {
    constructor(private userService: AuthService) { }
    @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.ADMIN, UserRoles.PRODUCTION_MANAGER]))
    @Post()
     createUser(@Res() response, @Body() body: CreateUserDto) {
        return this.userService.createUser(response,body)
    }
    @Post('/login')
     loginUser(@Res() response, @Body() body: LoginUserDto) {
        return this.userService.loginUser(response,body)
    }
    @Get()
    getAllUser( @Res() response, @Query() pagination:PaginationDto){
    return this.userService.getAllUsers(response,pagination)
    }
    @UseGuards(UserAuthGuard)
    @Post('/changePin')
    changePassword(@Res() response, @Body() body: ChangePasswordDto, @Req() request) {
        return this.userService.changePassword(response,body,request.user.id)
    }

    @Get('/:id')
    getOneUser(@Res() response, @Param() id: MongooseIdDto) {
        return this.userService.findOne(response,id.id)
        
    }
}
