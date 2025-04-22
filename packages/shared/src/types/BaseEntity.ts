import { z } from "zod";

export interface IBaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export const ReadEntityDtoSchema = z.object({
  id: z.string().min(1, { message: "Id is required" }),
});

export type IReadEntityDto = z.infer<typeof ReadEntityDtoSchema>;
