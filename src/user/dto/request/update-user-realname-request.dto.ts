import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRealnameRequestDTO {
  @IsString()
  @IsNotEmpty()
  realname: string;

  @IsString()
  @IsNotEmpty()
  authId: string;
}
