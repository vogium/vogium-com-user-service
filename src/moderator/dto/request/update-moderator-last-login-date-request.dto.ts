import { IsNotEmpty, IsString } from 'class-validator';
import { Timestamp } from 'firebase-admin/firestore';

export class UpdateModeratorLastLoginDateRequestDTO {
  @IsNotEmpty()
  @IsString()
  private _authId: string;

  @IsNotEmpty()
  private _lastLoginDate: Timestamp;

  public get authId(): string {
    return this._authId;
  }

  public set authId(value: string) {
    this._authId = value;
  }

  public get lastLoginDate(): Timestamp {
    return this._lastLoginDate;
  }

  public set lastLoginDate(value: Timestamp) {
    this._lastLoginDate = value;
  }
}
