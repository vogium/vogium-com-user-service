import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { getUserByEmailRequestDTO } from './dto/request/get-user-by-email-request.dto';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { updateUserRequestDTO } from './dto/request/update-user-request.dto';
import { getAllUsersByFieldRequestDTO } from './dto/request/get-all-users-by-params-request.dto';
import { getAllUsersResponseDTO } from './dto/response/get-all-users-response.dto';

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

  @Put(':authId')
  public async updateUser(
    @Body() userData: updateUserRequestDTO,
    @Param('authId') authId: string,
  ) {
    return await this.userService.updateUser(authId, userData);
  }
}
