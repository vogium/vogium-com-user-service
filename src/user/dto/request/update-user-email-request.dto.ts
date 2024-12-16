import { IsNotEmpty } from "class-validator";

export class UpdateUserEmailRequestDTO{

    @IsNotEmpty()
    private _authId: string;

    @IsNotEmpty()
    private _emailAddress: string;

    public get authId(): string {
        return this._authId;
    }
    public set authId(value: string) {
        this._authId = value;
    }
    
    public get emailAddress(): string {
        return this._emailAddress;
    }
    public set emailAddress(value: string) {
        this._emailAddress = value;
    }

}