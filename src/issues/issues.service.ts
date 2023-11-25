import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Issue } from './Models/issuesSchema';
import mongoose, { Model } from 'mongoose';
import { CreateIssueDTO } from './Validations/issueDTO';
import { ErrorMessage, SuccessMessages } from 'src/Global/messages';
import { Response } from 'express';
import { PaginationDto, PaginationHelper } from 'src/Global/helpers';

@Injectable()
export class IssuesService {
  constructor(@InjectModel(Issue.name) private issues: Model<Issue>) {}
  async createIssue(
    @Res() response: Response,
    body: CreateIssueDTO,
    editor: mongoose.Schema.Types.ObjectId,
  ) {
    try {
      const data = await this.issues.create({
        ...body,
        editor: editor,
      });
      return response.status(HttpStatus.CREATED).json({
        success: true,
        message: SuccessMessages.saveSuccessful,
        issue: data,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getAllIssues(@Res() response: Response, pagination: PaginationDto) {
    try {
      const totalData = await this.issues.countDocuments();
      const {page,limit,...filtering} = pagination
      const data = await this.issues
        .find(filtering)
        .skip(PaginationHelper.paginateQuery(pagination))
        .limit(pagination.limit)
        .populate('editor', { password: 0 })
        .populate('department');
      return response
        .status(HttpStatus.OK)
        .json({ success: true, issues: data, totalData: totalData });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getOwnIssues(
    @Res() response: Response,
    id: mongoose.Schema.Types.ObjectId,
    paginate: PaginationDto,
  ) {
    try {
      const totalData =  await this.issues.countDocuments({editor:id})
      const data = await this.issues
        .find({ editor: id })
        .populate('editor', { password: 0 })
        .populate('department')
        .skip(PaginationHelper.paginateQuery(paginate))
        .limit(paginate.limit);
      return response
        .status(HttpStatus.OK)
        .json({ success: true, issues: data , totalData:totalData});
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getProgramIssue(
    @Res() response: Response,
    id: mongoose.Schema.Types.ObjectId,
  ) {
    try {
      const data = await this.issues
        .find({ processedProgram: id })
        .populate('editor', { password: 0 })
        .populate('department');
      return response
        .status(HttpStatus.OK)
        .json({ success: true, issues: data });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
}
