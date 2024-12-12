export class AccountType {
    static readonly user = 0;
    static readonly moderator = 1;
    static readonly admin = 2;
    static readonly superuser = 3;
    static readonly developer = 4;
  
    static fromJson(typeCode: number): string {
      switch (typeCode) {
        case AccountType.user:
          return 'user';
        case AccountType.moderator:
          return 'moderator';
        case AccountType.admin:
          return 'admin';
        case AccountType.superuser:
          return 'superuser';
        case AccountType.developer:
          return 'developer';
        default:
          throw new Error('Invalid AccountType');
      }
    }
  
    static toJson(accountType: string): number {
      switch (accountType) {
        case 'user':
          return AccountType.user;
        case 'moderator':
          return AccountType.moderator;
        case 'admin':
          return AccountType.admin;
        case 'superuser':
          return AccountType.superuser;
        case 'developer':
          return AccountType.developer;
        default:
          throw new Error('Invalid AccountType');
      }
    }
  }
  