import { Controller, Get, Body, Put, Query } from '@nestjs/common';
import { PaginationQueryDTO } from 'src/firebase/dto/pagination-query.dto';
import { ModeratorDTO } from './dto/moderator.dto';
import { GetModeratorByEmailRequestDTO } from './dto/request/get-moderator-by-email-request.dto';
import { UpdateModeratorAccountTypeRequestDTO } from './dto/request/update-moderator-account-type-request.dto';
import { UpdateModeratorAddressRequestDTO } from './dto/request/update-moderator-address-request.dto';
import { UpdateModeratorAvatarUrlRequestDTO } from './dto/request/update-moderator-avatar-url-request.dto';
import { UpdateModeratorBirthDateRequestDTO } from './dto/request/update-moderator-birth-date-request.dto';
import { UpdateModeratorEmailRequestDTO } from './dto/request/update-moderator-email-request.dto';
import { UpdateModeratorFrozenRequestDTO } from './dto/request/update-moderator-frozen-request.dto';
import { UpdateModeratorGenderRequestDTO } from './dto/request/update-moderator-gender-request.dto';
import { UpdateModeratorIsDeletedRequestDTO } from './dto/request/update-moderator-is-deleted-request.dto';
import { UpdateModeratorIsEmailVerifiedRequestDTO } from './dto/request/update-moderator-is-email-verified-request-dto';
import { UpdateModeratorIsPhoneVerifiedRequestDTO } from './dto/request/update-moderator-is-phone-verified-request-dto';
import { UpdateModeratorLastLoginDateRequestDTO } from './dto/request/update-moderator-last-login-date-request.dto';
import { UpdateModeratorLastLogoutDateRequestDTO } from './dto/request/update-moderator-last-logout-date-request.dto';
import { UpdateModeratorPhoneNumberRequestDTO } from './dto/request/update-moderator-phone-number-request.dto';
import { UpdateModeratorRealnameRequestDTO } from './dto/request/update-moderator-realname-request.dto';
import { UpdateModeratorUsernameRequestDTO } from './dto/request/update-moderator-username-request.dto';
import { GetAllModeratorsResponseDTO } from './dto/response/get-all-moderators-response.dto';
import { ModeratorService } from './moderator.service';
import { GetModeratorByAuthId } from './dto/request/get-moderator-by-auth-id.dto';

@Controller('moderator')
export class ModeratorController {
  constructor(private readonly moderatorService: ModeratorService) {}

  @Get('/find/byEmail')
  public async getModeratorByEmail(
    @Body() request: GetModeratorByEmailRequestDTO,
  ): Promise<ModeratorDTO> {
    return await this.moderatorService.getByEmail(request);
  }

  @Get('/find/moderatorById')
  public async getModeratorById(
    @Body() request: GetModeratorByAuthId,
  ): Promise<ModeratorDTO> {
    return await this.moderatorService.getModeratorById(request);
  }

  @Put('/update/username')
  public async updateModeratorUsernamename(
    @Body() request: UpdateModeratorUsernameRequestDTO,
  ) {
    return await this.moderatorService.updateModeratorUsername(request);
  }

  @Get('/find/all')
  public async getAllModerators(): Promise<GetAllModeratorsResponseDTO[]> {
    return await this.moderatorService.getAllModerators();
  }

  @Put('/update/deactivateModeratorAccount')
  public async frozeModeratorAccount(
    @Body() request: UpdateModeratorFrozenRequestDTO,
  ) {
    return await this.moderatorService.deactivateModeratorAccount(request);
  }

  @Put('/update/moderatorAvatarUrl')
  public async updateModeratorAvatarUrl(
    @Body() request: UpdateModeratorAvatarUrlRequestDTO,
  ) {
    return await this.moderatorService.updateModeratorAvatar(request);
  }

  @Put('/update/realname')
  public async updateRealname(
    @Body() request: UpdateModeratorRealnameRequestDTO,
  ) {
    return await this.moderatorService.updateRealname(request);
  }

  @Put('/update/accountType')
  public async updateAccountType(
    @Body() request: UpdateModeratorAccountTypeRequestDTO,
  ) {
    return await this.moderatorService.updateAccountType(request);
  }

  @Put('/update/moderatorEmailAddress')
  public async updateModeratorEmail(
    @Body() request: UpdateModeratorEmailRequestDTO,
  ) {
    return await this.moderatorService.updateModeratorEmail(request);
  }

  @Put('/update/moderatorGender')
  public async updateModeratorGenderUrl(
    @Body() request: UpdateModeratorGenderRequestDTO,
  ) {
    return await this.moderatorService.updateModeratorGender(request);
  }

  @Put('/update/deleteModerator')
  public async deleteModerator(
    @Body() request: UpdateModeratorIsDeletedRequestDTO,
  ) {
    return await this.moderatorService.deleteModerator(request);
  }

  @Put('/update/phoneNumber')
  public async updatePhoneNumber(
    @Body() request: UpdateModeratorPhoneNumberRequestDTO,
  ) {
    return await this.moderatorService.updatePhoneNumber(request);
  }

  @Put('/update/birthDate')
  public async updateBirthDate(
    @Body() request: UpdateModeratorBirthDateRequestDTO,
  ) {
    return await this.moderatorService.updateModeratorBirthDate(request);
  }

  @Put('/update/moderatorAddress')
  public async updateModeratorAddress(
    @Body() request: UpdateModeratorAddressRequestDTO,
  ) {
    return await this.moderatorService.updateModeratorAddress(request);
  }

  @Put('/update/moderatorIsEmailVerified')
  public async updateModeratorIsEmailVerified(
    @Body() request: UpdateModeratorIsEmailVerifiedRequestDTO,
  ) {
    return await this.moderatorService.updateModeratorIsEmailVerified(request);
  }

  @Put('/update/moderatorIsPhoneVerified')
  public async updateModeratorIsPhoneVerified(
    @Body() request: UpdateModeratorIsPhoneVerifiedRequestDTO,
  ) {
    return await this.moderatorService.updateModeratorIsPhoneVerified(request);
  }

  @Put('/update/moderatorLastLoginDate')
  public async updateModeratorLastLoginDate(
    @Body() request: UpdateModeratorLastLoginDateRequestDTO,
  ) {
    return await this.moderatorService.updateModeratorLastLoginDate(request);
  }

  @Put('/update/moderatorLastLogoutDate')
  public async updateModeratorLastLogoutDate(
    @Body() request: UpdateModeratorLastLogoutDateRequestDTO,
  ) {
    return await this.moderatorService.updateModeratorLastLogoutDate(request);
  }

  @Get('/find/filter')
  public async paginate(@Query() request: PaginationQueryDTO) {
    return await this.moderatorService.paginate(request);
  }
}
