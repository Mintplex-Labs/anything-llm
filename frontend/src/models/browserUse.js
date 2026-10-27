import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

/**
 * Browser Use agent skill. Session history lives on the server; a running session is driven over
 * the chat's agent websocket (stop, reply, the live view and taking control).
 *
 * The only frontend file that knows where the browser runs: the desktop app has its own copy with
 * the same members (watchLive, openBrowser, helpNotifications), so the chat card is shared as is.
 */
const BrowserUse = {
  /**
   * Every user's sessions, for admins. `hidden` when DISABLE_VIEW_CHAT_HISTORY hides them.
   * @returns {Promise<{traces: Object[], hidden: boolean}>}
   */
  traces: async function () {
    return await fetch(`${API_BASE}/browser-use/traces`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => ({ traces: res.traces || [], hidden: !!res.hidden }))
      .catch(() => ({ traces: [], hidden: false }));
  },

  trace: async function (id) {
    return await fetch(`${API_BASE}/browser-use/traces/${id}`, {
      headers: baseHeaders(),
    })
      .then((res) => (res.ok ? res.json() : { trace: null }))
      .then((res) => res.trace)
      .catch(() => null);
  },

  deleteTrace: async function (id) {
    return await fetch(`${API_BASE}/browser-use/traces/${id}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.ok)
      .catch(() => false);
  },

  clearTraces: async function () {
    return await fetch(`${API_BASE}/browser-use/traces`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.ok)
      .catch(() => false);
  },

  /** Saved browser profiles (one per user, or one in single-user mode). */
  profiles: async function () {
    return await fetch(`${API_BASE}/browser-use/profiles`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res.profiles || [])
      .catch(() => []);
  },

  /** Wipe a saved profile's sign-ins and cookies. */
  deleteProfile: async function (key) {
    return await fetch(
      `${API_BASE}/browser-use/profiles/${encodeURIComponent(key)}`,
      { method: "DELETE", headers: baseHeaders() }
    )
      .then((res) => res.ok)
      .catch(() => false);
  },

  /**
   * Stream a running session's live view. The server only sends frames while a card watches.
   * @param {string} sessionId
   * @param {WebSocket} websocket - the chat's agent socket
   * @param {(frame: string) => void} onFrame - base64 jpeg
   * @returns {() => void} stop watching
   */
  watchLive: function (sessionId, websocket, onFrame) {
    if (!websocket) return () => {};
    const onMessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      if (
        data?.type === "browserUseFrame" &&
        data.content?.sessionId === sessionId
      )
        onFrame(data.content.frame);
    };
    websocket.addEventListener("message", onMessage);
    BrowserUse.control(websocket, sessionId, "watch", { watching: true });
    return () => {
      websocket.removeEventListener("message", onMessage);
      BrowserUse.control(websocket, sessionId, "watch", { watching: false });
    };
  },

  /**
   * Open the session's browser outside the chat card. There is none here: Take control works in
   * the card's live view (the desktop app opens its real browser window instead).
   * @returns {boolean} whether a browser was opened
   */
  openBrowser: function () {
    return false;
  },

  /** Whether the card raises a browser notification when the agent asks for help. */
  helpNotifications: true,

  /**
   * Send a control message for a live session over the agent socket:
   * stop, reply ({text}), watch ({watching}) or input ({input}).
   * @returns {boolean} whether it was sent
   */
  control: function (websocket, sessionId, action, data = {}) {
    if (!websocket || websocket.readyState !== WebSocket.OPEN) return false;
    websocket.send(
      JSON.stringify({ type: "browserUseControl", sessionId, action, ...data })
    );
    return true;
  },
};

export default BrowserUse;
