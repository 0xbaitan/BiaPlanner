import { IPermissionGroup, WritePermissionDtoSchema, WritePermissionGroupDtoSchema } from "./Permission";

import { IBaseEntity } from "../BaseEntity";
import { IUser } from "./User";
import { z } from "zod";

export interface IRole extends IBaseEntity {
  name: string;
  description: string;
  permissions: IPermissionGroup;
  users?: IUser[];
}

export const WriteRoleDtoSchema = z.object({
  name: z.string().min(1, "Role name must be at least one character long").max(255, "Role name must be between 1 and 255 characters"),
  description: z.string().optional().nullable(),
  permissions: WritePermissionGroupDtoSchema,
});

export type IWriteRoleDto = z.infer<typeof WriteRoleDtoSchema>;
