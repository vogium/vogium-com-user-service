import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { getUserByEmailRequestDTO } from './dto/request/get-user-by-email-request.dto';
import { UserDTO } from './dto/user.dto';
import { UtilService } from 'src/util/util.service';
import { FieldParams } from 'src/firebase/dto/request-field-params.dto';
import { getAllUsersResponseDTO } from './dto/response/get-all-users-response.dto';
import { UpdateUserFrozenRequestDTO } from './dto/request/update-user-frozen-request.dto';
import { DocumentData, FieldValue } from 'firebase-admin/firestore';
import { UpdateUserAboutDto } from './dto/request/update-user-about-dto';
import { UpdateUserAvatarUrlRequestDTO } from './dto/request/update-user-avatar-url-request.dto';
import { AccountType } from 'src/enum/account-type.enum';
import { UpdateUserStatusRequestDTO } from './dto/request/update-user-user-status-request.dto';
import { UpdateUserTypeRequestDTO } from './dto/request/update-user-user-type-request.dto';
import { UpdateUserAccountStatusRequestDTO } from './dto/request/update-user-account-status-request.dto';
import { UpdateUserAccountTypeRequestDTO } from './dto/request/update-user-account-type-request.dto';
import { UpdateUserRealnameRequestDTO } from './dto/request/update-user-realname-request.dto';
import { UpdateUserUsernameRequestDTO } from './dto/request/update-user-username-request.dto';
import { UpdateUserBanRequestDTO } from './dto/request/update-user-user-ban-request.dto';
import { LOCAL_RETURN_QUERY_TYPES, FIREBASE_ERROR_MESSAGES } from 'src/constants/firebase.constants';
import { UpdateUserEmailRequestDTO } from './dto/request/update-user-email-request.dto';
import { UpdateUserGenderRequestDTO } from './dto/request/update-user-gender-request.dto';
import { UpdateUserIsAccountVerifiedRequestDTO } from './dto/request/update-user-is-account-verified-request-dto';

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

  public async updateUsername(request: UpdateUserUsernameRequestDTO) {
    // to check user is valid or not manually
    const {} = await this.getUserFromFirestore(request.authId);

    const firebaseResponse = await this.firebaseService.updateUsername(
      request.authId,
      request.username,
    );
    return firebaseResponse;
  }

  public async updateRealname(request: UpdateUserRealnameRequestDTO) {
    const {} = await this.getUserFromFirestore(request.authId);

    const firebaseResponse = await this.firebaseService.updateRealname(
      request.authId,
      request.realname,
    );
    return firebaseResponse;
  }

  // accountType is an integer, therefore need to a key value pair
  public async updateAccountType(request: UpdateUserAccountTypeRequestDTO) {
    const { firebaseResponse, user } = await this.getUserFromFirestore(
      request.authId,
    );

    user.accountType = request.accountType;
    return await this.firebaseService.updateField(firebaseResponse, user);
  }

  public async updateAccountStatus(request: UpdateUserAccountStatusRequestDTO) {
    const { firebaseResponse, user } = await this.getUserFromFirestore(
      request.authId,
    );

    user.accountStatus = request.accountStatus;
    return await this.firebaseService.updateField(firebaseResponse, user);
  }

  public async updateUserType(request: UpdateUserTypeRequestDTO) {
    const { firebaseResponse, user } = await this.getUserFromFirestore(
      request.authId,
    );

    user.userType = request.userType;
    return await this.firebaseService.updateField(firebaseResponse, user);
  }

  public async updateUserStatus(request: UpdateUserStatusRequestDTO) {
    const { firebaseResponse, user } = await this.getUserFromFirestore(
      request.authId,
    );

    user.userStatus = request.userStatus;
    return await this.firebaseService.updateField(firebaseResponse, user);
  }

  public async updateUserBan(request: UpdateUserBanRequestDTO) {
    const { firebaseResponse, user } = await this.getUserFromFirestore(
      request.authId,
    );

    user.isBanned = request.isBanned;
    user.banDate = request.isBanned ? FieldValue.serverTimestamp() : null;
    //todo maybe iso can be send and then parse it to timestamp...
    user.expireBanDate = request.isBanned ? request.expireBanDate : null;
    user.accountType = request.isBanned ? AccountType.user : user.accountType;
    return await this.firebaseService.updateField(firebaseResponse, user);
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
