import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AccountStatus } from 'src/enum/account-status.enum';

export class UpdateUserAccountStatusRequestDTO {
  //validate enum
  @IsEnum(AccountStatus)
  @IsNotEmpty()
  accountStatus: AccountStatus;

  @IsNotEmpty()
  @IsString()
  authId: string;
}
