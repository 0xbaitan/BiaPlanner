import { IBaseEntity } from "./BaseEntity";

export interface IFile extends IBaseEntity {
  fileName: string;
  originalFileName: string;
  filePath: string;
  mimeType: string;
}
