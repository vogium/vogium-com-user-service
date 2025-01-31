import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { getUserByEmailRequestDTO } from './dto/request/get-user-by-email-request.dto';
import { UserDTO } from './dto/user.dto';
import { UtilService } from 'src/util/util.service';
import { FieldParams } from 'src/firebase/dto/request-field-params.dto';
import { UpdateUserFrozenRequestDTO } from './dto/request/update-user-frozen-request.dto';
import { FieldValue } from 'firebase-admin/firestore';
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
import { UpdateUserEmailRequestDTO } from './dto/request/update-user-email-request.dto';
import { UpdateUserGenderRequestDTO } from './dto/request/update-user-gender-request.dto';
import { UpdateUserIsAccountVerifiedRequestDTO } from './dto/request/update-user-is-account-verified-request-dto';
import { GetAllUsersResponseDTO } from './dto/response/get-all-users-response.dto';
import { UpdateUserIsDeletedRequestDTO } from './dto/request/update-user-is-deleted-request.dto';
import { UpdateUserPhoneNumberRequestDTO } from './dto/request/update-user-phone-number-request.dto';
import { UpdateUserBirthDateRequestDTO } from './dto/request/update-user-birth-date-request.dto';
import { UpdateUserIsEmailVerifiedRequestDTO } from './dto/request/update-user-is-email-verified-request-dto';
import { UpdateUserIsPhoneVerifiedRequestDTO } from './dto/request/update-user-is-phone-verified-request-dto';
import { UpdateUserFollowerCountRequestDTO } from './dto/request/update-user-follower-count-request.dto';
import { UpdateUserFollowingCountRequestDTO } from './dto/request/update-user-following-count-request.dto';
import { UpdateUserSubscriberCountRequestDTO } from './dto/request/update-user-subscriber-count-request.dto';
import { UpdateUserSubscriptionCountRequestDTO } from './dto/request/update-user-subscription-count-request.dto';
import { UpdateUserTotalExpenditureRequestDTO } from './dto/request/update-user-total-expenditure-request.dto';
import { UpdateUserLastLoginDateRequestDTO } from './dto/request/update-user-last-login-date-request.dto';
import { UpdateUserLastLogoutDateRequestDTO } from './dto/request/update-user-last-logout-date-request.dto';
import { UpdateUserVogCountRequestDTO } from './dto/request/update-user-vog-count-request.dto';
import { UpdateUserVogLikeCountRequestDTO } from './dto/request/update-user-vog-like-count-request.dto';
import { UpdateUserPostCommentCountRequestDTO } from './dto/request/update-user-post-comment-count-request.dto';
import { UpdateUserFavoriteBusinessCountRequestDTO } from './dto/request/update-user-favorite-business-count-request.dto';
import { UpdateUserBlogsLikeCountRequestDTO } from './dto/request/update-user-blogs-like-count-request.dto';
import { UpdateUserBlogsReadCountRequestDTO } from './dto/request/update-user-blogs-read-count-request.dto';
import { PaginationQueryDTO } from 'src/firebase/dto/pagination-query.dto';
import { COLLECTION_NAMES } from 'src/constants/firebase.constants';

