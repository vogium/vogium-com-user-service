export class UserStatus {
    static readonly normal = 0;
    static readonly verified = 1;
    static readonly vogger = 2;
    static readonly business = 3;
  
    static fromJson(typeCode: number) {
      switch (typeCode) {
        case UserStatus.normal:
          return 'normal';
        case UserStatus.verified:
          return 'verified';
        case UserStatus.vogger:
          return 'vogger';
        case UserStatus.business:
          return 'business';
        default:
          throw new Error('Invalid UserStatus');
      }
    }
  
    static toJson(userStatus: string): number {
      switch (userStatus) {
        case 'normal':
          return UserStatus.normal;
        case 'verified':
          return UserStatus.verified;
        case 'vogger':
          return UserStatus.vogger;
        case 'business':
          return UserStatus.business;
        default:
          throw new Error('Invalid UserStatus');
      }
    }
  }
  