import * as admin from 'firebase-admin';
import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDTO } from 'src/user/dto/user.dto';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly apiKey: string;
  onModuleInit() {
    if (!admin.apps.length) {
      const serviceAccount = require('../../firebase-admin.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  async getUserByEmail(email: string) {
    const usersRef = admin.firestore().collection('users');
    const snapshot = await usersRef.where('emailAddress', '==', email).get();
    if (snapshot.empty) {
      throw new Error('Kullanıcı bulunamadı');
    }

    return snapshot.docs[0].data();
  }

  async getFirebaseUserByEmail(email: string) {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      return userRecord;
    } catch (error) {
      throw new Error('Firebase user not found');
    }
  }

  async verifyIdToken(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new Error('Unauthorized: ' + error.message);
    }
  }
}

//deneme
