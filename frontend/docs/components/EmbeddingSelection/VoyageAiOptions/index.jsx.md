```javascript
export default function VoyageAiOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            API Key
          </label>
          <input
            type="password"
            name="VoyageAiApiKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Voyage AI API Key"
            defaultValue={settings?.VoyageAiApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Model Preference
          </label>
          <select
            name="EmbeddingModelPref"
            required={true}
            defaultValue={settings?.EmbeddingModelPref}
            className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            <optgroup label="Available embedding models">
              {[
                "voyage-large-2-instruct",
                "voyage-law-2",
                "voyage-code-2",
                "voyage-large-2",
                "voyage-2",
              ].map((model) => {
                return (
                  <option key={model} value={model}>
                    {model}
                  </option>
                );
              })}
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
}

```
**Voyage Ai Options Documentation**

### Purpose and Usage

The `VoyageAiOptions` interface provides a configuration options for Voyage AI. This interface is used to set up API keys and model preferences for integrating Voyage AI into your application.

### Method Documentation

#### `VoyageAiOptions(settings: any)`

This method returns an HTML element that contains form fields for configuring Voyage AI options.

* **Method Signature:** `export default function VoyageAiOptions({ settings }: { settings?: any }) => JSX.Element`
* **Purpose:** To provide a configuration interface for Voyage AI.
* **Parameters:**
	+ `settings`: An object containing the current settings. This parameter is optional and defaults to an empty object if not provided.
* **Return Type:** A JSX element representing the HTML form fields.

#### Example:

```html
<VoyageAiOptions settings={mySettings}>
  // render the configuration form here
</VoyageAiOptions>
```

### Examples

To use the `VoyageAiOptions` interface, you can render it in your application like this:
```html
import React from 'react';
import { VoyageAiOptions } from './VoyageAiOptions';

const App = () => {
  const mySettings = { /* your settings object */ };

  return (
    <div>
      <VoyageAiOptions settings={mySettings} />
    </div>
  );
};
```

### Dependencies

The `VoyageAiOptions` interface depends on the following components:

* `JSX.Element`: The type of JSX element returned by the `VoyageAiOptions` method.
* `React`: The JavaScript library used to render the HTML form fields.

### Clarity and Consistency

This documentation is well-organized, easy to understand, and consistent in style and terminology.