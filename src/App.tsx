import React from 'react';
import './App.css';
import Menu from './components/Menu/menu';
import MenuItem from './components/Menu/menuItem';
import SubMenu from './components/Menu/subMenu';
import './styles/index.scss';

function App() {
  return (
    <div className="App">
      <Menu onSelect={index => console.log(index)} defaultOpenSubMenus={['2']} mode="vertical">
        <MenuItem>111</MenuItem>
        <MenuItem disabled={true}>222</MenuItem>
        <SubMenu title="333">
          <MenuItem>333-111</MenuItem>
          <MenuItem>333-222</MenuItem>
        </SubMenu>
      </Menu>
    </div>
  );
}

export default App;
