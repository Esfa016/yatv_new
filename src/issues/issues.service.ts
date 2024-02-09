import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Issue } from './Models/issuesSchema';
import mongoose, { Model } from 'mongoose';
import { CreateIssueDTO } from './Validations/issueDTO';
import { ErrorMessage, SuccessMessages } from 'src/Global/messages';
import { Response } from 'express';
import { PaginationDto, PaginationHelper } from 'src/Global/helpers';
import { ProgramsService } from 'src/programs/programs.service';

@Injectable()
export class IssuesService {
  private readonly logger = new Logger(IssuesService.name)
  constructor(
    @InjectModel(Issue.name) private issues: Model<Issue>,
    private programService: ProgramsService,
  ) {}
  async createIssue(
    response:Response,
    body: CreateIssueDTO,
    editor: mongoose.Schema.Types.ObjectId,
  ) {
    try {
      const programData = await this.programService.findOne(
        body.processedProgram,
      );
      const data = await this.issues.create({
        ...body,
        department: programData.department,
        editor: editor,
      });
      return response.status(HttpStatus.CREATED).json({
        success: true,
        message: SuccessMessages.saveSuccessful,
        issue: data,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getAllIssues(response:Response, pagination: PaginationDto) {
    try {
      const totalData = await this.issues.countDocuments();
      const { page, limit, ...filtering } = pagination;
      const data = await this.issues
        .find(filtering)
        .sort({ createdAt: -1 })
        .skip(PaginationHelper.paginateQuery(pagination))
        .limit(pagination.limit)
        .populate('editor', { userPin: 0 })
        .populate('department')
        .populate({
          path: 'processedProgram',
          populate: [
            { path: 'assignedCameraMen', select: '-userPin' },
            { path: 'equipments' },
            { path: 'assignedEditor', select: '-userPin' },
            { path: 'producerDetails', select: '-userPin' },
          ],
        });
      return response
        .status(HttpStatus.OK)
        .json({ success: true, issues: data, totalData: totalData });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getOwnIssues(
    response:Response,
    id: mongoose.Schema.Types.ObjectId,
    paginate: PaginationDto,
  ) {
    try {
      const totalData = await this.issues.countDocuments({ editor: id });
      const data = await this.issues
        .find({ editor: id })
        .sort({ createdAt: -1 })
        .populate('editor', { password: 0 })
        .populate('department')
        .populate({
          path: 'processedProgram',
          populate: [
            { path: 'assignedCameraMen', select: '-userPin' },
            { path: 'equipments' },
            { path: 'assignedEditor', select: '-userPin' },
            { path: 'producerDetails', select: '-userPin' },
          ],
        })
        .skip(PaginationHelper.paginateQuery(paginate))
        .limit(paginate.limit);
      return response
        .status(HttpStatus.OK)
        .json({ success: true, issues: data, totalData: totalData });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getProgramIssue(
    response:Response,
    id: mongoose.Schema.Types.ObjectId,
  ) {
    try {
      const data = await this.issues
        .find({ processedProgram: id })
        .sort({ createdAt: -1 })
        .populate('editor', { password: 0 })
        .populate('department')
        .populate({
          path: 'processedProgram',
          populate: [
            { path: 'assignedCameraMen', select: '-userPin' },
            { path: 'equipments' },
            { path: 'assignedEditor', select: '-userPin' },
            { path: 'producerDetails', select: '-userPin' },
          ],
        });
      return response
        .status(HttpStatus.OK)
        .json({ success: true, issues: data });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getById(response: Response, id: mongoose.Schema.Types.ObjectId) {
    try {
      const data = await this.issues
        .findById(id)
        .populate('editor', { password: 0 })
        .populate('department')
        .populate({
          path: 'processedProgram',
          populate: [
            { path: 'assignedCameraMen', select: '-userPin' },
            { path: 'equipments' },
            { path: 'assignedEditor', select: '-userPin' },
            { path: 'producerDetails', select: '-userPin' },
          ],
        });
      if (!data) throw new NotFoundException(ErrorMessage.programNotFound);
      return response
        .status(HttpStatus.OK)
        .json({ success: true, issue: data });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
}
