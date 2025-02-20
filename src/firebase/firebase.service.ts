import * as admin from 'firebase-admin';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { DocumentData, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { FieldParams } from './dto/request-field-params.dto';
import {
  COLLECTION_NAMES,
  FIREBASE_ERROR_MESSAGES,
  LOCAL_RETURN_QUERY_TYPES,
} from 'src/constants/firebase.constants';
import { PaginationQueryDTO } from './dto/pagination-query.dto';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private static isInitialized = false;

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (!FirebaseService.isInitialized) {
      if (!admin.apps.length) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const serviceAccount = require('../../firebase-admin.json');
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }
      FirebaseService.isInitialized = true;
    }
  }

  //get all users
  async getAllUsers(fieldParams: FieldParams[]) {
    const users = await this.getUsersByQuery(fieldParams);
    return users;
  }

  // Updating username. First check if it's available or not. Then updating the username and usernameChangedDate to current date.
  async updateUsername(authId: string, username: string) {
    //first check its available or not
    const fetchResponse = await this.getSingleResponseByQuery({
      field: 'username',
      operator: '==',
      value: username,
    });
    //todo responselarda isSucces kullanılmış.
    // if username is not available, throw error, MULTIPLE_RECORDS means there are multiple users with the same username. NOT_FOUND means username is available. SUCCESS means username is available.
    if (fetchResponse.type !== LOCAL_RETURN_QUERY_TYPES.NOT_FOUND) {
      throw new HttpException(
        {
          message: FIREBASE_ERROR_MESSAGES.USERNAME_ALREADY_EXISTS,
          cause: `Username: ${username} is already taken`,
          isSucces: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await admin
        .firestore()
        .collection(COLLECTION_NAMES.USERS_COLLECTION)
        .doc(authId)
        .update({
          username,
          usernameChangedDate: FieldValue.serverTimestamp(),
        });

      await admin
        .firestore()
        .collection(COLLECTION_NAMES.USER_PREVIEWS_COLLECTION)
        .doc(authId)
        .update({ username });

      //Check multiple

      const fetchDuplicates = await this.getSingleResponseByQuery({
        field: 'username',
        operator: '==',
        value: username,
      });

      const isDuplicate =
        fetchDuplicates.type === LOCAL_RETURN_QUERY_TYPES.MULTIPLE_RECORDS;

      if (isDuplicate) {
        await admin
          .firestore()
          .collection(COLLECTION_NAMES.USERS_COLLECTION)
          .doc(authId)
          .update({
            username: null,
            usernameChangedDate: null,
          });

        await admin
          .firestore()
          .collection(COLLECTION_NAMES.USER_PREVIEWS_COLLECTION)
          .doc(authId)
          .update({
            username: null,
          });

        throw new HttpException(
          {
            message: FIREBASE_ERROR_MESSAGES.USERNAME_ALREADY_EXISTS,
            cause: `Username: ${username} is already taken`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        isSucces: !isDuplicate,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: FIREBASE_ERROR_MESSAGES.UNEXPECTED_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserInUserPreviewsCollection<T>(
    authId: string,
    userData: Partial<T>,
  ) {
    // const userDoc = await this.getUserByAuthId(authId);

    const dataNew = JSON.parse(JSON.stringify(userData));
    try {
      await admin
        .firestore()
        .collection(COLLECTION_NAMES.USER_PREVIEWS_COLLECTION)
        .doc(authId)
        .update(dataNew);

      return {
        isSuccess: true,
        data: {
          // ...userDoc,
          ...userData,
        },
      };
    } catch (error) {
      return {
        isSuccess: false,
        error: error.message,
      };
    }
  }

  async updateRealname(authId: string, realname: string) {
    try {
      await admin
        .firestore()
        .collection(COLLECTION_NAMES.USERS_COLLECTION)
        .doc(authId)
        .update({
          realname,
        });

      await admin
        .firestore()
        .collection(COLLECTION_NAMES.USER_PREVIEWS_COLLECTION)
        .doc(authId)
        .update({ realname });

      return {
        isSucces: true,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: FIREBASE_ERROR_MESSAGES.UNEXPECTED_ERROR,
          error: error.message,
          isSucces: false,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserByEmail(email: string): Promise<DocumentData> {
    const usersRef = admin
      .firestore()
      .collection(COLLECTION_NAMES.USERS_COLLECTION);
    const snapshot = await usersRef.where('emailAddress', '==', email).get();
    // const snapshot = undefined;

    if (snapshot.empty) {
      throw new NotFoundException(FIREBASE_ERROR_MESSAGES.USER_NOT_FOUND, {
        cause: `User not found for email: ${email}`,
      });
    }

    return snapshot.docs[0].data();
  }

  // throw error for checking existance of user with given query params
  async getSingleResponseByQuery(
    queryParams: FieldParams,
  ): Promise<{ type: string; data: any }> {
    try {
      const collectionRef = admin
        .firestore()
        .collection(COLLECTION_NAMES.USERS_COLLECTION);

      const snapshot = await collectionRef
        .where(queryParams.field, queryParams.operator, queryParams.value)
        .get();

      if (snapshot.empty) {
        return {
          type: LOCAL_RETURN_QUERY_TYPES.NOT_FOUND,
          data: null,
        };
      }

      //birden fazla kullanıcı varsa
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

  async getUsersByQuery(queryParams: FieldParams[]): Promise<DocumentData[]> {
    try {
      const collectionRef = admin
        .firestore()
        .collection(COLLECTION_NAMES.USERS_COLLECTION);

      let query: FirebaseFirestore.Query = collectionRef;
      queryParams.forEach((param) => {
        query = query.where(param.field, param.operator, param.value);
      });

      const snapshot = await query.get();

      if (snapshot.empty) {
        throw new NotFoundException(FIREBASE_ERROR_MESSAGES.USER_NOT_FOUND, {
          cause: `${FIREBASE_ERROR_MESSAGES.USER_NOT_FOUND} for ${queryParams
            .map((param) => `${param.field}: ${param.value}`)
            .join(', ')}`,
        });
      }

      return snapshot.docs.map((doc) => this.convertTimestamps(doc.data()));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: FIREBASE_ERROR_MESSAGES.UNEXPECTED_ERROR,
        error: error.message,
      });
    }
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
          data: snapshot.docs.map((doc) => doc.data()),
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

  async getResponseByDocKey(collectionName: string, documentKey: string) {
    try {
      const documentRef = admin.firestore().collection(collectionName);

      if (!documentRef) {
        throw new Error(
          `Document Ref with key "${documentKey}" not found in collection "${collectionName}".`,
        );
      }

      return {
        type: LOCAL_RETURN_QUERY_TYPES.SINGLE_RECORD,
        data: documentRef.doc(documentKey),
      };
    } catch (error) {
      throw new Error(`Error fetching document: ${error.message}`);
    }
  }

  async getFromFirestore(collectionName: string, fieldParams?: FieldParams[]) {
    const types = await this.getResponseByQuery(collectionName, fieldParams);
    if (!types) {
      throw new NotFoundException('types response not found');
    }

    if (types.type !== LOCAL_RETURN_QUERY_TYPES.SINGLE_RECORD) {
      throw new NotFoundException(
        types.type === LOCAL_RETURN_QUERY_TYPES.NOT_FOUND
          ? FIREBASE_ERROR_MESSAGES.USER_NOT_FOUND
          : FIREBASE_ERROR_MESSAGES.MULTIPLE_USERS,
      );
    }
    const firebaseResponse = types.data;
    if (!firebaseResponse) {
      throw new NotFoundException('firebase response not found');
    }
    const response = firebaseResponse.data();
    if (!response) {
      throw new NotFoundException('response not found');
    }
    return { firebaseResponse, response };
  }

  public async getUserFromFirestoreById(authId: string) {
    return await this.getFromFirestore(COLLECTION_NAMES.USERS_COLLECTION, [
      {
        field: 'authId',
        operator: '==',
        value: authId,
      },
    ]);
  }

  public async getUserPreviewFromFirestoreById(authId: string) {
    const { firebaseResponse, response } = await this.getFromFirestore(
      COLLECTION_NAMES.USER_PREVIEWS_COLLECTION,
      [
        {
          field: 'authId',
          operator: '==',
          value: authId,
        },
      ],
    );
    return {
      previewFirebaseResponse: firebaseResponse,
      previewResponse: response,
    };
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

  private convertTimestampsToISO<T>(data: T): T {
    if (Array.isArray(data)) {
      return data.map((item) =>
        this.convertTimestampsToISO(item),
      ) as unknown as T;
    } else if (data && typeof data === 'object') {
      const transformedObject: any = {};
      for (const key in data) {
        if (data[key] instanceof Timestamp) {
          transformedObject[key] = data[key].toDate().toISOString();
        } else if (typeof data[key] === 'object') {
          transformedObject[key] = this.convertTimestampsToISO(data[key]);
        } else {
          transformedObject[key] = data[key];
        }
      }
      return transformedObject as T;
    }
    return data;
  }

  private isFirestoreTimestamp(
    obj: any,
  ): obj is { seconds: number; nanoseconds: number } {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.seconds === 'number' &&
      typeof obj.nanoseconds === 'number'
    );
  }

  private convertTimestamps<T>(data: T): T {
    if (Array.isArray(data)) {
      return data.map((item) => this.convertTimestamps(item)) as T;
    }

    if (typeof data === 'object' && data !== null) {
      return Object.keys(data).reduce((acc, key) => {
        const value = data[key];

        if (this.isFirestoreTimestamp(value)) {
          acc[key] = new Timestamp(value.seconds, value.nanoseconds)
            .toDate()
            .toISOString();
        } else if (typeof value === 'object') {
          acc[key] = this.convertTimestamps(value); // İç içe objeleri de dönüştür
        } else {
          acc[key] = value;
        }

        return acc;
      }, {} as any);
    }

    return data;
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
    const filePath = `events/${id}/${fieldName}.${fileExtension}`;

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
