import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Programs, requestStatus } from './Models/programSchema';
import mongoose, { Model } from 'mongoose';
import { Response } from 'express';
import { AssignEditorDTO, RequestCreateDTO } from './Validations/programDto';
import { ErrorMessage, SuccessMessages } from 'src/Global/messages';
import { UserAccount } from 'src/auth/Types/accountStatus';
import { PaginationDto, PaginationHelper } from 'src/Global/helpers';

@Injectable()
export class ProgramsService {
  constructor(@InjectModel(Programs.name) private programs: Model<Programs>) {}
  async requestProgram(
    @Res() response: Response,
    body: RequestCreateDTO,
    user: UserAccount,
  ) {
    try {
      const data = await this.programs.create({
        ...body,
        department: user.department,
      });
      return response.status(HttpStatus.CREATED).json({
        success: true,
        message: SuccessMessages.saveSuccessful,
        request: data,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getRequests(@Res() response: Response, pagination: PaginationDto) {
    try {
      const { page, limit, ...filtering } = pagination;
       const totalData = await this.programs.countDocuments(filtering)
      const data = await this.programs
        .find(filtering)
        .skip(PaginationHelper.paginateQuery(pagination))
        .limit(pagination.limit)
        .populate('department')
        .populate('approvedBy', { password: 0 })
        .populate('producerDetails', { password: 0 })
        .populate('equipments')
        .populate('assignedCameraMen', { password: 0 })
        .populate('producerDetails', { password: 0 })
        .populate('assignedEditor', { password: 0 });
      return response
        .status(HttpStatus.OK)
        .json({ success: true, requests: data , totalData:totalData});
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async apporveRequest(
    @Res() response: Response,
    id: mongoose.Schema.Types.ObjectId,
  ) {
    try {
      const data = await this.programs.findOneAndUpdate(
        { _id: id },
        { status: requestStatus.APPROVED },
      );
      if (!data) throw new NotFoundException(ErrorMessage.requestNotFound);
      return response.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessages.updateSuccessful,
        request: data,
      });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async rejectRequest(
    @Res() response: Response,
    id: mongoose.Schema.Types.ObjectId,
  ) {
    try {
      const data = await this.programs.findOneAndUpdate(
        { _id: id },
        { status: requestStatus.REJECTED },
      );
      if (!data) throw new NotFoundException(ErrorMessage.requestNotFound);
      return response.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessages.updateSuccessful,
        request: data,
      });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async assignEditorAndProducer(
    @Res() response: Response,
    body: AssignEditorDTO,
  ) {
    try {
      const programFound = await this.programs.findByIdAndUpdate(
        body.programId,
        {
          $set: {
            producerDetails: body.producerId,
            assignedEditor: body.editorId,
          },
        },
      );
      if (!programFound)
        throw new NotFoundException(ErrorMessage.productNotFound);
      return response.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessages.updateSuccessful,
        program: programFound,
      });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getAssignedPrograms(
    @Res() response: Response,
    id: mongoose.Schema.Types.ObjectId,
    paginate: PaginationDto,
  ) {
    try {
      const programs = await this.programs
        .find({ assignedEditor: id })
        .skip(PaginationHelper.paginateQuery(paginate))
        .limit(paginate.limit)
        .populate('department')
        .populate('approvedBy', { password: 0 })
        .populate('producerDetails', { password: 0 })
        .populate('equipments')
        .populate('assignedCameraMen', { password: 0 })
        .populate('producerDetails', { password: 0 })
        .populate('assignedEditor', { password: 0 });
      return response
        .status(HttpStatus.OK)
        .json({ success: true, programs: programs });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getOneById(@Res() response: Response, id: mongoose.Schema.Types.ObjectId) {
    try { 
      const program = await this.programs
        .findById(id)
        .populate('department')
        .populate('approvedBy', { password: 0 })
        .populate('producerDetails', { password: 0 })
        .populate('equipments')
        .populate('assignedCameraMen', { password: 0 })
        .populate('producerDetails', { password: 0 })
        .populate('assignedEditor', { password: 0 });
      if(!program) throw new NotFoundException(ErrorMessage.productNotFound)
      return response.status(HttpStatus.OK).json({success:true, program:program})
    }
    catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error
      console.error(error)
      throw new InternalServerErrorException(ErrorMessage.internalServerError)
    }
  }
}
