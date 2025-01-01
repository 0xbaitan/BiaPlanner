import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import {
  CreateUserDto,
  IUser,
  IValidationError,
  UpdateUserDto,
} from '@biaplanner/shared';
import CustomValidationError from 'src/errors/CustomValidationError';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async validateUniqueUserFields(
    username: string,
    email: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    const payloads: IValidationError[] = [];
    if (user?.email === email) {
      payloads.push({
        property: 'email',
        constraints: {
          isUnique: 'Email already exists',
        },
      });
    }

    if (user?.username === username) {
      payloads.push({
        property: 'username',
        constraints: {
          isUnique: 'Username already exists',
        },
      });
    }

    if (payloads.length > 0) {
      throw new CustomValidationError(...payloads);
    }

    return;
  }

  public async verifyUserExists(login: string): Promise<IUser> {
    const user = await this.userRepository.findOne({
      where: [{ username: login }, { email: login }],
    });

    if (!user) {
      throw new CustomValidationError({
        property: 'login',
        constraints: {
          userExists: 'User does not exist',
        },
      });
    }

    return user;
  }

  public async getPasswordForUser(username: string): Promise<string> {
    const user = await this.userRepository.findOneOrFail({
      where: [{ username }],
    });
    return user.password;
  }

  public async findAllUsers(): Promise<IUser[]> {
    const users = await this.userRepository.find({
      relations: ['phoneEntries'],
    });
    return users;
  }

  public async findUser(id: string): Promise<IUser> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['phoneEntries'],
    });
    return user;
  }

  public async createUser(dto: CreateUserDto): Promise<IUser> {
    await this.validateUniqueUserFields(dto.username, dto.email);
    const newUser = this.userRepository.create(dto);
    return this.userRepository.save(newUser);
  }

  public async updateUser(id: string, dto: UpdateUserDto): Promise<IUser> {
    const existingUser = await this.findUser(id);
    const updateUser = this.userRepository.save({
      ...existingUser,
      ...dto,
    });

    return updateUser;
  }

  public async deleteUser(id: string): Promise<IUser> {
    const user = await this.findUser(id);
    await this.userRepository.softDelete(id);
    return user;
  }
}
