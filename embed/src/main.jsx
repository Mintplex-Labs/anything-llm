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
  USER_STYLES: `bg-[${scriptSettings?.userBgColor ?? "#3DBEF5"}] text-white rounded-t-[18px] rounded-bl-[18px] rounded-br-[4px] mx-[20px]`,
  ASSISTANT_STYLES: `bg-[${scriptSettings?.assistantBgColor ?? "#FFFFFF"}] text-[#222628] rounded-t-[18px] rounded-br-[18px] rounded-bl-[4px] mr-[37px] ml-[9px]`,
};
