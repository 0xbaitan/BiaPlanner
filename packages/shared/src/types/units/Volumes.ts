export enum Volumes {
  LITRE = "l",
  MILLILITRE = "ml",
  GALLON = "gal",
  QUART = "qt",
  PINT = "pnt",
  CUP = "cup",
  TABLESPOON = "Tbs",
  TEASPOON = "tsp",
  FLUID_OUNCE = "fl-oz",
  CUBIC_METRE = "m3",
  CUBIC_CENTIMETRE = "cm3",
  CUBIC_INCH = "in3",
}

export const VolumesArray = Object.entries(Volumes).map(([key, value]) => ({ key, value }));
