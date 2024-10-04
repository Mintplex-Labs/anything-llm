import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import Admin from "@/models/admin";
import showToast from "@/utils/toast";
import CTAButton from "@/components/lib/CTAButton";

export default function AdminSystem() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [messageLimit, setMessageLimit] = useState({
    enabled: false,
    limit: 10,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await Admin.updateSystemPreferences({
      limit_user_messages: messageLimit.enabled,
      message_limit: messageLimit.limit,
    });
    setSaving(false);
    setHasChanges(false);
    showToast("System preferences updated successfully.", "success");
  };

  useEffect(() => {
    async function fetchSettings() {
      const settings = (await Admin.systemPreferences())?.settings;
      if (!settings) return;
      setMessageLimit({
        enabled: settings.limit_user_messages,
        limit: settings.message_limit,
      });
    }
    fetchSettings();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <form
          onSubmit={handleSubmit}
          onChange={() => setHasChanges(true)}
          className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16"
        >
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center">
              <p className="text-lg leading-6 font-bold text-white">
                System Preferences
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              These are the overall settings and configurations of your
              instance.
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
                Limit messages per user per day
              </h2>
              <p className="text-xs leading-[18px] font-base text-white/60">
                Restrict non-admin users to a number of successful queries or
                chats within a 24 hour window. Enable this to prevent users from
                running up OpenAI costs.
              </p>
              <div className="mt-2">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name="limit_user_messages"
                    value="yes"
                    checked={messageLimit.enabled}
                    onChange={(e) => {
                      setMessageLimit({
                        ...messageLimit,
                        enabled: e.target.checked,
                      });
                    }}
                    className="peer sr-only"
                  />
                  <div className="pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                </label>
              </div>
            </div>
            {messageLimit.enabled && (
              <div className="mt-4">
                <label className="text-white text-sm font-semibold block mb-4">
                  Message limit per day
                </label>
                <div className="relative mt-2">
                  <input
                    type="number"
                    name="message_limit"
                    onScroll={(e) => e.target.blur()}
                    onChange={(e) => {
                      setMessageLimit({
                        enabled: true,
                        limit: Number(e?.target?.value || 0),
                      });
                    }}
                    value={messageLimit.limit}
                    min={1}
                    className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-60 p-2.5"
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
