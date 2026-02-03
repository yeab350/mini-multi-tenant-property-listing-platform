import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { TenantsService } from '../tenants/tenants.service';
import { UsersService } from '../users/users.service';
import type { Role } from '../common/types/role';
import type { JwtPayload } from '../common/types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly tenants: TenantsService,
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private signToken(payload: JwtPayload) {
    return this.jwt.sign(payload);
  }

  async register(input: {
    tenantSlug: string;
    email: string;
    password: string;
    role?: Role;
  }) {
    const tenant = await this.tenants.findBySlug(input.tenantSlug);
    if (!tenant) throw new BadRequestException('Invalid tenant');

    const email = input.email.toLowerCase();
    const existing = await this.users.findByTenantAndEmail(tenant.id, email);
    if (existing) throw new BadRequestException('Email already registered');

    const allowRole =
      this.config.get<string>('ALLOW_ROLE_SELF_ASSIGN', 'true') === 'true';
    const role: Role = allowRole ? (input.role ?? 'user') : 'user';

    const rounds = Number(this.config.get<string>('BCRYPT_ROUNDS', '10'));
    const passwordHash = await bcrypt.hash(input.password, rounds);

    const user = await this.users.createUser({
      tenantId: tenant.id,
      email,
      passwordHash,
      role,
    });

    const accessToken = this.signToken({
      sub: user.id,
      tenantSlug: tenant.slug,
      role: user.role,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantSlug: tenant.slug,
      },
    };
  }

  async login(input: { tenantSlug: string; email: string; password: string }) {
    const tenant = await this.tenants.findBySlug(input.tenantSlug);
    if (!tenant) throw new UnauthorizedException('Invalid credentials');

    const email = input.email.toLowerCase();
    const user = await this.users.findByTenantAndEmail(tenant.id, email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.signToken({
      sub: user.id,
      tenantSlug: tenant.slug,
      role: user.role,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantSlug: tenant.slug,
      },
    };
  }
}
