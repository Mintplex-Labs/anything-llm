import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
const appElement = document.createElement("div");

document.body.appendChild(appElement);
const root = ReactDOM.createRoot(appElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export const embedderSettings = {
  settings: Object.assign({}, document?.currentScript?.dataset || {}),
};
