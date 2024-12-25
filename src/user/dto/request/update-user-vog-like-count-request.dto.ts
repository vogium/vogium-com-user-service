import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class UpdateUserVogLikeCountRequestDTO{
    @IsNotEmpty()
    @IsString()
    private _authId: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    private _vogLikeCount: number;

    public get authId(): string {
        return this._authId;
    }

    public set authId(value: string) {
        this._authId = value;
    }

    public get vogLikeCount(): number {
        return this._vogLikeCount;
    }

    public set vogLikeCount(value: number) {
        this._vogLikeCount = value;
    }
}