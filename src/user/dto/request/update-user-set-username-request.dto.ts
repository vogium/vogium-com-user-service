import { IsString } from 'class-validator';

export class updateSetUserUsernameRequestDTO {
  @IsString()
  username: string;
}
