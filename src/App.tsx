import React from 'react';
import './App.css';
import Button from './components/Button';
import './styles/index.scss';

function App() {
  return (
    <div className="App">
      <Button btnType="link" href="http://www.baidu.com">
        link
      </Button>
      <Button btnType="danger" target="_blank">
        link
      </Button>
      <Button btnType="primary" onClick={() => alert(1)}>
        link
      </Button>
      <Button btnType="default">link</Button>
      <Button size="lg">size lg</Button>
    </div>
  );
}

export default App;
