import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateUserSubscriberCountRequestDTO {

    @IsNotEmpty()
    @IsString()
    private _authId: string;

    @IsNotEmpty()
    @IsNumber()
    private _subscriberCount: number;

    public get authId(): string {
        return this._authId;
    }

    public set authId(value: string) {
        this._authId = value;
    }

    public get subscriberCount(): number {
        return this._subscriberCount;
    }

    public set subscriberCount(value: number) {
        this._subscriberCount = value;
    }
}