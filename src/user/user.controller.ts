import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { getUserByEmailRequestDTO } from './dto/request/get-user-by-email-request.dto';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { getAllUsersByFieldRequestDTO } from './dto/request/get-all-users-by-params-request.dto';
import { getAllUsersResponseDTO } from './dto/response/get-all-users-response.dto';
import { UpdateUserUsernameRequestDTO } from './dto/request/update-user-username-request.dto';
import { UpdateUserRealnameRequestDTO } from './dto/request/update-user-realname-request.dto';
import { UpdateUserAccountTypeRequestDTO } from './dto/request/update-user-account-type-request.dto';
import { UpdateUserAccountStatusRequestDTO } from './dto/request/update-user-account-status-request.dto';
import { UpdateUserTypeRequestDTO } from './dto/request/update-user-user-type-request.dto';
import { UpdateUserStatusRequestDTO } from './dto/request/update-user-user-status-request.dto';
import { UpdateUserBanRequestDTO } from './dto/request/update-user-user-ban-request.dto';
import { UpdateUserFrozenRequestDTO } from './dto/request/update-user-frozen-request.dto';
import { UpdateUserAboutDto } from './dto/request/update-user-about-dto';
import { UpdateUserAvatarUrlRequestDTO } from './dto/request/update-user-avatar-url-request.dto';
import { updateSetUserUsernameRequestDTO } from './dto/request/update-user-set-username-request.dto';
import { updateUserUsernameRequestDTO } from './dto/request/update-user-username-request.dto';
import { updateUserRealnameRequestDTO } from './dto/request/update-user-realname-request.dto';
import { updateUserAccountTypeRequestDTO } from './dto/request/update-user-account-type-request.dto';
import { updateUserAccountStatusRequestDTO } from './dto/request/update-user-account-status-request.dto';
import { UpdateUserEmailRequestDTO } from './dto/request/update-user-email-request.dto';
import { UpdateUserGenderRequestDTO } from './dto/request/update-user-gender-request.dto';
import { UpdateUserIsAccountVerifiedRequestDTO } from './dto/request/update-user-is-account-verified-request-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/find/byEmail')
  public async getUserByEmail(
    @Body() request: getUserByEmailRequestDTO,
  ): Promise<UserDTO> {
    console.log(request);
    return await this.userService.getUserByEmail(request);
  }

  @Get('all')
  public async getAllUsers(
    @Body() request: getAllUsersByFieldRequestDTO,
  ): Promise<getAllUsersResponseDTO[]> {
    return await this.userService.getAllUsers(request.fieldParams || []);
  }

  @Put('/update/deactivateUserAccount')
  public async frozeUserAccount(
    @Body() request: UpdateUserFrozenRequestDTO,
  ) {
    console.log(request);
    return await this.userService.deactivateUserAccount(request);
  }

  @Put('/update/userAbout')
  public async updateUserAbout(
    @Body() request: UpdateUserAboutDto,
  ) {
    return await this.userService.updateUserAbout(request);
  }

  @Put('/update/userAvatarUrl')
  public async updateUserAvatarUrl(
    @Body() request: UpdateUserAvatarUrlRequestDTO,
  ) {
    return await this.userService.updateUserAvatar(request);
  }

  @Put('/update/username')
  public async updateUsername(@Body() request: UpdateUserUsernameRequestDTO) {
    return await this.userService.updateUsername(request);
  @Put(':authId')
  public async updateUser(
    @Body() userData: updateUserRequestDTO,
    @Query('authId') authId: string,
  ) {
    return await this.userService.updateUser(authId, userData);
  }

  //todo iki türlü senaryo varmış. kullanıcı üye olurken ve sonradan değiştirme diye..
  // görmezden gelinebilir..
  // Kaldırılacak...
  @Put('/update/set/username/:authId')
  public async updateSetUsername(
    @Param('authId') authId: string,
    @Body() userData: updateSetUserUsernameRequestDTO,
  ) {
    return await this.userService.updateSetUsername(authId, userData.username);
  }

  @Put('/update/username/:authId')
  public async updateUsername(
    @Param('authId') authId: string,
    @Body() userData: updateUserUsernameRequestDTO,
  ) {
    return await this.userService.updateUsername(authId, userData.username);
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
  public async updateUserEmail(
    @Body() request: UpdateUserEmailRequestDTO,
  ) {
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
}
