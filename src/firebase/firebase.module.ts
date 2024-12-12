import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],  // FirebaseService dışa aktarılıyor
})
export class FirebaseModule {}
