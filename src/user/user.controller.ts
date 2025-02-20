import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { GetUserByEmailRequestDTO } from './dto/request/get-user-by-email-request.dto';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { GetAllUsersResponseDTO } from './dto/response/get-all-users-response.dto';
import { UpdateUserRealnameRequestDTO } from './dto/request/update-user-realname-request.dto';
import { UpdateUserAccountTypeRequestDTO } from './dto/request/update-user-account-type-request.dto';
import { UpdateUserAccountStatusRequestDTO } from './dto/request/update-user-account-status-request.dto';
import { UpdateUserTypeRequestDTO } from './dto/request/update-user-user-type-request.dto';
import { UpdateUserStatusRequestDTO } from './dto/request/update-user-user-status-request.dto';
import { UpdateUserBanRequestDTO } from './dto/request/update-user-user-ban-request.dto';
import { UpdateUserFrozenRequestDTO } from './dto/request/update-user-frozen-request.dto';
import { UpdateUserAboutDto } from './dto/request/update-user-about-dto';
import { UpdateUserAvatarUrlRequestDTO } from './dto/request/update-user-avatar-url-request.dto';
import { UpdateUserEmailRequestDTO } from './dto/request/update-user-email-request.dto';
import { UpdateUserGenderRequestDTO } from './dto/request/update-user-gender-request.dto';
import { UpdateUserIsAccountVerifiedRequestDTO } from './dto/request/update-user-is-account-verified-request-dto';
import { UpdateUserUsernameRequestDTO } from './dto/request/update-user-username-request.dto';
import { UpdateUserIsDeletedRequestDTO } from './dto/request/update-user-is-deleted-request.dto';
import { UpdateUserPhoneNumberRequestDTO } from './dto/request/update-user-phone-number-request.dto';
import { UpdateUserBirthDateRequestDTO } from './dto/request/update-user-birth-date-request.dto';
import { UpdateUserAddressRequestDTO } from './dto/request/update-user-address-request.dto';
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
import { UpdateUserBlogsReadCountRequestDTO } from './dto/request/update-user-blogs-read-count-request.dto';
import { UpdateUserBlogsLikeCountRequestDTO } from './dto/request/update-user-blogs-like-count-request.dto';
import { PaginationQueryDTO } from 'src/firebase/dto/pagination-query.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/find/byEmail')
  public async getUserByEmail(
    @Body() request: GetUserByEmailRequestDTO,
  ): Promise<UserDTO> {
    return await this.userService.getUserByEmail(request);
  }

  @Put('/update/username')
  public async updateUsername(@Body() request: UpdateUserUsernameRequestDTO) {
    return await this.userService.updateUsername(request);
  }

  @Get('/find/all')
  public async getAllUsers(): Promise<GetAllUsersResponseDTO[]> {
    return await this.userService.getAllUsers();
  }

  @Put('/update/deactivateUserAccount')
  public async frozeUserAccount(@Body() request: UpdateUserFrozenRequestDTO) {
    return await this.userService.deactivateUserAccount(request);
  }

  @Put('/update/userAbout')
  public async updateUserAbout(@Body() request: UpdateUserAboutDto) {
    return await this.userService.updateUserAbout(request);
  }

  @Put('/update/userAvatarUrl')
  public async updateUserAvatarUrl(
    @Body() request: UpdateUserAvatarUrlRequestDTO,
  ) {
    return await this.userService.updateUserAvatar(request);
  }

  @Put('/update/realname')
  public async updateRealname(@Body() request: UpdateUserRealnameRequestDTO) {
    return await this.userService.updateRealname(request);
  }

  @Put('/update/accountType')
  public async updateAccountType(
    @Body() request: UpdateUserAccountTypeRequestDTO,
  ) {
    return await this.userService.updateAccountType(request);
  }
  @Put('/update/accountStatus')
  public async updateAccountStatus(
    @Body() request: UpdateUserAccountStatusRequestDTO,
  ) {
    return await this.userService.updateAccountStatus(request);
  }

  @Put('/update/usertype')
  public async updateUserType(@Body() request: UpdateUserTypeRequestDTO) {
    return await this.userService.updateUserType(request);
  }

  @Put('/update/userstatus')
  public async updateUserStatus(@Body() request: UpdateUserStatusRequestDTO) {
    return await this.userService.updateUserStatus(request);
  }
  @Put('/update/ban')
  public async updateUserBan(@Body() request: UpdateUserBanRequestDTO) {
    return await this.userService.updateUserBan(request);
  }

  @Put('/update/userEmailAddress')
  public async updateUserEmail(@Body() request: UpdateUserEmailRequestDTO) {
    return await this.userService.updateUserEmail(request);
  }

  @Put('/update/userGender')
  public async updateUserGenderUrl(
    @Body() request: UpdateUserGenderRequestDTO,
  ) {
    return await this.userService.updateUserGender(request);
  }

  @Put('/update/verifyUserAccount')
  public async updateUserAccountVerified(
    @Body() request: UpdateUserIsAccountVerifiedRequestDTO,
  ) {
    return await this.userService.verifyUserAccount(request);
  }

  @Put('/update/deleteUser')
  public async deleteUser(@Body() request: UpdateUserIsDeletedRequestDTO) {
    return await this.userService.deleteUser(request);
  }

  @Put('/update/phoneNumber')
  public async updatePhoneNumber(
    @Body() request: UpdateUserPhoneNumberRequestDTO,
  ) {
    return await this.userService.updatePhoneNumber(request);
  }

  @Put('/update/birthDate')
  public async updateBirthDate(@Body() request: UpdateUserBirthDateRequestDTO) {
    return await this.userService.updateUserBirthDate(request);
  }

  @Put('/update/userAddress')
  public async updateUserAddress(@Body() request: UpdateUserAddressRequestDTO) {
    return await this.userService.updateUserAddress(request);
  }

  @Put('/update/userIsEmailVerified')
  public async updateUserIsEmailVerified(
    @Body() request: UpdateUserIsEmailVerifiedRequestDTO,
  ) {
    return await this.userService.updateUserIsEmailVerified(request);
  }

  @Put('/update/userIsPhoneVerified')
  public async updateUserIsPhoneVerified(
    @Body() request: UpdateUserIsPhoneVerifiedRequestDTO,
  ) {
    return await this.userService.updateUserIsPhoneVerified(request);
  }

  @Put('/update/userFollowerCount')
  public async updateUserFollowerCount(
    @Body() request: UpdateUserFollowerCountRequestDTO,
  ) {
    return await this.userService.updateUserFollowerCount(request);
  }

  @Put('/update/userFollowingCount')
  public async updateUserFollowingCount(
    @Body() request: UpdateUserFollowingCountRequestDTO,
  ) {
    return await this.userService.updateUserFollowingCount(request);
  }

  @Put('/update/userSubscriberCount')
  public async updateUserSubscriberCount(
    @Body() request: UpdateUserSubscriberCountRequestDTO,
  ) {
    return await this.userService.updateUserSubscriberCount(request);
  }

  @Put('/update/userSubscriptionCount')
  public async updateUserSubscriptionCount(
    @Body() request: UpdateUserSubscriptionCountRequestDTO,
  ) {
    return await this.userService.updateUserSubscriptionCount(request);
  }

  @Put('/update/userTotalExpenditure')
  public async updateUserTotalExpenditure(
    @Body() request: UpdateUserTotalExpenditureRequestDTO,
  ) {
    return await this.userService.updateUserTotalExpenditure(request);
  }

  @Put('/update/userLastLoginDate')
  public async updateUserLastLoginDate(
    @Body() request: UpdateUserLastLoginDateRequestDTO,
  ) {
    return await this.userService.updateUserLastLoginDate(request);
  }

  @Put('/update/userLastLogoutDate')
  public async updateUserLastLogoutDate(
    @Body() request: UpdateUserLastLogoutDateRequestDTO,
  ) {
    return await this.userService.updateUserLastLogoutDate(request);
  }

  @Put('/update/userVogCount')
  public async updateUserVogCount(
    @Body() request: UpdateUserVogCountRequestDTO,
  ) {
    return await this.userService.updateUserVogCount(request);
  }

  @Put('/update/userVogLikeCount')
  public async updateUserVogLikeCount(
    @Body() request: UpdateUserVogLikeCountRequestDTO,
  ) {
    return await this.userService.updateUserVogLikeCount(request);
  }

  @Put('/update/userPostCommentCount')
  public async updateUserPostCommentCount(
    @Body() request: UpdateUserPostCommentCountRequestDTO,
  ) {
    return await this.userService.updateUserPostCommentCount(request);
  }

  @Put('/update/userFavoriteBusinessCount')
  public async updateUserFavoriteBusinessCount(
    @Body() request: UpdateUserFavoriteBusinessCountRequestDTO,
  ) {
    return await this.userService.updateUserFavoriteBusinessCount(request);
  }

  @Put('/update/userBlogsReadCount')
  public async updateUserBlogsReadCount(
    @Body() request: UpdateUserBlogsReadCountRequestDTO,
  ) {
    return await this.userService.updateUserBlogsReadCount(request);
  }

  @Put('/update/userBlogsLikeCount')
  public async updateUserBlogsLikeCount(
    @Body() request: UpdateUserBlogsLikeCountRequestDTO,
  ) {
    return await this.userService.updateUserBlogsLikeCount(request);
  }

  @Get('/find/filter')
  public async paginate(@Query() request: PaginationQueryDTO) {
    return await this.userService.paginate(request);
  }

  @Get('/find/preview/filter')
  public async paginatePreview(@Query() request: PaginationQueryDTO) {
    return await this.userService.paginatePreview(request);
  }
}
