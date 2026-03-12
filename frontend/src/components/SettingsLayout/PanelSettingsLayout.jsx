import { Outlet } from "react-router-dom";

export default function PanelSettingsLayout() {
  return (
    <div className="relative md:rounded-[16px] w-full h-full overflow-hidden p-4 md:p-0 flex">
      <Outlet />
    </div>
  );
}
