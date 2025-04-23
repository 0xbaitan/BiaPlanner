import { useGetFileQuery, useLazyGetFileQuery } from "@/apis/FilesApi";

import { IFile } from "@biaplanner/shared";
import { ImageListType } from "react-images-uploading";
import { get } from "http";
import { getImagePath } from "@/util/imageFunctions";
import { useCallback } from "react";

export default function useGetImageFile() {
  const getImageFile = useCallback(
    async (imageFile: IFile | undefined, cb: (im: ImageListType) => void) => {
      if (!imageFile) {
        return cb([]);
      }

      const imagePath = getImagePath(imageFile);
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const file = new File([blob], imageFile.fileName, { type: imageFile.mimeType });
      const imageList: ImageListType = [
        {
          dataUrl: URL.createObjectURL(file),
          file,
          name: imageFile.fileName,
          id: imageFile.id,
        },
      ];
      return cb(imageList);
    },

    []
  );

  return getImageFile;
}
