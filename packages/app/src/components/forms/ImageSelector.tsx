import "../styles/ImageSelector.scss";

import ImageUploading, { ImageListType, ImageType } from "react-images-uploading";
import React, { HTMLAttributes, useCallback, useEffect } from "react";

import Button from "react-bootstrap/Button";
import { FaUpload } from "react-icons/fa";
import { IFile } from "@biaplanner/shared";
import { MdCancel } from "react-icons/md";
import { getImagePath } from "@/util/imageFunctions";

export type ImageSelectorProps = {
  helpText?: string;
  value?: File;
  valueMetadata?: IFile;
  uploadButtonText?: string;
  onChange?: (value: File | undefined) => void;
  isInitialised?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

export default function ImageSelector(props: ImageSelectorProps) {
  const { helpText, value, isInitialised: isInitialisedDefault, valueMetadata, uploadButtonText, className, onChange: onCustomChange, ...rest } = props;
  console.log(valueMetadata);
  const [file, setFile] = React.useState<File | undefined>(value);

  const [images, setImages] = React.useState<ImageListType>([]);

  const [isInitialised, setInitialised] = React.useState(isInitialisedDefault ?? false);

  const getImageFile = useCallback(async (imageFile: IFile | undefined) => {
    if (!imageFile) {
      return undefined;
    }

    const imagePath = getImagePath(imageFile);
    const response = await fetch(imagePath);
    const blob = await response.blob();
    const file = new File([blob], imageFile.fileName, { type: imageFile.mimeType });
    const imageTypeObj: ImageType = {
      dataUrl: URL.createObjectURL(file),
      file,
      name: imageFile.fileName,
      id: imageFile.id,
    };

    return imageTypeObj;
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (!file && !isInitialised) {
        getImageFile(valueMetadata).then((imageFile) => {
          if (imageFile) {
            setFile(imageFile.file);
            setInitialised(true);
            setImages([imageFile]);
          }
        });
      }
    }, 300);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [getImageFile, isInitialised, file, valueMetadata]);

  const onChange = useCallback((imageList: ImageListType) => {
    setImages(imageList);
    const imageFile = imageList.at(0);

    setFile(imageFile?.file);
  }, []);

  useEffect(() => {
    onCustomChange?.(file);
  }, [file, onCustomChange]);

  return (
    <div {...rest} className={["bp-image_selector", className ?? ""].join(" ")}>
      <ImageUploading value={images} onChange={onChange} maxNumber={1} dataURLKey="dataUrl">
        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => {
          const imageUrl = imageList.length > 0 ? imageList[0].dataUrl : undefined;

          return (
            <div className="bp-image_selector__upload_box">
              <div className={["bp-image_selector__upload_box__controls", imageUrl ? "+image-selected" : ""].join(" ")}>
                <Button style={isDragging ? { color: "red" } : undefined} onClick={onImageUpload} {...dragProps}>
                  <FaUpload /> <span className="ms-1">{uploadButtonText ?? "Upload image"}</span>
                </Button>
                {helpText && <span className="bp-image_selector__upload_box__controls__help_text">{helpText} </span>}
              </div>
              <div className={["bp-image_selector__upload_box__preview", imageUrl ? "+image-selected" : ""].join(" ")}>
                {imageUrl && <img className="bp-image_selector__upload_box__preview__image" src={imageUrl} alt="preview" onClick={() => onImageUpdate(0)} {...dragProps} />}
                <button type="button" className="bp-image_selector__upload_box__preview__remove" onClick={() => onImageRemove(0)}>
                  <MdCancel className="bp-image_selector__upload_box__preview__remove__icon" />
                </button>
              </div>
            </div>
          );
        }}
      </ImageUploading>
    </div>
  );
}
