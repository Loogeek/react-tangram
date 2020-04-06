import React from 'react';
import './App.css';
import Tabs from './components/Tabs/tabs';
import TabItem from './components/Tabs/tabItem';
import Icon from './components/Icon/icon';
import './styles/index.scss';

function App() {
  return (
    <div className="App">
      <Tabs>
        <TabItem label="1111">this is content one</TabItem>
        <TabItem label="222">this is content two</TabItem>
      </Tabs>

      <Tabs defaultIndex={1} onSelect={(index) => console.log(index)} type="card">
        <TabItem
          label={
            <>
              <Icon icon="exclamation-circle" />
              {'  '}自定义图标
            </>
          }
        >
          this is content one
        </TabItem>
        <TabItem label="222">this is content two</TabItem>
      </Tabs>
    </div>
  );
}

export default App;
