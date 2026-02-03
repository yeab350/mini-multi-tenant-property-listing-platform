import { IsBoolean, IsOptional } from 'class-validator';

export class PublishPropertyDto {
  @IsOptional()
  @IsBoolean()
  force?: boolean;
}
