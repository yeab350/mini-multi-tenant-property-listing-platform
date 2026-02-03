import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { AuthUser } from '../types/auth-user';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      user?: AuthUser;
      params?: { tenantSlug?: string };
    }>();

    const user = req.user;
    if (!user) return true;

    const tenantSlug = req.params?.tenantSlug ?? '';
    if (!tenantSlug) return true;

    if (user.tenantSlug !== tenantSlug) {
      throw new ForbiddenException('Tenant mismatch');
    }

    return true;
  }
}
