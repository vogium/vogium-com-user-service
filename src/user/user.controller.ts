import { Body, Controller, Get, Param, Put } from '@nestjs/common';
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

  @Put('/update/username')
  public async updateUsername(@Body() request: UpdateUserUsernameRequestDTO) {
    return await this.userService.updateUsername(request);
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
}
