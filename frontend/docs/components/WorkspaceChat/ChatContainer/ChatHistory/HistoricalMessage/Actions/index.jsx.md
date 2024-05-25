```javascript
import React, { memo, useState } from "react";
import useCopyText from "@/hooks/useCopyText";
import {
  Check,
  ClipboardText,
  ThumbsUp,
  ThumbsDown,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import Workspace from "@/models/workspace";
import TTSMessage from "./TTSButton";

const Actions = ({
  message,
  feedbackScore,
  chatId,
  slug,
  isLastMessage,
  regenerateMessage,
}) => {
  const [selectedFeedback, setSelectedFeedback] = useState(feedbackScore);

  const handleFeedback = async (newFeedback) => {
    const updatedFeedback =
      selectedFeedback === newFeedback ? null : newFeedback;
    await Workspace.updateChatFeedback(chatId, slug, updatedFeedback);
    setSelectedFeedback(updatedFeedback);
  };

  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex justify-start items-center gap-x-4">
        <CopyMessage message={message} />
        {isLastMessage && (
          <RegenerateMessage
            regenerateMessage={regenerateMessage}
            slug={slug}
            chatId={chatId}
          />
        )}
        {chatId && (
          <>
            <FeedbackButton
              isSelected={selectedFeedback === true}
              handleFeedback={() => handleFeedback(true)}
              tooltipId={`${chatId}-thumbs-up`}
              tooltipContent="Good response"
              IconComponent={ThumbsUp}
            />
            <FeedbackButton
              isSelected={selectedFeedback === false}
              handleFeedback={() => handleFeedback(false)}
              tooltipId={`${chatId}-thumbs-down`}
              tooltipContent="Bad response"
              IconComponent={ThumbsDown}
            />
          </>
        )}
      </div>
      <TTSMessage slug={slug} chatId={chatId} message={message} />
    </div>
  );
};

function FeedbackButton({
  isSelected,
  handleFeedback,
  tooltipId,
  tooltipContent,
  IconComponent,
}) {
  return (
    <div className="mt-3 relative">
      <button
        onClick={handleFeedback}
        data-tooltip-id={tooltipId}
        data-tooltip-content={tooltipContent}
        className="text-zinc-300"
        aria-label={tooltipContent}
      >
        <IconComponent
          size={18}
          className="mb-1"
          weight={isSelected ? "fill" : "regular"}
        />
      </button>
      <Tooltip
        id={tooltipId}
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
    </div>
  );
}

function CopyMessage({ message }) {
  const { copied, copyText } = useCopyText();

  return (
    <>
      <div className="mt-3 relative">
        <button
          onClick={() => copyText(message)}
          data-tooltip-id="copy-assistant-text"
          data-tooltip-content="Copy"
          className="text-zinc-300"
          aria-label="Copy"
        >
          {copied ? (
            <Check size={18} className="mb-1" />
          ) : (
            <ClipboardText size={18} className="mb-1" />
          )}
        </button>
        <Tooltip
          id="copy-assistant-text"
          place="bottom"
          delayShow={300}
          className="tooltip !text-xs"
        />
      </div>
    </>
  );
}

function RegenerateMessage({ regenerateMessage, chatId }) {
  if (!chatId) return null;
  return (
    <div className="mt-3 relative">
      <button
        onClick={() => regenerateMessage(chatId)}
        data-tooltip-id="regenerate-assistant-text"
        data-tooltip-content="Regenerate response"
        className="border-none text-zinc-300"
        aria-label="Regenerate"
      >
        <ArrowsClockwise size={18} className="mb-1" weight="fill" />
      </button>
      <Tooltip
        id="regenerate-assistant-text"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
    </div>
  );
}

export default memo(Actions);

```
**Purpose and Usage**

The provided code defines a React component called `Actions` that handles various actions related to a chat conversation. The purpose of this interface is to provide a unified way to handle user feedback, copy messages, regenerate responses, and display tooltips.

**Method Documentation**

### Actions ({message, feedbackScore, chatId, slug, isLastMessage, regenerateMessage})

The `Actions` component receives six props: `message`, `feedbackScore`, `chatId`, `slug`, `isLastMessage`, and `regenerateMessage`. It returns a JSX element that renders a set of UI components.

#### handleFeedback (async) (newFeedback)

* **Purpose:** Update the chat feedback score based on user input.
* **Parameters:**
	+ `newFeedback`: The new feedback score (boolean).
* **Return type:** None (void).
* **Description:** This method updates the chat feedback score in the database and sets the local state to reflect the change.

#### RegenerateMessage ({regenerateMessage, chatId})

* **Purpose:** Regenerate a response for a given chat ID.
* **Parameters:**
	+ `regenerateMessage`: The function responsible for regenerating the response.
	+ `chatId`: The ID of the chat conversation.
* **Return type:** None (void).
* **Description:** This method calls the `regenerateMessage` function with the provided `chatId` to generate a new response.

### CopyMessage ({message})

* **Purpose:** Copy a message to the clipboard.
* **Parameters:**
	+ `message`: The message to be copied.
* **Return type:** None (void).
* **Description:** This method uses the `useCopyText` hook from React to copy the provided message to the clipboard.

### RegenerateMessage ({regenerateMessage, chatId})

* **Purpose:** Regenerate a response for a given chat ID.
* **Parameters:**
	+ `regenerateMessage`: The function responsible for regenerating the response.
	+ `chatId`: The ID of the chat conversation.
* **Return type:** None (void).
* **Description:** This method calls the `regenerateMessage` function with the provided `chatId` to generate a new response.

**Examples**

To illustrate the usage of these methods, consider the following examples:

1. Updating feedback score:
```javascript
const handleFeedback = async (newFeedback) => {
  await Actions.handleFeedback(newFeedback);
};
```
2. Regenerating a response:
```javascript
const regenerateResponse = async () => {
  await Actions.RegenerateMessage(chatId);
};
```
3. Copying a message:
```javascript
const copyMessage = () => {
  Actions.CopyMessage(message);
};
```

**Dependencies**

The `Actions` component depends on the following:

* The `memo` function from React for memoization.
* The `useState` hook from React to manage local state.
* The `useCopyText` hook from React to handle clipboard operations.

**Clarity and Consistency**

This documentation aims to provide clear and concise explanations of each method, along with examples and dependencies. The style and terminology used are consistent throughout the documentation.