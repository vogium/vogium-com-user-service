import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  IsEmail,
} from 'class-validator';
import { Timestamp } from 'firebase/firestore';

export enum AccountType {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPERUSER = 'superuser',
  DEVELOPER = 'developer',
}

export enum AccountStatus {
  USER = 'user',
  VOGGER = 'vogger',
  BUSINESS = 'business',
}

export enum UserType {
  BASIC = 'basic',
  PLUS = 'plus',
  PRIVE = 'prive',
  ELITE = 'elite',
}

export enum UserStatus {
  NORMAL = 'normal',
  VERIFIED = 'verified',
  VOGGER = 'vogger',
  BUSINESS = 'business',
}

export enum UserSex {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
}

export class UserDTO {
  @IsString()
  authId: string;

  @IsOptional()
  @IsInt()
  numberId?: number;

  @IsOptional()
  @IsString({ each: true })
  notificationIds?: string[];

  // @IsInt()
  // authType: number;

  @IsEmail()
  emailAddress: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  realname?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  lastIpAddress?: string;

  @IsOptional()
  socialAccounts?: Record<string, any>;

  @IsOptional()
  @IsString({ each: true })
  topicList?: string[];

  @IsOptional()
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

  @IsOptional()
  accountType: AccountType = AccountType.USER;

  @IsOptional()
  accountStatus: AccountStatus = AccountStatus.USER;

  @IsOptional()
  userStatus: UserStatus = UserStatus.NORMAL;

  @IsOptional()
  userType: UserType = UserType.BASIC;

  @IsOptional()
  @IsInt()
  city?: number;

  @IsOptional()
  @IsInt()
  country?: number;

  @IsString()
  password: string;

  @IsOptional()
  totalExpenditure: number = 0.0;

  @IsOptional()
  coefficient: number = 0.0;

  @IsBoolean()
  isBanned: boolean = false;

  @IsBoolean()
  isDeleted: boolean = false;

  @IsBoolean()
  isFrozen: boolean = false;

  @IsBoolean()
  isEmailVerified: boolean = false;

  @IsBoolean()
  isPhoneVerified: boolean = false;

  @IsBoolean()
  isAccountVerified: boolean = false;

  @IsBoolean()
  isSubscriptionEnable: boolean = false;

  @IsOptional()
  createDate?: Timestamp;

  @IsOptional()
  birthDate?: Timestamp;

  @IsOptional()
  banDate?: Timestamp;

  @IsOptional()
  expireBanDate?: Timestamp;

  @IsOptional()
  deleteDate?: Timestamp;

  @IsOptional()
  frozenDate?: Timestamp;

  @IsOptional()
  lastLoginDate?: Timestamp;

  @IsOptional()
  lastLogoutDate?: Timestamp;

  @IsOptional()
  usernameChangedDate?: Timestamp;

  @IsOptional()
  accountVerifiedDate?: Timestamp;

  @IsOptional()
  isFollowing: boolean = false;

  @IsOptional()
  isFollower: boolean = false;

  @IsOptional()
  isSubscribed: boolean = false;

  @IsOptional()
  isBlocked: boolean = false;
}
