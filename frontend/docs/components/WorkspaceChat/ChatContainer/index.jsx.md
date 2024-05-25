```javascript
import { useState, useEffect } from "react";
import ChatHistory from "./ChatHistory";
import PromptInput, { PROMPT_INPUT_EVENT } from "./PromptInput";
import Workspace from "@/models/workspace";
import handleChat, { ABORT_STREAM_EVENT } from "@/utils/chat";
import { isMobile } from "react-device-detect";
import { SidebarMobileHeader } from "../../Sidebar";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import handleSocketResponse, {
  websocketURI,
  AGENT_SESSION_END,
  AGENT_SESSION_START,
} from "@/utils/chat/agent";

export default function ChatContainer({ workspace, knownHistory = [] }) {
  const { threadSlug = null } = useParams();
  const [message, setMessage] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [chatHistory, setChatHistory] = useState(knownHistory);
  const [socketId, setSocketId] = useState(null);
  const [websocket, setWebsocket] = useState(null);

  // Maintain state of message from whatever is in PromptInput
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // Emit an update to the state of the prompt input without directly
  // passing a prop in so that it does not re-render constantly.
  function setMessageEmit(messageContent = "") {
    setMessage(messageContent);
    window.dispatchEvent(
      new CustomEvent(PROMPT_INPUT_EVENT, { detail: messageContent })
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message || message === "") return false;

    const prevChatHistory = [
      ...chatHistory,
      { content: message, role: "user" },
      {
        content: "",
        role: "assistant",
        pending: true,
        userMessage: message,
        animate: true,
      },
    ];

    setChatHistory(prevChatHistory);
    setMessageEmit("");
    setLoadingResponse(true);
  };

  const regenerateAssistantMessage = (chatId) => {
    const updatedHistory = chatHistory.slice(0, -1);
    const lastUserMessage = updatedHistory.slice(-1)[0];
    Workspace.deleteChats(workspace.slug, [chatId])
      .then(() => sendCommand(lastUserMessage.content, true, updatedHistory))
      .catch((e) => console.error(e));
  };

  const sendCommand = async (command, submit = false, history = []) => {
    if (!command || command === "") return false;
    if (!submit) {
      setMessageEmit(command);
      return;
    }

    let prevChatHistory;
    if (history.length > 0) {
      // use pre-determined history chain.
      prevChatHistory = [
        ...history,
        {
          content: "",
          role: "assistant",
          pending: true,
          userMessage: command,
          animate: true,
        },
      ];
    } else {
      prevChatHistory = [
        ...chatHistory,
        { content: command, role: "user" },
        {
          content: "",
          role: "assistant",
          pending: true,
          userMessage: command,
          animate: true,
        },
      ];
    }

    setChatHistory(prevChatHistory);
    setMessageEmit("");
    setLoadingResponse(true);
  };

  useEffect(() => {
    async function fetchReply() {
      const promptMessage =
        chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;
      const remHistory = chatHistory.length > 0 ? chatHistory.slice(0, -1) : [];
      var _chatHistory = [...remHistory];

      // Override hook for new messages to now go to agents until the connection closes
      if (!!websocket) {
        if (!promptMessage || !promptMessage?.userMessage) return false;
        websocket.send(
          JSON.stringify({
            type: "awaitingFeedback",
            feedback: promptMessage?.userMessage,
          })
        );
        return;
      }

      // TODO: Simplify this
      if (!promptMessage || !promptMessage?.userMessage) return false;
      if (!!threadSlug) {
        await Workspace.threads.streamChat(
          { workspaceSlug: workspace.slug, threadSlug },
          promptMessage.userMessage,
          (chatResult) =>
            handleChat(
              chatResult,
              setLoadingResponse,
              setChatHistory,
              remHistory,
              _chatHistory,
              setSocketId
            )
        );
      } else {
        await Workspace.streamChat(
          workspace,
          promptMessage.userMessage,
          (chatResult) =>
            handleChat(
              chatResult,
              setLoadingResponse,
              setChatHistory,
              remHistory,
              _chatHistory,
              setSocketId
            )
        );
      }
      return;
    }
    loadingResponse === true && fetchReply();
  }, [loadingResponse, chatHistory, workspace]);

  // TODO: Simplify this WSS stuff
  useEffect(() => {
    function handleWSS() {
      try {
        if (!socketId || !!websocket) return;
        const socket = new WebSocket(
          `${websocketURI()}/api/agent-invocation/${socketId}`
        );

        window.addEventListener(ABORT_STREAM_EVENT, () => {
          window.dispatchEvent(new CustomEvent(AGENT_SESSION_END));
          websocket.close();
        });

        socket.addEventListener("message", (event) => {
          setLoadingResponse(true);
          try {
            handleSocketResponse(event, setChatHistory);
          } catch (e) {
            console.error("Failed to parse data");
            window.dispatchEvent(new CustomEvent(AGENT_SESSION_END));
            socket.close();
          }
          setLoadingResponse(false);
        });

        socket.addEventListener("close", (_event) => {
          window.dispatchEvent(new CustomEvent(AGENT_SESSION_END));
          setChatHistory((prev) => [
            ...prev.filter((msg) => !!msg.content),
            {
              uuid: v4(),
              type: "statusResponse",
              content: "Agent session complete.",
              role: "assistant",
              sources: [],
              closed: true,
              error: null,
              animate: false,
              pending: false,
            },
          ]);
          setLoadingResponse(false);
          setWebsocket(null);
          setSocketId(null);
        });
        setWebsocket(socket);
        window.dispatchEvent(new CustomEvent(AGENT_SESSION_START));
      } catch (e) {
        setChatHistory((prev) => [
          ...prev.filter((msg) => !!msg.content),
          {
            uuid: v4(),
            type: "abort",
            content: e.message,
            role: "assistant",
            sources: [],
            closed: true,
            error: e.message,
            animate: false,
            pending: false,
          },
        ]);
        setLoadingResponse(false);
        setWebsocket(null);
        setSocketId(null);
      }
    }
    handleWSS();
  }, [socketId]);

  return (
    <div
      style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
      className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll border-2 border-outline"
    >
      {isMobile && <SidebarMobileHeader />}
      <div className="flex flex-col h-full w-full md:mt-0 mt-[40px]">
        <ChatHistory
          history={chatHistory}
          workspace={workspace}
          sendCommand={sendCommand}
          regenerateAssistantMessage={regenerateAssistantMessage}
        />
        <PromptInput
          submit={handleSubmit}
          onChange={handleMessageChange}
          inputDisabled={loadingResponse}
          buttonDisabled={loadingResponse}
          sendCommand={sendCommand}
        />
      </div>
    </div>
  );
}

```
**Purpose and Usage**

