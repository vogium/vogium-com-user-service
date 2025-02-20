export class UserType {
  static readonly BASIC = 0;
  static readonly PLUS = 1;
  static readonly PRIVE = 2;
  static readonly ELITE = 3;

  static fromJson(typeCode: number) {
    switch (typeCode) {
      case UserType.BASIC:
        return 'BASIC';
      case UserType.PLUS:
        return 'PLUS';
      case UserType.PRIVE:
        return 'PRIVE';
      case UserType.ELITE:
        return 'ELITE';
      default:
        throw new Error('Invalid UserType');
    }
  }

  static toJson(userType: string): number {
    switch (userType) {
      case 'BASIC':
        return UserType.BASIC;
      case 'PLUS':
        return UserType.PLUS;
      case 'PRIVE':
        return UserType.PRIVE;
      case 'ELITE':
        return UserType.ELITE;
      default:
        throw new Error('Invalid UserType');
    }
  }
}
