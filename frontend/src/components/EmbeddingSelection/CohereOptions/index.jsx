import React from "react";
import { useTranslation } from "react-i18next"; // Import i18n hook

export default function CohereEmbeddingOptions({ settings }) {
  const { t } = useTranslation(); // Initialize translation hook

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("embedding.cohereOptions.apiKeyLabel")}
          </label>
          <input
            type="password"
            name="CohereApiKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("embedding.cohereOptions.apiKeyPlaceholder")}
            defaultValue={settings?.CohereApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="new-password"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("embedding.cohereOptions.modelPrefLabel")}
          </label>
          <select
            name="EmbeddingModelPref"
            required={true}
            className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            <optgroup label={t("embedding.cohereOptions.modelOptGroupLabel")}>
              {[
                "embed-english-v3.0",
                "embed-multilingual-v3.0",
                "embed-english-light-v3.0",
                "embed-multilingual-light-v3.0",
                "embed-english-v2.0",
                "embed-english-light-v2.0",
                "embed-multilingual-v2.0",
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
