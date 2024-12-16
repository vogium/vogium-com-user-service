import * as admin from 'firebase-admin';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { DocumentData, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { FieldParams } from './dto/request-field-params.dto';
import {
  COLLECTION_NAMES,
  FIREBASE_ERROR_MESSAGES,
} from 'src/contants/firebase.constants';

const LOCAL_RETURN_QUERY = {
  TYPES: {
    MULTIPLE_RECORDS: 'multiple',
    SINGLE_RECORD: 'single',
    NOT_FOUND: 'empty',
  },
};

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

  async updateUserInUsersCollection<T>(authId: string, userData: Partial<T>) {
    console.log(
      'updateUserInUsersCollection',
      'authId',
      authId,
      'userData',
      userData,
    );
    const userDoc = await this.getUserByAuthId(authId);

    const dataNew = JSON.parse(JSON.stringify(userData));
    try {
      await admin
        .firestore()
        .collection(COLLECTION_NAMES.USERS_COLLECTION)
        .doc(userDoc.authId)
        .update(dataNew);

      return {
        isSuccess: true,
        data: {
          ...userDoc,
          ...userData,
        },
      };
    } catch (error) {
      return {
        isSuccess: false,
      };
    }
  }

  // Updating username. First check if it's available or not. Then updating the username and usernameChangedDate to current date.
  async updateSetUsername(authId: string, username: string) {
    //first check its available or not
    const fetchResponse = await this.getUserByQuery(
      {
        field: 'username',
        operator: '==',
        value: username,
      },
      false,
      false,
    );
    //todo responselarda isSucces kullanılmış.
    // if username is not available, throw error, MULTIPLE_RECORDS means there are multiple users with the same username. NOT_FOUND means username is available. SUCCESS means username is available.
    if (fetchResponse.type !== LOCAL_RETURN_QUERY.TYPES.NOT_FOUND) {
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
          realname: username,

          // usernameChangedDate: FieldValue.serverTimestamp(),
          usernameChangedDate: Timestamp.now(),
        });

      await admin
        .firestore()
        .collection(COLLECTION_NAMES.USER_PREVIEWS_COLLECTION)
        .doc(authId)
        .update({ username, realname: username });

      //Check multiple

      const fetchDuplicates = await this.getUserByQuery(
        {
          field: 'username',
          operator: '==',
          value: username,
        },
        false,
        false,
      );

      const isDuplicate =
        fetchDuplicates.type === LOCAL_RETURN_QUERY.TYPES.MULTIPLE_RECORDS;

      if (isDuplicate) {
        await admin
          .firestore()
          .collection(COLLECTION_NAMES.USERS_COLLECTION)
          .doc(authId)
          .update({
            username: null,
            realname: null,
            usernameChangedDate: null,
          });

        await admin
          .firestore()
          .collection(COLLECTION_NAMES.USER_PREVIEWS_COLLECTION)
          .doc(authId)
          .update({
            username: null,
            realname: null,
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
      console.log('error', error);
      throw new HttpException(
        {
          message: FIREBASE_ERROR_MESSAGES.UNEXPECTED_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Updating username. First check if it's available or not. Then updating the username and usernameChangedDate to current date.
  async updateUsername(authId: string, username: string) {
    //first check its available or not
    const fetchResponse = await this.getUserByQuery(
      {
        field: 'username',
        operator: '==',
        value: username,
      },
      false,
      false,
    );
    //todo responselarda isSucces kullanılmış.
    // if username is not available, throw error, MULTIPLE_RECORDS means there are multiple users with the same username. NOT_FOUND means username is available. SUCCESS means username is available.
    if (fetchResponse.type !== LOCAL_RETURN_QUERY.TYPES.NOT_FOUND) {
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

      const fetchDuplicates = await this.getUserByQuery(
        {
          field: 'username',
          operator: '==',
          value: username,
        },
        false,
        false,
      );

      const isDuplicate =
        fetchDuplicates.type === LOCAL_RETURN_QUERY.TYPES.MULTIPLE_RECORDS;

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
      console.log('error', error);
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
    const userDoc = await this.getUserByAuthId(authId);

    const dataNew = JSON.parse(JSON.stringify(userData));
    try {
      await admin
        .firestore()
        .collection(COLLECTION_NAMES.USER_PREVIEWS_COLLECTION)
        .doc(userDoc.authId)
        .update(dataNew);

      return {
        isSuccess: true,
        data: {
          ...userDoc,
          ...userData,
        },
      };
    } catch (error) {
      return {
        isSuccess: false,
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

  // async updateSingleFieldInUserCollection<T>({
  //   authId,
  //   fieldName,
  //   fieldValue,
  // }: {
  //   authId: string;
  //   fieldName: string;
  //   fieldValue: any;
  // }) {
  //   try {
  //     await admin
  //       .firestore()
  //       .collection(COLLECTION_NAMES.USERS_COLLECTION)
  //       .doc(authId)
  //       .update({
  //         [fieldName]: fieldValue,
  //       });

  //     return {
  //       isSucces: true,
  //     };
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         message: FIREBASE_ERROR_MESSAGES.UNEXPECTED_ERROR,
  //         error: error.message,
  //         isSucces: false,
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async getUserByEmail(email: string): Promise<DocumentData> {
    const usersRef = admin
      .firestore()
      .collection(COLLECTION_NAMES.USERS_COLLECTION);
    const snapshot = await usersRef.where('emailAddress', '==', email).get();

    if (snapshot.empty) {
      throw new NotFoundException(FIREBASE_ERROR_MESSAGES.USER_NOT_FOUND, {
        cause: `User not found for email: ${email}`,
      });
    }

    return snapshot.docs[0].data();
  }

  // throw error for checking existance of user with given query params
  async getUserByQuery(
    queryParams: FieldParams,
    throwErrorOnEmpty = true,
    throwErrorOnMultiple = true,
  ): Promise<{ type: string; data: DocumentData | DocumentData[] }> {
    try {
      const collectionRef = admin
        .firestore()
        .collection(COLLECTION_NAMES.USERS_COLLECTION);

      const snapshot = await collectionRef
        .where(queryParams.field, queryParams.operator, queryParams.value)
        .get();

      if (snapshot.empty) {
        if (!throwErrorOnEmpty) {
          return {
            type: LOCAL_RETURN_QUERY.TYPES.NOT_FOUND,
            data: null,
          };
        }

        throw new NotFoundException(FIREBASE_ERROR_MESSAGES.USER_NOT_FOUND, {
          cause: `${FIREBASE_ERROR_MESSAGES.USER_NOT_FOUND} for ${queryParams.field}: ${queryParams.value}`,
        });
      }

      //birden fazla kullanıcı varsa
      if (snapshot.docs.length > 1) {
        if (!throwErrorOnMultiple) {
          return {
            type: LOCAL_RETURN_QUERY.TYPES.MULTIPLE_RECORDS,
            data: snapshot.docs,
          };
        }
        throw new InternalServerErrorException(
          FIREBASE_ERROR_MESSAGES.MULTIPLE_USERS,
        );
      }

      return {
        type: LOCAL_RETURN_QUERY.TYPES.SINGLE_RECORD,
        data: snapshot.docs[0].data(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: FIREBASE_ERROR_MESSAGES.UNEXPECTED_ERROR,
        error: error.message,
        stack: error.toString(),
      });
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

      console.log('query', queryParams);
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

  async getUserByAuthId(authId: string): Promise<DocumentData> {
    const fetchReponse = await this.getUserByQuery({
      field: 'authId',
      operator: '==',
      value: authId,
    });

    return fetchReponse.data;
  }

  async getFirebaseUserByEmail(email: string) {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      return userRecord;
    } catch (error) {
      throw new Error(FIREBASE_ERROR_MESSAGES.USER_NOT_FOUND);
    }
  }

  async verifyIdToken(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException(FIREBASE_ERROR_MESSAGES.UNAUTHORIZED);
    }
  }

  async getUserPreviewCollection(): Promise<
    FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
  > {
    const userPreviewCollection = admin
      .firestore()
      .collection(COLLECTION_NAMES.USER_PREVIEWS_COLLECTION);
    return userPreviewCollection;
  }

  async updatePreview(
    previewId: string,
    previewData: Partial<DocumentData>,
  ): Promise<DocumentData> {
    try {
      const userPreviewCollection = await this.getUserPreviewCollection();
      userPreviewCollection.doc(previewId).update(previewData);

      return {
        id: previewId,
        ...previewData,
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
}
