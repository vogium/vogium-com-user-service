
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserFrozenRequestDTO{

    @IsNotEmpty()
    private _authId: string;

    @IsNotEmpty()
    private _isFrozen: boolean;

    public get authId(): string {
        return this._authId;
    }
    public set authId(value: string) {
        this._authId = value;
    }
    public get isFrozen(): boolean {
        return this._isFrozen;
    }
    public set isFrozen(value: boolean) {
        this._isFrozen = value;
    }

}