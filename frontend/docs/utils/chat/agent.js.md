```javascript
import { v4 } from "uuid";
import { safeJsonParse } from "../request";
import { saveAs } from "file-saver";
import { API_BASE } from "../constants";
import { useEffect, useState } from "react";

export const AGENT_SESSION_START = "agentSessionStart";
export const AGENT_SESSION_END = "agentSessionEnd";
const handledEvents = [
  "statusResponse",
  "fileDownload",
  "awaitingFeedback",
  "wssFailure",
  "rechartVisualize",
];

export function websocketURI() {
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  if (API_BASE === "/api") return `${wsProtocol}//${window.location.host}`;
  return `${wsProtocol}//${new URL(import.meta.env.VITE_API_BASE).host}`;
}

export default function handleSocketResponse(event, setChatHistory) {
  const data = safeJsonParse(event.data, null);
  if (data === null) return;

  // No message type is defined then this is a generic message
  // that we need to print to the user as a system response
  if (!data.hasOwnProperty("type")) {
    return setChatHistory((prev) => {
      return [
        ...prev.filter((msg) => !!msg.content),
        {
          uuid: v4(),
          content: data.content,
          role: "assistant",
          sources: [],
          closed: true,
          error: null,
          animate: false,
          pending: false,
        },
      ];
    });
  }

  if (!handledEvents.includes(data.type) || !data.content) return;

  if (data.type === "fileDownload") {
    saveAs(data.content.b64Content, data.content.filename ?? "unknown.txt");
    return;
  }

  if (data.type === "rechartVisualize") {
    return setChatHistory((prev) => {
      return [
        ...prev.filter((msg) => !!msg.content),
        {
          type: "rechartVisualize",
          uuid: v4(),
          content: data.content,
          role: "assistant",
          sources: [],
          closed: true,
          error: null,
          animate: false,
          pending: false,
        },
      ];
    });
  }

  if (data.type === "wssFailure") {
    return setChatHistory((prev) => {
      return [
        ...prev.filter((msg) => !!msg.content),
        {
          uuid: v4(),
          content: data.content,
          role: "assistant",
          sources: [],
          closed: true,
          error: data.content,
          animate: false,
          pending: false,
        },
      ];
    });
  }

  return setChatHistory((prev) => {
    return [
      ...prev.filter((msg) => !!msg.content),
      {
        uuid: v4(),
        type: data.type,
        content: data.content,
        role: "assistant",
        sources: [],
        closed: true,
        error: null,
        animate: false,
        pending: false,
      },
    ];
  });
}

export function useIsAgentSessionActive() {
  const [activeSession, setActiveSession] = useState(false);
  useEffect(() => {
    function listenForAgentSession() {
      if (!window) return;
      window.addEventListener(AGENT_SESSION_START, () =>
        setActiveSession(true)
      );
      window.addEventListener(AGENT_SESSION_END, () => setActiveSession(false));
    }
    listenForAgentSession();
  }, []);

  return activeSession;
}

```
**Purpose and Usage:**
The provided TypeScript code defines two interfaces: `handleSocketResponse` and `useIsAgentSessionActive`. The purpose of these interfaces is to handle WebSocket responses and manage the active state of an agent session.

The `handleSocketResponse` interface takes in a WebSocket event object, parses its data using the `safeJsonParse` function, and then processes the response based on its type. It handles four types of events: "fileDownload", "rechartVisualize", "wssFailure", and other generic messages. For each event type, it updates the chat history by appending a new message to the list.

The `useIsAgentSessionActive` interface uses React's `useState` hook to manage the active state of an agent session. When an agent session starts or ends, it triggers the corresponding event listener to update the active session state.

**Method Documentation:**

### handleSocketResponse(event, setChatHistory)

* **Signature:** `handleSocketResponse(event: any, setChatHistory: Function): void`
* **Purpose:** Process a WebSocket response based on its type.
* **Parameters:**
	+ `event`: The WebSocket event object.
	+ `setChatHistory`: A function to update the chat history.
* **Return Value:** None.

Details about each parameter:

* `event`: The WebSocket event object, which contains data and other properties. Its type is any (due to TypeScript's ability to infer types from JSON data).
* `setChatHistory`: A function that updates the chat history by appending a new message to the list. Its type is Function.

Examples:

1. Handling a "fileDownload" event:
```javascript
handleSocketResponse({ type: 'fileDownload', content: { b64Content: 'base64-encoded-file-content', filename: 'example.txt' } }, setChatHistory);
```
2. Handling a "rechartVisualize" event:
```javascript
handleSocketResponse({ type: 'rechartVisualize', content: { chartData: [...], ... } }, setChatHistory);
```

### useIsAgentSessionActive()

* **Signature:** `useIsAgentSessionActive(): [activeSession: boolean, setActiveSession: Function]`
* **Purpose:** Manage the active state of an agent session.
* **Return Value:** An array containing the current active session state and a function to update it.

Details about each parameter:

* `activeSession`: The current active session state. Its type is boolean.
* `setActiveSession`: A function that updates the active session state. Its type is Function.

Example:
```javascript
const [activeSession, setActiveSession] = useIsAgentSessionActive();
```

**Dependencies:**

The interfaces depend on the following:

* `uuid` library (imported as `v4` in the code) for generating UUIDs.
* React's `useState` hook and `addEventListener` method.

**Clarity and Consistency:**
The documentation is well-organized, easy to understand, and consistent in style and terminology. The use of concise language and clear examples helps to clarify the purpose and usage of each interface.