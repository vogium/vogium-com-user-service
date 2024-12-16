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
import { DocumentData } from 'firebase/firestore';
import { updateUserRequestDTO } from 'src/user/dto/request/update-user-request.dto';
import { FieldParams } from './dto/request-field-params.dto';
import {
  COLLECTION_NAME,
  FIREBASE_ERROR_MESSAGES,
} from 'src/contants/firebase.constants';

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

  async updateUser(authId: string, userData: Partial<updateUserRequestDTO>) {
    const userDoc = await this.getUserByAuthId(authId);

    const dataNew = JSON.parse(JSON.stringify(userData));
    try {
      await admin
        .firestore()
        .collection(COLLECTION_NAME)
        .doc(userDoc.authId)
        .update(dataNew);

      return {
        ...userDoc,
        ...userData,
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

  async getUserByEmail(email: string): Promise<DocumentData> {
    const usersRef = admin.firestore().collection(COLLECTION_NAME);
    const snapshot = await usersRef.where('emailAddress', '==', email).get();

    if (snapshot.empty) {
      throw new NotFoundException(FIREBASE_ERROR_MESSAGES.USER_NOT_FOUND, {
        cause: `User not found for email: ${email}`,
      });
    }

    return snapshot.docs[0].data();
  }

  async getUserByQuery(queryParams: FieldParams): Promise<DocumentData> {
    try {
      const collectionRef = admin.firestore().collection(COLLECTION_NAME);

      const snapshot = await collectionRef
        .where(queryParams.field, queryParams.operator, queryParams.value)
        .get();

      if (snapshot.empty) {
        throw new NotFoundException(FIREBASE_ERROR_MESSAGES.USER_NOT_FOUND, {
          cause: `${FIREBASE_ERROR_MESSAGES.USER_NOT_FOUND} for ${queryParams.field}: ${queryParams.value}`,
        });
      }

      //birden fazla kullanıcı varsa
      if (snapshot.docs.length > 1) {
        throw new InternalServerErrorException(
          FIREBASE_ERROR_MESSAGES.MULTIPLE_USERS,
        );
      }

      return snapshot.docs[0].data();
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

  async getUsersByQuery(queryParams: FieldParams[]): Promise<DocumentData[]> {
    try {
      const collectionRef = admin.firestore().collection(COLLECTION_NAME);

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

  async getUserByAuthId(authId: string): Promise<DocumentData> {
    const user = this.getUserByQuery({
      field: 'authId',
      operator: '==',
      value: authId,
    });

    return user;
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
}
