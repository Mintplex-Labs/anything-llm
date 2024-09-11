import { useEffect, useState } from "react";
import System from "@/models/system";
import { Warning } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next"; // Import i18n hook

export default function LiteLLMOptions({ settings }) {
  const { t } = useTranslation(); // Initialize translation hook

  const [basePathValue, setBasePathValue] = useState(settings?.LiteLLMBasePath);
  const [basePath, setBasePath] = useState(settings?.LiteLLMBasePath);
  const [apiKeyValue, setApiKeyValue] = useState(settings?.LiteLLMAPIKey);
  const [apiKey, setApiKey] = useState(settings?.LiteLLMAPIKey);

  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("embedding.liteLLMOptions.baseUrlLabel")}
          </label>
          <input
            type="url"
            name="LiteLLMBasePath"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("embedding.liteLLMOptions.baseUrlPlaceholder")}
            defaultValue={settings?.LiteLLMBasePath}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setBasePathValue(e.target.value)}
            onBlur={() => setBasePath(basePathValue)}
          />
        </div>
        <LiteLLMModelSelection
          settings={settings}
          basePath={basePath}
          apiKey={apiKey}
        />
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("embedding.liteLLMOptions.chunkLengthLabel")}
          </label>
          <input
            type="number"
            name="EmbeddingModelMaxChunkLength"
            className="bg-zinc-900 text-white placeholder-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("embedding.liteLLMOptions.chunkLengthPlaceholder")}
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
              {t("embedding.liteLLMOptions.apiKeyLabel")}{" "}
              <p className="!text-xs !italic !font-thin">
                {t("embedding.liteLLMOptions.optional")}
              </p>
            </label>
          </div>
          <input
            type="password"
            name="LiteLLMAPIKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("embedding.liteLLMOptions.apiKeyPlaceholder")}
            defaultValue={settings?.LiteLLMAPIKey ? "*".repeat(20) : ""}
            autoComplete="new-password"
            spellCheck={false}
            onChange={(e) => setApiKeyValue(e.target.value)}
            onBlur={() => setApiKey(apiKeyValue)}
          />
        </div>
      </div>
    </div>
  );
}

function LiteLLMModelSelection({ settings, basePath = null, apiKey = null }) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      if (!basePath) {
        setCustomModels([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { models } = await System.customModels(
        "litellm",
        typeof apiKey === "boolean" ? null : apiKey,
        basePath
      );
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, [basePath, apiKey]);

  if (loading || customModels.length == 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          {t("embedding.liteLLMOptions.modelSelectionLabel")}
        </label>
        <select
          name="EmbeddingModelPref"
          disabled={true}
          className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {basePath?.includes("/v1")
              ? t("embedding.liteLLMOptions.loadingModels")
              : t("embedding.liteLLMOptions.waitingForUrl")}
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <div className="flex items-center">
        <label className="text-white text-sm font-semibold block mb-3">
          {t("embedding.liteLLMOptions.modelSelectionLabel")}
        </label>
        <EmbeddingModelTooltip />
      </div>
      <select
        name="EmbeddingModelPref"
        required={true}
        className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {customModels.length > 0 && (
          <optgroup label={t("embedding.liteLLMOptions.loadedModelsLabel")}>
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings.EmbeddingModelPref === model.id}
                >
                  {model.id}
                </option>
              );
            })}
          </optgroup>
        )}
      </select>
    </div>
  );
}

function EmbeddingModelTooltip() {
  const { t } = useTranslation(); // Initialize translation hook
  return (
    <div className="flex items-center justify-center -mt-3 ml-1">
      <Warning
        size={14}
        className="ml-1 text-orange-500 cursor-pointer"
        data-tooltip-id="model-tooltip"
        data-tooltip-place="right"
      />
      <Tooltip
        delayHide={300}
        id="model-tooltip"
        className="max-w-xs"
        clickable={true}
      >
        <p className="text-sm">
          {t("embedding.liteLLMOptions.tooltipMessage")}{" "}
          <a
            href="https://litellm.vercel.app/docs/embedding/supported_embedding"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {t("embedding.liteLLMOptions.tooltipLinkText")}
          </a>{" "}
          {t("embedding.liteLLMOptions.tooltipAdditionalInfo")}
        </p>
      </Tooltip>
    </div>
  );
}
