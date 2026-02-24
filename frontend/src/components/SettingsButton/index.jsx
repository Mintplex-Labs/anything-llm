import useUser from "@/hooks/useUser";
import paths from "@/utils/paths";
import { ArrowUUpLeft, Wrench } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useMatch } from "react-router-dom";

export default function SettingsButton() {
  const isInSettings = !!useMatch("/settings/*");
  const { user } = useUser();

  // Default users can access settings (for workspace-chats and embed-chat-widgets)
  const defaultUserSettingsPath = paths.settings.embedChatWidgets();

  if (isInSettings)
    return (
      <div className="flex w-fit">
        <Link
          to={paths.home()}
          className="transition-all duration-300 p-2 rounded-full bg-theme-sidebar-footer-icon hover:bg-theme-sidebar-footer-icon-hover"
          aria-label="Home"
          data-tooltip-id="footer-item"
          data-tooltip-content="Back to workspaces"
        >
          <ArrowUUpLeft
            className="h-5 w-5 text-white light:text-slate-800"
            weight="fill"
          />
        </Link>
      </div>
    );

  // Default users go to workspace-chats, others go to interface settings
  const settingsPath = user?.role === "default"
    ? defaultUserSettingsPath
    : paths.settings.interface();

  return (
    <div className="flex w-fit">
      <Link
        to={settingsPath}
        className="transition-all duration-300 p-2 rounded-full bg-theme-sidebar-footer-icon hover:bg-theme-sidebar-footer-icon-hover"
        aria-label="Settings"
        data-tooltip-id="footer-item"
        data-tooltip-content="Open settings"
      >
        <Wrench
          className="h-5 w-5 text-white light:text-slate-800"
          weight="fill"
        />
      </Link>
    </div>
  );
}
