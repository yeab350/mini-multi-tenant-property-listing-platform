import type { Role } from './role';

export type AuthUser = {
  id: string;
  tenantSlug: string;
  role: Role;
  email: string;
};
