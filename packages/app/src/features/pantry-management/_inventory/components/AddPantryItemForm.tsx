import { ZodType, z } from "zod";

import { IPantryItem } from "@biaplanner/shared";

export type AddPantryItemFormData = Omit<IPantryItem, "id" | "user" | "brand" | "product">;

export type AddPantryItemFormProps = {
  initialValues?: AddPantryItemFormData;
};

export const AddPantryItemFormValidationSchema: ZodType<AddPantryItemFormData> = z.object({
  brandedItemName: z.string().min(1, "Branded item name must be at least 1 character"),
  brandId: z.number().optional(),
  expiryDate: z
    .string()
    .datetime({
      message: "Expiry date must be a valid date",
    })
    .optional(),
  bestBeforeDate: z
    .string()
    .datetime({
      message: "Best before date must be a valid date",
    })
    .optional(),
  manufacturedDate: z
    .string()
    .datetime({
      message: "Manufactured date must be a valid date",
    })
    .optional(),
  openedDate: z
    .string()
    .datetime({
      message: "Opened date must be a valid date",
    })
    .optional(),
  millisecondsToExpiryAfterOpening: z.number().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export default function AddPantryItemForm() {}
