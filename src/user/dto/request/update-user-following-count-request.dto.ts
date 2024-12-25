import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class UpdateUserFollowingCountRequestDTO{
    @IsNotEmpty()
    @IsString()
    _authId: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    _followingCount: number;

    public get authId(): string{
        return this._authId;
    }

    public set authId(value: string){
        this._authId = value;
    }

    public get followingCount(): number{
        return this._followingCount;
    }

    public set followingCount(value: number){
        this._followingCount = value;
    }
}