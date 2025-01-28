import System from "@/models/system";
import { useEffect, useState } from "react";

const CohereModelSelector = ({ apiKey, settings }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const fetchModels = async () => {
    try {
      setIsLoading(true);
      const { models = [] } = await System.customModels(
        "cohere-rerank",
        apiKey
      );
      setOptions(models);
    } catch {
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);
  const LoadingOption = (
    <option disabled={true} selected={true}>
      -- loading available models --
    </option>
  );
  const ModelOptions = options?.length ? (
    options.map((model) => {
      return (
        <option
          key={model}
          value={model}
          selected={model === settings?.RerankerModel}
        >
          {model}
        </option>
      );
    })
  ) : (
    <option disabled={true} selected={true}>
      {settings?.RerankerModel}
    </option>
  );

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        Re-ranking Model Selection
      </label>
      <select
        name="RerankerModel"
        defaultValue={settings?.RerankerModel}
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {isLoading ? LoadingOption : ModelOptions}
      </select>
    </div>
  );
};

export default function CohereRerankerOptions({ settings }) {
  const [apiKey, setApiKey] = useState(settings?.RerankerApiKey);
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Cohere API Key
          </label>
          <input
            type="password"
            name="RerankerApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Cohere API Key"
            defaultValue={
              settings?.RerankerProvider === "cohere" ? "*".repeat(20) : null
            }
            required={true}
            autoComplete="off"
            spellCheck={false}
            onBlur={(e) => setApiKey(e.target.value)}
          />
        </div>
        <CohereModelSelector apiKey={apiKey} settings={settings} />
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Re-rank Top N Results
          </label>
          <input
            type="number"
            name="RerankTopNResults"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="3"
            defaultValue={settings?.RerankTopNResults || 3}
            autoComplete="off"
            spellCheck={false}
            min={1}
          />
        </div>
      </div>
    </div>
  );
}
