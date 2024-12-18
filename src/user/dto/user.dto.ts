import { Expose } from 'class-transformer';
import { IsString, IsInt } from 'class-validator';
import { Timestamp } from 'firebase-admin/firestore';
import { AccountStatus } from 'src/enum/account-status.enum';
import { AccountType } from 'src/enum/account-type.enum';
import { UserSex } from 'src/enum/user-sex.enum';
import { UserStatus } from 'src/enum/user-status.enum';
import { UserType } from 'src/enum/user-type.enum';

export class UserDTO {
  @Expose()
  authId: string;

  @Expose()
  numberId: number;

  @Expose()
  @IsString({ each: true })
  notificationIds: string[];

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
  about: string;

  @Expose()
  avatarUrl: string;

  @Expose()
  lastIpAddress: string;

  @Expose()
  socialAccounts: Record<string, any>;

  @Expose()
  @IsString({ each: true })
  topicList: string[];

  @Expose()
  sex: UserSex = UserSex.UNKNOWN;

  @IsInt()
  followerCount: number = 0;

  @IsInt()
  followingCount: number = 0;

  @IsInt()
  subscriberCount: number = 0;

  @IsInt()
  subscriptionCount: number = 0;

  @IsInt()
  chatCount: number = 0;

  @IsInt()
  notificationCount: number = 0;

  @IsInt()
  vogCount: number = 0;

  @IsInt()
  premiumVogCount: number = 0;

  @IsInt()
  vogLikeCount: number = 0;

  @IsInt()
  postCommentCount: number = 0;

  @IsInt()
  questionCount: number = 0;

  @IsInt()
  questionCommentCount: number = 0;

  @IsInt()
  blogsReadCount: number = 0;

  @IsInt()
  blogsLikeCount: number = 0;

  @IsInt()
  favoriteBusinessCount: number = 0;

  @IsInt()
  businessViewCount: number = 0;

  @Expose()
  accountType: AccountType = AccountType.USER;

  @Expose()
  accountStatus: AccountStatus = AccountStatus.USER;

  @Expose()
  userStatus: UserStatus = UserStatus.NORMAL;

  @Expose()
  userType: UserType = UserType.BASIC;

  @Expose()
  city: number;

  @Expose()
  country: number;

  @Expose()
  password: string;

  @Expose()
  totalExpenditure: number = 0.0;

  @Expose()
  coefficient: number = 0.0;

  @Expose()
  isBanned: boolean = false;

  @Expose()
  isDeleted: boolean = false;

  @Expose()
  isFrozen: boolean = false;

  @Expose()
  isEmailVerified: boolean = false;

  @Expose()
  isPhoneVerified: boolean = false;

  @Expose()
  isAccountVerified: boolean = false;

  @Expose()
  isSubscriptionEnable: boolean = false;

  @Expose()
  createDate: Timestamp;

  @Expose()
  birthDate: Timestamp;

  @Expose()
  banDate: Timestamp;

  @Expose()
  expireBanDate: Timestamp;

  @Expose()
  deleteDate: Timestamp;

  @Expose()
  frozenDate: Timestamp;

  @Expose()
  lastLoginDate: Timestamp;

  @Expose()
  lastLogoutDate: Timestamp;

  @Expose()
  usernameChangedDate: Timestamp;

  @Expose()
  accountVerifiedDate: Timestamp;

  @Expose()
  isFollowing: boolean = false;

  @Expose()
  isFollower: boolean = false;

  @Expose()
  isSubscribed: boolean = false;

  @Expose()
  isBlocked: boolean = false;
}
