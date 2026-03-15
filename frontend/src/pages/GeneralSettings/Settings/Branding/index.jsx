import FooterCustomization from "../components/FooterCustomization";
import SupportEmail from "../components/SupportEmail";
import CustomLogo from "../components/CustomLogo";
import { useTranslation } from "react-i18next";
import CustomAppName from "../components/CustomAppName";
import CustomSiteSettings from "../components/CustomSiteSettings";

export default function BrandingSettings() {
  const { t } = useTranslation();

  return (
    <>
      <div className="relative md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-auto p-4 md:p-0">
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
            <div className="items-center">
              <p className="text-lg leading-6 font-bold text-white">
                {t("customization.branding.title")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              {t("customization.branding.description")}
            </p>
          </div>
          <CustomAppName />
          <CustomLogo />
          <FooterCustomization />
          <SupportEmail />
          <CustomSiteSettings />
        </div>
      </div>
    </>
  );
}
