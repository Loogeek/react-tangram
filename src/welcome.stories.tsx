import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Welcome page', module).add(
  'welcome',
  () => {
    return (
      <>
        <h1>欢迎来到 React-tangram 组件库</h1>
        <p>React-tangram 是使用React Hooks和Typescript编写的组件库</p>
        <h3>安装试试</h3>
        <p>
          <code>$ npm install react-tangram --save</code>
        </p>
        <p>
          <code>$ yarn add react-tangram</code>
        </p>
      </>
    );
  },
  { info: { disable: true } }
);
