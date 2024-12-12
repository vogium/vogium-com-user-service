import { instanceToInstance } from "class-transformer";
import { Timestamp } from "firebase/firestore";

export class UtilService {
    async mapToDto<T extends object>(response: any, dtoClass: new () => T): Promise<T> {
        const dtoInstance = new dtoClass();
        const dtoKeys = Object.keys(dtoInstance);

        const mappedObject: Partial<T> = {};

        dtoKeys.forEach((key) => {
            if (response.hasOwnProperty(key)) {
                let value = response[key];

                // Firestore Timestamp'ı string veya Date'e dönüştür
                if (value instanceof Timestamp) {
                    value = value.toDate().toISOString(); // ISO formatında string'e çeviriyoruz
                } else if (
                    typeof value === "object" &&
                    value?._seconds !== undefined &&
                    value?._nanoseconds !== undefined
                ) {
                    // Eğer gelen veri doğrudan Firestore Timestamp objesi ise
                    const date = new Date(value._seconds * 1000 + value._nanoseconds / 1e6);
                    value = date.toISOString(); // ISO formatına çevir
                }

                mappedObject[key as keyof T] = value;
            }
        });

        return mappedObject as T;
    }
}
