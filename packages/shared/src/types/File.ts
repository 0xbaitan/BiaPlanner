import { IBaseEntity } from "./BaseEntity";
import { z } from "zod";
import { zfd } from "zod-form-data";
export interface IFile extends IBaseEntity {
  fileName: string;
  originalFileName: string;
  filePath: string;
  mimeType: string;
}

export const FileSchema = z.object({
  fileName: z.string().min(1),
  originalFileName: z.string().min(1),
  filePath: z.string().min(1),
  mimeType: z.string().min(1),
});
export const ImageTypeSchema = zfd.formData({
  file: zfd
    .file(
      z
        .instanceof(File)
        .refine((file) => file.size <= 1024 * 1024, {
          message: "File size must be less than 1MB",
        })
        .refine((file) => file.type.startsWith("image/"), {
          message: "File must be an image",
        })
    )
    .optional(),
  dataURL: z.string().optional(),
});

export type IImageType = z.infer<typeof ImageTypeSchema>;

export const ImageTypeExtendedSchema = ImageTypeSchema._def.schema.extend(FileSchema._def.shape());

export const ImageTypeExtendedListSchema = ImageTypeExtendedSchema.array();
export type IImageTypeExtended = z.infer<typeof ImageTypeExtendedSchema>;
export type IImageTypeExtendedList = z.infer<typeof ImageTypeExtendedListSchema>;
