import { useState, useEffect } from "react";

// Available ModelsLab models — matches the server-side MODELSLAB_MODELS catalogue.
const MODELSLAB_MODELS = [
  {
    id: "llama-3.1-8b-uncensored",
    name: "Llama 3.1 8B Uncensored",
    description: "Fast, efficient — ideal for most tasks",
    maxLength: 131072,
  },
  {
    id: "llama-3.1-70b-uncensored",
    name: "Llama 3.1 70B Uncensored",
    description: "Higher quality — best for complex reasoning",
    maxLength: 131072,
  },
];

/**
 * ModelsLabOptions — Settings panel for the ModelsLab LLM provider.
 *
 * Rendered inside AnythingLLM's LLM provider selector when the user
 * picks "ModelsLab" from the provider list.
 */
export default function ModelsLabOptions({ settings }) {
  const [apiKey, setApiKey] = useState(settings?.ModelsLabApiKey ?? "");
  const [modelPref, setModelPref] = useState(
    settings?.ModelsLabModelPref ?? "llama-3.1-8b-uncensored"
  );
  const [showApiKey, setShowApiKey] = useState(false);

  const selectedModel =
    MODELSLAB_MODELS.find((m) => m.id === modelPref) ?? MODELSLAB_MODELS[0];

  return (
    <div className="flex flex-col gap-y-4">
      {/* API Key */}
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          ModelsLab API Key
        </label>
        <div className="relative">
          <input
            type={showApiKey ? "text" : "password"}
            name="ModelsLabApiKey"
            className="rounded-lg px-4 py-2 text-white bg-zinc-900 placeholder:text-zinc-400 text-sm w-full"
            placeholder="modelslab-xxxxxxxxxxxx"
            defaultValue={apiKey}
            required
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            title={showApiKey ? "Hide API key" : "Show API key"}
          >
            {showApiKey ? (
              // Eye-off icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              // Eye icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
          Get your API key at{" "}
          <a
            href="https://modelslab.com"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            modelslab.com
          </a>
        </p>
      </div>

      {/* Model selector */}
      {apiKey && (
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Model
          </label>
          <select
            name="ModelsLabModelPref"
            value={modelPref}
            onChange={(e) => setModelPref(e.target.value)}
            className="rounded-lg px-4 py-2.5 text-white bg-zinc-900 text-sm w-full"
          >
            {MODELSLAB_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          {selectedModel && (
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
              {selectedModel.description} &bull;{" "}
              {(selectedModel.maxLength / 1000).toFixed(0)}K context
            </p>
          )}
        </div>
      )}

      {/* Info callout */}
      <div className="flex flex-col gap-y-1 mt-1">
        <div className="flex items-start gap-x-2 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-xs text-blue-300">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          <span>
            ModelsLab offers uncensored Llama 3.1 models — ideal for creative,
            research, and unrestricted use cases. Models feature 128K context
            windows at competitive pricing.{" "}
            <a
              href="https://docs.modelslab.com"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              View docs ↗
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
