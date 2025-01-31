import { IsOptional, IsNumber, ValidateNested, IsObject } from 'class-validator';

export class PaginationQueryDTO {
  @IsOptional()
  _start?: number;

  @IsOptional()
  _end?: number;

  @IsOptional()
  filter: string;
}