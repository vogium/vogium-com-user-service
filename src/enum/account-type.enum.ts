export class AccountType {
  static readonly USER = 0;
  static readonly MODERATOR = 1;
  static readonly ADMIN = 2;
  static readonly SUPERUSER = 3;
  static readonly DEVELOPER = 4;

  static fromJson(typeCode: number): string {
    switch (typeCode) {
      case AccountType.USER:
        return 'user';
      case AccountType.MODERATOR:
        return 'moderator';
      case AccountType.ADMIN:
        return 'admin';
      case AccountType.SUPERUSER:
        return 'superuser';
      case AccountType.DEVELOPER:
        return 'developer';
      default:
        throw new Error('Invalid AccountType');
    }
  }

  static toJson(accountType: string): number {
    switch (accountType) {
      case 'user':
        return AccountType.USER;
      case 'moderator':
        return AccountType.MODERATOR;
      case 'admin':
        return AccountType.ADMIN;
      case 'superuser':
        return AccountType.SUPERUSER;
      case 'developer':
        return AccountType.DEVELOPER;
      default:
        throw new Error('Invalid AccountType');
    }
  }
}
