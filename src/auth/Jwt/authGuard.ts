import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ForbiddenException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ErrorMessage } from 'src/Global/messages';
import { AccountStatus, UserAccount } from '../Types/accountStatus';
import { AuthService } from '../auth.service';
import { UserRoles } from '../Types/roles';
class Exporter {
  static extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private authService:AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = Exporter.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException(ErrorMessage.unauthorized);
    try {
      const payload:UserAccount = await this.jwtService.verify(token, {
        secret: process.env.JWT_USER,
      });
     if (payload.role !== UserRoles.SUPER_ADMIN) {
        const userFound = await this.authService.getOne(payload.id)
        if(userFound.status !== AccountStatus.ACTIVE) throw new ForbiddenException(ErrorMessage.accountDisabled)
      } 
      request.user = payload;
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new ForbiddenException(ErrorMessage.tokenExpired);
      }
      console.error(error);
      return false;
    }
    return true;
  }
}