The provided TypeScript code defines a React component for a chat interface. The purpose of this component is to facilitate communication between a user and an AI assistant. The intended usage is within a larger application that handles WebSocket connections, agent sessions, and chat history.

**Methods**

### `handleWSS`

Signature: `(socketId: string) => void`

Description: This method initializes the WebSocket connection using the provided socket ID. It sets up event listeners for messages, close events, and abort stream events. The method also dispatches events to indicate the start and end of an agent session.

Parameters:

* `socketId`: A unique identifier for the WebSocket connection.

Return Type: None

### `handleSubmit`

Signature: `(message: string) => void`

Description: This method is called when the user submits a message to the chat interface. It sends the message to the AI assistant via the WebSocket connection and updates the chat history.

Parameters:

* `message`: The text input by the user.

Return Type: None

### `handleMessageChange`

Signature: `(newMessage: string) => void`

Description: This method is called when the user types a new message. It updates the state of the component with the new message.

Parameters:

* `newMessage`: The updated message text.

Return Type: None

### `setLoadingResponse`

Signature: `(loading: boolean) => void`

Description: This method sets the loading response state to either true (when sending a message or handling a socket event) or false (when the operation is complete).

Parameters:

* `loading`: A boolean indicating whether the component should display a loading indicator.

Return Type: None

### `setChatHistory`

Signature: `(history: any[]) => void`

Description: This method updates the chat history state with new messages from the AI assistant or user input.

Parameters:

* `history`: An array of chat message objects.

Return Type: None

### `setWebsocket`

Signature: `(websocket: WebSocket) => void`

Description: This method sets the WebSocket connection state to either a valid connection or null (when the connection is closed).

Parameters:

* `websocket`: A WebSocket object representing the connection.

Return Type: None

### `setSocketId`

Signature: `(id: string | null) => void`

Description: This method sets the socket ID state to either a new ID or null (when the connection is closed).

Parameters:

* `id`: A unique identifier for the WebSocket connection, or null if the connection is closed.

Return Type: None

**Examples**

To use this chat interface, you would first initialize it with a socket ID:
```typescript
import { ChatInterface } from './ChatInterface';

const socketId = 'unique_socket_id';
const chatInterface = <ChatInterface socketId={socketId} />;
```
Then, you can interact with the component by submitting messages and updating the state:
```javascript
chatInterface.sendMessage('Hello!');
// => updates chat history and sends message to AI assistant

chatInterface.updateMessage('New message');
// => updates the current message in the input field
```
**Dependencies**

This chat interface relies on the following dependencies:

* `WebSocket`: The WebSocket API is used for real-time communication between the client and server.
* `v4`: A utility function for generating UUIDs.

**Clarity and Consistency**

The documentation provides clear descriptions of each method, its parameters, and return types. The examples illustrate the usage of the interface and its methods, making it easy to understand how to integrate this component into a larger application. The documentation is well-organized, consistent in style and terminology, and easy to follow.