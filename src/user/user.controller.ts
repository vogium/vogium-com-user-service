import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { getUserByEmailRequestDTO } from './dto/request/get-user-by-email-request.dto';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { updateUserRequestDTO } from './dto/request/update-user-request.dto';
import { getAllUsersByFieldRequestDTO } from './dto/request/get-all-users-by-params-request.dto';
import { getAllUsersResponseDTO } from './dto/response/get-all-users-response.dto';
import { UpdateUserFrozenRequestDTO } from './dto/request/update-user-frozen-request.dto';
import { UpdateUserAboutDto } from './dto/request/update-user-about-dto';
import { UpdateUserAvatarUrlDTO } from './dto/request/update-user-avatar-url-dto';
import { updateSetUserUsernameRequestDTO } from './dto/request/update-user-set-username-request.dto';
import { updateUserUsernameRequestDTO } from './dto/request/update-user-username-request.dto';
import { updateUserRealnameRequestDTO } from './dto/request/update-user-realname-request.dto';
import { updateUserAccountTypeRequestDTO } from './dto/request/update-user-account-type-request.dto';
import { updateUserAccountStatusRequestDTO } from './dto/request/update-user-account-status-request.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async getUserByEmail(
    @Body() request: getUserByEmailRequestDTO,
  ): Promise<UserDTO> {
    console.log('request', request);
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
    return await this.userService.frozeUserAccount(request);
  }

  @Put('/update/userAbout')
  public async updateUserAbout(
    @Body() request: UpdateUserAboutDto,
  ) {
    return await this.userService.updateUserAbout(request);
  }

  @Put('/update/userAvatarUrl')
  public async updateUserAvatarUrl(
    @Body() request: UpdateUserAvatarUrlDTO,
  ) {
    return await this.userService.updateUserAvatar(request);
  }

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

  @Put('/update/realname/:authId')
  public async updateRealname(
    @Param('authId') authId: string,
    @Body() userData: updateUserRealnameRequestDTO,
  ) {
    return await this.userService.updateRealname(authId, userData.realname);
  }

  @Put('/update/accountType/:authId')
  public async updateAccountType(
    @Param('authId') authId: string,
    @Body() userData: updateUserAccountTypeRequestDTO,
  ) {
    return await this.userService.updateAccountType(
      authId,
      userData.accountType,
    );
  }
  @Put('/update/accountStatus/:authId')
  public async updateAccountStatus(
    @Param('authId') authId: string,
    @Body() userData: updateUserAccountStatusRequestDTO,
  ) {
    return await this.userService.updateAccountStatus(
      authId,
      userData.accountStatus,
    );
  }
}
