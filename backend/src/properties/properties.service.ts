import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantsService } from '../tenants/tenants.service';
import { PropertyEntity, type PropertyStatus } from './property.entity';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly tenants: TenantsService,
    @InjectRepository(PropertyEntity)
    private readonly properties: Repository<PropertyEntity>,
  ) {}

  private canPublish(
    p: Pick<
      PropertyEntity,
      'title' | 'description' | 'location' | 'price' | 'images'
    >,
  ) {
    return (
      p.title.trim().length >= 5 &&
      p.description.trim().length >= 20 &&
      p.location.trim().length >= 3 &&
      Number.isFinite(Number(p.price)) &&
      Number(p.price) > 0 &&
      Array.isArray(p.images) &&
      p.images.length >= 1
    );
  }

  async listPublic(
    tenantSlug: string,
    query: {
      location?: string;
      minPrice?: number;
      maxPrice?: number;
      page: number;
      pageSize: number;
    },
  ) {
    const tenant = await this.tenants.findBySlug(tenantSlug);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const page = query.page;
    const pageSize = query.pageSize;

    const qb = this.properties
      .createQueryBuilder('p')
      .where('p.tenantId = :tenantId', { tenantId: tenant.id })
      .andWhere('p.status = :status', { status: 'published' as PropertyStatus })
      .andWhere('p.disabled = false');

    if (query.location && query.location.trim()) {
      qb.andWhere('LOWER(p.location) LIKE :loc', {
        loc: `%${query.location.toLowerCase()}%`,
      });
    }

    if (typeof query.minPrice === 'number') {
      qb.andWhere('p.price >= :minPrice', { minPrice: query.minPrice });
    }

    if (typeof query.maxPrice === 'number') {
      qb.andWhere('p.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    qb.orderBy('p.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, total] = await qb.getManyAndCount();
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return { items, total, page, pageSize, totalPages };
  }

  async statsPublic(
    tenantSlug: string,
    query: { location?: string; minPrice?: number; maxPrice?: number },
  ) {
    const tenant = await this.tenants.findBySlug(tenantSlug);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const qb = this.properties
      .createQueryBuilder('p')
      .where('p.tenantId = :tenantId', { tenantId: tenant.id })
      .andWhere('p.status = :status', { status: 'published' as PropertyStatus })
      .andWhere('p.disabled = false');

    if (query.location && query.location.trim()) {
      qb.andWhere('LOWER(p.location) LIKE :loc', {
        loc: `%${query.location.toLowerCase()}%`,
      });
    }

    if (typeof query.minPrice === 'number') {
      qb.andWhere('p.price >= :minPrice', { minPrice: query.minPrice });
    }

    if (typeof query.maxPrice === 'number') {
      qb.andWhere('p.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    const raw = await qb
      .select('COUNT(*)', 'total')
      .addSelect('MIN(p.price)', 'minPrice')
      .addSelect('MAX(p.price)', 'maxPrice')
      .getRawOne<{
        total: string;
        minPrice: string | null;
        maxPrice: string | null;
      }>();

    return {
      total: raw?.total ? Number(raw.total) : 0,
      minPrice: raw?.minPrice == null ? null : Number(raw.minPrice),
      maxPrice: raw?.maxPrice == null ? null : Number(raw.maxPrice),
    };
  }

  async listOwner(tenantSlug: string, ownerId: string) {
    const tenant = await this.tenants.findBySlug(tenantSlug);
    if (!tenant) throw new NotFoundException('Tenant not found');

    return this.properties.find({
      where: { tenantId: tenant.id, ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  async listAdmin(tenantSlug: string) {
    const tenant = await this.tenants.findBySlug(tenantSlug);
    if (!tenant) throw new NotFoundException('Tenant not found');

    return this.properties.find({
      where: { tenantId: tenant.id },
      order: { createdAt: 'DESC' },
    });
  }

  async getPublicById(tenantSlug: string, id: string) {
    const tenant = await this.tenants.findBySlug(tenantSlug);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const p = await this.properties.findOne({
      where: {
        id,
        tenantId: tenant.id,
        status: 'published',
        disabled: false,
      },
    });

    if (!p) throw new NotFoundException('Property not found');
    return p;
  }

  async createDraft(
    tenantSlug: string,
    ownerId: string,
    input: {
      title: string;
      description: string;
      location: string;
      price: number;
      images?: string[];
    },
  ) {
    const tenant = await this.tenants.findBySlug(tenantSlug);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const entity = this.properties.create({
      tenantId: tenant.id,
      ownerId,
      title: input.title,
      description: input.description,
      location: input.location,
      price: input.price,
      status: 'draft',
      disabled: false,
      images: input.images ?? [],
    });

    return this.properties.save(entity);
  }

  async updateDraft(
    tenantSlug: string,
    ownerId: string,
    id: string,
    input: {
      title?: string;
      description?: string;
      location?: string;
      price?: number;
      images?: string[];
    },
  ) {
    const tenant = await this.tenants.findBySlug(tenantSlug);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const p = await this.properties.findOne({
      where: { id, tenantId: tenant.id },
    });
    if (!p) throw new NotFoundException('Property not found');
    if (p.ownerId !== ownerId) throw new BadRequestException('Not the owner');
    if (p.status !== 'draft') {
      throw new BadRequestException('Only draft properties can be edited');
    }

    if (typeof input.title === 'string') p.title = input.title;
    if (typeof input.description === 'string')
      p.description = input.description;
    if (typeof input.location === 'string') p.location = input.location;
    if (typeof input.price === 'number') p.price = input.price;
    if (Array.isArray(input.images)) p.images = input.images;

    return this.properties.save(p);
  }

  async publish(
    tenantSlug: string,
    ownerId: string,
    id: string,
    force = false,
  ) {
    const tenant = await this.tenants.findBySlug(tenantSlug);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const p = await this.properties.findOne({
      where: { id, tenantId: tenant.id },
    });

    if (!p) throw new NotFoundException('Property not found');
    if (p.ownerId !== ownerId) throw new BadRequestException('Not the owner');

    if (!force && !this.canPublish(p)) {
      throw new BadRequestException(
        'Property missing required fields (title, description, location, price, 1+ image)',
      );
    }

    p.status = 'published';
    return this.properties.save(p);
  }

  async toggleDisabled(tenantSlug: string, id: string) {
    const tenant = await this.tenants.findBySlug(tenantSlug);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const p = await this.properties.findOne({
      where: { id, tenantId: tenant.id },
    });
    if (!p) throw new NotFoundException('Property not found');

    p.disabled = !p.disabled;
    return this.properties.save(p);
  }
}
