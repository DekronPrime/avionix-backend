import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from 'src/common/enums/userRole';

@Injectable()
export class AdminOrOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramId = Number(request.params.id);

    if (user.role === UserRole.ADMIN) return true;

    return user.id === paramId;
  }
}
