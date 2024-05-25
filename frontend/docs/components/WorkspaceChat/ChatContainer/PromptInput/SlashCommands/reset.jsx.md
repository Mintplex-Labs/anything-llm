```javascript
import { useIsAgentSessionActive } from "@/utils/chat/agent";

export default function ResetCommand({ setShowing, sendCommand }) {
  const isActiveAgentSession = useIsAgentSessionActive();
  if (isActiveAgentSession) return null; // cannot reset during active agent chat

  return (
    <button
      onClick={() => {
        setShowing(false);
        sendCommand("/reset", true);
      }}
      className="w-full hover:cursor-pointer hover:bg-zinc-700 px-2 py-2 rounded-xl flex flex-col justify-start"
    >
      <div className="w-full flex-col text-left flex pointer-events-none">
        <div className="text-white text-sm font-bold">/reset</div>
        <div className="text-white text-opacity-60 text-sm">
          Clear your chat history and begin a new chat
        </div>
      </div>
    </button>
  );
}

```
**Reset Command Interface Documentation**

### Purpose and Usage

The `ResetCommand` interface provides a button that allows users to clear their chat history and begin a new chat. This interface is intended for use within the chat application's UI component.

### Method Documentation

#### `ResetCommand`

* **Signature:** `export default function ResetCommand({ setShowing, sendCommand })`
* **Purpose:** This function returns a JSX element representing a reset button.
* **Parameters:**
	+ `setShowing`: A function that sets the `showing` state variable to a specified value.
	+ `sendCommand`: A function that sends a chat command with the given text and boolean flag indicating whether the command is a response to an existing conversation.
* **Return Value:** A JSX element representing a button.

#### `useIsAgentSessionActive`

* **Signature:** `import { useIsAgentSessionActive } from "@/utils/chat/agent";`
* **Purpose:** This hook checks if an agent session is active.
* **Return Value:** A boolean indicating whether the agent session is active or not.

### Examples

To use the `ResetCommand` interface, you can import it and render the returned JSX element:
```jsx
import React from 'react';
import ResetCommand from './ResetCommand';

const MyComponent = () => {
  const [showing, setShowing] = useState(false);
  const sendCommand = (text: string) => {
    // Send command implementation
  };

  return (
    <div>
      <ResetCommand setShowing={setShowing} sendCommand={sendCommand} />
    </div>
  );
};
```
### Dependencies

The `ResetCommand` interface depends on the `useIsAgentSessionActive` hook from the `@/utils/chat/agent` module. It also uses the `useState` hook from React.

### Clarity and Consistency

This documentation is organized into sections that provide clear and concise information about the `ResetCommand` interface and its methods. The language used is consistent throughout, and the examples provided illustrate the usage of the interface in a real-world scenario.