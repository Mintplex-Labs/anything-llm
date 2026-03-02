import HubItems from "./HubItems";

export default function CommunityHub() {
  return (
    <>
      <div className="relative md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-auto p-4 md:p-0">
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
            <div className="items-center">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                Community Hub
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary">
              Share and collaborate with the AnythingLLM community.
            </p>
          </div>
          <HubItems />
        </div>
      </div>
    </>
  );
}
