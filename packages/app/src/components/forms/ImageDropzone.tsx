import "@/styles/forms/ImageDropzone.scss";

import { DropzoneInputProps, FileWithPath, useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";

import { URL } from "url";
import { createBlobUrlFromArrayBuffer } from "@/util/imageFunctions";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

export type ImageDropzoneProps = Omit<DropzoneInputProps, "onChange"> & {
  //   onChange: (files: FileWithPreview[]) => void;
};
export default function ImageDropzone(props: ImageDropzoneProps) {
  const { ...rest } = props;
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    // console.log(acceptedFiles);
    // console.log(acceptedFiles);

    // const filesWithPreviews: FileWithPreview[] = await Promise.all(
    //   acceptedFiles.map(async (file) => {
    //     const buffer = await file.arrayBuffer();
    //     return Object.assign(file, { preview: createBlobUrlFromArrayBuffer(buffer, file.type) });
    //   })
    // );
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
    },
    multiple: false,
    onDrop,
  });

  //   useEffect(() => {
  //     onChange(files);
  //   }, [files, onChange]);

  useEffect(() => {
    return () => {
      //   files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <section className="bp-image-dropzone">
      <div {...getRootProps({ className: "bp-container" })}>
        <input {...rest} {...getInputProps({})} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside className="bp-image-card-list">
        {files.map((file, index) => (
          <ImageThumbnail file={file} index={index} />
        ))}
      </aside>
    </section>
  );
}

export type ImageThumbnailProps = { file: FileWithPath; index: number };

function ImageThumbnail(props: ImageThumbnailProps) {
  const { file, index } = props;
  return (
    <div className="bp-image-card">
      {file.path}
      {/* <img src={file.preview} alt={`Thumbnail ${index}`} onLoad={() => URL.revokeObjectURL(file.preview)} /> */}
    </div>
  );
}
