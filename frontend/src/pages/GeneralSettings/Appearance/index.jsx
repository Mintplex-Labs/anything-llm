import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import FooterCustomization from "./FooterCustomization";
import SupportEmail from "./SupportEmail";
import CustomLogo from "./CustomLogo";
import CustomMessages from "./CustomMessages";
import { useTranslation } from "react-i18next";
import CustomAppName from "./CustomAppName";
import LanguagePreference from "./LanguagePreference";
import CustomSiteSettings from "./CustomSiteSettings";
import ShowScrollbar from "./ShowScrollbar";
import ThemePreference from "./ThemePreference";

export default function Appearance() {
  const { t } = useTranslation();

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[86px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
            <div className="items-center">
              <p className="text-lg leading-6 font-bold text-white">
                {t("appearance.title")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              {t("appearance.description")}
            </p>
          </div>
          <ThemePreference />
          <LanguagePreference />
          <ShowScrollbar />
          <CustomLogo />
          <CustomAppName />
          <CustomMessages />
          <FooterCustomization />
          <SupportEmail />
          <CustomSiteSettings />
        </div>
      </div>
    </div>
  );
}
