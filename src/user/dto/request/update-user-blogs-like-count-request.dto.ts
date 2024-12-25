import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class UpdateUserBlogsLikeCountRequestDTO{
    @IsNotEmpty()
    @IsString()
    private _authId: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    private _blogsLikeCount: number;

    public get authId(): string {
        return this._authId;
    }

    public set authId(value: string) {
        this._authId = value;
    }

    public get blogsLikeCount(): number {
        return this._blogsLikeCount;
    }

    public set blogsLikeCount(value: number) {
        this._blogsLikeCount = value;
    }
}