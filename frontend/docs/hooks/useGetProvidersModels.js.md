```javascript
import System from "@/models/system";
import { useEffect, useState } from "react";

// Providers which cannot use this feature for workspace<>model selection
export const DISABLED_PROVIDERS = [
  "azure",
  "lmstudio",
  "native",
  "textgenwebui",
];
const PROVIDER_DEFAULT_MODELS = {
  openai: [],
  gemini: ["gemini-pro", "gemini-1.5-pro-latest", "gemini-1.5-flash-latest"],
  anthropic: [
    "claude-instant-1.2",
    "claude-2.0",
    "claude-2.1",
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
  ],
  azure: [],
  lmstudio: [],
  localai: [],
  ollama: [],
  togetherai: [],
  groq: [
    "mixtral-8x7b-32768",
    "llama3-8b-8192",
    "llama3-70b-8192",
    "gemma-7b-it",
  ],
  native: [],
  cohere: [
    "command-r",
    "command-r-plus",
    "command",
    "command-light",
    "command-nightly",
    "command-light-nightly",
  ],
  textgenwebui: [],
};

// For togetherAi, which has a large model list - we subgroup the options
// by their creator organization (eg: Meta, Mistral, etc)
// which makes selection easier to read.
function groupModels(models) {
  return models.reduce((acc, model) => {
    acc[model.organization] = acc[model.organization] || [];
    acc[model.organization].push(model);
    return acc;
  }, {});
}

const groupedProviders = ["togetherai", "openai", "openrouter"];
export default function useGetProviderModels(provider = null) {
  const [defaultModels, setDefaultModels] = useState([]);
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProviderModels() {
      if (!provider) return;
      const { models = [] } = await System.customModels(provider);
      if (
        PROVIDER_DEFAULT_MODELS.hasOwnProperty(provider) &&
        !groupedProviders.includes(provider)
      ) {
        setDefaultModels(PROVIDER_DEFAULT_MODELS[provider]);
      } else {
        setDefaultModels([]);
      }

      groupedProviders.includes(provider)
        ? setCustomModels(groupModels(models))
        : setCustomModels(models);
      setLoading(false);
    }
    fetchProviderModels();
  }, [provider]);

  return { defaultModels, customModels, loading };
}

```
**Purpose and Usage:**

The `useGetProviderModels` interface is designed to fetch and manage provider models for a given provider. This interface is intended to be used within a React application to retrieve and utilize provider models from various AI services.

**Method Documentation:**

### `useGetProviderModels`

```typescript
export default function useGetProviderModels(provider = null) {
  // ...
}
```

#### Parameters:

* `provider`: (optional) The name of the provider for which to fetch models. If not provided, defaults to an empty array.

#### Return Values:

* `defaultModels`: An array of default models associated with the specified provider.
* `customModels`: An array of custom models associated with the specified provider.
* `loading`: A boolean indicating whether the models are currently being fetched or not.

**Description:**

The `useGetProviderModels` hook fetches and manages provider models for a given provider. When called, it retrieves the default and custom models for the specified provider from the `System.customModels()` API. If the provider is not found in the `PROVIDER_DEFAULT_MODELS` object, an empty array is returned.

**Examples:**

To use this interface, simply call it with the desired provider name:
```javascript
import React from 'react';
import { useGetProviderModels } from './useGetProviderModels';

const MyComponent = () => {
  const { defaultModels, customModels, loading } = useGetProviderModels('openai');

  if (loading) {
    return <div>Loading...</div>;
  }

  // Use the retrieved models
  console.log(defaultModels); // Output: []
  console.log(customModels); // Output: [...]
};
```
**Dependencies:**

* `System`: The `System` object provides access to custom models for various AI services.
* `PROVIDER_DEFAULT_MODELS`: An object mapping provider names to their default models.

**Note:** This interface assumes that the `System.customModels()` API returns an object with the following structure:
```typescript
{
  [providerName: string]: string[]
}
```
Where `providerName` is the name of the AI service provider, and `string[]` represents an array of model names associated with that provider.