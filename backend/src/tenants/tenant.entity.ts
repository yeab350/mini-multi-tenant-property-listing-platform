import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { PropertyEntity } from '../properties/property.entity';
import { FavoriteEntity } from '../favorites/favorite.entity';

@Entity('tenants')
export class TenantEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'text' })
  slug!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  tagline!: string | null;

  @Column({ type: 'text', nullable: true })
  accent!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @OneToMany(() => UserEntity, (u) => u.tenant)
  users!: UserEntity[];

  @OneToMany(() => PropertyEntity, (p) => p.tenant)
  properties!: PropertyEntity[];

  @OneToMany(() => FavoriteEntity, (f) => f.tenant)
  favorites!: FavoriteEntity[];
}
