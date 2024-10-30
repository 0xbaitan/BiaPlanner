import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CacheManagerStore } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private store: CacheManagerStore) {}

  async setValue<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.store.set(key, value, ttl);
  }

  async getValue<T>(key: string): Promise<T | undefined> {
    return this.store.get(key);
  }

  async deleteValue(key: string): Promise<void> {
    await this.store.del(key);
  }

  async resetCache(): Promise<void> {
    await this.store.reset();
  }
}
