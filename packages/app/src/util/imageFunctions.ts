import { IFile } from "@biaplanner/shared";

export function createBlobUrlFromArrayBuffer(arrayBuffer: ArrayBuffer, mimeType: string) {
  const blob = new Blob([arrayBuffer], { type: mimeType });
  return URL.createObjectURL(blob);
}

export function getImagePath(file: IFile | null | undefined): string {
  if (file && file.mimeType.match(/\/(jpg|jpeg|png|gif|avif)$/) && file.filePath) {
    const filePathFromUploads = file.filePath.substring(file.filePath.indexOf("uploads"));

    return `http://localhost:4000/${filePathFromUploads}`;
  }

  return "http://localhost:3000/images/placeholders/no_img_1200x800.png";
}
