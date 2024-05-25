```javascript
import System from "@/models/system";
import { useState, useEffect } from "react";

export default function OpenRouterOptions({ settings }) {
  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          OpenRouter API Key
        </label>
        <input
          type="password"
          name="OpenRouterApiKey"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
          placeholder="OpenRouter API Key"
          defaultValue={settings?.OpenRouterApiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      {!settings?.credentialsOnly && (
        <OpenRouterModelSelection settings={settings} />
      )}
    </div>
  );
}

function OpenRouterModelSelection({ settings }) {
  const [groupedModels, setGroupedModels] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      setLoading(true);
      const { models } = await System.customModels("openrouter");
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
  }, []);

  if (loading || Object.keys(groupedModels).length === 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Chat Model Selection
        </label>
        <select
          name="OpenRouterModelPref"
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
        name="OpenRouterModelPref"
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
                  selected={settings?.OpenRouterModelPref === model.id}
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
**OpenRouterOptions Interface Documentation**

### Purpose and Usage

The `OpenRouterOptions` interface provides a configuration panel for OpenRouter API Key and model selection. It is intended to be used in conjunction with the `System` module from `"@/models/system"`, which handles custom models for OpenRouter.

### Methods

#### `OpenRouterOptions`

* **Signature:** `export default function OpenRouterOptions({ settings })`
* **Purpose:** Renders a configuration panel for OpenRouter API Key and model selection.
* **Parameters:**
	+ `{settings}`: An object containing the current settings, including `OpenRouterApiKey` and `credentialsOnly`.
* **Return Value:** A JSX element representing the configuration panel.

**Examples:**

To use the `OpenRouterOptions` interface, simply import it and pass the required settings object as a prop:
```javascript
import OpenRouterOptions from './OpenRouterOptions';

const App = () => {
  const settings = { OpenRouterApiKey: '', credentialsOnly: false };
  return <OpenRouterOptions settings={settings} />;
};
```
#### `OpenRouterModelSelection`

* **Signature:** `function OpenRouterModelSelection({ settings })`
* **Purpose:** Renders a dropdown menu for selecting chat models from the available custom models.
* **Parameters:**
	+ `{settings}`: An object containing the current settings, including `credentialsOnly`.
* **Return Value:** A JSX element representing the dropdown menu.

**Examples:**

To use the `OpenRouterModelSelection` function, simply import it and pass the required settings object as a prop:
```javascript
import OpenRouterModelSelection from './OpenRouterModelSelection';

const App = () => {
  const settings = { credentialsOnly: false };
  return <OpenRouterModelSelection settings={settings} />;
};
```
### Dependencies

The `OpenRouterOptions` interface depends on the following dependencies:

* `"@/models/system"`: The System module, which provides custom models for OpenRouter.
* `useState` and `useEffect`: Hooks from React, used to manage state and side effects in the component.

### Clarity and Consistency

This documentation is organized into sections that clearly explain the purpose and usage of each method. Consistent naming conventions and formatting are used throughout the documentation to ensure ease of understanding.