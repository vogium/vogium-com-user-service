import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { getUserByEmailRequestDTO } from './dto/request/get-user-by-email-request.dto';
import { UserDTO } from './dto/user.dto';
import { UtilService } from 'src/util/util.service';
import { FieldParams } from 'src/firebase/dto/request-field-params.dto';
import { getAllUsersResponseDTO } from './dto/response/get-all-users-response.dto';
import { updateUserRequestDTO } from './dto/request/update-user-request.dto';
import { UpdateUserFrozenRequestDTO } from './dto/request/update-user-frozen-request.dto';
import { DocumentData, FieldValue } from 'firebase-admin/firestore';
import { UpdateUserAboutDto } from './dto/request/update-user-about-dto';
import { UpdateUserAvatarUrlRequestDTO } from './dto/request/update-user-avatar-url-request.dto';
import { AccountType } from 'src/enum/account-type.enum';
import { AccountStatus } from 'src/enum/account-status.enum';
import { LOCAL_RETURN_QUERY_TYPES, FIREBASE_ERROR_MESSAGES } from 'src/constants/firebase.constants';
import { UpdateUserEmailRequestDTO } from './dto/request/update-user-email-request.dto';
import { UpdateUserGenderRequestDTO } from './dto/request/update-user-gender-request.dto';
import { UpdateUserIsAccountVerifiedRequestDTO } from './dto/request/update-user-is-account-verified-request-dto';
import { access } from 'fs';

@Injectable()
export class UserService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly utilService: UtilService,
  ) {}

  public async getUserByEmail(
    request: getUserByEmailRequestDTO,
  ): Promise<UserDTO> {
    const firebaseResponse = (await this.firebaseService.getUserByEmail(
      request.email,
    )) as UserDTO;
    // return await this.utilService.mapToDto(firebaseResponse, UserDTO);
    return firebaseResponse as UserDTO;
  }
  

  public async getAllUsers(
    fieldParams: FieldParams[],
  ): Promise<getAllUsersResponseDTO[]> {
    const firebaseResponse =
      await this.firebaseService.getAllUsers(fieldParams);

    return firebaseResponse as getAllUsersResponseDTO[];

    // return await this.utilService.mapToDtoArray<getAllUsersResponseDTO>(
    //   firebaseResponse,
    //   getAllUsersResponseDTO,
    // );
  }

  public async updateUser(
    authId: string,
    userData: Partial<updateUserRequestDTO>,
  ) {
    const firebaseResponse =
      await this.firebaseService.updateUserInUsersCollection<updateUserRequestDTO>(
        authId,
        userData,
      );

    return firebaseResponse;
  }

  public async updateSetUsername(authId: string, username: string) {
    const firebaseResponse = await this.firebaseService.updateSetUsername(
      authId,
      username,
    );
    return firebaseResponse;
  }

  public async updateUsername(authId: string, username: string) {
    const firebaseResponse = await this.firebaseService.updateUsername(
      authId,
      username,
    );
    return firebaseResponse;
  }

  public async updateRealname(authId: string, realname: string) {
    const firebaseResponse = await this.firebaseService.updateRealname(
      authId,
      realname,
    );
    return firebaseResponse;
  }

  // accountType is an integer, therefore need to a key value pair
  public async updateAccountType(authId: string, accountType: AccountType) {
    const firebaseResponse =
      await this.firebaseService.updateUserInUsersCollection<AccountType>(
        authId,
        { accountType: accountType },
      );
    return firebaseResponse;
  }

  public async updateAccountStatus(
    authId: string,
    accountStatus: AccountStatus,
  ) {
    const firebaseResponse =
      await this.firebaseService.updateUserInUsersCollection<AccountStatus>(
        authId,
        { accountStatus: accountStatus },
      );
    return firebaseResponse;
  }

  public async deactivateUserAccount(
    request: UpdateUserFrozenRequestDTO,
  ): Promise<UserDTO> {
    const {authId, isFrozen} = request;
    const {firebaseResponse, user} = (await this.getUserFromFirestore(authId));
    user.isFrozen = isFrozen;
    user.frozenDate = FieldValue.serverTimestamp();
    return await this.firebaseService.updateField(firebaseResponse, user);
  }


  public async updateUserAbout(
    request: UpdateUserAboutDto,
  ): Promise<UserDTO> {
    const {authId, about} = request;
    const {firebaseResponse, user} = (await this.getUserFromFirestore(authId));
    user.about = about;
    return await this.firebaseService.updateField(firebaseResponse, user);
  }

  public async updateUserAvatar(
    request: UpdateUserAvatarUrlRequestDTO,
  ): Promise<UserDTO> {
    const {authId, avatarUrl} = request;
    const {firebaseResponse, user} = (await this.getUserFromFirestore(authId));
    user.avatarUrl = avatarUrl;
    return await this.firebaseService.updateField(firebaseResponse, user);
  }

  public async updateUserEmail(
    request: UpdateUserEmailRequestDTO,
  ): Promise<UserDTO> {
    const {authId, emailAddress} = request;
    const {firebaseResponse, user} = (await this.getUserFromFirestore(authId));
    user.emailAddress = emailAddress;
    return await this.firebaseService.updateField(firebaseResponse, user);
  }

  public async updateUserGender(
    request: UpdateUserGenderRequestDTO,
  ): Promise<UserDTO> {
    const {authId, sex} = request;
    const {firebaseResponse, user} = (await this.getUserFromFirestore(authId));
    user.sex = sex;
    return await this.firebaseService.updateField(firebaseResponse, user);
  }

  public async verifyUserAccount(
    request: UpdateUserIsAccountVerifiedRequestDTO,
  ): Promise<UserDTO> {
    const {authId, isAccountVerified} = request;
    const {firebaseResponse, user} = (await this.getUserFromFirestore(authId));
    user.isAccountVerified = isAccountVerified;
    
    if(isAccountVerified === true){
    user.accountVerifiedDate = FieldValue.serverTimestamp();
    }
    return await this.firebaseService.updateField(firebaseResponse, user);
  }

  private async getUserFromFirestore(authId: string){
    const types = await this.firebaseService.getUserByQuery(
      {field: 'authId', operator: '==', value: authId}
    );
    if(!types){
      throw new NotFoundException('types response not found');
    }
    if (types.type !== LOCAL_RETURN_QUERY_TYPES.SINGLE_RECORD) {
      throw new NotFoundException(FIREBASE_ERROR_MESSAGES.USER_NOT_FOUND);
    }
    const firebaseResponse = types.data;
    if(!firebaseResponse){
      throw new NotFoundException('firebase response not found');
    }
    const user = firebaseResponse.data();
    if(!user){
      throw new NotFoundException('user not found');
    }
    return {firebaseResponse, user};
  }
}
