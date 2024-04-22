import useLogo from "@/hooks/useLogo";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { Plus } from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";
import AnythingLLM from "@/media/logo/anything-llm.png";
import paths from "@/utils/paths";
import { useNavigate } from "react-router-dom";

const TITLE = "Custom Logo";
const DESCRIPTION =
  "Upload your custom logo to make your chatbot yours. Optional.";

export default function CustomLogo({ setHeader, setForwardBtn, setBackBtn }) {
  const navigate = useNavigate();
  function handleForward() {
    navigate(paths.onboarding.userSetup());
  }

  function handleBack() {
    navigate(paths.onboarding.llmPreference());
  }

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  const { logo: _initLogo, setLogo: _setLogo } = useLogo();
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

    const logoURL = await System.fetchLogo();
    _setLogo(logoURL);
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

    const logoURL = await System.fetchLogo();
    _setLogo(logoURL);
  };

  return (
    <div className="flex items-center w-full">
      <div className="flex gap-x-8 flex-col w-full">
        {isDefaultLogo ? (
          <label className="mt-5 hover:opacity-60 w-full flex justify-center transition-all duration-300">
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div
              className="max-w-[600px] w-full h-64 max-h-[600px] py-4 bg-zinc-900/50 rounded-2xl border-2 border-dashed border-white border-opacity-60 justify-center items-center inline-flex cursor-pointer"
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
        ) : (
          <div className="w-full flex justify-center">
            <img
              src={logo}
              alt="Uploaded Logo"
              className="w-48 h-48 object-contain mr-6"
              hidden={isDefaultLogo}
              onError={(e) => (e.target.src = AnythingLLM)}
            />
          </div>
        )}
        {!isDefaultLogo ? (
          <button
            onClick={handleRemoveLogo}
            className="text-white text-base font-medium hover:text-opacity-60 mt-8"
          >
            Remove logo
          </button>
        ) : (
          <button
            onClick={handleForward}
            className="text-white text-base font-medium hover:text-opacity-60 mt-8"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
