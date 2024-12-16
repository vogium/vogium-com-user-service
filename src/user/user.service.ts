import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { getUserByEmailRequestDTO } from './dto/request/get-user-by-email-request.dto';
import { UserDTO } from './dto/user.dto';
import { UtilService } from 'src/util/util.service';
import { FieldParams } from 'src/firebase/dto/request-field-params.dto';
import { getAllUsersResponseDTO } from './dto/response/get-all-users-response.dto';
import { updateUserRequestDTO } from './dto/request/update-user-request.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly utilService: UtilService,
  ) {}

  public async getUserByEmail(
    request: getUserByEmailRequestDTO,
  ): Promise<UserDTO> {
    const firebaseResponse = await this.firebaseService.getUserByEmail(
      request.email,
    );
    return await this.utilService.mapToDto(firebaseResponse, UserDTO);
    // return firebaseResponse as UserDTO;
  }

  public async getAllUsers(
    fieldParams: FieldParams[],
  ): Promise<getAllUsersResponseDTO[]> {
    const firebaseResponse =
      await this.firebaseService.getAllUsers(fieldParams);

    return await this.utilService.mapToDtoArray<getAllUsersResponseDTO>(
      firebaseResponse,
      getAllUsersResponseDTO,
    );
  }

  public async updateUser(
    authId: string,
    userData: Partial<updateUserRequestDTO>,
  ) {
    const firebaseResponse = await this.firebaseService.updateUser(
      authId,
      userData,
    );
    return firebaseResponse;
  }
}
