import { useLanguageOptions } from "@/hooks/useLanguageOptions";
import usePfp from "@/hooks/usePfp";
import System from "@/models/system";
import { AUTH_USER } from "@/utils/constants";
import showToast from "@/utils/toast";
import { Plus, X } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import { useTheme } from "@/hooks/useTheme";

export default function AccountModal({ user, hideModal }) {
  const { pfp, setPfp } = usePfp();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return false;

    const formData = new FormData();
    formData.append("file", file);
    const { success, error } = await System.uploadPfp(formData);
    if (!success) {
      showToast(`Failed to upload profile picture: ${error}`, "error");
      return;
    }

    const pfpUrl = await System.fetchPfp(user.id);
    setPfp(pfpUrl);
    showToast("Profile picture uploaded.", "success");
  };

  const handleRemovePfp = async () => {
    const { success, error } = await System.removePfp();
    if (!success) {
      showToast(`Failed to remove profile picture: ${error}`, "error");
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
        localStorage.setItem(AUTH_USER, JSON.stringify(storedUser));
      }
      showToast("Profile updated.", "success", { clear: true });
      hideModal();
    } else {
      showToast(`Failed to update user: ${error}`, "error");
    }
  };

  return (
    <ModalWrapper isOpen={true}>
      <div className="w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border overflow-hidden">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              Edit Account
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
                        Profile Picture
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
                    Remove Profile Picture
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
                  Username
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
                  Username must be only contain lowercase letters, numbers,
                  underscores, and hyphens with no spaces
                </p>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  New Password
                </label>
                <input
                  name="password"
                  type="text"
                  className="border-none bg-theme-settings-input-bg placeholder:text-theme-settings-input-placeholder border-gray-500 text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder={`${user.username}'s new password`}
                  minLength={8}
                />
                <p className="mt-2 text-xs text-white/60">
                  Password must be at least 8 characters long
                </p>
              </div>
              <div className="flex flex-row gap-x-8">
                <ThemePreference />
                <LanguagePreference />
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-theme-modal-border pt-4 p-6">
              <button
                onClick={hideModal}
                type="button"
                className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
              >
                Update Account
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

  return (
    <div>
      <label
        htmlFor="userLang"
        className="block mb-2 text-sm font-medium text-white"
      >
        Preferred language
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

  return (
    <div>
      <label
        htmlFor="theme"
        className="block mb-2 text-sm font-medium text-white"
      >
        Theme Preference
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
