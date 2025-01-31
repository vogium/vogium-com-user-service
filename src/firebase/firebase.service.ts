import * as admin from 'firebase-admin';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { DocumentData, FieldValue } from 'firebase-admin/firestore';
import { FieldParams } from './dto/request-field-params.dto';
import {
  COLLECTION_NAMES,
  FIREBASE_ERROR_MESSAGES,
  LOCAL_RETURN_QUERY_TYPES,
} from 'src/constants/firebase.constants';
import { PaginationQueryDTO } from './dto/pagination-query.dto';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    if (!admin.apps.length) {
      const serviceAccount = require('../../firebase-admin.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
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

      return snapshot.docs.map((doc) => doc.data()) as DocumentData[];
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

  async getUserResponseByQuery(queryParams?: FieldParams[]){
    return await this.getResponseByQuery(COLLECTION_NAMES.USERS_COLLECTION, queryParams);
  }

  async getResponseByQuery(collectionName: string, queryParams?: FieldParams[]): Promise<{ type: string; data: any }> {
    try {
      const collectionRef = admin
        .firestore()
        .collection(collectionName);

      let query: FirebaseFirestore.Query = collectionRef;
      if(queryParams && queryParams[0]){
        queryParams.forEach((param) => {
        query = query.where(param.field, param.operator, param.value);
        })
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
  
  async getResponseByDocKey(collectionName: string, documentKey: string ){
    try {
      const documentRef = admin
        .firestore().collection(collectionName);

      if(!documentRef){
        throw new Error(`Document Ref with key "${documentKey}" not found in collection "${collectionName}".`);
      }

      return {
        type: LOCAL_RETURN_QUERY_TYPES.SINGLE_RECORD,
        data: documentRef.doc(documentKey)
      };

    } catch (error) {
      throw new Error(`Error fetching document: ${error.message}`);
    }
  }

  async getFromFirestore(
    collectionName: string,
    fieldParams?: FieldParams[],
  ) {
    const types = await this.getResponseByQuery(
      collectionName,
      fieldParams,
    );
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
    return {firebaseResponse, response};
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
    const{firebaseResponse, response} = await this.getFromFirestore(COLLECTION_NAMES.USER_PREVIEWS_COLLECTION, [
      {
        field: 'authId',
        operator: '==',
        value: authId,
      },
    ]);
    return {previewFirebaseResponse: firebaseResponse, previewResponse: response};
  }

  public convertDateToTimestamp(date: string){
    const response = new Date(date);
    return admin.firestore.Timestamp.fromDate(response);
  }

  async paginate(collectionName: string, query: PaginationQueryDTO) {
    const { _start = 0, _end = 10, ...filters } = query;
    const collectionRef =  admin.firestore().collection(collectionName);

    let firebaseQuery: FirebaseFirestore.Query = collectionRef;

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value) {
        const parsedValue = this.parseQueryParam(value);
        firebaseQuery = firebaseQuery.where(key, '==', parsedValue)
      }
    });
    
    // Pagination işlemi
    const limit = _end - _start;
    let snapshot = await firebaseQuery.get();
    const totalRecords = snapshot.size;
    firebaseQuery = firebaseQuery.limit(limit).offset(Number(_start));
    snapshot = await firebaseQuery.get();
    const data = snapshot.docs.map(doc => doc.data());

    return {
      data,
      meta: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / (limit)),
        pageSize: limit,
        currentPage: Math.floor(_start / limit) + 1,
      },
    };
  }

  private parseQueryParam(param: string | undefined): boolean | number | string | undefined {
    if (param === undefined) return undefined;
  
    // Boolean dönüşümü
    if (param === 'true' || param === 'false') {
      return param === 'true';
    }
  
    // Number dönüşümü
    if (!isNaN(Number(param))) {
      return Number(param);
    }
  
    // String olarak bırak
    return param;
  }
}
