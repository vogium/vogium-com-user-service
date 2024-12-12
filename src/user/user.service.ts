import { Injectable } from "@nestjs/common";
import { FirebaseService } from "src/firebase/firebase.service";
import { getUserByEmailRequestDTO } from "./dto/request/get-user-by-email-request.dto";
import { UserDTO } from "./dto/user.dto";
import { UtilService } from "src/util/util.service";


@Injectable()
export class UserService{
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly utilService: UtilService
    ){}

    public async getUserByEmail(request: getUserByEmailRequestDTO): Promise<UserDTO>{
        const firebaseResponse = await this.firebaseService.getUserByEmail(request.email);
        return await this.utilService.mapToDto(firebaseResponse, UserDTO)
    }
}