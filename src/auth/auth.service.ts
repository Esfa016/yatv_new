import {
  ConflictException,
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
} from './Validations/userDTO';
import { ErrorMessage, SuccessMessages } from 'src/Global/messages';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PaginationDto, PaginationHelper } from 'src/Global/helpers';
import { NotFoundError } from 'rxjs';
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
        .find()
        .skip(PaginationHelper.paginateQuery(paginationDto))
        .limit(paginationDto.limit)
        .populate('userPin', 0);
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
      const data = await this.users.findById(id, { 'userPin': 0 })
      if(!data) throw new NotFoundException(ErrorMessage.userNotFound)
      return response.status(HttpStatus.OK).json({success:true,user:data})
    }
    catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError)
      
    }
  }
}
