import "../styles/ImageSelector.scss";

import ImageUploading, { ImageListType } from "react-images-uploading";
import React, { HTMLAttributes, useCallback, useEffect } from "react";

import Button from "react-bootstrap/Button";
import { FaUpload } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

export type ImageSelectorProps = {
  helpText?: string;
  uploadButtonText?: string;
  onChange?: (imageList: ImageListType) => void;
} & Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

export default function ImageSelector(props: ImageSelectorProps) {
  const { helpText, uploadButtonText, className, onChange: onCustomChange, ...rest } = props;
  const [image, setImage] = React.useState<ImageListType>([]);

  const onChange = useCallback((imageList: ImageListType) => {
    setImage(() => imageList);
  }, []);

  useEffect(() => {
    if (onCustomChange) {
      onCustomChange(image);
    }
  }, [image, onCustomChange]);

  return (
    <div {...rest} className={["bp-image_selector", className ?? ""].join(" ")}>
      <ImageUploading value={image} onChange={onChange} maxNumber={1} dataURLKey="dataUrl">
        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => {
          const imageUrl = imageList.length > 0 ? imageList[0].dataUrl : undefined;

          return (
            <div className="bp-image_selector__upload_box">
              <div className={["bp-image_selector__upload_box__controls", imageUrl ? "+image-selected" : ""].join(" ")}>
                <Button style={isDragging ? { color: "red" } : undefined} onClick={onImageUpload} {...dragProps}>
                  <FaUpload /> <span className="ms-1">{uploadButtonText ?? "Upload image"}</span>
                </Button>
                {helpText && <span className="bp-image_selector__upload_box__controls__help_text">{helpText} </span>}

                {/* &nbsp; */}
                {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
                {/* {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image["data_url"]} alt="" width="100" />
                  <div className="image-item__btn-wrapper">
                    <button onClick={() => onImageUpdate(index)}>Update</button>
                    <button onClick={() => onImageRemove(index)}>Remove</button>
                  </div>
                </div>
              ))} */}
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
