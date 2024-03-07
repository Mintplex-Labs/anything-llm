import React from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import DataConnectorOption from "@/components/DataConnectorOption";

export default function DataConnectors() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex w-full">
          <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[86px] md:py-6 py-16">
            <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
              <div className="items-center">
                <p className="text-lg leading-6 font-bold text-white">
                  Data Connectors
                </p>
              </div>
              <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
                Verified data connectors allow you to add more content to your
                AnythingLLM workspaces with no custom code or complexity.
                <br />
                Guaranteed to work with your AnythingLLM instance.
              </p>
            </div>
            <div className="text-sm font-medium text-white mt-6 mb-4">
              Available Data Connectors
            </div>
            <div className="w-full">
              <div className="py-4 w-full flex md:flex-wrap overflow-x-scroll gap-4 max-w-full">
                <DataConnectorOption slug="github" />
                <DataConnectorOption slug="youtube-transcript" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
