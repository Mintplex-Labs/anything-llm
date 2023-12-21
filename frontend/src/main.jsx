import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router } from "react-router-dom";
import App from './App'
import './ipc/node-api'
import './index.css'
const isDev = process.env.NODE_ENV !== "production";
const REACTWRAP = isDev ? React.Fragment : React.StrictMode;
const basename = process.env.PUBLIC_URL === '.' ? '#' : process.env.PUBLIC_URL;

ReactDOM.createRoot(document.getElementById('root')).render(
  <REACTWRAP>
    <Router basename={basename}>
      <App />
    </Router>
  </REACTWRAP>,
)

