import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserBirthDateRequestDTO {
    @IsNotEmpty()
    @IsString()
    private _authId: string;

    @IsNotEmpty()
    @IsString()
    private _birthDate: string; // format: "YYYY-MM-DD" 
    
    public get authId(): string {
        return this._authId;
    }
    
    public set authId(value: string) {
        this._authId = value;
    }

    public get birthDate(): string {
        return this._birthDate;
    }

    public set birthDate(value: string) {
        this._birthDate = value;
    }
}