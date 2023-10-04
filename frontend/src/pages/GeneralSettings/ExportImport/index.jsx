import { useEffect, useState } from "react";
import Sidebar, { SidebarMobileHeader } from "../../../components/AdminSidebar";
import { isMobile } from "react-device-detect";
import Admin from "../../../models/admin";
import showToast from "../../../utils/toast";
import { CloudArrowUp } from "@phosphor-icons/react";

export default function GeneralExportImport() {
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
    showToast("System preferences updated successfully.", "success");
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
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      {!isMobile && <Sidebar />}
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] bg-main-gradient md:min-w-[82%] p-[18px] h-full overflow-y-scroll"
      >
        {isMobile && <SidebarMobileHeader />}
        <form
          onSubmit={handleSubmit}
          onChange={() => setHasChanges(true)}
          className="flex w-full"
        >
          <div className="flex flex-col w-full px-1 md:px-20 py-12">
            <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
              <div className="items-center flex gap-x-4">
                <p className="text-2xl font-semibold text-white">
                  Export or Import
                </p>
                {hasChanges && (
                  <button
                    type="submit"
                    disabled={saving}
                    className="border border-slate-200 px-4 py-1 rounded-lg text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                )}
              </div>
              <p className="text-sm font-base text-white text-opacity-60">
                Have multiple AnythingLLM instances or simply want to backup or
                re-import data from another instance? You can do so here.
              </p>
            </div>
            <div className="text-white text-sm font-medium py-4">
              This will not automatically sync your vector database embeddings.
            </div>

            <div className="max-w-[600px] py-4 bg-zinc-900/50 rounded-2xl border-2 border-dashed border-white border-opacity-60 justify-center items-center inline-flex">
              <div className="flex flex-col items-center justify-center">
                <CloudArrowUp className="w-8 h-8 text-white/80" />
                <div className="text-white text-opacity-80 text-sm font-semibold py-1">
                  Import AnythingLLM Data
                </div>
                <div className="text-white text-opacity-60 text-xs font-medium py-1">
                  This must be an export from an AnythingLLM instance.
                </div>
              </div>
            </div>

            <div className="transition-all max-w-[600px] bg-white rounded-lg justify-center items-center my-8 cursor-pointer text-zinc-900 border-transparent border-2 hover:bg-zinc-900/50 hover:text-white hover:border-white">
              <div className="duration-300 text-center text-sm font-bold py-3">
                Export AnythingLLM Data
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
