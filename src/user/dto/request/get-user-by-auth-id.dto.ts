import { IsString } from 'class-validator';

export class GetUserByAuthId {
  @IsString()
  private _authId: string;

  public get authId(): string {
    return this._authId;
  }
  public set authId(value: string) {
    this._authId = value;
  }

  constructor(authId: string) {
    this._authId = authId;
  }
}
