import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/UserEntity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  public async getHello(): Promise<string> {
    const user = await this.userRepository.findOne({
      where: {
        id: 1,
      },
    });
    return `Hello World! ${user.firstName} ${user.lastName}`;
  }
}
