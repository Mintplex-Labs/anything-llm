import useUser from "@/hooks/useUser";
import paths from "@/utils/paths";
import { ArrowUUpLeft, Wrench } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useMatch } from "react-router-dom";

export default function SettingsButton() {
  const isInSettings = !!useMatch("/settings/*");
  const { user } = useUser();

  if (user && user?.role === "default") return null;

  if (isInSettings)
    return (
      <Link
        to={paths.home()}
        className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
        aria-label="Home"
      >
        <ArrowUUpLeft className="h-5 w-5" weight="fill" />
      </Link>
    );

  return (
    <Link
      to={!!user?.role ? paths.settings.system() : paths.settings.appearance()}
      className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
      aria-label="Settings"
    >
      <Wrench className="h-5 w-5" weight="fill" />
    </Link>
  );
}
