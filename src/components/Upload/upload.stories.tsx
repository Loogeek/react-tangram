import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Upload } from './upload';

const checkFileSize = (file: File) => {
  if (Math.round(file.size / 1024) > 50) {
    alert('file too big');
    return false;
  }
  return true;
};
const filePromise = (file: File) => {
  const newFile = new File([file], 'new_name.docx', { type: file.type });
  return Promise.resolve(newFile);
};

const SimpleUpload = () => {
  return (
    <Upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      onChange={action('changed')}
      beforeUpload={filePromise}
    />
  );
};

storiesOf('Upload', module).add('Upload', SimpleUpload);
