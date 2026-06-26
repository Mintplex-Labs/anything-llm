import React, { useState } from "react";
import { CaretDown, CaretUp, Info } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function GenericOpenAiEmbeddingOptions({ settings }) {
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-center gap-[36px] mt-1.5 flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Base URL
          </label>
          <input
            type="url"
            name="EmbeddingBasePath"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="https://api.openai.com/v1"
            defaultValue={settings?.EmbeddingBasePath}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Embedding Model
          </label>
          <input
            type="text"
            name="EmbeddingModelPref"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="text-embedding-ada-002"
            defaultValue={settings?.EmbeddingModelPref}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <div className="flex items-center mb-3 gap-x-1">
            <label className="text-white text-sm font-semibold block">
              Max embedding chunk length
            </label>
            <Info
              size={18}
              className="text-theme-text-secondary cursor-pointer"
              data-tooltip-id="max-embedding-chunk-length-tooltip"
              data-tooltip-content="Maximum length of text chunks, in characters, for embedding."
            />
            <Tooltip
              id="max-embedding-chunk-length-tooltip"
              place="top"
              delayShow={300}
              className="tooltip !text-xs !opacity-100"
              style={{
                maxWidth: "250px",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            />
          </div>
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
      </div>
      <div className="w-full flex items-center gap-[36px]">
        <div className="flex flex-col w-60">
          <div className="flex flex-col gap-y-1 mb-4">
            <label className="text-white text-sm font-semibold flex items-center gap-x-2">
              API Key <p className="!text-xs !italic !font-thin">optional</p>
            </label>
          </div>
          <input
            type="password"
            name="GenericOpenAiEmbeddingApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="sk-mysecretkey"
            defaultValue={
              settings?.GenericOpenAiEmbeddingApiKey ? "*".repeat(20) : ""
            }
            autoComplete="off"
            spellCheck={false}
          />
        </div>
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
        <div className="w-full flex items-start gap-4 flex-wrap">
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
          <div className="flex flex-col w-60">
            <div className="flex items-center mb-4 gap-x-1">
              <label className="text-white text-sm font-semibold flex items-center gap-x-2">
                Passage Prefix
              </label>
              <Info
                size={18}
                className="text-theme-text-secondary cursor-pointer"
                data-tooltip-id="embedding-passage-prefix-tooltip"
              />
              <Tooltip
                id="embedding-passage-prefix-tooltip"
                place="top"
                delayShow={300}
                delayHide={400}
                clickable={true}
                className="tooltip !text-xs !opacity-100"
                style={{
                  maxWidth: "250px",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}
              >
                <p className="text-xs leading-[18px] font-base">
                  Text prepended to each chunk of content before embedding for
                  storage. Some models require this to distinguish passages from
                  queries (e.g. "passage: " or "search_document: ").
                  <br />
                  <br />
                  AnythingLLM <b>does not</b> append anything to this text
                  including the ":" character.
                </p>
              </Tooltip>
            </div>
            <input
              type="text"
              name="GenericOpenAiEmbeddingPassagePrefix"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="passage: "
              defaultValue={settings?.GenericOpenAiEmbeddingPassagePrefix}
              required={false}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className="flex flex-col w-60">
            <div className="flex items-center mb-4 gap-x-1">
              <label className="text-white text-sm font-semibold flex items-center gap-x-2">
                Query Prefix
              </label>
              <Info
                size={18}
                className="text-theme-text-secondary cursor-pointer"
                data-tooltip-id="embedding-query-prefix-tooltip"
              />
              <Tooltip
                id="embedding-query-prefix-tooltip"
                place="top"
                delayShow={300}
                delayHide={400}
                clickable={true}
                className="tooltip !text-xs !opacity-100"
                style={{
                  maxWidth: "250px",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}
              >
                <p className="text-xs leading-[18px] font-base">
                  Text prepended to the query text before embedding for search.
                  Some models require this to distinguish queries from passages
                  (e.g. "query: " or "search_query: ").
                  <br />
                  <br />
                  AnythingLLM <b>does not</b> append anything to this text
                  including the ":" character.
                </p>
              </Tooltip>
            </div>
            <input
              type="text"
              name="GenericOpenAiEmbeddingQueryPrefix"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="query: "
              defaultValue={settings?.GenericOpenAiEmbeddingQueryPrefix}
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
