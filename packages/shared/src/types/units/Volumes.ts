export enum Volumes {
  LITRE = "L",
  MILLILITRE = "mL",
  GALLON = "gal",
  QUART = "qt",
  PINT = "pt",
  CUP = "cup",
  TABLESPOON = "tbsp",
  TEASPOON = "tsp",
  FLUID_OUNCE = "fl oz",
  CUBIC_METRE = "m3",
  CUBIC_CENTIMETRE = "cm3",
  CUBIC_INCH = "in3",
}

export const VolumesArray = Object.entries(Volumes).map(([key, value]) => ({ key, value }));
