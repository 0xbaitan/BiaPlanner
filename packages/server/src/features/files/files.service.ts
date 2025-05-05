import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { DeepPartial, Repository, EntityManager } from 'typeorm';
import { IFile } from '@biaplanner/shared';
import path from 'path';
import mime from 'mime-types';
import fs from 'fs';
import { TransactionContext } from '@/util/transaction-context';

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
    private readonly transactionContext: TransactionContext,
  ) {}

  async getFile(id: string): Promise<IFile> {
    return this.fileRepository.findOneOrFail({ where: { id } });
  }

  async registerNewFile(
    file: Express.Multer.File,
    subdir: string,
  ): Promise<IFile> {
    return this.transactionContext.execute(async (manager) => {
      return this.registerNewFileWithManager(manager, file, subdir);
    });
  }

  async registerNewFileWithManager(
    manager: EntityManager,
    file: Express.Multer.File,
    subdir: string,
  ): Promise<IFile> {
    const destinationPath = await this.moveFileFromTempToPermanent(
      file,
      subdir,
    );
    const newFileName = path.basename(destinationPath);
    const newFilePath = path.resolve('uploads', subdir, newFileName);

    const newFileMetaData: DeepPartial<IFile> = {
      fileName: newFileName,
      originalFileName: file.originalname,
      filePath: newFilePath,
      mimeType: file.mimetype,
    };

    const newFile = manager.create(FileEntity, newFileMetaData);
    await manager.save(FileEntity, newFile);

    return newFile;
  }

  async overrideExistingFile(
    id: string,
    newFile: Express.Multer.File,
    subdir: string,
  ): Promise<IFile> {
    return this.transactionContext.execute(async (manager) => {
      return this.overrideExistingFileWithManager(manager, id, newFile, subdir);
    });
  }

  async overrideExistingFileWithManager(
    manager: EntityManager,
    id: string,
    newFile: Express.Multer.File,
    subdir: string,
  ): Promise<IFile> {
    const existingFileMetadata = await manager.findOneOrFail(FileEntity, {
      where: { id },
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

    await manager.update(FileEntity, id, updatedFileMetaData);
    await this.deleteFileFromPermanent(existingFileMetadata);

    return manager.findOneOrFail(FileEntity, { where: { id } });
  }

  async unregisterExistingFile(id: string): Promise<void> {
    return this.transactionContext.execute(async (manager) => {
      return this.unregisterExistingFileWithManager(manager, id);
    });
  }

  async unregisterExistingFileWithManager(
    manager: EntityManager,
    id: string,
  ): Promise<void> {
    const existingFileMetadata = await manager.findOneOrFail(FileEntity, {
      where: { id },
    });

    await this.deleteFileFromPermanent(existingFileMetadata);
    await manager.softDelete(FileEntity, { id });
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

    await fs.promises.mkdir(path.dirname(destinationPath), { recursive: true });
    await fs.promises.rename(sourcePath, destinationPath);

    return destinationPath;
  }

  private async deleteFileFromPermanent(file: IFile) {
    const filePath = path.resolve(file.filePath);

    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }
}
