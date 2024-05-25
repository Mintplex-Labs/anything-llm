```javascript
import React, { useEffect, useState } from "react";
import System from "@/models/system";

export default function OllamaEmbeddingOptions({ settings }) {
  const [basePathValue, setBasePathValue] = useState(
    settings?.EmbeddingBasePath
  );
  const [basePath, setBasePath] = useState(settings?.EmbeddingBasePath);

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Ollama Base URL
          </label>
          <input
            type="url"
            name="EmbeddingBasePath"
            className="bg-zinc-900 text-white placeholder-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="http://127.0.0.1:11434"
            defaultValue={settings?.EmbeddingBasePath}
            onChange={(e) => setBasePathValue(e.target.value)}
            onBlur={() => setBasePath(basePathValue)}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <OllamaLLMModelSelection settings={settings} basePath={basePath} />
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Max embedding chunk length
          </label>
          <input
            type="number"
            name="EmbeddingModelMaxChunkLength"
            className="bg-zinc-900 text-white placeholder-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="8192"
            min={1}
            onScroll={(e) => e.target.blur()}
            defaultValue={settings?.EmbeddingModelMaxChunkLength}
            required={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}

function OllamaLLMModelSelection({ settings, basePath = null }) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      if (!basePath) {
        setCustomModels([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { models } = await System.customModels("ollama", null, basePath);
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, [basePath]);

  if (loading || customModels.length == 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Embedding Model Selection
        </label>
        <select
          name="EmbeddingModelPref"
          disabled={true}
          className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {!!basePath
              ? "-- loading available models --"
              : "-- waiting for URL --"}
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-4">
        Embedding Model Selection
      </label>
      <select
        name="EmbeddingModelPref"
        required={true}
        className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {customModels.length > 0 && (
          <optgroup label="Your loaded models">
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings.EmbeddingModelPref === model.id}
                >
                  {model.id}
                </option>
              );
            })}
          </optgroup>
        )}
      </select>
    </div>
  );
}

```
**Ollama Embedding Options Interface Documentation**

**Purpose and Usage:**
The Ollama Embedding Options interface provides a means for users to configure various settings related to embedding models in an application. The interface is designed to be used within the codebase, allowing developers to easily switch between different embedding models and customize their behavior.

**Method Documentation:**

### `OllamaEmbeddingOptions`

#### Signature:
`export default function OllamaEmbeddingOptions({ settings }) { ... }`

#### Purpose:
The `OllamaEmbeddingOptions` interface is responsible for rendering a set of input fields and a dropdown menu that allow users to configure their embedding model preferences.

#### Parameters:

* `settings`: An object containing the current setting values.

#### Return Value:
None.

### `useState`

#### Signature:
`const [basePathValue, setBasePathValue] = useState(settings?.EmbeddingBasePath);`
`const [basePath, setBasePath] = useState(settings?.EmbeddingBasePath);`

#### Purpose:
The `useState` hook is used to manage the state of the `OllamaEmbeddingOptions` interface.

#### Parameters:

* `settings`: An object containing the current setting values.
* `basePathValue`: The current value of the base path input field.
* `setBasePathValue`: A function that updates the `basePathValue`.
* `basePath`: The current value of the base path input field.
* `setBasePath`: A function that updates the `basePath`.

#### Return Value:
None.

### `findCustomModels`

#### Signature:
`const { models } = await System.customModels("ollama", null, basePath);`
`setCustomModels(models || []);`

#### Purpose:
The `findCustomModels` function is responsible for retrieving a list of custom embedding models available for the specified base path.

#### Parameters:

* `basePath`: The current value of the base path input field.

#### Return Value:
None.

**Examples:**

To use the `OllamaEmbeddingOptions` interface, you would need to import it and render its contents within your application. For example:
```jsx
import React from 'react';
import OllamaEmbeddingOptions from './OllamaEmbeddingOptions';

function MyComponent() {
  return (
    <div>
      <OllamaEmbeddingOptions settings={{}} />
    </div>
  );
}
```
**Dependencies:**

The `OllamaEmbeddingOptions` interface depends on the following components:

* `System`: A module that provides access to custom embedding models.
* `useState`: A hook provided by React for managing state.

**Clarity and Consistency:**
The documentation aims to provide clear and concise explanations of each method, parameter, and return value. The structure and formatting are consistent throughout the documentation, making it easy to navigate and understand.