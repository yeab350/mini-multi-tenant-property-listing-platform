import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Role } from '../common/types/role';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  findById(id: string) {
    return this.users.findOne({ where: { id } });
  }

  findByTenantAndEmail(tenantId: string, email: string) {
    return this.users.findOne({
      where: { tenantId, email: email.toLowerCase() },
    });
  }

  async ensureUser(input: {
    tenantId: string;
    email: string;
    passwordHash: string;
    role: Role;
  }) {
    const existing = await this.findByTenantAndEmail(
      input.tenantId,
      input.email,
    );
    if (existing) return existing;

    return this.users.save(
      this.users.create({
        tenantId: input.tenantId,
        email: input.email.toLowerCase(),
        passwordHash: input.passwordHash,
        role: input.role,
      }),
    );
  }

  async createUser(input: {
    tenantId: string;
    email: string;
    passwordHash: string;
    role: Role;
  }) {
    return this.users.save(
      this.users.create({
        tenantId: input.tenantId,
        email: input.email.toLowerCase(),
        passwordHash: input.passwordHash,
        role: input.role,
      }),
    );
  }
}
