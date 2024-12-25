import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class UpdateUserVogCountRequestDTO{
    @IsNotEmpty()
    @IsString()
    private _authId: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    private _vogCount: number;

    public get authId(): string {
        return this._authId;
    }

    public set authId(value: string) {
        this._authId = value;
    }

    public get vogCount(): number {
        return this._vogCount;
    }

    public set vogCount(value: number) {
        this._vogCount = value;
    }
}