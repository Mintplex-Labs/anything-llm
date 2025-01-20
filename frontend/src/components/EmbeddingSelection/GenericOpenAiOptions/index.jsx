import React, { useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

function EmbeddingType({ settings, type = "dense", title }) {
  const inputConfig = [
    {
      label: "Base URL",
      inputProps: {
        type: "url",
        name:
          type === "dense" ? "EmbeddingBasePath" : "SparseEmbeddingBasePath",
        className:
          "border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5",
        placeholder: "https://api.openai.com/v1",
        defaultValue:
          type === "dense"
            ? settings?.EmbeddingBasePath
            : settings?.SparseEmbeddingBasePath,
        required: true,
        autoComplete: "off",
        spellCheck: false,
      },
    },
    {
      label: "Embedding Model",
      inputProps: {
        type: "text",
        name:
          type === "dense" ? "EmbeddingModelPref" : "SparseEmbeddingModelPref",
        className:
          "border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5",
        placeholder: "text-embedding-ada-002",
        defaultValue:
          type === "dense"
            ? settings?.EmbeddingModelPref
            : settings?.SparseEmbeddingModelPref,
        required: true,
        autoComplete: "off",
        spellCheck: false,
      },
    },
    {
      label: (
        <div className="flex flex-col gap-y-1 mb-4">
          <label className="text-white text-sm font-semibold flex items-center gap-x-2">
            API Key <p className="!text-xs !italic !font-thin">optional</p>
          </label>
        </div>
      ),
      inputProps: {
        type: "password",
        name:
          type === "dense"
            ? "GenericOpenAiEmbeddingApiKey"
            : "SparseGenericOpenAiEmbeddingApiKey",
        className:
          "border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5",
        placeholder: "sk-mysecretkey",
        defaultValue:
          settings?.GenericOpenAiEmbeddingApiKey ||
          settings?.SparseGenericOpenAiEmbeddingApiKey
            ? "*".repeat(20)
            : "",
        autoComplete: "off",
        spellCheck: false,
      },
    },
  ];
  return (
    <div className="flex flex-col gap-[12px]">
      <h1>{title}</h1>
      <div className="w-full flex items-center gap-[36px] mt-1.5 flex-wrap">
        {inputConfig?.map((config, index) => (
          <div
            className="flex flex-col w-60"
            key={`${index}-${config.inputProps?.name}`}
          >
            {typeof config?.label === "string" ? (
              <label className="text-white text-sm font-semibold block mb-3">
                {config.label}
              </label>
            ) : (
              config.label
            )}
            <input {...config?.inputProps} />
          </div>
        ))}
      </div>
    </div>
  );
}
export default function GenericOpenAiEmbeddingOptions({ settings }) {
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="space-y-[24px]">
        <EmbeddingType settings={settings} title={"Dense Embedder"} />
        <EmbeddingType
          settings={settings}
          title={"Sparse Embedder"}
          type="sparse"
        />
      </div>
      <div className="flex justify-start mt-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowAdvancedControls(!showAdvancedControls);
          }}
          className="border-none text-theme-text-primary hover:text-theme-text-secondary flex items-center text-sm"
        >
          {showAdvancedControls ? "Hide" : "Show"} advanced settings
          {showAdvancedControls ? (
            <CaretUp size={14} className="ml-1" />
          ) : (
            <CaretDown size={14} className="ml-1" />
          )}
        </button>
      </div>
      <div hidden={!showAdvancedControls}>
        <div className="w-full flex items-center gap-[36px] mt-1.5 flex-wrap">
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Max embedding chunk length
            </label>
            <input
              type="number"
              name="EmbeddingModelMaxChunkLength"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="8192"
              min={1}
              onScroll={(e) => e.target.blur()}
              defaultValue={settings?.EmbeddingModelMaxChunkLength}
              required={false}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col w-60">
            <div className="flex flex-col gap-y-1 mb-4">
              <label className="text-white text-sm font-semibold flex items-center gap-x-2">
                Max concurrent Chunks
                <p className="!text-xs !italic !font-thin">optional</p>
              </label>
            </div>
            <input
              type="number"
              name="GenericOpenAiEmbeddingMaxConcurrentChunks"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="500"
              min={1}
              onScroll={(e) => e.target.blur()}
              defaultValue={settings?.GenericOpenAiEmbeddingMaxConcurrentChunks}
              required={false}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
