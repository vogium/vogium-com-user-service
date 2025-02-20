import { IsNotEmpty } from 'class-validator';

export class UpdateModeratorGenderRequestDTO {
  @IsNotEmpty()
  private _authId: string;

  @IsNotEmpty()
  private _sex: string;

  public get authId(): string {
    return this._authId;
  }
  public set authId(value: string) {
    this._authId = value;
  }

  public get sex(): string {
    return this._sex;
  }
  public set sex(value: string) {
    this._sex = value;
  }
}
