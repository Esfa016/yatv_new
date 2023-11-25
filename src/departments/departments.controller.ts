import {
  Controller,
  Body,
  Post,
  Get,
  Delete,
    Put,
  Res,Req,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepatmentDTO, UpdateDepatmentDTO } from './Validations/departmentDTO';
import { MongooseIdDto, PaginationDto } from 'src/Global/helpers';
import { UserAuthGuard } from 'src/auth/Jwt/authGuard';
import { RbacGuard } from 'src/auth/Guards/roleGuard';
import { UserRoles } from 'src/auth/Types/roles';

@Controller('departments')
export class DepartmentsController {
  constructor(private departmentService: DepartmentsService) {}
  @UseGuards(
    UserAuthGuard,
    new RbacGuard([
      UserRoles.ADMIN,
      UserRoles.SUPER_ADMIN,
      UserRoles.PRODUCTION_MANAGER,
    ]),
  )
  @Post()
  create(@Res() response, @Body() body: CreateDepatmentDTO) {
    return this.departmentService.createDepartment(response, body);
  }
  @Get()
  getAll(@Res() response, @Query() pagination: PaginationDto) {
    return this.departmentService.getAllDepartments(response, pagination);
  }
  @UseGuards(
    UserAuthGuard,
    new RbacGuard([
      UserRoles.ADMIN,
      UserRoles.SUPER_ADMIN,
      UserRoles.PRODUCTION_MANAGER,
    ]),
  )
  @Put('/:id')
  updateOne(
    @Res() response,
    @Param() id: MongooseIdDto,
    @Body() body: UpdateDepatmentDTO,
  ) {
    return this.departmentService.updateDepartment(response, id.id, body);
  }
  @UseGuards(
    UserAuthGuard,
    new RbacGuard([
      UserRoles.ADMIN,
      UserRoles.SUPER_ADMIN,
      UserRoles.PRODUCTION_MANAGER,
    ]),
  )
  @Delete('/:id')
  deleteOne(@Res() response, @Param() id: MongooseIdDto) {
    return this.departmentService.deleteDepartment(response, id.id);
  }
}
