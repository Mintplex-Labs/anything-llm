import { Info } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

const DEFAULT_MODELS = [
  {
    id: "gemini-embedding-001",
    name: "Gemini Embedding 001",
  },
];

export default function GeminiOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-6">
      <div className="w-full flex flex-col gap-y-4">
        <div className="w-full flex items-center gap-[36px] mt-1.5">
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              API Key
            </label>
            <input
              type="password"
              name="GeminiEmbeddingApiKey"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="Gemini API Key"
              defaultValue={
                settings?.GeminiEmbeddingApiKey ? "*".repeat(20) : ""
              }
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
              className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
            >
              <optgroup label="Available embedding models">
                {DEFAULT_MODELS.map((model) => {
                  return (
                    <option
                      key={model.id}
                      value={model.id}
                      selected={settings?.EmbeddingModelPref === model.id}
                    >
                      {model.name}
                    </option>
                  );
                })}
              </optgroup>
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-60">
        <div
          data-tooltip-id="embedding-output-dimensions-tooltip"
          className="flex gap-x-1 items-center mb-3"
        >
          <label className="text-white text-sm font-semibold block">
            Output dimensions
          </label>
          <Info
            size={16}
            className="text-theme-text-secondary cursor-pointer"
          />
          <Tooltip
            id="embedding-output-dimensions-tooltip"
            place="top"
            delayShow={300}
            className="tooltip !text-xs !opacity-100"
            style={{
              maxWidth: "250px",
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            The number of dimensions the resulting output embeddings should have
            if it supports multiple dimensions output.
            <br />
            <br /> Leave blank to use the default dimensions for the selected
            model.
          </Tooltip>
        </div>
        <input
          type="number"
          name="EmbeddingOutputDimensions"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="Assume default dimensions"
          min={1}
          onScroll={(e) => e.target.blur()}
          defaultValue={settings?.EmbeddingOutputDimensions}
          required={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
