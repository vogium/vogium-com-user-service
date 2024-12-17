import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AccountType } from 'src/enum/account-type.enum';

export class UpdateUserAccountTypeRequestDTO {
  //validate enum
  @IsNotEmpty()
  @IsEnum(AccountType)
  accountType: AccountType;

  @IsString()
  @IsNotEmpty()
  authId: string;
}
