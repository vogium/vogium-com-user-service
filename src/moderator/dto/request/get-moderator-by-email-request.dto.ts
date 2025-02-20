import { IsNotEmpty } from 'class-validator';

export class GetModeratorByEmailRequestDTO {
  @IsNotEmpty()
  private _email: string;

  public get email(): string {
    return this._email;
  }
  public set email(email: string) {
    this._email = email;
  }
}
