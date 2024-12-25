import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class UpdateUserFollowerCountRequestDTO{
    @IsNotEmpty()
    @IsString()
    _authId: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    _followerCount: number;

    public get authId(): string{
        return this._authId;
    }

    public set authId(value: string){
        this._authId = value;
    }

    public get followerCount(): number{
        return this._followerCount;
    }

    public set followerCount(value: number){
        this._followerCount = value;
    }
}