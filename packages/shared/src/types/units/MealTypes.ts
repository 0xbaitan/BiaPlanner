export enum MealTypes {
  BREAKFAST = "breakfast",
  LUNCH = "lunch",
  DINNER = "dinner",
}

export const MEAL_TYPES: IMealType[] = Object.entries(MealTypes).map(([key, value]) => ({ id: key, value }));

export interface IMealType {
  id: string;
  value: MealTypes;
}
