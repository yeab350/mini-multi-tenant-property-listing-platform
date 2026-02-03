import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TenantEntity } from '../tenants/tenant.entity';
import type { Role } from '../common/types/role';
import { FavoriteEntity } from '../favorites/favorite.entity';
import { PropertyEntity } from '../properties/property.entity';

@Entity('users')
@Index(['tenantId', 'email'], { unique: true })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @ManyToOne(() => TenantEntity, (t) => t.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant!: TenantEntity;

  @Column({ type: 'text' })
  email!: string;

  @Column({ type: 'text' })
  passwordHash!: string;

  @Column({ type: 'text' })
  role!: Role;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @OneToMany(() => FavoriteEntity, (f) => f.user)
  favorites!: FavoriteEntity[];

  @OneToMany(() => PropertyEntity, (p) => p.owner)
  ownedProperties!: PropertyEntity[];
}
