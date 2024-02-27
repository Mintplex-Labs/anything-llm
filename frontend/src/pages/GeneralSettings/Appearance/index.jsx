import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import FooterCustomization from "./FooterCustomization";
import SupportEmail from "./SupportEmail";
import CustomLogo from "./CustomLogo";
import CustomMessages from "./CustomMessages";

export default function Appearance() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll border-2 border-outline"
      >
        <div className="flex flex-col w-full px-1 md:px-20 md:py-12 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center flex gap-x-4">
              <p className="text-2xl font-semibold text-white">
                Appearance Settings
              </p>
            </div>
            <p className="text-sm font-base text-white text-opacity-60">
              Customize the appearance settings of your platform.
            </p>
          </div>
          <CustomLogo />
          <CustomMessages />
          <FooterCustomization />
          <SupportEmail />
        </div>
      </div>
    </div>
  );
}
