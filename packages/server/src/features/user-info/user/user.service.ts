import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import {
  DeleteRequestUserDto,
  ICreateRequestUserDto,
  IReadRequestUserDto,
  IUpdateRequestUserDto,
  IUser,
  IValidationError,
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

  public async getPasswordForUser(username: string): Promise<string> {
    const user = await this.userRepository.findOneOrFail({
      where: [{ username }],
    });
    return user.password;
  }

  public async readAllUsers(): Promise<IUser[]> {
    const users = await this.userRepository.find({
      relations: ['phoneEntries'],
    });
    return users;
  }

  public async readUser(dto: IReadRequestUserDto): Promise<IUser> {
    const user = await this.userRepository.findOne({
      where: [{ id: dto.id }, { username: dto.username }, { email: dto.email }],
      relations: ['phoneEntries'],
    });
    return user;
  }

  public async createUser(dto: ICreateRequestUserDto): Promise<IUser> {
    await this.validateUniqueUserFields(dto.username, dto.email);
    const newUser = this.userRepository.create(dto);
    return this.userRepository.save(newUser);
  }

  public async updateUser(dto: IUpdateRequestUserDto): Promise<IUser> {
    const existingUser = this.readUser({
      id: dto.id,
    });

    const updateUser = this.userRepository.save({
      ...existingUser,
      ...dto,
    });

    return updateUser;
  }

  public async deleteUser(dto: DeleteRequestUserDto): Promise<IUser> {
    const user = await this.userRepository.findOneOrFail({
      where: [{ id: dto.id }],
    });

    return await this.userRepository.remove(user);
  }
}
