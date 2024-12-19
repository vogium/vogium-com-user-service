import { Expose, Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { Timestamp } from 'firebase/firestore';

export class GetAllUsersResponseDTO {
  @Expose()
  authId: string;

  @Expose()
  emailAddress: string;

  @Expose()
  username: string;

  @Expose()
  realname: string;

  @Expose()
  @IsOptional()
  phoneNumber?: string;

  @Expose()
  createDate: Timestamp;

  @Expose()
  vogCount: number = 0;

  @Expose()
  questionCommentCount: number = 0;

  @Expose()
  banDate?: any;
}
