export class UserType {
    static readonly basic = 0;
    static readonly plus = 1;
    static readonly prive = 2;
    static readonly elite = 3;
  
    static fromJson(typeCode: number) {
      switch (typeCode) {
        case UserType.basic:
          return 'basic';
        case UserType.plus:
          return 'plus';
        case UserType.prive:
          return 'prive';
        case UserType.elite:
          return 'elite';
        default:
          throw new Error('Invalid UserType');
      }
    }
  
    static toJson(userType: string): number {
      switch (userType) {
        case 'basic':
          return UserType.basic;
        case 'plus':
          return UserType.plus;
        case 'prive':
          return UserType.prive;
        case 'elite':
          return UserType.elite;
        default:
          throw new Error('Invalid UserType');
      }
    }
  }
   