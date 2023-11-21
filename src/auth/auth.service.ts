import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './Models/userSchema';
import mongoose, { Model } from 'mongoose';
import { Response, Request } from 'express';
import { CreateUserDto, LoginUserDto } from './Validations/userDTO';
import { ErrorMessage, SuccessMessages } from 'src/Global/messages';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
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
      return response
        .status(HttpStatus.OK)
        .json({ success: true, accessToken: accessToken, role:userFound.role });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
}
