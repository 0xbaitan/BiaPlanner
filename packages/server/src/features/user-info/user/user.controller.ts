import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  IUser,
  UpdateRequestUserDto,
  CreateRequestUserDto,
} from '@biaplanner/shared';
import { LocalGuard } from '../authentication/local.guard';

@UseGuards(LocalGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<IUser[]> {
    const users = await this.userService.readAllUsers();
    return users;
  }

  @Get('/:id')
  async readUser(@Param('id') id: number): Promise<IUser> {
    const user = this.userService.readUser({ id });
    return user;
  }

  @Post()
  async createUser(@Body() dto: CreateRequestUserDto): Promise<IUser> {
    return this.userService.createUser(dto);
  }

  @Put()
  async updateUser(@Body() dto: UpdateRequestUserDto): Promise<IUser> {
    return this.userService.updateUser(dto);
  }
}
