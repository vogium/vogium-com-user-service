import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateUserSubscriptionCountRequestDTO {

    @IsNotEmpty()
    @IsString()
    private _authId: string;

    @IsNotEmpty()
    @IsNumber()
    private _subscriptionCount: number;

    public get authId(): string {
        return this._authId;
    }

    public set authId(value: string) {
        this._authId = value;
    }

    public get subscriptionCount(): number {
        return this._subscriptionCount;
    }

    public set subscriptionCount(value: number) {
        this._subscriptionCount = value;
    }
}