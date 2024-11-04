import { CacheModule } from './features/cache/cache.module';
import PantryModule from './features/pantry/pantry.module';
import { UserInfoModule } from './features/user-info/user-info.module';

export const modules = [UserInfoModule, CacheModule, PantryModule];
