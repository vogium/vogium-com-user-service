export class AccountStatus {
    static readonly user = 0;
    static readonly vogger = 1;
    static readonly business = 2;
  
    static fromJson(typeCode: number) {
      switch (typeCode) {
        case AccountStatus.user:
          return 'user';
        case AccountStatus.vogger:
          return 'vogger';
        case AccountStatus.business:
          return 'business';
        default:
          throw new Error('Invalid AccountStatus');
      }
    }
  
    static toJson(accountStatus: string): number {
      switch (accountStatus) {
        case 'user':
          return AccountStatus.user;
        case 'vogger':
          return AccountStatus.vogger;
        case 'business':
          return AccountStatus.business;
        default:
          throw new Error('Invalid AccountStatus');
      }
    }
  }
  