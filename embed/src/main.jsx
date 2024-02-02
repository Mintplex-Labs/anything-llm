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

const scriptSettings = Object.assign(
  {},
  document?.currentScript?.dataset || {}
);
export const embedderSettings = {
  settings: scriptSettings,
  USER_BACKGROUND_COLOR: `bg-[${scriptSettings?.userBgColor ?? "#2C2F35"}]`,
  AI_BACKGROUND_COLOR: `bg-[${scriptSettings?.assistantBgColor ?? "#2563eb"}]`,
};
