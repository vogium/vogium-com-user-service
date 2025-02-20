import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ModeratorModule } from './moderator/moderator.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, ModeratorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
