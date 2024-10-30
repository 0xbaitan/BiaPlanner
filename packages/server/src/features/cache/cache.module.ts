import {
  CACHE_MODULE_OPTIONS,
  CacheModuleAsyncOptions,
  CacheStore,
  CacheModule as NestCacheModule,
} from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';

import { CacheService } from './cache.service';
import { Environment } from 'src/environment';
import { redisStore } from 'cache-manager-redis-yet';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync<CacheModuleAsyncOptions>({
      useFactory: async () => {
        const [host, port] = Environment.getRedistHostAndPort();
        const store = await redisStore({
          socket: { host, port },
        });
        return {
          isGlobal: true,
          store: store as unknown as CacheStore,
          ttl: 3 * 60 * 1000,
        };
      },
    }),
  ],

  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
