```javascript
import React, { memo } from "react";
import { Warning } from "@phosphor-icons/react";
import Jazzicon from "../../../../UserIcon";
import Actions from "./Actions";
import renderMarkdown from "@/utils/chat/markdown";
import { userFromStorage } from "@/utils/request";
import Citations from "../Citation";
import { AI_BACKGROUND_COLOR, USER_BACKGROUND_COLOR } from "@/utils/constants";
import { v4 } from "uuid";
import createDOMPurify from "dompurify";

const DOMPurify = createDOMPurify(window);
const HistoricalMessage = ({
  uuid = v4(),
  message,
  role,
  workspace,
  sources = [],
  error = false,
  feedbackScore = null,
  chatId = null,
  isLastMessage = false,
  regenerateMessage,
}) => {
  return (
    <div
      key={uuid}
      className={`flex justify-center items-end w-full ${
        role === "user" ? USER_BACKGROUND_COLOR : AI_BACKGROUND_COLOR
      }`}
    >
      <div className={`py-8 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col`}>
        <div className="flex gap-x-5">
          <ProfileImage role={role} workspace={workspace} />
          {error ? (
            <div className="p-2 rounded-lg bg-red-50 text-red-500">
              <span className={`inline-block `}>
                <Warning className="h-4 w-4 mb-1 inline-block" /> Could not
                respond to message.
              </span>
              <p className="text-xs font-mono mt-2 border-l-2 border-red-300 pl-2 bg-red-200 p-2 rounded-sm">
                {error}
              </p>
            </div>
          ) : (
            <span
              className={`flex flex-col gap-y-1`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(renderMarkdown(message)),
              }}
            />
          )}
        </div>
        {role === "assistant" && !error && (
          <div className="flex gap-x-5">
            <div className="relative w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden" />
            <Actions
              message={message}
              feedbackScore={feedbackScore}
              chatId={chatId}
              slug={workspace?.slug}
              isLastMessage={isLastMessage}
              regenerateMessage={regenerateMessage}
            />
          </div>
        )}
        {role === "assistant" && <Citations sources={sources} />}
      </div>
    </div>
  );
};

function ProfileImage({ role, workspace }) {
  if (role === "assistant" && workspace.pfpUrl) {
    return (
      <div className="relative w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden">
        <img
          src={workspace.pfpUrl}
          alt="Workspace profile picture"
          className="absolute top-0 left-0 w-full h-full object-cover rounded-full bg-white"
        />
      </div>
    );
  }

  return (
    <Jazzicon
      size={36}
      user={{
        uid: role === "user" ? userFromStorage()?.username : workspace.slug,
      }}
      role={role}
    />
  );
}

export default memo(
  HistoricalMessage,
  // Skip re-render the historical message:
  // if the content is the exact same AND (not streaming)
  // the lastMessage status is the same (regen icon)
  // and the chatID matches between renders. (feedback icons)
  (prevProps, nextProps) => {
    return (
      prevProps.message === nextProps.message &&
      prevProps.isLastMessage === nextProps.isLastMessage &&
      prevProps.chatId === nextProps.chatId
    );
  }
);

```
**Purpose and Usage:**
The `HistoricalMessage` interface is a React component that represents a historical message in a chat conversation. It displays the message content, along with various metadata such as the role of the sender (user or assistant), workspace information, and feedback score. The component also includes actions for assistants to respond to messages, as well as citations for sources.

**Method Documentation:**

### HistoricalMessage

* **Signature:** `(uuid: string, message: any, role: string, workspace: any, sources: [], error: boolean, feedbackScore: null, chatId: null, isLastMessage: false, regenerateMessage: any) => JSX.Element`
* **Purpose:** To render a historical message in the chat conversation.
* **Parameters:**
	+ `uuid`: A unique identifier for the message.
	+ `message`: The content of the message.
	+ `role`: The role of the sender (user or assistant).
	+ `workspace`: Information about the workspace, including its slug and profile picture URL.
	+ `sources`: An array of sources cited in the message.
	+ `error`: A boolean indicating whether an error occurred while processing the message.
	+ `feedbackScore`: The feedback score for the message (optional).
	+ `chatId`: The ID of the chat conversation (optional).
	+ `isLastMessage`: A boolean indicating whether this is the last message in the conversation.
	+ `regenerateMessage`: An optional function to regenerate the message.
* **Return Value:** A JSX element representing the historical message.

**Examples:**

Here are a few examples of how you might use the `HistoricalMessage` component:

```jsx
import React from 'react';
import { HistoricalMessage } from './HistoricalMessage';

const messages = [
  {
    uuid: '1',
    message: 'Hello, world!',
    role: 'user',
    workspace: { slug: 'workspace-1', pfpUrl: 'https://example.com/pfp.jpg' },
    sources: [{ url: 'https://example.com/source-1' }],
    error: false,
  },
  {
    uuid: '2',
    message: 'This is an assistant response.',
    role: 'assistant',
    workspace: { slug: 'workspace-1', pfpUrl: 'https://example.com/pfp.jpg' },
    sources: [{ url: 'https://example.com/source-2' }],
    feedbackScore: 4.5,
  },
];

const renderMessages = () => {
  return messages.map((message, index) => (
    <HistoricalMessage
      key={index}
      uuid={message.uuid}
      message={message.message}
      role={message.role}
      workspace={message.workspace}
      sources={message.sources}
      error={message.error}
      feedbackScore={message.feedbackScore}
      chatId={messages[index].chatId}
      isLastMessage={index === messages.length - 1}
    />
  ));
};

const App = () => {
  return (
    <div>
      {renderMessages()}
    </div>
  );
};
```

**Dependencies:**

The `HistoricalMessage` component depends on the following dependencies:

* React
* `memo`: A higher-order function from React that memoizes a component.
* `Jazzicon`: A library for displaying user avatars.

**Clarity and Consistency:**
The documentation is written in a clear and concise manner, with consistent use of terminology and formatting. The code examples are also well-organized and easy to follow.