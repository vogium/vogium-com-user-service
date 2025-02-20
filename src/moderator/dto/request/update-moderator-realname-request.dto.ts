import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateModeratorRealnameRequestDTO {
  @IsString()
  @IsNotEmpty()
  realname: string;

  @IsString()
  @IsNotEmpty()
  authId: string;
}
