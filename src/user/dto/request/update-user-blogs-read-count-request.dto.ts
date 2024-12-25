import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class UpdateUserBlogsReadCountRequestDTO{
    @IsNotEmpty()
    @IsString()
    private _authId: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    private _blogsReadCount: number;

    public get authId(): string {
        return this._authId;
    }

    public set authId(value: string) {
        this._authId = value;
    }

    public get blogsReadCount(): number {
        return this._blogsReadCount;
    }

    public set blogsReadCount(value: number) {
        this._blogsReadCount = value;
    }
}