@Injectable()
export class UserService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly utilService: UtilService,
  ) {}

  public async getUserByEmail(request: getUserByEmailRequestDTO): Promise<any> {
    const firebaseResponse = (await this.firebaseService.getUserByEmail(
      request.email,
    )) as UserDTO;

    return await this.utilService.mapToDto(firebaseResponse, UserDTO);
    // return firebaseResponse as UserDTO;
  }

  public async getAllUsers(
    fieldParams: FieldParams[],
  ): Promise<GetAllUsersResponseDTO[]> {
    const firebaseResponse =
      await this.firebaseService.getAllUsers(fieldParams);

    return await this.utilService.mapToDtoArray<GetAllUsersResponseDTO>(
      firebaseResponse,
      GetAllUsersResponseDTO,
    );
  }

  public async updateUsername(request: UpdateUserUsernameRequestDTO) {
    // to check user is valid or not manually
    const {} = await this.firebaseService.getUserFromFirestoreById(request.authId);

    const firebaseResponse = await this.firebaseService.updateUsername(
      request.authId,
      request.username,
    );
    return firebaseResponse;
  }

  public async updateRealname(request: UpdateUserRealnameRequestDTO) {
    const {} = await this.firebaseService.getUserFromFirestoreById(request.authId);

    const firebaseResponse = await this.firebaseService.updateRealname(
      request.authId,
      request.realname,
    );
    return firebaseResponse;
  }

  // accountType is an integer, therefore need to a key value pair
  public async updateAccountType(request: UpdateUserAccountTypeRequestDTO) {
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(
      request.authId,
    );

    response.accountType = request.accountType;
    return await firebaseResponse.ref.update(response);
  }

  public async updateAccountStatus(request: UpdateUserAccountStatusRequestDTO) {
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(
      request.authId,
    );

    response.accountStatus = request.accountStatus;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserType(request: UpdateUserTypeRequestDTO) {
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(
      request.authId,
    );

    response.userType = request.userType;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserStatus(request: UpdateUserStatusRequestDTO) {
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(
      request.authId,
    );

    response.userStatus = request.userStatus;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserBan(request: UpdateUserBanRequestDTO) {
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(
      request.authId,
    );

    response.isBanned = request.isBanned;
    response.banDate = request.isBanned ? FieldValue.serverTimestamp() : null;
    //todo maybe iso can be send and then parse it to timestamp...
    response.expireBanDate = request.isBanned ? request.expireBanDate : null;
    response.accountType = request.isBanned ? AccountType.USER : response.accountType;
    return await firebaseResponse.ref.update(response);
  }

  public async  deactivateUserAccount(
    request: UpdateUserFrozenRequestDTO,
  ): Promise<UserDTO> {
    const { authId, isFrozen } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.isFrozen = isFrozen;
    response.frozenDate = FieldValue.serverTimestamp();
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserAbout(request: UpdateUserAboutDto): Promise<UserDTO> {
    const { authId, about } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.about = about;
    const {previewFirebaseResponse, previewResponse} = await this.firebaseService.getUserPreviewFromFirestoreById(authId);
    previewResponse.about = about;
    await previewFirebaseResponse.ref.update(previewResponse);
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserAvatar(
    request: UpdateUserAvatarUrlRequestDTO,
  ): Promise<UserDTO> {
    const { authId, avatarUrl } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.avatarUrl = avatarUrl;
    const {previewFirebaseResponse, previewResponse} = await this.firebaseService.getUserPreviewFromFirestoreById(authId);
    previewResponse.avatarUrl = avatarUrl;
    await previewFirebaseResponse.ref.update(previewResponse);
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserEmail(
    request: UpdateUserEmailRequestDTO,
  ): Promise<UserDTO> {
    const { authId, emailAddress } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.emailAddress = emailAddress;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserGender(
    request: UpdateUserGenderRequestDTO,
  ): Promise<UserDTO> {
    const { authId, sex } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.sex = sex;
    return await firebaseResponse.ref.update(response);
  }

  public async verifyUserAccount(
    request: UpdateUserIsAccountVerifiedRequestDTO,
  ): Promise<UserDTO> {
    const { authId, isAccountVerified } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.isAccountVerified = isAccountVerified;

    if (isAccountVerified === true) {
      response.accountVerifiedDate = FieldValue.serverTimestamp();
    }
    return await firebaseResponse.ref.update(response);
  }

  public async deleteUser(request: UpdateUserIsDeletedRequestDTO){
    const { authId, isDeleted } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.isDeleted = isDeleted;
    if (isDeleted === true) {
      response.deletedDate = FieldValue.serverTimestamp();
    }

    const {previewFirebaseResponse, previewResponse} = await this.firebaseService.getUserPreviewFromFirestoreById(authId);
    previewResponse.isDeleted = isDeleted;
    await previewFirebaseResponse.ref.update(previewResponse)
    return await firebaseResponse.ref.update(response);

  }

  public async updatePhoneNumber(request: UpdateUserPhoneNumberRequestDTO){
    const { authId, phoneNumber } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.phoneNumber = phoneNumber;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserBirthDate(request: UpdateUserBirthDateRequestDTO) {
    const { authId, birthDate } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.birthDate = this.firebaseService.convertDateToTimestamp(birthDate);
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserAddress(request: any) {
    const { authId, city, country } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.city = city;
    response.country = country;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserIsEmailVerified(request: UpdateUserIsEmailVerifiedRequestDTO){
    const { authId, isEmailVerified } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.isEmailVerified = isEmailVerified;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserIsPhoneVerified(request: UpdateUserIsPhoneVerifiedRequestDTO){
    const { authId, isPhoneVerified } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.isPhoneVerified = isPhoneVerified;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserFollowerCount(request: UpdateUserFollowerCountRequestDTO){ 
    const { authId, followerCount } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.followerCount = followerCount;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserFollowingCount(request: UpdateUserFollowingCountRequestDTO){ 
    const { authId, followingCount } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.followingCount = followingCount;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserSubscriberCount(request: UpdateUserSubscriberCountRequestDTO){
    const { authId, subscriberCount } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.subscriberCount = subscriberCount;
    return await firebaseResponse.ref.update(response);
  }
  
  public async updateUserSubscriptionCount(request: UpdateUserSubscriptionCountRequestDTO){
    const { authId, subscriptionCount } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.subscriptionCount = subscriptionCount;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserTotalExpenditure(request: UpdateUserTotalExpenditureRequestDTO) {
    const { authId, totalExpenditure } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.totalExpenditure = totalExpenditure;
    return await firebaseResponse.ref.update(response);
  }
  
  public async updateUserLastLoginDate(request: UpdateUserLastLoginDateRequestDTO){
    const { authId, lastLoginDate } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.lastLoginDate = lastLoginDate;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserLastLogoutDate(request: UpdateUserLastLogoutDateRequestDTO){
    const { authId, lastLogoutDate } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.lastLoginDate = lastLogoutDate;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserVogCount(request: UpdateUserVogCountRequestDTO) {
    const { authId, vogCount } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.vogCount = vogCount;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserVogLikeCount(request: UpdateUserVogLikeCountRequestDTO) {
    const { authId, vogLikeCount } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.vogLikeCount = vogLikeCount;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserPostCommentCount(request: UpdateUserPostCommentCountRequestDTO) {
    const { authId, postCommentCount } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.postCommentCount = postCommentCount;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserFavoriteBusinessCount(request: UpdateUserFavoriteBusinessCountRequestDTO){
    const { authId, favoriteBusinessCount } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.favoriteBusinessCount = favoriteBusinessCount;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserBlogsReadCount(request: UpdateUserBlogsReadCountRequestDTO){
    const { authId, blogsReadCount } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.blogsReadCount = blogsReadCount;
    return await firebaseResponse.ref.update(response);
  }

  public async updateUserBlogsLikeCount(request: UpdateUserBlogsLikeCountRequestDTO){
    const { authId, blogsLikeCount } = request;
    const { firebaseResponse, response } = await this.firebaseService.getUserFromFirestoreById(authId);
    response.blogsLikeCount = blogsLikeCount;
    return await firebaseResponse.ref.update(response);
  }

  public async paginate(query: PaginationQueryDTO){
    return await this.firebaseService.paginate(COLLECTION_NAMES.USERS_COLLECTION, query);
  }

  public async paginatePreview(query: PaginationQueryDTO){
    return await this.firebaseService.paginate(COLLECTION_NAMES.USER_PREVIEWS_COLLECTION, query);
  }

}
