import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './services/firebase'

ReactDOM.render(           //exibe alguma coisa dentro do html
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
