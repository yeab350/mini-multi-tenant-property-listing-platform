import type { Role } from './role';

export type JwtPayload = {
  sub: string;
  tenantSlug: string;
  role: Role;
  email: string;
};
