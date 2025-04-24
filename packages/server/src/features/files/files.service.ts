import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { DeepPartial, Repository } from 'typeorm';
import { IFile } from '@biaplanner/shared';
import path from 'path';
import mime from 'mime-types';
import fs from 'fs';
@Injectable()
export class FilesService {
  private static readonly UPLOAD_DIR = path.resolve(
    '/usr/src/packages/server/uploads',
  );
  private static readonly TEMP_DIR = path.resolve(
    '/usr/src/packages/server/tmp',
  );
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async getFile(id: string): Promise<IFile> {
    return this.fileRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  private async moveFileFromTempToPermanent(
    file: Express.Multer.File,
    subdir: string,
  ) {
    const ext = mime.extension(file.mimetype);
    const destinationPath = path.resolve(
      FilesService.UPLOAD_DIR,
      subdir,
      `${path.basename(file.filename, path.extname(file.filename))}.${ext}`,
    );
    const sourcePath = path.resolve(
      FilesService.TEMP_DIR,
      path.basename(file.filename),
    );

    try {
      // Ensure the destination directory exists
      await fs.promises.mkdir(path.dirname(destinationPath), {
        recursive: true,
      });

      // Move the file
      await fs.promises.rename(sourcePath, destinationPath);
    } catch (err) {
      console.error('Error during file operation:', err);
      throw err;
    }

    return destinationPath;
  }

  public async deleteFileFromTemp(file: Express.Multer.File) {
    const tempFilePath = path.resolve('/tmp/', file.destination);

    try {
      await fs.promises.access(tempFilePath, fs.constants.R_OK);
      await fs.promises.unlink(tempFilePath);
      console.log('File deleted successfully');
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }

  private async deleteFileFromPermanent(file: IFile) {
    const filePath = path.resolve(file.filePath);

    try {
      await fs.promises.unlink(filePath);
      console.log('File deleted successfully');
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }

  async unregisterExistingFile(id: string): Promise<void> {
    const existingFileMetadata = await this.fileRepository.findOneOrFail({
      where: {
        id,
      },
    });

    await this.deleteFileFromPermanent(existingFileMetadata);
    await this.fileRepository.softDelete({
      id,
    });
  }

  async overrideExistingFile(
    id: string,
    newFile: Express.Multer.File,
    subdir: string,
  ): Promise<IFile> {
    const existingFileMetadata = await this.fileRepository.findOneOrFail({
      where: {
        id,
      },
    });

    const destinationPath = await this.moveFileFromTempToPermanent(
      newFile,
      subdir,
    );

    const newFileName = path.basename(destinationPath);

    const newFilePath = path.resolve('uploads', subdir, newFileName);

    const updatedFileMetaData: DeepPartial<IFile> = {
      id: existingFileMetadata.id,
      fileName: newFileName,
      originalFileName: newFile.originalname,
      filePath: newFilePath,
      mimeType: newFile.mimetype,
    };

    this.fileRepository.update(id, updatedFileMetaData);

    const updatedFile = await this.fileRepository.findOneOrFail({
      where: {
        id,
      },
    });

    await this.deleteFileFromPermanent(existingFileMetadata);

    return updatedFile;
  }

  async registerNewFile(
    file: Express.Multer.File,
    subdir: string,
  ): Promise<IFile> {
    try {
      const destinationPath = await this.moveFileFromTempToPermanent(
        file,
        subdir,
      );

      const newFileName = path.basename(destinationPath);
      const extension = mime.extension(file.mimetype);
      const newFilePath = path.resolve(
        'uploads',
        subdir,
        file.filename + '.' + extension,
      );

      const newFileMetaData: DeepPartial<IFile> = {
        fileName: newFileName,
        originalFileName: file.originalname,
        filePath: newFilePath,
        mimeType: file.mimetype,
      };

      const newFile = this.fileRepository.create(newFileMetaData);
      await this.fileRepository.save(newFile);

      return newFile;
    } catch (error) {
      console.error('Error registering new file:', error);
      throw error; // Rethrow the error to handle it in the controller
    }
  }
}
