export enum Weights {
  KILOGRAM = "kg",
  GRAM = "g",
  POUND = "lb",
  OUNCE = "oz",
  MILLIGRAM = "mg",
  MICROGRAM = "mcg",
}

export const WeightsArray = Object.entries(Weights).map(([key, value]) => ({ key, value }));
