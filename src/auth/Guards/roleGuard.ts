import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private requiredRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userRoles = request.user.role;

    return this.requiredRoles.some((role) => userRoles.includes(role));
  }
}
