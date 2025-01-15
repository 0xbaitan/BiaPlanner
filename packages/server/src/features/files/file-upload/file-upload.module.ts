import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import path from 'path';

@Module({
  imports: [
    MulterModule.register({
      dest: path.join(__dirname, '..', '..', '..', '..', 'uploads'),
    }),
  ],
})
export class FileUploadModule {}
