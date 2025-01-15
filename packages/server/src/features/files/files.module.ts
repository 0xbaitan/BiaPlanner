import { FileEntity } from './file.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import mime from 'mime-types';
import path from 'path';
import { v6 as uuuidv6 } from 'uuid';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    ServeStaticModule.forRoot({
      rootPath: path.resolve('uploads'),
      serveRoot: '/uploads',
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: path.resolve('uploads'),
        filename: (_req, file, cb) => {
          const ext = mime.extension(file.mimetype);
          const fileIdentifier = uuuidv6();
          const fileName = `${fileIdentifier}.${ext}`;
          cb(null, fileName);
        },
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [],
})
export class FilesModule {}
