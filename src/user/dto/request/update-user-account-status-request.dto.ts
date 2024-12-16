import { IsEnum } from 'class-validator';
import { AccountStatus } from 'src/enum/account-status.enum';

export class updateUserAccountStatusRequestDTO {
  //validate enum
  @IsEnum(AccountStatus)
  accountStatus: AccountStatus;
}
