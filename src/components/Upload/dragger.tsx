import React, { FC, useState, DragEvent } from 'react';
import classNames from 'classnames';

export interface IDraggerProps {
  onFile: (files: FileList) => void;
}

export const Dragger: FC<IDraggerProps> = (props) => {
  const { onFile, children } = props;
  const [dragOver, setDragOver] = useState(false);
  const classes = classNames('react-tangram-uploader-dragger', {
    'is-dragover': dragOver,
  });

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    onFile(e.dataTransfer.files);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>, over: boolean) => {
    e.preventDefault();
    setDragOver(over);
  };

  return (
    <div
      className={classes}
      onDrop={handleDrop}
      onDragOver={(e) => {
        handleDrag(e, true);
      }}
      onDragLeave={(e) => {
        handleDrag(e, false);
      }}
    >
      {children}
    </div>
  );
};

export default Dragger;
