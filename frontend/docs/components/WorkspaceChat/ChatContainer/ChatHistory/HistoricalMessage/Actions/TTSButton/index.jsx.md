```javascript
import { useEffect, useState } from "react";
import NativeTTSMessage from "./native";
import AsyncTTSMessage from "./asyncTts";
import System from "@/models/system";

export default function TTSMessage({ slug, chatId, message }) {
  const [provider, setProvider] = useState("native");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSettings() {
      const _settings = await System.keys();
      setProvider(_settings?.TextToSpeechProvider ?? "native");
      setLoading(false);
    }
    getSettings();
  }, []);

  if (loading) return null;
  if (provider !== "native")
    return <AsyncTTSMessage slug={slug} chatId={chatId} />;
  return <NativeTTSMessage message={message} />;
}

```
**TTSMessage Interface Documentation**

### Purpose and Usage

The `TTSMessage` interface is a React component responsible for rendering text-to-speech (TTS) messages. Its primary purpose is to determine the preferred TTS provider based on system settings and render either a native or asynchronous TTS message accordingly.

This interface is intended to be used within the codebase to provide a unified way of handling TTS messages in different contexts.

### Method Documentation

#### `TTSMessage` (constructor)

* Parameters:
	+ `slug`: A unique identifier for the message.
	+ `chatId`: The ID of the chat or conversation.
	+ `message`: The text content of the message.
* Return type: None
* Purpose: Initializes the TTSMessage component with the provided parameters.

#### `useState` (initialization)

* Parameters:
	+ `provider`: Initial value for the provider state, set to "native".
	+ `loading`: Initial value for the loading state, set to true.
* Return type: An array containing the provider and loading states.
* Purpose: Initializes the component's internal state with default values.

#### `useEffect` (async initialization)

* Parameters:
	+ `getSettings`: An asynchronous function that retrieves system settings.
* Dependencies: The component's internal state (`provider` and `loading`).
* Return type: None
* Purpose: Calls the `getSettings` function to retrieve the preferred TTS provider and updates the component's state accordingly.

### Examples

Here are some examples of how to use the `TTSMessage` interface:

```javascript
import React from 'react';
import { TTSMessage } from './TTSMessage';

const App = () => {
  const message = 'Hello, world!';
  const chatId = '12345';
  const slug = 'my-message';

  return (
    <div>
      <TTSMessage slug={slug} chatId={chatId} message={message} />
    </div>
  );
};
```

### Dependencies

The `TTSMessage` interface depends on the following:

* `NativeTTSMessage`: A React component responsible for rendering native TTS messages.
* `AsyncTTSMessage`: A React component responsible for rendering asynchronous TTS messages.
* `System`: A model that provides system settings, such as the preferred TTS provider.

### Clarity and Consistency

This documentation aims to provide clear and concise explanations of the `TTSMessage` interface's purpose, methods, and usage. The documentation is organized in a consistent style, using headings and subheadings to facilitate easy navigation.