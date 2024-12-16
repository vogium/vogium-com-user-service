import { IsEnum } from 'class-validator';
import { AccountType } from 'src/enum/account-type.enum';

export class updateUserAccountTypeRequestDTO {
  //validate enum
  @IsEnum(AccountType)
  accountType: AccountType;
}
