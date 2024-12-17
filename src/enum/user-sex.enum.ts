export class UserSex {
    static readonly MALE = 0;
    static readonly FEMALE = 1;
    static readonly UNKNOWN = 2;
  
    static fromJson(sexCode: number) {
      switch (sexCode) {
        case UserSex.MALE:
          return 'male';
        case UserSex.FEMALE:
          return 'female';
        case UserSex.UNKNOWN:
          return 'unknown';
        default:
          throw new Error('Invalid UserSex');
      }
    }
  
    static toJson(sex: string): number {
      switch (sex) {
        case 'male':
          return UserSex.MALE;
        case 'female':
          return UserSex.FEMALE;
        case 'unknown':
          return UserSex.UNKNOWN;
        default:
          throw new Error('Invalid UserSex');
      }
    }
  }