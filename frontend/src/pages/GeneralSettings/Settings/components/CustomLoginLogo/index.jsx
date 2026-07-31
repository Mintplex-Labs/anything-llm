import System from "@/models/system";
import showToast from "@/utils/toast";
import { useEffect, useRef, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { REFETCH_LOGO_EVENT } from "@/LogoContext";

export default function CustomLoginLogo() {
  const { t } = useTranslation();
  const [logo, setLogo] = useState("");
  const [isDefaultLogo, setIsDefaultLogo] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function logoInit() {
      const _isDefault = await System.isDefaultLoginLogo();
      setIsDefaultLogo(_isDefault);
      if (!_isDefault) {
        const { logoURL } = await System.fetchLoginLogo();
        setLogo(logoURL || "");
      }
    }
    logoInit();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return false;

    const objectURL = URL.createObjectURL(file);
    setLogo(objectURL);

    const formData = new FormData();
    formData.append("logo", file);
    const { success, error } = await System.uploadLoginLogo(formData);
    if (!success) {
      showToast(`Failed to upload login logo: ${error}`, "error");
      setLogo("");
      return;
    }

    const { logoURL } = await System.fetchLoginLogo();
    if (logoURL) setLogo(logoURL);
    window.dispatchEvent(new Event(REFETCH_LOGO_EVENT));
    showToast("Login logo uploaded successfully.", "success");
    setIsDefaultLogo(false);
  };

  const handleRemoveLogo = async () => {
    setLogo("");
    setIsDefaultLogo(true);

    const { success, error } = await System.removeCustomLoginLogo();
    if (!success) {
      console.error("Failed to remove login logo:", error);
      showToast(`Failed to remove login logo: ${error}`, "error");
      const { logoURL } = await System.fetchLoginLogo();
      if (logoURL) setLogo(logoURL);
      setIsDefaultLogo(false);
      return;
    }

    window.dispatchEvent(new Event(REFETCH_LOGO_EVENT));
    showToast("Login logo successfully removed.", "success");
  };

  const triggerFileInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-y-0.5 my-4">
      <p className="text-sm leading-6 font-semibold text-white">
        {t("customization.items.login-logo.title")}
      </p>
      <p className="text-xs text-white/60">
        {t("customization.items.login-logo.description")}
      </p>
      {isDefaultLogo ? (
        <div className="flex md:flex-row flex-col items-center">
          <div className="flex flex-row gap-x-8">
            <label
              className="mt-3 transition-all duration-300 hover:opacity-60"
              hidden={!isDefaultLogo}
            >
              <input
                id="login-logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div
                className="w-80 py-4 bg-theme-settings-input-bg rounded-2xl border-2 border-dashed border-theme-text-secondary border-opacity-60 justify-center items-center inline-flex cursor-pointer"
                htmlFor="login-logo-upload"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-full bg-white/40">
                    <Plus className="w-6 h-6 text-black/80 m-2" />
                  </div>
                  <div className="text-theme-text-primary text-opacity-80 text-sm font-semibold py-1">
                    {t("customization.items.login-logo.add")}
                  </div>
                  <div className="text-theme-text-secondary text-opacity-60 text-xs font-medium py-1">
                    {t("customization.items.login-logo.recommended")}
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      ) : (
        <div className="flex md:flex-row flex-col items-center relative">
          <div className="group w-80 h-[130px] mt-3 overflow-hidden">
            <img
              src={logo}
              alt="Uploaded Login Logo"
              className="w-full h-full object-cover border-2 border-theme-text-secondary border-opacity-60 p-1 rounded-2xl"
            />

            <div className="absolute w-80 top-0 left-0 right-0 bottom-0 flex flex-col gap-y-3 justify-center items-center rounded-2xl mt-3 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out border-2 border-transparent hover:border-white">
              <button
                onClick={triggerFileInputClick}
                className="text-[#FFFFFF] text-base font-medium hover:text-opacity-60 mx-2"
              >
                {t("customization.items.login-logo.replace")}
              </button>

              <input
                id="login-logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
              <button
                onClick={handleRemoveLogo}
                className="text-[#FFFFFF] text-base font-medium hover:text-opacity-60 mx-2"
              >
                {t("customization.items.login-logo.remove")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
