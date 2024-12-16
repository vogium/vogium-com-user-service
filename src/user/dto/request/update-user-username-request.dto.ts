import { IsString } from 'class-validator';

export class updateUserUsernameRequestDTO {
  @IsString()
  username: string;
}
