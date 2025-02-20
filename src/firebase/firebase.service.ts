import * as admin from 'firebase-admin';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { FieldParams } from './dto/request-field-params.dto';
import { instanceToPlain } from 'class-transformer';
import { PaginationQueryDTO } from './dto/pagination-query.dto';
import {
  COLLECTION_NAMES,
  LOCAL_RETURN_QUERY_TYPES,
} from 'src/constants/firebase.constants';
import { DocumentReference } from 'firebase-admin/firestore';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private bucket!: admin.storage.Storage;

  async onModuleInit() {
    if (!admin.apps.length) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const serviceAccount = require('../../firebase-admin.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'vogium.appspot.com', // Bucket adını ekliyoruz
      });
    }

    this.bucket = admin.storage();
  }
  async getUserResponseByQuery(queryParams?: FieldParams[]) {
    return await this.getResponseByQuery(
      COLLECTION_NAMES.USERS_COLLECTION,
      queryParams,
    );
  }

  async getResponseByQuery(
    collectionName: string,
    queryParams?: FieldParams[],
  ): Promise<{ type: string; data: any }> {
    try {
      const collectionRef = admin.firestore().collection(collectionName);

      let query: FirebaseFirestore.Query = collectionRef;
      if (queryParams && queryParams[0]) {
        queryParams.forEach((param) => {
          query = query.where(param.field, param.operator, param.value);
        });
      }
      const snapshot = await query.get();
      if (snapshot.empty) {
        return {
          type: LOCAL_RETURN_QUERY_TYPES.NOT_FOUND,
          data: null,
        };
      }

      if (snapshot.docs.length > 1) {
        return {
          type: LOCAL_RETURN_QUERY_TYPES.MULTIPLE_RECORDS,
          data: snapshot.docs,
        };
      }

      return {
        type: LOCAL_RETURN_QUERY_TYPES.SINGLE_RECORD,
        data: snapshot.docs[0],
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // if (error instanceof HttpException) {
      //   throw error;
      // }
      // throw new InternalServerErrorException({
      //   message: FIREBASE_ERROR_MESSAGES.UNEXPECTED_ERROR,
      //   error: error.message,
      //   stack: error.toString(),
      // });
    }
  }

  async getUserFromFirestore(fieldParams?: FieldParams[]) {
    return await this.getFromFirestore(
      COLLECTION_NAMES.USERS_COLLECTION,
      fieldParams,
    );
  }

  async getUserPreviewFromFirestore(fieldParams?: FieldParams[]) {
    return await this.getFromFirestore(
      COLLECTION_NAMES.USER_PREVIEWS_COLLECTION,
      fieldParams,
    );
  }

  async getModeratorFromFirestore(fieldParams?: FieldParams[]) {
    return await this.getFromFirestore(
      COLLECTION_NAMES.USERS_COLLECTION,
      fieldParams,
    );
  }

  async getFromFirestore(collectionName: string, fieldParams?: FieldParams[]) {
    const types = await this.getResponseByQuery(collectionName, fieldParams);
    if (!types) {
      throw new NotFoundException('types response not found');
    }
    const firebaseResponse = types.data;

    if (types.type === LOCAL_RETURN_QUERY_TYPES.MULTIPLE_RECORDS) {
      const response = firebaseResponse.map((doc: { data: () => any }) =>
        doc.data(),
      );

      return { firebaseResponse, response };
    }

    if (!firebaseResponse) {
      throw new NotFoundException('firebase response not found');
    }
    const response = firebaseResponse.data();
    if (!response) {
      throw new NotFoundException('response not found');
    }
    return { firebaseResponse, response };
  }

  public getRef() {
    const ref = admin
      .firestore()
      .collection(COLLECTION_NAMES.USERS_COLLECTION)
      .doc();
    return ref;
  }

  public async createOnFirestore<T>(
    collectionName: string,
    request: T,
    ref?: DocumentReference,
  ) {
    try {
      let docRef: DocumentReference;
      if (ref) {
        docRef = ref;
      } else {
        docRef = admin.firestore().collection(collectionName).doc();
      }

      const requestData = instanceToPlain(request);

      const data = { ...requestData, id: docRef.id };

      await docRef.set(data);
      return docRef.id;
    } catch (error) {
      throw new Error(`Error creating in ${collectionName}: ${error.message}`);
    }
  }

  public convertDateToTimestamp(date: string) {
    const response = new Date(date);
    return admin.firestore.Timestamp.fromDate(response);
  }

  async paginate(collectionName: string, query: PaginationQueryDTO) {
    const { start = 0, end = 10, sort, order, filters } = query;

    const collectionRef = admin.firestore().collection(collectionName);

    let firebaseQuery: FirebaseFirestore.Query = collectionRef;

    if (filters && filters.length > 0) {
      Object.keys(filters).forEach((key) => {
        const filter = filters[key];

        if (filter) {
          firebaseQuery = firebaseQuery.where(
            filter.field,
            filter.operator,
            filter.value,
          );
        }
      });
    }

    // Pagination işlemi
    const limit = end - start;
    let snapshot = await firebaseQuery.get();

    const totalRecords = snapshot.size;
    firebaseQuery = firebaseQuery.limit(limit).offset(Number(start));

    if (sort && order && sort !== '')
      firebaseQuery = firebaseQuery.orderBy(sort, order);

    snapshot = await firebaseQuery.get();

    const data = snapshot.docs.map((doc) => doc.data());

    return {
      data,
      meta: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        pageSize: limit,
        currentPage: Math.floor(start / limit) + 1,
      },
    };
  }

  public async uploadFileFromBase64(
    fieldName: string,
    base64String: string,
    id: string,
  ): Promise<string> {
    // Eğer base64 string bir URL ise, direk olarak geri dönüyoruz
    if (
      base64String.startsWith('http://') ||
      base64String.startsWith('https://')
    ) {
      return base64String;
    }

    // Base64 string'den mime type ve veri kısmını ayıklıyoruz
    const matches = base64String.match(/^data:(.+);base64,(.*)$/);
    if (!matches) {
      throw new Error('Geçersiz base64 string formatı');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    // Dosya uzantısını belirliyoruz
    const fileExtension = mimeType.split('/')[1];

    // Dosyanın yükleneceği yolu belirliyoruz
    const filePath = `users/${id}/${fieldName}.${fileExtension}`;

    // Base64 verisini binary formatına çeviriyoruz
    const buffer = Buffer.from(base64Data, 'base64');

    // Firebase Storage'a dosya yüklemek için dosya referansını alıyoruz
    const fileUpload = admin
      .storage()
      .bucket('vogium.appspot.com')
      .file(filePath);

    console.log(
      fileUpload.baseUrl,
      fileUpload.cloudStorageURI,
      fileUpload.bucket,
    );
    try {
      // Dosyayı yükleme işlemi
      await fileUpload.save(buffer, {
        metadata: {
          contentType: mimeType, // Dosyanın MIME tipini belirtiyoruz
        },
        public: true, // Dosyanın herkese açık olmasını sağlıyoruz
      });

      // Dosya yolu için encode işlemi
      const encodedFilePath = encodeURIComponent(filePath);

      // Yüklenen dosyanın URL'sini oluşturuyoruz
      const fileUrl = `https://firebasestorage.googleapis.com/v0/b/vogium.appspot.com/o/${encodedFilePath}?alt=media&token=${fileUpload.metadata?.generation}`;

      // URL'yi geri döndürüyoruz
      return fileUrl;
    } catch (error) {
      // Hata durumunda, hatayı logluyoruz ve yeniden fırlatıyoruz
      console.error('File upload error: ', error);
      throw new Error(`Dosya yükleme hatası: ${error.message}`);
    }
  }
}
