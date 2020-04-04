import React from 'react';
import './App.css';
import Menu, { IMenuProps } from './components/Menu/menu';
import MenuItem from './components/Menu/menuItem';
import SubMenu from './components/Menu/subMenu';
import './styles/index.scss';

const props: IMenuProps = {
  defaultIndex: '0',
  onSelect: () => {},
  className: 'test',
};

function App() {
  return (
    <div className="App">
      <Menu {...props}>
        <MenuItem>active</MenuItem>
        <MenuItem disabled>disabled</MenuItem>
        <MenuItem>xyz</MenuItem>
        <SubMenu title="dropdown">
          <MenuItem>drop1</MenuItem>
        </SubMenu>
        <SubMenu title="opened">
          <MenuItem>opened1</MenuItem>
        </SubMenu>
      </Menu>
    </div>
  );
}

export default App;
