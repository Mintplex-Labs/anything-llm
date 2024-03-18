import { ipcRenderer } from "electron";
import {
  READY_EVENT_NAME,
  _API_BASE_URL,
  _APP_VERSION,
} from "@/utils/constants";
import { API_BASE } from "@/utils/api";
import System from "@/models/system";

ipcRenderer.on("main-process-message", (_event, ...args) => {
  console.log("\x1b[32m[Received Main-process message]\x1b[0m:", ...args);
});

ipcRenderer.on("backend-server-online", async (_evt, message) => {
  console.log(
    "\x1b[32m[Received backend-server-online message]\x1b[0m:",
    message
  );
  _API_BASE_URL.value = message.API_BASE;
  _APP_VERSION.value = message.APP_VERSION;
  Object.freeze(_API_BASE_URL);
  Object.freeze(_APP_VERSION);

  let polling = true;
  while (polling) {
    console.log(
      `\x1b[32m[AnythingLLM${
        _APP_VERSION.value ? ` v${_APP_VERSION.value}` : ""
      }]\x1b[0m Polling for server...`
    );
    const online = await System.ping();
    polling = !online;
    await new Promise((r) => setTimeout(r, 1_000));
  }

  const readyEvent = new CustomEvent(READY_EVENT_NAME, {
    detail: message.API_BASE,
  });
  window.dispatchEvent(readyEvent);
  API_BASE();
});

export function refocusApplication() {
  ipcRenderer.send("focus-fix");
  return;
}

export function openElectronWindow(url) {
  ipcRenderer.send("open-child-win", { url });
  return;
}
