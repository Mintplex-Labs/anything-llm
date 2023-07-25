import { useEffect, useState } from "react";
import Sidebar, { SidebarMobileHeader } from "../../../components/AdminSidebar";
import { isMobile } from "react-device-detect";
import Admin from "../../../models/admin";

export default function AdminSystem() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [messageLimit, setMessageLimit] = useState({
    enabled: false,
    limit: 10,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await Admin.updateSystemPreferences({
      users_can_delete_workspaces: canDelete,
      limit_user_messages: messageLimit.enabled,
      message_limit: messageLimit.limit,
    });
    setSaving(false);
    setHasChanges(false);
  };

  useEffect(() => {
    async function fetchSettings() {
      const { settings } = await Admin.systemPreferences();
      if (!settings) return;
      setCanDelete(settings?.users_can_delete_workspaces);
      setMessageLimit({
        enabled: settings.limit_user_messages,
        limit: settings.message_limit,
      });
    }
    fetchSettings();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-orange-100 dark:bg-stone-700 flex">
      {!isMobile && <Sidebar />}
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] bg-white dark:bg-black-900 md:min-w-[82%] p-[18px] h-full overflow-y-scroll"
      >
        {isMobile && <SidebarMobileHeader />}
        <form
          onSubmit={handleSubmit}
          onChange={() => setHasChanges(true)}
          className="flex w-full"
        >
          <div className="flex flex-col w-full px-1 md:px-8">
            <div className="w-full flex flex-col gap-y-1">
              <div className="items-center flex gap-x-4">
                <p className="text-3xl font-semibold text-slate-600 dark:text-slate-200">
                  System Preferences
                </p>
                {hasChanges && (
                  <button
                    type="submit"
                    disabled={saving}
                    className="border border-slate-800 dark:border-slate-200 px-4 py-1 rounded-lg text-slate-800 dark:text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-800 hover:text-slate-100 dark:hover:bg-slate-200 dark:hover:text-slate-800"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                )}
              </div>
              <p className="text-sm font-base text-slate-600 dark:text-slate-200">
                These are the overall settings and configurations of your
                instance.
              </p>
            </div>

            <div className="my-4">
              <div className="flex flex-col gap-y-2 mb-2.5">
                <label className="leading-tight font-medium text-black dark:text-white">
                  Users can delete workspaces
                </label>
                <p className="leading-tight text-sm text-gray-500 dark:text-slate-400">
                  allow non-admin users to delete workspaces that they are a
                  part of. This would delete the workspace for everyone.
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="users_can_delete_workspaces"
                  checked={canDelete}
                  onChange={(e) => setCanDelete(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
              </label>
            </div>

            <div className="my-4">
              <div className="flex flex-col gap-y-2 mb-2.5">
                <label className="leading-tight font-medium text-black dark:text-white">
                  Limit messages per user per day
                </label>
                <p className="leading-tight text-sm text-gray-500 dark:text-slate-400">
                  Restrict non-admin users to a number of successful queries or
                  chats within a 24 hour window. Enable this to prevent users
                  from running up OpenAI costs.
                </p>
              </div>
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
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
              </label>
            </div>
            {messageLimit.enabled && (
              <div className="mb-4">
                <label className=" block flex items-center gap-x-1 font-medium text-black dark:text-white">
                  Message limit per day
                </label>
                <div className="relative">
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
                    max={300}
                    className="w-1/3 my-2 rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-gray-800 dark:text-slate-200 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
