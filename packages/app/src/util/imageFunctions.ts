export function createBlobUrlFromArrayBuffer(arrayBuffer: ArrayBuffer, mimeType: string) {
  const blob = new Blob([arrayBuffer], { type: mimeType });
  return URL.createObjectURL(blob);
}
