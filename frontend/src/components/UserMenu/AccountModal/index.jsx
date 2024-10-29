import { useLanguageOptions } from "@/hooks/useLanguageOptions";
import usePfp from "@/hooks/usePfp";
import System from "@/models/system";
import { AUTH_USER } from "@/utils/constants";
import showToast from "@/utils/toast";
import { Plus, X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

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
      showToast(t("account.uploadError", { error }), "error");
      return;
    }

    const pfpUrl = await System.fetchPfp(user.id);
    setPfp(pfpUrl);
    showToast(t("account.uploadSuccess"), "success");
  };

  const handleRemovePfp = async () => {
    const { success, error } = await System.removePfp();
    if (!success) {
      showToast(t("account.removeError", { error }), "error");
      return;
    }

    setPfp(null);
    showToast(t("account.removeSuccess"), "success");
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
      showToast(t("account.updateSuccess"), "success", { clear: true });
      hideModal();
    } else {
      showToast(t("account.updateError", { error }), "error");
    }
  };

  return (
    <div
      id="account-modal"
      className="bg-black/60 backdrop-blur-sm fixed top-0 left-0 outline-none w-screen h-screen flex items-center justify-center"
    >
      <div className="relative w-[500px] max-w-2xl max-h-full bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
          <h3 className="text-xl font-semibold text-white">
            {t("account.editTitle")}
          </h3>
          <button
            onClick={hideModal}
            type="button"
            className="text-gray-400 bg-transparent hover:border-white/60 rounded-lg p-1.5 ml-auto inline-flex items-center hover:bg-menu-item-selected-gradient hover:border-slate-100 border-transparent"
          >
            <X className="text-lg" />
          </button>
        </div>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <label className="w-48 h-48 flex flex-col items-center justify-center bg-zinc-900/50 transition-all duration-300 rounded-full mt-8 border-2 border-dashed border-white border-opacity-60 cursor-pointer hover:opacity-60">
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
                    alt={t("account.profilePictureAlt")}
                    className="w-48 h-48 rounded-full object-cover bg-white"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-3">
                    <Plus className="w-8 h-8 text-white/80 m-2" />
                    <span className="text-white text-opacity-80 text-sm font-semibold">
                      {t("account.profilePicture")}
                    </span>
                    <span className="text-white text-opacity-60 text-xs">
                      800 x 800
                    </span>
                  </div>
                )}
              </label>
              {pfp && (
                <button
                  type="button"
                  onClick={handleRemovePfp}
                  className="mt-3 text-white text-opacity-60 text-sm font-medium hover:underline"
                >
                  {t("account.removeProfilePicture")}
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-y-4 px-6">
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-white"
              >
                {t("account.username")}
              </label>
              <input
                name="username"
                type="text"
                className="bg-zinc-900 placeholder:text-white/20 border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={t("account.usernamePlaceholder")}
                minLength={2}
                defaultValue={user.username}
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-white"
              >
                {t("account.newPassword")}
              </label>
              <input
                name="password"
                type="password"
                className="bg-zinc-900 placeholder:text-white/20 border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={t("account.passwordPlaceholder", {
                  username: user.username,
                })}
              />
            </div>
            <LanguagePreference />
          </div>
          <div className="flex justify-between items-center border-t border-gray-500/50 pt-4 p-6">
            <button
              onClick={hideModal}
              type="button"
              className="px-4 py-2 rounded-lg text-white bg-transparent hover:bg-stone-900"
            >
              {t("account.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-white bg-transparent border border-slate-200 hover:bg-slate-200 hover:text-slate-800"
            >
              {t("account.updateAccount")}
            </button>
          </div>
        </form>
      </div>
    </div>
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
        {t("account.preferredLanguage")}
      </label>
      <select
        name="userLang"
        className="bg-zinc-900 w-fit mt-2 px-4 border-gray-500 text-white text-sm rounded-lg block py-2"
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
