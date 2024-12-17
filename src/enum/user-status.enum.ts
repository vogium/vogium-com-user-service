export class UserStatus {
    static readonly NORMAL = 0;
    static readonly VERIFIED = 1;
    static readonly VOGGER = 2;
    static readonly BUSINESS = 3;
  
    static fromJson(typeCode: number) {
      switch (typeCode) {
        case UserStatus.NORMAL:
          return 'NORMAL';
        case UserStatus.VERIFIED:
          return 'VERIFIED';
        case UserStatus.VOGGER:
          return 'VOGGER';
        case UserStatus.BUSINESS:
          return 'BUSINESS';
        default:
          throw new Error('Invalid UserStatus');
      }
    }
  
    static toJson(userStatus: string): number {
      switch (userStatus) {
        case 'NORMAL':
          return UserStatus.NORMAL;
        case 'VERIFIED':
          return UserStatus.VERIFIED;
        case 'VOGGER':
          return UserStatus.VOGGER;
        case 'BUSINESS':
          return UserStatus.BUSINESS;
        default:
          throw new Error('Invalid UserStatus');
      }
    }
  }
  