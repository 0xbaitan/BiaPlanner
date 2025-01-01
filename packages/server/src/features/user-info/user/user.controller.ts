import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, IUser, UpdateUserDto } from '@biaplanner/shared';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<IUser[]> {
    const users = await this.userService.findAllUsers();
    return users;
  }

  @Get('/:id')
  async readUser(@Param('id') id: string): Promise<IUser> {
    const user = await this.userService.findUser(id);
    return user;
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<IUser> {
    const user = await this.userService.createUser(dto);
    return user;
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<IUser> {
    const user = await this.userService.updateUser(id, dto);
    return user;
  }
}
