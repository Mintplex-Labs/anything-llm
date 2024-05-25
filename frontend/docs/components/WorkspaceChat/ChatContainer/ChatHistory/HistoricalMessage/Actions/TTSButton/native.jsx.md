```javascript
import React, { useEffect, useState } from "react";
import { SpeakerHigh, PauseCircle } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function NativeTTSMessage({ message }) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    setSupported("speechSynthesis" in window);
  }, []);

  function endSpeechUtterance() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    return;
  }

  function speakMessage() {
    // if the user is pausing this particular message
    // while the synth is speaking we can end it.
    // If they are clicking another message's TTS
    // we need to ignore that until they pause the one that is playing.
    if (window.speechSynthesis.speaking && speaking) {
      endSpeechUtterance();
      return;
    }

    if (window.speechSynthesis.speaking && !speaking) return;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.addEventListener("end", endSpeechUtterance);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  if (!supported) return null;
  return (
    <div className="mt-3 relative">
      <button
        onClick={speakMessage}
        data-tooltip-id="message-to-speech"
        data-tooltip-content={
          speaking ? "Pause TTS speech of message" : "TTS Speak message"
        }
        className="border-none text-zinc-300"
        aria-label={speaking ? "Pause speech" : "Speak message"}
      >
        {speaking ? (
          <PauseCircle size={18} className="mb-1" />
        ) : (
          <SpeakerHigh size={18} className="mb-1" />
        )}
      </button>
      <Tooltip
        id="message-to-speech"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
    </div>
  );
}

```
Based on the provided TypeScript code, I will generate comprehensive documentation in Markdown format.

**Purpose and Usage:**
The `NativeTTSMessage` component is a React hook that provides an interface for playing Text-To-Speech (TTS) messages. It is designed to handle speech synthesis and pause/resume functionality. The component expects a `message` prop, which represents the text to be spoken.

**Method Documentation:**

### `useState`

* Signature: `const [speaking, setSpeaking] = useState(false);`
* Purpose: Initializes state for speaking and sets the initial value to false.
* Parameters:
	+ `false`: The initial value of the speaking state.
* Return Types:
	+ `speaking`: A boolean indicating whether the speech is currently speaking or not.
	+ `setSpeaking`: A function to update the speaking state.

### `useEffect`

* Signature: `useEffect(() => { setSupported("speechSynthesis" in window); }, []);`
* Purpose: Initializes state for supported TTS and checks if the browser supports TTS.
* Parameters:
	+ An empty array `[]` indicating that this effect should only run once, when the component mounts.

### `endSpeechUtterance`

* Signature: `function endSpeechUtterance() { window. speechSynthesis?.cancel(); setSpeaking(false); return; }`
* Purpose: Cancels any ongoing TTS speech and sets the speaking state to false.
* Parameters:
	+ None
* Return Types:
	+ None

### `speakMessage`

* Signature: `function speakMessage() { ... }`
* Purpose: Plays the specified message using the browser's TTS API.
* Parameters:
	+ If the user is pausing this particular message, ends the speech utterance. If they are clicking another message's TTS, ignores that until they pause the one that is playing.
* Return Types:
	+ None

### `return`

* Signature: `if (!supported) return null; return (<div>...</div>);`
* Purpose: Renders a button with a tooltip indicating whether to pause or play the speech. If TTS is not supported, returns null.

**Examples:**

To use this component, you would need to import it and pass a message prop:
```jsx
import React from 'react';
import { NativeTTSMessage } from './NativeTTSMessage';

const MyComponent = () => {
  return (
    <div>
      <NativeTTSMessage message="Hello, World!" />
    </div>
  );
};
```
**Dependencies:**

This component relies on the `React` and `useState` hooks for state management. It also uses the `useEffect` hook to initialize state.

**Clarity and Consistency:**

The documentation is organized into clear sections, providing concise descriptions of each method. The examples illustrate how to use the component in a React application.