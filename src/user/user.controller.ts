import { Body, Controller, Get, Put } from '@nestjs/common';
import { getUserByEmailRequestDTO } from './dto/request/get-user-by-email-request.dto';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { GetAllUsersByFieldRequestDTO } from './dto/request/get-all-users-by-params-request.dto';
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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/find/byEmail')
  public async getUserByEmail(
    @Body() request: getUserByEmailRequestDTO,
  ): Promise<UserDTO> {
    return await this.userService.getUserByEmail(request);
  }

  @Put('/update/username')
  public async updateUsername(@Body() request: UpdateUserUsernameRequestDTO) {
    return await this.userService.updateUsername(request);
  }

  @Get('/find/all')
  public async getAllUsers(
    @Body() request: GetAllUsersByFieldRequestDTO,
  ): Promise<GetAllUsersResponseDTO[]> {
    return await this.userService.getAllUsers(request.fieldParams || []);
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
}
