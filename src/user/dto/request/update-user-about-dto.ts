import { IsNotEmpty } from "class-validator";

export class UpdateUserAboutDto{
    
    @IsNotEmpty()
    private _authId: string;
    
    @IsNotEmpty()
    private _about: string;

    public get authId(): string {
        return this._authId;
    }
    public set authId(value: string) {
        this._authId = value;
    }

    public get about(): string {
        return this._about;
    }
    public set about(value: string) {
        this._about = value;
    }
    
}