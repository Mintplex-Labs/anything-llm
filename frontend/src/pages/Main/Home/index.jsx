import React from "react";
import QuickLinks from "./QuickLinks";
import ExploreFeatures from "./ExploreFeatures";
import Updates from "./Updates";
import Resources from "./Resources";
import Checklist from "./Checklist";
import Sidebar, { SidebarMobileHeader } from "@/components/Sidebar";
import { isMobile } from "react-device-detect";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      {!isMobile ? <Sidebar /> : <SidebarMobileHeader />}
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-container w-full h-full"
      >
        <div className="w-full h-full flex flex-col items-center overflow-y-auto">
          <div className="w-full max-w-[1200px] flex flex-col gap-y-[50px] p-4 pt-16 md:p-12">
            <Checklist />
            <QuickLinks />
            <ExploreFeatures />
            <Updates />
            <Resources />
          </div>
        </div>
      </div>
    </div>
  );
}
