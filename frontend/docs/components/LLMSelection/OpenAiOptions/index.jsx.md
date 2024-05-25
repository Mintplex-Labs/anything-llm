```javascript
import { useState, useEffect } from "react";
import System from "@/models/system";

export default function OpenAiOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.OpenAiKey);
  const [openAIKey, setOpenAIKey] = useState(settings?.OpenAiKey);

  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          API Key
        </label>
        <input
          type="password"
          name="OpenAiKey"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
          placeholder="OpenAI API Key"
          defaultValue={settings?.OpenAiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => setOpenAIKey(inputValue)}
        />
      </div>
      {!settings?.credentialsOnly && (
        <OpenAIModelSelection settings={settings} apiKey={openAIKey} />
      )}
    </div>
  );
}

function OpenAIModelSelection({ apiKey, settings }) {
  const [groupedModels, setGroupedModels] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      setLoading(true);
      const { models } = await System.customModels(
        "openai",
        typeof apiKey === "boolean" ? null : apiKey
      );

      if (models?.length > 0) {
        const modelsByOrganization = models.reduce((acc, model) => {
          acc[model.organization] = acc[model.organization] || [];
          acc[model.organization].push(model);
          return acc;
        }, {});
        setGroupedModels(modelsByOrganization);
      }

      setLoading(false);
    }
    findCustomModels();
  }, [apiKey]);

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Chat Model Selection
        </label>
        <select
          name="OpenAiModelPref"
          disabled={true}
          className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- loading available models --
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-4">
        Chat Model Selection
      </label>
      <select
        name="OpenAiModelPref"
        required={true}
        className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {Object.keys(groupedModels)
          .sort()
          .map((organization) => (
            <optgroup key={organization} label={organization}>
              {groupedModels[organization].map((model) => (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings?.OpenAiModelPref === model.id}
                >
                  {model.name}
                </option>
              ))}
            </optgroup>
          ))}
      </select>
    </div>
  );
}

```
**Purpose and Usage:**
The provided code defines two React components, `OpenAiOptions` and `OpenAIModelSelection`, which are used to manage OpenAI API keys and model selections in a codebase. The `OpenAiOptions` component is responsible for handling the input of an OpenAI API key and storing it in state. It also provides a UI for selecting the OpenAI model. The `OpenAIModelSelection` component fetches a list of custom OpenAI models based on the provided API key and displays them in a dropdown menu.

**Method Documentation:**

### `OpenAiOptions`

* **Signature:** `export default function OpenAiOptions({ settings })`
* **Purpose:** To provide a UI for entering an OpenAI API key and storing it in state.
* **Parameters:**
	+ `settings`: An object containing the current settings, including the OpenAI API key.
* **Return Type:** None
* **Description:** This component initializes two state variables, `inputValue` and `openAIKey`, to store the entered API key. It also returns a JSX element that includes an input field for entering the API key and a label indicating its purpose.

### `OpenAIModelSelection`

* **Signature:** `function OpenAIModelSelection({ apiKey, settings })`
* **Purpose:** To fetch a list of custom OpenAI models based on the provided API key and display them in a dropdown menu.
* **Parameters:**
	+ `apiKey`: The OpenAI API key to use for fetching models.
	+ `settings`: An object containing the current settings, including the selected model.
* **Return Type:** A JSX element representing the dropdown menu of available OpenAI models.
* **Description:** This component initializes two state variables, `groupedModels` and `loading`, to store the fetched models and their organization. It uses the `useEffect` hook to fetch the custom OpenAI models when the API key changes. If the loading status is true, it displays a placeholder message indicating that the models are being loaded.

**Examples:**

* To use the `OpenAiOptions` component, you would need to provide an object with the current settings, including the OpenAI API key.
```javascript
import React from 'react';
import OpenAiOptions from './OpenAiOptions';

const settings = {
  OpenAiKey: 'your-openai-api-key',
};

function MyComponent() {
  return (
    <div>
      <OpenAiOptions settings={settings} />
    </div>
  );
}
```
* To use the `OpenAIModelSelection` component, you would need to provide an object with the current settings, including the selected model.
```javascript
import React from 'react';
import OpenAIModelSelection from './OpenAIModelSelection';

const settings = {
  OpenAiModelPref: 'your-selected-model-id',
};

function MyComponent() {
  return (
    <div>
      <OpenAIModelSelection settings={settings} />
    </div>
  );
}
```
**Dependencies:**

* The `OpenAiOptions` and `OpenAIModelSelection` components rely on the `useState` and `useEffect` hooks from React.
* The `OpenAIModelSelection` component relies on the `Object.keys` method to sort and map the available OpenAI models.

**Clarity and Consistency:**

The provided code is well-organized, easy to understand, and consistent in style and terminology. The use of React hooks and JSX elements makes it easy to read and maintain. However, some documentation would be helpful for understanding the purpose and usage of each component.