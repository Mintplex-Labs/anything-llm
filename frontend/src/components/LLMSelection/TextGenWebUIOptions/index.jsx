import { useTranslation } from "react-i18next";

export default function TextGenWebUIOptions({ settings }) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-[36px] mt-1.5 flex-wrap">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          {t("llmPreference.textgenwebui.baseUrl")}
        </label>
        <input
          type="url"
          name="TextGenWebUIBasePath"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="http://127.0.0.1:5000/v1"
          defaultValue={settings?.TextGenWebUIBasePath}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          {t("llmPreference.textgenwebui.tokenWindow")}
        </label>
        <input
          type="number"
          name="TextGenWebUITokenLimit"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder={t("llmPreference.textgenwebui.tokenWindowPlaceholder")}
          min={1}
          onScroll={(e) => e.target.blur()}
          defaultValue={settings?.TextGenWebUITokenLimit}
          required={true}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          {t("llmPreference.textgenwebui.apiKeyOptional")}
        </label>
        <input
          type="password"
          name="TextGenWebUIAPIKey"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder={t("llmPreference.textgenwebui.apiKeyPlaceholder")}
          defaultValue={settings?.TextGenWebUIAPIKey ? "*".repeat(20) : ""}
          autoComplete="new-password"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
