import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Departments } from './Models/departmentSchema';
import { Model } from 'mongoose';
import { Response, Request } from 'express';
import { CreateDepatmentDTO } from './Validations/departmentDTO';
import { ErrorMessage, SuccessMessages } from 'src/Global/messages';
import { PaginationDto, PaginationHelper } from 'src/Global/helpers';
@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Departments.name) private departments: Model<Departments>,
  ) {}

  async createDepartment(@Res() response: Response, body: CreateDepatmentDTO) {
    try {
      const data = await this.departments.create(body);
      return response.status(HttpStatus.CREATED).json({
        success: true,
        message: SuccessMessages.saveSuccessful,
        department: data,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
    async getAllDepartments(@Res() response: Response, pagination: PaginationDto) {
        try { 
            const data = await this.departments.find().skip(PaginationHelper.paginateQuery(pagination)).limit(pagination.limit);
            return response.status(HttpStatus.OK).json({success:true,departments:data})
        }
        catch (error) {
            console.error(error)
            throw new InternalServerErrorException(ErrorMessage.internalServerError)
        }
    }
}
