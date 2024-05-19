import useUser from "@/hooks/useUser";
import paths from "@/utils/paths";
import { ArrowUUpLeft, Wrench } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useMatch } from "react-router-dom";
import { ToolTipWrapper } from "../Footer";

export default function SettingsButton() {
  const isInSettings = !!useMatch("/settings/*");
  const { user } = useUser();

  if (user && user?.role === "default") return null;

  if (isInSettings)
    return (
      <ToolTipWrapper id="go-home">
        <Link
          to={paths.home()}
          className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          aria-label="Home"
          data-tooltip-id="go-home"
          data-tooltip-content="Back to workspaces"
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
        aria-label="Settings"
        data-tooltip-id="open-settings"
        data-tooltip-content="Open settings"
      >
        <Wrench className="h-5 w-5" weight="fill" />
      </Link>
    </ToolTipWrapper>
  );
}
