import { useEffect, useState } from "react";
import Admin from "@/models/admin";
import showToast from "@/utils/toast";

export default function CustomSiteSettings() {
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState({
    title: null,
    faviconUrl: null,
  });

  useEffect(() => {
    Admin.systemPreferences().then(({ settings }) => {
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
      className="mb-6"
      onChange={() => setHasChanges(true)}
      onSubmit={handleSiteSettingUpdate}
    >
      <div className="flex flex-col border-t border-white/30 pt-4 gap-y-2">
        <div className="flex flex-col gap-y-1">
          <h2 className="text-base leading-6 font-bold text-white">
            Custom Site Settings
          </h2>
          <p className="text-xs leading-[18px] font-base text-white/60">
            Change the content of the browser tab for customization and
            branding.
          </p>
        </div>

        <div className="w-fit">
          <div className="flex flex-col gap-y-1">
            <h2 className="text-sm leading-6 text-white">Tab Title</h2>
            <p className="text-xs leading-[18px] font-base text-white/60">
              Set a custom tab title when the app is open in a browser.
            </p>
          </div>
          <div className="flex items-center gap-x-4">
            <input
              name="meta_page_title"
              type="text"
              className="border-none bg-zinc-900 mt-3 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 max-w-[400px] placeholder:text-white/20"
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

        <div className="w-fit">
          <div className="flex flex-col gap-y-1">
            <h2 className="text-sm leading-6 text-white">Tab Favicon</h2>
            <p className="text-xs leading-[18px] font-base text-white/60">
              Define a url to an image to use for your favicon
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <img
              src={settings.faviconUrl ?? "/favicon.png"}
              onError={(e) => (e.target.src = "/favicon.png")}
              className="h-10 w-10 rounded-lg mt-2.5"
            />
            <input
              name="meta_page_favicon"
              type="url"
              className="border-none bg-zinc-900 mt-3 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 max-w-[400px] placeholder:text-white/20"
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
            className="border-none transition-all mt-6 w-fit duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
          >
            Save
          </button>
        )}
      </div>
    </form>
  );
}
