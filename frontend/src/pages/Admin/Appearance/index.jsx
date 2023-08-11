import React, { useState, useEffect } from "react";
import Sidebar, { SidebarMobileHeader } from "../../../components/AdminSidebar";
import { isMobile } from "react-device-detect";
import Admin from "../../../models/admin";
import defaultLogo from "../../../../public/assets/ALLM-Default.png";

export default function Appearance() {
  const [logo, setLogo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function initialFetch() {
      try {
        const logoURL = await Admin.fetchLogo();
        setLogo(logoURL);
      } catch (err) {
        console.error("Failed to fetch logo:", err);
      }
    }

    initialFetch();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await Admin.uploadLogo(file);
        const logoURL = await Admin.fetchLogo();
        setLogo(logoURL);
        setErrorMsg("");

        window.location.reload();
      } catch (err) {
        console.error("Failed to upload logo:", err);
        setErrorMsg("Failed to upload logo.");
      }
    }
  };

  const handleRemoveLogo = async () => {
    try {
      await Admin.removeCustomLogo();
      const logoURL = await Admin.fetchLogo();
      setLogo(logoURL);
      setErrorMsg("");

      window.location.reload();
    } catch (err) {
      console.error("Failed to remove logo:", err);
      setErrorMsg("Failed to remove logo.");
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-orange-100 dark:bg-stone-700 flex">
      {!isMobile && <Sidebar />}
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] bg-white dark:bg-black-900 md:min-w-[82%] p-[18px] h-full overflow-y-scroll"
      >
        {isMobile && <SidebarMobileHeader />}
        <div className="px-1 md:px-8">
          <div className="mb-6">
            <p className="text-3xl font-semibold text-slate-600 dark:text-slate-200">
              Appearance Settings
            </p>
            <p className="mt-2 text-sm font-base text-slate-600 dark:text-slate-200">
              Customize the appearance settings of your platform.
            </p>
          </div>

          <div className="flex items-center">
            <img
              src={logo}
              alt="Uploaded Logo"
              className="w-48 h-48 object-contain mr-6"
              onError={(e) => (e.target.src = defaultLogo)}
            />

            <div className="flex flex-col">
              <div className="mb-4">
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
                  className="ml-4 cursor-pointer text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Remove Custom Logo
                </button>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Upload your logo. Recommended size: 800x200.
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
