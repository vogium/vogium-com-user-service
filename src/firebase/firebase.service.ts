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
    const fetchResponse = await this.getUserByQuery({
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

      const fetchDuplicates = await this.getUserByQuery({
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
  async getUserByQuery(
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

  async updateField(userDoc: DocumentData, userData: any) {
    return await userDoc.ref.update(userData);
  }
}
