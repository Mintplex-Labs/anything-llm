import React, { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import PreLoader from "@/components/Preloader";
import CTAButton from "@/components/lib/CTAButton";
import Admin from "@/models/admin";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";

export default function SearchRetrievalPreference() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData(e.target);
      await Admin.updateSystemPreferences({
        query_rewrite_default: form.get("query_rewrite_default"),
      });
      setHasChanges(false);
      showToast(t("common.save-success"), "success");
    } catch {
      showToast(t("common.save-error"), "error");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    async function fetchSettings() {
      const _settings = (
        await Admin.systemPreferencesByFields(["query_rewrite_default"])
      )?.settings;
      setSettings(_settings ?? {});
      setLoading(false);
    }
    fetchSettings();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      {loading ? (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
        >
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
        >
          <form
            onSubmit={handleSubmit}
            onChange={() => setHasChanges(true)}
            className="flex w-full"
          >
            <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
              <div className="w-full flex flex-col gap-y-1 pb-4 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
                <div className="flex gap-x-4 items-center">
                  <p className="text-lg leading-6 font-bold text-white">
                    {t("searchRetrieval.title")}
                  </p>
                </div>
                <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
                  {t("searchRetrieval.description")}
                </p>
              </div>
              <div className="w-full justify-end flex">
                {hasChanges && (
                  <CTAButton className="mt-3 mr-0 -mb-14 z-10">
                    {saving ? t("common.saving") : t("common.save")}
                  </CTAButton>
                )}
              </div>

              <div className="flex flex-col gap-y-4 mt-8">
                <div className="flex flex-col max-w-[500px]">
                  <div className="flex flex-col gap-y-2 mb-4">
                    <label className="text-white text-sm font-semibold block">
                      {t("searchRetrieval.queryRewrite.title")}
                    </label>
                    <p className="text-xs text-white/60">
                      {t("searchRetrieval.queryRewrite.description")}
                    </p>
                  </div>
                  <select
                    name="query_rewrite_default"
                    defaultValue={settings?.query_rewrite_default ?? "off"}
                    className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  >
                    <option value="on">
                      {t("searchRetrieval.queryRewrite.on")}
                    </option>
                    <option value="off">
                      {t("searchRetrieval.queryRewrite.off")}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
