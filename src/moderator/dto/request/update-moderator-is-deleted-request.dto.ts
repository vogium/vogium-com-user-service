import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class UpdateModeratorIsDeletedRequestDTO {
  @IsNotEmpty()
  @IsString()
  private _authId: string;

  @IsNotEmpty()
  @IsBoolean()
  private _isDeleted: boolean;

  public get authId(): string {
    return this._authId;
  }

  public set authId(value: string) {
    this._authId = value;
  }

  public get isDeleted(): boolean {
    return this._isDeleted;
  }

  public set isDeleted(value: boolean) {
    this._isDeleted = value;
  }
}
