import { useEffect, useState } from "react";

export default function ChatModelSelection({
  settings,
  workspace,
  setHasChanges,
  customModels,
  loadingModels,
}) {
  const [groupedModels, setGroupedModels] = useState({});

  useEffect(() => {
    if (settings?.LLMProvider === "togetherai") {
      if (customModels?.length > 0) {
        const modelsByOrganization = customModels.reduce((acc, model) => {
          acc[model.organization] = acc[model.organization] || [];
          acc[model.organization].push(model);
          return acc;
        }, {});

        setGroupedModels(modelsByOrganization);
      }
    }
  }, [customModels, settings]);

  if (loadingModels) {
    return (
      <div>
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white"
          >
            Chat model
          </label>
          <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
            The specific chat model that will be used for this workspace.
          </p>
        </div>
        <select
          name="chatModel"
          required={true}
          disabled={true}
          className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- waiting for models --
          </option>
        </select>
      </div>
    );
  }

  return (
    <>
      {settings?.LLMProvider === "openai" && (
        <div>
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Chat model <span className="font-normal">(OpenAI)</span>
            </label>
            <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
              The specific chat model that will be used for this workspace.
            </p>
          </div>

          <select
            name="chatModel"
            required={true}
            onChange={() => {
              setHasChanges(true);
            }}
            className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <optgroup label="General LLM models">
              {[
                "gpt-3.5-turbo",
                "gpt-4",
                "gpt-4-1106-preview",
                "gpt-4-32k",
              ].map((model) => {
                return (
                  <option
                    key={model}
                    value={model}
                    selected={
                      workspace?.chatModel !== null
                        ? workspace?.chatModel === model
                        : settings?.OpenAiModelPref === model
                    }
                  >
                    {model}
                  </option>
                );
              })}
            </optgroup>
            {customModels.length > 0 && (
              <optgroup label="Your fine-tuned models">
                {customModels.map((model) => {
                  return (
                    <option
                      key={model.id}
                      value={model.id}
                      selected={
                        workspace?.chatModel === model ||
                        workspace?.chatModel === model.id
                      }
                    >
                      {model.id}
                    </option>
                  );
                })}
              </optgroup>
            )}
          </select>
        </div>
      )}

      {settings?.LLMProvider === "anthropic" && (
        <div>
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Chat model <span className="font-normal">(Anthropic)</span>
            </label>
            <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
              The specific chat model that will be used for this workspace.
            </p>
          </div>
          <select
            name="chatModel"
            defaultValue={workspace?.chatModel || settings?.AnthropicModelPref}
            onChange={() => {
              setHasChanges(true);
            }}
            required={true}
            className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {["claude-2", "claude-instant-1"].map((model) => {
              return (
                <option key={model} value={model}>
                  {model}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {settings?.LLMProvider === "localai" && (
        <div>
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Chat model <span className="font-normal">(LocalAI)</span>
            </label>
            <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
              The specific chat model that will be used for this workspace.
            </p>
          </div>

          <select
            name="chatModel"
            required={true}
            onChange={() => {
              setHasChanges(true);
            }}
            className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {customModels.length > 0 && (
              <optgroup label="Your loaded models">
                {customModels.map((model) => {
                  return (
                    <option
                      key={model.id}
                      value={model.id}
                      selected={
                        workspace?.chatModel === model.id ||
                        settings?.LocalAiModelPref === model.id
                      }
                    >
                      {model.id}
                    </option>
                  );
                })}
              </optgroup>
            )}
          </select>
        </div>
      )}

      {settings?.LLMProvider === "ollama" && (
        <div>
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Chat model <span className="font-normal">(Ollama)</span>
            </label>
            <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
              The specific chat model that will be used for this workspace.
            </p>
          </div>
          <select
            name="chatModel"
            required={true}
            onChange={() => {
              setHasChanges(true);
            }}
            className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {customModels.length > 0 && (
              <optgroup label="Your loaded models">
                {customModels.map((model) => {
                  return (
                    <option
                      key={model.id}
                      value={model.id}
                      selected={
                        workspace?.chatModel === model.id ||
                        settings?.OllamaLLMModelPref === model.id
                      }
                    >
                      {model.id}
                    </option>
                  );
                })}
              </optgroup>
            )}
          </select>
        </div>
      )}

      {settings?.LLMProvider === "togetherai" && (
        <div>
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Chat model <span className="font-normal">(TogetherAI)</span>
            </label>
            <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
              The specific chat model that will be used for this workspace.
            </p>
          </div>
          <select
            name="chatModel"
            defaultValue={workspace?.chatModel || settings?.AnthropicModelPref}
            onChange={() => {
              setHasChanges(true);
            }}
            required={true}
            className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {Object.entries(groupedModels).map(([organization, models]) => (
              <optgroup key={organization} label={organization}>
                {models.map((model) => (
                  <option
                    key={model.id}
                    value={model.id}
                    selected={
                      workspace?.chatModel === model.id ||
                      settings.TogetherAiModelPref === model.id
                    }
                  >
                    {model.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}

      {/* Disabling for now due to having to reload the model into memory */}
      {/* {settings?.LLMProvider === "native" && (
        <div>
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Chat model <span className="font-normal">(Native)</span>
            </label>
            <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
              The specific chat model that will be used for this workspace.
            </p>
          </div>
          <select
            name="chatModel"
            defaultValue={workspace?.chatModel || settings?.AnthropicModelPref}
            onChange={() => {
              setHasChanges(true);
            }}
            required={true}
            className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {customModels.length > 0 && (
              <optgroup label="Your loaded models">
                {customModels.map((model) => {
                  return (
                    <option
                      key={model.id}
                      value={model.id}
                      selected={
                        workspace?.chatModel === model.id ||
                        settings.NativeLLMModelPref === model.id
                      }
                    >
                      {model.id}
                    </option>
                  );
                })}
              </optgroup>
            )}
          </select>
        </div>
      )} */}
    </>
  );
}
