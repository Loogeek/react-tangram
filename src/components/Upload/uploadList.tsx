import React, { FC } from 'react';
import Icon from '../Icon';
import { IUploadFile } from './upload';

interface IUploadListProps {
  fileList: IUploadFile[];
  onRemove: (file: IUploadFile) => void;
}

export const UploadList: FC<IUploadListProps> = (props) => {
  const { fileList, onRemove } = props;
  return (
    <ul className="armor-upload-list">
      {fileList.map((item) => (
        <li className="armor-upload-list-item" key={item.uid}>
          <span className={`file-name file-name-${item.status}`}>
            <Icon icon="file-alt" theme="secondary" />
            {item.name}
          </span>
          <span className="file-status">
            {item.status === 'uploading' && <Icon icon="spinner" spin theme="primary" />}
            {item.status === 'success' && <Icon icon="check-circle" theme="success" />}
            {item.status === 'error' && <Icon icon="times-circle" theme="danger" />}
          </span>
          <span className="file-actions">
            <Icon
              icon="times"
              onClick={() => {
                onRemove(item);
              }}
            />
          </span>
        </li>
      ))}
    </ul>
  );
};

export default UploadList;
