import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserDto } from '@biaplanner/shared';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserDto[]> {
    const users = await this.userService.findAll();
    const userDtos = users.map((user) =>
      this.userService.convertToUserDto(user),
    );
    return userDtos;
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.find(id);
  }

  @Post()
  async addUser(@Body() userDto: UserDto): Promise<User> {
    const user = this.userService.convertFromUserDto(userDto);
    return this.userService.addUser(user);
  }

  @Put('/:id')
  async updateUser(@Param('id') id: number, @Body() userDto: UserDto) {
    return this.userService.updateUser(
      Number(id),
      this.userService.convertFromUserDto(userDto),
    );
  }
}
