import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './Models/userSchema';
import mongoose, { Model } from 'mongoose';
import { Response, Request } from 'express';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
} from './Validations/userDTO';
import { ErrorMessage, SuccessMessages } from 'src/Global/messages';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PaginationDto, PaginationHelper } from 'src/Global/helpers';
import { NotFoundError } from 'rxjs';
import { AccountStatus } from './Types/accountStatus';
import { UserRoles } from './Types/roles';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private users: Model<Users>,
    private jwt: JwtService,
  ) {}
  async getOne(id: mongoose.Schema.Types.ObjectId): Promise<Users> {
    try {
      const userFound = await this.users.findById(id);
      return userFound;
    } catch (error) {}
  }

  async createUser(@Res() response: Response, body: CreateUserDto) {
    try {
      const userFound = await this.users.findOne({
        phoneNumber: body.phoneNumber,
      });
      if (userFound) {
        console.log(userFound);
        throw new ConflictException(ErrorMessage.userExists);
      }

      const userData = await this.users.create(body);
      return response.status(HttpStatus.CREATED).json({
        success: true,
        message: SuccessMessages.saveSuccessful,
        username: userData.username,
      });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async loginUser(@Res() response: Response, body: LoginUserDto) {
    try {
      const userFound = await this.users.findOne({ username: body.username });
      if (!userFound)
        throw new UnauthorizedException(ErrorMessage.incorrectCredentials);
      if (userFound.status !== AccountStatus.ACTIVE)
        throw new ForbiddenException(ErrorMessage.accountDisabled);
      const passMatch = await bcrypt.compare(body.userPin, userFound.userPin);
      if (!passMatch)
        throw new UnauthorizedException(ErrorMessage.incorrectCredentials);
      const accessToken = this.jwt.sign(
        {
          id: userFound.id,
          role: userFound.role,
          department: userFound.department,
        },
        { secret: process.env.JWT_USER, expiresIn: '1d' },
      );
      return response.status(HttpStatus.OK).json({
        success: true,
        accessToken: accessToken,
        role: userFound.role,
      });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getAllUsers(@Res() response: Response, paginationDto: PaginationDto) {
    try {
      const totalData = await this.users.countDocuments();
      const users = await this.users
        .find({ role: { $ne: UserRoles.SUPER_ADMIN } },{'userPin':0})
        .skip(PaginationHelper.paginateQuery(paginationDto))
        .limit(paginationDto.limit)
        .populate('department');
      return response
        .status(HttpStatus.OK)
        .json({ success: true, users: users, totalData: totalData });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async changePassword(
    @Res() response: Response,
    body: ChangePasswordDto,
    id: mongoose.Schema.Types.ObjectId,
  ) {
    try {
      const newPassword = await bcrypt.hash(body.userPin, 8);
      await this.users.findByIdAndUpdate(id, {
        $set: { userPin: newPassword },
      });
      return response.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessages.updateSuccessful,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async findOne(@Res() response: Response, id: mongoose.Schema.Types.ObjectId) {
    try {
      const data = await this.users.findById(id, { userPin: 0 }).populate('department');
      if (!data) throw new NotFoundException(ErrorMessage.userNotFound);
      return response.status(HttpStatus.OK).json({ success: true, user: data });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
  async disableUser(
    @Res() response: Response,
    id: mongoose.Schema.Types.ObjectId,
  ) {
    try {
      const userFound = await this.users.findById(id);
      if (!userFound) throw new NotFoundException(ErrorMessage.userNotFound);
      if (userFound.role === UserRoles.SUPER_ADMIN)
        throw new ForbiddenException(ErrorMessage.forbidden);
      userFound.status = AccountStatus.INACTIVE;
      await userFound.save();
      return response
        .status(HttpStatus.OK)
        .json({ success: true, message: SuccessMessages.updateSuccessful });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
  async enableUser(
    @Res() response: Response,
    id: mongoose.Schema.Types.ObjectId,
  ) {
    try {
      const userFound = await this.users.findByIdAndUpdate(id, {
        $set: { status: AccountStatus.ACTIVE },
      });
      if (!userFound) throw new NotFoundException(ErrorMessage.userNotFound);
      return response
        .status(HttpStatus.OK)
        .json({ success: true, message: SuccessMessages.updateSuccessful });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
  async archiveUser(
    @Res() response: Response,
    id: mongoose.Schema.Types.ObjectId,
  ) {
    try {
      const userFound = await this.users.findById(id);
      if (!userFound) throw new NotFoundException(ErrorMessage.userNotFound);
      if (userFound.role === UserRoles.SUPER_ADMIN)
        throw new ForbiddenException(ErrorMessage.forbidden);
      userFound.status = AccountStatus.ARCHIVED;
      await userFound.save();
      return response
        .status(HttpStatus.OK)
        .json({ success: true, message: SuccessMessages.updateSuccessful });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
  async getFilterd(@Res() response: Response, query: PaginationDto) {
    try {
      const { page, limit, ...filtering } = query;
      const totalData = await this.users.countDocuments(filtering);
      const data = await this.users
        .find(filtering, { userPin: 0 })
        .skip(PaginationHelper.paginateQuery(query))
        .limit(query.limit)
        .populate('department');;
      return response
        .status(HttpStatus.OK)
        .json({ success: true, users: data, totalData: totalData });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async userReports() {
    try {
      const active = await this.users.countDocuments({
        status: AccountStatus.ACTIVE,
      });
      const archived = await this.users.countDocuments({
        status: AccountStatus.ARCHIVED,
      });
      const inactive = await this.users.countDocuments({
        status: AccountStatus.INACTIVE,
      });
      const totalUsers = await this.users.countDocuments();
      return {
        active: active,
        archived: archived,
        inactive: inactive,
        totalUsers: totalUsers,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
  async updateUser(
    @Res() response: Response,
    id: mongoose.Schema.Types.ObjectId,
    userData: UpdateUserDto,
  ) {
    try {
      if (userData.userPin) delete userData.userPin;
      if (userData.username) delete userData.username;
      await this.users.findByIdAndUpdate(id, userData);
      return response
        .status(HttpStatus.OK)
        .json({
          success: true,
          message: SuccessMessages.updateSuccessful,
          user: userData,
        });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
}
