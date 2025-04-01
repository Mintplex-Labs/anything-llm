import React, { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";
import Admin from "@/models/admin";
import CTAButton from "@/components/lib/CTAButton";

export default function UserPermissions() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [permissions, setPermissions] = useState({
    default_managing_workspaces: false,
    default_creating_workspaces: false,
    default_workspace_dnd_file_upload: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { settings } = await Admin.systemPreferences();
      console.log("Received settings from backend:", settings);
      console.log("Permission fields:", {
        default_managing_workspaces: settings?.default_managing_workspaces,
        default_creating_workspaces: settings?.default_creating_workspaces,
        default_workspace_dnd_file_upload:
          settings?.default_workspace_dnd_file_upload,
      });
      setPermissions({
        default_managing_workspaces: Boolean(
          settings?.default_managing_workspaces
        ),
        default_creating_workspaces: Boolean(
          settings?.default_creating_workspaces
        ),
        default_workspace_dnd_file_upload: Boolean(
          settings?.default_workspace_dnd_file_upload
        ),
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      showToast("Failed to fetch settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await Admin.updateSystemPreferences({
        default_managing_workspaces: permissions.default_managing_workspaces,
        default_creating_workspaces: permissions.default_creating_workspaces,
        default_workspace_dnd_file_upload:
          permissions.default_workspace_dnd_file_upload,
      });
      showToast("Settings updated successfully", "success");
      setHasChanges(false);
    } catch (error) {
      showToast("Failed to update settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (setting, value) => {
    setPermissions((prev) => ({
      ...prev,
      [setting]: value,
    }));
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[86px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
            <div className="items-center">
              <p className="text-lg leading-6 font-bold text-white">
                {t("settings.user-permissions")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              {t("settings.user-permissions-description")}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-theme-bg-sidebar rounded-lg">
                  <div>
                    <h3 className="text-white text-sm font-medium">
                      Managing Workspaces
                    </h3>
                    <p className="text-white text-opacity-60 text-xs mt-1">
                      Allow default users to manage existing workspaces
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={permissions.default_managing_workspaces}
                      onChange={(e) =>
                        updateSetting(
                          "default_managing_workspaces",
                          e.target.checked
                        )
                      }
                    />
                    <div className="w-11 h-6 bg-theme-bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-button/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-button"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-theme-bg-sidebar rounded-lg">
                  <div>
                    <h3 className="text-white text-sm font-medium">
                      Creating Workspaces
                    </h3>
                    <p className="text-white text-opacity-60 text-xs mt-1">
                      Allow default users to create new workspaces
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={permissions.default_creating_workspaces}
                      onChange={(e) =>
                        updateSetting(
                          "default_creating_workspaces",
                          e.target.checked
                        )
                      }
                    />
                    <div className="w-11 h-6 bg-theme-bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-button/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-button"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-theme-bg-sidebar rounded-lg">
                  <div>
                    <h3 className="text-white text-sm font-medium">
                      Drag and Drop Upload in Workspace
                    </h3>
                    <p className="text-white text-opacity-60 text-xs mt-1">
                      Allow default users to drag and drop files into the
                      workspace
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={permissions.default_workspace_dnd_file_upload}
                      onChange={(e) =>
                        updateSetting(
                          "default_workspace_dnd_file_upload",
                          e.target.checked
                        )
                      }
                    />
                    <div className="w-11 h-6 bg-theme-bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-button/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-button"></div>
                  </label>
                </div>
              </div>
            </div>

            {hasChanges && (
              <div className="mt-6 flex justify-end">
                <CTAButton
                  type="submit"
                  disabled={saving}
                  loading={saving}
                  className="w-fit"
                >
                  Save Changes
                </CTAButton>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
