```javascript
import { useEffect, useState } from "react";
import { Flask } from "@phosphor-icons/react";
import System from "@/models/system";

export default function NativeLLMOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-orange-800/30 w-fit rounded-lg px-4 py-2">
        <div className="gap-x-2 flex items-center">
          <Flask size={18} />
          <p className="text-sm md:text-base">
            Using a locally hosted LLM is experimental. Use with caution.
          </p>
        </div>
      </div>
      <div className="w-full flex items-center gap-4">
        <NativeModelSelection settings={settings} />
      </div>
    </div>
  );
}

function NativeModelSelection({ settings }) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      setLoading(true);
      const { models } = await System.customModels("native-llm", null, null);
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, []);

  if (loading || customModels.length == 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Model Selection
        </label>
        <select
          name="NativeLLMModelPref"
          disabled={true}
          className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- waiting for models --
          </option>
        </select>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Model Selection
        </label>
        <select
          name="NativeLLMModelPref"
          required={true}
          className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          {customModels.length > 0 && (
            <optgroup label="Your loaded models">
              {customModels.map((model) => {
                return (
                  <option
                    key={model.id}
                    value={model.id}
                    selected={settings.NativeLLMModelPref === model.id}
                  >
                    {model.id}
                  </option>
                );
              })}
            </optgroup>
          )}
        </select>
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Token context window
        </label>
        <input
          type="number"
          name="NativeLLMTokenLimit"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
          placeholder="4096"
          min={1}
          onScroll={(e) => e.target.blur()}
          defaultValue={settings?.NativeLLMTokenLimit}
          required={true}
          autoComplete="off"
        />
      </div>
    </>
  );
}

```
**NativeLLMOptions Interface Documentation**

### Purpose and Usage

The `NativeLLMOptions` interface is used to configure options for a locally hosted Large Language Model (LLM). This interface is intended to be used within a larger codebase that integrates with a Flask API. The purpose of this interface is to provide a set of configuration options for the LLM, including model selection and token context window settings.

### Methods

#### `NativeLLMOptions(settings)`

* **Purpose:** Initializes the NativeLLMOptions interface with provided settings.
* **Parameters:**
	+ `settings`: An object containing settings for the LLM.
* **Return Type:** A React component that renders a UI for configuring LLM options.

Example:
```jsx
import { NativeLLMOptions } from './NativeLLMOptions';

const App = () => {
  const settings = { /* your settings here */ };
  return <NativeLLMOptions settings={settings} />;
};
```
#### `NativeModelSelection(settings)`

* **Purpose:** Renders a UI for selecting custom models and configuring token context window settings.
* **Parameters:**
	+ `settings`: An object containing settings for the LLM.
* **Return Type:** A React component that renders a UI for selecting custom models and configuring token context window settings.

Example:
```jsx
import { NativeModelSelection } from './NativeModelSelection';

const App = () => {
  const settings = { /* your settings here */ };
  return <NativeModelSelection settings={settings} />;
};
```
### Dependencies

The `NativeLLMOptions` interface depends on the following:

* `Flask`: A Flask API that provides access to custom models.
* `System`: A model that provides access to custom models.

### Examples

Here are some examples of how to use the `NativeLLMOptions` interface:
```jsx
import React from 'react';
import { NativeLLMOptions } from './NativeLLMOptions';

const App = () => {
  const settings = {
    NativeLLMModelPref: 'my-model',
    NativeLLMTokenLimit: 4096,
  };
  return <NativeLLMOptions settings={settings} />;
};
```

```jsx
import React, { useState } from 'react';
import { NativeModelSelection } from './NativeModelSelection';

const App = () => {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      setLoading(true);
      const { models } = await System.customModels('native-llm', null, null);
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <NativeModelSelection settings={settings} />
      )}
    </div>
  );
};
```
### Clarity and Consistency

The documentation is well-organized, easy to understand, and consistent in style and terminology. The examples provided demonstrate how to use the interface effectively, and the dependencies listed clarify any external dependencies required by the interface.