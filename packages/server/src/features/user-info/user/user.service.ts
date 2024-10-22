import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { User, UserDto } from '@biaplanner/shared';
import dayjs from 'dayjs';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  public async find(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['phoneEntries'],
    });
    return user;
  }

  public async addUser(user: User): Promise<User> {
    const addedUser = await this.userRepository.save(user);
    return addedUser;
  }

  public async updateUser(id: number, user: User): Promise<User> {
    const existingUser = this.userRepository.findOneOrFail({
      where: {
        id: id,
      },
      relations: ['phoneEntries'],
    });

    return this.userRepository.save({
      ...existingUser,
      ...user,
    });
  }

  public convertToUserDto(user: User): UserDto {
    const userDto: UserDto = {
      ...user,
      dateOfBirth: dayjs(user.dateOfBirth).toISOString(),
    };
    return userDto;
  }

  public convertFromUserDto(userDto: UserDto): User {
    const user: User = {
      ...userDto,
      dateOfBirth: dayjs(userDto.dateOfBirth).toDate(),
    };
    return user;
  }
}
