```javascript
import { useIsAgentSessionActive } from "@/utils/chat/agent";

export default function EndAgentSession({ setShowing, sendCommand }) {
  const isActiveAgentSession = useIsAgentSessionActive();
  if (!isActiveAgentSession) return null;

  return (
    <button
      onClick={() => {
        setShowing(false);
        sendCommand("/exit", true);
      }}
      className="w-full hover:cursor-pointer hover:bg-zinc-700 px-2 py-2 rounded-xl flex flex-col justify-start"
    >
      <div className="w-full flex-col text-left flex pointer-events-none">
        <div className="text-white text-sm font-bold">/exit</div>
        <div className="text-white text-opacity-60 text-sm">
          Halt the current agent session.
        </div>
      </div>
    </button>
  );
}

```
**EndAgentSession Interface Documentation**

### Purpose and Usage

The `EndAgentSession` interface provides a button component that allows the user to halt the current agent session. This interface is intended for use within the chat application's UI, where it can be used to terminate an active agent session.

### Method Documentation

#### EndAgentSession()

* **Method Signature:** `export default function EndAgentSession({ setShowing, sendCommand })`
* **Description:** Returns a button component that, when clicked, will halt the current agent session.
* **Parameters:**
	+ `setShowing`: A function to toggle the showing state of the interface.
	+ `sendCommand`: A function to send a command to the chat application's backend.
* **Return Value:** The button component.

#### Example Usage:

```javascript
import React from 'react';
import EndAgentSession from './EndAgentSession';

const MyComponent = () => {
  const [showing, setShowing] = useState(true);
  const sendCommand = (command) => {
    // Send the command to the backend
  };

  return (
    <div>
      {showing && (
        <EndAgentSession setShowing={setShowing} sendCommand={sendCommand} />
      )}
    </div>
  );
};
```

### Dependencies

The `EndAgentSession` interface depends on the `useIsAgentSessionActive()` hook from the `@/utils/chat/agent` module, which is used to determine whether an agent session is currently active.

### Clarity and Consistency

The documentation is organized into clear sections, with concise descriptions of each method and its parameters. The examples provided demonstrate how to use the interface effectively within a React component.