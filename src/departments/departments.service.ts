import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Departments } from './Models/departmentSchema';
import mongoose, { Model } from 'mongoose';
import { Response, Request } from 'express';
import { CreateDepatmentDTO, UpdateDepatmentDTO } from './Validations/departmentDTO';
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
  async getAllDepartments(
    @Res() response: Response,
    pagination: PaginationDto,
  ) {
    try {
      const data = await this.departments
        .find()
        .skip(PaginationHelper.paginateQuery(pagination))
        .limit(pagination.limit);
      return response
        .status(HttpStatus.OK)
        .json({ success: true, departments: data });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async updateDepartment(
    response: Response,
    id: mongoose.Schema.Types.ObjectId,
    body: UpdateDepatmentDTO,
  ) {
    try {
      const depFound = await this.departments.findByIdAndUpdate(id, body);
      if (!depFound)
        throw new NotFoundException(ErrorMessage.departmentNotFound);
      return response
        .status(HttpStatus.OK)
        .json({
          success: true,
          message: SuccessMessages.updateSuccessful,
          department: body,
        });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
  async deleteDepartment(
    response: Response,
    id: mongoose.Schema.Types.ObjectId,
  ) {
    try {
      const depFound = await this.departments.findByIdAndDelete(id);
      if (!depFound)
        throw new NotFoundException(ErrorMessage.departmentNotFound);
      return response
        .status(HttpStatus.OK)
        .json({
          success: true,
          message: SuccessMessages.deleteSuccessful,
          department:depFound
        });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getOne(response: Response, id: mongoose.Schema.Types.ObjectId) {
    try { 
      const depFound = await this.departments.findById(id)
      if (!depFound) throw new NotFoundException(ErrorMessage.departmentNotFound)
       return response.status(HttpStatus.OK).json({success:true,department:depFound})
    }
    catch (error) {
      if(!(error instanceof InternalServerErrorException)) throw error
    }
  }
}
