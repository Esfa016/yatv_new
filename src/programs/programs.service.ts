import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
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
import { PaginationDto, PaginationHelper, SearchDTO } from 'src/Global/helpers';

@Injectable()
export class ProgramsService {
  private readonly logger = new Logger(ProgramsService.name)
  constructor(@InjectModel(Programs.name) private programs: Model<Programs>) {}
  async requestProgram(
    response: Response,
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
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
  async getOwnRequest(
    response: Response,
    pagination: PaginationDto,
    userAccount: UserAccount,
  ) {
    try {
      const totalData = await this.programs.countDocuments({
        department: userAccount.department,
      });
      const data = await this.programs
        .find({ department: userAccount.department })
        .sort({ createdAt: -1 })
        .skip(PaginationHelper.paginateQuery(pagination))
        .limit(pagination.limit)
        .populate('department')
        .populate('approvedBy', { userPin: 0 })
        .populate('producerDetails', { userPin: 0 })
        .populate('equipments')
        .populate('assignedCameraMen', { userPin: 0 })
        .populate('producerDetails', { userPin: 0 })
        .populate('assignedEditor', { userPin: 0 });
      return response
        .status(HttpStatus.OK)
        .json({ success: true, request: data, totalData: totalData });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getRequests(response: Response, pagination: PaginationDto) {
    try {
      const { page, limit, ...filtering } = pagination;
      const totalData = await this.programs.countDocuments(filtering);
      const data = await this.programs
        .find(filtering)
        .sort({ createdAt: -1 })
        .skip(PaginationHelper.paginateQuery(pagination))
        .limit(pagination.limit)
        .populate('department')
        .populate('approvedBy', { userPin: 0 })
        .populate('producerDetails', { userPin: 0 })
        .populate('equipments')
        .populate('assignedCameraMen', { userPin: 0 })
        .populate('producerDetails', { userPin: 0 })
        .populate('assignedEditor', { userPin: 0 });
      return response
        .status(HttpStatus.OK)
        .json({ success: true, requests: data, totalData: totalData });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async apporveRequest(
    response: Response,
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
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async rejectRequest(
    response: Response,
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
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async assignEditorAndProducer(
    response: Response,
    body: AssignEditorDTO,
  ) {
    try {
      const programFound = await this.programs.findByIdAndUpdate(
        body.programId,
        {
          $set: {
            producerDetails: body.producerId,
            assignedEditor: body.editorId,
            status: requestStatus.ASSIGNED,
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
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getAssignedPrograms(
    response: Response,
    id: mongoose.Schema.Types.ObjectId,
    paginate: PaginationDto,
  ) {
    try {
      const { page, limit, ...filtering } = paginate;
      const totalData = await this.programs.countDocuments({
        $and: [{ assignedEditor: id }, filtering],
      });
      const programs = await this.programs
        .find({ $and: [{ assignedEditor: id }, filtering] })
        .sort({ createdAt: -1 })
        .skip(PaginationHelper.paginateQuery(paginate))
        .limit(paginate.limit)
        .populate('department')
        .populate('approvedBy', { userPin: 0 })
        .populate('producerDetails', { userPin: 0 })
        .populate('equipments')
        .populate('assignedCameraMen', { userPin: 0 })
        .populate('producerDetails', { userPin: 0 })
        .populate('assignedEditor', { userPin: 0 });
      return response
        .status(HttpStatus.OK)
        .json({ success: true, programs: programs, totalData: totalData });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getOneById(
    response: Response,
    id: mongoose.Schema.Types.ObjectId,
  ) {
    try {
      const program = await this.programs
        .findById(id)
        .populate('department')
        .populate('approvedBy', { userPin: 0 })
        .populate('producerDetails', { userPin: 0 })
        .populate('equipments')
        .populate('assignedCameraMen', { userPin: 0 })
        .populate('producerDetails', { userPin: 0 })
        .populate('assignedEditor', { userPin: 0 });
      if (!program) throw new NotFoundException(ErrorMessage.productNotFound);
      return response
        .status(HttpStatus.OK)
        .json({ success: true, program: program });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
  async completeProgram(
    response: Response,
    id: mongoose.Schema.Types.ObjectId,
  ) {
    try {
      const programFound = await this.programs.findByIdAndUpdate(id, {
        $set: { completed: true, status: requestStatus.COMPLETED },
      });
      if (!programFound)
        throw new NotFoundException(ErrorMessage.productNotFound);
      return response.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessages.updateSuccessful,
        program: programFound,
      });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getProgramReports() {
    try {
      const pending = await this.programs.countDocuments({
        status: requestStatus.PENDING,
      });
      const completed = await this.programs.countDocuments({
        status: requestStatus.COMPLETED,
      });
      const rejected = await this.programs.countDocuments({
        status: requestStatus.REJECTED,
      });
      const approved = await this.programs.countDocuments({
        status: requestStatus.APPROVED,
      });
      const assigned = await this.programs.countDocuments({
        status: requestStatus.ASSIGNED,
      });
      const totalData = await this.programs.countDocuments({});

      const pendingPercentage =
        totalData !== 0 ? (pending / totalData) * 100 : 0;
      const completedPercentage =
        totalData !== 0 ? (completed / totalData) * 100 : 0;
      const rejectedPercentage =
        totalData !== 0 ? (rejected / totalData) * 100 : 0;
      const approvedPercentage =
        totalData !== 0 ? (approved / totalData) * 100 : 0;
      const assignedPercentage =
        totalData !== 0 ? (assigned / totalData) * 100 : 0;

      return {
        pending: pending,
        completed: completed,
        rejected: rejected,
        approved: approved,
        assigned: assigned,
        pendingPercentage: totalData !== 0 ? pendingPercentage : 0,
        completedPercentage: totalData !== 0 ? completedPercentage : 0,
        rejectedPercentage: totalData !== 0 ? rejectedPercentage : 0,
        approvedPercentage: totalData !== 0 ? approvedPercentage : 0,
        assignedPercentage: totalData !== 0 ? assignedPercentage : 0,
        totalPrograms: totalData || 0,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
  async findOne(id: mongoose.Schema.Types.ObjectId): Promise<Programs> {
    try {
      return await this.programs.findById(id);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async search(response: Response, search: string, paginate: SearchDTO) {
    try {
      const regex = new RegExp(search, 'i');
      const totalData = await this.programs.countDocuments({
        $and: [
          { title: { $regex: regex } },
          {
            status: { $ne: requestStatus.PENDING }
          },
        ],
      });
      const data = await this.programs
        .find({
          $and: [
            { title: { $regex: regex } },
            {  status: { $ne: requestStatus.PENDING } },
          ],
        })
        .skip(PaginationHelper.paginateQuery(paginate))
        .limit(paginate.limit)
        .populate('department')
        .populate('approvedBy', { userPin: 0 })
        .populate('producerDetails', { userPin: 0 })
        .populate('equipments')
        .populate('assignedCameraMen', { userPin: 0 })
        .populate('producerDetails', { userPin: 0 })
        .populate('assignedEditor', { userPin: 0 });
      return response
        .status(HttpStatus.OK)
        .json({ success: true, programs: data, totalData: totalData });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
  async getNonPending(response: Response, pagination: PaginationDto) {
    try {
      const totalData = await this.programs.countDocuments({
        status: { $ne: requestStatus.PENDING },
      });
      const data = await this.programs
        .find({ status: { $ne: requestStatus.PENDING } }).populate('department')
        .populate('approvedBy', { userPin: 0 })
        .populate('producerDetails', { userPin: 0 })
        .populate('equipments')
        .populate('assignedCameraMen', { userPin: 0 })
        .populate('producerDetails', { userPin: 0 })
        .populate('assignedEditor', { userPin: 0 })
        .skip(PaginationHelper.paginateQuery(pagination))
        .limit(pagination.limit);
      return response.status(HttpStatus.OK).json({success:true, requests:data, totalData:totalData})
    } catch (error) {
      this.logger.error(error) 
      throw new InternalServerErrorException(ErrorMessage.internalServerError)
    }
  }
}
