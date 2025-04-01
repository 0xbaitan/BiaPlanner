import { IFile } from "@biaplanner/shared";

export function createBlobUrlFromArrayBuffer(arrayBuffer: ArrayBuffer, mimeType: string) {
  const blob = new Blob([arrayBuffer], { type: mimeType });
  return URL.createObjectURL(blob);
}

export function getImagePath(file: IFile) {
  if (!file || !file.mimeType.match(/\/(jpg|jpeg|png|gif|avif)$/) || !file.filePath) {
    return null;
  }
  return `localhost:4000/uploads/${file.filePath}`;
}
