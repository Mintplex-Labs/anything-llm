import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import showToast from "@/utils/toast";
import System from "@/models/system";
import paths from "@/utils/paths";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import PreLoader from "@/components/Preloader";
import CTAButton from "@/components/lib/CTAButton";
import { useTranslation } from "react-i18next";
import Toggle from "@/components/lib/Toggle";
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_PATTERN,
} from "@/utils/username";

export default function GeneralSecurity() {
  const { t } = useTranslation();
  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:pt-6">
          <p className="text-lg leading-6 font-bold text-theme-text-primary md-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10 py-4">
            {t("security.title")}
          </p>
        </div>
        <MultiUserMode />
        <PasswordProtection />
      </div>
    </div>
  );
}

function MultiUserMode() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [useMultiUserMode, setUseMultiUserMode] = useState(false);
  const [multiUserModeEnabled, setMultiUserModeEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setHasChanges(false);
    if (useMultiUserMode) {
      const form = new FormData(e.target);
      const data = {
        username: form.get("username"),
        password: form.get("password"),
      };

      const { success, error } = await System.setupMultiUser(data);
      if (success) {
        showToast("Multi-User mode enabled successfully.", "success");
        setSaving(false);
        setTimeout(() => {
          window.localStorage.removeItem(AUTH_USER);
          window.localStorage.removeItem(AUTH_TOKEN);
          window.localStorage.removeItem(AUTH_TIMESTAMP);
          window.location = paths.settings.users();
        }, 2_000);
        return;
      }

      showToast(`Failed to enable Multi-User mode: ${error}`, "error");
      setSaving(false);
      return;
    }
  };

  useEffect(() => {
    async function fetchIsMultiUserMode() {
      setLoading(true);
      const multiUserModeEnabled = await System.isMultiUserMode();
      setMultiUserModeEnabled(multiUserModeEnabled);
      setLoading(false);
    }
    fetchIsMultiUserMode();
  }, []);

  if (loading) {
    return (
      <div className="h-1/2 transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] p-[18px] h-full overflow-y-scroll">
        <div className="w-full h-full flex justify-center items-center">
          <PreLoader />
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onChange={() => setHasChanges(true)}
      className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px]"
    >
      <div className="w-full flex flex-col gap-y-1 w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
        <div className="w-full flex flex-col gap-y-1">
          <div className="items-center flex gap-x-4">
            <p className="text-base font-bold text-white mt-6">
              {t("security.multiuser.title")}
            </p>
          </div>
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
            {t("security.multiuser.description")}
          </p>
        </div>
        {hasChanges && (
          <div className="flex justify-end">
            <CTAButton
              onClick={() => handleSubmit()}
              className="mt-3 mr-0 -mb-20 z-10"
            >
              {saving ? t("common.saving") : t("common.save")}
            </CTAButton>
          </div>
        )}
        <div className="relative w-full max-h-full">
          <div className="relative rounded-lg">
            <div className="flex items-start justify-between px-6 py-4"></div>
            <div className="space-y-6 flex h-full w-full">
              <div className="w-full flex flex-col gap-y-4">
                {multiUserModeEnabled ? (
                  <p className="text-white text-sm font-semibold">
                    {t("security.multiuser.enable.is-enable")}
                  </p>
                ) : (
                  <Toggle
                    size="lg"
                    className="mb-4"
                    label={t("security.multiuser.enable.enable")}
                    enabled={useMultiUserMode}
                    onChange={(checked) => setUseMultiUserMode(checked)}
                  />
                )}
                {useMultiUserMode && (
                  <div className="w-full flex flex-col gap-y-2 my-5">
                    <div className="w-80">
                      <label
                        htmlFor="username"
                        className="text-white text-sm font-semibold block mb-3"
                      >
                        {t("security.multiuser.enable.username")}
                      </label>
                      <input
                        name="username"
                        type="text"
                        className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 placeholder:text-theme-settings-input-placeholder focus:ring-blue-500"
                        placeholder="Your admin username"
                        minLength={USERNAME_MIN_LENGTH}
                        maxLength={USERNAME_MAX_LENGTH}
                        pattern={USERNAME_PATTERN}
                        required={true}
                        autoComplete="off"
                        disabled={multiUserModeEnabled}
                        defaultValue={multiUserModeEnabled ? "********" : ""}
                      />
                      <p className="text-white text-opacity-60 text-xs mt-2">
                        {t("common.username_requirements")}
                      </p>
                    </div>
                    <div className="mt-4 w-80">
                      <label
                        htmlFor="password"
                        className="text-white text-sm font-semibold block mb-3"
                      >
                        {t("security.multiuser.enable.password")}
                      </label>
                      <input
                        name="password"
                        type="text"
                        className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 placeholder:text-theme-settings-input-placeholder focus:ring-blue-500"
                        placeholder="Your admin password"
                        minLength={8}
                        required={true}
                        autoComplete="off"
                        defaultValue={multiUserModeEnabled ? "********" : ""}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between space-x-14">
              <p className="text-white text-opacity-80 text-xs rounded-lg w-96">
                {t("security.multiuser.enable.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

const PW_REGEX = new RegExp(/^[a-zA-Z0-9_\-!@$%^&*();]+$/);
function PasswordProtection() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [multiUserModeEnabled, setMultiUserModeEnabled] = useState(false);
  const [usePassword, setUsePassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (multiUserModeEnabled) return false;
    const form = new FormData(e.target);

    if (!PW_REGEX.test(form.get("password"))) {
      showToast(
        `Your password has restricted characters in it. Allowed symbols are _,-,!,@,$,%,^,&,*,(,),;`,
        "error"
      );
      setSaving(false);
      return;
    }

    setSaving(true);
    setHasChanges(false);
    const data = {
      usePassword,
      newPassword: form.get("password"),
    };

    const { success, error } = await System.updateSystemPassword(data);
    if (success) {
      showToast("Your page will refresh in a few seconds.", "success");
      setSaving(false);
      setTimeout(() => {
        window.localStorage.removeItem(AUTH_USER);
        window.localStorage.removeItem(AUTH_TOKEN);
        window.localStorage.removeItem(AUTH_TIMESTAMP);
        window.location.reload();
      }, 3_000);
      return;
    } else {
      showToast(`Failed to update password: ${error}`, "error");
      setSaving(false);
    }
  };

  useEffect(() => {
    async function fetchIsMultiUserMode() {
      setLoading(true);
      const multiUserModeEnabled = await System.isMultiUserMode();
      const settings = await System.keys();
      setMultiUserModeEnabled(multiUserModeEnabled);
      setUsePassword(settings?.RequiresAuth);
      setLoading(false);
    }
    fetchIsMultiUserMode();
  }, []);

  if (loading) {
    return (
      <div className="h-1/2 transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] p-[18px] h-full overflow-y-scroll">
        <div className="w-full h-full flex justify-center items-center">
          <PreLoader />
        </div>
      </div>
    );
  }

  if (multiUserModeEnabled) return null;
  return (
    <form
      onSubmit={handleSubmit}
      onChange={() => setHasChanges(true)}
      className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px]"
    >
      <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
        <div className="w-full flex flex-col gap-y-1">
          <div className="items-center flex gap-x-4">
            <p className="text-base font-bold text-white mt-6">
              {t("security.password.title")}
            </p>
          </div>
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
            {t("security.password.description")}
          </p>
        </div>
        {hasChanges && (
          <div className="flex justify-end">
            <CTAButton
              onClick={() => handleSubmit()}
              className="mt-3 mr-0 -mb-20 z-10"
            >
              {saving ? t("common.saving") : t("common.save")}
            </CTAButton>
          </div>
        )}
        <div className="relative w-full max-h-full">
          <div className="relative rounded-lg">
            <div className="flex items-start justify-between px-6 py-4"></div>
            <div className="space-y-6 flex h-full w-full">
              <div className="w-full flex flex-col gap-y-4">
                <Toggle
                  size="lg"
                  className="mb-4"
                  label={t("security.password.title")}
                  enabled={usePassword}
                  onChange={(checked) => setUsePassword(checked)}
                />
                {usePassword && (
                  <div className="w-full flex flex-col gap-y-2 my-5">
                    <div className="mt-4 w-80">
                      <label
                        htmlFor="password"
                        className="text-white text-sm font-semibold block mb-3"
                      >
                        {t("security.password.password-label")}
                      </label>
                      <input
                        name="password"
                        type="text"
                        className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 placeholder:text-theme-settings-input-placeholder"
                        placeholder="Your Instance Password"
                        minLength={8}
                        required={true}
                        autoComplete="off"
                        defaultValue={usePassword ? "********" : ""}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between space-x-14">
              <p className="text-white text-opacity-80 light:text-theme-text text-xs rounded-lg w-96">
                {t("security.password.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
