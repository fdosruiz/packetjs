import React from 'react';
import ReactDOM from 'react-dom/client';
import container from './dependency-injection';
import App from './App.tsx';
import './css/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App
      hooks={container.getAll()}
      properties={container.getProps()}
    />
  </React.StrictMode>,
)
