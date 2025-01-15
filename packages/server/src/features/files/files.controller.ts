import {
  Controller,
  Inject,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { IFile } from '@biaplanner/shared';
import path from 'path';

@Controller('/files')
export class FilesController {
  constructor(
    @Inject(FilesService) private readonly filesService: FilesService,
  ) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File): Promise<IFile> {
    return this.filesService.registerFile(file);
  }

  @Post('/image')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: path.resolve('uploads/images'),
    }),
  )
  uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /\/(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024, // 1MB
          message: 'File size must be less than 1MB',
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.registerFile(file);
  }
}
