import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { Repository } from 'typeorm';
import { IFile } from '@biaplanner/shared';
import path from 'path';
import fs from 'fs';
@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async registerFile(file: Express.Multer.File) {
    const newFile = this.fileRepository.create({
      fileName: file.filename,
      originalFileName: file.originalname,
      filePath: file.path,
      mimeType: file.mimetype,
    });

    return this.fileRepository.save(newFile);
  }

  async getFile(id: string): Promise<IFile> {
    return this.fileRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async deleteFile(id: string): Promise<void> {
    const file = await this.fileRepository.findOneOrFail({
      where: {
        id,
      },
    });
    const filePath = path.resolve('uploads/images', file.fileName);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted successfully');
      }
    });

    await this.fileRepository.delete(id);
  }
}
