import React, { useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

export default function JinaOptions({ settings }) {
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-center gap-[36px] mt-1.5 flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="JinaApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Jina API Key"
            defaultValue={settings?.JinaApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Model Preference
          </label>
          <select
            name="EmbeddingModelPref"
            required={true}
            defaultValue={settings?.EmbeddingModelPref}
            className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            <optgroup label="Available embedding models">
              {[
                "jina-embeddings-v3",
                "jina-embeddings-v2-base-en",
                "jina-embeddings-v2-base-zh",
                "jina-embeddings-v2-base-de",
                "jina-embeddings-v2-base-es",
                "jina-embeddings-v2-base-code",
                "jina-clip-v2",
                "jina-clip-v1",
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
      <div className="flex items-center gap-x-3">
        <button
          type="button"
          onClick={() => setShowAdvancedControls(!showAdvancedControls)}
          className="flex items-center gap-x-2 text-white text-sm font-semibold"
        >
          Advanced Settings
          {showAdvancedControls ? (
            <CaretUp size={16} weight="bold" />
          ) : (
            <CaretDown size={16} weight="bold" />
          )}
        </button>
      </div>
      {showAdvancedControls && (
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Task Type
            </label>
            <input
              type="text"
              name="JinaTask"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="e.g. retrieval.document"
              defaultValue={settings?.JinaTask}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Max Chunk Length
            </label>
            <input
              type="number"
              name="EmbeddingModelMaxChunkLength"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="8192"
              defaultValue={settings?.EmbeddingModelMaxChunkLength || 8192}
              required={true}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
