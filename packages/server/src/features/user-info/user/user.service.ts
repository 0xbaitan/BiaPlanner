import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import {
  DeleteRequestUserDto,
  ICreateRequestUserDto,
  IReadRequestUserDto,
  IUpdateRequestUserDto,
  IUser,
} from '@biaplanner/shared';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

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
    const user = await this.userRepository.findOneOrFail({
      where: [{ id: dto.id }, { username: dto.username }, { email: dto.email }],
      relations: ['phoneEntries'],
    });
    return user;
  }

  public async createUser(dto: ICreateRequestUserDto): Promise<IUser> {
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
