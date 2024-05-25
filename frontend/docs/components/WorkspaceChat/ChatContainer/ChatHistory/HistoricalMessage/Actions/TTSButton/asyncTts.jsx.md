```javascript
import { useEffect, useState, useRef } from "react";
import { SpeakerHigh, PauseCircle, CircleNotch } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";

export default function AsyncTTSMessage({ slug, chatId }) {
  const playerRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);

  function speakMessage() {
    if (speaking) {
      playerRef?.current?.pause();
      return;
    }

    try {
      if (!audioSrc) {
        setLoading(true);
        Workspace.ttsMessage(slug, chatId)
          .then((audioBlob) => {
            if (!audioBlob)
              throw new Error("Failed to load or play TTS message response.");
            setAudioSrc(audioBlob);
          })
          .catch((e) => showToast(e.message, "error", { clear: true }))
          .finally(() => setLoading(false));
      } else {
        playerRef.current.play();
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      setSpeaking(false);
    }
  }

  useEffect(() => {
    function setupPlayer() {
      if (!playerRef?.current) return;
      playerRef.current.addEventListener("play", () => {
        setSpeaking(true);
      });

      playerRef.current.addEventListener("pause", () => {
        playerRef.current.currentTime = 0;
        setSpeaking(false);
      });
    }
    setupPlayer();
  }, []);

  if (!chatId) return null;
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
          <>
            {loading ? (
              <CircleNotch size={18} className="mb-1 animate-spin" />
            ) : (
              <SpeakerHigh size={18} className="mb-1" />
            )}
          </>
        )}
        <audio
          ref={playerRef}
          hidden={true}
          src={audioSrc}
          autoPlay={true}
          controls={false}
        />
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
# AsyncTTSMessage Interface Documentation

## Purpose and Usage

The `AsyncTTSMessage` interface is a React component that handles asynchronous text-to-speech (TTS) messaging. Its primary purpose is to enable users to convert textual messages into spoken audio messages, allowing for a more immersive and engaging user experience.

This interface is designed to be used in a larger codebase, specifically within a chat application or similar context where TTS messaging is relevant. The component provides a simple way to initiate the TTS process, pause or resume playback, and display visual indicators of the speech status.

## Method Documentation

### `speakMessage()`

* **Signature:** `function speakMessage(): void`
* **Purpose:** Initiates the TTS process for a given message, either by playing an existing audio file or generating a new one.
* **Parameters:**
	+ `slug`: A unique identifier for the message (string)
	+ `chatId`: The ID of the chat context in which the message is being spoken (string)
* **Return Value:** None
* **Description:** This method sets up the necessary state and references for TTS messaging. If an audio source is already available, it will start playing; otherwise, it will attempt to load or generate a new audio file.

### `setupPlayer()`

* **Signature:** `function setupPlayer(): void`
* **Purpose:** Sets up event listeners for the audio player component.
* **Parameters:** None
* **Return Value:** None
* **Description:** This method initializes the audio player with event listeners for play and pause events. It sets the speaking state to true when playback begins and false when it is paused.

### `useState`, `setAudioSrc`, and `setSpeaking`

These methods are part of the React component's internal state management. They update the component's state accordingly, reflecting changes in the TTS process.

* **`useState`:** Initializes the speaking, loading, and audio source states.
* **`setAudioSrc`:** Updates the audio source URL when a new message is loaded or generated.
* **`setSpeaking`:** Sets the speaking state to true when playback begins or false when paused.

## Examples

1. To initiate TTS messaging for a specific chat context:
```javascript
import AsyncTTSMessage from './AsyncTTSMessage';

const myChatId = 'my-chat-id';
const mySlug = 'my-message-slug';

AsyncTTSMessage({ slug: mySlug, chatId: myChatId });
```

2. To pause or resume TTS messaging:
```javascript
import AsyncTTSMessage from './AsyncTTSMessage';

const myChatId = 'my-chat-id';
const mySlug = 'my-message-slug';

AsyncTTSMessage({ slug: mySlug, chatId: myChatId }).speakMessage();
```

## Dependencies

The `AsyncTTSMessage` interface relies on the following dependencies:

* `Workspace`: A model or service that provides TTS message functionality.
* `showToast`: A utility function to display error messages.
* `react-tooltip`: A library for creating tooltips.

## Clarity and Consistency

This documentation aims to provide clear, concise, and consistent descriptions of the `AsyncTTSMessage` interface and its methods. The code examples illustrate the usage and behavior of the interface in various scenarios.