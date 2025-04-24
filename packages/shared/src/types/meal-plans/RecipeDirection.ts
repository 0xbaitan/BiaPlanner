import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const RecipeDirectionSchema = z.object({
  order: z.coerce.number().int().positive(),
  text: z.coerce.string().min(1, { message: "Direction text is required" }),
});

export type IRecipeDirection = z.infer<typeof RecipeDirectionSchema>;

export class RecipeDirection extends createZodDto(RecipeDirectionSchema) {}
