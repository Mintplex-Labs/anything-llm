import React from "react";
import Sidebar, { SidebarMobileHeader } from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import DataConnectorOption from "@/components/DataConnectorOption";

export default function DataConnectors() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      {!isMobile && <Sidebar />}
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[26px] bg-main-gradient w-full h-full overflow-y-scroll border-4 border-accent"
      >
        {isMobile && <SidebarMobileHeader />}
        <div className="flex w-full">
          <div className="flex flex-col w-full px-1 md:px-20 md:py-12 py-16">
            <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
              <div className="items-center flex gap-x-4">
                <p className="text-2xl font-semibold text-white">
                  Data Connectors
                </p>
              </div>
              <p className="text-sm font-base text-white text-opacity-60">
                Verified data connectors allow you to add more content to your
                AnythingLLM workspaces with no custom code or complexity.
                <br />
                Guaranteed to work with your AnythingLLM instance.
              </p>
            </div>
            <div className="py-4 w-full flex md:flex-wrap overflow-x-scroll gap-4 max-w-full">
              <DataConnectorOption slug="github" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
