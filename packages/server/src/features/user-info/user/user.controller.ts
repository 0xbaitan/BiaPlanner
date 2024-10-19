import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@biaplanner/shared';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.find(id);
  }
}
