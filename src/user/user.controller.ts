import { Body, Controller, Get } from "@nestjs/common";
import { getUserByEmailRequestDTO } from "./dto/request/get-user-by-email-request.dto";
import { UserService } from "./user.service";
import { UserDTO } from "./dto/user.dto";

@Controller('user')
export class UserController{
    constructor(private readonly userService: UserService){}

    @Get()
    public async getUserByEmail(@Body() request: getUserByEmailRequestDTO): Promise<UserDTO>{
        return await this.userService.getUserByEmail(request);
    }
} 