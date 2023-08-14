import React, { useState, useEffect } from "react";
import AnythingLLMLight from "../../media/logo/anything-llm-light.png";
import AnythingLLMDark from "../../media/logo/anything-llm-dark.png";
import System from "../../models/system";
import usePrefersDarkMode from "../../hooks/usePrefersDarkMode";
import useLogo from "../../hooks/useLogo";

export default function Appearance() {
  const { logo: _initLogo } = useLogo();
  const prefersDarkMode = usePrefersDarkMode();
  const [logo, setLogo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function setInitLogo() {
      setLogo(_initLogo || "");
    }
    setInitLogo();
  }, [_initLogo]);

  useEffect(() => {
    if (!!successMsg) {
      setTimeout(() => {
        setSuccessMsg("");
      }, 3_500);
    }

    if (!!errorMsg) {
      setTimeout(() => {
        setErrorMsg("");
      }, 3_500);
    }
  }, [successMsg, errorMsg]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return false;

    const formData = new FormData();
    formData.append("logo", file);
    const { success, error } = await System.uploadLogo(formData);
    if (!success) {
      console.error("Failed to upload logo:", error);
      setErrorMsg(error);
      setSuccessMsg("");
      return;
    }

    const logoURL = await System.fetchLogo();
    setLogo(logoURL);
    setSuccessMsg("Image uploaded successfully");
    setErrorMsg("");
  };

  const handleRemoveLogo = async () => {
    const { success, error } = await System.removeCustomLogo();
    if (!success) {
      console.error("Failed to remove logo:", error);
      setErrorMsg(error);
      setSuccessMsg("");
      return;
    }

    const logoURL = await System.fetchLogo();
    setLogo(logoURL);
    setSuccessMsg("Image successfully removed");
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-100 dark:bg-black-900">
      <div className="p-6 w-full max-w-xl bg-white dark:bg-stone-600 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">
          Customize Appearance
        </h2>
        <p className="text-center text-xs font-light text-black dark:text-white">
          Customize the logo you see on the sidebar
        </p>

        <div className="flex flex-col items-center border border-slate-200 dark:border-black-900 p-6 rounded-xl">
          <img
            src={logo}
            alt="Uploaded Logo"
            className="w-48 h-48 object-contain"
            onError={(e) =>
              (e.target.src = prefersDarkMode
                ? AnythingLLMLight
                : AnythingLLMDark)
            }
          />
          <div className="flex gap-2 p-2 flex-col items-center">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Upload your logo
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Recommended size at least 800x200
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4 gap-2">
          <label className="cursor-pointer text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <button
            onClick={handleRemoveLogo}
            className="cursor-pointer text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            Remove Custom Logo
          </button>
        </div>

        {errorMsg && (
          <div className="text-sm text-red-600 dark:text-red-400 text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="text-sm text-green-600 dark:text-green-400 text-center">
            {successMsg}
          </div>
        )}
      </div>
    </div>
  );
}
