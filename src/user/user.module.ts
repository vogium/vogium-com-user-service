import { Module } from "@nestjs/common";
import { FirebaseModule } from "src/firebase/firebase.module";
import { FirebaseService } from "src/firebase/firebase.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UtilService } from "src/util/util.service";

@Module({
    imports: [FirebaseModule],
    controllers: [UserController],
    providers: [UserService, FirebaseService, UtilService],
  })
  export class UserModule {}