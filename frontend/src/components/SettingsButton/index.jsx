import useUser from "@/hooks/useUser";
import paths from "@/utils/paths";
import { ArrowUUpLeft, Wrench } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useMatch } from "react-router-dom";
import { ToolTipWrapper } from "../Footer";
import { useTranslation } from "react-i18next"; // Import i18n

export default function SettingsButton() {
  const isInSettings = !!useMatch("/settings/*");
  const { user } = useUser();
  const { t } = useTranslation(); // Initialize i18n translation hook

  if (user && user?.role === "default") return null;

  if (isInSettings)
    return (
      <ToolTipWrapper id="go-home">
        <Link
          to={paths.home()}
          className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          aria-label={t("footer.homeAriaLabel")} // i18n key for aria label
          data-tooltip-id="go-home"
          data-tooltip-content={t("footer.homeTooltip")} // i18n key for tooltip
        >
          <ArrowUUpLeft className="h-5 w-5" weight="fill" />
        </Link>
      </ToolTipWrapper>
    );

  return (
    <ToolTipWrapper id="open-settings">
      <Link
        to={
          !!user?.role ? paths.settings.system() : paths.settings.appearance()
        }
        className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
        aria-label={t("footer.settingsAriaLabel")} // i18n key for aria label
        data-tooltip-id="open-settings"
        data-tooltip-content={t("footer.settingsTooltip")} // i18n key for tooltip
      >
        <Wrench className="h-5 w-5" weight="fill" />
      </Link>
    </ToolTipWrapper>
  );
}
