import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Alert from './alert';

const defaultAlert = () => {
  return <Alert title="this is alert!"></Alert>;
};

const stylesAlert = () => {
  return (
    <>
      <Alert title="this is Success" type="success"></Alert>
      <Alert title="this is Danger!" type="danger"></Alert>
      <Alert title="this is Warning!" type="warning" closable={false}></Alert>
    </>
  );
};
const descAlert = () => {
  return (
    <Alert
      title="提示标题欧亲"
      description="this is a long description"
      onClose={action('closed')}
    ></Alert>
  );
};
storiesOf('第四章作业：Alert', module)
  .add('Alert', defaultAlert)
  .add('不同样式的 Alert', stylesAlert)
  .add('添加描述的 Alert', descAlert);
