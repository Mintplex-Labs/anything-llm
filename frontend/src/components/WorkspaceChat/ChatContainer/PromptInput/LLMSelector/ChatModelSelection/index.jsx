import useGetProviderModels, {
  DISABLED_PROVIDERS,
} from "@/hooks/useGetProvidersModels";

export default function ChatModelSelection({
  provider,
  setHasChanges,
  selectedLLMModel,
  setSelectedLLMModel,
}) {
  const { defaultModels, customModels, loading } =
    useGetProviderModels(provider);
  if (DISABLED_PROVIDERS.includes(provider)) return null;

  if (loading) {
    return (
      <select
        required={true}
        disabled={true}
        className="bg-zinc-900 light:bg-white text-white light:text-slate-900 text-sm rounded-lg h-8 w-full px-2.5 outline-none border border-zinc-900 light:border-slate-400 cursor-not-allowed"
      >
        <option disabled={true} selected={true}>
          -- waiting for models --
        </option>
      </select>
    );
  }

  return (
    <select
      id="workspace-llm-model-select"
      required={true}
      value={selectedLLMModel}
      onChange={(e) => {
        setHasChanges(true);
        setSelectedLLMModel(e.target.value);
      }}
      className="bg-zinc-900 light:bg-white text-white light:text-slate-900 text-sm rounded-lg h-8 w-full px-2.5 outline-none border border-zinc-900 light:border-slate-400 cursor-pointer"
    >
      {defaultModels.length > 0 && (
        <optgroup label="General models">
          {defaultModels.map((model) => {
            return (
              <option
                key={model}
                value={model}
                selected={selectedLLMModel === model}
              >
                {model}
              </option>
            );
          })}
        </optgroup>
      )}
      {Array.isArray(customModels) && customModels.length > 0 && (
        <optgroup label="Discovered models">
          {customModels.map((model) => {
            return (
              <option
                key={model.id}
                value={model.id}
                selected={selectedLLMModel === model.id}
              >
                {model.id}
              </option>
            );
          })}
        </optgroup>
      )}
      {/* For providers like TogetherAi where we partition model by creator entity. */}
      {!Array.isArray(customModels) && Object.keys(customModels).length > 0 && (
        <>
          {Object.entries(customModels).map(([organization, models]) => (
            <optgroup key={organization} label={organization}>
              {models.map((model) => (
                <option
                  key={model.id}
                  value={model.id}
                  selected={selectedLLMModel === model.id}
                >
                  {model.name}
                </option>
              ))}
            </optgroup>
          ))}
        </>
      )}
    </select>
  );
}
