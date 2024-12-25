import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserAddressRequestDTO{
    @IsNotEmpty()
    @IsString()
    private _authId: string;

    @IsNotEmpty()
    @IsString()
    private _city: string;

    @IsNotEmpty()
    @IsString()
    private _country: string;

    public get authId(): string {
        return this._authId;
    }

    public set authId(value: string) {
        this._authId = value;
    }

    public get city(): string {
        return this._city;
    }

    public set city(value: string) {
        this._city = value;
    }

    public get country(): string {
        return this._country;
    }

    public set country(value: string) {
        this._country = value;
    }
    
}