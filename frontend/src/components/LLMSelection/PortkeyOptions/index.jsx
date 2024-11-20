import React, { useState } from 'react';

function PortkeyModelSelection({ settings }) {
  // Static list of models supported by Portkey
  const availableModels = [
    { id: "gpt-4", name: "GPT-4" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    { id: "claude-2", name: "Claude 2" },
    { id: "claude-instant-1", name: "Claude Instant" },
    { id: "palm-2", name: "PaLM 2" },
    { id: "gemini-pro", name: "Gemini Pro" },
    { id: "mistral-medium", name: "Mistral Medium" },
    { id: "llama-2-70b", name: "Llama 2 70B" }
  ];

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-4">
        Chat Model Selection
      </label>
      <select
        name="PortkeyModelPref"
        required={true}
        className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        defaultValue={settings?.PortkeyModelPref || "gpt-3.5-turbo"}
      >
        <optgroup label="Available Models">
          {availableModels.map((model) => (
            <option
              key={model.id}
              value={model.id}
              selected={settings?.PortkeyModelPref === model.id}
            >
              {model.name}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}

export default function PortkeyOptions({ settings }) {
  const [basePathValue, setBasePathValue] = useState(settings?.PortkeyBasePath);
  const [basePath, setBasePath] = useState(settings?.PortkeyBasePath);
  const [apiKeyValue, setApiKeyValue] = useState(settings?.PortkeyAPIKey);
  const [apiKey, setApiKey] = useState(settings?.PortkeyAPIKey);
  const [configSlugValue, setConfigSlugValue] = useState(settings?.PortkeyConfigSlug);
  const [virtualKeyValue, setVirtualKeyValue] = useState(settings?.PortkeyVirtualKey);

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Base URL
          </label>
          <input
            type="url"
            name="PortkeyBasePath"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="https://api.portkey.ai/v1"
            defaultValue={settings?.PortkeyBasePath}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setBasePathValue(e.target.value)}
            onBlur={() => setBasePath(basePathValue)}
          />
        </div>
        <PortkeyModelSelection settings={settings} />
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Token context window
          </label>
          <input
            type="number"
            name="PortkeyTokenLimit"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="4096"
            min={1}
            onScroll={(e) => e.target.blur()}
            defaultValue={settings?.PortkeyTokenLimit}
            required={true}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <div className="flex flex-col gap-y-1 mb-4">
            <label className="text-white text-sm font-semibold flex items-center gap-x-2">
              API Key
            </label>
          </div>
          <input
            type="password"
            name="PortkeyAPIKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="pk-xxxxx"
            defaultValue={settings?.PortkeyAPIKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setApiKeyValue(e.target.value)}
            onBlur={() => setApiKey(apiKeyValue)}
          />
        </div>
        <div className="flex flex-col w-60">
          <div className="flex flex-col gap-y-1 mb-4">
            <label className="text-white text-sm font-semibold flex items-center gap-x-2">
              Config Slug
              <small className="text-gray-400">(Required if Virtual Key not provided)</small>
            </label>
          </div>
          <input
            type="text"
            name="PortkeyConfigSlug"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="my-config-slug"
            defaultValue={settings?.PortkeyConfigSlug || ""}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setConfigSlugValue(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-60">
          <div className="flex flex-col gap-y-1 mb-4">
            <label className="text-white text-sm font-semibold flex items-center gap-x-2">
              Virtual Key
              <small className="text-gray-400">(Required if Config Slug not provided)</small>
            </label>
          </div>
          <input
            type="text"
            name="PortkeyVirtualKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="vk-xxxxx"
            defaultValue={settings?.PortkeyVirtualKey || ""}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setVirtualKeyValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}