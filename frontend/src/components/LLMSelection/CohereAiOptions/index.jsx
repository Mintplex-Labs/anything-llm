import React from "react";
import { useTranslation } from "react-i18next";

export default function CohereAiOptions({ settings }) {
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("llm.providers.apiKeyLabel", { provider: "Cohere" })}
          </label>
          <input
            type="password"
            name="CohereApiKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("llm.providers.apiKeyPlaceholder", {
              provider: "Cohere",
            })}
            defaultValue={settings?.CohereApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="new-password"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("llm.providers.modelLabel")}
          </label>
          <select
            name="CohereModelPref"
            defaultValue={settings?.CohereModelPref || "command-r"}
            required={true}
            className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            {[
              "command-r",
              "command-r-plus",
              "command",
              "command-light",
              "command-nightly",
              "command-light-nightly",
            ].map((model) => {
              return (
                <option key={model} value={model}>
                  {model}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
}
