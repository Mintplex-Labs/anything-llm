import React, { forwardRef } from "react";

const FlowInfoNode = forwardRef(({ config, onConfigChange }, refs) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-theme-text-primary mb-2">
          Flow Name
        </label>
        <div className="flex flex-col text-xs text-theme-text-secondary mt-2 mb-3">
          <p className="">
            It is important to give your flow a name that an LLM can easily
            understand.
          </p>
          <p>"SendMessageToDiscord", "CheckStockPrice", "CheckWeather"</p>
        </div>
        <input
          id="agent-flow-name-input"
          ref={refs?.nameRef}
          type="text"
          placeholder="Enter flow name"
          value={config?.name || ""}
          onChange={(e) =>
            onConfigChange({
              ...config,
              name: e.target.value,
            })
          }
          className="w-full border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none p-2.5"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-theme-text-primary mb-2">
          Description
        </label>
        <div className="flex flex-col text-xs text-theme-text-secondary mt-2 mb-3">
          <p className="">
            It is equally important to give your flow a description that an LLM
            can easily understand. Be sure to include the purpose of the flow,
            the context it will be used in, and any other relevant information.
          </p>
        </div>
        <textarea
          ref={refs?.descriptionRef}
          value={config?.description || ""}
          onChange={(e) =>
            onConfigChange({
              ...config,
              description: e.target.value,
            })
          }
          className="w-full border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none p-2.5"
          rows={3}
          placeholder="Enter flow description"
        />
      </div>
    </div>
  );
});

FlowInfoNode.displayName = "FlowInfoNode";
export default FlowInfoNode;
