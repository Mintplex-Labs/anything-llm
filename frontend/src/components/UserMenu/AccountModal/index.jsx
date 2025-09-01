import { useLanguageOptions } from "@/hooks/useLanguageOptions";
import usePfp from "@/hooks/usePfp";
import System from "@/models/system";
import Appearance from "@/models/appearance";
import { AUTH_USER } from "@/utils/constants";
import showToast from "@/utils/toast";
import { Info, Plus, X } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";

export default function AccountModal({ user, hideModal }) {
  const { pfp, setPfp } = usePfp();
  const { t } = useTranslation();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return false;

    const formData = new FormData();
    formData.append("file", file);
    const { success, error } = await System.uploadPfp(formData);
    if (!success) {
      showToast(t("profile_settings.failed_upload", { error }), "error");
      return;
    }

    const pfpUrl = await System.fetchPfp(user.id);
    setPfp(pfpUrl);
    showToast(t("profile_settings.upload_success"), "success");
  };

  const handleRemovePfp = async () => {
    const { success, error } = await System.removePfp();
    if (!success) {
      showToast(t("profile_settings.failed_remove", { error }), "error");
      return;
    }

    setPfp(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) {
      if (!value || value === null) continue;
      data[key] = value;
    }

    const { success, error } = await System.updateUser(data);
    if (success) {
      let storedUser = JSON.parse(localStorage.getItem(AUTH_USER));
      if (storedUser) {
        storedUser.username = data.username;
        storedUser.bio = data.bio;
        localStorage.setItem(AUTH_USER, JSON.stringify(storedUser));
      }
      showToast(t("profile_settings.profile_updated"), "success", {
        clear: true,
      });
      hideModal();
    } else {
      showToast(t("profile_settings.failed_update_user", { error }), "error");
    }
  };
  return (
    <ModalWrapper isOpen={true}>
      <div className="w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border overflow-hidden">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              {t("profile_settings.edit_account")}
            </h3>
          </div>
          <button
            onClick={hideModal}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        <div
          className="h-full w-full overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex flex-col items-center">
                <label className="group w-48 h-48 flex flex-col items-center justify-center bg-theme-bg-primary hover:bg-theme-bg-secondary transition-colors duration-300 rounded-full mt-8 border-2 border-dashed border-white light:border-[#686C6F] light:bg-[#E0F2FE] light:hover:bg-transparent cursor-pointer hover:opacity-60">
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  {pfp ? (
                    <img
                      src={pfp}
                      alt="User profile picture"
                      className="w-48 h-48 rounded-full object-cover bg-white"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3">
                      <Plus className="w-8 h-8 text-theme-text-secondary m-2" />
                      <span className="text-theme-text-secondary text-opacity-80 text-sm font-semibold">
                        {t("profile_settings.profile_picture")}
                      </span>
                      <span className="text-theme-text-secondary text-opacity-60 text-xs">
                        800 x 800
                      </span>
                    </div>
                  )}
                </label>
                {pfp && (
                  <button
                    type="button"
                    onClick={handleRemovePfp}
                    className="mt-3 text-theme-text-secondary text-opacity-60 text-sm font-medium hover:underline"
                  >
                    {t("profile_settings.remove_profile_picture")}
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-y-4 px-6">
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-theme-text-primary"
                >
                  {t("profile_settings.username")}
                </label>
                <input
                  name="username"
                  type="text"
                  className="border-none bg-theme-settings-input-bg placeholder:text-theme-settings-input-placeholder border-gray-500 text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="User's username"
                  minLength={2}
                  defaultValue={user.username}
                  required
                  autoComplete="off"
                />
                <p className="mt-2 text-xs text-white/60">
                  {t("profile_settings.username_description")}
                </p>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  {t("profile_settings.new_password")}
                </label>
                <input
                  name="password"
                  type="text"
                  className="border-none bg-theme-settings-input-bg placeholder:text-theme-settings-input-placeholder border-gray-500 text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder={`${user.username}'s new password`}
                  minLength={8}
                />
                <p className="mt-2 text-xs text-white/60">
                  {t("profile_settings.password_description")}
                </p>
              </div>
              <div>
                <label
                  htmlFor="bio"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Bio
                </label>
                <textarea
                  name="bio"
                  className="border-none bg-theme-settings-input-bg placeholder:text-theme-settings-input-placeholder border-gray-500 text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 min-h-[100px] resize-y"
                  placeholder="Tell us about yourself..."
                  defaultValue={user.bio}
                />
              </div>
              <div className="flex gap-x-16">
                <div className="flex flex-col gap-y-6">
                  <ThemePreference />
                  <LanguagePreference />
                </div>
                <div className="flex flex-col gap-y-6">
                  <AutoSubmitPreference />
                  <AutoSpeakPreference />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-theme-modal-border pt-4 p-6">
              <button
                onClick={hideModal}
                type="button"
                className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
              >
                {t("profile_settings.cancel")}
              </button>
              <button
                type="submit"
                className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
              >
                {t("profile_settings.update_account")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>
  );
}

function LanguagePreference() {
  const {
    currentLanguage,
    supportedLanguages,
    getLanguageName,
    changeLanguage,
  } = useLanguageOptions();
  const { t } = useTranslation();
  return (
    <div>
      <label
        htmlFor="userLang"
        className="block mb-2 text-sm font-medium text-white"
      >
        {t("profile_settings.language")}
      </label>
      <select
        name="userLang"
        className="border-none bg-theme-settings-input-bg w-fit mt-2 px-4 focus:outline-primary-button active:outline-primary-button outline-none text-white text-sm rounded-lg block py-2"
        defaultValue={currentLanguage || "en"}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        {supportedLanguages.map((lang) => {
          return (
            <option key={lang} value={lang}>
              {getLanguageName(lang)}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function ThemePreference() {
  const { theme, setTheme, availableThemes } = useTheme();
  const { t } = useTranslation();
  return (
    <div>
      <label
        htmlFor="theme"
        className="block mb-2 text-sm font-medium text-white"
      >
        {t("profile_settings.theme")}
      </label>
      <select
        name="theme"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="border-none bg-theme-settings-input-bg w-fit px-4 focus:outline-primary-button active:outline-primary-button outline-none text-white text-sm rounded-lg block py-2"
      >
        {Object.entries(availableThemes).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
}

function AutoSubmitPreference() {
  const [autoSubmitSttInput, setAutoSubmitSttInput] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const settings = Appearance.getSettings();
    setAutoSubmitSttInput(settings.autoSubmitSttInput ?? true);
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setAutoSubmitSttInput(newValue);
    Appearance.updateSettings({ autoSubmitSttInput: newValue });
  };

  return (
    <div>
      <div className="flex items-center gap-x-1 mb-2">
        <label
          htmlFor="autoSubmit"
          className="block text-sm font-medium text-white"
        >
          {t("customization.chat.auto_submit.title")}
        </label>
        <div
          data-tooltip-id="auto-submit-info"
          data-tooltip-content={t("customization.chat.auto_submit.description")}
          className="cursor-pointer h-fit"
        >
          <Info size={16} weight="bold" className="text-white" />
        </div>
      </div>
      <div className="flex items-center gap-x-4">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            id="autoSubmit"
            type="checkbox"
            name="autoSubmit"
            checked={autoSubmitSttInput}
            onChange={handleChange}
            className="peer sr-only"
          />
          <div className="pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
        </label>
      </div>
      <Tooltip
        id="auto-submit-info"
        place="bottom"
        delayShow={300}
        className="allm-tooltip !allm-text-xs"
      />
    </div>
  );
}

function AutoSpeakPreference() {
  const [autoPlayAssistantTtsResponse, setAutoPlayAssistantTtsResponse] =
    useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const settings = Appearance.getSettings();
    setAutoPlayAssistantTtsResponse(
      settings.autoPlayAssistantTtsResponse ?? false
    );
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setAutoPlayAssistantTtsResponse(newValue);
    Appearance.updateSettings({ autoPlayAssistantTtsResponse: newValue });
  };

  return (
    <div>
      <div className="flex items-center gap-x-1 mb-2">
        <label
          htmlFor="autoSpeak"
          className="block text-sm font-medium text-white"
        >
          {t("customization.chat.auto_speak.title")}
        </label>
        <div
          data-tooltip-id="auto-speak-info"
          data-tooltip-content={t("customization.chat.auto_speak.description")}
          className="cursor-pointer h-fit"
        >
          <Info size={16} weight="bold" className="text-white" />
        </div>
      </div>
      <div className="flex items-center gap-x-4">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            id="autoSpeak"
            type="checkbox"
            name="autoSpeak"
            checked={autoPlayAssistantTtsResponse}
            onChange={handleChange}
            className="peer sr-only"
          />
          <div className="pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
        </label>
      </div>
      <Tooltip
        id="auto-speak-info"
        place="bottom"
        delayShow={300}
        className="allm-tooltip !allm-text-xs"
      />
    </div>
  );
}
