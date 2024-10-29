import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import ImportModal from "./ImportModal";
import { useModal } from "@/hooks/useModal";
import CTAButton from "@/components/lib/CTAButton";

export default function CommunityHub() {
  const { t } = useTranslation();
  const { isOpen, openModal, closeModal } = useModal();
  const [hubApiKey, setHubApiKey] = useState("");

  const handleApiKeyChange = (e) => {
    setHubApiKey(e.target.value);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[86px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center">
              <p className="text-lg leading-6 font-bold text-white">
                {t("community-hub.title")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              {t("community-hub.description")}
            </p>
          </div>

          {/* API Key Section */}
          <div className="mt-6">
            <div className="flex flex-col w-full max-w-[400px]">
              <label className="text-white text-sm font-semibold block mb-2">
                AnythingLLM Hub API Key
              </label>
              <input
                type="password"
                value={hubApiKey}
                onChange={handleApiKeyChange}
                className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="Enter your AnythingLLM Hub API key"
              />
              <p className="text-white/60 text-xs mt-2">
                Connect your AnythingLLM Hub account to automatically sync your
                shared items.
              </p>
            </div>
          </div>

          {/* Import Section */}
          <div className="mt-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white text-base font-semibold">
                  Import Items
                </h2>
                <p className="text-white/60 text-xs mt-1">
                  Import prompts, skills, workspaces, and commands shared by the
                  community.
                </p>
              </div>
              <CTAButton onClick={openModal}>
                <Plus className="h-4 w-4" />
                Import Item
              </CTAButton>
            </div>
          </div>

          {/* Hub Interface Section */}
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-t-2 border-opacity-10 pt-6">
            <div className="items-center">
              <p className="text-base font-semibold text-white mb-4">
                Explore AnythingLLM Hub
              </p>
            </div>
            <div className="w-full h-[600px] bg-zinc-900 overflow-hidden rounded-lg">
              <iframe
                src="http://localhost:3000"
                className="w-full h-full"
                title="AnythingLLM Community Hub"
              />
            </div>
          </div>

          <ImportModal isOpen={isOpen} closeModal={closeModal} />
        </div>
      </div>
    </div>
  );
}
