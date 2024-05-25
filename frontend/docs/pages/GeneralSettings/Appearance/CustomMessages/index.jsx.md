```javascript
import EditingChatBubble from "@/components/EditingChatBubble";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { Plus } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function CustomMessages() {
  const [hasChanges, setHasChanges] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      const messages = await System.getWelcomeMessages();
      setMessages(messages);
    }
    fetchMessages();
  }, []);

  const addMessage = (type) => {
    if (type === "user") {
      setMessages([
        ...messages,
        { user: "Double click to edit...", response: "" },
      ]);
    } else {
      setMessages([
        ...messages,
        { user: "", response: "Double click to edit..." },
      ]);
    }
  };

  const removeMessage = (index) => {
    setHasChanges(true);
    setMessages(messages.filter((_, i) => i !== index));
  };

  const handleMessageChange = (index, type, value) => {
    setHasChanges(true);
    const newMessages = [...messages];
    newMessages[index][type] = value;
    setMessages(newMessages);
  };

  const handleMessageSave = async () => {
    const { success, error } = await System.setWelcomeMessages(messages);
    if (!success) {
      showToast(`Failed to update welcome messages: ${error}`, "error");
      return;
    }
    showToast("Successfully updated welcome messages.", "success");
    setHasChanges(false);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base leading-6 font-bold text-white">
          Custom Messages
        </h2>
        <p className="text-xs leading-[18px] font-base text-white/60">
          Customize the automatic messages displayed to your users.
        </p>
      </div>
      <div className="mt-3 flex flex-col gap-y-6 bg-[#1C1E21] rounded-lg pr-[31px] pl-[12px] pt-4 max-w-[700px]">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col gap-y-2">
            {message.user && (
              <EditingChatBubble
                message={message}
                index={index}
                type="user"
                handleMessageChange={handleMessageChange}
                removeMessage={removeMessage}
              />
            )}
            {message.response && (
              <EditingChatBubble
                message={message}
                index={index}
                type="response"
                handleMessageChange={handleMessageChange}
                removeMessage={removeMessage}
              />
            )}
          </div>
        ))}
        <div className="flex gap-4 mt-12 justify-between pb-[15px]">
          <button
            className="self-end text-white hover:text-white/60 transition"
            onClick={() => addMessage("response")}
          >
            <div className="flex items-center justify-start text-sm font-normal -ml-2">
              <Plus className="m-2" size={16} weight="bold" />
              <span className="leading-5">
                New <span className="font-bold italic mr-1">system</span>{" "}
                message
              </span>
            </div>
          </button>
          <button
            className="self-end text-white hover:text-white/60 transition"
            onClick={() => addMessage("user")}
          >
            <div className="flex items-center justify-start text-sm font-normal">
              <Plus className="m-2" size={16} weight="bold" />
              <span className="leading-5">
                New <span className="font-bold italic mr-1">user</span> message
              </span>
            </div>
          </button>
        </div>
      </div>
      {hasChanges && (
        <div className="flex justify-start pt-6">
          <button
            className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            onClick={handleMessageSave}
          >
            Save Messages
          </button>
        </div>
      )}
    </div>
  );
}

```
**Purpose and Usage:**

The provided TypeScript code defines a `CustomMessages` component that allows users to customize automatic messages displayed to their users. The interface enables the creation, editing, and removal of custom messages, as well as saving changes.

**Method Documentation:**

### `fetchMessages()`

* **Signature:** `async function fetchMessages() { ... }`
* **Purpose:** Fetches a list of default messages from an unknown source ( likely a backend API or database).
* **Parameters:** None
* **Return type:** A list of messages (`messages`)
* **Description:** This method is called to initialize the component with default messages. It should return an array of objects containing `user` and `response` properties.

### `handleMessageChange(index, type, message)`

* **Signature:** `(index: number, type: string, message: any) => void`
* **Purpose:** Handles changes made to a custom message.
* **Parameters:**
	+ `index`: The index of the message being edited.
	+ `type`: The type of the message (either "user" or "response").
	+ `message`: The updated message content.
* **Return type:** None
* **Description:** This method should be called whenever a user edits a custom message. It should update the corresponding message in the component's state.

### `removeMessage(index)`

* **Signature:** `(index: number) => void`
* **Purpose:** Removes a custom message from the list.
* **Parameters:** The index of the message to remove.
* **Return type:** None
* **Description:** This method should be called whenever a user removes a custom message. It should update the component's state by removing the corresponding message.

### `addMessage(type)`

* **Signature:** `(type: string) => void`
* **Purpose:** Adds a new custom message to the list.
* **Parameters:** The type of the message (either "user" or "response").
* **Return type:** None
* **Description:** This method should be called whenever a user adds a new custom message. It should update the component's state by adding a new message with the provided type.

### `handleMessageSave()`

* **Signature:** `() => void`
* **Purpose:** Saves all changes made to custom messages.
* **Parameters:** None
* **Return type:** None
* **Description:** This method should be called whenever the user clicks the "Save" button. It should update the backend API or database with the current state of the custom messages.

**Examples:**

To demonstrate the usage of this component, consider a simple example where we add two new custom messages and then edit one of them:

```typescript
import { CustomMessages } from './CustomMessages';

// Initialize the component
const customMessages = new CustomMessages();

// Add two new custom messages
customMessages.addMessage('response');
customMessages.addMessage('user');

// Edit the first message
customMessages.handleMessageChange(0, 'response', 'New response message!');
```

**Dependencies:**

This component likely depends on other parts of the codebase, such as:

* A backend API or database to store and retrieve custom messages.
* Other components that interact with this one, like a message editor or a user interface.

**Clarity and Consistency:**

The documentation should be written in a clear and concise manner, using consistent terminology and formatting. The purpose of each method and component should be clearly described, along with any relevant details about parameters, return types, and usage examples.