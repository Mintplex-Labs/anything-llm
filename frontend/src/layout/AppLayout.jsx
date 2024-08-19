import UserButton from "../components/UserMenu";
import DownloadIndicator from "./DownloadIndicator";
import VersionStatus from "./VersionStatus";

export default function AppLayout({ children }) {
  return (
    <div>
      <div
        id="titlebar"
        className="relative h-[40px] bg-sidebar w-full flex flex-col"
      >
        <div className="w-full h-full flex items-center bg-sidebar z-[999]">
          {/* To prevent building on top of stoplights */}
          <div className="frame-header flex h-full w-[6%] shrink-0" />
          <div
            id="left-header"
            className="frame-header w-[calc(100%-6%*0.10)] h-full flex items-center justify-start ml-4"
          />
          <div
            id="mid-header"
            className="frame-header w-[calc(100%-6%*0.25)] h-full flex items-center justify-center"
          />
          <div
            id="right-header"
            className="w-[calc(100%-6%*0.05)] h-full flex items-center justify-end mr-4"
          >
            <div className="frame-header flex grow h-full" />
            <DownloadIndicator />
            <VersionStatus />
            <UserButton />
          </div>
        </div>
        <div className="w-full absolute bottom-0 h-[1px] bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800 z-[1000]" />
      </div>
      <>{children}</>
    </div>
  );
}
