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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  //getUserByEmailRequestDTO param email..
  //todo açınca hata veriyor.
  public async getUserByEmail(@Body() request: any): Promise<UserDTO> {
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
}
