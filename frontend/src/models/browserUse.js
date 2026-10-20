import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

/**
 * Browser Use agent skill. Session history lives on the server; a running session is driven over
 * the chat's agent websocket (stop, reply, the live view and taking control).
 */
const BrowserUse = {
  /**
   * Whether this server can run the skill at all - never on a bare-metal production install.
   * @returns {Promise<boolean>}
   */
  isAvailable: async function () {
    return await fetch(`${API_BASE}/browser-use/is-available`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => !!res?.available)
      .catch(() => false);
  },

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
