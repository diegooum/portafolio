import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

/**
 * UpdateProjectDto reutiliza CreateProjectDto y convierte
 * todos sus campos en opcionales (PATCH-friendly).
 */
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}