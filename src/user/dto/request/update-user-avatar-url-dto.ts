export class UpdateUserAvatarUrlDTO{
    private _authId: string;

    private _avatarUrl: string;

    public get authId(): string {
        return this._authId;
    }
    public set authId(value: string) {
        this._authId = value;
    }
    
    public get avatarUrl(): string {
        return this._avatarUrl;
    }
    public set avatarUrl(value: string) {
        this._avatarUrl = value;
    }

}