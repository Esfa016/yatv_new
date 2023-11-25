import { Controller, Body, Post, Put, Delete, UseGuards, Res, Get, Query, Req, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthGuard } from './Jwt/authGuard';
import { RbacGuard } from './Guards/roleGuard';
import { UserRoles } from './Types/roles';
import { ChangePasswordDto, CreateUserDto, LoginUserDto, UpdateUserDto } from './Validations/userDTO';
import { MongooseIdDto, PaginationDto } from 'src/Global/helpers';

@Controller('auth')
export class AuthController {
  constructor(private userService: AuthService) {}
  @UseGuards(
    UserAuthGuard,
    new RbacGuard([UserRoles.ADMIN, UserRoles.PRODUCTION_MANAGER]),
  )
  @Post()
  createUser(@Res() response, @Body() body: CreateUserDto) {
    return this.userService.createUser(response, body);
  }
  @Post('/login')
  loginUser(@Res() response, @Body() body: LoginUserDto) {
    return this.userService.loginUser(response, body);
  }
  @Get()
  getAllUser(@Res() response, @Query() pagination: PaginationDto) {
    return this.userService.getAllUsers(response, pagination);
  }
  @UseGuards(UserAuthGuard)
  @Post('/changePin')
  changePassword(
    @Res() response,
    @Body() body: ChangePasswordDto,
    @Req() request,
  ) {
    return this.userService.changePassword(response, body, request.user.id);
  }

  @Get('/:id')
  getOneUser(@Res() response, @Param() id: MongooseIdDto) {
    return this.userService.findOne(response, id.id);
  }
  @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.ADMIN]))
  @Patch('/enable/:id')
  enableUser(@Res() response, @Param() id: MongooseIdDto) {
    return this.userService.enableUser(response, id.id);
  }

  @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.ADMIN]))
  @Patch('/disable/:id')
  disableUser(@Res() response, @Param() id: MongooseIdDto) {
    return this.userService.disableUser(response, id.id);
  }
  @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.ADMIN]))
  @Patch('/archive/:id')
  archiveUser(@Res() response, @Param() id: MongooseIdDto) {
    return this.userService.archiveUser(response, id.id);
  }
    @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]))
    @Get('users/filtered')
    filterdUser(@Res() response, @Query() query: PaginationDto) {
        return this.userService.getFilterd(response,query)
    }
  
  @UseGuards(UserAuthGuard)
  @Put('')
  updateUser(@Res() response, @Body() body: UpdateUserDto, @Req() request) {
    return this.userService.updateUser(response,request.user.id,body)
    
  }
  @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]))
  @Put('/asAdmin/:id')
  updateAsAdmin(@Res() response, @Body() body: UpdateUserDto, @Param() id: MongooseIdDto) {
    return this.userService.updateUser(response,id.id,body)
  }
}
