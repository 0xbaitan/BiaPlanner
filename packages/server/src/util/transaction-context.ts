import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class TransactionContext {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async execute<T>(fn: (manager: EntityManager) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await fn(queryRunner.manager);
      await queryRunner.commitTransaction();
      console.info('Transaction committed successfully');
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
