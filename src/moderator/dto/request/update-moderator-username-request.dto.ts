import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateModeratorUsernameRequestDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  authId: string;
}
