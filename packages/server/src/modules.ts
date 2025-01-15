import { CacheModule } from './features/cache/cache.module';
import { FilesModule } from './features/files/files.module';
import { MealPlanModule } from './features/meal-plan/meal-plan.module';
import PantryModule from './features/pantry/pantry.module';
import { ReminderModule } from './features/reminder/reminder.module';
import { UserInfoModule } from './features/user-info/user-info.module';

export const modules = [
  UserInfoModule,
  CacheModule,
  PantryModule,
  ReminderModule,
];
