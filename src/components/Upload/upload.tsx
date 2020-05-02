import React, { FC, useRef, ChangeEvent } from 'react';
import axios from 'axios';

import Button from '../Button';

export interface IUploadProps {
  action: string;
  defaultFileList?: File[];
  onChange?: (file: File) => void;
  onRemove?: (file: File) => void;
  onSuccess?: (data: any, file: File) => void;
  onError?: (err: any, file: File) => void;
  onProgress?: (percentage: number, file: File) => void;
}

export const Upload: FC<IUploadProps> = (props) => {
  const { action, onSuccess, onError, onProgress } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) {
      return;
    }

    uploadFiles(files);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const uploadFiles = (files: FileList) => {
    const fileList = Array.from(files);
    fileList.forEach((file) => {
      const formData = new FormData();
      formData.append(file.name, file);
      axios
        .post(action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (e) => {
            const percentage = Math.round((e.loaded * 100) / e.total) || 0;
            if (percentage < 100) {
              if (onProgress) {
                onProgress(percentage, file);
              }
            }
          },
        })
        .then((data) => {
          if (onSuccess) {
            onSuccess(data, file);
          }
        })
        .catch((err) => {
          if (onError) {
            onError(err, file);
          }
        });
    });
  };

  return (
    <div className="armor-upload-component">
      <Button onClick={handleUpload} btnType="primary">
        UploadFile
      </Button>
      <input type="file" style={{ display: 'none' }} ref={inputRef} onChange={handleFileChange} />
    </div>
  );
};

export default Upload;
