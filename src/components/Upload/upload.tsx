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
  /**必选参数, 上传的地址 */
  action: string;
  /**上传的文件列表,*/
  defaultFileList?: IUploadFile[];
  /**上传文件之前的钩子，参数为上传的文件，若返回 false 或者 Promise 则停止上传。 */
  beforeUpload?: (file: File) => boolean | Promise<File>;
  /**是否支持拖拽上传 */
  drag?: boolean;
  /**文件状态改变时的钩子，上传成功或者失败时都会被调用	 */
  onChange?: (file: File) => void;
  /**文件列表移除文件时的钩子 */
  onRemove?: (file: IUploadFile) => void;
  /**文件上传成功时的钩子 */
  onSuccess?: (data: any, file: File) => void;
  /**文件上传失败时的钩子 */
  onError?: (err: any, file: File) => void;
  /**文件上传时的钩子函数 */
  onProgress?: (percentage: number, file: File) => void;
  /**接受上传的文件类型 */
  accept?: string;
  /**上传时附带的额外参数 */
  data?: { [key: string]: any };
  /**设置上传的请求头部 */
  headers?: { [key: string]: any };
  /**上传的文件字段名 */
  name?: string;
  /**是否支持多选文件 */
  multiple?: boolean;
  /**是否支持发送 cookie 凭证信息 */
  withCredentials?: boolean;
}

/**
 * 通过点击或者拖拽上传文件
 * ### 引用方法
 *
 * ~~~js
 * import { Upload } from 'react-tangram'
 * ~~~
 */
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
  name: 'file',
};

export default Upload;
