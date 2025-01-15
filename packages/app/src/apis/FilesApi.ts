import { IFile } from "@biaplanner/shared";
import { rootApi } from ".";

export const FilesApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    uploadFile: build.mutation<IFile, FormData>({
      query: (data) => ({
        url: `/files`,
        method: "POST",
        body: data,
        responseType: "json",
      }),
    }),
    uploadImageFile: build.mutation<IFile, FormData>({
      query: (data) => ({
        url: `/files/image`,
        method: "POST",
        body: data,
        responseType: "json",
      }),
    }),
  }),
});

export const { useUploadFileMutation, useUploadImageFileMutation } = FilesApi;
