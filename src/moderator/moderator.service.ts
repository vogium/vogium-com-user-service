import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UtilService } from 'src/util/util.service';
import { FieldValue } from 'firebase-admin/firestore';
import { PaginationQueryDTO } from 'src/firebase/dto/pagination-query.dto';
import { COLLECTION_NAMES } from 'src/constants/firebase.constants';
import { GetModeratorByEmailRequestDTO } from './dto/request/get-moderator-by-email-request.dto';
import { GetAllModeratorsResponseDTO } from './dto/response/get-all-moderators-response.dto';
import { ModeratorDTO } from './dto/moderator.dto';
import { GetModeratorByAuthId } from './dto/request/get-moderator-by-auth-id.dto';
import { UpdateModeratorAccountTypeRequestDTO } from './dto/request/update-moderator-account-type-request.dto';
import { UpdateModeratorAvatarUrlRequestDTO } from './dto/request/update-moderator-avatar-url-request.dto';
import { UpdateModeratorBirthDateRequestDTO } from './dto/request/update-moderator-birth-date-request.dto';
import { UpdateModeratorEmailRequestDTO } from './dto/request/update-moderator-email-request.dto';
import { UpdateModeratorFrozenRequestDTO } from './dto/request/update-moderator-frozen-request.dto';
import { UpdateModeratorIsDeletedRequestDTO } from './dto/request/update-moderator-is-deleted-request.dto';
import { UpdateModeratorIsEmailVerifiedRequestDTO } from './dto/request/update-moderator-is-email-verified-request-dto';
import { UpdateModeratorIsPhoneVerifiedRequestDTO } from './dto/request/update-moderator-is-phone-verified-request-dto';
import { UpdateModeratorLastLoginDateRequestDTO } from './dto/request/update-moderator-last-login-date-request.dto';
import { UpdateModeratorLastLogoutDateRequestDTO } from './dto/request/update-moderator-last-logout-date-request.dto';
import { UpdateModeratorPhoneNumberRequestDTO } from './dto/request/update-moderator-phone-number-request.dto';
import { UpdateModeratorRealnameRequestDTO } from './dto/request/update-moderator-realname-request.dto';
import { UpdateModeratorUsernameRequestDTO } from './dto/request/update-moderator-username-request.dto';
import { UpdateModeratorGenderRequestDTO } from './dto/request/update-moderator-gender-request.dto';

