import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const id = Number(request.params.id);

    if (!user) throw new ForbiddenException();

    if (user.id !== id) {
      throw new ForbiddenException('You can modify only your own data');
    }

    return true;
  }
}
