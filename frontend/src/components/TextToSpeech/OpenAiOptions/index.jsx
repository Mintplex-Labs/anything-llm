import { useTranslation } from "react-i18next"; // i18n import 추가

function toProperCase(string) {
  return string.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export default function OpenAiTextToSpeechOptions({ settings }) {
  const { t } = useTranslation(); // i18n hook 추가
  const apiKey = settings?.TTSOpenAIKey;

  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          {t("tts.openai.apiKeyLabel")}
        </label>
        <input
          type="password"
          name="TTSOpenAIKey"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder={t("tts.openai.apiKeyPlaceholder")}
          defaultValue={apiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="new-password"
          spellCheck={false}
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          {t("tts.openai.voiceModelLabel")}
        </label>
        <select
          name="TTSOpenAIVoiceModel"
          defaultValue={settings?.TTSOpenAIVoiceModel ?? "alloy"}
          className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          {["alloy", "echo", "fable", "onyx", "nova", "shimmer"].map(
            (voice) => {
              return (
                <option key={voice} value={voice}>
                  {toProperCase(voice)}
                </option>
              );
            }
          )}
        </select>
      </div>
    </div>
  );
}
