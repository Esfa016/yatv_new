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
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepatmentDTO } from './Validations/departmentDTO';
import { PaginationDto } from 'src/Global/helpers';

@Controller('departments')
export class DepartmentsController {
    constructor(private departmentService: DepartmentsService) { }
    @Post()
  create(@Res() response, @Body() body: CreateDepatmentDTO) {
    return this.departmentService.createDepartment(response,body);
    }
    @Get()
    getAll(@Res() response, @Query() pagination: PaginationDto) {
        return this.departmentService.getAllDepartments(response,pagination)
    }
}
