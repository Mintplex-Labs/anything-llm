import useGetProviderModels, {
  DISABLED_PROVIDERS,
} from "@/hooks/useGetProvidersModels";

export default function ChatModelSelection({
  settings,
  workspace,
  setHasChanges,
}) {
  const { defaultModels, customModels, loading } = useGetProviderModels(
    settings?.LLMProvider
  );
  if (DISABLED_PROVIDERS.includes(settings?.LLMProvider)) return null;

  if (loading) {
    return (
      <div>
        <div className="flex flex-col">
          <label htmlFor="name" className="block input-label">
            Chat model
          </label>
          <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
            The specific chat model that will be used for this workspace. If
            empty, will use the system LLM preference.
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
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          Chat model{" "}
          <span className="font-normal">({settings?.LLMProvider})</span>
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          The specific chat model that will be used for this workspace. If
          empty, will use the system LLM preference.
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
        <option disabled={true} selected={workspace?.chatModel === null}>
          System default
        </option>
        {defaultModels.length > 0 && (
          <optgroup label="General models">
            {defaultModels.map((model) => {
              return (
                <option
                  key={model}
                  value={model}
                  selected={workspace?.chatModel === model}
                >
                  {model}
                </option>
              );
            })}
          </optgroup>
        )}
        {Array.isArray(customModels) && customModels.length > 0 && (
          <optgroup label="Custom models">
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={workspace?.chatModel === model.id}
                >
                  {model.id}
                </option>
              );
            })}
          </optgroup>
        )}
        {/* For providers like TogetherAi where we partition model by creator entity. */}
        {!Array.isArray(customModels) &&
          Object.keys(customModels).length > 0 && (
            <>
              {Object.entries(customModels).map(([organization, models]) => (
                <optgroup key={organization} label={organization}>
                  {models.map((model) => (
                    <option
                      key={model.id}
                      value={model.id}
                      selected={workspace?.chatModel === model.id}
                    >
                      {model.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </>
          )}
      </select>
    </div>
  );
}
