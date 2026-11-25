import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { useSearchParams } from "react-router-dom";
import {
  AppWindow,
  IdentificationCard,
  Palette,
  SidebarSimple,
} from "@phosphor-icons/react";
import FooterCustomization from "../components/FooterCustomization";
import SupportEmail from "../components/SupportEmail";
import CustomLogo from "../components/CustomLogo";
import { useTranslation } from "react-i18next";
import CustomAppName from "../components/CustomAppName";
import CustomSiteSettings from "../components/CustomSiteSettings";
import InstancePalettes from "@/palettes/InstancePalettes";

const TABS = {
  identity: {
    icon: IdentificationCard,
    Component: () => (
      <>
        <CustomAppName />
        <CustomLogo />
      </>
    ),
  },
  colors: { icon: Palette, Component: InstancePalettes },
  sidebar: {
    icon: SidebarSimple,
    Component: () => (
      <>
        <FooterCustomization />
        <SupportEmail />
      </>
    ),
  },
  browser: { icon: AppWindow, Component: CustomSiteSettings },
};

export default function BrandingSettings() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = TABS[searchParams.get("tab")]
    ? searchParams.get("tab")
    : "identity";
  const { Component } = TABS[activeTab];

  return (
    <div className="w-screen h-screen overflow-hidden bg-zinc-950 light:bg-slate-50 flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-zinc-900 light:bg-white w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[86px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6">
            <div className="items-center">
              <p className="text-lg leading-6 font-bold text-white">
                {t("customization.branding.title")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              {t("customization.branding.description")}
            </p>
          </div>
          <div
            role="tablist"
            className="flex gap-x-8 border-b-2 border-white/10 light:border-theme-sidebar-border overflow-x-auto overflow-y-hidden no-scroll"
          >
            {Object.entries(TABS).map(([key, { icon: Icon }]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeTab === key}
                onClick={() => setSearchParams({ tab: key }, { replace: true })}
                className={`flex gap-x-2 items-center pb-3 -mb-[2px] border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === key
                    ? "text-sky-400 border-sky-400 light:text-sky-600 light:border-sky-600"
                    : "text-white/60 border-transparent hover:text-sky-400 light:hover:text-sky-600"
                }`}
              >
                <Icon className="h-5 w-5" />
                {t(`customization.branding.tabs.${key}`)}
              </button>
            ))}
          </div>
          <div role="tabpanel" className="pt-2">
            <Component />
          </div>
        </div>
      </div>
    </div>
  );
}
