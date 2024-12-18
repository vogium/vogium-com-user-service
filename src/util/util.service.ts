import { plainToInstance } from 'class-transformer';

export class UtilService {
  async mapToDto<T extends object>(response: any, dtoClass: any): Promise<T> {
    const jsonParsed = JSON.parse(JSON.stringify(response));

    const result = plainToInstance(dtoClass, jsonParsed, {
      //todo implicit converstion Timestamp için sıkıntılı...
      enableImplicitConversion: false,
      excludeExtraneousValues: true,
      strategy: 'exposeAll',
    });

    return result as T;
  }

  //multi transform
  async mapToDtoArray<T extends object>(
    data: any[],
    dtoClass: new () => T,
  ): Promise<any[]> {
    return Promise.all(data.map((item) => this.mapToDto(item, dtoClass)));

    // return data.map( (item) => {
    //   // Convert Firestore timestamps to Date objects
    //   // const transformed = Object.entries(item).reduce((acc, [key, value]) => {
    //   //   if (value instanceof Timestamp) {
    //   //     acc[key] = value.toDate();
    //   //   } else {
    //   //     acc[key] = value;
    //   //   }
    //   //   return acc;
    //   // }, {});
    //   // return plainToInstance(dtoClass, transformed, {
    //   //   enableImplicitConversion: true,
    //   //   excludeExtraneousValues: true,
    //   // });
    //   return  this.mapToDto(item, dtoClass);
    // });
  }
}
