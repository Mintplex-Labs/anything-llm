import useUser from "@/hooks/useUser";
import paths from "@/utils/paths";
import { Wrench } from "@phosphor-icons/react";

export default function SettingsButton() {
  const { user } = useUser();
  return (
    <a
      href={
        !!user?.role ? paths.settings.system() : paths.settings.appearance()
      }
      className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
    >
      <Wrench className="h-5 w-5" weight="fill" />
    </a>
  );
}
