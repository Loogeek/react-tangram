import React, { FC } from 'react';
import Icon from '../Icon';
import { IUploadFile } from './upload';
import Progress from '../Progress';

interface IUploadListProps {
  fileList: IUploadFile[];
  onRemove: (file: IUploadFile) => void;
}

export const UploadList: FC<IUploadListProps> = (props) => {
  const { fileList, onRemove } = props;
  return (
    <ul className="react-tangram-upload-list">
      {fileList.map((item) => (
        <li className="react-tangram-upload-list-item" key={item.uid}>
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
          {item.status === 'uploading' && <Progress percent={item.percent || 0} />}
        </li>
      ))}
    </ul>
  );
};

export default UploadList;
