import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  IUser,
  UpdateRequestUserDto,
  CreateRequestUserDto,
  ISanitisedUser,
  SanitisedUser,
} from '@biaplanner/shared';
import { LocalGuard } from '../authentication/local.guard';
import { plainToClass, plainToInstance } from 'class-transformer';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<ISanitisedUser[]> {
    const users = await this.userService.readAllUsers();
    return plainToInstance(SanitisedUser, users);
  }

  @Get('/:id')
  async readUser(@Param('id') id: number): Promise<ISanitisedUser> {
    const user = await this.userService.readUser({ id });
    return plainToInstance(SanitisedUser, user);
  }

  @Post()
  async createUser(@Body() dto: CreateRequestUserDto): Promise<ISanitisedUser> {
    const user = await this.userService.createUser(dto);
    return plainToInstance(SanitisedUser, user);
  }

  @Put()
  async updateUser(@Body() dto: UpdateRequestUserDto): Promise<ISanitisedUser> {
    const user = await this.userService.readUser({ id: dto.id });
    return plainToInstance(SanitisedUser, user);
  }
}
