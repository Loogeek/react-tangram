import React from 'react';
import { storiesOf } from '@storybook/react';
import Icon from './icon';
import Button from '../Button';

const defaultIcons = () => (
  <>
    <Icon icon="check" size="3x" />
    <Icon icon="times" size="3x" />
    <Icon icon="anchor" size="3x" />
    <Icon icon="trash" size="3x" />
    <Button size="lg" btnType="primary">
      <Icon icon="check" /> check{' '}
    </Button>
  </>
);

const themeIcons = () => (
  <>
    <Icon icon="check" size="3x" theme="success" />
    <Icon icon="times" size="3x" theme="danger" />
    <Icon icon="anchor" size="3x" theme="primary" />
    <Icon icon="exclamation-circle" size="3x" theme="warning" />
  </>
);

const customIcons = () => (
  <>
    <Icon icon="spinner" size="3x" theme="primary" spin />
    <Icon icon="spinner" size="3x" theme="success" pulse />
  </>
);

storiesOf('第七章：Icon', module)
  .add('Icon', defaultIcons)
  .add('不同主题的 Icon', themeIcons)
  .add('更多行为的 Icon', customIcons, {
    info: { text: '更多例子请参见：https://github.com/FortAwesome/react-fontawesome#basic' },
  });
