```javascript
import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const Embed = {
  embeds: async () => {
    return await fetch(`${API_BASE}/embeds`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.embeds || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  newEmbed: async (data) => {
    return await fetch(`${API_BASE}/embeds/new`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { embed: null, error: e.message };
      });
  },
  updateEmbed: async (embedId, data) => {
    return await fetch(`${API_BASE}/embed/update/${embedId}`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  deleteEmbed: async (embedId) => {
    return await fetch(`${API_BASE}/embed/${embedId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (res.ok) return { success: true, error: null };
        throw new Error(res.statusText);
      })
      .catch((e) => {
        console.error(e);
        return { success: true, error: e.message };
      });
  },
  chats: async (offset = 0) => {
    return await fetch(`${API_BASE}/embed/chats`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ offset }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  deleteChat: async (chatId) => {
    return await fetch(`${API_BASE}/embed/chats/${chatId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
};

export default Embed;

```
**Embed Interface Documentation**

### Purpose and Usage

The Embed interface provides a set of methods for interacting with embeds in an application. It is intended for use by developers to create, update, and manage embeds within their codebase.

### Methods

#### `embeds()`
Returns a list of all available embeds.

* **Return type:** Promise\<Array\<Embed>>
* **Description:** Retrieves a list of all embeds available in the system.
* **Parameters:** None
* **Example:**
```javascript
const embedList = await Embed.embeds();
console.log(embedList); // Output: [Embed 1, Embed 2, ...]
```
#### `newEmbed(data)`
Creates a new embed with the provided data.

* **Return type:** Promise\<{ success: boolean, error?: string }>
* **Description:** Creates a new embed in the system with the provided data.
* **Parameters:**
	+ `data`: The data to be used for creating the new embed. (Type: Object)
* **Example:**
```javascript
const newData = { title: "New Embed", description: "This is a new embed" };
const result = await Embed.newEmbed(newData);
if (result.success) {
  console.log("Embed created successfully!");
} else {
  console.error(result.error); // Output: Error message
}
```
#### `updateEmbed(embedId, data)`
Updates an existing embed with the provided data.

* **Return type:** Promise\<{ success: boolean, error?: string }>
* **Description:** Updates an existing embed in the system with the provided data.
* **Parameters:**
	+ `embedId`: The ID of the embed to be updated. (Type: String)
	+ `data`: The data to be used for updating the embed. (Type: Object)
* **Example:**
```javascript
const updatedData = { title: "Updated Embed", description: "This is an updated embed" };
const result = await Embed.updateEmbed("embed-1", updatedData);
if (result.success) {
  console.log("Embed updated successfully!");
} else {
  console.error(result.error); // Output: Error message
}
```
#### `deleteEmbed(embedId)`
Deletes an existing embed.

* **Return type:** Promise\<{ success: boolean, error?: string }>
* **Description:** Deletes an existing embed in the system.
* **Parameters:**
	+ `embedId`: The ID of the embed to be deleted. (Type: String)
* **Example:**
```javascript
const result = await Embed.deleteEmbed("embed-1");
if (result.success) {
  console.log("Embed deleted successfully!");
} else {
  console.error(result.error); // Output: Error message
}
```
#### `chats(offset = 0)`
Retrieves a list of chats associated with the embeds.

* **Return type:** Promise\<Array\<Chat>>
* **Description:** Retrieves a list of chats associated with the embeds.
* **Parameters:**
	+ `offset`: The offset for pagination. (Type: Number, default: 0)
* **Example:**
```javascript
const chatList = await Embed.chats();
console.log(chatList); // Output: [Chat 1, Chat 2, ...]
```
#### `deleteChat(chatId)`
Deletes a specific chat.

* **Return type:** Promise\<{ success: boolean, error?: string }>
* **Description:** Deletes a specific chat associated with the embeds.
* **Parameters:**
	+ `chatId`: The ID of the chat to be deleted. (Type: String)
* **Example:**
```javascript
const result = await Embed.deleteChat("chat-1");
if (result.success) {
  console.log("Chat deleted successfully!");
} else {
  console.error(result.error); // Output: Error message
}
```
### Dependencies

The Embed interface depends on the `API_BASE` constant, which is imported from `@/utils/constants`. It also relies on the `baseHeaders()` function from `@/utils/request`.

### Clarity and Consistency

This documentation is designed to be clear, concise, and consistent in style and terminology. The examples provided are intended to illustrate the usage of the interface and its methods, making it easier for developers to understand how to integrate the Embed interface into their codebase.