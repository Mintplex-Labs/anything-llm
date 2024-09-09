import { useEffect, useState } from "react";
import { Info } from "@phosphor-icons/react";
import paths from "@/utils/paths";
import { useTranslation } from "react-i18next";
import System from "@/models/system";

export default function LocalAiOptions({ settings, showAlert = false }) {
  const { t } = useTranslation();
  const [basePathValue, setBasePathValue] = useState(settings?.LocalAiBasePath);
  const [basePath, setBasePath] = useState(settings?.LocalAiBasePath);
  const [apiKeyValue, setApiKeyValue] = useState(settings?.LocalAiApiKey);
  const [apiKey, setApiKey] = useState(settings?.LocalAiApiKey);

  return (
    <div className="w-full flex flex-col gap-y-7">
      {showAlert && (
        <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-6 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
          <div className="gap-x-2 flex items-center">
            <Info size={12} className="hidden md:visible" />
            <p className="text-sm md:text-base">
              {t("llmPreference.localai.alertMessage")}
            </p>
          </div>
          <a
            href={paths.settings.embedder.modelPreference()}
            className="text-sm md:text-base my-2 underline"
          >
            {t("llmPreference.localai.manageEmbedding")} &rarr;
          </a>
        </div>
      )}
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("llmPreference.localai.baseURL")}
          </label>
          <input
            type="url"
            name="LocalAiBasePath"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="http://localhost:1234/v1"
            defaultValue={settings?.LocalAiBasePath}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setBasePathValue(e.target.value)}
            onBlur={() => setBasePath(basePathValue)}
          />
        </div>
        {!settings?.credentialsOnly && (
          <>
            <LocalAIModelSelection
              settings={settings}
              basePath={basePath}
              apiKey={apiKey}
            />
            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold block mb-3">
                {t("llmPreference.localai.tokenLimit")}
              </label>
              <input
                type="number"
                name="LocalAiTokenLimit"
                className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="4096"
                min={1}
                onScroll={(e) => e.target.blur()}
                defaultValue={settings?.LocalAiTokenLimit}
                required={true}
                autoComplete="off"
              />
            </div>
          </>
        )}
      </div>
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <div className="flex flex-col gap-y-1 mb-4">
            <label className="text-white text-sm font-semibold flex items-center gap-x-2">
              {t("llmPreference.localai.apiKey")}{" "}
              <p className="!text-xs !italic !font-thin">
                {t("llmPreference.localai.optional")}
              </p>
            </label>
          </div>
          <input
            type="password"
            name="LocalAiApiKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="sk-mysecretkey"
            defaultValue={settings?.LocalAiApiKey ? "*".repeat(20) : ""}
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

function LocalAIModelSelection({ settings, basePath = null, apiKey = null }) {
  const { t } = useTranslation();
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      if (!basePath || !basePath.includes("/v1")) {
        setCustomModels([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { models } = await System.customModels(
        "localai",
        typeof apiKey === "boolean" ? null : apiKey,
        basePath
      );
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, [basePath, apiKey]);

  if (loading || customModels.length === 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          {t("llmPreference.localai.modelSelection")}
        </label>
        <select
          name="LocalAiModelPref"
          disabled={true}
          className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {basePath?.includes("/v1")
              ? t("llmPreference.localai.loadingModels")
              : t("llmPreference.localai.waitingForURL")}
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        {t("llmPreference.localai.modelSelection")}
      </label>
      <select
        name="LocalAiModelPref"
        required={true}
        className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {customModels.length > 0 && (
          <optgroup label={t("llmPreference.localai.loadedModels")}>
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings.LocalAiModelPref === model.id}
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
