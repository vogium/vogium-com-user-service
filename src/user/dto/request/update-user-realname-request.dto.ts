import { IsString } from 'class-validator';

export class updateUserRealnameRequestDTO {
  @IsString()
  realname: string;
}
