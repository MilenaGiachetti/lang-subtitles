import React, { useEffect} from 'react';
import logo from '../../assets/images/logo.svg';
import './App.scss';
import youtube from '../../apis/youtube';

function App() {
  useEffect(() => {
    youtube.get('/search', {
      params: {
        q: 'cats'
      }
    }).then(response => {
      console.log(response);
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
