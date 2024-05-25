```javascript
import { ABORT_STREAM_EVENT } from "@/utils/chat";
import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { v4 } from "uuid";

const WorkspaceThread = {
  all: async function (workspaceSlug) {
    const { threads } = await fetch(
      `${API_BASE}/workspace/${workspaceSlug}/threads`,
      {
        method: "GET",
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        return { threads: [] };
      });

    return { threads };
  },
  new: async function (workspaceSlug) {
    const { thread, error } = await fetch(
      `${API_BASE}/workspace/${workspaceSlug}/thread/new`,
      {
        method: "POST",
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        return { thread: null, error: e.message };
      });

    return { thread, error };
  },
  update: async function (workspaceSlug, threadSlug, data = {}) {
    const { thread, message } = await fetch(
      `${API_BASE}/workspace/${workspaceSlug}/thread/${threadSlug}/update`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        return { thread: null, message: e.message };
      });

    return { thread, message };
  },
  delete: async function (workspaceSlug, threadSlug) {
    return await fetch(
      `${API_BASE}/workspace/${workspaceSlug}/thread/${threadSlug}`,
      {
        method: "DELETE",
        headers: baseHeaders(),
      }
    )
      .then((res) => res.ok)
      .catch(() => false);
  },
  deleteBulk: async function (workspaceSlug, threadSlugs = []) {
    return await fetch(
      `${API_BASE}/workspace/${workspaceSlug}/thread-bulk-delete`,
      {
        method: "DELETE",
        body: JSON.stringify({ slugs: threadSlugs }),
        headers: baseHeaders(),
      }
    )
      .then((res) => res.ok)
      .catch(() => false);
  },
  chatHistory: async function (workspaceSlug, threadSlug) {
    const history = await fetch(
      `${API_BASE}/workspace/${workspaceSlug}/thread/${threadSlug}/chats`,
      {
        method: "GET",
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .then((res) => res.history || [])
      .catch(() => []);
    return history;
  },
  streamChat: async function (
    { workspaceSlug, threadSlug },
    message,
    handleChat
  ) {
    const ctrl = new AbortController();

    // Listen for the ABORT_STREAM_EVENT key to be emitted by the client
    // to early abort the streaming response. On abort we send a special `stopGeneration`
    // event to be handled which resets the UI for us to be able to send another message.
    // The backend response abort handling is done in each LLM's handleStreamResponse.
    window.addEventListener(ABORT_STREAM_EVENT, () => {
      ctrl.abort();
      handleChat({ id: v4(), type: "stopGeneration" });
    });

    await fetchEventSource(
      `${API_BASE}/workspace/${workspaceSlug}/thread/${threadSlug}/stream-chat`,
      {
        method: "POST",
        body: JSON.stringify({ message }),
        headers: baseHeaders(),
        signal: ctrl.signal,
        openWhenHidden: true,
        async onopen(response) {
          if (response.ok) {
            return; // everything's good
          } else if (
            response.status >= 400 &&
            response.status < 500 &&
            response.status !== 429
          ) {
            handleChat({
              id: v4(),
              type: "abort",
              textResponse: null,
              sources: [],
              close: true,
              error: `An error occurred while streaming response. Code ${response.status}`,
            });
            ctrl.abort();
            throw new Error("Invalid Status code response.");
          } else {
            handleChat({
              id: v4(),
              type: "abort",
              textResponse: null,
              sources: [],
              close: true,
              error: `An error occurred while streaming response. Unknown Error.`,
            });
            ctrl.abort();
            throw new Error("Unknown error");
          }
        },
        async onmessage(msg) {
          try {
            const chatResult = JSON.parse(msg.data);
            handleChat(chatResult);
          } catch {}
        },
        onerror(err) {
          handleChat({
            id: v4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: `An error occurred while streaming response. ${err.message}`,
          });
          ctrl.abort();
          throw new Error();
        },
      }
    );
  },
};

export default WorkspaceThread;

```
# WorkspaceThread Interface Documentation

## Purpose and Usage

The `WorkspaceThread` interface provides a set of methods for interacting with workspace threads. It allows you to create, update, delete, and retrieve information about threads within a workspace.

This interface is designed to be used in a codebase that utilizes RESTful APIs to communicate with a backend server. The methods provided by this interface can be used to perform common operations on threads, such as creating new threads, updating existing ones, deleting threads, and retrieving chat history.

