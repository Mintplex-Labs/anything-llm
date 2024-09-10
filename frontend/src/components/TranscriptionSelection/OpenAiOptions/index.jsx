import { useState } from "react";
import { useTranslation } from "react-i18next"; // i18n import 추가

export default function OpenAiWhisperOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.OpenAiKey);
  const [_openAIKey, setOpenAIKey] = useState(settings?.OpenAiKey);
  const { t } = useTranslation(); // useTranslation 추가

  return (
    <div className="flex gap-x-7 gap-[36px] mt-1.5">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          {t("whisper.openai.apiKey")}
        </label>
        <input
          type="password"
          name="OpenAiKey"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder={t("whisper.openai.apiKeyPlaceholder")}
          defaultValue={settings?.OpenAiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="new-password"
          spellCheck={false}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => setOpenAIKey(inputValue)}
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          {t("whisper.openai.model")}
        </label>
        <select
          disabled={true}
          className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {t("whisper.openai.defaultModel")}
          </option>
        </select>
      </div>
    </div>
  );
}
