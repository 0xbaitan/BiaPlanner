import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { Repository } from 'typeorm';
import { IFile } from '@biaplanner/shared';

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
}
