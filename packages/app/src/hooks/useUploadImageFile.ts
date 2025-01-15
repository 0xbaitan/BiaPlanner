import { useCallback } from "react";
import { useUploadImageFileMutation } from "@/apis/FilesApi";

export default function useUploadImageFile() {
  const [uploadFile] = useUploadImageFileMutation();

  const uploadImageFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const metadata = await uploadFile(formData).unwrap();
      return metadata;
    },
    [uploadFile]
  );

  return uploadImageFile;
}
