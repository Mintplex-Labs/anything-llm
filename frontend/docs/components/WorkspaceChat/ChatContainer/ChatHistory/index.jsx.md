```javascript
import HistoricalMessage from "./HistoricalMessage";
import PromptReply from "./PromptReply";
import { useEffect, useRef, useState } from "react";
import { useManageWorkspaceModal } from "../../../Modals/MangeWorkspace";
import ManageWorkspace from "../../../Modals/MangeWorkspace";
import { ArrowDown } from "@phosphor-icons/react";
import debounce from "lodash.debounce";
import useUser from "@/hooks/useUser";
import Chartable from "./Chartable";

export default function ChatHistory({
  history = [],
  workspace,
  sendCommand,
  regenerateAssistantMessage,
}) {
  const { user } = useUser();
  const { showing, showModal, hideModal } = useManageWorkspaceModal();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const chatHistoryRef = useRef(null);
  const [textSize, setTextSize] = useState("normal");

  const getTextSizeClass = (size) => {
    switch (size) {
      case "small":
        return "text-[12px]";
      case "large":
        return "text-[18px]";
      default:
        return "text-[14px]";
    }
  };

  useEffect(() => {
    const storedTextSize = window.localStorage.getItem("anythingllm_text_size");
    if (storedTextSize) {
      setTextSize(getTextSizeClass(storedTextSize));
    }

    const handleTextSizeChange = (event) => {
      const size = event.detail;
      setTextSize(getTextSizeClass(size));
    };

    window.addEventListener("textSizeChange", handleTextSizeChange);

    return () => {
      window.removeEventListener("textSizeChange", handleTextSizeChange);
    };
  }, []);

  useEffect(() => {
    if (isAtBottom) scrollToBottom();
  }, [history]);

  const handleScroll = () => {
    const diff =
      chatHistoryRef.current.scrollHeight -
      chatHistoryRef.current.scrollTop -
      chatHistoryRef.current.clientHeight;
    // Fuzzy margin for what qualifies as "bottom". Stronger than straight comparison since that may change over time.
    const isBottom = diff <= 10;
    setIsAtBottom(isBottom);
  };

  const debouncedScroll = debounce(handleScroll, 100);
  useEffect(() => {
    function watchScrollEvent() {
      if (!chatHistoryRef.current) return null;
      const chatHistoryElement = chatHistoryRef.current;
      if (!chatHistoryElement) return null;
      chatHistoryElement.addEventListener("scroll", debouncedScroll);
    }
    watchScrollEvent();
  }, []);

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSendSuggestedMessage = (heading, message) => {
    sendCommand(`${heading} ${message}`, true);
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col h-full md:mt-0 pb-44 md:pb-40 w-full justify-end items-center">
        <div className="flex flex-col items-center md:items-start md:max-w-[600px] w-full px-4">
          <p className="text-white/60 text-lg font-base py-4">
            Welcome to your new workspace.
          </p>
          {!user || user.role !== "default" ? (
            <p className="w-full items-center text-white/60 text-lg font-base flex flex-col md:flex-row gap-x-1">
              To get started either{" "}
              <span
                className="underline font-medium cursor-pointer"
                onClick={showModal}
              >
                upload a document
              </span>
              or <b className="font-medium italic">send a chat.</b>
            </p>
          ) : (
            <p className="w-full items-center text-white/60 text-lg font-base flex flex-col md:flex-row gap-x-1">
              To get started <b className="font-medium italic">send a chat.</b>
            </p>
          )}
          <WorkspaceChatSuggestions
            suggestions={workspace?.suggestedMessages ?? []}
            sendSuggestion={handleSendSuggestedMessage}
          />
        </div>
        {showing && (
          <ManageWorkspace
            hideModal={hideModal}
            providedSlug={workspace.slug}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`markdown text-white/80 font-light ${textSize} h-full md:h-[83%] pb-[100px] pt-6 md:pt-0 md:pb-20 md:mx-0 overflow-y-scroll flex flex-col justify-start no-scroll`}
      id="chat-history"
      ref={chatHistoryRef}
    >
      {history.map((props, index) => {
        const isLastBotReply =
          index === history.length - 1 && props.role === "assistant";

        if (props?.type === "statusResponse" && !!props.content) {
          return <StatusResponse key={props.uuid} props={props} />;
        }

        if (props.type === "rechartVisualize" && !!props.content) {
          return (
            <Chartable key={props.uuid} workspace={workspace} props={props} />
          );
        }

        if (isLastBotReply && props.animate) {
          return (
            <PromptReply
              key={props.uuid}
              uuid={props.uuid}
              reply={props.content}
              pending={props.pending}
              sources={props.sources}
              error={props.error}
              workspace={workspace}
              closed={props.closed}
            />
          );
        }

        return (
          <HistoricalMessage
            key={index}
            message={props.content}
            role={props.role}
            workspace={workspace}
            sources={props.sources}
            feedbackScore={props.feedbackScore}
            chatId={props.chatId}
            error={props.error}
            regenerateMessage={regenerateAssistantMessage}
            isLastMessage={isLastBotReply}
          />
        );
      })}
      {showing && (
        <ManageWorkspace hideModal={hideModal} providedSlug={workspace.slug} />
      )}
      {!isAtBottom && (
        <div className="fixed bottom-40 right-10 md:right-20 z-50 cursor-pointer animate-pulse">
          <div className="flex flex-col items-center">
            <div className="p-1 rounded-full border border-white/10 bg-white/10 hover:bg-white/20 hover:text-white">
              <ArrowDown
                weight="bold"
                className="text-white/60 w-5 h-5"
                onClick={scrollToBottom}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusResponse({ props }) {
  return (
    <div className="flex justify-center items-end w-full">
      <div className="py-2 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col">
        <div className="flex gap-x-5">
          <span
            className={`text-xs inline-block p-2 rounded-lg text-white/60 font-mono whitespace-pre-line`}
          >
            {props.content}
          </span>
        </div>
      </div>
    </div>
  );
}

function WorkspaceChatSuggestions({ suggestions = [], sendSuggestion }) {
  if (suggestions.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/60 text-xs mt-10 w-full justify-center">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="text-left p-2.5 border rounded-xl border-white/20 bg-sidebar hover:bg-workspace-item-selected-gradient"
          onClick={() => sendSuggestion(suggestion.heading, suggestion.message)}
        >
          <p className="font-semibold">{suggestion.heading}</p>
          <p>{suggestion.message}</p>
        </button>
      ))}
    </div>
  );
}

```
Based on the provided code, I will generate comprehensive documentation in Markdown format. Here it is:

