import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UtilService } from 'src/util/util.service';
import { ModeratorController } from './moderator.controller';
import { ModeratorService } from './moderator.service';

@Module({
  imports: [FirebaseModule],
  controllers: [ModeratorController],
  providers: [ModeratorService, FirebaseService, UtilService],
})
export class ModeratorModule {}
