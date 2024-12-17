import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserStatus } from 'src/enum/user-status.enum';

export class UpdateUserStatusRequestDTO {
  //validate enum
  @IsEnum(UserStatus)
  @IsNotEmpty()
  userStatus: UserStatus;

  @IsNotEmpty()
  @IsString()
  authId: string;
}
