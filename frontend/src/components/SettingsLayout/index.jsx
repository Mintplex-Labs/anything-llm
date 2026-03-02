import SettingsSidebar from "@/components/SettingsSidebar";
import { Outlet } from "react-router-dom";

export default function SettingsLayout() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <SettingsSidebar />
      <div className="flex-1 h-full min-w-0 overflow-hidden md:py-[16px] md:pr-[16px] md:pl-[2px]">
        <Outlet />
      </div>
    </div>
  );
}
