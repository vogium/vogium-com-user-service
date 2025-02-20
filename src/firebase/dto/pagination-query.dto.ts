import { IsOptional } from 'class-validator';
import { FieldParams } from './request-field-params.dto';
import { OrderByDirection } from 'firebase-admin/firestore';

export class PaginationQueryDTO {
  @IsOptional()
  start?: number;

  @IsOptional()
  end?: number;

  @IsOptional()
  sort?: string;

  @IsOptional()
  order?: OrderByDirection;

  @IsOptional()
  filters?: FieldParams[];

  //todo esgeçildi..algolia ile beraberinde kullanılacak.
  @IsOptional()
  searchText: string;
}
