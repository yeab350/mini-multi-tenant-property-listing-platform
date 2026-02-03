import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TenantEntity } from '../tenants/tenant.entity';
import { UserEntity } from '../users/user.entity';
import { FavoriteEntity } from '../favorites/favorite.entity';

export const PROPERTY_STATUSES = ['draft', 'published'] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

@Entity('properties')
@Index(['tenantId', 'status', 'disabled'])
export class PropertyEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @ManyToOne(() => TenantEntity, (t) => t.properties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant!: TenantEntity;

  @Column({ type: 'uuid', nullable: true })
  ownerId!: string | null;

  @ManyToOne(() => UserEntity, (u) => u.ownedProperties, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'ownerId' })
  owner!: UserEntity | null;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text' })
  location!: string;

  @Column({ type: 'numeric' })
  price!: number;

  @Column({ type: 'text' })
  status!: PropertyStatus;

  @Column({ type: 'boolean', default: false })
  disabled!: boolean;

  @Column({ type: 'text', array: true, default: () => 'ARRAY[]::text[]' })
  images!: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => FavoriteEntity, (f) => f.property)
  favorites!: FavoriteEntity[];
}
