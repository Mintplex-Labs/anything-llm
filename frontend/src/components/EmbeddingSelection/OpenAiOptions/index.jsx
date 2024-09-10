import { useTranslation } from "react-i18next";

export default function OpenAiOptions({ settings }) {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("embedding.openai.apiKeyLabel")}
          </label>
          <input
            type="password"
            name="OpenAiKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("embedding.openai.apiKeyPlaceholder")}
            defaultValue={settings?.OpenAiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="new-password"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("embedding.openai.modelPreferenceLabel")}
          </label>
          <select
            name="EmbeddingModelPref"
            required={true}
            className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            <optgroup label={t("embedding.openai.availableModels")}>
              {[
                "text-embedding-ada-002",
                "text-embedding-3-small",
                "text-embedding-3-large",
              ].map((model) => {
                return (
                  <option
                    key={model}
                    value={model}
                    selected={settings?.EmbeddingModelPref === model}
                  >
                    {model}
                  </option>
                );
              })}
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
}