**Purpose and Usage:**
This interface provides a way to render chat messages with various components such as Chartable, PromptReply, HistoricalMessage, StatusResponse, WorkspaceChatSuggestions, and ManageWorkspace. The purpose of this interface is to display chat messages with different formats and provide user interactions.

**Method Documentation:**

### `render`

* Signature: `(props) => JSX.Element`
* Purpose: Render a chat message component based on the provided props.
* Parameters:
	+ `props`: An object containing various properties such as `content`, `uuid`, `workspace`, `sources`, `error`, and others.
* Return value: A JSX element representing the rendered chat message component.

Example usage:

```javascript
import React from 'react';
import { render } from './ChatMessage';

const props = {
  content: 'Hello, world!',
  uuid: 'unique-id',
  workspace: 'my-workspace',
  sources: ['source-1', 'source-2'],
  error: null,
};

const renderedComponent = render(props);
```

### `showing`

* Signature: `(hideModal, providedSlug) => JSX.Element`
* Purpose: Render a ManageWorkspace component when showing.
* Parameters:
	+ `hideModal`: A function to hide the modal.
	+ `providedSlug`: The slug of the workspace.
* Return value: A JSX element representing the rendered ManageWorkspace component.

Example usage:

```javascript
import React from 'react';
import { showing } from './ChatMessage';

const hideModal = () => {};
const providedSlug = 'my-workspace-slug';

const shownComponent = showing(hideModal, providedSlug);
```

### `scrollToBottom`

* Signature: `() => void`
* Purpose: Scroll to the bottom of the chat message list.
* Parameters: None
* Return value: Void

Example usage:

```javascript
import React from 'react';
import { scrollToBottom } from './ChatMessage';

const scrollToBottom = () => {
  // Your implementation here
};
```

### `StatusResponse`

* Signature: `(props) => JSX.Element`
* Purpose: Render a StatusResponse component with the provided props.
* Parameters:
	+ `props`: An object containing various properties such as `content`.
* Return value: A JSX element representing the rendered StatusResponse component.

Example usage:

```javascript
import React from 'react';
import { StatusResponse } from './ChatMessage';

const props = {
  content: 'This is a status response.',
};

const statusComponent = StatusResponse(props);
```

### `WorkspaceChatSuggestions`

* Signature: `(suggestions, sendSuggestion) => JSX.Element`
* Purpose: Render a WorkspaceChatSuggestions component with the provided suggestions and send suggestion function.
* Parameters:
	+ `suggestions`: An array of suggestion objects containing `heading` and `message` properties.
	+ `sendSuggestion`: A function to send a suggestion.
* Return value: A JSX element representing the rendered WorkspaceChatSuggestions component.

Example usage:

```javascript
import React from 'react';
import { WorkspaceChatSuggestions } from './ChatMessage';

const suggestions = [
  {
    heading: 'Suggestion 1',
    message: 'This is the first suggestion.',
  },
  {
    heading: 'Suggestion 2',
    message: 'This is the second suggestion.',
  },
];

const sendSuggestion = (heading, message) => {
  // Your implementation here
};

const suggestionsComponent = WorkspaceChatSuggestions(suggestions, sendSuggestion);
```

**Dependencies:**
The `ChatMessage` interface depends on various components such as Chartable, PromptReply, HistoricalMessage, StatusResponse, WorkspaceChatSuggestions, and ManageWorkspace.

**Examples:**
Here are some examples to illustrate the usage of the `ChatMessage` interface:

```javascript
import React from 'react';
import { render } from './ChatMessage';

const props = {
  content: 'Hello, world!',
  uuid: 'unique-id',
  workspace: 'my-workspace',
  sources: ['source-1', 'source-2'],
  error: null,
};

const renderedComponent = render(props);
```

```javascript
import React from 'react';
import { showing } from './ChatMessage';

const hideModal = () => {};
const providedSlug = 'my-workspace-slug';

const shownComponent = showing(hideModal, providedSlug);
```

**Consistency and Clarity:**
I hope this documentation is clear, concise, and consistent in style and terminology. If you have any further questions or concerns, please feel free to ask!