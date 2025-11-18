import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtGlobalGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtGuard: JwtAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return this.jwtGuard.canActivate(context) as boolean;
  }
}
