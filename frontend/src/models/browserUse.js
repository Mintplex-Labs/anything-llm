import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

/**
 * Browser Use agent skill. Session history lives on the server; a running session is driven over
 * the chat's agent websocket (stop, reply, the live view and taking control).
 */
const BrowserUse = {
  traces: async function () {
    return await fetch(`${API_BASE}/browser-use/traces`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res.traces || [])
      .catch(() => []);
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