@Injectable()
export class ModeratorService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly utilService: UtilService,
  ) {}

  public async getByEmail(
    request: GetModeratorByEmailRequestDTO,
  ): Promise<any> {
    const firebaseResponse = (
      await this.firebaseService.getModeratorFromFirestore([
        { field: 'email', operator: '==', value: request.email },
      ])
    ).response;

    return await this.utilService.mapToDto(firebaseResponse, ModeratorDTO);
    // return firebaseResponse as ModeratorDTO;
  }

  public async getModeratorById(request: GetModeratorByAuthId) {
    return (
      await this.firebaseService.getModeratorFromFirestore([
        { field: 'authId', operator: '==', value: request.authId },
      ])
    ).response;
  }

  public async getAllModerators(): Promise<GetAllModeratorsResponseDTO[]> {
    const result = await this.firebaseService.getModeratorFromFirestore();
    return result.response;
  }

  public async updateModeratorUsername(
    request: UpdateModeratorUsernameRequestDTO,
  ) {
    // to check user is valid or not manually
    const { authId, username } = request;
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(authId),
    );
    response.username = username;
    return await firebaseResponse.ref.update(response);
  }

  public async updateRealname(request: UpdateModeratorRealnameRequestDTO) {
    const { authId, realname } = request;
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(authId),
    );
    response.username = realname;
    return await firebaseResponse.ref.update(response);
  }

  // accountType is an integer, therefore need to a key value pair
  public async updateAccountType(
    request: UpdateModeratorAccountTypeRequestDTO,
  ) {
    const { authId, accountType } = request;
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(authId),
    );
    response.accountType = accountType;
    return await firebaseResponse.ref.update(response);
  }

  /*public async updateModeratorBan(request: UpdateModeratorBanRequestDTO) {
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(request.authId),
    );
    response.isBanned = request.isBanned;
    response.banDate = request.isBanned ? FieldValue.serverTimestamp() : null;
    //todo maybe iso can be send and then parse it to timestamp...
    response.expireBanDate = request.isBanned ? request.expireBanDate : null;
    response.accountType = request.isBanned
      ? AccountType.USER
      : response.accountType;
    return await firebaseResponse.ref.update(response);
  }*/

  public async deactivateModeratorAccount(
    request: UpdateModeratorFrozenRequestDTO,
  ): Promise<ModeratorDTO> {
    const { authId, isFrozen } = request;
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(authId),
    );
    response.isFrozen = isFrozen;
    response.frozenDate = FieldValue.serverTimestamp();
    return await firebaseResponse.ref.update(response);
  }

  public async updateModeratorAvatar(
    request: UpdateModeratorAvatarUrlRequestDTO,
  ): Promise<ModeratorDTO> {
    const { authId, avatarUrl } = request;
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(authId),
    );
    response.avatarUrl = avatarUrl;
    return await firebaseResponse.ref.update(response);
  }

  public async updateModeratorEmail(
    request: UpdateModeratorEmailRequestDTO,
  ): Promise<ModeratorDTO> {
    const { authId, emailAddress } = request;
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(authId),
    );
    response.emailAddress = emailAddress;
    return await firebaseResponse.ref.update(response);
  }

  public async updateModeratorGender(
    request: UpdateModeratorGenderRequestDTO,
  ): Promise<ModeratorDTO> {
    const { authId, sex } = request;
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(authId),
    );
    response.sex = sex;
    return await firebaseResponse.ref.update(response);
  }

  public async deleteModerator(request: UpdateModeratorIsDeletedRequestDTO) {
    const { authId, isDeleted } = request;
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(authId),
    );
    response.isDeleted = isDeleted;
    if (isDeleted === true) {
      response.deletedDate = FieldValue.serverTimestamp();
    }
    return await firebaseResponse.ref.update(response);
  }

  public async updatePhoneNumber(
    request: UpdateModeratorPhoneNumberRequestDTO,
  ) {
    const { authId, phoneNumber } = request;
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(authId),
    );
    response.phoneNumber = phoneNumber;
    return await firebaseResponse.ref.update(response);
  }

  public async updateModeratorBirthDate(
    request: UpdateModeratorBirthDateRequestDTO,
  ) {
    const { authId, birthDate } = request;
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(authId),
    );
    response.birthDate = this.firebaseService.convertDateToTimestamp(birthDate);
    return await firebaseResponse.ref.update(response);
  }

  public async updateModeratorAddress(request: any) {
    const { authId, city, country } = request;
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(authId),
    );
    response.city = city;
    response.country = country;
    return await firebaseResponse.ref.update(response);
  }

  public async updateModeratorIsEmailVerified(
    request: UpdateModeratorIsEmailVerifiedRequestDTO,
  ) {
    const { authId, isEmailVerified } = request;
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(authId),
    );
    response.isEmailVerified = isEmailVerified;
    return await firebaseResponse.ref.update(response);
  }

  public async updateModeratorIsPhoneVerified(
    request: UpdateModeratorIsPhoneVerifiedRequestDTO,
  ) {
    const { authId, isPhoneVerified } = request;
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(authId),
    );
    response.isPhoneVerified = isPhoneVerified;
    return await firebaseResponse.ref.update(response);
  }

  public async updateModeratorLastLoginDate(
    request: UpdateModeratorLastLoginDateRequestDTO,
  ) {
    const { authId, lastLoginDate } = request;
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(authId),
    );
    response.lastLoginDate = lastLoginDate;
    return await firebaseResponse.ref.update(response);
  }

  public async updateModeratorLastLogoutDate(
    request: UpdateModeratorLastLogoutDateRequestDTO,
  ) {
    const { authId, lastLogoutDate } = request;
    const { firebaseResponse, response } = await this.getModeratorById(
      new GetModeratorByAuthId(authId),
    );
    response.lastLoginDate = lastLogoutDate;
    return await firebaseResponse.ref.update(response);
  }

  public async paginate(query: PaginationQueryDTO) {
    return await this.firebaseService.paginate(
      COLLECTION_NAMES.MODERATORS_COLLECTION,
      query,
    );
  }
}
