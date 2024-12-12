export class UserSex {
    static readonly male = 0;
    static readonly female = 1;
    static readonly unknown = 2;
  
    static fromJson(sexCode: number) {
      switch (sexCode) {
        case UserSex.male:
          return 'male';
        case UserSex.female:
          return 'female';
        case UserSex.unknown:
          return 'unknown';
        default:
          throw new Error('Invalid UserSex');
      }
    }
  
    static toJson(sex: string): number {
      switch (sex) {
        case 'male':
          return UserSex.male;
        case 'female':
          return UserSex.female;
        case 'unknown':
          return UserSex.unknown;
        default:
          throw new Error('Invalid UserSex');
      }
    }
  }