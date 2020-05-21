import React, { FC, useState, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import UploadList from './uploadList';
import Dragger from './dragger';

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error';

export interface IUploadFile {
  uid: string;
  size: number;
  name: string;
  status?: UploadFileStatus;
  percent?: number;
  raw?: File;
  response?: any;
  error?: any;
}

export interface IUploadProps {
  action: string;
  defaultFileList?: IUploadFile[];
  beforeUpload?: (file: File) => boolean | Promise<File>;
  drag?: boolean;
  onChange?: (file: File) => void;
  onRemove?: (file: IUploadFile) => void;
  onSuccess?: (data: any, file: File) => void;
  onError?: (err: any, file: File) => void;
  onProgress?: (percentage: number, file: File) => void;
  accept?: string;
  data?: { [key: string]: any };
  headers?: { [key: string]: any };
  name?: string;
  multiple?: boolean;
  withCredentials?: boolean;
}

export const Upload: FC<IUploadProps> = (props) => {
  const {
    action,
    beforeUpload,
    onChange,
    onRemove,
    onSuccess,
    onError,
    onProgress,
    defaultFileList = [],
    accept,
    data,
    headers,
    name,
    multiple,
    withCredentials,
    drag,
    children,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState<IUploadFile[]>(defaultFileList);

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

  const handleRemove = (file: IUploadFile) => {
    setFileList((prevList) => {
      return prevList.filter((item) => item.uid !== file.uid);
    });
    if (onRemove) {
      onRemove(file);
    }
  };

  const updateFileList = (updateFile: IUploadFile, updateObj: Partial<IUploadFile>) => {
    setFileList((prevList) => {
      return prevList.map((file) => {
        if (file.uid === updateFile.uid) {
          return {
            ...updateFile,
            ...updateObj,
          };
        } else {
          return file;
        }
      });
    });
  };

  const uploadFiles = (files: FileList) => {
    const fileList = Array.from(files);
    fileList.forEach((file) => {
      if (!beforeUpload) {
        postFile(file);
      } else {
        const result = beforeUpload(file);

        if (result && result instanceof Promise) {
          result.then((processedFile) => postFile(processedFile));
        } else if (result !== false) {
          postFile(file);
        }
      }
    });
  };

  const postFile = (file: File) => {
    const _file: IUploadFile = {
      uid: Date.now() + 'upload-file',
      status: 'ready',
      name: file.name,
      size: file.size,
      percent: 0,
      raw: file,
    };

    setFileList((prevList) => {
      return [_file, ...prevList];
    });

    const formData = new FormData();
    formData.append(name || 'file', file);

    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }

    axios
      .post(action, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials,
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total) || 0;
          if (percent < 100) {
            updateFileList(_file, { percent, status: 'uploading' });
            if (onProgress) {
              onProgress(percent, file);
            }
          }
        },
      })
      .then((resp) => {
        updateFileList(_file, { percent: 100, status: 'success', response: resp.data });
        if (onSuccess) {
          onSuccess(resp.data, file);
        }

        if (onChange) {
          onChange(file);
        }
      })
      .catch((err) => {
        updateFileList(_file, { percent: 100, status: 'error', error: err });

        if (onError) {
          onError(err, file);
        }

        if (onChange) {
          onChange(file);
        }
      });
  };

  return (
    <div className="react-tangram-upload-component">
      <div
        className="armro-upload-input"
        onClick={handleUpload}
        style={{ display: 'inline-block' }}
      >
        {drag ? (
          <Dragger
            onFile={(files) => {
              uploadFiles(files);
            }}
          >
            {children}
          </Dragger>
        ) : (
          children
        )}
        <input
          type="file"
          className="react-tangram-file-input"
          style={{ display: 'none' }}
          ref={inputRef}
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
        />
      </div>

      <UploadList fileList={fileList} onRemove={handleRemove} />
    </div>
  );
};

Upload.defaultProps = {
  defaultFileList: [],
};

export default Upload;
