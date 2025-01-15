import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IFile } from '@biaplanner/shared';

@Entity('files')
export class FileEntity implements IFile {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  updatedAt: string;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  fileName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  originalFileName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  filePath: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  mimeType: string;
}
