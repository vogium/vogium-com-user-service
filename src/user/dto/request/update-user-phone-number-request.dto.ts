import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class UpdateUserPhoneNumberRequestDTO {
    @IsNotEmpty()
    @IsString()
    private _authId: string;

    @IsNotEmpty()
    @IsString()
    //@IsPhoneNumber('TR')
    private _phoneNumber: string;


    public get authId(): string {
        return this._authId;
    }

    public set authId(value: string) {
        this._authId = value;
    }

    public get phoneNumber(): string {
        return this._phoneNumber;
    }

    public set phoneNumber(value: string) {
        this._phoneNumber = value;
    }
}