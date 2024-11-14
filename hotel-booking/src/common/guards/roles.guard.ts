import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private allowedRoles: string[]) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // проверка авторизации
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      throw new ForbiddenException('Access denied');
    }

    // проверка роли
    const user = req.user;
    if (this.allowedRoles.includes(user.role)) {
      return true; // прошел
    }

    throw new ForbiddenException('Access denied');
  }
}
