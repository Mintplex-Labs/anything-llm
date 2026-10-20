import { memo } from "react";
import LiveSession from "./LiveSession";
import ConcludedSession from "./ConcludedSession";

const LIVE_STATUSES = ["running", "needs-help"];

/**
 * Chat card for a browser-use session. While the session runs it shows the live browser and lets
 * the user stop it or help it; once it concludes it collapses into a summary that opens the trace.
 * @param {{content: Object, websocket?: WebSocket|null}} props
 */
function BrowserUseSession({ content = {}, websocket = null }) {
  const active = LIVE_STATUSES.includes(content.status);
  if (active && websocket?.readyState === WebSocket.OPEN)
    return <LiveSession session={content} websocket={websocket} />;
  // Still running when its agent session went away (socket closed, app reloaded
  // mid-session) - it never reached a conclusion.
  return <ConcludedSession session={content} interrupted={active} />;
}

export default memo(BrowserUseSession);
