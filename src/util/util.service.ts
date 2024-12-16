import { plainToInstance } from 'class-transformer';
import { Timestamp } from 'firebase/firestore';

export class UtilService {
  async mapToDto<T extends object>(
    response: any,
    dtoClass: new () => T,
  ): Promise<T> {
    console.log('response', response);

    //traverse in each response key check typescript type is it Timestamp or not
    //if it is Timestamp convert it to Date object
    //then return mapped object
    const jsonParsed = JSON.parse(JSON.stringify(response));

    const result = await plainToInstance(dtoClass, jsonParsed, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });

    return result as T;

    // const dtoInstance = new dtoClass();
    // const dtoKeys = Object.keys(dtoInstance);

    // const mappedObject: Partial<T> = {};

    // dtoKeys.forEach((key) => {
    //   if (response.hasOwnProperty(key)) {
    //     let value = response[key];

    //     // Firestore Timestamp'ı string veya Date'e dönüştür
    //     if (value instanceof Timestamp) {
    //       value = value.toDate().toISOString(); // ISO formatında string'e çeviriyoruz
    //     } else if (
    //       typeof value === 'object' &&
    //       value?._seconds !== undefined &&
    //       value?._nanoseconds !== undefined
    //     ) {
    //       // Eğer gelen veri doğrudan Firestore Timestamp objesi ise
    //       const date = new Date(
    //         value._seconds * 1000 + value._nanoseconds / 1e6,
    //       );
    //       value = date.toISOString(); // ISO formatına çevir
    //     }

    //     mappedObject[key as keyof T] = value;
    //   }
    // });

    // return mappedObject as T;
  }

  //multi transform
  async mapToDtoArray<T extends object>(
    data: any[],
    dtoClass: new () => T,
  ): Promise<T[]> {
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
