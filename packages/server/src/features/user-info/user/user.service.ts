import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { User } from '@biaplanner/shared';

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
    const user = await this.userRepository.findOne({ where: { id }, relations: ['phoneEntries'] });
    return user;
  }

  public async addUser(user: User): Promise<User> {
     const addedUser = await this.userRepository.save(user)
     return addedUser;
  }
}
