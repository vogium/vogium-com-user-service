import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateModeratorIsPhoneVerifiedRequestDTO {
  @IsNotEmpty()
  @IsString()
  private _authId: string;

  @IsNotEmpty()
  @IsBoolean()
  private _isPhoneVerified: boolean;

  public get authId(): string {
    return this._authId;
  }

  public set authId(value: string) {
    this._authId = value;
  }

  public get isPhoneVerified(): boolean {
    return this._isPhoneVerified;
  }

  public set isPhoneVerified(value: boolean) {
    this._isPhoneVerified = value;
  }
}
