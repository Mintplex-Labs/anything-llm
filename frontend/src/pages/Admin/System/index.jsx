import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import showToast from "@/utils/toast";
import CTAButton from "@/components/lib/CTAButton";
import System from "@/models/system";

export default function AdminSystem() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState({
    loading: false,
    NetworkDiscovery: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await System.updateSystem({
      NetworkDiscovery: String(settings.NetworkDiscovery),
    });
    setSaving(false);
    setHasChanges(false);
    showToast("System preferences updated successfully.", "success");
  };

  useEffect(() => {
    async function fetchSettings() {
      const settings = await System.keys();
      if (!settings) return;
      setSettings({
        loading: false,
        NetworkDiscovery: settings.NetworkDiscovery === "true",
      });
    }
    fetchSettings();
  }, []);

  return (
    <div
      style={{ height: "calc(100vh - 40px)" }}
      className="w-screen overflow-hidden bg-sidebar flex"
    >
      <Sidebar />
      <form
        onSubmit={handleSubmit}
        onChange={() => setHasChanges(true)}
        className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16"
      >
        <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
          <div className="items-center">
            <p className="text-lg leading-6 font-bold text-white">
              Application Preferences
            </p>
          </div>
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
            These are the overall settings and configurations of your
            AnythingLLM application.
          </p>
        </div>
        {hasChanges && (
          <div className="flex justify-end">
            <CTAButton onClick={handleSubmit} className="mt-3 mr-0">
              {saving ? "Saving..." : "Save changes"}
            </CTAButton>
          </div>
        )}
        <div className="mt-4 mb-8">
          <div className="flex flex-col gap-y-1">
            <h2 className="text-base leading-6 font-bold text-white">
              Enable network discovery
            </h2>
            <p className="text-xs leading-[18px] font-base text-white/60">
              Enable your AnythingLLM app and its API endpoints to be
              discoverable over LAN so other computers or programs on the
              network can access it.
              <br />
              Requires full restart of the app when changed to take effect.
            </p>
            <div className="mt-2">
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="NetworkDiscovery"
                  value="yes"
                  checked={settings.NetworkDiscovery}
                  onChange={() => {
                    setSettings((prev) => {
                      return {
                        ...prev,
                        NetworkDiscovery: !prev.NetworkDiscovery,
                      };
                    });
                  }}
                  className="peer sr-only"
                />
                <div className="pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
