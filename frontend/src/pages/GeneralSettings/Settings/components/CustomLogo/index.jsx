import useLogo from "@/hooks/useLogo";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useEffect, useRef, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export default function CustomLogo() {
  const { t } = useTranslation();
  const { logo: _initLogo, setLogo: _setLogo } = useLogo();
  const [darkLogo, setDarkLogo] = useState("");
  const [lightLogo, setLightLogo] = useState("");
  const [isDefaultDarkLogo, setIsDefaultDarkLogo] = useState(true);
  const [isDefaultLightLogo, setIsDefaultLightLogo] = useState(true);
  const darkFileInputRef = useRef(null);
  const lightFileInputRef = useRef(null);

  useEffect(() => {
    async function logoInit() {
      // Initialize with current logos for both themes
      const { logoURL: darkLogoURL } = await System.fetchLogo("default");
      const { logoURL: lightLogoURL } = await System.fetchLogo("light");

      setDarkLogo(darkLogoURL || "");
      setLightLogo(lightLogoURL || "");

      const _isDefaultDarkLogo = await System.isDefaultLogo("default");
      const _isDefaultLightLogo = await System.isDefaultLogo("light");

      setIsDefaultDarkLogo(_isDefaultDarkLogo);
      setIsDefaultLightLogo(_isDefaultLightLogo);
    }
    logoInit();
  }, []);

  const handleFileUpload = async (event, theme) => {
    const file = event.target.files[0];
    if (!file) return false;

    const objectURL = URL.createObjectURL(file);
    const backendTheme = theme; // "dark" or "light"

    if (theme === "dark") {
      setDarkLogo(objectURL);
    } else {
      setLightLogo(objectURL);
    }

    const formData = new FormData();
    formData.append("logo", file);
    const { success, error } = await System.uploadLogo(formData, backendTheme);
    if (!success) {
      showToast(`Failed to upload logo: ${error}`, "error");
      // Revert on error
      if (theme === "dark") {
        const { logoURL } = await System.fetchLogo("default");
        setDarkLogo(logoURL || "");
      } else {
        const { logoURL } = await System.fetchLogo("light");
        setLightLogo(logoURL || "");
      }
      return;
    }

    const { logoURL } = await System.fetchLogo(theme === "dark" ? "default" : "light");
    if (theme === "dark") {
      setDarkLogo(logoURL);
      setIsDefaultDarkLogo(false);
    } else {
      setLightLogo(logoURL);
      setIsDefaultLightLogo(false);
    }

    // Update the global logo context if needed
    const { logoURL: currentLogo } = await System.fetchLogo();
    _setLogo(currentLogo);

    showToast("Image uploaded successfully.", "success");
  };

  const handleRemoveLogo = async (theme) => {
    const backendTheme = theme; // "dark" or "light"

    if (theme === "dark") {
      setDarkLogo("");
      setIsDefaultDarkLogo(true);
    } else {
      setLightLogo("");
      setIsDefaultLightLogo(true);
    }

    const { success, error } = await System.removeCustomLogo(backendTheme);
    if (!success) {
      console.error("Failed to remove logo:", error);
      showToast(`Failed to remove logo: ${error}`, "error");
      // Revert on error
      if (theme === "dark") {
        const { logoURL } = await System.fetchLogo("default");
        setDarkLogo(logoURL || "");
        setIsDefaultDarkLogo(false);
      } else {
        const { logoURL } = await System.fetchLogo("light");
        setLightLogo(logoURL || "");
        setIsDefaultLightLogo(false);
      }
      return;
    }

    // Update the global logo context
    const { logoURL: currentLogo } = await System.fetchLogo();
    _setLogo(currentLogo);

    showToast("Image successfully removed.", "success");
  };

  const triggerFileInputClick = (theme) => {
    if (theme === "dark") {
      darkFileInputRef.current?.click();
    } else {
      lightFileInputRef.current?.click();
    }
  };

  const renderLogoSection = (theme, logo, isDefault, fileInputRef) => (
    <div className="flex flex-col gap-y-2">
      <p className="text-xs font-medium text-white/80">
        {theme === "dark" ? "Dark Mode Logo" : "Light Mode Logo"}
      </p>
      {isDefault ? (
        <div className="flex items-center">
          <label className="transition-all duration-300 hover:opacity-60">
            <input
              id={`${theme}-logo-upload`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, theme)}
            />
            <div
              className="w-64 py-3 bg-theme-settings-input-bg rounded-xl border-2 border-dashed border-theme-text-secondary border-opacity-60 justify-center items-center inline-flex cursor-pointer"
              htmlFor={`${theme}-logo-upload`}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="rounded-full bg-white/40">
                  <Plus className="w-5 h-5 text-black/80 m-1.5" />
                </div>
                <div className="text-theme-text-primary text-opacity-80 text-sm font-semibold py-1">
                  {t("customization.items.logo.add")}
                </div>
              </div>
            </div>
          </label>
        </div>
      ) : (
        <div className="flex items-center relative">
          <div className="group w-64 h-[100px] overflow-hidden">
            <img
              src={logo}
              alt={`${theme} Logo`}
              className="w-full h-full object-cover border-2 border-theme-text-secondary border-opacity-60 p-1 rounded-xl"
            />

            <div className="absolute w-64 top-0 left-0 right-0 bottom-0 flex flex-col gap-y-2 justify-center items-center rounded-xl bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out border-2 border-transparent hover:border-white">
              <button
                onClick={() => triggerFileInputClick(theme)}
                className="text-[#FFFFFF] text-sm font-medium hover:text-opacity-60"
              >
                {t("customization.items.logo.replace")}
              </button>

              <input
                id={`${theme}-logo-upload`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, theme)}
                ref={fileInputRef}
              />
              <button
                onClick={() => handleRemoveLogo(theme)}
                className="text-[#FFFFFF] text-sm font-medium hover:text-opacity-60"
              >
                {t("customization.items.logo.remove")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-y-0.5 my-4">
      <p className="text-sm leading-6 font-semibold text-white">
        {t("customization.items.logo.title")}
      </p>
      <p className="text-xs text-white/60 mb-4">
        {t("customization.items.logo.description")}
      </p>
      <div className="flex flex-row gap-x-8">
        {renderLogoSection("dark", darkLogo, isDefaultDarkLogo, darkFileInputRef)}
        {renderLogoSection("light", lightLogo, isDefaultLightLogo, lightFileInputRef)}
      </div>
    </div>
  );
}
