```javascript
import React, { useState, useRef, useEffect } from "react";
import SlashCommandsButton, {
  SlashCommands,
  useSlashCommands,
} from "./SlashCommands";
import debounce from "lodash.debounce";
import { PaperPlaneRight } from "@phosphor-icons/react";
import StopGenerationButton from "./StopGenerationButton";
import AvailableAgentsButton, {
  AvailableAgents,
  useAvailableAgents,
} from "./AgentMenu";
import TextSizeButton from "./TextSizeMenu";
import SpeechToText from "./SpeechToText";
import { Tooltip } from "react-tooltip";

export const PROMPT_INPUT_EVENT = "set_prompt_input";
export default function PromptInput({
  submit,
  onChange,
  inputDisabled,
  buttonDisabled,
  sendCommand,
}) {
  const [promptInput, setPromptInput] = useState("");
  const { showAgents, setShowAgents } = useAvailableAgents();
  const { showSlashCommand, setShowSlashCommand } = useSlashCommands();
  const formRef = useRef(null);
  const textareaRef = useRef(null);
  const [_, setFocused] = useState(false);

  // To prevent too many re-renders we remotely listen for updates from the parent
  // via an event cycle. Otherwise, using message as a prop leads to a re-render every
  // change on the input.
  function handlePromptUpdate(e) {
    setPromptInput(e?.detail ?? "");
  }

  useEffect(() => {
    if (!!window)
      window.addEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
    return () =>
      window?.removeEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
  }, []);

  useEffect(() => {
    if (!inputDisabled && textareaRef.current) {
      textareaRef.current.focus();
    }
    resetTextAreaHeight();
  }, [inputDisabled]);

  const handleSubmit = (e) => {
    setFocused(false);
    submit(e);
  };

  const resetTextAreaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const checkForSlash = (e) => {
    const input = e.target.value;
    if (input === "/") setShowSlashCommand(true);
    if (showSlashCommand) setShowSlashCommand(false);
    return;
  };

  const checkForAt = (e) => {
    const input = e.target.value;
    if (input === "@") return setShowAgents(true);
    if (showAgents) return setShowAgents(false);
  };

  const captureEnter = (event) => {
    if (event.keyCode == 13) {
      if (!event.shiftKey) {
        submit(event);
      }
    }
  };

  const adjustTextArea = (event) => {
    const element = event.target;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const watchForSlash = debounce(checkForSlash, 300);
  const watchForAt = debounce(checkForAt, 300);

  return (
    <div className="w-full fixed md:absolute bottom-0 left-0 z-10 md:z-0 flex justify-center items-center">
      <SlashCommands
        showing={showSlashCommand}
        setShowing={setShowSlashCommand}
        sendCommand={sendCommand}
      />
      <AvailableAgents
        showing={showAgents}
        setShowing={setShowAgents}
        sendCommand={sendCommand}
        promptRef={textareaRef}
      />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-1 rounded-t-lg md:w-3/4 w-full mx-auto max-w-xl"
      >
        <div className="flex items-center rounded-lg md:mb-4">
          <div className="w-[600px] bg-main-gradient shadow-2xl border border-white/50 rounded-2xl flex flex-col px-4 overflow-hidden">
            <div className="flex items-center w-full border-b-2 border-gray-500/50">
              <textarea
                ref={textareaRef}
                onChange={(e) => {
                  onChange(e);
                  watchForSlash(e);
                  watchForAt(e);
                  adjustTextArea(e);
                  setPromptInput(e.target.value);
                }}
                onKeyDown={captureEnter}
                required={true}
                disabled={inputDisabled}
                onFocus={() => setFocused(true)}
                onBlur={(e) => {
                  setFocused(false);
                  adjustTextArea(e);
                }}
                value={promptInput}
                className="cursor-text max-h-[50vh] md:max-h-[350px] md:min-h-[40px] mx-2 md:mx-0 py-2 w-full text-[16px] md:text-md text-white bg-transparent placeholder:text-white/60 resize-none active:outline-none focus:outline-none flex-grow"
                placeholder={"Send a message"}
              />
              {buttonDisabled ? (
                <StopGenerationButton />
              ) : (
                <>
                  <button
                    ref={formRef}
                    type="submit"
                    className="inline-flex justify-center rounded-2xl cursor-pointer text-white/60 hover:text-white group ml-4"
                    data-tooltip-id="send-prompt"
                    data-tooltip-content="Send prompt message to workspace"
                    aria-label="Send prompt message to workspace"
                  >
                    <PaperPlaneRight className="w-7 h-7 my-3" weight="fill" />
                    <span className="sr-only">Send message</span>
                  </button>
                  <Tooltip
                    id="send-prompt"
                    place="bottom"
                    delayShow={300}
                    className="tooltip !text-xs z-99"
                  />
                </>
              )}
            </div>
            <div className="flex justify-between py-3.5">
              <div className="flex gap-x-2">
                <SlashCommandsButton
                  showing={showSlashCommand}
                  setShowSlashCommand={setShowSlashCommand}
                />
                <AvailableAgentsButton
                  showing={showAgents}
                  setShowAgents={setShowAgents}
                />
                <TextSizeButton />
              </div>
              <div className="flex gap-x-2">
                <SpeechToText sendCommand={sendCommand} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

```
Based on the provided TypeScript code, I will generate comprehensive documentation in Markdown format.

**Purpose and Usage:**
The `PromptInput` component is used to handle user input for prompts in a text-based interface. It provides a textarea for users to type their messages, along with various buttons and tools to aid in the composition process. The component's primary purpose is to facilitate the creation of prompt messages that can be sent to a workspace.

**Method Documentation:**

### `PromptInput()`

* **Purpose:** Initializes the `PromptInput` component.
* **Parameters:** None
* **Return Type:** `JSX.Element`
* **Description:** This method returns the JSX element for the `PromptInput` component, which includes a textarea for user input and various buttons and tools.

### `onChange(event)`

* **Purpose:** Handles changes to the user's input in the textarea.
* **Parameters:**
	+ `event`: The event object representing the change to the textarea.
* **Return Type:** None
* **Description:** This method updates the component's state with the new input value and triggers the `watchForSlash` and `watchForAt` methods to detect any Slash or At commands in the input.

### `onKeyDown(event)`

* **Purpose:** Handles keyboard events for the textarea.
* **Parameters:**
	+ `event`: The event object representing the keyboard event.
* **Return Type:** None
* **Description:** This method captures the `Enter` key press and triggers the `captureEnter` function to handle the submission of the prompt message.

### `adjustTextArea(event)`

* **Purpose:** Adjusts the textarea's height based on the input value.
* **Parameters:**
	+ `event`: The event object representing the change to the textarea.
* **Return Type:** None
* **Description:** This method updates the textarea's height to accommodate the new input value.

### `captureEnter()`

* **Purpose:** Handles the submission of the prompt message when the user presses Enter.
* **Parameters:** None
* **Return Type:** None
* **Description:** This method triggers the submission of the prompt message and resets the component's state.

**Examples:**
To use the `PromptInput` component, you can include it in your React application as follows:
```jsx
import React from 'react';
import { PromptInput } from './PromptInput';

function MyComponent() {
  return (
    <div>
      <PromptInput />
    </div>
  );
}
```
In this example, the `MyComponent` function renders an instance of the `PromptInput` component. The user can then type their message in the textarea and submit it by pressing Enter.

**Dependencies:**
The `PromptInput` component depends on the following:
* `React`: The React library provides the foundation for building reusable UI components.
* `useState`, `useRef`, `useEffect`: These React hooks are used to manage state, create references, and handle side effects in the component.

I hope this documentation meets your requirements!