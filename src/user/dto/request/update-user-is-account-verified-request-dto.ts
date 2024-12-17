import { IsNotEmpty } from "class-validator";

export class UpdateUserIsAccountVerifiedRequestDTO{

    @IsNotEmpty()
    private _authId: string;

    @IsNotEmpty()
    private _isAccountVerified: boolean;

    public get authId(): string {
        return this._authId;
    }
    public set authId(value: string) {
        this._authId = value;
    }
    
    public get isAccountVerified(): boolean {
        return this._isAccountVerified;
    }
    public set isAccountVerified(value: boolean) {
        this._isAccountVerified = value;
    }

}