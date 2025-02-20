import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateModeratorIsEmailVerifiedRequestDTO {
  @IsNotEmpty()
  @IsString()
  private _authId: string;

  @IsNotEmpty()
  @IsBoolean()
  private _isEmailVerified: boolean;

  public get authId(): string {
    return this._authId;
  }

  public set authId(value: string) {
    this._authId = value;
  }

  public get isEmailVerified(): boolean {
    return this._isEmailVerified;
  }

  public set isEmailVerified(value: boolean) {
    this._isEmailVerified = value;
  }
}
