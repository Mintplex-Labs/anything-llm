import useLogo from "@/hooks/useLogo";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useEffect, useRef, useState } from "react";
import AnythingLLM from "@/media/logo/anything-llm.png";
import { Plus } from "@phosphor-icons/react";

export default function CustomLogo() {
  const { logo: _initLogo, setLogo: _setLogo } = useLogo();
  const [logo, setLogo] = useState("");
  const [isDefaultLogo, setIsDefaultLogo] = useState(true);
  const fileInputRef = useRef(null);

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

    const logoURL = await System.fetchLogo();
    _setLogo(logoURL);

    showToast("Image successfully removed.", "success");
  };

  const triggerFileInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-6 mb-8">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base leading-6 font-bold text-white">
          Custom Logo
        </h2>
        <p className="text-xs leading-[18px] font-base text-white/60">
          Upload your custom logo to make your chatbot yours.
        </p>
      </div>
      {isDefaultLogo ? (
        <div className="flex md:flex-row flex-col items-center">
          <div className="flex flex-row gap-x-8">
            <label
              className="mt-3 transition-all duration-300 hover:opacity-60"
              hidden={!isDefaultLogo}
            >
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
          </div>
        </div>
      ) : (
        <div className="flex md:flex-row flex-col items-center relative">
          <div className="group w-80 h-[130px] mt-3 overflow-hidden">
            <img
              src={logo}
              alt="Uploaded Logo"
              className="w-full h-full object-cover border-2 border-white/20 border-dashed p-1 rounded-2xl"
            />

            <div className="absolute w-80 top-0 left-0 right-0 bottom-0 flex flex-col gap-y-3 justify-center items-center rounded-2xl mt-3 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out border-2 border-transparent hover:border-white">
              <button
                onClick={triggerFileInputClick}
                className="text-white text-base font-medium hover:text-opacity-60 mx-2"
              >
                Replace
              </button>

              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
              <button
                onClick={handleRemoveLogo}
                className="text-white text-base font-medium hover:text-opacity-60 mx-2"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
