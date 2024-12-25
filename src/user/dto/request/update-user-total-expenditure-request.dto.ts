import { IsNotEmpty, IsString, IsNumber, IsPositive } from "class-validator";

export class UpdateUserTotalExpenditureRequestDTO {
    @IsNotEmpty()
    @IsString()
    private _authId: string;

    @IsNotEmpty()
    @IsNumber()
    //@IsPositive()
    private _totalExpenditure: number;

    public get authId(): string {
        return this._authId;
    }

    public set authId(value: string) {
        this._authId = value;
    }

    public get totalExpenditure(): number {
        return this._totalExpenditure;
    }

    public set totalExpenditure(value: number) {
        this._totalExpenditure = value;
    }
}