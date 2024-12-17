import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from 'src/enum/user-type.enum';

export class UpdateUserTypeRequestDTO {
  @IsEnum(UserType)
  @IsNotEmpty()
  userType: UserType;

  @IsNotEmpty()
  @IsString()
  authId: string;
}
