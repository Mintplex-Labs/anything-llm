import React from "react";
import Sidebar from "@/components/SettingsSidebar";
import DataConnectorOption from "@/components/DataConnectorOption";

export default function DataConnectors() {
  return (
    <div
      style={{ height: "calc(100vh - 40px)" }}
      className="w-screen overflow-hidden bg-sidebar flex"
    >
      <Sidebar />
      <div className="transition-all duration-500 relative ml-[2px] mr-[16px] my-[16px] md:rounded-[26px] bg-main-gradient w-full h-[93vh] overflow-y-scroll border-4 border-accent">
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
            <div className="py-4 w-full flex md:flex-wrap overflow-x-scroll gap-4 max-w-full no-scroll">
              <DataConnectorOption slug="github" />
              <DataConnectorOption slug="youtube-transcript" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
