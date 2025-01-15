import { FileEntity } from './file.entity';
import { FileUploadModule } from './file-upload/file-upload.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [FileUploadModule, TypeOrmModule.forFeature([FileEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class FilesModule {}
