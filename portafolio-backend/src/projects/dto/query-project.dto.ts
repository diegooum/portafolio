import { IsOptional, IsBooleanString, IsString } from 'class-validator';

export class QueryProjectDto {
  // Llega como string desde la query ("true"/"false"), se transforma en el service
  @IsOptional()
  @IsBooleanString()
  featured?: string;

  @IsOptional()
  @IsString()
  technology?: string; // filtra por nombre de skill, ej: ?technology=Python
}