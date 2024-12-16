import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  IsEmail,
  IsNumber,
} from 'class-validator';
import { Timestamp } from 'firebase/firestore';

export class updateUserRequestDTO {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  realname?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsInt()
  chatCount?: number;
}
