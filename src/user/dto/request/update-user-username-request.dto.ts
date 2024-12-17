import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserUsernameRequestDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  authId: string;
}
