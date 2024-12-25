import { IsNotEmpty, IsString } from "class-validator";
import { Timestamp } from "firebase-admin/firestore";


export class UpdateUserLastLogoutDateRequestDTO {
    @IsNotEmpty()
    @IsString()
    private _authId: string;

    @IsNotEmpty()
    private _lastLogoutDate: Timestamp;

    public get authId(): string {
        return this._authId;
    }

    public set authId(value: string) {
        this._authId = value;
    }

    public get lastLogoutDate(): Timestamp {
        return this._lastLogoutDate;
    }

    public set lastLogoutDate(value: Timestamp) {
        this._lastLogoutDate = value;
    }

}