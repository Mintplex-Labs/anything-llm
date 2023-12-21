import UserButton from "../components/UserMenu";

export default function AppLayout({ children }) {
  return (
    <div>
      <div className="frame-header relative h-[40px] bg-sidebar w-full flex flex-col">
        <div className="w-full h-full flex items-center">
          {/* To prevent building on top of stoplights */}
          <div className="flex h-full w-[6%] shrink-0" />
          <div
            id="left-header"
            className="w-[calc(100%-6%*0.10)] h-full flex items-center justify-start ml-4"
          />
          <div
            id="mid-header"
            className="w-[calc(100%-6%*0.25)] h-full flex items-center justify-center"
          />
          <div
            id="right-header"
            className="w-[calc(100%-6%*0.05)] h-full flex items-center justify-end mr-4"
          >
            <UserButton />
          </div>
        </div>
        <div className="w-full absolute bottom-0 h-[1px] bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800" />
      </div>
      <>{children}</>
    </div>
  );
}
