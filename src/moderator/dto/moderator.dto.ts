import { Expose } from 'class-transformer';
import { Timestamp } from 'firebase-admin/firestore';
import { AccountType } from 'src/enum/account-type.enum';
import { UserSex } from 'src/enum/user-sex.enum';

export class ModeratorDTO {
  @Expose()
  authId: string;

  /*@Expose()
  numberId: number;*/

  @Expose()
  authType: number;

  @Expose()
  emailAddress: string;

  @Expose()
  username: string;

  @Expose()
  realname: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  avatarUrl: string;

  @Expose()
  lastIpAddress: string;

  @Expose()
  sex: UserSex = UserSex.UNKNOWN;

  @Expose()
  accountType: AccountType = AccountType.MODERATOR;

  @Expose()
  city: number;

  @Expose()
  country: number;

  @Expose()
  password: string;

  /*@Expose()
  isBanned: boolean = false;*/

  @Expose()
  isDeleted: boolean = false;

  @Expose()
  isFrozen: boolean = false;

  @Expose()
  isEmailVerified: boolean = false;

  @Expose()
  isPhoneVerified: boolean = false;

  @Expose()
  createDate: Timestamp;

  @Expose()
  birthDate: Timestamp;

  /*@Expose()
  banDate: Timestamp;

  @Expose()
  expireBanDate: Timestamp;*/

  @Expose()
  deleteDate: Timestamp;

  @Expose()
  frozenDate: Timestamp;

  @Expose()
  lastLoginDate: Timestamp;

  @Expose()
  lastLogoutDate: Timestamp;
}
