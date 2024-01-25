import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const appElement = document.createElement('div');
appElement.id = 'anythingllm-embedded';
document.body.appendChild(appElement);

const root = ReactDOM.createRoot(appElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
