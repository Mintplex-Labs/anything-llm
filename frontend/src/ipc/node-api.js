import { ipcRenderer } from "electron";
import {
  READY_EVENT_NAME,
  _API_BASE_URL,
  _APP_VERSION,
  _APP_PLATFORM,
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
  _APP_PLATFORM.value = message.APP_PLATFORM;
  Object.freeze(_API_BASE_URL);
  Object.freeze(_APP_VERSION);
  Object.freeze(_APP_PLATFORM);

  let polling = true;
  while (polling) {
    console.log(
      `\x1b[32m[AnythingLLM${_APP_VERSION.value
        ? ` v${_APP_VERSION.value} for ${_APP_PLATFORM.value}`
        : ""
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

/** @typedef {("not-determined" | "granted" | "denied" | "restricted" | "unknown")} MediaAccessLevelResponse */
/**
 * Get the user permission levels for media assets (microphone|camera|screen)
 * @returns {Promise<{microphone: MediaAccessLevelResponse, camera: MediaAccessLevelResponse, screen: MediaAccessLevelResponse}>}
 */
export async function getMediaAccessLevels() {
  ipcRenderer.send("get-media-access");
  return new Promise((resolve) => {
    const handleResponse = (_evt, message) => resolve(message)
    ipcRenderer.once('get-media-access-response', handleResponse);
    setTimeout(() => {
      ipcRenderer.removeListener('get-media-access-response', handleResponse);
      resolve({ microphone: false, camera: false, screen: false });
    }, 10_000);
  })
}

/**
 * Request media permission for (microphone|camera)
 * @property {'microphone'|'camera'}
 * @returns {Promise<{microphone: MediaAccessLevelResponse, camera: MediaAccessLevelResponse, screen: MediaAccessLevelResponse}>}
 */
export async function requestMediaAccess(mediaAsset) {
  ipcRenderer.send("request-media-access", { asset: mediaAsset });
  return new Promise((resolve) => {
    const handleResponse = (_evt, message) => resolve(message.enabled);
    ipcRenderer.once('request-media-access-response', handleResponse);
    setTimeout(() => {
      ipcRenderer.removeListener('request-media-access-response', handleResponse);
      resolve({ enabled: false });
    }, 60_000);
  })
}
