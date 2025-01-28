import { useEffect, useState } from "react";
import System from "@/models/system";

export default function JinaRerankerOptions({ settings }) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const { models = [] } = await System.customModels("jina-rerank");
        setOptions(models);
      } catch {
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModels();
  }, []);
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
    <option selected={true}>{settings?.RerankerModel}</option>
  );
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Jina API Key
          </label>
          <input
            type="password"
            name="RerankerApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Jina API Key"
            defaultValue={
              settings?.RerankerProvider === "jina" ? "*".repeat(20) : null
            }
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
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
            min={0}
          />
        </div>
      </div>
    </div>
  );
}
