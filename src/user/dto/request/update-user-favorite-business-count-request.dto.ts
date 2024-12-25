import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class UpdateUserFavoriteBusinessCountRequestDTO{
    @IsNotEmpty()
    @IsString()
    private _authId: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    private _favoriteBusinessCount: number;

    public get authId(): string {
        return this._authId;
    }

    public set authId(value: string) {
        this._authId = value;
    }

    public get favoriteBusinessCount(): number {
        return this._favoriteBusinessCount;
    }

    public set favoriteBusinessCount(value: number) {
        this._favoriteBusinessCount = value;
    }
}