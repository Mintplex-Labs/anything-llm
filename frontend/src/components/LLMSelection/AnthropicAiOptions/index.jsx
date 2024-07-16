import React from "react";
import { useTranslation } from "react-i18next";

export default function AnthropicAiOptions({ settings }) {
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("llm.providers.apiKeyLabel", { provider: "Anthropic" })}
          </label>
          <input
            type="password"
            name="AnthropicApiKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("llm.providers.apiKeyPlaceholder", {
              provider: "Anthropic Claude-2",
            })}
            defaultValue={settings?.AnthropicApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="new-password"
            spellCheck={false}
          />
        </div>

        {!settings?.credentialsOnly && (
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              {t("llm.providers.modelLabel")}
            </label>
            <select
              name="AnthropicModelPref"
              defaultValue={settings?.AnthropicModelPref || "claude-2"}
              required={true}
              className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
            >
              {[
                "claude-instant-1.2",
                "claude-2.0",
                "claude-2.1",
                "claude-3-haiku-20240307",
                "claude-3-opus-20240229",
                "claude-3-sonnet-20240229",
                "claude-3-5-sonnet-20240620",
              ].map((model) => {
                return (
                  <option key={model} value={model}>
                    {model}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
