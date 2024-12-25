import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class UpdateUserPostCommentCountRequestDTO{
    @IsNotEmpty()
    @IsString()
    private _authId: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    private _postCommentCount: number;

    public get authId(): string {
        return this._authId;
    }

    public set authId(value: string) {
        this._authId = value;
    }

    public get postCommentCount(): number {
        return this._postCommentCount;
    }

    public set postCommentCount(value: number) {
        this._postCommentCount = value;
    }
}