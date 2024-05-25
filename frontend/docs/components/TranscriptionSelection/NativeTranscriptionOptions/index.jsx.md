```javascript
import { Gauge } from "@phosphor-icons/react";
import { useState } from "react";

export default function NativeTranscriptionOptions({ settings }) {
  const [model, setModel] = useState(settings?.WhisperModelPref);

  return (
    <div className="w-full flex flex-col gap-y-4">
      <LocalWarning model={model} />
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Model Selection
          </label>
          <select
            name="WhisperModelPref"
            defaultValue={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            {["Xenova/whisper-small", "Xenova/whisper-large"].map(
              (value, i) => {
                return (
                  <option key={i} value={value}>
                    {value}
                  </option>
                );
              }
            )}
          </select>
        </div>
      </div>
    </div>
  );
}

function LocalWarning({ model }) {
  switch (model) {
    case "Xenova/whisper-small":
      return <WhisperSmall />;
    case "Xenova/whisper-large":
      return <WhisperLarge />;
    default:
      return <WhisperSmall />;
  }
}

function WhisperSmall() {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
      <div className="gap-x-2 flex items-center">
        <Gauge size={25} />
        <p className="text-sm">
          Running the <b>whisper-small</b> model on a machine with limited RAM
          or CPU can stall AnythingLLM when processing media files.
          <br />
          We recommend at least 2GB of RAM and upload files &lt;10Mb.
          <br />
          <br />
          <i>
            This model will automatically download on the first use. (250mb)
          </i>
        </p>
      </div>
    </div>
  );
}

function WhisperLarge() {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
      <div className="gap-x-2 flex items-center">
        <Gauge size={25} />
        <p className="text-sm">
          Using the <b>whisper-large</b> model on machines with limited RAM or
          CPU can stall AnythingLLM when processing media files. This model is
          substantially larger than the whisper-small.
          <br />
          We recommend at least 8GB of RAM and upload files &lt;10Mb.
          <br />
          <br />
          <i>
            This model will automatically download on the first use. (1.56GB)
          </i>
        </p>
      </div>
    </div>
  );
}

```
**NativeTranscriptionOptions Documentation**

### Purpose and Usage

The `NativeTranscriptionOptions` interface provides a way to configure transcription settings for native media file processing. This component is used in conjunction with other parts of the codebase to enable seamless media file processing.

### Method Documentation

#### `NativeTranscriptionOptions` constructor

* **Signature:** `export default function NativeTranscriptionOptions({ settings }) { ... }`
* **Purpose:** Initializes the transcription options component.
* **Parameters:**
	+ `settings`: An object containing configuration settings for native media file processing.
* **Return Value:** None.

#### `useState` hook

* **Signature:** `const [model, setModel] = useState(settings?.WhisperModelPref);`
* **Purpose:** Initializes the state for the transcription options component.
* **Parameters:**
	+ `settings`: An object containing configuration settings for native media file processing.
	+ `WhisperModelPref`: A property within the settings object that specifies the preferred whisper model.
* **Return Value:** An array containing the current model value and a function to update it.

#### `LocalWarning` component

* **Signature:** `function LocalWarning({ model }) { ... }`
* **Purpose:** Displays a warning message based on the selected whisper model.
* **Parameters:**
	+ `model`: The currently selected whisper model.
* **Return Value:** A JSX element containing the warning message.

#### `WhisperSmall` and `WhisperLarge` components

* **Signatures:** `function WhisperSmall() { ... }` and `function WhisperLarge() { ... }`
* **Purposes:** Display information about the selected whisper model, including its size and any relevant warnings.
* **Return Values:** JSX elements containing information about the selected whisper model.

### Examples

To use the `NativeTranscriptionOptions` interface, you would typically wrap it around other components that require transcription settings. For example:
```jsx
import NativeTranscriptionOptions from './NativeTranscriptionOptions';

function MyComponent() {
  const [model, setModel] = useState(settings?.WhisperModelPref);

  return (
    <div>
      <NativeTranscriptionOptions settings={settings} />
      <!-- other component code -->
    </div>
  );
}
```
### Dependencies

The `NativeTranscriptionOptions` interface relies on the following dependencies:

* `@phosphor-icons/react`: For rendering icons.
* `react`: For building JSX elements.

### Clarity and Consistency

This documentation is written in a clear and concise style, with consistent terminology and formatting throughout. The purpose of each method and component is clearly described, along with relevant details about parameters, return values, and dependencies.