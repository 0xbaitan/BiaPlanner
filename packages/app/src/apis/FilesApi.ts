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
    deleteImage: build.mutation<IFile, string>({
      query: (id) => ({
        url: `/files/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, id) => [
        { type: "File", id },
        { type: "File", id: "LIST" },
      ],
    }),
    getFile: build.query<IFile, string>({
      query: (id) => ({
        url: `/files/metadata/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "File", id }],
    }),
  }),
});

export const { useUploadFileMutation, useUploadImageFileMutation, useDeleteImageMutation, useGetFileQuery, useLazyGetFileQuery } = FilesApi;
