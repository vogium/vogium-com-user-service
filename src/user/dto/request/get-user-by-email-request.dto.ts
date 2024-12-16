import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class getUserByEmailRequestDTO {
  //   @IsOptional()
  @IsNotEmpty()
  private _email: string;

  @Expose()
  public get email(): string {
    return this._email;
  }
  public set email(email: string) {
    this._email = email;
  }
}
