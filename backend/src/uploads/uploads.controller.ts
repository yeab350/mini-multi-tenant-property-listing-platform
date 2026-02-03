import {
  BadRequestException,
  Controller,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

@Controller('tenants/:tenantSlug/owner/uploads')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class UploadsController {
  @Roles('owner')
  @Post('images')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: MAX_BYTES },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME.has(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Unsupported type. Use JPG/PNG/WebP (max 5MB each).',
            ),
            false,
          );
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: 'uploads',
        filename: (_req, file, cb) => {
          const safeExt =
            extname(file.originalname) ||
            (file.mimetype === 'image/jpeg'
              ? '.jpg'
              : file.mimetype === 'image/png'
                ? '.png'
                : '.webp');
          cb(null, `${randomUUID()}${safeExt}`);
        },
      }),
    }),
  )
  uploadImages(
    @Param('tenantSlug') _tenantSlug: string,
    @CurrentUser() _user: AuthUser,
    @Req() req: Request,
    @UploadedFiles() files: Array<Express.Multer.File> | undefined,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const host = req.get('host');
    if (!host) throw new BadRequestException('Missing Host header');

    const origin = `${req.protocol}://${host}`;
    const urls = files.map((f) => `${origin}/uploads/${f.filename}`);
    return { urls };
  }
}
