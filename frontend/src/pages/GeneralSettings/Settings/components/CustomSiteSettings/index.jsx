import { useEffect, useState } from "react";
import Admin from "@/models/admin";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";

export default function CustomSiteSettings() {
  const { t } = useTranslation();
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState({
    title: null,
    faviconUrl: null,
  });

  useEffect(() => {
    Admin.systemPreferencesByFields([
      "meta_page_title",
      "meta_page_favicon",
    ]).then(({ settings }) => {
      setSettings({
        title: settings?.meta_page_title,
        faviconUrl: settings?.meta_page_favicon,
      });
    });
  }, []);

  async function handleSiteSettingUpdate(e) {
    e.preventDefault();
    await Admin.updateSystemPreferences({
      meta_page_title: settings.title ?? null,
      meta_page_favicon: settings.faviconUrl ?? null,
    });
    showToast(
      "Site preferences updated! They will reflect on page reload.",
      "success",
      { clear: true }
    );
    setHasChanges(false);
    return;
  }

  return (
    <form
      className="flex flex-col gap-y-0.5 my-4"
      onChange={() => setHasChanges(true)}
      onSubmit={handleSiteSettingUpdate}
    >
      <p className="text-sm leading-6 font-semibold text-white">
        {t("customization.items.browser-appearance.title")}
      </p>
      <p className="text-xs text-white/60">
        {t("customization.items.browser-appearance.description")}
      </p>

      <div className="w-full max-w-[600px]">
        <p className="text-sm leading-6 font-medium text-white mt-2">
          {t("customization.items.browser-appearance.tab.title")}
        </p>
        <p className="text-xs text-white/60">
          {t("customization.items.browser-appearance.tab.description")}
        </p>
        <div className="flex items-center gap-x-4 w-full">
          <input
            name="meta_page_title"
            type="text"
            className="border-none bg-theme-settings-input-bg mt-2 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full py-2 px-4"
            placeholder="AnythingLLM | Your personal LLM trained on anything"
            autoComplete="off"
            onChange={(e) => {
              setSettings((prev) => {
                return { ...prev, title: e.target.value };
              });
            }}
            value={
              settings.title ??
              "AnythingLLM | Your personal LLM trained on anything"
            }
          />
        </div>
      </div>

      <div className="w-full max-w-[600px]">
        <p className="text-sm leading-6 font-medium text-white mt-2">
          {t("customization.items.browser-appearance.favicon.title")}
        </p>
        <p className="text-xs text-white/60">
          {t("customization.items.browser-appearance.favicon.description")}
        </p>
        <div className="flex items-center gap-x-2 w-full">
          <img
            src={settings.faviconUrl ?? "/favicon.png"}
            onError={(e) => (e.target.src = "/favicon.png")}
            className="h-10 w-10 shrink-0 rounded-lg mt-2"
            alt="Site favicon"
          />
          <input
            name="meta_page_favicon"
            type="url"
            className="border-none bg-theme-settings-input-bg mt-2 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full py-2 px-4"
            placeholder="url to your image"
            onChange={(e) => {
              setSettings((prev) => {
                return { ...prev, faviconUrl: e.target.value };
              });
            }}
            autoComplete="off"
            value={settings.faviconUrl ?? ""}
          />
        </div>
      </div>

      {hasChanges && (
        <button
          type="submit"
          className="transition-all mt-2 w-fit duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
        >
          Save
        </button>
      )}
    </form>
  );
}
