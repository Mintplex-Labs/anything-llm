import React from "react";
import { useTranslation } from "react-i18next";

export default function OpenAiGenericTextToSpeechOptions({ settings }) {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <div className="flex justify-between items-center mb-2">
            <label className="text-white text-sm font-semibold">{t("tts.provider.openai_compatible.base_url")}</label>
          </div>
          <input
            type="url"
            name="TTSOpenAICompatibleEndpoint"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="http://localhost:7851/v1"
            defaultValue={settings?.TTSOpenAICompatibleEndpoint}
            required={false}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            {t("tts.provider.openai_compatible.base_url_explained")}
          </p>
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("tts.provider.openai_compatible.api")}
          </label>
          <input
            type="password"
            name="TTSOpenAICompatibleKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="API Key"
            defaultValue={
              settings?.TTSOpenAICompatibleKey ? "*".repeat(20) : ""
            }
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            {t("tts.provider.openai_compatible.api_explained")}
          </p>
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("tts.provider.openai_compatible.voice")}
          </label>
          <input
            type="text"
            name="TTSOpenAICompatibleVoiceModel"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("tts.provider.openai_compatible.voice_placeholder")}
            defaultValue={settings?.TTSOpenAICompatibleVoiceModel}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            {t("tts.provider.openai_compatible.voice_explained")}
          </p>
        </div>
      </div>
    </div>
  );
}
