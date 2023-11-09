import React, { memo, useEffect, useState } from "react";
import System from "../../../../../models/system";
import AnythingLLM from "../../../../../media/logo/anything-llm.png";
import useLogo from "../../../../../hooks/useLogo";
import { Plus } from "@phosphor-icons/react";
import showToast from "../../../../../utils/toast";

function AppearanceSetup({ prevStep, nextStep }) {
  const { logo: _initLogo } = useLogo();
  const [logo, setLogo] = useState("");
  const [isDefaultLogo, setIsDefaultLogo] = useState(true);

  useEffect(() => {
    async function logoInit() {
      setLogo(_initLogo || "");
      const _isDefaultLogo = await System.isDefaultLogo();
      setIsDefaultLogo(_isDefaultLogo);
    }
    logoInit();
  }, [_initLogo]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return false;

    const objectURL = URL.createObjectURL(file);
    setLogo(objectURL);

    const formData = new FormData();
    formData.append("logo", file);
    const { success, error } = await System.uploadLogo(formData);
    if (!success) {
      showToast(`Failed to upload logo: ${error}`, "error");
      setLogo(_initLogo);
      return;
    }

    showToast("Image uploaded successfully.", "success");
    setIsDefaultLogo(false);
  };

  const handleRemoveLogo = async () => {
    setLogo("");
    setIsDefaultLogo(true);

    const { success, error } = await System.removeCustomLogo();
    if (!success) {
      console.error("Failed to remove logo:", error);
      showToast(`Failed to remove logo: ${error}`, "error");
      const logoURL = await System.fetchLogo();
      setLogo(logoURL);
      setIsDefaultLogo(false);
      return;
    }

    showToast("Image successfully removed.", "success");
  };

  return (
    <div className="w-full">
      <div className="flex flex-col w-full px-10 py-12">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-white text-sm font-medium">Custom Logo</h2>
          <p className="text-sm font-base text-white/60">
            Upload your custom logo to make your chatbot yours.
          </p>
        </div>
        <div className="flex md:flex-row flex-col items-center">
          <img
            src={logo}
            alt="Uploaded Logo"
            className="w-48 h-48 object-contain mr-6"
            hidden={isDefaultLogo}
            onError={(e) => (e.target.src = AnythingLLM)}
          />
          <div className="flex flex-row gap-x-8">
            <label className="mt-5 hover:opacity-60" hidden={!isDefaultLogo}>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div
                className="w-80 py-4 bg-zinc-900/50 rounded-2xl border-2 border-dashed border-white border-opacity-60 justify-center items-center inline-flex cursor-pointer"
                htmlFor="logo-upload"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-full bg-white/40">
                    <Plus className="w-6 h-6 text-black/80 m-2" />
                  </div>
                  <div className="text-white text-opacity-80 text-sm font-semibold py-1">
                    Add a custom logo
                  </div>
                  <div className="text-white text-opacity-60 text-xs font-medium py-1">
                    Recommended size: 800 x 200
                  </div>
                </div>
              </div>
            </label>
            <button
              onClick={handleRemoveLogo}
              className="text-white text-base font-medium hover:text-opacity-60"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between items-center p-6 space-x-6 border-t rounded-b border-gray-500/50">
        <button
          onClick={prevStep}
          type="button"
          className="px-4 py-2 rounded-lg text-white hover:bg-sidebar"
        >
          Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => nextStep("user_mode_setup")}
            type="button"
            className="px-4 py-2 rounded-lg text-white hover:bg-sidebar"
          >
            Skip
          </button>
          <button
            onClick={() => nextStep("user_mode_setup")}
            type="button"
            className="border border-slate-200 px-4 py-2 rounded-lg text-slate-800 bg-slate-200 text-sm items-center flex gap-x-2 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
export default memo(AppearanceSetup);
