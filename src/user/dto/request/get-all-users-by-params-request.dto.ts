import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FieldParams } from 'src/firebase/dto/request-field-params.dto';

class FieldParamsAttribute {
  @IsString()
  field: string;

  @IsIn([
    '<',
    '<=',
    '==',
    '>=',
    '>',
    '!=',
    'array-contains',
    'in',
    'not-in',
    'array-contains-any',
  ])
  operator: FirebaseFirestore.WhereFilterOp;

  @IsNotEmpty()
  value: any;
}

export class GetAllUsersByFieldRequestDTO {
  @IsOptional()
  @ValidateNested()
  @Type(() => FieldParamsAttribute)
  fieldParams: FieldParams[];
}
