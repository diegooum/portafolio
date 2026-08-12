import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUrl,
  IsEnum,
  IsArray,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LayoutSize } from '@prisma/client';

class ProjectTechnologyInputDto {
  @IsString()
  skillId: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

class ProjectImageInputDto {
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class CreateProjectDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(3)
  slug: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsEnum(LayoutSize)
  layoutSize?: LayoutSize;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsString()
  accentColor?: string;

  @IsOptional()
  @IsUrl()
  repoUrl?: string;

  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectTechnologyInputDto)
  technologies?: ProjectTechnologyInputDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectImageInputDto)
  gallery?: ProjectImageInputDto[];
}