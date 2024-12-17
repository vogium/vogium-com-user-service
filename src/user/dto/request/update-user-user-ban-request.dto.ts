import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { Timestamp } from 'firebase-admin/firestore';

export class UpdateUserBanRequestDTO {
  //validate enum
  @IsBoolean()
  @IsNotEmpty()
  isBanned: boolean;

  @IsNotEmpty()
  @IsString()
  authId: string;

  //conditional required
  @ValidateIf((o) => o.isBanned === true)
  @IsNotEmpty({ message: 'expireBanDate is required when user is banned' })
  expireBanDate?: Timestamp;
}