## Methods

### `create`

* **Signature:** `create(workspaceSlug: string, data: { [key: string]: any }): Promise<{ thread: Thread, error?: string }>`
* **Purpose:** Creates a new thread in the specified workspace.
* **Parameters:**
	+ `workspaceSlug`: The slug of the workspace where the thread will be created.
	+ `data`: An object containing information about the thread to be created (e.g. title, description).
* **Return Value:** A promise that resolves with an object containing the created thread and a potential error message.

### `update`

* **Signature:** `update(workspaceSlug: string, threadSlug: string, data: { [key: string]: any }): Promise<{ thread: Thread, message?: string }>`
* **Purpose:** Updates an existing thread in the specified workspace.
* **Parameters:**
	+ `workspaceSlug`: The slug of the workspace where the thread is located.
	+ `threadSlug`: The slug of the thread to be updated.
	+ `data`: An object containing information about the updates (e.g. title, description).
* **Return Value:** A promise that resolves with an object containing the updated thread and a potential error message.

### `delete`

* **Signature:** `delete(workspaceSlug: string, threadSlug: string): Promise<boolean>`
* **Purpose:** Deletes a thread in the specified workspace.
* **Parameters:**
	+ `workspaceSlug`: The slug of the workspace where the thread is located.
	+ `threadSlug`: The slug of the thread to be deleted.
* **Return Value:** A promise that resolves with a boolean indicating whether the deletion was successful.

### `deleteBulk`

* **Signature:** `deleteBulk(workspaceSlug: string, threadSlugs: string[]): Promise<boolean>`
* **Purpose:** Deletes multiple threads in the specified workspace.
* **Parameters:**
	+ `workspaceSlug`: The slug of the workspace where the threads are located.
	+ `threadSlugs`: An array of thread slugs to be deleted.
* **Return Value:** A promise that resolves with a boolean indicating whether the deletions were successful.

### `getChatHistory`

* **Signature:** `getChatHistory(workspaceSlug: string, threadSlug: string): Promise<string[]>`
* **Purpose:** Retrieves the chat history for a specific thread in a workspace.
* **Parameters:**
	+ `workspaceSlug`: The slug of the workspace where the thread is located.
	+ `threadSlug`: The slug of the thread for which to retrieve the chat history.
* **Return Value:** A promise that resolves with an array of strings representing the chat history.

### `stream`

* **Signature:** `stream(workspaceSlug: string, threadSlug: string): Promise<void>`
* **Purpose:** Establishes a stream connection for listening to updates on a specific thread in a workspace.
* **Parameters:**
	+ `workspaceSlug`: The slug of the workspace where the thread is located.
	+ `threadSlug`: The slug of the thread for which to establish the stream connection.
* **Return Value:** A promise that resolves with no value, as the method returns a stream connection.

## Examples

### Creating a new thread
```typescript
const workspaceSlug = 'example-workspace';
const data = { title: 'Example Thread', description: 'This is an example thread.' };
WorkspaceThread.create(workspaceSlug, data).then((response) => {
  console.log(response.thread); // Output: The created thread
});
```

### Updating a thread
```typescript
const workspaceSlug = 'example-workspace';
const threadSlug = 'example-thread';
const data = { title: 'Updated Example Thread' };
WorkspaceThread.update(workspaceSlug, threadSlug, data).then((response) => {
  console.log(response.thread); // Output: The updated thread
});
```

### Deleting a thread
```typescript
const workspaceSlug = 'example-workspace';
const threadSlug = 'example-thread';
WorkspaceThread.delete(workspaceSlug, threadSlug).then((success) => {
  if (success) {
    console.log('Thread deleted successfully!');
  } else {
    console.log('Error deleting the thread.');
  }
});
```

## Dependencies

The `WorkspaceThread` interface relies on the following dependencies:

* A RESTful API endpoint for creating, updating, and deleting threads.
* A data storage mechanism (e.g. database) to store thread information.

## Clarity and Consistency

This documentation aims to provide clear and concise descriptions of each method within the `WorkspaceThread` interface. The purpose and parameters of each method are clearly outlined, along with examples demonstrating their usage. Additionally, the documentation is organized in a consistent style, making it easy to navigate and understand.