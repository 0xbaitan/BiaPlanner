import { Global, Module } from '@nestjs/common';

import { TransactionContext } from './util/transaction-context';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [TransactionContext],
  exports: [TransactionContext],
})
export class GlobalModule {}
