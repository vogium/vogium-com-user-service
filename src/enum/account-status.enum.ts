export class AccountStatus {
    static readonly USER = 0;
    static readonly VOGGER = 1;
    static readonly BUSINESS = 2;
  
    static fromJson(typeCode: number) {
      switch (typeCode) {
        case AccountStatus.USER:
          return 'user';
        case AccountStatus.VOGGER:
          return 'vogger';
        case AccountStatus.BUSINESS:
          return 'business';
        default:
          throw new Error('Invalid AccountStatus');
      }
    }
  
    static toJson(accountStatus: string): number {
      switch (accountStatus) {
        case 'user':
          return AccountStatus.USER;
        case 'vogger':
          return AccountStatus.VOGGER;
        case 'business':
          return AccountStatus.BUSINESS;
        default:
          throw new Error('Invalid AccountStatus');
      }
    }
  }
  