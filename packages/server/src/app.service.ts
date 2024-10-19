import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}
  public async getHello(): Promise<string> {
    return 'Hello world!';
  }
}
